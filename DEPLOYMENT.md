# 🚀 Deployment Guide

## Quick Deploy Options

### Option 1: GitHub Pages (Recommended)

1. **Create GitHub Repository:**

   ```bash
   git init
   git add .
   git commit -m "feat: Terminal portfolio with interactive commands"
   git branch -M main
   git remote add origin https://github.com/Peponks9/portfolio.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**

   - Go to repository Settings
   - Navigate to Pages section
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Save

3. **Live URL:** `https://peponks9.github.io/portfolio/`

### Option 2: Netlify (Instant)

1. Visit [netlify.com](https://netlify.com)
2. Drag the `portfolio` folder to deploy area
3. Get instant URL: `https://random-name.netlify.app`
4. Optional: Change site name in settings

### Option 3: Vercel

1. Visit [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Deploy with zero configuration
4. Get URL: `https://portfolio-username.vercel.app`

## Custom Domain (Optional)

### For GitHub Pages:

1. Add `CNAME` file with your domain
2. Configure DNS records with your provider
3. Enable HTTPS in repository settings

### For Netlify/Vercel:

1. Add custom domain in dashboard
2. Configure DNS records
3. SSL certificates are automatic

## Performance Optimizations

✅ **Already Included:**

- Optimized fonts with `preconnect`
- Minimal CSS and vanilla JavaScript
- Responsive design
- SEO meta tags
- Fast loading animations

## Post-Deployment Checklist

- [ ] Test all commands work correctly
- [ ] Verify mobile responsiveness
- [ ] Check theme toggle functionality
- [ ] Test GitHub API integration
- [ ] Verify all external links work
- [ ] Test contact form/links
- [ ] Check console for errors

## Monitoring & Analytics (Optional)

Add Google Analytics:

```html
<!-- Add before closing </head> tag -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

## Maintenance

### Regular Updates:

- Update GitHub projects section with new repositories
- Add new blog posts when published
- Update experience section with new roles
- Refresh skills based on current expertise

### Version Control:

```bash
# For future updates
git add .
git commit -m "feat: Add new project/update content"
git push origin main
```

---

**Your portfolio is production-ready! 🎉**
