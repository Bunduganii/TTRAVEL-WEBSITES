// ============================================
// Booking JavaScript
// ============================================

// ============================================
// Utility Functions
// ============================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Flight Search Handler
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a.logout[data-logout]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            if (a.classList.contains('is-loading')) return;
            a.classList.add('is-loading');
            var t = a.querySelector('.logout-text');
            if (t) t.textContent = 'Logging out…';
            setTimeout(function() {
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('bookingData');
                location.href = '/';
            }, 400);
        });
    });

    const flightSearchForm = document.getElementById('flightSearchForm');
    
    if (flightSearchForm) {
        flightSearchForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const origin = document.getElementById('origin').value;
            const destination = document.getElementById('destination').value;
            const departDate = document.getElementById('departDate').value;
            const returnDate = document.getElementById('returnDate').value;
            
            try {
                const response = await fetch(`/api/flights/search?origin=${origin}&destination=${destination}&departureDate=${departDate}`);
                const data = await response.json();
                
                if (data.success) {
                    displayFlights(data.flights);
                }
            } catch (error) {
                console.error('Flight search error:', error);
            }
        });
        
        // Load initial flights
        loadFlights();
    }
    
    // ============================================
    // Hotel Search Handler
    // ============================================
    const hotelSearchForm = document.getElementById('hotelSearchForm');
    
    if (hotelSearchForm) {
        hotelSearchForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const location = document.getElementById('hotelLocation').value;
            
            try {
                const response = await fetch(`/api/hotels/search?city=${location}`);
                const data = await response.json();
                
                if (data.success) {
                    displayHotels(data.hotels);
                }
            } catch (error) {
                console.error('Hotel search error:', error);
            }
        });
        
        // Load initial hotels
        loadHotels();
    }
    
    // ============================================
    // Package Loader
    // ============================================
    if (document.getElementById('packagesGrid')) {
        loadPackages();
    }
    
    // ============================================
    // Payment Method Selector
    // ============================================
    const paymentMethodButtons = document.querySelectorAll('.payment-method-btn');
    const cardForm = document.getElementById('cardForm');
    const zaadForm = document.getElementById('zaadForm');
    const edahabForm = document.getElementById('edahabForm');
    
    if (paymentMethodButtons.length > 0) {
        paymentMethodButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                paymentMethodButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const method = this.dataset.method;
                
                if (cardForm) cardForm.style.display = method === 'card' ? 'block' : 'none';
                if (zaadForm) zaadForm.style.display = method === 'zaad' ? 'block' : 'none';
                if (edahabForm) edahabForm.style.display = method === 'edahab' ? 'block' : 'none';
            });
        });
    }
    
    // ============================================
    // Payment Form Handler
    // ============================================
    const paymentForm = document.getElementById('paymentForm');
    const payNowBtn = document.getElementById('payNowBtn');
    
    if (payNowBtn) {
        payNowBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const activeMethod = document.querySelector('.payment-method-btn.active');
            const paymentMethod = activeMethod ? activeMethod.dataset.method : 'card';
            
            // Get booking data from sessionStorage
            const bookingData = JSON.parse(sessionStorage.getItem('bookingData') || '{}');
            const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
            
            if (!userData.id) {
                if (typeof showErrorModal === 'function') {
                    showErrorModal('Please login first to complete your booking.', 'Login Required');
                } else {
                    alert('Please login first');
                }
                setTimeout(() => window.location.href = '/', 2000);
                return;
            }
            
            // Create booking
            try {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: userData.id,
                        bookingType: bookingData.type,
                        flightId: bookingData.flightId || null,
                        hotelId: bookingData.hotelId || null,
                        packageId: bookingData.packageId || null,
                        bookingDate: new Date().toISOString().split('T')[0],
                        checkInDate: bookingData.checkInDate || null,
                        checkOutDate: bookingData.checkOutDate || null,
                        travelers: bookingData.travelers || 1,
                        totalAmount: bookingData.totalAmount || 0,
                        paymentMethod: paymentMethod
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    if (typeof showSuccessModal === 'function') {
                        showSuccessModal('Your booking has been confirmed! Redirecting to dashboard...', 'Booking Confirmed');
                        sessionStorage.removeItem('bookingData');
                        setTimeout(() => window.location.href = '/dashboard', 2000);
                    } else {
                        alert('Thank you for purchasing! Your booking has been confirmed.');
                        sessionStorage.removeItem('bookingData');
                        window.location.href = '/dashboard';
                    }
                } else {
                    if (typeof showErrorModal === 'function') {
                        showErrorModal(data.message || 'Payment failed. Please try again.', 'Payment Failed');
                    } else {
                        alert('Payment failed: ' + data.message);
                    }
                }
            } catch (error) {
                console.error('Payment error:', error);
                if (typeof showErrorModal === 'function') {
                    showErrorModal('An error occurred during payment. Please try again.', 'Payment Error');
                } else {
                    alert('An error occurred during payment');
                }
            }
        });
    }
    
    // ============================================
    // Card Number Formatting
    // ============================================
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // ============================================
    // Expiry Date Formatting
    // ============================================
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
});

