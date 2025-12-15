import { useEffect, useCallback, useRef } from 'react';
import type { ActivityLogEntry } from '../types';

interface UseExamSecurityOptions {
  enabled: boolean;
  requireFullscreen?: boolean;
  maxViolations?: number;
  onActivityLog?: (entry: ActivityLogEntry) => void;
  onViolation?: (type: string) => void;
  onMaxViolationsReached?: () => void;
}

/**
 * Hook to handle exam security features including fullscreen enforcement,
 * visibility change detection, copy/paste prevention, and context menu disabling.
 * 
 * @param options - Configuration options for security features
 * @returns Object containing utility functions and current violation state
 */
export function useExamSecurity(options: UseExamSecurityOptions) {
  const {
    enabled,
    requireFullscreen = true,
    maxViolations = 5,
    onActivityLog,
    onViolation,
    onMaxViolationsReached,
  } = options;

  const violationCountRef = useRef(0);
  const activityLogRef = useRef<ActivityLogEntry[]>([]);

  const logActivity = useCallback((action: string, metadata?: any) => {
    const entry: ActivityLogEntry = {
      action,
      timestamp: new Date().toISOString(),
      metadata,
    };
    
    activityLogRef.current.push(entry);
    onActivityLog?.(entry);
  }, [onActivityLog]);

  const recordViolation = useCallback((type: string, metadata?: any) => {
    violationCountRef.current += 1;
    logActivity(`violation_${type}`, { ...metadata, violationCount: violationCountRef.current });
    onViolation?.(type);

    if (violationCountRef.current >= maxViolations) {
      logActivity('max_violations_reached', { count: violationCountRef.current });
      onMaxViolationsReached?.();
    }
  }, [logActivity, maxViolations, onViolation, onMaxViolationsReached]);

  // Tab switch / visibility detection
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation('tab_switch');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enabled, recordViolation]);

  // Fullscreen monitoring
  useEffect(() => {
    if (!enabled || !requireFullscreen) return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        recordViolation('fullscreen_exit');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [enabled, requireFullscreen, recordViolation]);

  // Disable right click
  useEffect(() => {
    if (!enabled) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logActivity('right_click_attempt');
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [enabled, logActivity]);

  // Detect copy/paste
  useEffect(() => {
    if (!enabled) return;

    const handleCopy = () => {
      logActivity('copy_attempt');
    };

    const handlePaste = (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData('text') || '';
      logActivity('paste_detected', { length: pastedText.length });
      recordViolation('copy_paste', { action: 'paste', length: pastedText.length });
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    
    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
  }, [enabled, logActivity, recordViolation]);

  // Request fullscreen
  const requestFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      logActivity('fullscreen_entered');
    } catch (err) {
      console.error('Failed to enter fullscreen:', err);
      logActivity('fullscreen_failed', { error: String(err) });
    }
  }, [logActivity]);

  // Exit fullscreen
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        logActivity('fullscreen_exited');
      }
    } catch (err) {
      console.error('Failed to exit fullscreen:', err);
    }
  }, [logActivity]);

  return {
    violationCount: violationCountRef.current,
    activityLog: activityLogRef.current,
    requestFullscreen,
    exitFullscreen,
    logActivity,
  };
}

// Hook for device fingerprinting
export function useDeviceFingerprint() {
  const getFingerprint = useCallback((): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('fingerprint', 2, 2);
    }

    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvasFingerprint: canvas.toDataURL(),
    };

    return btoa(JSON.stringify(fingerprint));
  }, []);

  const getIPAddress = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }, []);

  const getBrowserInfo = useCallback((): string => {
    return navigator.userAgent;
  }, []);

  return {
    getFingerprint,
    getIPAddress,
    getBrowserInfo,
  };
}

// Hook for offline detection and auto-save
export function useOfflineDetection() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

import { useState } from 'react';
