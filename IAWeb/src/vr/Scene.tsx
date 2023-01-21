import React, { useCallback, useEffect, useRef, useState } from "react";
import { useController, useXR } from "@react-three/xr";
import { useFrame, useThree } from "@react-three/fiber";
import { Plane, Sky, Sphere, Text, useHelper } from "@react-three/drei";
import { InitialRequest } from "../common/message_pb";
import { useAppDispatch, useAppSelector } from "../hooks";
import { selectUser } from "../features/user/userSlice";
import TeleportArea from "./interactions/TeleportArea";
import { pushStatus, useClient } from "../common/client";
import * as THREE from "three";
import useRoomStream from "../common/useRoomStream";
import UserList from "./UI/UserList";
import InteractiveGraph from "./EmbodiedInteractiveGraph";
import Panel from "./UI/Panel";
import Minicube from "./Minicube";
import * as _ from "lodash";
import NodeCreator from "./NodeCreator";
import VisualGuide from "../common/VisualGuide";
import { selectSelectedText } from "../features/document/documentSlice";
import UserInstances from "../features/room/UsersInstance";
import { selectIsMoveNode, setGraph } from "../features/graph/graphSlice";
import DocumentCombinedPanel from "./UI/DocumentCombinedPanel";
import Label from "./UI/Label";
import { useControllerGamepad } from "./interactions/useControllerGamepad";
import UserMenu from "./UI/UserMenu";
import Documents from "./UI/Documents";

