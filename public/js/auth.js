// ============================================
// AUTH — Login (Customer | Admin)
// Handles sign-in form, role tabs, loading states, and password visibility toggle.
// ============================================

// --------------------------------------------
// Toast notification: show success/error message
// --------------------------------------------
function showToast(message, type) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-notification' + (type === 'error' ? ' toast-error' : '');
    toast.textContent = message;
    toast.style.background = type === 'error' ? '#dc2626' : '#059669';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
}

// --------------------------------------------
// Button loading state: disable, show spinner, hide text
// --------------------------------------------
function setLoading(btn, loading) {
    if (!btn) return;
    const text = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-spinner');
    btn.disabled = !!loading;
    btn.classList.toggle('is-loading', !!loading);
    if (text) text.style.visibility = loading ? 'hidden' : 'visible';
    if (spinner) spinner.style.display = loading ? 'inline-block' : 'none';
}

// --------------------------------------------
// Password visibility toggle: switch input type and icon (eye / lock)
// --------------------------------------------
function setupPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', function() {
            const wrapper = this.closest('.password-input-wrapper');
            if (!wrapper) return;
            const input = wrapper.querySelector('input');
            const icon = wrapper.querySelector('.password-toggle-icon');
            if (!input || !icon) return;

            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            icon.textContent = isHidden ? '🔒' : '👁';
            this.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
            this.setAttribute('title', isHidden ? 'Hide password' : 'Show password');
        });
    });
}

// --------------------------------------------
// DOM ready: role tabs, login form submit, password toggles
// --------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Role tabs: Customer | Admin — store selected type for login
    const tabs = document.querySelectorAll('.role-tabs .tab');
    let selectedType = 'customer';

    tabs.forEach(t => {
        t.addEventListener('click', function() {
            tabs.forEach(x => x.classList.remove('active'));
            this.classList.add('active');
            selectedType = this.dataset.type;
        });
    });

    // Password visibility toggles (eye icon)
    setupPasswordToggles();

    // Login form submit: call API, redirect on success, show toast on error
    const form = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            setLoading(loginBtn, true);
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, userType: selectedType })
                });
                const data = await res.json();

                if (data.success) {
                    sessionStorage.setItem('user', JSON.stringify(data.user));
                    if (data.user.user_type === 'admin') window.location.href = '/admin';
                    else window.location.href = '/dashboard';
                    return;
                }
                showToast(data.message || 'Sign in failed', 'error');
            } catch (err) {
                console.error(err);
                showToast('Something went wrong. Try again.', 'error');
            } finally {
                setLoading(loginBtn, false);
            }
        });
    }
});
