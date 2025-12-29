import { Logo } from '@/components/Logo';
import OnboardingForm from './OnboardingForm';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-neutral-200">
        <Logo size="sm" variant="dark" />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Complete Your Profile</h1>
            <p className="text-neutral-600">Tell us about yourself to get started on Staunton Trade</p>
          </div>
          
          <OnboardingForm />
        </div>
      </main>
    </div>
  );
}


