# Product

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
React / Next-compatible Site starter, inferred from the requested React Bits components and shadcn commands.

## Users
ECE students at NIT Warangal, and visitors exploring the society's technology, career, achievement, and event information. Inferred from the supplied Figma screen.

## Product Purpose
An ECE Society homepage that introduces the society and lets visitors explore updates, career insights, student work, events, and contact paths. The supplied Figma screen is the source for structure and copy.

## Capabilities and Constraints
- Responsive homepage with a redesigned immersive visual direction following the user's feedback.
- Include the supplied ECE Society logo.
- Place Neural Flash across the page background, show an animated 3D signal sculpture, and use a smooth cursor trail. Keep the logo sharp without particle treatment.
- Explore Events opens a separate event registration page.
- Registration uses Cloudflare D1 on its free tier and collects name, roll number (stored as text), and phone. No email or contact consent is collected; details are used only for the event itself. One registration per roll number per event.
- Events live in D1 and are managed at `/admin` (create, edit, open/close registration, hide, delete when empty). Registrations are viewed and exported as CSV at `/admin/registrations`. The admin area has no authentication yet; it must be added before publishing. The three seeded event categories are placeholders until real event details are supplied.
- Entry year and department code are extracted when the roll number matches the NITW format (e.g. 23ECB0A12). Section stays blank until its encoding is confirmed.
- Avoid paid hosting and paid server services. A custom domain may be added later.

## Brand Commitments
- Name: ECE Society at NIT Warangal.
- Supplied blue eagle mark is the site logo.
- The supplied logo remains the visual identity. The user explicitly replaced the first Figma-based visual treatment with a 3D and neural-background direction.

## Evidence on Hand
- Figma homepage at `https://www.figma.com/design/hCUwsfowzB4D37wN9nLpP4/Untitled?node-id=0-1&p=f`.
- Logo supplied by the user and copied into `public/ece-logo.png`.
- No verified event dates or society contact addresses were supplied. The event categories are placeholders until confirmed.
