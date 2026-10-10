# -*- coding: utf-8 -*-
"""
Guide informative (/guide/...) e pagine locali (/universita-online-<citta>/), 10 ottobre 2026.
Ogni guida risponde a UNA domanda che la gente fa a Google e rimanda alle pagine "commerciali"
(corsi, servizi): cosi' le guide prendono le ricerche informative senza rubare posizioni ai corsi.
Stesso formato dei blocchi di pagine_diploma_estero.py.
"""

GUIDE_HUB = dict(
    url="/guide/", name="Guide",
    title="Guide all'università online: CFU, esami, costi, lauree | UNICESD",
    desc="Le guide di UNICESD Olympo: valore legale della laurea online, esami, CFU, costi e detrazioni, master, AI Act e riconoscimento dei titoli esteri.",
    h1="Le guide di <span class=\"grad\">UNICESD Olympo</span>",
    eyebrow="Capire prima di scegliere",
    lead="Le risposte chiare alle domande che ci fanno ogni giorno prima dell'iscrizione: come funziona l'università online, quanto vale, quanto costa, come si studia lavorando.",
)

GUIDE = [
    dict(slug="laurea-online-valore-legale", name="La laurea online è valida?",
         title="La laurea online è valida? Il valore legale spiegato",
         desc="Una laurea conseguita in un'università telematica ha lo stesso valore legale di quella di un ateneo tradizionale: cosa dice la legge e come verificarlo.",
         h1="La laurea online è valida? <span class=\"grad\">Il valore legale spiegato</span>",
         lead="È la prima domanda di chi pensa a un'università telematica. La risposta breve è sì: ecco perché, cosa dice la legge e come verificare che il corso scelto sia riconosciuto.",
         blocks=[
             ("La risposta breve", [
                 "Sì. Le <b>università telematiche riconosciute dal Ministero dell'Università e della Ricerca (MUR)</b> rilasciano titoli con lo <b>stesso valore legale</b> di quelli delle università tradizionali: stessa classe di laurea, stessi crediti, stessa validità per concorsi pubblici, albi professionali, abilitazioni e prosecuzione degli studi.",
                 "Sul diploma di laurea non c'è scritto «online»: c'è il nome del corso, la classe di laurea (per esempio L-24 o LMG-01) e l'ateneo che lo rilascia.",
             ]),
             ("Che cosa dice la legge", [
                 "Le università telematiche sono state introdotte dalla legge finanziaria per il 2003 (legge 289/2002) e disciplinate dal decreto interministeriale del 17 aprile 2003. Da allora devono essere <b>accreditate dal Ministero</b>, rispettare gli stessi ordinamenti didattici degli altri atenei e sono sottoposte alle valutazioni dell'ANVUR, l'agenzia nazionale che valuta la qualità di università e corsi.",
                 "Gli esami di profitto e la prova finale si sostengono <b>in presenza</b>, nelle sedi d'esame indicate dall'ateneo: è una delle garanzie previste dalle regole sul riconoscimento.",
             ]),
             ("Come verificare che un corso sia riconosciuto", [
                 ("ol", ["Controlla che l'ateneo compaia nell'elenco delle università riconosciute pubblicato dal MUR.",
                         "Verifica che il corso abbia una <b>classe di laurea</b> ministeriale (L-, LM-, LMG-): è quella che determina il valore del titolo.",
                         "Cerca il corso nella banca dati pubblica dell'offerta formativa (Universitaly), dove sono elencati i corsi accreditati per l'anno accademico.",
                         "Diffida dei «titoli esteri a distanza» proposti senza riconoscimento in Italia o dei corsi che non indicano la classe."]),
             ]),
             ("E UNICESD Olympo che ruolo ha?", [
                 "UNICESD Olympo è un <b>Centro Studi</b>: orienta, iscrive, segue lo studente con un tutor e organizza le attività sul territorio. Il titolo è sempre rilasciato dall'ateneo con cui viene attivato il percorso. Per questo, in ogni scheda corso, trovi la classe di laurea e le regole dell'ordinamento.",
             ]),
         ],
         faq=[("Un datore di lavoro può non accettare una laurea online?", "Il valore legale è identico: nei concorsi pubblici e per gli albi professionali una laurea telematica riconosciuta vale come qualsiasi altra della stessa classe."),
              ("Con una laurea online posso fare l'esame di Stato?", "Sì, alle stesse condizioni previste per la classe di laurea: per esempio avvocato con Giurisprudenza LMG-01, psicologo con la magistrale LM-51."),
              ("Posso proseguire con una magistrale in un ateneo tradizionale?", "Sì, se rispetti i requisiti d'accesso di quel corso: il titolo telematico è un titolo universitario a tutti gli effetti.")],
         related=[("/corsi-di-laurea/", "Tutti i corsi di laurea online"), ("/guide/esami-universita-online/", "Come funzionano gli esami"), ("/faq/", "Domande frequenti")]),
    dict(slug="esami-universita-online", name="Come funzionano gli esami online",
         title="Esami all'università online: come e dove si fanno | UNICESD",
         desc="Come si sostengono gli esami in un'università telematica: prenotazione, sedi d'esame, prove scritte e orali, appelli durante l'anno e tesi di laurea.",
         h1="Esami all'università online: <span class=\"grad\">come funzionano</span>",
         lead="Le lezioni sono online, gli esami no: si sostengono in presenza, con appelli distribuiti durante tutto l'anno. Ecco come funziona, passo per passo.",
         blocks=[
             ("Lezioni online, esami in sede", [
                 "Nelle università telematiche riconosciute la didattica si segue sulla piattaforma (videolezioni, dispense, test di autovalutazione), mentre gli <b>esami di profitto si svolgono in presenza</b>, nelle sedi d'esame dell'ateneo o in quelle convenzionate. È una garanzia per il valore del titolo.",
                 "Per chi vive in Sicilia occidentale la sede di Palermo è il riferimento principale; al momento dell'iscrizione ti indichiamo la sede più vicina.",
             ]),
             ("Dalla prenotazione al voto", [
                 ("ol", ["<b>Completi le attività</b> richieste in piattaforma per l'insegnamento (lezioni, test, eventuali elaborati).",
                         "<b>Prenoti l'appello</b> dall'area studenti, nella sede e nella data che preferisci.",
                         "<b>Sostieni la prova</b>, scritta o orale secondo l'insegnamento, con un documento d'identità.",
                         "<b>Ricevi il voto</b> in trentesimi e lo accetti o lo rifiuti, secondo le regole dell'ateneo.",
                         "Il voto viene <b>registrato in carriera</b> e i CFU dell'esame si sommano al tuo percorso."]),
             ]),
             ("Ogni quanto ci sono gli appelli", [
                 "Uno dei vantaggi dell'università online è il <b>calendario flessibile</b>: gli appelli sono distribuiti durante tutto l'anno accademico, così puoi organizzare gli esami attorno al lavoro e alla famiglia. Il tutor ti aiuta a costruire un calendario realistico.",
             ]),
             ("La tesi e la discussione", [
                 "Alla fine del percorso si prepara la prova finale (tesi o elaborato) con un relatore e la si discute davanti a una commissione, in presenza. Il voto di laurea è espresso in centodecimi.",
             ]),
         ],
         faq=[("Gli esami si possono fare da casa?", "Di regola no: gli esami di profitto delle università telematiche si sostengono in presenza. Eventuali eccezioni dipendono da norme straordinarie e dalle regole dell'ateneo."),
              ("Posso scegliere la sede d'esame?", "Sì, tra quelle disponibili per il tuo corso. Ti indichiamo le più vicine."),
              ("Se rifiuto un voto, quando posso ripetere l'esame?", "Al primo appello utile previsto dall'ateneo: con il calendario distribuito nell'anno, di solito non si aspetta molto.")],
         related=[("/sedi/", "Sedi e sedi d'esame"), ("/servizi-studenti/", "Servizi agli studenti"), ("/guide/laurearsi-lavorando/", "Laurearsi lavorando")]),
    dict(slug="laurearsi-lavorando", name="Laurearsi lavorando",
         title="Laurearsi lavorando: guida per studenti lavoratori | UNICESD Olympo",
         desc="Come prendere la laurea lavorando: università online, permessi per gli esami, 150 ore, tempo parziale, riconoscimento dell'esperienza e organizzazione dello studio.",
         h1="Laurearsi lavorando: <span class=\"grad\">si può, ecco come</span>",
         lead="Più della metà dei nostri studenti lavora. Ecco gli strumenti, i diritti e il metodo che rendono possibile la laurea senza lasciare il lavoro.",
         blocks=[
             ("Perché l'università online è pensata per chi lavora", [
                 ("ul", ["<b>Lezioni sempre disponibili</b>: si studia la sera, nel weekend, in pausa pranzo, dal telefono.",
                         "<b>Appelli durante tutto l'anno</b>: gli esami si incastrano tra ferie e scadenze di lavoro.",
                         "<b>Nessun obbligo di frequenza in aula</b> per le lezioni.",
                         "<b>Un tutor</b> che ti ricorda le scadenze e ti aiuta a non perdere il ritmo."]),
             ]),
             ("I diritti dello studente lavoratore", [
                 "Lo Statuto dei lavoratori (legge 300/1970, articolo 10) riconosce ai lavoratori studenti <b>permessi retribuiti per sostenere gli esami</b> e il diritto a turni che agevolino la frequenza e la preparazione. Molti contratti collettivi prevedono inoltre i permessi per il diritto allo studio, le cosiddette <b>150 ore</b>. Le condizioni precise dipendono dal tuo contratto: vale la pena chiedere all'ufficio del personale.",
                 "Molti atenei prevedono anche l'iscrizione come <b>studente a tempo parziale</b>, con un carico annuale ridotto; il modulo è nella nostra <a href=\"/iscrizione/#modulistica\">modulistica</a>.",
             ]),
             ("L'esperienza vale crediti", [
                 "Esperienze professionali, corsi aziendali, certificazioni e carriere universitarie interrotte possono essere riconosciute come CFU, nei limiti previsti dalla legge e dall'ateneo. Ogni credito riconosciuto è un esame in meno: per questo, prima di iscriverti, chiedi la <a href=\"/riconoscimento-cfu/\">valutazione gratuita della carriera</a>.",
             ]),
             ("Un metodo che funziona", [
                 ("ol", ["Scegli un corso coerente con il lavoro che fai o che vuoi fare: la motivazione regge meglio.",
                         "Fissa un numero realistico di esami per semestre (due o tre per chi lavora a tempo pieno).",
                         "Blocca in agenda le ore di studio come fossero appuntamenti.",
                         "Alterna un esame «pesante» a uno più leggero.",
                         "Usa il tutor: è lì per aiutarti quando rallenti."]),
             ]),
         ],
         faq=[("Quante ore a settimana servono?", "Dipende dal corso e dai crediti riconosciuti: chi lavora a tempo pieno di solito dedica tra le 8 e le 15 ore a settimana, distribuite nei giorni liberi e nelle sere."),
              ("Il datore di lavoro deve darmi i permessi per gli esami?", "Lo Statuto dei lavoratori prevede permessi retribuiti per i giorni d'esame; altri permessi dipendono dal contratto collettivo."),
              ("Quanto tempo ci vuole per laurearsi lavorando?", "Con un buon riconoscimento dei crediti e un ritmo costante, molti studenti lavoratori si laureano nei tempi previsti o poco oltre.")],
         related=[("/riconoscimento-cfu/", "Riconoscimento CFU gratuito"), ("/lauree-triennali-online/", "Lauree triennali online"), ("/guide/costi-universita-online/", "Costi e detrazioni")]),
    dict(slug="cosa-sono-i-cfu", name="Cosa sono i CFU",
         title="Cosa sono i CFU e come si calcolano | Guida UNICESD Olympo",
         desc="CFU, crediti formativi universitari: quante ore valgono, quanti ne servono per triennale, magistrale e master, come si riconoscono e come si recuperano.",
         h1="Cosa sono i CFU: <span class=\"grad\">i crediti universitari spiegati</span>",
         lead="I CFU sono la «moneta» dell'università: misurano il lavoro dello studente e decidono quando ti laurei. Ecco come funzionano.",
         blocks=[
             ("La definizione", [
                 "Il <b>Credito Formativo Universitario (CFU)</b> misura l'impegno richiesto allo studente. Secondo il decreto ministeriale 270/2004, <b>1 CFU corrisponde a 25 ore di lavoro complessivo</b>: lezioni, studio individuale, esercitazioni, tirocini. Un anno di studio a tempo pieno vale convenzionalmente <b>60 CFU</b>.",
                 "I CFU sono compatibili con il sistema europeo ECTS: questo facilita il riconoscimento degli studi tra Paesi diversi.",
             ]),
             ("Quanti CFU servono", [
                 ("table", ["Titolo", "Durata", "CFU"], [
                     ["Laurea triennale", "3 anni", "180"],
                     ["Laurea magistrale", "2 anni", "120"],
                     ["Magistrale a ciclo unico (es. Giurisprudenza)", "5 anni", "300"],
                     ["Master universitario di I o II livello", "almeno 1 anno", "almeno 60 (1.500 ore)"],
                     ["Corso di alta formazione", "variabile", "es. 30"],
                 ]),
             ]),
             ("CFU e voti non sono la stessa cosa", [
                 "I crediti si acquisiscono superando l'esame, qualunque sia il voto. Il voto (in trentesimi) misura invece la qualità della preparazione e conta per la media e per il voto di laurea.",
             ]),
             ("Riconoscere e recuperare crediti", [
                 ("ul", ["<b>Riconoscimento</b>: esami di carriere precedenti, anche non concluse, e in parte esperienze e titoli professionali possono essere convalidati. Chiedi la <a href=\"/riconoscimento-cfu/\">valutazione gratuita</a>.",
                         "<b>Corsi singoli</b>: se ti mancano crediti per una magistrale o una classe di concorso, puoi sostenere solo quegli esami. Vedi i <a href=\"/corsi-singoli-cfu/\">corsi singoli</a>.",
                         "<b>Certificazioni</b>: alcune certificazioni linguistiche e informatiche possono valere crediti, secondo le regole dell'ateneo."]),
             ]),
         ],
         faq=[("Quanti CFU vale un esame?", "Di solito tra 6 e 12, a seconda dell'insegnamento: lo trovi nel piano di studi."),
              ("Si possono perdere i CFU?", "I crediti acquisiti restano, ma in caso di carriere molto vecchie l'ateneo può verificarne l'attualità prima di riconoscerli."),
              ("I CFU dei master valgono per la laurea?", "In alcuni casi si possono riconoscere: dipende dai contenuti e dalle regole dell'ateneo.")],
         related=[("/riconoscimento-cfu/", "Riconoscimento CFU gratuito"), ("/corsi-singoli-cfu/", "Corsi singoli per i CFU"), ("/guide/laurea-triennale-magistrale-differenze/", "Triennale e magistrale")]),
    dict(slug="laurea-triennale-magistrale-differenze", name="Triennale, magistrale e ciclo unico",
         title="Laurea triennale, magistrale e ciclo unico: differenze",
         desc="Le differenze tra laurea triennale, magistrale e magistrale a ciclo unico: durata, CFU, requisiti d'accesso, albi professionali e insegnamento.",
         h1="Triennale, magistrale o ciclo unico? <span class=\"grad\">Le differenze</span>",
         lead="Il sistema universitario italiano ha due livelli più un'eccezione. Capire come sono collegati aiuta a scegliere il percorso giusto fin dall'inizio.",
         blocks=[
             ("Il sistema «3+2»", [
                 "Dalla riforma del 1999 (poi DM 270/2004) l'università italiana è organizzata in due cicli: la <b>laurea triennale</b> (primo livello, 180 CFU) e la <b>laurea magistrale</b> (secondo livello, 120 CFU). Per alcune professioni esiste un percorso unico, la <b>magistrale a ciclo unico</b> di cinque o sei anni.",
             ]),
             ("A confronto", [
                 ("table", ["", "Triennale", "Magistrale", "Ciclo unico"], [
                     ["Durata", "3 anni", "2 anni", "5–6 anni"],
                     ["Crediti", "180 CFU", "120 CFU", "300–360 CFU"],
                     ["Per iscriversi", "Diploma", "Laurea triennale + requisiti curricolari", "Diploma"],
                     ["Classe", "L-…", "LM-…", "LMG-01, LM-41…"],
                     ["Esempi", "<a href=\"/corsi-di-laurea/scienze-psicologiche/\">Scienze psicologiche L-24</a>", "<a href=\"/corsi-di-laurea/magistrale-psicologia/\">Psicologia LM-51</a>", "<a href=\"/corsi-di-laurea/giurisprudenza/\">Giurisprudenza LMG-01</a>"],
                 ]),
             ]),
             ("Quando basta la triennale", [
                 "La triennale è sufficiente per molti concorsi pubblici, per le sezioni B degli albi (per esempio ingegnere iunior), per diversi lavori in azienda e per accedere ai master di I livello.",
             ]),
             ("Quando serve la magistrale", [
                 ("ul", ["Per le professioni che la richiedono: psicologo, ingegnere sezione A, commercialista, pedagogista", "Per l'<b>insegnamento</b> nella scuola secondaria (insieme ai crediti della classe di concorso e al percorso abilitante)", "Per i master di II livello e il dottorato di ricerca", "Per i concorsi pubblici della carriera direttiva"]),
             ]),
             ("I requisiti curricolari", [
                 "Per entrare in una magistrale non basta una triennale qualsiasi: servono un certo numero di crediti in settori specifici. Se ne mancano, si integrano con i <a href=\"/corsi-singoli-cfu/\">corsi singoli</a>. Prima di iscriverti, facciamo noi la verifica sul tuo certificato.",
             ]),
         ],
         faq=[("Posso fare la magistrale in un'area diversa dalla triennale?", "Sì, se hai o recuperi i requisiti curricolari richiesti."),
              ("Giurisprudenza ha una triennale?", "La professione forense richiede la magistrale a ciclo unico LMG-01; la triennale giuridica è <a href=\"/corsi-di-laurea/servizi-giuridici/\">Servizi giuridici L-14</a>."),
              ("Che cos'è la «laurea vecchio ordinamento»?", "È la laurea quadriennale o quinquennale precedente alla riforma: oggi è equiparata alle lauree magistrali secondo le tabelle ministeriali.")],
         related=[("/lauree-triennali-online/", "Lauree triennali online"), ("/lauree-magistrali-online/", "Lauree magistrali online"), ("/guide/cosa-sono-i-cfu/", "Cosa sono i CFU")]),
    dict(slug="master-primo-secondo-livello", name="Master di I e II livello",
         title="Master di I e II livello: differenze e a cosa servono | UNICESD",
         desc="Master universitario di primo e secondo livello: requisiti, durata, 60 CFU, differenza con master privati e corsi di perfezionamento, utilità per lavoro e graduatorie.",
         h1="Master di I e II livello: <span class=\"grad\">differenze e utilità</span>",
         lead="Non tutti i «master» sono uguali. Ecco che cosa distingue un master universitario di primo livello da uno di secondo, e da un master privato.",
         blocks=[
             ("Che cos'è un master universitario", [
                 "Il master universitario è un corso di specializzazione post laurea rilasciato da un'università, con almeno <b>60 CFU</b> e <b>1.500 ore</b> di impegno, di norma in un anno. È disciplinato dal DM 270/2004 e si distingue in base al titolo richiesto per l'accesso.",
             ]),
             ("Primo e secondo livello", [
                 ("table", ["", "Master di I livello", "Master di II livello"], [
                     ["Per iscriversi", "Laurea triennale (o superiore)", "Laurea magistrale o vecchio ordinamento"],
                     ["Crediti", "Almeno 60 CFU", "Almeno 60 CFU"],
                     ["Durata tipica", "1 anno", "1 anno"],
                     ["Esempio", "<a href=\"/master-universitari/management-sanitario/\">Management sanitario</a>", "<a href=\"/master-universitari/diritto-impresa-internazionale/\">Diritto dell'impresa internazionale</a>"],
                 ]),
                 "Il livello non indica che uno sia «più difficile» dell'altro: indica il titolo d'ingresso e quindi il livello di partenza dei partecipanti.",
             ]),
             ("Master universitario, master privato, corso di perfezionamento", [
                 ("ul", ["Il <b>master universitario</b> rilascia crediti universitari ed è un titolo accademico.", "Un «master» di una scuola privata non universitaria può essere ottimo, ma non è un titolo universitario e non rilascia CFU.", "I <b>corsi di perfezionamento</b> e di <b>alta formazione</b> sono percorsi universitari più brevi, con meno crediti (come il nostro <a href=\"/master-universitari/data-analytics-business/\">Data Analytics, 30 CFU</a>)."]),
             ]),
             ("A che cosa serve un master", [
                 ("ul", ["Specializzarsi in un settore e cambiare ruolo in azienda", "Ottenere punteggio nelle <a href=\"/certificazioni/graduatorie-scuola/\">graduatorie della scuola</a> e in alcuni concorsi, secondo le tabelle dei titoli", "Costruire competenze manageriali, come nel <a href=\"/master-made-in-italy-global-leadership/\">Master Made in Italy Global Leadership</a>"]),
             ]),
         ],
         faq=[("Il master abilita a una professione?", "No, il master non è abilitante: specializza. Le abilitazioni dipendono da lauree ed esami di Stato."),
              ("Posso iscrivermi a un master mentre sono laureando?", "Alcuni atenei lo permettono con iscrizione condizionata: va verificato bando per bando."),
              ("Il master online vale come quello in presenza?", "Sì, se rilasciato da un ateneo riconosciuto: il valore dipende dall'università, non dalla modalità.")],
         related=[("/master-universitari/", "Tutti i master universitari"), ("/guide/cosa-sono-i-cfu/", "Cosa sono i CFU"), ("/certificazioni/graduatorie-scuola/", "Punteggio nelle graduatorie")]),
    dict(slug="costi-universita-online", name="Costi e detrazioni",
         title="Quanto costa l'università online? Rette e detrazione 19%",
         desc="Da che cosa dipende il costo di una laurea online, come si paga a rate, convenzioni e come portare in detrazione il 19% delle spese universitarie.",
         h1="Quanto costa l'università online? <span class=\"grad\">Rette, rate e detrazioni</span>",
         lead="Il costo di una laurea online non è un numero unico: dipende da corso, crediti riconosciuti e convenzioni. Ecco da che cosa dipende e come alleggerirlo.",
         blocks=[
             ("Da che cosa dipende il costo", [
                 ("ul", ["<b>Il corso e l'ateneo</b>: ogni università fissa le proprie rette annuali.", "<b>I crediti riconosciuti</b>: più esami ti vengono convalidati, meno anni paghi.", "<b>Convenzioni</b> con enti, aziende, forze dell'ordine e categorie professionali.", "<b>La formula di iscrizione</b>: tempo pieno o tempo parziale, corsi singoli, master."]),
                 "Per questo non pubblichiamo un listino unico: durante il colloquio di orientamento ti diamo un <b>preventivo personalizzato e scritto</b>.",
             ]),
             ("Pagare a rate", [
                 "Sono previsti piani di <b>rateizzazione personalizzati</b>: la richiesta si fa con il modulo che trovi nella <a href=\"/iscrizione/#modulistica\">modulistica</a>. Modalità e scadenze sono riportate nel <a href=\"/iscrizione/#contratto-studente\">contratto con lo studente</a>.",
             ]),
             ("La detrazione del 19%", [
                 "Le spese per la frequenza di corsi universitari, compresi quelli delle università telematiche e i master universitari, sono <b>detraibili al 19% nella dichiarazione dei redditi</b> (articolo 15 del TUIR). Per le università non statali la spesa detraibile non può superare gli importi massimi stabiliti ogni anno da un decreto del Ministero dell'Università, che variano per area disciplinare e zona geografica.",
                 "La detrazione spetta anche per le spese sostenute per un familiare fiscalmente a carico. Conserva ricevute e bonifici tracciabili e chiedi conferma al tuo CAF o commercialista.",
             ]),
             ("Le voci da considerare", [
                 ("ul", ["Retta annuale dell'ateneo", "Eventuali tasse regionali e marca da bollo", "Costi della prova finale", "Spostamenti verso la sede d'esame (minimi se la sede è vicina)"]),
             ]),
         ],
         faq=[("Il colloquio di orientamento è a pagamento?", "No, è gratuito e senza impegno, come la valutazione dei crediti."),
              ("Posso detrarre anche il master?", "Sì, i master universitari rientrano tra le spese di istruzione universitaria detraibili, nei limiti previsti."),
              ("L'azienda può pagarmi il corso?", "Sì, e in alcuni casi la formazione è finanziabile con fondi interprofessionali o con il <a href=\"/fondo-nuove-competenze-2026/\">Fondo Nuove Competenze</a>.")],
         related=[("/contatti/", "Chiedi un preventivo gratuito"), ("/riconoscimento-cfu/", "Riconoscimento CFU"), ("/guide/laurearsi-lavorando/", "Laurearsi lavorando")]),
    dict(slug="ai-act-obbligo-formazione", name="AI Act: l'obbligo di formazione",
         title="AI Act art. 4: l'obbligo di formazione sull'IA in azienda",
         desc="Che cosa prevede l'articolo 4 dell'AI Act sull'alfabetizzazione in materia di intelligenza artificiale, chi riguarda, da quando si applica e come mettersi in regola.",
         h1="AI Act: l'obbligo di <span class=\"grad\">alfabetizzazione sull'IA</span>",
         lead="Se in azienda qualcuno usa ChatGPT, un assistente AI o un software con funzioni di intelligenza artificiale, il Regolamento europeo ti riguarda già. Ecco cosa prevede l'articolo 4.",
         blocks=[
             ("Che cos'è l'AI Act", [
                 "Il <b>Regolamento (UE) 2024/1689</b>, detto AI Act, è la legge europea sull'intelligenza artificiale. È entrato in vigore il 1° agosto 2024 e si applica per gradi: classifica i sistemi di IA in base al rischio, vieta alcune pratiche e impone obblighi a chi sviluppa i sistemi (provider) e a chi li usa in ambito professionale (deployer).",
             ]),
             ("L'articolo 4: AI literacy", [
                 "L'articolo 4 chiede a fornitori e utilizzatori di sistemi di IA di adottare misure per garantire, nella misura del possibile, un <b>livello sufficiente di alfabetizzazione in materia di IA</b> del proprio personale e di chi usa i sistemi per loro conto, tenendo conto delle conoscenze tecniche, dell'esperienza e del contesto d'uso.",
                 "In pratica: chi in azienda usa strumenti di IA deve sapere che cosa fanno, quali rischi comportano e quali regole interne seguire. L'obbligo si applica dal <b>2 febbraio 2025</b>, insieme ai divieti delle pratiche inaccettabili.",
             ]),
             ("Le scadenze principali", [
                 ("table", ["Data", "Che cosa si applica"], [
                     ["1 agosto 2024", "Entrata in vigore del Regolamento"],
                     ["2 febbraio 2025", "Pratiche vietate e obbligo di alfabetizzazione (art. 4)"],
                     ["2 agosto 2025", "Regole sui modelli di IA per finalità generali e sulla governance"],
                     ["2 agosto 2026", "Gran parte degli altri obblighi, compresi molti sistemi ad alto rischio"],
                     ["2 agosto 2027", "Sistemi ad alto rischio integrati in prodotti regolamentati"],
                 ]),
                 "<small>Il calendario può essere modificato da successivi interventi del legislatore europeo: verifica sempre lo stato aggiornato.</small>",
             ]),
             ("Come mettersi in regola", [
                 ("ol", ["<b>Mappa</b> gli strumenti di IA usati in azienda, anche quelli «informali».", "<b>Classifica</b> gli usi in base al rischio e individua i ruoli (provider o deployer).", "<b>Forma</b> il personale con un percorso documentato, adeguato al ruolo.", "<b>Scrivi le regole interne</b>: cosa si può fare, con quali dati, con quale controllo umano.", "<b>Aggiorna</b> formazione e procedure quando cambiano strumenti e norme."]),
                 "Per il primo livello c'è il corso <b>AI Act Literacy</b> (10 lezioni); per i consulenti la <b>Masterclass AI Act</b>. Li trovi nella pagina <a href=\"/intelligenza-artificiale-ai-act/\">Formazione su intelligenza artificiale e AI Act</a>.",
             ]),
         ],
         faq=[("L'obbligo vale anche per le piccole imprese?", "Sì, l'articolo 4 riguarda tutti i fornitori e gli utilizzatori professionali di sistemi di IA, senza esclusioni per dimensione; la misura della formazione va però proporzionata al contesto."),
              ("Basta un corso online?", "Un corso è il cuore dell'adempimento, purché documentato e adeguato ai ruoli; va affiancato da regole interne sull'uso degli strumenti."),
              ("Che cosa rischia chi non si adegua?", "Il Regolamento prevede sanzioni per le diverse violazioni, definite anche dalle norme nazionali; inoltre la mancata formazione pesa in caso di danni causati da un uso scorretto dell'IA.")],
         related=[("/intelligenza-artificiale-ai-act/", "Corsi AI Act e intelligenza artificiale"), ("/formazione-aziendale/", "Formazione aziendale"), ("/fondo-nuove-competenze-2026/", "Fondo Nuove Competenze 2026")]),
    dict(slug="come-scegliere-corso-di-laurea", name="Come scegliere il corso di laurea",
         title="Come scegliere il corso di laurea: guida in 6 passi | UNICESD",
         desc="Come scegliere il corso di laurea: interessi, sbocchi professionali, albi, insegnamento, tempo disponibile, crediti riconoscibili. Una guida pratica in 6 passi.",
         h1="Come scegliere il corso di laurea <span class=\"grad\">giusto per te</span>",
         lead="Ventisei corsi di laurea e settantanove indirizzi sono tanti. Ecco il metodo che usiamo nei colloqui di orientamento per arrivare alla scelta giusta.",
         blocks=[
             ("1. Parti dal lavoro che vuoi fare", [
                 "Prima di guardare il nome del corso, chiediti quale lavoro vuoi fare tra cinque anni. Alcune professioni richiedono una laurea precisa: avvocato (<a href=\"/corsi-di-laurea/giurisprudenza/\">Giurisprudenza</a>), psicologo (<a href=\"/corsi-di-laurea/magistrale-psicologia/\">Psicologia LM-51</a>), ingegnere, pedagogista. Altre accettano lauree diverse.",
             ]),
             ("2. Controlla se serve la magistrale", [
                 "Se la professione richiede il secondo livello, scegli una triennale che ti dia i requisiti curricolari per quella magistrale: eviti di dover recuperare crediti dopo. Ne parliamo nella guida <a href=\"/guide/laurea-triennale-magistrale-differenze/\">triennale, magistrale e ciclo unico</a>.",
             ]),
             ("3. Se vuoi insegnare, pensa alla classe di concorso", [
                 "Per insegnare nella scuola secondaria contano la laurea magistrale e i crediti richiesti dalla classe di concorso, oltre al percorso abilitante. Conviene scegliere esami e indirizzi tenendone conto fin dall'inizio.",
             ]),
             ("4. Valuta quello che hai già", [
                 "Esami di vecchie carriere, titoli professionali ed esperienza possono accorciare il percorso. A parità di interesse, un corso in cui ti riconoscono più crediti può farti risparmiare anni. Chiedi la <a href=\"/riconoscimento-cfu/\">valutazione gratuita</a>.",
             ]),
             ("5. Sii realistico sul tempo", [
                 "Quante ore a settimana puoi dedicare allo studio? Lavoro, famiglia e turni contano. L'università online aiuta, ma il piano deve essere sostenibile: leggi <a href=\"/guide/laurearsi-lavorando/\">laurearsi lavorando</a>.",
             ]),
             ("6. Scegli l'indirizzo", [
                 "Dentro lo stesso corso, l'indirizzo cambia gli esami e quindi le competenze: per esempio <a href=\"/corsi-di-laurea/servizi-giuridici/\">Servizi giuridici</a> ha cinque indirizzi molto diversi, dalla criminologia alla consulenza del lavoro.",
             ]),
         ],
         faq=[("E se sbaglio corso?", "Si può cambiare: con il passaggio di corso gli esami compatibili vengono riconosciuti."),
              ("Meglio un corso facile o uno che mi interessa?", "Uno che ti interessa e ti serve: la motivazione è il fattore che più incide sulla probabilità di laurearsi."),
              ("Posso fare un colloquio prima di decidere?", "Sì, il colloquio di orientamento è gratuito e senza impegno: compila il modulo in fondo alla pagina.")],
         related=[("/corsi-di-laurea/", "Tutti i corsi di laurea"), ("/lauree-triennali-online/", "Lauree triennali"), ("/lauree-magistrali-online/", "Lauree magistrali")]),
    dict(slug="riconoscimento-laurea-medicina-estero", name="Riconoscimento del titolo estero",
         title="Laurea in Medicina all'estero: riconoscimento in Italia | UNICESD",
         desc="Come si riconosce in Italia una laurea in medicina, odontoiatria, infermieristica o fisioterapia presa all'estero: Paesi UE ed extra UE, documenti e passaggi.",
         h1="Laurea sanitaria all'estero: <span class=\"grad\">il riconoscimento in Italia</span>",
         lead="Studiare medicina in Spagna o in Romania ha senso solo se poi puoi lavorare in Italia. Ecco come funziona il riconoscimento del titolo, professione per professione.",
         blocks=[
             ("Il principio: la direttiva europea", [
                 "Il riconoscimento delle qualifiche professionali tra Paesi dell'Unione europea è regolato dalla <b>direttiva 2005/36/CE</b>, recepita in Italia con il decreto legislativo 206/2007. Per alcune professioni sanitarie, dette «settoriali», la formazione minima è armonizzata in tutta Europa e il riconoscimento è <b>automatico</b>.",
             ]),
             ("Professione per professione", [
                 ("table", ["Professione", "Titolo da Paese UE", "Note"], [
                     ["Medico", "Riconoscimento automatico", "Poi iscrizione all'Ordine dei Medici"],
                     ["Odontoiatra", "Riconoscimento automatico", "Poi iscrizione all'albo degli odontoiatri"],
                     ["Infermiere", "Riconoscimento automatico", "Poi iscrizione all'OPI"],
                     ["Fisioterapista", "Sistema generale", "Il Ministero valuta il percorso e può chiedere misure compensative"],
                     ["Igienista dentale", "Sistema generale", "Valutazione del titolo da parte del Ministero della Salute"],
                 ]),
                 "Per i titoli rilasciati in Paesi extra UE (come la Macedonia del Nord o la Svizzera, che ha accordi propri con l'UE) la procedura è diversa e va valutata caso per caso.",
             ]),
             ("I passaggi", [
                 ("ol", ["Ottieni dall'ateneo il diploma e il certificato con esami e tirocini.", "Fai apporre l'apostille (dove richiesta) e traduci i documenti.", "Presenta la domanda di riconoscimento al <b>Ministero della Salute</b>.", "Con il decreto di riconoscimento, iscriviti all'ordine o all'albo professionale.", "Se previsto, svolgi le misure compensative (tirocinio o prova attitudinale)."]),
             ]),
             ("Trasferirsi durante il corso", [
                 "Per medicina è possibile chiedere il trasferimento in un ateneo italiano dal secondo anno, partecipando ai bandi per i posti disponibili. Non è un diritto automatico: dipende dai posti e dai criteri di ciascuna università.",
             ]),
         ],
         faq=[("Quanto tempo ci vuole per il riconoscimento?", "Dipende dal Ministero e dalla completezza dei documenti: per i titoli a riconoscimento automatico di solito alcuni mesi."),
              ("Devo sostenere un esame in Italia?", "Per le professioni a riconoscimento automatico no; per quelle del sistema generale possono essere richieste misure compensative."),
              ("Chi mi aiuta con la pratica?", "Il nostro partner Study with Athena segue il riconoscimento senza costi aggiuntivi per chi ha fatto il percorso con noi.")],
         related=[("/medicina-senza-test-ingresso/", "Medicina e area sanitaria senza test"), ("/studiare-medicina-in-romania/", "Medicina in Romania"), ("/studiare-medicina-in-spagna/", "Medicina in Spagna")]),
    dict(slug="glossario-universita", name="Glossario dell'università",
         title="Glossario dell'università: CFU, SSD, classi di laurea",
         desc="Le parole dell'università spiegate semplici: CFU, classe di laurea, SSD, piano di studi, appello, propedeuticità, tirocinio, prova finale, fuori corso.",
         h1="Il glossario <span class=\"grad\">dell'università</span>",
         lead="Classe, SSD, propedeuticità, requisiti curricolari: l'università ha un suo linguaggio. Eccolo tradotto in parole semplici.",
         blocks=[
             ("Le parole del percorso", [
                 ("table", ["Termine", "Che cosa significa"], [
                     ["Ateneo", "L'università che eroga il corso e rilascia il titolo."],
                     ["Classe di laurea", "Il gruppo ministeriale a cui appartiene un corso (es. L-24, LM-51): ne determina il valore legale."],
                     ["CFU", "Credito formativo universitario: 25 ore di impegno. Vedi la guida <a href=\"/guide/cosa-sono-i-cfu/\">cosa sono i CFU</a>."],
                     ["SSD", "Settore scientifico-disciplinare: l'area a cui appartiene un insegnamento (per esempio il diritto privato o la psicologia generale)."],
                     ["Piano di studi", "L'elenco degli esami da sostenere, anno per anno, con i CFU."],
                     ["Indirizzo (curriculum)", "Una variante del corso con esami in parte diversi."],
                     ["Requisiti curricolari", "I crediti in settori specifici necessari per entrare in una magistrale."],
                 ]),
             ]),
             ("Le parole degli esami", [
                 ("table", ["Termine", "Che cosa significa"], [
                     ["Appello", "Una data in cui si può sostenere un esame."],
                     ["Propedeuticità", "L'obbligo di superare un esame prima di un altro."],
                     ["Verbalizzazione", "La registrazione ufficiale del voto in carriera."],
                     ["Prova finale", "La tesi o l'elaborato che si discute per laurearsi."],
                     ["Fuori corso", "Lo studente che ha superato la durata normale del corso senza laurearsi."],
                     ["Tempo parziale", "Iscrizione con un carico ridotto di crediti l'anno."],
                 ]),
             ]),
             ("Le parole dell'iscrizione", [
                 ("table", ["Termine", "Che cosa significa"], [
                     ["Immatricolazione", "La prima iscrizione all'università."],
                     ["Riconoscimento crediti", "La convalida di esami o attività già svolte. Vedi <a href=\"/riconoscimento-cfu/\">riconoscimento CFU</a>."],
                     ["Corso singolo", "L'iscrizione a uno o più esami senza iscriversi a un intero corso. Vedi <a href=\"/corsi-singoli-cfu/\">corsi singoli</a>."],
                     ["Abbreviazione di carriera", "L'iscrizione a un anno successivo al primo grazie ai crediti riconosciuti."],
                     ["Passaggio / trasferimento", "Il cambio di corso nello stesso ateneo / il cambio di ateneo."],
                 ]),
             ]),
         ],
         faq=[("Che differenza c'è tra iscrizione e immatricolazione?", "L'immatricolazione è la prima iscrizione all'università; le iscrizioni agli anni successivi si chiamano rinnovi."),
              ("Che cosa vuol dire «vecchio ordinamento»?", "Le lauree precedenti alla riforma del 1999, di quattro o più anni, oggi equiparate alle magistrali.")],
         related=[("/guide/", "Tutte le guide"), ("/faq/", "Domande frequenti"), ("/iscrizione/", "Iscrizione e modulistica")]),
]

