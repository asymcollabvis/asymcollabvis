import { useFrame } from "@react-three/fiber";
import { useController } from "@react-three/xr";
import React from "react";

export function useControllerGamepad(handedness: XRHandedness) {
  const controller = useController(handedness);

  const [xClicked, setXClicked] = React.useState(false);
  const [yClicked, setYClicked] = React.useState(false);

  const prevXPressed = React.useRef(false);
  const prevYPressed = React.useRef(false);

  useFrame(() => {
    if (controller) {
      const gamepad = controller.inputSource.gamepad;
      if (gamepad) {
        const buttons = gamepad.buttons;
        // console.log(buttons[5].pressed);
        
        if (buttons[4]) {
          if (prevXPressed.current && !buttons[4].pressed) {
            setXClicked(!xClicked);
          }
          prevXPressed.current = buttons[4].pressed;
        }
        if (buttons[5]) {
          if (prevYPressed.current && !buttons[5].pressed) {
            setYClicked(!yClicked);
          }
          prevYPressed.current = buttons[5].pressed;
        }
      }
    }
  });
  return [xClicked, yClicked];
}
