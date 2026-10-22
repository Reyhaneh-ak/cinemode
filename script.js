const startButton = document.getElementById("start-intro");
const welcomeScreen = document.getElementById("welcome-screen");
const siteContent = document.querySelector(".site-content");

startButton.addEventListener("click", () => {
    welcomeScreen.style.transition = "opacity 1s ease";
    welcomeScreen.style.opacity = "0";
    welcomeScreen.style.pointerEvents = "none";

    setTimeout(() => {
        welcomeScreen.style.display = "none";
        siteContent.classList.add("show-site");
    }, 1000);
});

async function loadMovies() {
    const results = document.getElementById("movie-results");
    const searchInput = document.getElementById("movie-search");
    const genreFilter = document.getElementById("genre-filter");
    const buttons = document.querySelectorAll(".mood-buttons button");

    try {
        const response = await fetch("movies_sample.json");
        if (!response.ok) throw new Error("Dataset not found");

        const movies = await response.json();
        
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

function showFavorites() {
    const box = document.getElementById("favorite-results");
    box.innerHTML = "";

    movies.filter(movie => favorites.includes(movie.id)).forEach(movie => {
        const item = document.createElement("p");
        item.textContent = movie.title_fa + " ";

        const remove = document.createElement("button");
        remove.textContent = "حذف ❌";
        remove.onclick = () => {
            favorites = favorites.filter(id => id !== movie.id);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            showFavorites();
            showMovies();
        };

        item.appendChild(remove);
        box.appendChild(item);
    });
}

        let selectedMood = "";

        function showMovies() {
            const query = searchInput.value.trim().toLowerCase();
            const genre = genreFilter.value;
            const sortFilter = document.getElementById("sort-filter");
            const sortValue = sortFilter.value;


            const filtered = movies.filter(movie =>
                (!selectedMood || movie.moods.includes(selectedMood)) &&
                (!genre || movie.genres.includes(genre)) &&
                (
                    movie.title.toLowerCase().includes(query) ||
                    movie.title_fa.includes(query)
                )
            );
        
          
            if (sortValue === "rating-desc") {
                filtered.sort((a, b) => b.rating - a.rating);
            } else if (sortValue === "year-desc") {
                filtered.sort((a, b) => b.year - a.year);
            }

            
            results.innerHTML = "";
            

            filtered.forEach(movie => {
                const card = document.createElement("article");
                card.className = "movie-card";
                card.innerHTML = `
                  ${movie.poster
        ? `<img src="${movie.poster}" alt="پوستر ${movie.title_fa}" class="movie-poster">`
        : `<div class="poster-placeholder">🎬</div>`
       }
            <h3>${movie.title_fa}</h3>
            <p>${movie.title}</p>
            <p>سال ساخت: ${movie.year}</p>
            <p>ژانر: ${movie.genres.join("، ")}</p>
            <p>⭐ ${movie.rating}</p>
                `;
                
const favButton = document.createElement("button");
favButton.textContent = favorites.includes(movie.id)
    ? "❤️ حذف از علاقه‌مندی‌ها"
    : "🤍 افزودن به علاقه‌مندی‌ها";

favButton.onclick = () => {
    if (favorites.includes(movie.id)) {
        favorites = favorites.filter(id => id !== movie.id);
    } else {
        favorites.push(movie.id);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    showFavorites();
    showMovies();
};

card.appendChild(favButton);

                results.appendChild(card);
            });

            if (!filtered.length) {
                results.textContent = "فیلمی پیدا نشد!";
            }
        }

       
buttons.forEach(button => {
    button.addEventListener("click", () => {
        if (selectedMood === button.dataset.mood) {
            selectedMood = "";
            button.classList.remove("active");
        } else {
            selectedMood = button.dataset.mood;
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        }
        showMovies();
    });
});

searchInput.addEventListener("input", showMovies);
genreFilter.addEventListener("change", showMovies);
document.getElementById("sort-filter").addEventListener("change", showMovies);

showMovies();
showFavorites();
        

    } catch (error) {
        console.error(error);
        results.textContent = "خطا در بارگذاری دیتاست!";
    }
}

loadMovies();
