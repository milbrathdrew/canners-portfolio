# Contact Form Email Setup

The contact form sends emails to `noreply@canners.xyz` which routes to `1dm9@protonmail.com` via Cloudflare Email Routing.

## Email Service Configuration

The contact form supports multiple email services. Configure one of the following in your Cloudflare Pages environment variables:

### Option 1: Mailjet (Recommended)
1. Sign up at [Mailjet](https://www.mailjet.com/)
2. Go to Account Settings → REST API → API Key Management
3. Get your API Key and Secret Key
4. Add environment variables in Cloudflare Pages:
   - `MAILJET_API_KEY`
   - `MAILJET_SECRET_KEY`

### Option 2: SendGrid
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key with "Mail Send" permissions
3. Add environment variable: `SENDGRID_API_KEY`

### Option 3: Mailgun
1. Sign up at [Mailgun](https://www.mailgun.com/)
2. Get your API key and domain from the dashboard
3. Add environment variables:
   - `MAILGUN_API_KEY`
   - `MAILGUN_DOMAIN`

### Option 4: Resend
1. Sign up at [Resend](https://resend.com/)
2. Create an API key
3. Add environment variable: `RESEND_API_KEY`

## Cloudflare Email Routing Setup

Your contact form is configured to send to `noreply@canners.xyz` which routes to your ProtonMail:

1. **Already configured**: Email routing from `noreply@canners.xyz` → `1dm9@protonmail.com`
2. **Domain verification**: DNS records already set up in Cloudflare
3. **From address**: Emails sent from `noreply@canners.xyz` (your verified domain)

## Setting Environment Variables in Cloudflare Pages

1. Go to your Cloudflare Pages dashboard
2. Select your project
3. Go to Settings → Environment variables
4. Add the environment variables for your chosen email service

## Features

- **Server-side email sending** via Cloudflare Pages Functions
- **Multiple email service support** with automatic fallback
- **Client-side validation** for required fields and email format
- **Success/error handling** with proper user feedback
- **CORS configured** for security
- **Reply-to address** set to sender's email for easy responses

## Testing

The contact form includes:
- Client-side validation for required fields
- Email format validation
- Success/error message display
- Loading states during submission

In development mode (no email service configured), the form will still work but emails will only be logged to the console.

## Security Features

- Input validation and sanitization
- CORS headers properly configured
- Error handling without exposing sensitive information
- Proper email formatting and encoding

## Troubleshooting

- Check browser console for any JavaScript errors
- Verify environment variables are set correctly in Cloudflare Pages
- Check Cloudflare Pages Functions logs for server-side errors
- Ensure your email service API key has the correct permissions
- Verify Cloudflare Email Routing is working by testing the route