# Vierelle Architecture

## Project Overview

This document proposes a scalable, Wix-native component architecture for Vierelle: a luxury beauty ecommerce experience that turns everyday beauty into meaningful rituals.

It is an implementation guide, not a description of an already-built component system. The current repository contains Wix Velo starter files and no custom reusable application code.

Vierelle is a Wix-connected luxury beauty ecommerce site. Its brand promise is to elevate everyday beauty into meaningful rituals. The visual direction is quiet and editorial: Cormorant Garamond for display type, DM Sans for body and controls, warm off-white surfaces, near-black text, and a restrained gold accent. The site should educate and inspire rather than use loud, urgent sales patterns.

## Repository Structure

| Path | Purpose |
| --- | --- |
| `.git/` | Local Git metadata. It is not application source. |
| `.vscode/` | Local editor settings. It is environment-specific. |
| `.wix/` | Locally generated Wix types and project metadata used by the IDE and Local Editor. |
| `assets/` | Project-owned placeholder asset references for icons, images, and logos. These are not currently wired into Velo or Wix Media. |
| `design/` | Brand design references: colors, typography, and the future component inventory. |
| `docs/` | Product and brand documentation. `Brand.md` defines the current brand; `Roadmap.md` is presently empty. |
| `frontend/` | Reserved frontend area; it currently contains no application code. |
| `node_modules/` | Installed development dependencies. Never author application code here. |
| `src/pages/` | Velo page-code files. Each page file corresponds to a page created in Wix and currently contains only the default `$w.onReady()` starter hook. |
| `src/public/` | Shared browser-safe Velo modules, imported from page code as `public/<module>`. It currently contains only Wix guidance. |
| `src/backend/` | Private Velo code, web modules, hooks, routes, event handlers, and permissions. It currently contains only Wix guidance and the default permissions file. |
| `.eslintrc.json` | ESLint configuration for Wix Velo development. |
| `package.json` | Development dependencies and the `wix dev` / lint scripts. |
| `package-lock.json` | npm's resolved dependency lockfile. |
| `wix.config.json` | Connection metadata for the specific Wix site. |
| `wix.lock` | Wix-managed dependency lock data. |
| `ARCHITECTURE.md` | This repository architecture and working guide. |

The 25 synced page files cover store, account, legal, content, popup, and system pages. Page layouts, page routes, and Wix Stores configuration are not represented as hand-authored HTML in this repository; they remain in the connected Wix project.

## Brand principles that shape the system

Vierelle should feel calm, elegant, luxurious, minimal, honest, and intentional. Components should create space for education and discovery instead of pressure to buy.

### Visual foundations

| Foundation | Standard |
| --- | --- |
| Primary canvas | `#FCFAF7` |
| Secondary canvas | `#F6EBDD` |
| Primary text | `#171717` |
| Secondary text | `#666666` |
| Accent | `#B89B6A` |
| Border | `#ECE6DF` |
| Display and headings | Cormorant Garamond |
| Body and controls | DM Sans; DM Sans Medium for buttons |

### Experience rules

- Use restrained editorial composition, generous whitespace, and deliberate image hierarchy.
- Make calls to action clear but quiet: for example, “Discover the ritual” or “Explore the collection.”
- Use education, ingredient context, and ritual guidance before conversion prompts.
- Avoid countdowns, discount-led modules, noisy badges, excessive motion, and competing CTAs.
- Treat accessibility as part of luxury: visible focus states, useful alternative text, sufficient contrast, and meaningful headings.

## Wix Architecture

Wix separates visual composition from Velo behavior. The architecture should respect that boundary.

```text
Wix Editor
  Page sections, grids, native components, responsive layout, global header/footer
        |
        +-- Page Velo code (src/pages/<page>.<id>.js)
        |     Page orchestration and event binding
        |
        +-- Public Velo modules (src/public/)
        |     Reusable client-side presentation and interaction logic
        |
        +-- Backend Velo modules (src/backend/)
              Private integrations, validation, orchestration, and business rules
```

