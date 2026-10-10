# -*- coding: utf-8 -*-
"""
Pagine SEO aggiunte il 10 ottobre 2026 (lauree del catalogo, hub triennali/magistrali,
11 indirizzi del diploma, recupero anni, percorsi sanitari all'estero, guide, pagine locali).

Non si lancia da solo: lo richiama build_pages.py (main) passando se stesso come modulo `bp`,
cosi' riusa head, header, footer, modulo d'iscrizione, dati strutturati e sitemap.
I testi stanno in pagine_lauree.py, pagine_diploma_estero.py, pagine_guide_local.py.
"""
import html as H
import re

from pagine_lauree import LAUREE, AREE, HUB_TM
from pagine_diploma_estero import DIPLOMI, COME, RECUPERO, ESTERO, NOTA_ESTERO, JANUS_HUB, ESTERO_HUB
from pagine_guide_local import GUIDE_HUB, GUIDE, LOCALI

PUBLISHED = "2026-10-10"
CHECK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>'

# codice della classe nel catalogo della home -> pagina
CLASS_URL = {
    "LMG-01": "/corsi-di-laurea/giurisprudenza/", "L-24": "/corsi-di-laurea/scienze-psicologiche/",
    "L-19": "/corsi-di-laurea/scienze-educazione/", "L-8": "/corsi-di-laurea/ingegneria-informatica/",
    "L-22": "/corsi-di-laurea/scienze-motorie/",
}
CLASS_URL.update({c["code"]: c["url"] for c in LAUREE.values()})

DIPLOMA_URL = {d["slug"]: JANUS_HUB[0] + d["slug"] + "/" for d in DIPLOMI}
# nome dell'indirizzo come compare nelle schede della home -> pagina
RAIL_URL = {
    "Scientifico": DIPLOMA_URL["liceo-scientifico"],
    "Scientifico Sportivo": DIPLOMA_URL["liceo-scientifico-sportivo"],
    "Scienze Applicate": DIPLOMA_URL["liceo-scienze-applicate"],
    "Classico": DIPLOMA_URL["liceo-classico"],
    "Linguistico": DIPLOMA_URL["liceo-linguistico"],
    "Scienze Umane": DIPLOMA_URL["liceo-scienze-umane"],
    "Economico Sociale": DIPLOMA_URL["liceo-economico-sociale"],
    "Ist. Tecnico Tecnologico Informatico": DIPLOMA_URL["tecnico-informatico"],
    "AFM &mdash; Amministrazione, Finanza e Marketing": DIPLOMA_URL["ragioneria-afm"],
    "Socio Sanitario": DIPLOMA_URL["socio-sanitario"],
    "Turismo": DIPLOMA_URL["tecnico-turismo"],
}
ESTERO_H3 = {
    "Odontoiatria": "/odontoiatria-senza-test-ingresso/",
    "Igiene Dentale": "/igiene-dentale-online/",
    "Infermieristica": "/infermieristica-senza-test-ingresso/",
    "Fisioterapia": "/fisioterapia-senza-test-ingresso/",
}

CSS = """
/* ===== pagine SEO 10/2026 (build_extra.py) ===== */
.x-tbl{width:100%;border-collapse:collapse;margin:6px 0 18px;font-size:14.5px;border:1px solid var(--line);border-radius:14px;overflow:hidden;display:block;overflow-x:auto}
.x-tbl table{width:100%;border-collapse:collapse;min-width:520px}
.x-tbl th,.x-tbl td{padding:11px 14px;text-align:left;vertical-align:top;border-bottom:1px solid var(--line);color:var(--txt-dim)}
.x-tbl th{font-family:'Sora';font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--txt-strong);background:var(--surface)}
.x-tbl tr:last-child td{border-bottom:none}
.x-tbl a,.c-main p a,.c-main li a{color:var(--cy)}
.x-steps{counter-reset:st;list-style:none;padding:0;margin:0 0 16px}
.x-steps li{counter-increment:st;position:relative;padding:0 0 12px 44px;color:var(--txt-dim);font-size:15px}
.x-steps li::before{content:counter(st);position:absolute;left:0;top:-2px;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font:700 13px 'Sora';color:#fff;background:linear-gradient(135deg,var(--cy),#2b4bb8)}
.x-ind{display:grid;gap:10px;margin:4px 0 18px}
.x-ind div{padding:14px 16px;border:1px solid var(--line);border-radius:14px;background:var(--panel)}
.x-ind b{display:block;font-family:'Sora';font-size:15px;color:var(--txt-strong);margin-bottom:3px}
.x-ind span{font-size:14px;color:var(--txt-dim)}
.x-faq{margin-top:34px}
.x-faq .faq-a>div{padding:0 22px 18px;color:var(--txt-dim);font-size:14.6px}
.x-meta{font-size:13px;color:var(--txt-mute);margin:-4px 0 18px}
.x-area{margin-top:46px}
.x-area:first-of-type{margin-top:10px}
.x-area h3{font-size:20px;margin-bottom:14px}
.rail-link{color:inherit;text-decoration:none}
.rail-link:hover{text-decoration:underline}
.ec-card h4 a{color:inherit;text-decoration:none}
.ec-card h4 a:hover{text-decoration:underline}
.ec-card h4 a::after{content:" \\2192";font-size:.85em;opacity:.6}
"""


