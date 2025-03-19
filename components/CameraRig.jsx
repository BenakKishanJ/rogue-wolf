import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

const CameraRig = ({ children }) => {
  const group = useRef();

  useFrame((state, delta) => {
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    let targetPosition = [-0.4, 0, 2];
    if (isBreakpoint) targetPosition = [0, 0, 2];
    if (isMobile) targetPosition = [0, 0.2, 2.5];

    easing.damp3(state.camera.position, targetPosition, 0.25, delta);

    if (group.current) {
      easing.dampE(
        group.current.rotation,
        [state.pointer.y / 10, -state.pointer.x / 5, 0],
        0.25,
        delta,
      );
    }
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
