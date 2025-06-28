'use client';

import { SessionProvider } from 'next-auth/react';

export default function SessionProviderWrapper({ children }) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={60}>
      {children}
    </SessionProvider>
  );
}
