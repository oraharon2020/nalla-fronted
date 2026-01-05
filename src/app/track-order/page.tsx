'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: string;
  image?: string;
}

interface OrderData {
  id: number;
  status: string;
  status_label: string;
  date_created: string;
  total: string;
  payment_method_title: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    city: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
  };
  line_items: OrderItem[];
  shipping_total: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock; description: string }> = {
  pending: {
    label: 'ממתין לתשלום',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    description: 'ההזמנה ממתינה לאישור תשלום',
  },
  processing: {
    label: 'בטיפול',
    color: 'bg-blue-100 text-blue-800',
    icon: Package,
    description: 'ההזמנה התקבלה ונמצאת בטיפול',
  },
  'on-hold': {
    label: 'בהמתנה',
    color: 'bg-orange-100 text-orange-800',
    icon: Clock,
    description: 'ההזמנה בהמתנה - נציג יצור איתכם קשר',
  },
  completed: {
    label: 'הושלמה',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    description: 'ההזמנה הושלמה בהצלחה',
  },
  shipped: {
    label: 'נשלחה',
    color: 'bg-purple-100 text-purple-800',
    icon: Truck,
    description: 'ההזמנה נשלחה ובדרך אליכם',
  },
  delivered: {
    label: 'נמסרה',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    description: 'ההזמנה נמסרה בהצלחה',
  },
  cancelled: {
    label: 'בוטלה',
    color: 'bg-red-100 text-red-800',
    icon: AlertCircle,
    description: 'ההזמנה בוטלה',
  },
  refunded: {
    label: 'הוחזרה',
    color: 'bg-gray-100 text-gray-800',
    icon: AlertCircle,
    description: 'ההזמנה הוחזרה',
  },
  failed: {
    label: 'נכשלה',
    color: 'bg-red-100 text-red-800',
    icon: AlertCircle,
    description: 'התשלום נכשל',
  },
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch(`/api/track-order?order_id=${orderNumber}&email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.message || 'לא נמצאה הזמנה עם הפרטים שהוזנו');
      }
    } catch {
      setError('שגיאה בחיפוש ההזמנה. אנא נסו שנית.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    return statusConfig[status] || {
      label: status,
      color: 'bg-gray-100 text-gray-800',
      icon: Clock,
      description: '',
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: string) => {
    return `₪${parseFloat(price).toLocaleString('he-IL')}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-[1300px] mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-black transition-colors">דף הבית</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">מעקב הזמנה</span>
          </nav>

          {/* Title */}
          <div className="flex justify-center relative z-10">
            <h1 className="font-english text-[32px] md:text-[60px] lg:text-[80px] font-[300] text-[#333] tracking-[0.15em] md:tracking-[0.2em] leading-none">
              TRACK ORDER
            </h1>
          </div>
        </div>
      </section>

      {/* Search Form */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-[1300px] mx-auto px-4">
          {/* Form Container with green background */}
          <div className="bg-[#e1eadf] rounded-br-[50px] rounded-bl-[50px] rounded-tr-[50px] rounded-tl-none py-12 px-6 md:px-12 -mt-[30px] md:-mt-[40px]">
            <div className="max-w-xl mx-auto">
              <p className="text-center text-lg text-[#333] mb-8">
                הזינו את <span className="font-bold">מספר ההזמנה והאימייל</span> כדי לעקוב אחרי ההזמנה שלכם
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="מספר הזמנה"
                    required
                    className="w-full px-6 py-4 rounded-full border border-gray-300 bg-white text-right focus:outline-none focus:border-[#333]"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="כתובת אימייל"
                    required
                    className="w-full px-6 py-4 rounded-full border border-gray-300 bg-white text-right focus:outline-none focus:border-[#333]"
                  />
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-10 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        מחפש...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        חפש הזמנה
                      </>
                    )}
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center">
                  <AlertCircle className="w-5 h-5 inline-block ml-2" />
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Order Details */}
      {order && (
        <section className="py-10 md:py-14 bg-white">
          <div className="max-w-[1000px] mx-auto px-4">
            {/* Order Header */}
            <div className="bg-[#f8f7f4] rounded-[30px] p-6 md:p-10 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1">מספר הזמנה</p>
                  <p className="text-3xl font-bold text-[#333]">#{order.id}</p>
                  <p className="text-gray-500 text-sm mt-2">{formatDate(order.date_created)}</p>
                </div>
                
                <div className="text-right">
                  {(() => {
                    const statusInfo = getStatusInfo(order.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <div>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {order.status_label || statusInfo.label}
                        </span>
                        <p className="text-gray-500 text-sm mt-2">{statusInfo.description}</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-bold text-[#333] text-lg">פריטים בהזמנה</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {order.line_items.map((item) => (
                  <div key={item.id} className="p-6 flex items-center gap-4">
                    {item.image && (
                      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <p className="font-medium text-[#333]">{item.name}</p>
                      <p className="text-gray-500 text-sm">כמות: {item.quantity}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-[#333]">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">משלוח</span>
                  <span className="text-[#333]">
                    {parseFloat(order.shipping_total) > 0 ? formatPrice(order.shipping_total) : 'חינם'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-[#333]">סה״כ</span>
                  <span className="text-[#333]">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping & Billing */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Shipping Address */}
              <div className="bg-white border border-gray-200 rounded-[20px] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-[#333]" />
                  <h3 className="font-bold text-[#333]">כתובת למשלוח</h3>
                </div>
                <p className="text-gray-600">
                  {order.shipping.first_name} {order.shipping.last_name}<br />
                  {order.shipping.address_1}<br />
                  {order.shipping.city}
                </p>
              </div>

              {/* Contact Info */}
              <div className="bg-white border border-gray-200 rounded-[20px] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="w-5 h-5 text-[#333]" />
                  <h3 className="font-bold text-[#333]">פרטי התקשרות</h3>
                </div>
                <p className="text-gray-600">
                  {order.billing.first_name} {order.billing.last_name}<br />
                  <a href={`tel:${order.billing.phone}`} className="hover:text-black">{order.billing.phone}</a><br />
                  <a href={`mailto:${order.billing.email}`} className="hover:text-black">{order.billing.email}</a>
                </p>
              </div>
            </div>

            {/* Help Section */}
            <div className="text-center">
              <p className="text-gray-500 mb-4">יש לכם שאלות לגבי ההזמנה?</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#333] rounded-full font-medium border-2 border-[#333] hover:bg-gray-100 transition-colors"
              >
                צרו קשר
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* No Order - Help Section */}
      {!order && !isLoading && (
        <section className="py-10 md:py-14 bg-white">
          <div className="max-w-[800px] mx-auto px-4 text-center">
            <h2 className="font-english text-[24px] md:text-[40px] font-[300] text-[#333] tracking-[0.1em] mb-6">
              ? NEED HELP
            </h2>
            <p className="text-gray-600 mb-8">
              לא מוצאים את ההזמנה? מספר ההזמנה נשלח אליכם במייל לאחר ביצוע ההזמנה.
              <br />
              אם אתם צריכים עזרה, צוות שירות הלקוחות שלנו כאן בשבילכם.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:033732350"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                <Phone className="w-4 h-4" />
                03-3732350
              </a>
              <a
                href="https://wa.me/972559871850"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors"
              >
                וואטסאפ
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
