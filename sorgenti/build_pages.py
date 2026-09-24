#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera le pagine dedicate del sito online (repo-github/<pagina>/index.html),
il CSS e il JS condivisi, sitemap.xml, robots.txt, llms.txt, manifest e icone,
e ritocca repo-github/index.html (link di navigazione verso le pagine vere).

Va lanciato DOPO build_repo.py (che lo richiama da solo alla fine).
I testi delle pagine stanno in pagine.py.

Uso:  python3 build_pages.py
"""
import datetime
import html as H
import json
import pathlib
import re
import shutil

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
REPO = ROOT / "repo-github"

import sys
sys.path.insert(0, str(HERE))
from pagine import SITE, COURSES, HUBS, PAGES, ANCHOR_MAP, TAB_MAP, TEXT_MAP  # noqa: E402

TODAY = datetime.date.today().isoformat()
ORG_ID = SITE + "/#organizzazione"
SITE_ID = SITE + "/#sito"
PERSON_ID = SITE + "/#calogero-di-carlo"

ns = {"__file__": str(HERE / "build.py")}
exec(HERE.joinpath("build.py").read_text(encoding="utf-8").split("MIMES = {")[0], ns)
TOKENS = dict(list(ns["IMAGES"].items()) + list(ns["AI_ASSETS"].items()))


def tok(s: str) -> str:
    """segnaposto __IMG_x__ -> /assets/... (percorso assoluto: le pagine stanno in sottocartelle)"""
    for t, rel in TOKENS.items():
        s = s.replace(t, "/assets/" + rel.split("img/", 1)[1])
    return s


def read(n):
    return (HERE / n).read_text(encoding="utf-8")


def plain(s: str) -> str:
    return " ".join(H.unescape(re.sub(r"<[^>]+>", " ", s)).split())


# ---------------------------------------------------------------------------
# pezzi della home
# ---------------------------------------------------------------------------
BODY = tok(read("body.html")).replace('href="monografia-calogero-di-carlo.pdf"', 'href="/monografia-calogero-di-carlo.pdf"')
CONTENT = read("content.html")
SCRIPT = read("script.html")
SCHEMA = json.loads(re.search(r"<script[^>]*>(.*)</script>", read("schema.html"), re.S).group(1))
NODES = {n["@type"]: n for n in SCHEMA["@graph"]}

PRE_MAIN = BODY[: BODY.index('<main id="top">')]
POST_MAIN = BODY[BODY.index("</main>") + len("</main>"):]
# niente preloader sulle pagine interne: il contenuto si vede subito
PRE_MAIN_PAGES = re.sub(r'<!-- ===== PRELOADER ===== -->\s*<div id="preloader".*?</div>\s*</div>\s*', "",
                        PRE_MAIN, count=1, flags=re.S)
PRE_MAIN_PAGES = re.sub(r'<div id="preloader".*?<div class="pl-pct">0%</div>\s*</div>', "", PRE_MAIN_PAGES,
                        count=1, flags=re.S)

SECTIONS = {m.group(1): m.group(0).lstrip("\n")
            for m in re.finditer(r'\n<section id="([\w-]+)".*?\n</section>', BODY, re.S)}

# testi completi dei modali (Giurisprudenza, master, ...), per le schede corso
def load_modal_data():
    i = SCRIPT.index("var ico=")
    j = SCRIPT.index("var DATA={")
    k = SCRIPT.index("\n};", j)
    js = SCRIPT[i:k + 3]
    import subprocess
    out = subprocess.run(["node", "-e", js + "\nprocess.stdout.write(JSON.stringify(DATA))"],
                         capture_output=True, text=True, check=True).stdout
    return json.loads(out)


DATA = load_modal_data()

# card dell'offerta (icona, sfondo, chip) prese dalla home
CARDS = {}
for m in re.finditer(r'<article class="card rv tilt (bg-[\w-]+)"[^>]*data-modal="(\w+)"><div class="card-ic">(.*?)</div><h3>(.*?)</h3><p>(.*?)</p><div class="card-meta">(.*?)</div>', BODY):
    CARDS[m.group(2)] = dict(bg=m.group(1), ic=m.group(3), h3=m.group(4), p=m.group(5), meta=m.group(6))

ARROW = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'

# ---------------------------------------------------------------------------
# riscrittura dei link
# ---------------------------------------------------------------------------
def map_anchor(anchor: str, text: str, tab: str | None) -> str | None:
    t = plain(text).lower()
    if anchor in ("offerta", "servizi"):
        if tab in TAB_MAP and "corsi singoli" not in t and "ciclo unico" not in t:
            return TAB_MAP[tab]
        for needle, url in TEXT_MAP:
            if needle in t:
                return url
    return ANCHOR_MAP.get(anchor)


A_RE = re.compile(r'<a ([^>]*?)href="#([\w-]+)"([^>]*)>(.*?)</a>', re.S)


def rewrite_links(fragment: str, keep: set) -> str:
    """#ancora -> /pagina/ ; le ancore presenti in 'keep' restano interne alla pagina"""
    def rep(m):
        pre, anchor, post, inner = m.groups()
        if anchor in keep:
            return m.group(0)
        tab = re.search(r'data-tab="(\d)"', pre + post)
        url = map_anchor(anchor, inner, tab.group(1) if tab else None) or ("/#" + anchor)
        attrs = re.sub(r'\s*data-tab="\d"', "", pre + 'href="' + url + '"' + post)
        return "<a " + attrs + ">" + inner + "</a>"
    out = A_RE.sub(rep, fragment)
    out = re.sub(r"onclick=\"location\.hash='#([\w-]+)'\"",
                 lambda m: ("onclick=\"location.href='%s'\"" % ANCHOR_MAP[m.group(1)])
                 if m.group(1) in ANCHOR_MAP and m.group(1) not in keep else m.group(0), out)
    return out


