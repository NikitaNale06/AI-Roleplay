'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  Trophy,
  ArrowRight
} from 'lucide-react';

/* ======================================================
   ULTRA FUTURISTIC AI BACKGROUND
====================================================== */

function AILabBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-black" />

      {/* Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.25),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.25),transparent_40%)] animate-pulse" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Neon Blobs */}
      <div className="absolute top-[-250px] left-[-250px] w-[700px] h-[700px] bg-purple-600/20 blur-[200px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-250px] right-[-250px] w-[700px] h-[700px] bg-blue-600/20 blur-[200px] rounded-full animate-pulse" />
      
      {/* Additional floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-px w-px bg-white/30 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `floatParticle ${5 + Math.random() * 10}s linear infinite`,
            opacity: 0.3 + Math.random() * 0.5
          }}
        />
      ))}

      <style jsx>{`
        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100px) translateX(100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// Define interfaces
interface IFormInput {
  title: string;
  skills: string[];
  assessmentType: string;
  subject?: string;
  scenario?: string;
  focusArea?: string;
  difficulty: 'easy' | 'medium' | 'hard';
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

// Assessment types with futuristic styling
const assessmentTypes = [
  {
    id: 'technical',
    name: 'Technical AI Simulation',
    description: 'Advanced coding, system design & problem-solving challenges with AI',
    icon: Code,
    accent: 'from-purple-500 to-indigo-500',
    bgGlow: 'rgba(139,92,246,0.3)',
    gradient: 'bg-gradient-to-br from-purple-900/90 to-indigo-900/90',
    borderGlow: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]',
    image: '👨‍💻'
  },
  {
    id: 'academic-viva',
    name: 'Academic Viva Lab',
    description: 'Thesis defense, research methodology & scholarly discourse simulation',
    icon: GraduationCap,
    accent: 'from-blue-500 to-cyan-500',
    bgGlow: 'rgba(59,130,246,0.3)',
    gradient: 'bg-gradient-to-br from-blue-900/90 to-cyan-900/90',
    borderGlow: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]',
    image: '🎓'
  },
  {
    id: 'communication-test',
    name: 'Communication Intelligence',
    description: 'Public speaking, presentation & verbal communication mastery',
    icon: MessageCircle,
    accent: 'from-green-500 to-emerald-500',
    bgGlow: 'rgba(34,197,94,0.3)',
    gradient: 'bg-gradient-to-br from-green-900/90 to-emerald-900/90',
    borderGlow: 'hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]',
    image: '🎤'
  },
  {
    id: 'behavioral',
    name: 'Behavioral Intelligence',
    description: 'Soft skills, communication & leadership evaluation with AI',
    icon: Users,
    accent: 'from-orange-500 to-red-500',
    bgGlow: 'rgba(249,115,22,0.3)',
    gradient: 'bg-gradient-to-br from-orange-900/90 to-red-900/90',
    borderGlow: 'hover:shadow-[0_0_40px_rgba(249,115,22,0.5)]',
    image: '🤝'
  },
  {
    id: 'domain-specific',
    name: 'Domain Expert Simulator',
    description: 'Specialized industry knowledge & field-specific expertise assessment',
    icon: Target,
    accent: 'from-indigo-500 to-purple-500',
    bgGlow: 'rgba(99,102,241,0.3)',
    gradient: 'bg-gradient-to-br from-indigo-900/90 to-purple-900/90',
    borderGlow: 'hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]',
    image: '🎯'
  },
  {
    id: 'conceptual',
    name: 'Deep Concept Analyzer',
    description: 'Deep conceptual knowledge & critical thinking assessment',
    icon: Lightbulb,
    accent: 'from-yellow-500 to-amber-500',
    bgGlow: 'rgba(234,179,8,0.3)',
    gradient: 'bg-gradient-to-br from-yellow-900/90 to-amber-900/90',
    borderGlow: 'hover:shadow-[0_0_40px_rgba(234,179,8,0.5)]',
    image: '💡'
  },
  {
    id: 'confidence-building',
    name: 'Confidence Accelerator',
    description: 'Build speaking confidence & overcome communication anxiety',
    icon: UserCheck,
    accent: 'from-pink-500 to-rose-500',
    bgGlow: 'rgba(236,72,153,0.3)',
    gradient: 'bg-gradient-to-br from-pink-900/90 to-rose-900/90',
    borderGlow: 'hover:shadow-[0_0_40px_rgba(236,72,153,0.5)]',
    image: '⭐'
  },
  {
    id: 'general-practice',
    name: 'Conversation AI Lab',
    description: 'Everyday communication & casual conversation practice',
    icon: Mic,
    accent: 'from-gray-500 to-blue-500',
    bgGlow: 'rgba(107,114,128,0.3)',
    gradient: 'bg-gradient-to-br from-gray-900/90 to-blue-900/90',
    borderGlow: 'hover:shadow-[0_0_40px_rgba(107,114,128,0.5)]',
    image: '💬'
  }
];

// Dynamic skills mapping based on assessment type
const skillsByAssessmentType: Record<string, string[]> = {
  'technical': [
    'JavaScript/TypeScript', 'Python', 'Java', 'C++', 'React', 'Node.js',
    'System Design', 'Algorithms', 'Data Structures', 'Cloud Computing',
    'Database Management', 'API Design', 'DevOps', 'Cybersecurity',
    'Machine Learning', 'Software Architecture', 'Testing', 'Git/GitHub'
  ],
  'academic-viva': [
    'Research Methodology', 'Thesis Writing', 'Literature Review', 'Data Analysis',
    'Statistical Methods', 'Academic Writing', 'Critical Analysis', 'Citation Management',
    'Research Ethics', 'Presentation Skills', 'Peer Review', 'Grant Writing',
    'Experimental Design', 'Qualitative Research', 'Quantitative Research'
  ],
  'communication-test': [
    'Public Speaking', 'Active Listening', 'Body Language', 'Voice Modulation',
    'Storytelling', 'Persuasion', 'Negotiation', 'Conflict Resolution',
    'Presentation Skills', 'Interpersonal Communication', 'Emotional Intelligence',
    'Non-verbal Communication', 'Audience Engagement', 'Speech Clarity'
  ],
  'behavioral': [
    'Leadership', 'Teamwork', 'Adaptability', 'Problem Solving',
    'Conflict Management', 'Emotional Intelligence', 'Decision Making',
    'Time Management', 'Stress Management', 'Empathy', 'Collaboration',
    'Initiative', 'Accountability', 'Mentoring', 'Cultural Awareness'
  ],
  'domain-specific': [
    'Industry Knowledge', 'Regulatory Compliance', 'Market Analysis', 'Risk Management',
    'Strategic Planning', 'Business Acumen', 'Domain Expertise', 'Trend Analysis',
    'Stakeholder Management', 'Quality Assurance', 'Process Optimization',
    'Industry Standards', 'Best Practices', 'Innovation Management'
  ],
  'conceptual': [
    'Critical Thinking', 'Abstract Reasoning', 'Conceptual Modeling', 'Theory Analysis',
    'Logical Reasoning', 'Systems Thinking', 'Pattern Recognition', 'Synthesis',
    'Evaluation', 'Hypothesis Generation', 'Framework Development', 'Paradigm Analysis'
  ],
  'confidence-building': [
    'Self-confidence', 'Assertiveness', 'Positive Mindset', 'Resilience',
    'Overcoming Anxiety', 'Self-motivation', 'Growth Mindset', 'Self-awareness',
    'Stress Resilience', 'Emotional Regulation', 'Self-efficacy', 'Optimism'
  ],
  'general-practice': [
    'Small Talk', 'Conversation Flow', 'Active Engagement', 'Questioning Skills',
    'Empathy', 'Social Awareness', 'Relationship Building', 'Networking',
    'Casual Communication', 'Everyday Etiquette', 'Social Cues', 'Friendliness'
  ]
};

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
    skills: [],
    assessmentType: activeTab,
    subject: '',
    scenario: '',
    focusArea: '',
    difficulty: 'medium'
  });

  // Form validation
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Get current assessment type info
  const currentType = assessmentTypes.find(type => type.id === activeTab) || assessmentTypes[0];

  // Get dynamic skills for current assessment type
  const getDynamicSkills = () => {
    return skillsByAssessmentType[activeTab] || skillsByAssessmentType['general-practice'];
  };

  // Filter skills based on search
  const getFilteredSkills = () => {
    const allSkills = getDynamicSkills();
    if (!searchSkill) return allSkills;
    return allSkills.filter(skill => 
      skill.toLowerCase().includes(searchSkill.toLowerCase())
    );
  };

  // Handle tab selection with modal
  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    setShowModal(true);
    
    // Reset form for new tab
    setFormData(prev => ({
      ...prev,
      assessmentType: tabId,
      title: '',
      subject: '',
      scenario: '',
      focusArea: '',
      skills: []
    }));

    // Set default values based on assessment type
    const defaultValues: Record<string, Partial<IFormInput>> = {
      'technical': {
        title: 'Technical Interview Preparation',
        difficulty: 'medium'
      },
      'academic-viva': {
        title: 'Academic Viva Voce Preparation',
        difficulty: 'medium'
      },
      'communication-test': {
        title: 'Communication Skills Assessment',
        difficulty: 'easy'
      },
      'behavioral': {
        title: 'Behavioral Interview Practice',
        difficulty: 'medium'
      },
      'domain-specific': {
        title: 'Domain Specific Interview',
        difficulty: 'hard'
      },
      'conceptual': {
        title: 'Conceptual Understanding Test',
        difficulty: 'hard'
      },
      'confidence-building': {
        title: 'Confidence Building Session',
        difficulty: 'easy'
      },
      'general-practice': {
        title: 'General Communication Practice',
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

  // Handle title change
  const handleTitleChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      title: value
    }));
    
    if (formErrors.title) {
      setFormErrors(prev => ({ ...prev, title: '' }));
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
  const handleInputChange = (field: keyof IFormInput, value: string | string[]) => {
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

    // Add more questions to reach 8 questions
    while (questionBank.length < 8) {
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

    return questionBank.slice(0, 8);
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
              skills: formData.skills,
              subject: formData.subject,
              scenario: formData.scenario,
              focusArea: formData.focusArea,
              difficulty: formData.difficulty,
              numberOfQuestions: 8
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
        skills: formData.skills,
        assessmentType: activeTab,
        subject: formData.subject,
        scenario: formData.scenario,
        focusArea: formData.focusArea,
        difficulty: formData.difficulty,
        fieldCategory: formData.subject || formData.scenario || formData.focusArea || 'General',
        numberOfQuestions: 8,
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

  // Get skill description based on assessment type
  const getSkillDescription = () => {
    switch (activeTab) {
      case 'academic-viva':
        return formData.subject 
          ? `Academic skills for ${formData.subject}`
          : 'Academic research & presentation skills';
      case 'domain-specific':
        return formData.scenario
          ? `Domain skills for ${formData.scenario}`
          : 'Industry-specific expertise';
      case 'technical':
        return formData.subject
          ? `Technical skills for ${formData.subject}`
          : 'Programming & technical abilities';
      case 'conceptual':
        return formData.focusArea
          ? `Conceptual skills for ${formData.focusArea}`
          : 'Critical thinking & analysis';
      case 'communication-test':
        return 'Verbal & non-verbal communication skills';
      case 'behavioral':
        return 'Soft skills & interpersonal abilities';
      case 'confidence-building':
        return 'Self-confidence & assertiveness skills';
      case 'general-practice':
        return 'Everyday conversation & social skills';
      default:
        return `${currentType.name} Skills`;
    }
  };

  const filteredSkills = getFilteredSkills();

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <AILabBackground />
      
      {/* Header */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 flex w-full items-center justify-between bg-black/40 backdrop-blur-xl px-8 py-4 border-b border-white/10"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3"
        >
          <div className="relative h-8 w-8">
            <div className="absolute inset-0 animate-ping rounded-full bg-purple-500/30"></div>
            <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-xl font-bold text-transparent">
            AI ASSESSMENT LAB
          </h1>
        </motion.div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/dashboard')}
          className="group relative px-6 py-2.5 rounded-xl font-medium text-white overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"></span>
          <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 blur-xl group-hover:blur-2xl transition-all"></span>
          <span className="relative flex items-center gap-2">
            
            Go to Dashboard
          </span>
        </motion.button>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">AI-Powered Assessment Creator</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Design Your AI
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Roleplay Simulation
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Choose from 8 advanced AI assessment types and customize every detail 
            for the ultimate roleplay experience.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4"
          >
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <Brain className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-300">AI Mode:</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setUseAI(!useAI)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  useAI 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {useAI ? 'ENABLED' : 'DISABLED'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Assessment Types Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {assessmentTypes.map((type, index) => {
            const IconComponent = type.icon;
            const isActive = activeTab === type.id;
            
            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => handleTabSelect(type.id)}
                className={`cursor-pointer relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 ${
                  isActive 
                    ? 'border-purple-500/50 shadow-[0_0_40px_rgba(139,92,246,0.3)]' 
                    : 'border-white/10 hover:border-purple-500/30'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${type.accent} mb-4 shadow-[0_0_30px_rgba(139,92,246,0.3)]`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{type.image}</span>
                    <h3 className="text-lg font-semibold text-white">{type.name}</h3>
                  </div>

                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {type.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">
                      AI-Powered
                    </span>
                    <motion.div
                      animate={{ x: isActive ? 5 : 0 }}
                      className="text-purple-400"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-400"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Configuration Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-[0_0_80px_rgba(139,92,246,0.6)] max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-xl border-b border-white/10 p-8 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${currentType.accent} shadow-[0_0_30px_rgba(139,92,246,0.5)]`}>
                      <span className="text-3xl">{currentType.image}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{currentType.name}</h2>
                      <p className="text-gray-400">{currentType.description}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </motion.button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-8">
                {/* Status Messages */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-red-900/30 to-red-900/10 border border-red-700/50 text-red-200 px-6 py-4 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-700/50 text-green-200 px-6 py-4 rounded-xl flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Success!</p>
                      <p className="text-sm">{success}</p>
                      <p className="text-xs text-green-300 mt-1">Redirecting to assessment...</p>
                    </div>
                  </motion.div>
                )}

                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Assessment Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
                    placeholder={`Enter title for your ${currentType.name}...`}
                    disabled={isGenerating}
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.title}</p>
                  )}
                </div>

                {/* Subject/Scenario/Focus Area Fields */}
                {(activeTab === 'academic-viva' || activeTab === 'technical' || activeTab === 'domain-specific' || activeTab === 'conceptual') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(activeTab === 'academic-viva' || activeTab === 'technical') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {activeTab === 'academic-viva' ? 'Academic Subject' : 'Technical Field'} 
                          <span className="text-red-400 ml-1">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.subject || ''}
                          onChange={(e) => handleSubjectChange(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
                          placeholder={activeTab === 'academic-viva' 
                            ? "e.g., Computer Science, Physics, Medicine" 
                            : "e.g., Web Development, Data Science"}
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
                          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
                          placeholder="e.g., Healthcare, Finance, Technology"
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
                          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
                          placeholder="e.g., Artificial Intelligence, Ethics"
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
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                        disabled={isGenerating}
                      >
                        <option value="easy" className="bg-gray-900">Easy</option>
                        <option value="medium" className="bg-gray-900">Medium</option>
                        <option value="hard" className="bg-gray-900">Hard</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Dynamic Skills Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-300">
                      Relevant Skills <span className="text-red-400">*</span>
                    </label>
                    <span className="text-xs px-2 py-1 bg-purple-500/20 rounded-full text-purple-300">
                      {getSkillDescription()}
                    </span>
                  </div>
                  
                  {/* Search Skills */}
                  <div className="mb-4 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchSkill}
                      onChange={(e) => setSearchSkill(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
                      placeholder={`Search ${currentType.name} skills...`}
                      disabled={isGenerating}
                    />
                  </div>

                  {/* Dynamic Skills Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 max-h-48 overflow-y-auto p-2">
                    {filteredSkills.map((skill) => (
                      <motion.button
                        key={skill}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => addSkill(skill)}
                        disabled={formData.skills.includes(skill) || isGenerating}
                        className={`p-3 text-sm rounded-xl border transition-all ${
                          formData.skills.includes(skill)
                            ? 'bg-purple-900/30 border-purple-500 text-purple-300 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-purple-500'
                        }`}
                      >
                        {skill}
                      </motion.button>
                    ))}
                  </div>

                  {/* Custom Skill Input */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                      className="flex-1 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
                      placeholder="Add a custom skill..."
                      disabled={isGenerating}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={addCustomSkill}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-medium text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] flex items-center gap-2"
                      disabled={isGenerating}
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </motion.button>
                  </div>
                  
                  {/* Selected Skills Display */}
                  {formData.skills.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-wrap gap-2 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                    >
                      <span className="text-xs text-gray-300 font-medium mr-2">Selected Skills:</span>
                      {formData.skills.map((skill) => (
                        <motion.div
                          key={skill}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-sm"
                        >
                          <span className="text-gray-200">{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                            disabled={isGenerating}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                  
                  {formErrors.skills && (
                    <p className="mt-2 text-xs text-red-400">{formErrors.skills}</p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 z-10 bg-black/50 backdrop-blur-xl border-t border-white/10 p-8 rounded-b-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-xl transition-colors text-gray-300 border border-white/10"
                      disabled={isGenerating}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowModal(false);
                        setActiveTab('technical');
                      }}
                      className="px-6 py-3 bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-xl transition-colors text-gray-300 border border-white/10"
                      disabled={isGenerating}
                    >
                      Change Type
                    </motion.button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={isGenerating}
                    className={`px-8 py-3 font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                      isGenerating
                        ? 'bg-gradient-to-r from-gray-700 to-gray-800 cursor-not-allowed text-gray-400'
                        : `bg-gradient-to-r ${currentType.accent} text-white shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:shadow-[0_0_50px_rgba(139,92,246,0.8)]`
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Launch Assessment
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <AILabBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mb-4 mx-auto"
          />
          <p className="text-gray-400 text-lg">Loading Assessment Lab...</p>
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