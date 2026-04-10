import supabase from '@/lib/db';
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

    const { data: result, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error || !result) {
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

        let customMessage = `We will keep you posted as things progress.`;
        if (status === 'Confirmed') {
          customMessage = `Great news! We have successfully confirmed your booking and locked in the inventory.`;
        } else if (status === 'Processing') {
          customMessage = `Your order has moved to our loading zone and will be scheduled for exact dispatch shortly.`;
        } else if (status === 'Out for Delivery') {
          customMessage = `Your material is currently Out for Delivery in our lorry! Our transport team will call you shortly as they approach the site.`;
        } else if (status === 'Completed') {
          customMessage = `Your materials have been successfully delivered and unloaded. Thank you for choosing SB Construction!`;
        } else if (status === 'Cancelled' || status === 'Rejected') {
          customMessage = `Unfortunately, we are unable to fulfill this order at this moment. Our team will contact you if there are any alternative arrangements.`;
        }

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: result.email,
          subject: `Order Update: ${status} - SB Construction`,
          text: `Dear ${result.name},\n\nYour order for ${result.product_interest || 'Materials'} has been updated to: ** ${status} **.\n\n${customMessage}\n\n=== CONTACT US ===\nIf you have any urgent queries regarding this status change, please reach out to us at:\nPhone: +91 9490 057 579\nEmail: sbmcontact5886@gmail.com\n\nThanks & Regards,\nSB Construction Team`,
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
