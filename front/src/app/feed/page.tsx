'use client';
import { useState } from 'react';
import VideoSummary, { VideoSummaryProps } from '@/components/video-summary';
import MultiModalForm from '@/components/multi-modal-form';

export default function Feed() {
  const [videoSummary, setVideoSummary] = useState<VideoSummaryProps | null>(
    null
  );

  const handleSummaryAvailable = (summary: VideoSummaryProps) => {
    setVideoSummary(summary);
  };

  return (
    <div className='flex justify-center align-center p-4'>
      {!videoSummary ? (
        <MultiModalForm onSummaryAvailable={handleSummaryAvailable} />
      ) : (
        <VideoSummary {...videoSummary} />
      )}
    </div>
  );
}
