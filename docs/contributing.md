# Contributing

A reference for anyone making code changes to the blog. Read [`overview.md`](./overview.md) first for the high-level architecture and the data-flow model. This doc covers the practical "how do I do X" questions.

## Adding a new route or page

1. **Create the page component** at `src/pages/<Name>.tsx`. Pages are plain React components; they read boot data via `usePageData<T>()` and fall back to fetching when needed.
2. **Register the route** in `src/App.tsx` inside the `<Routes>` block. Use `react-router-dom`'s `<Route path="..." element={<YourPage />} />`.
3. **Prerender it (if you want a static HTML file at that URL)** — add a block in `scripts/prerender.ts` that mirrors the `/non-tech` handler:
   ```ts
   const data = await client.request(/* your query */, vars)
   const html = render('/your-path', data)
   writeHtml(path.join(distClient, 'your-path/index.html'),
            buildHtml(template, html, data))
   ```
   For routes without server data, pass `{}` as the second argument to `render`.
4. **Update `netlify.toml`** if the new route needs a redirect from a legacy URL.

If you skip step 3, the route still works as an SPA — the user just won't get prerendered HTML on the first request.

## Adding or changing a Hygraph field

GraphQL queries are duplicated by design: `scripts/prerender.ts` runs in Node at build time, and `src/api/cms.ts` runs in the browser. Both need to know about new fields.

1. Update the schema in Hygraph and publish.
2. Update the matching query in **both**:
   - `src/api/cms.ts` (`GetPostsQuery`, `GetPostBySlugQuery`)
   - `scripts/prerender.ts` (`GetAllTechPosts`, `GetPostBySlug`)
3. Add or edit the field on the type in `src/types/post.type.ts` (or `tag.type.ts`).
4. Render it in `src/components/Article.tsx` or `src/components/PostItem.tsx`.
5. Trigger a Hygraph webhook → Netlify rebuild (or run `npm run build` locally to verify).

## Design system tokens

All design tokens live in the `@theme` block at the top of `src/styles/index.css`. Tailwind v4 auto-generates utilities from these (e.g. `--color-brand` → `bg-brand`, `text-brand`, `border-brand`).

| Group | Tokens |
|---|---|
| Surface | `--color-bg`, `--color-surface`, `--color-header-bg`, `--color-border` |
| Text | `--color-text`, `--color-text-muted` |
| Brand | `--color-brand`, `--color-brand-hover`, `--color-brand-soft`, `--color-visited` |
| Code | `--color-code-bg` |
| Type | `--font-sans` (PT Sans, self-hosted from `public/fonts/pt-sans/`) |
| Breakpoints | `--breakpoint-tablet` (768px) → use the `tablet:` prefix in classes |

Prose styles (markdown body) are defined below the `@theme` block in the same file, scoped to `.prose`.

## Components reference

All in `src/components/`.

| Component | Role |
|---|---|
| `AppLayout` | Page container — handles top padding under the fixed header and the 768px max-width column |
| `Header` | Fixed top header with site title and social links |
| `PostsNav` | Inline `Tech · Off-topic` toggle above the post list (uses `NavLink`) |
| `PostItem` | Post preview card on the home and off-topic pages |
| `Article` | Full post detail — cover image, meta, tags, prose body |
| `Tag` | Small pill rendered inside post meta |
| `CommentSection` | Wraps the Utterances widget in a styled section |

## Utilities reference

All in `src/utils/`.

| File | Exports | Purpose |
|---|---|---|
| `calculateReadTime.ts` | default function | Estimates reading time in minutes (255 words/min) |
| `date.ts` | `getLongFormattedDate` | Formats an ISO date as `Month D, YYYY` |
| `gtags.ts` | `pageview`, `event` | Thin wrappers around `window.gtag` for GA — no-op if GA isn't loaded |

## Comments widget (Utterances)

Configured in `src/components/CommentSection.tsx`. The relevant fields:

| Option | Current value | Notes |
|---|---|---|
| `repo` | `willamesoares/blog` | The GitHub repo where issues hold the comment threads |
| `theme` | `github-light` | Use any Utterances theme — see [utteranc.es](https://utteranc.es) |
| `issue-term` | `title` | Comments are bound to issues whose title matches the post title |
| `label` | `blog post comments` | Label automatically applied to issues created by Utterances |

Switching `repo` requires installing the Utterances GitHub App on the new repo.

## GA / analytics

Wired in `src/App.tsx`:

- The script tags only render when `import.meta.env.PROD` **and** `VITE_GA_TRACKING_ID` is set. Local dev never loads GA.
- A `useEffect` on `useLocation()` fires `gtag.pageview` on every route change.
- Custom events go through `gtag.event` from `src/utils/gtags.ts`. Examples:
  - `Header.tsx` — `social_network` clicks
  - `PostItem.tsx` — `post_click` events tagged with `tech` or `non-tech`

To track a new event, add an entry to `GAEventAction` / `GAEventCategory` in `src/types/ga-events.type.ts` and call `gtag.event({...})`.

## TypeScript & path aliases

- `~/*` resolves to `src/*` — works in both `tsconfig.json` and `vite.config.ts`. Prefer `import X from '~/utils/...'` over relative paths beyond one level.
- Strict mode is on; `noEmit` is true (Vite handles transpilation). There's no separate `tsc` step in the build.

## Code conventions (current state)

The project is intentionally lean:

- **No ESLint config, no Prettier, no test runner, no CI workflow.** The maintainer reviews PRs manually.
- **No pre-commit hooks.** Be your own gate-keeper.
- TypeScript strict mode catches most regressions at build time (`npm run build`).

If you'd like to introduce one of these, open a PR with a short rationale.
