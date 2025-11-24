export default function accordion() {
  const lists = document.querySelectorAll("[data-accordion-list]");
  if (!lists.length) return;

  const closeAll = items =>
    items.forEach(i => i.setAttribute("data-accordion-item", "closed"));
  const isOpen = item => item.getAttribute("data-accordion-item") === "open";

  lists.forEach(list => {
    const items = Array.from(list.querySelectorAll("[data-accordion-item]"));
    if (!items.length) return;

    closeAll(items);

    if (list.hasAttribute("data-accordion-first-open") && !items.some(isOpen)) {
      items[0].setAttribute("data-accordion-item", "open");
    }

    const section = list.closest("[data-accordion-section]");
    const alwaysOpen =
      section && section.hasAttribute("data-accordion-always-open");

    list.addEventListener("click", e => {
      const toggle = e.target.closest("[data-accordion-toggle]");
      if (!toggle || !list.contains(toggle)) return;

      e.preventDefault();
      e.stopPropagation();

      const item = toggle.closest("[data-accordion-item]");
      if (!item) return;

      const wasOpen = isOpen(item);

      if (alwaysOpen) {
        // If always open, prevent closing the only open item
        const openItems = items.filter(isOpen);
        if (wasOpen && openItems.length === 1) return;
      }

      if (wasOpen) {
        item.setAttribute("data-accordion-item", "closed");
      } else {
        closeAll(items);
        item.setAttribute("data-accordion-item", "open");
      }
    });
  });
}
