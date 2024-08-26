import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { VideoData } from '../remotion/MyComp/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateTotalVideoLengthInFrames(videoJson: any, fps: number) {
  let totalDurationInFrames = 0;

  // Add intro duration
  if (videoJson.intro && videoJson.intro.durationInSeconds) {
    totalDurationInFrames += videoJson.intro.durationInSeconds * fps;
  }

  // Add scene durations
  if (videoJson.scenes && Array.isArray(videoJson.scenes)) {
    videoJson.scenes.forEach((scene: any) => {
      if (scene.durationInSeconds) {
        totalDurationInFrames += scene.durationInSeconds * fps;
      }
    });
  }

  // Add outro duration
  if (videoJson.outro && videoJson.outro.durationInSeconds) {
    totalDurationInFrames += videoJson.outro.durationInSeconds * fps;
  }

  return totalDurationInFrames; // Total duration in frames
}

function calculateDurationInSeconds(
  voiceoverText: string,
  wpm: number = 150
): number {
  const wordCount = voiceoverText.split(' ').length;
  const wps = wpm / 60; // Words per second
  const durationInSeconds = wordCount / wps;
  return Math.ceil(durationInSeconds); // Round up to the nearest second
}

export function expandVideoData(videoData: any): VideoData {
  videoData.intro.durationInSeconds = calculateDurationInSeconds(
    videoData.intro.voiceover
  );
  videoData.intro.animation = {
    type: 'zoom-out',
    durationInSeconds: 1,
  };
  videoData.scenes.forEach((scene: any) => {
    scene.animation = {
      type: 'zoom-out',
      durationInSeconds: 1,
    };
    scene.durationInSeconds = calculateDurationInSeconds(scene.voiceover);
    scene.style = {
      title: {
        fontSize: '50px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '20px',
      },
      description: {
        fontSize: '30px',
        textAlign: 'center',
        marginBottom: '20px',
      },
      image: {
        width: '600px', // Fixed width
        height: '400px', // Fixed height
        borderRadius: '10px',
        margin: 'auto',
      },
    };
  });
  videoData.outro.durationInSeconds = calculateDurationInSeconds(
    videoData.outro.voiceover
  );
  videoData.outro.animation = {
    type: 'zoom-out',
    durationInSeconds: 1,
  };
  return videoData;
}
