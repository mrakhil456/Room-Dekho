import { useEffect, useRef } from 'react';
import { checkBackendHealth } from '../services/health';

const HEALTH_INTERVAL_MS = 5 * 60 * 1000;

/** Keeps the app/backend connection warm and exposes health failures in dev. */
export default function HealthMonitor() {
  const timerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const ping = async () => {
      try {
        const health = await checkBackendHealth();
        if (import.meta.env.DEV) console.info('[RoomDekho] backend health:', health);
      } catch (error) {
        if (mounted) console.warn('[RoomDekho] backend health check failed:', error.message);
      }
    };

    ping();
    timerRef.current = window.setInterval(ping, HEALTH_INTERVAL_MS);

    return () => {
      mounted = false;
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  return null;
}
