# Sagun Devkota — Portfolio

Personal portfolio for Sagun Devkota, Python/Django developer. Plain HTML, CSS and JavaScript with no build step.

## Features

- **Warm, human design**: white, ink blue and coral palette, soft cards, hand-drawn SVG doodles
- **Light & dark themes**: follows the OS setting, with a manual toggle
- **Responsive**: mobile-first, tuned at 375px, 768px and 1280px
- **Accessible**: semantic landmarks, skip link, visible focus states, WCAG AA contrast
- **Progressive enhancement**: works fully with JavaScript disabled

## Files

- `index.html`: all content
- `style.css`: design tokens and styles
- `main.js`: theme toggle, mobile menu, scroll reveal, active nav link, contact form mailto

## Sections

- **Hero**: Introduction, Upwork rating and key stats
- **About**: Professional summary and location
- **Experience**: Detailed work experience at KaimakiWeb
- **Selected work**: Showcase of major projects with links
- **Skills**: Technical skills organized by category
- **Education & recognition**: Pokhara University, awards and certificates
- **Testimonials**: What clients say
- **Contact**: Contact information, social links and email form

## Getting Started

1. **Clone or download** this repository
2. **Open** `index.html` in your web browser
3. That's it! No build process or dependencies required.

## Customization

### Colors

Edit the design tokens at the top of `style.css` (light values on `:root`, dark values in the `prefers-color-scheme` / `[data-theme="dark"]` blocks):

```css
:root {
    --bg: #FFFFFF;      /* white */
    --accent: #2949A8;  /* ink blue */
    --pop: #F26B5B;     /* coral, decorative */
    /* ... more tokens */
}
```

### Content

Edit the HTML in `index.html` to update:
- Personal information
- Experience details
- Projects
- Skills
- Contact information

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Keyboard Shortcuts

- `Ctrl/Cmd + S`: Toggle scanlines effect
- `Ctrl/Cmd + H`: Scroll to home section
- Konami Code: Easter egg (try it!)

## Technologies Used

- HTML5
- CSS3 (with CSS Variables)
- Vanilla JavaScript
- Google Fonts (Press Start 2P, Share Tech Mono)

## Deployment

You can deploy this portfolio to:

- **GitHub Pages**: Simply push to a GitHub repository and enable Pages
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your repository
- **Any static hosting service**

## License

This portfolio template is free to use and modify for personal or commercial projects.

## Credits

Designed and developed with a retro aesthetic in mind, inspired by classic terminal interfaces and CRT monitors.

---

**Built with ❤️ and retro vibes**

