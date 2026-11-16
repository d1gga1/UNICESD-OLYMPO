#!/usr/bin/env python3
"""
Pagina della sede di Firenze: https://unicesd-olympo.com/firenze/

Prende la home appena generata (repo-github/index.html), la adatta a Firenze e la scrive in
repo-github/firenze/index.html. Aggiunge l'indirizzo alla sitemap.

Si lancia da solo alla fine di build_repo.py; a mano: python3 sorgenti/build_firenze.py

>>> I DATI DELLA SEDE SI CAMBIANO QUI SOTTO (dizionario SEDE). <<<
Se "indirizzo" e' vuoto la pagina dice "Su appuntamento" e la mappa mostra il centro di Firenze.
"""
import re
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent / "repo-github"
URL = "https://unicesd-olympo.com/firenze/"

SEDE = {
    "indirizzo": "",            # es. "Via dei Servi 12"
    "cap": "",                  # es. "50122"
    "orari": "Su appuntamento",
    "referente": "",            # es. "Mario Rossi"
    "telefono": "",             # es. "+39 055 000 0000" (vuoto = si usano i numeri nazionali)
    "email": "info@unicesd-olympo.com",
}


def esc_tel(t):
    return "+" + re.sub(r"\D", "", t) if t.strip().startswith("+") else re.sub(r"\D", "", t)


def sostituisci(s, old, new, count=1, obbligatorio=True):
    if obbligatorio and old not in s:
        raise SystemExit(f"[firenze] testo non trovato nella home: {old[:80]!r}")
    return s.replace(old, new, count) if count else s.replace(old, new)


def sezione_sede():
    ind = SEDE["indirizzo"].strip()
    if ind:
        dove = f'{ind}, {SEDE["cap"]} Firenze (FI)'.replace(", ,", ",").replace(",  ", ", ")
        q = f'{ind} {SEDE["cap"]} Firenze'
    else:
        dove = "Firenze &middot; colloqui su appuntamento"
        q = "Firenze, Italia"
    mappa = "https://www.google.com/maps?q=" + q.replace(" ", "+") + "&amp;output=embed"
    link_mappa = "https://www.google.com/maps/search/?api=1&amp;query=" + q.replace(" ", "+")

    tel_html = ""
    if SEDE["telefono"].strip():
        tel_html = (f'<a class="fi-tel" href="tel:{esc_tel(SEDE["telefono"])}">{SEDE["telefono"]}</a>'
                    f'<small>{SEDE["referente"] or "Sede di Firenze"}</small>')
    tel_html += ('<a class="fi-tel" href="tel:+393509651711">+39 350 965 1711</a><small>Calogero Di Carlo</small>'
                 '<a class="fi-tel" href="tel:+393281376792">+39 328 137 6792</a><small>Segreteria UNICESD Olympo</small>')
    ref = f'<li><b>Referente</b><span>{SEDE["referente"]}</span></li>' if SEDE["referente"].strip() else ""
    mail = SEDE["email"]

    return f'''
<!-- ===== LA SEDE DI FIRENZE (generata da sorgenti/build_firenze.py) ===== -->
<section id="sede-firenze" style="padding-top:88px">
  <div class="wrap">
    <div class="sec-head center rv">
      <div class="eyebrow"><em></em> UNICESD Olympo Firenze</div>
      <h2>Il Centro Studi, <span class="grad">ora anche a Firenze</span></h2>
      <p>La sede fiorentina porta in Toscana il modello UNICESD Olympo: orientamento gratuito, tutor dedicato e percorsi universitari online, con gli esami nelle sedi convenzionate con l'ateneo.</p>
    </div>
    <div class="fi-grid">
      <div class="fi-cards">
        <div class="fi-card rv"><div class="fi-ic">&#129517;</div><h3>Orientamento in sede</h3><p>Colloquio gratuito e senza impegno: valutiamo insieme titolo di studio, esperienza e obiettivi e ti proponiamo il percorso pi&ugrave; adatto.</p></div>
        <div class="fi-card rv" style="transition-delay:.08s"><div class="fi-ic">&#128203;</div><h3>Iscrizione e pratiche</h3><p>Ti seguiamo nella domanda di iscrizione, nel riconoscimento dei CFU (valutazione preliminare in genere entro 48 ore) e nel piano di rateizzazione.</p></div>
        <div class="fi-card rv" style="transition-delay:.16s"><div class="fi-ic">&#129309;</div><h3>Tutor dedicato</h3><p>Dall'iscrizione alla laurea hai un referente unico: piano di studi, scadenze, preparazione agli esami e supporto sulla piattaforma 24/7.</p></div>
        <div class="fi-card rv" style="transition-delay:.24s"><div class="fi-ic">&#127979;</div><h3>Per chi lavora in Toscana</h3><p>Lezioni online quando vuoi, dal computer o dallo smartphone. Ideale per lavoratori, forze dell'ordine, personale della scuola e della sanit&agrave;.</p></div>
      </div>
      <aside class="fi-box rv-s">
        <div class="fi-map"><iframe src="{mappa}" title="Mappa della sede UNICESD Olympo di Firenze" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
        <div class="fi-info">
          <h3>Sede di Firenze</h3>
          <ul class="fi-list">
            <li><b>Dove</b><span>{dove}</span></li>
            <li><b>Orari</b><span>{SEDE["orari"]}</span></li>
            {ref}
            <li><b>Email</b><span><a href="mailto:{mail}?subject=Sede%20di%20Firenze%20-%20richiesta%20informazioni">{mail}</a></span></li>
          </ul>
          <div class="fi-tels">{tel_html}</div>
          <div class="fi-cta">
            <a href="#iscrizione" class="btn btn-p btn-sm" data-cursor><span>Prenota un colloquio</span><span class="shine"></span></a>
            <a href="{link_mappa}" target="_blank" rel="noopener" class="btn btn-g btn-sm">Apri in Google Maps</a>
          </div>
        </div>
      </aside>
    </div>
  </div>
</section>
'''


