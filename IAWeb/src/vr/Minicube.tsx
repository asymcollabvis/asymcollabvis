import { Box, Plane, useHelper } from "@react-three/drei";
import React, { forwardRef, useRef } from "react";
import UserInstances from "../features/room/UsersInstance";
import InteractiveGraph from "./InteractiveGraph";
import * as THREE from "three";
import Graph from "../features/graph/StaticGraph";
import { InitialRequest } from "../common/message_pb";
import { useFrame } from "@react-three/fiber";
import { useXR } from "@react-three/xr";
import { boxGeometry } from "./shared";

const boxGeoWithSize4 = new THREE.BoxGeometry(4, 4, 4);
export default forwardRef<THREE.Group, {}>(({}, ref) => {
  console.log("rendering minicube");
  const [showed, setShowed] = React.useState(true);
  const prevPressed = useRef(false);

  const { session } = useXR();
  const groupRef = useRef<THREE.Group>(null!);

  // useHelper(groupRef, THREE.BoxHelper, "black");

  useFrame(() => {
    if (session) {
      session.inputSources?.forEach((source) => {
        if (source.handedness === "left") {
          let gamepad = source.gamepad;
          if (gamepad) {
            let buttons = gamepad.buttons;
            // Press end to show/hide minicube
            if (buttons[4]) {
              if (prevPressed.current && !buttons[4].pressed) {
                setShowed(!showed);
              }
              prevPressed.current = buttons[4].pressed;
            }
          }
        }
      });
    }
  });

  return (
    <group ref={ref} scale={[0.1, 0.1, 0.1]} visible={showed}>
      {/* {showed && ( */}
        <group>
          <lineSegments raycast={() => null}>
            <edgesGeometry args={[boxGeoWithSize4]} />
            <lineBasicMaterial color="black" />
          </lineSegments>

          <group ref={groupRef}>
            {/* <lineSegments raycast={() => null}>
              <edgesGeometry args={[boxGeometry]} />
              <lineBasicMaterial transparent opacity={0.2} color={"grey"} />
            </lineSegments> */}
            <Graph
              scale={[0.005, 0.005, 0.005]}
              dim={InitialRequest.ClientViewType.VIEW_3D}
              showLabels={false}
            />
          </group>
          <UserInstances showSelf={true} />
        </group>
      {/* )} */}
    </group>
  );
});