The Editor remains the source of truth for pages, sections, element IDs, breakpoints, themes, and Wix Stores widgets. Velo should enhance existing Editor elements; it should not attempt to construct the whole page or reproduce Wix Stores.

### Wix Local Editor and Velo

Run `npm run dev` (which calls `wix dev`) to launch the Wix Local Editor workflow. Design changes happen in Wix, then sync into the local repository; source-code changes in this repository can be tested through that Local Editor before commit and publish.

Every Wix-created page has a filename in the form `<page name>.<internal id>.js`. Wix uses that filename to associate Velo code with the page, so its name and ID suffix must remain unchanged. The generated `.wix/types/` declarations expose the IDs of elements created in the Editor and give page code type-aware access to `$w`.

There is no local file that defines a page's visual DOM, CSS grid, or route. The Wix Editor owns those concerns. Velo owns behavior, data orchestration, conditional display, and integration code around the Editor-created elements.

## Safe Files to Edit

| Path | Safe use | Important constraint |
| --- | --- | --- |
| `src/pages/*.js` | Add page-specific Velo behavior and `$w.onReady()` orchestration. | Do not rename or move page-code files. Create new page files by creating pages in Wix first. |
| `src/pages/masterPage.js` | Add genuinely global header, footer, menu, accessibility, or shared shell behavior. | The file is currently deleted in this working tree; do not restore or alter it without deciding that is intended. |
| `src/public/` | Add reusable frontend-safe functions and component behavior. | Import using the Wix `public/<module>` alias, not relative paths. |
| `src/backend/` | Add private services, validation, web modules, hooks, routers, events, and HTTP endpoints. | Protect privileged operations and configure public web-module access deliberately. |
| `src/backend/permissions.json` | Update permissions when adding a backend web module. | Follow least privilege; do not expose private methods anonymously by default. |
| `design/` and `docs/` | Maintain brand, component, planning, and implementation documentation. | Keep the design references aligned with Wix Site Styles. |
| `assets/` | Add project-source design assets and reference material. | Upload/select production media through Wix as required; files here are not automatically rendered on the site. |
| `package.json` | Add approved development dependencies or scripts when necessary. | Keep changes deliberate and compatible with Wix tooling. |

## Generated Files

Do not manually edit the following files or directories:

| Path | Why |
| --- | --- |
| `.wix/` | Generated Wix types, metadata, and tooling output. Regenerated by Wix tooling. |
| `jsconfig.json` | Wix-generated project references for generated types. |
| `node_modules/` | Installed packages; regenerate through npm instead of editing. |
| `package-lock.json` | Generated by npm; change it only through dependency installation/update workflows. |
| `wix.lock` | Wix-managed lock data. |
| `wix.config.json` | Site connection metadata; alter only during an intentional Wix-site connection or migration. |

Also avoid manually editing `.git/`, and do not rename, move, or delete files under `src/pages/` to change a Wix page. Make page changes in Wix Editor and sync them instead.

## Component Strategy

Use a four-level component model. Build each visual section from the levels beneath it, and keep any one-off page choreography inside the page code.

```text
Foundations
  └─ Primitives
      └─ Composites
          └─ Page sections
              └─ Page templates
```

### 1. Foundations

Foundations are Editor-managed site styles and documented rules, not JavaScript components.

- Color roles: canvas, surface, ink, muted ink, gold accent, and border.
- Typography roles: hero, display heading, section title, body, caption, eyebrow, and button label.
- Spacing roles: keep a small, consistent scale rather than arbitrary per-section values.
- Image rules: imagery should be soft, textural, and product-led; retain a consistent aspect ratio per placement type.
- Interaction rules: subtle hover/press feedback and reduced-motion-safe animation only.

Record these in the Wix Site Styles panel and keep `design/Colors.md` and `design/Typography.md` aligned with the Editor settings.

