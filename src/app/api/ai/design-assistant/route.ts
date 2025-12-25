import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  images: { src: string }[];
  categories: { id: number; name: string; slug: string }[];
  short_description: string;
}

interface FormattedProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  slug: string;
  category: string;
}

// Fetch products from WooCommerce
async function fetchProducts(searchQuery?: string, category?: string): Promise<FormattedProduct[]> {
  const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || 'https://admin.bellano.co.il';
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  const params = new URLSearchParams({
    per_page: '50',
    status: 'publish',
    orderby: 'popularity',
    ...(searchQuery && { search: searchQuery }),
  });

  try {
    const response = await fetch(
      `${baseUrl}/wp-json/wc/v3/products?${params}`,
      {
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      console.error('WooCommerce API error:', response.status);
      return [];
    }

    const products: WooCommerceProduct[] = await response.json();
    
    return products.map(p => ({
      id: p.id.toString(),
      name: p.name,
      price: `₪${parseFloat(p.price).toLocaleString()}`,
      image: p.images?.[0]?.src || '',
      slug: p.slug,
      category: p.categories?.[0]?.name || '',
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ success: false, error: 'Message required' }, { status: 400 });
    }

    // Fetch available products
    const allProducts = await fetchProducts();
    
    // Create product catalog for AI context
    const productCatalog = allProducts.map(p => 
      `- ${p.name} (${p.category}) - ${p.price}`
    ).join('\n');

    const systemPrompt = `אתה יועץ עיצוב פנים מקצועי של בלאנו - חנות רהיטים איכותיים.

התפקיד שלך:
1. להבין את צרכי הלקוח - גודל החדר, סגנון, תקציב, צבעים
2. להמליץ על רהיטים מתאימים **רק** מהקטלוג שלנו
3. לתת טיפים לעיצוב

🚨 קטלוג המוצרים שלנו (אלה המוצרים היחידים שאתה יכול להמליץ עליהם):
${productCatalog}

כללים קריטיים - חובה לעקוב:
- המלץ **רק** על מוצרים שמופיעים ברשימה למעלה!
- **אסור בתכלית האיסור להמציא מוצרים** - אם מוצר לא ברשימה, הוא לא קיים
- אם הלקוח מבקש משהו שאין לנו (למשל ספות, כורסאות ספציפיות) - אמור בכנות שאין לנו כרגע והצע לבדוק אצלנו בעתיד או הצע מוצר דומה שכן קיים
- דבר בעברית טבעית וידידותית
- תמיד שאל שאלות כדי להבין טוב יותר את הצרכים
- כשאתה ממליץ על מוצרים, השתמש **בשמות המדויקים** מהרשימה - לא לשנות או לקצר שמות
- הצע 2-4 מוצרים מתאימים בכל המלצה
- תן הסברים קצרים למה כל מוצר מתאים

הקטגוריות העיקריות שלנו: מזנונים, שולחנות סלון, קונסולות, מיטות, קומודות, שידות לילה, ספריות, כיסאות
(שים לב: אין לנו כרגע ספות או כורסאות מרופדות במלאי)

סגנונות פופולריים: מודרני, סקנדינבי, תעשייתי, קלאסי, מינימליסטי

כשאתה ממליץ על מוצרים, סיים עם שורה בפורמט:
[PRODUCTS: שם מוצר מדויק 1, שם מוצר מדויק 2]

חשוב: השמות חייבים להיות זהים לחלוטין לשמות שברשימה למעלה!`;

    // Build conversation history
    const conversationHistory = history
      .filter((msg: { role: string }) => msg.role === 'user' || msg.role === 'assistant')
      .map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

    // Add current message
    conversationHistory.push({ role: 'user', content: message });

    // Call Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      system: systemPrompt,
      messages: conversationHistory,
    });

    const assistantMessage = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';

    // Extract recommended product names
    const productMatch = assistantMessage.match(/\[PRODUCTS?:\s*([^\]]+)\]/i);
    let recommendedProducts: FormattedProduct[] = [];

    if (productMatch) {
      const productNames = productMatch[1].split(',').map(s => s.trim().toLowerCase());
      
      recommendedProducts = allProducts.filter(product => {
        const productNameLower = product.name.toLowerCase();
        return productNames.some(searchName => 
          productNameLower.includes(searchName) || 
          searchName.includes(productNameLower.split(' ')[0])
        );
      }).slice(0, 6);

      // If no exact matches, do fuzzy search
      if (recommendedProducts.length === 0) {
        // Extract keywords from AI response and find matches
        const keywords = productNames.flatMap(n => n.split(' '));
        recommendedProducts = allProducts.filter(product => {
          const productNameLower = product.name.toLowerCase();
          return keywords.some(keyword => 
            keyword.length > 2 && productNameLower.includes(keyword)
          );
        }).slice(0, 4);
      }
    }

    // Clean the response (remove the PRODUCTS tag)
    const cleanResponse = assistantMessage.replace(/\[PRODUCTS?:\s*[^\]]+\]/gi, '').trim();

    return NextResponse.json({
      success: true,
      response: cleanResponse,
      products: recommendedProducts,
    });

  } catch (error) {
    console.error('Design assistant error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
