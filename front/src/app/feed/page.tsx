'use client';
import MultiModalForm from '@/components/multi-modal-form';
import VideoSummary, { VideoSummaryProps } from '@/components/video-summary';
import { useState } from 'react';

export default function Feed() {
  const [videoSummary, setVideoSummary] = useState<VideoSummaryProps | null>(null);
  const [submitSummary, setSubmitSummary] = useState<any>(null);

  const handleSummaryAvailable = (summary: any) => {
    if (summary.urlEmbed) {
      setVideoSummary(summary);
      setSubmitSummary(null);
    } else {
      setSubmitSummary(summary);
      setVideoSummary(null);
    }
  };

  return (
    <div className='flex justify-center align-center p-4'>
      {!videoSummary && !submitSummary ? (
        <MultiModalForm onSummaryAvailable={handleSummaryAvailable} />
      ) : videoSummary ? (
        <VideoSummary {...videoSummary} />
      ) : (
        <div className='flex flex-col space-y-4'>
          {submitSummary.map((summary: any, index: number) => (
            <div key={index} className='bg-gray-100 p-4 rounded-md shadow'>
              <h3 className='text-lg font-semibold mb-2'>{summary.filename}</h3>
              <p>{summary.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
