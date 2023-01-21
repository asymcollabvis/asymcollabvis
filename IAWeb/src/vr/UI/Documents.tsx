import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import { forwardRef } from "react";
import useDocumentList from "../../features/document/useDocumentList";
import store from "../../store";
import DocumentPanel from "./DocumentPanel";
import * as THREE from "three";
import { useDeviceCamera } from "../../common/helper";
import {
  selectDocumentId,
  selectDocuments,
  setDocumentId,
} from "../../features/document/documentSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useClient } from "../../common/client";
import { RequestById } from "../../common/message_pb";
import { selectUser } from "../../features/user/userSlice";
import Grabbable from "../interactions/Grabbable";

export type DocLayoutMode =
  | "horizontal"
  | "curve"
  | "square"
  | "time"
  | "space";

export default function Documents({
  mode = "horizontal",
  offset = 0.1,
  temp = new THREE.Vector3(),
  temp2 = new THREE.Vector3(),
}: {
  mode?: DocLayoutMode;
  offset?: number;
  temp?: THREE.Vector3;
  temp2?: THREE.Vector3;
}) {
  // TODO: useDocumentList too much time deal to changing the currDocId
  // const documents = useDocumentList();
  const dispatch = useAppDispatch();
  const selector = useAppSelector;

  // const user = selector(selectUser);
  const documents = selector(selectDocuments);
  console.log("documents", documents);

  const width = useMemo(() => 0.7, []);
  const height = useMemo(() => 1, []);
  const numDocPerCol = useMemo(() => documents.length / 2, [documents]);
  const getAngle = function () {
    return (Math.PI / 10) * numDocPerCol;
  };

  const positions = React.useMemo(() => {
    const positions: { [key: string]: [number, number, number] } = {};
    if (mode === "horizontal") {
      for (let i = 0; i < documents.length; i++) {
        positions[documents[i].id] = [
          (i - (documents.length - 1) / 2) * (width + offset),
          0,
          0,
        ];
      }
    } else if (mode === "curve") {
      for (let i = 0; i < documents.length; i++) {
        positions[documents[i].id] = [
          Math.cos(
            ((i % numDocPerCol) / (numDocPerCol - 1)) * getAngle() -
              (getAngle() - Math.PI) / 2
          ) * 2,
          Math.floor(i / numDocPerCol) * height +
            0.05,
          -Math.sin(
            ((i % numDocPerCol) / (numDocPerCol - 1)) * getAngle() -
              (getAngle() - Math.PI) / 2
          ) * 2,
        ];
      }
    }
    return positions;
  }, [documents, mode]);

  const rotations = React.useMemo(() => {
    const rotations: { [key: string]: [number, number, number] } = {};
    if (mode === "horizontal") {
      for (let i = 0; i < documents.length; i++) {
        rotations[documents[i].id] = [0, 0, 0];
      }
    } else if (mode === "curve") {
      for (let i = 0; i < documents.length; i++) {
        console.log((i % numDocPerCol), numDocPerCol / 2, 10 / 2, (i % numDocPerCol) - numDocPerCol / 2 + 10 / 2);

        rotations[documents[i].id] = [
          0,
          (((i % numDocPerCol) - numDocPerCol / 2 + 10 / 2) / (10 - 1)) *
            Math.PI - Math.PI / 2,
          0,
        ];
      }
    }
    return rotations;
  }, [documents, mode]);

  const camera = useDeviceCamera();
  const raycaster = useRef(new THREE.Raycaster());
  const docsGroup = useRef<THREE.Group>(null!);
  useFrame(() => {
    // shoot a ray from head and check if it hits document
    camera.getWorldPosition(temp);
    camera.getWorldDirection(temp2);
    raycaster.current.set(temp, temp2);

    const intersects = raycaster.current.intersectObject(
      docsGroup.current,
      true
    );
    // console.log(intersects[0]?.object);

    if (intersects.length > 0) {
      const doc = intersects[0].object.userData.doc;
      // console.log("hit", doc);

      if (doc != undefined) {
        dispatch(setDocumentId(doc));
      }
    }
  });

  return (
    <group ref={docsGroup}>
      {/* <DocumentsManager /> */}
      <CurrentDocumentManger />
      {documents.map((document, i) => (
        <group position={positions[i]} rotation={rotations[i]} key={i}>
          {/* <axesHelper args={[0.5]} /> */}
          {/* {document.using.map((userId, i) => (
            <Sphere position={[i * 0.1, height + 1.1, -1]} scale={0.05}>
              <meshBasicMaterial color={store.getState().room.color(userId)} />
            </Sphere>
          ))} */}
          <DocumentAwarenessVisual
            index={i}
            height={height}
          ></DocumentAwarenessVisual>

          <DocumentPanel
            index={i}
            position={[-(width + offset / 2) / 2, height, 0]}
            width={width}
            height={height}
            fontSize={0.02}
            draggable={false}
            autoHeight={true}
            // anchor="bottom"
            // showTopBar={false}
          />
        </group>
      ))}
    </group>
  );
}

function DocumentAwarenessVisual({ index, height }) {
  const document = useDocumentList()[index];

  return (
    <group>
      {document && document.using &&
        document.using.map((userId, i) => (
          <Sphere key={i} position={[i * 0.1, height + 0.04, 0]} scale={0.04}>
            <meshBasicMaterial color={store.getState().room.color(userId)} />
          </Sphere>
        ))}
    </group>
  );
}

// function DocumentsManager() {
//   const documents = useDocumentList();
//   return <group></group>;
// }

function CurrentDocumentManger() {
  const selector = useAppSelector;
  const currDocId = selector(selectDocumentId);
  const user = selector(selectUser);
  useEffect(() => {
    if (!user) return;

    const client = useClient();
    const request = new RequestById();
    request.setId(`${currDocId}`);
    request.setUserid(user.getId());
    request.setRoomid(user.getRoomid());
    client.updateDocumentState(request, {}, (err, res) => {});
  }, [currDocId]);

  return <group></group>;
}