def chrome_links(page_html: str, keep: set) -> str:
    """riscrive solo header, menu mobile e footer (usato sulla home)"""
    for start, end in (("<header", "</header>"), ('<div class="mob dark" id="mob">', "<main"), ("<footer", "</footer>")):
        i = page_html.find(start)
        j = page_html.find(end, i)
        if i < 0 or j < 0:
            continue
        page_html = page_html[:i] + rewrite_links(page_html[i:j], keep) + page_html[j:]
    return page_html


# ---------------------------------------------------------------------------
# blocco link nel footer (maglia interna verso tutte le pagine)
# ---------------------------------------------------------------------------
def footer_nav() -> str:
    groups = [
        ("Corsi di laurea online", [(c["url"], c["short"]) for k, c in COURSES.items() if c["hub"] == "lauree"]),
        ("Master e alta formazione", [(c["url"], c["short"]) for k, c in COURSES.items() if c["hub"] == "master"]),
        ("Certificazioni e CFU", [(c["url"], c["short"]) for k, c in COURSES.items() if c["hub"] in ("certificazioni", "singoli")]),
        ("Approfondimenti", [(p["url"], p["name"]) for p in PAGES if p["url"] not in ("/contatti/", "/faq/")]),
    ]
    cols = "".join('<div><h5>%s</h5><ul>%s</ul></div>' % (g, "".join('<li><a href="%s">%s</a></li>' % (u, n) for u, n in links))
                   for g, links in groups)
    return '<nav class="f-seo" aria-label="Tutte le pagine del sito">%s</nav>\n    ' % cols


def add_footer_nav(page_html: str) -> str:
    if 'class="f-seo"' in page_html:
        return page_html
    return page_html.replace('<div class="f-legal"', footer_nav() + '<div class="f-legal"', 1)


# ---------------------------------------------------------------------------
# <head>
# ---------------------------------------------------------------------------
def fit_title(t):
    return t.replace(" | UNICESD Olympo", " | UNICESD") if len(t) > 62 else t


def head(title, desc, url, og_img="/assets/og-cover.jpg", og_alt=None, og_type="website", extra=""):
    full = SITE + url
    img = SITE + og_img
    title = fit_title(title)
    og_alt = og_alt or title
    e = H.escape
    return f"""<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="{full}">
<link rel="alternate" hreflang="it-IT" href="{full}">
<link rel="alternate" hreflang="x-default" href="{full}">
<meta name="author" content="UNICESD Olympo SRL">
<meta name="theme-color" content="#23387e">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/assets/icons/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&amp;family=Outfit:wght@200;300;400;500;600;700;800;900&amp;display=swap">
<link rel="stylesheet" href="/assets/css/site.css?v={CSS_VER}">
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="UNICESD Olympo">
<meta property="og:locale" content="it_IT">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{full}">
<meta property="og:image" content="{img}">
<meta property="og:image:alt" content="{e(og_alt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{e(title)}">
<meta name="twitter:description" content="{e(desc)}">
<meta name="twitter:image" content="{img}">
{extra}"""


def jsonld(graph) -> str:
    return ('<script type="application/ld+json">\n'
            + json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=1)
            + "\n</script>\n")


