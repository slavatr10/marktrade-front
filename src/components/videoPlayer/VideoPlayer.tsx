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
  return (
    <div
      className="w-full rounded-3xl overflow-hidden relative pt-[56.25%]"
      //optinal here because dont have video
      onPointerDown={() => onFirstPlay?.()}
    >
      <div className="absolute top-0 left-0 w-full h-full rounded-2xl">
        <ReactPlayer
          url={src}
          controls
          playing={false}
          width="100%"
          height="100%"
          className="absolute top-0 left-0 rounded-2xl"
          light={thumbnail}
          // onPlay={() => onFirstPlay?.()}
          //onStart={() => console.log('start')}
        />
      </div>
    </div>
  );
};
