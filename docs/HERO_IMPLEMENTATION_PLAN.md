# Vierelle Homepage Hero Implementation Plan

## Decision

Build the first Vierelle homepage hero with native Wix elements in Wix Local Editor, enhanced only where needed with small Velo behavior. Do not build the hero as a custom element or standalone React/HTML application.

This is the best fit for the current project because Wix owns the page layout, responsive breakpoints, site styles, navigation, and commerce integration. A native hero will remain editable by the brand team, work naturally with Wix SEO and accessibility controls, and preserve the refined, quiet experience defined by the Vierelle brand.

Use a hybrid approach only for a narrowly scoped enhancement that Wix cannot deliver well, such as a bespoke decorative animation or an interactive visual with a clear fallback. The surrounding hero composition must remain native Wix.

## Experience Goal

The hero should introduce Vierelle as a calm, editorial beauty destination. It should lead with one clear idea, one considered image or short ambient visual, and one primary action. It should feel like an invitation into a ritual, not a promotional banner.

Recommended content hierarchy:

1. Optional eyebrow: collection, season, or ritual context.
2. One display headline in Cormorant Garamond.
3. One short supporting paragraph in DM Sans.
4. One primary CTA, such as `Discover the ritual` or `Explore the collection`.
5. Optional secondary text link only when it provides a genuinely different path.
6. One art-directed image or short muted video that supports the story without competing with it.

The hero should avoid discount language, countdowns, auto-playing sound, stacked promotion badges, and more than one visually dominant CTA.

## Recommended Architecture

```text
Wix Local Editor
  Homepage Hero section
    Layout containers, text, buttons, image/video, site styles
    Responsive desktop and mobile arrangements
        |
        +-- Homepage page code (only when interaction is required)
              |
              +-- src/public/hero.js (only when behavior is reused)
```

### Native Wix elements: the default

Create the hero as a dedicated, full-width Wix section using native components:

- A section with the primary background color `#FCFAF7`.
- A responsive content container for eyebrow, heading, body, and CTA.
- A native Wix Image as the default visual medium; use a Wix Video only when motion is essential to the story.
- Native Wix Buttons for actions and native Text for editorial copy.
- A separate decorative layer only if it is non-essential and can be hidden without affecting the content.

Use Wix Site Styles for Cormorant Garamond, DM Sans, colors, button treatments, and global spacing rules. This keeps the hero consistent with future collection and editorial pages without duplicating visual definitions in code.

### When a custom element is appropriate

A custom element is not the right starting point. It creates a separate rendering, accessibility, responsive, and maintenance surface and weakens the brand team's ability to update the hero in Wix.

Consider one only after the native version is complete and only if all of the following are true:

- The proposed effect cannot be built with Wix native elements and subtle Velo enhancement.
- The effect materially improves storytelling rather than adding decoration.
- It has an accessible, static native fallback.
- Its performance budget, mobile behavior, analytics, and content-editing ownership are specified.

Examples that might justify a small custom element later are a product texture exploration or an interactive ingredient visualization. A heading, CTA, image composition, image reveal, or normal transition does not justify one.

## Wix Local Editor Build Specification

Create the section in the actual Wix homepage, then sync the design change. Do not create a page-code file manually from the IDE.

Suggested Editor element IDs, assigned only if Velo behavior will be added:

```text
sectionHero
containerHeroContent
textHeroEyebrow
textHeroHeading
textHeroBody
buttonHeroPrimary
linkHeroSecondary
imageHeroVisual
videoHeroVisual
```

Only one of `imageHeroVisual` or `videoHeroVisual` should be active for a given hero variant. Do not give decorative elements IDs unless code needs to address them.

The section should be built as a reusable pattern, documented later in `design/Components.md` as `HeroEditorial`. Its first implementation should remain static in structure and easy to update in Wix.

## Code Placement and Responsibilities

### No code for the initial static hero

If the hero has standard CTA links, native image/video presentation, and no conditional behavior, it needs no Velo code. This is preferred.

### Homepage page code

