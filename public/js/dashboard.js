// Dashboard — Customer only (Admin | Customer)

let currentUser = null;
let allBookings = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
        window.location.href = '/';
        return;
    }
    currentUser = JSON.parse(userData);

    if (currentUser.user_type !== 'customer') {
        window.location.href = currentUser.user_type === 'admin' ? '/admin' : '/';
        return;
    }

    updateUserInfo();
    loadUserBookings();
    setupTabs();
    setupFilters();
    setupSearch();
    loadSettings();
    setupLogout();
});

function setupLogout() {
    const el = document.getElementById('customerLogout');
    if (!el) return;
    el.addEventListener('click', function(e) {
        e.preventDefault();
        if (el.classList.contains('is-loading')) return;
        el.classList.add('is-loading');
        const textEl = el.querySelector('.logout-text');
        if (textEl) textEl.textContent = 'Logging out…';
        setTimeout(function() {
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('bookingData');
            window.location.href = '/';
        }, 400);
    });
}

function updateUserInfo() {
    const nameEl = document.getElementById('userName');
    const avatarEl = document.getElementById('userAvatar');
    const welcomeEl = document.getElementById('welcomeTitle');
    if (nameEl) nameEl.textContent = currentUser.full_name || 'User';
    if (avatarEl && currentUser.full_name) {
        const parts = currentUser.full_name.split(' ');
        avatarEl.textContent = parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
    }
    if (welcomeEl) {
        const first = currentUser.full_name ? currentUser.full_name.split(' ')[0] : 'User';
        welcomeEl.textContent = `Welcome back, ${first}`;
    }
}

function skeletonTripCards(n) {
    var h = '';
    for (var i = 0; i < n; i++) {
        h += '<div class="trip-card"><div class="thumb" style="background:linear-gradient(90deg,var(--surface-hover) 25%,var(--border) 50%,var(--surface-hover) 75%);background-size:200% 100%;animation:skeleton 1.2s ease-in-out infinite;"></div><div class="body" style="padding:18px 20px;"><div class="skeleton-block w30" style="margin-bottom:10px;"></div><div class="skeleton-block w50" style="margin-bottom:8px;"></div><div class="skeleton-block w20"></div></div></div>';
    }
    return h;
}

async function loadUserBookings() {
    var recentEl = document.getElementById('recentBookings');
    var allEl = document.getElementById('allBookings');
    if (recentEl) recentEl.innerHTML = skeletonTripCards(3);
    if (allEl) allEl.innerHTML = skeletonTripCards(4);
    try {
        var res = await fetch('/api/bookings/user/' + currentUser.id);
        const data = await res.json();
        if (data.success) {
            allBookings = data.bookings;
            displayRecentBookings(data.bookings.slice(0, 3));
            displayAllBookings(data.bookings);
            updateTripCount(data.bookings.length);
            updateWalletStats(data.bookings);
        } else {
            displayEmptyState('recentBookings', 'No bookings yet', 'Book your first trip.');
            displayEmptyState('allBookings', 'No trips found', 'Your bookings will appear here.');
        }
    } catch (e) {
        console.error(e);
        displayEmptyState('recentBookings', 'Couldn’t load bookings', 'Please try again later.');
        displayEmptyState('allBookings', 'Couldn’t load trips', 'Please try again later.');
    }
}

function displayRecentBookings(bookings) {
    const el = document.getElementById('recentBookings');
    if (!el) return;
    if (bookings.length === 0) {
        displayEmptyState('recentBookings', 'No bookings yet', 'Book your first trip to get started.');
        return;
    }
    el.innerHTML = bookings.map(b => createTripCard(b)).join('');
}

function displayAllBookings(bookings) {
    const el = document.getElementById('allBookings');
    if (!el) return;
    let list = currentFilter === 'all' ? bookings : bookings.filter(b => b.booking_type === currentFilter);
    const q = (document.getElementById('tripSearch')?.value || '').toLowerCase();
    if (q) list = list.filter(b => getTitle(b).toLowerCase().includes(q) || b.booking_type.toLowerCase().includes(q));
    const status = document.getElementById('tripStatus')?.value;
    if (status) list = list.filter(b => b.status === status);
    const sort = document.getElementById('tripSort')?.value || 'date-desc';
    list = sortList(list, sort);
    if (list.length === 0) {
        displayEmptyState('allBookings', 'No trips found', 'Try adjusting filters.');
        return;
    }
    el.innerHTML = list.map(b => createTripCard(b)).join('');
}

