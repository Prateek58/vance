# Microsoft Entra ID Mailer Integration

This document outlines the steps taken to integrate the Microsoft Entra ID (Graph API) mailer into the Vance Next.js application, specifically for the Candidate Form and Client Form.

## Environment Variables

### 1. Local Development (`.env.local`)
Create or update the `.env.local` file in your Next.js project root (`site/.env.local`) with the following variables:
```env
AZURE_TENANT_ID=4ae28445-6bde-48af-9964-f67b8c448f3a
AZURE_CLIENT_ID=2478abae-abbe-45d4-9231-5932103b4f50
AZURE_CLIENT_SECRET=YOUR_NEW_ROTATED_SECRET_HERE
SENDER_EMAIL=mail@vanceitsolutions.com
RECIPIENT_EMAILS=mail@vanceitsolutions.com,another@example.com
```
*Note: `RECIPIENT_EMAILS` is an optional comma-separated list of emails that should receive the form submissions. If not set, it defaults to `SENDER_EMAIL`.*

### 2. Production (VPS Ubuntu - CloudPanel)
To add these environment variables in your VPS production environment using CloudPanel:
1. Log in to your CloudPanel dashboard.
2. Select your Next.js site/domain.
3. Go to **Settings** -> **Environment Variables** (or Node.js App settings if using a PM2/Node manager).
4. If managing via SSH, navigate to your app directory (e.g., `/home/username/htdocs/domain.com/site/`).
5. Create or edit the `.env` or `.env.production` file using a text editor like `nano`:
   ```bash
   nano .env
   ```
6. Add the environment variables listed above. No separate `prod.setting.json` is required.
7. Save the file (`Ctrl+O`, `Enter`, `Ctrl+X`).
8. **Restart your Next.js application** (e.g., `pm2 restart app_name` or restart the CloudPanel Node.js service) for the new environment variables to take effect.

## Features Implemented

1. **File Attachments (Resumes)**: The backend securely processes `FormData` and if a resume is attached from the Candidate form, it converts the file to Base64 and attaches it to the Microsoft Graph API email payload.
2. **File Size Validation**: Implemented both frontend and backend validation to restrict file uploads to **5MB**.
3. **CC Submitter**: A copy of the submission is automatically sent (CC'd) to the email address provided by the person who filled out the form.
4. **Configurable Recipients**: You can define multiple administrators in the `.env` file using the `RECIPIENT_EMAILS` variable.
5. **HTML Email Formatting**: Emails are professionally formatted using HTML markup for much better readability compared to plain text.
6. **Virus Scanning**: **Because we are using the Microsoft Graph API to send the email through Microsoft 365, all attachments are automatically scanned for malware and viruses by Microsoft Exchange Online Protection (EOP).** You do not need to implement custom open-source virus scanners (like ClamAV) in your Node.js application. Microsoft 365 handles this securely on the backend before the email hits anyone's inbox.

## Frontend Implementation

Both `site/components/ClientForm.tsx` and `site/components/CandidateForm.tsx` use the standard HTML `FormData` API to bundle form fields (and files) securely without specifying manual headers, letting the browser define the correct multi-part boundary. Loading UI states and error validation text are displayed gracefully.

## Troubleshooting

1. **"Method not allowed" Error**: Ensure you are making a POST request.
2. **Microsoft Graph Authentication Error**: Verify that the `AZURE_CLIENT_SECRET` is correct, not expired, and matches the environment variable. Also, ensure the Entra ID App has the `Mail.Send` Application permission and Admin Consent is granted.
3. **Email not arriving**: Verify that the `SENDER_EMAIL` is a valid user in your Microsoft 365 tenant and that the app has permissions to send mail on their behalf. Also verify your `RECIPIENT_EMAILS` is formatted correctly.
4. **File Too Large**: If the file is above 5MB, the UI will warn the user and stop the submission.
