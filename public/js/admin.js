// Admin — Full functionality + logout loading

let adminUser = null;
let allBookings = [];
let allUsers = [];

document.addEventListener('DOMContentLoaded', function() {
    const raw = sessionStorage.getItem('user');
    if (!raw) {
        window.location.href = '/';
        return;
    }
    adminUser = JSON.parse(raw);
    if (adminUser.user_type !== 'admin') {
        window.location.href = adminUser.user_type === 'customer' ? '/dashboard' : '/';
        return;
    }

    const nameEl = document.getElementById('adminName');
    const avatarEl = document.getElementById('adminAvatar');
    if (nameEl) nameEl.textContent = adminUser.full_name || 'Admin';
    if (avatarEl && adminUser.full_name) {
        const parts = adminUser.full_name.split(' ');
        avatarEl.textContent = parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
    }

    const logoutEl = document.getElementById('adminLogout');
    if (logoutEl) {
        logoutEl.addEventListener('click', function(e) {
            e.preventDefault();
            if (logoutEl.classList.contains('is-loading')) return;
            logoutEl.classList.add('is-loading');
            const textEl = logoutEl.querySelector('.logout-text');
            if (textEl) textEl.textContent = 'Logging out…';
            setTimeout(function() {
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('bookingData');
                window.location.href = '/';
            }, 400);
        });
    }

    const searchEl = document.getElementById('adminSearch');
    if (searchEl) searchEl.addEventListener('input', renderBookings);

    loadStats();
    loadBookings();
    loadUsers();
    setupAddForms();
    initCharts();
});

function showAddModal(type) {
    const modals = {
        flight: 'addFlightModal',
        hotel: 'addHotelModal',
        package: 'addPackageModal'
    };
    const modalId = modals[type];
    if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    }
}

function closeAddModal() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('#addFlightForm, #addHotelForm, #addPackageForm').forEach(f => f.reset());
}

// Make functions global for onclick handlers
window.showAddModal = showAddModal;
window.closeAddModal = closeAddModal;

function setupAddForms() {
    const flightForm = document.getElementById('addFlightForm');
    const hotelForm = document.getElementById('addHotelForm');
    const packageForm = document.getElementById('addPackageForm');

    if (flightForm) {
        flightForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(flightForm);
            const data = Object.fromEntries(formData);
            try {
                const res = await fetch('/api/flights', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    showToast('Flight created successfully!', 'success');
                    closeAddModal();
                } else {
                    showToast(result.message || 'Failed to create flight', 'error');
                }
            } catch (err) {
                showToast('Error creating flight', 'error');
            }
        });
    }

    if (hotelForm) {
        hotelForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(hotelForm);
            const data = Object.fromEntries(formData);
            try {
                const res = await fetch('/api/hotels', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    showToast('Hotel created successfully!', 'success');
                    closeAddModal();
                } else {
                    showToast(result.message || 'Failed to create hotel', 'error');
                }
            } catch (err) {
                showToast('Error creating hotel', 'error');
            }
        });
    }

    if (packageForm) {
        packageForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(packageForm);
            const data = Object.fromEntries(formData);
            
            // Convert numeric fields
            if (data.duration_days) data.duration_days = parseInt(data.duration_days);
            if (data.original_price) data.original_price = parseFloat(data.original_price);
            if (data.discounted_price) data.discounted_price = parseFloat(data.discounted_price);
            if (data.rating) data.rating = parseFloat(data.rating);
            
            try {
                const res = await fetch('/api/packages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    if (typeof showSuccessModal === 'function') {
                        showSuccessModal('Package created successfully!');
                    } else {
                        alert('Package created successfully!');
                    }
                    packageForm.reset();
                    closeAddModal();
                } else {
                    if (typeof showErrorModal === 'function') {
                        showErrorModal(result.message || 'Failed to create package');
                    } else {
                        alert(result.message || 'Failed to create package');
                    }
                }
            } catch (err) {
                console.error('Error creating package:', err);
                if (typeof showErrorModal === 'function') {
                    showErrorModal('Error creating package: ' + err.message);
                } else {
                    alert('Error creating package: ' + err.message);
                }
            }
        });
    }

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeAddModal();
        });
    });
}

