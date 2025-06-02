document.addEventListener('DOMContentLoaded', function() {
    const ticketId = sessionStorage.getItem('ticketId');
    const qrCodeUrl = sessionStorage.getItem('qrCodeUrl');
    const countdownElement = document.getElementById('countdown');

    // Set the countdown to 24 hours
    let hours = 24;
    let minutes = 0;
    let seconds = 0;

    function updateCountdown() {
        // Format the time
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        countdownElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

        // Update the time
        if (seconds > 0) {
            seconds--;
        } else {
            seconds = 59;
            if (minutes > 0) {
                minutes--;
            } else {
                minutes = 59;
                if (hours > 0) {
                    hours--;
                }
            }
        }
    }

    // Update the countdown every second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial update

    // Display ticket information
    if (ticketId) {
        document.getElementById('ticketId').textContent = ticketId;
    }

    // Clear session storage after 24 hours
    setTimeout(() => {
        sessionStorage.clear();
    }, 24 * 60 * 60 * 1000);
}); 