const apiUrl = "https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72"
const cardsContainer = document.getElementById("cards-container");
let data = [];

async function fetchCards() {
  let response = await fetch(apiUrl);
  return await response.json();
}

function renderCards(cards) {
  cardsContainer.innerHTML = "";
  cards.map(renderCard);
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
  </div>
  `;
  cardsContainer.appendChild(div);
}

async function main() {
  data = await fetchCards();
  if (data[0])
    renderCards(data);
}

main();

function handleSearch() {
  let inputValue = document.getElementById("input-place").value.toLowerCase();

  const filteredResults = data.filter((places) => {
    const placesToSearchByName = places.name.toLowerCase();

    if (placesToSearchByName.search(inputValue) > -1)
      return places;
  });

  renderCards(filteredResults);
}