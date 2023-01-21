// referring to https://gist.github.com/micmania1/6a189a51691b8239826a0a3ecad7f0d5

import { useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useXR, useXREvent, XRController } from "@react-three/xr";
import React from "react";
import { forwardRef, ReactNode, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { BoxHelper, Object3D } from "three";
import create from "zustand";
import { intersects } from "./utils";

/*-------------------------------------------------------------------------------------
 * XR Interaction Manager / State store
 *------------------------------------------------------------------------------------*/
export type GrabEvent = {
  type: "grabstart" | "grabend";
  target: Object3D;
  controller: XRController;
};

type XRInteractionManager = {
  grabbing: Partial<
    Record<XRInputSource["handedness"], THREE.Object3D | undefined>
  >;
  startGrab(object: THREE.Object3D, controller: XRController): void;
  endGrab(object: THREE.Object3D, controller: XRController): void;
};

const useXRInteractionManager = create<XRInteractionManager>((set, get) => ({
  grabbing: {},
  startGrab(object: THREE.Object3D, controller: XRController) {
    const grabbing = get().grabbing;
    const handedness = controller.inputSource.handedness;
    set({
      grabbing: {
        ...grabbing,
        [handedness]: object,
      },
    });
    object.dispatchEvent({ type: "grabstart", controller });
  },
  endGrab(object: THREE.Object3D, controller: XRController) {
    const grabbing = get().grabbing;
    const handedness = controller.inputSource.handedness;
    if (object.id === grabbing[handedness]?.id) {
      grabbing[handedness]?.dispatchEvent({
        type: "grabend",
        controller,
      });

      set({
        grabbing: {
          ...grabbing,
          [handedness]: undefined,
        },
      });
    }
  },
}));

/*-------------------------------------------------------------------------------------
 * Interactive Component
 *------------------------------------------------------------------------------------*/
// eslint-disable-next-line @typescript-eslint/ban-types
type XRInteractionProps = {
  children: ReactNode;
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: THREE.Vector3;
  onGrabStart?: (event: XRController) => void;
  onGrabEnd?: (event: XRController) => void;
};

export const XRInteraction = forwardRef<unknown, XRInteractionProps>(
  ({ children, onGrabStart, onGrabEnd, position, scale, rotation }, ref) => {
    console.log("XRInteraction");

    const groupRef = useRef<THREE.Group>(null);
    // useHelper(groupRef, BoxHelper, "cyan");

    useImperativeHandle(ref, () => groupRef.current);

    const { controllers } = useXR();

    const startGrab = useXRInteractionManager((im) => im.startGrab);
    const endGrab = useXRInteractionManager((im) => im.endGrab);

    const grabbingController = useRef<XRController | null>(null);

    useXREvent("squeezestart", (e) => {
      if (e.target.userData.captured) return;

      if (groupRef.current) {
        const controller = controllers.find(
          (controller) =>
            controller.inputSource.handedness ===
            e.target.inputSource.handedness
        );

        if (controller) {
          const controllerBoundingBox = new THREE.Box3();
          controllerBoundingBox.setFromObject(controller.grip);

          if (
            controllerBoundingBox &&
            intersects(controllerBoundingBox, groupRef.current)
          ) {
            startGrab(groupRef.current, e.target);
            controller.userData.grabbing = true;
            onGrabStart?.(e.target);
            grabbingController.current = controller;
          }
        }
      }
    });

    useXREvent("squeezeend", (e) => {
      const controller = e.target;
      if (groupRef.current) {
        endGrab(groupRef.current, e.target);
        controller.userData.grabbing = false;
        onGrabEnd?.(e.target);
        grabbingController.current = null;
      }
    });

    useFrame(() => {
      if (
        grabbingController.current &&
        grabbingController.current.userData.captured && groupRef.current
      ) {
          endGrab(groupRef.current, grabbingController.current);
          grabbingController.current.userData.grabbing = false;
          onGrabEnd?.(grabbingController.current);
          grabbingController.current = null;
      }
    });

    return (
      <group
        name="XRInteraction"
        ref={groupRef}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        {children}
      </group>
    );
  }
);
