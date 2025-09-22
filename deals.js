// Deals Management System
class DealsManager {
    constructor() {
        this.currentDeals = [];
        this.init();
    }

    // Generate 2 random deals
    generateDeals() {
        const restaurants = Object.keys(DEALS_DATA);
        const selectedDeals = [];
        
        // Get 2 random restaurants
        const shuffled = restaurants.sort(() => 0.5 - Math.random());
        const selectedRestaurants = shuffled.slice(0, 2);
        
        selectedRestaurants.forEach(restaurant => {
            const deals = DEALS_DATA[restaurant];
            const randomDeal = deals[Math.floor(Math.random() * deals.length)];
            selectedDeals.push({
                restaurant: restaurant,
                deal: randomDeal
            });
        });
        
        this.currentDeals = selectedDeals;
        this.updateNotificationCount();
        this.saveDeals();
    }

    // Update notification count display
    updateNotificationCount() {
        const notificationBells = document.querySelectorAll('.notification-bell');
        notificationBells.forEach(bell => {
            const countElement = bell.querySelector('.notification-count');
            if (countElement) {
                countElement.textContent = this.currentDeals.length;
                countElement.style.display = this.currentDeals.length > 0 ? 'block' : 'none';
            }
        });
    }

    // Save deals to localStorage
    saveDeals() {
        localStorage.setItem('currentDeals', JSON.stringify(this.currentDeals));
    }

    // Load deals from localStorage
    loadDeals() {
        const saved = localStorage.getItem('currentDeals');
        if (saved) {
            this.currentDeals = JSON.parse(saved);
        } else {
            this.generateDeals();
        }
        this.updateNotificationCount();
    }

    // Show deals modal
    showDealsModal() {
        const modal = document.getElementById('dealsModal');
        const dealsList = document.getElementById('dealsList');
        
        if (modal && dealsList) {
            // Clear existing deals
            dealsList.innerHTML = '';
            
            // Add current deals
            this.currentDeals.forEach((deal, index) => {
                const dealElement = document.createElement('div');
                dealElement.className = 'deal-item';
                dealElement.innerHTML = `
                    <div class="deal-restaurant">${deal.restaurant}</div>
                    <div class="deal-text">${deal.deal}</div>
                    <button class="deal-claim-btn" onclick="dealsManager.claimDeal(${index})">Claim Deal</button>
                `;
                dealsList.appendChild(dealElement);
            });
            
            // Show modal
            modal.style.display = 'flex';
            
            // Bind modal events
            this.bindDealsModalEvents();
        }
    }

    // Hide deals modal
    hideDealsModal() {
        const modal = document.getElementById('dealsModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Bind deals modal events
    bindDealsModalEvents() {
        const modal = document.getElementById('dealsModal');
        const closeBtn = document.getElementById('closeDealsModal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideDealsModal());
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideDealsModal();
                }
            });
        }
    }

    // Claim a deal
    claimDeal(index) {
        if (index >= 0 && index < this.currentDeals.length) {
            const deal = this.currentDeals[index];
            alert(`Deal claimed: ${deal.deal} from ${deal.restaurant}`);
            
            // Remove the claimed deal
            this.currentDeals.splice(index, 1);
            this.updateNotificationCount();
            this.saveDeals();
            
            // Refresh the modal
            this.showDealsModal();
        }
    }

    // Initialize the deals system
    init() {
        this.loadDeals();
        this.bindEvents();
    }

    // Bind click events
    bindEvents() {
        const notificationBells = document.querySelectorAll('.notification-bell');
        notificationBells.forEach(bell => {
            bell.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDealsModal();
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dealsManager = new DealsManager();
});
