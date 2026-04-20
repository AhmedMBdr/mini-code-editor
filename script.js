const textarea = document.querySelector(".editor");
const toolbar = document.querySelector(".toolbar");
const toolbarButtons = toolbar.querySelectorAll("div");
const setting = document.querySelector(".settings");
const settingsButton = document.querySelector(".setting");
const settingsMenu = document.querySelector(".settings-menu");
const runButton = document.querySelector(".run");
const dark = ["black", "rgb(30, 30, 30)", "rgb(70, 70, 70)", "rgb(50, 50, 50)"];
const light = ["white","rgb(240, 240, 240)", "rgb(220, 220, 220)", "rgb(200, 200, 200)"];
const code = document.querySelector(".highlight code");
const theme = 
{light : light,
dark : dark,
};
const map = {
    light : "dark",
    dark : "light",
};
const codeColor = {
  html: {
    elements: "rgb(99,209,109)",
    text: {
      light: "black",
      dark: "white",
    },
  },
  css: {
    elements: "tomato",
    text: {
      light: "rgb(61,147,213)",
      dark: "rgb(61,147,213)",
    },
  },
  js: {
    elements: "tomato",
    text: {
      light: "rgb(61,147,213)",
      dark: "rgb(61,147,213)",
    },
  },
};
const codeColors = {
    light : {
        background : "white",
        color : "black",
    },
    dark : {
        background : "rgb(39, 40, 34)",
        color : "white",
    }
}
const toggleTheme = document.querySelector(".rectangle");
let prefersDark = localStorage.getItem("theme") || "light";
let activeFile = "html";

function applyTheme() {

	document.documentElement.style.setProperty("--primary", theme[prefersDark][1]);
	document.documentElement.style.setProperty("--secondary", theme[prefersDark][2]);
	document.documentElement.style.setProperty("--third", theme[prefersDark][3]);
	document.documentElement.style.setProperty("--text", theme[map[prefersDark]][0]);
    document.documentElement.style.setProperty("--code", codeColors[prefersDark]["background"]);
    document.documentElement.style.setProperty("--codeText", codeColors[prefersDark]["color"]);
    colorSelectedButton();
}
const fileTextarea = localStorage.getItem("textarea")
  ? JSON.parse(localStorage.getItem("textarea"))
  : {
      html: ``,
      css: ``,
      js: ``,
    };
const fileCode = localStorage.getItem("code")
  ? JSON.parse(localStorage.getItem("code"))
  : {
      html: ``,
      css: ``,
      js: ``,
    };
window.onload = () => {
    const htmlButton = toolbar.querySelector(".html-button");
	htmlButton.style.backgroundColor = theme[prefersDark][0] ;
    activeFile = "html";
    if(prefersDark === "dark"){
        const circle = document.querySelector(".circle");
        const sun = document.querySelector(".sun");
        const moon = document.querySelector(".moon");
        toggleTheme.classList.add("active");
        circle.classList.add("active");
        sun.classList.add("active");
        moon.classList.add("active");
        applyTheme();
    }
    textarea.value = fileTextarea[activeFile]
    code.innerHTML = fileCode[activeFile];
};
let tabSize = 4;
const tabSizeInput = settingsMenu.querySelector("#tab-size");
tabSizeInput.addEventListener("change", () => {
    tabSize = parseInt(tabSizeInput.value);
    console.log(`Tab size set to ${tabSize}`);
});

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
function colorSelectedButton() {
    toolbarButtons.forEach(button => {
        if (button.classList.contains(`${activeFile}-button`)) {
            button.style.backgroundColor = theme[prefersDark][0];
        } else {
            button.style.backgroundColor = "transparent";
        }
    });
}
toolbarButtons.forEach(child => {
    child.addEventListener("click", () => {
        child.style.backgroundColor = theme[prefersDark][0];
        activeFile = child.classList.contains("html-button") ? "html" : child.classList.contains("css-button") ? "css" : "js";
        textarea.value = fileTextarea[activeFile];
        code.innerHTML = fileCode[activeFile];
        toolbarButtons.forEach(sibling => {
            if (sibling !== child) {
                sibling.style.backgroundColor = "transparent";
            }
        });
    document.documentElement.style.setProperty(
      "--codeText",
      codeColor[activeFile]["text"][prefersDark],
    );

    });
});
runButton.addEventListener("click", () => {
    const iframe = document.querySelector(".preview");
    iframe.srcdoc = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style>${fileTextarea.css}</style>
</head>

<body>
    <main>
        ${fileTextarea.html}
    </main>
	<script>${fileTextarea.js.replace(/<\/script>/g, "<\\/script>")}</script>
</body>

</html>`;
});
textarea.addEventListener("input", () => {
  fileTextarea[activeFile] = textarea.value;
  let text = textarea.value;

  let refined = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (activeFile === "html") {
    refined = refined.replace(
      /(&lt;\/?[a-zA-Z]*[^&gt;]*&gt;)/g,
      `<span style='color: ${codeColor.html.elements};'>$1</span>`,
    );
  } else if (activeFile === "css") {
    refined = refined.replace(
      /(\b(?:px|rem|vh|vw|em)\b|%|!important)/g,
      `<span style='color: ${codeColor.css.elements};'>$1</span>`,
    );
  } else if (activeFile === "js") {
    refined = refined.replace(
      /\b(const|let|var|function|if|else|return|for|while)\b/g,
      `<span style='color: tomato;'>$1</span>`,
    );
  }

  refined = refined.replace(/\n/g, "<br>");

  code.innerHTML = refined;
  fileCode[activeFile] = refined;

  localStorage.setItem("code", JSON.stringify(fileCode));
  localStorage.setItem("textarea", JSON.stringify(fileTextarea));
});
document.addEventListener("click", (e) => {
  if (!settingsButton.contains(e.target) && !settingsMenu.contains(e.target)) {
    settingsMenu.style.display = "none";
    settingsButton.classList.remove("active");
  }
});
textarea.addEventListener("scroll", () => {
  const highlight = document.querySelector(".highlight");
  highlight.scrollTop = textarea.scrollTop;
  highlight.scrollLeft = textarea.scrollLeft;
});
toggleTheme.addEventListener("click", () => {
    const circle = document.querySelector(".circle");
    const sun = document.querySelector(".sun");
    const moon = document.querySelector(".moon");
	toggleTheme.classList.toggle("active");
	circle.classList.toggle("active");
	sun.classList.toggle("active");
	moon.classList.toggle("active");
	prefersDark = map[prefersDark];
    applyTheme();
    localStorage.setItem("theme", prefersDark);
});