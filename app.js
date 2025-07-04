const url = "./data.json";
const cardsContainer = document.querySelector(".cards__container");
const menuButtons = document.querySelector(".menu__list");
const extensionsMode = document.querySelector(".extensions__mode");
const body = document.getElementById("body");
const mainContent = document.querySelector(".cards__container");

document.addEventListener("DOMContentLoaded", () => {

  let mode = localStorage.getItem("mode");

  if (!mode) {
    mode = JSON.stringify({ darkMode: false });
    localStorage.setItem("mode", mode);
  }

  const modeJSON = JSON.parse(mode);
  if (modeJSON.darkMode) {
    body.classList.add("dark__mode");
  }
});



extensionsMode.addEventListener("click", () => {
  const modeStr = localStorage.getItem("mode");
  if (!modeStr) return;

  const modeJSON = JSON.parse(modeStr);
  const isDark = !modeJSON.darkMode;

  if (isDark) {
    body.classList.add("dark__mode");
  } else {
    body.classList.remove("dark__mode");
  }

  localStorage.setItem("mode", JSON.stringify({ darkMode: isDark }));
});


async function importData() {
  const fetchData = await fetch(url);
  const data = await fetchData.json();
  if (!localStorage.getItem("data")) {
    localStorage.setItem("data", JSON.stringify(data));
  }
  addElements();
}

menuButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (button.value === "active") {
    addActiveElements();
    console.log();
  } else if (button.value === "inactive") {
    addInactiveElements();
  } else {
    addElements();
  }
});

function addElements() {
  const data = JSON.parse(localStorage.getItem("data"));
  const menu = menuButtons.children;
  Array.from(menu).forEach((button) => {
    button.classList.remove("active");
  });
  menu[0].classList.add("active");
  cardsContainer.innerHTML = "";
  data.forEach((el) => {
    createCard(el)
  });
}

function createCard(el){
  const card = `<article id="${el.name}" class="card">
        <header class="card__header">
          <img src="${el.logo}" alt="">
          <div class="description">
            <h2>${el.name}</h2>
            <p>${el.description}</p>
          </div>
        </header>
        <footer class="card__footer">
          <button>Remove</button>
          <label class="switch">
            <input class="toggle" type="checkbox" ${
              el.isActive ? "checked" : ""
            }>
            <span class="slider"></span>
          </label>
        </footer>
      </article>`;
    cardsContainer.innerHTML += card;
}

function addActiveElements() {
  const data = JSON.parse(localStorage.getItem("data"));
  const menu = menuButtons.children;
  Array.from(menu).forEach((button) => {
    button.classList.remove("active");
  });
  menu[1].classList.add("active");
  cardsContainer.innerHTML = "";
  data.forEach((el) => {
    if (el.isActive === true) {
      createCard(el);
    }
  });
}

function addInactiveElements() {
  const data = JSON.parse(localStorage.getItem("data"));
  const menu = menuButtons.children;
  Array.from(menu).forEach((button) => {
    button.classList.remove("active");
  });
  menu[2].classList.add("active");
  cardsContainer.innerHTML = "";
  data.forEach((el) => {
    if (el.isActive === false) {
      createCard(el);
    }
  });
}

window.addEventListener("load", importData);


mainContent.addEventListener("change", (event) => {
  const toggle = event.target.closest("label");
  const card = event.target.closest("article");
  if (toggle && card) {
    const data = JSON.parse(localStorage.getItem("data") || "[]");
    const updatedData = data.map((el) => {
      if (el.name == card.id) {
        return {
          ...el,
          isActive: !el.isActive,
        };
      }
      return el;
    });
    console.log(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
  }
  const activeButton = Array.from(menuButtons.children).find(btn =>
    btn.classList.contains("active")
  );

  const data = JSON.parse(localStorage.getItem("data") || "[]");
  cardsContainer.innerHTML = "";

  if (activeButton?.value === "active") {
    data.forEach(el => {
      if (el.isActive) createCard(el);
    });
  } else if (activeButton?.value === "inactive") {
    data.forEach(el => {
      if (!el.isActive) createCard(el);
    });
  } else {
    data.forEach(createCard);
  }
});

mainContent.addEventListener('click', (event) =>{
  const button =  event.target.closest('button');
  const card = event.target.closest("article");

  if (button && card) {
    const data = JSON.parse(localStorage.getItem("data") || "[]");
    const updatedData = data.map((el) => {
      if (el.name == card.id) {
        return {
          ...el,
          isActive: false,
        };
      }
      return el;
    });
    console.log(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
    card.remove();
  }
})
