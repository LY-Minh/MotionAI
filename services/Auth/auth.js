
class AuthService {
    constructor() {
        this.baseURL = 'https://gatewayapi.telegram.org/';
        this.authToken = process.env.TELEGRAM_TOKEN;
        this.headers = {
    'Authorization': `Bearer ${this.authToken}`,
    'Content-Type': 'application/json'
};
    }
    async sendCode(phoneNumber) {
        const url = `${this.baseURL}/sendVerificationMessage`;
        const code = await fetch(url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ 
                'phone_number': phoneNumber,      
                'code_length': 6,              
                'ttl': 60,                    
                'payload': 'my_payload_here',  
                'callback_url': 'https://my.webhook.here/auth'

             })
        });
       if (code.status !== 200) {
            throw new Error('Failed to send verification code');
        }
        const responseData = await code.json();
        return responseData;
    }
    async checkSendAbility(phoneNumber) {
        const url = `${this.baseURL}/checkSendAbility`;
        const response = await fetch(url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ 
                'phone_number': phoneNumber
                })
            });
        if (response){
            const responseData = await response.json();
            const {request_id} = responseData;
            return request_id;
        }
    }
    async verifyCode(code, request_id) {
        const url = `${this.baseURL}/checkVerificationStatus`;
        const response = await fetch(url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ 
                'code': code,
                'request_id': request_id
                })
            });
        if (response.status !== 200) {
            throw new Error('Failed to verify code');
        }
        const responseData = await response.json();
        return responseData;
    }
    validatePhoneNumber(phoneNumber) {
        const phoneRegex = /^\+\d{10,15}$/;
        return phoneRegex.test(phoneNumber);
    }
}

export default new AuthService();