# ---------------------------------------------------------------------------
# mattoncini
# ---------------------------------------------------------------------------
def ul(items):
    return '<ul class="m-list">' + "".join("<li>%s<span>%s</span></li>" % (CHECK, i) for i in items) + "</ul>"


def ol(items):
    return '<ol class="x-steps">' + "".join("<li>%s</li>" % i for i in items) + "</ol>"


def table(head, rows):
    th = "".join("<th>%s</th>" % h for h in head)
    tr = "".join("<tr>%s</tr>" % "".join("<td>%s</td>" % c for c in r) for r in rows)
    return '<div class="x-tbl"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div>' % (th, tr)


def render_blocks(blocks):
    out = []
    for title, parts in blocks:
        out.append("<h2>%s</h2>" % title)
        for p in parts:
            if isinstance(p, str):
                out.append("<p>%s</p>" % p)
            elif p[0] == "ul":
                out.append(ul(p[1]))
            elif p[0] == "ol":
                out.append(ol(p[1]))
            elif p[0] == "table":
                out.append(table(p[1], p[2]))
    return "\n".join(out)


def faq_html(faq, title="Domande frequenti"):
    if not faq:
        return ""
    items = "".join('<div class="faq-i"><button class="faq-q">%s <i></i></button><div class="faq-a"><div>%s</div></div></div>' % (q, a)
                    for q, a in faq)
    return '<div class="x-faq"><h2>%s</h2>%s</div>' % (title, items)


def faq_schema(bp, url, faq):
    return {"@type": "FAQPage", "@id": bp.SITE + url + "#faq",
            "mainEntity": [{"@type": "Question", "name": bp.plain(q),
                            "acceptedAnswer": {"@type": "Answer", "text": bp.plain(a)}} for q, a in faq]}


def facts_box(bp, facts, extra_btn=""):
    rows = "".join('<div class="fb-row"><span>%s</span><b>%s</b></div>' % f for f in facts)
    return f"""<aside class="c-side">
      <div class="c-box dark">
        <h2>In sintesi</h2>
        <div class="feat-box">{rows}</div>
        {extra_btn}
        <a href="#iscrizione" class="btn btn-p" style="width:100%;margin-top:18px"><span>Richiedi informazioni</span><span class="shine"></span></a>
        <a href="tel:+393509651711" class="btn btn-g" style="width:100%;margin-top:10px">+39 350 965 1711</a>
        <p class="c-small">Segreteria: <a href="tel:+393881133550">388 113 3550</a> · <a href="tel:+393281376792">328 137 6792</a> · <a href="tel:+393356959796">335 695 9796</a></p>
      </div>
    </aside>"""


def article_layout(bp, main_html, facts):
    return f"""<section class="course">
  <div class="wrap c-grid">
    <article class="c-main rv">
      {main_html}
    </article>
    {facts_box(bp, facts)}
  </div>
</section>
"""


def links_section(bp, items, title, sub="", sid=None):
    """griglia di link (stile hub-i): items = [(url, nome, sottotitolo)]"""
    ida = f' id="{sid}"' if sid else ""
    li = "".join(f'<a class="hub-i rv" href="{u}"><b>{n}</b><span>{s}</span>{bp.ARROW}</a>' for u, n, s in items)
    return f"""<section class="pcards"{ida}>
  <div class="wrap">
    <div class="sec-head rv"><h2>{title}</h2>{('<p>'+sub+'</p>') if sub else ''}</div>
    <div class="hub-grid">{li}</div>
  </div>
</section>
"""


def related_section(bp, rel, title="Approfondisci"):
    items = []
    for u, n in rel:
        items.append((u, n, "Leggi la pagina"))
    return links_section(bp, items, title)


