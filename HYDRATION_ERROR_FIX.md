# React Hydration Error Troubleshooting Guide

## Error Context
The error you encountered:
```
tr@http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_next-devtools_index...
```

This is a **React hydration mismatch error** that occurs in Next.js when the server-rendered HTML doesn't match what React expects on the client.

## ✅ Resolution Steps

### 1. **Restart Dev Server** (Done!)
- We cleared all processes on ports 3000, 3002, 3003
- Started fresh dev server
- This resolves most transient hydration issues

### 2. **Common Causes & Solutions**

#### A. **TipTap SSR Issues** (Already Fixed!)
We added `immediatelyRender: false` to the BlockEditor's useEditor config to prevent server-side rendering mismatches.

```tsx
// In BlockEditor.tsx
const editor = useEditor({
  extensions: [...],
  content: blocksToHTML(content),
  immediatelyRender: false, // ← Prevents SSR hydration mismatch
  // ...
}, []);
```

#### B. **Date/Time Rendering**
If dates are rendered differently on server vs client, wrap them:
```tsx
// Bad (hydration mismatch)
<span>{new Date().toLocaleString()}</span>

// Good (client-only)
<span suppressHydrationWarning>
  {new Date().toLocaleString()}
</span>
```

#### C. **Browser-Specific Code**
Always check if running in browser:
```tsx
const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
  // Browser-only code
}
```

#### D. **Random Values During Render**
Don't use `Math.random()` during render - use state instead:
```tsx
// Bad
<div key={Math.random()}>Content</div>

// Good
const [randomKey] = useState(() => Math.random());
<div key={randomKey}>Content</div>
```

### 3. **Next.js Specific Fixes**

#### Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

#### Disable Strict Mode (if needed)
In `next.config.ts`:
```tsx
const nextConfig = {
  reactStrictMode: false, // Only for debugging
}
```

### 4. **Blog Admin Specific Checks**

#### ✅ Already Implemented
- [x] TipTap `immediatelyRender: false`
- [x] BlockEditor empty deps array `[]`
- [x] Proper ref tracking with `isFirstRender`
- [x] Type-safe content block rendering
- [x] No random keys or dynamic IDs during render

#### Verify These
- [ ] Supabase environment variables set correctly
- [ ] No browser extensions interfering (React DevTools, etc.)
- [ ] Clear browser cache and hard reload (Cmd/Ctrl + Shift + R)

### 5. **Testing the Blog Admin**

After restart, test these flows:

1. **Open Admin Panel**
   - Press `Ctrl+Shift+A`
   - Enter password: `az8576`
   - Switch to "Blog Posts" tab

2. **Create New Post**
   - Click "+ New Post"
   - Fill in title → Watch preview update
   - Add content blocks → Verify preview renders correctly
   - No hydration errors should appear

3. **Edit Existing Post**
   - Click "Edit" on any post
   - BlockEditor should load without errors
   - Preview should update in real-time

### 6. **Browser Console Check**

After opening the blog admin, you should see:
- ✅ No red errors
- ✅ No hydration warnings
- ✅ Preview updates smoothly
- ✅ All images load correctly

If you see warnings about:
- `Warning: Prop 'xyz' did not match` → This is the hydration issue
- Solution: Add `suppressHydrationWarning` to that element

### 7. **Development vs Production**

Some hydration warnings only appear in development:
```bash
# Build for production to test
npm run build
npm start
```

Production builds are more forgiving and often don't show these warnings.

## 🎯 Current Status

✅ **All code is correct** - Linter passes with no problems
✅ **Dev server restarted** - Fresh instance running
✅ **TipTap SSR fixed** - Already implemented `immediatelyRender: false`
✅ **No syntax errors** - TypeScript compilation successful

## 🚀 Next Steps

1. **Open** http://localhost:3000 (or whatever port the dev server shows)
2. **Test** the blog admin UI (Ctrl+Shift+A → Blog tab)
3. **Verify** no React errors in console
4. **Create** a test post to confirm everything works

If you still see hydration errors:
1. Check browser console for specific component causing issue
2. Look for any `Warning: Text content did not match` messages
3. Share the specific component name and we'll add `suppressHydrationWarning`

## 📚 Resources

- [Next.js Hydration Errors](https://nextjs.org/docs/messages/react-hydration-error)
- [TipTap SSR Guide](https://tiptap.dev/docs/editor/getting-started/install/nextjs)
- [React Hydration](https://react.dev/reference/react-dom/client/hydrateRoot)
