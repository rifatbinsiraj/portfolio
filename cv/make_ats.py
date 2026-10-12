"""Builds cv-ats.html from cv.html: the same content, without the photo, colour or grid layouts that trip up
applicant tracking systems."""
import re
from pathlib import Path

HERE = Path(__file__).parent

LINK_PATTERN = re.compile(r"^(linkedin\.com|github\.com|drutoai\.com|[\w.-]+\.github\.io)")

ATS_STYLE = """
    @page { size: Letter; margin: 0.5in 0.6in; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 10pt; line-height: 1.35; color: #000; }
    a { color: #000; text-decoration: none; }
    h1 { font-size: 18pt; margin: 0 0 2px; }
    .role { font-size: 11pt; margin: 0 0 4px; }
    .contact { margin: 0; }
    h2 { font-size: 11.5pt; margin: 14px 0 4px; padding-bottom: 2px; border-bottom: 1px solid #000; text-transform: uppercase; }
    p { margin: 0 0 4px; }
    ul { margin: 2px 0 6px; padding-left: 18px; list-style: disc outside; }
    li { margin-bottom: 2px; }
    .entry { margin: 6px 0 2px; }
    .entry-title { font-weight: bold; }
"""


def text_of(fragment: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", fragment)).strip()


def build() -> None:
    source = (HERE / "cv.html").read_text(encoding="utf-8")
    body = source[source.index("<body>") + len("<body>"): source.index("</body>")]

    header = re.search(r"<header>(.*?)</header>", body, re.S).group(1)
    name = text_of(re.search(r"<h1>(.*?)</h1>", header, re.S).group(1))
    role = text_of(re.search(r'<p class="role">(.*?)</p>', header, re.S).group(1))
    contacts = [text_of(span) for span in re.findall(r"<span>(.*?)</span>", header, re.S)]
    contacts = [f"https://{item}" if LINK_PATTERN.search(item) else item for item in contacts]
    head_html = f'<h1>{name.title()}</h1>\n  <p class="role">{role}</p>\n  <p class="contact">{" | ".join(contacts)}</p>'
    body = body.replace(re.search(r"<header>.*?</header>", body, re.S).group(0), head_html)

    def flatten_definitions(match: re.Match) -> str:
        pairs = re.findall(r"<dt>(.*?)</dt>\s*<dd>(.*?)</dd>", match.group(0), re.S)
        return "\n".join(f"<p><strong>{text_of(term)}:</strong> {text_of(detail)}</p>" for term, detail in pairs)

    body = re.sub(r'<dl class="[^"]*">.*?</dl>', flatten_definitions, body, flags=re.S)

    def flatten_entry_head(match: re.Match) -> str:
        when = re.search(r'class="when">(.*?)</span>', match.group(1), re.S)
        title_text = text_of(re.sub(r'<span\s+class="when">.*?</span>', "", match.group(1), flags=re.S))
        when_text = f" | {text_of(when.group(1))}" if when else ""
        return f'<p class="entry"><span class="entry-title">{title_text}</span>{when_text}</p>'

    body = re.sub(r'<div class="job-head">(.*?)</div>', flatten_entry_head, body, flags=re.S)
    def split_heading(match: re.Match) -> str:
        subtitle = text_of(match.group(2)).lstrip("· ").strip()
        return f"<h2>{text_of(match.group(1))}</h2>\n  <p>{subtitle}</p>"

    body = re.sub(r'<h2>([^<]*)<span class="muted"[^>]*>(.*?)</span>\s*</h2>', split_heading, body, flags=re.S)
    body = re.sub(r'<span class="badge">(.*?)</span>', lambda match: f"({text_of(match.group(1))})", body, flags=re.S)
    body = body.replace('class="compact"', "")

    html = f"""<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>{name.title()} — CV</title>
  <style>{ATS_STYLE}  </style>
</head>

<body>{body}</body>

</html>
"""
    (HERE / "cv-ats.html").write_text(html, encoding="utf-8")


if __name__ == "__main__":
    build()