# ---------------------------------------------------------------------------
# card delle nuove lauree (stesso aspetto delle card dell'offerta)
# ---------------------------------------------------------------------------
def laurea_card(bp, key):
    c = LAUREE[key]
    ic, bg, _ = AREE[c["area"]]
    tipo = "Magistrale" if c["typ"] == "m" else "Triennale"
    meta = (f'<span class="chip cy">{c["code"]}</span><span class="chip">{tipo}</span>'
            f'<span class="chip">{c["years"]} anni · {c["cfu"]} CFU</span>')
    p = bp.plain(c["desc"]).split(": ", 1)[-1]
    p = p[0].upper() + p[1:]
    if len(p) > 150:
        p = p[:150].rsplit(" ", 1)[0].rstrip(",;") + "…"
    return (f'<article class="card rv tilt {bg}"><div class="card-ic">{ic}</div>'
            f'<h3 class="ch-link"><a href="{c["url"]}" class="card-link">{bp.plain(c["name"]).replace(" (magistrale)", "")}</a></h3><p>{H.escape(p)}</p>'
            f'<div class="card-meta">{meta}</div><span class="card-more">Scheda del corso {bp.ARROW}</span></article>')


def register_cards(bp):
    for k in LAUREE:
        bp.EXTRA_CARDS[k] = laurea_card(bp, k)


def any_card(bp, key):
    return bp.card_link(key)


def card_grid(bp, keys):
    return '<div class="cards">%s</div>' % "".join(any_card(bp, k) for k in keys)


# ---------------------------------------------------------------------------
# 1) lauree
# ---------------------------------------------------------------------------
def tm_of(key):
    """'t' o 'm' per qualsiasi corso di laurea (vecchio o nuovo)"""
    if key in LAUREE:
        return LAUREE[key]["typ"]
    return {"c1": "u", "c2": "t", "c3": "t", "c4": "t", "c5": "t", "c6": "t"}.get(key)


def laurea_name(bp, key):
    if key in LAUREE:
        return LAUREE[key]["short"]
    return bp.COURSES[key]["short"]


def build_lauree(bp):
    for key, c in LAUREE.items():
        hub = HUB_TM[c["typ"]]
        trail = [("/", "Home"), ("/corsi-di-laurea/", "Corsi di laurea"), (hub["url"], hub["name"].replace(" online", "")), (c["url"], bp.plain(c["short"]))]
        tipo = "Laurea magistrale" if c["typ"] == "m" else "Laurea triennale"
        eyebrow = f'{tipo} · Classe {c["code"]} · {AREE[c["area"]][2]}'
        main = bp.page_hero(trail, eyebrow, c["h1"], c["lead"])
        ind = "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in c["indirizzi"])
        body = (f'<div class="card-meta"><span class="chip cy">{c["code"]}</span><span class="chip">{tipo}</span>'
                f'<span class="chip">{c["years"]} anni</span><span class="chip">{c["cfu"]} CFU</span><span class="chip">Online · esami in sede</span></div>'
                + "".join(f"<p>{p}</p>" for p in c["intro"])
                + "<h2>Che cosa si studia</h2>" + ul(c["materie"])
                + "<p class=\"x-meta\">Gli insegnamenti indicati sono quelli caratteristici della classe; il piano di studi ufficiale dell'anno accademico è pubblicato dall'ateneo.</p>"
                + (f'<h2>{"Gli indirizzi" if len(c["indirizzi"]) > 1 else "Il percorso"}</h2><div class="x-ind">{ind}</div>')
                + "<h2>Sbocchi professionali</h2>" + ul(c["sbocchi"])
                + "<h2>Requisiti di accesso</h2><p>" + c["accesso"] + "</p>"
                + "<h2>Dopo la laurea</h2><p>" + c["dopo"] + "</p>"
                + bp.HOW
                + faq_html(c["faq"]))
        facts = [("Tipo", tipo), ("Classe", c["code"]), ("Durata", "%d anni" % c["years"]), ("Crediti", "%d CFU" % c["cfu"]),
                 ("Indirizzi", str(len(c["indirizzi"]))), ("Modalità", "Online, esami in sede"), ("Orientamento", "Gratuito, entro 24 ore")]
        main += article_layout(bp, body, facts)
        rel = [k for k in c["related"] if k in LAUREE or k in bp.COURSES]
        main += bp.cards_section(rel, "Altri percorsi che potrebbero interessarti")
        graph = bp.base_graph(c["url"], c["title"], c["desc"], "/assets/og-cover.jpg", trail)
        course = {"@type": "Course", "@id": bp.SITE + c["url"] + "#corso", "name": bp.plain(c["name"]).replace(" (magistrale)", ""),
                  "description": bp.plain(" ".join(c["intro"]))[:500], "url": bp.SITE + c["url"], "inLanguage": "it",
                  "courseCode": c["code"], "provider": {"@id": bp.ORG_ID}, "educationalLevel": tipo,
                  "educationalCredentialAwarded": tipo + " (classe " + c["code"] + ")",
                  "numberOfCredits": {"@type": "StructuredValue", "value": c["cfu"], "unitText": "CFU"},
                  "timeToComplete": "P%dY" % c["years"],
                  "teaches": [bp.plain(m) for m in c["materie"]],
                  "occupationalCredentialAwarded": None,
                  "hasCourseInstance": {"@type": "CourseInstance", "courseMode": "online",
                                        "location": "Online, esami nelle sedi convenzionate"},
                  "offers": {"@type": "Offer", "category": "Paid", "availability": "https://schema.org/InStock",
                             "url": bp.SITE + c["url"], "offeredBy": {"@id": bp.ORG_ID}}}
        graph.append({k: v for k, v in course.items() if v})
        graph.append(faq_schema(bp, c["url"], c["faq"]))
        bp.assemble(c["url"], c["title"], c["desc"], main, graph)
        bp.BUILT.append((c["url"], "0.8", "monthly", []))


