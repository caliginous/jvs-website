import Link from 'next/link';

interface BackNavigationProps {
  href: string;
  label: string;
  className?: string;
}

export default function BackNavigation({ href, label, className = '' }: BackNavigationProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <Link 
        href={href} 
        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {label}
      </Link>
    </div>
  );
} 