// ============================================
// Load Flights
// ============================================
async function loadFlights() {
    try {
        const response = await fetch('/api/flights');
        const data = await response.json();
        
        if (data.success) {
            displayFlights(data.flights);
        }
    } catch (error) {
        console.error('Error loading flights:', error);
    }
}

// ============================================
// Display Flights
// ============================================
function displayFlights(flights) {
    const resultsContainer = document.getElementById('flightResults');
    const countEl = document.getElementById('flightCount');
    if (!resultsContainer) return;
    if (countEl) countEl.textContent = (flights.length ? flights.length + ' ' : '') + 'Flights';
    resultsContainer.innerHTML = '';
    
    flights.forEach(flight => {
        const flightCard = document.createElement('div');
        flightCard.className = 'flight-card';
        flightCard.innerHTML = `
            <div class="flight-info">
                <div>
                    <div style="font-weight: 600; margin-bottom: 5px;">${flight.airline} ${flight.flight_number}</div>
                    <div style="font-size: 12px; color: #7f8c8d;">${flight.aircraft}</div>
                </div>
                <div class="flight-time">
                    <div style="font-weight: 600;">${flight.departure_time}</div>
                    <div style="font-size: 12px; color: #7f8c8d;">${flight.origin_code}</div>
                </div>
                <div class="flight-path">
                    <div style="width: 100px; height: 2px; background: #e0e0e0; position: relative;">
                        <span style="position: absolute; left: 50%; top: -10px; transform: translateX(-50%); background: white; padding: 0 5px;">✈️</span>
                    </div>
                    <div style="text-align: center; font-size: 12px; color: #7f8c8d;">
                        ${flight.duration}
                        ${flight.stops === 0 ? '<div>Direct</div>' : `<div>${flight.stops} Stop ${flight.stop_duration || ''}</div>`}
                    </div>
                </div>
                <div class="flight-time">
                    <div style="font-weight: 600;">${flight.arrival_time}</div>
                    <div style="font-size: 12px; color: #7f8c8d;">${flight.destination_code}</div>
                </div>
                <div>
                    <div style="font-size: 12px; color: #7f8c8d;">${flight.fare_type}</div>
                    ${(flight.fare_type || '').includes('Incl') ? '<div>👜</div>' : ''}
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 24px; font-weight: 700; color: #6BB6FF; margin-bottom: 10px;">$${flight.price}</div>
                <div style="font-size: 12px; color: #7f8c8d; margin-bottom: 10px;">per person</div>
                <button class="btn-primary" onclick="bookFlight(${flight.id}, ${flight.price})">Book Now →</button>
            </div>
        `;
        resultsContainer.appendChild(flightCard);
    });
}

// ============================================
// Load Hotels
// ============================================
async function loadHotels() {
    try {
        const response = await fetch('/api/hotels');
        const data = await response.json();
        
        if (data.success) {
            displayHotels(data.hotels);
        }
    } catch (error) {
        console.error('Error loading hotels:', error);
    }
}

