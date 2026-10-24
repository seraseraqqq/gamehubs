---
name: Snow Rider 3D Publisher Game Page
description: Warm-white and evergreen shell around the existing GameDistribution game player.
colors:
  evergreen: "#285e52"
  evergreen-hover: "#1d4c41"
  warm-white: "#f6f8f5"
  ink: "#213e37"
  muted-ink: "#52685f"
  divider: "#d7e0d9"
  soft-surface: "#e7ede6"
  glacier: "#d8eaf0"
  focus: "#b54f3b"
typography:
  headline:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(23px, 2.7vw, 34px)"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "-.035em"
  title:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "23px"
    fontWeight: 750
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
rounded:
  game: "14px"
  mobile-game: "10px"
  play-panel: "12px"
  primary: "8px"
  key: "4px"
spacing:
  shell-max: "1320px"
  desktop-gutter: "36px"
  mobile-gutter: "20px"
  support-gap: "80px"
  compact-support-gap: "35px"
components:
  button-primary:
    backgroundColor: "#285e52"
    textColor: "#fff"
    borderRadius: "8px"
    minHeight: "50px"
  player-window:
    height: "clamp(440px, 64vh, 680px)"
    borderRadius: "14px"
  publisher-notice:
    backgroundColor: "#f6f8f5f5"
    fontSize: "12px"
    borderRadius: "12px"
---

# Snow Rider 3D publisher player

Implementation-derived on 2026-10-24. This system applies only to games/snow-rider-3d-unblocked. Root Coreball design remains out of scope.

The owner replaced original gameplay with the existing game. Preserve the restrained site shell and use the publisher's actual artwork/player as the visual center. The site must not claim game authorship. The old custom HUD, sled shop, score and touch controls no longer belong to this interface.

The shell keeps the1320px max width, evergreen actions, local Figtree and warm-white reading surface. Game window dominates the first viewport. A publisher-art poster and one clear Play action precede third-party loading. Reload, fullscreen and direct-open controls sit below. In fullscreen, a48px first-party bar reserves a separate exit area without covering the game/ad surface. The publisher's interior design is external and is not part of this system.

850px and540px CSS breakpoints stack supporting content and the toolbar. Mobile poster uses contain positioning rather than cropping away the game title. These breakpoints exist in source; current IAB viewport overrides did not produce a verified390px capture, so no physical-mobile approval is claimed.

Source states: idle poster, connecting, publisher page connected, slow response, connection error and fullscreen. Connected means iframe page load, not Unity game readiness. Keep recovery copy literal. Do not strip publisher ads/privacy/branding or spoof SDK referrers.

Evidence: current default-IAB desktop shell, nested Unity title/menu/tutorial and9 shell checks. Fullscreen exposed a44px exit but did not persist through the next IAB call; the internal exit action remains unverified in that environment. There is no approved comp or new catalog quality-bar claim.