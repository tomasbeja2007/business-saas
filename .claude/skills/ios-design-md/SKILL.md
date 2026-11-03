---
name: ios-design-md
description: Production-grade iOS design systems (DESIGN.md) for 200 popular apps — exact colors, type ramps, components, motion and haptics, with Expo/React Native flavors. Use when designing or styling iOS / React Native / Expo UI, when the user wants an app to "look like" a known app (Headspace, Calm, Duolingo, Oura, etc.), or wants clean, HIG-correct mobile UI.
---

# iOS DESIGN.md library

Source: https://github.com/meliwat/awesome-ios-design-md (MIT).

Layout: `design-md/<category>/<app>/` with `DESIGN-expo.md` (Expo/React Native tokens, StyleSheet, Reanimated, expo-haptics, expo-router). The full local install may also hold `DESIGN.md` (neutral), `DESIGN-swiftui.md`, `DESIGN-android.md`.

Categories: dating, finance, fitness, food, messaging, misc, music, productivity, social, travel, video. Each category has a README.md listing its apps.

## How to use
1. Pick 1–3 reference apps whose feel matches the target (e.g. wellness/habit → `fitness/headspace`, `fitness/calm`, `fitness/oura`; mascot + gamified onboarding → `misc/duolingo`).
2. Read the relevant `DESIGN-expo.md` sections (color tokens, typography, components, motion, haptics) before writing UI code.
3. Borrow principles (spacing grid, type ramp, motion curves, haptics, depth) — build an original visual identity; do not copy another brand's logo, name or exact look.
4. Keep tokens in a single theme module, use 8pt spacing, 44pt touch targets, safe areas, and Dynamic-Type-friendly sizes.
