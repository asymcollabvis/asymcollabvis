import { useFrame } from "@react-three/fiber";
import React, { useMemo } from "react";
import { useRef } from "react";
import * as THREE from "three";
import { graphNodeUpdatePos } from "../../common/graph";
import store from "../../store";

const data = Array.from({ length: 1000 }, () => ({
  color: "#e84a5f",
  scale: 1,
}));
const tempColor = new THREE.Color();

export default function NodeInstances({
  temp = new THREE.Object3D(),
}: {
  temp?: THREE.Object3D;
  temp2?: THREE.Vector3;
}) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const otherHighlightedRef = useRef<THREE.InstancedMesh>(null!);
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(1000)
          .fill(0)
          .flatMap((_, i) => tempColor.set(data[i].color).toArray())
      ),
    []
  );
  const colorArray2 = useMemo(
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
    // console.log(points[points.length-1], V);

    const clickedNodes = store.getState().graph.selectedNodeIds.map((id) => {
      return nodesRaw.findIndex((node) => id === +node.getId());
    });

    let instance = ref.current;
    if (instance) {
      instance.count = nodes.length;
      nodes.forEach((node, i) => {
        graphNodeUpdatePos(
          i,
          node,
          nodesRaw,
          instance,
          clickedNodes,
          temp,
          tempColor,
          colorArray
        );
      });
      instance.geometry.attributes.color.needsUpdate = true;
      instance.instanceMatrix.needsUpdate = true;
    }

    instance = otherHighlightedRef.current;
    if (instance) {
      const otherHighlightedNodes = store.getState().graph.allSelectedNodeIds;
      instance.count = otherHighlightedNodes.length;

      otherHighlightedNodes.forEach((nodeStatus, i) => {
        const targetNodeId = nodesRaw.findIndex(
          (node) => +node.getId() === nodeStatus.id
        );
        const node = nodes[targetNodeId];
        if (!node) {
          console.log("ERROR: otherHighlight node not found");

          return;
        }
        temp.position.set(node[0], node[1] + 8, node[2]);
        temp.updateMatrix();
        instance.setMatrixAt(i, temp.matrix);
        tempColor
          .set(store.getState().room.color(nodeStatus.userId))
          .toArray(colorArray2, i * 3);
      });
      instance.geometry.attributes.color.needsUpdate = true;
      instance.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    // We set the initial count to 100000 to avoid creating a new InstancedMesh
    // If you need more instances than the original count value, you have to create a new InstancedMesh.
    // https://threejs.org/docs/#api/en/objects/InstancedMesh.count
    <>
      <instancedMesh
        // castShadow
        ref={ref}
        args={[undefined, undefined, 100000]}
      >
        <sphereGeometry args={[5, 10, 10]}>
          <instancedBufferAttribute
            attach="attributes-color"
            args={[colorArray, 3]}
          />
        </sphereGeometry>
        <meshBasicMaterial
          toneMapped={false}
          vertexColors={true}
          // metalness={0.2}
          // roughness={0.5}
        />
      </instancedMesh>

      <instancedMesh
        ref={otherHighlightedRef}
        args={[undefined, undefined, 100000]}
      >
        <boxGeometry args={[3, 3, 3]}>
          <instancedBufferAttribute
            attach="attributes-color"
            args={[colorArray2, 3]}
          />
        </boxGeometry>
        <meshBasicMaterial toneMapped={false} vertexColors={true} />
      </instancedMesh>
    </>
  );
}
