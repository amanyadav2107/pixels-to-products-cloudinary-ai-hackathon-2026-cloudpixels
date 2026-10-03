# pixels-to-products-cloudinary-ai-hackathon-2026-cloudpixels
Hackathon team repository for CloudPixels - [hackindia-team:pixels-to-products-cloudinary-ai-hackathon-2026:cloudpixels]

# ListingFix: Listing Readiness Engine

> Marketplace rejects your photos? Fix them in one click.

**ListingFix** helps online sellers turn a random phone photo into a marketplace-ready product image, and tells them exactly why the original wasn't ready.

Built for the **Pixels to Products: Cloudinary AI Hackathon 2026** (Hack India) by team **CloudPixels**.

<!-- Add a screenshot or GIF here -->
<!-- ![ListingFix demo](./docs/demo.png) -->

**Live demo:** _add link here_  
**Demo video:** _add link here_

---

## The Problem

Sellers on Amazon, Instagram and other marketplaces often get listings rejected or buried because of photo issues: low resolution, a product that is too small in the frame, a cluttered background, or a hand holding the item. Most sellers don't know *what* is wrong, and fixing it means learning photo editing tools.

## The Solution

A seller uploads a raw photo. ListingFix:

1. **Scores it out of 100** with clear reasons (resolution, product fill, background).
2. **Fixes it automatically** using Cloudinary AI.
3. Shows a **before/after view** with a **new score**.
4. **Exports a marketplace preset**, such as an Amazon main image.

## Features

- **Readiness score (0-100)** with a breakdown of why the photo passes or fails
- **Generative Remove** deletes hands and unwanted objects (type what to remove, e.g. "hand, cup")
- **Background Removal** isolates the product
- **Auto padding** centres the product on a pure white square
- **Optimised delivery** with `f_auto` and `q_auto`
- **Before/after slider** to compare the original and the fixed image
- **Marketplace presets** such as Amazon (main image) and Instagram (post)

## How It Works

```
Upload photo
    |
    v
Analyse original  -->  Score (resolution, product fill, background)
    |
    v
Cloudinary AI pipeline
    1. Generative Remove   (hands / unwanted objects)
    2. Background Removal  (isolate product)
    3. Pad + centre on pure white square
    4. Deliver with f_auto, q_auto
    |
    v
Re-score  -->  Before/after view  -->  Export marketplace preset
```

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) 16 (App Router, Turbopack) |
| UI | React 19, CSS Modules |
| Image AI | [Cloudinary](https://cloudinary.com/) (Generative Remove, Background Removal, transformations) |
| Image analysis | [sharp](https://sharp.pixelplumbing.com/) |
| Linting | ESLint 9 with `eslint-config-next` |

## Project Structure

```
.
├── app/
│   ├── api/process/route.js   # Backend: scoring + Cloudinary pipeline
│   ├── layout.js
│   ├── page.js                # Landing page + upload UI
│   ├── page.module.css
│   └── globals.css
├── components/
│   ├── BeforeAfter.js         # Before/after comparison view
│   └── ScoreCard.js           # Score and reasons display
├── lib/
│   └── chain.js               # Processing chain helpers
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js 20.9 or newer** (required by Next.js 16 and sharp)
- A free **Cloudinary account** with the AI add-ons enabled (see note below)

### 1. Clone the repository

```bash
git clone https://github.com/amanyadav2107/pixels-to-products-cloudinary-ai-hackathon-2026-cloudpixels.git
cd pixels-to-products-cloudinary-ai-hackathon-2026-cloudpixels
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

You can find these values in your Cloudinary dashboard. Never commit `.env.local` to git.

> **Note:** Generative Remove and Background Removal are Cloudinary AI features that may need to be enabled as add-ons on your account.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If port 3000 is busy, Next.js will use 3001 and print the URL in the terminal.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Lint the codebase with ESLint |

## Usage

1. Drop a product photo (JPG or PNG) onto the upload area.
2. *(Optional)* Type what to remove, for example `hand, cup`.
3. Choose a marketplace preset (Amazon main image, Instagram post).
4. Click the fix button and review the **before/after** view and the new score.
5. Download the marketplace-ready image.

## Branches

| Branch | Purpose |
| --- | --- |
| `main` | Stable, combined project |
| `frontend` | UI work |
| `backend` | API route and Cloudinary pipeline |

## Roadmap

- [ ] More marketplace presets (Flipkart, Etsy, Shopify)
- [ ] Batch upload for whole catalogues
- [ ] AI-generated titles and descriptions for listings
- [ ] Shadow and lighting enhancement

## Team

**CloudPixels**: Hack India, Pixels to Products: Cloudinary AI Hackathon 2026

- Aman Yadav ([@amanyadav2107](https://github.com/amanyadav2107))
- _add teammates here_

## License

Add a license of your choice (for example MIT) and update this section.

---

Built with Cloudinary AI and Next.js.

