import supabase from '@/lib/db';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, mobile_number, product_interest, email, delivery_location, required_quantity, upcoming_load } = body;

    // Validation
    if (!name || !mobile_number || !email) {
      return NextResponse.json({ error: 'Name, mobile number, and email are required' }, { status: 400 });
    }

    // 10-digit check
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile_number)) {
      return NextResponse.json({ error: 'Mobile number must be exactly 10 digits' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name,
          mobile_number,
          email,
          product_interest: product_interest || 'General',
          delivery_location: delivery_location || 'Not Specified',
          required_quantity: required_quantity || 'Not Specified',
          upcoming_load: upcoming_load || 'None',
          status: 'Requested',
          contacted: 0
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    // Send Email Notifications
    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        // 1. Admin Alert
        await resend.emails.send({
          from: 'SB Construction <onboarding@resend.dev>',
          to: ['sachinnaik.juo@gmail.com'], // using registered email
          subject: `New Order Requested: ${name} - SB Construction`,
          text: `You have received a new order request!\n\nName: ${name}\nMobile Number: ${mobile_number}\nEmail: ${email}\nProduct Interest: ${product_interest || 'General'}\nQuantity Needed: ${required_quantity || 'N/A'}\nDelivery Location: ${delivery_location || 'N/A'}\nUpcoming Needs: ${upcoming_load || 'N/A'}\n\nPlease check your admin dashboard to process this order.`,
        });

        // 2. Customer Welcome & Confirmation Email
        await resend.emails.send({
          from: 'SB Construction <onboarding@resend.dev>',
          to: [email],
          subject: `Order Received: Welcome to SB Construction!`,
          text: `Dear ${name},\n\nGreetings from SB Construction!\n\nWe have successfully received your verification and registered your profile. \n\nThank you for choosing us for your construction material needs. Transparency and Quality are our top priorities.\n\n=== YOUR BOOKING DETAILS ===\nProduct Requested: ${product_interest || 'General Enquiry'}\nQuantity Needed: ${required_quantity || 'N/A'}\nDelivery Site: ${delivery_location || 'N/A'}\nMobile Linked: ${mobile_number}\n\nOur administrative team has been notified and we will contact you shortly to confirm the exact delivery details and transport dispatch.\n\n=== CONTACT US ===\nIf you have any urgent queries regarding this booking, please reach out to us at:\nPhone: +91 9490 057 579\nEmail: sbmcontact5886@gmail.com\n\nThanks & Regards,\nSB Construction Team`,
        });
        
        console.log(`Emails successfully sent for lead ${name} via Resend.`);
      } else {
        console.warn('Resend API key not set in .env.local; skipping email notifications.');
      }
    } catch (emailError) {
      console.error('Failed to send email notifications:', emailError);
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (error) {
    console.error('Submit lead error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
