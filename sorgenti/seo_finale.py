"""
Rifiniture e controlli SEO finali su repo-github/ (si lancia da solo alla fine di build_repo.py).

1. Link relativi ai PDF nelle pagine interne -> assoluti (evitava i 404 tipo /firenze/modulistica/...).
2. /piani-di-studio/: rinvio pulito (niente noindex in conflitto con canonical + refresh).
3. sitemap.xml: <lastmod> = data reale dell'ultima modifica della pagina (da git), non la data della build.
4. llms-full.txt: il testo di tutte le pagine in un file solo, per ChatGPT, Perplexity, Claude, Copilot.
5. Controlli: link interni rotti, eventi senza endDate, JSON-LD non valido. Se trova errori si ferma.
"""
import html as H, json, os, re, subprocess, sys, datetime
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent / "repo-github"
SITE = "https://unicesd-olympo.com"
TODAY = datetime.date.today().isoformat()
SKIP = ("sorgenti", "_to_delete", ".git")
REL_PDF = re.compile(r'(href|src)="(?!https?:|/|#|mailto:|tel:|javascript:|data:|whatsapp:|sms:)((?:modulistica/)?[^"/]+\.pdf|modulistica/[^"]+)"')


def pages():
    for d, ds, fs in os.walk(REPO):
        ds[:] = [x for x in ds if x not in SKIP]
        for f in fs:
            if f.endswith(".html"):
                yield Path(d) / f


def fix_relative_links():
    n = 0
    for p in pages():
        if p.parent == REPO:
            continue  # in radice i percorsi relativi sono giusti
        s = p.read_text(encoding="utf-8")
        s2, k = REL_PDF.subn(r'\1="/\2"', s)
        if k:
            p.write_text(s2, encoding="utf-8"); n += k
    print(f"[seo] link relativi ai PDF corretti: {n}")


PIANI = """<!DOCTYPE html>
<html lang="it"><head><meta charset="utf-8"><title>Piani di studio | UNICESD Olympo</title>
<link rel="canonical" href="https://unicesd-olympo.com/corsi-di-laurea/">
<meta http-equiv="refresh" content="0; url=https://unicesd-olympo.com/corsi-di-laurea/">
<script>location.replace("/corsi-di-laurea/")</script></head>
<body><p>I piani di studio ora sono dentro la scheda di ogni corso: <a href="/corsi-di-laurea/">vai ai corsi di laurea</a>.</p></body></html>
"""


def fix_redirects():
    d = REPO / "piani-di-studio"; d.mkdir(exist_ok=True)
    (d / "index.html").write_text(PIANI, encoding="utf-8")


def _norm(b: str) -> str:
    b = re.sub(r"\?v=[0-9a-zA-Z]+", "", b)
    b = re.sub(r'"dateModified": "[^"]*"', "", b)
    b = re.sub(r"\d{2}/\d{2}/20\d{2}", "", b)  # "aggiornata al gg/mm/aaaa" visibile nelle guide
    return re.sub(r"<lastmod>[^<]*</lastmod>", "", b)


def _git(*a):
    return subprocess.run(["git", "-C", str(REPO), *a], capture_output=True, text=True, timeout=30)


def real_lastmod():
    sm = REPO / "sitemap.xml"
    x = sm.read_text(encoding="utf-8")
    ok = _git("rev-parse", "HEAD").returncode == 0
    def repl(m):
        url = m.group(1)
        rel = url.replace(SITE, "").lstrip("/") + "index.html"
        date = TODAY
        if ok:
            old = _git("show", f"HEAD:{rel}")
            cur = (REPO / rel).read_text(encoding="utf-8") if (REPO / rel).exists() else ""
            if old.returncode == 0 and _norm(old.stdout) == _norm(cur):
                d = _git("log", "-1", "--format=%cs", "--", rel).stdout.strip()
                date = d or TODAY
                # pagina invariata: anche dateModified torna alla data vera
                cur2 = re.sub(r'("dateModified": ")\d{4}-\d{2}-\d{2}(")', lambda k: k.group(1) + date + k.group(2), cur)
                it_today = datetime.date.today().strftime("%d/%m/%Y")
                it_date = datetime.date.fromisoformat(date).strftime("%d/%m/%Y")
                cur2 = cur2.replace(it_today, it_date)
                if cur2 != cur:
                    (REPO / rel).write_text(cur2, encoding="utf-8")
        return f"<loc>{url}</loc>\n    <lastmod>{date}</lastmod>"
    x = re.sub(r"<loc>([^<]+)</loc>\s*<lastmod>[^<]*</lastmod>", repl, x)
    sm.write_text(x, encoding="utf-8")
    print(f"[seo] sitemap: lastmod reali ({len(set(re.findall(r'<lastmod>([^<]+)', x)))} date diverse)")