def crumbs_schema(url, trail):
    items = [{"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + u}
             for i, (u, n) in enumerate(trail)]
    return {"@type": "BreadcrumbList", "@id": SITE + url + "#breadcrumb", "itemListElement": items}


def webpage_schema(url, title, desc, img, typ="WebPage", about=ORG_ID):
    return {"@type": typ, "@id": SITE + url + "#pagina", "url": SITE + url, "name": title,
            "description": desc, "inLanguage": "it-IT", "isPartOf": {"@id": SITE_ID},
            "about": {"@id": about}, "breadcrumb": {"@id": SITE + url + "#breadcrumb"},
            "primaryImageOfPage": {"@type": "ImageObject", "url": SITE + img},
            "dateModified": TODAY, "publisher": {"@id": ORG_ID}}


ORG_REF = {"@type": "EducationalOrganization", "@id": ORG_ID, "name": "UNICESD Olympo",
           "url": SITE + "/", "logo": SITE + "/assets/logo-schema.png"}
SITE_NODE = NODES["WebSite"]


def org_full():
    o = dict(NODES["EducationalOrganization"])
    o["openingHoursSpecification"] = [{"@type": "OpeningHoursSpecification",
                                       "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                                       "opens": "09:00", "closes": "18:00"}]
    return o


# ---------------------------------------------------------------------------
# pezzi di pagina
# ---------------------------------------------------------------------------
def crumbs_html(trail):
    lis = []
    for i, (u, n) in enumerate(trail):
        if i == len(trail) - 1:
            lis.append('<li aria-current="page">%s</li>' % n)
        else:
            lis.append('<li><a href="%s">%s</a></li>' % (u, n))
    return '<nav class="crumbs" aria-label="Sei qui"><ol>%s</ol></nav>' % "".join(lis)


def page_hero(trail, eyebrow, h1, lead, cta=True):
    btns = ""
    if cta:
        btns = ('<div class="ph-cta"><a href="#iscrizione" class="btn btn-p" data-cursor><span>Richiedi informazioni</span><span class="shine"></span></a>'
                '<a href="tel:+393509651711" class="btn btn-g" data-cursor>Chiama +39 350 965 1711</a></div>')
    return f"""<section class="phero dark">
  <div class="wrap">
    {crumbs_html(trail)}
    <div class="eyebrow"><em></em> {eyebrow}</div>
    <h1>{h1}</h1>
    <p class="ph-lead">{lead}</p>
    {btns}
  </div>
</section>
"""


def card_link(key):
    c, meta = COURSES[key], CARDS[key]
    return (f'<article class="card rv tilt {meta["bg"]}"><div class="card-ic">{meta["ic"]}</div>'
            f'<h3><a href="{c["url"]}" class="card-link">{meta["h3"]}</a></h3><p>{meta["p"]}</p>'
            f'<div class="card-meta">{meta["meta"]}</div><span class="card-more">Scheda del corso {ARROW}</span></article>')


def cards_section(keys, title, sub="", sid=None):
    ida = f' id="{sid}"' if sid else ""
    return f"""<section class="pcards"{ida}>
  <div class="wrap">
    <div class="sec-head rv"><h2>{title}</h2>{('<p>'+sub+'</p>') if sub else ''}</div>
    <div class="cards">{''.join(card_link(k) for k in keys)}</div>
  </div>
</section>
"""


HOW = """<h2>Come funziona con UNICESD Olympo</h2>
<ul class="m-list">
<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span><b>Orientamento gratuito</b>: un colloquio per capire se il percorso è quello giusto per il tuo profilo.</span></li>
<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span><b>Valutazione dei CFU</b>: analisi gratuita della carriera pregressa, in genere entro 48 ore.</span></li>
<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span><b>Lezioni online 24/7</b>: videolezioni, dispense e test di autovalutazione da computer, tablet o telefono.</span></li>
<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span><b>Tutor dedicato</b>: un referente unico che costruisce con te il piano di studi e ti ricorda le scadenze.</span></li>
<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span><b>Esami in sede</b>: nelle sedi convenzionate con l'ateneo, con appelli distribuiti durante tutto l'anno.</span></li>
<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span><b>Rate su misura</b>: piani di pagamento personalizzati e convenzioni con enti e aziende.</span></li>
</ul>
<p class="c-note">UNICESD Olympo è un Centro Studi: si occupa di orientamento, tutoraggio e coordinamento didattico. Il titolo è rilasciato dall'ateneo con cui viene attivato il percorso, secondo il suo ordinamento. <a href="/faq/">Leggi le domande frequenti</a>.</p>
"""


def course_body(key):
    c = COURSES[key]
    d = DATA[key]
    body = d["b"]
    body = re.sub(r"<h5>(.*?)</h5>", r"<h2>\1</h2>", body)  # i sottotitoli dei modali diventano H2 veri
    meta = CARDS.get(key, {}).get("meta", "")
    facts = []
    if c.get("level"): facts.append(("Tipo", c["level"]))
    if c.get("code") and c["code"] != "Executive": facts.append(("Classe", c["code"]))
    if c.get("years"): facts.append(("Durata", "%d anni" % c["years"]))
    if c.get("credits"): facts.append(("Crediti", "%d CFU" % c["credits"]))
    if c.get("hours"): facts.append(("Impegno", "%d ore" % c["hours"]))
    facts.append(("Modalità", "Online, esami in sede" if c["hub"] == "lauree" else ("Executive · blended" if key == "m1" else "Online")))
    facts.append(("Orientamento", "Gratuito, entro 24 ore"))
    rows = "".join('<div class="fb-row"><span>%s</span><b>%s</b></div>' % f for f in facts)
    return f"""<section class="course">
  <div class="wrap c-grid">
    <article class="c-main rv">
      <div class="card-meta">{meta}</div>
      {body}
      {HOW}
    </article>
    <aside class="c-side">
      <div class="c-box dark">
        <h2>In sintesi</h2>
        <div class="feat-box">{rows}</div>
        <a href="#iscrizione" class="btn btn-p" style="width:100%;margin-top:18px"><span>Richiedi informazioni</span><span class="shine"></span></a>
        <a href="tel:+393509651711" class="btn btn-g" style="width:100%;margin-top:10px">+39 350 965 1711</a>
        <p class="c-small">Segreteria: <a href="tel:+393881133550">388 113 3550</a> · <a href="tel:+393281376792">328 137 6792</a> · <a href="tel:+393356959796">335 695 9796</a></p>
      </div>
    </aside>
  </div>
</section>
"""


def course_schema(key):
    c = COURSES[key]
    d = DATA[key]
    desc = plain(re.split(r"<h5>", d["b"])[0]) or c["desc"]
    node = {"@type": "Course", "@id": SITE + c["url"] + "#corso", "name": c["name"],
            "description": desc[:500], "url": SITE + c["url"], "inLanguage": "it",
            "provider": {"@id": ORG_ID}, "educationalLevel": c.get("level"),
            "hasCourseInstance": {"@type": "CourseInstance", "courseMode": "blended" if key == "m1" else "online",
                                  "courseWorkload": ("PT%dH" % c["hours"]) if c.get("hours") else None,
                                  "location": "Online, esami nelle sedi convenzionate" if c["hub"] == "lauree" else "Online"},
            "offers": {"@type": "Offer", "category": "Paid", "availability": "https://schema.org/InStock",
                       "url": SITE + c["url"], "offeredBy": {"@id": ORG_ID}}}
    if c.get("credits"):
        node["numberOfCredits"] = {"@type": "StructuredValue", "value": c["credits"], "unitText": "CFU"}
    if c.get("years"):
        node["timeToComplete"] = "P%dY" % c["years"]
    if c.get("code") and c["code"] != "Executive":
        node["courseCode"] = c["code"]
    if c["hub"] in ("lauree", "master"):
        node["educationalCredentialAwarded"] = c.get("level")
    # pulizia dei None
    node["hasCourseInstance"] = {k: v for k, v in node["hasCourseInstance"].items() if v}
    return {k: v for k, v in node.items() if v}


def itemlist_schema(url, keys, name):
    return {"@type": "ItemList", "@id": SITE + url + "#elenco", "name": name,
            "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": SITE + COURSES[k]["url"],
                                 "name": COURSES[k]["name"]} for i, k in enumerate(keys)]}


# ---------------------------------------------------------------------------
# assemblaggio di una pagina
# ---------------------------------------------------------------------------
def assemble(url, title, desc, main_html, graph, og="/assets/og-cover.jpg", keep=None, with_form=True):
    keep = set(keep or [])
    tail = ""
    if with_form:
        tail = SECTIONS["iscrizione"] + "\n" + SECTIONS["contatti"]
        keep |= {"iscrizione", "contatti"}
    main = main_html + tail
    ids = set(re.findall(r'\sid="([\w-]+)"', main))
    keep |= ids
    keep.discard("top")  # il logo porta alla home
    body = PRE_MAIN_PAGES + '<main id="top">\n' + main + "\n</main>" + POST_MAIN
    body = rewrite_links(body, keep)
    body = add_footer_nav(body)
    # il logo in alto porta alla home
    body = body.replace('<a href="/" class="brand" aria-label="UNICESD Olympo, torna all\'inizio">',
                        '<a href="/" class="brand" aria-label="UNICESD Olympo, vai alla home">')
    page = ("<!DOCTYPE html>\n<html lang=\"it\">\n<head>\n"
            + head(title, desc, url, og_img=og)
            + jsonld(graph)
            + "</head>\n<body class=\"sub\">\n" + body
            + '\n<script>window.UO_PAGES=' + json.dumps(PAGE_URLS) + ';</script>\n'
            + '<script src="/assets/js/site.js?v=' + JS_VER + '" defer></script>\n</body></html>\n')
    out = REPO / url.strip("/") / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page, encoding="utf-8")
    return out


