# Phase 37 — Reference Background Refinement

## First review finding

The supplied lockup is correctly loaded as a blurred background asset, but the desktop review shows that route-level light surfaces soften it too far for the logo to remain recognisable. The next refinement will place the same non-interactive layer within the application root’s controlled stacking context, beneath cards and controls but above the broad route background, so the blurred mark is visibly intentional without reducing text contrast.

## Second review finding

After correcting the stacking order, the blurred lockup renders behind the application as intended. Its centred placement falls largely behind the login card, however, so the final composition will shift the background mark toward the open right side of the viewport and reduce the blur slightly. This keeps the mark recognisable in available background space while preserving the login card, dashboard panels, and text as the dominant foreground.

## Third review finding

The managed background asset is reachable through the application storage route. The remaining issue is visual rather than delivery-related: the source image has a very light canvas, which makes the mark too subtle over the light interface. The final treatment will use a light-theme blend mode so the image canvas remains unobtrusive while the blurred dark and brand-colour portions of the official mark remain visible in the open background space.

## Final layering diagnosis

The visual review confirms that the global watermark is still obscured on the login route by its dedicated opaque `.auth-page` canvas. The final implementation will therefore place the same managed blurred-logo layer directly in the login page and authenticated application layout stacks, with each card, sidebar, header, and interactive control explicitly above it. This preserves foreground contrast while making the owner-supplied logo visible where users actually see the page background.

## Desktop validation

At 1440 × 900, the login screen now shows a large, recognisable soft-focus LifeLink wordmark in the open right-side background. The sign-in card, input labels, values, controls, theme switcher, and footer remain sharply legible. The authenticated dashboard retains an atmospheric logo treatment beneath its workspace layers without diminishing the sidebar, header, cards, or clinical information.

At 390 × 844, the background scales down behind the compact login and patient dashboard layouts. The mobile sign-in card, header, touch controls, text, and dashboard panels remain clear and uncluttered; the logo treatment deliberately recedes where the compact foreground uses the available screen space.
