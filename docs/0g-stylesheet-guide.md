# 0G.ai Typography & Color Stylesheet Guide

## Typography

### Primary Font Families
```css
/* Headings and Display Text */
font-family: 'Regola Pro', Arial, sans-serif;

/* Monospace/Technical Text */
font-family: 'Geistmono', 'Courier New', monospace;

/* System Fallback */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Weights
```css
/* Regola Pro Weights */
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;

/* Geistmono Weights */
--font-weight-mono-light: 300;
--font-weight-mono-regular: 400;
--font-weight-mono-medium: 500;
--font-weight-mono-semibold: 600;
```

### Typography Scale
```css
/* Responsive Base Font Size */
:root {
  font-size: calc(0.625rem + 0.41666666666666663vw);
}

/* Heading Sizes */
--font-size-h1: clamp(2.5rem, 5vw, 4.5rem);
--font-size-h2: clamp(2rem, 4vw, 3.5rem);
--font-size-h3: clamp(1.75rem, 3vw, 2.5rem);
--font-size-h4: clamp(1.5rem, 2.5vw, 2rem);
--font-size-h5: clamp(1.25rem, 2vw, 1.5rem);
--font-size-h6: clamp(1.125rem, 1.5vw, 1.25rem);

/* Body Text Sizes */
--font-size-body: 1rem;
--font-size-body-large: 1.125rem;
--font-size-body-small: 0.875rem;
--font-size-caption: 0.75rem;

/* Line Heights */
--line-height-tight: 1.2;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

## Color System

### Brand Colors
```css
:root {
  /* Primary Purple Gradient */
  --purple-1: #b75fff;
  --purple-2: #cb8aff;
  --purple-3: #d5a3ff;
  --purple-4: #e3c1ff;
  --purple-5: #f3e6fe;
  --purple-shade: #9200e1;
  
  /* Accent Blue */
  --accent-blue: #4d65ff;
  --focus-state: #2d62ff;
  
  /* Dark Purple */
  --dark-purple: #320071;
}
```

### Neutral Colors
```css
:root {
  /* Base Neutrals */
  --white: #ffffff;
  --black: #000000;
  
  /* Gray Scale */
  --neutral-lightest: #eeeeee;
  --neutral-lighter: #cccccc;
  --neutral-light: #aaaaaa;
  --neutral: #666666;
  --neutral-dark: #444444;
  --neutral-darker: #222222;
  --neutral-darkest: #111111;
  
  /* UI Grays */
  --gray-02: #e5e5e5;
  --border-grey: #e5e5e5;
  --divider: #d9d9d9;
}
```

### System Colors
```css
:root {
  /* Success */
  --success-green: #cef5ca;
  --success-green-dark: #114e0b;
  
  /* Warning */
  --warning-yellow: #fcf8d8;
  --warning-yellow-dark: #5e5515;
  
  /* Error */
  --error-red: #f8e4e4;
  --error-red-dark: #3b0b0b;
}
```

### Transparency & Overlays
```css
:root {
  /* Black Overlays */
  --overlay-dark: #000000e6; /* 90% black */
  --overlay-medium: #0006; /* ~40% black */
  --overlay-light: #0000001a; /* 10% black */
  --overlay-subtle: #0000000d; /* 5% black */
  
  /* White Overlays */
  --overlay-white: #ffffff80; /* 50% white */
  
  /* Transparent */
  --transparent: #fff0;
}
```

### Gradients
```css
/* Primary Background Gradient */
.gradient-primary {
  background: linear-gradient(
    180deg,
    transparent 0%,
    #320071 100%
  );
}

/* Radial Purple Gradient */
.gradient-radial {
  background: radial-gradient(
    circle at center,
    #b75fff 0%,
    #9200e1 50%,
    #320071 100%
  );
}

/* Purple Mesh Gradient */
.gradient-mesh {
  background: 
    radial-gradient(at 40% 20%, #cb8aff 0px, transparent 50%),
    radial-gradient(at 80% 0%, #d5a3ff 0px, transparent 50%),
    radial-gradient(at 0% 50%, #b75fff 0px, transparent 50%),
    radial-gradient(at 80% 50%, #e3c1ff 0px, transparent 50%),
    radial-gradient(at 0% 100%, #9200e1 0px, transparent 50%),
    #320071;
}
```

## Utility Classes

### Text Styling
```css
/* Font Smoothing */
.smooth-text {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Text Truncation */
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### Interactive States
```css
/* Focus States */
:focus {
  outline: 2px solid var(--focus-state);
  outline-offset: 2px;
}

/* Remove Mobile Tap Highlight */
a, button {
  -webkit-tap-highlight-color: transparent;
}

/* Hover States */
.hover-purple:hover {
  color: var(--purple-1);
  transition: color 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
}
```

## Dashboard-Specific Styles

### Card Components
```css
.dashboard-card {
  background: var(--neutral-darkest);
  border: 1px solid var(--border-grey);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.dashboard-card-glass {
  background: rgba(17, 17, 17, 0.8);
  border: 1px solid rgba(183, 95, 255, 0.2);
  box-shadow: 0 8px 32px rgba(183, 95, 255, 0.1);
}
```

### Data Visualization
```css
/* Chart Colors */
.chart-primary { color: var(--purple-1); }
.chart-secondary { color: var(--purple-3); }
.chart-tertiary { color: var(--accent-blue); }
.chart-success { color: var(--success-green); }
.chart-warning { color: var(--warning-yellow); }
.chart-error { color: var(--error-red); }

/* Metric Cards */
.metric-value {
  font-family: 'Geistmono', monospace;
  font-weight: var(--font-weight-mono-semibold);
  font-size: var(--font-size-h3);
  color: var(--purple-1);
}

.metric-label {
  font-family: 'Regola Pro', sans-serif;
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-body-small);
  color: var(--neutral-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### Dark Theme Base
```css
body {
  background-color: var(--black);
  color: var(--white);
  font-family: 'Regola Pro', Arial, sans-serif;
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
}

/* Dark Surface Colors */
.surface-1 { background: var(--neutral-darkest); }
.surface-2 { background: var(--neutral-darker); }
.surface-3 { background: var(--neutral-dark); }
```

## Animation & Transitions

```css
/* Standard Transitions */
:root {
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;
}

/* Hover Animations */
.animate-hover {
  transition: all var(--transition-base);
}

/* Gradient Animation */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 15s ease infinite;
}
```

## Responsive Breakpoints

```css
/* 0G Breakpoints */
--breakpoint-mobile: 478px;
--breakpoint-tablet: 767px;
--breakpoint-desktop: 991px;
--breakpoint-wide: 1279px;
--breakpoint-ultra: 1439px;

/* Media Queries */
@media (max-width: 767px) { /* Mobile */ }
@media (min-width: 768px) and (max-width: 991px) { /* Tablet */ }
@media (min-width: 992px) { /* Desktop+ */ }
```

## Usage Example

```css
/* Climate Dashboard Header */
.climate-header {
  font-family: 'Regola Pro', sans-serif;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-h1);
  background: linear-gradient(135deg, var(--purple-1), var(--purple-shade));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Metric Card */
.metric-card {
  background: var(--surface-1);
  border: 1px solid rgba(183, 95, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  transition: all var(--transition-base);
}

.metric-card:hover {
  border-color: var(--purple-1);
  box-shadow: 0 4px 24px rgba(183, 95, 255, 0.2);
}
```