CSS = '''
<style>
/* ===== SEDE DI FIRENZE ===== */
.fi-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:26px;align-items:start}
.fi-cards{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.fi-card{background:var(--panel-solid);border:1px solid var(--line);border-radius:22px;padding:26px 24px;box-shadow:0 14px 40px -24px rgba(16,28,64,.35)}
.fi-ic{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;font-size:22px;background:var(--surface-2);border:1px solid var(--line);margin-bottom:14px}
.fi-card h3{font-family:'Sora';font-size:18px;margin:0 0 8px}
.fi-card p{font-size:14.4px;line-height:1.6;color:var(--txt-mute);margin:0}
.fi-box{background:var(--panel-solid);border:1px solid var(--line);border-radius:24px;overflow:hidden;box-shadow:0 18px 50px -26px rgba(16,28,64,.4)}
.fi-map{aspect-ratio:16/10;background:var(--surface-2)}
.fi-map iframe{width:100%;height:100%;border:0;display:block}
.fi-info{padding:24px}
.fi-info h3{font-family:'Sora';font-size:20px;margin:0 0 12px}
.fi-list{list-style:none;padding:0;margin:0 0 16px;display:grid;gap:9px}
.fi-list li{display:grid;grid-template-columns:70px 1fr;gap:10px;font-size:14.2px;line-height:1.5}
.fi-list b{font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--txt-mute);padding-top:2px}
.fi-list a{color:var(--cy);font-weight:600;word-break:break-all}
.fi-tels{border-top:1px solid var(--line);padding-top:14px;margin-bottom:16px}
.fi-tel{display:block;font-family:'Sora';font-size:18px;font-weight:700;color:var(--cy)}
.fi-tels small{display:block;font-size:12.2px;color:var(--txt-mute);margin:1px 0 9px}
.fi-cta{display:flex;flex-wrap:wrap;gap:10px}
@media(max-width:980px){.fi-grid{grid-template-columns:1fr}}
@media(max-width:600px){.fi-cards{grid-template-columns:1fr}.fi-card{padding:22px 20px}}
</style>
'''


