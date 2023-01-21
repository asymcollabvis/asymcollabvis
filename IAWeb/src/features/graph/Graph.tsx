import * as THREE from "three";
import React, { forwardRef } from "react";
import {
  InitialRequest,
} from "../../common/message_pb";
import NodeInstances from "./NodesInstance";
import LinksInstance from "./LinksInstance";
import Labels from "./Labels";
import LinkLabels from "./LinkLabels";
import Cursors from "../../common/Cursors";

let temp = new THREE.Object3D();
export default forwardRef<THREE.Group, {
  dim: InitialRequest.ClientViewType;
  scale?: number[];
  showLabels?: boolean;
}>(({
  scale = [1, 1, 1],
  showLabels = true,
}, ref) => {
  console.log("rendering graph");

  return (
    <group scale={scale} ref={ref}>
      <NodeInstances temp={temp}></NodeInstances>
      {showLabels && <Labels />}
      <LinksInstance></LinksInstance>
      {showLabels && <LinkLabels />}
      <Cursors />
    </group>
  );
})
