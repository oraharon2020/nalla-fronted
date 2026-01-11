import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '/';
  const token = searchParams.get('token');
  
  // Verify token
  const expectedToken = process.env.REVALIDATE_TOKEN;
  
  if (!expectedToken) {
    return NextResponse.json(
      { revalidated: false, message: 'Server not configured for revalidation' },
      { status: 500 }
    );
  }
  
  if (token !== expectedToken) {
    return NextResponse.json(
      { revalidated: false, message: 'Invalid token' },
      { status: 401 }
    );
  }
  
  try {
    // Expire the fetch cache tag (this clears WooCommerce API cache)
    // In Next.js 16, revalidateTag requires a profile parameter
    revalidateTag('woocommerce', { expire: 0 });
    
    // Revalidate the specified path
    revalidatePath(path);
    
    // If revalidating homepage, also revalidate related paths
    if (path === '/') {
      revalidatePath('/categories');
    }
    
    return NextResponse.json({
      revalidated: true,
      path: path,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { revalidated: false, message: 'Error revalidating', error: String(error) },
      { status: 500 }
    );
  }
}

// Also support GET for testing
export async function GET(request: NextRequest) {
  return POST(request);
}
