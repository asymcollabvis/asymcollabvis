import { useFrame } from "@react-three/fiber";
import { useController } from "@react-three/xr";
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";
import { lookRotation } from "../common/helper";
import GraphWithEdge from "./GraphWithEdge";
import { XRInteraction } from "./interactions/Grab";

export default forwardRef<unknown, { position?: number[], scale?: number[], movable?: boolean }>(
  ({ position = [0, 0, 0], scale = [1, 1, 1], movable = true }, ref) => {
    console.log("rendering interactive graph");

    const groupRef = useRef<THREE.Group>(null!);
    useImperativeHandle(ref, () => groupRef.current);
    // const roomUserList = selector(selectUserList);

    let rightHandSelected = useRef(false);
    let leftHandSelected = useRef(false);

    let initialScale: THREE.Vector3 | null = null;
    let initialDistance: number | null = null;
    let previousQuaternion: THREE.Quaternion | null = null;

    const leftController = useController("left");
    const rightController = useController("right");
    const grabbingController = useRef<THREE.Object3D>();
    const previousTransform = useMemo(() => new THREE.Matrix4(), []);

    // useHelper(groupRef, BoxHelper, "green");

    useFrame(() => {
      // handle zooming
      if (rightHandSelected.current && leftHandSelected.current) {
        let leftPos = leftController?.controller.position;
        let rightPos = rightController?.controller.position;

        // rotate the graph
        if (!previousQuaternion) {
          previousQuaternion = lookRotation(
            leftPos!.clone().sub(rightPos!).normalize(),
            new THREE.Vector3(0, 1, 0)
          ).invert();
        }

        let newQuaternion = lookRotation(
          leftPos!.clone().sub(rightPos!).normalize(),
          new THREE.Vector3(0, 1, 0)
        );

        // console.log(new THREE.Quaternion().multiplyQuaternions(newQuaternion.clone().invert(), newQuaternion.clone()));
        // console.log(previousQuaternion.clone().multiply(newQuaternion));

        groupRef.current?.quaternion.multiply(
          previousQuaternion.multiply(newQuaternion)
        );
        // console.log(newQuaternion.clone().multiply(previousQuaternion));

        previousQuaternion.copy(newQuaternion).invert();

        // scale the graph
        if (!initialScale && !initialDistance) {
          initialScale = groupRef.current.scale.clone();
          initialDistance = leftPos!.distanceTo(rightPos!);
        }

        let distance = leftPos!.distanceTo(rightPos!);
        let ratio = distance / initialDistance!;
        groupRef.current.scale.set(
          initialScale!.x * ratio,
          initialScale!.y * ratio,
          initialScale!.z * ratio
        );
        // console.log(distance / initialDistance!, distance, initialDistance);
      } else {
        initialScale = null;
        initialDistance = null;
        previousQuaternion = null;
      }

      // handle raygrab, referring to https://github.com/pmndrs/react-xr/blob/b384e2cfbeee62393fa09505c14e7474c7de5dc8/src/Interactions.tsx
      const controller = grabbingController.current;
      const group = groupRef.current;
      if (!controller) return;
      // console.log("grabbing");

      if (movable) {
        group.applyMatrix4(previousTransform);
        group.applyMatrix4(controller.matrixWorld);
        group.updateMatrixWorld();
      }

      previousTransform.copy(controller.matrixWorld).invert();
    });

    return (
      <XRInteraction
        position={position}
        scale={scale}
        ref={groupRef}
        onGrabStart={(e) => {
          // console.log("select start", e);

          if (e.inputSource.handedness === "right") {
            rightHandSelected.current = true;
          } else if (e.inputSource.handedness === "left") {
            leftHandSelected.current = true;
          }

          if (rightHandSelected.current && leftHandSelected.current) {
            grabbingController.current = undefined;
          } else {
            grabbingController.current = e.controller;
            previousTransform.copy(e.controller.matrixWorld).invert();
          }
        }}
        onGrabEnd={(e) => {
          if (e.inputSource.handedness === "right") {
            rightHandSelected.current = false;
          } else if (e.inputSource.handedness === "left") {
            leftHandSelected.current = false;
          }
          if (e.controller === grabbingController.current) {
            grabbingController.current = undefined;
          }
        }}
      >
        <GraphWithEdge />
      </XRInteraction>
    );
  }
);
