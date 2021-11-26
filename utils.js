exports.kebabCase = (string) => {
  return string.toUpperCase().split(" ").join("-");
};

exports.makeMap = (database, propToMap) => {
  const map = {};
  for (let i = 0; i < database.length; i++) {
    map[database[i].id] = database[i][propToMap];
  }
  console.log(map["57761191"]);
  return map;
};

exports.formatToYdk = (deck) => {
  const main = deck.main;
  const extra = deck.extra;
  const side = deck.side;

  let formattedDeck = "";

  formattedDeck += `#created by Deck Viewer (yugiohdeck.github.io)`;
  formattedDeck += `\n#main`;
  for (let i = 0; i < main.length; i++) {
    formattedDeck += `\n${main[i]}`;
  }
  formattedDeck += `\n#extra`;
  for (let i = 0; i < extra.length; i++) {
    formattedDeck += `\n${extra[i]}`;
  }
  formattedDeck += `\n!side`;
  for (let i = 0; i < side.length; i++) {
    formattedDeck += `\n${side[i]}`;
  }
  return formattedDeck;
};

exports.reformatDeck = (deck, typeMap) => {
  const SPELL_IDS = [65538, 131074, 524290, 262146, 2, 130];
  const TRAP_IDS = [1048580, 131076, 4];

  const newDeck = {
    monsters: [],
    spells: [],
    traps: [],
    extra: [],
    side: [],
  };

  for (let i = 0; i < deck.main.length; i++) {
    const thisCard = deck.main[i].toString();

    const thisTypeId = typeMap[thisCard];

    if (SPELL_IDS.includes(thisTypeId)) {
      newDeck.spells.push(thisCard);
      continue;
    }
    if (TRAP_IDS.includes(thisTypeId)) {
      newDeck.traps.push(thisCard);
      continue;
    }
    newDeck.monsters.push(thisCard);
  }

  for (let i = 0; i < deck.extra.length; i++) {
    newDeck.extra.push(deck.extra[i].toString());
  }

  for (let i = 0; i < deck.side.length; i++) {
    newDeck.side.push(deck.side[i].toString());
  }
  return newDeck;
};

exports.convertIdToNames = (deck, nameMap) => {
  const deckKeys = Object.keys(deck);
  const newDeckWithNames = {};

  for (let i = 0; i < deckKeys.length; i++) {
    const arrayOfCardNames = [];
    for (let j = 0; j < deck[deckKeys[i]].length; j++) {
      const cardId = deck[deckKeys[i]][j];
      arrayOfCardNames.push(nameMap[cardId]);
    }
    const sortedNames = arrayOfCardNames.sort((a, b) => a.localeCompare(b));
    newDeckWithNames[deckKeys[i]] = sortedNames;
  }
  return newDeckWithNames;
};

exports.formatForTxt = (deck, name) => {
  let data = "";
  data += `DECK: ${name}`;
  data += `\n\n|- MONSTER CARDS (${deck.monsters.length} cards):`;
  data += addCardsToTxtFile(deck.monsters);
  data += `\n |- SPELL CARDS (${deck.spells.length} cards):`;
  data += addCardsToTxtFile(deck.spells);
  data += `\n |- TRAP CARDS (${deck.traps.length} cards):`;
  data += addCardsToTxtFile(deck.traps);
  data += `\n\n |- EXTRA DECK CARDS (${deck.extra.length} cards):`;
  data += addCardsToTxtFile(deck.extra);
  data += `\n\n |- SIDE DECK CARDS (${deck.side.length} cards):`;
  data += addCardsToTxtFile(deck.side);

  return data;
};

function addCardsToTxtFile(cards) {
  let data = "";
  for (let i = 0; i < cards.length; i++) {
    data += `\n   |- ${cards[i]}`;
  }
  return data;
}
