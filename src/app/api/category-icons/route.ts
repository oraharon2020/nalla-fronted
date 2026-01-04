import { NextResponse } from 'next/server';
import { getApiEndpoint } from '@/config/site';

export async function GET() {
  try {
    const res = await fetch(getApiEndpoint('category-icons'), {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) {
      return NextResponse.json({ success: true, icons: [] });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch category icons:', error);
    return NextResponse.json({ success: true, icons: [] });
  }
}
