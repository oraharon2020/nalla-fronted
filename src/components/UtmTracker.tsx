'use client';

import { useUtmTracking } from '@/hooks/useUtmTracking';

export function UtmTracker() {
  useUtmTracking();
  return null;
}