def _text(s: str) -> str:
    m = re.search(r"<main[^>]*>(.*)</main>", s, re.S)
    s = m.group(1) if m else s
    for tag in ("script", "style", "noscript", "svg", "form", "template", "dialog"):
        s = re.sub(rf"<{tag}\b.*?</{tag}>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<(br|/p|/h[1-6]|/li|/tr|/div|/section)\b[^>]*>", "\n", s, flags=re.I)
    s = re.sub(r"<h([1-6])\b[^>]*>", lambda m: "\n" + "#" * (int(m.group(1)) + 1) + " ", s, flags=re.I)
    s = re.sub(r"<li\b[^>]*>", "\n- ", s, flags=re.I)
    s = H.unescape(re.sub(r"<[^>]+>", " ", s))
    lines = [" ".join(l.split()) for l in s.split("\n")]
    out, seen = [], set()
    for l in lines:
        if len(l) < 3 or l in ("-", "#"):
            continue
        if l in seen and len(l) < 80:
            continue
        seen.add(l); out.append(l)
    return "\n".join(out)


def llms_full():
    urls = re.findall(r"<loc>([^<]+)</loc>", (REPO / "sitemap.xml").read_text(encoding="utf-8"))
    head = (REPO / "llms.txt").read_text(encoding="utf-8").split("\n## ")[0].strip()
    parts = [head, "",
             "Questo file raccoglie il testo di tutte le pagine pubbliche di unicesd-olympo.com, per i motori di risposta AI. "
             "Indice breve: " + SITE + "/llms.txt", ""]
    for u in urls:
        rel = u.replace(SITE, "").lstrip("/") + "index.html"
        f = REPO / rel
        if not f.exists():
            continue
        s = f.read_text(encoding="utf-8")
        t = H.unescape((re.search(r"<title>(.*?)</title>", s, re.S) or [None, ""])[1].strip())
        d = H.unescape((re.search(r'<meta name="description" content="([^"]*)"', s) or [None, ""])[1])
        body = _text(s)
        if len(body) > 20000:
            body = body[:20000].rsplit("\n", 1)[0] + "\n[...] testo completo: " + u
        parts += ["", "---", "", f"## {t}", f"URL: {u}", f"Sintesi: {d}", "", body]
    (REPO / "llms-full.txt").write_text("\n".join(parts) + "\n", encoding="utf-8")
    li = REPO / "llms.txt"; t = li.read_text(encoding="utf-8")
    if "llms-full.txt" not in t:
        li.write_text(t.rstrip() + "\n\n## Testo completo\n- [llms-full.txt](" + SITE + "/llms-full.txt): il testo integrale di tutte le pagine del sito in un solo file.\n", encoding="utf-8")
    print(f"[seo] llms-full.txt: {len(urls)} pagine, {(REPO / 'llms-full.txt').stat().st_size // 1024} KB")


def checks():
    errors = []
    attr = re.compile(r'(?:href|src)="([^"#?]+)')
    for p in pages():
        s = p.read_text(encoding="utf-8")
        base = "/" + str(p.parent.relative_to(REPO)).replace(".", "") + "/"
        base = base.replace("//", "/")
        for u in attr.findall(s):
            if re.match(r"^(https?:|mailto:|tel:|javascript:|data:|whatsapp:|sms:|//)", u) or "'" in u or "+" in u or "${" in u:
                continue
            path = u if u.startswith("/") else base + u
            fp = REPO / path.lstrip("/")
            if path.endswith("/"):
                ok = (fp / "index.html").exists()
            else:
                ok = fp.exists() or (fp / "index.html").exists()
            if not ok:
                errors.append(f"404: {path}  (in {p.relative_to(REPO)})")
        for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
            try:
                data = json.loads(b)
            except Exception as e:
                errors.append(f"JSON-LD non valido in {p.relative_to(REPO)}: {e}"); continue
            def walk(x):
                if isinstance(x, dict):
                    if x.get("@type") == "Event" and x.get("startDate") and not x.get("endDate"):
                        errors.append(f"Event senza endDate: {x.get('name')} (in {p.relative_to(REPO)})")
                    for v in x.values(): walk(v)
                elif isinstance(x, list):
                    for v in x: walk(v)
            walk(data)
    sm = (REPO / "sitemap.xml").read_text(encoding="utf-8")
    for u in re.findall(r"<(?:loc|image:loc)>([^<]+)<", sm):
        rel = u.replace(SITE, "").lstrip("/")
        f = REPO / (rel + "index.html" if (rel == "" or rel.endswith("/")) else rel)
        if not f.exists():
            errors.append(f"sitemap -> 404: {u}")
        elif f.name == "index.html" and 'name="robots" content="noindex' in f.read_text(encoding="utf-8"):
            errors.append(f"sitemap contiene una pagina noindex: {u}")
    errors = sorted(set(errors))
    if errors:
        print("\n".join(errors[:60]))
        raise SystemExit(f"[seo] {len(errors)} problemi trovati")
    print("[seo] controlli superati: 0 link rotti, 0 eventi senza endDate, JSON-LD valido, sitemap pulita")


def main():
    fix_relative_links()
    fix_redirects()
    real_lastmod()
    llms_full()
    checks()


if __name__ == "__main__":
    main()
