export default function marquee() {
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const marquees = entry.target.querySelectorAll("[data-marquee-state]");
        const state = entry.isIntersecting ? "playing" : "paused";
        marquees.forEach((marquee) => {
          marquee.setAttribute("data-marquee-state", state);
        });
      });
    },
    { threshold: 0.1 },
  );

  const observed = new WeakSet();
  const duplicated = new WeakSet();

  function observeSection(section) {
    if (!section || observed.has(section)) return;
    if (!section.querySelector("[data-marquee-state]")) return;
    observed.add(section);
    intersectionObserver.observe(section);
  }

  function setDynamicSpeed(marquee) {
    // Count direct children (marquee items)
    const itemCount = marquee.children.length;

    // Get speed multiplier from attribute (default to 1)
    const speedMultiplier =
      parseFloat(marquee.getAttribute("data-marquee-speed")) || 1;

    // Base duration: 10 seconds per item
    const baseDuration = itemCount * 10;

    // Final duration: base divided by multiplier
    // multiplier of 2 = twice as fast (half the duration)
    // multiplier of 0.5 = half as fast (double the duration)
    const finalDuration = baseDuration / speedMultiplier;

    // Set CSS custom property
    marquee.style.setProperty("--marquee-duration", `${finalDuration}s`);
  }

  function duplicateMarquee(marquee) {
    if (duplicated.has(marquee)) return;

    const duplicateAttr = marquee.getAttribute("data-marquee-duplicate");
    const totalCopiesToCreate = duplicateAttr ? Math.ceil(parseFloat(duplicateAttr)) : 1;

    if (totalCopiesToCreate <= 0) {
      duplicated.add(marquee);
      return;
    }

    const parent = marquee.parentElement;

    for (let i = 0; i < totalCopiesToCreate; i++) {
      const clone = marquee.cloneNode(true);
      clone.removeAttribute("data-marquee-duplicate");
      duplicated.add(clone);
      parent.appendChild(clone);

      // Set dynamic speed for the clone
      setDynamicSpeed(clone);
    }

    duplicated.add(marquee);

    // Set dynamic speed for the original
    setDynamicSpeed(marquee);
  }

  function runDuplication() {
    const marquees = document.querySelectorAll(
      "[data-marquee-state], [data-marquee-list]",
    );
    marquees.forEach((marquee) => duplicateMarquee(marquee));
  }

  document.querySelectorAll(".c-section").forEach(observeSection);
  document.querySelectorAll("[data-marquee-state]").forEach((el) => {
    const section = el.closest(".c-section, section");
    if (section) observeSection(section);
  });
  runDuplication();

  let mutationTimeout;
  const mutationObserver = new MutationObserver((mutations) => {
    clearTimeout(mutationTimeout);
    mutationTimeout = setTimeout(() => {
      const sectionsToObserve = new Set();
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(".c-section")) {
            sectionsToObserve.add(node);
          } else if (node.querySelector) {
            if (
              node.matches("[data-marquee-state]") ||
              node.querySelector("[data-marquee-state]") ||
              node.matches("[data-marquee-list]") ||
              node.querySelector("[data-marquee-list]")
            ) {
              const section = node.closest(".c-section, section");
              if (section) sectionsToObserve.add(section);
            }
          }
        });
      });
      sectionsToObserve.forEach(observeSection);
      runDuplication();
    }, 100);
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => {
    clearTimeout(mutationTimeout);
    intersectionObserver.disconnect();
    mutationObserver.disconnect();
  };
}
