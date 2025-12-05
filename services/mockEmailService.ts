
interface EmailRequest {
  to: string;
  subject: string;
  body: string;
}

export const mockEmailService = {
  sendEmail: async (request: EmailRequest): Promise<boolean> => {
    console.log(`[MockEmailService] 📧 Sending email to ${request.to}`);
    console.log(`Subject: ${request.subject}`);
    console.log(`Body: ${request.body}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  },
  
  sendWelcomeEmail: async (userEmail: string, planName: string) => {
    return mockEmailService.sendEmail({
      to: userEmail,
      subject: 'Welcome to AuraStream! 🚀',
      body: `Hi there,\n\nThank you for subscribing to the ${planName}. Your account is now active and you can start streaming immediately.\n\nEnjoy!\nThe AuraStream Team`
    });
  },

  sendRenewalNotice: async (userEmail: string, date: string, amount: number) => {
    return mockEmailService.sendEmail({
      to: userEmail,
      subject: 'Upcoming Renewal Notification',
      body: `Hello,\n\nThis is a reminder that your subscription will renew on ${date} for $${amount.toFixed(2)}.\n\nNo action is needed if you wish to continue.`
    });
  },

  sendPaymentFailure: async (userEmail: string) => {
     return mockEmailService.sendEmail({
      to: userEmail,
      subject: 'Action Required: Payment Failed ⚠️',
      body: `Hello,\n\nWe could not process your latest payment. Please update your payment method in the dashboard to avoid service interruption.\n\nRegards,\nAuraStream Billing`
    });
  }
};
