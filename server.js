const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const {
  GET_SESSION_ID_URL,
  PORT,
  LOGIN_URL,
  GET_DECK_URL,
  LIST_DECKS_URL,
  GET_CARD_TEXT_URL,
  GET_CARD_DETAILS_URL,
} = require("./constants");
const {
  makeMap,
  reformatDeck,
  convertIdToNames,
  formatForTxt,
  formatToYdk,
  kebabCase,
} = require("./utils");

const cors = require("cors");

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/get-session-id", async (req, res) => {
  try {
    const response = await axios.get(GET_SESSION_ID_URL, {
      withCredentials: true,
    });
    const { headers } = response;
    const cookies = headers["set-cookie"];
    const cookie = cookies[0].split("PHPSESSID=")[1].split("; path=/")[0];
    const sessionIdCookie = "PHPSESSID=" + cookie;
    return res.json(sessionIdCookie);
  } catch (e) {
    throw e;
  }
});

app.post("/login", async (req, res) => {
  const { loginData, headerData } = req.body;
  try {
    const response = await axios.post(LOGIN_URL, loginData, {
      headers: headerData,
    });
    console.log("LOGIN SUCCESSFUL? :", response.data.success);
    return res.json(response.data.success);
  } catch (e) {
    console.log("LOGIN ERROR: ", e.message);
    throw e;
  }
});

app.post("/get-decklist", async (req, res) => {
  const { headerData } = req.body;
  try {
    const response = await axios.get(LIST_DECKS_URL, { headers: headerData });
    console.log("GET DECK RESPONSE", response.data.decks);
    return res.json(response.data);
  } catch (e) {
    console.log("ERROR GETTING DECK LIST:", e.message);
  }
});

app.post("/get-deck", async (req, res) => {
  const { id, headerData } = req.body;
  console.log(id, headerData);

  let deckData = {};
  let nameMap = {};
  let typeMap = {};

  try {
    console.log("GETTING DECK DATA...");
    deckData = await getDeck(id, headerData);
    console.log(deckData);
  } catch (e) {
    console.log("ERROR getting deck", e);
  }

  try {
    console.log("GETTING CARD DB DATA...");
    const cardDatabase = await axios.get(GET_CARD_TEXT_URL);
    nameMap = makeMap(cardDatabase.data.texts, "n");
    console.log(cardDatabase);
  } catch (e) {
    console.log("ERROR making name map", e);
  }

  try {
    console.log("GETTING TYPE DB DATA...");
    const typeDatabase = await axios.get(GET_CARD_DETAILS_URL);
    typeMap = makeMap(typeDatabase.data.cards, "typ");
    console.log(typeDatabase);
  } catch (e) {
    console.log("ERROR making type map", e);
  }

  console.log("FORMATTING...");
  const deckName = deckData.name;

  const reformattedDeck = reformatDeck(deckData, typeMap);

  const deckWithNames = convertIdToNames(reformattedDeck, nameMap);
  console.log("DECK WITH NAMES", deckWithNames);

  const txtDeck = formatForTxt(deckWithNames, deckName);
  const ydkDeck = formatToYdk(deckData);

  return res.json({ name: kebabCase(deckName), txt: txtDeck, ydk: ydkDeck });
});

// HELPER FUNCTIONS //

async function getDeck(deckId, headerData) {
  try {
    const completeUrl = GET_DECK_URL + deckId;
    const page = await axios.get(completeUrl, { headers: headerData });
    const deck = page.data
      .split("script>var Deck = ")[1]
      .split(";</script>")[0];
    return JSON.parse(deck);
  } catch (e) {
    throw e;
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}...✅`);
});
