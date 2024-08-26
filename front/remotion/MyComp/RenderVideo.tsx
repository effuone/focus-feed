import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import RenderScene from './RenderScene';
import { RenderText } from './RenderText';
import { VideoData } from './types';

interface RenderVideoProps {
  videoData: VideoData;
}

export const RenderVideo: React.FC<RenderVideoProps> = ({ videoData }) => {
  const { fps } = useVideoConfig();

  // Calculate cumulative durations
  let currentFrame = 0;
  const introDuration = videoData.intro.durationInSeconds * fps;
  currentFrame += introDuration;

  const sceneTimes = videoData.scenes.map((scene) => {
    const start = currentFrame;
    const duration = scene.durationInSeconds * fps;
    currentFrame += duration;
    return { start, duration };
  });

  const outroStart = currentFrame;
  const outroDuration = videoData.outro.durationInSeconds * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: videoData.backgroundColor }}>
      {/* Render Intro */}
      <Sequence
        from={0}
        durationInFrames={introDuration}
      >
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            color: videoData.textColor,
            fontFamily: videoData.fontFamily,
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <RenderText
            content={videoData.intro.content}
            style={videoData.intro.style}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Render Scenes */}
      {videoData.scenes.map((scene, index) => (
        <RenderScene
          key={index}
          scene={scene}
          startFrame={sceneTimes[index].start}
          videoData={{
            backgroundColor: videoData.backgroundColor,
            textColor: videoData.textColor,
            fontFamily: videoData.fontFamily,
          }}
        />
      ))}

      {/* Render Outro */}
      <Sequence
        from={outroStart}
        durationInFrames={outroDuration}
      >
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            color: videoData.textColor,
            fontFamily: videoData.fontFamily,
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <RenderText
            content={videoData.outro.content}
            style={videoData.outro.style}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default RenderVideo;
