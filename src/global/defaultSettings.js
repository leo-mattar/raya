export default function defaultSettings() {
  // --- DEFAULTS
  gsap.config({
    nullTargetWarn: false,
    trialWarn: false,
  });

  window.addEventListener("beforeunload", function () {
    history.scrollRestoration = "manual";
  });

  // --- PAPER TIGET SIGNATURE
  const pprtgr = [
    "color: #F2F3F3",
    "background: #080808",
    "font-size: 12px",
    "padding-left: 10px",
    "line-height: 2",
    "border-left: 5px solid #ff3c31",
  ].join(";");
  console.info(
    `

%cWebsite by Paper Tiger${" "}
www.papertiger.com${"     "}

`,
    pprtgr
  );

  // --- CURRENT YEAR
  const currentYear = document.querySelector("[current-year]");
  if (currentYear) {
    currentYear.innerHTML = new Date().getFullYear();
  }
}
