# rifatbinsiraj.github.io
# portfolio
# portfolio

## CVs

`cv/cv.html` is the source of both CVs. Rebuild them with:

```bash
cv/build.sh
```

That regenerates `cv/cv-ats.html` and writes `Rifat_Bin_Siraj_CV.pdf` and
`Rifat_Bin_Siraj_CV_ATS.pdf` at the repo root, which is what the site links to.

## CV deployment to Google Drive

Pushing to `origin` is the deploy. The `pre-push` hook checks whether the pushed
commits change either PDF and, only then, runs `scripts/sync-cv-to-drive.sh`, which
uploads both to the shared Drive folder (`1lGxjBGMk8ZqD6-j7jgT0FltmljYH-EXg`),
replacing the existing files in place so their Drive IDs and share links stay valid.
A push that leaves the PDFs alone never touches Drive, and the upload itself also
compares checksums, so identical content is never re-sent.

One-time setup:

```bash
brew install rclone
```

```bash
rclone config
```

In `rclone config`: `n` for a new remote, name it `gdrive`, choose the `drive`
storage type, leave client id and secret blank, pick scope `1` (full access), skip the
advanced config, and authorise in the browser as **rifatrabbi024@gmail.com** — the
account that owns the two files in that folder.

```bash
git config core.hooksPath .githooks
```

Then verify:

```bash
scripts/sync-cv-to-drive.sh
```

Without rclone or the remote, the script prints a notice and exits cleanly, and the
hook never blocks a push. Overrides: `CV_DRIVE_REMOTE`, `CV_DRIVE_FOLDER_ID`.
