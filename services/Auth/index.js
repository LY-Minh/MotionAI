import AuthService from './auth.js';

const authService = new AuthService();
let request_id = null;
//form for phone number input
const form = document.getElementById('auth-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const phoneNumber = document.getElementById('phone-number').value;
    if (!authService.validatePhoneNumber(phoneNumber)) {
        alert('Invalid phone number format. Please use E.164 format (e.g., +1234567890).');
        return;
    }
    try {
        request_id = await authService.checkSendAbility(phoneNumber);
        const response = await authService.sendCode(phoneNumber);
        console.log('Send code response:', response); //for debugging
        alert('Verification code sent successfully!');
    } catch (error) {
        console.error('Error during authentication:', error);
        alert('Failed to send verification code. Please try again.');
    }
});

//form for code verification
const verifyForm = document.getElementById('verify-form');
verifyForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const code = document.getElementById('verification-code').value;

    try {
        const response = await authService.verifyCode(code, request_id);
        console.log('Verification response:', response); //for debugging
        const userId = response.user_id;
        console.log('Authenticated user ID:', userId); //need for database
        alert('Code verified successfully!');   
    }
    catch (error) {
        console.error('Error during code verification:', error);
        alert('Failed to verify code. Please try again.');
    }
}
);