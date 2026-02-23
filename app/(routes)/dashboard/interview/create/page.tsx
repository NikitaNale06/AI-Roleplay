'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Sparkles, 
  AlertCircle, 
  CheckCircle,
  Brain,
  Zap,
  Plus,
  X,
  Search,
  BookOpen,
  GraduationCap,
  MessageCircle,
  UserCheck,
  Users,
  Code,
  Target,
  Lightbulb,
  Mic,
  Play,
  Star,
  Trophy
} from 'lucide-react';

// Define interfaces
interface IFormInput {
  title: string;
  description: string;
  experience: string;
  skills: string[];
  assessmentType: string;
  subject?: string;
  scenario?: string;
  focusArea?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numberOfQuestions: number;
}

interface GeneratedQuestion {
  id: string;
  question: string;
  type: "technical" | "theoretical" | "behavioral" | "situational" | 
        "domain-specific" | "practical" | "conceptual" |
        "methodological" | "reflective" | "conversational" | "critical";
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit?: number;
  fieldRelevant: boolean;
}

// Assessment types with improved colors
const assessmentTypes = [
  {
    id: 'technical',
    name: 'Technical Interview',
    description: 'Coding, algorithms, system design and technical problem-solving',
    icon: Code,
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-gradient-to-br from-blue-500/90 to-cyan-500/90',
    glowColor: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]',
    borderColor: 'border-blue-400/50',
    category: 'professional',
    image: '👨‍💻',
    skillCategory: 'technical'
  },
  {
    id: 'academic-viva',
    name: 'Academic Viva',
    description: 'Thesis defense, subject knowledge and research methodology',
    icon: GraduationCap,
    color: 'from-purple-500 to-pink-400',
    bgColor: 'bg-gradient-to-br from-purple-500/90 to-pink-500/90',
    glowColor: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]',
    borderColor: 'border-purple-400/50',
    category: 'academic',
    image: '🎓',
    skillCategory: 'academic'
  },
  {
    id: 'communication-test',
    name: 'Communication Test',
    description: 'Public speaking, presentation skills and verbal communication',
    icon: MessageCircle,
    color: 'from-green-500 to-emerald-400',
    bgColor: 'bg-gradient-to-br from-green-500/90 to-emerald-500/90',
    glowColor: 'shadow-[0_0_30px_rgba(34,197,94,0.3)]',
    borderColor: 'border-green-400/50',
    category: 'communication',
    image: '🎤',
    skillCategory: 'communication'
  },
  {
    id: 'behavioral',
    name: 'Behavioral Interview',
    description: 'Situational judgment, teamwork and interpersonal skills',
    icon: Users,
    color: 'from-orange-500 to-red-400',
    bgColor: 'bg-gradient-to-br from-orange-500/90 to-red-500/90',
    glowColor: 'shadow-[0_0_30px_rgba(249,115,22,0.3)]',
    borderColor: 'border-orange-400/50',
    category: 'professional',
    image: '🤝',
    skillCategory: 'behavioral'
  },
  {
    id: 'domain-specific',
    name: 'Domain Specific',
    description: 'Specialized questions for specific industries and fields',
    icon: Target,
    color: 'from-indigo-500 to-purple-400',
    bgColor: 'bg-gradient-to-br from-indigo-500/90 to-purple-500/90',
    glowColor: 'shadow-[0_0_30px_rgba(99,102,241,0.3)]',
    borderColor: 'border-indigo-400/50',
    category: 'professional',
    image: '🎯',
    skillCategory: 'domain'
  },
  {
    id: 'conceptual',
    name: 'Conceptual Understanding',
    description: 'Deep conceptual knowledge and critical thinking assessment',
    icon: Lightbulb,
    color: 'from-yellow-500 to-amber-400',
    bgColor: 'bg-gradient-to-br from-yellow-500/90 to-amber-500/90',
    glowColor: 'shadow-[0_0_30px_rgba(234,179,8,0.3)]',
    borderColor: 'border-yellow-400/50',
    category: 'academic',
    image: '💡',
    skillCategory: 'conceptual'
  },
  {
    id: 'confidence-building',
    name: 'Confidence Building',
    description: 'Build confidence through structured speaking practice',
    icon: UserCheck,
    color: 'from-pink-500 to-rose-400',
    bgColor: 'bg-gradient-to-br from-pink-500/90 to-rose-500/90',
    glowColor: 'shadow-[0_0_30px_rgba(236,72,153,0.3)]',
    borderColor: 'border-pink-400/50',
    category: 'personal',
    image: '⭐',
    skillCategory: 'confidence'
  },
  {
    id: 'general-practice',
    name: 'General Practice',
    description: 'Everyday communication and casual conversation practice',
    icon: Mic,
    color: 'from-gray-500 to-blue-400',
    bgColor: 'bg-gradient-to-br from-gray-500/90 to-blue-500/90',
    glowColor: 'shadow-[0_0_30px_rgba(107,114,128,0.3)]',
    borderColor: 'border-gray-400/50',
    category: 'communication',
    image: '💬',
    skillCategory: 'general'
  }
];

