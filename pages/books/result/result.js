const chosenContentWrap = document.getElementById('chosen-content-wrap');
const recommendationsWrap = document.getElementById('recommendations-wrap');

let dataCSV;


function getYtApiKey() {
  const key = config.ytApiKey[Math.floor(Math.random() * config.ytApiKey.length)];
  return key.slice(0, 1) + key.slice(2, -1);
}


function afterCsvLoaded() {
  const chosenContent = JSON.parse(localStorage.getItem('chosenContent'));

  if (chosenContent) {
    displayContentDetails(chosenContent);
    updateFavoritesList();
  } else {
    chosenContentWrap.innerHTML = '<p style="margin:auto;">No content selected. Please go back to the search page.</p>';
  }
};

function displayContentDetails(content) {
  // Create the movie details HTML with placeholder content
  // const book = dataCSV.find(m => m.bookId === content[0]);
  const book = dataCSV.find(m => String(m.bookId) == String(content[0]));


  // Helper function to safely parse arrays
  function parseArray(data) {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        // Convert single quotes to double quotes if needed
        const fixed = data.replace(/'/g, '"');
        const parsed = JSON.parse(fixed);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  // Safely parse genres and awards
  const genres = parseArray(book.genres);
  const awards = parseArray(book.awards);

  // Now build the HTML
//   const detailsHTML = `
//   <div class="chosen-content-poster">
//       <img src="${book.coverImg ? book.coverImg : '../../../assets/book.svg'}" ${!book.coverImg ? 'style="filter: var(--invert);"' : ''}>
//       <button id="add-to-favorites" class="fav-button clickable">Add to Favorites</button>
//   </div>
//   <div class="chosen-content-info">
//     <h1>${content[1]}</h1>
//     <p><b>Language:</b> ${content[2] || '<i>Info unavailable</i>'}</p>
//     <p><b>Author:</b> ${book.author || '<i>Info unavailable</i>'}</p>
//     <p><b>Publish Date:</b> ${book.publishDate || '<i>Info unavailable</i>'}</p>
//     <p><b>Genres:</b> ${genres.length ? genres.join(', ') : '<i>Info unavailable</i>'}</p>
//     <p><b>Rating:</b> ${book.rating || '<i>Info unavailable</i>'}</p>
//     <p><b>Awards:</b> ${awards.length ? awards.join(', ') : '<i>Info unavailable</i>'}</p>
//     <p><b>Pages:</b> ${book.pages || '<i>Info unavailable</i>'}</p>
//     <p><b>Description:</b> ${book.description || '<i>Info unavailable</i>'}</p>
//   </div>
// `;
let detailsHTML = `
  <div class="chosen-content-poster">
    <img src="${book.coverImg ? book.coverImg : '../../../assets/book.svg'}" ${!book.coverImg ? 'style="filter: var(--invert);"' : ''}>
    <button id="add-to-favorites" class="fav-button clickable">Add to Favorites</button>
  </div>
  <div class="chosen-content-info">
    <h1>${content[1]}</h1>
`;

if (content[2]) detailsHTML += `<p><b>Language:</b> ${content[2]}</p>`;
if (book.author) detailsHTML += `<p><b>Author:</b> ${book.author}</p>`;
if (book.publishDate) detailsHTML += `<p><b>Publish Date:</b> ${book.publishDate}</p>`;
if (genres.length) detailsHTML += `<p><b>Genres:</b> ${genres.join(', ')}</p>`;
if (book.rating) detailsHTML += `<p><b>Rating:</b> ${book.rating}</p>`;
if (awards.length) detailsHTML += `<p><b>Awards:</b> ${awards.join(', ')}</p>`;
if (book.pages) detailsHTML += `<p><b>Pages:</b> ${book.pages}</p>`;
if (book.description) detailsHTML += `<p><b>Description:</b> ${book.description}</p>`;

detailsHTML += `</div>`;




  chosenContentWrap.innerHTML = detailsHTML;

  const posterImg = chosenContentWrap.querySelector('.chosen-content-poster img');
  const additionalInfo = document.getElementById('additional-info');

  const addToFavoritesBtn = document.getElementById('add-to-favorites');

  // Check if the content is already in favorites
  // const isAlreadyFavorite = JSON.parse(localStorage.getItem('fav_movies'))?.some(fav => fav[0] === content[0]);

  // Add click event listener to the "Add to Favorites" button
  checkAndUpdateFavorites(content, addToFavoritesBtn);
  addToFavoritesBtn.addEventListener('click', (event) => addToFavorites(content, addToFavoritesBtn, event));


  // Fetch recommendations immediately
  // getRecommendations(content[1]); //sending book title to backend
  // getRecommendations(genres? genres : content[1]); //sending book title to backend
  getRecommendations(Array.isArray(genres) ? genres.join(', ') : content[1]);

}




// Modify this function to handle adding content to favorites
function addToFavorites(content, button, event) {
  event.stopPropagation();
  let favorites = JSON.parse(localStorage.getItem('fav_books')) || [];

  const isAlreadyFavorite = favorites.some(fav => fav[0] === content[0]);

  if (!isAlreadyFavorite) {
    favorites.push(content);
    localStorage.setItem('fav_books', JSON.stringify(favorites));
    button.textContent = 'Added to Favorites';
    button.classList.add('fav-button-added');
  } else {
    favorites = favorites.filter(fav => fav[0] !== content[0]);
    localStorage.setItem('fav_books', JSON.stringify(favorites));
    button.textContent = 'Add to Favorites';
    button.classList.remove('fav-button-added');
  }

  // Update the favorites list in the user box
  updateFavoritesList();
}

function checkAndUpdateFavorites(content, button) {
  const favorites = JSON.parse(localStorage.getItem('fav_books')) || [];
  const isAlreadyFavorite = favorites.some(fav => fav[0] === content[0]);
  button.textContent = isAlreadyFavorite ? 'Added to Favorites' : 'Add to Favorites';
  button.classList.toggle('fav-button-added', isAlreadyFavorite);
}


function deleteFavorite(event) {
  console.log('deleteFavorite')
  event.stopPropagation();
  const index = event.target.dataset.index;
  const favorites = JSON.parse(localStorage.getItem('fav_books')) || [];
  const chosenContent = JSON.parse(localStorage.getItem('chosenContent')) || [];

  console.log('>>>', favorites[index], chosenContent)
  if (favorites[index][0] === chosenContent[0]) {
    const btn = document.getElementById('add-to-favorites');
    btn.textContent = 'Add to Favorites';
    btn.classList.remove('fav-button-added');
  }
  favorites.splice(index, 1);
  localStorage.setItem('fav_books', JSON.stringify(favorites));

  updateFavoritesList(); // Refresh the favorites list
}


// async function getRecommendations(bookTitle) {
//   recommendationsWrap.innerHTML = '<h4 style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; grid-column: 1 / -1;">Loading...</h4>';
//   try {
//     const response = await fetch(config.backendBooks, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ query: bookTitle }), //'query' is expected in backend
//       // body: JSON.stringify({ query: "bengoli" }),

//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log('data ', data)
//     // const recommendedIds = data.recommended_movie_ids;
//     const recommendedIds = data.results;
//     console.log('recommendedIds ', recommendedIds)

//     // displayRecommendations(recommendedIds);
//     // displayRecommendations(recommendedIds); //any of recommendedIds.bookId !== chosenContent.bookId
//     const chosenContent = JSON.parse(localStorage.getItem('chosenContent'));
//     const filteredRecommendations = recommendedIds
//       .filter(item => item.bookId !== chosenContent[0])
//       .slice(0, 14);

//     displayRecommendations(filteredRecommendations);



//     return recommendedIds;
//   } catch (error) {
//     console.error('Error:', error);
//     throw error;
//   }
// }



// async function getRecommendations(bookTitle) {
//   recommendationsWrap.innerHTML = '<h4 style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; grid-column: 1 / -1;">Loading...</h4>';

//   try {
//     const chosenContent = JSON.parse(localStorage.getItem('chosenContent'));
//     const chosenBook = dataCSV.find(book => book.bookId === chosenContent[0]);

//     if (!chosenBook) {
//       console.error('Chosen book not found in CSV');
//       displayRecommendations([]);
//       return;
//     }

//     const titleLower = String(chosenBook.title || "").toLowerCase();
//     const chosenGenres = String(chosenBook.genres || "")
//       .split(',')
//       .map(g => g.trim().toLowerCase())
//       .filter(g => g.length > 0);

//     const scoredBooks = dataCSV
//       .filter(book => book.bookId !== chosenBook.bookId)
//       .map(book => {
//         const bookTitle = String(book.title || "").toLowerCase();
//         const bookGenres = String(book.genres || "")
//           .split(',')
//           .map(g => g.trim().toLowerCase())
//           .filter(g => g.length > 0);

//         let score = 0;

//         // Genre match score
//         bookGenres.forEach(g => {
//           if (chosenGenres.includes(g)) score++;
//         });

//         // Title similarity score
//         if (bookTitle.includes(titleLower) || titleLower.includes(bookTitle)) {
//           score++;
//         }

//         return { ...book, _score: score };
//       })
//       .filter(book => book._score > 0)
//       .sort((a, b) => b._score - a._score)
//       .slice(0, 14);

//     displayRecommendations(scoredBooks);
//     return scoredBooks;

//   } catch (error) {
//     console.error('Error:', error);
//     displayRecommendations([]);
//     return [];
//   }
// }

function shuffleArray(arr) {
  return arr.map(v => ({ v, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ v }) => v);
}

async function getRecommendations(bookTitle) {
  recommendationsWrap.innerHTML = '<h4 style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; grid-column: 1 / -1;">Loading...</h4>';

  try {
    const chosenContent = JSON.parse(localStorage.getItem('chosenContent'));
    const chosenBook = dataCSV.find(book => book.bookId === chosenContent[0]);

    if (!chosenBook) {
      console.error('Chosen book not found in CSV');
      displayRecommendations([]);
      return;
    }

    const titleLower = String(chosenBook.title || "").toLowerCase();
    const chosenGenres = String(chosenBook.genres || "")
      .split(',')
      .map(g => g.trim().toLowerCase())
      .filter(g => g.length > 0);

    let scoredBooks = dataCSV
      .filter(book => book.bookId !== chosenBook.bookId)
      .map(book => {
        const bookTitle = String(book.title || "").toLowerCase();
        const bookGenres = String(book.genres || "")
          .split(',')
          .map(g => g.trim().toLowerCase())
          .filter(g => g.length > 0);

        let score = 0;

        bookGenres.forEach(g => {
          if (chosenGenres.includes(g)) {
            score += 1;
            if (Math.random() < 0.2) score += 1; // random bonus
          }
        });

        if (bookTitle.includes(titleLower) || titleLower.includes(bookTitle)) {
          score += 1;
        }

        return { ...book, _score: score };
      })
      .filter(book => book._score > 0)
      .sort((a, b) => b._score - a._score);

    const finalRecs = shuffleArray(scoredBooks.slice(0, 20)).slice(0, 14);

    // ⏱ 3 sec delay
    setTimeout(() => {
      displayRecommendations(finalRecs);
    }, 3000);

    return finalRecs;

  } catch (error) {
    console.error('Error:', error);
    displayRecommendations([]);
    return [];
  }
}





function displayRecommendations(recommended_books) {
  recommendationsWrap.innerHTML = "";

  if (recommended_books.length === 0) {
    const noResultsMsg = document.createElement("div");
    noResultsMsg.className = "no-results-message";
    noResultsMsg.textContent = 'No recommendations found';
    recommendationsWrap.appendChild(noResultsMsg);
    return;
  }

  recommended_books.forEach((item) => {
    const recommendedCard = document.createElement("div");
    recommendedCard.className = "recommended-card";

    // Create an image element for the movie poster
    const posterImg = document.createElement("img");
    // posterImg.className = "searched-results-poster loading";
    posterImg.className = "recommended-poster";

    // posterImg.src = "../../../assets/movie.svg"; // Set default image


    const detailsDiv = document.createElement("div");

    const book = dataCSV.find(m => m.bookId === item.bookId);
    detailsDiv.textContent = book.publishDate + " | " + book.language;
    detailsDiv.style.fontSize = "0.8em";
    // posterImg.src = "../../../assets/movie.svg";
    posterImg.src = book.coverImg ? book.coverImg : "../../../assets/movie.svg";
    posterImg.style.filter = !book.coverImg ? "var(--invert)" : "";

    // Create a text container for title and IMDB ID
    const textContainer = document.createElement("div");
    textContainer.className = "searched-results-text";
    textContainer.textContent = book.title;
    textContainer.appendChild(detailsDiv);

    // Append poster and text to the result item
    recommendedCard.appendChild(posterImg);
    recommendedCard.appendChild(textContainer);

    recommendationsWrap.appendChild(recommendedCard);

    // Add click event listener to each searched-results div
    recommendedCard.addEventListener('click', () => {
      // Store the clicked movie data in localStorage
      localStorage.setItem('chosenContent', JSON.stringify([book.bookId, book.title, book.language, book.release_date, book.coverImg]));
      // Navigate to the result page
      window.location.href = 'result.html';
    });
  });
}




fetch("../search/books.csv")
  .then((response) => response.text())
  .then((csvText) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      complete: function (results) {
        console.log("csv fetch complete");
        dataCSV = results.data; // Parsed CSV data
        afterCsvLoaded()
      },
    });
  })
  .catch((error) => console.error("Error loading CSV:", error));
