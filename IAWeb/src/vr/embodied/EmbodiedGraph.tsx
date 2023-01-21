import * as THREE from "three";
import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import { InitialRequest } from "../../common/message_pb";
import Labels from "../../features/graph/Labels";
import LinkLabels from "../../features/graph/LinkLabels";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  selectUser,
  setNodesNearbyCursor,
} from "../../features/user/userSlice";
import {
  addLink,
  clearNodeSelection,
  deleteLink,
  deleteNode,
  graphNodeUpdatePos,
  mergeNodes,
  moveNode,
  sendAction,
} from "../../common/graph";
import {
  setNodesInstances,
  setSelectedNodeIds,
} from "../../features/graph/graphSlice";
import * as Nearby from "nearby-js";
import { useFrame, useThree } from "@react-three/fiber";
import store from "../../store";
import { getNodeById } from "../../features/graph/LinksInstance";
import { Interactive, useController, useXR, useXREvent } from "@react-three/xr";
import { Segment, Segments, Sphere } from "@react-three/drei";
import { Vector3 } from "three";
import Cursors from "../../common/Cursors";
import { arrayEquals } from "../../common/helper";
import * as d3 from "d3";
import { setSelectedText } from "../../features/document/documentSlice";
import { intersects } from "../interactions/utils";

function saveControllerState(grabbingController, positionBuffer) {
  if (grabbingController.current) {
    positionBuffer.current.push(grabbingController.current.position.clone());
    if (positionBuffer.current.length > 5) {
      positionBuffer.current.shift();
    }
  }
}

// const emptyMatrix = new THREE.Matrix4().setPosition(0, 0, 0);
const boxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
const data = Array.from({ length: 1000 }, () => ({ color: "grey", scale: 1 }));
export default forwardRef<
  THREE.Group,
  {
    dim: InitialRequest.ClientViewType;
    scale?: number[];
    showLabels?: boolean;
    tempColor?: THREE.Color;
    temp?: THREE.Object3D;
    temp2?: THREE.Vector3;
    temp3?: THREE.Vector3;
    temp4?: THREE.Vector3;
    tempM4?: THREE.Matrix4;
    tempM42?: THREE.Matrix4;
    tempDP?: THREE.Vector3;
    tempDQ?: THREE.Quaternion;
    tempDS?: THREE.Vector3;
    a?: THREE.Vector3;
    b?: THREE.Vector3;
  }
