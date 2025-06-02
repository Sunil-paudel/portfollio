"use client";

import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // This component can be used to wrap any client-side context providers
  // For now, it just returns children.
  return <>{children}</>;
}
