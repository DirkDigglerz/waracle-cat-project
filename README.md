# 🐱 Waracle Cat Project

**Preview live demo:** [https://waracle-cat-project.vercel.app](https://waracle-cat-project.vercel.app)

---

## 📘 Intro

A modern single-page cat image manager built with **Next.js** and **TypeScript**, using **TheCatAPI** to upload, view, vote, and favourite cats.

---

## 🎯 My Goals

* Let users **upload** cat images via a form on `/upload` ✅
* **Redirect back to home** on success, or show validation/API errors ✅
* **Display uploaded cat images** in a responsive grid ✅
* Ensure images **scale correctly down to 340px** and do not stretch ✅
* Allow users to **favourite/unfavourite** a cat with toggle UI and API calls ✅
* Let users **vote up or down** each cat ✅
* **Display a score** for each cat based on vote difference ✅
* Maintain a **clean, modern design** that works across screen sizes ✅
* Show understanding of **UX expectations** like error handling and validation ✅

---

## ✨ Extras I Included

* ✅ File type and size validation during upload
* ✅ Toast notifications for feedback
* ✅ Zustand for managing vote/favourite state
* ✅ Responsive layout that adjusts seamlessly
* ✅ Hosted live on Vercel

---

## 🧰 Tech Stack & Implementation

| Tool/Lib       | Purpose                                  |
| -------------- | ---------------------------------------- |
| **Next.js**    | Routing, SSR/CSR hybrid, fast setup      |
| **TypeScript** | Type safety and development confidence   |
| **Zustand**    | Global state for votes/favourites        |
| **TheCatAPI**  | API for all image/favourite/vote actions |
| **Vercel**     | Hosting and deployment                   |

* All image data, votes, and favourites are handled **client-side**
* Votes and favourites update **optimistically** with UI feedback
* Layout is **mobile-first** and scales up to 4 columns using CSS grid/flex
---

## 🕒 Things I’d Have Liked to Do

* Replace loading spinner with **skeleton loaders** for smoother image loading
* **Refactor state management** into clearer, more modular stores
* Add **sorting/filtering** by score or favourite status
* Add **pagination or lazy loading** for performance
* Improve **upload page styling** to better match the rest of the UI
* Implement **accessibility improvements** (ARIA, keyboard nav)
* Improve **optimisim** with my buttons, some of them don't feel great.
* Add **tests** with Jest, MSW, and Playwright/Cypress for confidence
* Integrate **user authentication** to support private uploads
* Use appropraite **api** system implement into next.js to handle server side fetching.

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
