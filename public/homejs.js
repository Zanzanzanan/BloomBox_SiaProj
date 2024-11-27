// Fetch data from Open Farm API
fetch('https://api.openfarm.cc/v1/plants')
.then(response => response.json())
.then(data => {
    const plantsContainer = document.getElementById('featured-plants');

    // Loop through the API data and create HTML for each featured plant
    data.plants.slice(0, 6).forEach(plant => {  // Limiting to 6 plants for the featured section
        const plantCard = `
            <div class="col-md-4">
                <div class="card">
                    <img src="${plant.main_image}" class="card-img-top" alt="${plant.name}">
                    <div class="card-body">
                        <h5 class="card-title">${plant.name}</h5>
                        <p class="card-text">${plant.description}</p>
                        <a href="shop.html" class="btn btn-success">Explore More</a>
                        <a href="shop.html" class="btn btn-outline-success mt-2">Go to Shop</a>
                    </div>
                </div>
            </div>
        `;
        plantsContainer.innerHTML += plantCard; // Append each plant card to the container
    });
})
.catch(error => console.error('Error fetching plant data:', error));
