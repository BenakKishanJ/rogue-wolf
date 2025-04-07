import React from "react";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { easing } from "maath";

const Shirt = ({ color, logoTexture }) => {
  const { nodes, materials } = useGLTF("/shirt_baked.glb");
  const texture = useTexture(logoTexture);

  useFrame((state, delta) => {
    easing.dampC(materials.lambert1.color, color, 0.25, delta);
  });

  return (
    <mesh
      castShadow
      geometry={nodes.T_Shirt_male.geometry}
      material={materials.lambert1}
    >
      {/* Back logo placement */}
      <Decal
        position={[0, -0.05, -0.15]} // Position on back
        rotation={[0, Math.PI, 0]} // Rotated to face outward
        scale={0.3}
        map={texture}
        depthTest={false}
        depthWrite={true}
      />
    </mesh>
  );
};

useGLTF.preload("/shirt_baked.glb");
export default Shirt;
