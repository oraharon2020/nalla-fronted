// Fetch WordPress pages content
const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://bellano.co.il';

interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  try {
    const response = await fetch(
      `${WP_URL}/wp-json/wp/v2/pages?slug=${slug}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) return null;
    
    const pages = await response.json();
    return pages[0] || null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

export async function getAllPages(): Promise<WPPage[]> {
  try {
    const response = await fetch(
      `${WP_URL}/wp-json/wp/v2/pages?per_page=20`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) return [];
    
    return response.json();
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}
