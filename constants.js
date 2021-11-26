const DOMAIN = "https://duelingnexus.com/";
exports.PORT = process.env.PORT || 8000;
exports.LOGIN_URL = DOMAIN + "api/login.php";
exports.GET_SESSION_ID_URL = DOMAIN + "api/me.php";
exports.GET_CARD_TEXT_URL = DOMAIN + "assets/data/cards_en.json?v=260";
exports.GET_CARD_DETAILS_URL = DOMAIN + "assets/data/cards.json?v=260";
exports.LIST_DECKS_URL = DOMAIN + "api/list-decks.php";
exports.GET_DECK_URL = DOMAIN + "editor/";
exports.HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
};