>(
  (
    {
      scale = [1, 1, 1],
      showLabels = true,
      tempColor = new THREE.Color(),
      temp = new THREE.Object3D(),
      temp2 = new THREE.Vector3(),
      temp3 = new THREE.Vector3(),
      temp4 = new THREE.Vector3(),
      tempM42 = new THREE.Matrix4(),
      a = new THREE.Vector3(),
      b = new THREE.Vector3(),
    },
    ref
  ) => {
    console.log("rendering graph");

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
    const colorArray3 = useMemo(
      () =>
        Float32Array.from(
          new Array(1000)
            .fill(0)
            .flatMap((_, i) => tempColor.set(data[i].color).toArray())
        ),
      []
    );
    const nodesRef = useRef<THREE.InstancedMesh>(null!);
    const linksRef = useRef<THREE.InstancedMesh>(null!);
    const otherHighlightedRef = useRef<THREE.InstancedMesh>(null!);
    const lineRef = useRef<THREE.Object3D>(null!);
    const lineRef2 = useRef<THREE.Object3D>(null!);
    const rightHandSphereRef = useRef<THREE.Object3D>(null!);
    const leftHandSphereRef = useRef<THREE.Object3D>(null!);

    const selector = useAppSelector;
    const dispatch = useAppDispatch();
    const user = selector(selectUser);
    const isMerge = useRef(false);

    const nearby = useRef<any>(null!);
    const nearbyObjects = useRef<{ [key: string]: any }>({});
    // const rightPickedObjects = useRef<string[]>([]);
    const [rightPickedObjects, setRightPickedObjects] = React.useState<
      string[]
    >([]);
    const [leftPickedObjects, setLeftPickedObjects] = React.useState<string[]>(
      []
    );
    const rightPreviousTransform = useMemo(() => new THREE.Matrix4(), []);
    const leftPreviousTransform = useMemo(() => new THREE.Matrix4(), []);
    const rightPreviousPos = useMemo(() => new THREE.Vector3(), []);
    const leftPreviousPos = useMemo(() => new THREE.Vector3(), []);
    const rightGrabbingController = useRef<THREE.Object3D>();
    const leftGrabbingController = useRef<THREE.Object3D>();
    const rightPositionBuffer = useRef<Vector3[]>([]);
    const leftPositionBuffer = useRef<Vector3[]>([]);

    const { camera, gl } = useThree();
    const _camera = gl.xr.isPresenting ? gl.xr.getCamera() : camera;
    const rightController = useController("right");

    const raycaster = useMemo(() => new THREE.Raycaster(), []);
    const toBeLinked = useRef<number>(-1);

    function checkNode(handedness, nodeId) {
      const sphereRef =
        handedness === "left" ? leftHandSphereRef : rightHandSphereRef;
      const previousTransform =
        handedness === "left" ? leftPreviousTransform : rightPreviousTransform;
      const grabbingController =
        handedness === "left"
          ? leftGrabbingController
          : rightGrabbingController;

      sphereRef.current.applyMatrix4(sphereRef.current.parent?.matrixWorld!);
      sphereRef.current.applyMatrix4(previousTransform);
      sphereRef.current.applyMatrix4(grabbingController.current.matrixWorld);
      sphereRef.current.applyMatrix4(
        sphereRef.current.parent?.matrixWorld!.clone().invert()!
      );
      sphereRef.current.updateMatrixWorld();

      // console.log("sphereRef.current", sphereRef.current.position);

      // find nearby objects and check distance
      var result = nearby.current.query(
        sphereRef.current.position.x,
        sphereRef.current.position.y,
        sphereRef.current.position.z
      );
      // console.log(result);

      let found = false;
      for (let object of result.keys()) {
        const center = new Vector3(
          object.box.maxX + object.box.minX,
          object.box.maxY + object.box.minY,
          object.box.maxZ + object.box.minZ
        ).multiplyScalar(0.5);
        const distance = center.distanceTo(sphereRef.current.position);

        if (distance < 10 && object.id.startsWith("n")) {
          // the radis is 5
          // console.log("nearby object", object);

          // link
          toBeLinked.current = +object.id.slice(1);
          // console.log(toBeLinked.current);

          dispatch(setSelectedNodeIds([+nodeId, +toBeLinked.current]));
          dispatch(setSelectedText({ text: " ", from: -1 })); // HACK: to trigger the preview
          found = true;
        }
      }

      if (!found) {
        toBeLinked.current = -1;
        dispatch(setSelectedNodeIds([]));
        dispatch(setSelectedText({ text: "", from: -1 })); // HACK: to trigger the preview
      }

      previousTransform.copy(grabbingController.current.matrixWorld).invert();
    }

    useEffect(() => {
      // setup nodes
      dispatch(setNodesInstances(nodesRef.current));

      // setup nearby
      var sceneWidth = 1050,
        sceneHeight = 1050,
        sceneDepth = 1050;
      var binSize = 50;
      // Creates a world centered in (0, 0, 0) of size (1000x1000x1000)
      // The world is splitted into cubes of (50x50x50).
      nearby.current = new Nearby(sceneWidth, sceneHeight, sceneDepth, binSize);
    }, []); // onmounted

    const sphereRef2 = useRef<THREE.Object3D>(null!);
    useFrame(() => {
      const nodes = store.getState().graph.nodes;
      const nodesRaw = store.getState().graph.nodesRaw;
      const links = store.getState().graph.links;
      const clickedNodes = store.getState().graph.selectedNodeIds.map((id) => {
        return nodesRaw.findIndex((node) => id === +node.getId());
      });

      // voronoi
      if (rightController) {
        const points: [number, number][] = nodes.map((node) => {
          nodesRef.current.localToWorld(temp2.set(node[0], node[1], node[2]));

          const normalizedProjected = temp2.project(_camera);

          // console.log(node, normalizedProjected);

          return [normalizedProjected.x, normalizedProjected.y];
        });

        // use raycase end point
        rightController.controller.getWorldPosition(a);
        rightController.controller.getWorldDirection(b);
        raycaster.set(a, b);
        const intersect = raycaster.intersectObject(nodesRef.current);
        // console.log(intersect);

        if (intersect.length > 0) {
          // TODO: it seems not working but it looks fine?
          a.copy(intersect[0].point);
        } else {
          a.add(b.multiplyScalar(-1));
        }

        sphereRef2.current.position.copy(
          nodesRef.current.worldToLocal(a.clone())
        );
        const normalizedProjected = a.project(_camera);
        // console.log(normalizedProjected);

        points.push([normalizedProjected.x, normalizedProjected.y]);
        // console.log(points.slice(0, 10));

        const voronoi = d3.Delaunay.from(points).voronoi([-1, -1, 1, 1]);
        const V = [...voronoi.neighbors(points.length - 1)];
        const polygon = voronoi.cellPolygon(points.length - 1);
        if (polygon) {
          const cursorPolygon = polygon.slice(0, -1);
          // console.log(V);

          const res = V.map((v) => {
            // calculate the Laplace weights for Natural neighbor interpolation

            // step 1 find the common edges
            const nPolygon = voronoi.cellPolygon(v).slice(0, -1);
            const commonEdges: [number, number][] = [];
            nPolygon.forEach((p) => {
              // console.log(p, cursorPolygon);

              if (cursorPolygon.find((p2) => arrayEquals(p, p2))) {
                commonEdges.push(p);
              }
            });
            // console.log(commonEdges);

            // step 2 calcuate the length of the common edges
            let length = -1;
            if (commonEdges.length === 2) {
              const [p1, p2] = commonEdges;
              const [x1, y1] = p1;
              const [x2, y2] = p2;
              length = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
            }

            // step 3 calculate the distance between the cursor and the node
            const [x, y] = points[v];
            const [mx, my] = points[points.length - 1];
            const distance = Math.sqrt((x - mx) ** 2 + (y - my) ** 2);

            // step 4 calculate the weight
            if (length === -1 || nodesRaw[v] == undefined) {
              return {
                nodeId: "null",
                weight: 0,
              };
            }

            return {
              nodeId: nodesRaw[v].getId(),
              weight: length / distance,
            };
          });
          // console.log(res, nodes, nodesRaw);

          // step 5 calculate the weighted average
          const sum = res.reduce((acc, cur) => acc + cur.weight, 0);
          res.forEach((r) => (r.weight /= sum));

          dispatch(setNodesNearbyCursor(res));
        }
      }

      // nodes
      let instance = nodesRef.current;
      if (instance) {
        instance.count = nodes.length;
        nodes.forEach((node, i) => {
          if (nodesRaw[i] == undefined) {
            console.log("undefined node", i);

            return;
          }
          const nodeId = nodesRaw[i].getId();

          const isRightPicked =
            rightPickedObjects.includes(`n${nodeId}`) &&
            rightGrabbingController.current;
          const isLeftPicked =
            leftPickedObjects.includes(`n${nodeId}`) &&
            leftGrabbingController.current;
          if (isRightPicked || isLeftPicked) {
            if (isRightPicked) {
              checkNode("right", nodeId);
            } else if (isLeftPicked) {
              checkNode("left", nodeId);
            }
          } else {
            if (nearbyObjects.current[`n${nodeId}`]) {
              nearby.current.update(
                nearbyObjects.current[`n${nodeId}`],
                node[0],
                node[1],
                node[2],
                5,
                5,
                5
              );
            } else {
              // console.log(node);
              nearbyObjects.current[`n${nodeId}`] = nearby.current.createObject(
                `n${nodeId}`,
                nearby.current.createBox(node[0], node[1], node[2], 5, 5, 5)
              );
            }

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
          }
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

      // links
      if (!nodes || !nodesRaw || !links) {
        return;
      }

      instance = linksRef.current;
      instance.count = links.length;
      links.forEach((link, i) => {
        const linkId = links[i].id;
        let source = getNodeById(`${link.source}`, nodesRaw);
        const target = getNodeById(`${link.target}`, nodesRaw);
        if (!nodes[source] || !nodes[target]) {
          return;
        }
        a.set(nodes[source][0], nodes[source][1], nodes[source][2]);
        b.set(nodes[target][0], nodes[target][1], nodes[target][2]);

        if (nearbyObjects.current[`l${linkId}`]) {
          nearby.current.update(
            nearbyObjects.current[`l${linkId}`],
            (a.x + b.x) / 2,
            (a.y + b.y) / 2,
            (a.z + b.z) / 2,
            5,
            5,
            5
          );
        } else {
          // console.log(node);

          nearbyObjects.current[`l${linkId}`] = nearby.current.createObject(
            `l${linkId}`,
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

        // HACK: only allow right controller to grab links
        const pickedObjects = rightPickedObjects;
        const grabbingController = rightGrabbingController;
        const setPickedObjects = setRightPickedObjects;

        // visibility
        if (
          pickedObjects.includes(`l${linkId}`) &&
          grabbingController.current
        ) {
          // console.log(grabbingController.current.position);

          grabbingController.current.getWorldPosition(temp2);
          // temp2.copy(grabbingController.current.position);

          linksRef.current.worldToLocal(temp2);
          // console.log(temp2);

          lineRef.current.start.copy(a);
          lineRef.current.end.copy(temp2);
          lineRef2.current.start.copy(temp2);
          lineRef2.current.end.copy(b);

          // check if user pull the link too far away
          let line = new THREE.Line3(a, b);
          let point = new THREE.Vector3();
          line.closestPointToPoint(temp2, false, point);
          // console.log(point.distanceTo(temp2), temp2);

          if (point.distanceTo(temp2) > 50) {
            // break the line
            // console.log("break the line");
            setPickedObjects([]); // reset the picked objects
            if (user && link.id) {
              nearby.current.delete(nearbyObjects.current[`l${linkId}`]);
              deleteLink(user, +link.id);
            }
          }

          // instance.setMatrixAt(i, emptyMatrix);
        } else instance.setMatrixAt(i, temp.matrix);
      });
      instance.instanceMatrix.needsUpdate = true;

      // saving controller position buffer
      saveControllerState(rightGrabbingController, rightPositionBuffer);
      saveControllerState(leftGrabbingController, leftPositionBuffer);

      if (rightPickedObjects.length > 0 && leftPickedObjects.length > 0) {
        // check distance between spheres
        temp3.copy(rightHandSphereRef.current.position);
        temp4.copy(leftHandSphereRef.current.position);

        if (temp3.distanceTo(temp4) < 11) {
          isMerge.current = true;
          leftHandSphereRef.current.material.color.setHex(0x00ff00);
          rightHandSphereRef.current.material.color.setHex(0x00ff00);
        } else {
          leftHandSphereRef.current.material.color.setHex(0xff0000);
          rightHandSphereRef.current.material.color.setHex(0xff0000);
          isMerge.current = false;
        }
      }
    }); // end of useFrame

    useXREvent("squeezestart", (e) => {
      if (e.nativeEvent.data == undefined) {
        return;
      }

      let handedness = e.nativeEvent.data.handedness;
      const sphereRef =
        handedness === "right" ? rightHandSphereRef : leftHandSphereRef;
      const previousPos =
        handedness === "right" ? rightPreviousPos : leftPreviousPos;
      const previousTransform =
        handedness === "right" ? rightPreviousTransform : leftPreviousTransform;
      const grabbingController =
        handedness === "right"
          ? rightGrabbingController
          : leftGrabbingController;
      const setPickedObjects =
        handedness === "right" ? setRightPickedObjects : setLeftPickedObjects;

      // let temp = e.target.grip.position;
      // temp3.copy(e.target.grip.position);
      e.target.grip.getWorldPosition(temp3);
      nodesRef.current.worldToLocal(temp3);
      // console.log("squeeze", temp3);

      var result = nearby.current.query(temp3.x, temp3.y, temp3.z);
      // console.log(result);

      let res: string[] = [];

      let resultDist: { object: any; distance: number }[] = [];

      for (let object of result.keys()) {
        const center = new Vector3(
          object.box.maxX + object.box.minX,
          object.box.maxY + object.box.minY,
          object.box.maxZ + object.box.minZ
        ).multiplyScalar(0.5);
        const distance = center.distanceTo(temp3);

        resultDist.push({ object: {...object}, distance });
      }

      resultDist.sort((a, b) => a.distance - b.distance);

      // console.log(resultDist);

      for (let re of resultDist) {
        let object = re.object;
        if (object.id.startsWith("n")) {
          temp3.set(object.box.minX, object.box.minY, object.box.minZ);
          temp4.set(object.box.maxX, object.box.maxY, object.box.maxZ);

          nodesRef.current.localToWorld(temp3);
          nodesRef.current.localToWorld(temp4);

          const bbox = new THREE.Box3(temp3, temp4);

          const controllerBBox = new THREE.Box3().setFromObject(e.target.grip);

          // console.log(bbox, controllerBBox, bbox.intersectsBox(controllerBBox));

          if (bbox.intersectsBox(controllerBBox)) {
            e.target.userData.captured = true;
            console.log(object.id + " is found nearby!");
            res.push(object.id as string);

            temp3.set(object.box.minX, object.box.minY, object.box.minZ);
            temp4.set(object.box.maxX, object.box.maxY, object.box.maxZ);

            sphereRef.current.position.copy(
              temp3.add(temp4).multiplyScalar(0.5)
            );
            
            e.target.controller.getWorldPosition(previousPos);
            previousTransform.copy(e.target.controller.matrixWorld).invert();
            grabbingController.current = e.target.controller;
            break;
          }
        } else if (object.id.startsWith("l")) {
          let linkId = re.object.id.slice(1);
          const nodes = store.getState().graph.nodes;
          const nodesRaw = store.getState().graph.nodesRaw;
          const links = store.getState().graph.links;

          let link = links.find((l) => l.id === linkId);
          if (!link) continue;
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

          // lineRef.current.start.copy(temp3);
          // lineRef.current.end.copy(temp3.add(dir.multiplyScalar(dist)));

          const controllerBBox = new THREE.Box3().setFromObject(e.target.grip);
          // lineRef.current.setPoints([.toArray(), temp4.toArray()]);

          temp3.copy(controllerBBox.min);
          temp4.copy(controllerBBox.max);
          linksRef.current.worldToLocal(temp3);
          linksRef.current.worldToLocal(temp4);
          controllerBBox.set(temp3, temp4);

          // console.log(temp4, controllerBBox, temp3);

          // lineRef2.current.start.copy(temp3);
          // lineRef2.current.end.copy(temp4);

          let intersectPt = ray.intersectBox(controllerBBox, temp4);
          // intersectPt && sphereRef.current.position.copy(intersectPt);
          // console.log(intersectPt);

          if (intersectPt && temp3.distanceTo(intersectPt) <= dist) {
            e.target.userData.captured = true;
            console.log("link " + object.id + " is found nearby!");

            res.push(object.id as string);
            e.target.controller.getWorldPosition(previousPos);
            grabbingController.current = e.target.controller;
            break;
          }
        }
      }
      setPickedObjects(res);
    });

    useXREvent("squeezeend", (e) => {
      e.target.userData.captured = false;

      if (e.nativeEvent.data == undefined) {
        return;
      }

      let handedness = e.nativeEvent.data.handedness;

      const pickedObjects =
        handedness === "right" ? rightPickedObjects : leftPickedObjects;
      const sphereRef =
        handedness === "right" ? rightHandSphereRef : leftHandSphereRef;
      const grabbingController =
        handedness === "right"
          ? rightGrabbingController
          : leftGrabbingController;
      const setPickedObjects =
        handedness === "right" ? setRightPickedObjects : setLeftPickedObjects;
      const positionBuffer =
        handedness === "right" ? rightPositionBuffer : leftPositionBuffer;

      const userInfo = store.getState().user.userInfo;
      const nodesRaw = store.getState().graph.nodesRaw;
      if (!userInfo) return;

      console.log(pickedObjects);
      
      pickedObjects.forEach((oid) => {
        // node
        if (oid.startsWith("n")) {
          let nodeId = +oid.slice(1);
          let id = nodesRaw.findIndex((n) => +n.getId() === nodeId);

          // remove node
          // check if the user throw the node away
          if (positionBuffer.current.length < 2) return; // cannot determine the acceleration

          const velocities: Vector3[] = [];
          for (let i = 0; i < positionBuffer.current.length - 1 - 1; i++) {
            velocities.push(
              positionBuffer.current[i + 1]
                .clone()
                .sub(positionBuffer.current[i])
            );
          }

          // nodesRef.current.getMatrixAt(id, tempM42);

          if (Math.abs(velocities[velocities.length - 1].length()) > 0.03) {
            // console.log("throw away");
            console.log("remove node " + id);

            console.log(nearbyObjects.current[oid], oid);
            nearby.current.delete(nearbyObjects.current[oid]);

            deleteNode(userInfo, nodeId);
            clearNodeSelection(userInfo.getId());
          } else if (toBeLinked.current != -1) {
            console.log("link node " + id + " to " + toBeLinked.current);

            // NOTE: since we used squeeze instead of trigger for adding nodes and links, we sqeezeend, we will add link from nodecreator
            // if (user) addLink(user, nodeId, toBeLinked.current, "", "-1");
            // dispatch(setSelectedNodeIds([]));
            // dispatch(setSelectedText(""));
            toBeLinked.current = -1;
          } else if (isMerge.current) {
            if (user) {
              // merge node if two nodes are picked by each hand and put together
              let rightNodeId = +rightPickedObjects[0].slice(1);
              let leftNodeId = +leftPickedObjects[0].slice(1);
              
              console.log("merge node " + rightNodeId + " and " + leftNodeId);
              setRightPickedObjects([]);
              setLeftPickedObjects([]);

              leftHandSphereRef.current.material.color.setHex(0xff0000);
              rightHandSphereRef.current.material.color.setHex(0xff0000);
              isMerge.current = false;

              mergeNodes(user.getId(), user.getRoomid(), [
                rightNodeId,
                leftNodeId,
              ]);
            }
          } else {
            let nodeId = oid.slice(1);
            console.log("move", nodeId);
            moveNode(userInfo, nodeId, {
              x: sphereRef.current.position.x,
              y: sphereRef.current.position.y,
              z: sphereRef.current.position.z,
            });
          }
        } else if (oid.startsWith("l")) {
        }
      });

      grabbingController.current = undefined;
      setPickedObjects([]);
    });

    function drawNodes() {
      return (
        <Interactive
          onSelect={(e) => {
            if (user && e.intersection?.instanceId)
              sendAction(user.getId(), e.intersection.instanceId);
          }}
        >
          <instancedMesh
            // castShadow
            ref={nodesRef}
            args={[undefined, undefined, 100000]}
          >
            <sphereGeometry args={[5, 10, 10]}>
              <instancedBufferAttribute
                attach="attributes-color"
                args={[colorArray, 3]}
              />
            </sphereGeometry>
            <meshStandardMaterial
              toneMapped={false}
              vertexColors={true}
              metalness={0.2}
              roughness={0.5}
            />
          </instancedMesh>
        </Interactive>
      );
    }

    function drawOtherHighlightNodes() {
      return (
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
      );
    }

    function drawLinks() {
      return (
        <instancedMesh ref={linksRef} args={[undefined, undefined, 100000]}>
          <cylinderBufferGeometry args={[0.5, 0.5, 1]}>
            <instancedBufferAttribute
              attach="attributes-color"
              args={[colorArray3, 3]}
            />
          </cylinderBufferGeometry>
          <lineBasicMaterial toneMapped={false} vertexColors={true} />
        </instancedMesh>
      );
    }

    return (
      <group scale={scale} ref={ref}>
        <lineSegments raycast={() => null}>
          <edgesGeometry args={[boxGeometry]} />
          <lineBasicMaterial color={"pink"} />
        </lineSegments>
        {drawNodes()}
        {drawOtherHighlightNodes()}
        {showLabels && <Labels />}
        {drawLinks()}
        {showLabels && <LinkLabels />}

        {rightPickedObjects.length > 0 &&
          rightPickedObjects[0].startsWith("l") && (
            <Segments limit={2} lineWidth={1.0}>
              <Segment
                ref={lineRef}
                start={[0, 0, 0]}
                end={[0, 0, 0]}
                color="red"
              />
              <Segment
                ref={lineRef2}
                start={[0, 0, 0]}
                end={[0, 0, 0]}
                color={"red"}
              />
            </Segments>
          )}

        <Sphere
          ref={rightHandSphereRef}
          scale={5}
          visible={
            rightPickedObjects.length > 0 &&
            rightPickedObjects[0].startsWith("n")
          }
        >
          <meshBasicMaterial color="red" />
        </Sphere>

        <Sphere
          ref={leftHandSphereRef}
          scale={5}
          visible={
            leftPickedObjects.length > 0 && leftPickedObjects[0].startsWith("n")
          }
        >
          <meshBasicMaterial color="red" />
        </Sphere>

        <Sphere ref={sphereRef2} scale={1}>
          <meshBasicMaterial color="black" />
        </Sphere>

        <Cursors />
      </group>
    );
  }
);
