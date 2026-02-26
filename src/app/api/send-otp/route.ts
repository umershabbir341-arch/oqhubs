import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) {
            return NextResponse.json(
                { error: 'Email and code are required' },
                { status: 400 }
            );
        }

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'OQHUB <no-reply@oqhubs.store>',
                to: [email],
                subject: 'Your Verification Code',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #000; text-align: center;">VERIFICATION CODE</h2>
                        <p style="font-size: 16px; color: #555;">Hello,</p>
                        <p style="font-size: 16px; color: #555;">Your verification code for OQHUB is:</p>
                        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; margin: 20px 0; border-radius: 5px;">
                            ${code}
                        </div>
                        <p style="font-size: 14px; color: #888;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 12px; color: #aaa; text-align: center;">&copy; 2026 OQHUB. All rights reserved.</p>
                    </div>
                `,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Resend API call failed:', {
                status: response.status,
                data: data
            });

            // Extract a readable error message if possible
            const errorMessage = data.message || (typeof data === 'string' ? data : JSON.stringify(data));
            return NextResponse.json({
                error: errorMessage,
                details: data
            }, { status: response.status });
        }

        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        console.error('API route error:', err);
        return NextResponse.json(
            { error: err.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
