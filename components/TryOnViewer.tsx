"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface TryOnViewerProps {
  productImage: string
  designUrl: string
  baseColor: string
}

export function TryOnViewer({ productImage, designUrl, baseColor }: TryOnViewerProps) {
  const [webcamActive, setWebcamActive] = useState(false)
  const [designScale, setDesignScale] = useState(50)
  const [designPosition, setDesignPosition] = useState({ x: 50, y: 30 })
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Start webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setWebcamActive(true)
      }
    } catch (err) {
      console.error("Error accessing webcam:", err)
    }
  }

  // Stop webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setWebcamActive(false)
    }
  }

  // Handle design dragging
  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setDesignPosition({ x, y })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Draw the try-on effect
  useEffect(() => {
    const drawCanvas = () => {
      const canvas = canvasRef.current
      const video = videoRef.current

      if (!canvas || !video) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480

      // Draw video frame
      if (webcamActive && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      } else {
        // Clear canvas if webcam is not active
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#f1f5f9" // Light background
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      // Load and draw the design
      const designImg = new Image()
      designImg.crossOrigin = "anonymous"
      designImg.src = designUrl

      designImg.onload = () => {
        const scale = designScale / 100
        const designWidth = designImg.width * scale
        const designHeight = designImg.height * scale

        const x = (canvas.width * designPosition.x) / 100 - designWidth / 2
        const y = (canvas.height * designPosition.y) / 100 - designHeight / 2

        ctx.drawImage(designImg, x, y, designWidth, designHeight)
      }
    }

    const interval = setInterval(drawCanvas, 1000 / 30) // 30 FPS

    return () => {
      clearInterval(interval)
    }
  }, [webcamActive, designUrl, designScale, designPosition])

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-2xl h-[400px] bg-slate-100 rounded-lg overflow-hidden mb-4">
        {webcamActive ? (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="hidden" />
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </>
        ) : (
          <div className="relative w-full h-full">
            <Image src={productImage || "/placeholder.svg"} alt="Product" fill style={{ objectFit: "contain" }} />
          </div>
        )}
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-center">
          {webcamActive ? (
            <Button onClick={stopWebcam} variant="destructive">
              Stop Camera
            </Button>
          ) : (
            <Button onClick={startWebcam}>Start Try-On</Button>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Design Size</p>
          <Slider
            value={[designScale]}
            min={10}
            max={100}
            step={1}
            onValueChange={(value) => setDesignScale(value[0])}
          />
        </div>

        <div className="text-center text-sm text-gray-500">
          {webcamActive ? "Drag the design to position it on your body" : "Click 'Start Try-On' to use your camera"}
        </div>
      </div>
    </div>
  )
}

