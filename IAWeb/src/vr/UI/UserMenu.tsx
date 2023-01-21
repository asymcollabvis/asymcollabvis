import { useFrame } from "@react-three/fiber";
import { useController } from "@react-three/xr";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { selectGraphMode, setGraphMode } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Button from "./Button";
import Panel from "./Panel";
import {Text} from "@react-three/drei"

export default function UserMenu({
  temp = new THREE.Vector3(),
  tempQuat = new THREE.Quaternion(),
}) {
  const leftController = useController("left");
  const ref = useRef<THREE.Group>(null!);

  const width = 0.1;
  const height = 0.1;
  const selector = useAppSelector;
  const dispatch = useAppDispatch();
  const graphMode = selector(selectGraphMode);

  //   useFrame(() => {
  //     if (leftController) {
  //       leftController.controller.getWorldPosition(temp);
  //       leftController.controller.getWorldQuaternion(tempQuat);

  //       temp.x +=
  //       temp.y += height;

  //       ref.current.position.copy(temp);
  //       ref.current.quaternion.copy(tempQuat);
  //     }
  //   });

  useEffect(() => {
    leftController?.controller.add(ref.current);
  }, [leftController]);

  return (
    <Panel
      title="Select Mode"
      draggable={false}
      ref={ref}
      width={width}
      height={height}
      position={[-width / 2, height + 0.05, -0.05]}
      offset={height / 3}
    >
      <Text maxWidth={width} color="black">{graphMode}</Text>
      <Button width={width} height={height / 3} onClick={() => dispatch(setGraphMode("move"))}>
        Move
      </Button>
      <Button width={width} height={height / 3} onClick={() => dispatch(setGraphMode("node"))}>
        Node
      </Button>
      <Button width={width} height={height / 3} onClick={() => dispatch(setGraphMode("link"))}>
        Link
      </Button>
    </Panel>
  );
}
