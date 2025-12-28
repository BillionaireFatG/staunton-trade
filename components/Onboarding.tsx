'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Building2,
  User,
  FileText,
  Shield,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Globe,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Sparkles,
  X,
  Camera,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

// Step configuration
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Staunton Trade',
    description: 'Let\'s get you set up to start trading',
    icon: Sparkles,
  },
  {
    id: 'profile',
    title: 'Personal Details',
    description: 'Tell us about yourself',
    icon: User,
  },
  {
    id: 'company',
    title: 'Company Information',
    description: 'Add your business details',
    icon: Building2,
  },
  {
    id: 'verification',
    title: 'Verification',
    description: 'Upload documents to get verified',
    icon: Shield,
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Start trading with confidence',
    icon: CheckCircle2,
  },
];

// Form data types
interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
}

interface CompanyData {
  companyName: string;
  companyType: string;
  industry: string;
  country: string;
  address: string;
  website: string;
  description: string;
}

interface VerificationData {
  businessLicense: File | null;
  taxDocument: File | null;
  proofOfAddress: File | null;
}

// Step Progress Indicator
function StepIndicator({ steps, currentStep }: { steps: OnboardingStep[]; currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <React.Fragment key={step.id}>
            <motion.div
              initial={false}
              animate={{
                scale: isCurrent ? 1.1 : 1,
              }}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                isComplete ? 'bg-primary text-primary-foreground' :
                isCurrent ? 'bg-primary/20 text-primary border-2 border-primary' :
                'bg-muted text-muted-foreground'
              )}
            >
              {isComplete ? <Check size={18} /> : <Icon size={18} />}
            </motion.div>
            {index < steps.length - 1 && (
              <div className={cn(
                'w-8 h-0.5 rounded-full transition-colors',
                index < currentStep ? 'bg-primary' : 'bg-muted'
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Welcome Step
function WelcomeStep({ onNext }: { onNext: () => void }) {
  const features = [
    { icon: Globe, title: 'Global Trading', desc: 'Connect with verified partners worldwide' },
    { icon: Shield, title: 'Trust Scores', desc: 'Trade with confidence using our rating system' },
    { icon: FileText, title: 'Smart Contracts', desc: 'Automated documentation and tracking' },
    { icon: Briefcase, title: 'Deal Management', desc: 'End-to-end transaction handling' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
        <Sparkles size={40} className="text-primary-foreground" />
      </div>
      
      <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Staunton Trade</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        The world's most trusted commodity trading platform. Let's get your account set up in just a few steps.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
        {features.map((feature) => (
          <Card key={feature.title} className="text-left">
            <CardContent className="p-4">
              <feature.icon size={24} className="text-primary mb-2" />
              <h3 className="font-medium text-sm text-foreground">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button size="lg" onClick={onNext} className="gap-2">
        Get Started
        <ArrowRight size={18} />
      </Button>
    </motion.div>
  );
}

// Profile Step
function ProfileStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: ProfileData;
  onChange: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const isValid = data.firstName && data.lastName && data.phone;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-md mx-auto"
    >
      {/* Avatar Upload */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
            <AvatarImage src={data.avatar} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-primary/50 text-primary-foreground">
              {data.firstName?.[0]}{data.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow">
            <Camera size={14} />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </label>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Upload a profile photo</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              placeholder="John"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="pl-10"
              disabled
            />
          </div>
          <p className="text-xs text-muted-foreground">Email is from your account</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="pl-10"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Your Role</Label>
          <Select value={data.role} onValueChange={(value) => onChange({ role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trader">Trader</SelectItem>
              <SelectItem value="broker">Broker</SelectItem>
              <SelectItem value="operations">Operations Manager</SelectItem>
              <SelectItem value="finance">Finance Director</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="gap-2">
          Continue
          <ArrowRight size={16} />
        </Button>
      </div>
    </motion.div>
  );
}

// Company Step
function CompanyStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: CompanyData;
  onChange: (data: Partial<CompanyData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const isValid = data.companyName && data.companyType && data.country;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-md mx-auto"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <div className="relative">
            <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="companyName"
              value={data.companyName}
              onChange={(e) => onChange({ companyName: e.target.value })}
              className="pl-10"
              placeholder="Acme Trading Co."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Company Type *</Label>
            <Select value={data.companyType} onValueChange={(value) => onChange({ companyType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trader">Trader</SelectItem>
                <SelectItem value="refiner">Refiner</SelectItem>
                <SelectItem value="distributor">Distributor</SelectItem>
                <SelectItem value="producer">Producer</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Industry</Label>
            <Select value={data.industry} onValueChange={(value) => onChange({ industry: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oil-gas">Oil & Gas</SelectItem>
                <SelectItem value="petrochemicals">Petrochemicals</SelectItem>
                <SelectItem value="shipping">Shipping</SelectItem>
                <SelectItem value="agriculture">Agriculture</SelectItem>
                <SelectItem value="metals">Metals & Mining</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Country *</Label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Select value={data.country} onValueChange={(value) => onChange({ country: value })}>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="nl">Netherlands</SelectItem>
                <SelectItem value="sg">Singapore</SelectItem>
                <SelectItem value="ae">UAE</SelectItem>
                <SelectItem value="ng">Nigeria</SelectItem>
                <SelectItem value="br">Brazil</SelectItem>
                <SelectItem value="cn">China</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Business Address</Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="123 Trading Street, City"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <div className="relative">
            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="website"
              value={data.website}
              onChange={(e) => onChange({ website: e.target.value })}
              className="pl-10"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Company Description</Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Tell us about your business..."
            rows={3}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="gap-2">
          Continue
          <ArrowRight size={16} />
        </Button>
      </div>
    </motion.div>
  );
}

// Verification Step
function VerificationStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: VerificationData;
  onChange: (data: Partial<VerificationData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const documents = [
    { 
      id: 'businessLicense', 
      title: 'Business License', 
      desc: 'Certificate of incorporation or business registration',
      file: data.businessLicense 
    },
    { 
      id: 'taxDocument', 
      title: 'Tax Document', 
      desc: 'Tax ID certificate or VAT registration',
      file: data.taxDocument 
    },
    { 
      id: 'proofOfAddress', 
      title: 'Proof of Address', 
      desc: 'Utility bill or bank statement (less than 3 months old)',
      file: data.proofOfAddress 
    },
  ];

  const handleFileUpload = (docId: string, file: File) => {
    onChange({ [docId]: file } as Partial<VerificationData>);
  };

  const uploadedCount = documents.filter(d => d.file).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <Badge variant="secondary" className="mb-4">
          {uploadedCount}/3 documents uploaded
        </Badge>
        <p className="text-sm text-muted-foreground">
          Upload documents to get verified and unlock higher trust scores.
        </p>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={cn(
              'p-4 rounded-lg border-2 border-dashed transition-colors',
              doc.file ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                doc.file ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}>
                {doc.file ? <Check size={18} /> : <Upload size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">{doc.title}</p>
                <p className="text-xs text-muted-foreground mb-2">{doc.desc}</p>
                {doc.file ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs truncate max-w-[200px]">
                      <FileText size={10} className="mr-1" />
                      {doc.file.name}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => onChange({ [doc.id]: null } as Partial<VerificationData>)}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ) : (
                  <label>
                    <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                      <span>
                        <Upload size={12} className="mr-1" />
                        Upload File
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(doc.id, file);
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Accepted formats: PDF, JPG, PNG (max 10MB each)
      </p>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button onClick={onNext} className="gap-2">
          {uploadedCount === 0 ? 'Skip for Now' : 'Continue'}
          <ArrowRight size={16} />
        </Button>
      </div>
    </motion.div>
  );
}

// Complete Step
function CompleteStep({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
      >
        <CheckCircle2 size={40} className="text-white" />
      </motion.div>

      <h2 className="text-2xl font-bold text-foreground mb-2">You're All Set!</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Your account is now ready. Start exploring the platform and make your first trade.
      </p>

      <div className="flex flex-col items-center gap-4">
        <Button size="lg" onClick={onComplete} className="gap-2">
          Go to Dashboard
          <ArrowRight size={18} />
        </Button>
        <p className="text-xs text-muted-foreground">
          Need help? <a href="#" className="text-primary hover:underline">Contact support</a>
        </p>
      </div>
    </motion.div>
  );
}

// Main Onboarding Component
interface OnboardingProps {
  userEmail?: string;
  onComplete: () => void;
  onSkip?: () => void;
}

export function Onboarding({ userEmail = '', onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [profileData, setProfileData] = React.useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: userEmail,
    phone: '',
    role: '',
  });
  const [companyData, setCompanyData] = React.useState<CompanyData>({
    companyName: '',
    companyType: '',
    industry: '',
    country: '',
    address: '',
    website: '',
    description: '',
  });
  const [verificationData, setVerificationData] = React.useState<VerificationData>({
    businessLicense: null,
    taxDocument: null,
    proofOfAddress: null,
  });

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, ONBOARDING_STEPS.length - 1));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border py-4 px-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 size={16} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Staunton Trade</span>
          </div>
          {onSkip && currentStep < ONBOARDING_STEPS.length - 1 && (
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Skip setup
            </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="py-4 px-6 border-b border-border">
        <div className="max-w-2xl mx-auto space-y-4">
          <Progress value={progress} className="h-1" />
          <StepIndicator steps={ONBOARDING_STEPS} currentStep={currentStep} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 py-12 px-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-foreground">
              {ONBOARDING_STEPS[currentStep].title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {ONBOARDING_STEPS[currentStep].description}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <WelcomeStep key="welcome" onNext={handleNext} />
            )}
            {currentStep === 1 && (
              <ProfileStep
                key="profile"
                data={profileData}
                onChange={(d) => setProfileData((prev) => ({ ...prev, ...d }))}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 2 && (
              <CompanyStep
                key="company"
                data={companyData}
                onChange={(d) => setCompanyData((prev) => ({ ...prev, ...d }))}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <VerificationStep
                key="verification"
                data={verificationData}
                onChange={(d) => setVerificationData((prev) => ({ ...prev, ...d }))}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <CompleteStep key="complete" onComplete={onComplete} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;


