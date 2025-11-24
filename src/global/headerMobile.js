export default function headerMobile() {
  const navBtn = document.querySelector(".c-nav-btn");
  const header = document.querySelector(".c-header");
  const headerNav = document.querySelector(".c-header-nav");

  if (navBtn && header && headerNav) {
    navBtn.addEventListener("click", () => {
      header.classList.toggle("is-open");

      if (header.classList.contains("is-open")) {
        lenis.stop();
        headerNav.setAttribute("data-lenis-prevent", "");
      } else {
        lenis.start();
        headerNav.removeAttribute("data-lenis-prevent");
      }
    });
  }
}
