import useControllerOrchestrator from './useControllerOrchestrator';

// Temporary re-export to preserve compatibility while we rename in consumers.
export default function useControllerFlow(opts) {
  return useControllerOrchestrator(opts);
}


