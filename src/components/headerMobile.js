export default function headerMobile() {
  const navBtn = document.querySelector("[data-header-mobile-btn]");
  const header = document.querySelector(".navbar");

  if (!navBtn || !header) return;

  navBtn.addEventListener("click", () => {
    header.classList.toggle("is-open");

    if (header.classList.contains("is-open")) {
      window.lenis.stop();
    } else {
      window.lenis.start();
    }
  });
}
