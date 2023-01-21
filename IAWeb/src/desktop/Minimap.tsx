import { Box, Card } from "@mui/material";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { Provider, ReactReduxContext } from "react-redux";
import { InitialRequest } from "../common/message_pb";
import Graph from "../features/graph/StaticGraph";
import UserInstances from "../features/room/UsersInstance";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

export default function Minimap({}) {
  const [showed, setShowed] = React.useState(true);

  return (
    <Card
      sx={{
        position: "absolute",
        bottom: 8,
        right: 0,
        zIndex: 16777272,
        overflow: "visible",
        transform: showed ? "translateX(0)" : "translateX(100%)",
        width: "500px",
        height: "500px",
      }}
    >
      <Box
        component="div"
        sx={{
          position: "absolute",
          left: 0,
          top: 500 / 2,
          transform: "translate(-100%, -50%)",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={() => setShowed(!showed)}
      >
        {showed ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
      </Box>
      <ReactReduxContext.Consumer>
        {({ store }) => (
          <Canvas
            style={{
              width: "100%",
              height: "100%",
            }}
            orthographic
            camera={{ far: 50, near: 0.01, zoom: 50, position: [0, 0, 4] }}
          >
            <Provider store={store}>
              <Graph
                dim={InitialRequest.ClientViewType.VIEW_2D}
                scale={[0.005, 0.005, 0.005]}
                showLabels={false}
              />

              <UserInstances
                showCameraPos={false}
                showSelf={true}
              ></UserInstances>
            </Provider>
          </Canvas>
        )}
      </ReactReduxContext.Consumer>
    </Card>
  );
}