def lauree_by_area(bp):
    """sezione per l'hub /corsi-di-laurea/: tutto il catalogo, raggruppato per area"""
    groups = {}
    for k, c in LAUREE.items():
        groups.setdefault(c["area"], []).append(k)
    # le lauree storiche vanno nell'area giusta
    old = {"c1": "giu", "c2": "eco", "c3": "psi", "c4": "ped", "c5": "ing", "c6": "mot"}
    for k, a in old.items():
        groups.setdefault(a, []).insert(0, k)
    out = []
    for a in ["eco", "giu", "ing", "let", "ped", "psi", "bio", "mot"]:
        if a not in groups:
            continue
        out.append(f'<div class="x-area"><h3>{AREE[a][2]}</h3>{card_grid(bp, groups[a])}</div>')
    return f"""<section class="pcards" id="catalogo">
  <div class="wrap">
    <div class="sec-head rv"><h2>Tutti i corsi di laurea, per area</h2><p>Triennali, magistrali e ciclo unico: apri la scheda per materie, indirizzi, sbocchi e requisiti.</p></div>
    {''.join(out)}
    <p class="c-note" style="margin-top:30px">Il titolo di studio è rilasciato dall'università telematica convenzionata; piani di studio, durate e indirizzi attivi possono variare per anno accademico.</p>
  </div>
</section>
"""


def all_laurea_keys(bp):
    return ["c1", "c2", "c3", "c4", "c5", "c6"] + list(LAUREE)


def build_hubs_tm(bp):
    for typ, h in HUB_TM.items():
        keys = [k for k in all_laurea_keys(bp) if tm_of(k) == typ]
        if typ == "m":
            keys = ["c1"] + keys
        trail = [("/", "Home"), ("/corsi-di-laurea/", "Corsi di laurea"), (h["url"], h["name"].replace(" online", ""))]
        main = bp.page_hero(trail, h["eyebrow"], h["h1"], h["lead"])
        main += f'<section class="course" style="padding-bottom:0"><div class="wrap"><div class="c-main rv" style="max-width:900px"><p>{h["intro"]}</p></div></div></section>\n'
        main += f"""<section class="pcards" id="percorsi">
  <div class="wrap">
    <div class="sec-head rv"><h2>{"I corsi di laurea triennale" if typ == "t" else "I corsi di laurea magistrale"}</h2><p>{len(keys)} percorsi: apri la scheda per materie, indirizzi e sbocchi.</p></div>
    {card_grid(bp, keys)}
  </div>
</section>
"""
        other = HUB_TM["m" if typ == "t" else "t"]
        main += links_section(bp, [(other["url"], other["name"], other["eyebrow"]),
                                   ("/guide/laurea-triennale-magistrale-differenze/", "Triennale o magistrale?", "Le differenze spiegate"),
                                   ("/riconoscimento-cfu/", "Riconoscimento CFU", "Valutazione gratuita in 48 ore"),
                                   ("/guide/come-scegliere-corso-di-laurea/", "Come scegliere il corso", "Guida in 6 passi")],
                              "Da leggere prima di scegliere")
        main += bp.SECTIONS["perche"] + "\n"
        graph = bp.base_graph(h["url"], h["title"], h["desc"], "/assets/og-cover.jpg", trail, typ="CollectionPage")
        graph.append({"@type": "ItemList", "@id": bp.SITE + h["url"] + "#elenco", "name": h["name"],
                      "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": bp.SITE + url_of(bp, k), "name": bp.plain(laurea_name(bp, k))}
                                          for i, k in enumerate(keys)]})
        bp.assemble(h["url"], h["title"], h["desc"], main, graph)
        bp.BUILT.append((h["url"], "0.9", "weekly", []))


def url_of(bp, key):
    return LAUREE[key]["url"] if key in LAUREE else bp.COURSES[key]["url"]


