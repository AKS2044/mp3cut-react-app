import { useRef, useState } from "react";
import "./App.scss";

function App() {
  const [track, setTrack] = useState<HTMLAudioElement>();
  const inputFileRef = useRef<HTMLInputElement>(null);

  if (track) track?.play();

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files![0];
      //let audio = new Audio(file.);
      console.log(e);
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
      <button onClick={() => inputFileRef.current?.click()} className="button">
        Choose mp3 file
      </button>
    </div>
  );
}

export default App;
