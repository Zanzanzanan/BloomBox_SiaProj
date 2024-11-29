// Extract the plant ID from the URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const plantId = urlParams.get('id'); // Get the 'id' parameter from the URL

const apiKey = 'sk-rglv67474d408f0be7804'; // Replace with your actual API key
const apiUrl = `https://perenual.com/api/species/details/${plantId}?key=${apiKey}`;

// Function to fetch and display plant details
function fetchPlantDetails() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("API request failed with status: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Handle the response and update the HTML elements
            if (data) {
                document.getElementById('common-name').textContent = data.common_name || 'No name available';
                document.getElementById('scientific-name').textContent = data.scientific_name ? data.scientific_name.join(', ') : 'No scientific name available';
                document.getElementById('description').textContent = data.description || 'No description available';
                document.getElementById('watering').textContent = data.watering || 'No watering info available';

                // Set plant image
                const plantImage = document.getElementById('plant-image');
                plantImage.src = data.default_image ? data.default_image.medium_url : 'default-image.jpg'; // Fallback image if none available

                // Display additional plant details
                document.getElementById('cycle').textContent = data.cycle || 'Not specified';
                document.getElementById('propagation').textContent = data.propagation || 'Not specified';
                document.getElementById('hardiness-zone').textContent = data.hardiness_zone || 'Not specified';
                document.getElementById('flowers').textContent = data.flowers || 'Not specified';
                document.getElementById('sun').textContent = data.sun || 'Not specified';
                document.getElementById('soil').textContent = data.soil || 'Not specified';
                document.getElementById('cones').textContent = data.cones ? 'Yes' : 'No';
                document.getElementById('leaf').textContent = data.leaf ? 'Yes' : 'No';
                document.getElementById('leaf-color').textContent = data.leaf_color || 'Not specified';
                document.getElementById('growth-rate').textContent = data.growth_rate || 'Not specified';
                document.getElementById('maintenance').textContent = data.maintenance || 'Not specified';
                document.getElementById('drought-tolerant').textContent = data.drought_tolerant ? 'Yes' : 'No';
                document.getElementById('care-level').textContent = data.care_level || 'Not specified';
            }
        })
        .catch(error => {
            console.error('Error fetching plant details:', error);
            document.getElementById("loadingIndicator").innerHTML = `<p class="text-danger">Failed to load plant details: ${error.message}</p>`;
        });
}

// Fetch plant details when the page loads
document.addEventListener("DOMContentLoaded", fetchPlantDetails);
