import { Plane, Text } from "@react-three/drei";
import { Interactive } from "@react-three/xr";
import React, { useState } from "react";
import * as THREE from "three";

export default function Button({
  onClick = (e) => {},
  children,
  position = [0, 0, 0],
  width = 0.05,
  height = 0.01,
  padding = 0.004,
}) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  function handleSelectEnter() {
    setPressed(true);
  }

  function handleSelectEnd(e) {
    setPressed(false);
    setHover(false);
    onClick(e);
  }

  function handleHover() {
    setHover(true);
  }

  function handleBlur() {
    setHover(false);
    setPressed(false);
  }

  function getWidth() {
    return width - padding * 2;
  }

  function getHeight() {
    return height - padding * 2;
  }

  return (
    <Interactive
      onSelectStart={handleSelectEnter}
      onSelectEnd={handleSelectEnd}
      onHover={handleHover}
      onBlur={handleBlur}
    >
      <group
        position={position}
        onPointerEnter={handleHover}
        onPointerLeave={handleBlur}
        onPointerDown={handleSelectEnter}
        onPointerUp={handleSelectEnd}
      >
        <Plane
          position={[getWidth() / 2, -getHeight() / 2, 0]}
          scale={[getWidth(), getHeight(), 0]}
        >
          <meshBasicMaterial
            color={pressed ? "skyblue" : hover ? "hotpink" : "orange"}
            side={THREE.DoubleSide}
          />
        </Plane>
        <Text
          position={[padding, -padding, 0.001]}
          fontSize={0.012}
          color="black"
          anchorX={"left"}
          anchorY={"top"}
          maxWidth={width}
        >
          {children}
        </Text>
      </group>
    </Interactive>
  );
}
