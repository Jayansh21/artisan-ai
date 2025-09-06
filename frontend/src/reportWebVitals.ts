// reportWebVitals.ts
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';
import type { Metric } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    onCLS(onPerfEntry);
    onINP(onPerfEntry);  // Note: INP replaced FID in v3+
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;