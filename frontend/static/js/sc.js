// Add event listener to the movie form
document.getElementById('movie-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent form submission
    var movieName = document.getElementById('movie-name').value;
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
        updateMovieDetails(data.movies, data.reviews);
    })
    .catch(error => {
        console.error('Error fetching movie details:', error);
        displayErrorMessage('Failed to fetch movie details');
    });
}

function updateMovieDetails(movieData,RevData) {
    var movieDetailsDiv = document.getElementById('movie-details');
    movieDetailsDiv.innerHTML = '';  // Clear previous content


    var reviewsDiv = document.getElementById('review-section');
    reviewsDiv.innerHTML = '';  // Clear previous content

//reviews 
console.log(RevData)
const heading = document.createElement('h2');
    heading.innerHTML='User Reviews'
reviewsDiv.appendChild(heading);
RevData.forEach(review => {
    
    const revElement = document.createElement('div');
    revElement.classList.add('review');
    revElement.innerHTML = `
        <p>Review Text: ${review.review_text}</p>
        <p>Username: ${review.user__username}</p>
        <p>Rating: ${review.rating}</p>
    `;
    
    reviewsDiv.appendChild(revElement);

});


    

    if (movieData && typeof movieData === 'object') {
        var movie = movieData;
        var movieElement = document.createElement('div');
        movieElement.classList.add('movie');
       

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
    if (movie && Array.isArray(movie.Ratings)) {
        var rating = movie.Ratings.find(r => r.Source === source);
        return rating ? rating.Value : 'Not available';
    } else {
        return 'Not available';
    }
}

function displayErrorMessage(message) {
    var errorMessageDiv = document.getElementById('error-message');
    if (errorMessageDiv) {
        errorMessageDiv.textContent = message;
    } else {
        console.error('Error message div not found');
    }
}

function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}

function submitUserReview(movieTitle) {
    var reviewText = document.getElementById('user-review').value;
    var rating = document.getElementById('rating').value;

    var userReviewDiv = document.createElement('div');
    userReviewDiv.classList.add('user-review');
    userReviewDiv.innerHTML = `
        <h3>User Review</h3>
        <p><strong>Movie: ${movieTitle}</strong></p>
        <p>Review: ${reviewText}</p>
        <p>Rating: ${rating}</p>
    `;

    var reviewSection = document.getElementById('review-section');
    reviewSection.appendChild(userReviewDiv);

    // Clear the form after submission
    document.getElementById('user-review').value = '';
    document.getElementById('rating').value = '';
    
    var reviewData = {
        'movie_title': movieTitle,
        'review_text': reviewText,
        'rating': rating
    };
    var token = localStorage.getItem('token');

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
        console.log(data);
    })
    .catch(error => {
        console.error('Error saving review:', error);
    });
}
