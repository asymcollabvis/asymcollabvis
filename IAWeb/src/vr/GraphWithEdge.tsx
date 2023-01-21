import { useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import { InitialRequest } from "../common/message_pb";
import { selectSelectedText } from "../features/document/documentSlice";
import Graph from "./embodied/EmbodiedGraph";
import { useAppSelector } from "../hooks";
import { boxGeometry } from "./shared";

export default function GraphWithEdge() {
  const graphRef = useRef<THREE.Group>(null!);

  return (
    <group>
      {/* need to scale to fit the graph */}
      <lineSegments
        raycast={() => null}
        scale={[1 / 0.005, 1 / 0.005, 1 / 0.005]}
      >
        <edgesGeometry args={[boxGeometry]} />
        <lineBasicMaterial transparent opacity={0.2} color={"grey"} />
      </lineSegments>
      <Graph ref={graphRef} dim={InitialRequest.ClientViewType.VIEW_3D} />
    </group>
  );
}
