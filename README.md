# pixels-to-products-cloudinary-ai-hackathon-2026-cloudpixels
Hackathon team repository for CloudPixels - [hackindia-team:pixels-to-products-cloudinary-ai-hackathon-2026:cloudpixels]

# ListingFix

**Photo audit for online sellers.** Upload a phone photo of your product, get a 0-100 score with every lost point explained, and download a cleaned-up version that is closer to what marketplaces expect.

**Live demo:** https://pixels-to-products-cloudinary-ai-ha-omega.vercel.app/
**Video Link:**https://drive.google.com/file/d/1GK1nSiZrwcbM2bi4O0J4r0BFGmhPq0zV/view?usp=drivesdk

**Team:** 
- Aman Yadav ([@amanyadav2107](https://github.com/amanyadav2107)) ]
- Divyanshi ([@divyanshisrivastava395](https://github.com/divyanshisrivastava395)) 
- Kanishka Shishodia ([KanishkaShishodia](https://github.com/KanishkaShishodia))

Built for the Pixels to Products hackathon with Next.js and Cloudinary.

---

## The problem

Small sellers often get listings rejected or buried because the main photo breaks simple image rules: low resolution, a cluttered background, a product that is too small in the frame, or a photo that is not square. Most sellers do not know which rule they broke, and fixing it usually means learning an editor.

## What ListingFix does

1. **Upload** a JPG, PNG or WebP photo. Optionally crop it and adjust brightness before sending.
2. **Pick a marketplace** (Amazon main image or Instagram post).
3. **Tap what to remove** (for example scissors, a hand, a cup) or type your own.
4. **Get the result:** before/after view, a score before and after, and a plain-language list of what was found and what was fixed.
5. **Generate a caption draft**, then download the fixed image or copy its link.

## Features

| Feature | How it works |
|---|---|
| Photo score (0-100) | Rule-based checks run on the real image pixels, before and after the fix |
| Reasons for every lost point | Each rule that fails shows what was wrong, the points lost, and whether we could fix it |
| Object removal | Cloudinary Generative Remove, one pass per object you name |
| Background removal and white background | Cloudinary background removal, trim, then pad to a 1000 x 1000 white canvas |
| Auto-enhance | Cloudinary `improve` effect at a gentle strength |
| "Keep my photo" mode | Skips the cut-out and only enhances and squares the photo, for cases where the cut-out is unreliable |
| Crop and brightness editor | In the browser, before upload |
| Before/after slider and side-by-side view | In the result screen |
| Caption draft | Template-based draft from the product name and features you type |
| Download and copy link | Download the fixed image or copy its URL |

## How the score works

The score starts at 100 and loses points for each rule that fails. The rules are visible in `lib/score.js`.

| Rule | Points | Applies to |
|---|---|---|
| Resolution (shortest side below the preset minimum) | 25 | All presets |
| Background is not white | 35 | Amazon |
| Image is not square | 10 | All presets |
| Product fills too little of the frame | 30 | All presets |

The "before" score is measured on your original upload. The "after" score is measured by fetching the fixed image and running the same checks on it, so the improvement is measured, not assumed.

Resolution cannot be fixed by this app. If your photo is too small, the reason says so and asks you to retake it.

**Important:** the preset numbers (for example 1000 px minimum side and 85% fill for Amazon, 1080 px and 80% for Instagram) are **our reading of marketplace guidance, not official verified values.** They live in one place (`PRESETS` in `lib/score.js`) so they are easy to correct. ListingFix reduces rejection risk. It does not guarantee approval.

## Tech stack

- **Next.js** (App Router) and React
- **Cloudinary** for upload, background removal, generative object removal and enhancement
- **sharp** on the server to read pixels and measure the score
- Deployed on **Vercel**

## Run it locally

```bash
git clone [https://github.com/amanyadav2107/pixels-to-products-cloudinary-ai-hackathon-2026-cloudpixels]
cd [pixels-to-products-cloudinary-ai-hackathon-2026-cloudpixels]
npm install 
```

Create a `.env.local` file in the project root with your Cloudinary credentials (use the variable names that `lib/cloudinary.js` reads):

```
CLOUDINARY_CLOUD_NAME=duqqueqbs
CLOUDINARY_API_KEY=417111987143721
CLOUDINARY_API_SECRET=w2lRDiOi7isRDMJfxHQjD0WweuI
```

Then start the app:

```bash
npm run dev
```

Open http://localhost:3000. To check a production build, run `npm run build`.

Never commit `.env.local`. It is listed in `.gitignore`.

## Known limitations

We would rather tell you than hide it:

- **Cut-out depends on contrast.** If the product has the same colour as the surface it sits on (for example a white shirt on a white sheet), the cut-out can remove part of the product. Use "Keep my photo" in that case, or photograph the product on a contrasting surface.
- **Object removal works best on clearly visible, simple objects.** Very small, very large or reflective objects may be missed. It only removes what you name.
- **A single photo can take 20 to 60 seconds**, because the server fetches the processed image again to measure the new score.
- **The caption is a template draft, not AI-written.** Always edit it, and add real details such as material and size, so it stays accurate.
- **Resolution cannot be improved** by this app.
- **Each processed photo uses Cloudinary transformation credits**, including one extra background-removal pass used to measure the original photo's fill.
- **Photos are uploaded to our Cloudinary account** for processing. Only a small history of results is kept in your own browser.

## Future work

- Upload and process several photos at once
- Detect duplicate photos before upload
- Download all results as a ZIP
- More marketplace presets, with values verified against official guidelines
- Optional AI captions through a Cloudinary add-on, when enabled on the account
- Re-enable the history compare view (built, currently hidden)

## Project structure

```
app/            Next.js pages and the /api/process route
components/     Upload, editor, score gauge and card, caption box, before/after viewer
lib/            cloudinary setup, transformation chain, scoring rules, history helpers
public/         Sample images
```




