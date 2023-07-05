import { useEffect, useRef, useState } from "react";
import trackTest from "./music/test.mp3";
import trackTest2 from "./music/test2.mp3";
import WaveSurfer from "wavesurfer.js";
import "./App.scss";

function App() {
  const [track, setTrack] = useState<HTMLAudioElement>();
  let context: AudioContext,
    analyser: AnalyserNode,
    src: MediaElementAudioSourceNode;
  const inputFileRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const logo2Ref = useRef<HTMLDivElement>(null);
  const logo3Ref = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const wavesurfer = WaveSurfer.create({
    container: document.body,
    waveColor: "rgb(255, 255, 255, 1)",
    barWidth: 4,
    progressColor: "rgb(200, 0, 200)",
    url: trackTest,
  });

  window.onclick = function () {
    if (audioRef.current) {
      if (!context) {
        preparation();
      }
      if (audioRef.current.paused) {
        wavesurfer.playPause();
        loop();
      } else {
      }
    }
  };

  function preparation() {
    if (audioRef.current) {
      context = new AudioContext();
      analyser = context.createAnalyser();
      src = context.createMediaElementSource(audioRef.current);
      src.connect(analyser);
      analyser.connect(context.destination);
      loop();
    }
  }

  function preparation2() {
    if (audioRef.current) {
      const audioElement = audioRef.current;
      const canvasElement = canvasRef.current;

      if (!audioElement || !canvasElement) {
        return;
      }

      const canvasCtx = canvasElement.getContext("2d");

      if (!canvasCtx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.fillStyle = "rgb(0, 0, 0)";
      canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(255, 255, 255)";
      canvasCtx.beginPath();

      const barWidth = (canvasElement.width / bufferLength) * 2;
      const halfCanvasHeight = canvasElement.height / 2;
      const sliceWidth = (canvasElement.width * 1.0) / bufferLength;
      let x = (canvasElement.width - barWidth * bufferLength) / 2;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvasElement.height) / 2;
        const barHeight = v * halfCanvasHeight;
        canvasCtx.lineTo(x, y);
        canvasCtx.fillRect(
          x,
          halfCanvasHeight - barHeight,
          barWidth,
          barHeight
        );
        x += barWidth + 2;
      }

      canvasCtx.lineTo(canvasElement.width, canvasElement.height / 2);
      canvasCtx.stroke();
    }
  }

  function loop() {
    if (audioRef.current) {
      if (!audioRef.current.paused) {
        requestAnimationFrame(loop);
      }
      let array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      if (logoRef.current && logo2Ref.current && logo3Ref.current) {
        logoRef.current.style.width = 750 + array[40] + "px";
        logoRef.current.style.height = 750 + array[40] + "px";
        logo2Ref.current.style.width = 750 + array[45] + "px";
        logo2Ref.current.style.height = 750 + array[45] + "px";
        logo3Ref.current.style.width = 750 + array[47] + "px";
        logo3Ref.current.style.height = 750 + array[47] + "px";
      }
    }
  }

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files![0];
      const audio = new Audio(file.name);
      audio.load();
      audio.play();
      setTrack(audio);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChangeFile(e)
        }
        type="file"
        accept=".mp3,audio/*"
        ref={inputFileRef}
        hidden
      />
      {/* <div ref={logoRef} className="logo"></div>
      <div ref={logo2Ref} className="logo2"></div>
      <div ref={logo3Ref} className="logo3"></div> */}
      <div id="item" ref={divRef}></div>
      <canvas className="canva" ref={canvasRef} width="1920px" height={200} />
      <audio
        crossOrigin="anonymous"
        hidden
        ref={audioRef}
        src={trackTest2}
        controls
      />
      {/* <button onClick={() => inputFileRef.current?.click()} className="button">
        Choose mp3 file
      </button> */}
    </div>
  );
}

export default App;
