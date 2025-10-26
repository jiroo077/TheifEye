"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/utlis/render_prediction";

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  async function runCoco() {
    setIsLoading(true);
    const net = await cocoSSDLoad();
    setIsLoading(false);
    detectFrame(net);
  }

  async function detectFrame(net) {
    if (canvasRef.current && webcamRef.current?.video?.readyState === 4) {
      const video = webcamRef.current.video;

      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;

      const predictions = await net.detect(video, undefined, 0.5);
      const ctx = canvasRef.current.getContext("2d");
      renderPredictions(predictions, ctx);
    }

    animationRef.current = requestAnimationFrame(() => detectFrame(net));
  }

  const showMyVideo = () => {
    if (webcamRef.current?.video?.readyState === 4) {
      const video = webcamRef.current.video;
      video.width = video.videoWidth;
      video.height = video.videoHeight;
    }
  };

  useEffect(() => {
    runCoco();
    showMyVideo();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="mt-8 flex flex-col items-center">
      {isLoading ? (
        <div className="gradient-text text-center text-lg font-semibold">
          Loading AI Model...
        </div>
      ) : (
        <div className="relative flex justify-center items-center p-2 rounded-xl border-4 border-gray-400 shadow-[0_0_20px_rgba(180,180,180,0.3)] bg-gradient-to-br from-gray-700 to-gray-900">
          {/* Webcam Feed */}
          <Webcam
            ref={webcamRef}
            className="rounded-lg w-full lg:h-[720px]"
            mirrored={true}
            muted
          />

          {/* Canvas Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-50 w-full lg:h-[720px] rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
