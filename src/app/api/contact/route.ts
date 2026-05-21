import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, country, requirement, message } = body;

    // Validate request
    if (!name || !company || !email || !country || !requirement) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not defined in environment variables');
      return NextResponse.json(
        { message: 'Email service is not configured' },
        { status: 500 }
      );
    }

    const emailTo = process.env.CONTACT_EMAIL_TO || 'info@abc-international.co.in';
    const emailFrom = process.env.CONTACT_EMAIL_FROM || 'onboarding@resend.dev';

    // Construct the email body
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; borderRadius: 8px;">
        <h2 style="color: #1f5ff5; border-bottom: 2px solid #e7ecf4; padding-bottom: 10px; margin-top: 0;">New Sourcing Inquiry</h2>
        <p style="color: #4a5568; font-size: 1rem; line-height: 1.5;">A new contact inquiry has been submitted via the ABC International website.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 12px 8px; font-weight: bold; color: #4a5568; width: 35%;">Name</td>
            <td style="padding: 12px 8px; color: #1a202c;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 12px 8px; font-weight: bold; color: #4a5568;">Company</td>
            <td style="padding: 12px 8px; color: #1a202c;">${company}</td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 12px 8px; font-weight: bold; color: #4a5568;">Email</td>
            <td style="padding: 12px 8px; color: #1a202c;"><a href="mailto:${email}" style="color: #1f5ff5; text-decoration: none;">${email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 12px 8px; font-weight: bold; color: #4a5568;">Country</td>
            <td style="padding: 12px 8px; color: #1a202c;">${country}</td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 12px 8px; font-weight: bold; color: #4a5568;">Product Requirement</td>
            <td style="padding: 12px 8px; color: #1a202c; font-weight: 500;">${requirement}</td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; font-weight: bold; color: #4a5568; vertical-align: top;">Message</td>
            <td style="padding: 12px 8px; color: #2d3748; white-space: pre-wrap; line-height: 1.6;">${message || 'N/A'}</td>
          </tr>
        </table>
        <div style="margin-top: 30px; font-size: 0.8rem; color: #a0aec0; border-top: 1px solid #edf2f7; padding-top: 15px; text-align: center;">
          Sent dynamically from contact form on abc-international.co.in
        </div>
      </div>
    `;

    // Make direct HTTP request to Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: `ABC International <${emailFrom}>`,
        to: emailTo,
        subject: `New Sourcing Inquiry: ${requirement} from ${name}`,
        html: emailHtml
      })
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Resend API Error:', responseData);
      return NextResponse.json(
        { message: responseData.message || 'Failed to send inquiry' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: 'Inquiry successfully sent', id: responseData.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('API Contact Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
