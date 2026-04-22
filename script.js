const textarea = document.querySelector(".editor");
const toolbar = document.querySelector(".toolbar");
const toolbarButtons = toolbar.querySelectorAll("div");
const setting = document.querySelector(".settings");
const settingsButton = document.querySelector(".setting");
const settingsMenu = document.querySelector(".settings-menu");
const runButton = document.querySelector(".run");
const maximizeButton = document.querySelector(".maximize");
const minimizeButton = document.querySelector(".minimize");
const textContainer = document.querySelector(".text-container");
textContainer.style.flexBasis = localStorage.getItem("textContainerWidth");
const iframe = document.querySelector(".preview");
let resizing = false;
const dark = ["black", "rgb(30, 30, 30)", "rgb(70, 70, 70)", "rgb(50, 50, 50)"];
const light = [
  "white",
  "rgb(240, 240, 240)",
  "rgb(220, 220, 220)",
  "rgb(200, 200, 200)",
];
const code = document.querySelector(".highlight code");
const theme = { light: light, dark: dark };
const map = {
  light: "dark",
  dark: "light",
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
  light: {
    background: "white",
    color: "black",
  },
  dark: {
    background: "rgb(39, 40, 34)",
    color: "white",
  },
};
maximizeButton.addEventListener("click", () => {
  textContainer.style.display = "none";
  maximizeButton.style.display = "none";
  minimizeButton.style.display = "block";
});
minimizeButton.addEventListener("click", () => {
  textContainer.style.display = "flex";
  maximizeButton.style.display = "block";
  minimizeButton.style.display = "none";
});
const toggleTheme = document.querySelector(".rectangle");
let prefersDark = localStorage.getItem("theme") || "light";
let activeFile = "html";

function applyTheme() {
  document.documentElement.style.setProperty(
    "--primary",
    theme[prefersDark][1],
  );
  document.documentElement.style.setProperty(
    "--secondary",
    theme[prefersDark][2],
  );
  document.documentElement.style.setProperty("--third", theme[prefersDark][3]);
  document.documentElement.style.setProperty(
    "--text",
    theme[map[prefersDark]][0],
  );
  document.documentElement.style.setProperty(
    "--code",
    codeColors[prefersDark]["background"],
  );
  if (activeFile === "html") {
    document.documentElement.style.setProperty(
      "--codeText",
      codeColors[prefersDark]["color"],
    );
  }
  colorSelectedButton();
}

let isResizing = false;
let startX;
let startWidth;

// detect hover near right edge
textContainer.addEventListener("mousemove", (e) => {
  const rect = textContainer.getBoundingClientRect();
  const nearRight = e.clientX > rect.right - 8;

  textContainer.style.cursor = nearRight ? "ew-resize" : "default";
});

// start resizing
textContainer.addEventListener("mousedown", (e) => {
  const rect = textContainer.getBoundingClientRect();
  const nearRight = e.clientX > rect.right - 8;

  if (!nearRight) return;

  isResizing = true;
  startX = e.clientX;
  startWidth = rect.width;
  iframe.style.pointerEvents = "none";
});

// resize
document.addEventListener("mousemove", (e) => {
  if (!isResizing) return;

  const dx = e.clientX - startX;
  textContainer.style.flexBasis = Math.max(200, startWidth + dx) + "px";
});

// stop resizing
document.addEventListener("mouseup", () => {
  isResizing = false;
  iframe.style.pointerEvents = "auto";
  localStorage.setItem("textContainerWidth", textContainer.style.flexBasis);
});
const fileTextarea = localStorage.getItem("textarea")
  ? JSON.parse(localStorage.getItem("textarea"))
  : {
      html: `<h1 class="title"> Hello World! </h1>
`,
      css: `*{
    padding:0;
    margin:0;
}
html , body {
    height:100%;
}
body {
    background-image: linear-gradient(45deg , orange , orangered);
    display : flex;
    align-items : center;
    justify-content: center;
}
.title{
    color : white;
    animation : slide 0.6s 0.3s ease both;
    cursor: pointer;
    transition: filter 0.3s;
}
.title:not(:hover){
    filter:blur(3px);
}
@keyframes slide {
    from {
        transform : translateY(-50px);
        opacity : 0;
    }
    to {
        transform : translateY(0px);
        opacity : 1;
    }
}`,
      js: `const title = document.querySelector(".title");
title.addEventListener("click",()=>{
    alert("Hello World!");
});`,
    };
