# Repo setup commands (run with `gh`)

> **Permissions:** both sections below need a repo **admin**. You must be an
> admin of `graybyrd13/not-slop` (or the org that owns it) to run any of these.
> Nothing here is a no-permission operation — `gh` will 403/404 otherwise.

## (a) Enable GitHub Discussions — [needs repo admin]

`gh repo edit` does not expose a discussions flag, so this goes through the
REST API:

```bash
gh api --method PATCH repos/graybyrd13/not-slop -f has_discussions=true
```

Verify: `gh api repos/graybyrd13/not-slop --jq .has_discussions` should print
`true`, and a "Discussions" tab appears on the repo. Alternative without the
CLI: repo page → Settings → General → check "Discussions".

## (b) Branch protection on `main` — [needs repo admin]

Requires pull requests, forbids direct pushes, and makes the
`corpus-validation` status check required:

```bash
gh api --method PUT repos/graybyrd13/not-slop/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks[strict]=true \
  -f 'required_status_checks[checks][][context]=corpus-validation' \
  -f enforce_admins=true \
  -f required_pull_request_reviews[required_approving_review_count]=1 \
  -f required_pull_request_reviews[dismiss_stale_reviews]=true \
  -f allow_force_pushes=false \
  -f allow_deletions=false
```

What this enforces:

- Every change to `main` arrives via a pull request (no direct pushes; admins
  included via `enforce_admins`).
- PRs need one approving review, and stale reviews are dismissed on new
  commits.
- The branch must be up to date and the `corpus-validation` check must pass
  before merge.
- No force-pushes, no branch deletion.

Verify:

```bash
gh api repos/graybyrd13/not-slop/branches/main/protection \
  --jq '{checks: .required_status_checks.checks[].context, admins: .enforce_admins.enabled, reviews: .required_pull_request_reviews.required_approving_review_count}'
```

**Caveat:** GitHub only lets you mark `corpus-validation` required after that
check has reported at least once on `main`. Run the validation workflow on
`main` first (push a trivial commit or trigger it manually), then apply
protection.
