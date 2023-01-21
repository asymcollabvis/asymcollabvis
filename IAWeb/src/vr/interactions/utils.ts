import * as THREE from 'three';

/*-------------------------------------------------------------------------------------
 * Utility functions
 *------------------------------------------------------------------------------------*/
export function intersects(bbox: THREE.Box3, group: THREE.Group) {
    const box = new THREE.Box3();
    box.setFromObject(group);
    return bbox.intersectsBox(box);
  };
  