PAGE_URLS = {k: c["url"] for k, c in COURSES.items()}
BUILT = []  # (url, priority, changefreq, [immagini])


def base_graph(url, title, desc, img, trail, typ="WebPage", about=ORG_ID):
    return [webpage_schema(url, title, desc, img, typ, about), crumbs_schema(url, trail), ORG_REF,
            {"@type": "WebSite", "@id": SITE_ID, "url": SITE + "/", "name": "UNICESD Olympo", "inLanguage": "it-IT",
             "publisher": {"@id": ORG_ID}}]


def build_courses():
    for key, c in COURSES.items():
        hub = HUBS.get(c["hub"])
        trail = [("/", "Home")]
        if hub:
            trail.append((hub["url"], hub["name"]))
        elif c["hub"] == "singoli":
            trail.append(("/offerta-formativa/", "Offerta formativa"))
        trail.append((c["url"], c["name"]))
        eyebrow = plain(DATA[key]["e"])
        main = page_hero(trail, eyebrow, c["h1"], c["lead"])
        main += course_body(key)
        for sid in c.get("sections", []):
            main += SECTIONS[sid] + "\n"
        sib = [k for k, x in COURSES.items() if x["hub"] == c["hub"] and k != key][:6]
        if sib:
            main += cards_section(sib, "Altri percorsi che potrebbero interessarti")
        graph = base_graph(c["url"], c["title"], c["desc"], "/assets/og-cover.jpg", trail)
        if key in ("s2", "s3"):
            graph.append({"@type": "Service", "@id": SITE + c["url"] + "#servizio", "name": c["name"],
                          "description": c["desc"], "url": SITE + c["url"], "provider": {"@id": ORG_ID},
                          "areaServed": {"@type": "Country", "name": "Italia"},
                          "serviceType": c["level"]})
        else:
            graph.append(course_schema(key))
        assemble(c["url"], c["title"], c["desc"], main, graph)
        BUILT.append((c["url"], "0.8", "monthly", []))


