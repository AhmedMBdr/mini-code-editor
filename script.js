const iframe = document.querySelector(".preview");
const textarea = document.querySelector(".editor");
const toolbar = document.querySelector(".toolbar");
const htmlButton = document.querySelector(".html-button");
const cssButton = document.querySelector(".css-button");
const jsButton = document.querySelector(".js-button");
const setting = document.querySelector(".settings");
const settingsButton = document.querySelector(".setting");
const settingsMenu = document.createElement("div");
const circle = document.querySelector(".circle");
const sun = document.querySelector(".sun");
const moon = document.querySelector(".moon");
const body = document.body;
const dark = ["black", "rgb(30, 30, 30)", "rgb(70, 70, 70)", "rgb(50, 50, 50)"];
const light = ["white","rgb(240, 240, 240)", "rgb(220, 220, 220)", "rgb(200, 200, 200)"];
const theme = [dark, light];
const toggleTheme = document.querySelector(".rectangle");
let prefersDark = localStorage.getItem("theme") === "dark";
let inputColor = prefersDark ? "white" : "black";
let inputBackgroundColor = prefersDark ? "white" : "black";
let activeFile = "html";
document.documentElement.style.transition = "background-color 0.3s, color 0.3s";
function applyTheme() {
	const currentTheme = prefersDark ? 0 : 1;
	document.documentElement.style.setProperty("--primary", theme[currentTheme][1]);
	document.documentElement.style.setProperty("--secondary", theme[currentTheme][2]);
	document.documentElement.style.setProperty("--third", theme[currentTheme][3]);
	document.documentElement.style.setProperty("--text", prefersDark ? "white" : "black");

}
window.onload = () => {
	htmlButton.style.backgroundColor = theme[prefersDark ? 0 : 1][1] ;
    activeFile = "html";
};

settingsMenu.classList.add("settings-menu");
settingsMenu.innerHTML = `
<div class="setting-item">
	<label for="tab-size">Tab Size:</label>
	<input type="number" id="tab-size" min="1" value="4">
</div>
`;
let tabSize = 4;
const tabSizeInput = settingsMenu.querySelector("#tab-size");
tabSizeInput.addEventListener("change", () => {
    tabSize = parseInt(tabSizeInput.value);
    console.log(`Tab size set to ${tabSize}`);
});
const files = {
    html: ``,
    css: ``,
    js: ``,
};
settingsButton.addEventListener("click", () => {
    if (settingsMenu.style.display === "block") {
        settingsMenu.style.display = "none";
    } else {
        settingsMenu.style.display = "block";
    }
	settingsButton.classList.toggle("active");
});
setting.appendChild(settingsMenu);
textarea.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
        e.preventDefault();

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        textarea.value =
            textarea.value.substring(0, start) +
            " ".repeat(tabSize) +
            textarea.value.substring(end);

        textarea.selectionStart = textarea.selectionEnd = start + tabSize;
    }
});



htmlButton.addEventListener("click", () => {
    activeFile = "html";
    textarea.value = files.html;
    htmlButton.style.backgroundColor = theme[prefersDark ? 0 : 1][0];
    cssButton.style.backgroundColor = "transparent";
    jsButton.style.backgroundColor = "transparent";
});
cssButton.addEventListener("click", () => {
    activeFile = "css";

    textarea.value = files.css;
    cssButton.style.backgroundColor = theme[prefersDark ? 0 : 1][0];
    htmlButton.style.backgroundColor = "transparent";
    jsButton.style.backgroundColor = "transparent";
});
jsButton.addEventListener("click", () => {
    activeFile = "js";
    textarea.value = files.js;
    jsButton.style.backgroundColor = theme[prefersDark ? 0 : 1][0];
    htmlButton.style.backgroundColor = "transparent";
    cssButton.style.backgroundColor = "transparent";
});
textarea.addEventListener("input", () => {
    files[activeFile] = textarea.value;
    iframe.srcdoc = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style>${files.css}</style>
</head>

<body>
    <main>
        ${files.html}
    </main>
	<script>${files.js}</script>
</body>

</html>`;
});
toggleTheme.addEventListener("click", () => {
	toggleTheme.classList.toggle("active");
	circle.classList.toggle("active");
	sun.classList.toggle("active");
	moon.classList.toggle("active");
	prefersDark = !prefersDark;
	applyTheme();
	activeFile === "html" ? htmlButton.style.backgroundColor = theme[prefersDark ? 0 : 1][0] : activeFile === "css" ? cssButton.style.backgroundColor = theme[prefersDark ? 0 : 1][0] : jsButton.style.backgroundColor = theme[prefersDark ? 0 : 1][0];
});