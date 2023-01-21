import { useFrame } from "@react-three/fiber";
import { useController } from "@react-three/xr";
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";
import { lookRotation } from "../common/helper";
import { InitialRequest } from "../common/message_pb";
import Graph from "./embodied/EmbodiedGraph";
import { XRInteraction } from "./interactions/Grab";

export default forwardRef<
  unknown,
  { position?: number[]; scale?: number[]; movable?: boolean; fixed?: boolean }
>(
  (
    { position = [0, 0, 0], scale = [1, 1, 1], movable = true, fixed = false },
    ref
  ) => {
    console.log("rendering interactive graph");

    const groupRef = useRef<THREE.Group>(null!);
    useImperativeHandle(ref, () => groupRef.current);
    // const roomUserList = selector(selectUserList);

    let rightHandSelected = useRef(false);
    let leftHandSelected = useRef(false);

    let initialScale: THREE.Vector3 | null = null;
    let initialDistance: number | null = null;
    let previousQuaternion: THREE.Quaternion | null = null;
    let initialPosition: THREE.Vector3 | null = null;

    const leftController = useController("left");
    const rightController = useController("right");
    const grabbingController = useRef<THREE.Object3D>();
    const previousTransform = useMemo(() => new THREE.Matrix4(), []);

    // useHelper(groupRef, BoxHelper, "green");

    useFrame(() => {
      const group = groupRef.current;

      // handle zooming to hand
      if (
        rightHandSelected.current &&
        leftHandSelected.current &&
        leftController &&
        rightController
      ) {
        let leftPos = leftController.controller.position;
        let rightPos = rightController.controller.position;
        let center = leftPos.clone().add(rightPos).divideScalar(2);

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

        group.quaternion.multiply(previousQuaternion.multiply(newQuaternion));
        // console.log(newQuaternion.clone().multiply(previousQuaternion));

        previousQuaternion.copy(newQuaternion).invert();

        // scale the graph
        if (!initialScale && !initialDistance) {
          initialScale = group.scale.clone();
          initialDistance = leftPos!.distanceTo(rightPos!);
        }

        let distance = leftPos!.distanceTo(rightPos!);

        let ratio = distance / initialDistance!;
        group.scale.set(
          initialScale!.x * Math.max(ratio * 1 + (1 - ratio) * -0.1, 0),
          initialScale!.y * Math.max(ratio * 1 + (1 - ratio) * -0.1, 0),
          initialScale!.z * Math.max(ratio * 1 + (1 - ratio) * -0.1, 0)
        );

        if (ratio <= 1) {
          // move the graph to the center of the hands
          if (!initialPosition) {
            initialPosition = group.position.clone();
          }
          group.position.copy(
            center
              .multiplyScalar(1 - ratio)
              .add(initialPosition.clone().multiplyScalar(ratio))
          );
        }

        // console.log(distance / initialDistance!, distance, initialDistance);
      } else {
        initialPosition = null;
        initialScale = null;
        initialDistance = null;
        previousQuaternion = null;

        if (fixed) {
          group.applyMatrix4(group.matrix.clone().invert());
          group.updateMatrixWorld();
          group.position.set(position[0], position[1], position[2]);
          group.scale.set(scale[0], scale[1], scale[2]);
        }
      }

      // handle raygrab, referring to https://github.com/pmndrs/react-xr/blob/b384e2cfbeee62393fa09505c14e7474c7de5dc8/src/Interactions.tsx
      const controller = grabbingController.current;
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
        <Graph dim={InitialRequest.ClientViewType.VIEW_3D} />
      </XRInteraction>
    );
  }
);
