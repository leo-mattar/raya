export default function blogReadTime() {
  function processCards(cards) {
    cards.forEach((card) => {
      const content = card.querySelector("[data-blog-content]");
      const readTimeEl = card.querySelector("[data-blog-read-time]");
      if (!content || !readTimeEl) return;

      const chars = content.textContent.trim().length;
      const minutes = Math.max(1, Math.round(chars / 1000));
      readTimeEl.textContent = `${minutes}`;
    });
  }

  // Single article page
  const articleContent = document.querySelector("[data-article-content]");
  const articleReadTime = document.querySelector("[data-article-read-time]");
  if (articleContent && articleReadTime) {
    const chars = articleContent.textContent.trim().length;
    articleReadTime.textContent = `${Math.max(1, Math.round(chars / 1000))}`;
  }

  const cards = document.querySelectorAll("[data-blog-card]");
  if (!cards.length) return;

  processCards(cards);

  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    "list",
    (listInstances) => {
      listInstances.forEach((listInstance) => {
        listInstance.addHook("afterRender", (items) => {
          processCards(items.map((item) => item.element));
          return items;
        });
      });
    },
  ]);
}
