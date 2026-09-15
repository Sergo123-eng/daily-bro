# Daily Bro + Gym Bro

### Small actions for a life that has room for more than work.

**[Try the interactive demo](https://sergo123-eng.github.io/daily-bro/)** · [Suggestion logic](planner.js) · [Intent matching](context.js) · [Tests](planner.test.mjs)

Daily Bro is an interactive wellbeing prototype that helps visitors make room for movement, connection, and rest. A check-in becomes a few realistic actions that can be made easier, swapped, scheduled, or marked complete.

## Two modes

- **Daily Bro:** a calming activity, a social connection, or a break from work.
- **Gym Bro:** manageable, familiar movement with room for recovery.

The interface avoids streak penalties and productivity scores. A small step still counts.

## Try these check-ins

| Prompt | Intended response |
| --- | --- |
| “I feel overwhelmed. Suggest an activity at home.” | Quiet, low-pressure activities. |
| “I want to be more sociable.” | Ways to find a group, start an introduction, or say hello. |
| “I cannot sleep.” | Gentle ideas for winding down. |
| “I want to be alone. No exercise. Only five minutes.” | Solo suggestions within the stated time. |

## Features

- Energy, time, setting, and equipment check-ins
- Guided prompt matching with common constraints
- Easier alternatives and swappable actions
- A conversational interface with an explicit chat-to-plan control
- Downloadable `.ics` calendar reminders
- A Little Wins history stored on the current device
- Responsive desktop and mobile layouts

## How it works

**This version uses a local suggestion library and deterministic intent matching. It is not connected to a live AI model.**

The matcher identifies common wellbeing requests and constraints. The planner ranks written suggestions, limits planned time, and offers smaller alternatives. New chat topics replace earlier requests rather than retaining an unrelated topic.

The demo is free to try without accounts, API keys, or model downloads. Unfamiliar or nuanced language can require clarification, and recommendations can repeat within a category.

## Run and test

No build or dependency installation is required.

```sh
python -m http.server 5190
```

Open `http://localhost:5190`. With a current Node.js installation:

```sh
npm test
```

Tests cover distinct requests, topic changes, short time limits, swap constraints, easier alternatives, and calendar output.

## Repository guide

- [`index.html`](index.html): application structure and dialogs
- [`style.css`](style.css): responsive visual design
- [`app.js`](app.js): interactions, local persistence, chat, and downloads
- [`context.js`](context.js): intent matching and focused action library
- [`planner.js`](planner.js): ranking, time budgets, alternatives, and calendar generation

## Privacy and scope

Plans and completed actions are saved in browser localStorage. Free-text check-ins and conversations stay in tab memory and are not sent to an AI service. The host and font provider receive normal network requests.

Calendar files create personal reminders; they do not book events. Club suggestions are ideas to investigate, not verified meetings. This is general wellbeing guidance, not medical care or personalized training.

The site requests no search indexing; anyone with the URL can open and share it.
