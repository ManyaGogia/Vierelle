/**
 * Vierelle Feature Cards web component.
 *
 * The component has no framework dependency and renders semantic HTML inside
 * a shadow root. It uses the three Vierelle feature cards by default, but the
 * cards attribute can accept a JSON array for future reuse.
 */
(function registerFeatureCards() {
  "use strict";

  const DEFAULT_CARDS = [
    {
      title: "Deep Hydration",
      description:
        "Distributes water or scalp serum evenly for a refreshing hair ritual."
    },
    {
      title: "Scalp Massage",
      description:
        "Flexible silicone bristles provide a relaxing massage while cleansing."
    },
    {
      title: "Easy Cleaning",
      description:
        "Removable brush head makes rinsing and maintenance effortless."
    }
  ];

  class VierelleFeatureCards extends HTMLElement {
    static get observedAttributes() {
      return ["cards", "stylesheet-url"];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback(name) {
      // An updated cards attribute supersedes any cards supplied through the
      // JavaScript property on an earlier render.
      if (name === "cards") {
        this._cards = undefined;
      }

      // Avoid rendering before the element is connected to the document.
      if (this.isConnected) {
        this.render();
      }
    }

    /**
     * Allows JavaScript consumers to supply cards without setting an HTML
     * attribute. Input is normalized so DOM content is always created safely.
     */
    set cards(value) {
      this._cards = this.normalizeCards(value);
      if (this.isConnected) {
        this.render();
      }
    }

    get cards() {
      return this._cards || this.cardsFromAttribute();
    }

    cardsFromAttribute() {
      const cardsAttribute = this.getAttribute("cards");

      if (!cardsAttribute) {
        return DEFAULT_CARDS;
      }

      try {
        return this.normalizeCards(JSON.parse(cardsAttribute));
      } catch (error) {
        console.warn(
          "[vierelle-feature-cards] The cards attribute is not valid JSON. Using default cards.",
          error
        );
        return DEFAULT_CARDS;
      }
    }

    normalizeCards(value) {
      if (!Array.isArray(value) || value.length === 0) {
        return DEFAULT_CARDS;
      }

      return value.map((card) => ({
        title: String(card && card.title ? card.title : ""),
        description: String(card && card.description ? card.description : "")
      }));
    }

    render() {
      const root = this.shadowRoot;
      root.replaceChildren();

      // Load the separate component stylesheet in the shadow root.
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = this.getAttribute("stylesheet-url") || "FeatureCards.css";
      root.append(stylesheet);

      const section = document.createElement("section");
      section.className = "feature-cards";
      section.setAttribute("aria-label", "Product features");

      const grid = document.createElement("div");
      grid.className = "feature-cards__grid";

      this.cards.forEach((card) => {
        const article = document.createElement("article");
        article.className = "feature-card";

        const title = document.createElement("h3");
        title.className = "feature-card__title";
        title.textContent = card.title;

        const description = document.createElement("p");
        description.className = "feature-card__description";
        description.textContent = card.description;

        article.append(title, description);
        grid.append(article);
      });

      section.append(grid);
      root.append(section);
    }
  }

  // Register once so the file can safely be loaded more than once by a host.
  if (!customElements.get("vierelle-feature-cards")) {
    customElements.define("vierelle-feature-cards", VierelleFeatureCards);
  }
})();
