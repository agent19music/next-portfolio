# Supabase Integration

This project uses Supabase for authentication and data storage. Follow these steps to ensure proper configuration:

## Environment Variables

1. Update your `.env.local` file to include the following Supabase variables with the `NEXT_PUBLIC_` prefix:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The existing `SUPABASE_URL` and `SUPABASE_ANON_KEY` variables (without the `NEXT_PUBLIC_` prefix) should be kept for server-side operations.

## Using the Supabase Client

The Supabase client is initialized in a centralized location at `src/lib/supabase.ts`. Import and use it in your components like this:

```tsx
import supabase from '@/lib/supabase';

// Now you can use the supabase client
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'example@email.com',
  password: 'example-password',
});
```

## Authentication Example

An example authentication component is provided at `src/components/examples/SupabaseAuthExample.tsx`. You can use this as a reference for implementing Supabase authentication in your application.

## Troubleshooting

If you encounter issues with Supabase client initialization:

1. Make sure the environment variables are correctly set with the `NEXT_PUBLIC_` prefix in `.env.local`
2. Check the browser console for any error messages during development
3. Verify that the Supabase project URL and anon key are correct
4. Restart the Next.js development server after making changes to `.env.local`

# Hello, I'm Sean Motanya! 👋✨

Certified Software Engineer | Anime Enthusiast | JavaScript Ninja 🥷

I'm a Computer Science student with a passion for crafting dynamic and immersive web experiences. My stack? A lethal combo of **ReactJS** and **NextJS** on the frontend, with **Flask** powering the backend. 💻

## Skills 🚀
- **Frontend:** ReactJS, NextJS, Bootstrap, Tailwind CSS
- **Backend:** Flask
- **Languages:** JavaScript, Python, HTML, CSS

## Projects 🎮

### Campo Social 🌐
- **Description:** A social media app where connections come alive. Built with **React Bootstrap** for sleek UI and **Flask** for a robust backend. Connect, share, and stay updated with the latest trends.
- **Technologies Used:** React.js, Bootstrap, Flask

### Anime Store 🛒
- **Description:** A mock anime merchandise shopping site for all the otakus out there! 🎌
- **Technologies Used:** React.js, Flask, Bootstrap
- **GitHub Link:** [Check it out](https://github.com/agent19music/anime-store-react)

### Vitapaharm Cosmeics 💼
- **Description:** A fully functional beauty and cosmetics e-commerce platform with all the bells and whistles, built for the real world! 🌐
- **Technologies Used:** React.js, Tailwind CSS, Flask
- **LIve Link:** [Check it out](https://vitapharmcosmetics.co.ke)


## Education 🎓
- **Major:** Computer Science
- **University:** Riara University
- **Graduation Year:** 2025

## Let's Connect! 📫
- **Email:** seanmotanya@gmail.com

Thank you for stopping by my GitHub portfolio! 🚀 Let's build something awesome together!
