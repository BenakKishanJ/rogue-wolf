"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, useGLTF, Decal } from "@react-three/drei"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import type { Mesh } from "three"
import type { GLTF } from "three-stdlib"
import type * as THREE from "three"

type GLTFResult = GLTF & {
  nodes: {
    T_Shirt_male: Mesh
  }
  materials: {
    lambert1: THREE.Material
  }
}

interface ShirtModelProps {
  designUrl: string
  baseColor: string
}

function ShirtModel({ designUrl, baseColor }: ShirtModelProps) {
  const ref = useRef<Mesh>(null)
  const { nodes, materials } = useGLTF("/shirt_baked.glb") as GLTFResult

  // Load the design texture
  const designTexture = useLoader(TextureLoader, designUrl)

  // Create a base color texture based on the baseColor prop
  const [baseTexture, setBaseTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    // Create a canvas to generate a solid color texture
    const canvas = document.createElement("canvas")
    canvas.width = 1024
    canvas.height = 1024
    const context = canvas.getContext("2d")

    if (context) {
      context.fillStyle = baseColor
      context.fillRect(0, 0, canvas.width, canvas.height)

      const texture = new TextureLoader().load(canvas.toDataURL())
      setBaseTexture(texture)
    }
  }, [baseColor])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2
    }
  })

  if (!baseTexture) return null

  return (
    <mesh
      ref={ref}
      castShadow
      geometry={nodes.T_Shirt_male.geometry}
      material={materials.lambert1}
      material-map={baseTexture}
      dispose={null}
    >
      {/* Apply the design only to the chest area */}
      <Decal position={[0, 0.04, 0.15]} rotation={[0, 0, 0]} scale={0.15} map={designTexture} map-anisotropy={16} />
    </mesh>
  )
}

interface ShirtViewerProps {
  designUrl: string
  baseColor?: string
}

export function ShirtViewer({ designUrl, baseColor = "black" }: ShirtViewerProps) {
  return (
    <Canvas shadows camera={{ position: [0, 0, 2.5], fov: 25 }} style={{ width: "100%", height: "100%" }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <ShirtModel designUrl={designUrl} baseColor={baseColor} />
      <OrbitControls enableZoom={true} enablePan={true} />
    </Canvas>
  )
}