### 2. Primitives

Primitives are small, repeatable visual units created with native Wix elements and assigned stable IDs only where code is needed.

| Primitive | Wix implementation | Notes |
| --- | --- | --- |
| Eyebrow | Text | Small DM Sans label; calm, descriptive language. |
| Editorial heading | Text | Cormorant Garamond; preserve heading hierarchy. |
| Body copy | Text | Short, scannable ritual guidance. |
| Text link | Text / button | Use one quiet underline or color treatment consistently. |
| Primary CTA | Button | Ink or restrained gold treatment; one primary action per decision point. |
| Secondary CTA | Button / text link | Lower visual weight than the primary CTA. |
| Product image | Image | Meaningful alt text; consistent crops. |
| Divider | Line / border | Use `#ECE6DF`; avoid decorative clutter. |
| Tag or eyebrow badge | Text in container | Use sparingly for collection or ritual context, not urgency. |

Do not create a code module for a primitive that has no behavior. Site Styles and Editor design are the reusable system for purely visual primitives.

### 3. Composites

Composites combine primitives into recognizable patterns. Create these as reusable Wix sections, Wix Blocks, or copied Editor patterns with the same structure and naming convention.

| Composite | Contents | Primary use |
| --- | --- | --- |
| Editorial intro | Eyebrow, heading, body, optional CTA | Hero and section openings |
| Product card | Image, category, name, price, quiet action | Store/category grids |
| Ritual step | Step number, title, concise guidance, image | Education and routine guidance |
| Ingredient note | Ingredient, benefit, provenance/care copy | Product education |
| Collection feature | Editorial image, copy, CTA | Discovery between product grids |
| Testimonial quote | Quote, attribution, optional product link | Trust without hard selling |
| Journal card | Image, category, title, excerpt | Editorial content |
| Newsletter invitation | Gentle value statement and email form | Footer or low-pressure conversion area |

Use a Wix Repeater for repeated cards. Keep the card’s layout in the Editor and use Velo only for data population, personalization, filtering, or interaction that Wix’s native widgets cannot provide.

### 4. Page sections

Page sections are full-width, business-recognizable modules. They are composed in the Editor and have a small page controller only when they need behavior.

Recommended sections:

- `HeroEditorial`: statement, product/ritual image, one CTA.
- `RitualDiscovery`: a three-step or curated routine introduction.
- `CollectionSpotlight`: one collection with an editorial image and store-backed products.
- `ProductShelf`: a focused repeater or Wix Stores gallery such as New Arrivals, Essentials, or Best Loved.
- `IngredientStory`: transparent product education and sourcing context.
- `EditorialSplit`: image/text storytelling for the brand or a seasonal focus.
- `SocialProofQuiet`: a small quote or press reference, never a busy carousel by default.
- `JournalPreview`: educational articles that deepen ritual knowledge.
- `NewsletterRitual`: thoughtful email invitation with a clear privacy expectation.

### 5. Page templates

Use templates as a composition contract, not as hard-coded page generators.

| Template | Suggested sequence |
| --- | --- |
| Home | HeroEditorial → RitualDiscovery → CollectionSpotlight → ProductShelf → IngredientStory → JournalPreview → NewsletterRitual |
| Collection | Editorial intro → Wix Stores category/gallery → Collection feature → Ingredient or ritual note |
| Product | Wix Stores product area → ritual steps → ingredient education → complementary products → FAQ |
| Our Story | Editorial hero → mission/approach → ingredient or sourcing principles → journal/CTA |
| Journal article | Editorial header → rich article body → related ritual/product links → newsletter invitation |

## Recommended repository structure

The following structure is proposed for future Velo work. Do not create a page-code file locally: page files must originate from a Wix Editor page and then sync to the repository.