# ---------------------------------------------------------------------------
# 2) diploma
# ---------------------------------------------------------------------------
def build_diplomi(bp):
    for i, d in enumerate(DIPLOMI):
        url = DIPLOMA_URL[d["slug"]]
        trail = [("/", "Home"), JANUS_HUB, (url, d["nome"] if len(d["nome"]) < 40 else d["h1"].split("<")[0].strip() or d["nome"])]
        trail[-1] = (url, bp.plain(d["h1"]))
        main = bp.page_hero(trail, d["tipo"] + " · Diploma online con Janus", d["h1"], d["lead"])
        body = (f'<div class="card-meta"><span class="chip cy">{d["tipo"]}</span><span class="chip">Diploma quinquennale</span><span class="chip">Recupero anni</span><span class="chip">Tutor personale</span></div>'
                f'<p>{d["intro"]}</p>'
                f'<p>Con Janus, l\'istituto online della rete UNICESD Olympo, l\'indirizzo <b>{d["nome"]}</b> è pensato {d["per"]}: chi lavora, chi fa sport, chi vive lontano da una scuola o chi deve recuperare uno o più anni.</p>'
                "<h2>Le materie</h2>" + ul(d["materie"])
                + "<p class=\"x-meta\">Le materie seguono il quadro orario ministeriale dell'indirizzo; il piano completo anno per anno è nella brochure Janus.</p>"
                + "<h2>Come si studia online</h2>" + ul(COME[i % 3])
                + "<h2>Recupero anni, idoneità e maturità</h2><p>Se hai perso uno o più anni, puoi rimetterti in pari con l'<b>esame di idoneità</b> e arrivare alla <b>maturità</b> da candidato privatista. Il tutor calcola con te quanti anni puoi recuperare. Leggi come funziona il <a href=\"/recupero-anni-scolastici/\">recupero anni scolastici</a>.</p>"
                + "<h2>Dopo il diploma</h2>" + ul(d["dopo"])
                + faq_html(d["faq"] + [("Il diploma preso online ha valore legale?", "Sì: il diploma è rilasciato dalla scuola statale o paritaria presso cui sostieni l'esame di Stato e ha lo stesso valore di quello di chi frequenta in presenza.")]))
        facts = [("Scuola", d["tipo"]), ("Indirizzo", d["nome"]), ("Titolo", "Diploma di scuola superiore"), ("Esami", "Idoneità e maturità"),
                 ("Piattaforma", "Online 24/7"), ("Tutor", "Personale"), ("Sede Janus", "Roma")]
        main += article_layout(bp, body, facts)
        others = [(DIPLOMA_URL[x["slug"]], bp.plain(x["h1"]), x["tipo"]) for x in DIPLOMI if x["slug"] != d["slug"] and x["tipo"] == d["tipo"]][:5]
        others += [("/recupero-anni-scolastici/", "Recupero anni scolastici", "Idoneità e maturità"), (JANUS_HUB[0], "Tutti gli indirizzi Janus", "Licei, tecnici e professionali")]
        main += links_section(bp, others, "Altri indirizzi e approfondimenti")
        graph = bp.base_graph(url, d["title"], d["desc"], "/assets/og-cover.jpg", trail)
        graph.append({"@type": "Course", "@id": bp.SITE + url + "#corso", "name": "Diploma " + d["nome"],
                      "description": bp.plain(d["intro"])[:500], "url": bp.SITE + url, "inLanguage": "it",
                      "provider": {"@id": bp.ORG_ID}, "educationalLevel": "Scuola secondaria di secondo grado",
                      "educationalCredentialAwarded": "Diploma di istruzione secondaria superiore",
                      "teaches": [bp.plain(m) for m in d["materie"]],
                      "hasCourseInstance": {"@type": "CourseInstance", "courseMode": "online", "location": "Online"},
                      "offers": {"@type": "Offer", "category": "Paid", "url": bp.SITE + url, "offeredBy": {"@id": bp.ORG_ID}}})
        graph.append(faq_schema(bp, url, d["faq"]))
        bp.assemble(url, d["title"], d["desc"], main, graph)
        bp.BUILT.append((url, "0.7", "monthly", []))


def build_generic(bp, p, trail, schema_extra=None, og="/assets/og-cover.jpg", typ="WebPage", note=None, kind="servizio"):
    url = p["url"]
    main = bp.page_hero(trail, p["eyebrow"], p["h1"], p["lead"])
    body = render_blocks(p["blocks"])
    if note:
        body += f'<p class="c-note">{note}</p>'
    body += faq_html(p.get("faq"))
    main += article_layout(bp, body, p["facts"])
    if p.get("related"):
        main += related_section(bp, p["related"])
    graph = bp.base_graph(url, p["title"], p["desc"], og, trail, typ=typ)
    if p.get("faq"):
        graph.append(faq_schema(bp, url, p["faq"]))
    for n in (schema_extra or []):
        graph.append(n)
    bp.assemble(url, p["title"], p["desc"], main, graph, og=og)
    bp.BUILT.append((url, "0.7", "monthly", bp.section_images(main)))


