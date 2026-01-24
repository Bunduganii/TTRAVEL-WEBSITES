// Advanced Modal System - Replaces alert() with beautiful modals

function showAdvancedModal(options) {
    const {
        title = 'Notification',
        message = '',
        type = 'info', // 'success', 'error', 'info', 'warning'
        icon = 'ℹ️',
        showCancel = false,
        confirmText = 'OK',
        cancelText = 'Cancel',
        onConfirm = null,
        onCancel = null,
        html = null
    } = options;

    // Remove existing modal
    const existing = document.getElementById('advancedModal');
    if (existing) existing.remove();

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.id = 'advancedModal';
    overlay.className = 'advanced-modal-overlay';
    
    // Icons by type
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    const displayIcon = icons[type] || icon;
    
    // Colors by type
    const colors = {
        success: '#059669',
        error: '#dc2626',
        warning: '#f59e0b',
        info: '#0d9488'
    };
    const color = colors[type] || colors.info;

    overlay.innerHTML = `
        <div class="advanced-modal-box">
            <div class="advanced-modal-header" style="border-bottom-color: ${color}20;">
                <div class="advanced-modal-icon" style="background: ${color}15; color: ${color};">
                    ${displayIcon}
                </div>
                <h2 class="advanced-modal-title">${title}</h2>
                <button class="advanced-modal-close" onclick="closeAdvancedModal()">×</button>
            </div>
            <div class="advanced-modal-body">
                ${html || `<p>${message}</p>`}
            </div>
            <div class="advanced-modal-footer">
                ${showCancel ? `<button class="btn-secondary advanced-modal-cancel" onclick="handleModalCancel()">${cancelText}</button>` : ''}
                <button class="btn-primary advanced-modal-confirm" onclick="handleModalConfirm()" style="background: ${color};">
                    ${confirmText}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    
    // Store callbacks
    overlay._onConfirm = onConfirm;
    overlay._onCancel = onCancel;
    
    // Animate in
    setTimeout(() => overlay.classList.add('active'), 10);
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeAdvancedModal();
        }
    });
    
    // Close on Escape key
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            closeAdvancedModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

function closeAdvancedModal() {
    const modal = document.getElementById('advancedModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

function handleModalConfirm() {
    const modal = document.getElementById('advancedModal');
    if (modal && modal._onConfirm) {
        modal._onConfirm();
    }
    closeAdvancedModal();
}

function handleModalCancel() {
    const modal = document.getElementById('advancedModal');
    if (modal && modal._onCancel) {
        modal._onCancel();
    }
    closeAdvancedModal();
}

// Convenience functions
function showSuccessModal(message, title = 'Success') {
    showAdvancedModal({ title, message, type: 'success' });
}

function showErrorModal(message, title = 'Error') {
    showAdvancedModal({ title, message, type: 'error' });
}

function showInfoModal(message, title = 'Information') {
    showAdvancedModal({ title, message, type: 'info' });
}

// Make functions global
window.showAdvancedModal = showAdvancedModal;
window.closeAdvancedModal = closeAdvancedModal;
window.showSuccessModal = showSuccessModal;
window.showErrorModal = showErrorModal;
window.showInfoModal = showInfoModal;
