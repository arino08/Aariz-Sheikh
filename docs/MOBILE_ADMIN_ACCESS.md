# Mobile Admin Access Guide

## 🔐 How to Access Admin Panel on Mobile

Since keyboard shortcuts (Ctrl+K) don't work well on mobile devices, we've implemented a **secret gesture** to access the admin terminal!

## Step-by-Step Instructions

### 1. Navigate to the Bottom of the Page
- Scroll all the way down to the **Contact section**
- Look for the footer with copyright information

### 2. Find the Copyright Text
Look for this text:
```
© 2025 Aariz Sheikh. All rights reserved.
```

### 3. Triple-Tap the Copyright
- Tap the copyright text **3 times quickly**
- Each tap must be within **500ms** of the previous tap
- If you tap too slowly, it will reset and you'll need to start over

### 4. Admin Terminal Opens
- After 3 quick taps, the admin terminal will slide up from the bottom
- You'll see a terminal window with a prompt

### 5. Enter the Secret Code
- Type: `az8576`
- Press Enter or tap the Submit button
- The Admin Panel will open!

## Tips for Success

✅ **Do:**
- Tap quickly (within half a second between taps)
- Tap directly on the copyright text line
- Use your finger or stylus on touchscreen

❌ **Don't:**
- Tap too slowly (will reset after 500ms)
- Tap outside the copyright text area
- Double-tap (needs to be 3 taps)

## Alternative Method (If Available)

If you have a physical keyboard connected to your mobile device:
1. Press `Ctrl+K` (or `Cmd+K` on iOS with keyboard)
2. Enter code: `az8576`
3. Access admin panel

## Troubleshooting

**Triple-tap not working?**
- Make sure you're tapping the copyright line specifically
- Tap faster - all 3 taps should happen within 1.5 seconds total
- Try refreshing the page and scrolling to the bottom again

**Terminal opens but code doesn't work?**
- Make sure you're typing: `az8576` (lowercase)
- Check for typos
- Try copying and pasting the code

**Can't find the copyright text?**
- Scroll all the way to the bottom of the page
- It's in the Contact section, below all the social links
- Look for the footer with "Built with Next.js..." text above it

## Security Note

This gesture-based access is intentionally hidden to prevent unauthorized access. Only share this information with trusted administrators!

## Technical Details

- **Tap Detection Window**: 500ms between each tap
- **Global Function**: `window.openAdminTerminal()`
- **Components Modified**:
  - `ContactSection.tsx` (triple-tap handler)
  - `GlobalTerminalShortcut.tsx` (global function)
  - `ProjectsSection.tsx` (mobile hint)

## Desktop Users

Desktop users can still use the keyboard shortcut:
- **Windows/Linux**: `Ctrl+K`
- **Mac**: `Cmd+K`

Then enter the secret code: `az8576`
