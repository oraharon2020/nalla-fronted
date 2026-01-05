import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://nalla.co.il/wp-json/bellano/v1/mega-menu', {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch mega menu');
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Mega menu API error:', error);
    return NextResponse.json(
      { living_spaces: [], featured_sections: [] },
      { status: 500 }
    );
  }
}
