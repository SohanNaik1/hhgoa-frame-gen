---
name: Verdant Radical
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#414844'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#717974'
  outline-variant: '#c1c8c2'
  surface-tint: '#426656'
  primary: '#00150d'
  on-primary: '#ffffff'
  primary-container: '#062c1f'
  on-primary-container: '#709583'
  inverse-primary: '#a9cfbc'
  secondary: '#526600'
  on-secondary: '#ffffff'
  secondary-container: '#d1ef72'
  on-secondary-container: '#576c00'
  tertiary: '#0f1112'
  on-tertiary: '#ffffff'
  tertiary-container: '#242626'
  on-tertiary-container: '#8c8d8d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c4ebd7'
  primary-fixed-dim: '#a9cfbc'
  on-primary-fixed: '#002115'
  on-primary-fixed-variant: '#2a4e3f'
  secondary-fixed: '#d1ef72'
  secondary-fixed-dim: '#b6d259'
  on-secondary-fixed: '#171e00'
  on-secondary-fixed-variant: '#3d4d00'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system embodies a **Retro-Brutalist Tropical** aesthetic. It is a collision of raw, industrial structure and lush, organic depth. The personality is unapologetic, sophisticated, and authoritative, targeting an audience that values intellectual design and high-contrast clarity over modern softness. 

The visual language rejects the "friendly" curves of contemporary SaaS in favor of hard edges, 2px solid strokes, and architectural rigidity. It evokes the feeling of a vintage botanical catalog reimagined through a modern digital lens—clinical yet vibrant.

## Colors

The palette is anchored by a high-contrast triad that demands attention without relying on neon intensity.

- **Primary (#062c1f):** A deep, dense forest green used for backgrounds, primary text, and heavy structural elements.
- **Secondary (#e1ff80):** A sharp, acidic yellow-green. This is the primary action color and is used to highlight critical data or call-to-action surfaces.
- **Tertiary/Surface (#f0f0f0):** An off-white/grey used to provide breathing room and act as a neutral canvas for the more aggressive primary colors.
- **Stroke/Outline (#062c1f):** All borders and dividers use the Primary green at 100% opacity to maintain the Brutalist "ink-on-paper" feel.

## Typography

This system utilizes a high-contrast typographic pairing to reinforce the Brutalist theme.

- **Headlines:** Playfair Display provides a classic, editorial elegance. It should be set with tight leading and slightly negative letter spacing for large displays to emphasize its vertical strokes.
- **UI & Body:** JetBrains Mono introduces a technical, "data-first" feel. It is used for all functional elements, labels, and paragraph text to ensure legibility and a raw, unpolished character. 
- **Scale:** Large headlines should aggressively break traditional margins if necessary to create a "display" effect, while mono text remains strictly aligned to a rigid grid.

## Layout & Spacing

The layout is governed by a **Fixed Grid** system that emphasizes structural borders. 

- **Grid Model:** A 12-column grid on desktop and a 4-column grid on mobile. 
- **Gutters:** Gutters are strictly enforced at 24px and are often visually marked by 1px or 2px vertical lines.
- **Visual Rhythm:** Spacing follows a strict 4px baseline. Elements are "boxed in" rather than floating. Margin and padding should feel generous but contained within visible borders.
- **Adaptation:** On mobile, the Primary Forest Green often becomes the dominant background to reduce glare, while desktop layouts use larger expanses of the Tertiary off-white to allow the high-contrast serif typography to breathe.

## Elevation & Depth

This system rejects all forms of "soft" depth. There are no blurs, no shadows, and no gradients. 

- **Hard Shadows (Optional):** If depth is required, use a "Hard Drop" shadow: a solid offset block of the Primary color (e.g., 4px down, 4px right) with no blur.
- **Layering:** Hierarchy is achieved through **Color Blocking** and **Stacking**. Elements at a higher elevation do not float; they are represented by contrasting background fills (e.g., a Sharp Yellow card on a Deep Green background).
- **Outlines:** Every interactive container must have a 2px solid border in the Primary Green. This "ink" defines the boundaries of the UI.

## Shapes

The shape language is strictly **Rectilinear**. 

- **Corners:** All corners are 0px (Sharp). This applies to buttons, cards, input fields, and even selection indicators.
- **Strokes:** A 2px solid stroke is the default for all container boundaries. 
- **Visual Accents:** Use 45-degree diagonal lines or "hatching" patterns for decorative fills in the Primary or Secondary colors to add texture without breaking the geometric rules.

## Components

- **Buttons:** Rectangular with a 2px Primary border. Default state is Secondary Yellow fill with Primary Green text. Hover state shifts to Primary Green fill with Secondary Yellow text. No transitions or easing; changes should be instantaneous.
- **Input Fields:** Off-white background with a 2px Primary border. Labels must be in JetBrains Mono, placed strictly above the field or "taped" to the top border.
- **Chips/Tags:** Small boxes with Primary borders and Mono text. Use the Secondary Yellow fill for "Active" states and Off-white for "Inactive."
- **Cards:** Heavy containers with 2px borders. Headlines inside cards should use Playfair Display, while metadata uses JetBrains Mono.
- **Lists:** Separated by 2px horizontal rules. No "hover" background color change; instead, use a 4px solid Primary left-border on hover.
- **Checkboxes/Radios:** Square (even for radios) with 2px borders. Selection is indicated by a solid Primary fill or a "X" mark in Mono.