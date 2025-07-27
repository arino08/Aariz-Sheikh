# Developer's Terminal - Portfolio Website

A stunning, terminal-themed portfolio website built with Next.js, featuring interactive 3D graphics, smooth animations, and a unique developer-focused aesthetic.

## 🚀 Features

- **Terminal Theme**: Dark, code editor-inspired design with syntax highlighting colors
- **3D Graphics**: Interactive Three.js animations and Matrix-style particle effects
- **Smooth Animations**: GSAP-powered scroll-triggered animations
- **Horizontal Scrolling Projects**: Unique compilation-style project showcase
- **Responsive Design**: Optimized for all device sizes
- **TypeScript**: Full type safety throughout the codebase
- **Performance Optimized**: Built with Next.js App Router for optimal loading

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS with custom terminal color scheme
- **Animations**: GSAP 3 with ScrollTrigger
- **3D Graphics**: React Three Fiber (@react-three/fiber) and Drei (@react-three/drei)
- **Fonts**: Inter (UI) and JetBrains Mono (code elements)
- **TypeScript**: Full type safety
- **Package Manager**: npm

## 🎨 Design Features

### Color Scheme

- **Background**: Deep charcoal (#0D1117)
- **Terminal Green**: #00ff88
- **Terminal Orange**: #ff8c00
- **Terminal Purple**: #8b5cf6
- **Terminal Blue**: #00d4ff

### Sections

1. **Hero**: 3D Matrix rain with typing animation
2. **About**: Code-style biography with glitch effects
3. **Skills**: Animated wireframe tech icons
4. **Projects**: Horizontal scrolling with compilation animations
5. **Contact**: Terminal-style contact information

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── globals.css          # Global styles and custom CSS
│   ├── layout.tsx           # Root layout with fonts
│   └── page.tsx             # Main page component
├── components/
│   ├── sections/            # Main page sections
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── ContactSection.tsx
│   ├── 3d/                  # Three.js components
│   │   └── MatrixRain.tsx
│   └── ui/                  # Reusable UI components
│       ├── Navigation.tsx
│       └── TypingAnimation.tsx
└── public/                  # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Customization

1. **Personal Information**: Update the following files with your details:

      - `components/sections/HeroSection.tsx` - Name and title
      - `components/sections/AboutSection.tsx` - Bio and details
      - `components/sections/ContactSection.tsx` - Contact information
      - `components/sections/ProjectsSection.tsx` - Your projects

2. **Projects**: Modify the `projects` array in `ProjectsSection.tsx` with your own projects

3. **Skills**: Update the `skills` array in `SkillsSection.tsx` with your technologies

4. **Styling**: Customize colors in `app/globals.css` CSS variables

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🎯 Performance Features

- **Optimized 3D Rendering**: Efficient particle systems and animations
- **Lazy Loading**: Components load as needed
- **Font Optimization**: Google Fonts with `font-display: swap`
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component for optimal loading

## 🌟 Animation Details

- **GSAP ScrollTrigger**: Scroll-based animations for section reveals
- **Horizontal Scroll**: Custom GSAP implementation for projects section
- **3D Interactions**: Mouse-responsive Three.js scenes
- **Typing Effects**: Custom typing animation component
- **Glitch Effects**: CSS-based glitch animations on hover

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for medium screens
- **Desktop Enhanced**: Full feature set on large screens
- **Touch Interactions**: Mobile-friendly navigation and interactions

## 🔧 Customization Guide

### Adding New Projects

1. Add project data to the `projects` array in `ProjectsSection.tsx`
2. Include code snippets, tech stack, and links
3. Add project images to the `public/projects/` directory

### Modifying Animations

- Adjust GSAP timelines in individual section components
- Modify Three.js scenes in the `components/3d/` directory
- Update CSS animations in `globals.css`

### Changing Colors

Update CSS variables in `globals.css`:

```css
:root {
        --terminal-green: #your-color;
        --terminal-orange: #your-color;
        --terminal-purple: #your-color;
        --terminal-blue: #your-color;
}
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms

Build the project:

```bash
npm run build
```

Then deploy the `.next` folder to your hosting platform.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Contact

Feel free to reach out if you have questions or want to collaborate!

- **Email**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **LinkedIn**: [Your Name](https://linkedin.com/in/yourusername)

---

Built with ❤️ using Next.js, Three.js, GSAP, and lots of ☕

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
