'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useSimpleAuth } from '@/hooks/use-auth';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, isAuthenticated } = useSimpleAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="pt-24 text-center">Veuillez vous connecter.</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="pt-24 max-w-md mx-auto text-center space-y-4">
        {user?.avatar && (
          <Image
            src={user.avatar}
            alt="avatar"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full mx-auto"
          />
        )}
        <h1 className="text-2xl font-bold">{user?.username}</h1>
        <p className="text-gray-400">
          {user?.role === 'admin'
            ? 'Administrateur'
            : user?.role === 'leader'
            ? 'Leader Team'
            : 'Utilisateur'}
        </p>
      </div>
      <Footer />
    </div>
  );
}

