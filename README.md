# ALMA — a ship that keeps its own books

Health-monitoring software for astronauts (NASA Space Apps 2026 · Challenge 4: *Create Health Monitoring Software for Astronauts on Space Missions*).

**Live demo:** <https://alma-iota-dusky.vercel.app> · **Video:** <https://www.youtube.com/watch?v=WkNsMz1kj2g> · [The Storm room (real Sun, live space weather)](https://alma-iota-dusky.vercel.app/storm) · **Code:** <https://github.com/userly03/ALMA>

One rule runs through everything: **no colour without a contestable rule behind it.** Every alarm prints its receipt — the exact rule, the seed that reproduces it, the hash of the preregistration it came from. Every "all clear" states what the detector could actually have seen, given the days really observed. Every experiment was sealed with a SHA-256 hash **before** it ran, and the failures are published next to the successes.

> **Judges — 2-minute path:** (1) open the [live demo](https://alma-iota-dusky.vercel.app), click once to wake ALMA; (2) go to **The Leak** (Ship ▸ Leak) and inject the 0.30 kg leak: the manifest detector is blind, the conservation law raises the alarm; (3) **The Vault** (Lab ▸ Vault): 30 hash-sealed experiments, failures included, and "Verify all" recomputes every hash in your browser; (4) **The Frontier** (World ▸ Frontier): real astronaut blood, live ISS and space weather; (5) **The Storm**: the real Sun, live. Real vs simulated is labelled on every screen.

![The Medical Module: a crew member, the nine books as rings, and a paper receipt for the air book](docs/screenshots/01-medical-module.jpg)

> **Honest scope — read this first.** There is **no astronaut data** here: no open dataset of a crewed habitat's sensors or of astronaut physiology exists. What is real is labelled REAL (wearables from everyday people, NOAA space weather, NASA's Sun, NASA planning figures); what is simulated is labelled SIMULATED and anchored to published NASA numbers; the crew are **fictional characters**. Every screen carries a REAL / SIMULATED stamp. See [Real vs simulated](#real-vs-simulated).

---

## Contents
1. [What ALMA is](#what-alma-is) · 2. [Run it](#run-it) · 3. [The interface: nine rooms](#the-interface-nine-rooms) · 4. [ALMA, the assistant](#alma-the-assistant) · 5. [Real vs simulated](#real-vs-simulated) · 6. [The science: preregistered and published, failures included](#the-science) · 7. [Architecture](#architecture) · 8. [API](#api) · 9. [Tests and honesty checks](#tests-and-honesty-checks) · 10. [Known limits](#known-limits) · 11. [Roadmap](#roadmap) · 12. [Credits and licences](#credits-and-licences) · 13. [Document map](#document-map)

## What ALMA is
- **A ledger of nine budgets** — air, water, energy, dose, rhythm, load, immunity, conduct, time. A book *closes* if |residual| ≤ 2σ of its manifest's own uncertainty; otherwise it asks a question (never "a verdict"). Books with no real anchor stay **empty** instead of being simulated.
- **Detectors with receipts.** Personal baseline + bilateral CUSUM; a conservation-of-mass reconciliation (a leak the manifest cannot see still shows up as a loop that does not close); witness triangulation (world / sensor / human); a flow-normalised water integrator. A "green" is a contract object (DC-14) that carries its statistical power and minimum detectable effect for the days actually observed.
- **A foundry of hypotheses.** Each card declares *what would kill it* before it is tested. Refuted cards are published exactly like sustained ones; survivors compile into new detectors (one so far).
- **The patient is the person.** The habitat is an *input* to the body, never the patient on screen. Individual content never crosses to the decision surfaces: only aggregates and states.
- **An interface in English with an assistant, ALMA,** whose every sentence is a template + a data value + its source. It is **not** a language model: it cannot invent a number.

## Run it
Needs Python 3.12 (`uv`), PostgreSQL, Node 22 + `pnpm`, Chrome (for the tests that drive a browser). Offline-capable once installed (3D model, fonts, voice and the last Sun image are local).

```bash
cp .env.example .env                 # fill in YOUR local PostgreSQL credentials (never committed)
uv sync
scripts/demo.sh                      # migrates, seeds, starts API :8000 and the interface :3000
```
Open <http://localhost:3000> and **click once** to wake ALMA — the click is also what lets the browser play audio. Step by step:

```bash
uv run python backend/manage.py migrate
uv run python backend/manage.py sembrar_demo                 # 14 days of SIMULATED habitat (air, water; 5 crew)
uv run python backend/manage.py sembrar_verdes               # REAL states of heart rate and sleep (needs LifeSnaps in data/externos/)
uv run python backend/manage.py ingestar_swpc [--cada 600]   # live NOAA space weather (repeat every N seconds)
uv run python backend/manage.py runserver 127.0.0.1:8000
cd web && pnpm install && pnpm build && pnpm start           # http://localhost:3000
```
ALMA's voice is pre-rendered locally (Kokoro-82M, Apache-2.0, no network):
```bash
uv run --with kokoro-onnx --with soundfile python scripts/voz_alma.py       # room lines (72)
uv run --with kokoro-onnx --with soundfile python scripts/voz_busqueda.py   # search vocabulary (80 clips)
```
Model files go in `data/voz_modelo/` (not versioned; see `scripts/voz_alma.py`). Voice and effect: `ALMA_VOICE`, `ALMA_FX` in `.env.example`.

## The interface: nine rooms
Navigate with the top bar or the ← → keys. Everything that talks has subtitles; sound and subtitles can be switched off next to ALMA's orb. Tap/click almost anything and ALMA explains it.

| # | Room | Question it answers | What you see | Data |
|---|---|---|---|---|
| 01 | **Medical Module** | *How am I, really?* | The crew (5 fictional characters), **inside** the ship (stylized uniform, face, callsign) or **outside** (NASA Z-2 suit). **Books**: nine rings, orange only where a book does not close; a day selector; a paper receipt per ring. **Body**: the six official indicators (blood pressure, heart rate, glucose, temperature, sleep, mood) as clickable dots; heart rate and sleep show real states, the rest say why they are empty. Mood is captured in **three touches**. | Habitat **SIMULATED**; body states **REAL stand-ins**; crew **FICTIONAL** |
| 02 | **Machine Room** | *What did the engine see?* | Two "seismograph tapes" — what the manifest promised vs what was observed, in σ; a surprise is a *flag, not an alarm*. | SIMULATED |
| 03 | **The Leak** | *Can a detector be blind?* | The kill demo: same day, same data, two detectors. Inject a 0.30 kg leak: the manifest detector scores 0.53σ and stays silent; the conservation law says the loop does not close. The preregistration hash is on screen. | SIMULATED (act FB-005-D1) |
| 04 | **The Vault** | *Can this be faked?* | The 30 preregistered acts with their hashes. **Search by typing or by voice**, filters, pagination, and **"verify it yourself"**: your browser recomputes each act's SHA-256. | REAL project records |
| 05 | **The Foundry** | *How is an idea born?* | Hypothesis cards in four columns, each showing **what would kill it**; the compiled detector; a dated public forecast. | REAL (not astronauts) |
| 06 | **The Storm** | *What is the Sun doing right now?* | The real Sun today (NASA SDO) and the real planetary K index (NOAA); press **G1–G5** to simulate a storm (clearly stamped SIMULATED UNIVERSE, with recipe, seed and hash). | REAL + labelled simulation |
| 07 | **The Budget** | *Do the ship's books close?* | The nine books as a ledger: expected, observed, residual, the "blind below 2σ" floor. Seven books are empty on purpose: *no ledger · nothing simulated*. | SIMULATED (2 books) |
| 08 | **The Capsule** | *Can I take this verdict with me?* | Exportable capsules of resolved hypotheses: **limits first**, exact numbers, preregistration hash, JSON download. No limits, no capsule. | REAL (not astronauts) |

| | |
|---|---|
| ![Body indicators](docs/screenshots/02-body-indicators.jpg) | ![Machine Room](docs/screenshots/03-machine-room.jpg) |
| ![The Leak](docs/screenshots/04-the-leak.jpg) | ![The Vault](docs/screenshots/05-the-vault.jpg) |
| ![The Foundry](docs/screenshots/06-the-foundry.jpg) | ![The Storm](docs/screenshots/07-the-storm.jpg) |
| ![The Budget](docs/screenshots/08-the-budget.jpg) | ![The Capsule](docs/screenshots/09-the-capsule.jpg) |
| ![The Frontier](docs/screenshots/10-the-frontier.jpg) | ![Real human anatomy fitted to a crew member](docs/screenshots/11-anatomy.jpg) |

### Medical Module extras (M6)

- **Layers:** Inside → Uniform · Body · **Anatomy** (skeleton and organs; each organ is an official indicator, coloured by its receipt: green ok · orange alarm · grey no verified sensor; tap one and ALMA speaks). Outside → Suit · **Anatomy** (the NASA Z-2 turns translucent), plus **Helmet on/off**.
- **Vitals monitor · real ECG:** a real 30-minute ECG (PhysioNet MIT-BIH record 100, an anonymised hospital outpatient — not an astronaut) with pulse and HRV computed by our own R-peak detector (99.96% of 2,273 human-annotated beats found, 0 false). Tabs: **Expected in flight** (published numbers with DOI: Barger 2014, Hughson 2012, NASA HRP) and **Earth link** (a published 0–22 min delay; with no contact the Guardian keeps deciding on board).
- Drag to rotate, scroll or pinch to zoom. "What is real here?" on every room.

## ALMA, the assistant
- **Deterministic by design.** `src/superficies/narrador.py` turns API data into sentences (template + value + source + REAL/SIMULATED stamp). Same data → same words; it changes when the data, the day, the scenario or the room changes. Missing data produces an *absence* sentence, never an invention. A test forbids the narrator from importing any language model.
- **Voice.** Pre-rendered with Kokoro-82M (local, Apache-2.0): 72 room lines (one per ledger day and book, per indicator, per crew member, per storm scale…). A queue plays lines requested before the first click; a new answer cancels the old one completely.
- **Search by voice and by typing (The Vault).** "show refuted experiments", "find solar storms", "not run yet", "open F B zero two zero", "go to the foundry", "verify everything". Typos and synonyms are tolerated; nothing found → *"I found nothing like that. The closest are…"*. ALMA answers with her own voice by **chaining 80 fixed clips** (ids, numbers, verdicts, rooms): instant, offline, and unable to say anything outside that vocabulary. Speech recognition is the **browser's** (Chrome sends the audio to Google and needs internet); typing works everywhere.
- **Transparency.** Subtitles are always available; the source and the stamp never hide.

## Real vs simulated
Policy ([`docs/politica-de-datos.md`](docs/politica-de-datos.md)): *nothing simulated without a label, nothing invented.* Every real source has an identifier (S-01…S-19); every simulated or fictional component has a row (X-01…X-15).

**Why do so many screens say SIMULATED?** Because no open dataset of a crewed habitat's air/water logs or of astronaut physiology exists: NASA publishes planning figures, reports and imagery, not that telemetry (the OSDR record for OS-892 lists no data files yet). Where real data does not exist, the item is **blocked, not faked** — or, where a habitat is needed to show a method, it is simulated, labelled, and anchored to published NASA values.

| | Real (open data) | Simulated / fictional (always labelled) |
|---|---|---|
| **Body** | Heart rate and sleep of everyday people (LifeSnaps, Zenodo 7229547; an independent Fitbit cohort, Zenodo 8018238) · mood self-reports typed by whoever uses the demo | The crew characters themselves (fictional) |
| **Habitat** | NASA planning figures (Ewert & Stromgren 2019: 0.89 kg O₂ and 1.40 kg urine water per person-day) · ISS reliability figures (Jones 2019, NTRS) · real household water flow (Utah, HydroShare) | The 14-day air/water ledger (5 crew) · stormy scenarios G1–G5 · adversary and Monte-Carlo test beds |
| **Space** | **Live** NOAA SWPC planetary K index and alerts · **NASA SDO** solar imagery · GFZ historical Kp | Storm scenarios (stamped SIMULATED UNIVERSE) |
| **Assets** | **NASA Z-2 spacesuit** 3D model (NASA 3D Resources, no copyright) | The indoor crew figure is built in this repo from primitives |
| **Not available** | Blood pressure, glucose, temperature (no verified sensor uncertainty) · energy, dose, rhythm, load, immunity, conduct books · OSDR OS-892 data files — all shown **empty and explained** | — |

## The science
Every claim is an **act** ([`docs/actas/`](docs/actas/)): question, success rule and kill rule, hashed (SHA-256 of its exact bytes) **before** its runner can execute; runners refuse to run on an altered act, on different data, or twice. Seeds are public (20261111–20261115). 30 acts sealed, 25 executed so far. Each experiment has a control that can fail. The authors' own predictions are recorded and reported when wrong. **21 acts sealed, 16 executed once.**

| Act | Result (numbers from `docs/actas/RESULTADOS.jsonl`) |
|---|---|
| FB-005-D1 · the leak demo | 0.30 kg leak: manifest score 0.53σ, no alarm; conservation residual +0.260 kg (σ 0.055) → *does not close*. Prediction confirmed. |
| FB-004R · slow water integrator | Normalising by real flow: false alarms 91.0 % → 4.8 %; detection 99.8 %. |
| FB-003R · three witnesses | Accuracy world 1.00 · sensor 0.88 · human 0.91 · nothing 0.83 (target missed: 0.83 < 0.85). |
| FB-012 · real water demand | Median daily CV 0.53 (31 households); autocorrelation inconclusive. |
| FB-013 · independent cohort | The pulse false-alarm problem did **not** replicate (2/66); power 89.4 % held. |
| FB-014 · solar storms × sleep/HRV | **Refuted** in 51 real people; small effects not excluded. |
| FB-016 · sleep, tension | Short sleep → tiredness **sustained** (+7.9 points, 27 people, p = 0.001); tension → lower HRV **refuted**. |
| FB-015-v2 · replication of "10 of 10" | 6/7 table cells reproduced, detection **8 of 10 — documented, not replicated**. |
| FB-018 / FB-019 · the adversary | A zigzag (same mean, more variance) is caught 1.8 % of the time; the limit is *information*: a 28-day baseline reaches 95 %. |
| FB-020 · variance channel on real data | Sees the zigzag (99 %) but **9.0 % false alarms — refuted**; disabled for alarms. |
| FB-020-v2 · robust variant | Selected on one cohort; validation had 5 windows → **inconclusive**. |
| FB-024 / FB-025 · real astronaut blood (Inspiration4, n = 4) | 1 of 28 blood-count rows does not reconcile; lymphocytes fell a median 24 % on landing day but **no astronaut left the personal band** (floor ≈ ±70 %). |
| FB-026 / FB-027 / FB-028 · hypotheses written by the lab | Short sleep lowers overnight HRV by 0.21 sd (**sustained**, p = 0.0001, placebo null); the pulse effect shrank to +0.11 bpm in an independent cohort (**refuted**); four more refuted. |
| FB-029 · cosmic rays as a second witness | The same CUSUM on a neutron monitor catches 41 % of severe storms (chance 6 %), a median 13 h after the storm index crosses storm level: **confirms, does not forecast**. |

Related work and what we can and cannot claim: [`docs/revision-literatura.md`](docs/revision-literatura.md) — **no algorithmic novelty is claimed** (CUSUM, data reconciliation and spacecraft mass balance are established); the contribution is a *method of work*. A negative-results-first manuscript draft is in [`docs/preprint/manuscript.md`](docs/preprint/manuscript.md) (not submitted).

## Frontier work (M6) — what we tried, including what failed

Four ideas beyond the brief, each sealed with a SHA-256 hash **before** running and published whatever the outcome:

| Idea | Result |
|---|---|
| **Alarms with a false-alarm guarantee** (e-processes; the method is not ours, see `docs/revision-literatura.md`) — FB-021 | On real wearable data the textbook guarantee failed fivefold (5.06% false alarms asked ≤1%); calibrated it holds but sensitivity drops 99% → 71%. Out-of-sample check had 5 windows: inconclusive. |
| **Body or sensor? Cross-signal consistency** — FB-022 | Real within-person couplings hold out of sample (temperature, breathing, HRV vs resting pulse). The classifier built on them is refuted (66%; 44% of untouched real blocks flagged). |
| **Who is breathing extra? Splitting cabin air into bodies** — FB-023, *simulated* | Identifiable only with staggered shifts (chance when identical); weaker than predicted (71% at 20% excess). |
| **Privacy as a budget** (ε, Laplace) — `tests/test_privacidad.py` | With a crew of 5, an exact aggregate plus one subtraction names a person; the ledger spends ε per published count. ε = 2.0 is illustrative, not a NASA policy. |

The room "What is real here?" button lists real vs simulated on every screen. Notes: `docs/actas/NOTA-FB-021.md` … `NOTA-FB-023.md`.

## Architecture
```
Ingestion → Ledger → Engine → Foundry → Surfaces        (one direction only; the domain never imports Django or Next)
```
| Path | What |
|---|---|
| `src/contratos/` | The 14 data contracts DC-01…DC-14 (versioned in DOC-01, currently v0.2.10) — sensors, self-report, space events, ledger, alarm-with-receipt, residual stream, capsule, conservation closure, daily shape, error contagion, sensor life, foundry card, ingestion attempt, green receipt |
| `src/ingesta/` | Adapters (LifeSnaps, Zenodo, Utah), NOAA SWPC client and parsers, sensor-uncertainty table with sources |
| `src/libro/` | Ledger, real `time` budget, the fictional crew (`tripulacion.py`) |
| `src/motor/` | Baselines, CUSUM, conservation closure (*El Contrapeso*), triangulation, water integrator, variance channel, adversary, storm scenarios, green receipts, per-person indicator state |
| `src/fabrica/` | Foundry cards, capsules (DC-07), the public forecast |
| `src/superficies/` | The deterministic narrator and the search vocabulary |
| `src/gobernanza/` | Preregistration: hash of exact bytes, append-only index, `exigir_preregistro` |
| `backend/` | Django + DRF over PostgreSQL (persistence and the API) |
| `web/` | Next.js 15 + TypeScript + Tailwind interface; three.js for the figures |
| `scripts/` | One runner per experiment, voice pre-render, source verification, `demo.sh` |
| `docs/` | Contracts, data policy with every source, acts, literature review, submission drafts, checklist |

## API
Read-only JSON, with a REAL/SIMULATED `banner` in every response and **no individual identifiers or values** (privacy is tested by mutation). The only write is the mood self-report.

`GET /api/libro/dias/` · `/api/libro/dia/<d>/` · `/api/alarmas/` · `/api/residuo/` · `/api/cierres/dia/<d>/` · `/api/verdes/` · `/api/indicadores/` · `/api/tripulacion/` · `/api/fundicion/` · `/api/actas/` · `/api/actas/<id>/archivo/` (the exact bytes, so anyone can recompute the hash) · `/api/demo-kill/` · `/api/tormenta/` · `/api/tormenta/escenario/<G1–G5>/` · `/api/capsulas/` · **`POST /api/animo/`** (DC-02: value 1–5 + measured response time, pseudonymous, rate-limited).

## Tests and honesty checks
```bash
uv run pytest -q                       # 475 tests: contracts, engine, API, privacy, narrator, honesty checklist
cd web && pnpm test:unit               # 6 tests of the search/intent engine
cd web && pnpm e2e                     # 25 real-click checks in headless Chrome (audio starts after the click, arrows, Body → Mood in 3 touches,
                                       # leak demo, storm scenario, vault search by typing and by (simulated) voice, 21 of 21 hashes recomputed in the browser…)
sysmap --root . check                  # structural map: nothing worse than the baseline
```
`tests/test_checklist_honestidad.py` is an executable checklist: every response and every screen declares REAL or SIMULATED; every line ALMA says has a source and audio; the acts are intact; every persisted alarm has a full receipt; every capsule declares limits; the UI never claims "10/10"; the narrator imports no language model.

### Lab and world (M7–M8)

- **The Foundry generates hypotheses.** `src/fabrica/generador.py` crosses a library of 12 published mechanisms with the real data the lab holds and emits candidates (today 9 already tested and sealed, 3 blocked because the data does not exist — in-flight data); the Foundry shows them in "The nursery", then the sealed verdicts (16 cards: 10 refuted, 4 sustained, 3 per page). The generator also **drafts the preregistration** from the same specification the runner uses; FB-026 is the first full loop: candidate → drafted act → hash → one run → cards (sleep below your own median lowers overnight HRV by 0.21 sd, p = 0.0001).
- **Real NASA/NOAA in the rings.** Dose ← GOES protons, Rhythm ← ISS sunlight, Energy ← solar X-rays (live; stored as DC-03 events with a raw-reading hash, DOC-01 v0.2.9); Time, Immunity, Load and Conduct show sealed results. Tap a ring for source and limit.
- **The Frontier** (World ▸ Frontier): live ISS map, NASA EPIC Earth, blood of four real astronauts (Inspiration4, OSD-569), the OSDR catalogue, and our tests with their honest verdicts. **The Counterweight** (Ship ▸ Budget) shows conservation closure per day (simulated universe).
- NASA photographs on each room's header are real, credited, and linked (`web/public/nasa/credits.json`).

### Tests that need local data

A fresh clone runs **fewer** tests: five test files skip themselves when their real dataset is absent (`data/externos/` is not in git). To run everything, download the sources listed in `docs/politica-de-datos.md` (LifeSnaps S-07, Zenodo 8018238 S-13, MIT-BIH record 100 S-20, NASA OSDR OSD-569 S-24) and check each file against the SHA-256 in the code. `pytest -rs` shows which tests were skipped and why.

## Known limits
- **No astronaut data.** Real data are everyday people and public space-weather feeds; the habitat is a labelled simulation.
- The **variance channel failed** its real-data test (9.0 % false alarms) and does not emit alarms; the **"10 of 10" detection result did not replicate** (8 of 10); several validations are **inconclusive by sample size**.
- The indoor crew figure is **stylized**, not photorealistic; the speech recognition used for voice search is the browser's (online in Chrome).
- Literature search covered PubMed and NTRS, not IEEE Xplore or Google Scholar, and was not a systematic review.

## Roadmap
Tracked in [`docs/checklist-final.md`](docs/checklist-final.md) and `TASKS.md`. Next candidates: ALMA as a **side panel** that tucks away after speaking so it never covers content (all rooms) · **search, filters, pagination and voice report in every room where they apply**, with a global command palette · **"try to fool ALMA"** (draw an anomaly and see which detector catches it) · mission replay · a 3D habitat with lit air/water loops · photorealistic crew (Quaternius CC0 characters) · local (offline) speech recognition · validating the robust variance channel on a larger independent cohort · more real NASA/NOAA feeds (DONKI, OSDR when OS-892 publishes).

## Use of Super Intelligence (SI) — disclosure
- **Code and documents:** most of the source code, tests, documentation and the research-report draft were written with **Claude Code (Anthropic)** under the team's direction and review. Every numeric claim traces to a sealed experiment record, not to a model's memory.
- **Audio:** ALMA's voice is synthesised with the open **Kokoro-82M** text-to-speech model (Apache-2.0) from sentences produced by a deterministic template engine (`src/superficies/narrador.py`); there is no language model at runtime. The clips in `web/public/voice/` are therefore **SI-generated audio**.
- **Images and video:** no SI-generated images. The five crew characters are fictional people generated by script with Blender/MPFB parametric assets; NASA photographs are real and credited (`web/public/nasa/credits.json`); the Sun images are real NOAA/NASA data. Human anatomy is a derivative of BodyParts3D (CC BY 4.0).
- **Data:** no SI-generated data. Simulated components are labelled SIMULATED and listed in `docs/politica-de-datos.md`.
- No NASA logo, flag or mission identifier is generated or modified by us.

## Credits and licences
Code: **Apache License 2.0** ([`LICENSE`](LICENSE), [`NOTICE`](NOTICE)). Third-party data, models and images keep their own licences, listed below and in `NOTICE`.

Every source, licence and simulated component: [`docs/politica-de-datos.md`](docs/politica-de-datos.md). Highlights: LifeSnaps (Zenodo 7229547) · Sjögren/SLE/healthy Fitbit study (Zenodo 8018238, CC BY 4.0) · NOAA SWPC and Space Weather Scales · **NASA SDO** imagery · Utah residential water use (HydroShare, CC BY) · NASA NTRS reports (Ewert & Stromgren 2019; Jones 2019; Kayatin 2021) · **NASA Z-2 spacesuit model** (NASA 3D Resources, "free and without copyright") · Kokoro-82M voice model (Apache-2.0) · fonts Instrument Serif, Schibsted Grotesk, IBM Plex Mono (SIL OFL).

*Licence of this repository: to be set by the team before publication.*

## Document map
| Want to… | Open |
|---|---|
| Know what is left and what is next | [`docs/checklist-final.md`](docs/checklist-final.md) |
| Run the 4-minute demo / record the video | [`docs/submit/ruta-de-demostracion.md`](docs/submit/ruta-de-demostracion.md) · [`docs/submit/video-guion.md`](docs/submit/video-guion.md) |
| Read the submission form draft | [`docs/submit/formulario.md`](docs/submit/formulario.md) |
| See every data source and every simulated piece | [`docs/politica-de-datos.md`](docs/politica-de-datos.md) |
| Read an experiment (act), its hash and its reading | `docs/actas/FB-xxx.md` · `NOTA-FB-xxx.md` · `RESULTADOS.jsonl` |
| Understand the contracts | `docs/DOC-01_MAP-S1-mapa-maestro-sistema-v0.2.md` |
| Check related work | [`docs/revision-literatura.md`](docs/revision-literatura.md) |
| Decisions and the backlog | `docs/decisiones.md` · `TASKS.md` |


## Team handoff
Sources and APIs: [`docs/entrega/FUENTES.md`](docs/entrega/FUENTES.md). Start with [`docs/entrega/PLAN-DE-ENTREGA.md`](docs/entrega/PLAN-DE-ENTREGA.md): ranking of the strongest results, video scripts (`docs/submit/video-guion.md`), IEEE LaTeX skeleton (`docs/informe/ieee/`), and the open work list.


## Third-party assets and attribution
- **Human anatomy (Anatomy layer):** BodyParts3D, © The Database Center for Life Science, licensed under [CC Attribution 4.0 International](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html). Subset of the 4.0 release (189 bones, costal cartilages, organs), converted with `scripts/anatomia_bp3d_a_glb.py` and fitted to each fictional crew member at load time. Shown for illustration; not a scan of any person and not a diagnosis.
- **Cosmic-ray data:** we acknowledge the NMDB database (www.nmdb.eu), founded under the European Union's FP7 programme (contract no. 213007), and the PIs of individual neutron monitors: Oulu (Sodankyla Geophysical Observatory of the University of Oulu, Finland).
- Other sources and licences: `docs/entrega/FUENTES.md`, `docs/politica-de-datos.md`.
