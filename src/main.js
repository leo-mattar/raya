import accordion from "./components/accordion";
import defaultSettings from "./global/defaultSettings";
import headerDropdown from "./global/headerDropdown";
import headerMobile from "./global/headerMobile";
import headerScrolled from "./global/headerScrolled";
import lenisInit from "./global/lenisInit";
import marqueeObserver from "./global/marqueeObserver";
import videoState from "./global/videoState";

let mm = gsap.matchMedia();

// --------------- INIT ---------------
function init() {
  // Global
  defaultSettings();
  headerDropdown();
  headerScrolled();
  lenisInit();
  marqueeObserver();
  videoState();

  // Components
  accordion();

  // Pages
}

init();

// --------------- MATCHMEDIA (DESKTOP) ---------------
mm.add("(min-width: 992px)", () => {
  //
  return () => {
    //
  };
});

// --------------- MATCHMEDIA (TABLET AND MOBILE) ---------------
mm.add("(max-width: 991px)", () => {
  headerMobile();
  return () => {
    //
  };
});

console.log("...");
