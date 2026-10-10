import { NextResponse } from 'next/server';
import { getGraphClient } from '../../../../lib/graphClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subject, name, phone, email, description, date, timeSlot, timeZone } = body;

    // Honeypot check: drop bot requests gracefully
    if (body.faxNumber && body.faxNumber.trim() !== '') {
      return NextResponse.json({ success: true, message: 'Booking confirmed successfully.' });
    }

    if (!name || !email || !date || !timeSlot) {
      return NextResponse.json(
        { success: false, error: 'Name, Email, Date, and Time Slot are required.' },
        { status: 400 }
      );
    }

    const senderEmail = process.env.SENDER_EMAIL || 'mail@vanceitsolutions.com';
    const clientTimeZone = timeZone || 'UTC';

    // Parse timeSlot "15:30"
    const [hStr, mStr] = timeSlot.split(':');
    const startH = parseInt(hStr, 10);
    const startM = parseInt(mStr, 10);

    const startIso = `${date}T${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}:00`;

    // Calculate end time (30 minutes later)
    const totalEndMin = startH * 60 + startM + 30;
    const endH = Math.floor(totalEndMin / 60) % 24;
    const endM = totalEndMin % 60;
    const endIso = `${date}T${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}:00`;

    // Format human-readable date & 12h time (e.g. "Oct 10, 2026 @ 03:30 PM")
    const formatHumanDateTime = (dateStr: string, time24Str: string) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      const formattedDate = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const [h24Str, m24Str] = time24Str.split(':');
      let hours = parseInt(h24Str, 10);
      const minutes = parseInt(m24Str, 10);
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 === 0 ? 12 : hours % 12;
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;

      return `${formattedDate} @ ${formattedTime}`;
    };

    const readableDateTime = formatHumanDateTime(date, timeSlot);

    const graphClient = getGraphClient();

    const meetingTitle = `[Call Booked] ${subject || 'Discovery Call'} - ${name}`;
    const emailSubject = `[New Call Booked] ${name} - ${readableDateTime}`;

    // Microsoft Graph Event object with Teams online meeting configuration
    const eventPayload = {
      subject: meetingTitle,
      body: {
        contentType: "HTML",
        content: `
          <div style="font-family: Arial, Helvetica, sans-serif; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid #0078D4;">
              <h2 style="color: #0078D4; margin: 0; font-size: 22px;">Vance IT Solutions - Meeting Confirmation</h2>
              <p style="color: #4b5563; font-size: 14px; margin-top: 4px;">Your video call has been scheduled.</p>
            </div>
            
            <div style="margin-top: 20px;">
              <h3 style="color: #111827; font-size: 16px; margin-bottom: 12px;">Meeting Details</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; background-color: #f9fafb; border-radius: 8px;">
                <tr>
                  <td style="padding: 10px 14px; font-weight: bold; width: 140px; color: #374151; border-bottom: 1px solid #e5e7eb;">Participant:</td>
                  <td style="padding: 10px 14px; color: #111827; border-bottom: 1px solid #e5e7eb;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-weight: bold; color: #374151; border-bottom: 1px solid #e5e7eb;">Email Address:</td>
                  <td style="padding: 10px 14px; color: #111827; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}" style="color: #0078D4; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-weight: bold; color: #374151; border-bottom: 1px solid #e5e7eb;">Phone:</td>
                  <td style="padding: 10px 14px; color: #111827; border-bottom: 1px solid #e5e7eb;">${phone || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-weight: bold; color: #374151; border-bottom: 1px solid #e5e7eb;">Subject / Topic:</td>
                  <td style="padding: 10px 14px; color: #111827; border-bottom: 1px solid #e5e7eb;">${subject || 'General Discovery'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-weight: bold; color: #374151;">Date & Time:</td>
                  <td style="padding: 10px 14px; font-weight: bold; color: #0078D4;">${readableDateTime} (${clientTimeZone})</td>
                </tr>
              </table>
            </div>

            ${description ? `
              <div style="margin-top: 20px;">
                <h4 style="color: #374151; font-size: 14px; margin-bottom: 8px;">Agenda / Description:</h4>
                <div style="background: #f3f4f6; border-left: 4px solid #0078D4; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #374151; white-space: pre-wrap;">${description}</div>
              </div>
            ` : ''}

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280;">
              <p>Microsoft Teams meeting details will automatically be attached to your calendar invitation.</p>
              <p style="margin-top: 4px;">Vance IT Solutions • <a href="https://vanceitsolutions.com" style="color: #0078D4;">vanceitsolutions.com</a></p>
            </div>
          </div>
        `
      },
      start: {
        dateTime: startIso,
        timeZone: clientTimeZone
      },
      end: {
        dateTime: endIso,
        timeZone: clientTimeZone
      },
      location: {
        displayName: "Microsoft Teams Meeting"
      },
      attendees: [
        {
          emailAddress: {
            address: senderEmail,
            name: "Vance IT Solutions"
          },
          type: "required"
        },
        {
          emailAddress: {
            address: email,
            name: name
          },
          type: "required"
        }
      ],
      isOnlineMeeting: true,
      onlineMeetingProvider: "teamsForBusiness"
    };

    // Create Outlook Calendar Event via Microsoft Graph API on sender's primary calendar
    const response = await graphClient
      .api(`/users/${senderEmail}/events`)
      .post(eventPayload);

    // Extract Microsoft Teams join URL
    const joinUrl = response.onlineMeeting?.joinUrl || response.onlineMeetingUrl || response.webLink || null;

    // Send explicit Notification Email to mail@vanceitsolutions.com and all admin recipients
    const recipientString = `${senderEmail},${process.env.RECIPIENT_EMAILS || ''}`;
    const adminRecipients = recipientString
      .split(',')
      .map(e => ({ emailAddress: { address: e.trim() } }))
      .filter((r, idx, self) => r.emailAddress.address && self.findIndex(s => s.emailAddress.address === r.emailAddress.address) === idx);

    if (adminRecipients.length > 0) {
      const adminNoticePayload = {
        message: {
          subject: emailSubject,
          body: {
            contentType: "HTML",
            content: `
              <div style="font-family: Arial, sans-serif; color: #1f2937; max-width: 600px; padding: 20px; border: 1px solid #0078D4; border-radius: 8px;">
                <h2 style="color: #0078D4; margin-top: 0;">New Call Booked on Vance Calendar</h2>
                <p>A new call has been scheduled by a client/candidate on <strong>mail@vanceitsolutions.com</strong> calendar.</p>
                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
                <p><strong>Client Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                <p><strong>Subject/Topic:</strong> ${subject}</p>
                <p><strong>Date & Time:</strong> ${readableDateTime} (${clientTimeZone})</p>
                ${joinUrl ? `<p><strong>Teams Video Link:</strong> <a href="${joinUrl}" style="color: #0078D4; font-weight: bold;">${joinUrl}</a></p>` : ''}
                ${description ? `<p><strong>Notes:</strong> ${description}</p>` : ''}
              </div>
            `
          },
          toRecipients: adminRecipients
        }
      };

      try {
        await graphClient
          .api(`/users/${senderEmail}/sendMail`)
          .post(adminNoticePayload);
      } catch (e: any) {
        console.warn("Notice email warning:", e.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Meeting successfully created on Outlook with Teams link!',
      joinUrl,
      eventId: response.id,
      date,
      timeSlot,
      readableDateTime
    });
  } catch (error: any) {
    console.error('Error creating Microsoft Graph event:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
