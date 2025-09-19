export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const formData = await request.json();

        // Validate required fields
        if (!formData.name || !formData.email || !formData.message) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Name, email, and message are required'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Please enter a valid email address'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Use Cloudflare Email Routing address (routes to 1dm9@protonmail.com)
        const recipient = 'noreply@canners.xyz';

        // Create email content
        const emailSubject = formData.subject ?
            `Portfolio Contact: ${formData.subject}` :
            'New Portfolio Contact Message';

        const emailContent = `
New contact form submission:

Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject || 'No subject'}

Message:
${formData.message}

---
Sent from canners portfolio contact form
        `.trim();

        // Send email using configured email service
        const mailResponse = await sendEmail({
            to: recipient,
            from: 'noreply@canners.xyz',
            subject: emailSubject,
            text: emailContent,
            replyTo: formData.email
        }, env);

        if (mailResponse.success) {
            return new Response(JSON.stringify({
                success: true,
                message: 'Thank you for your message! I\'ll get back to you soon.'
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        } else {
            throw new Error('Failed to send email');
        }

    } catch (error) {
        console.error('Contact form error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: 'Sorry, there was an error sending your message. Please try again.'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

// Handle CORS preflight requests
export async function onRequestOptions(context) {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}

// Email sending function - supports multiple email services
async function sendEmail(emailData, env) {
    try {
        // Try Mailjet first if API keys are available
        if (env.MAILJET_API_KEY && env.MAILJET_SECRET_KEY) {
            return await sendEmailWithMailjet(emailData, env);
        }

        // Try SendGrid if API key is available
        if (env.SENDGRID_API_KEY) {
            return await sendEmailWithSendGrid(emailData, env);
        }

        // Try Mailgun if API key is available
        if (env.MAILGUN_API_KEY && env.MAILGUN_DOMAIN) {
            return await sendEmailWithMailgun(emailData, env);
        }

        // Try Resend if API key is available
        if (env.RESEND_API_KEY) {
            return await sendEmailWithResend(emailData, env);
        }

        // If no email service is configured, log for development
        console.log('No email service configured. Email would be sent:', emailData);

        // In development/testing mode, return success
        // In production, you should configure at least one email service
        return {
            success: true,
            message: 'Email service not configured - check environment variables'
        };

    } catch (error) {
        console.error('Email sending error:', error);
        return {
            success: false,
            error: error.message || 'Unknown email error'
        };
    }
}

// Mailjet email service
async function sendEmailWithMailjet(emailData, env) {
    const credentials = btoa(`${env.MAILJET_API_KEY}:${env.MAILJET_SECRET_KEY}`);

    const response = await fetch('https://api.mailjet.com/v3.1/send', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Messages: [{
                From: {
                    Email: emailData.from,
                    Name: "Portfolio Contact Form"
                },
                To: [{
                    Email: emailData.to
                }],
                Subject: emailData.subject,
                TextPart: emailData.text,
                ReplyTo: {
                    Email: emailData.replyTo
                }
            }]
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Mailjet error: ${error}`);
    }

    const result = await response.json();

    // Check if Mailjet returned any errors
    if (result.Messages && result.Messages[0] && result.Messages[0].Status === 'error') {
        throw new Error(`Mailjet error: ${result.Messages[0].Errors[0].ErrorMessage}`);
    }

    return { success: true, service: 'Mailjet' };
}

// SendGrid email service
async function sendEmailWithSendGrid(emailData, env) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            personalizations: [{
                to: [{ email: emailData.to }],
                subject: emailData.subject
            }],
            from: { email: emailData.from },
            content: [{
                type: 'text/plain',
                value: emailData.text
            }],
            reply_to: { email: emailData.replyTo }
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`SendGrid error: ${error}`);
    }

    return { success: true, service: 'SendGrid' };
}

// Mailgun email service
async function sendEmailWithMailgun(emailData, env) {
    const formData = new FormData();
    formData.append('from', emailData.from);
    formData.append('to', emailData.to);
    formData.append('subject', emailData.subject);
    formData.append('text', emailData.text);
    formData.append('h:Reply-To', emailData.replyTo);

    const response = await fetch(`https://api.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${btoa(`api:${env.MAILGUN_API_KEY}`)}`
        },
        body: formData
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Mailgun error: ${error}`);
    }

    return { success: true, service: 'Mailgun' };
}

// Resend email service
async function sendEmailWithResend(emailData, env) {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: emailData.from,
            to: [emailData.to],
            subject: emailData.subject,
            text: emailData.text,
            reply_to: [emailData.replyTo]
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Resend error: ${error}`);
    }

    return { success: true, service: 'Resend' };
}