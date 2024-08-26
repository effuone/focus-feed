"use client";
import MultiModalForm from "@/components/multi-modal-form";
import VideoSummary, { VideoSummaryProps } from "@/components/video-summary";
import { motion } from "framer-motion";
import { useState } from "react";
import Highlighter from "react-highlight-words";
import { FaFile } from "react-icons/fa";

export default function Feed() {
  const [videoSummary, setVideoSummary] = useState<VideoSummaryProps | null>(
    null
  );
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-3xl mx-auto">
        {!videoSummary && !submitSummary ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MultiModalForm onSummaryAvailable={handleSummaryAvailable} />
          </motion.div>
        ) : videoSummary ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <VideoSummary {...videoSummary} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="space-y-6"
          >
            {submitSummary.map((summary: any, index: number) => {

              return (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center mb-6">
                    <div className="bg-indigo-100 p-3 rounded-full mr-4">
                      <FaFile className="text-indigo-600" size={28} />
                    </div>
                    <h3 className="text-3xl font-extrabold text-gray-900">
                      {summary.filename}
                    </h3>
                  </div>

                  <div className="space-y-8">
                    <Section title="Overview">
                      <Highlighter
                        highlightClassName="bg-yellow-200"
                        searchWords={JSON.parse(summary.summary).highlight_terms}
                        autoEscape={true}
                        textToHighlight={JSON.parse(summary.summary).overview}
                      />
                    </Section>

                    <Section title="Key Points">
                      <Highlighter
                        highlightClassName="bg-yellow-200"
                        searchWords={JSON.parse(summary.summary).highlight_terms}
                        autoEscape={true}
                        textToHighlight={JSON.parse(summary.summary).details.key_points.join(
                          " "
                        )}
                      />
                    </Section>

                    <Section title="Arguments">
                      <Highlighter
                        highlightClassName="bg-yellow-200"
                        searchWords={JSON.parse(summary.summary).highlight_terms}
                        autoEscape={true}
                        textToHighlight={JSON.parse(summary.summary).details.arguments.join(
                          " "
                        )}
                      />
                    </Section>

                    <Section title="Conclusions">
                      <Highlighter
                        highlightClassName="bg-yellow-200"
                        searchWords={JSON.parse(summary.summary).highlight_terms}
                        autoEscape={true}
                        textToHighlight={JSON.parse(summary.summary).details.conclusions.join(
                          " "
                        )}
                      />
                    </Section>

                    <Section title="Insights">
                      <Highlighter
                        highlightClassName="bg-yellow-200"
                        searchWords={JSON.parse(summary.summary).highlight_terms}
                        autoEscape={true}
                        textToHighlight={JSON.parse(summary.summary).details.insights.join(
                          " "
                        )}
                      />
                    </Section>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h2 className="text-xl font-semibold mb-4 text-indigo-600">{title}</h2>
    {children}
  </div>
);

const List = ({ items }: { items: string[] }) => (
  <ul className="space-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex items-start">
        <span className="text-indigo-500 mr-2">•</span>
        <span className="text-gray-700">{item}</span>
      </li>
    ))}
  </ul>
);
