export default function events() {
  const SHOW_DELAY = 2;

  promoBar();
  promoCard();
  promoModal();

  // --------------- BANNER (visible on load) ---------------
  function promoBar() {
    const bar = document.querySelector("[data-promo-bar]");
    if (!bar) return;

    const closeBtn = bar.querySelector(".c-promo-bar-close");
    const navBtn = document.querySelector(".navbar .w-nav-button");

    let isDismissed = false;

    // Collapse the bar while the Webflow mobile menu is open
    const navTl = gsap.timeline({
      paused: true,
      defaults: { duration: 0.5, ease: "power3.inOut", easeReverse: true },
      onReverseComplete: () => {
        gsap.set(bar, { clearProps: "height,paddingTop,paddingBottom,overflow" });
        navTl.invalidate();
      },
    });

    navTl.set(bar, { overflow: "hidden" });
    navTl.to(bar, { height: 0, paddingTop: 0, paddingBottom: 0 });

    // Watch Webflow's native nav button state, so this works without the header script
    if (navBtn) {
      new MutationObserver(() => {
        if (isDismissed) return;

        if (navBtn.getAttribute("aria-expanded") === "true") {
          navTl.play();
        } else {
          navTl.reverse();
        }
      }).observe(navBtn, { attributes: true, attributeFilter: ["aria-expanded"] });
    }

    if (!closeBtn) return;

    closeBtn.addEventListener("click", () => {
      isDismissed = true;
      navTl.kill();

      gsap.set(bar, { overflow: "hidden" });

      gsap.to(bar, {
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => {
          bar.style.display = "none";
          ScrollTrigger.refresh();
        },
      });
    });
  }

  // --------------- CARD (shows after delay) ---------------
  function promoCard() {
    const card = document.querySelector("[data-promo-card]");
    if (!card) return;

    const closeBtn = card.querySelector(".c-promo-card-close");

    gsap.delayedCall(SHOW_DELAY, () => {
      gsap.to(card, {
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        onStart: () => (card.style.pointerEvents = "auto"),
      });
    });

    if (!closeBtn) return;

    closeBtn.addEventListener("click", () => {
      card.style.pointerEvents = "none";

      gsap.to(card, {
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => (card.style.display = "none"),
      });
    });
  }

  // --------------- MODAL (shows after delay) ---------------
  function promoModal() {
    const modal = document.querySelector("[data-promo-modal]");
    if (!modal) return;

    const overlay = modal.querySelector(".event-modal-overlay");
    const inner = modal.querySelector(".c-promo-modal-inner");
    const skipBtn = modal.querySelector(".event-modal__skip");
    const closeBtn = modal.querySelector(".c-promo-modal-close");

    let isOpen = false;

    // Block wheel/touch at the window capture phase so any Lenis instance never receives them,
    // even one created by an external script we can't reference
    function blockScroll(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    function lockScroll() {
      window.lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      window.addEventListener("wheel", blockScroll, { capture: true, passive: false });
      window.addEventListener("touchmove", blockScroll, { capture: true, passive: false });
    }

    function unlockScroll() {
      window.lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("wheel", blockScroll, { capture: true });
      window.removeEventListener("touchmove", blockScroll, { capture: true });
    }

    const tl = gsap.timeline({
      paused: true,
      defaults: { duration: 0.6, ease: "power3.out", easeReverse: true },
    });

    tl.to(modal, { opacity: 1, duration: 0.4 });
    tl.fromTo(inner, { y: 40, opacity: 0 }, { y: 0, opacity: 1 }, "<0.1");

    function openModal() {
      if (isOpen) return;
      isOpen = true;

      modal.style.pointerEvents = "auto";
      overlay?.classList.add("is-visible");
      lockScroll();
      tl.play();
    }

    function closeModal() {
      if (!isOpen) return;
      isOpen = false;

      modal.style.pointerEvents = "none";
      overlay?.classList.remove("is-visible");
      unlockScroll();
      tl.reverse();
    }

    gsap.delayedCall(SHOW_DELAY, openModal);

    overlay?.addEventListener("click", closeModal);
    skipBtn?.addEventListener("click", closeModal);
    closeBtn?.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) closeModal();
    });
  }
}
