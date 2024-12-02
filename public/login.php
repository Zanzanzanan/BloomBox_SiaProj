<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $servername = "localhost";
    $username = "root"; // Adjust if you have different credentials
    $password = ""; // Adjust password if necessary
    $dbname = "user_db"; // Ensure the database exists

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Retrieve user input
    $email = $_POST['login-email'];
    $password = $_POST['login-password'];

    // Check if the user exists in the database
    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        // Verify password
        if (password_verify($password, $row['password'])) {
            echo "Login successful!";
        } else {
            echo "Invalid password!";
        }
    } else {
        echo "No user found with this email!";
    }

    $conn->close();
}
?>
