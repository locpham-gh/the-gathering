import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface VideoJSProps {
  options: Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onReady?: (player: any) => void;
}

export const VideoJS = (props: VideoJSProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const { options, onReady } = props;

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);
      }

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        if (onReady) {
          onReady(player);
        }
      }));

      // You could update an existing player in the `else` block here
      // on tile change, for example:
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay || false);
      player.src(options.sources || []);
    }
  }, [options, onReady, videoRef]);

  // Dispose the player on unmount
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className="w-full h-full">
      <div ref={videoRef} className="w-full h-full" />
    </div>
  );
};

export default VideoJS;
