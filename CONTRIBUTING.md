# Working on Meta Tutor — two people, one repo

Two accounts use the live app (Jacob = RCA/chess/trivia/riemann, Cristian = Metaphysics course —
see `src/lib/access.ts`), and two people now touch the code. This doc exists because the
previous free-for-all (both pushing straight to `main`) already caused one real conflict — see
the 2026-08-24 entry in `STATUS.md` where a 13-commit push landed mid-session and had to be
reconciled by hand.

## The rule
- **Jacob** can push/merge anything, including straight to `main`, same as before.
- **Cristian** never pushes directly to `main`. He works on a branch, opens a PR, and either
  merges it himself (if it doesn't touch a Jacob-owned path) or waits for Jacob's review (if it
  does). `CODEOWNERS` at the repo root defines which paths are Jacob-owned — mostly `/src/app/rca`,
  `/chess`, `/trivia`, `/riemann`, `/hub`, and core plumbing (`auth.ts`, `proxy.ts`, `access.ts`,
  `next.config.ts`, `package.json`, the Supabase schema files). Everything under
  `/src/app/metaphysics`, `/study`, `/glossary`, `/dashboard`, `/notes`, `/sources`, `/compare`,
  `/map`, `/faith`, `/journal`, `/timeline`, `/schedule`, `/countdown`, `/review` is his to merge
  freely.

This is enforced by GitHub branch protection + CODEOWNERS review requirements, **not yet turned
on** — Jacob is holding off until Cristian's GitHub username is known. To turn it on:

```bash
# 1. Add Cristian as a collaborator (replace CRISTIAN_GH_USERNAME)
gh api repos/cascone26/meta-tutor/collaborators/CRISTIAN_GH_USERNAME -X PUT -f permission=push

# 2. Also update CODEOWNERS' "everything else" comment if you want to name him explicitly —
#    not required, paths with no owner line just don't require review.

# 3. Turn on branch protection for main: require a PR, require code-owner review on owned
#    paths, block force-push.
gh api repos/cascone26/meta-tutor/branches/main/protection -X PUT --input - <<'EOF'
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "require_code_owner_reviews": true,
    "required_approving_review_count": 0
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
```

`enforce_admins: false` means Jacob (repo admin) can still push straight to `main` and bypass
the PR requirement whenever he wants — same freedom he has today. Cristian, as a non-admin
collaborator, cannot.

## Working on the same Mac at the same time
When Cristian is staying with Jacob and both are running Claude Code against this repo, **don't
both point a Claude Code session at the same working directory at once** — uncommitted files
from one session collide with the other. Instead, give Cristian's session its own checkout:

```bash
# From inside ~/projects/meta-tutor
git worktree add ../meta-tutor-cristian -b cristian/work
```

Point Cristian's Claude Code (or his own laptop's clone) at `~/projects/meta-tutor-cristian`
instead of the shared folder. He commits/pushes `cristian/work` → PR → merge, same as any other
branch. Remove the worktree when done: `git worktree remove ../meta-tutor-cristian`.

## Deploys
Only merges to `main` deploy to production (`meta-tutor.vercel.app`). A branch or open PR never
touches the live site — so even before branch protection is turned on, Cristian working on a
branch and asking Jacob to merge is the safe default regardless.
