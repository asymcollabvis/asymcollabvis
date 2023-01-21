import { Plane, useHelper, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Interactive, RayGrab } from "@react-three/xr";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { BoxHelper } from "three";
import { XRInteraction } from "../interactions/Grab";

export default forwardRef<
  unknown,
  {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
    children?;
    width?: number;
    height?: number;
    offset?: number;
    showTopBar?: boolean;
    draggable?: boolean;
    title?: string;
  }
>(
  (
    {
      position = [0, 0, 0],
      rotation = [0, 0, 0],
      scale = [1, 1, 1],
      children,
      width = 0.1,
      height = 0.1,
      offset = 0.01,
      showTopBar = true,
      draggable = true,
      title = "",
    },
    ref
  ) => {
    console.log("Panel");

    let skipped = 0;

    let topBarOffset = 0.02;
    if (!showTopBar) {
      topBarOffset = 0;
    }

    let layerOffset = 0.002;

    const mesh = useRef<THREE.Group>(null!);
    useImperativeHandle(ref, () => mesh.current);
    // useHelper(mesh, BoxHelper, "cyan");

    const grabbingController = React.useRef<THREE.Object3D>();
    const previousTransform = React.useMemo(() => new THREE.Matrix4(), []);

    // Customized RayGrab to support grabbing of the panel: referring to https://github.com/pmndrs/react-xr/blob/master/src/Interactions.tsx
    useFrame(() => {
      const controller = grabbingController.current;
      const group = mesh.current;
      if (!controller) return;
      // console.log("grabbing");

      group.applyMatrix4(previousTransform);
      group.applyMatrix4(controller.matrixWorld);
      // console.log(controller.matrixWorld);

      group.updateMatrixWorld();
      // console.log(group.position);

      previousTransform.copy(controller.matrixWorld).invert();
    });

    function renderTopBar() {
      const topBar = (
        <>
          <Plane
            position={[width / 2, -topBarOffset / 2, layerOffset]}
            scale={[width, topBarOffset, 1]}
          >
            <meshBasicMaterial color="silver" side={THREE.DoubleSide} />
          </Plane>
          <Text
            color="black"
            anchorX="left"
            anchorY="top"
            fontSize={0.015}
            position={[0.008, 0, layerOffset + 0.001]}
          >
            {title}
          </Text>
        </>
      );

      const interactiveTopBar = (
        <Interactive
          onSelectStart={(e) => {
            grabbingController.current = e.target.controller;
            previousTransform.copy(e.target.controller.matrixWorld).invert();
          }}
          onSelectEnd={(e) => {
            if (e.target.controller === grabbingController.current) {
              grabbingController.current = undefined;
            }
          }}
        >
          {topBar}
        </Interactive>
      );

      return draggable ? interactiveTopBar : topBar;
    }

    return (
      <XRInteraction
        position={position}
        rotation={rotation}
        scale={scale}
        ref={mesh}
        onGrabStart={(e) => {
          if (!draggable) return;
          // console.log("grab start");

          grabbingController.current = e.controller;
          previousTransform.copy(e.controller.matrixWorld).invert();
        }}
        onGrabEnd={(e) => {
          // console.log("grab end");

          if (e.controller === grabbingController.current) {
            grabbingController.current = undefined;
          }
        }}
      >
        <Plane
          position={[width / 2, -(height + topBarOffset) / 2, 0]}
          scale={[width, height + topBarOffset, 0]}
        >
          <meshBasicMaterial color="white" side={THREE.DoubleSide} />
        </Plane>
        {showTopBar && renderTopBar()}
        {children &&
          React.Children.map(children, (child, i) => {
            if (!child) {
              return null;
            }

            let position = [
              0,
              -(i - skipped) * offset - topBarOffset - 0.001,
              layerOffset / 2,
            ];
            if (child.props.position) {
              skipped += 1;
              position = child.props.position;
            }

            return React.cloneElement(child, {
              key: i,
              position: position,
            });
          })}
      </XRInteraction>
    );
  }
);
