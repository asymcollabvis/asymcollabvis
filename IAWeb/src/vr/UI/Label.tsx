import { Segment, Segments } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { forwardRef, useRef } from "react";
import { isPosArrayZero } from "../../common/helper";
import VRText from "./Text";
import * as THREE from "three";

type LabelProps = {
  offset?: [number, number, number];
  position?: [number, number, number];
  children: string;
  temp?: THREE.Vector3;
  maxWidth?: number;
};

export default forwardRef<THREE.Group, LabelProps>(
  (
    { children, position = [0,0,0],offset = [0, 0, 0], temp = new THREE.Vector3(), maxWidth },
    ref
  ) => {
    const textRef = useRef<THREE.Group>(null!);
    const { camera, gl } = useThree();
    const _camera = gl.xr.isPresenting ? gl.xr.getCamera() : camera;

    useFrame(() => {
      _camera.getWorldPosition(temp);
      textRef.current.lookAt(temp);
    });
    return (
      <group ref={ref} scale={0.005} position={position}>
        {
          // if there is offset, we add a line segment to the label
          !isPosArrayZero(offset) && (
            <Segments limit={1000} lineWidth={1.0}>
              <Segment start={[0, 0, 0]} end={offset} color="black" />
            </Segments>
          )
        }

        <VRText position={offset} ref={textRef} maxWidth={maxWidth}>
          {children}
        </VRText>
      </group>
    );
  }
);
