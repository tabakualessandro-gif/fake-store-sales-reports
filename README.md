# Fake Store — Report vendite e clienti

## Descrizione del progetto

Applicazione sviluppata in TypeScript che recupera dati dalla [Fake Store API](https://fakestoreapi.com) e genera report riepilogativi relativi ai prodotti venduti e ai clienti.

Il programma utilizza i dati di prodotti, carrelli e utenti per elaborare classifiche basate sulle quantità vendute e sulla spesa complessiva.

Vengono generati due file JSON, salvati nella cartella `output/` e stampati anche nella console:

- `output/report_prodotti.json`: classifica dei primi tre prodotti per numero di unità vendute.
- `output/report_clienti.json`: classifica dei primi tre clienti per spesa totale.

Per entrambe le classifiche vengono considerati sia il periodo complessivo disponibile sia l'ultimo mese definito dal programma.

## Tecnologie utilizzate

- **TypeScript** — sviluppo della logica applicativa con tipizzazione statica.
- **Node.js** — ambiente di esecuzione del programma.
- **npm** — gestione delle dipendenze e degli script.
- **Fake Store API** — fonte dei dati relativi a prodotti, carrelli e utenti.
- **JSON** — formato utilizzato per esportare i report.

## Requisiti

Prima di avviare il progetto è necessario avere installato:

- Node.js versione 20 o successiva.
- npm, incluso con Node.js.
- Git, se si desidera scaricare il progetto tramite repository.

È inoltre necessaria una connessione Internet per recuperare i dati dalla Fake Store API.

## Installazione

Clonare il repository e accedere alla cartella del progetto:

```bash
git clone https://github.com/tabakualessandro-gif/fake-store-sales-reports.git
cd fake-store-sales-reports
```

Installare le dipendenze:

```bash
npm install
```

## Esecuzione

Per avviare direttamente il programma in ambiente di sviluppo:

```bash
npm run dev
```

Il programma recupera i dati dalla API, elabora le classifiche, stampa i risultati nella console e genera i due report JSON nella cartella `output/`.

## Compilazione TypeScript

Per verificare il codice e compilarlo nella cartella `dist/`:

```bash
npm run build
```

Dopo una compilazione riuscita, il programma può essere eseguito con:

```bash
npm start
```

Il comando `npm start` esegue il file JavaScript compilato.

## Report dei prodotti

Il report dei prodotti contiene le classifiche dei primi tre prodotti per numero di unità vendute.

Per ciascun prodotto vengono riportate le informazioni disponibili, tra cui identificativo, titolo, categoria, quantità venduta, prezzo e fatturato, oltre ai dati temporali previsti dal report.

La classifica viene ordinata secondo questi criteri:

1. Numero di unità vendute in ordine decrescente.
2. In caso di parità, identificativo `product_id` in ordine crescente.

## Report dei clienti

Il report dei clienti contiene le classifiche dei primi tre clienti per spesa totale.

I risultati includono le informazioni anagrafiche disponibili, il numero di ordini, le unità acquistate e la spesa calcolata, oltre ai dati temporali previsti dal report.

La classifica viene ordinata secondo questi criteri:

1. Spesa totale in ordine decrescente.
2. In caso di parità, identificativo `user_id` in ordine crescente.

## Definizione di «ultimo mese»

La Fake Store API fornisce dati di esempio che possono riferirsi a periodi storici. Per rendere il calcolo indipendente dalla data corrente, il programma definisce l'ultimo mese come una finestra mobile di 30 giorni.

La finestra termina alla data del carrello più recente con una data valida. L'inizio dell'intervallo viene calcolato sottraendo 30 giorni dalla data di ancoraggio.

Entrambi gli estremi dell'intervallo sono inclusi. La data di ancoraggio e l'intervallo temporale in formato ISO 8601 vengono riportati nei risultati.

Il conteggio degli ordini considera i carrelli con data valida che rientrano nel periodo analizzato.

## Gestione dei casi particolari

Il programma prevede alcune regole per gestire dati incompleti o non validi:

- **Prodotti assenti dal catalogo:** se un prodotto è presente in un carrello ma non nel catalogo, le sue unità continuano a essere conteggiate. Titolo e categoria vengono indicati come mancanti, mentre prezzo e fatturato sono impostati a `null` perché non calcolabili senza il prezzo di catalogo.
- **Utenti assenti dall'anagrafica:** il cliente viene mantenuto nel report e i campi anagrafici non disponibili vengono impostati a `null`.
- **Date non valide:** i carrelli con date non valide vengono ignorati perché non possono essere assegnati in modo affidabile a un periodo.
- **Quantità non valide:** le quantità non valide o non positive vengono ignorate.
- **Assenza di date valide:** se non esistono carrelli con date valide, l'intervallo temporale viene impostato a `null` e le classifiche dell'ultimo mese risultano vuote.

## Struttura del progetto

```text
fake-store-sales-reports/
├── src/
│   ├── api.ts
│   ├── index.ts
│   ├── reports.ts
│   └── types.ts
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

- `src/api.ts`: recupera i dati dalla Fake Store API.
- `src/index.ts`: coordina l'esecuzione del programma e la generazione dei report.
- `src/reports.ts`: contiene la logica di elaborazione e classificazione dei dati.
- `src/types.ts`: definisce i tipi TypeScript utilizzati nell'applicazione.
- `package.json`: contiene le dipendenze e gli script npm.
- `tsconfig.json`: configura il compilatore TypeScript.
- `.gitignore`: esclude dal versionamento i file e le cartelle configurati come non necessari al repository.

## Output atteso

Al termine dell'esecuzione, il programma mostra i risultati nella console e genera:

```text
output/
├── report_prodotti.json
└── report_clienti.json
```

I report possono essere consultati con un editor di testo o qualsiasi strumento compatibile con il formato JSON.

## Repository

Il codice sorgente è disponibile su GitHub:

https://github.com/tabakualessandro-gif/fake-store-sales-reports
