#!/usr/bin/env python3
"""
Ricompone i sorgenti in index.html, con le immagini servite dalla cartella
assets/ (versione web: pagina leggera, immagini caricate a parte dal browser).

Uso:  python3 sorgenti/build.py
"""
import pathlib
import re

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
ASSETS = ROOT / "assets"
OUT = ROOT / "index.html"

SITE_URL = "https://unicesd-olympo.com"

# token -> file dentro assets/
IMAGES = {
    "__IMG_LOGO__": "logo-light.png",
    "__IMG_LOGO_NAVY__": "logo-navy.webp",
    "__IMG_FOUNDER_NEW__": "founder-cers.webp",
    "__IMG_PRESS__": "press-cover.jpg",
    "__IMG_GRUPPO__": "gruppo-olympo.webp",
    "__IMG_PROTO__": "master-protocollo.jpg",
    "__IMG_PEGASO__": "pegaso-evento.jpg",
    "__IMG_JANUS__": "partner/janus.webp",
    "__IMG_JANUS_BROCHURE__": "janus/janus-brochure.webp",
    "__IMG_JANUS_ROADMAP__": "janus/janus-roadmap.webp",
    "__IMG_JANUS_PDAY__": "janus/janus-partnerday.webp",
    "__IMG_JANUS_P1__": "janus/janus-pg-nascita.webp",
    "__IMG_JANUS_P2__": "janus/janus-pg-modello.webp",
    "__IMG_JANUS_P3__": "janus/janus-pg-corsi.webp",
    "__IMG_JANUS_P4__": "janus/janus-pg-risultati.webp",
    "__IMG_JANUS_P5__": "janus/janus-pg-staff.webp",
    "__IMG_ASDP__": "partner/pegaso-athletic.webp",
    "__IMG_UPM__": "partner/mauriziana.webp",
    "__IMG_YHANK__": "partner/yhank.webp",
    "__IMG_LUXIUM__": "partner/luxium.webp",
    "__IMG_ISET__": "partner/iset.webp",
    "__IMG_GIURECOFORM__": "partner/giurecoform.webp",
    "__IMG_ISET_PROD__": "iset-produzione.webp",
    "__IMG_ISET_CTRL__": "iset-controllo.webp",
    "__IMG_CEFALU_RENDER__": "cefalu-render.webp",
    "__IMG_CEFALU_AEREA__": "cefalu-aerea.webp",
    "__IMG_VILLA__": "villa-ricettivo.webp",
    "__IMG_MADONIE__": "madonie-terreni.webp",
    "__IMG_KALOS_MAG__": "kalos-magazzino.webp",
    "__IMG_KALOS_ETI__": "kalos-etichetta.webp",
    "__IMG_TEATRO__": "teatro-massimo.webp",
    "__IMG_LISBOA__": "lisboa-sede.webp",
    "__IMG_ECP__": "ecp-sedi.webp",
    "__IMG_KALOS__": "partner/biokalos.webp",
    "__IMG_HASHTAG__": "partner/hashtag.webp",
    "__IMG_UNISCUOLE__": "partner/uniscuole.webp",
    "__IMG_SIULP__": "partner/siulp.webp",
    "__IMG_EREMITA__": "partner/eremita.webp",
    "__IMG_ECCELLENZE__": "eccellenze.webp",
    "__IMG_PREMIAZIONE__": "premiazione.webp",
    "__IMG_SIULP_LOC__": "siulp-locandina.webp",
    "__IMG_FNC__": "fnc-cover.webp",
    "__IMG_EREMITA_COVER__": "eremita-cover.webp",
    "__IMG_LIBROSEDI__": "libro-sedi.webp",
    "__IMG_EFFETTOTRE__": "effettotre.webp",
    "__IMG_CONVENTION__": "eventi/convention-18set2026.webp",
    "__IMG_PROGRAMMA__": "eventi/programma-18set2026.webp",
    "__IMG_MONOGRAFIA__": "monografia-cover.webp",
    "__IMG_POLARIS__": "partner/polaris.webp",
    "__IMG_ATHENA__": "partner/athena.webp",
    "__IMG_SWA_MED__": "swa-medicina.webp",
    "__IMG_SWA_IGIENE__": "swa-igiene.webp",
    "__IMG_SWA_ODO__": "swa-odontoiatria.webp",
    "__IMG_SWA_INF__": "swa-infermieristica.webp",
}

# sfondi generati con Higgsfield + video: finiscono nel CSS e nel markup
AI_ASSETS = {
    "__BG_GIURIS__": "ai/bg-giuris.webp",
    "__BG_ECONOMIA__": "ai/bg-economia.webp",
    "__BG_PSICO__": "ai/bg-psico.webp",
    "__BG_EDUCAZIONE__": "ai/bg-educazione.webp",
    "__BG_INFORMATICA__": "ai/bg-informatica.webp",
    "__BG_MOTORIE__": "ai/bg-motorie.webp",
    "__BG_MASTER__": "ai/bg-master.webp",
    "__BG_CERTIF__": "ai/bg-certif.webp",
    "__BG_SINGOLI__": "ai/bg-singoli.webp",
    "__BG_ONLINE__": "ai/bg-online.webp",
    "__BG_TUTOR__": "ai/bg-tutor.webp",
    "__BG_TERRITORIO__": "ai/bg-territorio.webp",
    "__GLOBE_POSTER__": "ai/globe.webp",
    "__GLOBE_VIDEO__": "ai/globe.mp4",
    "__HERO_POSTER__": "ai/hero-bg.webp",
    "__HERO_VIDEO__": "ai/hero-bg.mp4",
    "__PLAT_POSTER__": "ai/plat.webp",
    "__PLAT_VIDEO__": "ai/plat.mp4",
    "__PREMIO_POSTER__": "premio-poster.webp",
    "__PREMIO_VIDEO__": "premio-video.mp4",
}

HEAD = """<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="UNICESD Olympo - Universitas Centro Studi Olympo. Corsi di laurea, master universitari, certificazioni e alta formazione. Palermo.">
<link rel="canonical" href="__SITE__/">
<link rel="icon" href="assets/logo-navy.webp">
<meta property="og:type" content="website">
<meta property="og:site_name" content="UNICESD Olympo">
<meta property="og:title" content="UNICESD Olympo - Universitas Centro Studi Olympo">
<meta property="og:description" content="Corsi di laurea, master universitari, certificazioni e alta formazione. Palermo.">
<meta property="og:url" content="__SITE__/">
<meta property="og:image" content="__SITE__/assets/logo-master.png">
<meta property="og:locale" content="it_IT">
<meta name="twitter:card" content="summary_large_image">
""".replace("__SITE__", SITE_URL)


def main() -> None:
    content, body, script = (
        (HERE / n).read_text(encoding="utf-8")
        for n in ("content.html", "body.html", "script.html")
    )

    for token, rel in {**IMAGES, **AI_ASSETS}.items():
        p = ASSETS / rel
        if not p.exists():
            raise SystemExit(f"Asset mancante: {p}")
        url = "assets/" + rel
        content = content.replace(token, url)
        body = body.replace(token, url)
        script = script.replace(token, url)

    html = HEAD + content + "</head>\n<body>\n" + body + script + "\n</body></html>\n"

    rimasti = sorted(set(re.findall(r"__[A-Z0-9_]+__", html)))
    if rimasti:
        raise SystemExit("Token non sostituiti: " + ", ".join(rimasti))

    OUT.write_text(html, encoding="utf-8")
    print(f"Fatto: {OUT}  ({OUT.stat().st_size/1024:.0f} KB)")


if __name__ == "__main__":
    main()