```text
src/
  pages/
    masterPage.js                    # Global shell behavior only
    Home.<wix-id>.js                 # Page composition/orchestration
    Shop.<wix-id>.js                 # Shop-specific orchestration
    Product Page.<wix-id>.js         # Product-page enhancement only
    ...
  public/
    components/
      disclosure.js                  # Accessible expand/collapse behavior
      product-card.js                # Product card binding/enhancement
      ritual-steps.js                # Reusable ritual-step interactions
      newsletter-form.js             # Client-side form state only
    ui/
      animation.js                   # Small, reduced-motion-aware transitions
      accessibility.js               # Focus and interaction helpers
      formatters.js                  # Price, labels, and copy formatting
    services/
      catalog.js                     # Frontend-safe catalog queries
      content.js                     # Frontend-safe CMS queries
    config/
      site.js                        # Non-secret route and UI constants
  backend/
    services/
      catalog.js                     # Private catalog/inventory orchestration
      crm.js                         # Email/CRM integration adapter
      content.js                     # Privileged CMS operations, if required
    validators/
      newsletter.js                  # Input validation and normalization
    web-modules/
      newsletter.jsw                 # Minimal public API for signup
      recommendations.jsw            # Optional curated recommendation API
    data.js                          # CMS hooks, only when business rules require them
    events.js                        # Wix event handling, only when needed
    permissions.json                 # Explicit least-privilege web-module access
design/
  Colors.md
  Typography.md
  Components.md                      # Component inventory and visual contracts
docs/
  Brand.md
  Roadmap.md
ARCHITECTURE.md                      # This document
```

The exact nested directory support should be verified in the connected Wix project before adoption. If the Velo environment does not support the desired nested import path, keep the same logical module names in a flatter `src/public/` or `src/backend/` structure.

## Responsibilities by layer

### Wix Editor

- Create and arrange sections, containers, repeaters, native Wix Stores widgets, and responsive breakpoints.
- Define element IDs only for elements needing Velo behavior.
- Maintain Site Styles, shared header/footer, navigation, and visual accessibility.
- Create new pages and sync their generated code files before implementation begins.

### Page code: `src/pages/`

- Run `$w.onReady()` page orchestration.
- Bind events to the current page’s IDs.
- Initialize public component modules.
- Coordinate page-specific data and URL state.
- Contain no duplicated cross-page utility logic.

Keep page files thin. A page controller should read like composition: initialize hero, wire filters, bind disclosures, and invoke services.

### Public code: `src/public/`

- Hold reusable browser-safe modules.
- Receive element references or IDs and return predictable behavior.
- Avoid secrets, privileged operations, and direct undocumented external API calls.
- Keep modules narrow and independently testable where practical.

### Backend code: `src/backend/`

- Store private integration logic, validation, and privileged data access.
- Expose only small, purpose-built methods through `.jsw` modules.
- Validate all externally supplied input on the server.
- Configure `permissions.json` with least privilege; anonymous access only for methods that genuinely need it, such as a validated newsletter request.

## Data and commerce model

Use Wix Stores as the system of record for products, categories, cart, checkout, orders, and the standard product experience. Do not duplicate core commerce records in a custom CMS collection.

Use Wix CMS collections for editorial data that sits around commerce:

| Collection | Purpose | Example fields |
| --- | --- | --- |
| Rituals | Curated multi-product routines | title, mood, steps, products, hero image, SEO copy |
| Ingredients | Educational ingredient library | name, overview, benefits, sourcing, caution, image |
| Journal | Editorial education | title, slug, author, body, related products, hero image |
| Collection Stories | Narrative context for store collections | collection reference, intro, image, feature copy |
| Testimonials | Approved social proof | quote, name/initials, related product, consent status |

Prefer references from editorial records to Wix Stores products/categories rather than copied product names, prices, and images. This prevents catalog drift.

## Naming and ID conventions

Use readable, stable IDs for any Editor element addressed by Velo.