def build_hubs():
    for hid, h in HUBS.items():
        trail = [("/", "Home"), ("/offerta-formativa/", "Offerta formativa"), (h["url"], h["name"])]
        main = page_hero(trail, h["eyebrow"], h["h1"], h["lead"])
        main += cards_section(h["keys"], "I percorsi disponibili",
                              "Apri la scheda di ogni corso per contenuti, sbocchi e modalità.", sid="percorsi")
        for sid in h.get("extra", []):
            main += SECTIONS[sid] + "\n"
        graph = base_graph(h["url"], h["title"], h["desc"], "/assets/og-cover.jpg", trail, typ="CollectionPage")
        graph.append(itemlist_schema(h["url"], h["keys"], h["name"]))
        assemble(h["url"], h["title"], h["desc"], main, graph)
        BUILT.append((h["url"], "0.9", "weekly", []))


def section_images(html_):
    out = []
    for m in re.finditer(r'<img[^>]+src="(/assets/[^"]+)"[^>]*alt="([^"]*)"', html_):
        if "/partner/" in m.group(1) and False:
            continue
        out.append((m.group(1), plain(m.group(2))))
    seen, res = set(), []
    for s, a in out:
        if s not in seen:
            seen.add(s); res.append((s, a))
    return res


def build_pages():
    for p in PAGES:
        url = p["url"]
        trail = [("/", "Home"), (url, p["name"])]
        main = page_hero(trail, p["eyebrow"], p["h1"], p["lead"], cta=not p.get("contact"))
        if p.get("contact"):
            main += contact_block()
        if p.get("hubs"):
            main += hubs_block()
        for sid in p["sections"]:
            main += SECTIONS[sid] + "\n"
        og = p.get("og", "/assets/og-cover.jpg")
        typ = "AboutPage" if url == "/chi-siamo/" else ("ContactPage" if p.get("contact") else
              ("FAQPage" if p.get("faq") else ("ProfilePage" if p.get("person") else "WebPage")))
        about = PERSON_ID if p.get("person") else ORG_ID
        graph = base_graph(url, p["title"], p["desc"], og, trail, typ=typ, about=about)
        if p.get("org_full"):
            graph = [n for n in graph if n.get("@id") != ORG_ID] + [org_full()]
        if p.get("person"):
            person = dict(NODES["Person"])
            person["url"] = SITE + url
            person["mainEntityOfPage"] = {"@id": SITE + url + "#pagina"}
            graph[0]["mainEntity"] = {"@id": PERSON_ID}
            graph.append(person)
        if p.get("faq"):
            faq = NODES["FAQPage"]
            graph[0]["mainEntity"] = faq["mainEntity"]
        if p.get("event"):
            ev = dict(NODES["Event"])
            ev["eventStatus"] = "https://schema.org/EventScheduled"
            ev["url"] = SITE + url
            graph.append(ev)
            gal = dict(NODES["ImageGallery"]); gal["isPartOf"] = {"@id": SITE + url + "#pagina"}
            graph.append(gal)
        if p.get("hubs"):
            graph.append({"@type": "ItemList", "@id": SITE + url + "#elenco", "name": "Offerta formativa",
                          "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": SITE + c["url"], "name": c["name"]}
                                              for i, c in enumerate(COURSES.values())]})
        f = assemble(url, p["title"], p["desc"], main, graph, og=og, with_form=True)
        imgs = section_images(main)
        BUILT.append((url, "0.8", "weekly" if url in ("/eventi/", "/offerta-formativa/") else "monthly", imgs))


def hubs_block():
    items = [("/corsi-di-laurea/", "Corsi di laurea", "Triennali, magistrali e a ciclo unico"),
             ("/master-universitari/", "Master universitari", "I e II livello, executive e alta formazione"),
             ("/certificazioni/", "Certificazioni", "Informatiche, linguistiche e per le graduatorie"),
             ("/corsi-singoli-cfu/", "Corsi singoli e CFU", "Solo gli esami che ti servono"),
             ("/riconoscimento-cfu/", "Riconoscimento CFU", "Valutazione gratuita in 48 ore"),
             ("/medicina-senza-test-ingresso/", "Medicina all'estero", "Area sanitaria senza test d'ingresso")]
    li = "".join(f'<a class="hub-i rv" href="{u}"><b>{n}</b><span>{s}</span>{ARROW}</a>' for u, n, s in items)
    return f'<section class="hubs"><div class="wrap"><div class="hub-grid">{li}</div></div></section>\n'


