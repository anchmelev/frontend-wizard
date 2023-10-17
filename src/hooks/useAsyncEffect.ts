import { DependencyList, useEffect } from 'react';

export function useAsyncEffect(action: () => Promise<void> | undefined, args: DependencyList) {
  useEffect(() => {
    action();
  }, [...args]);
}
