'use client';

import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface SignOutButtonProps {
  className?: string;
}

export default function SignOutButton({ className = '' }: SignOutButtonProps) {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors ${className}`}
    >
      Sign Out
    </button>
  );
}