def contact_block():
    return """<section class="cblock">
  <div class="wrap c3">
    <div class="c-card rv"><h2>Telefono</h2>
      <p><a href="tel:+393509651711">+39 350 965 1711</a><br><small>Calogero Di Carlo · orientamento e immatricolazioni</small></p>
      <p><a href="tel:+393881133550">+39 388 113 3550</a><br><small>Jose Palazzolo · segreteria studenti</small></p>
      <p><a href="tel:+393281376792">+39 328 137 6792</a><br><small>Segreteria UNICESD Olympo</small></p>
      <p><a href="tel:+393356959796">+39 335 695 9796</a><br><small>Segreteria</small></p>
    </div>
    <div class="c-card rv"><h2>Email</h2>
      <p><a href="mailto:Calogero60@yahoo.it">Calogero60@yahoo.it</a></p>
      <p><a href="mailto:Palazzolo.jose@gmail.com">Palazzolo.jose@gmail.com</a></p>
      <h2 style="margin-top:22px">Orari</h2>
      <p>Lunedì – venerdì 9:00 – 18:00<br>Sabato su appuntamento<br><small>Piattaforma e assistenza online attive h24</small></p>
    </div>
    <div class="c-card rv"><h2>Indirizzi</h2>
      <address>
        <p><b>Sede legale</b><br>Via Trabia 1, 90133 Palermo (PA)</p>
        <p><b>Sede operativa</b><br>Largo Lituania 11 (ex Via Danimarca), 90141 Palermo (PA)</p>
        <p><b>Lisbona</b><br>Rua Castilho 13, 3.º-B, 1250-066 Lisboa · <a href="tel:+351210523770">+351 210 523 770</a></p>
      </address>
      <p><a href="https://www.google.com/maps/search/?api=1&amp;query=Via+Trabia+1+90133+Palermo" target="_blank" rel="noopener">Apri in Google Maps</a> · <a href="/sedi/">Tutte le sedi</a></p>
    </div>
  </div>
</section>
"""


# ---------------------------------------------------------------------------
# CSS / JS condivisi
# ---------------------------------------------------------------------------
PAGES_CSS = """
/* ===== pagine interne (build_pages.py) ===== */
.phero{padding:64px 0 60px;background:radial-gradient(ellipse 130% 110% at 50% 0%,#101e4e 0%,#0a1130 55%,#050a1c 100%);overflow:hidden}
.phero h1{font-size:clamp(32px,4.8vw,56px);font-weight:800;letter-spacing:-.03em;line-height:1.08;margin:16px 0 18px;max-width:980px}
.phero .ph-lead{font-size:18px;color:var(--txt-dim);max-width:780px;margin-bottom:26px}
.ph-cta{display:flex;gap:12px;flex-wrap:wrap}
.crumbs ol{list-style:none;display:flex;flex-wrap:wrap;gap:6px;margin:0 0 22px;padding:0;font-size:13px;color:var(--txt-mute)}
.crumbs li+li::before{content:"\\203A";margin-right:6px;opacity:.7}
.crumbs a{color:var(--txt-dim);text-decoration:none}
.crumbs a:hover{color:var(--txt-strong);text-decoration:underline}
.phero+section[style*="padding-top:0"],.phero+section[style*="padding-top:8px"]{padding-top:80px!important}
.course{padding:70px 0 30px}
.c-grid{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:40px;align-items:start}
.c-main h2{font-size:clamp(20px,2.4vw,26px);margin:30px 0 14px}
.c-main p{color:var(--txt-dim);font-size:16px;margin-bottom:14px}
.c-main .m-list{padding:0;margin:0 0 10px}
.c-note{font-size:14px!important;border-left:3px solid var(--cy);padding:10px 14px;background:var(--surface);border-radius:8px;margin-top:22px}
.c-side{position:sticky;top:110px}
.c-box{border-radius:22px;padding:28px 24px;background:linear-gradient(135deg,#0a1436,#152668 48%,#1d2f7c);border:1px solid rgba(130,180,255,.3);box-shadow:var(--shadow-xl)}
.c-box h2{font-size:20px;margin-bottom:14px}
.c-small{font-size:12.5px;color:var(--txt-mute);margin-top:14px}
.c-small a{color:inherit}
.card-link{color:inherit;text-decoration:none}
.card-link::after{content:"";position:absolute;inset:0;z-index:3}
.pcards{padding:60px 0}
.hubs{padding:56px 0 0}
.hub-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.hub-i{display:flex;flex-direction:column;gap:4px;position:relative;padding:20px 44px 20px 20px;border-radius:16px;border:1px solid var(--line);background:var(--panel);text-decoration:none;color:var(--txt);transition:.35s var(--ease)}
.hub-i b{font-family:'Sora';font-size:16px;color:var(--txt-strong)}
.hub-i span{font-size:13.5px;color:var(--txt-dim)}
.hub-i svg{position:absolute;right:18px;top:50%;transform:translateY(-50%);color:var(--cy);transition:.35s var(--ease)}
.hub-i:hover{border-color:var(--line-strong);box-shadow:var(--shadow-md)}
.hub-i:hover svg{transform:translate(4px,-50%)}
.cblock{padding:64px 0 10px}
.c3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.c-card{padding:26px 24px;border-radius:18px;border:1px solid var(--line);background:var(--panel)}
.c-card h2{font-size:18px;margin-bottom:12px}
.c-card p{margin-bottom:12px;color:var(--txt-dim)}
.c-card address{font-style:normal}
.c-card a{color:var(--cy);font-weight:600}
.f-seo{display:grid;grid-template-columns:repeat(4,1fr);gap:26px;padding:34px 0 30px;margin-top:10px;border-top:1px solid rgba(160,190,255,.14)}
.f-seo h5{font-family:'Sora';font-size:11px;letter-spacing:.16em;text-transform:uppercase;margin-bottom:12px;opacity:.85}
.f-seo ul{list-style:none;padding:0;margin:0}
.f-seo li{margin-bottom:7px;font-size:13px}
.f-seo a{color:inherit;opacity:.72;text-decoration:none}
.f-seo a:hover{opacity:1;text-decoration:underline}
@media(max-width:980px){.c-grid{grid-template-columns:1fr}.c-side{position:static}.c3{grid-template-columns:1fr}.f-seo{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.phero{padding:44px 0 44px}.f-seo{grid-template-columns:1fr}}
"""