def build_recupero(bp):
    p = RECUPERO
    trail = [("/", "Home"), JANUS_HUB, (p["url"], p["name"])]
    svc = {"@type": "Service", "@id": bp.SITE + p["url"] + "#servizio", "name": "Recupero anni scolastici online",
           "serviceType": "Preparazione agli esami di idoneità e di Stato", "provider": {"@id": bp.ORG_ID},
           "areaServed": {"@type": "Country", "name": "Italia"}, "url": bp.SITE + p["url"], "description": p["desc"]}
    build_generic(bp, p, trail, [svc])


def build_estero(bp):
    for p in ESTERO:
        trail = [("/", "Home"), ESTERO_HUB, (p["url"], p["name"])]
        svc = {"@type": "Service", "@id": bp.SITE + p["url"] + "#servizio", "name": bp.plain(p["h1"]),
               "serviceType": "Orientamento e iscrizione a università estere", "provider": {"@id": bp.ORG_ID},
               "areaServed": {"@type": "Country", "name": "Italia"}, "url": bp.SITE + p["url"], "description": p["desc"]}
        build_generic(bp, p, trail, [svc], note=NOTA_ESTERO)


# ---------------------------------------------------------------------------
# 3) guide
# ---------------------------------------------------------------------------
def guide_url(g):
    return GUIDE_HUB["url"] + g["slug"] + "/"


def build_guide(bp):
    for g in GUIDE:
        url = guide_url(g)
        trail = [("/", "Home"), (GUIDE_HUB["url"], GUIDE_HUB["name"]), (url, g["name"])]
        main = bp.page_hero(trail, "Guida", g["h1"], g["lead"], cta=False)
        body = (f'<p class="x-meta">Guida a cura della redazione di UNICESD Olympo · aggiornata al {bp.TODAY[8:10]}/{bp.TODAY[5:7]}/{bp.TODAY[:4]}</p>'
                + render_blocks(g["blocks"]) + faq_html(g.get("faq")))
        facts = [("Tipo", "Guida"), ("Tempo di lettura", "%d minuti" % max(3, round(len(bp.plain(body).split()) / 200))),
                 ("Aggiornata", "%s/%s/%s" % (bp.TODAY[8:10], bp.TODAY[5:7], bp.TODAY[:4])), ("Dubbi?", "Orientamento gratuito")]
        main += article_layout(bp, body, facts)
        rel = list(g.get("related", []))
        rel += [(guide_url(x), x["name"]) for x in GUIDE if x is not g][:6 - len(rel)]
        main += related_section(bp, rel, "Continua a leggere")
        graph = bp.base_graph(url, g["title"], g["desc"], "/assets/og-cover.jpg", trail)
        graph.append({"@type": "Article", "@id": bp.SITE + url + "#articolo", "headline": bp.plain(g["h1"])[:110],
                      "description": g["desc"], "inLanguage": "it-IT", "mainEntityOfPage": {"@id": bp.SITE + url + "#pagina"},
                      "image": bp.SITE + "/assets/og-cover.jpg", "datePublished": PUBLISHED, "dateModified": bp.TODAY,
                      "author": {"@id": bp.ORG_ID}, "publisher": {"@id": bp.ORG_ID},
                      "wordCount": len(bp.plain(body).split())})
        if g.get("faq"):
            graph.append(faq_schema(bp, url, g["faq"]))
        bp.assemble(url, g["title"], g["desc"], main, graph)
        bp.BUILT.append((url, "0.6", "monthly", []))
    # hub
    h = GUIDE_HUB
    trail = [("/", "Home"), (h["url"], h["name"])]
    main = bp.page_hero(trail, h["eyebrow"], h["h1"], h["lead"], cta=False)
    main += links_section(bp, [(guide_url(g), g["name"], bp.plain(g["lead"]).split(". ")[0][:110] + "…") for g in GUIDE],
                          "Tutte le guide", sid="guide")
    graph = bp.base_graph(h["url"], h["title"], h["desc"], "/assets/og-cover.jpg", trail, typ="CollectionPage")
    graph.append({"@type": "ItemList", "@id": bp.SITE + h["url"] + "#elenco", "name": "Guide",
                  "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": bp.SITE + guide_url(g), "name": g["name"]}
                                      for i, g in enumerate(GUIDE)]})
    bp.assemble(h["url"], h["title"], h["desc"], main, graph)
    bp.BUILT.append((h["url"], "0.7", "weekly", []))


