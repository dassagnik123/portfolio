# Claude.md --- Portfolio Design & Implementation Guide

## 1. Project Purpose

Build a personal portfolio website around the provided illustrated
portrait.

The portfolio should feel like a **digital art portfolio combined with a
modern Design Engineer portfolio**. The portrait is the visual identity
and should drive the site's color, typography treatment, motion
language, cards, buttons, dividers, and decorative details.

The result should feel: - Personal - Artistic - Editorial - Confident -
Modern - Slightly experimental - Premium without becoming overly glossy

Do not turn the site into a generic SaaS portfolio template.

------------------------------------------------------------------------

## 2. Primary Visual Reference

Use the supplied portrait as the main visual reference.

The portrait establishes: - Pink / blush skin treatment - White and
pale-pink highlights - Deep magenta / wine shadows - Olive-green
clothing - Dark plum / near-black hair - Strong directional lighting -
Hand-painted brush strokes - Layered paint texture - High contrast
between highlights and shadows - Transparent-background portrait
treatment

The portrait should remain the hero visual rather than being treated as
a normal rectangular photograph.

------------------------------------------------------------------------

## 3. Design Direction

The overall design language should combine:

**Editorial portfolio + painterly illustration + modern digital product
design.**

Avoid: - Generic gradient-heavy SaaS layouts - Excessive glassmorphism -
Neon cyberpunk styling - Random decorative blobs - Overly rounded UI
everywhere - Stock-photo aesthetics - Excessive shadows - Excessive
animation

Use restrained UI and let the portrait, typography, composition, and
brush texture create the personality.

------------------------------------------------------------------------

## 4. Recommended Tech Stack

Use:

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   shadcn/ui where useful
-   Lucide icons
-   CSS variables for design tokens
-   Framer Motion / Motion for React for intentional animation
-   CSS gradients and pseudo-elements for lightweight decorative effects
-   SVG where custom brush/vector decoration is needed

Keep the implementation component-driven.

Suggested structure:

``` text
app/
  page.tsx
  work/
  about/
  contact/

components/
  hero/
  navigation/
  project-card/
  section-heading/
  buttons/
  portrait/
  brush-decoration/

styles/
  globals.css
  tokens.css

public/
  portrait/
  textures/
  icons/
```

------------------------------------------------------------------------

## 5. Implementation Rules

### Portrait

The portrait is the primary visual anchor.

-   Preserve the transparent cutout.
-   Do not place it inside a conventional card.
-   Allow portions of the portrait to visually overlap sections.
-   Keep the face large enough to be immediately recognizable.
-   Use the portrait's pink, cream, magenta, and olive palette
    throughout the interface.
-   Do not recolor the portrait with a generic CSS filter unless
    explicitly requested.

### Brush texture

Use brush texture selectively.

Good places: - Section separators - Hero background accents - Project
card borders - Small decorative marks - Hover states - Background
texture - Large typographic moments

Do not put heavy brush texture behind every element.

### Layout

Prefer: - Large editorial typography - Strong whitespace - Asymmetrical
composition - Large visual blocks - Clear hierarchy - Intentional
overlap - Full-width sections

Avoid: - Dense dashboards - Tiny text - Overly compressed layouts -
Everything being perfectly centered

------------------------------------------------------------------------

## 6. Responsive Behaviour

Desktop should be the primary art direction, but the site must work well
on mobile.

On mobile: - Keep the face as the dominant visual. - Reduce decorative
brush elements. - Stack project content naturally. - Avoid cropping
important facial features. - Maintain readable typography. - Keep
sufficient spacing around the portrait.

------------------------------------------------------------------------

## 7. Interaction

Interactions should feel tactile rather than flashy.

Recommended: - Slight portrait movement on hover - Brush-stroke reveal
when sections enter the viewport - Subtle text movement - Underline
expansion - Image scale of approximately 1.01--1.03 - Soft opacity
transitions

Avoid: - Large parallax effects - Constant animation - Bouncing UI -
Excessive scroll-jacking - Animation that competes with the portrait

------------------------------------------------------------------------

## 8. Accessibility

Maintain: - Strong text contrast - Keyboard navigation - Visible focus
states - Semantic HTML - Alt text for meaningful images - Reduced-motion
support

Never sacrifice readability for visual style.

------------------------------------------------------------------------

## 9. Code Quality

Keep: - Components small and reusable - Tokens centralized - Color
values centralized - Animation durations centralized - No duplicated
visual constants - No hardcoded colors scattered through components

When creating a new component, reuse existing design tokens before
creating new ones.

------------------------------------------------------------------------

## 10. Final Visual Goal

The site should feel like **a designer's digital canvas**, not a
conventional developer portfolio.

The portrait should be the signature element.

Every major visual decision should answer:

> Does this feel like it belongs to the same painted world as the
> portrait?

If not, simplify or redesign it.
