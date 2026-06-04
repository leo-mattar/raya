export default function instagramFeed() {
  const root = document.querySelector(".mwg008");
  if (!root) return;

  const content = root.querySelector(".mwg008-container");
  if (!content) return;

  const origCards = Array.from(content.querySelectorAll(".mwg008-card"));
  if (!origCards.length) return;

  const cardsLength = origCards.length;

  // Measure one set width before duplicating
  const half = content.scrollWidth;

  // Duplicate cards for seamless loop
  origCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    content.appendChild(clone);
  });

  const cards = content.querySelectorAll(".mwg008-card");

  let total = 0,
    itemValues = [],
    isDragging = false;

  for (let i = 0; i < cardsLength; i++) {
    itemValues.push((Math.random() - 0.5) * 20);
  }

  const tl = gsap.timeline({ paused: true });
  tl.to(cards, {
    rotate: (index) => itemValues[index % cardsLength],
    xPercent: (index) => itemValues[index % cardsLength],
    yPercent: (index) => itemValues[index % cardsLength],
    scale: 0.95,
    duration: 0.5,
    ease: "back.inOut(3)",
  });

  const gsapObs = Observer.create({
    target: content,
    type: "pointer,touch",
    onPress: () => { isDragging = true; tl.play(); },
    onDrag: (self) => {
      total += self.deltaX;
      setPosition();
    },
    onRelease: () => { isDragging = false; tl.reverse(); },
    onStop: () => { isDragging = false; tl.reverse(); },
  });

  gsap.ticker.add(tick);

  function setPosition() {
    // Keep total in [-half, 0) — seamless because second set is a duplicate
    total = ((total % half) + half) % half - half;
    gsap.set(content, { x: total });
  }

  function tick(time, deltaTime) {
    if (isDragging) return;
    total -= deltaTime / 10;
    setPosition();
  }

  // KILL
  const observer = new MutationObserver((mutations) => {
    const isRootRemoved = mutations.some(
      (mutation) =>
        mutation.type === "childList" &&
        Array.from(mutation.removedNodes).includes(root),
    );

    if (isRootRemoved) {
      gsap.ticker.remove(tick);
      gsapObs.kill();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
