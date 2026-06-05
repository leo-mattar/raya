export default function TribeCards() {
  initEffect();

  function initEffect() {
      const root = document.querySelector(".mwg025");
      if (!root) return;
      const container = root.querySelector(".mwg025-container");
      const containerW = container.clientWidth;

      const cards = root.querySelectorAll(".mwg025-card");
      const cardsLength = cards.length;

      const cardContent = root.querySelectorAll(".mwg025-card-content");

      let currentPortion = 0;

      cards.forEach((card) => {
        gsap.set(card, {
          xPercent: (Math.random() - 0.5) * 10,
          yPercent: (Math.random() - 0.5) * 10,
          rotation: (Math.random() - 0.5) * 20,
        });
      });

      container.addEventListener("mousemove", handleMouseMove);
      function handleMouseMove(e) {
        const mouseX = e.clientX - container.getBoundingClientRect().left;
        const percentage = mouseX / containerW;
        const activePortion = Math.ceil(percentage * cardsLength);

        if (
          currentPortion !== activePortion &&
          activePortion > 0 &&
          activePortion <= cardsLength
        ) {
          if (currentPortion !== 0) {
            resetPortion(currentPortion - 1);
          }

          currentPortion = activePortion;
          newPortion(currentPortion - 1);
        }
      }

      container.addEventListener("mouseleave", handleMouseLeave);
      function handleMouseLeave(e) {
        resetPortion(currentPortion - 1);
        currentPortion = 0;

        gsap.to(cardContent, {
          xPercent: 0,
          ease: "elastic.out(1, 0.75)",
          duration: 0.8,
        });
      }

      function resetPortion(index) {
        gsap.to(cards[index], {
          xPercent: (Math.random() - 0.5) * 10,
          yPercent: (Math.random() - 0.5) * 10,
          rotation: (Math.random() - 0.5) * 20,
          scale: 1,
          duration: 0.8,
          ease: "elastic.out(1, 0.75)",
        });
      }

      function newPortion(i) {
        gsap.to(cards[i], {
          xPercent: 0,
          yPercent: 0,
          rotation: 0,
          duration: 0.8,
          scale: 1.1,
          ease: "elastic.out(1, 0.75)",
        });

        cardContent.forEach((cardContent, index) => {
          if (index !== i) {
            gsap.to(cardContent, {
              xPercent: 80 / (index - i),
              ease: "elastic.out(1, 0.75)",
              duration: 0.8,
            });
          } else {
            gsap.to(cardContent, {
              xPercent: 0,
              ease: "elastic.out(1, 0.75)",
              duration: 0.8,
            });
          }
        });
      }

      // MOBILE SLIDER
      let mobileCleanup = null;

      function mobileCards() {
        let draggable = null;
        let track = null;
        let snapPoints = [];
        let currentIndex = -1;
        let cardRotations = [];

        function computeRotations() {
          cardRotations = Array.from(cards).map((_, i) => {
            const dir = i % 2 === 0 ? 1 : -1;
            return dir * (3 + Math.random() * 5);
          });
        }

        function getSnapPoints() {
          const containerW = container.offsetWidth;
          return Array.from(cards).map((card) => {
            return -card.offsetLeft + (containerW - card.offsetWidth) / 2;
          });
        }

        function updateActive(index) {
          if (index === currentIndex) return;
          currentIndex = index;

          cards.forEach((card, i) => {
            const isActive = i === index;
            card.classList.toggle("is-active", isActive);
            gsap.set(card, { zIndex: isActive ? 2 : 0 });
            const overlay = card.querySelector(".mwg025-card-overlay");
            if (overlay) overlay.style.opacity = isActive ? "0" : "1";
            gsap.to(card, {
              rotation: isActive ? 0 : cardRotations[i],
              duration: 0.6,
              ease: "elastic.out(1, 0.75)",
            });
          });
        }

        function updateFromDrag() {
          if (!track) return;
          const x = gsap.getProperty(track, "x");
          let closestIndex = 0;
          let closestDist = Infinity;
          snapPoints.forEach((snap, i) => {
            const dist = Math.abs(x - snap);
            if (dist < closestDist) {
              closestDist = dist;
              closestIndex = i;
            }
          });
          updateActive(closestIndex);
        }

        function activate() {
          if (track) return;
          gsap.set(cards, { clearProps: "xPercent,yPercent,scale" });
          container.removeEventListener("mousemove", handleMouseMove);
          container.removeEventListener("mouseleave", handleMouseLeave);

          cards.forEach((card) => {
            if (!card.querySelector(".mwg025-card-overlay")) {
              const overlay = document.createElement("div");
              overlay.className = "mwg025-card-overlay";
              Object.assign(overlay.style, {
                position: "absolute",
                inset: "0",
                background: "rgba(0,0,0,0.5)",
                pointerEvents: "none",
                transition: "opacity 0.4s ease",
                zIndex: "1",
              });
              card.appendChild(overlay);
            }
          });

          track = document.createElement("div");
          track.className = "mwg025-track";
          Object.assign(track.style, { display: "flex", willChange: "transform" });
          Array.from(cards).forEach((card) => track.appendChild(card));
          container.style.overflow = "hidden";
          container.appendChild(track);

          computeRotations();

          requestAnimationFrame(() => {
            snapPoints = getSnapPoints();
            gsap.set(track, { x: snapPoints[0] });

            draggable = Draggable.create(track, {
              type: "x",
              inertia: true,
              snap: { x: snapPoints },
              bounds: {
                minX: snapPoints[snapPoints.length - 1],
                maxX: snapPoints[0],
              },
              onDrag: updateFromDrag,
              onThrowUpdate: updateFromDrag,
              onThrowComplete: updateFromDrag,
            })[0];

            updateActive(0);
          });
        }

        function deactivate() {
          if (!track) return;
          if (draggable) {
            draggable.kill();
            draggable = null;
          }
          Array.from(cards).forEach((card) => container.appendChild(card));
          track.remove();
          track = null;
          snapPoints = [];
          currentIndex = -1;
          container.style.overflow = "";
          cards.forEach((card) => {
            card.classList.remove("is-active");
            const overlay = card.querySelector(".mwg025-card-overlay");
            if (overlay) overlay.remove();
            gsap.set(card, { clearProps: "zIndex,rotation" });
          });
          container.addEventListener("mousemove", handleMouseMove);
          container.addEventListener("mouseleave", handleMouseLeave);
          cards.forEach((card) => {
            gsap.set(card, {
              xPercent: (Math.random() - 0.5) * 10,
              yPercent: (Math.random() - 0.5) * 10,
              rotation: (Math.random() - 0.5) * 20,
            });
          });
        }

        function handleResize() {
          if (window.innerWidth <= 991) {
            activate();
          } else {
            deactivate();
          }
        }

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
          if (draggable) draggable.kill();
          window.removeEventListener("resize", handleResize);
          if (track) {
            Array.from(cards).forEach((card) => container.appendChild(card));
            track.remove();
          }
          container.style.overflow = "";
          cards.forEach((card) => {
            card.classList.remove("is-active");
            const overlay = card.querySelector(".mwg025-card-overlay");
            if (overlay) overlay.remove();
          });
        };
      }

      mobileCleanup = mobileCards();

      // KILL
      const observer = new MutationObserver((mutations) => {
        const isRootRemoved = mutations.some(
          (mutation) =>
            mutation.type === "childList" &&
            Array.from(mutation.removedNodes).includes(root),
        );

        if (isRootRemoved) {
          container.removeEventListener("mousemove", handleMouseMove);
          container.removeEventListener("mouseleave", handleMouseLeave);
          if (mobileCleanup) mobileCleanup();
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
}
