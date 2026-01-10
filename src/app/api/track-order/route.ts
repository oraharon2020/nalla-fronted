import { NextRequest, NextResponse } from 'next/server';

const WOOCOMMERCE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://admin.nalla.co.il';
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// Status labels in Hebrew
const statusLabels: Record<string, string> = {
  pending: 'ממתין לתשלום',
  processing: 'בטיפול',
  'on-hold': 'בהמתנה',
  completed: 'הושלמה',
  cancelled: 'בוטלה',
  refunded: 'הוחזרה',
  failed: 'נכשלה',
  shipped: 'נשלחה',
  delivered: 'נמסרה',
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('order_id');
    const email = searchParams.get('email');

    if (!orderId || !email) {
      return NextResponse.json(
        { success: false, message: 'נדרש מספר הזמנה וכתובת אימייל' },
        { status: 400 }
      );
    }

    // Fetch order from WooCommerce using query params (like other APIs in this project)
    const response = await fetch(
      `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders/${orderId}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 0 }, // Don't cache
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, message: 'לא נמצאה הזמנה עם מספר זה' },
          { status: 404 }
        );
      }
      throw new Error('Failed to fetch order');
    }

    const order = await response.json();

    // Verify email matches (case-insensitive)
    if (order.billing?.email?.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: 'כתובת האימייל אינה תואמת להזמנה זו' },
        { status: 403 }
      );
    }

    // Format order data for response
    const orderData = {
      id: order.id,
      status: order.status,
      status_label: statusLabels[order.status] || order.status,
      date_created: order.date_created,
      total: order.total,
      currency: order.currency,
      payment_method_title: order.payment_method_title,
      shipping_total: order.shipping_total,
      billing: {
        first_name: order.billing.first_name,
        last_name: order.billing.last_name,
        email: order.billing.email,
        phone: order.billing.phone,
        address_1: order.billing.address_1,
        city: order.billing.city,
      },
      shipping: {
        first_name: order.shipping.first_name || order.billing.first_name,
        last_name: order.shipping.last_name || order.billing.last_name,
        address_1: order.shipping.address_1 || order.billing.address_1,
        city: order.shipping.city || order.billing.city,
      },
      line_items: order.line_items.map((item: {
        id: number;
        name: string;
        quantity: number;
        price: string;
        total: string;
        image?: { src: string };
      }) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.total,
        image: item.image?.src || null,
      })),
    };

    return NextResponse.json({ success: true, order: orderData });

  } catch (error) {
    console.error('Track order error:', error);
    return NextResponse.json(
      { success: false, message: 'שגיאה בשרת. אנא נסו שנית מאוחר יותר.' },
      { status: 500 }
    );
  }
}
