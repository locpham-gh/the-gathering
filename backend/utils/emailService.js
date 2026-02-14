import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

export const sendBookingConfirmation = async (user, event) => {
    const message = `
        Hi ${user.username},

        You have successfully booked the event: ${event.title}.

        Details:
        Date: ${event.date.toDateString()}
        Time: ${event.startTime} - ${event.endTime}
        Location/Link: ${event.type === 'virtual' ? event.meetingLink : event.location}

        We look forward to seeing you there!
    `;

    await sendEmail({
        email: user.email,
        subject: 'Booking Confirmation - ' + event.title,
        message,
    });
};

export const sendEventReminder = async (user, event) => {
    const message = `
        Hi ${user.username},

        This is a reminder for your upcoming event: ${event.title}.
        It starts in less than 24 hours.

        Details:
        Date: ${event.date.toDateString()}
        Time: ${event.startTime} - ${event.endTime}
        Location/Link: ${event.type === 'virtual' ? event.meetingLink : event.location}
    `;

    await sendEmail({
        email: user.email,
        subject: 'Event Reminder - ' + event.title,
        message,
    });
};

export default sendEmail;
