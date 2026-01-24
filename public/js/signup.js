// ============================================
// SIGNUP — Customer registration
// Handles create-account form, validation, loading states, and password visibility toggles.
// ============================================

// --------------------------------------------
// Toast notification: show success/error message
// --------------------------------------------
function showToast(msg, type) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.className = 'toast-notification' + (type === 'error' ? ' toast-error' : '');
    t.textContent = msg;
    t.style.background = type === 'error' ? '#dc2626' : '#059669';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
}

// --------------------------------------------
// Button loading state: disable, show spinner, hide text
// --------------------------------------------
function setLoading(btn, loading) {
    if (!btn) return;
    var text = btn.querySelector('.btn-text');
    var spinner = btn.querySelector('.btn-spinner');
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
// DOM ready: password toggles, signup form submit
// --------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('signupForm');
    var btn = document.getElementById('signupBtn');
    if (!form || !btn) return;

    // Password visibility toggles (eye icon) for password and confirm fields
    setupPasswordToggles();

    // Signup form submit: validate, call API, redirect on success
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        var fullName = document.getElementById('fullName').value.trim();
        var email = document.getElementById('email').value.trim();
        var phone = document.getElementById('phone').value.trim() || null;
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confirmPassword').value;

        // Client-side validation: passwords match and min length
        if (password !== confirmPassword) {
            showToast('Passwords do not match.', 'error');
            return;
        }
        if (password.length < 6) {
            showToast('Password must be at least 6 characters.', 'error');
            return;
        }

        setLoading(btn, true);
        try {
            var res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, fullName, userType: 'customer', phone })
            });
            var data = await res.json();

            if (data.success) {
                var t = btn.querySelector('.btn-text');
                if (t) t.textContent = 'Redirecting…';
                setTimeout(function() { window.location.href = '/'; }, 1200);
                return;
            }
            showToast(data.message || 'Signup failed.', 'error');
        } catch (err) {
            showToast('Something went wrong. Try again.', 'error');
        }
        setLoading(btn, false);
    });
});