// ============================================
// Display Hotels
// ============================================
function displayHotels(hotels) {
    const resultsContainer = document.getElementById('hotelResults');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    hotels.forEach(hotel => {
        const hotelCard = document.createElement('div');
        hotelCard.className = 'hotel-card';
        hotelCard.innerHTML = `
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300" alt="${hotel.name}" class="hotel-image">
            <div class="hotel-details">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <h3 class="hotel-name">${hotel.name}</h3>
                        <div class="hotel-location">📍 ${hotel.location} • 0.5km from center</div>
                        <div class="amenities-list">
                            ${hotel.amenities ? hotel.amenities.split(',').map(a => `<span>${a.trim()}</span>`).join('') : ''}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: 700; color: #6BB6FF;">$${hotel.price_per_night}</div>
                        <div style="font-size: 12px; color: #7f8c8d;">/ night</div>
                        <div style="margin-top: 10px; font-size: 14px; color: #7f8c8d;">Total for 3 nights: $${hotel.price_per_night * 3}</div>
                        <div style="font-size: 12px; color: #27ae60; margin-top: 5px;">Earn $${hotel.commission} commission</div>
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
                    <div>
                        <div style="font-weight: 600;">${'⭐'.repeat(hotel.star_rating)} ${hotel.star_rating}.0 Excellent</div>
                        <div style="font-size: 12px; color: #7f8c8d;">Based on 1,204 reviews</div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-secondary">Details</button>
                        <button class="btn-primary" onclick="bookHotel(${hotel.id}, ${hotel.price_per_night * 3})">Book Now →</button>
                    </div>
                </div>
            </div>
        `;
        resultsContainer.appendChild(hotelCard);
    });
}

// ============================================
// Load Packages
// ============================================
let allPackages = [];

async function loadPackages() {
    const gridContainer = document.getElementById('packagesGrid');
    if (!gridContainer) {
        console.error('packagesGrid not found');
        return;
    }
    
    // Show loading state
    gridContainer.innerHTML = '<div style="grid-column:1/-1; padding:40px; text-align:center; color:var(--text-muted);">Loading packages...</div>';
    
    try {
        const response = await fetch('/api/packages');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.success && data.packages && Array.isArray(data.packages)) {
            allPackages = data.packages;
            console.log(`Loaded ${allPackages.length} packages`);
            // Display ALL packages immediately
            displayPackages(allPackages);
            // Setup search and filters AFTER displaying
            setTimeout(() => {
                setupPackageSearch();
                setupPackageFilters();
            }, 100);
        } else {
            console.error('Failed to load packages:', data.message || 'Unknown error');
            displayPackages([]);
        }
    } catch (error) {
        console.error('Error loading packages:', error);
        gridContainer.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><div class="icon">⚠️</div><h3>Error loading packages</h3><p>' + error.message + '</p></div>';
    }
}

function setupPackageSearch() {
    const searchInput = document.getElementById('packageSearch');
    if (searchInput) {
        // Real-time search as user types
        searchInput.addEventListener('input', function() {
            filterPackages();
        });
        // Also trigger on Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                filterPackages();
            }
        });
        // Trigger on paste
        searchInput.addEventListener('paste', function() {
            setTimeout(() => filterPackages(), 10);
        });
        // Clear button functionality
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                filterPackages();
            }
        });
    } else {
        console.error('packageSearch input not found');
    }
}

function setupPackageFilters() {
    // Price slider - update display and filter
    const priceSlider = document.querySelector('.price-slider');
    const priceValue = document.getElementById('priceValue');
    if (priceSlider) {
        // Set initial display
        if (priceValue) {
            priceValue.textContent = '$' + parseFloat(priceSlider.value).toLocaleString();
        }
        // Update on change
        priceSlider.addEventListener('input', function() {
            if (priceValue) {
                priceValue.textContent = '$' + parseFloat(this.value).toLocaleString();
            }
            filterPackages();
        });
        priceSlider.addEventListener('change', function() {
            filterPackages();
        });
    }
    
    // Duration checkboxes - mark as user changed when clicked
    document.querySelectorAll('.filter-section input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', function() {
            this.dataset.userChanged = 'true';
            filterPackages();
        });
        cb.addEventListener('click', function() {
            this.dataset.userChanged = 'true';
            filterPackages();
        });
    });
    
    // Type buttons
    document.querySelectorAll('.trip-type-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            document.querySelectorAll('.trip-type-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterPackages();
        });
    });
}

