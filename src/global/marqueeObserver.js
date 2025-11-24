export default function marqueeObserver() {
  const intersectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const marquees = entry.target.querySelectorAll("[data-marquee-state]");
        const state = entry.isIntersecting ? "playing" : "paused";
        marquees.forEach(marquee => {
          marquee.setAttribute("data-marquee-state", state);
        });
      });
    },
    { threshold: 0.1 }
  );
  const observed = new WeakSet();
  function observeSection(section) {
    if (!section || observed.has(section)) return;
    if (!section.querySelector("[data-marquee-state]")) return;
    observed.add(section);
    intersectionObserver.observe(section);
  }
  // Initial observation
  document.querySelectorAll(".c-section").forEach(observeSection);
  // Optimized mutation observer with debouncing
  let mutationTimeout;
  const mutationObserver = new MutationObserver(mutations => {
    clearTimeout(mutationTimeout);
    mutationTimeout = setTimeout(() => {
      const sectionsToObserve = new Set();
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(".c-section")) {
            sectionsToObserve.add(node);
          } else if (node.querySelector) {
            // Check if node contains marquees
            if (
              node.matches("[data-marquee-state]") ||
              node.querySelector("[data-marquee-state]")
            ) {
              const section = node.closest(".c-section");
              if (section) sectionsToObserve.add(section);
            }
          }
        });
      });
      sectionsToObserve.forEach(observeSection);
    }, 100); // Debounce by 100ms
  });
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
  // Cleanup function
  return () => {
    clearTimeout(mutationTimeout);
    intersectionObserver.disconnect();
    mutationObserver.disconnect();
  };
}
