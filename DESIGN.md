---
name: Bowral Foot Clinic
description: Navy and orange clinic identity with local photography, a scannable treatment rail, and direct booking.
colors:
  navy: "#0c2c41"
  header: "#102e43f7"
  header-opaque: "#102e43"
  booking: "#b94312"
  booking-hover: "#9c350c"
  light: "#fcfcfd"
  light-ink: "#102d40"
  light-muted: "#3c5567"
  light-tint: "#edf3f6"
  light-line: "#c6d5df"
  light-focus: "#c9521d"
  dark-paper: "#102737"
  dark-ink: "#eef5f8"
  dark-muted: "#c1d1dc"
  dark-tint: "#173649"
  dark-line: "#4c6779"
  dark-focus: "#ff9c6d"
  tile: "#20475e"
typography:
  display:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "clamp(2.3rem, 4.3vw, 4.2rem)"
    fontWeight: 400
    lineHeight: 1.13
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "clamp(1.85rem, 3.45vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 1.13
    letterSpacing: "-.035em"
  body:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  small: "8px"
  card: "14px"
  pill: "999px"
spacing:
  mobile-gutter: "1rem"
  desktop-gutter: "1.5rem"
  container: "77rem"
  section: "clamp(3.25rem, 7vw, 6.5rem)"
components:
  button-booking:
    backgroundColor: "{colors.booking}"
    textColor: "{colors.light}"
    rounded: "{rounded.pill}"
    padding: ".44rem 1.15rem"
  button-booking-hover:
    backgroundColor: "{colors.booking-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.light}"
    rounded: "{rounded.pill}"
    padding: ".44rem 1.15rem"
  nav-dropdown:
    backgroundColor: "{colors.light}"
    textColor: "{colors.light-ink}"
    rounded: "{rounded.card}"
    padding: ".55rem"
  service-link:
    rounded: "{rounded.pill}"
    padding: ".4rem .85rem"
  treatment-tile:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.light}"
    rounded: "{rounded.card}"
  person-card:
    backgroundColor: "{colors.light}"
    rounded: "{rounded.card}"
---

# Design System — Bowral Foot Clinic

## Overview

The Dr Abbie family identity pairs deep clinic navy, burnt-orange booking buttons, Poppins, and photography from the clinic. The Bowral shopfront identifies the home page while adjacent treatment links help patients find the right service.

## Colors

Navy anchors the footer and image overlays. The sticky header uses its own translucent navy and becomes opaque for increased contrast or reduced transparency. Orange identifies booking. The browser’s color preference switches the canvas, text, support surfaces, dividers, and focus ring.

## Typography

Poppins Regular (400) sets the home hero and body. Semibold (600) sets interior page headlines, section headings, navigation, and actions. Body copy uses a maximum measure of 68ch. The home hero uses a shorter 46ch measure.

## Layout

Sections share a centered container. At up to 68rem the header hides the phone link. At up to 51rem the hero stacks booking above the treatment rail, navigation collapses behind a Menu button, and the team grid changes from four to two columns. At up to 24rem the rail shows a little over two cards and partner logos stack.

## Elevation & Depth

Navy gradients support white labels on photography. Borders and canvas tints separate cards and sections. The sticky header uses a 14px backdrop blur when the browser’s transparency and contrast preferences allow it.

## Shapes

Rounded corners frame photos, treatment cards, staff cards, and dropdowns. Booking and service links use pills. Rail controls are circular with a 44px target.

## Components

- **Booking and location links** use an orange primary pill and a transparent, outlined secondary pill on the hero. Pressing a button scales it to 97%. With standard motion settings, transitions ease out over 140ms.
- **Navigation and FAQs** use native disclosures for submenus and answers. On mobile, a button with an expanded state toggles the navigation. Escape closes the open submenu or mobile navigation and returns focus to its control.
- **Treatment tiles** use photography where available and a blue backing for text-only treatments. The rail supports direct scrolling, keyboard focus, and previous and next buttons. It snaps to tile starts and disables buttons at either end. Button-driven scrolling is instant with reduced motion.
- **Staff cards and service links** use bordered, low-depth surfaces. Staff cards place a portrait or initials above the name and bio. Service links wrap and underline on hover.

## Do's and Don'ts

- Do use clinic photographs and keep the navy gradient behind white treatment labels.
- Do use the orange pill for booking and keep the visible focus ring on links and controls.
