import blogReadTime from "./components/blogReadTime.js";
import custom from "./components/custom.js";
import flowState from "./components/flowState.js";
import gallery from "./components/gallery.js";
import instagramFeed from "./components/instagramFeed.js";
import TribeCards from "./components/tribeCards.js";

// --------------- INIT ---------------
function init() {
  custom();
  flowState();
  gallery();
  instagramFeed();
  blogReadTime();
  TribeCards();
}

init();
