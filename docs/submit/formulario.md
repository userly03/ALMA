# NASA Space Apps 2026 · Challenge 4 — submission form (draft, English)

**Project name:** ALMA — a ship that keeps its own books

## Description (150–200 words)
ALMA is health-monitoring software for astronauts built around one rule: no colour without a contestable rule behind it. Every alarm prints its receipt — the exact rule, the seed that reproduces it, and the hash of the preregistration it came from. Every "all clear" states what the detector could actually have seen, given the days really observed. Instead of trusting a manifest, ALMA reconciles each habitat book (air, water…) against conservation of mass, so a leak the manifest cannot see still shows up as a loop that does not close. The astronaut is the patient; the habitat is an input to the body, never the patient on screen. Behind the interface sits a foundry that tests hypotheses: each one is preregistered with a hash before it runs, and refuted ideas are published exactly like sustained ones. Real data (wearables from everyday people, NOAA space weather, NASA's Sun) and a labelled simulated universe are never mixed: every screen carries a REAL or SIMULATED stamp. An assistant, ALMA, speaks only sentences built from those data, each with its source.

## How it works
1. **Ledger** — nine budgets (air, water, energy, dose, rhythm, load, immunity, conduct, time); a book closes if |residual| ≤ 2σ of its manifest's own uncertainty.
2. **Detectors with receipts** — personal baselines, bilateral CUSUM, conservation-of-mass reconciliation; each alarm withdraws itself if its rule stops holding.
3. **Foundry** — hypothesis cards declare what would kill them *before* testing; survivors compile into new detectors (one so far); it also generates and tests its own hypotheses (16 cards: 10 refuted, 4 sustained, published alike).
4. **Interface** — nine rooms in English with a deterministic narrator (no free-text AI), subtitles always visible, and a NASA Z-2 suit as a clickable human figure: the six official indicators (blood pressure, heart rate, glucose, temperature, sleep, mood), colour only where a receipted rule allows it. Heart rate and sleep show real states from everyday people; mood is captured in three touches; the rest stay empty and say why (no verified sensor uncertainty) instead of being simulated.

## Data (all linked and registered in `docs/politica-de-datos.md`)
- LifeSnaps wearable dataset — Zenodo 7229547 (everyday people, not astronauts).
- Sjögren/SLE/healthy Fitbit study — Zenodo 8018238, doi:10.5281/zenodo.8018238 (CC BY 4.0).
- NOAA SWPC planetary K index and NOAA Space Weather Scales; NASA SDO solar images.
- Utah residential water use — HydroShare (CC BY).
- NASA NTRS: Ewert & Stromgren 2019 (mass balance), Jones 2019 (ISS reliability manifests).
- NASA 3D Resources — Z-2 spacesuit model (no copyright).
- Real astronaut blood counts: NASA OSDR OSD-569 (four Inspiration4 crew). Live space weather: NOAA SWPC GOES protons/electrons, notices and solar images (NOAA SUVI/LASCO, NASA SDO); GFZ Potsdam Kp; neutron monitor NMDB/Oulu; ISS position (wheretheiss.at); MIT-BIH ECG (PhysioNet).
- Human anatomy: BodyParts3D, © The Database Center for Life Science, CC BY 4.0.
- Mood self-reports typed by whoever uses the demo (DC-02; real, not astronauts).

## Honest limits
Not astronaut data. The habitat is a labelled simulation anchored to public NASA figures. Our replication of an earlier 10/10 detection result reached 8/10 and is reported as "documented, not replicated". The variance channel failed its real-data test (9% false alarms) and is not enabled for alarms.

## Links
- Code repository: https://github.com/userly03/ALMA  *(must be PUBLIC when submitting)*
- Live demo: https://alma-iota-dusky.vercel.app · The Storm room: https://alma-iota-dusky.vercel.app/storm
- Project document: https://github.com/userly03/ALMA/blob/main/docs/ALMA-documento-del-proyecto-v0.3.pdf (and the research report, `docs/informe/ieee/main.tex`, once compiled to PDF)
- Demo video: https://www.youtube.com/watch?v=WkNsMz1kj2g

## Use of Super Intelligence (form answer)
Select: **code and data** (code, tests and docs written with Claude Code, Anthropic, under team review) and **audio** (ALMA's voice: Kokoro-82M TTS from deterministic template sentences). Not images/video (no SI-generated images). See README section "Use of Super Intelligence (SI)".
