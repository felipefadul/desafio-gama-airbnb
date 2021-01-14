const apiUrl = "https://dry-cliffs-94979.herokuapp.com/";
const cardsContainer = document.getElementById("cards-container");
let data = [];
let numberDays = 1;

async function fetchCards() {
  try {
    let response = await fetch(apiUrl);
    if (response.status !== 200)
      renderErrorMessage();
    return await response.json();
  } catch (err) {
      console.error("Algo deu errado. Erro:", err);
  }
}

function renderCards() {
  const filteredResults = handleSearch();
  cardsContainer.innerHTML = "";
  filteredResults.map(renderCard);
}

function renderCard(card) {
  const div = document.createElement("div");
  div.style.width = "30rem";
  div.style.margin = "1.5rem .5rem";
  div.className = "card-deck";
  div.innerHTML = `
  <div class="card">
    <img src="${card.photo}" class="card-img-top card-image" alt="${card.name}">
    <div class="card-body">
        <h4 class="card-title">${card.name}</h4>
        <div id="information">
          <div class="card-text text-muted">${card.property_type}</div>
          <div class="card-text"><strong>R$ ${card.price}</strong>/noite</div>
        </div>
    </div>
    <hr>
    <div id="total-price">
      <div class="card-text mb-2">
        Total p/ ${numberDays} ${numberDays > 1 ? 'noites' : 'noite'}: <strong>R$ ${card.price * numberDays},00</strong>
      </div>
    <div>
  </div>
  `;
  cardsContainer.appendChild(div);
}

function renderErrorMessage() {
  const div = document.createElement("div");
  div.style.width = "30rem";
  div.style.margin = "1.5rem .5rem";
  div.className = "error-message";
  div.innerHTML = `
  <p>
    Hmm, parece que não há mais propriedades disponíveis :(
  </p>
  `;
  cardsContainer.appendChild(div);
}

async function main() {
  try {
    data = await fetchCards();
    flatpickr("#datepicker", {
      mode: "range",
      minDate: "today",
      locale: "pt",
      dateFormat: "d-m-Y",
      onClose: function (selected) {
        updateCardsTotal(daysBetween(selected[0], selected[1]));
      },
    });
    if (data.length > 0)
      renderCards();
  } catch (err) {
    console.log("Erro ao recuperar os dados da API. Erro:", err);
  }
}

main();

function handleSearch() {
  let inputValue = document.getElementById("input-place").value.toLowerCase();

   return data.filter((places) => {
    const placesToSearchByName = places.name.toLowerCase();

    if (placesToSearchByName.search(inputValue) > -1)
      return places;
  });
}

function daysBetween(date1, date2) {
  const MILLISECONDS_IN_ONE_DAY = 1000 * 60 * 60 * 24;
  let differenceInMilliseconds = Math.abs(date1 - date2);
  
  return Math.round(differenceInMilliseconds / MILLISECONDS_IN_ONE_DAY);
}

function updateCardsTotal(number) {
  // If the number of days is equal, avoid re-rendering.
  if (numberDays === number)
    return;
  
  // If number is zero, update it to one.
  number = number ? number : 1;
  numberDays = number;
  
  renderCards();
}

function orderByNameAZ() {
  orderBy('name', 'ascending');

  renderCards();
}

function orderByNameZA() {
  orderBy('name', 'descending');
  
  renderCards();
}

function orderByPropertyType() {
  orderBy('property_type', 'ascending');

  renderCards();
}

function orderByLowestPrice() {
  orderBy('price', 'ascending');

  renderCards();
}

function orderByHighestPrice() {
  orderBy('price', 'descending');

  renderCards();
}

function orderBy (parameter, order) {
  if (order === "ascending") {
    data.sort((a, b) => (a[parameter] > b[parameter] ? 1 : b[parameter] > a[parameter] ? -1 : 0));
  } else {
    data.sort((a, b) => (a[parameter] < b[parameter] ? 1 : b[parameter] < a[parameter] ? -1 : 0));
  }
}