<img width="1632" height="2176" alt="blocktrust_pet_walk_alert" src="https://github.com/user-attachments/assets/57e352c3-094b-4096-9761-a7c123166b32" />


# Corkboard — Nextdoor Post Checker

A static, front-end-only tool that checks a draft Nextdoor post for the kinds of things that usually get posts removed — off-topic national politics, naming and shaming a neighbor, local scams, unregulated goods for sale — before you post it.

Runs entirely in the browser. No backend, no build step, no server-side storage.

**[Live demo →](#)** *(fill in once you enable GitHub Pages — see below)*

## How it works

1. Paste your OpenAI API key into the field (or leave it blank — the three preset examples run a canned demo verdict so you can see the UI without a key).
2. Write or paste your draft post.
3. Click **Check it**. The app sends your draft to `gpt-4o-mini` (or `gpt-4o`) with a system prompt describing Nextdoor's community guidelines, and asks for a structured JSON verdict.
4. The verdict renders as a stamped card — approved, or flagged with a category, a plain-language reason, and a rewritten version you can copy.

## Why it's safe to run as a static site

Your API key is stored only in your browser's `localStorage` and is sent directly from your browser to `api.openai.com`. It never touches any server we control, because there isn't one. That said:

- **Don't commit an API key to the repo.** If one ever ends up in a public commit, revoke it immediately — bots scrape public GitHub repos for exposed keys within seconds.
- Anyone using your hosted copy of this site is trusting their key to their *own* browser, not to you — but they should still only ever use a key they're comfortable pasting into a public web page. Consider adding a spend limit on the key in your OpenAI dashboard.
- The "no key" demo mode never makes a network call at all — it just displays a hardcoded verdict for the built-in presets, so it's safe to leave enabled on a public page.

## Project structure

```
corkboard/
├── index.html   # layout
├── style.css    # visual design
├── app.js       # logic: API calls, demo mode, rendering
└── README.md
```

## Running locally

No install needed — just open `index.html` in a browser. For a closer-to-production setup (some browsers restrict `fetch` from `file://` pages), serve it locally instead:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Choose the `main` branch and the `/ (root)` folder, then save.
5. GitHub will give you a URL like `https://<username>.github.io/<repo>/` within a minute or two.

## Known limitations

- This is a moderation *aid*, not a guarantee — Nextdoor's actual moderation is a mix of automated filters, Neighborhood Leads, and reported content, and this tool can't see any of that. Treat a green stamp as "looks fine to me," not "guaranteed to stay up."
- The AI model can misjudge borderline or sarcastic posts. Always read the reasoning, don't just trust the stamp.
- The no-key demo mode only has real logic for the three built-in presets; anything else typed with no key falls back to a very rough keyword guess, clearly labeled as such in the reasoning.

## Ideas for next steps

- Read a `?preset=` or `?text=` query param on load so people can share a pre-filled example link.
- Render `reason` / `suggested_fix` as Markdown if responses start including formatting.
- Add a word-count nudge, since very long posts tend to get less engagement on Nextdoor regardless of compliance.
- Support pasting a screenshot and checking it with a vision-capable model.

## License

MIT — do whatever you want with it.

