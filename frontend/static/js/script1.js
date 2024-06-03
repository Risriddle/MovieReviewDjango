
// Add event listener to the movie form
document.getElementById('movie-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent form submission
    var movieName = document.getElementById('movie-name').value;
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    fetchMovieDetails(movieName);
});

function fetchMovieDetails(movieName) {
    fetch('/app/success/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({'title': movieName})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch movie details');
        }
        return response.json();
    })
    .then(data => {
        /*console.log(data)
        console.log(data.movies)
        console.log(data.Revdata)*/
        updateMovieDetails(data.movies,data.Revdata);
    })
    .catch(error => {
        console.error('Error fetching movie details:', error);
        displayErrorMessage('Failed to fetch movie details');
    });
}

// Other functions remain the same

function updateMovieDetails(movieData,RevData) {
    var movieDetailsDiv = document.getElementById('movie-details');
    movieDetailsDiv.innerHTML = '';  // Clear previous content

    // Check if movieData.movies is an object
    if (movieData && typeof movieData.movies === 'object') {
        var movie = movieData.movies;
        var movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        const reviewsDiv = document.getElementById('reviews');
        RevData.forEach(review => {
          reviewsDiv.innerHTML += `<p>${review.user__username}: ${review.review_text}, Rating: ${review.rating}</p>`;
        });
        movieElement.innerHTML = `
            <h2>${movie.Title}</h2>
            <p>Year: ${movie.Year}</p>
            <p>Genre: ${movie.Genre}</p>
            <p>Plot: ${movie.Plot}</p>
            <p>Rating: ${movie.Rated}</p>
            <p>IMDB Rating: ${movie.imdbRating}</p>
            <p>Rotten Tomatoes Rating: ${getRatingBySource(movie, 'Rotten Tomatoes')}</p>
            <img src="${movie.Poster}" alt="${movie.Title} Poster">
            <div id="rev">
            <h3>Write Your Review</h3>
            <textarea id="user-review" placeholder="Write your review here"></textarea>
            <label for="rating">Rating:</label>
            <input type="number" id="rating" name="rating" min="1" max="10" placeholder="Enter rating (1-10)">
            <button onclick="submitUserReview('${movie.Title}')">Submit Review</button>
        </div> 
            <hr>
        `;
        movieDetailsDiv.appendChild(movieElement);
    } else {
        displayErrorMessage('No movies found');
    }
}

function getRatingBySource(movie, source) {
    // Check if the movie object contains ratings
    if (movie && Array.isArray(movie.Ratings)) {
        // Find the rating object with the specified source
        var rating = movie.Ratings.find(r => r.Source === source);
        // Return the rating value if found, or a default message otherwise
        return rating ? rating.Value : 'Not available';
    } else {
        return 'Not available';
    }
}

function displayErrorMessage(message) {
    var errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = message;
}

function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}
function submitUserReview(movieTitle) {
    // Get the review text and rating from the input fields
    var reviewText = document.getElementById('user-review').value;
    var rating = document.getElementById('rating').value;

    // Create a new div element to display the user's review
    var userReviewDiv = document.createElement('div');
    userReviewDiv.classList.add('user-review');
    userReviewDiv.innerHTML = `
        <h3>User Review</h3>
        <p><strong>Movie: ${movieTitle}</strong></p>
        <p>Review: ${reviewText}</p>
        <p>Rating: ${rating}</p>
    `;

    // Append the user review div to the movie details section
    var movieDetailsDiv = document.getElementById('movie-details');
    movieDetailsDiv.appendChild(userReviewDiv);

     // Hide the review text and rating input fields
     document.getElementById('rev').style.display = 'none';
     
    console.log(movieTitle,"-----------------")

    
        // Create a JSON object with review data
        var reviewData = {
            'movie_title': movieTitle,
            'review_text': reviewText,
            'rating': rating
        };
        var token=localStorage.getItem('token');
        console.log(token)
        // Make a POST request to save the review
        fetch('/app/save_review/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `BEARER ${token}`,
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(reviewData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save review');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);  // Log the response from the server
            // Handle the response as needed
        })
        .catch(error => {
            console.error('Error saving review:', error);
            // Handle the error
        });
    }
    