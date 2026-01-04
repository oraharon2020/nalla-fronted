'use client';

import { useEffect } from 'react';

const UTM_STORAGE_KEY = 'nalla_utm_params';

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;  // Google Click ID
  fbclid?: string; // Facebook Click ID
  landing_page?: string;
  referrer?: string;
  timestamp?: string;
}

/**
 * Hook to capture and store UTM parameters from URL
 * Stores in localStorage so it persists across pages
 */
export function useUtmTracking() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    
    // Check if there are any tracking params in URL
    const hasTrackingParams = 
      urlParams.has('utm_source') || 
      urlParams.has('gclid') || 
      urlParams.has('fbclid');

    if (hasTrackingParams) {
      const utmData: UtmParams = {
        utm_source: urlParams.get('utm_source') || undefined,
        utm_medium: urlParams.get('utm_medium') || undefined,
        utm_campaign: urlParams.get('utm_campaign') || undefined,
        utm_term: urlParams.get('utm_term') || undefined,
        utm_content: urlParams.get('utm_content') || undefined,
        gclid: urlParams.get('gclid') || undefined,
        fbclid: urlParams.get('fbclid') || undefined,
        landing_page: window.location.pathname,
        referrer: document.referrer || undefined,
        timestamp: new Date().toISOString(),
      };

      // Remove undefined values
      Object.keys(utmData).forEach(key => {
        if (utmData[key as keyof UtmParams] === undefined) {
          delete utmData[key as keyof UtmParams];
        }
      });

      // Store in localStorage
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmData));
    }
  }, []);
}

/**
 * Get stored UTM parameters
 */
export function getStoredUtmParams(): UtmParams | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Get traffic source label for display
 */
export function getTrafficSourceLabel(utm: UtmParams | null): string {
  if (!utm) return 'ישיר';
  
  // Check for Google Ads
  if (utm.gclid) return 'Google Ads';
  
  // Check for Facebook Ads
  if (utm.fbclid) return 'Facebook Ads';
  
  // Check UTM source
  if (utm.utm_source) {
    const source = utm.utm_source.toLowerCase();
    if (source.includes('google')) return 'Google';
    if (source.includes('facebook') || source.includes('fb')) return 'Facebook';
    if (source.includes('instagram') || source.includes('ig')) return 'Instagram';
    if (source.includes('tiktok')) return 'TikTok';
    if (source.includes('email') || source.includes('newsletter')) return 'Email';
    return utm.utm_source;
  }
  
  // Check referrer
  if (utm.referrer) {
    if (utm.referrer.includes('google')) return 'Google (אורגני)';
    if (utm.referrer.includes('facebook')) return 'Facebook (אורגני)';
    if (utm.referrer.includes('instagram')) return 'Instagram';
    return 'הפניה';
  }
  
  return 'ישיר';
}

/**
 * Clear stored UTM params (call after successful order)
 */
export function clearUtmParams() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(UTM_STORAGE_KEY);
}
