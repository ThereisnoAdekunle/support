// Email configuration
const emailConfig = {
    fromEmail: 'westkhalifahninety7@gmail.com',
    toEmails: [
        'ao2674710@gmail.com',
        'princeadeluv13@gmail.com'
    ]
};

// Function to send email notifications
async function sendEmailNotification(userData) {
    try {
        console.log('Sending email with data:', userData);
        
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: emailConfig.fromEmail,
                to: emailConfig.toEmails,
                subject: `New ${userData.type || 'Form'} Submission`,
                text: `New submission received:\n\n${JSON.stringify(userData, null, 2)}`
            })
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || `Email API error: ${response.statusText}`);
        }

        console.log('Email notification sent successfully:', result);
        
        // Show success notification
        if (window.notificationSystem) {
            const notification = {
                icon: '✓',
                email: userData.email || 'User',
                issue: `Form submission received and email sent successfully`
            };
            window.notificationSystem.notifications.unshift(notification);
            window.notificationSystem.showNotification();
        }
        
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        
        // Show error notification
        if (window.notificationSystem) {
            const notification = {
                icon: '⚠️',
                email: userData.email || 'User',
                issue: `Failed to send email: ${error.message}`
            };
            window.notificationSystem.notifications.unshift(notification);
            window.notificationSystem.showNotification();
        }
        
        throw error;
    }
}

// Export the function
window.sendEmailNotification = sendEmailNotification; 