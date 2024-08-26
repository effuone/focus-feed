import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Scene } from './types';
import { Animation } from './types';

const applyAnimation = (
  frame: number,
  animation: Animation | undefined,
  durationInFrames: number
) => {
  if (!animation) return {};

  const { type, direction, durationInSeconds } = animation;
  switch (type) {
    case 'fade-in':
      return {
        opacity: interpolate(frame, [0, durationInSeconds * 30], [0, 1]),
      };
    case 'slide-in':
      return {
        transform: `translateX(${direction === 'left' ? '-' : ''}${interpolate(
          frame,
          [0, durationInSeconds * 30],
          [100, 0]
        )}%)`,
      };
    case 'zoom-in':
      return {
        transform: `scale(${interpolate(frame, [0, durationInSeconds * 30], [1.5, 1])})`,
      };
    case 'fade-out':
      return {
        opacity: interpolate(frame, [0, durationInSeconds * 30], [1, 0]),
      };
    default:
      return {};
  }
};

const RenderScene: React.FC<{
  scene: Scene;
  startFrame: number;
  videoData: { backgroundColor: string; textColor: string; fontFamily: string };
}> = ({ scene, startFrame, videoData }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const durationInFrames = scene.durationInSeconds * fps;

  return (
    <Sequence
      from={startFrame}
      durationInFrames={durationInFrames}
    >
      <AbsoluteFill
        style={{
          backgroundColor: videoData.backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
          color: videoData.textColor,
          fontFamily: videoData.fontFamily,
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <div
          style={{
            ...applyAnimation(
              frame - startFrame,
              scene.animation,
              durationInFrames
            ),
          }}
        >
          {scene.title && <h1 style={scene.style.title}>{scene.title}</h1>}
          {scene.description && (
            <p style={scene.style.description}>{scene.description}</p>
          )}
          {scene.image && (
            <img
              src={scene.image}
              alt={scene.title}
              style={scene.style.image}
            />
          )}
        </div>
      </AbsoluteFill>
    </Sequence>
  );
};

export default RenderScene;
