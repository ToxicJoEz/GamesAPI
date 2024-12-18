class GamesSection {
    constructor() {
        this.allGames = [];
    }

    // Method to fetch all games data
    async getGamesData() {
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '41807cb153mshb07817b02d129eap1037bcjsnec405af0ad0f',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }
        };

        const api = await fetch('https://free-to-play-games-database.p.rapidapi.com/api/games', options);
        const response = await api.json();

        this.allGames = response;  // Store the full list of games

        // Extract unique genres from the response
        const genres = [...new Set(response.map(game => game.genre.trim()))];

        // Update the navbar with categories dynamically
        const navbarList = document.querySelector('.navbar-nav');
        navbarList.innerHTML = '';  // Clear the current list

        // Add categories to navbar
        genres.forEach(genre => {
            const categoryItem = document.createElement('li');
            categoryItem.classList.add('nav-item');
            categoryItem.innerHTML = `<a class="nav-link" href="#">${genre}</a>`;
            navbarList.appendChild(categoryItem);
        });

        // Add event listeners to filter games by category
        document.querySelectorAll('.navbar-nav .nav-link').forEach(item => {
            item.addEventListener('click', event => {
                document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                    link.classList.remove('active', 'genre');
                });

                event.target.classList.add('active', 'genre');
                const selectedCategory = event.target.textContent.trim().toLowerCase();
                this.filterByCategory(selectedCategory);
            });
        });

        // Initially display all games
        this.displayGames(this.allGames);
    }

    // Method to display the list of games
    displayGames(games) {
        const cardContainer = document.querySelector('.card-grid .row');
        cardContainer.innerHTML = '';  // Clear any existing cards

        games.forEach(game => {
            const cardHTML = `
                <div class="col-lg-3 col-md-4 col-sm-6 mb-4" data-category="${game.genre}">
                    <div class="card" style="height:28rem;">
                        <img src="${game.thumbnail}" class="card-img-top" alt="${game.title} Thumbnail">
                        <div class="card-body">
                            <h5 class="card-title">${game.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${game.genre}</h6>
                            <p class="card-text">${game.short_description}</p>
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-primary" data-game-id="${game.id}" data-bs-toggle="modal" data-bs-target="#gameDetailsModal">More Details</button>
                            <p class="platform"><small class="text-muted">${game.platform}</small></p>
                        </div>
                    </div>
                </div>
            `;
            cardContainer.innerHTML += cardHTML;
        });

        // Add event listener to the "More Details" buttons
        document.querySelectorAll('.btn-primary[data-game-id]').forEach(button => {
            button.addEventListener('click', (event) => {
                const gameId = event.target.getAttribute('data-game-id');
                const gameDetails = new GameDetails(gameId);  // Create new GameDetails instance
                gameDetails.getGameDeets();  // Fetch and display game details
            });
        });
    }

    // Method to filter games by category
    filterByCategory(category) {
        const filteredGames = this.allGames.filter(game => game.genre.toLowerCase() === category);
        this.displayGames(filteredGames);
    }
}

// Create an instance of GamesSection and call getGamesData to start the process
const gamesSection = new GamesSection();
gamesSection.getGamesData();






// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------





class GameDetails {
    constructor(gameId) {
        this.gameId = gameId;
    }

    // Method to fetch and display game details
    async getGameDeets() {
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '41807cb153mshb07817b02d129eap1037bcjsnec405af0ad0f',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }
        };

        const api = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/game?id=${this.gameId}`, options);
        const gameDetails = await api.json();

        this.displayGameDetails(gameDetails);
    }

    // Method to display game details in the modal
    displayGameDetails(gameDetails) {
        const modalContent = document.querySelector('#gameDetailsContent');
        modalContent.innerHTML = `
            <div class="container p-4">
                <div class="row">
                    <div class="col-lg-4 col-md-12">
                        <h2>${gameDetails.title}</h2>
                        <img src="${gameDetails.thumbnail}" alt="${gameDetails.title}" class="img-fluid">

                        <br><br><br> <!--mkasl a3ml an actual solution for this badal el <br> wlahi ya sa7bi ana asf xD-->

                        <a href="${gameDetails.game_url}" target="_blank" class="btn btn-primary">Play Now !</a>
                    </div>

                    <div class="col-lg-8 col-md-12">
                        <p><strong>Description:</strong> ${gameDetails.description}</p>
                        <p><strong>Publisher:</strong> ${gameDetails.publisher}</p>
                        <p><strong>Developer:</strong> ${gameDetails.developer}</p>
                        <p><strong>Release Date:</strong> ${gameDetails.release_date}</p>
                        <h5>System Requirements:</h5>
                        <ul>
                            <li><strong>OS:</strong> ${gameDetails.minimum_system_requirements.os}</li>
                            <li><strong>Processor:</strong> ${gameDetails.minimum_system_requirements.processor}</li>
                            <li><strong>Memory:</strong> ${gameDetails.minimum_system_requirements.memory}</li>
                            <li><strong>Graphics:</strong> ${gameDetails.minimum_system_requirements.graphics}</li>
                            <li><strong>Storage:</strong> ${gameDetails.minimum_system_requirements.storage}</li>
                        </ul>
                        
                    </div>

                    
                </div>
            </div>
            
        `;
    }

    
}


