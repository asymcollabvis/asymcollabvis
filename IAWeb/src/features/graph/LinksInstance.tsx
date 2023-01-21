import { useFrame } from "@react-three/fiber";
import React, { useMemo } from "react";
import { useRef } from "react";
import * as THREE from "three";
import { useClient } from "../../common/client";
import { Node } from "../../common/message_pb";
import { useAppSelector } from "../../hooks";
import store from "../../store";
import { selectUser } from "../user/userSlice";
import { selectLinks, selectNodes } from "./graphSlice";

const data = Array.from({ length: 1000 }, () => ({ color: "black", scale: 1 }));
const tempColor = new THREE.Color();

export function getNodeById(id: string, nodes: Node[]) {
  return nodes.findIndex((node) => node.getId() === id);
}

export default function LinksInstance(props: {
  temp?: THREE.Object3D;
  a?: THREE.Vector3;
  b?: THREE.Vector3;
}) {
  console.log("links instances");

  const ref = useRef<THREE.InstancedMesh>(null!);
  const {
    temp = new THREE.Object3D(),
    a = new THREE.Vector3(),
    b = new THREE.Vector3(),
  } = props;
  const selector = useAppSelector;
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(1000)
          .fill(0)
          .flatMap((_, i) => tempColor.set(data[i].color).toArray())
      ),
    []
  );

  useFrame(() => {
    const nodes = store.getState().graph.nodes;
    const nodesRaw = store.getState().graph.nodesRaw;
    const links = store.getState().graph.links;

    if (!nodes || !nodesRaw || !links || nodes.length != nodesRaw.length) {
      return;
    }

    ref.current.count = links.length;

    links.forEach((link, i) => {
      let source = getNodeById(`${link.source}`, nodesRaw);
      const target = getNodeById(`${link.target}`, nodesRaw);
      if (!nodes[source] || !nodes[target]) {
        return;
      }
      a.set(nodes[source][0], nodes[source][1], nodes[source][2]);
      b.set(nodes[target][0], nodes[target][1], nodes[target][2]);
      // position
      temp.position.set((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
      // scale
      temp.scale.set(
        0.5,
        Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2),
        0.5
      );
      // rotation
      var origVec = new THREE.Vector3(0, 1, 0); //vector of cylinder
      var targetVec = new THREE.Vector3();
      targetVec.subVectors(b, a);
      targetVec.normalize();
      var angle = Math.acos(origVec.dot(targetVec));
      var axis = new THREE.Vector3();
      axis.crossVectors(origVec, targetVec);
      axis.normalize();
      var quaternion = new THREE.Quaternion();
      quaternion.setFromAxisAngle(axis, angle);
      temp.quaternion.set(
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w
      );
      temp.updateMatrix();
      ref.current?.setMatrixAt(i, temp.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    // We set the initial count to 100000 to avoid creating a new InstancedMesh
    // If you need more instances than the original count value, you have to create a new InstancedMesh.
    // https://threejs.org/docs/#api/en/objects/InstancedMesh.count
    <instancedMesh ref={ref} args={[undefined, undefined, 100000]}>
      <cylinderBufferGeometry args={[0.5, 0.5, 1]}>
        <instancedBufferAttribute
          attach="attributes-color"
          args={[colorArray, 3]}
        />
      </cylinderBufferGeometry>
      <lineBasicMaterial toneMapped={false} vertexColors={true} />
    </instancedMesh>
  );
}
