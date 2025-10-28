
export interface Candidate {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  department?: string;
  position?: string;
  hasPaid: boolean;
  paymentMethod?: string;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestProgress {
  id: string;
  candidateId: string;
  currentSection: number;
  currentQuestion: number;
  answers: Record<string, number>;
  managementStylesAnswers?: Record<string, number>;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestResult {
  id: string;
  candidateId: string;
  scores: {
    section1: number;
    section2: number;
    section3: number;
    section4: number;
    section5: number;
    section6: number;
    section7: number;
    section8: number;
    section9: number;
  };
  managementStyles?: Record<string, number>;
  radarData: any;
  narrativeReport?: string;
  createdAt: Date;
}

export interface Section {
  id: number;
  title: string;
  questions: Question[];
}

export interface Question {
  id: number;
  text: string;
}

export interface TestData {
  title: string;
  description: string;
  instructions: string;
  scale: {
    type: string;
    min: number;
    max: number;
    labels: Record<string, string>;
  };
  sections: Section[];
  management_styles_section?: {
    title: string;
    description: string;
    scale: {
      type: string;
      min: number;
      max: number;
      labels: Record<string, string>;
    };
    styles: string[];
  };
}