function filterPackages() {
    if (!allPackages || allPackages.length === 0) {
        displayPackages([]);
        return;
    }
    
    let filtered = [...allPackages];
    
    // Search filter - always apply if there's a query
    const searchInput = document.getElementById('packageSearch');
    const searchQuery = searchInput ? (searchInput.value || '').toLowerCase().trim() : '';
    if (searchQuery) {
        filtered = filtered.filter(pkg => {
            const title = (pkg.title || '').toLowerCase();
            const dest = (pkg.destination || '').toLowerCase();
            const city = (pkg.city || '').toLowerCase();
            const country = (pkg.country || '').toLowerCase();
            const desc = (pkg.description || '').toLowerCase();
            const type = (pkg.trip_type || '').toLowerCase();
            return title.includes(searchQuery) || dest.includes(searchQuery) || 
                   city.includes(searchQuery) || country.includes(searchQuery) || 
                   desc.includes(searchQuery) || type.includes(searchQuery);
        });
    }
    
    // Price filter - apply if slider is not at max (5000)
    const priceSlider = document.querySelector('.price-slider');
    if (priceSlider) {
        const sliderValue = parseFloat(priceSlider.value) || 5000;
        if (sliderValue < 5000) {
            filtered = filtered.filter(pkg => {
                const price = parseFloat(pkg.discounted_price || pkg.original_price || 0);
                return price <= sliderValue;
            });
        }
    }
    
    // Duration filter - only apply if user has checked at least one box
    const allDurationBoxes = document.querySelectorAll('.filter-section input[type="checkbox"]');
    const checkedBoxes = Array.from(allDurationBoxes).filter(cb => cb.checked);
    const hasUserInteracted = Array.from(allDurationBoxes).some(cb => cb.dataset.userChanged === 'true');
    
    // Only filter if user has interacted with checkboxes AND at least one is checked
    if (hasUserInteracted && checkedBoxes.length > 0) {
        const checkedDurations = checkedBoxes.map(cb => {
            const label = cb.closest('label')?.textContent || '';
            if (label.includes('≤3') || label.includes('<=3')) return 'short';
            if (label.includes('4–7') || label.includes('4-7')) return 'medium';
            if (label.includes('8+')) return 'long';
            return null;
        }).filter(Boolean);
        
        if (checkedDurations.length > 0) {
            filtered = filtered.filter(pkg => {
                const days = parseInt(pkg.duration_days) || 0;
                return checkedDurations.some(d => {
                    if (d === 'short') return days <= 3;
                    if (d === 'medium') return days >= 4 && days <= 7;
                    if (d === 'long') return days >= 8;
                    return false;
                });
            });
        }
    } else if (hasUserInteracted && checkedBoxes.length === 0) {
        // User unchecked all - show nothing
        filtered = [];
    }
    
    // Type filter - only if not "All"
    const activeTypeBtn = document.querySelector('.trip-type-btn.active');
    if (activeTypeBtn) {
        const btnText = activeTypeBtn.textContent.trim();
        if (btnText !== 'All') {
            filtered = filtered.filter(pkg => {
                const pkgType = (pkg.trip_type || '').toLowerCase();
                return pkgType === btnText.toLowerCase();
            });
        }
    }
    
    displayPackages(filtered);
}

