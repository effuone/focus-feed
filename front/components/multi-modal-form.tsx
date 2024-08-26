import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoSummaryProps } from '@/components/video-summary';
import {
  FileIcon,
  FileTextIcon,
  MusicIcon,
  VideoIcon,
  XIcon,
} from 'lucide-react';
import Image from 'next/image';
import React, { ChangeEvent, DragEvent, useEffect, useState } from 'react';
import backendApiInstance from '../services';

interface FilePreview {
  type: 'image' | 'pdf' | 'audio' | 'video' | 'spreadsheet' | 'file';
  src?: string;
}

export default function MultiModalForm({
  onSummaryAvailable,
}: {
  onSummaryAvailable: (summary: VideoSummaryProps | any) => void;
}) {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [urlInput, setUrlInput] = useState<string>('');
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [activeTab, setActiveTab] = useState<string>('file');

  useEffect(() => {
    const previews = selectedFiles.map((file) => createFilePreview(file));
    setFilePreviews(previews);

    return () => {
      previews.forEach((preview) => {
        if (preview.src) URL.revokeObjectURL(preview.src);
      });
    };
  }, [selectedFiles]);

  const createFilePreview = (file: File): FilePreview => {
    if (file.type.startsWith('image/')) {
      return { type: 'image', src: URL.createObjectURL(file) };
    } else if (file.type === 'application/pdf') {
      return { type: 'pdf', src: URL.createObjectURL(file) };
    } else if (file.type === 'audio/mpeg') {
      return { type: 'audio', src: URL.createObjectURL(file) };
    } else if (file.type.startsWith('video/')) {
      return { type: 'video', src: URL.createObjectURL(file) };
    } else if (
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.name.endsWith('.csv')
    ) {
      return { type: 'spreadsheet' };
    } else {
      return { type: 'file' };
    }
  };

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
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const formData = new FormData();
    let endpoint = '';
    const token = localStorage.getItem('token');

    if (activeTab === 'file') {
      if (selectedFiles.length > 0) {
        endpoint = '/multiformat/submit';
        selectedFiles.forEach((file) => {
          formData.append('files', file);
        });
      }
    } else if (activeTab === 'url') {
      if (urlInput) {
        endpoint = '/multiformat/upload';
        formData.append('url', urlInput);
        formData.append('contentType', 'url');
      }
    }

    try {
      if (endpoint) {
        const response = await backendApiInstance.post(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          onSummaryAvailable(response.data);
        } else {
          console.error('Submission failed.');
        }
      }
    } catch (error) {
      console.error('Error during submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = (index: number): void => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFilePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  return (
    <Card className='w-full max-w-4xl'>
      <CardHeader>
        <CardTitle>Upload or Provide Content</CardTitle>
        <CardDescription>
          Select an option to either upload files or provide a URL.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue='file'
          onValueChange={setActiveTab}
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='file'>Upload Files</TabsTrigger>
            <TabsTrigger value='url'>Provide URL</TabsTrigger>
          </TabsList>
          <TabsContent value='file'>
            <FileUploadArea
              isDragOver={isDragOver}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleFileChange={handleFileChange}
              selectedFiles={selectedFiles}
              removeFile={removeFile}
              filePreviews={filePreviews}
            />
          </TabsContent>
          <TabsContent value='url'>
            <UrlInputArea
              urlInput={urlInput}
              setUrlInput={setUrlInput}
            />
          </TabsContent>
        </Tabs>
        <Button
          size='lg'
          onClick={handleSubmit}
          disabled={isSubmitting || (selectedFiles.length === 0 && !urlInput)}
          className='w-full mt-6'
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </CardContent>
      <CardContent>
        <FilePreviews filePreviews={filePreviews} />
      </CardContent>
    </Card>
  );
}

const FileUploadArea: React.FC<{
  isDragOver: boolean;
  handleDragOver: (event: DragEvent<HTMLDivElement>) => void;
  handleDragLeave: () => void;
  handleDrop: (event: DragEvent<HTMLDivElement>) => void;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  selectedFiles: File[];
  removeFile: (index: number) => void;
  filePreviews: FilePreview[];
}> = ({
  isDragOver,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileChange,
  selectedFiles,
  removeFile,
  filePreviews,
}) => (
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
        <UploadIcon className='h-12 w-12 text-muted-foreground mx-auto' />
        <div className='text-center'>
          <p className='text-lg font-medium'>Drag and drop files here</p>
          <p className='text-sm text-muted-foreground'>
            or click to select files from your device
          </p>
        </div>
      </>
    ) : (
      <div className='w-full'>
        <h3 className='text-lg font-medium mb-4'>Selected Files:</h3>
        <ul className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {selectedFiles.map((file, index) => (
            <li
              key={index}
              className='flex items-center justify-between bg-muted rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow'
            >
              <div className='flex items-center space-x-3'>
                {filePreviews[index] ? (
                  renderFileIcon(filePreviews[index])
                ) : (
                  <FileIcon className='h-8 w-8 text-gray-500' />
                )}
                <span className='text-sm font-medium truncate max-w-[150px]'>
                  {file.name}
                </span>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => removeFile(index)}
                className='ml-2'
              >
                <XIcon className='h-4 w-4' />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    )}
    <Input
      id='file'
      type='file'
      onChange={handleFileChange}
      className='hidden'
      multiple
    />
    <Button
      variant='outline'
      size='sm'
      onClick={() => document.getElementById('file')?.click()}
      className='mt-4'
    >
      {selectedFiles.length > 0 ? 'Add more files' : 'Browse'}
    </Button>
  </div>
);

// UrlInputArea component
const UrlInputArea: React.FC<{
  urlInput: string;
  setUrlInput: (value: string) => void;
}> = ({ urlInput, setUrlInput }) => (
  <div className='grid grid-cols-[auto_1fr] items-center gap-2 rounded-md border p-4'>
    <LinkIcon className='h-6 w-6 text-muted-foreground' />
    <Input
      type='text'
      placeholder='Enter a URL'
      className='border-0 p-0 focus:ring-0'
      value={urlInput}
      onChange={(e) => setUrlInput(e.target.value)}
    />
  </div>
);

// FilePreviews component
const FilePreviews: React.FC<{
  filePreviews: FilePreview[];
}> = ({ filePreviews }) => (
  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
    {filePreviews.map((preview, index) => (
      <div
        key={index}
        className='rounded-lg overflow-hidden shadow-md'
      >
        {preview.type === 'pdf' && (
          <iframe
            src={preview.src}
            title={`PDF Preview ${index}`}
            width='100%'
            height='300px'
            className='border-0'
          />
        )}
        {preview.type === 'audio' && (
          <audio
            controls
            className='w-full'
          >
            <source
              src={preview.src}
              type='audio/mpeg'
            />
            Your browser does not support the audio element.
          </audio>
        )}
        {preview.type === 'video' && (
          <video
            controls
            className='w-full'
          >
            <source
              src={preview.src}
              type='video/mp4'
            />
            Your browser does not support the video tag.
          </video>
        )}
        {preview.type === 'spreadsheet' && (
          <div className='flex items-center justify-center h-40 bg-gray-100'>
            <FileTextIcon className='h-16 w-16 text-green-500' />
            <span className='ml-2 text-sm font-medium'>
              Spreadsheet Preview not available.
            </span>
          </div>
        )}
        {preview.type === 'image' && preview.src && (
  <Image
    src={preview.src}
    alt={`Preview ${index}`}
    className="w-full h-40 object-cover"
    layout="fill"
    objectFit="cover"
  />
)}

      </div>
    ))}
  </div>
);

// Helper function to render file icons
function renderFileIcon(preview: FilePreview) {
  if (!preview || !preview.type) {
    return <FileIcon className='h-8 w-8 text-gray-500' />;
  }

  switch (preview.type) {
    case 'pdf':
      return <FileTextIcon className='h-8 w-8 text-red-500' />;
    case 'audio':
      return <MusicIcon className='h-8 w-8 text-blue-500' />;
    case 'video':
      return <VideoIcon className='h-8 w-8 text-green-500' />;
    case 'spreadsheet':
      return <FileTextIcon className='h-8 w-8 text-green-500' />;
      case 'image':
        return preview.src ? (
          <Image
            src={preview.src}
            alt="Preview"
            className="h-8 w-8 object-cover rounded"
            layout="fixed"
            width={32} // Set appropriate width for the image
            height={32} // Set appropriate height for the image
          />
        ) : (
          <FileIcon className="h-8 w-8 text-gray-500" />
        );
      
    default:
      return <FileIcon className='h-8 w-8 text-gray-500' />;
  }
}

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
      <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
    </svg>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
      <polyline points='17 8 12 3 7 8' />
      <line
        x1='12'
        x2='12'
        y1='3'
        y2='15'
      />
    </svg>
  );
}
