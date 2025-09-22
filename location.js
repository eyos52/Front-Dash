// Location Management System
class LocationManager {
    constructor() {
        this.currentAddress = this.loadAddress();
        this.init();
    }

    // Load saved address from localStorage
    loadAddress() {
        return localStorage.getItem('userAddress') || '10881 Sedalia Dr, McKinney, TX 75070 United States';
    }

    // Save address to localStorage
    saveAddress(address) {
        localStorage.setItem('userAddress', address);
        this.currentAddress = address;
    }

    // Update address display on all pages
    updateAddressDisplay() {
        const addressElements = document.querySelectorAll('#addressPill');
        addressElements.forEach(element => {
            element.textContent = `🏠 ${this.currentAddress}`;
        });
    }

    // Show location input modal
    showLocationModal() {
        const modal = document.getElementById('locationModal');
        const currentAddressDisplay = document.getElementById('currentAddressDisplay');
        
        if (modal && currentAddressDisplay) {
            // Update current address display
            currentAddressDisplay.textContent = this.currentAddress;
            
            // Clear input fields
            const streetAddressInput = document.getElementById('streetAddress');
            const apartmentUnitInput = document.getElementById('apartmentUnit');
            const cityInput = document.getElementById('city');
            const stateInput = document.getElementById('state');
            const zipCodeInput = document.getElementById('zipCode');
            const countryInput = document.getElementById('country');
            
            if (streetAddressInput) streetAddressInput.value = '';
            if (apartmentUnitInput) apartmentUnitInput.value = '';
            if (cityInput) cityInput.value = '';
            if (stateInput) stateInput.value = '';
            if (zipCodeInput) zipCodeInput.value = '';
            if (countryInput) countryInput.value = '';
            
            // Show modal
            modal.style.display = 'flex';
            
            // Focus on input field
            setTimeout(() => {
                const streetAddressInput = document.getElementById('streetAddress');
                if (streetAddressInput) {
                    streetAddressInput.focus();
                }
            }, 100);
            
            // Bind modal events
            this.bindModalEvents();
        }
    }

    // Hide location modal
    hideLocationModal() {
        const modal = document.getElementById('locationModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Bind modal events
    bindModalEvents() {
        const modal = document.getElementById('locationModal');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const saveBtn = document.getElementById('saveAddressBtn');
        const streetAddressInput = document.getElementById('streetAddress');
        
        // Close modal handlers
        const closeModal = () => this.hideLocationModal();
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        
        // Close on overlay click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }
        
        // Save address handler
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveNewAddress();
            });
        }
        
        // Enter key handler
        if (streetAddressInput) {
            streetAddressInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.saveNewAddress();
                }
            });
        }
    }

    // Save new address
    saveNewAddress() {
        const streetAddress = document.getElementById('streetAddress').value.trim();
        const apartmentUnit = document.getElementById('apartmentUnit').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value.trim();
        const zipCode = document.getElementById('zipCode').value.trim();
        const country = document.getElementById('country').value.trim();

        // Validate required fields
        if (!streetAddress || !city || !state || !zipCode || !country) {
            alert('Please fill in all required fields (Street Address, City, State, ZIP Code, Country).');
            return;
        }

        // Validate ZIP code format (5 digits or 5+4 format)
        if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
            alert('Please enter a valid ZIP code (e.g., 12345 or 12345-6789).');
            return;
        }

        // Validate state format (2 letters)
        if (!/^[A-Z]{2}$/.test(state.toUpperCase())) {
            alert('Please enter a valid state abbreviation (e.g., TX, CA, NY).');
            return;
        }

        // Build formatted address
        let formattedAddress = streetAddress;
        if (apartmentUnit) {
            formattedAddress += `, ${apartmentUnit}`;
        }
        formattedAddress += `, ${city}, ${state.toUpperCase()} ${zipCode}, ${country}`;
        
        // Save the address
        this.saveAddress(formattedAddress);
        
        // Update display
        this.updateAddressDisplay();
        
        // Hide modal
        this.hideLocationModal();
        
        // Show success message
        alert('Address updated successfully!');
    }

    // Initialize the location system
    init() {
        this.updateAddressDisplay();
        this.bindEvents();
    }

    // Bind click events
    bindEvents() {
        const addressPills = document.querySelectorAll('#addressPill');
        addressPills.forEach(pill => {
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLocationModal();
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LocationManager();
});