// Premium Certification Showcase Types

export type CertificationStatus = 'completed' | 'in-progress' | 'planned';

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  score?: string;
  studyDuration: string;
  status: CertificationStatus;
  icon: string;
  
  // Student Journey Story
  story: {
    theSpark: string; // What motivated you to pursue this
    theDedication: string[]; // Study process and effort
    theBreakthrough: string; // Achievement moment
  };
  
  // Skills & Impact
  skillsMastered: string[]; // Technical skills gained
  academicIntegration: string[]; // How it helped with school
  realWorldApplications: string[]; // Practical projects built
  
  // Verification & Proof
  verification: {
    certificateUrl?: string;
    projectLinks?: string[];
    academicRef?: string;
    liveDemo?: string;
  };
  
  // Employer Value
  employerValue: string[];
}

export interface CertificationStats {
  totalCertifications: number;
  completedCount: number;
  inProgressCount: number;
  plannedCount: number;
  totalStudyHours: number;
  projectsEnabled: number;
  coursesEnhanced: number;
}

export interface CertificationData {
  certifications: Certification[];
  stats: CertificationStats;
}

