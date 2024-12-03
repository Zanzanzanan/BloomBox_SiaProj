<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    // Redirect to login page if not logged in
    header("Location: login.php");
    exit();
}

$servername = "localhost";
$username = "root";  // Your database username
$password = "";      // Your database password
$dbname = "user_db"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch user details from the database
$user_id = $_SESSION['user_id'];
$sql = "SELECT * FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $name = $user['name'];
    $email = $user['email'];
    $profilePhoto = $user['profile_photo'] ? $user['profile_photo'] : "https://ui-avatars.com/api/?name=" . urlencode($name) . "&color=7F9CF5&background=EBF4FF";
} else {
    // Handle case where no user found
    echo "User not found!";
    exit();
}

$updateSuccess = false; // Flag for successful update

// Check if the form is submitted
if (isset($_POST['save'])) {
    // Fetch the new name and photo (if provided)
    $new_name = htmlspecialchars($_POST['name']);
    $profile_photo = $_FILES['profile_photo']['name'];

    // Initialize uploadOk
    $uploadOk = 1;
    $profile_photo_path = $user['profile_photo']; // default to current photo in DB
    $update_message = ''; // Initialize message variable

    // If a new photo is uploaded, handle the file upload
    if ($profile_photo) {
        // Specify the directory where the file will be uploaded
        $target_dir = "uploads/";
        $target_file = $target_dir . basename($profile_photo);

        // Check if the file is a valid image
        $check = getimagesize($_FILES['profile_photo']['tmp_name']);
        if ($check !== false) {
            // Move the uploaded file to the target directory
            if (move_uploaded_file($_FILES['profile_photo']['tmp_name'], $target_file)) {
                $profile_photo_path = $target_file; // Store the new photo path
                $update_message = 'Profile photo updated successfully!';
            } else {
                $uploadOk = 0;
                echo "Sorry, there was an error uploading your file.";
            }
        } else {
            $uploadOk = 0;
            echo "File is not an image.";
        }
    }

    // If the upload was successful, update the user's name and profile photo in the database
    if ($uploadOk) {
        // Update the database with new name and profile photo
        $sql_update = "UPDATE users SET name = ?, profile_photo = ? WHERE id = ?";
        $stmt_update = $conn->prepare($sql_update);
        $stmt_update->bind_param("ssi", $new_name, $profile_photo_path, $user_id);

        if ($stmt_update->execute()) {
            if ($update_message === '') {
                $_SESSION['profile_update_message'] = 'Name updated to: ' . $new_name; // Store name update message
            } else {
                $_SESSION['profile_update_message'] = $update_message; // Store photo update message
            }
            // Store updated name in session
            $_SESSION['updated_name'] = $new_name;
            $_SESSION['updated_photo'] = $profile_photo_path;
            header("Location: " . $_SERVER['PHP_SELF']);
            exit(); // Ensure the script stops here after redirect
        } else {
            echo "Error updating profile: " . $conn->error;
        }
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Profile</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Rubik:ital,wght@1,900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../public/css/profile.css">
    <style>
        .alert-box {
            display: block; /* Show immediately */
            background-color: #28a745;
            color: white;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
            text-align: center;
        }
    </style>
</head>
<body class="bg-light">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #173231;">
        <div class="container justify-content-center text-center">
            <a class="navbar-brand d-block mb-4" href="home.html">
                <img src="../public/assets/images/bloombox10.png" alt="BloomBox Logo" class="img-fluid">
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav d-flex justify-content-center w-100">
                    <li class="nav-item"><a class="nav-link" href="home.html#about">About Us</a></li>
                    <li class="nav-item"><a class="nav-link" href="catalog.html">Catalog</a></li>
                    <li class="nav-item"><a class="nav-link" href="marketplace.html">Marketplace</a></li>
                    <li class="nav-item"><a class="nav-link" href="profile.php">Account</a></li>
                    <li class="nav-item"><a class="nav-link" href="home.html#community">Community</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Notifications</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Contact Us</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container-fluid mt-5">
        <div class="row">
            <!-- Sidebar with Buttons -->
            <div class="col-md-3">
                <div class="sidebar">
                    <p class="font-semibold text-lg mb-4">ACCOUNT</p>
                    <ul>
                        <li><a href="profile.php" class="text-sm text-gray-700">Profile</a></li>
                        <li><a href="#" class="text-sm text-gray-700">Favorite</a></li>
                        <li><a href="#" class="text-sm text-gray-700">Purchases</a></li>
                        <li><a href="#" class="text-sm text-gray-700">Payment Method</a></li>
                        <li><a href="#" class="text-sm text-gray-700">Address</a></li>
                        <li><a href="#" class="text-sm text-gray-700">My Plants</a></li>
                        <li><a href="#" class="text-sm text-gray-700">Start Selling</a></li>
                    </ul>
                </div>
            </div>

            <!-- Main Profile Section -->
            <div class="col-md-9">
                <div class="content">
                    <h3 class="mb-4">Profile Information</h3>

                    <!-- Display Success Message -->
                    <?php if (isset($_SESSION['profile_update_message'])): ?>
                        <div class="alert-box">
                            <?= $_SESSION['profile_update_message']; ?>
                        </div>
                        <?php unset($_SESSION['profile_update_message']); ?>
                    <?php endif; ?>

                    <form method="POST" enctype="multipart/form-data">
                        <div class="row">
                            <!-- Profile Photo Section -->
                            <div class="col-md-4 mb-4 text-center">
                                <label for="photo" class="form-label">Profile Photo</label>
                                <input type="file" class="form-control" name="profile_photo" id="photo" style="display:none" onchange="previewImage(event)">
                                <div class="text-center">
                                    <img id="profilePhoto" src="<?= $profilePhoto ?>" alt="Profile Photo" class="profile-photo mb-2">
                                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('photo').click();">Change Photo</button>
                                </div>
                            </div>

                            <!-- Name Section -->
                            <div class="col-md-8 mb-4">
                                <label for="name" class="form-label">Name</label>
                                <input type="text" class="form-control" name="name" id="name" value="<?= htmlspecialchars($name) ?>" />
                            </div>

                            <!-- Email Section -->
                            <div class="col-md-8 mb-4">
                                <label for="email" class="form-label">Email</label>
                                <input type="text" class="form-control" id="email" value="<?= htmlspecialchars($email) ?>" disabled />
                            </div>
                        </div>

                        <!-- Save Button -->
                        <div class="d-flex justify-content-end">
                            <button type="submit" name="save" class="save-btn">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS and Popper.js -->
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>
    <script>
        function previewImage(event) {
            const reader = new FileReader();
            reader.onload = function() {
                const output = document.getElementById('profilePhoto');
                output.src = reader.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    </script>
</body>
</html>