function showToast(message, type) {
    // Use advanced modal if available, otherwise fallback to toast
    if (typeof showSuccessModal === 'function' && type !== 'error') {
        showSuccessModal(message);
        return;
    }
    if (typeof showErrorModal === 'function' && type === 'error') {
        showErrorModal(message);
        return;
    }
    // Fallback to old toast
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-notification' + (type === 'error' ? ' toast-error' : '');
    toast.textContent = message;
    toast.style.background = type === 'error' ? '#dc2626' : '#059669';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
}

function initCharts() {
    loadChartData();
}

async function loadChartData() {
    try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (data.success && data.bookings) {
            createRevenueChart(data.bookings);
            createBookingsChart(data.bookings);
        }
    } catch (e) {
        console.error('Failed to load chart data:', e);
    }
}

function createRevenueChart(bookings) {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    const last7Days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        last7Days.push(d.toISOString().split('T')[0]);
    }

    const revenueByDay = last7Days.map(date => {
        return bookings
            .filter(b => b.booking_date && b.booking_date.startsWith(date))
            .reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0);
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            datasets: [{
                label: 'Revenue ($)',
                data: revenueByDay,
                borderColor: '#0d9488',
                backgroundColor: 'rgba(13, 148, 136, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function createBookingsChart(bookings) {
    const ctx = document.getElementById('bookingsChart');
    if (!ctx) return;

    const byType = {
        flight: bookings.filter(b => b.booking_type === 'flight').length,
        hotel: bookings.filter(b => b.booking_type === 'hotel').length,
        package: bookings.filter(b => b.booking_type === 'package').length
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Flights', 'Hotels', 'Packages'],
            datasets: [{
                data: [byType.flight, byType.hotel, byType.package],
                backgroundColor: ['#0d9488', '#f59e0b', '#8b5cf6'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

async function loadStats() {
    try {
        const [bookingsRes, usersRes] = await Promise.all([
            fetch('/api/bookings'),
            fetch('/api/users')
        ]);
        const bookingsData = await bookingsRes.json();
        const usersData = await usersRes.json();

        const bookings = (bookingsData.success && bookingsData.bookings) ? bookingsData.bookings : [];
        const users = (usersData.success && usersData.users) ? usersData.users : [];
        const total = bookings.reduce((s, b) => s + parseFloat(b.total_amount || 0), 0);

        const pending = bookings.filter(function(b) { return (b.status || '').toLowerCase() === 'pending'; }).length;
        const revEl = document.getElementById('statRevenue');
        const bookEl = document.getElementById('statBookings');
        const usersEl = document.getElementById('statUsers');
        const pendEl = document.getElementById('statPending');
        if (revEl) revEl.textContent = '$' + Math.round(total).toLocaleString();
        if (bookEl) bookEl.textContent = String(bookings.length);
        if (usersEl) usersEl.textContent = String(users.length);
        if (pendEl) pendEl.textContent = String(pending);
    } catch (e) {
        console.error(e);
    }
}

function skeletonTable(rows) {
    let html = '';
    for (let i = 0; i < rows; i++) {
        html += '<div class="skeleton-row"><div class="skeleton-block w25"></div><div class="skeleton-block w30"></div><div class="skeleton-block w20"></div><div class="skeleton-block w15"></div></div>';
    }
    return html;
}

async function loadBookings() {
    const wrap = document.getElementById('adminBookingsWrap');
    const skel = document.getElementById('adminBookingsSkeleton');
    const list = document.getElementById('adminBookingsList');
    const empty = document.getElementById('adminBookingsEmpty');
    if (!skel || !list) return;

    skel.innerHTML = skeletonTable(5);
    skel.style.display = 'block';
    list.style.display = 'none';
    if (empty) empty.style.display = 'none';

    try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (data.success && data.bookings) {
            allBookings = data.bookings;
            renderBookings();
        } else {
            skel.style.display = 'none';
            if (empty) { empty.style.display = 'block'; empty.textContent = 'No bookings yet.'; }
        }
    } catch (e) {
        skel.style.display = 'none';
        if (empty) { empty.style.display = 'block'; empty.textContent = 'Failed to load bookings.'; }
    }
}

function renderBookings() {
    const skel = document.getElementById('adminBookingsSkeleton');
    const list = document.getElementById('adminBookingsList');
    const empty = document.getElementById('adminBookingsEmpty');
    if (!list) return;

    skel.style.display = 'none';
    const q = (document.getElementById('adminSearch')?.value || '').toLowerCase();
    let rows = allBookings;
    if (q) {
        rows = rows.filter(function(b) {
            const name = (b.full_name || '').toLowerCase();
            const email = (b.email || '').toLowerCase();
            const type = (b.booking_type || '').toLowerCase();
            const flight = (b.airline || '') + ' ' + (b.flight_number || '');
            const hotel = (b.hotel_name || '').toLowerCase();
            const pkg = (b.package_title || '').toLowerCase();
            return name.includes(q) || email.includes(q) || type.includes(q) || flight.toLowerCase().includes(q) || hotel.includes(q) || pkg.includes(q);
        });
    }

    if (rows.length === 0) {
        list.style.display = 'none';
        if (empty) { empty.style.display = 'block'; empty.textContent = q ? 'No matches.' : 'No bookings yet.'; }
        return;
    }
    if (empty) empty.style.display = 'none';
    list.style.display = 'block';

    let html = '<table class="data-table"><thead><tr><th>User</th><th>Type</th><th>Details</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>';
    rows.slice(0, 50).forEach(function(b) {
        const d = b.booking_date ? new Date(b.booking_date).toLocaleDateString() : '—';
        let details = '—';
        if (b.booking_type === 'flight' && b.airline) details = b.airline + ' ' + (b.flight_number || '');
        else if (b.booking_type === 'hotel' && b.hotel_name) details = b.hotel_name;
        else if (b.booking_type === 'package' && b.package_title) details = b.package_title;
        const badge = (b.status === 'confirmed') ? 'confirmed' : 'pending';
        html += '<tr><td><div style="font-weight:600;">' + escapeHtml(b.full_name || '—') + '</div><div style="font-size:12px;color:var(--text-muted);">' + escapeHtml(b.email || '') + '</div></td><td>' + (b.booking_type || '—') + '</td><td>' + escapeHtml(details) + '</td><td>$' + parseFloat(b.total_amount || 0).toFixed(2) + '</td><td><span class="badge ' + badge + '">' + (b.status || 'pending') + '</span></td><td>' + d + '</td></tr>';
    });
    html += '</tbody></table>';
    list.innerHTML = html;
}

function escapeHtml(s) {
    if (!s) return '';
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

async function loadUsers() {
    const skel = document.getElementById('adminUsersSkeleton');
    const list = document.getElementById('adminUsersList');
    const empty = document.getElementById('adminUsersEmpty');
    if (!skel || !list) return;

    skel.innerHTML = skeletonTable(4);
    skel.style.display = 'block';
    list.style.display = 'none';
    if (empty) empty.style.display = 'none';

    try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (data.success && data.users) {
            allUsers = data.users;
            skel.style.display = 'none';
            if (allUsers.length === 0) {
                if (empty) { empty.style.display = 'block'; }
                return;
            }
            if (empty) empty.style.display = 'none';
            list.style.display = 'block';
            let html = '<table class="data-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead><tbody>';
            allUsers.forEach(function(u) {
                const d = u.created_at ? new Date(u.created_at).toLocaleDateString() : '—';
                const roleClass = u.user_type === 'admin' ? 'admin' : 'customer';
                html += '<tr><td>' + escapeHtml(u.full_name || '—') + '</td><td>' + escapeHtml(u.email || '') + '</td><td><span class="badge ' + roleClass + '">' + (u.user_type || '—') + '</span></td><td>' + d + '</td></tr>';
            });
            html += '</tbody></table>';
            list.innerHTML = html;
        } else {
            skel.style.display = 'none';
            if (empty) { empty.style.display = 'block'; }
        }
    } catch (e) {
        skel.style.display = 'none';
        if (empty) { empty.style.display = 'block'; empty.textContent = 'Failed to load users.'; }
    }
}
