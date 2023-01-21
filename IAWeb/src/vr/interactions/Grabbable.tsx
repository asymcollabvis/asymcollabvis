import { width, height } from "@mui/system";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import { XRInteraction } from "./Grab";

export default function Grabbable({ children, position, rotation, scale }: {
    children: React.ReactNode;
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
}) {
    const grabbingController = React.useRef<THREE.Object3D>();
    const previousTransform = React.useMemo(() => new THREE.Matrix4(), []);

    const mesh = useRef<THREE.Group>(null!);


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

    return (
        <XRInteraction
            position={position}
            rotation={rotation}
            scale={scale}
            ref={mesh}
            onGrabStart={(e) => {
                grabbingController.current = e.controller;
                previousTransform.copy(e.controller.matrixWorld).invert();
            }}
            onGrabEnd={(e) => {
                if (e.controller === grabbingController.current) {
                    grabbingController.current = undefined;
                }
            }}
        >
            {children}
        </XRInteraction>
    )
}