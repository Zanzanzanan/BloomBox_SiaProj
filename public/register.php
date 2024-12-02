<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $servername = "localhost";
    $username = "root";  // Your database username
    $password = "";      // Your database password
    $dbname = "user_db"; // The database you created

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

    // Check if passwords match
    if ($password !== $password_confirm) {
        echo "Passwords do not match!";
        exit;
    }

    // Hash the password
    $password_hashed = password_hash($password, PASSWORD_DEFAULT);

    // Prepare SQL query to check if email exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "Email already exists!";
        $stmt->close();
    } else {
        // Prepare the INSERT statement for new user
        $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $name, $email, $password_hashed);

        if ($stmt->execute()) {
            echo "Registration successful!";
        } else {
            echo "Error: " . $stmt->error;
        }
        $stmt->close();
    }

    $conn->close();
}
?>
