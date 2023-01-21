import { Frustum, Position, Rotation, Scale, SpatialInfo } from "./message_pb";
import * as THREE from "three";

function cameraToWorld(
  camera: THREE.Camera,
  x: number,
  y: number,
  z: number,
  tempVector = new THREE.Vector3()
) {
  return tempVector.set(x, y, z).unproject(camera).clone();
}

function calculateFrustum(
  camera: THREE.Camera,
  tempVector = new THREE.Vector3()
) {
  const n1 = cameraToWorld(camera, -1, -1, -1, tempVector);
  const n2 = cameraToWorld(camera, 1, -1, -1, tempVector);
  const n3 = cameraToWorld(camera, 1, 1, -1, tempVector);
  const n4 = cameraToWorld(camera, -1, 1, -1, tempVector);
  const f1 = cameraToWorld(camera, -1, -1, 1, tempVector);
  const f2 = cameraToWorld(camera, 1, -1, 1, tempVector);
  const f3 = cameraToWorld(camera, 1, 1, 1, tempVector);
  const f4 = cameraToWorld(camera, -1, 1, 1, tempVector);
  return [n1, n2, n3, n4, f1, f2, f3, f4];
}

// const tempVector = new THREE.Vector3();
// const tempQuaternion = new THREE.Quaternion();
export function computeUserSpatialInfo(
  camera: THREE.Camera,
  graph?: THREE.Object3D,
  tempVector = new THREE.Vector3(),
  tempQuaternion = new THREE.Quaternion()
) {
  let spatialInfo = new SpatialInfo();
  let pos = new Position();
  camera.getWorldPosition(tempVector);

  if (graph) {
    graph.worldToLocal(tempVector);
    tempVector.multiplyScalar(0.005); // scale down the position

    // refer to https://github.com/mrdoob/three.js/pull/20243/commits/5b320ad88c2f8683c9d5069d7e32296b914e29b0
    tempQuaternion.copy(
      camera
        .getWorldQuaternion(tempQuaternion)
        .clone()
        .premultiply(graph.getWorldQuaternion(tempQuaternion).invert())
    );
    // console.log(tempQuaternion);

    // tempQuaternion.multiplyQuaternions(
    //     camera.quaternion.clone().invert(),
    //   graph.quaternion,
    // );
  }
  pos.setX(tempVector.x);
  pos.setY(tempVector.y);
  pos.setZ(tempVector.z);
  spatialInfo.setPosition(pos);
  let rot = new Rotation();
  rot.setX(tempQuaternion.x);
  rot.setY(tempQuaternion.y);
  rot.setZ(tempQuaternion.z);
  rot.setW(tempQuaternion.w);
  spatialInfo.setRotation(rot);

  return spatialInfo;
}

export function computeGraphSpatialInfo(graph: THREE.Object3D) {
  let spatialInfo = new SpatialInfo();
  let pos = new Position();
  pos.setX(graph.position.x);
  pos.setY(graph.position.y);
  pos.setZ(graph.position.z);
  spatialInfo.setPosition(pos);
  let rot = new Rotation();
  rot.setX(graph.quaternion.x);
  rot.setY(graph.quaternion.y);
  rot.setZ(graph.quaternion.z);
  rot.setW(graph.quaternion.w);
  spatialInfo.setRotation(rot);
  let scale = new Scale();
  scale.setX(graph.scale.x);
  scale.setY(graph.scale.y);
  scale.setZ(graph.scale.z);
  spatialInfo.setScale(scale);

  return spatialInfo;
}

export function computeUserFrustum(
  camera: THREE.Camera,
  graph?: THREE.Object3D,
  tempVector = new THREE.Vector3()
) {
  const [n1, n2, n3, n4, f1, f2, f3, f4] = calculateFrustum(
    camera,
    tempVector
  ).map((pts) => {
    if (graph) {
      graph.worldToLocal(pts);
      // console.log("graphx",graph.scale.x);

      pts.multiplyScalar(0.005); // scale down the position
    }
    let pos = new Position();
    pos.setX(pts.x);
    pos.setY(pts.y);
    pos.setZ(pts.z);
    return pos;
  });
  let frustum = new Frustum();
  frustum.setN1(n1);
  frustum.setN2(n2);
  frustum.setN3(n3);
  frustum.setN4(n4);
  frustum.setF1(f1);
  frustum.setF2(f2);
  frustum.setF3(f3);
  frustum.setF4(f4);

  return frustum;
}
