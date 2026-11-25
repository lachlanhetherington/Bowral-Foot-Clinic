---
name: Bowral Foot Clinic
description: Navy and orange clinic identity with local photography, a scannable treatment rail, and direct booking.
colors:
  navy: "#0c2c41"
  header: "#f7f8f9f5"
  header-opaque: "#102e43"
  header-overlay: "#102e43a8"
  booking: "#bd440e"
  booking-hover: "#9c350c"
  light: "#fcfcfd"
  light-ink: "#102d40"
  light-muted: "#3c5567"
  paper: "#ffffff"
  light-tint: "#dceff9"
  light-line: "#cddde6"
  link: "#14638e"
  footer: "#222628"
  light-focus: "#c9521d"
  tile: "#20475e"
typography:
  display:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "clamp(2.3rem, 4.6vw, 4.45rem)"
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

The Dr Abbie family identity pairs white and pale blue sections, burnt-orange booking buttons, Poppins, and clinical photography. Bowral's existing team photograph fills the home hero beside the treatment rail.

## Colors

White and pale blue alternate through the content in either device color preference. Navy supports photo overlays, charcoal anchors the footer, and orange identifies booking. Blue marks secondary links and actions.

## Typography

Poppins Regular (400) sets the home hero and body. Semibold (600) sets interior page headlines, section headings, navigation, and actions. Body copy uses a maximum measure of 68ch. The home hero uses a shorter 46ch measure.

## Layout

Sections share a centered container. The homepage progresses from the hero to practitioners, reviews, conditions, clinic information, treatments, FAQ and booking. At up to 51rem booking stacks above the treatment rail, the navigation opens below the header, and the home practitioner rail shows the edge of the next card.

Interior pages use split heroes with topic-specific photography. Service and condition pages pair readable main content with a booking sidebar and related links. Location pages surface Bowral directions and clinic hours before the main article. The sidebar moves into the reading flow on mobile.

## Elevation & Depth

Navy gradients support white labels on photography. Borders and canvas tints separate cards and sections. The home header overlays the hero with white links and white logo lettering, retaining the original blue icon on a transparent background. After the first 32px of scroll, it switches to a frosted light surface and the original blue lettering. Interior pages use the light header from the start.

## Shapes

Rounded corners frame photos, treatment cards, staff cards, and dropdowns. Booking and service links use pills. Rail controls are circular with a 44px target.

## Components

- **Booking and location links** use an orange primary pill and a transparent, outlined secondary pill on the hero. Pressing a button scales it to 97%. With standard motion settings, button motion eases out over 160ms.
- **Navigation and FAQs** use native disclosures. Desktop mega menus pair a pale-blue intro with a two-column link grid and a featured photo card. Mobile keeps the same destinations in a single-column disclosure. Escape closes the open submenu or mobile navigation and returns focus to its control.
- **Treatment tiles** use photography where available and a blue backing for text-only treatments. The rail loops in both directions and auto-advances every 4.2 seconds while in view. Visitors can pause it or browse using touch, arrow buttons, or the keyboard. Auto-advance is off with reduced motion, and manual scrolling becomes instant.
- **Staff, condition and service cards** use white bordered surfaces. Staff cards place a portrait or initials above the name. The home staff rail uses the same looping, pause and reduced-motion behavior as the treatment rail.
- **Motion** brings in hero content, section headings and disclosure contents with short fades and translations. Reduced-motion settings disable these effects.

## Do's and Don'ts

- Do use clinic photographs and keep the navy gradient behind white treatment labels.
- Do use the orange pill for booking and keep the visible focus ring on links and controls.