function createTripCard(b) {
    const title = getTitle(b);
    const icon = { flight: '✈️', hotel: '🏨', package: '📦' }[b.booking_type] || '🎫';
    const statusClass = b.status === 'confirmed' ? 'confirmed' : 'pending';
    
    // Use actual image from booking data if available, otherwise use defaults
    let img = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'; // Generic travel image
    if (b.booking_type === 'package' && b.package_image_url && b.package_image_url.trim() !== '') {
        img = b.package_image_url;
    } else if (b.booking_type === 'hotel' && b.hotel_image_url && b.hotel_image_url.trim() !== '') {
        img = b.hotel_image_url;
    } else {
        const defaultImgs = {
            flight: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
            hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
            package: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400' // Generic travel/beach image instead of Eiffel Tower
        };
        img = defaultImgs[b.booking_type] || img;
    }
    
    const d = b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
    const amt = parseFloat(b.total_amount || 0);
    const fallbackImg = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400';
    var bid = (b.id != null && b.id !== undefined) ? b.id : '';
    return '<div class="trip-card"><img src="' + escapeHtml(img) + '" alt="' + escapeHtml(title) + '" class="thumb" onerror="this.src=\'' + fallbackImg + '\'"><div class="body"><div class="meta"><span class="type-badge">' + icon + '</span><span class="status ' + statusClass + '">' + (b.status || 'pending').toUpperCase() + '</span></div><div class="title">' + escapeHtml(title) + '</div><div class="date">📅 ' + d + '</div><div class="footer"><span class="price">$' + amt.toFixed(2) + '</span><button type="button" class="btn-secondary btn-view-details" style="padding:8px 14px;" data-booking-id="' + bid + '">Details</button></div></div></div>';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getTitle(b) {
    if (b.booking_type === 'flight') return b.airline ? `${b.airline} ${b.flight_number}` : 'Flight';
    if (b.booking_type === 'hotel') return b.hotel_name || 'Hotel';
    if (b.booking_type === 'package') return b.package_title || 'Package';
    return 'Booking';
}

function sortList(list, opt) {
    const arr = [...list];
    if (opt === 'date-desc') arr.sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));
    else if (opt === 'date-asc') arr.sort((a, b) => new Date(a.booking_date) - new Date(b.booking_date));
    else if (opt === 'price-desc') arr.sort((a, b) => b.total_amount - a.total_amount);
    else if (opt === 'price-asc') arr.sort((a, b) => a.total_amount - b.total_amount);
    return arr;
}

function displayEmptyState(id, title, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `
<div class="empty-state" style="grid-column:1/-1;">
  <div class="icon">🎒</div>
  <h3>${title}</h3>
  <p>${msg}</p>
  <button class="btn-primary" style="margin-top:16px;width:auto;" onclick="showBookingModal()">Book now</button>
</div>`;
}

function updateTripCount(n) {
    const el = document.getElementById('tripCount');
    if (el) el.textContent = `${n} ${n === 1 ? 'trip' : 'trips'}`;
}

function updateWalletStats(bookings) {
    const total = bookings.reduce((s, b) => s + parseFloat(b.total_amount || 0), 0);
    const el = document.getElementById('totalSpent');
    if (el) el.textContent = `$${total.toFixed(2)}`;
}

function setupTabs() {
    document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('.nav-item[data-tab]').forEach(n => n.classList.remove('active'));
            const panel = document.getElementById(tab + 'Tab');
            if (panel) panel.classList.add('active');
            this.classList.add('active');
        });
    });
    document.querySelectorAll('.filter-tab').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            displayAllBookings(allBookings);
        });
    });
}

function setupFilters() {
    const statusEl = document.getElementById('tripStatus');
    const sortEl = document.getElementById('tripSort');
    if (statusEl) statusEl.addEventListener('change', () => displayAllBookings(allBookings));
    if (sortEl) sortEl.addEventListener('change', () => displayAllBookings(allBookings));
}

function setupSearch() {
    const tripQ = document.getElementById('tripSearch');
    const globalQ = document.getElementById('globalSearch');
    if (tripQ) tripQ.addEventListener('input', () => displayAllBookings(allBookings));
    if (globalQ) globalQ.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            const q = globalQ.value.trim();
            if (q) window.location.href = `/packages?search=${encodeURIComponent(q)}`;
        }
    });
}

