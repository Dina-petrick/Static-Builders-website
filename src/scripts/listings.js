// Listings page functionality

class ListingsManager {
    constructor() {
        this.listings = [];
        this.filteredListings = [];
        this.currentPage = 1;
        this.itemsPerPage = 8;
        this.filters = {
            search: '',
            location: '',
            price: '',
            size: '',
            sort: 'newest'
        };
        
        this.init();
    }

    init() {
        this.loadListings();
        this.setupFilters();
        this.setupPagination();
        this.renderListings();
    }

    loadListings() {
        // In a real application, this would fetch from an API
        this.listings = [
            {
                id: 1,
                title: 'Hillside Premium Plot',
                location: 'sunset-valley',
                locationName: 'Sunset Valley, Metropolitan',
                price: 450000,
                size: 2.5,
                tag: 'Ready-to-build',
                image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                featured: true,
                dateAdded: '2025-01-15'
            },
            {
                id: 2,
                title: 'Lakefront Luxury Plot',
                location: 'crystal-lake',
                locationName: 'Crystal Lake, Premium District',
                price: 750000,
                size: 3.2,
                tag: 'Waterfront',
                image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                featured: true,
                dateAdded: '2025-01-14'
            },
            {
                id: 3,
                title: 'Mountain View Estate',
                location: 'alpine-heights',
                locationName: 'Alpine Heights, Exclusive',
                price: 1200000,
                size: 5.0,
                tag: 'Mountain View',
                image: 'https://images.pexels.com/photos/1029613/pexels-photo-1029613.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                featured: true,
                dateAdded: '2025-01-13'
            },
            {
                id: 4,
                title: 'Riverside Premium Development',
                location: 'riverside',
                locationName: 'Riverside, Luxury District',
                price: 680000,
                size: 4.1,
                tag: 'River Access',
                image: 'https://images.pexels.com/photos/1029641/pexels-photo-1029641.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                featured: false,
                dateAdded: '2025-01-12'
            },
            {
                id: 5,
                title: 'Valley View Residential',
                location: 'sunset-valley',
                locationName: 'Sunset Valley, Residential',
                price: 320000,
                size: 1.8,
                tag: 'Residential',
                image: 'https://images.pexels.com/photos/1029624/pexels-photo-1029624.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                featured: false,
                dateAdded: '2025-01-11'
            },
            {
                id: 6,
                title: 'Alpine Luxury Estate',
                location: 'alpine-heights',
                locationName: 'Alpine Heights, Ultra Premium',
                price: 2100000,
                size: 8.5,
                tag: 'Estate',
                image: 'https://images.pexels.com/photos/1029632/pexels-photo-1029632.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                featured: false,
                dateAdded: '2025-01-10'
            },
            {
                id: 7,
                title: 'Lakeside Premium Plot',
                location: 'crystal-lake',
                locationName: 'Crystal Lake, Waterfront',
                price: 890000,
                size: 3.7,
                tag: 'Premium',
                image: 'https://images.pexels.com/photos/1029635/pexels-photo-1029635.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                featured: false,
                dateAdded: '2025-01-09'
            },
            {
                id: 8,
                title: 'Riverside Family Plot',
                location: 'riverside',
                locationName: 'Riverside, Family District',
                price: 540000,
                size: 2.9,
                tag: 'Family',
                image: 'https://images.pexels.com/photos/1029638/pexels-photo-1029638.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                featured: false,
                dateAdded: '2025-01-08'
            }
        ];

        this.filteredListings = [...this.listings];
    }

