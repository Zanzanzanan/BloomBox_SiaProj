const trefleApiUrl = 'https://trefle.io/api/v1/plants?token=YOUR_TREFLE_API_TOKEN';
const fakeStoreApiUrl = 'https://fakestoreapi.com/products';

// Elements
const productList = document.getElementById('productList');
const searchInput = document.getElementById('searchInput');
const filterSelectCycle = document.getElementById('filterSelectCycle');
const filterSelectWatering = document.getElementById('filterSelectWatering');
const sortSelect = document.getElementById('sortSelect');
const loadingIndicator = document.getElementById('loadingIndicator');

// Fetch Data from APIs
Promise.all([
    fetch(trefleApiUrl).then(response => response.json()),
    fetch(fakeStoreApiUrl).then(response => response.json())
]).then(([trefleData, fakeStoreData]) => {
    const treflePlants = trefleData.data;
    const fakeProducts = fakeStoreData;

    // Combine Trefle and Fake Store Data
    const combinedData = treflePlants.map((plant, index) => ({
        name: plant.common_name || plant.scientific_name || 'Unknown Plant',
        price: fakeProducts[index % fakeProducts.length].price, // Use Fake Store price
        image: fakeProducts[index % fakeProducts.length].image, // Use Fake Store image
        cycle: plant.cycle || 'Unknown Cycle',
        watering: plant.watering || 'Unknown Watering'
    }));

    // Hide loading indicator
    loadingIndicator.style.display = 'none';

    // Display combined data
    displayProducts(combinedData);

    // Add Event Listeners for Search, Filter, and Sort
    searchInput.addEventListener('input', () => filterAndDisplay(combinedData));
    filterSelectCycle.addEventListener('change', () => filterAndDisplay(combinedData));
    filterSelectWatering.addEventListener('change', () => filterAndDisplay(combinedData));
    sortSelect.addEventListener('change', () => filterAndDisplay(combinedData));
}).catch(error => {
    console.error('Error fetching data:', error);
    loadingIndicator.innerHTML = '<p>Error loading data. Please try again later.</p>';
});

// Display Products
function displayProducts(products) {
    productList.innerHTML = ''; // Clear existing content
    products.forEach(product => {
        productList.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">Price: $${product.price}</p>
                        <p class="card-text">Cycle: ${product.cycle}</p>
                        <p class="card-text">Watering: ${product.watering}</p>
                        <button class="btn btn-success">Buy Now</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Filter, Search, and Sort
function filterAndDisplay(products) {
    let filteredProducts = products;

    // Filter by cycle
    const cycle = filterSelectCycle.value;
    if (cycle !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.cycle === cycle);
    }

    // Filter by watering
    const watering = filterSelectWatering.value;
    if (watering !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.watering === watering);
    }

    // Search by name
    const searchQuery = searchInput.value.toLowerCase();
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchQuery)
        );
    }

    // Sort products
    const sortValue = sortSelect.value;
    if (sortValue === 'name-asc') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === 'name-desc') {
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    }

    displayProducts(filteredProducts);
}