// ============================================
// Display Packages
// ============================================
function displayPackages(packages) {
    const gridContainer = document.getElementById('packagesGrid');
    if (!gridContainer) {
        console.error('packagesGrid element not found');
        return;
    }
    
    gridContainer.innerHTML = '';
    
    if (!packages || packages.length === 0) {
        gridContainer.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><div class="icon">📦</div><h3>No packages found</h3><p>Try adjusting your filters.</p></div>';
        return;
    }
    
    packages.forEach(pkg => {
        const packageCard = document.createElement('div');
        packageCard.className = 'package-card';
        
        // Use actual image_url if available and valid, otherwise use smart defaults based on destination
        let imgUrl = pkg.image_url;
        
        // If image_url is a relative path (starts with /images/) or empty, use smart defaults
        if (!imgUrl || imgUrl.trim() === '' || imgUrl.startsWith('/images/')) {
            // Smart defaults based on destination
            const dest = (pkg.destination || pkg.title || '').toLowerCase();
            if (dest.includes('santorini') || dest.includes('greece')) {
                imgUrl = 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400';
            } else if (dest.includes('kyoto') || dest.includes('japan')) {
                imgUrl = 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400';
            } else if (dest.includes('cappadocia') || dest.includes('turkey')) {
                imgUrl = 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=400';
            } else if (dest.includes('maldives')) {
                imgUrl = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400';
            } else if (dest.includes('swiss') || dest.includes('alps')) {
                imgUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400';
            } else if (dest.includes('dubai') || dest.includes('uae')) {
                imgUrl = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400';
            } else if (dest.includes('bali') || dest.includes('indonesia')) {
                imgUrl = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400';
            } else if (dest.includes('iceland') || dest.includes('northern lights')) {
                imgUrl = 'https://images.unsplash.com/photo-1531168556467-80aace0d0144?w=400';
            } else if (dest.includes('mountain') || dest.includes('sheek')) {
                imgUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400';
            } else if (dest.includes('paris') || dest.includes('france')) {
                imgUrl = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400';
            } else {
                imgUrl = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'; // Generic travel image
            }
        }
        
        const isBestSeller = (pkg.badge && pkg.badge.toLowerCase().includes('best')) || (pkg.badge && pkg.badge.toLowerCase().includes('seller'));
        const safeTitle = escapeHtml(pkg.title || 'Package');
        const safeDest = escapeHtml(pkg.destination || 'Destination');
        
        packageCard.innerHTML = `
            <div class="package-image-wrap">
                <img src="${escapeHtml(imgUrl)}" alt="${safeTitle}" class="package-image" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'">
                ${isBestSeller ? '<div class="package-badge-best">BEST SELLER</div>' : ''}
                <button class="package-favorite" aria-label="Save to favorites">❤️</button>
            </div>
            <div class="package-content">
                <div class="package-location">${safeDest}</div>
                <h3 class="package-title">${safeTitle}</h3>
                <div class="package-rating">
                    <span class="star-icon">⭐</span>
                    <span class="rating-value">${pkg.rating || '4.9'}</span>
                </div>
                <p class="package-description">${escapeHtml(pkg.description || 'Experience breathtaking destinations and pristine locations in the most beautiful places.')}</p>
                <div class="package-inclusions">
                    ${pkg.inclusions ? pkg.inclusions.split(',').map(i => `<span>${escapeHtml(i.trim())}</span>`).join(' • ') : 'Flight Included • 4-Star Hotel • Breakfast • Airport Transfer'}
                </div>
                <div class="package-price-row">
                    <span class="package-price-original">$${parseFloat(pkg.original_price || 0).toFixed(2)}</span>
                    <span class="package-price-current">$${parseFloat(pkg.discounted_price || 0).toFixed(2)} / person</span>
                </div>
                <button class="btn-primary package-book-btn" onclick="bookPackage(${pkg.id}, ${pkg.discounted_price || 0})">Book Now</button>
            </div>
        `;
        gridContainer.appendChild(packageCard);
    });
}

// ============================================
// Book Flight
// ============================================
function bookFlight(flightId, price) {
    const bookingData = {
        type: 'flight',
        flightId: flightId,
        totalAmount: price,
        travelers: 2
    };
    
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    window.location.href = '/payment';
}

// ============================================
// Book Hotel
// ============================================
function bookHotel(hotelId, totalAmount) {
    const bookingData = {
        type: 'hotel',
        hotelId: hotelId,
        totalAmount: totalAmount,
        checkInDate: '2024-10-12',
        checkOutDate: '2024-10-15',
        travelers: 2
    };
    
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    window.location.href = '/payment';
}

// ============================================
// Book Package
// ============================================
function bookPackage(packageId, totalAmount) {
    const bookingData = {
        type: 'package',
        packageId: packageId,
        totalAmount: totalAmount,
        travelers: 2
    };
    
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    window.location.href = '/payment';
}