def schema():
    oggi = date.today().isoformat()
    addr = {"@type": "PostalAddress", "addressLocality": "Firenze", "addressRegion": "FI", "addressCountry": "IT"}
    if SEDE["indirizzo"].strip():
        addr["streetAddress"] = SEDE["indirizzo"].strip()
    if SEDE["cap"].strip():
        addr["postalCode"] = SEDE["cap"].strip()
    import json
    data = {
        "@context": "https://schema.org",
        "@graph": [
            {"@type": "WebPage", "@id": URL + "#pagina", "url": URL,
             "name": "UNICESD Olympo Firenze | Lauree online, master e certificazioni",
             "description": "La sede di Firenze di UNICESD Olympo: orientamento gratuito, tutor dedicato, lauree online, master e certificazioni.",
             "inLanguage": "it-IT", "dateModified": oggi,
             "isPartOf": {"@id": "https://unicesd-olympo.com/#sito"},
             "about": {"@id": URL + "#sede"}},
            {"@type": "EducationalOrganization", "@id": URL + "#sede",
             "name": "UNICESD Olympo - Sede di Firenze", "url": URL,
             "parentOrganization": {"@id": "https://unicesd-olympo.com/#organizzazione"},
             "address": addr, "email": SEDE["email"],
             "telephone": SEDE["telefono"].strip() or "+39 350 965 1711",
             "geo": {"@type": "GeoCoordinates", "latitude": 43.7696, "longitude": 11.2558},
             "areaServed": {"@type": "AdministrativeArea", "name": "Toscana"}},
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://unicesd-olympo.com/"},
                {"@type": "ListItem", "position": 2, "name": "Sede di Firenze", "item": URL}]},
        ],
    }
    return '<script type="application/ld+json">\n' + json.dumps(data, ensure_ascii=False, indent=2) + "\n</script>\n"


