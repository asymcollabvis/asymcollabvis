import { Plane, Text } from "@react-three/drei";
import React from "react";
import { selectUserList } from "../../features/room/roomSlice";
import { useAppSelector } from "../../hooks";
import store from "../../store";
import Panel from "./Panel";
import * as THREE from "three";
import { selectUser } from "../../features/user/userSlice";

export default function UserList({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  console.log("UserList");

  const selector = useAppSelector;
  const users = selector(selectUserList);
  const user = selector(selectUser);

  const width = 0.13;
  const height = 0.01;
  const padding = 0.005;

  function getWidth() {
    return width + padding * 2;
  }

  function getHeight() {
    return height + padding * 2;
  }

  return (
    <Panel
      rotation={rotation}
      position={position}
      offset={getHeight() + 0.002}
      title={"User List Panel"}
      width={0.14}
      height={0.1}
    >
      {users &&
        users.map((_user, i) => (
          <group key={i}>
            <Plane
              position={[getWidth() / 2, -getHeight() / 2, 0]}
              scale={[getWidth(), getHeight(), 0]}
            >
              <meshBasicMaterial
                color={store.getState().room.color(_user.getId())}
                side={THREE.DoubleSide}
              ></meshBasicMaterial>
            </Plane>

            <Text
              position={[0.004, 0, 0.001]}
              fontSize={0.014}
              color="black"
              anchorX={"left"}
              anchorY={"top"}
            >
              {`${_user.getId()}${
                user?.getId() == _user.getId() ? " (you)" : ""
              }`}
            </Text>
          </group>
        ))}
    </Panel>
  );
}
