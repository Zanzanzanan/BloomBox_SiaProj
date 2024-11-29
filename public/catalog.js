document.addEventListener("DOMContentLoaded", () => {
    const plantList = document.getElementById("plantList");
    const searchInput = document.getElementById("searchInput");
    const filterSelectCycle = document.getElementById("filterSelectCycle");
    const filterSelectWatering = document.getElementById("filterSelectWatering");
    const sortSelect = document.getElementById("sortSelect");

    const apiUrl = "https://perenual.com/api/species-list?key=sk-rglv67474d408f0be7804&page=1"; // Replace with your API key

    let plants = []; // To hold fetched plant data

    // Fetch and display plant data
    function fetchPlants() {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("API request failed with status: " + response.status);
                }
                return response.json();
            })
            .then(data => {
                // Map API data to the plants array
                plants = data.data.map(item => ({
                    id: item.id, // Ensure the plant has a unique id
                    name: item.common_name || "Unknown Name", 
                    scientific_name: Array.isArray(item.scientific_name) ? item.scientific_name.join(", ") : item.scientific_name,
                    cycle: item.cycle ? item.cycle.toLowerCase() : "not specified",
                    watering: item.watering ? item.watering.toLowerCase() : "not specified",
                    imageUrl: item.default_image?.regular_url || "https://via.placeholder.com/300x200",
                }));
                displayPlants(plants); // Display all plants initially
            })
            .catch(error => {
                console.error("Error fetching plant data:", error);
                document.getElementById("loadingIndicator").innerHTML = `<p class='text-danger'>Failed to load plants: ${error.message}</p>`;
            });
    }

    // Display plants dynamically
    function displayPlants(plantsToDisplay) {
        plantList.innerHTML = "";
        if (plantsToDisplay.length === 0) {
            plantList.innerHTML = "<p class='text-muted'>No plants match your criteria.</p>";
            return;
        }
        plantsToDisplay.forEach(plant => {
            const plantCard = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="${plant.imageUrl}" class="card-img-top" alt="${plant.name}">
                        <div class="card-body">
                            <h5 class="card-title">${plant.name}</h5>
                            <p class="card-text">Scientific Name: ${plant.scientific_name}</p>
                            <p class="card-text">Watering: ${plant.watering}</p>
                            <p class="card-text">Cycle: ${plant.cycle}</p>
                            <a href="plant-detail.html?id=${plant.id}" class="btn btn-success">View Details</a>
                        </div>
                    </div>
                </div>
            `;
            plantList.insertAdjacentHTML("beforeend", plantCard);
        });
    }

    // Add event listeners for filtering and sorting
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filteredPlants = plants.filter(plant => plant.name.toLowerCase().includes(query));
        displayPlants(filteredPlants);
    });

    filterSelectCycle.addEventListener("change", () => {
        const filter = filterSelectCycle.value.toLowerCase();
        const filteredPlants = filter === "all" ? plants : plants.filter(plant => plant.cycle === filter);
        displayPlants(filteredPlants);
    });

    filterSelectWatering.addEventListener("change", () => {
        const filter = filterSelectWatering.value.toLowerCase();
        const filteredPlants = filter === "all" ? plants : plants.filter(plant => plant.watering === filter);
        displayPlants(filteredPlants);
    });

    sortSelect.addEventListener("change", () => {
        const sortOption = sortSelect.value;
        let sortedPlants;

        if (sortOption === "name-asc") {
            sortedPlants = [...plants].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "name-desc") {
            sortedPlants = [...plants].sort((a, b) => b.name.localeCompare(a.name));
        } else {
            sortedPlants = plants;
        }

        displayPlants(sortedPlants);
    });

    fetchPlants(); // Initial fetch
});
