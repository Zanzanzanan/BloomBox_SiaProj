<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $servername = "localhost";
    $username = "root";  // Your database username
    $password = "";      // Your database password
    $dbname = "user_db"; // Your database name

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Retrieve user input
    $name = $_POST['signup-name'];
    $email = $_POST['signup-email'];
    $password = $_POST['signup-password'];
    $password_confirm = $_POST['signup-password-confirm'];
    $address = $_POST['signup-address']; // Retrieve the address

    // Check if passwords match
    if ($password !== $password_confirm) {
        echo "Passwords do not match!";
        exit();
    }

    // Hash the password for security
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert user into database
    $sql = "INSERT INTO users (name, email, password, address) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $name, $email, $hashed_password, $address);

    if ($stmt->execute()) {
        // Log the user in by storing session variables
        $_SESSION['user_id'] = $stmt->insert_id;  // Get the inserted user ID
        $_SESSION['user_name'] = $name;
        $_SESSION['user_email'] = $email;

        // Redirect to home.php after successful registration and login
        header("Location: logreg.html");
        exit();
    } else {
        echo "Error: " . $stmt->error;
    }

    $conn->close();
}
?>
