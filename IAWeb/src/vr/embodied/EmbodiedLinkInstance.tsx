import { Line, Segment, Segments, Sphere, useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Interactive, useController, useXREvent } from "@react-three/xr";
import React, { useEffect, useMemo } from "react";
import { useRef } from "react";
import * as THREE from "three";
import { Node } from "../../common/message_pb";
import { useAppSelector } from "../../hooks";
import store from "../../store";
import * as Nearby from "nearby-js";

const data = Array.from({ length: 1000 }, () => ({ color: "grey", scale: 1 }));
const tempColor = new THREE.Color();

const emptyMatrix = new THREE.Matrix4();

export function getNodeById(id: string, nodes: Node[]) {
  return nodes.findIndex((node) => node.getId() === id);
}

export default function LinksInstance({
  temp = new THREE.Object3D(),
  a = new THREE.Vector3(),
  b = new THREE.Vector3(),
  temp2 = new THREE.Vector3(),
  temp3 = new THREE.Vector3(),
  temp4 = new THREE.Vector3(),
}: {
  temp?: THREE.Object3D;
  temp2?: THREE.Vector3;
  temp3?: THREE.Vector3;
  temp4?: THREE.Vector3;
  a?: THREE.Vector3;
  b?: THREE.Vector3;
}) {
  console.log("embodied links instances");

  const lineRef = useRef(null!);
  const lineRef2 = useRef(null!);
  const sphereRef = useRef<THREE.Object3D>(null!);
  const ref = useRef<THREE.InstancedMesh>(null!);
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

  const rightController = useController("right");

  const [picked, setPicked] = React.useState(-1);
  const nearby = useRef<any>();
  const nearbyObjects = useRef<any[]>([]);
  useEffect(() => {
    var sceneWidth = 1000,
      sceneHeight = 1000,
      sceneDepth = 1000;
    var binSize = 50;
    // Creates a world centered in (0, 0, 0) of size (1000x1000x1000)
    // The world is splitted into cubes of (50x50x50).
    nearby.current = new Nearby(sceneWidth, sceneHeight, sceneDepth, binSize);
  }, []); // onmounted

  useFrame(() => {
    const nodes = store.getState().graph.nodes;
    const nodesRaw = store.getState().graph.nodesRaw;
    const links = store.getState().graph.links;

    if (!nodes || !nodesRaw || !links) {
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

      if (nearbyObjects.current[i]) {
        nearby.current.update(
          nearbyObjects.current[i],
          (a.x + b.x) / 2,
          (a.y + b.y) / 2,
          (a.z + b.z) / 2,
          5,
          5,
          5
        );
      } else {
        // console.log(node);

        nearbyObjects.current[i] = nearby.current.createObject(
          `${i}`,
          nearby.current.createBox(
            (a.x + b.x) / 2,
            (a.y + b.y) / 2,
            (a.z + b.z) / 2,
            5,
            5,
            5
          )
        );
      }

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
      // visibility
      if (pickedObjects.current.includes(`${i}`)) {
        console.log(i, lineRef.current);
        temp2.copy(grabbingController.current.position);
        // sphereRef.current.parent.worldToLocal(temp2);
        // sphereRef.current.position.copy(temp2);
        // lineRef.current.geometry.attributes.position.array[1] = temp2.toArray();
        // lineRef.current.geometry.setPositions([0,0,0,...grabbingController.current.position.toArray()]);
        ref.current?.setMatrixAt(i, emptyMatrix);
      } else ref.current?.setMatrixAt(i, temp.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  const pickedObjects = useRef<string[]>([]);
  const grabbingController = useRef<THREE.Object3D>(null!);
  const previousPos = useMemo(() => new THREE.Vector3(), []);
  useXREvent("squeezestart", (e) => {
    // let temp = e.target.grip.position;
    temp3.copy(e.target.grip.position);
    ref.current.worldToLocal(temp3);
    // console.log("squeeze", temp3);

    var result = nearby.current.query(temp3.x, temp3.y, temp3.z);
    // console.log(result);

    const nodesRaw = store.getState().graph.nodesRaw;
    const nodes = store.getState().graph.nodes;
    const links = store.getState().graph.links;

    let res = [];
    for (var object of result.keys()) {
      // temp3.set(object.box.minX, object.box.minY, object.box.minZ);
      // temp4.set(object.box.maxX, object.box.maxY, object.box.maxZ);

      // ref.current.localToWorld(temp3);
      // ref.current.localToWorld(temp4);
      let link = links[object.id];
      const source = getNodeById(`${link.source}`, nodesRaw);
      const target = getNodeById(`${link.target}`, nodesRaw);
      if (!nodes[source] || !nodes[target]) {
        continue;
      }

      temp3.set(nodes[source][0], nodes[source][1], nodes[source][2]);
      temp4.set(nodes[target][0], nodes[target][1], nodes[target][2]);

      // ref.current.localToWorld(temp3);
      // ref.current.localToWorld(temp4);

      const dist = temp3.distanceTo(temp4);
      const dir = temp4.clone().sub(temp3.clone()).normalize();
      const ray = new THREE.Ray(temp3.clone(), dir);

      lineRef.current.start.copy(temp3)
      lineRef.current.end.copy(temp3.add(dir.multiplyScalar(dist)));

      const controllerBBox = new THREE.Box3().setFromObject(e.target.grip);
      // lineRef.current.setPoints([.toArray(), temp4.toArray()]);
      
      temp3.copy(controllerBBox.min)
      temp4.copy(controllerBBox.max)
      ref.current.worldToLocal(temp3);
      ref.current.worldToLocal(temp4);
      controllerBBox.set(temp3, temp4);
      
      // console.log(temp4, controllerBBox, temp3);
      
      lineRef2.current.start.copy(temp3)
      lineRef2.current.end.copy(temp4);

      
      let intersectPt = ray.intersectBox(controllerBBox, temp4);
      intersectPt && sphereRef.current.position.copy(intersectPt);
      // console.log(intersectPt);
      
      if (intersectPt && temp3.distanceTo(intersectPt) <= dist) {
        console.log("link " + object.id + " is found nearby!");

        res.push(object.id as string);
        e.target.controller.getWorldPosition(previousPos);
        grabbingController.current = e.target.controller;
      }
    }
    pickedObjects.current = res;
  });

  useXREvent("squeezeend", (e) => {
    pickedObjects.current = [];
  });

  return (
    // We set the initial count to 100000 to avoid creating a new InstancedMesh
    // If you need more instances than the original count value, you have to create a new InstancedMesh.
    // https://threejs.org/docs/#api/en/objects/InstancedMesh.count
    <>
      <instancedMesh ref={ref} args={[undefined, undefined, 100000]}>
        <cylinderBufferGeometry args={[0.5, 0.5, 1]}>
          <instancedBufferAttribute
            attach="attributes-color"
            args={[colorArray, 3]}
          />
        </cylinderBufferGeometry>
        <lineBasicMaterial toneMapped={false} vertexColors={true} />
      </instancedMesh>

      <Segments limit={1000} lineWidth={1.0}>
        <Segment ref={lineRef} start={[0, 0, 0]} end={[0, 10, 0]} color="red" />
        <Segment ref={lineRef2} start={[0, 0, 0]} end={[0, 100, 0]} color={[1, 0, 1]} />
      </Segments>

      <Sphere ref={sphereRef} scale={1}>
        <meshBasicMaterial color="red" />
      </Sphere>
    </>
  );
}
