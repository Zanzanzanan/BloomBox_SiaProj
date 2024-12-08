const apiKey = 'Hu1TWujSfTRyA1zQtf178TN-Ojw4tK1euhPxOWO9y7k';
const apiUrl = `https://trefle.io/api/v1/plants?token=${apiKey}`;
const priceApiUrl = 'plant_prices.php'; // The PHP file that returns plant prices

// Fetch the plant prices from the server (plant_prices.php)
fetch(priceApiUrl)
  .then(response => response.json())
  .then(priceData => {
    const plantPrices = priceData; // The plant price data retrieved from the server
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const plants = data.data; // Trefle API returns plant data in a 'data' field
        const productList = document.getElementById('productList');
        const loadingIndicator = document.getElementById('loadingIndicator');
        
        // Hide loading indicator once data is loaded
        loadingIndicator.style.display = 'none';
        
        // Clear the product list before adding new data
        productList.innerHTML = '';

        // Loop through each plant and display it
        plants.forEach(plant => {
          const plantPrice = plantPrices[plant.common_name] || 'N/A'; // Get price from the server

          const productCard = document.createElement('div');
          productCard.classList.add('col-md-3');
          productCard.innerHTML = `
            <div class="product-card">
              <img src="${plant.image_url}" alt="${plant.common_name}" class="img-fluid">
              <h3>${plant.common_name}</h3>
              <p><strong>Scientific Name:</strong> ${plant.scientific_name}</p>
              <p><strong>Price: $${plantPrice}</strong></p>
              <a href="product-detail.html?plant_id=${plant.id}" class="btn btn-success">View Details</a>
            </div>
          `;
          productList.appendChild(productCard);
        });
      })
      .catch(error => {
        console.error('Error fetching plant data:', error);
        const productList = document.getElementById('productList');
        productList.innerHTML = '<p>Sorry, something went wrong while fetching plant data. Please try again later.</p>';
      });
  })
  .catch(error => {
    console.error('Error fetching plant prices:', error);
  });
