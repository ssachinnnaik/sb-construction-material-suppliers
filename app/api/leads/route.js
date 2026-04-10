import supabase from '@/lib/db';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, mobile_number, product_interest, email } = body;

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
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // 1. Admin Alert
        const adminMailOptions = {
          from: process.env.EMAIL_USER,
          to: 'sbmcontact5886@gmail.com',
          subject: `New Order Requested: ${name} - SB Construction`,
          text: `You have received a new order request!\n\nName: ${name}\nMobile Number: ${mobile_number}\nEmail: ${email}\nProduct Interest: ${product_interest || 'General'}\n\nPlease check your admin dashboard to process this order.`,
        };
        await transporter.sendMail(adminMailOptions);

        // 2. Customer Welcome & Confirmation Email
        const customerMailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Order Received: Welcome to SB Construction!`,
          text: `Dear ${name},\n\nWelcome to SB Construction! We have received your request for ${product_interest || 'General'}.\n\nOur team is currently reviewing your order and will contact you at ${mobile_number} shortly to confirm details.\n\nThank you for trusting us with your construction needs.\n\nBest Regards,\nSB Construction Team`,
        };
        await transporter.sendMail(customerMailOptions);
        
        console.log(`Emails successfully sent for lead ${name}`);
      } else {
        console.warn('Email credentials not set in .env.local; skipping email notifications.');
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
