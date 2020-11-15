// image for when poster art is missing
const MISSING_IMAGE_URL = "img/placeholder.jpg";

// axios get request to movie db, passes in movie title as search query and returns movie data array:
async function searchMovies(query) {
	const res = await axios.get(
		`
        https://api.themoviedb.org/3/search/movie?api_key=9bed434e2b689b31a492cb53c902ce31&language=en-US&query=${query}&page=1&include_adult=false`
	);
	const movieData = [
		{
			id: res.data.results[0].id,
			title: res.data.results[0].title,
			overview: res.data.results[0].overview,
			avg: res.data.results[0].vote_average,
			poster: res.data.results[0].poster_path
				? res.data.results[0].poster_path
				: MISSING_IMAGE_URL,
		},
	];
	return movieData;
}

// creates bootstrap cards dynamically and applies data from movieData object, appends them to moviesList div:
function populateMovies(movies) {
	const $moviesList = $("#movies-list");
	for (let movie of movies) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Movie text-dark" data-show-id="${movie.id}">
            <div class="card m-2" data-movie-id="${movie.id}">
           <div class="card-body">
             <h4 class="card-title">${movie.title}</h5>
             <img src="https://image.tmdb.org/t/p/w500/${movie.poster}" class="card-img-top"></img>
             <p class="card-text">${movie.overview}</p>
             <h5 class="font-weight-bold mb-1">Ratings:</h6>
             <h6 class="mb-1 average-score">Average User Score: ${movie.avg}</h6>
             <h6 class="mb-3 user-score">Your Score: ${movie.userScore}</h6>
             <button type="button" id="remove-btn" class="btn btn-danger">Remove Movie</button>
           </div>
         </div>
       </div>
      `
		);
		$moviesList.append($item);
	}
}

// text search box event listener on submit, prevents default, prevents empty query or less than 2 characters, prevents empty rating or less than 0 or greater than 10, saves api data to variable and passes it into the populateMovies function:
$("#movie-form").on("submit", async function handleSearch(evt) {
	evt.preventDefault();

	let query = $("#movie-query").val();
	if (!query || query.length < 2) return;
	let rating = $("#movie-rating").val();
	if (!rating || rating < 0 || rating > 10) return;
	let movies = await searchMovies(query);
	movies[0].userScore = rating;
	populateMovies(movies);
});

// remove button event listener, targets class of Movie which is the parent element for the card for each movie, removes on click:
$("#movies-list").on("click", "#remove-btn", async function removeMovie(e) {
	e.preventDefault();
	let $movieId = $(e.target).closest(".Movie");
	$movieId.remove();
});

// Sorts cards alphabetically:
$("#sort-title").on("click", function (e) {
	e.preventDefault();
	let $moviesList = $("#movies-list");
	$moviesList.append(
		$(".Movie").sort(function (a, b) {
			var at = $(a).text(),
				bt = $(b).text();
			return at > bt ? 1 : at < bt ? -1 : 0;
		})
	);
});

// Attempts at sorting by user score and average score:

// $("sort-user").on("click", function (e) {
// 	e.preventDefault();
// 	let $moviesList = $("#movies-list");
// 	$moviesList.append(
// 		$(".user-score").sort(function (a, b) {
// 			var at = $(a).text(),
// 				bt = $(b).text();
// 			return at > bt ? 1 : at < bt ? -1 : 0;
// 		})
// 	);
// });

// $("#sort-average").on("click", function (e) {
// 	e.preventDefault();
// 	let $moviesList = $("#movies-list");
// 	var movieArr = $moviesList.children("h6").toArray();
// 	console.log(movieArr);
// 	movieArr.sort(function (a, b) {
// 		var textA = +$(a).find(".average-score").text();
// 		var textB = +$(b).find(".average-score").text();

// 		if (textA < textB) return 1;
// 		if (textA > textB) return -1;

// 		return 0;
// 	});

// 	console.log(movieArr);
// 	// $.each(movieArr, function () {
// 	// 	cont.append(this);
// 	// });
// });
