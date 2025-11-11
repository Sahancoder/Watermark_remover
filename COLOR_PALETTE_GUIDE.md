# Color Palette Guide

## Overview
This document describes the professional color palette implemented throughout the PDF Watermark Remover application.

## Color Roles & Hex Values

### Primary - #ACDDDE (Soft Teal)
**Usage**: Main brand color, primary actions, links, focus states
- **50**: `#F0F9F9` - Very light backgrounds
- **100**: `#E1F3F3` - Light backgrounds, borders
- **200**: `#C3E7E7` - Hover states, badges
- **300**: `#ACDDDE` - **Base color** - Buttons, icons
- **400**: `#87CFD0` - Active states
- **500**: `#6AC4C6` - Pressed states
- **600**: `#4DB6B9` - Text on light backgrounds
- **700**: `#3A8E91` - Dark text

**Examples**:
```tsx
// Primary button
className="bg-primary-500 hover:bg-primary-600"

// Border
className="border border-primary-200"

// Icon color
className="text-primary-600"
```

### Success - #CAF1DE (Mint Green)
**Usage**: Success messages, privacy features, positive indicators
- **50**: `#F2FCF7`
- **100**: `#E5F9EF`
- **200**: `#CAF1DE` - **Base color**
- **300**: `#A7E8C9`
- **400**: `#84DFB4`
- **500**: `#61D69F`
- **600**: `#3ECD8A`
- **700**: `#2FA56D`

**Examples**:
```tsx
// Success badge
className="bg-success-200 border border-success-300"

// Privacy feature icon
className="bg-gradient-to-br from-success-400 to-success-600"
```

### Surface - #E1F8DC (Pale Lime)
**Usage**: Secondary backgrounds, subtle highlights, sections
- **50**: `#F5FCF3`
- **100**: `#E1F8DC` - **Base color**
- **200**: `#C8F1BA`
- **300**: `#AAEA98`
- **400**: `#8CE376`
- **500**: `#6EDC54`
- **600**: `#50D532`
- **700**: `#3FAA27`

**Examples**:
```tsx
// Secondary button background
className="bg-surface-100 hover:bg-surface-200"

// Toolbar background
className="bg-gradient-to-r from-surface-100 to-surface-200"
```

### Background - #FEF8DD (Cream)
**Usage**: Page backgrounds, main content areas
- **50**: `#FFFDF8`
- **100**: `#FFFBF1`
- **200**: `#FEF8DD` - **Base color**
- **300**: `#FDF5C9`
- **400**: `#FCF2B5`
- **500**: `#FBEFA1`
- **600**: `#FAEC8D`
- **700**: `#C8BD71`

**Examples**:
```tsx
// Root background
className="bg-background-300"

// Card background on colored surface
className="bg-background-100"
```

### Accent - #FFE7C7 (Peach)
**Usage**: Highlights, hover states on secondary elements, CTAs
- **50**: `#FFF9F3`
- **100**: `#FFF3E7`
- **200**: `#FFE7C7` - **Base color**
- **300**: `#FFDAA7`
- **400**: `#FFCE87`
- **500**: `#FFC267`
- **600**: `#FFB547`
- **700**: `#CC9139`

**Examples**:
```tsx
// Secondary button
className="bg-accent-300 hover:bg-accent-400"

// Animated blob
className="bg-accent-200"
```

### Warning - #F7D8BA (Soft Orange)
**Usage**: Alerts, caution states, delete actions, important notices
- **50**: `#FDF6F1`
- **100**: `#FBEDE3`
- **200**: `#F7D8BA` - **Base color**
- **300**: `#F3C391`
- **400**: `#EFAE68`
- **500**: `#EB993F`
- **600**: `#E78416`
- **700**: `#B96912`

**Examples**:
```tsx
// Delete button
className="text-warning-600 hover:text-warning-800"

// Warning badge
className="bg-warning-200 border border-warning-300"

// RAM-only processing badge
className="bg-gradient-to-br from-warning-400 to-warning-600"
```

### Text Colors
**Usage**: Typography throughout the application

**Primary Text**: `#111827` (Slate 900)
```tsx
className="text-text-primary"
```

**Muted Text**: `#94A3B8` (Slate 400)
```tsx
className="text-text-muted"
```

## Component-Specific Usage

### Header
- Logo gradient: `from-primary-400 to-primary-600`
- Border: `border-primary-200`
- Language toggle: `border-primary-300 hover:border-primary-400`

### Upload Area
- Border: `border-primary-200 hover:border-primary-300`
- Drag active: `border-primary-500 bg-primary-50`
- Upload icon: `from-primary-400 to-primary-600`

### Privacy Features
- No Storage: `from-success-400 to-success-600`
- Open Source: `from-primary-400 to-primary-600`
- RAM Only: `from-warning-400 to-warning-600`

### PDF Viewer
- Toolbar: `from-surface-100 to-surface-200`
- Navigation buttons: `hover:bg-primary-50`
- Page canvas area: `from-surface-100 to-surface-200`

### Selection Canvas
- Rectangle stroke: `rgba(172, 221, 222, 0.8)` (primary-300 with alpha)
- Rectangle fill: `rgba(172, 221, 222, 0.15)`
- Selected indicator: `bg-primary-500`

### Action Panel
- Info box: `bg-primary-50 border-primary-200`
- Radio labels: `border-primary-200 hover:bg-primary-50`
- Process button: `bg-primary-500 hover:bg-primary-600`
- Secondary buttons: `bg-surface-100 hover:bg-surface-200`

### Footer
- Badges: success, primary, warning colors
- GitHub link: `border-primary-200 hover:border-primary-400`

## Design Principles

1. **Light & Airy**: Base palette uses soft pastels with high luminosity
2. **Semantic Colors**: Each role has clear meaning (primary=action, success=positive, warning=caution)
3. **Accessibility**: All text colors meet WCAG AA contrast requirements
4. **Consistency**: Same shades used throughout (200 for borders, 50 for hover backgrounds, etc.)
5. **Glassmorphism**: White backgrounds with alpha transparency overlay colored surfaces

## Tailwind Configuration

All colors are defined in `tailwind.config.js`:

```js
colors: {
  primary: { /* #ACDDDE shades */ },
  success: { /* #CAF1DE shades */ },
  surface: { /* #E1F8DC shades */ },
  background: { /* #FEF8DD shades */ },
  accent: { /* #FFE7C7 shades */ },
  warning: { /* #F7D8BA shades */ },
  text: {
    primary: '#111827',
    muted: '#94A3B8'
  }
}
```

## Migration Notes

All instances of:
- `blue-*` → `primary-*`
- `purple-*` → `primary-*` (for gradients)
- `green-*` → `success-*`
- `gray-*` → `surface-*` or `text-muted`
- `pink-*` → `accent-*`
- `red-*` → `warning-*`

## Testing Checklist

- [ ] Header displays with teal logo and proper borders
- [ ] Upload area shows light color scheme with hover states
- [ ] Privacy badges use correct gradient colors
- [ ] PDF viewer toolbar has subtle surface colors
- [ ] Selection rectangles use primary color with transparency
- [ ] Action panel buttons use primary/surface colors
- [ ] All text is readable (good contrast)
- [ ] Footer badges show semantic colors
- [ ] Focus states use primary color outline
