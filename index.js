const $wr = document.querySelector("[data-wr]");
const $modalWr = document.querySelector("[data-modalWr]");
const $modalContent = document.querySelector("[data-modalContent]");
const $catCreateFormTemplate = document.getElementById("createCatForm");
const CREATE_FORM_LS_KEY = "CREATE_FORM_LS_KEY";

const $modalAboutWr = document.querySelector("[data-modalWr]");
const $modalAboutContent = document.querySelector("[data-modalContent]");

const ACTIONS = {
  DETAIL: "detail",
  DELETE: "delete",
};

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
const getModalCatHTML = (cat) => {
  let heart;
  cat.favorite ? (heart = "fa-solid") : (heart = "");
  return `   
  Имя кота: ${cat.name}<br>
  ID кота: ${cat.id}<br>
  Возраст кота: ${cat.age}<br>
  Описание кота: ${cat.description}<br>
  <div>
  Рейтинг кота: ${cat.rate}<br>
  Фаворит: <i class="favorite fa-regular fa-heart ${heart}"></i><br>
  Фото кота:<br>
  <img src="${cat.image}" class="img_about" alt="${cat.name}" />
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
      alert(`Удаление кота с id = ${catId} не удалось`);
    });
  }
});

const formatCreateFormData = (formDataObject) => ({
  ...formDataObject,
  id: +formDataObject.id,
  rate: +formDataObject.rate,
  age: +formDataObject.age,
  favorite: !!formDataObject.favorite,
});

const clickModalWrHandler = (e) => {
  if (e.target === $modalWr) {
    $modalWr.classList.add("hidden");
    $modalWr.removeEventListener("click", clickModalWrHandler);
    $modalContent.innerHTML = "";
  }
  if (e.target === $modalAboutWr) {
    $modalAboutWr.classList.add("hidden");
    $modalAboutWr.removeEventListener("click", clickModalWrHandler);
    $modalAboutContent.innerHTML = "";
  }
};
//модальное окно на добавление
const openModalHandler = (e) => {
  const targetModalName = e.target.dataset.openmodal;

  if (targetModalName === "createCat") {
    $modalWr.classList.remove("hidden");
    $modalWr.addEventListener("click", clickModalWrHandler);
    const cloneCatCreateForm = $catCreateFormTemplate.content.cloneNode(true);
    $modalContent.appendChild(cloneCatCreateForm);
    const $createCatForm = document.forms.createCatForm;
    const dataFromLS = localStorage.getItem(CREATE_FORM_LS_KEY);
    const preparedDataFromLS = dataFromLS && JSON.parse(dataFromLS);

    if (preparedDataFromLS) {
      Object.keys(preparedDataFromLS).forEach((key) => {
        $createCatForm[key].value = preparedDataFromLS[key];
      });
    }

    $createCatForm.addEventListener("submit", (submitEvent) => {
      submitEvent.preventDefault();
      const formDataObject = formatCreateFormData(
        Object.fromEntries(new FormData(submitEvent.target).entries())
      );

      fetch("https://cats.petiteweb.dev/api/single/travin22/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObject),
      })
        .then((res) => {
          if (res.status === 200) {
            $modalWr.classList.add("hidden");
            $modalWr.removeEventListener("click", clickModalWrHandler);
            $modalContent.innerHTML = "";
            localStorage.removeItem(CREATE_FORM_LS_KEY);
            return $wr.insertAdjacentHTML(
              "afterbegin",
              getCatHTML(formDataObject)
            );
          }
          throw Error("Ошибка при создании кота");
        })
        .catch(alert);
    });
    $createCatForm.addEventListener("change", () => {
      const formattedData = formatCreateFormData(
        Object.fromEntries(new FormData($createCatForm).entries())
      );
      localStorage.setItem(CREATE_FORM_LS_KEY, JSON.stringify(formattedData));
    });
  }
};

//модальное окно на получение инфы о коте
const openModalAboutHandler = (e) => {
  if (e.target.dataset.action === ACTIONS.DETAIL) {
    $modalAboutWr.classList.remove("hidden");
    $modalAboutWr.addEventListener("click", clickModalWrHandler);
    const $catWr = e.target.closest("[data-cat-id]");
    const catId = $catWr.dataset.catId;
    fetch(`https://cats.petiteweb.dev/api/single/travin22/show/${catId}`)
      .then((res) => res.json())
      .then((data) => {
        $modalAboutContent.insertAdjacentHTML(
          "afterbegin",
          getModalCatHTML(data)
        );
      });
  }
};

document.addEventListener("click", openModalHandler);
document.addEventListener("click", openModalAboutHandler);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    $modalWr.classList.add("hidden");
    $modalWr.removeEventListener("click", clickModalWrHandler);
    $modalContent.innerHTML = "";
    $modalAboutWr.classList.add("hidden");
    $modalAboutWr.removeEventListener("click", clickModalWrHandler);
    $modalAboutContent.innerHTML = "";
  }
});
