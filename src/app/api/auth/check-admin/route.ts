import { NextRequest, NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bellano.co.il';

export async function GET(request: NextRequest) {
  try {
    // Get auth cookies from the request
    const cookies = request.headers.get('cookie') || '';
    
    // Forward cookies to WordPress to check if user is admin
    const response = await fetch(`${WP_URL}/wp-json/bellano/v1/check-admin`, {
      headers: {
        Cookie: cookies,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ isAdmin: false });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ isAdmin: false });
  }
}
