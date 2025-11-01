# Pizzailo - Recipe Manager

A personal recipe management application with shopping lists, ingredient management, and print functionality. Built with Next.js 16, Supabase, and Tailwind CSS.

## Features

- 🍳 **Recipe Management**: Create, edit, duplicate, and scale recipes
- ⭐ **Favorites**: Save your favorite recipes
- 📋 **Shopping Lists**: Generate shopping lists from recipes
- 🛒 **Shopping List Management**: Organize and track shopping items
- 📦 **Ingredient Management**: Manage your ingredient database
- 👨‍🍳 **Cooking Mode**: Step-by-step cooking instructions
- 🖨️ **Print Support**: Print recipes and shopping lists (LTR/RTL support)
- 🌐 **Multi-directional**: Support for LTR and RTL layouts
- 🔐 **Google OAuth**: Secure authentication with Google

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)
- Supabase account

### Installation

1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd code
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up Supabase database
   - Run the SQL migrations in `scripts/` folder (in order):
     - `01-create-recipes-tables.sql`
     - `02-create-favorites-table.sql`
     - `03-update-favorites-with-user.sql`
     - `04-create-shopping-lists.sql`

5. Configure Google OAuth
   - Follow instructions in `GOOGLE_AUTH_SETUP.md`
   - Enable Google provider in Supabase Dashboard
   - Add redirect URL: `http://localhost:3000/auth/callback`

6. Run the development server
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

See `VERCEL_DEPLOYMENT.md` for detailed Vercel deployment instructions.

### Quick Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Update Supabase redirect URLs with your Vercel domain

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── recipes/           # Recipe pages
│   ├── shopping-lists/    # Shopping list pages
│   └── ingredients/       # Ingredient management
├── components/            # React components
├── lib/                   # Utility functions
│   ├── auth/             # Authentication logic
│   ├── db/               # Database functions
│   ├── supabase/         # Supabase clients
│   └── contexts/         # React contexts
├── scripts/              # SQL migration scripts
└── public/               # Static assets
```

## Features in Detail

### Recipe Management
- Create recipes with ingredients, instructions, and metadata
- Edit existing recipes
- Duplicate recipes
- Scale recipes (adjust servings)
- Filter by category and favorites
- Print recipes

### Shopping Lists
- Generate shopping lists from recipe ingredients
- Create and manage multiple shopping lists
- Check off items as you shop
- Print shopping lists in a formatted schedule

### Cooking Mode
- Step-by-step cooking instructions
- Timer integration (prep time, cook time)
- Full-screen cooking experience

### Print Features
- Monochrome printing
- LTR/RTL support
- Formatted recipe cards
- Shopping list schedules

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## License

Private project - Personal use

