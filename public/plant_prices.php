<?php
// plant_prices.php
header('Content-Type: application/json');

// Database connection (use your own credentials)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "user_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Query to get plant prices
$sql = "SELECT plant_name, price FROM plant_prices";
$result = $conn->query($sql);

$prices = [];

// Fetch results
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $prices[$row['plant_name']] = $row['price'];
  }
}

// Return the plant prices as JSON
echo json_encode($prices);

// Close connection
$conn->close();
?>
