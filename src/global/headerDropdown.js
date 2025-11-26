export default function headerDropdown() {
  const dropdowns = document.querySelectorAll(".c-dd");
  const nav = document.querySelector(".c-header-nav");

  if (!dropdowns.length || !nav) return;

  function closeAll() {
    dropdowns.forEach(dd => dd.classList.remove("is-open"));
    nav.classList.remove("has-open");
  }

  dropdowns.forEach(dd => {
    const toggle = dd.querySelector(".c-dd-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", e => {
      e.stopPropagation();

      const isOpening = !dd.classList.contains("is-open");

      // Close other dropdowns
      dropdowns.forEach(other => {
        if (other !== dd) other.classList.remove("is-open");
      });

      // Toggle current dropdown
      dd.classList.toggle("is-open");

      // Add or remove nav class based on whether a dropdown is open
      if (isOpening) {
        nav.classList.add("has-open");
      } else {
        nav.classList.remove("has-open");
      }
    });
  });

  // Click outside to close
  document.addEventListener("click", e => {
    const isClickInside = [...dropdowns].some(dd => dd.contains(e.target));
    if (!isClickInside) closeAll();
  });

  // Esc key to close
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeAll();
  });
}
