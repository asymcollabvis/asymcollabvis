import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export function lookRotation(
  forward: THREE.Vector3,
  up: THREE.Vector3
): THREE.Quaternion {
  let right = new THREE.Vector3().crossVectors(up, forward).normalize();
  up = new THREE.Vector3().crossVectors(forward, right).normalize();

  let m = new THREE.Matrix4();
  m.makeBasis(right, up, forward);
  return new THREE.Quaternion().setFromRotationMatrix(m);
}

export function isPosArrayZero(arr: number[]) {
  return arr[0] == 0 && arr[1] == 0 && arr[2] == 0;
}

export function arrayEquals(a: any[], b: any[]) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

/**
 * Return the camera based on the devices
 * @returns Camera
 */
export function useDeviceCamera() {
  const { camera, gl } = useThree();
  return gl.xr.isPresenting ? gl.xr.getCamera() : camera;
}
