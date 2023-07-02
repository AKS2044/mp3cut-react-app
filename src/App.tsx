import { useRef, useState } from "react";
import trackTest from "./music/test.mp3";
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
  const logo4Ref = useRef<HTMLDivElement>(null);

  window.onclick = function () {
    if (audioRef.current) {
      if (!context) {
        preparation();
      }
      if (audioRef.current.paused) {
        audioRef.current.play();
        loop();
      } else {
        audioRef.current.pause();
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

  function loop() {
    if (audioRef.current) {
      if (!audioRef.current.paused) {
        window.requestAnimationFrame(loop);
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
      <div ref={logoRef} className="logo"></div>
      <div ref={logo2Ref} className="logo2"></div>
      <div ref={logo3Ref} className="logo3"></div>
      <div ref={logo4Ref} className="logo4"></div>
      <audio hidden ref={audioRef} src={trackTest} controls />
      {/* <button onClick={() => inputFileRef.current?.click()} className="button">
        Choose mp3 file
      </button> */}
    </div>
  );
}

export default App;
