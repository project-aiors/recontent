let userBoxVisible = false;
let toggleButtonImg;

setTheme();

// Add event listener to close the user-box when clicking outside
document.addEventListener("click", (event) => {
  const userBox = document.getElementById("user-box");
  const hamburger = document.getElementById("header-menu");

  // If the user clicks outside of userBox and hamburger
  if (
    userBoxVisible &&
    !userBox.contains(event.target) &&
    !hamburger.contains(event.target)
  ) {
    userBox.classList.add("hideUserBox");
    userBoxVisible = false;
  }
});


function showAndHideUserBox() {
  const userBox = document.getElementById("user-box");
  if (userBoxVisible) {
    userBox.classList.add("hideUserBox");
    userBoxVisible = false;
  } else {
    userBox.classList.remove("hideUserBox");
    userBoxVisible = true;
  }
}


function setTheme() {
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  toggleButtonImg = document.getElementById("theme-toggle");
  toggleButtonImg.src = "../../../assets/" + currentTheme + "_mode.svg";
}

function toggleTheme() {
  const currentTheme = localStorage.getItem("theme") || "dark";

  const newTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  toggleButtonImg.src = "../../../assets/" + newTheme + "_mode.svg";

  localStorage.setItem("theme", newTheme);
}

// function initializeFavoritesList() {
function updateFavoritesList() {
  const favoriteList = document.getElementById("favorite-list");
  const favorites = JSON.parse(localStorage.getItem('fav_books')) || [];
  
  if (favorites.length === 0) {
    favoriteList.innerHTML = '<p>Empty!</p>';
    return;
  }

  let favoritesHTML = '';
  favorites.forEach((content, index) => {
    favoritesHTML += `
      <div class="favorite-item" data-index="${index}">
        <img src="${content.coverImg ? content.coverImg : '../../../assets/book.svg'}" ${!content.coverImg  ? 'style="filter: var(--invert);"' : ''}>

        <div class="favorite-details">
          <div class="favorite-title">${content[1]}</div>
          <div class="favorite-year">${content[3]}</div>
        </div>
        <button class="delete-favorite" data-index="${index}">×</button>
      </div>
    `;
  });
  favoriteList.innerHTML = favoritesHTML;

  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-favorite').forEach(button => {
    button.addEventListener('click', deleteFavorite);
  });

  // Add event listeners to favorite items
  document.querySelectorAll('.favorite-item').forEach(item => {
    item.addEventListener('click', openFavoriteResult);
  });

}

function deleteFavorite(event) {
  event.stopPropagation();
  const index = event.target.dataset.index;
  const favorites = JSON.parse(localStorage.getItem('fav_books')) || [];
  
  favorites.splice(index, 1);
  localStorage.setItem('fav_books', JSON.stringify(favorites));
  
  updateFavoritesList();
}


function openFavoriteResult(event) {
  const index = event.currentTarget.dataset.index;
  const favorites = JSON.parse(localStorage.getItem('fav_books')) || [];
  const selectedContent = favorites[index];

  // Store the selected content in localStorage
  localStorage.setItem('chosenContent', JSON.stringify(selectedContent));

  // Navigate to the result page
  // window.location.href = 'result.html';
  if (window.location.pathname.includes('/pages/books/result/')) {
    window.location.href = 'result.html';
  } else {
    window.location.href = '../result/result.html';
  }
  
}
