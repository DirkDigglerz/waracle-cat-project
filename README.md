# 🐱 Waracle Cat Project

**Live Demo:** [https://waracle-cat-project.vercel.app](https://waracle-cat-project.vercel.app)

---

## 📘 Intro

A modern single-page cat manager built with **Next.js App Router** and **tRPC**, powered by **TheCatAPI**. Users can upload, vote, and favourite cat images — with fully responsive UI, smooth animations, and optimistic updates.

---

## 🎯 Features

✅ Upload cat images with validation  
✅ Toggle favourite/unfavourite with optimistic UI  
✅ Vote up/down with live score tracking  
✅ Fully responsive cat grid layout  
✅ Debounced mutation calls to prevent spam  
✅ Animated floating cloud background  
✅ Toast notifications for feedback  
✅ Zustand store for persisted user ID  
✅ tRPC mutations for API interaction  
✅ TanStack Query for caching & optimistic updates  
✅ Clean, modular component and hook structure  

---

## ✨ Stack & Tools

| Tool/Lib                  | Purpose                                                                 |
|---------------------------|-------------------------------------------------------------------------|
| **Next.js (App Router)**  | Routing, SSR/CSR hybrid, fast setup                                     |
| **TypeScript**            | Type safety and dev confidence                                          |
| **tRPC + React Query**    | Fully typed API with client-server linking & caching                    |
| **TanStack Query**        | Cache, deduplication, and optimistic updates                            |
| **Zod**                   | Schema validation for procedures                                        |
| **Zustand**               | Global state (user UUID persistence)                                    |
| **Mantine**               | UI components and responsive layout                                     |
| **Lucide React**          | Icons                                                                   |
| **Framer Motion**         | Background cloud animations                                             |
| **Vercel**                | Hosting and CI/CD                                                       |
| **TheCatAPI**             | Cat image, favourite, and vote endpoints                                |

---

## 🖼 UI Overview

- Mobile-first layout with grid scaling up to 4 columns
- Clean, modern design using Mantine components
- Dynamic cloud background using Framer Motion
- Optimistic feedback for votes and favourites
- Toasts for success/error messages

---

## 💡 Potential Improvements

- Skeleton loaders while fetching cats
- More modular Zustand slices
- Filter/sort cats by score or favourite status
- Pagination or infinite scroll
- Better loading/disabled states for some buttons
- Accessibility polish (keyboard nav, ARIA)
- Upload form restyle to match main app theme
- Add tests with Playwright, Jest or MSW
- Move some logic to `app/api/` routes for server-side control
- Auth system for persistent user accounts

---

## ⚙️ Dev Setup & Running

**1. Clone the repo**

```bash
git clone https://github.com/yourusername/waracle-cat-project.git
cd waracle-cat-project
```

**2. Install dependencies**

```bash
npm install
# or
yarn
# or
pnpm
```

**3. Environment Variables**
Create a `.env.local` file and add your TheCatAPI key:

```env
NEXT_PUBLIC_CAT_API_KEY=your_api_key_here
```

**4. Run the Dev Server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

---

Let me know if you'd like a version with screenshots or badges added too.