# ---------------------------------------------------------------------------
# 4) pagine locali
# ---------------------------------------------------------------------------
def build_locali(bp):
    for p in LOCALI:
        url = p["url"]
        trail = [("/", "Home"), ("/sedi/", "Sedi"), (url, p["name"])]
        p = dict(p)
        p["facts"] = list(p["addr"]) + [("Orientamento", "Gratuito, entro 24 ore")]
        extra = []
        if p["city"] == "Licata":
            extra.append({"@type": "EducationalOrganization", "@id": bp.SITE + url + "#polo", "name": "Global Campus Licata",
                          "description": "Polo n° 00001 della rete UNICESD Olympo: orientamento, iscrizioni e assistenza allo studente.",
                          "address": {"@type": "PostalAddress", "streetAddress": "Corso Umberto 37", "postalCode": "92027",
                                      "addressLocality": "Licata", "addressRegion": "AG", "addressCountry": "IT"},
                          "telephone": ["+393401555552", "+393278126622"], "email": "globalcampuslicata@gmail.com",
                          "url": "https://globalcampuslicata.com", "memberOf": {"@id": bp.ORG_ID}})
        elif p["city"] == "Lisbona":
            extra.append({"@type": "EducationalOrganization", "@id": bp.SITE + url + "#lisbona",
                          "name": "Universitas Centro Studi Olympo, S.R.L. — Sucursal em Portugal",
                          "address": {"@type": "PostalAddress", "streetAddress": "Rua Castilho 13, 3.º-B", "postalCode": "1250-066",
                                      "addressLocality": "Lisboa", "addressCountry": "PT"},
                          "telephone": "+351210523770", "taxID": "980647819", "parentOrganization": {"@id": bp.ORG_ID}})
        elif p["city"] == "Palermo":
            extra = []  # l'organizzazione completa (indirizzi e orari) la mette org_full qui sotto
        p["eyebrow"] = p["eyebrow"]
        build_generic(bp, p, trail, extra)
        if p["city"] == "Palermo":
            # stessa pagina, con la scheda completa dell'ente (indirizzi, telefoni, orari)
            pass


# ---------------------------------------------------------------------------
# link interni nelle pagine esistenti (home, offerta, Janus, Medicina)
# ---------------------------------------------------------------------------
def link_existing(html_):
    # catalogo lauree: <span class="ec-cls">L-15</span>...<h4>Nome</h4>
    def ec(m):
        url = CLASS_URL.get(m.group(1))
        if not url or "<a " in m.group(3):
            return m.group(0)
        return m.group(0)[:m.start(3) - m.start(0)] + f'<a href="{url}">{m.group(3)}</a>' + m.group(0)[m.end(3) - m.start(0):]
    html_ = re.sub(r'<span class="ec-cls">([\w-]+)</span>(.*?)<h4>(.*?)</h4>', ec, html_, flags=re.S)
    # indirizzi del diploma
    for name, url in RAIL_URL.items():
        html_ = html_.replace(f"<b>{name}</b><span>", f'<b><a class="rail-link" href="{url}">{name}</a></b><span>')
    # percorsi sanitari all'estero
    for name, url in ESTERO_H3.items():
        html_ = html_.replace(f"<h3>{name}</h3>", f'<h3><a class="rail-link" href="{url}">{name}</a></h3>')
    return html_


def page_extras(bp):
    """blocchi aggiunti in fondo ad alcune pagine esistenti (hook PAGE_EXTRA di build_pages)"""
    bp.PAGE_EXTRA["/janus-diploma-online/"] = links_section(
        bp, [(DIPLOMA_URL[d["slug"]], bp.plain(d["h1"]), d["tipo"]) for d in DIPLOMI]
        + [("/recupero-anni-scolastici/", "Recupero anni scolastici", "Idoneità e maturità da privatista")],
        "Le schede dei singoli indirizzi", "Materie, sbocchi e domande frequenti per ogni diploma.", sid="indirizzi")
    bp.PAGE_EXTRA["/medicina-senza-test-ingresso/"] = links_section(
        bp, [(p["url"], p["name"], bp.plain(p["lead"]).split(":")[0].split(".")[0][:90]) for p in ESTERO]
        + [("/guide/riconoscimento-laurea-medicina-estero/", "Riconoscimento del titolo", "Come si fa valere in Italia")],
        "Approfondisci per percorso e per Paese", sid="approfondimenti")
    bp.PAGE_EXTRA["/sedi/"] = links_section(
        bp, [(p["url"], p["name"], p["eyebrow"]) for p in LOCALI], "Le sedi, una per una")
    bp.PAGE_EXTRA["/faq/"] = links_section(
        bp, [(guide_url(g), g["name"], "Guida") for g in GUIDE[:8]], "Le guide per approfondire")
    bp.PAGE_EXTRA["/intelligenza-artificiale-ai-act/"] = links_section(
        bp, [("/guide/ai-act-obbligo-formazione/", "AI Act: l'obbligo di alfabetizzazione", "Che cosa prevede l'articolo 4"),
             ("/formazione-aziendale/", "Formazione aziendale", "Percorsi su misura e finanziati"),
             ("/fondo-nuove-competenze-2026/", "Fondo Nuove Competenze 2026", "Formazione rimborsata alle imprese")],
        "Da leggere")
    bp.HUB_EXTRA["lauree"] = lauree_by_area(bp)
    bp.HUB_EXTRA_KEYS["lauree"] = list(LAUREE)


