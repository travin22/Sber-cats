const $wr = document.querySelector("[data-wr]");

const getCatHTML = (cat) => {
  return `
  <div class="card">
    <img src="${cat.image}" class="img" alt="${cat.name}" />
    <div class="card-body">
      <h2>${cat.name}</h2>
      <p class="card_text">${cat.description}</p>
      <a href="#" class="button">Подробнее</a>
    </div>
  </div>
  `;
};

fetch("https://cats.petiteweb.dev/api/single/travin22/show/")
  .then((res) => res.json())
  .then((data) => {
    $wr.insertAdjacentHTML(
      "afterbegin",
      data.map((cat) => getCatHTML(cat)).join("")
    );
    console.log({ data });
  });