def write_assets():
    global CSS_VER, JS_VER
    css = CONTENT
    css = re.sub(r"<title>.*?</title>", "", css, flags=re.S)
    css = css.split("<style>", 1)[1].rsplit("</style>", 1)[0]
    css = tok(css) + PAGES_CSS
    js = SCRIPT.strip()
    js = js[len("<script>"):] if js.startswith("<script>") else js
    js = js.rsplit("</script>", 1)[0]
    (REPO / "assets/css").mkdir(parents=True, exist_ok=True)
    (REPO / "assets/js").mkdir(parents=True, exist_ok=True)
    (REPO / "assets/css/site.css").write_text(css, encoding="utf-8")
    (REPO / "assets/js/site.js").write_text(js, encoding="utf-8")
    import hashlib
    CSS_VER = hashlib.md5(css.encode()).hexdigest()[:8]
    JS_VER = hashlib.md5(js.encode()).hexdigest()[:8]
    return PAGES_CSS


CSS_VER = JS_VER = "1"


# ---------------------------------------------------------------------------
# home: link veri nel menu e nel footer, CSS delle pagine, UO_PAGES
# ---------------------------------------------------------------------------
def patch_home():
    p = REPO / "index.html"
    h = p.read_text(encoding="utf-8")
    home_ids = set(re.findall(r'\sid="([\w-]+)"', h))
    # nel menu della home le voci portano alle pagine dedicate; il resto della pagina resta con le ancore
    h = chrome_links(h, keep={"iscrizione", "top"})
    h = add_footer_nav(h)
    # "Scopri il corso" nelle card: diventa un link vero alla scheda (il resto della card apre il popup)
    def card_more(m):
        key = m.group(1)
        url = PAGE_URLS.get(key)
        if not url:
            return m.group(0)
        return m.group(0).replace('<span class="card-more">', '<a class="card-more" data-page href="%s">' % url, 1)\
                          .replace('</svg></span></article>', '</svg></a></article>', 1)
    h = re.sub(r'<article class="card rv tilt [\w-]+"[^>]*data-modal="(\w+)">.*?</article>', card_more, h, flags=re.S)
    # CSS delle pagine (footer esteso) e mappa delle schede per i popup
    if "/* ===== pagine interne" not in h:
        h = h.replace("</style>", PAGES_CSS + "\n.card-more{text-decoration:none}\n</style>", 1)
    if "window.UO_PAGES={" not in h:
        h = h.replace("<script>\n(function(){", "<script>window.UO_PAGES=" + json.dumps(PAGE_URLS) + ";</script>\n<script>\n(function(){", 1)
    # l'immagine della hero (poster del video) e' l'elemento piu' grande sopra la piega: si scarica subito
    if 'rel="preload" as="image"' not in h:
        h = h.replace('<link rel="preconnect" href="https://fonts.googleapis.com">',
                      '<link rel="preload" as="image" href="assets/ai/hero-bg.webp" fetchpriority="high">\n'
                      '<link rel="preconnect" href="https://fonts.googleapis.com">', 1)
    p.write_text(h, encoding="utf-8")


