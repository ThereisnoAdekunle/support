// Initialize modalUtils object
window.modalUtils = {};

// Create modal container if it doesn't exist
function getModalContainer() {
    let container = document.querySelector('.modal-overlay');
    if (!container) {
        container = document.createElement('div');
        container.className = 'modal-overlay';
        document.body.appendChild(container);
    }
    return container;
}

// Create toast container if it doesn't exist
function getToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

// Show modal
function showModal(options) {
    try {
        const {
            title,
            message,
            type = 'info',
            confirmText = 'OK',
            cancelText = null,
            onConfirm = null,
            onCancel = null
        } = options;

        const container = getModalContainer();
        const modal = document.createElement('div');
        modal.className = 'modal';

        const iconMap = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        modal.innerHTML = `
            <div class="modal-header">
                <div class="modal-icon ${type}">${iconMap[type]}</div>
                <h3 class="modal-title">${title}</h3>
            </div>
            <div class="modal-content">${message}</div>
            <div class="modal-footer">
                ${cancelText ? `<button class="modal-btn secondary">${cancelText}</button>` : ''}
                <button class="modal-btn primary">${confirmText}</button>
            </div>
        `;

        container.innerHTML = '';
        container.appendChild(modal);
        container.classList.add('active');

        // Add event listeners
        const confirmBtn = modal.querySelector('.modal-btn.primary');
        const cancelBtn = modal.querySelector('.modal-btn.secondary');

        confirmBtn.addEventListener('click', () => {
            container.classList.remove('active');
            if (onConfirm) onConfirm();
        });

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                container.classList.remove('active');
                if (onCancel) onCancel();
            });
        }
    } catch (error) {
        console.error('Error showing modal:', error);
        // Fallback to native alert
        alert(options.message);
    }
}

// Show toast notification
function showToast(options) {
    try {
        const {
            title,
            message,
            type = 'info',
            duration = 3000
        } = options;

        const container = getToastContainer();
        const toast = document.createElement('div');
        toast.className = 'toast';

        const iconMap = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        toast.innerHTML = `
            <div class="toast-icon">${iconMap[type]}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;

        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    } catch (error) {
        console.error('Error showing toast:', error);
        // Fallback to native alert
        alert(options.message);
    }
}

// Custom alert
function customAlert(message, type = 'info') {
    showModal({
        title: type.charAt(0).toUpperCase() + type.slice(1),
        message,
        type,
        confirmText: 'OK'
    });
}

// Custom confirm
function customConfirm(message, onConfirm, onCancel) {
    showModal({
        title: 'Confirm',
        message,
        type: 'warning',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm,
        onCancel
    });
}

// Export functions
window.modalUtils = {
    showModal,
    showToast,
    customAlert,
    customConfirm
}; 