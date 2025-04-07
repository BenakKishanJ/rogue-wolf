import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

const CameraRig = ({ children, rotationY }) => {
  const group = useRef();

  useFrame((state, delta) => {
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    let targetPosition = [-0.4, 0, 2];
    if (isBreakpoint) targetPosition = [0, 0, 2];
    if (isMobile) targetPosition = [0, 0.2, 2.5];

    easing.damp3(state.camera.position, targetPosition, 0.25, delta);

    if (group.current) {
      // Only rotate around Y axis (sideways) and combine with pointer movement
      easing.dampE(
        group.current.rotation,
        [
          0, // Keep X rotation fixed (no up/down flipping)
          rotationY - state.pointer.x / 2, // Combine preset rotation with drag
          0, // Keep Z rotation fixed
        ],
        0.25,
        delta,
      );
    }
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
