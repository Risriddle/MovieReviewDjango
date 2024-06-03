document.addEventListener("DOMContentLoaded", function() {
    // Get the login form
    const loginForm = document.querySelector("form");

    // Add submit event listener to the form
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the form data
        const formData = new FormData(loginForm);

        // Send a POST request to the login endpoint
        fetch("/app/login/", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Check if the response contains a token
            if (data.token) {
                // Store the token in local storage
                console.log(data.token)
                localStorage.setItem("token", data.token);

                // Redirect to the success page or perform other actions
                window.location.href = "/app/success/";
            } else {
                // Handle login failure
                alert("Login failed. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            // Handle error
            alert("An error occurred. Please try again later.");
        });
    });
});
