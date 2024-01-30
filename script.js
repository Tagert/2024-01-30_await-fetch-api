"use strict";

const containerDiv = document.querySelector(".container");
const buttonRefresh = document.querySelector(".btn");

const fetchTop20coins = async () => {
  const assetsString = "https://api.coincap.io/v2/assets?limit=20";
  const ratesString = "https://api.coincap.io/v2/rates/euro";

  const assetsRes = await fetch(assetsString);
  const ratesRes = await fetch(ratesString);
  const coins = (await assetsRes.json()).data;
  const usdToEurCoefficient = (await ratesRes.json()).data.rateUsd;

  const coinsArrayEur = coins.map((coinObj) => {
    const priceUsd = Number(coinObj.priceUsd);
    const priceEur = coinObj.priceUsd / usdToEurCoefficient;
    return { ...coinObj, priceUsd, priceEur: priceEur };
  });

  return coinsArrayEur;
};

const createCard = async () => {
  const modifiedCoins = await fetchTop20coins();
  console.log(modifiedCoins);

  const sortedModifiedCoins = modifiedCoins.sort((a, b) => {
    const nameA = a.id.toUpperCase();
    const nameB = b.id.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  });

  console.log(sortedModifiedCoins);

  modifiedCoins.forEach((coin) => {
    const cardElement = document.createElement("div");
    cardElement.setAttribute("class", "coin-card");

    const title = coin.id;
    const priceEur = coin.priceEur.toFixed(7);
    const priceUsd = coin.priceUsd.toFixed(7);

    const titleParagraph = document.createElement("p");
    titleParagraph.innerText = title;

    const priceEurParagraph = document.createElement("p");
    priceEurParagraph.innerText = `Price: ${priceEur} €`;

    const priceUsdParagraph = document.createElement("p");
    priceUsdParagraph.innerText = `Price: ${priceUsd} $`;

    containerDiv.append(cardElement);
    cardElement.append(titleParagraph, priceEurParagraph, priceUsdParagraph);

    coin.priceEur >= 100
      ? (cardElement.style.borderColor = "gold")
      : (cardElement.style.borderColor = "silver");
  });
};

buttonRefresh.addEventListener("click", createCard);
