import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
  color?: 'default' | 'white';
}

export default function Logo({ 
  size = 'md', 
  className = '',
  href = '/',
  color = 'default'
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8', 
    lg: 'h-12'
  };

  const LogoContent = () => (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/ev-trader-logo.svg"
        alt="EV-Trader Logo"
        width={200}
        height={60}
        className={`${sizeClasses[size]} w-auto ${color === 'white' ? 'brightness-0 invert' : ''}`}
        priority
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
}
