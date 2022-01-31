import type { ClerkAPIResponseError } from '../core/resources/Error';
import type { ClerkAPIError } from '@clerk/types';

export function isError(err: ClerkAPIResponseError, code = ''): boolean {
  return err.errors && !!err.errors.find((e: ClerkAPIError) => e.code === code);
}
