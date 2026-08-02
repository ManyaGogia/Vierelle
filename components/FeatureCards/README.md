<<<<<<< HEAD
# FeatureCards

`FeatureCards` is a framework-free Web Component for the Vierelle luxury beauty site. It displays three editorial feature cards with a responsive grid and the required hover treatment.

## Included defaults

1. **Deep Hydration** - Distributes water or scalp serum evenly for a refreshing hair ritual.
2. **Scalp Massage** - Flexible silicone bristles provide a relaxing massage while cleansing.
3. **Easy Cleaning** - Removable brush head makes rinsing and maintenance effortless.

## Files

| File | Role |
| --- | --- |
| `FeatureCards.html` | Local browser preview and usage example. |
| `FeatureCards.css` | Shadow-DOM-aware styles, responsive grid, hover state, and reduced-motion support. |
| `FeatureCards.js` | The `vierelle-feature-cards` custom-element definition. |
| `README.md` | Setup and Wix embedding guidance. |

## Local preview

Serve this directory from a local static server, then open `FeatureCards.html`. Serving it avoids browser restrictions around linked files that can occur when opening files directly from disk.

The preview is intentionally plain outside the component. The component supplies its own background, typography, spacing, cards, and responsive behavior.

## Embed in Wix Custom Element

Wix Custom Elements load a JavaScript file from a publicly accessible HTTPS URL. The component is deliberately framework-free so it can be hosted as a static asset.

1. Host `FeatureCards.js` and `FeatureCards.css` at stable public HTTPS URLs. Keep both files together, or note the absolute CSS URL.
2. In Wix Editor, enable Velo if it is not already enabled.
3. Add **Custom Element** to the target Wix section.
4. In the Custom Element settings, set the JavaScript URL to the hosted `FeatureCards.js` URL.
5. Set the tag name to `vierelle-feature-cards`.
6. In the element's attributes/properties settings, add this attribute so the component can load its separate stylesheet:

   ```text
   stylesheet-url=https://your-static-domain.example/components/FeatureCards/FeatureCards.css
   ```

7. Give the Wix Custom Element a deliberate full-width size and height appropriate to its content. Preview it at desktop and mobile breakpoints.

The custom element defaults to the three required Vierelle cards. No attribute is needed for the initial use case.

## Optional reusable card data

For a future variant, pass a JSON `cards` attribute containing objects with `title` and `description` properties:

```html
<vierelle-feature-cards
  stylesheet-url="https://your-static-domain.example/components/FeatureCards/FeatureCards.css"
  cards='[
    {"title":"First feature","description":"A concise description."},
    {"title":"Second feature","description":"A concise description."}
  ]'
></vierelle-feature-cards>
```

The component creates text with DOM APIs rather than interpolating HTML, so titles and descriptions are rendered as text.

## Wix implementation notes

- Use the custom element for this isolated component only. Keep page layout, surrounding sections, and responsive page composition in Wix Local Editor.
- Ensure Cormorant Garamond and DM Sans are configured in Wix Site Styles or otherwise available to the published site.
- The component's CSS has desktop (three-column), tablet (two-column), and mobile (one-column) layouts.
- Hover motion is enabled only on fine pointers. Visitors who prefer reduced motion receive no transition.
- Do not embed essential page headings or primary navigation inside the component; Wix should retain the page's semantic heading structure.
=======

>>>>>>> 51a9d6483145f70c889703b181992015038a1f98
