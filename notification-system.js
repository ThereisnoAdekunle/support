// Global notification system
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.currentIndex = 0;
        this.notificationBar = null;
        this.init();
    }

    init() {
        // Create notification bar if it doesn't exist
        if (!document.getElementById('global-notification-bar')) {
            this.createNotificationBar();
        }
        this.notificationBar = document.getElementById('global-notification-bar');
        this.loadNotifications();
        this.startNotificationCycle();
    }

    createNotificationBar() {
        const bar = document.createElement('div');
        bar.id = 'global-notification-bar';
        bar.className = 'global-notification-bar';
        document.body.insertBefore(bar, document.body.firstChild);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .global-notification-bar {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 12px;
                text-align: center;
                z-index: 9999;
                transform: translateY(-100%);
                transition: transform 0.3s ease-in-out;
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                font-family: 'Inter', sans-serif;
            }

            .global-notification-bar.show {
                transform: translateY(0);
            }

            .notification-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
            }

            .notification-icon {
                font-size: 1.2em;
                color: #00ff88;
            }

            .notification-text {
                font-size: 0.9em;
            }

            .notification-email {
                color: #00ff88;
                font-weight: 500;
            }

            .notification-issue {
                color: #ffffff;
            }

            @keyframes slideIn {
                from { transform: translateY(-100%); }
                to { transform: translateY(0); }
            }

            @keyframes slideOut {
                from { transform: translateY(0); }
                to { transform: translateY(-100%); }
            }
        `;
        document.head.appendChild(style);
    }

    generateRandomEmail() {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const domains = ['gmail.com', 'icloud.com', 'outlook.com', 'yahoo.com', 'protonmail.com', 'hotmail.com'];
        
        // Generate first two letters
        let firstTwo = '';
        for (let i = 0; i < 2; i++) {
            firstTwo += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        
        // Generate random number of x's (3-6)
        const numX = Math.floor(Math.random() * 4) + 3; // Random number between 3 and 6
        const xString = 'x'.repeat(numX);
        
        // Generate 2 random numbers
        let randomNumbers = '';
        for (let i = 0; i < 2; i++) {
            randomNumbers += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        
        // Select random domain
        const domain = domains[Math.floor(Math.random() * domains.length)];
        
        return `${firstTwo}${xString}${randomNumbers}@${domain}`;
    }

    loadNotifications() {
        const issues = [
            'P2P trading issue',
            'KYC verification',
            'Withdrawal problem',
            'API key generation',
            'Account recovery',
            'Trading limit increase',
            'Security settings update',
            'Fiat deposit issue',
            'Margin trading activation',
            'Futures trading setup',
            'Referral bonus claim',
            'Staking rewards distribution',
            'Copy trading setup',
            'Grid trading configuration',
            'Dual investment setup',
            'Order execution issue',
            'Position closing problem',
            'Leverage adjustment',
            'Stop loss setup',
            'Take profit configuration'
        ];

        // Generate 1000 random notifications
        this.notifications = Array.from({ length: 1000 }, () => {
            const email = this.generateRandomEmail();
            const issue = issues[Math.floor(Math.random() * issues.length)];
            const timeAgo = Math.floor(Math.random() * 48) + 1; // 1-48 hours ago
            const timeUnit = timeAgo === 1 ? 'hour' : 'hours';
            
            return {
                icon: '✓',
                email: email,
                issue: `Issue resolved: ${issue} for ${email} (${timeAgo} ${timeUnit} ago)`
            };
        });
    }

    showNotification() {
        if (!this.notificationBar) return;

        const notification = this.notifications[this.currentIndex];
        this.notificationBar.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${notification.icon}</span>
                <span class="notification-text">
                    <span class="notification-issue">${notification.issue}</span>
                </span>
            </div>
        `;

        this.notificationBar.classList.add('show');

        // Hide notification after 4 seconds
        setTimeout(() => {
            this.notificationBar.classList.remove('show');
            this.currentIndex = (this.currentIndex + 1) % this.notifications.length;
        }, 4000);
    }

    startNotificationCycle() {
        // Show first notification immediately
        this.showNotification();

        // Show new notification every 8 seconds
        setInterval(() => {
            this.showNotification();
        }, 8000);
    }
}

// Initialize notification system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.notificationSystem = new NotificationSystem();
}); 