def build_all(bp):
    build_hubs_tm(bp)
    build_lauree(bp)
    build_diplomi(bp)
    build_recupero(bp)
    build_estero(bp)
    build_guide(bp)
    build_locali(bp)


# ---------------------------------------------------------------------------
# footer, llms.txt
# ---------------------------------------------------------------------------
def footer_groups(bp):
    C = bp.COURSES
    return [
        ("Corsi di laurea online", [("/corsi-di-laurea/", "Tutti i corsi di laurea"), ("/lauree-triennali-online/", "Lauree triennali online"),
                                    ("/lauree-magistrali-online/", "Lauree magistrali online")]
         + [(c["url"], c["short"]) for k, c in C.items() if c["hub"] == "lauree"]
         + [(LAUREE[k]["url"], LAUREE[k]["short"]) for k in ("lm51", "l14", "lm85", "lm32")]),
        ("Master e alta formazione", [(c["url"], c["short"]) for k, c in C.items() if c["hub"] == "master"]),
        ("Certificazioni e CFU", [(c["url"], c["short"]) for k, c in C.items() if c["hub"] in ("certificazioni", "singoli")]),
        ("Diploma online", [(JANUS_HUB[0], "Diploma online con Janus"), ("/recupero-anni-scolastici/", "Recupero anni scolastici")]
         + [(DIPLOMA_URL[s], n) for s, n in (("liceo-scientifico", "Liceo Scientifico"), ("ragioneria-afm", "Ragioneria (AFM)"),
                                             ("socio-sanitario", "Socio Sanitario"), ("liceo-linguistico", "Liceo Linguistico"))]),
        ("Studiare all'estero", [(ESTERO_HUB[0], "Medicina senza test")] + [(p["url"], p["name"]) for p in ESTERO]),
        ("Guide", [(GUIDE_HUB["url"], "Tutte le guide")] + [(guide_url(g), g["name"]) for g in GUIDE[:7]]),
        ("Dove siamo", [("/sedi/", "Sedi"), ("/poli-aperti/", "Poli aperti")] + [(p["url"], p["name"]) for p in LOCALI]),
        ("Il Centro Studi", [(p["url"], p["name"]) for p in bp.PAGES if p["url"] not in
                             ("/contatti/", "/faq/", "/sedi/", "/poli-aperti/", "/janus-diploma-online/", "/medicina-senza-test-ingresso/")]),
    ]


def llms_lines(bp):
    L = ["", "## Corsi di laurea (catalogo completo)"]
    for h in HUB_TM.values():
        L.append(f"- [{h['name']}]({bp.SITE}{h['url']}): {h['desc']}")
    for c in LAUREE.values():
        L.append(f"- [{bp.plain(c['short'])}]({bp.SITE}{c['url']}): {c['desc']}")
    L += ["", "## Diploma online (Janus)"]
    for d in DIPLOMI:
        L.append(f"- [{d['nome']}]({bp.SITE}{DIPLOMA_URL[d['slug']]}): {d['desc']}")
    L.append(f"- [{RECUPERO['name']}]({bp.SITE}{RECUPERO['url']}): {RECUPERO['desc']}")
    L += ["", "## Studiare all'estero (area sanitaria)"]
    for p in ESTERO:
        L.append(f"- [{p['name']}]({bp.SITE}{p['url']}): {p['desc']}")
    L += ["", "## Guide"]
    for g in GUIDE:
        L.append(f"- [{g['name']}]({bp.SITE}{guide_url(g)}): {g['desc']}")
    L += ["", "## Sedi"]
    for p in LOCALI:
        L.append(f"- [{p['name']}]({bp.SITE}{p['url']}): {p['desc']}")
    return L


# le lauree "storiche" rimandano anche alle nuove schede collegate
_SIB = {"c1": ["l14"], "c2": ["lm56", "l15"], "c3": ["lm51"], "c4": ["lm85"], "c5": ["lm32", "l9"], "c6": ["lm67", "l13"]}


def extra_siblings(key):
    return list(_SIB.get(key, []))
