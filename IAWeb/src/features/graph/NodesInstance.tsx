import { Box, Button, ButtonGroup, Card, styled } from "@mui/material";
import { Html, Plane, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Interactive } from "@react-three/xr";
import React, { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import * as THREE from "three";
import { sendMessage, useClient } from "../../common/client";
import {
  clearNodeSelection,
  deleteLink,
  deleteNode,
  graphNodeUpdatePos,
  mergeNodes,
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
import { setDocumentId } from "../document/documentSlice";
import {
  selectGraphControl,
  selectUser,
  selectUserEnv,
  setNodesNearbyCursor,
} from "../user/userSlice";
import {
  selectNodes,
  selectNodesRaw,
  selectSelectedNodeIds,
  setIsMoveNode,
  setNodesInstances,
  setSelectedNodeIds,
} from "./graphSlice";
import Labels from "./Labels";
import VRButton from "../../vr/UI/Button";
import * as d3 from "d3";
import { arrayEquals } from "../../common/helper";

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
}: {
  temp?: THREE.Object3D;
  temp2?: THREE.Vector3;
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
  const moving = useRef(false);
  const { camera, viewport } = useThree();

  const client = useClient();
  const selector = useAppSelector;
  const dispatch = useAppDispatch();
  // const { controls } = useThree();
  const controls = selector(selectGraphControl);
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

  useEffect(() => {
    dispatch(setNodesInstances(ref.current));
  }, []); // onmounted

  useFrame(({ mouse }) => {
    const nodes = store.getState().graph.nodes;
    const nodesRaw = store.getState().graph.nodesRaw;

    // skip asyn update
    if (nodesRaw.length != nodes.length) {
      return;
    }

    // voronoi
    const points: [number, number][] = nodes.map((node) => {
      ref.current.localToWorld(temp2.set(node[0], node[1], node[2]));

      const normalizedProjected = temp2.project(camera);

      // console.log(node, normalizedProjected);

      return [normalizedProjected.x, normalizedProjected.y];
    });
    points.push([mouse.x, mouse.y]);
    // console.log(points.slice(0, 10));

    const voronoi = d3.Delaunay.from(points).voronoi([-1, -1, 1, 1]);
    const V = [...voronoi.neighbors(points.length - 1)];
    const cursorPolygon = voronoi.cellPolygon(points.length - 1).slice(0, -1);

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
      // console.log(v, commonEdges);

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
          nodeId: nodesRaw[v]?.getId(),
          weight: 0,
        };
      }

      return {
        nodeId: nodesRaw[v].getId(),
        weight: length / distance,
      };
    });

    // step 5 calculate the weighted average
    const sum = res.reduce((acc, cur) => acc + cur.weight, 0);
    res.forEach((r) => (r.weight /= sum));

    // console.log(res, sum);

    dispatch(setNodesNearbyCursor(res));
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
        store
          .getState()
          .document.documents.findIndex((d) => d.fileName === target)
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

  function menuNodeMove(id = null) {
    console.log("move", store.getState().graph.nodesRaw[id ?? menuId].getId());

    // display visual cues
    dispatch(
      setIsMoveNode(store.getState().graph.nodesRaw[id ?? menuId].getId())
    );

    setMenuOpen(false);
  }

  function drawVRMenu() {
    ref.current.getWorldScale(temp2);
    return (
      <Panel
        scale={[1 / temp2.x, 1 / temp2.y, 1 / temp2.z]}
        position={computeMenuPosition(menuId, [0, -6, 0])}
        showTopBar={false}
        draggable={false}
        height={0.08}
        width={0.12}
        offset={0.022}
        ref={vrMenuRef}
      >
        <VRButton width={0.09} onClick={() => menuReferToDoc()}>
          Go to Document
        </VRButton>
        <VRButton
          onClick={() => {
            menuNodeHighlight();
          }}
        >
          Highlight
        </VRButton>
        <VRButton onClick={menuNodeMove}>Move</VRButton>
        <VRButton onClick={() => menuDeleteNode()}>Delete</VRButton>
        {selectedNodeIds.length > 1 && selectedNodeIds.includes(menuId) && (
          <VRButton width={0.09} onClick={() => menuDeleteLink()}>
            Delete Link
          </VRButton>
        )}
        {selectedNodeIds.length > 1 && selectedNodeIds.includes(menuId) && (
          <VRButton
            onClick={() => {
              menuMergeNodes();
            }}
          >
            Merge
          </VRButton>
        )}
      </Panel>
    );
  }

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
          onPointerDown={(e) => {
            console.log("pointer down", controls);
            if (e.nativeEvent.button != 0) return; // only left click

            if (controls) controls.enabled = false;

            moving.current = true;

            // clickTimeout.current = setTimeout(() => {
            //   menuNodeMove(e.instanceId ?? 0);
            // }, 100);
          }}
          onPointerMove={(e) => {
            console.log("pointer move");

            if (moving.current) {
              menuNodeMove(e.instanceId ?? 0);
            }
          }}
          onPointerLeave={(e) => {
            console.log("pointer leave");
            if (controls) controls.enabled = true;
            // if (clickTimeout.current) {
            //   clearTimeout(clickTimeout.current);
            //   clickTimeout.current = undefined;
            // }
            moving.current = false;
            dispatch(setNodesNearbyCursor([]));
          }}
          onPointerEnter={(e) => {
            if (e.instanceId != undefined) {
              dispatch(
                setNodesNearbyCursor([
                  {
                    nodeId: +nodesRaw[e.instanceId].getId(),
                    weight: 1,
                  },
                ])
              );
            }
          }}
          onPointerUp={(e) => {
            // if (clickTimeout.current) {
            //   clearTimeout(clickTimeout.current);
            //   clickTimeout.current = undefined;
            // }

            moving.current = false;

            // right click
            if (e.nativeEvent.button == 2) {
              setMenuOpen(true);
              setMenuId(e.instanceId ?? 0);
            }
          }}
          onClick={(e) => sendAction(user?.getId(), e.instanceId)}
          // onContextMenu={(e) => {
          //   // console.log(e);
          //   setMenuOpen(true);
          //   setMenuId(e.instanceId ?? 0);
          // }}
          // onContextMenu={(e) => sendDeleteNode(e.instanceId)}
          // onPointerMove={(e) => {
          //     console.log("over")
          //     setHover({
          //         pos: e.point,
          //         id: e.instanceId.toString(),
          //     });
          // }}
          // onPointerOut={(e) => {
          //     setHover(undefined);
          // }}
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

      {menuOpen && env == UserInfo.ClientType.DESKTOP && (
        <Html
          position={computeMenuPosition(menuId)}
          // distanceFactor={0.002}
          zIndexRange={[16777272, 16777272]}
          onPointerMissed={() => setMenuOpen(false)}
        >
          <Box
            component={"div"}
            sx={{
              width: "150px",
            }}
          >
            <ButtonGroup
              orientation="vertical"
              variant="contained"
              aria-label="vertical outlined button group"
            >
              <BootstrapButton
                onClick={() => {
                  menuReferToDoc();
                }}
              >
                Go to document
              </BootstrapButton>
              {/* <BootstrapButton
                onClick={() => {
                  menuNodeHighlight();
                }}
              >
                Highlight
              </BootstrapButton> */}
              {/* <BootstrapButton
                onClick={(e) => {
                  e.stopPropagation();
                  menuNodeMove();
                }}
              >
                Move
              </BootstrapButton> */}
              <BootstrapButton
                onClick={() => {
                  menuDeleteNode();
                }}
              >
                Delete
              </BootstrapButton>

              {selectedNodeIds.length > 1 && selectedNodeIds.includes(menuId) && (
                <BootstrapButton
                  onClick={() => {
                    menuDeleteLink();
                  }}
                >
                  Delete Link
                </BootstrapButton>
              )}
              {selectedNodeIds.length > 1 && selectedNodeIds.includes(menuId) && (
                <BootstrapButton
                  onClick={() => {
                    menuMergeNodes();
                  }}
                >
                  Merge
                </BootstrapButton>
              )}
            </ButtonGroup>
          </Box>
        </Html>
      )}

      {menuOpen && env == UserInfo.ClientType.VR && drawVRMenu()}
    </>

    /* <group position={hover?.pos.setX(hover.pos.x + 5).setZ(hover.pos.z + 5)}>
                {
                    hover?.id && nodesRaw[+hover?.id].getData() && <Html style={{ width: 300, backgroundColor: "white", padding: 4 }}>{nodesRaw[+hover.id].getData()}</Html>
                }
            </group> */
  );
}
