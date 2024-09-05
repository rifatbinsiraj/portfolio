<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set the correct headers for CORS and POST requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize form inputs
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);

    // Validate input fields
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please fill in all fields and provide a valid email.";
        exit;
    }

    // Replace this with your email address
    $recipient = "rifatbin.siraj024@gmail.com"; 

    // Set the email subject
    $subject = "New Contact from $name";

    // Build the email content
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";

    // Build the email headers
    $email_headers = "From: $name <$email>";

    // Attempt to send the email
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo "Thank you! Your message has been sent.";
    } else {
        http_response_code(500);
        echo "Oops! Something went wrong, and we couldn't send your message.";
    }
} else {
    http_response_code(403);
    echo "There was a problem with your submission. Please try again.";
}