If the hero requires page-specific behavior, add only orchestration to the page file that Wix created for the homepage under `src/pages/`. Examples include a one-time entrance sequence, a simple content state, or a CTA analytics hook.

The page file must keep its exact Wix-generated filename and internal ID suffix. The repository currently does not identify a `Home.*.js` file, so confirm the default homepage in Wix before adding behavior.

### Reusable public module

Create `src/public/hero.js` only once the same behavior is needed by more than one hero or page. It should contain small browser-safe helpers, for example a reduced-motion-aware entrance coordinator. Page files would import it using the Wix alias:

```js
import { initializeHero } from 'public/hero';
```

Do not place hero copy, asset URLs, secrets, or product business rules in this module.

### Backend

The hero does not need backend code initially. Add backend code only if future content is sourced from a protected integration or needs server-side validation. Standard Wix CMS content and Wix Stores links should not require a custom backend layer.

## Asset Strategy

### Source assets in the repository

Keep original, licensed source artwork under an organized project-owned asset convention, proposed for future use:

```text
assets/
  images/
    hero/
      hero-ritual-01-master.ext
      hero-ritual-01-mobile-master.ext
  video/
    hero/
      hero-ritual-01-master.ext
  logos/
  icons/
```

The current `assets/` entries are placeholders and are not automatically published by Wix. Preserve source files, rights information, and the original high-resolution version outside the rendered Wix page.

### Production media in Wix

Upload the approved, optimized hero image or video through Wix Media Manager and select it in the Editor. Wix Media should be the production reference used by the native hero element.

For every asset, record:

- A descriptive media name, for example `vierelle-hero-ritual-01-desktop`.
- Creator, license, and usage expiration where relevant.
- Alt text for meaningful images. Decorative images should be marked decorative rather than given redundant alt text.
- A mobile crop or focal-point decision.
- The associated hero version/season.

### Image and video guidance

- Prefer a single editorial still image for the first hero. It is faster, calmer, and easier to art direct.
- Use a short, silent, compressed video only when it communicates a ritual more effectively than a still image.
- Never rely on text embedded in imagery; all essential messaging must remain native text.
- Prepare separate desktop and mobile crops when one crop cannot preserve both the product and the intended negative space for copy.

## Responsive Behavior

Responsive behavior belongs in Wix Local Editor, not in viewport-detection code.

### Desktop and wide tablet

- Use a two-column editorial composition when the image and copy need equal presence.
- Align text to a controlled content width; do not allow an oversized heading to span the entire viewport.
- Preserve quiet negative space around the product or visual focal point.
- Keep the CTA close to the explanatory copy rather than detached at the edge of the section.

### Mobile

- Recompose the section vertically rather than merely shrinking the desktop layout.
- Place the meaningful content and CTA before non-essential decorative media when that improves clarity.
- Use a dedicated mobile crop or focal point when necessary.
- Maintain comfortable tap targets and readable body text without requiring zoom.
- Avoid mobile-only decorative motion that delays the content.

### Implementation rules

- Use Wix containers, stacks, and the responsive Editor controls as the first choice.
- Test the real design at Wix's desktop and mobile breakpoints, plus intermediate widths available in Local Editor.
- Duplicate only a small media group for separate desktop/mobile art direction when one native image cannot support both crops. Hide the alternate group at the other breakpoint and ensure it is decorative or has appropriate accessibility treatment.
- Do not maintain two copies of essential heading, CTA, or body copy solely for breakpoints; it creates content drift and accessibility risk.

## Animation Strategy

Animation should reinforce a measured, premium rhythm. It must never prevent a visitor from seeing or using the hero.

### First release

Use no animation unless it adds clear value. A strong still composition is the baseline and must look complete before animation is considered.

### Approved enhancement pattern

If animation is approved, use a single short entrance sequence after the hero is ready:

1. Hero visual fades in subtly.
2. Eyebrow, heading, and body appear with a restrained stagger.
3. CTA appears last but within the same brief sequence.

Keep motion calm, short, and non-blocking. Do not use looping text effects, scroll-jacking, parallax that shifts essential content, autoplay audio, or attention-seeking CTA motion.

