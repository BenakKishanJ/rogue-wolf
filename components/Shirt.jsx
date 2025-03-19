import React from "react";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { easing } from "maath";

const Shirt = ({ color, logoTexture }) => {
  const { nodes, materials } = useGLTF("/shirt_baked.glb");
  const texture = useTexture(logoTexture);
  const meshRef = React.useRef();

  useFrame((state, delta) => {
    easing.dampC(materials.lambert1.color, color, 0.25, delta);
  });

  return (
    <mesh
      ref={meshRef}
      castShadow
      geometry={nodes.T_Shirt_male.geometry}
      material={materials.lambert1}
    >
      <Decal
        position={[0, 0.04, 0.15]}
        rotation={[0, 0, 0]}
        scale={0.15}
        map={texture}
        depthTest={false}
        depthWrite={true}
      />
    </mesh>
  );
};

export default Shirt;