# ---------------------------------------------------------------------------
# icone, manifest, sitemap, robots, llms.txt
# ---------------------------------------------------------------------------
def icons():
    from PIL import Image
    d = REPO / "assets/icons"
    d.mkdir(parents=True, exist_ok=True)
    im = Image.open(HERE / "img/logo-navy.webp").convert("RGBA")
    mark = im.crop((292, 0, 720, 178))
    mark = mark.crop(mark.getbbox())

    def square(size, pad=0.08, bg=(255, 255, 255, 255)):
        c = Image.new("RGBA", (size, size), bg)
        m = mark.copy()
        inner = int(size * (1 - 2 * pad))
        m.thumbnail((inner, inner), Image.LANCZOS)
        c.paste(m, ((size - m.width) // 2, (size - m.height) // 2), m)
        return c

    square(512).convert("RGB").save(d / "icon-512.png", optimize=True)
    square(192).convert("RGB").save(d / "icon-192.png", optimize=True)
    square(512, pad=0.18).convert("RGB").save(d / "icon-maskable-512.png", optimize=True)
    square(180, pad=0.1).convert("RGB").save(d / "apple-touch-icon.png", optimize=True)
    square(48, pad=0.02).save(REPO / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    # svg: il marchio in PNG incorporato (resta nitido ai vari zoom del browser)
    import base64, io
    buf = io.BytesIO(); square(96, pad=0.02).save(buf, "PNG", optimize=True)
    (d / "icon.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><image width="96" height="96" href="data:image/png;base64,'
        + base64.b64encode(buf.getvalue()).decode() + '"/></svg>', encoding="utf-8")
    manifest = {"name": "UNICESD Olympo - Universitas Centro Studi Olympo", "short_name": "UNICESD Olympo",
                "lang": "it", "start_url": "/", "scope": "/", "display": "standalone",
                "background_color": "#ffffff", "theme_color": "#23387e",
                "icons": [{"src": "/assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
                          {"src": "/assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
                          {"src": "/assets/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]}
    (REPO / "site.webmanifest").write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")


def sitemap():
    # immagini della home: logo, copertina social e tutte le foto dei contenuti (niente sfondi decorativi)
    home_html = (REPO / "index.html").read_text(encoding="utf-8").replace('src="assets/', 'src="/assets/')
    home = [("/assets/og-cover.jpg", "UNICESD Olympo - Il futuro della formazione parte da qui"),
            ("/assets/logo-schema.png", "Logo UNICESD Olympo")] + section_images(home_html)
    x = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
         '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">']
    BUILT.insert(0, ("/", "1.0", "weekly", home))
    for url, prio, freq, imgs in BUILT:
        x += ["  <url>", f"    <loc>{SITE}{url}</loc>", f"    <lastmod>{TODAY}</lastmod>",
              f"    <changefreq>{freq}</changefreq>", f"    <priority>{prio}</priority>"]
        seen = set()
        for src, alt in imgs:
            if src in seen or "/ai/" in src:
                continue
            seen.add(src)
            x += ["    <image:image>", f"      <image:loc>{SITE}{H.escape(src)}</image:loc>"]
            if alt:
                x += [f"      <image:title>{H.escape(alt)}</image:title>"]
            x += ["    </image:image>"]
        x += ["  </url>"]
    x.append("</urlset>")
    (REPO / "sitemap.xml").write_text("\n".join(x) + "\n", encoding="utf-8")


ROBOTS = """# UNICESD Olympo - robots.txt
User-agent: *
Allow: /
Disallow: /sorgenti/
Disallow: /_to_delete/

# scraping per dataset generativi (non porta visite)
User-agent: CCBot
Disallow: /

# i motori di risposta AI (ChatGPT search, Perplexity, Claude, Gemini) restano ammessi:
# citano la fonte e portano traffico qualificato

Sitemap: https://unicesd-olympo.com/sitemap.xml
"""


def llms():
    lines = ["# UNICESD Olympo - Universitas Centro Studi Olympo", "",
             "> Centro Studi di Palermo (UNICESD OLYMPO SRL, P.IVA 06398000825, dal 2015) che si occupa di orientamento, "
             "tutoraggio e coordinamento di corsi di laurea online, master universitari di I e II livello, certificazioni "
             "informatiche e linguistiche, corsi singoli e riconoscimento CFU. I titoli sono rilasciati dagli atenei partner. "
             "Fondatore: Calogero Di Carlo. Sedi: Via Trabia 1 e Largo Lituania 11, Palermo; filiale a Lisbona. "
             "Telefono: +39 350 965 1711.", "",
             "## Offerta formativa"]
    for h in HUBS.values():
        lines.append(f"- [{h['name']}]({SITE}{h['url']}): {h['desc']}")
    for c in COURSES.values():
        lines.append(f"- [{c['name']}]({SITE}{c['url']}): {c['desc']}")
    lines += ["", "## Pagine"]
    for p in PAGES:
        lines.append(f"- [{p['name']}]({SITE}{p['url']}): {p['desc']}")
    (REPO / "llms.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    write_assets()
    icons()
    build_hubs()
    build_courses()
    build_pages()
    patch_home()
    sitemap()
    (REPO / "robots.txt").write_text(ROBOTS, encoding="utf-8")
    llms()
    print(f"Pagine generate: {len(BUILT) - 1} + home  ·  sitemap con {len(BUILT)} URL")


if __name__ == "__main__":
    main()
