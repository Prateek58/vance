import { NextResponse } from 'next/server';
import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data: Record<string, string> = {};
    let file: File | null = null;

    // Extract all fields and the file attachment
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (key === 'resume') file = value;
      } else {
        data[key] = value.toString();
      }
    }

    const type = data.type;
    
    // 1. Basic File Size Validation
    if (file && file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'File size exceeds the 5MB limit.' }, { status: 400 });
    }

    // Prepare Admin Notification Email Variables
    let adminEmailHtml = '';
    let adminSubject = '';
    
    // Prepare User Confirmation Email Variables
    let userEmailHtml = '';
    let userSubject = '';

    if (type === 'client') {
      adminSubject = `New Client Talent Request from ${data.managerName}`;
      adminEmailHtml = `
        <h2 style="color: #0078D4;">Client Talent Request</h2>
        <p><strong>Manager Name:</strong> ${data.managerName}</p>
        <p><strong>Corporate Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.companyName}</p>
        <p><strong>Company Website:</strong> ${data.orgWebsite || 'N/A'}</p>
        <p><strong>Phone:</strong> ${data.countryCode} ${data.phone}</p>
        <p><strong>Work Type:</strong> ${data.workType}</p>
        <p><strong>Desired Start Date:</strong> ${data.startDate}</p>
        <br/>
        <h3 style="color: #0078D4;">Target Tech Stack & Details:</h3>
        <p style="white-space: pre-wrap; background: #f3f2f1; padding: 12px; border-radius: 4px;">${data.techStack}</p>
      `;

      userSubject = `Thank you for your Talent Request - Vance IT Solutions`;
      userEmailHtml = `
        <h2 style="color: #0078D4;">Request Received</h2>
        <p>Hi ${data.managerName || 'there'},</p>
        <p>Thank you for submitting your technical requirements to Vance IT Solutions.</p>
        <p>Our team is currently reviewing your request for <strong>${data.workType}</strong> and will be in touch shortly to discuss next steps and strategy.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Vance IT Solutions Team</strong></p>
      `;
    } else if (type === 'candidate') {
      adminSubject = `New Candidate Submission: ${data.fullName}`;
      adminEmailHtml = `
        <h2 style="color: #0078D4;">Candidate Profile Submission</h2>
        <p><strong>Full Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.countryCode} ${data.phone}</p>
        <p><strong>Primary Discipline:</strong> ${data.discipline}</p>
        <p><strong>Preferred Work Model:</strong> ${data.workModel}</p>
        <p><strong>Target Rate:</strong> ${data.targetRate}</p>
        <p><strong>Target Role:</strong> ${data.targetRole || 'Not specified'}</p>
        <p><strong>LinkedIn:</strong> ${data.linkedinUrl || 'N/A'}</p>
        <p><strong>GitHub:</strong> ${data.githubUrl || 'N/A'}</p>
      `;

      userSubject = `Profile Submitted - Vance Talent Network`;
      userEmailHtml = `
        <h2 style="color: #0078D4;">Profile Received</h2>
        <p>Hi ${data.fullName || 'there'},</p>
        <p>Thank you for applying and submitting your technical profile to the Vance Talent Network.</p>
        <p>Our recruiting leads will review your experience in <strong>${data.discipline}</strong> and will reach out if there is a match with our current open opportunities.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Vance IT Solutions Recruiting</strong></p>
      `;
    } else {
      adminSubject = `New Contact Form Submission from ${data.name || 'Unknown'}`;
      adminEmailHtml = `
        <h2 style="color: #0078D4;">Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <br/>
        <h3 style="color: #0078D4;">Message:</h3>
        <p style="white-space: pre-wrap; background: #f3f2f1; padding: 12px; border-radius: 4px;">${data.message}</p>
      `;

      userSubject = `Thank you for contacting Vance IT Solutions`;
      userEmailHtml = `
        <h2 style="color: #0078D4;">Message Received</h2>
        <p>Hi ${data.name || 'there'},</p>
        <p>Thank you for reaching out to us. We have received your message and a member of our team will get back to you shortly.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Vance IT Solutions Team</strong></p>
      `;
    }

    const credential = new ClientSecretCredential(
      process.env.AZURE_TENANT_ID!,
      process.env.AZURE_CLIENT_ID!,
      process.env.AZURE_CLIENT_SECRET!
    );

    const graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => {
          const token = await credential.getToken("https://graph.microsoft.com/.default");
          return token.token;
        }
      }
    });

    // Handle PDF/File Attachments (only attach to the admin email)
    const attachments = [];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      attachments.push({
        "@odata.type": "#microsoft.graph.fileAttachment",
        name: file.name,
        contentType: file.type || "application/pdf",
        contentBytes: buffer.toString("base64")
      });
    }

    // 2. Configurable Admin Recipients
    const recipientString = process.env.RECIPIENT_EMAILS || process.env.SENDER_EMAIL || "";
    const adminRecipients = recipientString.split(',').map(email => ({
      emailAddress: { address: email.trim() }
    })).filter(r => r.emailAddress.address);

    const adminMailPayload = {
      message: {
        subject: adminSubject,
        body: {
          contentType: "HTML",
          content: adminEmailHtml
        },
        toRecipients: adminRecipients,
        attachments: attachments.length > 0 ? attachments : undefined
      }
    };

    // Send the Admin Email
    await graphClient
      .api(`/users/${process.env.SENDER_EMAIL}/sendMail`)
      .post(adminMailPayload);

    // 3. Send a separate Confirmation Email to the user who filled the form
    if (data.email) {
      const userMailPayload = {
        message: {
          subject: userSubject,
          body: {
            contentType: "HTML",
            content: userEmailHtml
          },
          toRecipients: [
            {
              emailAddress: { address: data.email.trim() }
            }
          ]
        }
      };

      try {
        await graphClient
          .api(`/users/${process.env.SENDER_EMAIL}/sendMail`)
          .post(userMailPayload);
      } catch (userMailError) {
        // If the user provided a bad email, we don't want the whole submission to fail.
        console.error("Failed to send user confirmation email:", userMailError);
      }
    }

    return NextResponse.json({ success: true, message: 'Email sent successfully!' });

  } catch (error: any) {
    console.error("Microsoft Graph Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
