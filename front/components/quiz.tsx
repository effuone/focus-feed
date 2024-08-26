'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import backendApiInstance from '../services';

interface Question {
  prompt: string;
  options: string[];
}

const questions: Question[] = [
  {
    prompt: 'What type of content do you most often engage with?',
    options: ['Books', 'Articles', 'Podcasts', 'Videos', 'Social Media'],
  },
  {
    prompt: 'How much time do you typically spend learning each day?',
    options: [
      'Less than 15 minutes',
      '15-30 minutes',
      '30-60 minutes',
      'More than an hour',
    ],
  },
  {
    prompt: 'What is your primary goal for using FocusFeed?',
    options: [
      'Stay up-to-date with industry trends',
      'Deep dive into specific topics',
      'Improve general knowledge',
      'Enhance professional skills',
    ],
  },
  {
    prompt: 'Which feature of FocusFeed excites you the most?',
    options: [
      'AI-driven video summaries',
      'Personalized content recommendations',
      'Multi-format support',
      'TikTok-style presentation',
    ],
  },
  {
    prompt: 'How do you prefer to consume educational content?',
    options: [
      'Short, bite-sized pieces',
      'In-depth, long-form content',
      'Interactive quizzes and exercises',
      'A mix of different formats',
    ],
  },
];

export default function OnboardingQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userResponses, setUserResponses] = useState<Record<number, number>>(
    {}
  );
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setUserResponses((prevResponses) => ({
      ...prevResponses,
      [questionIndex]: answerIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (userResponses[currentQuestionIndex] !== undefined) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        submitQuizResponses();
      }
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const submitQuizResponses = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    const token = localStorage.getItem('token');

    if (!token) {
      setSubmissionError(
        'Authentication token not found. Please log in again.'
      );
      setIsSubmitting(false);
      return;
    }

    const questionsArray = questions.map((q) => q.prompt);
    const answersArray = questions.map(
      (question, index) => question.options[userResponses[index]]
    );

    try {
      const response = await backendApiInstance.post(
        '/quiz/summarize',
        {
          questions: questionsArray,
          answers: answersArray,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsComplete(true);
      } else {
        setSubmissionError('Failed to submit responses. Please try again.');
      }
    } catch (error: any) {
      console.error('Error submitting quiz responses:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        setSubmissionError(error.response.data.detail);
      } else {
        setSubmissionError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderOptions = (options: string[], questionIndex: number) => {
    return options.map((option, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
      >
        <Button
          variant={
            userResponses[questionIndex] === index ? 'default' : 'outline'
          }
          className='w-full justify-start text-left p-4'
          onClick={() => handleAnswerSelect(questionIndex, index)}
        >
          {option}
        </Button>
      </motion.div>
    ));
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.3 }}
        className='space-y-6'
      >
        <h3 className='text-2xl font-bold text-primary'>
          {currentQuestion.prompt}
        </h3>
        <div className='grid gap-3'>
          {renderOptions(currentQuestion.options, currentQuestionIndex)}
        </div>
      </motion.div>
    );
  };

  const renderProgressIndicator = () => (
    <div className='space-y-2'>
      <div className='flex justify-between text-sm text-muted-foreground'>
        <span>
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>
      <Progress
        value={((currentQuestionIndex + 1) / questions.length) * 100}
        className='h-2'
      />
    </div>
  );

  const renderNavigationButtons = () => (
    <div className='flex justify-between'>
      <Button
        variant='outline'
        onClick={handlePreviousQuestion}
        disabled={currentQuestionIndex === 0 || isSubmitting}
        className='flex items-center'
        aria-label='Previous Question'
      >
        <ArrowLeft className='mr-2 h-4 w-4' /> Previous
      </Button>
      <Button
        onClick={handleNextQuestion}
        disabled={
          userResponses[currentQuestionIndex] === undefined || isSubmitting
        }
        className='flex items-center'
        aria-label={
          currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'
        }
      >
        {isSubmitting ? (
          <>
            Submitting
            <Loader2 className='ml-2 h-4 w-4 animate-spin' />
          </>
        ) : currentQuestionIndex === questions.length - 1 ? (
          <>
            Submit <CheckCircle className='ml-2 h-4 w-4' />
          </>
        ) : (
          <>
            Next <ArrowRight className='ml-2 h-4 w-4' />
          </>
        )}
      </Button>
    </div>
  );

  const renderSummary = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='text-center'>
        <CheckCircle className='mx-auto h-16 w-16 text-green-500' />
        <h2 className='mt-4 text-3xl font-bold text-primary'>All Set!</h2>
        <p className='mt-2 text-muted-foreground'>
          Thank you for completing the quiz. We&apos;re excited to personalize
          your FocusFeed experience!
        </p>
      </div>
      <div className='space-y-4'>
        {questions.map((question, index) => (
          <div
            key={index}
            className='bg-muted p-4 rounded-lg'
          >
            <div className='font-medium text-primary'>{question.prompt}</div>
            <div className='mt-1 text-muted-foreground'>
              {question.options[userResponses[index]]}
            </div>
          </div>
        ))}
      </div>
      <Button
        className='w-full'
        onClick={() => router.push('/feed')}
      >
        Start Your FocusFeed Journey
      </Button>
    </motion.div>
  );

  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-2xl mx-auto shadow-lg'>
        {!isComplete && (
          <CardHeader className='text-center'>
            <CardTitle className='text-3xl font-bold text-primary'>
              Welcome to FocusFeed!
            </CardTitle>
            <CardDescription>
              Let&apos;s personalize your learning experience. Answer a few
              quick questions to help us tailor content to your preferences.
            </CardDescription>
          </CardHeader>
        )}
        <CardContent className='space-y-6'>
          {submissionError && (
            <div className='text-red-500 text-center'>{submissionError}</div>
          )}
          <AnimatePresence mode='wait'>
            {!isComplete ? renderQuestion() : renderSummary()}
          </AnimatePresence>
        </CardContent>
        {!isComplete && (
          <CardFooter className='flex flex-col space-y-4'>
            {renderProgressIndicator()}
            {renderNavigationButtons()}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
