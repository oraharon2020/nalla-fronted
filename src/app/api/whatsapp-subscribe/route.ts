import { NextRequest, NextResponse } from 'next/server';

// Google Sheets webhook URL for WhatsApp subscribers
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwVRYa-Q68g4KhraoOZHHql0PEZlJ3pO4Swvhqko58tCVv8r3YX7yZ78Ev7ge-qlP9Wxg/exec';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, consent } = body;

    // Validation
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: 'נא למלא את כל השדות' },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { success: false, message: 'נא לאשר את ההסכמה לקבלת עדכונים' },
        { status: 400 }
      );
    }

    // Validate phone number (Israeli format)
    const cleanPhone = phone.replace(/[-\s]/g, '');
    if (!/^0[0-9]{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, message: 'מספר טלפון לא תקין' },
        { status: 400 }
      );
    }

    // Send to Google Sheets
    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          sheet: 'whatsapp', // Tell the script which sheet to use
          name: name.trim(),
          phone: cleanPhone,
          consent: 'כן - הסכמה לקבלת עדכונים בוואטסאפ',
        }),
      });
    } catch (e) {
      console.error('Failed to save to Google Sheets:', e);
      // Don't fail the request - still show success to user
    }

    return NextResponse.json({
      success: true,
      message: 'תודה! נרשמת בהצלחה לקבלת עדכונים',
    });

  } catch (error) {
    console.error('WhatsApp subscribe error:', error);
    return NextResponse.json(
      { success: false, message: 'שגיאה בהרשמה, נסו שוב' },
      { status: 500 }
    );
  }
}
