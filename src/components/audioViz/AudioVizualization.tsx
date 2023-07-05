import React, { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioVizualization: React.FC<AudioVisualizerProps> = ({ audioRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const audioElement = audioRef.current;
    const canvasElement = canvasRef.current;

    if (!audioElement || !canvasElement) {
      return;
    }

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const canvasCtx = canvasElement.getContext("2d");

    if (!canvasCtx) {
      return;
    }

    const renderFrame = () => {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.fillStyle = "rgb(0, 0, 0)";
      canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

      const barWidth = (canvasElement.width / bufferLength) * 2;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        canvasCtx.fillRect(
          x,
          canvasElement.height - barHeight / 2,
          barWidth,
          barHeight / 2
        );

        x += barWidth + 1;
      }

      requestAnimationFrame(renderFrame);
    };

    audioElement.addEventListener("play", renderFrame);

    return () => {
      audioElement.removeEventListener("play", renderFrame);
    };
  }, [audioRef]);

  return (
    <div>
      <canvas ref={canvasRef} width={600} height={200} />
    </div>
  );
};

export default AudioVizualization;
