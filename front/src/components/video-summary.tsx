import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FC } from "react";

export interface VideoSummaryProps {
  videoName: string;
  authorName: string;
  duration: string;
  readTime: string;
  urlEmbed: string;
  summary: string;
  highlights: string[];
  insights: string[];
  transcript: {
    timestamp: string;
    text: string;
  }[];
}

const VideoSummary: FC<VideoSummaryProps> = ({
  videoName,
  authorName,
  duration,
  urlEmbed,
  summary,
  readTime,
  highlights,
  insights,
  transcript,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-100 rounded-xl">
      <div className=" lg:w-1/3">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">YouTube Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="relative rounded-lg overflow-hidden">
                <iframe
                  className="w-full aspect-video"
                  src={urlEmbed}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {videoName}
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Author</span>
                  <span className="text-gray-800">{authorName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">
                    Video Duration
                  </span>
                  <span className="text-gray-800">{duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Read Time</span>
                  <span className="text-gray-800">{readTime}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full lg:w-2/3">
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="flex space-x-2 bg-white p-1 rounded-lg shadow">
            <TabsTrigger value="transcript" className="flex-1">
              Transcript
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex-1">
              Summary
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex-1">
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{summary}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.map((insight, index) => (
                    <Card
                      key={index}
                      className="bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                    >
                      <CardContent className="p-4">
                        <p className="text-lg font-semibold">{insight}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transcript">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {transcript.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="text-blue-600 font-medium whitespace-nowrap">
                          {item.timestamp}
                        </span>
                        <p className="flex-1 text-gray-700">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VideoSummary;
