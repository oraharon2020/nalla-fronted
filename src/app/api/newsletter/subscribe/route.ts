import { NextRequest, NextResponse } from 'next/server';

// InfoRU API Configuration
const INFORU_API_URL = 'https://capi.inforu.co.il/api/v2/Automation/Trigger';
const INFORU_API_EVENT = 'NewReg';
const INFORU_AUTH = 'Basic bmFsbGFUTEQ6OGFmZjI0OTEtZWNhYy00OTcwLTkwZGEtYmYwMmJhYTlkZjli';

interface NewsletterFormData {
  name: string;
  phone: string;
  email: string;
  marketingConsent?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, marketingConsent } = await request.json() as NewsletterFormData;

    // Validate required fields
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'נא להזין כתובת אימייל תקינה' },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'נא להזין מספר טלפון' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'נא להזין שם מלא' },
        { status: 400 }
      );
    }

    // Normalize data
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone.replace(/\D/g, ''); // Remove non-digits
    
    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Prepare InfoRU API payload
    const inforuPayload = {
      Data: {
        ApiEventName: INFORU_API_EVENT,
        Contacts: [
          {
            Email: normalizedEmail,
            PhoneNumber: normalizedPhone,
            FirstName: firstName,
            LastName: lastName,
          }
        ]
      }
    };

    // Send to InfoRU
    const inforuResponse = await fetch(INFORU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': INFORU_AUTH,
      },
      body: JSON.stringify(inforuPayload),
    });

    const inforuResult = await inforuResponse.json();

    // Check InfoRU response
    if (inforuResult.StatusId !== 1) {
      console.error('InfoRU API error:', inforuResult);
      return NextResponse.json(
        { success: false, message: 'שגיאה בהרשמה. נא לנסות שוב.' },
        { status: 500 }
      );
    }

    console.log(`New newsletter subscriber sent to InfoRU: ${normalizedEmail}, Phone: ${normalizedPhone}`);

    return NextResponse.json({
      success: true,
      message: 'תודה! נרשמת בהצלחה לרשימת התפוצה',
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'שגיאה בהרשמה. נא לנסות שוב.' },
      { status: 500 }
    );
  }
}