    setupFilters() {
        const searchInput = document.getElementById('searchInput');
        const locationFilter = document.getElementById('locationFilter');
        const priceFilter = document.getElementById('priceFilter');
        const sizeFilter = document.getElementById('sizeFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (searchInput) {
            searchInput.addEventListener('input', SmartBuilders.debounce((e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.applyFilters();
            }, 300));
        }

        if (locationFilter) {
            locationFilter.addEventListener('change', (e) => {
                this.filters.location = e.target.value;
                this.applyFilters();
            });
        }

        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => {
                this.filters.price = e.target.value;
                this.applyFilters();
            });
        }

        if (sizeFilter) {
            sizeFilter.addEventListener('change', (e) => {
                this.filters.size = e.target.value;
                this.applyFilters();
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        let filtered = [...this.listings];

        // Search filter
        if (this.filters.search) {
            filtered = filtered.filter(listing => 
                listing.title.toLowerCase().includes(this.filters.search) ||
                listing.locationName.toLowerCase().includes(this.filters.search)
            );
        }

        // Location filter
        if (this.filters.location) {
            filtered = filtered.filter(listing => listing.location === this.filters.location);
        }

        // Price filter
        if (this.filters.price) {
            filtered = filtered.filter(listing => {
                const price = listing.price;
                switch (this.filters.price) {
                    case '0-500000':
                        return price < 500000;
                    case '500000-1000000':
                        return price >= 500000 && price < 1000000;
                    case '1000000-2000000':
                        return price >= 1000000 && price < 2000000;
                    case '2000000+':
                        return price >= 2000000;
                    default:
                        return true;
                }
            });
        }

        // Size filter
        if (this.filters.size) {
            filtered = filtered.filter(listing => {
                const size = listing.size;
                switch (this.filters.size) {
                    case '0-2':
                        return size < 2;
                    case '2-5':
                        return size >= 2 && size < 5;
                    case '5-10':
                        return size >= 5 && size < 10;
                    case '10+':
                        return size >= 10;
                    default:
                        return true;
                }
            });
        }

        // Sort
        filtered.sort((a, b) => {
            switch (this.filters.sort) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'size-large':
                    return b.size - a.size;
                case 'featured':
                    return b.featured - a.featured;
                case 'newest':
                default:
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
            }
        });

        this.filteredListings = filtered;
        this.currentPage = 1;
        this.updateResultsCount();
        this.renderListings();
        this.updatePagination();
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = this.filteredListings.length;
        }
    }

    renderListings() {
        const grid = document.getElementById('listingsGrid');
        if (!grid) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentListings = this.filteredListings.slice(startIndex, endIndex);

        if (currentListings.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <h3>No properties found</h3>
                    <p>Try adjusting your filters to see more results.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = currentListings.map(listing => this.createListingCard(listing)).join('');

        // Add animation to new cards
        const cards = grid.querySelectorAll('.listing-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    createListingCard(listing) {
        return `
            <article class="listing-card" data-location="${listing.location}" data-price="${listing.price}" data-size="${listing.size}">
                <div class="listing-card__image">
                    <img src="${listing.image}" alt="${listing.title}" loading="lazy">
                    <span class="listing-card__tag">${listing.tag}</span>
                </div>
                <div class="listing-card__content">
                    <h3 class="listing-card__title">${listing.title}</h3>
                    <p class="listing-card__location">${listing.locationName}</p>
                    <div class="listing-card__details">
                        <span class="listing-card__size">${listing.size} acres</span>
                        <span class="listing-card__price">${SmartBuilders.formatPrice(listing.price)}</span>
                    </div>
                    <a href="project-details.html?id=${listing.id}" class="btn btn--outline btn--small">View Details</a>
                </div>
            </article>
        `;
    }

    setupPagination() {
        const prevBtn = document.querySelector('.pagination__btn--prev');
        const nextBtn = document.querySelector('.pagination__btn--next');
        const pageNumbers = document.querySelector('.pagination__numbers');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderListings();
                    this.updatePagination();
                    this.scrollToTop();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredListings.length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderListings();
                    this.updatePagination();
                    this.scrollToTop();
                }
            });
        }

        if (pageNumbers) {
            pageNumbers.addEventListener('click', (e) => {
                if (e.target.classList.contains('pagination__number')) {
                    const page = parseInt(e.target.textContent);
                    this.currentPage = page;
                    this.renderListings();
                    this.updatePagination();
                    this.scrollToTop();
                }
            });
        }
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredListings.length / this.itemsPerPage);
        const prevBtn = document.querySelector('.pagination__btn--prev');
        const nextBtn = document.querySelector('.pagination__btn--next');
        const pageNumbers = document.querySelector('.pagination__numbers');

        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
        }

        if (pageNumbers && totalPages > 1) {
            let paginationHTML = '';
            const startPage = Math.max(1, this.currentPage - 1);
            const endPage = Math.min(totalPages, this.currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                paginationHTML += `
                    <button class="pagination__number ${i === this.currentPage ? 'pagination__number--active' : ''}">${i}</button>
                `;
            }

            pageNumbers.innerHTML = paginationHTML;
        }
    }

    scrollToTop() {
        const listingsSection = document.querySelector('.listings-page');
        if (listingsSection) {
            listingsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Initialize listings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.listings-page')) {
        new ListingsManager();
    }
});