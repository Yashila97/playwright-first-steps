# Playwright — first steps

Four tests against [Swag Labs](https://www.saucedemo.com), a public practice site.

**This is a learning log, not a framework, and I would rather say so than dress it up.**
My professional experience is manual, exploratory, API and accessibility testing. I am
learning Playwright because the UK market expects it and because I want to automate the
regression checks I currently repeat by hand. This repository is where that learning is
visible, at whatever stage it is currently at.

## What's here

| Test | What it checks |
|---|---|
| `a customer can log in` | The happy path. The first thing anyone writes |
| `invalid credentials are refused` | The negative path, and that the page does not navigate anyway |
| `an item added to the cart appears in the cart` | State change reflected in the UI |
| `the checkout total equals subtotal plus tax` | The arithmetic. The only one I actually care about |

```bash
npm ci
npx playwright install --with-deps chromium
npm test
```

## What I deliberately have not added yet

No page objects, no fixtures, no CI pipeline, no data-driven tests, no visual
comparison. Not because I do not know those exist — because adding structure I cannot
yet defend in a conversation would be cargo-culting. When I understand why a page object
helps more than it costs on a suite this size, I will add one and say what changed.

## What I brought with me, and what I am learning

The last test is the difference between this and a tutorial. It collects the subtotal
and tax from the summary and asserts the total matches to two decimal places, because I
have spent three years on a platform where a rounding error in a payout is the defect
that matters and a "confirmation page appeared" check would have passed straight over
it.

Knowing *what to assert* is the part I brought from six years of manual testing. The
syntax is the part I am learning, and it is by far the easier half. Most first automation
suites check that a page loaded.

Three things that have surprised me so far:

1. **Auto-waiting.** I spent years adding waits to make things stable. Playwright waits
   for an element to be actionable before acting, and there is not a single
   `waitForTimeout` in this repository. The deliberately slow test account on Swag Labs
   passes without one.
2. **`codegen`.** `npx playwright codegen` records clicks and writes the first draft, so
   you start by editing rather than authoring. That is a very different learning curve
   from a blank file.
3. **Locators are lazy.** `page.locator(...)` does not query the page when you write it;
   it queries when you use it. That explains most of the confusing failures I had in the
   first week.

## Next

- Understand what makes a locator resilient rather than just working today
- Move the shared login into a fixture, once I can explain why
- One CI run, to see the reporting
- Then decide whether page objects are worth it at this size

## Author

Naga Yashila Araveti — QA Engineer.
[LinkedIn](https://www.linkedin.com/in/naga-araveti)
