import { Box, Button, ButtonGroup, Card, styled } from "@mui/material";
import { Html, Plane, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Interactive, useXREvent } from "@react-three/xr";
import React, { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import * as THREE from "three";
import { sendMessage, useClient } from "../../common/client";
import {
  clearNodeSelection,
  deleteLink,
  deleteNode,
  mergeNodes,
  moveNode,
  sendAction,
} from "../../common/graph";
import {
  BoardcastMessage,
  ClientActions,
  ServerNodesStatus,
  UserInfo,
} from "../../common/message_pb";
import { useAppDispatch, useAppSelector } from "../../hooks";
import store from "../../store";
import Panel from "../../vr/UI/Panel";
import { setDocumentId } from "../../features/document/documentSlice";
import { selectUser, selectUserEnv } from "../../features/user/userSlice";
import {
  selectNodes,
  selectNodesRaw,
  selectSelectedNodeIds,
  setIsMoveNode,
  setNodesInstances,
  setSelectedNodeIds,
} from "../../features/graph/graphSlice";
import VRButton from "../../vr/UI/Button";
import * as Nearby from "nearby-js";

const data = Array.from({ length: 1000 }, () => ({
  color: "#e84a5f",
  scale: 1,
}));
const tempColor = new THREE.Color();

const BootstrapButton = styled(Button)({
  textTransform: "none",
});

function computeMenuPosition(
  nodeId: number,
  offset = [0, 0, 0]
): [number, number, number] {
  return store.getState().graph.nodes[nodeId].map((v, i) => v + offset[i]);
}

export default function NodeInstances({
  temp = new THREE.Object3D(),
  temp2 = new THREE.Vector3(),
  temp3 = new THREE.Vector3(),
  temp4 = new THREE.Vector3(),
  tempM4 = new THREE.Matrix4(),
  tempM42 = new THREE.Matrix4(),
  tempDP = new THREE.Vector3(),
  tempDQ = new THREE.Quaternion(),
  tempDS = new THREE.Vector3(),
}: {
  temp?: THREE.Object3D;
  temp2?: THREE.Vector3;
  temp3?: THREE.Vector3;
  temp4?: THREE.Vector3;
  tempM4?: THREE.Matrix4;
  tempM42?: THREE.Matrix4;
  tempDP?: THREE.Vector3;
  tempDQ?: THREE.Quaternion;
  tempDS?: THREE.Vector3;
}) {
  console.log("nodes instances");

  const ref = useRef<THREE.InstancedMesh>(null!);
  const otherHighlightedRef = useRef<THREE.InstancedMesh>(null!);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuId, setMenuId] = useState(0);
  const selected = useRef(false);
  const timeEnough = useRef(false);
  const timer = useRef(undefined);
  const vrMenuRef = useRef(null!);

  const client = useClient();
  const selector = useAppSelector;
  const dispatch = useAppDispatch();
  const env = selector(selectUserEnv);
  const user = selector(selectUser);
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
  // const [hover, setHover] = useState<
  //     { pos: THREE.Vector3; id: string } | undefined
  // >(undefined);

  // const nodes = selector(selectNodes);
  const nodesRaw = selector(selectNodesRaw);
  const selectedNodeIds = selector(selectSelectedNodeIds).map((id) => {
    return nodesRaw.findIndex((node) => id === +node.getId());
  });

  const nearby = useRef<any>(null!);
  const nearbyObjects = useRef([]);
  const pickedObjects = useRef<string[]>([]);
  const previousTransform = useMemo(() => new THREE.Matrix4(), []);
  const previousPos = useMemo(() => new THREE.Vector3(), []);
  const grabbingController = useRef<THREE.Object3D>();
  useEffect(() => {
    dispatch(setNodesInstances(ref.current));

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
    const clickedNodes = store.getState().graph.selectedNodeIds.map((id) => {
      return nodesRaw.findIndex((node) => id === +node.getId());
    });

    let instance = ref.current;
    if (instance) {
      instance.count = nodes.length;
      nodes.forEach((node, i) => {
        if (
          pickedObjects.current.includes(`${i}`) &&
          grabbingController.current
        ) {
          instance.getMatrixAt(i, tempM4);
          grabbingController.current.getWorldPosition(temp2);
          tempM4.decompose(tempDP, tempDQ, tempDS);
          ref.current
            .worldToLocal(temp2)
            .sub(ref.current.worldToLocal(previousPos));
          tempM4.setPosition(tempDP.add(temp2));
          instance.setMatrixAt(i, tempM4);

          previousTransform
            .copy(grabbingController.current.matrixWorld)
            .invert();
          grabbingController.current.getWorldPosition(previousPos);
        } else {
          if (nearbyObjects.current[i]) {
            nearby.current.update(
              nearbyObjects.current[i],
              node[0],
              node[1],
              node[2],
              5,
              5,
              5
            );
          } else {
            // console.log(node);

            nearbyObjects.current[i] = nearby.current.createObject(
              `${i}`,
              nearby.current.createBox(node[0], node[1], node[2], 5, 5, 5)
            );
          }

          temp.position.set(node[0], node[1], node[2]);
          temp.updateMatrix();
          instance.setMatrixAt(i, temp.matrix);

          if (clickedNodes.includes(i)) {
            tempColor.set("pink").toArray(colorArray, i * 3);
          } else {
            if (nodesRaw[i]) {
              tempColor
                .set(store.getState().room.color(nodesRaw[i].getCreatedby()))
                .toArray(colorArray, i * 3);
            }
          }
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

    // update menu's scale
    if (vrMenuRef.current) {
      ref.current.getWorldScale(temp2);
      vrMenuRef.current.scale.set(
        (1 / temp2.x) * 2,
        (1 / temp2.y) * 2,
        (1 / temp2.z) * 2
      );
    }
  });

  function sendDeleteNode(id: number) {
    // if (user?.getId() === nodesRaw[id].getCreatedby()) {
    deleteNode(user, +nodesRaw[id].getId());
    // }
  }

  // functions used in the menu
  function menuDeleteNode() {
    sendDeleteNode(menuId);
    setMenuOpen(false);
  }

  function menuDeleteLink() {
    const [n1, n2] = selectedNodeIds.map((id) => nodesRaw[id].getId());
    const targetLink = store.getState().graph.links.find((link) => {
      return (
        (link.source === +n1 && link.target === +n2) ||
        (link.source === +n2 && link.target === +n1)
      );
    });
    if (targetLink?.id) {
      // console.log(targetLinkId);
      deleteLink(user, targetLink?.id);
    } else {
      console.error("no link found between", n1, n2);
    }

    setMenuOpen(false);
  }

  function menuReferToDoc() {
    let target = store.getState().graph.nodesRaw[menuId].getCreatedfrom();

    dispatch(
      setDocumentId(
        store.getState().document.documents.findIndex((d) => d.fileName === target)
      )
    );
    setMenuOpen(false);
  }

  function menuMergeNodes() {
    mergeNodes(user?.getId(), user?.getRoomid());

    // clear selection
    clearNodeSelection(user?.getId());
    setMenuOpen(false);
  }

  function menuNodeHighlight() {
    console.log("highlight");

    sendMessage(
      user?.getId(),
      store.getState().graph.nodesRaw[menuId].getId(),
      BoardcastMessage.Action.HIGHLIGHT
    );
    setMenuOpen(false);
  }

  function menuNodeMove() {
    console.log("move", store.getState().graph.nodesRaw[menuId].getId());

    // display visual cues
    dispatch(setIsMoveNode(store.getState().graph.nodesRaw[menuId].getId()));

    setMenuOpen(false);
  }


  useXREvent("squeezestart", (e) => {
    // let temp = e.target.grip.position;
    temp3.copy(e.target.grip.position);
    ref.current.worldToLocal(temp3);
    // console.log("squeeze", temp3);

    var result = nearby.current.query(temp3.x, temp3.y, temp3.z);
    // console.log(result);

    let res: string[] = [];
    for (var object of result.keys()) {
      temp3.set(object.box.minX, object.box.minY, object.box.minZ);
      temp4.set(object.box.maxX, object.box.maxY, object.box.maxZ);

      ref.current.localToWorld(temp3);
      ref.current.localToWorld(temp4);

      const bbox = new THREE.Box3(temp3, temp4);

      const controllerBBox = new THREE.Box3().setFromObject(
        e.target.grip
      );

      console.log(bbox, controllerBBox, bbox.intersectsBox(controllerBBox));

      if (bbox.intersectsBox(controllerBBox)) {
        console.log(object.id + " is found nearby!");

        res.push(object.id as string);
        e.target.controller.getWorldPosition(previousPos);
        grabbingController.current = e.target.controller;
      }
    }
    pickedObjects.current = res;
  });

  useXREvent("squeezeend", (e) => {
    if (store.getState().user.graphMode == "node") {
      // move node
      const userInfo = store.getState().user.userInfo;
      pickedObjects.current.forEach((id) => {
        ref.current.getMatrixAt(+id, tempM42);
        tempM42.decompose(temp3, new THREE.Quaternion(), new THREE.Vector3());
        if (userInfo) {
          moveNode(userInfo, store.getState().graph.nodesRaw[id].getId(), {
            x: temp3.x,
            y: temp3.y,
            z: temp3.z,
          });
        }
      });
    }

    grabbingController.current = undefined;
    pickedObjects.current = [];
  });

  return (
    // We set the initial count to 100000 to avoid creating a new InstancedMesh
    // If you need more instances than the original count value, you have to create a new InstancedMesh.
    // https://threejs.org/docs/#api/en/objects/InstancedMesh.count
    <>
      <Interactive
        onSelectEnd={(e) => {
          console.log("hello", menuOpen);
          if (!timeEnough.current) {
            sendAction(user?.getId(), e.intersection?.instanceId);
          }
          selected.current = false;
          timeEnough.current = false;
          if (timer.current) {
            clearTimeout(timer.current);
            timer.current = undefined;
          }
        }}
        onSelectStart={(e) => {
          if (!selected.current) {
            console.log("select start");

            timer.current = setTimeout(() => {
              if (selected.current) {
                timeEnough.current = true;
              }
              setMenuOpen(true);
              setMenuId(e.intersection?.instanceId ?? 0);
            }, 1000);
          }
          selected.current = true;
          console.log("start timer");
        }}
      >
        <instancedMesh
          // castShadow
          ref={ref}
          args={[undefined, undefined, 100000]}
          onClick={(e) => sendAction(user?.getId(), e.instanceId)}
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