# ---------------------------------------------------------------------------
# Pagine locali: solo dove la rete ha una presenza vera (niente pagine "fotocopia")
# ---------------------------------------------------------------------------
LOCALI = [
    dict(url="/universita-online-palermo/", name="Università online a Palermo", city="Palermo",
         title="Università online a Palermo: iscrizioni ed esami | UNICESD",
         desc="Università online a Palermo: iscrizione, tutor ed esami in città con UNICESD Olympo, in Via Trabia 1 e Largo Lituania 11. Orientamento gratuito entro 24 ore.",
         h1="Università online <span class=\"grad\">a Palermo</span>",
         eyebrow="Palermo · Sede legale e operativa",
         lead="Dal 2015 a Palermo, e dal 2008 con Helios e Icarus: UNICESD Olympo è il Centro Studi dove iscriverti a un corso di laurea online, a un master o a un diploma, con un tutor in città e gli esami vicino casa.",
         addr=[("Sede legale e direzionale", "Via Trabia 1, 90133 Palermo (PA)"), ("Sede operativa", "Largo Lituania 11 (ex Via Danimarca), 90141 Palermo (PA)")],
         geo=(38.1157, 13.3615),
         blocks=[
             ("Perché scegliere un Centro Studi a Palermo", [
                 "Studiare online non significa studiare da soli. A Palermo trovi persone vere a cui chiedere: un orientatore che ti aiuta a scegliere il corso, un tutor che ti segue negli esami e una segreteria che si occupa delle pratiche. La sede di Palermo è anche il <b>riferimento principale per gli esami della Sicilia occidentale</b>.",
             ]),
             ("Che cosa puoi fare in sede", [
                 ("ul", ["Colloquio di orientamento gratuito su <a href=\"/corsi-di-laurea/\">lauree</a>, <a href=\"/master-universitari/\">master</a> e <a href=\"/janus-diploma-online/\">diploma</a>", "Valutazione dei crediti già maturati, in genere entro 48 ore", "Iscrizione assistita e consegna dei documenti", "Supporto per piano di studi, prenotazione degli esami e tesi", "Informazioni su <a href=\"/medicina-senza-test-ingresso/\">medicina all'estero senza test</a>"]),
             ]),
             ("Chi si rivolge a noi", [
                 "Lavoratori di Palermo e provincia che vogliono la laurea senza lasciare il lavoro, dipendenti pubblici e appartenenti alle forze dell'ordine, insegnanti che cercano punteggio, giovani che vogliono recuperare gli anni scolastici, imprese che cercano formazione finanziata.",
             ]),
         ],
         faq=[("Dove si fanno gli esami se vivo a Palermo?", "Nelle sedi d'esame convenzionate; per la Sicilia occidentale il riferimento è Palermo. Ti indichiamo la sede al momento dell'iscrizione."),
              ("Posso venire in sede senza appuntamento?", "Ti consigliamo di chiamare prima: così ti dedichiamo il tempo che serve. Orari: lunedì–venerdì 9–18, sabato su appuntamento."),
              ("Servite anche la provincia?", "Sì, tutta la provincia, con il presidio di Cefalù per la costa tirrenica e le Madonie.")],
         related=[("/sedi/", "Tutte le sedi"), ("/contatti/", "Contatti"), ("/universita-online-cefalu/", "Università online a Cefalù")]),
    dict(url="/universita-online-cefalu/", name="Università online a Cefalù", city="Cefalù",
         title="Università online a Cefalù e Madonie | UNICESD Olympo",
         desc="Università online, master e diploma a Cefalù e nelle Madonie con il presidio territoriale UNICESD Olympo: orientamento, iscrizioni e tutor vicino casa.",
         h1="Università online <span class=\"grad\">a Cefalù e nelle Madonie</span>",
         eyebrow="Cefalù · Presidio territoriale",
         lead="Sulla costa tirrenica, il presidio UNICESD Olympo di Cefalù porta orientamento e assistenza a chi vive tra Cefalù, le Madonie e i comuni vicini, senza dover andare ogni volta a Palermo.",
         addr=[("Presidio territoriale", "Cefalù (PA) · su appuntamento"), ("Riferimento", "Sede di Palermo, Via Trabia 1")],
         geo=(38.0386, 14.0228),
         blocks=[
             ("Un legame con il territorio", [
                 "Cefalù è il territorio di Calogero Di Carlo, fondatore di UNICESD Olympo, e della rete sportiva che fa capo al gruppo, come l'A.S.D. Real Cefalù di calcio a cinque. Per questo la città ha un presidio dedicato: chi abita nei paesi delle Madonie spesso ha poche alternative per riprendere gli studi, e l'università online è la più concreta.",
             ]),
             ("Cosa puoi fare con noi", [
                 ("ul", ["Scegliere tra <a href=\"/lauree-triennali-online/\">lauree triennali</a>, <a href=\"/lauree-magistrali-online/\">magistrali</a> e <a href=\"/master-universitari/\">master</a> online", "Prendere il <a href=\"/janus-diploma-online/\">diploma online</a> o <a href=\"/recupero-anni-scolastici/\">recuperare anni scolastici</a>", "Chiedere la valutazione gratuita dei crediti", "Organizzare gli esami nelle sedi più comode"]),
             ]),
             ("Per chi lavora nel turismo", [
                 "Molti iscritti della zona lavorano nell'accoglienza e studiano nei mesi di bassa stagione: per loro sono pensati la <a href=\"/corsi-di-laurea/scienze-turismo/\">laurea in Scienze del turismo</a> e il <a href=\"/janus-diploma-online/tecnico-turismo/\">diploma tecnico per il turismo</a>.",
             ]),
         ],
         faq=[("Il presidio di Cefalù è aperto tutti i giorni?", "Si riceve su appuntamento: chiama il +39 350 965 1711 e fissiamo un incontro."),
              ("Dove faccio gli esami?", "Nelle sedi d'esame convenzionate; per la zona il riferimento è Palermo.")],
         related=[("/universita-online-palermo/", "Università online a Palermo"), ("/sedi/", "Tutte le sedi"), ("/contatti/", "Contatti")]),
    dict(url="/universita-online-licata/", name="Università online a Licata", city="Licata",
         title="Università online a Licata e Agrigento: Global Campus | UNICESD",
         desc="Global Campus Licata, polo 00001 della rete UNICESD Olympo in Corso Umberto 37: università online, diploma, certificazioni e orientamento in provincia di Agrigento.",
         h1="Università online <span class=\"grad\">a Licata</span>",
         eyebrow="Licata (AG) · Polo n° 00001",
         lead="In Corso Umberto 37 c'è Global Campus Licata, il primo polo della rete UNICESD Olympo: il punto di riferimento per iscriversi all'università, riprendere gli studi o certificare le competenze in provincia di Agrigento.",
         addr=[("Global Campus Licata", "Corso Umberto 37, 92027 Licata (AG)"), ("Telefoni", "340 155 5552 · 327 812 6622"), ("Email", "globalcampuslicata@gmail.com")],
         geo=(37.1050, 13.9370),
         blocks=[
             ("Che cosa trovi a Global Campus", [
                 ("ul", ["Università telematiche e residenziali: orientamento e iscrizione", "Scuole superiori e formazione professionale, compreso il <a href=\"/janus-diploma-online/\">diploma online</a>", "Certificazioni <a href=\"/certificazioni/linguistiche/\">linguistiche</a> e <a href=\"/certificazioni/informatiche/\">informatiche</a>", "Scuola, lavoro e fondi professionali", "Internazionalizzazione e mobilità, anche per <a href=\"/medicina-senza-test-ingresso/\">medicina all'estero</a>"]),
             ]),
             ("Perché un polo a Licata", [
                 "Per chi vive tra Licata, Palma di Montechiaro, Ravanusa e il resto della provincia, Palermo e le sedi universitarie sono lontane. Global Campus porta lo stesso metodo e gli stessi percorsi del Centro Studi a pochi minuti da casa: orientamento, iscrizioni e assistenza allo studente.",
                 "È il <b>polo n° 00001</b> della rete: ogni polo ha un codice che lo identifica. Se hai una struttura e vuoi aprirne uno nella tua città, leggi <a href=\"/apri-una-sede/\">Apri una sede</a>.",
             ]),
         ],
         faq=[("Global Campus è un'università?", "No, è una sede affiliata alla rete UNICESD Olympo che si occupa di orientamento, iscrizioni e assistenza. I titoli sono rilasciati dagli atenei e dalle scuole di riferimento."),
              ("Posso iscrivermi a Licata e fare gli esami altrove?", "Sì, gli esami si sostengono nelle sedi convenzionate con l'ateneo: ti indichiamo le più vicine.")],
         related=[("/poli-aperti/", "Poli aperti della rete"), ("/apri-una-sede/", "Apri una sede"), ("/universita-online-palermo/", "Università online a Palermo")]),
    dict(url="/universita-italiana-online-portogallo/", name="Università italiana online dal Portogallo", city="Lisbona",
         title="Laurea italiana online dal Portogallo: sede di Lisbona | UNICESD",
         desc="Vivi in Portogallo e vuoi una laurea o un diploma italiano online? La sede UNICESD Olympo di Lisbona, Rua Castilho 13, segue iscrizione, studio e pratiche.",
         h1="Laurea italiana online <span class=\"grad\">dal Portogallo</span>",
         eyebrow="Lisbona · Sucursal em Portugal",
         lead="Per gli italiani che vivono in Portogallo e per chi vuole un titolo italiano studiando da Lisbona: la filiale portoghese di UNICESD Olympo segue iscrizione, studio e pratiche.",
         addr=[("Universitas Centro Studi Olympo, S.R.L. — Sucursal em Portugal", "Rua Castilho 13, 3.º-B, 1250-066 Lisboa"), ("Telefono", "+351 210 523 770"), ("NIF", "980647819")],
         geo=(38.7230, -9.1520),
         blocks=[
             ("Chi può interessare", [
                 ("ul", ["Italiani trasferiti in Portogallo che vogliono completare o iniziare una laurea italiana", "Lavoratori in smart working dall'estero", "Studenti che vogliono il <a href=\"/janus-diploma-online/\">diploma italiano online</a>", "Chi valuta percorsi nell'area iberica, come <a href=\"/studiare-medicina-in-spagna/\">medicina in Spagna</a>"]),
             ]),
             ("Come funziona dall'estero", [
                 "Le lezioni si seguono online da qualsiasi Paese. Per gli esami, che nelle università telematiche si sostengono in presenza, si scelgono le sessioni e le sedi indicate dall'ateneo, organizzando i rientri in Italia con il tutor.",
                 "La sede di Lisbona è una rappresentanza permanente di UNICESD Olympo: da qui passano i rapporti con atenei ed enti dell'area iberica, le pratiche degli studenti che studiano fuori dall'Italia e i progetti di mobilità internazionale.",
             ]),
         ],
         faq=[("Posso iscrivermi a un corso italiano vivendo in Portogallo?", "Sì, l'iscrizione e lo studio sono online; per gli esami in presenza ti aiutiamo a organizzare le sessioni."),
              ("Il titolo italiano vale in Portogallo?", "Un titolo italiano è valido in Italia; per usarlo in Portogallo segui le procedure portoghesi di riconoscimento, che possiamo aiutarti a impostare.")],
         related=[("/sedi/", "Tutte le sedi"), ("/janus-diploma-online/", "Diploma online"), ("/corsi-di-laurea/", "Corsi di laurea online")]),
]
