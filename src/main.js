import blogReadTime from "./components/blogReadTime.js";
import custom from "./components/custom.js";
import flowState from "./components/flowState.js";
import gallery from "./components/gallery.js";
import headerMobile from "./components/headerMobile.js";
import instagramFeed from "./components/instagramFeed.js";
import marquee from "./components/marquee.js";
import TribeCards from "./components/tribeCards.js";

const mm = gsap.matchMedia();

// --------------- INIT ---------------
function init() {
  custom();
  flowState();
  gallery();
  instagramFeed();
  blogReadTime();
  TribeCards();
  marquee();

  mm.add("(max-width: 991px)", () => {
    headerMobile();
  });
}

init();
