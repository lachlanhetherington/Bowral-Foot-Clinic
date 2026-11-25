# The Bowral Foot Clinic

Static, code-first redesign for review. The 24 routes use folder-based URLs with an `index.html` in each folder. Serve the repository as the web root.

```powershell
py -3 -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765/. Booking buttons open the Bowral Nookal booking flow.

The HTML is ready to serve. To regenerate from the original sites, create a sibling `Incoming` folder, set `BOWRAL_PLAYWRIGHT` to the installed Playwright package location, and run `node collect.cjs` followed by `node build.cjs` from this directory. Chrome is used to collect the existing page content and metadata. Generating new shopfront WebP assets requires FFmpeg.

## Migration notes

- Use the existing WordPress pages and Rank Math values. Keep the Prolotherapy URL at `/shockwave-therapy-2/`.
- Recreate the shared header and footer with free Blocksy, and the page bodies in Elementor.
- Retain the existing Site Kit tags on the Bowral WordPress installation. The static review component links to the verified Bowral Google Maps listing. Confirm any review widget's content and settings against Ahpra's health-service advertising guidance before carrying it over.
- Confirm Arega Sarkisian’s portrait in the Bowral Media Library. The public Dr Abbie profile uses initials, which the static preview also uses.
- The existing About route displays WordPress sample copy. The preview uses the clinic introduction from the existing homepage on that route and retains its existing metadata.
- Clinic images and logo come from the Bowral public Media Library. Three practitioner portraits and the featured treatment thumbnails come from the Dr Abbie family site. The Poppins license is in `assets/poppins-OFL.txt`.
