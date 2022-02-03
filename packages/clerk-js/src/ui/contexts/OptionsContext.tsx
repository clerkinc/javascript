import React from 'react';
import type { ClerkOptions } from '@clerk/types';

export const OptionsContext = React.createContext<ClerkOptions>({});

interface OptionsProviderProps {
  children: React.ReactNode;
  value: any;
}

function OptionsProvider({
  children,
  value,
}: OptionsProviderProps): JSX.Element {
  return (
    <OptionsContext.Provider value={value}>{children}</OptionsContext.Provider>
  );
}

function useOptions(): ClerkOptions {
  const context = React.useContext(OptionsContext);
  if (context === undefined) {
    throw new Error('useOptions must be used within an OptionsContext');
  }
  return context;
}

export { OptionsProvider, useOptions };