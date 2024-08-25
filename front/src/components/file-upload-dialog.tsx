'use client'

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';
import { XIcon } from 'lucide-react';
import { ChangeEvent, DragEvent, useState } from 'react';

export default function Component() {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [urlInput, setUrlInput] = useState<string>(''); // To store URL input
  const [uploadProgress, setUploadProgress] = useState<number>(0); // To track upload progress
  const [summaries, setSummaries] = useState<Array<{ filename?: string; url?: string; summary: string }>>([]);
  const [showForm, setShowForm] = useState<boolean>(true); // To control form visibility
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // To store image preview URL

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (): void => {
    setIsDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const files = Array.from(event.dataTransfer.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
      handlePreview(files[0]); // Preview the first dropped file if it’s an image
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
      handlePreview(files[0]); // Preview the first selected file if it’s an image
    }
  };

  const handlePreview = (file: File): void => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else if (file.type === 'audio/mpeg' || file.type === 'audio/mp3') {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0 && !urlInput.trim()) return;

    setIsSubmitting(true);
    setSummaries([]); // Reset summaries before a new request
    setUploadProgress(0); // Reset progress

    const formData = new FormData();

    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
    } else if (urlInput) {
      formData.append('youtube_url', urlInput);
    }

    try {
      const response = await axios.post(
        'https://focus-feed-production.up.railway.app/multiformat/submit',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;

            if (total) {
              const progress = Math.round((loaded * 100) / total);
              setUploadProgress(progress);
              console.log(`Upload Progress: ${progress}%`);
            } else {
              console.log(`Uploaded ${loaded} bytes`);
            }
          },
        }
      );

      if (response.status === 200) {
        console.log('Submission successful.');
        setUploadProgress(100); // Set to 100% on successful completion
        setSummaries([response.data]); // Assuming the response contains a single summary object
        setShowForm(false); // Hide form after successful submission
      } else {
        console.error('Submission failed.');
        setUploadProgress(0); // Reset progress on failure
      }
    } catch (error) {
      console.error('Error during submission:', error);
      setUploadProgress(0); // Reset progress on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = (index: number): void => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    if (index === 0) setPreviewUrl(null); // Remove preview if the first file is removed
  };

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Upload Files or Provide a URL</CardTitle>
        <CardDescription>
          Drag and drop files or enter a URL to get a summary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {showForm && (
            <>
              <div
                className={`grid gap-2 rounded-md border p-4 transition-colors ${
                  isDragOver
                    ? 'bg-muted/50 border-primary'
                    : 'border-neutral-400 hover:border-primary'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {selectedFiles.length === 0 ? (
                  <>
                    <UploadIcon className="h-6 w-6 text-muted-foreground mx-auto" />
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        Drag and drop files here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to select files from your device
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full">
                    <h3 className="text-sm font-medium mb-2">Selected Files:</h3>
                    <ul className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between bg-muted rounded-md p-2"
                        >
                          <span className="text-sm truncate">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="ml-2"
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file')?.click()}
                  className="mt-2"
                >
                  {selectedFiles.length > 0 ? 'Add more files' : 'Browse'}
                </Button>
              </div>

              {previewUrl && (
                <div className="my-4">
                  <h3 className="text-sm font-medium mb-2">File Preview:</h3>
                  {selectedFiles.length > 0 && selectedFiles[0].type.startsWith('image/') && (
                    <img src={previewUrl} alt="Image Preview" className="rounded-md max-h-48" />
                  )}
                  {selectedFiles.length > 0 && selectedFiles[0].type === 'application/pdf' && (
                    <embed src={previewUrl} type="application/pdf" width="100%" height="500px" />
                  )}
                  {selectedFiles.length > 0 && (selectedFiles[0].type === 'audio/mpeg' || selectedFiles[0].type === 'audio/mp3') && (
                    <audio controls>
                      <source src={previewUrl} type={selectedFiles[0].type} />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              )}

              <div className="grid grid-cols-[auto_1fr] items-center gap-2 rounded-md border p-4">
                <LinkIcon className="h-6 w-6 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter a URL"
                  className="border-0 p-0 focus:ring-0"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>

              {uploadProgress > 0 && (
                <Progress value={uploadProgress} className="w-full" />
              )}

              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting || (selectedFiles.length === 0 && !urlInput.trim())}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </>
          )}

          {!showForm && summaries.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Summaries:</h3>
              <ul className="space-y-2">
                {summaries.map((summaryObj, index) => (
                  <li
                    key={index}
                    className="bg-muted rounded-md p-2"
                  >
                    {summaryObj.url && <p className="font-bold">URL: <a href={summaryObj.url} target="_blank" rel="noopener noreferrer">{summaryObj.url}</a></p>}
                    <p>{summaryObj.summary}</p>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowForm(true);
                  setSelectedFiles([]);
                  setPreviewUrl(null);
                  setSummaries([]);
                  setUploadProgress(0);
                  setUrlInput('');
                }}
                className="mt-4"
              >
                Upload More Files or Enter Another URL
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
