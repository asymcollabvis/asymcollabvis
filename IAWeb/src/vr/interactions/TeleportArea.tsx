import { Interactive, useXR } from "@react-three/xr";
import React, { useRef } from "react";

export default function TeleportArea({ children }) {
    const { player } = useXR()
    const isGrabbing = useRef(false);
    
    return <Interactive 
    onSqueezeStart={(e) => {
        // console.log("squeeze start", e.target.userData);
        // isGrabbing.current = e.target.userData.grabbing;
    }}
    onSqueezeEnd={(event) => {
        // console.log(event, event.target.userData);

        // avoid teleporting when the player is grabbing the panel
        // if (!isGrabbing.current) {
            let targetPos = event.intersection?.point;
    
            if (targetPos) {
                player.position.x = targetPos.x;
                player.position.z = targetPos.z;
            }
        // }
        // isGrabbing.current = event.target.userData;
    }}>
        {children}
    </Interactive>
}