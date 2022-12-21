const $wr = document.querySelector("[data-wr]");
const $modalWr = document.querySelector("[data-modalWr]");
const CREATE_FORM_LS_KEY = "CREATE_FORM_LS_KEY";
const $modalContent = document.querySelector("[data-modalContent]");
const ACTIONS = {
  DETAIL: "detail",
  EDIT: "update",
  DELETE: "delete",
};

const getCreateCatFormHTML = () => `
  <h3 class="text-center mb-3">Добавление нового кота</h3>
        <form name="createCatForm">
          <div class="mb-2">
            <input
              type="text"
              name="name"
              class="form-control"
              placeholder="Введи имя"
              required
            />
          </div>
          <div class="mb-2">
            <input
              type="number"
              name="id"
              class="form-control"
              placeholder="Введи id"
              required
            />
          </div>
          <div class="mb-2">
            <input
              type="number"
              name="age"
              class="form-control"
              placeholder="Введи возраст"
            />
          <div class="mb-2">
            <input
              type="text"
              name="description"
              class="form-control"
              placeholder="Введи описание"
            />
          </div>
          <div class="mb-2">
            <input
              type="text"
              name="image"
              class="form-control"
              placeholder="Image url"
            />
          </div>
          <div class="mb-2">
            <label for="volume" class="form-label">Рейтинг кота</label>
            <input
              type="range"
              name="rate"
              id="volume"
              min="1"
              max="10"
            />
          </div>
          <div class="mb-2 form-check">
            <input
              type="checkbox"
              name="favorite"
              class="form-check-input"
              id="exampleCheck1"
            />
            <label class="form-check-label" for="exampleCheck1"
              >Like</label
            >
          </div>
          <button type="submit" class="btn btn-primary">Добавить</button>
        </form>`;

const getCatHTML = (cat) => {
  return `
  <div data-cat-id="${cat.id}" class="card">
    <img src="${cat.image}" class="img" alt="${cat.name}" />
    <div class="card-body">
      <h2>${cat.name}</h2>
      <p class="card_text">${cat.description}</p>
      <div class= buttons>
      <button data-action="${ACTIONS.DETAIL}" type='button' class="button-more">Подробнее</button>
      <button data-action="${ACTIONS.EDIT}" data-open-modal="editCat" type='button' class="button-edit">Изменить</button>
      <button data-action="${ACTIONS.DELETE}" type='button' class="button-delete">Удалить</button>
      </div>
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
  });

$wr.addEventListener("click", (e) => {
  if (e.target.dataset.action === ACTIONS.DELETE) {
    const $catWr = e.target.closest("[data-cat-id]");
    const catId = $catWr.dataset.catId;
    fetch(`https://cats.petiteweb.dev/api/single/travin22/delete/${catId}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        return $catWr.remove();
      }
      alert(`Удаление кота с id = ${catId} не удалось.`);
    });
  }
});

const formatCreateFormData = (formDataObject) => ({
  ...formDataObject, //спред оператор
  id: +formDataObject.id,
  age: +formDataObject.age,
  rate: +formDataObject.rate,
  favorite: !!formDataObject.favorite,
});

const submitCreateCatHandler = (e) => {
  e.preventDefault();
  formDataObject = fetch(
    `https://cats.petiteweb.dev/api/single/travin22/add/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataObject),
    }
  )
    .then((res) => {
      if (res.status === 200) {
        return $wr.insertAdjacentHTML("afterbegin", getCatHTML(formDataObject));
      }
      throw Error("Ошибка при создании кота");
    })
    .catch(alert);
};

const clickModalWrHandler = (e) => {
  if (e.target === $modalWr) {
    $modalWr.classList.add("hidden");
    $modalWr.removeEventListener("click", clickModalWrHandler);
    $modalContent.innerHTML = "";
  }
};

const openModalHandler = (e) => {
  if (e.target.dataset.openmodal === "createCat") {
    $modalWr.classList.remove("hidden");
    $modalWr.addEventListener("click", clickModalWrHandler);
    $modalContent.insertAdjacentHTML("afterbegin", getCreateCatFormHTML());
    const $createCatForm = document.forms.createCatForm;
    const dataFromLS = localStorage.getItem(CREATE_FORM_LS_KEY);
    const preparedDataFromLS = dataFromLS && JSON.parse(dataFromLS);
    if (preparedDataFromLS) {
      Object.keys(preparedDataFromLS).forEach((key) => {
        $createCatForm[key].value = preparedDataFromLS[key];
      });
    }

    $createCatForm.addEventListener("submit", submitCreateCatHandler);
    $createCatForm.addEventListener("change", (changeEvent) => {
      const formattedData = formatCreateFormData(
        Object.fromEntries(new FormData($createCatForm).entries())
      );
      localStorage.setItem(CREATE_FORM_LS_KEY, JSON.stringify(formattedData));
    });
  }
};
document.addEventListener("click", openModalHandler);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    $modalWr.classList.add("hidden");
    $modalWr.removeEventListener("click", clickModalWrHandler);
    $modalContent.innerHTML = "";
  }
});