### Technical approach

- Prefer Wix native entrance effects when they achieve the desired result.
- If sequencing is needed, keep it in the homepage page code and use a reusable `src/public/hero.js` helper only after a second use case exists.
- Respect reduced-motion preferences. The reduced-motion experience should render the final static state immediately.
- Do not hide hero copy while waiting on an image, video, animation library, or data request.
- Test performance and interaction on mobile. A hero animation should never delay the first meaningful content or CTA.

## Accessibility and Performance Acceptance Criteria

The hero is ready to implement only when it meets these conditions:

- One semantic page heading is present and the heading hierarchy remains logical.
- Copy and CTA remain readable against every media crop and overlay.
- The primary CTA is keyboard reachable, has a clear label, and has a visible focus state.
- Meaningful imagery has useful alt text; decorative imagery is appropriately marked decorative.
- The layout and content remain usable when image/video loading is slow or fails.
- Essential content does not depend on animation, hover, or autoplay.
- Video, if used, is muted by default and offers a non-video fallback.
- The hero is validated at desktop and mobile breakpoints, with keyboard navigation and reduced motion.

## Future Hero Updates

### Content ownership

For the first version, update hero copy, CTA destination, and media directly in the Wix Editor. This keeps simple seasonal changes in the hands of the content/design team without a code release.

Do not hard-code campaign copy, media URLs, or CTA URLs in Velo.

### When to move to Wix CMS

Move hero content to a Wix CMS collection only when there is a real operating need: scheduled seasonal rotations, market-specific hero variants, multiple campaigns, localization, or non-developer editorial ownership at scale.

Proposed future collection: `HomepageHero`.

| Field | Purpose |
| --- | --- |
| `title` | Internal, descriptive campaign name |
| `eyebrow` | Optional context label |
| `heading` | Native-text hero headline |
| `body` | Supporting copy |
| `primaryLabel` | Primary CTA label |
| `primaryLink` | CTA link or internal route |
| `secondaryLabel` | Optional secondary CTA label |
| `secondaryLink` | Optional secondary CTA route |
| `desktopMedia` | Approved desktop image/video reference |
| `mobileMedia` | Approved mobile crop/reference |
| `altText` | Accessible image description when meaningful |
| `startDate` / `endDate` | Optional scheduling window |
| `status` | Draft, scheduled, active, archived |

Keep one active hero selected by an explicit status or editorial reference. Do not rely on ambiguous ordering alone.

### Change process

1. Create the new visual and copy using Vierelle's editorial and accessibility standards.
2. Review mobile and desktop crops in Wix Local Editor.
3. Update the hero in the Editor for simple changes, or update the approved CMS record once the CMS model exists.
4. Verify CTA destination, alt text, focus behavior, and reduced-motion behavior.
5. Preview in Wix and publish only after approval.
6. Archive the prior asset/content record with campaign dates and rights information.

## Implementation Sequence (No Production Code Yet)

1. Confirm the actual Wix page configured as the site's homepage.
2. Establish the hero's copy, primary CTA destination, and approved art direction.
3. Set the documented Vierelle colors and typography in Wix Site Styles if they are not already configured.
4. Build the native `HeroEditorial` section in Wix Local Editor and establish desktop/mobile composition.
5. Upload approved production media to Wix Media Manager and retain the source asset in the project asset library.
6. Validate the static hero against the accessibility and performance criteria.
7. Decide whether a small native entrance effect is genuinely needed; add Velo only if native behavior cannot meet the approved interaction requirement.
8. Document the final Editor structure, element IDs, and editorial update procedure in `design/Components.md` before introducing reuse or CMS automation.

## Explicit Non-Goals for This Phase

- No production Velo code.
- No custom element, iframe, or React application.
- No homepage restructuring.
- No custom cart, checkout, or duplicate product catalog.
- No CMS collection until the content operation requires it.

This approach gives Vierelle a premium, editable hero now while preserving a clean path to seasonal and editorial scale later.
