<img width="1632" height="2176" alt="blocktrust_pet_walk_alert" src="https://github.com/user-attachments/assets/57e352c3-094b-4096-9761-a7c123166b32" />
# BlockTrust – Your Neighborhood Hub

**BlockTrust** is a community platform for neighbors to connect, share, and support each other. Built as a free-speech alternative to Nextdoor.

## Features

- 🐾 **Lost & Found Pets** – Post urgent alerts with rewards. Escrow holds payment until the pet is found.
- 🛠️ **Verified Local Pros** – Background-checked, licensed handymen, plumbers, and more.
- 💬 **Free Speech** – No censorship. We only remove illegal activity, harassment, or spam.
- 👑 **Premium Membership** – $9.99/month. Unlimited alerts, boosted posts, and a verified badge.
- 📰 **Community News** – Block parties, events, meetings, and local updates.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend:** Supabase (Auth, Database, Storage)
- **Payments:** Stripe (coming soon)
- **Hosting:** GitHub Pages

## Deployment

1. Fork this repository
2. Enable GitHub Pages in Settings → Pages
3. Select the `main` branch and `/root` folder
4. Visit `https://yourusername.github.io/blocktrust`

## Environment Variables (for Supabase)

Add these to your `index.html` in the `<script>` section:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
