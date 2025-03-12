"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { getProductById } from "@/lib/data"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, useTexture, Environment, Center } from "@react-three/drei"
import { easing } from "maath"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

// Define the shirt model and available designs
const designURLs = ["/designs/design1.png", "/designs/design2.png", "/designs/design3.png"]

// Define types for the GLB model
type GLTFResult = {
  nodes: {
    T_Shirt_male: THREE.Mesh
  }
  materials: {
    lambert1: THREE.MeshStandardMaterial
  }
}

const Shirt = ({ designURL, color }: { designURL: string; color: string }) => {
  // Load the shirt model from the GLB file
  const { nodes, materials } = useGLTF("/shirt_baked.glb") as unknown as GLTFResult

  // Load the selected design as a texture
  const texture = useTexture(designURL)

  // Get color based on selection
  const getShirtColor = () => {
    switch (color) {
      case "white":
        return new THREE.Color(0xffffff)
      case "black":
        return new THREE.Color(0x222222)
      case "blue":
        return new THREE.Color(0x3b82f6)
      case "red":
        return new THREE.Color(0xef4444)
      default:
        return new THREE.Color(0xffffff)
    }
  }

  // Apply smooth color transitions
  useFrame((_, delta) => {
    if (materials.lambert1) {
      easing.dampC(materials.lambert1.color, getShirtColor(), 0.25, delta)
    }
  })

  return (
    <group>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {/* Apply the texture to the entire shirt */}
        <meshStandardMaterial map={texture} color={getShirtColor()} />
      </mesh>
    </group>
  )
}

// Camera rig to handle rotation and positioning
interface CameraRigProps {
  children: React.ReactNode
}

const CameraRig = ({ children }: CameraRigProps) => {
  const group = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    // Set the initial position based on screen size
    const isBreakpoint = window.innerWidth <= 1260
    const isMobile = window.innerWidth <= 600

    let targetPosition: [number, number, number] = [-0.4, 0, 2]
    if (isBreakpoint) targetPosition = [0, 0, 2]
    if (isMobile) targetPosition = [0, 0.2, 2.5]

    // Smoothly move camera to target position
    easing.damp3(state.camera.position, targetPosition, 0.25, delta)

    // Rotate model based on mouse position
    if (group.current) {
      easing.dampE(
        group.current.rotation,
        [state.pointer.y / 10, -state.pointer.x / 5, 0] as [number, number, number],
        0.25,
        delta,
      )
    }
  })

  return <group ref={group}>{children}</group>
}

interface ThreeDViewPageProps {
  params: {
    id: string
  }
}

export default function ThreeDViewPage({ params }: ThreeDViewPageProps) {
  const product = getProductById(params.id)
  const [selectedColor, setSelectedColor] = useState("black")
  const [selectedDesign, setSelectedDesign] = useState(designURLs[0])

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button asChild>
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in pt-20">
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-foreground/60 mb-8">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href={`/product/${product.id}`} className="hover:text-foreground">
            {product.name}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground">3D View</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 3D Viewer */}
          <div className="flex-1 bg-secondary/10 rounded-xl overflow-hidden">
            <div className="aspect-square w-full relative">
              <Canvas
                shadows
                camera={{ position: [0, 0, 0], fov: 25 }}
                gl={{ preserveDrawingBuffer: true }}
                className="w-full h-full"
              >
                <ambientLight intensity={0.5} />
                <Environment preset="city" />

                <CameraRig>
                  <Center>
                    <Shirt designURL={selectedDesign} color={selectedColor} />
                  </Center>
                </CameraRig>

                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  enableRotate={true}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI - Math.PI / 4}
                />
              </Canvas>

              <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg text-center">
                <p className="text-sm">Drag to rotate • Scroll to zoom</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <Button asChild variant="outline" size="sm" className="mb-6">
                <Link href={`/product/${product.id}`} className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Product
                </Link>
              </Button>

              <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
              <p className="text-foreground/70 mb-6">
                Explore this product in 3D. Rotate, zoom, and see it from all angles.
              </p>

              <div className="space-y-6">
                {/* Color Selection */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="color" className="text-base font-medium">
                      Color
                    </Label>
                    <span className="text-foreground/60 text-sm capitalize">{selectedColor}</span>
                  </div>
                  <RadioGroup id="color" value={selectedColor} onValueChange={setSelectedColor} className="flex gap-2">
                    <div className="flex items-center">
                      <RadioGroupItem id="black" value="black" className="peer sr-only" />
                      <Label
                        htmlFor="black"
                        className="h-8 w-8 rounded-full bg-black border border-border cursor-pointer ring-offset-background transition-all hover:scale-110 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-accent peer-data-[state=checked]:ring-offset-2"
                      />
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem id="white" value="white" className="peer sr-only" />
                      <Label
                        htmlFor="white"
                        className="h-8 w-8 rounded-full bg-white border border-border cursor-pointer ring-offset-background transition-all hover:scale-110 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-accent peer-data-[state=checked]:ring-offset-2"
                      />
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem id="blue" value="blue" className="peer sr-only" />
                      <Label
                        htmlFor="blue"
                        className="h-8 w-8 rounded-full bg-blue-500 border border-border cursor-pointer ring-offset-background transition-all hover:scale-110 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-accent peer-data-[state=checked]:ring-offset-2"
                      />
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem id="red" value="red" className="peer sr-only" />
                      <Label
                        htmlFor="red"
                        className="h-8 w-8 rounded-full bg-red-500 border border-border cursor-pointer ring-offset-background transition-all hover:scale-110 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-accent peer-data-[state=checked]:ring-offset-2"
                      />
                    </div>
                  </RadioGroup>
                </div>

                {/* Design Selection */}
                <div>
                  <Label className="text-base font-medium block mb-2">Design</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {designURLs.map((url, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedDesign(url)}
                        className={`aspect-square rounded-md overflow-hidden border cursor-pointer ${
                          selectedDesign === url ? "ring-2 ring-accent" : "border-border"
                        }`}
                      >
                        <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
                          <span className="text-sm">D{index + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Controls Help */}
                <div className="bg-secondary/10 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Controls</h3>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    <li>• Click and drag to rotate</li>
                    <li>• Scroll to zoom in/out</li>
                    <li>• Double-click to reset view</li>
                  </ul>
                </div>

                {/* Add to Cart */}
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Add to Cart</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