export function Scene({
  dim,
  temp = new THREE.Vector3(),
  temp2 = new THREE.Vector3(),
  tempQuat = new THREE.Quaternion(),
  tempStatusVector = new THREE.Vector3(),
  tempStatusQuat = new THREE.Quaternion(),
}: {
  dim: InitialRequest.ClientViewType;
  temp?: THREE.Vector3;
  temp2?: THREE.Vector3;
  tempQuat?: THREE.Quaternion;
  tempStatusVector?: THREE.Vector3;
  tempStatusQuat?: THREE.Quaternion;
}) {
  console.log("rendering scene");

  const { session } = useXR();

  const selector = useAppSelector;
  const dispatch = useAppDispatch();
  const user = selector(selectUser);
  const graphRef = useRef<THREE.Group>(null!);
  const docRef = useRef<THREE.Group>(null!);
  const arrowRef = useRef<THREE.Group>(null!);
  // const selectedText = selector(selectSelectedText);

  const client = useClient();
  const { player } = useXR();
  const { camera, gl } = useThree();
  // const cameraRef = useRef(camera);
  // const cameraHelper = useHelper(cameraRef, CameraHelper);
  // cameraHelper.current.visible = false;
  // if (cameraHelper.current) {
  //   cameraHelper.current.visible = false;
  // }
  // console.log(cameraHelper.current);
  const leftController = useController("left");
  const minicubeRef = useRef<THREE.Group>(null!);
  const isMoveNode = selector(selectIsMoveNode);

  const interval = useRef<NodeJS.Timer>();

  // useHelper(
  //   graphRef,
  //   THREE.BoxHelper,
  //   selectedText || isMoveNode ? "green" : "black"
  // );

  const delayRotateRight = useCallback(
    _.throttle(
      () => {
        player.rotation.y -= Math.PI / 4;
      },
      500,
      { trailing: false }
    ),
    []
  );

  const delayRotateLeft = useCallback(
    _.throttle(
      () => {
        player.rotation.y += Math.PI / 4;
      },
      500,
      { trailing: false }
    ),
    []
  );

  useRoomStream(dim);

  // const [ready, setReady] = useState(false);
  // useEffect(() => {
  //   if (graphRef.current && !ready) {
  //     // hack to make sure the graph is loaded
  //     setTimeout(() => {
  //       setReady(true);
  //     }, 1000);
  //     console.log("ready", graphRef.current);

  //   }
  // })

  useEffect(() => {
    interval.current = setInterval(() => {
      let _camera = gl.xr.isPresenting ? gl.xr.getCamera() : camera;
      // push user info to server
      pushStatus(
        user,
        _camera,
        graphRef.current,
        docRef.current,
        tempStatusVector,
        tempStatusQuat
      );
    }, (1 / 10) * 1000); // 10 times per second

    return () => {
      clearInterval(interval.current);
    };
  }, []);

  useEffect(() => {
    dispatch(setGraph(graphRef.current));
  });

  useEffect(() => {
    console.log("sessoion", session);
    if (session) {
      if (interval.current) {
        clearInterval(interval.current);
      }

      interval.current = setInterval(() => {
        let _camera = gl.xr.isPresenting ? gl.xr.getCamera() : camera;
        // push user info to server
        pushStatus(
          user,
          _camera,
          graphRef.current,
          docRef.current,
          tempStatusVector,
          tempStatusQuat
        );
      }, (1 / 10) * 1000);
    } else {
      clearInterval(interval.current);
    }
  }, [session]);

  useFrame(() => {
    let _camera = gl.xr.isPresenting ? gl.xr.getCamera() : camera;

    // push user info to server
    // pushStatus(
    //   user,
    //   _camera,
    //   graphRef.current
    // );
    // console.log(leftController);

    // locate minicube
    if (leftController) {
      leftController.controller.getWorldDirection(temp);
      let pos = leftController.controller
        .getWorldPosition(temp2)
        .add(temp.multiplyScalar(-0.2));
      leftController.controller.getWorldQuaternion(tempQuat);
      if (minicubeRef.current) {
        minicubeRef.current.position.copy(pos);
        minicubeRef.current.quaternion.copy(tempQuat);
      }
    }

    // camera rotation
    // console.log(leftController?.inputSource.gamepad?.axes[2]);
    // let gamepad = leftController?.inputSource.gamepad;
    // if (gamepad) {
    //   if (gamepad.axes[2] > 0.5) {
    //     delayRotateRight();
    //   } else if (gamepad.axes[2] < -0.5) {
    //     delayRotateLeft();
    //   } else {
    //     delayRotateRight.cancel();
    //     delayRotateLeft.cancel();
    //   }
    // }

    // update arrow position
    _camera.getWorldDirection(temp);
    _camera.getWorldPosition(temp2);
    arrowRef.current.position.copy(temp.multiplyScalar(1).add(temp2));
  });

  return (
    <>
      {/* <TeleportArea> */}
      <Plane
        position={[0, 0, 0]}
        scale={[4, 4, 1]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="grey" />
      </Plane>
      {/* </TeleportArea> */}
      <Sky />
      <ambientLight intensity={0.5} />
      <directionalLight
        shadow-mapSize-width={1024}
        position={[-2.5, 8, -5]}
        intensity={1}
        shadow-mapSize-height={512}
        castShadow
      />

      <InteractiveGraph
        ref={graphRef}
        position={[0, 2, 0]}
        scale={[0.004, 0.004, 0.004]}
        movable={false}
        fixed={true}
      ></InteractiveGraph>

      {/* <RoomList position={[-0.5, 2, -0.5]}></RoomList> */}
      {/* <Box receiveShadow castShadow></Box> */}
      {user && user.getRoomid() && (
        <>
          <UserList
            position={[-0.6, 1.6, 1]}
            rotation={[0, Math.PI, 0]}
          ></UserList>
          <Panel
            position={[-0.8, 1.6, 1]}
            rotation={[0, Math.PI, 0]}
            title={"Task"}
            width={0.5}
            height={0.05}
          >
            <Text
              fontSize={0.014}
              color="black"
              anchorX={"left"}
              anchorY={"top"}
              maxWidth={0.5}
            >
              You have been asked to pursue a line of investigation into ONE
              unexpected illegal activity against wildlife. Explore and figure
              out whos, whats, wheres, whens, whys, and hows.
            </Text>
          </Panel>
          {/* <DocumentCombinedPanel ref={docRef}></DocumentCombinedPanel> */}
          <Documents mode="curve" />
        </>
      )}

      {/* {ready && <NodeCreator graph={graphRef.current} />} */}
      <NodeCreator />

      {/* <Minicube ref={minicubeRef} /> */}

      <VisualGuide ref={arrowRef} graph={() => graphRef.current} />
      {/* {leftController && <Minicube minicubeRef={minicubeRef} />} */}
      <UserInstances position={[0, 2, 0]}></UserInstances>

      <ControllerTutorial></ControllerTutorial>

      {/* <UserMenu /> */}
    </>
  );
}

const leftcontrollerButtons = {
  xr_standard_trigger_pressed_value: {
    label: "Select objects",
    offset: [0, 0, -20],
    position: [0, -0.02, 0],
  },
  xr_standard_squeeze_pressed_value: {
    label: "Grab objects",
    offset: [20, 0, 0],
    position: [0, -0.06, 0],
  },
  // xr_standard_thumbstick_pressed_value: {
  //   label: "Rotate",
  //   offset: [0, 20, 0],
  // },
  // x_button_pressed_value: {
  //   label: "Show/Hide MiniCube",
  //   offset: [20, 20, 0],
  // },
  y_button_pressed_value: {
    label: "Show/Hide Help Menu",
    offset: [20, 20, 0],
  },
  // "y_button_pressed_value",
};
const rightcontrollerButtons = {
  xr_standard_trigger_pressed_value: {
    label: "Select objects",
    offset: [0, 0, 20],
    position: [0, 0.02, 0],
  },
  xr_standard_squeeze_pressed_value: {
    label: "Grab objects",
    offset: [-20, 0, 0],
    position: [0, 0.06, 0],
  },
  // "xr_standard_thumbstick_pressed_value",
  // "a_button_pressed_value",
  // "b_button_pressed_value",
};

function ControllerTutorial({
  temp = new THREE.Vector3(),
  quat = new THREE.Quaternion(),
}) {
  console.log("ControllerTutorial");

  const leftController = useController("left");
  const rightController = useController("right");

  const leftButtonsRefs = useRef<{ [key: string]: THREE.Group | null }>({});
  const rightButtonsRefs = useRef<{ [key: string]: THREE.Group | null }>({});

  const leftButtons = useRef<{ [key: string]: THREE.Group }>({});
  const rightButtons = useRef<{ [key: string]: THREE.Group }>({});

  // const [show, setShow] = useState(true);

  const [xClicked, yClicked] = useControllerGamepad("left");

  useFrame(() => {
    // if (leftController?.inputSource.gamepad?.buttons[5].pressed) setShow(!show);
    Object.keys(leftcontrollerButtons).forEach((button) => {
      // console.log(leftButtonsRefs.current[button]);

      // if (
      //   leftButtons[button] == undefined ||
      //   leftController?.getObjectByName(button) != leftButtons[button]
      // ) {
      // console.log(`left ${button} not ready`);
      leftButtons[button] = leftController?.getObjectByName(button);
      if (leftButtons[button]) {
        leftButtons[button].getWorldPosition(temp);
        leftButtons[button].getWorldQuaternion(quat);
        leftButtonsRefs.current[button]?.position.copy(temp);
        leftButtonsRefs.current[button]?.quaternion.copy(quat);
      }
      // leftButtons[button]?.add(leftButtonsRefs.current[button]);
      // }
    });
    Object.keys(rightcontrollerButtons).forEach((button) => {
      // }
      // if (
      //   rightButtons[button] == undefined ||
      //   rightController?.getObjectByName(button) != rightButtons[button]
      // ) {
      // console.log(`right ${button} not ready`);
      rightButtons[button] = rightController?.getObjectByName(button);
      if (rightButtons[button]) {
        rightButtons[button].getWorldPosition(temp);
        rightButtons[button].getWorldQuaternion(quat);
        rightButtonsRefs.current[button]?.position.copy(temp);
        rightButtonsRefs.current[button]?.quaternion.copy(quat);
      }
      // rightButtons[button]?.add(rightButtonsRefs.current[button]);
      // }
      // leftController?.getObjectByName(button)?.add(leftButtonsRefs.current[button]);
      // rightController?.getObjectByName(button)?.add(rightButtonsRefs.current[button]);
    });
  });

  useEffect(() => {
    console.log(rightController);

    // controllerButtons.forEach((button) => {
    //   // console.log(leftButtonsRefs.current[button]);

    //   leftController?.getObjectByName(button)?.add(leftButtonsRefs.current[button]);
    //   rightController?.getObjectByName(button)?.add(rightButtonsRefs.current[button]);
    // });

    // leftController?.grip.add(ref.current);
  });

  return (
    <>
      {Object.keys(leftcontrollerButtons).map((button, i) => (
        <group
          ref={(el) => (leftButtonsRefs.current[button] = el)}
          key={`left${i}`}
        >
          <group
            visible={!yClicked}
            position={leftcontrollerButtons[button].position}
          >
            <Label offset={leftcontrollerButtons[button].offset} maxWidth={1}>
              {leftcontrollerButtons[button].label}
            </Label>
          </group>
        </group>
      ))}
      {Object.keys(rightcontrollerButtons).map((button, i) => (
        <group
          key={`right${i}`}
          ref={(el) => (rightButtonsRefs.current[button] = el)}
        >
          <group
            visible={!yClicked}
            position={rightcontrollerButtons[button].position}
          >
            <Label offset={rightcontrollerButtons[button].offset} maxWidth={1}>
              {rightcontrollerButtons[button].label}
            </Label>
          </group>
        </group>
      ))}
    </>
  );
}
