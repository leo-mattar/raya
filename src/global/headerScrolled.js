export default function headerScrolled() {
  const header = document.querySelector(".c-header");
  if (!header) return;

  ScrollTrigger.create({
    trigger: "body",
    start: "10 top",
    onToggle: self => {
      if (self.isActive) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    },
  });
}
