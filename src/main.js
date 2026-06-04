import blogReadTime from "./components/blogReadTime.js";
import custom from "./components/custom.js";
import gallery from "./components/gallery.js";
import instagramFeed from "./components/instagramFeed.js";

// --------------- INIT ---------------
function init() {
  custom();
  gallery();
  instagramFeed();
  blogReadTime();
}

init();
