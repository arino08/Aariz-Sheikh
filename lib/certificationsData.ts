import type { Certification, CertificationData, CertificationStats } from '@/types/certifications';

export const certifications: Certification[] = [
  {
    id: 'aws-cloud-practitioner',
    title: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    issueDate: 'September 2024',
    score: '847/1000',
    studyDuration: '6 months',
    status: 'completed',
    icon: '☁️',

    story: {
      theSpark: "During my Systems Architecture course, I realized that every modern application runs in the cloud. I wanted to understand not just how to code, but how to build systems that scale to millions of users.",

      theDedication: [
        '3 months of evening study (2-3 hours daily)',
        'Built 8 hands-on AWS projects during winter break',
        'Created study group with 5 classmates',
        'Failed first practice exam, refined weak areas',
        'Documented entire learning journey on blog'
      ],

      theBreakthrough: "Passed with 847/1000 - higher than I ever expected. The moment I could deploy scalable applications felt like unlocking a superpower as a developer."
    },

    skillsMastered: [
      'EC2', 'S3', 'RDS', 'Lambda', 'VPC', 'CloudFormation',
      'IAM', 'CloudWatch', 'Auto Scaling', 'Load Balancers'
    ],

    academicIntegration: [
      'Enhanced capstone project with cloud architecture',
      'Improved Systems Design course grade from B+ to A+',
      'Became resident cloud expert in study groups',
      'Used AWS credits for 3 course projects'
    ],

    realWorldApplications: [
      'Deployed this portfolio on AWS infrastructure',
      'Built serverless contact form saving 70% costs',
      'Migrated 3 classmate projects to cloud hosting',
      'Created auto-scaling architecture for team project'
    ],

    verification: {
      certificateUrl: '#',
      projectLinks: ['/projects/portfolio-infrastructure', '/projects/serverless-contact'],
      academicRef: '#transcript',
      liveDemo: '/'
    },

    employerValue: [
      'Can architect and deploy scalable cloud solutions',
      'Self-motivated learner who goes beyond coursework',
      'Practical experience with production AWS services',
      'Cost-conscious development with cloud optimization',
      'Ready to contribute to cloud infrastructure teams'
    ]
  },

  {
    id: 'react-professional',
    title: 'React Professional Developer',
    issuer: 'Meta (React Team)',
    issueDate: 'June 2024',
    score: '94%',
    studyDuration: '4 months',
    status: 'completed',
    icon: '⚛️',

    story: {
      theSpark: "After building my first static HTML/CSS project, I wanted to create truly interactive, dynamic web applications. React's component model clicked immediately - it made complex UIs feel manageable.",

      theDedication: [
        '4 months of daily coding practice',
        'Built 12 React projects from scratch',
        'Contributed to 2 open-source React libraries',
        'Taught React basics to 8 classmates in workshops',
        'Read the entire React docs cover to cover (twice)'
      ],

      theBreakthrough: "When I built a real-time chat application with React and understood how state management works at scale, everything clicked. I went from struggling with props to confidently architecting complex UIs."
    },

    skillsMastered: [
      'React Hooks', 'Context API', 'State Management', 'Component Design',
      'Performance Optimization', 'React Router', 'Server Components', 'Next.js'
    ],

    academicIntegration: [
      'Used React for Web Development final project (A+)',
      'Helped 6 classmates debug their React assignments',
      'Created React components library for student projects',
      'Built admin dashboard for university club'
    ],

    realWorldApplications: [
      'This portfolio built entirely with Next.js and React',
      'Created task management app used by 40+ students',
      'Built e-commerce platform for local business',
      'Developed real-time collaboration tool for study groups'
    ],

    verification: {
      certificateUrl: '#',
      projectLinks: ['/projects/task-manager', '/projects/ecommerce-platform'],
      liveDemo: '/'
    },

    employerValue: [
      'Production-ready React skills with modern best practices',
      'Experience building and shipping real applications',
      'Strong understanding of component architecture',
      'Can mentor junior developers on React fundamentals',
      'Up-to-date with latest React ecosystem trends'
    ]
  },

  {
    id: 'nodejs-developer',
    title: 'Node.js Application Developer',
    issuer: 'OpenJS Foundation',
    issueDate: 'April 2024',
    studyDuration: '3 months',
    status: 'completed',
    icon: '🟢',

    story: {
      theSpark: "I wanted to use JavaScript everywhere - frontend and backend. Learning Node.js meant I could build full-stack applications without context switching between languages.",

      theDedication: [
        '3 months of building APIs and backend services',
        'Completed 15 backend challenges on coding platforms',
        'Built REST and GraphQL APIs from scratch',
        'Studied Express, Fastify, and native Node patterns',
        'Read Node.js design patterns book'
      ],

      theBreakthrough: "Successfully deployed my first production API handling 1000+ daily requests with proper error handling, logging, and security. It felt like graduating from toy projects to real engineering."
    },

    skillsMastered: [
      'Express.js', 'RESTful APIs', 'Authentication', 'Database Integration',
      'Error Handling', 'Middleware', 'Security Best Practices', 'Testing'
    ],

    academicIntegration: [
      'Built backend for Database Systems course project',
      'Created API for Software Engineering team assignment',
      'Automated data collection for research project',
      'Scored 98% on Server-Side Development exam'
    ],

    realWorldApplications: [
      'Built API powering this portfolio\'s contact form',
      'Created event management system for university club',
      'Developed webhook integration for student organization',
      'Built data aggregation service processing 10k+ records'
    ],

    verification: {
      certificateUrl: '#',
      projectLinks: ['/projects/api-portfolio', '/projects/event-management'],
      liveDemo: '/contact'
    },

    employerValue: [
      'Can design and implement scalable backend architectures',
      'Strong understanding of async programming patterns',
      'Experience with database design and optimization',
      'Security-conscious development practices',
      'Ready for full-stack development roles'
    ]
  },

  {
    id: 'javascript-mastery',
    title: 'JavaScript ES6+ Mastery',
    issuer: 'JavaScript Institute',
    issueDate: 'March 2024',
    studyDuration: '2 months',
    status: 'completed',
    icon: '💛',

    story: {
      theSpark: "JavaScript was my first programming language, but I wanted to truly master it - understand closures, prototypes, async patterns, and all the ES6+ features that make modern JS powerful.",

      theDedication: [
        '2 months of deep diving into language fundamentals',
        'Solved 100+ JavaScript challenges',
        'Read "You Don\'t Know JS" series completely',
        'Contributed code examples to MDN documentation',
        'Created study guide shared by 50+ students'
      ],

      theBreakthrough: "Finally understanding how closures, prototypes, and the event loop work under the hood transformed me from someone who writes JavaScript to someone who truly thinks in JavaScript."
    },

    skillsMastered: [
      'ES6+ Syntax', 'Async/Await', 'Promises', 'Closures', 'Prototypes',
      'Functional Programming', 'Modules', 'Destructuring', 'Spread/Rest'
    ],

    academicIntegration: [
      'Became go-to JavaScript expert in programming courses',
      'Tutored 10+ students in JavaScript fundamentals',
      'Created interactive JS tutorials for student learning',
      'Aced all JavaScript-related exams and assignments'
    ],

    realWorldApplications: [
      'Refactored this portfolio with modern JS patterns',
      'Built vanilla JS libraries used in multiple projects',
      'Created browser extensions with pure JavaScript',
      'Optimized performance in all frontend applications'
    ],

    verification: {
      certificateUrl: '#',
      projectLinks: ['/projects/js-library', '/projects/browser-extension']
    },

    employerValue: [
      'Deep understanding of JavaScript fundamentals',
      'Can write clean, maintainable, performant code',
      'Comfortable with both functional and OOP paradigms',
      'Strong debugging and problem-solving skills',
      'Foundation for any JavaScript framework or library'
    ]
  },

  {
    id: 'docker-containerization',
    title: 'Docker Containerization',
    issuer: 'Docker Inc.',
    issueDate: 'In Progress',
    studyDuration: '2 months (ongoing)',
    status: 'in-progress',
    icon: '🐳',

    story: {
      theSpark: "After deploying multiple projects, I kept running into 'works on my machine' issues. Docker promised to solve this - containerize once, run anywhere. I'm learning to build reproducible deployment pipelines.",

      theDedication: [
        'Currently 6 weeks into comprehensive Docker course',
        'Containerized 5 existing projects so far',
        'Learning Docker Compose for multi-container apps',
        'Studying Kubernetes basics for orchestration',
        'Building CI/CD pipelines with Docker integration'
      ],

      theBreakthrough: "Still in progress! Getting close to completing the certification. Already seeing huge benefits in deployment consistency across my projects."
    },

    skillsMastered: [
      'Docker Basics', 'Dockerfile Creation', 'Container Orchestration',
      'Docker Compose', 'Volume Management', 'Networking', 'Image Optimization'
    ],

    academicIntegration: [
      'Using Docker for DevOps course assignments',
      'Containerized team project for consistent environments',
      'Teaching Docker basics to project teammates'
    ],

    realWorldApplications: [
      'Dockerized this portfolio for easy deployment',
      'Created development containers for all projects',
      'Built Docker-based local development environment'
    ],

    verification: {
      projectLinks: ['/projects/dockerized-portfolio']
    },

    employerValue: [
      'Modern deployment skills with containerization',
      'Understanding of DevOps best practices',
      'Can create reproducible development environments',
      'Ready to work with CI/CD pipelines',
      'Continuously expanding cloud-native skills'
    ]
  },

  {
    id: 'typescript-advanced',
    title: 'TypeScript Advanced Development',
    issuer: 'TypeScript Team',
    issueDate: 'Planned - Q1 2025',
    studyDuration: 'Planned - 3 months',
    status: 'planned',
    icon: '🔷',

    story: {
      theSpark: "I've used TypeScript in projects, but I want to master advanced patterns - generics, conditional types, type guards. This will make my code more robust and my applications more maintainable at scale.",

      theDedication: [
        'Planning to start January 2025',
        'Will build 10+ TypeScript projects',
        'Contributing to DefinitelyTyped repository',
        'Creating type-safe libraries'
      ],

      theBreakthrough: "Coming soon! Excited to level up my type system knowledge."
    },

    skillsMastered: [
      'Advanced Types', 'Generics', 'Conditional Types', 'Type Guards',
      'Utility Types', 'Declaration Files', 'Type Inference'
    ],

    academicIntegration: [
      'Will apply to Software Engineering course projects',
      'Planning to create TypeScript workshop for classmates'
    ],

    realWorldApplications: [
      'Will refactor all projects with advanced TypeScript',
      'Create type-safe API clients',
      'Build reusable TypeScript libraries'
    ],

    verification: {},

    employerValue: [
      'Type-safe development for enterprise applications',
      'Reduced bugs through static typing',
      'Better code documentation through types',
      'Improved developer experience and productivity'
    ]
  }
];

export const stats: CertificationStats = {
  totalCertifications: 6,
  completedCount: 4,
  inProgressCount: 1,
  plannedCount: 1,
  totalStudyHours: 480,
  projectsEnabled: 12,
  coursesEnhanced: 4
};

export const certificationData: CertificationData = {
  certifications,
  stats
};

export function getCertificationById(id: string): Certification | undefined {
  return certifications.find(cert => cert.id === id);
}

export function getCompletedCertifications(): Certification[] {
  return certifications.filter(cert => cert.status === 'completed');
}

export function getInProgressCertifications(): Certification[] {
  return certifications.filter(cert => cert.status === 'in-progress');
}