function loadSettings() {
    const n = document.getElementById('settingsName');
    const e = document.getElementById('settingsEmail');
    const p = document.getElementById('settingsPhone');
    if (n) n.value = currentUser.full_name || '';
    if (e) e.value = currentUser.email || '';
    if (p) p.value = currentUser.phone || '';
}

function saveSettings() {
    const n = document.getElementById('settingsName')?.value;
    const ph = document.getElementById('settingsPhone')?.value;
    currentUser.full_name = n;
    currentUser.phone = ph;
    sessionStorage.setItem('user', JSON.stringify(currentUser));
    updateUserInfo();
    showToast('Settings saved.');
}

function showBookingModal() {
    const m = document.getElementById('bookingModal');
    if (m) m.classList.add('active');
}

function closeModal() {
    const m = document.getElementById('bookingModal');
    if (m) m.classList.remove('active');
}

function viewDetails(id) {
    var idNum = typeof id === 'string' ? parseInt(id, 10) : Number(id);
    var b = allBookings.find(function(x) { return x.id === idNum || x.id === id; });
    if (!b) {
        if (typeof showErrorModal === 'function') {
            showErrorModal('Booking details not found.', 'Not Found');
        } else {
            alert('Booking details not found.');
        }
        return;
    }
    var bookingType = b.booking_type || 'booking';
    var title = getTitle(b);
    var date = b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—';
    var icon = { flight: '✈️', hotel: '🏨', package: '📦' }[bookingType] || '🎫';
    var statusColor = (b.status || '') === 'confirmed' ? '#059669' : '#f59e0b';
    var typeLabel = bookingType.charAt(0).toUpperCase() + bookingType.slice(1);
    var html = '<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding: 16px; background: var(--surface-hover); border-radius: var(--radius);">' +
        '<div style="font-size: 32px;">' + icon + '</div><div>' +
        '<div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">' + escapeHtml(title) + '</div>' +
        '<div style="font-size: 13px; color: var(--text-muted);">' + bookingType.toUpperCase() + '</div></div></div>' +
        '<table><tr><td>Booking ID</td><td>#' + b.id + '</td></tr>' +
        '<tr><td>Type</td><td>' + typeLabel + '</td></tr>' +
        '<tr><td>Amount</td><td style="font-weight: 600; color: var(--primary);">$' + parseFloat(b.total_amount || 0).toFixed(2) + '</td></tr>' +
        '<tr><td>Status</td><td><span style="padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; background: ' + statusColor + '15; color: ' + statusColor + ';">' + (b.status || 'pending').toUpperCase() + '</span></td></tr>' +
        '<tr><td>Booking Date</td><td>' + date + '</td></tr>' +
        (b.check_in_date ? '<tr><td>Check-in</td><td>' + new Date(b.check_in_date).toLocaleDateString() + '</td></tr>' : '') +
        (b.check_out_date ? '<tr><td>Check-out</td><td>' + new Date(b.check_out_date).toLocaleDateString() + '</td></tr>' : '') +
        (b.travelers ? '<tr><td>Travelers</td><td>' + b.travelers + '</td></tr>' : '') +
        '</table>';
    if (typeof showAdvancedModal === 'function') {
        showAdvancedModal({ title: 'Booking Details', html: html, type: 'info', icon: icon });
    } else {
        alert('Type: ' + bookingType + '\nAmount: $' + b.total_amount + '\nStatus: ' + (b.status || 'pending') + '\nDate: ' + date);
    }
}

function showToast(msg) {
    const ex = document.querySelector('.toast-notification');
    if (ex) ex.remove();
    const t = document.createElement('div');
    t.className = 'toast-notification';
    t.textContent = msg;
    t.style.background = '#059669';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
}

function openTab(tab) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.nav-item[data-tab]').forEach(n => n.classList.remove('active'));
    const panel = document.getElementById(tab + 'Tab');
    const nav = document.querySelector(`.nav-item[data-tab="${tab}"]`);
    if (panel) panel.classList.add('active');
    if (nav) nav.classList.add('active');
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) closeModal();
    var detailsBtn = e.target.closest('.btn-view-details[data-booking-id]');
    if (detailsBtn) {
        e.preventDefault();
        var id = detailsBtn.getAttribute('data-booking-id');
        if (id !== '' && id !== null) viewDetails(id);
    }
});

window.viewDetails = viewDetails;