```text
sectionHero
heroHeading
heroCta
repeaterProductShelf
productCardImage
productCardName
buttonProductCard
accordionIngredients
formNewsletter
inputNewsletterEmail
buttonNewsletterSubmit
textNewsletterStatus
```

Rules:

- Prefix by role: `section`, `repeater`, `button`, `text`, `image`, `input`, `form`, `accordion`.
- Name by meaning, never by position or visual styling.
- Keep IDs unique within their relevant Editor scope.
- Do not rename synced page-code filenames or their Wix ID suffixes.
- Document reusable section IDs and contracts in `design/Components.md` as they are introduced.

## Page and global behavior

### Master page

`masterPage.js` should be limited to behavior shared across the site:

- Header state and navigation behavior.
- Accessible menu toggling.
- Cart indicator enhancement when needed.
- Global newsletter or consent affordances, if they truly appear everywhere.
- Minimal site-wide accessibility behavior.

It should not contain page-specific product grids, marketing copy, or long-running data queries.

### Home page

The home page should be an editorial sequence of Editor-managed sections. Its controller should only initialize interactive sections and fetch CMS-backed editorial content when native Wix data connections are insufficient.

### Shop, collection, and product pages

Favor Wix Stores’s native behavior for purchase flow. Velo enhancements should focus on ritual education, collection storytelling, complementary products, filters, and accessible disclosure content—not a parallel cart or checkout.

## Development Workflow

1. Start with product/design intent. Use ChatGPT for exploration, brand-aligned copy, user flows, data-model ideas, and a clear acceptance checklist. Treat its output as a proposal to review, not as site state.
2. Use Codex to inspect the repository, make scoped documentation or code changes, explain impact, and run proportionate checks. Give it the exact files or outcome in scope; it should not rename Wix page files or make unrequested Editor changes.
3. For a new visual section, build it in Wix Local Editor with native Wix components and Site Styles. Define responsive behavior, heading structure, and accessibility before adding Velo.
4. Assign semantic element IDs only to elements that need behavior. If a page is new, create it in Wix first and sync so Wix creates the page-code file.
5. Implement behavior in the thin page controller, then extract only repeatable browser-safe behavior to `src/public/`. Put secrets, validation, and privileged integrations in `src/backend/`.
6. Run `npm run dev` and test in Wix Local Editor at every breakpoint, with keyboard navigation, appropriate empty/error states, and the intended commerce flow.
7. Review the Git diff before committing. Commit focused changes with a clear message, push to GitHub, and use the connected branch/preview process to validate the Wix site before publication.
8. Publish only after the Wix preview reflects both the Editor design and the committed Velo code. Record durable system decisions in `design/` or `docs/` so later collaborators and ChatGPT/Codex sessions begin with accurate context.

## Guardrails for scalability

- Keep visual reuse in Wix Blocks/reusable Editor sections; keep behavioral reuse in `src/public/`.
- Avoid a single large `masterPage.js` or a catch-all utilities file.
- Avoid putting API keys or secret integration logic in page/public code.
- Avoid code-driven layout reconstruction; let Wix own layout and responsive behavior.
- Use CMS data for repeatable editorial content and Wix Stores for commerce data.
- Add a component only when it has a stable, repeated purpose; otherwise keep it local to its page.
- Favor calm defaults: one primary CTA, purposeful motion, and no conversion pattern that conflicts with the brand voice.

## Current-project adoption order

1. Establish the Wix Site Styles from the documented color and typography foundations.
2. Inventory the existing Editor sections and record them in `design/Components.md`.
3. Confirm which Editor page is the default home page; this repository does not identify that route.
4. Create the first reusable editorial section patterns in the Editor.
5. Add `src/public/` modules only as concrete cross-page behavior emerges.
6. Introduce CMS collections for rituals, ingredients, and journal content when editorial content needs to scale.
7. Add backend integrations behind minimal, validated web-module interfaces.

This sequence keeps the system aligned with Wix’s strengths while preserving a coherent Vierelle experience as the catalog and editorial library grow.
