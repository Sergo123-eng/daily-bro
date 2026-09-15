# Daily Bro

An interactive portfolio demo that helps visitors make room for movement, social connection and rest. Daily Bro and Gym Bro turn a quick check-in into three small actions, with easier alternatives, swaps, calendar reminders and a private Little Wins history.

This version uses a local, deterministic suggestion library and guided conversational replies. It does not claim to be a live LLM or a personalized fitness/medical service. No account, API key, analytics or backend is required. Free-text conversation remains in memory; plans and completed actions persist in browser localStorage. Suggestions do not represent verified local events or bookings.

## Run

Serve this folder with any static server, for example `python -m http.server 5190`. Open `http://localhost:5190`. Run `node --test planner.test.mjs` for planning budget, swap, calendar and safety checks.

Deploy the root files to GitHub Pages. The robots meta tag requests no indexing; anyone with the URL can access and share the demo. Fonts load from Google Fonts with system fallbacks. No build is required.
