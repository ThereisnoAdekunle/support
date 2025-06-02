// Generate a unique ticket ID
function generateTicketId() {
    try {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 8);
        return `BYBIT-${timestamp}-${randomStr}`.toUpperCase();
    } catch (error) {
        console.error('Error generating ticket ID:', error);
        return generateFallbackTicketId();
    }
}

// Fallback ticket ID generation
function generateFallbackTicketId() {
    const date = new Date();
    const dateStr = date.getFullYear().toString().slice(-2) +
                   (date.getMonth() + 1).toString().padStart(2, '0') +
                   date.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `BYBIT-${dateStr}-${randomNum}`;
}

// Generate QR code with ticket ID
function generateQRCode(ticketId) {
    return new Promise((resolve, reject) => {
        try {
            console.log('Starting QR code generation for ticket:', ticketId);
            
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Load the QR code template image
            const qrImage = new Image();
            qrImage.crossOrigin = 'anonymous'; // Enable CORS
            
            qrImage.onload = () => {
                try {
                    console.log('QR template image loaded, dimensions:', qrImage.width, 'x', qrImage.height);
                    
                    // Set canvas size to match the QR code image
                    canvas.width = qrImage.width;
                    canvas.height = qrImage.height;
                    
                    // Draw the QR code template
                    ctx.drawImage(qrImage, 0, 0);
                    
                    // Add ticket ID text
                    ctx.font = 'bold 16px Inter';
                    ctx.fillStyle = '#000000';
                    ctx.textAlign = 'center';
                    ctx.fillText(ticketId, canvas.width / 2, canvas.height - 20);
                    
                    // Convert canvas to data URL
                    const dataUrl = canvas.toDataURL('image/png');
                    console.log('QR code generated successfully');
                    resolve(dataUrl);
                } catch (error) {
                    console.error('Error during QR code generation:', error);
                    reject(error);
                }
            };
            
            qrImage.onerror = (error) => {
                console.error('Error loading QR code template:', error);
                // Fallback to static image
                resolve('bybit logo/bybitqr.png');
            };
            
            // Set the source after setting up event handlers
            qrImage.src = 'bybit logo/bybitqr.png';
            
        } catch (error) {
            console.error('Error in QR code generation setup:', error);
            reject(error);
        }
    });
}

// Format time remaining
function formatTimeRemaining(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
} 