# AI Chatbot Playground 🤖🎨

A modern, responsive React-based AI Chatbot Playground that allows users to chat with an AI (via OpenRouter's Mistral 7B) and generate images (via Hugging Face's Stable Diffusion XL). 

## Core Features 🚀
- **💬 Chat Mode**: Real-time conversation with Mistral 7B.
- **🎨 Image Mode**: Generate high-quality images from text prompts using Stable Diffusion XL.
- **🌓 Theme Toggle**: Built-in dark and light modes.
- **📱 Responsive UI**: Beautiful glassmorphic design that works perfectly on desktop and mobile devices.
- **⚙️ UX Embellishments**: Typing indicators, auto-scaling input fields, smooth history auto-scrolling, and disabled states during generation.

## Running Locally

1. **Prerequisites**
   Ensure you have Node.js and npm installed.

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up API Keys**
   Create a `.env` file in the root directory (alongside `package.json`). An example file `env.example` has been provided, or you can create it directly:
   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   VITE_HF_API_TOKEN=your_huggingface_api_token_here
   ```
   *Note: Do not expose these keys publicly! They should only be stored locally in `.env` or in your hosting provider's environment variables.*

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open the localhost URL provided in your terminal!

---

## 🚀 Deployment Guide

### Deploying to Vercel (Recommended)

1. **Sign up / Log in** to [Vercel](https://vercel.com/).
2. **Push your code to GitHub**, GitLab, or Bitbucket.
3. In Vercel, click **Add New** -> **Project**.
4. Import your Git repository.
5. In the **Configure Project** settings:
   - Expand the **Environment Variables** section.
   - Add the following keys:
     - `VITE_OPENROUTER_API_KEY`: (paste your key)
     - `VITE_HF_API_TOKEN`: (paste your token)
6. Click **Deploy**. Vercel will automatically build the app and provide you with a live URL.

### Deploying to Netlify

1. **Sign up / Log in** to [Netlify](https://netlify.com/).
2. Navigate to your dashboard and click **Add new site** -> **Import an existing project**.
3. Connect your Git provider and select your repository.
4. Netlify should auto-detect Vite's settings (`npm run build` and `dist` directory).
5. Click **Show advanced** at the bottom, then click **New variable**.
   - Add `VITE_OPENROUTER_API_KEY` and your actual API key as the value.
   - Add `VITE_HF_API_TOKEN` and your actual token as the value.
6. Click **Deploy site**.
7. Once finished, click on the generated link to preview your deployed Chatbot!
