#!/usr/bin/env python3
"""
Ricompone i sorgenti in un unico file HTML autonomo, incorporando le immagini
come data URI (cosi' il sito resta un file solo, senza cartelle da portarsi dietro).

Uso:  python3 build.py
"""
import base64
import pathlib

HERE = pathlib.Path(__file__).resolve().parent
OUT_FULL = HERE.parent / "unicesd-olympo.html"
OUT_ARTIFACT = HERE / "artifact.html"

IMAGES = {
    "__IMG_LOGO__": "img/logo-light.png",          # bianco, per preloader e footer (fondo scuro)
    "__IMG_LOGO_NAVY__": "img/logo-navy.webp",     # navy, per l'header del tema chiaro
    "__IMG_FOUNDER_NEW__": "img/founder-cers.webp",
    "__IMG_PRESS__": "img/press-cover.jpg",
    "__IMG_GRUPPO__": "img/gruppo-olympo.webp",
    "__IMG_PROTO__": "img/master-protocollo.jpg",
    "__IMG_PEGASO__": "img/pegaso-evento.jpg",
    "__IMG_JANUS__": "img/partner/janus.webp",
    "__IMG_JANUS_BROCHURE__": "img/janus/janus-brochure.webp",
    "__IMG_JANUS_ROADMAP__": "img/janus/janus-roadmap.webp",
    "__IMG_JANUS_PDAY__": "img/janus/janus-partnerday.webp",
    "__IMG_JANUS_P1__": "img/janus/janus-pg-nascita.webp",
    "__IMG_JANUS_P2__": "img/janus/janus-pg-modello.webp",
    "__IMG_JANUS_P3__": "img/janus/janus-pg-corsi.webp",
    "__IMG_JANUS_P4__": "img/janus/janus-pg-risultati.webp",
    "__IMG_JANUS_P5__": "img/janus/janus-pg-staff.webp",
    "__IMG_ASDP__": "img/partner/pegaso-athletic.webp",
    "__IMG_UPM__": "img/partner/mauriziana.webp",
    "__IMG_YHANK__": "img/partner/yhank.webp",
    "__IMG_EUROFORM__": "img/partner/euroform.webp",
    "__IMG_LUXIUM__": "img/partner/luxium.webp",
    "__IMG_ISET__": "img/partner/iset.webp",
    "__IMG_GIURECOFORM__": "img/partner/giurecoform.webp",
    "__IMG_ISET_PROD__": "img/iset-produzione.webp",
    "__IMG_ISET_CTRL__": "img/iset-controllo.webp",
    "__IMG_CEFALU_RENDER__": "img/cefalu-render.webp",
    "__IMG_CEFALU_AEREA__": "img/cefalu-aerea.webp",
    "__IMG_VILLA__": "img/villa-ricettivo.webp",
    "__IMG_MADONIE__": "img/madonie-terreni.webp",
    "__IMG_KALOS_MAG__": "img/kalos-magazzino.webp",
    "__IMG_KALOS_ETI__": "img/kalos-etichetta.webp",
    "__IMG_TEATRO__": "img/teatro-massimo.webp",
    "__IMG_LISBOA__": "img/lisboa-sede.webp",
    "__IMG_ECP__": "img/ecp-sedi.webp",
    "__IMG_KALOS__": "img/partner/biokalos.webp",
    "__IMG_HASHTAG__": "img/partner/hashtag.webp",
    "__IMG_UNISCUOLE__": "img/partner/uniscuole.webp",
    "__IMG_SIULP__": "img/partner/siulp.webp",
    "__IMG_EREMITA__": "img/partner/eremita.webp",
    "__IMG_ECCELLENZE__": "img/eccellenze.webp",
    "__IMG_PREMIAZIONE__": "img/premiazione.webp",
    "__IMG_SIULP_LOC__": "img/siulp-locandina.webp",
    "__IMG_FNC__": "img/fnc-cover.webp",
    "__IMG_EREMITA_COVER__": "img/eremita-cover.webp",
    "__IMG_LIBROSEDI__": "img/libro-sedi.webp",
    "__IMG_EFFETTOTRE__": "img/effettotre.webp",
    "__IMG_CONVENTION__": "img/eventi/convention-18set2026.webp",
    "__IMG_PROGRAMMA__": "img/eventi/programma-18set2026.webp",
    "__IMG_MONOGRAFIA__": "img/monografia-cover.webp",
    "__IMG_POLARIS__": "img/partner/polaris.webp",
    "__IMG_ATHENA__": "img/partner/athena.webp",
    "__IMG_SWA_MED__": "img/swa-medicina.webp",
    "__IMG_SWA_IGIENE__": "img/swa-igiene.webp",
    "__IMG_SWA_ODO__": "img/swa-odontoiatria.webp",
    "__IMG_SWA_INF__": "img/swa-infermieristica.webp",
    # galleria "I came back" - Convention del 18 settembre 2026
    "__ICB_01__": "img/eventi/icb/icb-01.webp",
    "__ICB_02__": "img/eventi/icb/icb-02.webp",
    "__ICB_03__": "img/eventi/icb/icb-03.webp",
    "__ICB_04__": "img/eventi/icb/icb-04.webp",
    "__ICB_05__": "img/eventi/icb/icb-05.webp",
    "__ICB_06__": "img/eventi/icb/icb-06.webp",
    "__ICB_07__": "img/eventi/icb/icb-07.webp",
    "__ICB_08__": "img/eventi/icb/icb-08.webp",
    "__ICB_09__": "img/eventi/icb/icb-09.webp",
    "__ICB_10__": "img/eventi/icb/icb-10.webp",
    "__ICB_11__": "img/eventi/icb/icb-11.webp",
    "__ICB_12__": "img/eventi/icb/icb-12.webp",
    "__ICB_13__": "img/eventi/icb/icb-13.webp",
    "__ICB_14__": "img/eventi/icb/icb-14.webp",
    "__ICB_15__": "img/eventi/icb/icb-15.webp",
    "__ICB_16__": "img/eventi/icb/icb-16.webp",
    "__ICB_17__": "img/eventi/icb/icb-17.webp",
    "__ICB_18__": "img/eventi/icb/icb-18.webp",
    "__ICB_19__": "img/eventi/icb/icb-19.webp",
    "__ICB_20__": "img/eventi/icb/icb-20.webp",
    "__ICB_21__": "img/eventi/icb/icb-21.webp",
    "__ICB_22__": "img/eventi/icb/icb-22.webp",
    "__ICB_23__": "img/eventi/icb/icb-23.webp",
    "__ICB_24__": "img/eventi/icb/icb-24.webp",
}