def main():
    s = (REPO / "index.html").read_text(encoding="utf-8")

    # --- percorsi: la pagina sta in /firenze/, le immagini in /assets/
    s = re.sub(r'(["\'(])assets/', r'\1/assets/', s)

    # --- SEO
    s = re.sub(r'<meta name="description" content="[^"]*">',
               '<meta name="description" content="UNICESD Olympo a Firenze: lauree online, master di I e II livello e certificazioni per la Toscana. Orientamento gratuito, tutor dedicato e riconoscimento CFU in 48 ore.">', s, 1)
    s = re.sub(r'<title>[^<]*</title>', '<title>UNICESD Olympo Firenze | Lauree online, master e certificazioni</title>', s, 1)
    for a, b in [
        ('<link rel="canonical" href="https://unicesd-olympo.com/">', f'<link rel="canonical" href="{URL}">'),
        ('<link rel="alternate" hreflang="it-IT" href="https://unicesd-olympo.com/">', f'<link rel="alternate" hreflang="it-IT" href="{URL}">'),
        ('<link rel="alternate" hreflang="x-default" href="https://unicesd-olympo.com/">', f'<link rel="alternate" hreflang="x-default" href="{URL}">'),
        ('<meta property="og:url" content="https://unicesd-olympo.com/">', f'<meta property="og:url" content="{URL}">'),
        ('<meta name="geo.region" content="IT-PA">', '<meta name="geo.region" content="IT-FI">'),
        ('<meta name="geo.placename" content="Palermo">', '<meta name="geo.placename" content="Firenze">'),
        ('<meta name="geo.position" content="38.1157;13.3615">', '<meta name="geo.position" content="43.7696;11.2558">'),
        ('<meta name="ICBM" content="38.1157, 13.3615">', '<meta name="ICBM" content="43.7696, 11.2558">'),
    ]:
        s = sostituisci(s, a, b)
    s = re.sub(r'<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="UNICESD Olympo Firenze | Lauree online, master e certificazioni">', s, 1)
    s = re.sub(r'<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="La sede di Firenze di UNICESD Olympo: orientamento gratuito, tutor dedicato, corsi di laurea online, master e certificazioni per chi studia e lavora in Toscana.">', s, 1)
    s = re.sub(r'<meta name="twitter:title" content="[^"]*">', '<meta name="twitter:title" content="UNICESD Olympo | Sede di Firenze">', s, 1)

    # --- dati strutturati: quelli della home sostituiti con quelli della sede
    s, n = re.subn(r'<script type="application/ld\+json">.*?</script>\s*', lambda m: "", s, flags=re.S)
    s = s.replace("</head>", schema() + CSS + "</head>", 1)

    # --- topbar, logo, hero
    s = sostituisci(s, 'Immatricolazioni A.A. 2026/2027 aperte &mdash; posti limitati nei poli didattici',
                    'Immatricolazioni A.A. 2026/2027 aperte &mdash; ora anche a Firenze')
    s = sostituisci(s, '<span class="brand-sub">Centro Studi</span>', '<span class="brand-sub">Firenze</span>')
    s = sostituisci(s, '<em></em> Universitas Centro Studi Olympo</div>', '<em></em> UNICESD Olympo &middot; Sede di Firenze</div>')
    s = sostituisci(s, '<span style="animation-delay:.41s">parte da qui.</span>', '<span style="animation-delay:.41s">parte da Firenze.</span>')
    s = sostituisci(s, 'UNICESD Olympo &mdash; Centro Studi a Palermo per corsi di laurea, master universitari e certificazioni',
                    'UNICESD Olympo Firenze &mdash; Centro Studi a Firenze per corsi di laurea, master universitari e certificazioni')
    s = sostituisci(s, "<p class=\"lead\">Centro Studi accreditato per l'orientamento, il tutoraggio e il coordinamento di percorsi universitari e di alta formazione. Studi dove vuoi, quando vuoi, con un tutor sempre al tuo fianco.</p>",
                    "<p class=\"lead\">La sede di Firenze di UNICESD Olympo: orientamento, tutoraggio e coordinamento di percorsi universitari e di alta formazione per tutta la Toscana. Studi dove vuoi, quando vuoi, con un tutor sempre al tuo fianco.</p>")
    s = sostituisci(s, '<a href="#offerta" class="btn btn-g" data-cursor>Esplora l\'offerta formativa</a>',
                    '<a href="#sede-firenze" class="btn btn-g" data-cursor>La sede di Firenze</a>')
    s = sostituisci(s, '<i></i> Palermo &middot; rete nazionale &amp; internazionale', '<i></i> Firenze &middot; rete nazionale &amp; internazionale')

    # --- nuova sezione subito dopo i numeri
    s = sostituisci(s, '<!-- ===== I CAME BACK - CONVENTION 18 SETTEMBRE 2026 ===== -->',
                    sezione_sede() + '\n<!-- ===== I CAME BACK - CONVENTION 18 SETTEMBRE 2026 ===== -->')

    # --- FAQ esami
    s = sostituisci(s, "La sede di Palermo &egrave; il punto di riferimento principale per la Sicilia occidentale; ti indichiamo la sede pi&ugrave; vicina al momento dell'iscrizione.",
                    "Per chi si iscrive tramite la sede di Firenze ti indichiamo la sede d'esame pi&ugrave; vicina al momento dell'iscrizione.")

    # --- modulo: arriva con l'indicazione della sede
    s = sostituisci(s, '<form id="lead" novalidate>', '<form id="lead" novalidate><input type="hidden" name="sede" value="Firenze">')
    s = sostituisci(s, '<p>Compila il modulo: un orientatore ti contatta entro 24 ore lavorative per un colloquio gratuito e senza impegno.</p>',
                    '<p>Compila il modulo: un orientatore della sede di Firenze ti contatta entro 24 ore lavorative per un colloquio gratuito e senza impegno.</p>')
    if SEDE["telefono"].strip():
        t = SEDE["telefono"].strip()
        s = sostituisci(s, '<div style="font-size:12.6px;color:var(--txt-mute);margin-bottom:6px">Preferisci parlare subito?</div>',
                        '<div style="font-size:12.6px;color:var(--txt-mute);margin-bottom:6px">Preferisci parlare subito?</div>'
                        f'<a href="tel:{esc_tel(t)}" style="font-family:\'Sora\';font-size:19px;font-weight:700;color:var(--cy);display:block">{t}</a>'
                        f'<div style="font-size:12.2px;color:var(--txt-mute);margin:2px 0 10px">{SEDE["referente"] or "Sede di Firenze"}</div>')

    # --- banda finale
    s = sostituisci(s, '<p>Parla con un orientatore UNICESD Olympo e scopri in pochi minuti quanto manca davvero al tuo obiettivo.</p>',
                    '<p>Parla con un orientatore della sede di Firenze e scopri in pochi minuti quanto manca davvero al tuo obiettivo.</p>')

    # --- footer: link alla sede tra le pagine locali
    s = sostituisci(s, '<li><a href="/universita-online-palermo/">', '<li><a href="/firenze/">Sede di Firenze</a></li><li><a href="/universita-online-palermo/">', obbligatorio=False)

    out = REPO / "firenze" / "index.html"
    out.parent.mkdir(exist_ok=True)
    out.write_text(s, encoding="utf-8")
    print(f"[firenze] {out}  ({out.stat().st_size/1024:.0f} KB)")

    # --- sitemap
    sm = REPO / "sitemap.xml"
    if sm.exists():
        x = sm.read_text(encoding="utf-8")
        x = re.sub(r"\s*<url>\s*<loc>https://unicesd-olympo.com/firenze/</loc>.*?</url>", "", x, flags=re.S)
        voce = (f"  <url>\n    <loc>{URL}</loc>\n    <lastmod>{date.today().isoformat()}</lastmod>\n"
                "    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n")
        x = x.replace("</urlset>", voce + "</urlset>")
        sm.write_text(x, encoding="utf-8")


if __name__ == "__main__":
    main()
