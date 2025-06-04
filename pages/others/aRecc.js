let toggleButtonImg;

setTheme();


function setTheme() {
    const currentTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);
    toggleButtonImg = document.getElementById("theme-toggle");
    toggleButtonImg.src = "../../assets/" + currentTheme + "_mode.svg";
  }




function toggleTheme() {
    const currentTheme = localStorage.getItem("theme") || "dark";
  
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    toggleButtonImg.src = "../../assets/" + newTheme + "_mode.svg";
  
    localStorage.setItem("theme", newTheme);
  }