# Sfondi generati con Higgsfield + globo animato: finiscono nel CSS e nel markup.
AI_ASSETS = {
    "__BG_GIURIS__": "img/ai/bg-giuris.webp",
    "__BG_ECONOMIA__": "img/ai/bg-economia.webp",
    "__BG_PSICO__": "img/ai/bg-psico.webp",
    "__BG_EDUCAZIONE__": "img/ai/bg-educazione.webp",
    "__BG_INFORMATICA__": "img/ai/bg-informatica.webp",
    "__BG_MOTORIE__": "img/ai/bg-motorie.webp",
    "__BG_MASTER__": "img/ai/bg-master.webp",
    "__BG_CERTIF__": "img/ai/bg-certif.webp",
    "__BG_SINGOLI__": "img/ai/bg-singoli.webp",
    "__BG_ONLINE__": "img/ai/bg-online.webp",
    "__BG_TUTOR__": "img/ai/bg-tutor.webp",
    "__BG_TERRITORIO__": "img/ai/bg-territorio.webp",
    "__GLOBE_POSTER__": "img/ai/globe.webp",
    "__GLOBE_VIDEO__": "img/ai/globe.mp4",
    "__HERO_POSTER__": "img/ai/hero-bg.webp",   # fotogramma fermo del video di sfondo della hero
    "__HERO_VIDEO__": "img/ai/hero-bg.mp4",     # b-roll studenti in biblioteca, loop di 4s
    "__PLAT_POSTER__": "img/ai/plat.webp",      # fotogramma fermo del video nello schermo del laptop
    "__PREMIO_POSTER__": "img/premio-poster.webp",   # fotogramma della premiazione
    "__PREMIO_VIDEO__": "img/premio-video.mp4",      # ripresa integrale 2:47 della premiazione
    "__PLAT_VIDEO__": "img/ai/plat.mp4",        # b-roll studentessa al laptop, loop di 4s
}

HEAD = """<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="UNICESD Olympo - Universitas Centro Studi Olympo. Corsi di laurea, master universitari, certificazioni e alta formazione. Palermo.">
"""


MIMES = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
         ".webp": "image/webp", ".mp4": "video/mp4"}


def data_uri(path: pathlib.Path) -> str:
    mime = MIMES.get(path.suffix.lower(), "application/octet-stream")
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode("ascii")


def main() -> None:
    parts = [(HERE / n).read_text(encoding="utf-8") for n in ("content.html", "body.html", "script.html")]
    content, body, script = parts

    for token, rel in IMAGES.items():
        p = HERE / rel
        if not p.exists():
            raise SystemExit(f"Immagine mancante: {p}")
        body = body.replace(token, data_uri(p))

    for token, rel in AI_ASSETS.items():
        p = HERE / rel
        if not p.exists():
            raise SystemExit(f"Asset mancante: {p}")
        uri = data_uri(p)
        content = content.replace(token, uri)
        body = body.replace(token, uri)

    # versione per Artifact (senza doctype/head/body: li aggiunge la piattaforma)
    OUT_ARTIFACT.write_text(content + body + script, encoding="utf-8")

    # versione autonoma completa
    OUT_FULL.write_text(HEAD + content + "</head>\n<body>\n" + body + script + "\n</body></html>\n", encoding="utf-8")

    kb = OUT_FULL.stat().st_size / 1024
    print(f"Fatto: {OUT_FULL}  ({kb:.0f} KB)")


if __name__ == "__main__":
    main()
