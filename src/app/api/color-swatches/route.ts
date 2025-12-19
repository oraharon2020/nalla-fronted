import { NextResponse } from 'next/server';
import { getApiEndpoint } from '@/config/site';

export interface ColorSwatch {
  id: number;
  name: string;
  slug: string;
  attribute: string;
  attribute_slug: string;
  image?: string;
  color?: string;
}

// Cache the swatches in memory for the duration of the server
let cachedSwatches: Record<string, ColorSwatch> | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    // Return cached data if available and not expired
    if (cachedSwatches && Date.now() - cacheTime < CACHE_DURATION) {
      return NextResponse.json({ 
        success: true, 
        swatches: cachedSwatches,
        cached: true 
      });
    }

    const response = await fetch(getApiEndpoint('color-swatches'), {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error('Failed to fetch swatches');
    }

    const data = await response.json();
    
    if (data.success && data.swatches) {
      // Update cache
      cachedSwatches = data.swatches;
      cacheTime = Date.now();
      
      return NextResponse.json({ 
        success: true, 
        swatches: data.swatches 
      });
    }

    return NextResponse.json({ 
      success: false, 
      swatches: {} 
    });
  } catch (error) {
    console.error('Error fetching color swatches:', error);
    
    // Return cached data even if expired in case of error
    if (cachedSwatches) {
      return NextResponse.json({ 
        success: true, 
        swatches: cachedSwatches,
        cached: true,
        stale: true 
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      swatches: {},
      error: 'Failed to fetch swatches' 
    });
  }
}
