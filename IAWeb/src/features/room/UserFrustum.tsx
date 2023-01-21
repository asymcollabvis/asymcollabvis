import { Segments, Segment, Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector } from "../../hooks";
import store from "../../store";
import { selectUser } from "../user/userSlice";
import { selectUserList } from "./roomSlice";
import * as THREE from "three";

function setLine(line, start, end) {
  // console.log(start);

  line.start.set(start.x, start.y, start.z);
  line.end.set(end.x, end.y, end.z);
}

const _planes = [
  [-1, 0, 0, 2],
  [1, 0, 0, 2],
  [0, -1, 0, 2],
  [0, 1, 0, 2],
  [0, 0, -1, 2],
  [0, 0, 1, 2],
].map((v) => new THREE.Plane(new THREE.Vector3(v[0], v[1], v[2]), v[3]));
export default function UserFrustum({
  userIndex,
  showSelf = false,
  temp = new THREE.Vector3(),
}: {
  userIndex: number;
  showSelf?: boolean;
  temp?: THREE.Vector3;
}) {
  console.log("rendering user frustum");
  const ref = useRef<THREE.Object3D>();
  const [planes] = useState(() =>
    [
      [-1, 0, 0, 2],
      [1, 0, 0, 2],
      [0, -1, 0, 2],
      [0, 1, 0, 2],
      [0, 0, -1, 2],
      [0, 0, 1, 2],
    ].map((v) => new THREE.Plane(new THREE.Vector3(v[0], v[1], v[2]), v[3]))
  );

  const n1 = useRef();
  const n2 = useRef();
  const n3 = useRef();
  const n4 = useRef();

  const f1 = useRef();
  const f2 = useRef();
  const f3 = useRef();
  const f4 = useRef();

  const s1 = useRef();
  const s2 = useRef();
  const s3 = useRef();
  const s4 = useRef();

  const headRayRef = useRef();

  const user = useAppSelector(selectUserList)[userIndex];
  const color = showSelf
    ? "black"
    : useAppSelector((state) => state.room.color(user?.getId()));

  useFrame(() => {
    let usersInRoom = store.getState().room.userList;
    if (usersInRoom) {
      const user = usersInRoom[userIndex];
      if (user) {
        const frustum = store.getState().room.userFrustum[user.getId()];
        if (frustum) {
          let posN1 = frustum.getN1()?.toObject();
          let posN2 = frustum.getN2()?.toObject();
          let posN3 = frustum.getN3()?.toObject();
          let posN4 = frustum.getN4()?.toObject();


          let posF1 = frustum.getF1()?.toObject();
          let posF2 = frustum.getF2()?.toObject();
          let posF3 = frustum.getF3()?.toObject();
          let posF4 = frustum.getF4()?.toObject();

          // console.log(posN1);

          setLine(n1.current, posN1, posN2);
          setLine(n2.current, posN2, posN3);
          setLine(n3.current, posN3, posN4);
          setLine(n4.current, posN4, posN1);

          setLine(f1.current, posF1, posF2);
          setLine(f2.current, posF2, posF3);
          setLine(f3.current, posF3, posF4);
          setLine(f4.current, posF4, posF1);

          setLine(s1.current, posN1, posF1);
          setLine(s2.current, posN2, posF2);
          setLine(s3.current, posN3, posF3);
          setLine(s4.current, posN4, posF4);

          vertices.set([
            posF2.x, posF2.y, posF2.z,
            posN2.x, posN2.y, posN2.z,
            posN1.x, posN1.y, posN1.z,

            posN1.x, posN1.y, posN1.z,
            posF1.x, posF1.y, posF1.z,
            posF2.x, posF2.y, posF2.z,

            posF3.x, posF3.y, posF3.z,
            posN3.x, posN3.y, posN3.z,
            posN2.x, posN2.y, posN2.z,
            
            posN2.x, posN2.y, posN2.z,
            posF2.x, posF2.y, posF2.z,
            posF3.x, posF3.y, posF3.z,

            posF4.x, posF4.y, posF4.z,
            posN4.x, posN4.y, posN4.z,
            posN3.x, posN3.y, posN3.z,
            
            posN3.x, posN3.y, posN3.z,
            posF3.x, posF3.y, posF3.z,
            posF4.x, posF4.y, posF4.z,

            posF1.x, posF1.y, posF1.z,
            posN1.x, posN1.y, posN1.z,
            posN4.x, posN4.y, posN4.z,
            
            posN4.x, posN4.y, posN4.z,
            posF4.x, posF4.y, posF4.z,
            posF1.x, posF1.y, posF1.z,
          ]);
          meshRef.current.geometry.attributes.position.needsUpdate = true;
        }

        let spatialInfo = store.getState().room.userSpatialInfo[user.getId()];
        if (spatialInfo) {
          let pos = spatialInfo.getPosition()?.toObject();
          let rot = spatialInfo.getRotation();
          let quaternion = new THREE.Quaternion(
            rot?.getX(),
            rot?.getY(),
            rot?.getZ(),
            rot?.getW()
          );
          let dir = new THREE.Vector3(0, 0, -50).applyQuaternion(quaternion);

          setLine(headRayRef.current, pos, {
            x: pos.x + dir.x,
            y: pos.y + dir.y,
            z: pos.z + dir.z,
          });
        }
      }
    }

    // console.log(planes);
    for (let i = 0; i < planes.length; i++) {
      const p = ref.current.material.clippingPlanes[i];
      ref.current?.getWorldScale(temp);
      // const constant = 4 * temp.x;
      p.copy(_planes[i]);
      p.applyMatrix4(ref.current.matrixWorld);
      // console.log(p);

      // p.constant = constant;
    }

    // console.log(ref.current.matrixWorld);
    // console.log(ref.current.material.clippingPlanes);
  });

  // useEffect(() => {
  //   setPlanes(
  //     planes.map((p) => {
  //       // console.log(p.distanceToPoint(ref.current.position));
  //       ref.current?.getWorldScale(temp);
  //       const constant = 4 * temp.x;
  //       p.applyMatrix4(ref.current.matrixWorld);
  //       // console.log(p.distanceToPoint(ref.current.position));

  //       p.constant = constant;
  //       console.log(p.constant);

  //       return p;
  //     })
  //   );

  //   console.log(planes);
  // }, []);

  const meshRef = useRef<THREE.Mesh>(null!);
  const vertices = useMemo(() => new Float32Array([
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,

    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0,
  ]), []);

  return (
    <>
      <mesh ref={meshRef} >
        <bufferGeometry>
          <bufferAttribute
            attach={"attributes-position"}
            args={[vertices, 3]}
          />
        </bufferGeometry>
        <meshBasicMaterial transparent opacity={0.15} color={color} clippingPlanes={planes} depthWrite={false}/>

      </mesh>
      <Segments ref={ref} limit={13} lineWidth={0.5} clippingPlanes={planes}>
        <Segment
          ref={n1}
          start={[0, 0, 0]}
          end={[0, 0, 0]}
          color={color}
        ></Segment>
        <Segment
          ref={n2}
          start={[0, 0, 0]}
          end={[0, 0, 0]}
          color={color}
        ></Segment>
        <Segment
          ref={n3}
          start={[0, 0, 0]}
          end={[0, 0, 0]}
          color={color}
        ></Segment>
        <Segment
          ref={n4}
          start={[0, 0, 0]}
          end={[0, 0, 0]}
          color={color}
        ></Segment>

        <Segment
          ref={f1}
          start={[0, 0, 0]}
          end={[0, 0, 0]}
          color={color}
        ></Segment>
        <Segment
          ref={f2}
          start={[0, 0, 0]}
          end={[0, 0, 0]}
          color={color}
        ></Segment>
        <Segment
          ref={f3}
          start={[0, 0, 0]}
          end={[0, 0, 0]}
          color={color}
        ></Segment>
        <Segment
          ref={f4}
          start={[0, 0, 0]}
          end={[0, 0, 0]}
          color={color}
        ></Segment>

        <Segment
          ref={s1}
          start={[0, 0, 0]}
          end={[0, 0, 0]}
          color={color}
        ></Segment>
        <Segment
          ref={s2}
          start={[0, 0, 0]}
          end={[0, 0, 0]}
          color={color}
        ></Segment>
        <Segment
          ref={s3}
          start={[0, 0, 0]}
          end={[0, 0, 0]}
          color={color}
        ></Segment>
        <Segment
          ref={s4}
          start={[0, 0, 0]}
          end={[0, 0, 0]}
          color={color}
        ></Segment>

        <Segment
          ref={headRayRef}
          start={[0, 0, 0]}
          end={[0, 0, 0]}
          color={color}
        ></Segment>
      </Segments>
    </>

  );
}
