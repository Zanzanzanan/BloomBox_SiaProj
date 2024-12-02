document.addEventListener("DOMContentLoaded", () => {
    const featuredPlantsContainer = document.querySelector("#featured-plants .row"); // Ensure there's a row class in your section

    const apiUrl = "https://perenual.com/api/species-list?key=sk-rglv67474d408f0be7804&page=1"; // Use your API key

    // Fetch and display featured plants
    function fetchFeaturedPlants() {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("API request failed with status: " + response.status);
                }
                return response.json();
            })
            .then(data => {
                const featuredPlants = data.data.slice(0, 6).map(item => ({
                    id: item.id,
                    name: item.common_name || "Unknown Name",
                    description: item.scientific_name?.join(", ") || "No description available",
                    imageUrl: item.default_image?.regular_url || "https://via.placeholder.com/300x200",
                }));
                displayFeaturedPlants(featuredPlants);
            })
            .catch(error => {
                console.error("Error fetching featured plants:", error);
                featuredPlantsContainer.innerHTML = `<p class="text-danger">Failed to load featured plants: ${error.message}</p>`;
            });
    }

    // Render featured plants dynamically
    function displayFeaturedPlants(plants) {
        featuredPlantsContainer.innerHTML = ""; // Clear previous content
        plants.forEach(plant => {
            const plantCard = `
                <div class="col-md-4">
                    <div class="card">
                        <img src="${plant.imageUrl}" class="card-img-top" alt="${plant.name}">
                        <div class="card-body">
                            <h5 class="card-title">${plant.name}</h5>
                            <p class="card-text">${plant.description}</p>
                            <a href="shop.html?id=${plant.id}" class="btn btn-success">Explore More</a>
                            <a href="shop.html?id=${plant.id}" class="btn btn-outline-success mt-2">Go to Shop</a>
                        </div>
                    </div>
                </div>
            `;
            featuredPlantsContainer.insertAdjacentHTML("beforeend", plantCard);
        });
    }

    fetchFeaturedPlants(); // Initial fetch
});
