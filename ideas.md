# LifeLink — Reference Design Specification

## Chosen Approach: Figma Reference as Ground Truth

This implementation is a direct reproduction of the supplied Figma frame rather than an interpretation. The website presents a single centered translucent **200 × 100 px** rectangle with a **26 px** radius, a narrow **117° white-to-gray-to-white gradient border**, a diffuse indigo outer shadow, and a soft inset highlight. There is no text, image, logo, or secondary interface in the provided source.

| Design property | Ground-truth rule |
|---|---|
| Composition | An uncluttered transparent canvas with one isolated rectangular glass element. |
| Geometry | Fixed 200 × 100 px component, 26 px corner radius, centered without distortion. |
| Surface | `rgba(255, 255, 255, 0.10)` with a 6 px backdrop blur. |
| Border | 1 px transparent border carrying a 117° linear gradient from 80% white through 20% gray to 80% white. |
| Depth | Diffuse `rgba(31, 38, 135, 0.13)` indigo shadow and a low-contrast white inset glow. |
| Responsiveness | The component retains its measured geometry on all viewports and remains visibly centered with safe viewport padding. |
| Interaction | The supplied component has no interactive affordance; no artificial behavior will be added. |

## Style Decisions

- Preserve the original Figma color, opacity, corner radius, shadow values, and blur value exactly.
- Do not introduce generated imagery, decorative copy, navigation, or additional visual motifs that would diverge from the reference frame.
- Use a responsive flex container only to place the unmodified component within the browser viewport.

## Validation Notes

The supplied `frame.webp` preview presents a single transparent graphic whose outer indigo shadow is composited against a checkerboard transparency viewer. The browser canvas is white by default, so shadow intensity must be evaluated from its original alpha values rather than the preview checkerboard alone.

The reference frame is exported at twice the CSS scale of the supplied `code.jsx`: its visible panel measures approximately 400 × 200 image pixels while the source specifies a 200 × 100 CSS-pixel component. The implementation keeps the source-authoritative CSS dimensions, radius, blur, border, and shadows exactly, so it produces the intended layout at normal browser scale rather than mistakenly doubling all design values.

The visual browser comparison confirms a centered translucent white panel with the expected rounded outline, inset haze, and lower indigo shadow. The project contains no source image assets, and no external image URL is referenced by the implemented page.

The final browser and narrow 375 × 812 viewport checks show no surrounding UI, overflow, or missing content. The panel remains horizontally and vertically centered and retains its original measured 200 × 100 CSS-pixel geometry.

## Liquid-Glass Expansion

The original Figma rectangle is now the material reference for the supplied LifeLink application. The patient and clinician portals share **pearl-tinted translucent panels**, **117° spectral borders**, **soft indigo ambient shadows**, and **frosted navigation chrome** over a calm blue–aqua atmospheric background. Urgent medical states retain their red and amber semantic cues, while controls use the same glass depth without compromising text contrast or keyboard focus visibility.

The login route has been checked in the browser and displays the liquid-glass background, form card, text fields, and primary action correctly. Authenticated workspace validation will use the supplied demo account rather than introduce any fabricated user state.

The patient dashboard has been opened with the supplied demo account. Its sidebar, sticky header, primary bento cards, health-overview cards, alert band, and action controls all inherit the shared liquid-glass surfaces while retaining the original content hierarchy.

Direct browser navigation resets this frontend-only mock session, so authenticated page traversal is validated through the visible in-app navigation after the demo sign-in flow rather than by a full URL reload.

The AI assessment page has been inspected through in-app navigation. Its custom age, text, select, textarea, disclaimer, panel, and analysis action remain readable and receive the shared liquid-glass control treatment without changing the medical content or its safety disclaimer.

## Style Decisions

- The **LifeLink pulse-link mark** replaces generic plus glyphs at portal entry points, in sidebars, and in compact account contexts.
- The strongest spectral blue–aqua gradient is reserved for the mark, primary actions, and selected navigation; secondary actions remain pearlescent glass.
- Every primary surface follows the same material formula: pearl fill, 117° spectral edge, indigo ambient depth, and a restrained inset glint.

## Final Validation Notes

The refined doctor dashboard and patient login have been rechecked in the browser. The pulse-link mark is visible in clinician navigation, account contexts, and the patient entry point. A 375 × 812 clinician screenshot confirms that the compact navigation remains horizontally accessible, content cards stack without clipping, and the liquid-glass contrast remains legible.
