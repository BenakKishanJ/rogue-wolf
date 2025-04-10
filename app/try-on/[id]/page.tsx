"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import * as React from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { IProduct } from "../../../lib/models/products"; // Adjust path
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import { PageLoader } from "@/components/ui/page-loader";

interface TryOnPageProps {
  params: Promise<{ id: string }>;
}

export default function TryOnPage({ params }: TryOnPageProps) {
  const { id } = React.use(params);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState("Click 'Start Camera' to begin");
  const [detector, setDetector] = useState<any>(null);
  const [designImage, setDesignImage] = useState<HTMLImageElement | null>(null);
  const [baseShirtImage, setBaseShirtImage] = useState<HTMLImageElement | null>(
    null,
  );
  const [compositeShirtImage, setCompositeShirtImage] =
    useState<HTMLImageElement | null>(null);

  const fixedRatio = 262 / 190; // widthOfShirt/widthOfPoint11to12
  const shirtRatioHeightWidth = 581 / 440;

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setLoadingComplete(false);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
        );
        const data = await res.json();
        setProduct(data || null);
        if (data && data.colors.length > 0) {
          setSelectedColor(data.colors[0]); // Set default to first available color
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoadingComplete(true);
        // Keep loading state true for minimum duration
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    }
    fetchProduct();
  }, [id]);

  // Load the base shirt image when color or cameraActive changes
  useEffect(() => {
    if (!cameraActive) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setBaseShirtImage(img);
    };
    img.onerror = () => {
      setStatus(
        `Failed to load base shirt image: base_shirt_${selectedColor}.png`,
      );
    };
    img.src = `/shirts/base_shirt_${selectedColor}.png`;
  }, [selectedColor, cameraActive]);

  // Load the design image from product.designImage when product or cameraActive changes
  useEffect(() => {
    if (!cameraActive || !product) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setDesignImage(img);
    };
    img.onerror = () => {
      setStatus(`Failed to load design image: ${product.designImage}`);
    };
    img.src = product.designImage;
  }, [product, cameraActive]);

  // Composite design onto base shirt when both images are loaded
  useEffect(() => {
    if (!designImage || !baseShirtImage) return;

    const canvas = document.createElement("canvas");
    canvas.width = baseShirtImage.width;
    canvas.height = baseShirtImage.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setStatus("Failed to create canvas context for compositing");
      return;
    }

    ctx.drawImage(baseShirtImage, 0, 0);

    const designWidth = baseShirtImage.width * 0.5;
    const designHeight = (designWidth / designImage.width) * designImage.height;
    const designX = (baseShirtImage.width - designWidth) / 2;
    const designY = baseShirtImage.height * 0.3;

    ctx.drawImage(designImage, designX, designY, designWidth, designHeight);

    const compositeImg = new Image();
    compositeImg.onload = () => {
      setCompositeShirtImage(compositeImg);
    };
    compositeImg.src = canvas.toDataURL();
  }, [designImage, baseShirtImage]);

  // Setup webcam
  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          if (canvasRef.current && overlayCanvasRef.current) {
            canvasRef.current.width = videoRef.current!.videoWidth;
            canvasRef.current.height = videoRef.current!.videoHeight;
            overlayCanvasRef.current.width = videoRef.current!.videoWidth;
            overlayCanvasRef.current.height = videoRef.current!.videoHeight;

            videoRef.current!.style.objectPosition = "center";
            setStatus("Webcam ready, loading model...");
          }
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setStatus(`Error accessing webcam: ${errorMessage}`);
    }
  };

  // Load pose detection model
  const loadModel = async () => {
    try {
      setStatus("Loading pose detection model...");

      await tf.ready();

      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
        minPoseScore: 0.2,
      };

      const model = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig,
      );

      setDetector(model);
      setStatus("Model loaded! Starting detection...");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setStatus(`Error loading model: ${errorMessage}`);
    }
  };

  // Overlay shirt on the person
  const overlayShirt = (keypoints: any[]) => {
    if (!overlayCanvasRef.current || !compositeShirtImage) return;

    const overlayCtx = overlayCanvasRef.current.getContext("2d");
    if (!overlayCtx) return;

    overlayCtx.clearRect(
      0,
      0,
      overlayCanvasRef.current.width,
      overlayCanvasRef.current.height,
    );

    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];

    if (leftShoulder.score > 0.3 && rightShoulder.score > 0.3) {
      const shoulderDist = Math.abs(leftShoulder.x - rightShoulder.x);
      const shirtWidth = shoulderDist * fixedRatio;
      const shirtHeight = shirtWidth * shirtRatioHeightWidth;

      const currentScale = shoulderDist / 190;
      const offsetY = 48 * currentScale;

      const midX = (leftShoulder.x + rightShoulder.x) / 2;
      const xPos = midX - shirtWidth / 2;
      const yPos = rightShoulder.y - offsetY;

      try {
        overlayCtx.drawImage(
          compositeShirtImage,
          xPos,
          yPos,
          shirtWidth,
          shirtHeight,
        );
      } catch (err) {
        console.error("Error drawing composite shirt:", err);
      }
    }
  };

  // Draw keypoints (for debugging)
  const drawKeypoints = (keypoints: any[]) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    const confidenceThreshold = 0.4;

    keypoints.forEach((keypoint) => {
      if (keypoint.score > confidenceThreshold) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);

        let color = "white";
        if (
          keypoint.name.includes("shoulder") ||
          keypoint.name.includes("hip")
        ) {
          color = "red";
        } else if (
          keypoint.name.includes("elbow") ||
          keypoint.name.includes("knee")
        ) {
          color = "yellow";
        } else if (
          keypoint.name.includes("wrist") ||
          keypoint.name.includes("ankle")
        ) {
          color = "green";
        }

        ctx.fillStyle = color;
        ctx.fill();
      }
    });

    drawSkeleton(keypoints, ctx);
  };

  // Draw skeleton connections
  const drawSkeleton = (keypoints: any[], ctx: CanvasRenderingContext2D) => {
    const connections = [
      ["nose", "left_eye"],
      ["nose", "right_eye"],
      ["left_eye", "left_ear"],
      ["right_eye", "right_ear"],
      ["left_shoulder", "right_shoulder"],
      ["left_shoulder", "left_elbow"],
      ["right_shoulder", "right_elbow"],
      ["left_elbow", "left_wrist"],
      ["right_elbow", "right_wrist"],
      ["left_shoulder", "left_hip"],
      ["right_shoulder", "right_hip"],
      ["left_hip", "right_hip"],
      ["left_hip", "left_knee"],
      ["right_hip", "right_knee"],
      ["left_knee", "left_ankle"],
      ["right_knee", "right_ankle"],
    ];

    const keypointMap: { [key: string]: any } = {};
    keypoints.forEach((keypoint) => {
      keypointMap[keypoint.name] = keypoint;
    });

    ctx.strokeStyle = "rgb(0, 255, 0)";
    ctx.lineWidth = 2;

    connections.forEach(([from, to]) => {
      const fromKeypoint = keypointMap[from];
      const toKeypoint = keypointMap[to];

      if (
        fromKeypoint &&
        toKeypoint &&
        fromKeypoint.score > 0.4 &&
        toKeypoint.score > 0.4
      ) {
        ctx.beginPath();
        ctx.moveTo(fromKeypoint.x, fromKeypoint.y);
        ctx.lineTo(toKeypoint.x, toKeypoint.y);
        ctx.stroke();
      }
    });
  };

  // Main detection and rendering loop
  useEffect(() => {
    let animationFrameId: number;

    const detectAndRender = async () => {
      if (detector && videoRef.current && videoRef.current.readyState === 4) {
        try {
          const poses = await detector.estimatePoses(videoRef.current);

          if (poses && poses.length > 0) {
            const keypoints = poses[0].keypoints;

            overlayShirt(keypoints);
            // drawKeypoints(keypoints); // Uncomment for debugging

            setStatus("Detection active");
          } else {
            setStatus("No person detected");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.error("Error during pose detection:", error);
          setStatus(`Detection error: ${errorMessage}`);
        }
      }

      animationFrameId = requestAnimationFrame(detectAndRender);
    };

    if (detector && compositeShirtImage && cameraActive) {
      detectAndRender();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [detector, compositeShirtImage, cameraActive]);

  // Start camera and model
  const startCamera = async () => {
    setCameraActive(true);
    await setupCamera();
    await loadModel();
  };

  // Stop camera
  const stopCamera = () => {
    setCameraActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStatus("Camera stopped");
  };

  if (loading) {
    return (
      <>
        <PageLoader 
          isLoading={true} 
          onLoadingComplete={() => {
            if (loadingComplete) {
              setLoading(false);
            }
          }}
        />
        <div className="container py-20 text-center">Loading product...</div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <PageLoader isLoading={true} />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button asChild>
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="animate-fade-in pt-20">
      <div className="container py-8">
        <div className="flex items-center text-sm text-foreground/60 mb-8">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href={`/product/${id}`} className="hover:text-foreground">
            {product.name}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground">Virtual Try-On</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-secondary/10 rounded-xl overflow-hidden">
            {cameraActive ? (
              <div className="relative aspect-video w-full">
                <video
                  ref={videoRef}
                  style={{
                    transform: "scaleX(-1)",
                    objectFit: "cover",
                    objectPosition: "center",
                    position: "absolute",
                    zIndex: 0,
                  }}
                  className="absolute top-0 left-0 w-full h-full"
                  autoPlay
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  style={{
                    transform: "scaleX(-1)",
                    position: "absolute",
                    zIndex: 10,
                  }}
                  className="absolute top-0 left-0 w-full h-full z-10"
                />
                <canvas
                  ref={overlayCanvasRef}
                  style={{
                    transform: "scaleX(-1)",
                    position: "absolute",
                    zIndex: 20,
                  }}
                  className="absolute top-0 left-0 w-full h-full z-20"
                />
              </div>
            ) : (
              <div className="text-center p-8 aspect-video flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold mb-4">Virtual Try-On</h3>
                <p className="text-foreground/70 mb-6 max-w-md">
                  See how this t-shirt looks on you using your camera. We'll use
                  AI to overlay the product on your image.
                </p>
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={startCamera}
                >
                  Start Camera
                </Button>
              </div>
            )}
          </div>

          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <Button asChild variant="outline" size="sm" className="mb-6">
                <Link href={`/product/${id}`} className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Product
                </Link>
              </Button>

              <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
              <p className="text-foreground/70 mb-6">
                Try on this product virtually using your camera to see how it
                looks on you.
              </p>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label
                      htmlFor="try-on-color"
                      className="text-base font-medium"
                    >
                      Color
                    </Label>
                    <span className="text-foreground/60 text-sm capitalize">
                      {selectedColor}
                    </span>
                  </div>
                  <RadioGroup
                    id="try-on-color"
                    value={selectedColor}
                    onValueChange={setSelectedColor}
                    className="flex gap-2"
                  >
                    {product.colors.map((color) => (
                      <div key={color} className="flex items-center">
                        <RadioGroupItem
                          id={`try-on-${color}`}
                          value={color}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`try-on-${color}`}
                          className="h-8 w-8 rounded-full border border-border cursor-pointer ring-offset-background transition-all hover:scale-110 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-accent peer-data-[state=checked]:ring-offset-2"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {cameraActive && (
                  <div className="bg-secondary/10 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Status</h3>
                    <p className="text-sm text-foreground/70">{status}</p>
                  </div>
                )}

                <div className="bg-secondary/10 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Privacy Notice</h3>
                  <p className="text-sm text-foreground/70">
                    Your camera feed is processed locally on your device and is
                    not stored or sent to our servers.
                  </p>
                </div>

                {cameraActive && (
                  <div className="bg-secondary/10 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Instructions</h3>
                    <ul className="text-sm text-foreground/70 space-y-1">
                      <li>• Stand approximately 1-2 meters from the camera</li>
                      <li>• Make sure your shoulders are clearly visible</li>
                      <li>• Face the camera directly for best results</li>
                    </ul>
                  </div>
                )}

                {cameraActive ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={stopCamera}
                  >
                    Stop Camera
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={startCamera}
                  >
                    Start Camera
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
