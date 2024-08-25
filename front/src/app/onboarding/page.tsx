import OnboardingQuiz from '@/components/quiz';

export default function OnboardingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col justify-center items-center p-4'>
      <OnboardingQuiz />
    </div>
  );
}
