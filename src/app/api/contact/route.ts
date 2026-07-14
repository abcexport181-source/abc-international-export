import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, country, requirement, message, captchaToken, captchaAction } = body;

    // Validate request
    if (!name || !company || !email || !country || !requirement) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Google reCAPTCHA Verification (if secret key is configured)
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecret) {
      if (!captchaToken) {
        return NextResponse.json(
          { message: 'reCAPTCHA verification token is missing' },
          { status: 400 }
        );
      }

      try {
        const verifyParams = new URLSearchParams({
          secret: recaptchaSecret,
          response: captchaToken
        });
        const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: verifyParams
        });
        const verifyData = await verifyRes.json();
        const minScore = Number(process.env.RECAPTCHA_MIN_SCORE || '0.5');

        if (
          !verifyData.success ||
          verifyData.action !== 'contact_form' ||
          verifyData.action !== captchaAction ||
          typeof verifyData.score !== 'number' ||
          verifyData.score < minScore
        ) {
          console.error('reCAPTCHA Verification Failed:', verifyData);
          return NextResponse.json(
            { message: 'reCAPTCHA verification failed. Please try again.' },
            { status: 400 }
          );
        }
      } catch (err: unknown) {
        console.error('reCAPTCHA server verification error:', err);
        return NextResponse.json(
          { message: 'Unable to verify reCAPTCHA' },
          { status: 500 }
        );
      }
    }

    const web3formsKey = process.env.WEB3FORMS_KEY;
    if (!web3formsKey) {
      console.error('WEB3FORMS_KEY is not defined in environment variables');
      return NextResponse.json(
        { message: 'Email service is not configured' },
        { status: 500 }
      );
    }

    // Make direct HTTP request to Web3Forms API
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: web3formsKey,
        name: name,
        email: email, // Web3Forms automatically uses this as Reply-To
        company: company,
        country: country,
        requirement: requirement,
        message: message || 'N/A',
        subject: `New Sourcing Inquiry: ${requirement} from ${name}`,
        from_name: 'ABC International Website'
      })
    });

    const responseData = await response.json();

    if (!response.ok || !responseData.success) {
      console.error('Web3Forms API Error:', responseData);
      return NextResponse.json(
        { message: responseData.message || 'Failed to send inquiry' },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json(
      { message: 'Inquiry successfully sent', id: responseData.data || 'success' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('API Contact Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
