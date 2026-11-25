# Colors.md --- Portfolio Color System

## 1. Color Philosophy

The palette is derived from the supplied portrait and the lotus-inspired
pink/white treatment established for the artwork.

The palette has four primary visual families:

1.  Lotus pink
2.  Cream / warm white
3.  Deep magenta / plum
4.  Olive green

The colors should feel painted rather than digitally neon.

------------------------------------------------------------------------

# 2. Primary Palette

## Lotus Pink

Use for: - Skin base - Main accent - Links - Active states - Decorative
strokes

``` css
--color-lotus-50: #FFF4F8;
--color-lotus-100: #FFE3EE;
--color-lotus-200: #FFC4D9;
--color-lotus-300: #FF9FBE;
--color-lotus-400: #F86F9D;
--color-lotus-500: #E94F86;
--color-lotus-600: #D93670;
--color-lotus-700: #B8295D;
```

------------------------------------------------------------------------

# 3. Cream / White

These are the light paint tones.

Use for: - Highlights - Background surfaces - Primary text on dark
surfaces - Face highlights - Negative space

``` css
--color-cream-50: #FFFDFC;
--color-cream-100: #FFF8F5;
--color-cream-200: #FFEDE9;
--color-cream-300: #FFE0DC;
--color-cream-400: #FFD1CF;
```

The brightest white should be used sparingly.

Prefer warm white over pure #FFFFFF for large surfaces.

------------------------------------------------------------------------

# 4. Deep Magenta / Plum

Use for: - Deep facial shadows - Hair - Dark typography - Buttons -
Borders - Strong contrast - Navigation

``` css
--color-plum-950: #210A18;
--color-plum-900: #300D21;
--color-plum-800: #48122F;
--color-plum-700: #68183F;
--color-plum-600: #861E50;
--color-plum-500: #A52662;
--color-plum-400: #BE3B72;
```

The darkest plum should replace black in most visual situations.

------------------------------------------------------------------------

# 5. Olive Green

The shirt should use an olive-green family.

Use for: - Cuban-collar shirt - Secondary visual blocks - Tags - Small
accent areas

``` css
--color-olive-950: #1E2412;
--color-olive-900: #293119;
--color-olive-800: #394324;
--color-olive-700: #4D5A30;
--color-olive-600: #65723E;
--color-olive-500: #7C8950;
--color-olive-400: #929E63;
--color-olive-300: #B0B98A;
```

Use olive as a supporting color, not the dominant site color.

------------------------------------------------------------------------

# 6. Skin Color System

The skin is intentionally stylized using lotus pink rather than natural
photographic skin tones.

### Base

``` css
--skin-base: #F27E9F;
```

### Midtone

``` css
--skin-midtone: #E95D86;
```

### Light

``` css
--skin-light: #FFB6C9;
```

### Highlight

``` css
--skin-highlight: #FFE6E1;
```

### Shadow

``` css
--skin-shadow: #8F2B54;
```

### Deep shadow

``` css
--skin-deep-shadow: #45152F;
```

The pink should remain visibly intentional.

Do not neutralize the skin into ordinary beige/brown tones.

------------------------------------------------------------------------

# 7. Hair Colors

``` css
--hair-base: #260F1E;
--hair-shadow: #351025;
--hair-midtone: #61183D;
--hair-accent: #A52662;
--hair-highlight: #FF8FB4;
```

Use the brightest pink only on selected hair edges.

------------------------------------------------------------------------

# 8. Eye Colors

The eyes should remain darker and more natural than the surrounding pink
treatment.

``` css
--eye-iris: #4A2A24;
--eye-dark: #241519;
--eye-highlight: #FFF3EE;
```

Use very small highlights.

------------------------------------------------------------------------

# 9. Shirt Colors

The Cuban-collar shirt should use:

``` css
--shirt-base: #65723E;
--shirt-midtone: #7C8950;
--shirt-light: #B0B98A;
--shirt-shadow: #394324;
--shirt-deep-shadow: #1E2412;
```

The shirt should have enough contrast against the pink skin.

------------------------------------------------------------------------

# 10. Background Colors

For the website itself, use quiet surfaces so the portrait remains
dominant.

### Primary background

The page background is the warm vanilla cream (not the pinkish warm
white).

``` css
--background: #F1E6C4;
```

### Secondary background

``` css
--background-soft: #F8F0D8;
```

Painted background strokes use the cream family: #F8F0D8, #F4E9CC,
#F1E6C4, with a few warmer #E9D2A3 / #DCC08A strokes and #C9AA6B grain.

### Dark section

``` css
--background-dark: #300D21;
```

### Deep section

``` css
--background-deep: #210A18;
```

Avoid a permanent bright pink background across the entire website.

------------------------------------------------------------------------

# 11. Text Colors

``` css
--text-primary: #300D21;
--text-secondary: #68183F;
--text-muted: #861E50;
--text-on-dark: #FFF8F5;
--text-on-accent: #FFFDFC;
```

Body text should normally use deep plum rather than pure black.

------------------------------------------------------------------------

# 12. Border Colors

``` css
--border-light: #E8C8D2;
--border-medium: #C98A9F;
--border-dark: #68183F;
```

Keep borders subtle.

------------------------------------------------------------------------

# 13. Accent Rules

### Primary accent

Lotus Pink.

### Secondary accent

Olive Green.

### Dark anchor

Deep Plum.

### Highlight

Warm Cream.

Do not introduce unrelated colors unless they are required for
accessibility or functional states.

------------------------------------------------------------------------

# 14. Color Ratio

A useful starting ratio:

``` text
Vanilla cream / light surfaces 50%
Deep plum / dark neutrals  20%
Lotus pink                 20%
Olive green                10%
```

The exact ratio can change by section.

The portrait itself can contain much stronger pink concentration.

------------------------------------------------------------------------

# 15. Gradient Rules

Avoid generic modern web gradients.

If a gradient is necessary, use subtle paint-like transitions:

``` css
background:
  linear-gradient(
    135deg,
    #FFF8F5 0%,
    #FFE3EE 45%,
    #FFF4F8 100%
  );
```

For dark areas:

``` css
background:
  linear-gradient(
    135deg,
    #210A18 0%,
    #48122F 60%,
    #300D21 100%
  );
```

Gradients should support the painting aesthetic, not replace brush
texture.

------------------------------------------------------------------------

# 16. Color Usage Rule

Do not use all colors equally.

The hierarchy should be:

**Cream → Plum → Pink → Olive**

Cream provides space. Plum provides structure. Pink provides identity.
Olive provides contrast.

The portrait is allowed to be more saturated than the surrounding UI.

------------------------------------------------------------------------

# 17. Accessibility

Always verify text contrast before shipping.

For small body text, prioritize: - Deep plum on cream - Cream on deep
plum

Do not use pale pink for long body text.

Pink and olive should primarily function as accents when contrast is
insufficient.
