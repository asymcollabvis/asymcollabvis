import { Segments } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useMemo } from "react";
import { useRef } from "react";
import * as THREE from "three";
import { useAppSelector } from "../../hooks";
import store from "../../store";
import { selectUser } from "../user/userSlice";
import { selectUserList } from "./roomSlice";
import UserFrustum from "./UserFrustum";

const tempColor = new THREE.Color();
export default function UserInstances({
  temp = new THREE.Object3D(),
  showCameraPos = true,
  showSelf = false,
  position = [0, 0, 0],
  scale = [1, 1, 1],
}) {
  console.log("rendering user instances");

  const ref = useRef<THREE.InstancedMesh>(null!);
  const selector = useAppSelector;
  const users = selector(selectUserList);
  const user = selector(selectUser);
  const colorMap = selector((state) => state.room.color);

  const [userIds, setUserIds] = React.useState<number[]>([]);
  const colorArray = Float32Array.from(
    users
      .filter((_user) => _user.getId() != user?.getId())
      .flatMap((_user, i) => tempColor.set(colorMap(_user.getId())).toArray())
  );

  useFrame(() => {
    // const user = store.getState().user.userInfo;
    // const users = store.getState().room.userList;

    if (ref.current) {
      ref.current.count = (users ?? []).length - 1;
    }
    // console.log(ref.current.count);

    let i = 0;
    let dirty = false;
    let newUserIds: number[] = [];
    users?.forEach((_user, j) => {
      let id = _user.getId();
      if (id != user?.getId()) {
        let spatialInfo = store.getState().room.userSpatialInfo[id];
        if (spatialInfo) {
          let pos = spatialInfo.getPosition();
          let rot = spatialInfo.getRotation();
          temp.position.set(pos?.getX(), pos?.getY(), pos?.getZ());
          temp.quaternion.set(
            rot?.getX(),
            rot?.getY(),
            rot?.getZ(),
            rot?.getW()
          );
          // console.log(temp.position);

          temp.updateMatrix();
          if (ref.current) {
            ref.current.setMatrixAt(i, temp.matrix);
          }
        }

        newUserIds.push(j);
        // check if the index changed or not
        if (userIds[i] != j) {
          dirty = true;
        }
        i++;
      }
    });

    if (dirty) {
      setUserIds(newUserIds);
    }
    if (ref.current) {
      ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    // We set the initial count to 100000 to avoid creating a new InstancedMesh
    // If you need more instances than the original count value, you have to create a new InstancedMesh.
    // https://threejs.org/docs/#api/en/objects/InstancedMesh.count
    <group scale={scale} position={position} >
    { showCameraPos && (
      <instancedMesh ref={ref} args={[undefined, undefined, 5]}>
        <sphereGeometry args={[0.05, 10, 10]}>
          <instancedBufferAttribute
            attach="attributes-color"
            args={[colorArray, 3]}
          />
        </sphereGeometry>
        <meshBasicMaterial toneMapped={false} vertexColors={true} />
      </instancedMesh>
    )
}

{
  userIds?.map((id) => {
    return <UserFrustum key={id} userIndex={id}></UserFrustum>;
  })
}

{
  showSelf && (
    <UserFrustum
      userIndex={users.findIndex((_user) => _user.getId() == user?.getId())}
      showSelf={true}
    ></UserFrustum>
  )
}
    </group >
  );
}
