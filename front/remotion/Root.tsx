import { Composition } from 'remotion';
import {
  COMP_NAME,
  defaultMyCompProps,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from '../types/constants';
import RenderVideo from './MyComp/RenderVideo';
import { videoData } from './MyComp/videoData';
import {
  calculateTotalVideoLengthInFrames,
  expandVideoData,
} from '../lib/utils';

export const RemotionRoot: React.FC = () => {
  const DURATION_IN_FRAMES = calculateTotalVideoLengthInFrames(
    videoData,
    VIDEO_FPS
  );
  return (
    <Composition
      id={COMP_NAME}
      component={() => <RenderVideo videoData={expandVideoData(videoData)} />}
      durationInFrames={DURATION_IN_FRAMES}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      defaultProps={defaultMyCompProps}
    />
  );
};
