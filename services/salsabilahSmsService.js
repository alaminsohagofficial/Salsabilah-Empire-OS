const axios = require('axios');

class SalsabilahSmsService {
    constructor() {
        // Configuration for your chosen gateway or local free/lifetime setup
        this.apiUrl = process.env.SALSABILAH_SMS_API_URL || 'https://api.salsabilahsms.local/send';
        this.apiKey = process.env.SALSABILAH_SMS_API_KEY || 'FREE_LIFETIME_KEY';
        this.senderId = process.env.SALSABILAH_SENDER_ID || 'SalsabilahPOS';
    }

    async sendSms(recipientPhone, message) {
        try {
            // Format phone number for local context (e.g., Bangladesh +880)
            const formattedPhone = this.formatPhoneNumber(recipientPhone);

            const payload = {
                api_key: this.apiKey,
                sender_id: this.senderId,
                number: formattedPhone,
                message: message
            };

            // If using an external HTTP gateway, make the request:
            // const response = await axios.post(this.apiUrl, payload);
            
            // For a simulated/local lifetime free gateway or custom log:
            console.log(`[Salsabilah SMS Service]: Sending to ${formattedPhone} -> "${message}"`);

            return {
                success: true,
                message: 'SMS queued/sent successfully via Salsabilah Service',
                recipient: formattedPhone
            };
        } catch (error) {
            console.error('[Salsabilah SMS Error]:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    formatPhoneNumber(phone) {
        // Ensure proper local BD format (+880...)
        let cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('880')) {
            return '+' + cleaned;
        } else if (cleaned.startsWith('0')) {
            return '+88' + cleaned;
        }
        return '+880' + cleaned;
    }
}

module.exports = new SalsabilahSmsService();
