'use client';

import { Player } from '@remotion/player';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RenderVideo from '../../remotion/MyComp/RenderVideo';
import { expandVideoData } from 'lib/utils';
import { VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from 'types/constants';

interface Chapter {
  page: number;
  header: string;
  content: string;
}

const Home: NextPage = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [generatedVideoData, setGeneratedVideoData] = useState<any>(null);
  const [totalVideoLengthInFrames, setTotalVideoLengthInFrames] =
    useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(
        'http://localhost:8000/pdf/extract-chapters',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Failed to extract chapters');

      const data = await response.json();
      setChapters(data.chapters);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const generateVideoData = async (chapter: Chapter) => {
    setIsGenerating(true);
    setSelectedChapter(chapter);
    try {
      const response = await fetch(
        'http://localhost:8000/pdf/generate-video-data',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: chapter.content }),
        }
      );

      if (!response.ok) throw new Error('Failed to generate video data');

      const data = await response.json();
      setTotalVideoLengthInFrames(
        calculateTotalVideoLengthInFrames(data, VIDEO_FPS)
      );
      setGeneratedVideoData(data);
    } catch (error) {
      console.error('Error generating video data:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateTotalVideoLengthInFrames = (videoJson: any, fps: number) => {
    let totalDurationInFrames = 0;
    if (videoJson.intro?.durationInSeconds)
      totalDurationInFrames += videoJson.intro.durationInSeconds * fps;
    if (videoJson.scenes)
      videoJson.scenes.forEach((scene: any) => {
        if (scene.durationInSeconds)
          totalDurationInFrames += scene.durationInSeconds * fps;
      });
    if (videoJson.outro?.durationInSeconds)
      totalDurationInFrames += videoJson.outro.durationInSeconds * fps;
    return totalDurationInFrames;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Book to Video Generator
          </h1>
          <p className='text-xl text-gray-600'>
            Upload your book, select a chapter, and we&apos;ll generate a beautiful
            video based on its content.
          </p>
        </div>

        {chapters.length === 0 && (
          <Card className='bg-white shadow-xl mb-8'>
            <CardContent className='p-6'>
              <Input
                type='file'
                accept='.pdf'
                onChange={handleFileUpload}
                disabled={isUploading}
                className='mb-4'
              />
              <p className='text-sm text-gray-500 mb-2'>
                Upload a PDF file to extract chapters
              </p>
              {isUploading && (
                <p className='text-sm text-blue-500'>
                  Uploading and extracting chapters...
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {chapters.length > 0 && !generatedVideoData && (
          <Card className='bg-white shadow-xl mb-8'>
            <CardHeader>
              <CardTitle>Select a Chapter</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className='h-[400px] pr-4'>
                <div className='space-y-2'>
                  {chapters.map((chapter, index) => (
                    <Button
                      key={index}
                      onClick={() => generateVideoData(chapter)}
                      className='w-full justify-start'
                      variant='outline'
                    >
                      {chapter.header}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {isGenerating && (
          <Card className='bg-white shadow-xl mb-8'>
            <CardContent className='p-6 text-center'>
              <p className='text-lg text-blue-500'>
                Generating video for &quot;{selectedChapter?.header}&quot;...
              </p>
            </CardContent>
          </Card>
        )}

        {generatedVideoData && (
          <div className='space-y-8'>
            <Card className='bg-white shadow-xl overflow-hidden'>
              <CardHeader>
                <CardTitle>{selectedChapter?.header}</CardTitle>
              </CardHeader>
              <CardContent className='p-0'>
                <Player
                  component={() => (
                    <RenderVideo
                      videoData={expandVideoData(generatedVideoData)}
                    />
                  )}
                  durationInFrames={totalVideoLengthInFrames}
                  fps={VIDEO_FPS}
                  compositionHeight={VIDEO_HEIGHT}
                  compositionWidth={VIDEO_WIDTH}
                  style={{ width: '100%' }}
                  controls
                  autoPlay
                  loop
                />
              </CardContent>
            </Card>

            <Tabs
              defaultValue='summary'
              className='bg-white shadow-xl rounded-lg'
            >
              <TabsList className='w-full p-2 bg-gray-100 rounded-t-lg'>
                <TabsTrigger
                  value='summary'
                  className='flex-1'
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value='scenes'
                  className='flex-1'
                >
                  Scenes
                </TabsTrigger>
                <TabsTrigger
                  value='metadata'
                  className='flex-1'
                >
                  Metadata
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value='summary'
                className='p-6'
              >
                <h2 className='text-2xl font-bold mb-4'>Chapter Summary</h2>
                <p className='text-gray-700 leading-relaxed'>
                  {generatedVideoData.summary}
                </p>
              </TabsContent>

              <TabsContent
                value='scenes'
                className='p-6'
              >
                <h2 className='text-2xl font-bold mb-4'>Video Scenes</h2>
                <ScrollArea className='h-[400px] pr-4'>
                  <div className='space-y-4'>
                    {generatedVideoData.scenes.map(
                      (scene: any, index: number) => (
                        <div
                          key={index}
                          className='bg-gray-50 p-4 rounded-lg shadow'
                        >
                          <h3 className='text-lg font-semibold mb-2'>
                            Scene {index + 1}
                          </h3>
                          <p className='text-gray-700'>{scene.content}</p>
                        </div>
                      )
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent
                value='metadata'
                className='p-6'
              >
                <h2 className='text-2xl font-bold mb-4'>Video Metadata</h2>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium text-gray-600'>
                      Total Duration
                    </span>
                    <span className='text-gray-800'>
                      {totalVideoLengthInFrames / VIDEO_FPS} seconds
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium text-gray-600'>
                      Number of Scenes
                    </span>
                    <span className='text-gray-800'>
                      {generatedVideoData.scenes.length}
                    </span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className='text-center'>
              <Button
                onClick={() => {
                  setGeneratedVideoData(null);
                  setSelectedChapter(null);
                }}
                variant='outline'
              >
                Select Another Chapter
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
