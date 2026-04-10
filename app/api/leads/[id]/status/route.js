import db from '@/lib/db';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const stmt = db.prepare(`UPDATE leads SET status = ? WHERE id = ? RETURNING *`);
    const result = stmt.get(status, id);

    if (!result) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Send Status Update Email
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS && result.email) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: result.email,
          subject: `Order Update: ${status} - SB Construction`,
          text: `Dear ${result.name},\n\nYour order for ${result.product_interest || 'Materials'} has been updated to: ${status}.\n\nWe will keep you posted as things progress.\n\nBest Regards,\nSB Construction Team`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Status update email sent to ${result.email}`);
      }
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
    }

    return NextResponse.json({ success: true, lead: result }, { status: 200 });
  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