// Component for the animated gaming background
function GamingBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-b from-gray-950 via-purple-950/30 to-gray-950">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-gray-950 to-gray-950"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-px w-px animate-pulse rounded-full bg-blue-400/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Subtle glow effects */}
      <div className="absolute left-1/4 top-1/3 h-48 w-48 animate-pulse rounded-full bg-gradient-to-r from-blue-500/10 to-purple-600/10 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-purple-500/10 to-pink-600/10 blur-3xl animation-delay-1000"></div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        .animate-pulse {
          animation: pulse 4s infinite ease-in-out;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}

// Main component that uses useSearchParams
function CreateInterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialTab = searchParams?.get('type') || 'technical';
  
  // State management
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [useAI, setUseAI] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [searchSkill, setSearchSkill] = useState('');

  // Form data state
  const [formData, setFormData] = useState<IFormInput>({
    title: '',
    description: '',
    experience: '2-5 years',
    skills: [],
    assessmentType: activeTab,
    subject: '',
    scenario: '',
    focusArea: '',
    difficulty: 'medium',
    numberOfQuestions: 8
  });

  // Form validation
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Get current assessment type info
  const currentType = assessmentTypes.find(type => type.id === activeTab) || assessmentTypes[0];

  // Handle tab selection with modal
  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    setShowModal(true);
    
    // Reset form for new tab
    setFormData(prev => ({
      ...prev,
      assessmentType: tabId,
      title: '',
      description: '',
      subject: '',
      scenario: '',
      focusArea: '',
      skills: []
    }));

    // Set default values based on assessment type
    const defaultValues: Record<string, Partial<IFormInput>> = {
      'technical': {
        title: 'Technical Interview Preparation',
        description: 'Prepare for technical interviews with coding challenges and system design questions',
        experience: '2-5 years',
        difficulty: 'medium'
      },
      'academic-viva': {
        title: 'Academic Viva Voce Preparation',
        description: 'Prepare for academic viva voce examinations and thesis defense',
        experience: '5-8 years',
        difficulty: 'medium'
      },
      'communication-test': {
        title: 'Communication Skills Assessment',
        description: 'Improve public speaking, presentation, and verbal communication skills',
        experience: '0-2 years',
        difficulty: 'easy'
      },
      'behavioral': {
        title: 'Behavioral Interview Practice',
        description: 'Practice behavioral interview questions and situational judgment',
        experience: '2-5 years',
        difficulty: 'medium'
      },
      'domain-specific': {
        title: 'Domain Specific Interview',
        description: 'Prepare for industry-specific interviews and specialized knowledge assessment',
        experience: '5-8 years',
        difficulty: 'hard'
      },
      'conceptual': {
        title: 'Conceptual Understanding Test',
        description: 'Assess deep conceptual knowledge and critical thinking abilities',
        experience: '2-5 years',
        difficulty: 'hard'
      },
      'confidence-building': {
        title: 'Confidence Building Session',
        description: 'Build speaking confidence and overcome communication anxiety',
        experience: '0-2 years',
        difficulty: 'easy'
      },
      'general-practice': {
        title: 'General Communication Practice',
        description: 'Practice everyday communication and casual conversation skills',
        experience: '0-2 years',
        difficulty: 'easy'
      }
    };

    if (defaultValues[tabId]) {
      setFormData(prev => ({
        ...prev,
        ...defaultValues[tabId]
      }));
    }
  };

  // Generate description based on title and assessment type
  const generateDescriptionFromTitle = (title: string, assessmentType: string): string => {
    if (!title.trim()) return '';

    const titleLower = title.toLowerCase();
    
    // Common keywords mapping to description templates
    const descriptionTemplates: Record<string, string> = {
      'technical': `Comprehensive technical assessment for ${title} covering relevant technologies, problem-solving skills, and technical competencies.`,
      'academic-viva': `Academic viva voce examination for ${title} focusing on research methodology, theoretical knowledge, and subject matter expertise.`,
      'communication-test': `Communication skills assessment for ${title} evaluating verbal communication, presentation abilities, and interpersonal skills.`,
      'behavioral': `Behavioral competency assessment for ${title} examining situational judgment, teamwork, leadership qualities, and professional conduct.`,
      'domain-specific': `Specialized domain assessment for ${title} testing industry-specific knowledge, practical applications, and field expertise.`,
      'conceptual': `Conceptual understanding evaluation for ${title} assessing deep knowledge, critical thinking, and theoretical foundations.`,
      'confidence-building': `Confidence building session for ${title} focusing on self-expression, communication clarity, and personal development.`,
      'general-practice': `General communication practice for ${title} covering everyday conversation skills and practical communication scenarios.`
    };

    return descriptionTemplates[assessmentType] || `Assessment for ${title} covering relevant skills and competencies.`;
  };

  // Handle title change and auto-generate description
  const handleTitleChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      title: value,
      description: generateDescriptionFromTitle(value, activeTab)
    }));
    
    if (formErrors.title) {
      setFormErrors(prev => ({ ...prev, title: '' }));
    }
  };

  // Handle description change separately
  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }));
    if (formErrors.description) {
      setFormErrors(prev => ({ ...prev, description: '' }));
    }
  };

  // Handle subject/scenario/focusArea change
  const handleSubjectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }));
    if (formErrors.subject) {
      setFormErrors(prev => ({ ...prev, subject: '' }));
    }
  };

  const handleScenarioChange = (value: string) => {
    setFormData(prev => ({ ...prev, scenario: value }));
    if (formErrors.scenario) {
      setFormErrors(prev => ({ ...prev, scenario: '' }));
    }
  };

  const handleFocusAreaChange = (value: string) => {
    setFormData(prev => ({ ...prev, focusArea: value }));
    if (formErrors.focusArea) {
      setFormErrors(prev => ({ ...prev, focusArea: '' }));
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof IFormInput, value: string | string[] | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Add skill to the list
  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      handleInputChange('skills', [...formData.skills, skill]);
    }
  };

  // Add custom skill
  const addCustomSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  // Remove skill from the list
  const removeSkill = (skillToRemove: string) => {
    handleInputChange('skills', formData.skills.filter(skill => skill !== skillToRemove));
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 30) {
      errors.description = 'Description should be at least 30 characters';
    }
    
    if (formData.skills.length === 0) {
      errors.skills = 'Please add at least one skill';
    }

    // Additional validation for specific tabs
    if (activeTab === 'academic-viva' && !formData.subject) {
      errors.subject = 'Subject is required for academic viva';
    }

    if (activeTab === 'domain-specific' && !formData.scenario) {
      errors.scenario = 'Domain/Scenario is required';
    }

    if (activeTab === 'conceptual' && !formData.focusArea) {
      errors.focusArea = 'Focus area is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate questions based on assessment type
  const generateQuestions = (): GeneratedQuestion[] => {
    const { subject, scenario, focusArea, difficulty } = formData;
    const questionBank: GeneratedQuestion[] = [];

    switch (activeTab) {
      case 'academic-viva':
        questionBank.push(
          {
            id: 'academic-1',
            question: `Introduce your research topic in ${subject || 'your subject'} and explain its significance in the academic field.`,
            type: 'theoretical',
            difficulty: difficulty,
            category: 'Research Introduction',
            timeLimit: 180,
            fieldRelevant: true
          },
          {
            id: 'academic-2',
            question: `What research methodology did you use for your study on ${subject || 'this topic'} and why was it appropriate?`,
            type: 'methodological',
            difficulty: difficulty,
            category: 'Research Methodology',
            timeLimit: 240,
            fieldRelevant: true
          }
        );
        break;

      case 'technical':
        questionBank.push(
          {
            id: 'tech-1',
            question: `Explain a key concept in ${subject || 'your technical field'} to someone with no background in the area.`,
            type: 'technical',
            difficulty: difficulty,
            category: 'Technical Explanation',
            timeLimit: 180,
            fieldRelevant: true
          },
          {
            id: 'tech-2',
            question: `How would you approach solving a complex problem in ${subject || 'your field'}?`,
            type: 'practical',
            difficulty: difficulty,
            category: 'Problem Solving',
            timeLimit: 150,
            fieldRelevant: true
          }
        );
        break;

      case 'domain-specific':
        questionBank.push(
          {
            id: 'domain-1',
            question: `Describe the current challenges and opportunities in the ${scenario || 'your industry'} domain.`,
            type: 'domain-specific',
            difficulty: difficulty,
            category: 'Industry Knowledge',
            timeLimit: 200,
            fieldRelevant: true
          },
          {
            id: 'domain-2',
            question: `How would you handle a critical situation specific to ${scenario || 'your field'}?`,
            type: 'situational',
            difficulty: 'hard',
            category: 'Domain Expertise',
            timeLimit: 220,
            fieldRelevant: true
          }
        );
        break;

      case 'conceptual':
        questionBank.push(
          {
            id: 'conceptual-1',
            question: `Explain the fundamental concepts of ${focusArea || 'your focus area'} as if teaching a beginner.`,
            type: 'conceptual',
            difficulty: difficulty,
            category: 'Concept Explanation',
            timeLimit: 180,
            fieldRelevant: true
          },
          {
            id: 'conceptual-2',
            question: `What are the key theories and their limitations in ${focusArea || 'this field'}?`,
            type: 'critical',
            difficulty: 'hard',
            category: 'Theoretical Analysis',
            timeLimit: 200,
            fieldRelevant: true
          }
        );
        break;

      default:
        // For other assessment types, use generic questions
        questionBank.push(
          {
            id: 'general-1',
            question: `Describe your experience and approach to this assessment.`,
            type: 'behavioral',
            difficulty: difficulty,
            category: 'General',
            timeLimit: 120,
            fieldRelevant: true
          }
        );
    }

    // Add more questions to reach the desired count
    while (questionBank.length < formData.numberOfQuestions) {
      questionBank.push({
        id: `auto-${questionBank.length + 1}`,
        question: `Additional question about ${formData.skills[questionBank.length % formData.skills.length] || 'relevant topic'}.`,
        type: 'conceptual',
        difficulty: difficulty,
        category: 'Additional Questions',
        timeLimit: 120,
        fieldRelevant: true
      });
    }

    return questionBank.slice(0, formData.numberOfQuestions);
  };

  // Main form submission handler
  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Please complete all required fields and fix any errors.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      let questions: GeneratedQuestion[] = [];

      if (useAI) {
        try {
          // Try to generate via AI
          const response = await fetch('/api/generate-questions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              assessmentType: activeTab,
              title: formData.title,
              description: formData.description,
              experience: formData.experience,
              skills: formData.skills,
              subject: formData.subject,
              scenario: formData.scenario,
              focusArea: formData.focusArea,
              difficulty: formData.difficulty,
              numberOfQuestions: formData.numberOfQuestions
            }),
          });

          if (response.ok) {
            const result = await response.json();
            questions = (result.questions || []).map((question: string, index: number) => ({
              id: `ai-generated-${index + 1}`,
              question: question,
              type: 'conversational' as const,
              difficulty: formData.difficulty,
              category: result.fieldCategory || 'General',
              timeLimit: 120,
              fieldRelevant: true
            }));
            console.log(`✅ Generated ${questions.length} questions via AI`);
          } else {
            throw new Error('AI service unavailable');
          }
        } catch (aiError: any) {
          console.warn('AI generation failed, using intelligent fallback:', aiError.message);
          setSuccess('AI service unavailable - using intelligent question generation.');
          questions = generateQuestions();
        }
      } else {
        questions = generateQuestions();
        console.log(`✅ Generated ${questions.length} questions manually`);
      }

      if (questions.length === 0) {
        throw new Error('No questions were generated. Please check your inputs and try again.');
      }

      // Create COMPLETE assessment profile
      const assessmentProfile = {
        title: formData.title,
        description: formData.description,
        experience: formData.experience,
        skills: formData.skills,
        assessmentType: activeTab,
        subject: formData.subject,
        scenario: formData.scenario,
        focusArea: formData.focusArea,
        difficulty: formData.difficulty,
        fieldCategory: formData.subject || formData.scenario || formData.focusArea || 'General',
        numberOfQuestions: formData.numberOfQuestions,
        createdAt: new Date().toISOString()
      };

      console.log('💾 Saving profile:', {
        assessmentType: assessmentProfile.assessmentType,
        fieldCategory: assessmentProfile.fieldCategory,
        skills: assessmentProfile.skills,
        subject: assessmentProfile.subject
      });

      // Extract just the question texts for the interview
      const questionTexts = questions.map(q => q.question);

      // Save to localStorage
      localStorage.setItem('interviewProfile', JSON.stringify(assessmentProfile));
      
      localStorage.setItem('generatedQuestions', JSON.stringify({
        questions: questionTexts,
        assessmentType: activeTab,
        fieldCategory: assessmentProfile.fieldCategory,
        skills: formData.skills,
        count: questions.length,
        generatedAt: new Date().toISOString()
      }));

      localStorage.setItem('currentAssessment', JSON.stringify({
        profile: assessmentProfile,
        questions: questionTexts,
        createdAt: new Date().toISOString(),
        type: useAI ? 'ai-enhanced' : 'standard',
        assessmentType: activeTab
      }));

      localStorage.removeItem('activeAssessment');

      const successMessage = `Successfully created ${questions.length} ${currentType.name.toLowerCase()} questions!`;
      
      console.log('✅ Profile saved successfully:', {
        assessmentType: activeTab,
        fieldCategory: assessmentProfile.fieldCategory,
        questionCount: questions.length
      });
      
      setSuccess(successMessage);
      
      // Navigate to start page
      setTimeout(() => {
        router.push('/dashboard/interview/active');
      }, 2000);

    } catch (error: any) {
      console.error('Error generating questions:', error);
      setError(error.message || 'Failed to create assessment. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Get experience level options
  const getExperienceLevels = () => {
    const levels = {
      'technical': [
        { value: '0-2 years', label: '0-2 years (Entry Level)' },
        { value: '2-5 years', label: '2-5 years (Mid Level)' },
        { value: '5-8 years', label: '5-8 years (Senior)' },
        { value: '8+ years', label: '8+ years (Expert)' }
      ],
      'academic-viva': [
        { value: 'Undergraduate', label: 'Undergraduate Level' },
        { value: 'Masters', label: 'Masters Level' },
        { value: 'PhD', label: 'PhD Candidate' },
        { value: 'Postdoctoral', label: 'Postdoctoral/Researcher' }
      ],
      'default': [
        { value: '0-2 years', label: '0-2 years (Beginner)' },
        { value: '2-5 years', label: '2-5 years (Intermediate)' },
        { value: '5-8 years', label: '5-8 years (Advanced)' },
        { value: '8+ years', label: '8+ years (Expert)' }
      ]
    };

    return levels[activeTab as keyof typeof levels] || levels.default;
  };

  // Get skill description based on assessment type
  const getSkillDescription = () => {
    switch (activeTab) {
      case 'academic-viva':
        return formData.subject 
          ? `Skills for ${formData.subject}`
          : 'Select a subject to see specific skills';
      case 'domain-specific':
        return formData.scenario
          ? `Skills for ${formData.scenario} domain`
          : 'Select a domain/scenario to see specific skills';
      case 'technical':
        return formData.subject
          ? `Technical skills for ${formData.subject}`
          : 'Select a technical field to see specific skills';
      case 'conceptual':
        return formData.focusArea
          ? `Conceptual skills for ${formData.focusArea}`
          : 'Select a focus area to see specific skills';
      default:
        return `${currentType.name} Skills`;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      <GamingBackground />
      
      {/* Header */}
      <nav className="relative z-10 flex w-full items-center justify-between bg-gradient-to-r from-gray-900/80 via-purple-900/50 to-gray-900/80 backdrop-blur-sm px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative h-7 w-7">
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/30"></div>
            <div className="relative h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
          </div>
          <h1 className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-lg font-bold text-transparent">
            AI ROLEPLAY
          </h1>
        </div>
        <button 
          onClick={() => router.push('/dashboard')}
          className="transform rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Hero Section - Made smaller */}
        <div className="text-center mb-6">
          <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-3 py-1.5 border border-white/10">
            <span className="text-xs font-semibold text-blue-300">🎮 CREATE ASSESSMENT</span>
          </div>
          
          <h1 className="mb-4 text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
            Create Your
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Roleplay Session
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-sm text-gray-300 mb-4">
            Choose an assessment type and customize it to create your perfect AI roleplay session.
          </p>

          <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
              <Brain className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-300">AI Mode:</span>
              <button
                onClick={() => setUseAI(!useAI)}
                className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                  useAI 
                    ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white' 
                    : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80'
                }`}
              >
                {useAI ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* Assessment Types Section - Grid layout to fit all */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Select Assessment Type</h2>
            <div className="text-xs text-gray-400">
              Click to customize
            </div>
          </div>
          
          {/* Grid layout with 4 columns on desktop, 2 on tablet, 1 on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {assessmentTypes.map((type) => {
              const IconComponent = type.icon;
              const isActive = activeTab === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => handleTabSelect(type.id)}
                  className={`group relative p-4 rounded-xl text-left transition-all duration-300 backdrop-blur-sm border ${
                    isActive
                      ? `${type.bgColor} ${type.glowColor} ${type.borderColor} scale-[1.02]`
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg ${
                        isActive ? 'bg-white/20' : 'bg-white/10'
                      } flex items-center justify-center`}>
                        <span className="text-xl">{type.image}</span>
                      </div>
                      <div className={`p-1.5 rounded-md ${
                        isActive ? 'bg-white/20' : 'bg-white/10'
                      }`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <h3 className={`font-semibold mb-1.5 text-sm ${
                      isActive ? 'text-white' : 'text-gray-200'
                    }`}>
                      {type.name}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {type.description}
                    </p>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400'
                      }`}>
                        {type.category}
                      </span>
                      <span className={`text-xs ${
                        isActive ? 'text-white' : 'text-gray-400'
                      }`}>
                        Select →
                      </span>
                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal for Assessment Configuration */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="relative bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur-sm border-b border-white/10 p-5 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${currentType.bgColor} flex items-center justify-center`}>
                      <span className="text-2xl">{currentType.image}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{currentType.name}</h2>
                      <p className="text-sm text-gray-400">{currentType.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-5 space-y-5">
                {/* Status Messages */}
                {error && (
                  <div className="bg-gradient-to-br from-red-900/30 to-red-900/10 border border-red-700/50 text-red-200 px-4 py-3 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-700/50 text-green-200 px-4 py-3 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Success!</p>
                      <p className="text-sm">{success}</p>
                      <p className="text-xs text-green-300 mt-1">Redirecting to assessment...</p>
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  {/* Assessment Info Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-500/20 rounded-md">
                          <Target className="w-3 h-3 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Assessment Type</p>
                          <p className="font-medium text-white text-sm">{currentType.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-500/20 rounded-md">
                          <Trophy className="w-3 h-3 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Category</p>
                          <p className="font-medium text-white text-sm">{currentType.category}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-green-500/20 rounded-md">
                          <Zap className="w-3 h-3 text-green-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">AI Assistance</p>
                          <p className="font-medium text-white text-sm">{useAI ? 'Enabled' : 'Disabled'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subject/Scenario/Focus Area Fields */}
                  {(activeTab === 'academic-viva' || activeTab === 'technical' || activeTab === 'domain-specific' || activeTab === 'conceptual') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(activeTab === 'academic-viva' || activeTab === 'technical') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {activeTab === 'academic-viva' ? 'Academic Subject' : 'Technical Field'} 
                            <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.subject || ''}
                            onChange={(e) => handleSubjectChange(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
                            placeholder={activeTab === 'academic-viva' 
                              ? "e.g., Computer Science, Physics, Medicine, Law" 
                              : "e.g., Web Development, Data Science, Cybersecurity"}
                            disabled={isGenerating}
                          />
                          {formErrors.subject && (
                            <p className="mt-1 text-xs text-red-400">{formErrors.subject}</p>
                          )}
                        </div>
                      )}
                      
                      {activeTab === 'domain-specific' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Domain/Industry <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.scenario || ''}
                            onChange={(e) => handleScenarioChange(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
                            placeholder="e.g., Healthcare, Finance, Education, Technology"
                            disabled={isGenerating}
                          />
                          {formErrors.scenario && (
                            <p className="mt-1 text-xs text-red-400">{formErrors.scenario}</p>
                          )}
                        </div>
                      )}

                      {activeTab === 'conceptual' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Focus Area <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.focusArea || ''}
                            onChange={(e) => handleFocusAreaChange(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
                            placeholder="e.g., Artificial Intelligence, Sustainable Development, Ethics"
                            disabled={isGenerating}
                          />
                          {formErrors.focusArea && (
                            <p className="mt-1 text-xs text-red-400">{formErrors.focusArea}</p>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Difficulty Level <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={formData.difficulty}
                          onChange={(e) => handleInputChange('difficulty', e.target.value)}
                          className="w-full px-3 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-white text-sm"
                          disabled={isGenerating}
                        >
                          <option value="easy" className="bg-gray-900">Easy</option>
                          <option value="medium" className="bg-gray-900">Medium</option>
                          <option value="hard" className="bg-gray-900">Hard</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Assessment Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
                      placeholder="e.g., Senior Software Engineer Interview, PhD Thesis Defense"
                      disabled={isGenerating}
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-xs text-red-400">{formErrors.title}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
                      placeholder="Describe the assessment..."
                      disabled={isGenerating}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{formData.description.length} characters</span>
                      <span>Minimum 30 characters required</span>
                    </div>
                    {formErrors.description && (
                      <p className="mt-1 text-xs text-red-400">{formErrors.description}</p>
                    )}
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Experience Level <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      className="w-full px-3 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-white text-sm"
                      disabled={isGenerating}
                    >
                      {getExperienceLevels().map((level) => (
                        <option key={level.value} value={level.value} className="bg-gray-900">
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Number of Questions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Number of Questions <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.numberOfQuestions}
                      onChange={(e) => handleInputChange('numberOfQuestions', parseInt(e.target.value))}
                      className="w-full px-3 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-white text-sm"
                      disabled={isGenerating}
                    >
                      <option value={5} className="bg-gray-900">5 Questions</option>
                      <option value={8} className="bg-gray-900">8 Questions</option>
                      <option value={10} className="bg-gray-900">10 Questions</option>
                      <option value={12} className="bg-gray-900">12 Questions</option>
                    </select>
                  </div>

                  {/* Dynamic Skills Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-300">
                        Relevant Skills <span className="text-red-400">*</span>
                      </label>
                      <span className="text-xs text-gray-400">{getSkillDescription()}</span>
                    </div>
                    
                    {/* Search Skills */}
                    <div className="mb-3 relative">
                      <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={searchSkill}
                        onChange={(e) => setSearchSkill(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
                        placeholder="Search skills..."
                        disabled={isGenerating}
                      />
                    </div>

                    {/* Skills Grid - Dynamic based on assessment type */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 max-h-48 overflow-y-auto p-2">
                      {/* Simplified skills for now - you can integrate your skills databases here */}
                      {['Critical Thinking', 'Problem Solving', 'Communication', 'Research Skills', 
                        'Time Management', 'Adaptability', 'Teamwork', 'Leadership'].map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          disabled={formData.skills.includes(skill) || isGenerating}
                          className={`p-3 text-sm rounded-xl border transition-all ${
                            formData.skills.includes(skill)
                              ? 'bg-blue-900/30 border-blue-500 text-blue-300'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-blue-500'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>

                    {/* Show message if no skills available yet */}
                    <div className="text-center py-4 text-gray-500 text-xs">
                      <p>Add custom skills below or use the suggested skills above</p>
                    </div>

                    {/* Custom Skill Input */}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                        className="flex-1 px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
                        placeholder="Add a custom skill..."
                        disabled={isGenerating}
                      />
                      <button
                        type="button"
                        onClick={addCustomSkill}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-white text-sm"
                        disabled={isGenerating}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </div>
                    
                    {/* Selected Skills Display */}
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                        <span className="text-xs text-gray-300 font-medium mr-1.5">Selected Skills:</span>
                        {formData.skills.map((skill) => (
                          <div
                            key={skill}
                            className="flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-xs"
                          >
                            <span className="text-gray-200">{skill}</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="text-gray-400 hover:text-red-400 transition-colors"
                              disabled={isGenerating}
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {formErrors.skills && (
                      <p className="mt-1 text-xs text-red-400">{formErrors.skills}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 z-10 bg-gray-900/90 backdrop-blur-sm border-t border-white/10 p-5 rounded-b-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-lg transition-colors text-gray-300 text-sm border border-white/10"
                      disabled={isGenerating}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setActiveTab('technical');
                      }}
                      className="px-4 py-2 bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-lg transition-colors text-gray-300 text-sm border border-white/10"
                      disabled={isGenerating}
                    >
                      Change Type
                    </button>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isGenerating}
                    className={`px-6 py-2.5 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 text-sm ${
                      isGenerating
                        ? 'bg-gradient-to-r from-gray-700 to-gray-800 cursor-not-allowed text-gray-400'
                        : `${currentType.bgColor} hover:scale-105 text-white shadow-lg`
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Start Assessment
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-b from-gray-950 via-purple-950/30 to-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-gray-950 to-gray-950"></div>
      </div>
      
      <nav className="relative z-10 flex w-full items-center justify-between bg-gradient-to-r from-gray-900/80 via-purple-900/50 to-gray-900/80 backdrop-blur-sm px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative h-7 w-7">
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/30"></div>
            <div className="relative h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
          </div>
          <h1 className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-lg font-bold text-transparent">
            AI ROLEPLAY
          </h1>
        </div>
      </nav>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading assessment creator...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function InterviewCreatePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CreateInterviewContent />
    </Suspense>
  );
}