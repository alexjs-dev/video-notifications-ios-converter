/* eslint-disable no-useless-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { VscClose, VscCheck } from 'react-icons/vsc';
import { useDropzone } from 'react-dropzone';
import './App.css';

function Upload({ setVideoState }: any) {
  const validFiles = ['alpha', 'color'];
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader();

      if (file && !file.type.includes('video')) {
        throw new Error('File is not a video');
      }

      console.log('file', file);

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // Do whatever you want with the file contents
        const arrayBuffer = reader.result;

        if (validFiles.some((validFile) => file.name.includes(validFile))) {
          const type = file.name.includes('alpha') ? 'alpha' : 'color';
          setVideoState((prev: any) => ({
            ...prev,
            [type]: true,
          }));
          // @ts-ignore
          const videoElement: HTMLVideoElement | null = document.getElementById(
            type === 'alpha' ? 'alpha-video' : 'color-video'
          );
          if (videoElement) {
            // @ts-ignore
            const blob = new Blob([arrayBuffer]);
            videoElement.src = URL.createObjectURL(blob);
          }
        }
        console.log(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="container-upload">
      <input {...getInputProps()} />
      <p>Drag and drop video files here, or click to select files</p>
    </div>
  );
}

const View = () => {
  const [videoState, setVideoState] = useState({
    alpha: false,
    color: false,
  });
  const disabled = !videoState.alpha || !videoState.color;

  const onConvert = (e: any) => {
    e.preventDefault();
    if (disabled) {
      return;
    }
    // execute ffmpeg command
    // ffmpeg -y -i color.mp4 -i alpha.mp4 -f lavfi -i color=c=black:s=320x568 -filter_complex "[1:v]scale=320:568,setsar=1:1,split[vs][alpha];[0:v][vs]alphamerge[vt];[2:v][vt]overlay=shortest=1[rgb];[rgb][alpha]alphamerge" -shortest -c:v hevc_videotoolbox -allow_sw 1 -alpha_quality 0.75 -vtag hvc1 -pix_fmt yuva420p -an output.mov
  };
  const onDelete = (type: 'alpha' | 'color') => {
    // @ts-ignore
    const videoElement: HTMLVideoElement | null = document.getElementById(
      `${type}-video`
    );
    setVideoState((prev) => ({
      ...prev,
      [type]: false,
    }));
    if (videoElement) {
      videoElement.src = '';
    }
  };
  return (
    <form className="container" onSubmit={onConvert}>
      <h1>YoloHolo iOS converter</h1>
      <p>Convert alpha channel videos to iOS compatible .mov format</p>
      <Upload setVideoState={setVideoState} />
      <hr />
      <div style={{ display: 'flex' }}>
        <ul className="video-list">
          <li>
            Alpha video &nbsp;
            {videoState?.alpha ? (
              <VscCheck size={24} color="var(--color-purple)" />
            ) : (
              <VscClose size={24} color="var(--color-red)" />
            )}
          </li>
          <li>
            <video id="alpha-video" controls muted />
            {videoState?.alpha && (
              <button
                type="button"
                className="delete-button"
                onClick={() => {
                  onDelete('alpha');
                }}
              >
                <VscClose color="var(--color-red)" />
              </button>
            )}
          </li>
        </ul>
        <ul className="video-list">
          <li>
            Color video &nbsp;
            {videoState?.color ? (
              <VscCheck size={24} color="var(--color-purple)" />
            ) : (
              <VscClose size={24} color="var(--color-red)" />
            )}
          </li>
          <li>
            <video id="color-video" controls muted />
            {videoState?.color && (
              <button
                type="button"
                className="delete-button"
                onClick={() => {
                  onDelete('color');
                }}
              >
                <VscClose color="var(--color-red)" />
              </button>
            )}
          </li>
        </ul>
      </div>
      <button
        type="submit"
        className={(disabled && 'disabled') || ''}
        onClick={onConvert}
      >
        Convert
      </button>
    </form>
  );
};

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<View />} />
        </Routes>
      </Router>
    </>
  );
}
