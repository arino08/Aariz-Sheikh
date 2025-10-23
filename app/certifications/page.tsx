import type { Metadata } from 'next';
import CertificationsView from '@/components/certifications/CertificationsView';

export const metadata: Metadata = {
  title: 'Certifications | Achievement Journey',
  description: 'My professional certification journey - from AWS to React, showcasing dedication, growth, and real-world application of skills',
  keywords: ['certifications', 'student developer', 'AWS', 'React', 'Node.js', 'learning journey', 'portfolio'],
};

export default function CertificationsPage() {
  return <CertificationsView />;
}

