import { Box, Button, Container, Stack, TextField } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function App() {
  const [xrSupported, setXrSupported] = React.useState(false);

  const [roomId, setRoomId] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [dataset, setDataset] = React.useState("0");

  async function checkForXRSupport() {
    // Check to see if there is an XR device available that supports immersive VR
    // presentation (for example: displaying in a headset). If the device has that
    // capability the page will want to add an "Enter VR" button to the page (similar to
    // a "Fullscreen" button) that starts the display of immersive VR content.

    navigator.xr?.isSessionSupported("immersive-vr").then((supported) => {
      console.log("VR Supported: " + supported);

      setXrSupported(supported);
    });
  }

  useEffect(() => {
    checkForXRSupport();
  }, []);

  return (
    <Box
      component="div" // fix TS-error: refer to https://stackoverflow.com/questions/68692230/ts-expression-produces-a-union-type-that-is-too-complex-to-represent-with-materi
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Stack direction="column" spacing={2}>
        <TextField
          label="User ID"
          variant="standard"
          helperText="Enter the Room ID given."
          onChange={(e) => setUserId(e.target.value)}
        />
        <TextField
          label="Room ID"
          variant="standard"
          helperText="Enter the Room ID given."
          onChange={(e) => setRoomId(e.target.value)}
        />
        <TextField
          label="Dataset ID"
          variant="standard"
          helperText="Enter the Room ID given."
          onChange={(e) => setDataset(e.target.value)}
        />
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            component={Link}
            to={`/desktop/2d/${dataset}/${roomId}/${userId}`}
          >
            Desktop 2D
          </Button>
          {/* <Button
            variant="contained"
            component={Link}
            to={`/desktop/3d/${dataset}/${roomId}/${userId}`}
          >
            Desktop 3D
          </Button> */}
        </Stack>
        <Stack direction="row" spacing={2}>
          {/* <Button
            variant="contained"
            component={Link}
            to={`/vr/2d/${dataset}/${roomId}/${userId}`}
            // disabled={!xrSupported}
            color={xrSupported ? "primary" : "error"}
          >
            VR 2D
          </Button> */}
          <Button
            variant="contained"
            component={Link}
            to={`/vr/3d/${dataset}/${roomId}/${userId}`}
            // disabled={!xrSupported}
            color={xrSupported ? "primary" : "error"}
          >
            VR 3D
          </Button>
        </Stack>
        {!xrSupported && (
          <div>
            VR not found, but you can try the simulated 3D environment in the
            browser.
          </div>
        )}
      </Stack>
    </Box>
  );
}
