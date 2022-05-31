import { Appearance } from '@clerk/types/src';
import React from 'react';

import { ParsedAppearance } from '../types';

type AppearanceContextValue = {
  parsedAppearance: ParsedAppearance;
};

const [AppearanceContext, useAppearance] = createContextAndHook<AppearanceContextValue>('AppearanceContext');

type AppearanceProviderProps = React.PropsWithChildren<{
  appearance: Appearance | undefined;
}>;

const AppearanceProvider = (props: AppearanceProviderProps) => {
  const value = useDeepEqualMemo(
    () => ({ value: { parsedAppearance: transformPublicToInternalAppearance(props.appearance) } }),
    [props.appearance],
  );
  return <AppearanceContext.Provider value={value}>{props.children}</AppearanceContext.Provider>;
};

export { AppearanceProvider, useAppearance };
