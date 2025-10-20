# Terminal Hamburger Menu Navigation

An advanced, interactive terminal-themed navigation system for the Next.js portfolio with multi-stage animations and immersive UX.

## Features

### 🎭 Multi-Stage Animation Flow

1. **Stage 1: Terminal Slide-In (0.3s)**
   - Terminal window slides in from right edge
   - Smooth GSAP animation with backdrop blur

2. **Stage 2: Auto-Type Command (0.8s)**
   - Automatically types "nav" character by character
   - Realistic typing delays (80-200ms between characters)
   - Blinking cursor animation

3. **Stage 3: Loading Response (0.5s)**
   - Terminal loading indicator with animated dots
   - Brief loading state before navigation reveal

4. **Stage 4: Text Morphing (1.2s)**
   - Navigation links start as random characters
   - Gradually morph into actual section names
   - Matrix-style character cycling effect
   - Staggered animations (150ms delay between items)

5. **Stage 5: Navigation & Transition (2.0s)**
   - Click handling with orange highlight
   - Terminal expands to fullscreen
   - Matrix rain background effect
   - Loading messages before navigation completion

### ⌨️ Keyboard Navigation

- **1-5**: Quick navigation to respective sections
- **ESC**: Close terminal menu
- All keyboard shortcuts work only when menu is in 'ready' state

### 🎨 Visual Effects

- **Terminal Window**: Authentic terminal appearance with header buttons
- **Blinking Cursor**: Realistic cursor animation (530ms blink cycle)
- **Matrix Rain**: Canvas-based matrix effect during fullscreen transition
- **Scanline Effect**: Subtle CRT monitor scanline overlay
- **Glow Effects**: Terminal green glow on hover and selection
- **Text Glitch**: Glitch effect on selected navigation items

### 📱 Responsive Design

- **Desktop**: Terminal menu button in navigation bar
- **Mobile**: Hamburger menu button
- **Adaptive Sizing**: Terminal adjusts to screen size (600px max width on desktop, full width on mobile)

## Components

### TerminalMenu.tsx
Main terminal menu component handling all stages and animations.

**Props:**
- `isOpen: boolean` - Controls menu visibility
- `onClose: () => void` - Callback when menu closes
- `onNavigate: (sectionId: string) => void` - Callback for navigation

**States:**
- `entering`: Terminal sliding in
- `typing`: Typing "nav" command
- `loading`: Loading response
- `morphing`: Text morphing animation
- `ready`: Ready for user interaction
- `navigating`: Transitioning to selected section

### TerminalMatrixRain.tsx
Canvas-based matrix rain effect for fullscreen transitions.

**Props:**
- `isActive: boolean` - Enables/disables the effect

**Features:**
- Dynamic canvas sizing
- 60fps animation loop
- Gradient character rendering
- Configurable character set and colors

## Integration

### Navigation.tsx Integration

```typescript
import TerminalMenu from "./TerminalMenu";

const [isMenuOpen, setIsMenuOpen] = useState(false);

const handleNavigation = (sectionId: string) => {
  scrollToSection(sectionId);
  setIsMenuOpen(false);
};

return (
  <>
    <TerminalMenu
      isOpen={isMenuOpen}
      onClose={() => setIsMenuOpen(false)}
      onNavigate={handleNavigation}
    />
    {/* Navigation bar */}
  </>
);
```

## CSS Animations

Custom animations defined in `globals.css`:

- `terminal-scanline`: CRT scanline effect
- `terminal-flicker`: Subtle flicker animation
- `terminal-glow`: Pulsing glow effect
- `text-glitch`: Text glitch on selection
- `cursor-blink`: Terminal cursor animation
- `matrix-fall`: Matrix rain character animation
- `fade-in-up`: Smooth fade-in for elements

## Customization

### Colors
Defined in CSS variables:
- `--terminal-green`: #00ff88 (primary)
- `--terminal-orange`: #ff8c00 (selection)
- `--terminal-blue`: #00d4ff (accent)

### Timing Configuration
Adjust timing in component:
- `TYPING_DELAY_MIN`: 80ms
- `TYPING_DELAY_MAX`: 200ms
- `STAGE_DELAYS`: Configurable per-stage delays
- `MORPH_ITERATIONS`: 20 iterations for text morphing
- `MORPH_INTERVAL`: 60ms between morphing frames

### Character Set
Customize random character set in `RANDOM_CHARS` constant:
```typescript
const RANDOM_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
```

## Performance

- **GSAP**: Hardware-accelerated animations
- **Canvas Optimization**: RequestAnimationFrame for matrix rain
- **Memory Management**: Proper cleanup of intervals and timeouts
- **Throttled Rendering**: Optimized animation loops

## Browser Support

- Modern browsers with ES6+ support
- Canvas API support required for matrix rain
- CSS custom properties support required
- Tested on Chrome, Firefox, Safari, Edge

## Accessibility

- Keyboard navigation support
- Focus management
- Screen reader friendly (ARIA labels can be added)
- High contrast color scheme
- Clear visual feedback

## Future Enhancements

- [ ] Sound effects for typing and navigation
- [ ] Customizable terminal themes
- [ ] Command history
- [ ] Auto-complete suggestions
- [ ] More terminal commands (help, clear, etc.)
- [ ] Mobile gesture support
- [ ] Custom particle effects

## Credits

Inspired by:
- [Saisei website](https://saisei-sbj.webflow.io/) - Navigation flow
- The Matrix - Visual aesthetic
- Classic terminal interfaces - Interaction patterns