const fileCode = localStorage.getItem("code")
  ? JSON.parse(localStorage.getItem("code"))
  : {
      html: `<span style='color: rgb(99,209,109);'>&lt;h1 class="title"&gt;</span> Hello World! <span style='color: rgb(99,209,109);'>&lt;/h1&gt;</span>
`,
      css: `*{<br>    padding:0;<br>    margin:0;<br>}<br>html , body {<br>    height:100<span style='color: tomato;'>%</span>;<br>}<br>body {<br>    background-image: linear-gradient(45deg , orange , orangered);<br>    display : flex;<br>    align-items : center;<br>    justify-content: center;<br>}<br>.title{<br>    color : white;<br>    animation : slide 0.6s 0.3s ease both;<br>    cursor: pointer;<br>    transition: filter 0.3s;<br>}<br>.title:not(:hover){<br>    filter:blur(3<span style='color: tomato;'>px</span>);<br>}<br>@keyframes slide {<br>    from {<br>        transform : translateY(-50<span style='color: tomato;'>px</span>);<br>        opacity : 0;<br>    }<br>    to {<br>        transform : translateY(0<span style='color: tomato;'>px</span>);<br>        opacity : 1;<br>    }<br>}`,
      js: `<span style='color: tomato;'>const</span> title = document.querySelector(".title");<br>title.addEventListener("click",()=&gt;{<br>    alert("Hello World!");<br>});`,
    };
window.onload = () => {
  const htmlButton = toolbar.querySelector(".html-button");
  htmlButton.style.backgroundColor = theme[prefersDark][0];
  activeFile = "html";
  if (prefersDark === "dark") {
    const circle = document.querySelector(".circle");
    const sun = document.querySelector(".sun");
    const moon = document.querySelector(".moon");
    toggleTheme.classList.add("active");
    circle.classList.add("active");
    sun.classList.add("active");
    moon.classList.add("active");
    applyTheme();
  }
  textarea.value = fileTextarea[activeFile];
  code.innerHTML = fileCode[activeFile];
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
  toolbarButtons.forEach((button) => {
    if (button.classList.contains(`${activeFile}-button`)) {
      button.style.backgroundColor = theme[prefersDark][0];
    } else {
      button.style.backgroundColor = "transparent";
    }
  });
}
toolbarButtons.forEach((child) => {
  child.addEventListener("click", () => {
    child.style.backgroundColor = theme[prefersDark][0];
    activeFile = child.classList.contains("html-button")
      ? "html"
      : child.classList.contains("css-button")
        ? "css"
        : "js";
    textarea.value = fileTextarea[activeFile];
    code.innerHTML = fileCode[activeFile];
    toolbarButtons.forEach((sibling) => {
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
      /(&lt;\/?[a-zA-Z0-9][\s\S]*?&gt;)/g,
      `<span style='color: ${codeColor.html.elements};'>$1</span>`,
    );
  } else if (activeFile === "css") {
    refined = refined.replace(
      /(?<![a-zA-Z])(\d*\.?\d+)?(px|rem|vh|vw|em)\b|%|!important/g,
      (match, numberPart, unitPart) => {
        if (unitPart) {
          return `${numberPart || ""}<span style='color: ${codeColor.css.elements};'>${unitPart}</span>`;
        }
        return `<span style='color: ${codeColor.css.elements};'>${match}</span>`;
      },
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
