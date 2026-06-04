export default function flowState() {
  const root = document.querySelector(".mwg020");
  if (!root) return;

  const images = [];
  root.querySelectorAll(".mwg020-media").forEach((image) => {
    images.push(image.getAttribute("src"));
  });

  let incr = 0,
    oldIncrX = 0,
    oldIncrY = 0,
    resetDist = window.innerWidth / 8,
    indexImg = 0;

  root.addEventListener(
    "mousemove",
    (e) => {
      oldIncrX = e.clientX;
      oldIncrY = e.clientY;
    },
    { once: true },
  );

  root.addEventListener("mousemove", handleMouseMove);

  let oldTouchX = 0,
    oldTouchY = 0,
    touchIncr = 0;

  function handleTouchStart(e) {
    const touch = e.touches[0];
    oldTouchX = touch.clientX;
    oldTouchY = touch.clientY;
    touchIncr = 0;
  }

  function handleTouchMove(e) {
    const touch = e.touches[0];
    const valX = touch.clientX;
    const valY = touch.clientY;

    touchIncr += Math.abs(valX - oldTouchX) + Math.abs(valY - oldTouchY);

    if (touchIncr > resetDist) {
      touchIncr = 0;
      createMedia(
        valX,
        valY - root.getBoundingClientRect().top,
        valX - oldTouchX,
        valY - oldTouchY,
      );
    }

    oldTouchX = valX;
    oldTouchY = valY;
  }

  root.addEventListener("touchstart", handleTouchStart, { passive: true });
  root.addEventListener("touchmove", handleTouchMove, { passive: true });

  function handleMouseMove(e) {
    const valX = e.clientX;
    const valY = e.clientY;

    incr += Math.abs(valX - oldIncrX) + Math.abs(valY - oldIncrY);

    if (incr > resetDist) {
      incr = 0;
      createMedia(
        valX,
        valY - root.getBoundingClientRect().top,
        valX - oldIncrX,
        valY - oldIncrY,
      );
    }

    oldIncrX = valX;
    oldIncrY = valY;
  }

  function createMedia(x, y, deltaX, deltaY) {
    const image = document.createElement("img");

    image.classList.add("created-img");
    image.setAttribute("src", images[indexImg]);
    root.appendChild(image);

    const tl = gsap.timeline({
      onComplete: () => {
        root.removeChild(image);
        tl && tl.kill();
      },
    });

    tl.fromTo(
      image,
      {
        xPercent: -50 + (Math.random() - 0.5) * 80,
        yPercent: -50 + (Math.random() - 0.5) * 10,
        scaleX: 1.3,
        scaleY: 1.3,
      },
      {
        scaleX: 1,
        scaleY: 1,
        ease: "elastic.out(2, 0.6)",
        duration: 0.6,
      },
    );

    tl.fromTo(
      image,
      {
        x,
        y,
        rotation: (Math.random() - 0.5) * 20,
      },
      {
        x: "+=" + deltaX * 4,
        y: "+=" + deltaY * 4,
        rotation: (Math.random() - 0.5) * 20,
        ease: "power4.out",
        duration: 1.5,
      },
      "<",
    );

    tl.to(image, {
      duration: 0.8,
      scale: 0.5,
      delay: 0.4,
      ease: "back.in(1.5)",
    });

    indexImg = (indexImg + 1) % images.length;
  }

  // KILL
  const observer = new MutationObserver((mutations) => {
    const isRootRemoved = mutations.some(
      (mutation) =>
        mutation.type === "childList" &&
        Array.from(mutation.removedNodes).includes(root),
    );

    if (isRootRemoved) {
      root.removeEventListener("mousemove", handleMouseMove);
      root.removeEventListener("touchstart", handleTouchStart);
      root.removeEventListener("touchmove", handleTouchMove);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
