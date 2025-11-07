import { useState } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  src: string;
  thumbnail?: string;
  onFirstPlay?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  thumbnail,
  onFirstPlay,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const handlePlayAttempt = () => {
    if (!isPlaying) {
      onFirstPlay?.();
      setIsPlaying(true);
    }
  };
  return (
    <div
      className="w-full rounded-3xl overflow-hidden relative pt-[56.25%]"
      //optinal here because dont have video
      // onPointerDown={() => onFirstPlay?.()}
      onPointerDown={handlePlayAttempt}
    >
      <div className="absolute top-0 left-0 w-full h-full rounded-2xl">
        <ReactPlayer
          url={src}
          controls
          playing={isPlaying}
          width="100%"
          height="100%"
          className="absolute top-0 left-0 rounded-2xl"
          light={thumbnail}
        />
      </div>
    </div>
  );
};
