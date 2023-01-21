import { OrbitControls, Stats } from "@react-three/drei";
import { DefaultXRControllers, VRCanvas } from "@react-three/xr";
import { Provider, ReactReduxContext } from "react-redux";
import { initConnection, leave } from "../common/client";
import { UserInfo } from "../common/message_pb";
import { setUser, setUserEnv, setUserId } from "../features/user/userSlice";
import { useAppDispatch } from "../hooks";
import { Scene } from "../vr/Scene";
import { useEffect, useRef } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import { viewType } from "../common/graph";

export default function App() {
  console.log("rendering app");

  // const query = useQuery();
  let { roomId, userId, dataset, dim } = useParams();
  dataset = dataset ?? "0";

  const dispatch = useAppDispatch();
  const ref = useRef();

  initConnection(UserInfo.ClientType.VR, dataset, roomId, userId).then(
    (res) => {
      dispatch(setUserEnv(UserInfo.ClientType.VR));
      dispatch(setUser(res));
      dispatch(setUserId(res.getId()));
    }
  );

  useEffect(() => {
    window.addEventListener("beforeunload", () => leave());
  }, []); // mounted

  useEffect(() => {
    document.title = `${roomId} ${userId}`;
  }, [roomId, userId]);

  return (
    <>
      <ReactReduxContext.Consumer>
        {({ store }) => (
          <VRCanvas
            vr="true"
            gl={{ localClippingEnabled: true }}
            // camera={{
            //   position: [0, 0, 0],
            // }}
            camera={{
              far: 50,
              near: 0.01,
            }}
            shadows={true}
          >
            <Provider store={store}>
              <DefaultXRControllers rayMaterial={{ color: "blue" }} />
              <OrbitControls makeDefault ref={ref} />
              {/* <FlyControls makeDefault ref={ref} /> */}
              <Scene dim={viewType(dim)} />
              <Stats />
            </Provider>
          </VRCanvas>
        )}
      </ReactReduxContext.Consumer>
    </>
  );
}
