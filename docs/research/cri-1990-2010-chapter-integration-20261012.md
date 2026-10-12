# Integration of 1990s–2000s CRI GIS research

Research and editorial integration: 12 October 2026.
Baseline: production commit `1ada5140a8a7a1b2d26dc238bf7ff6c60067e67f`; historical research register `docs/research/historical-datasets-cri-expansion-20261012.md` and PR #56.

## Confirmed new activity and narrative placement

| Period | Work | Primary documentary source | Narrative integration |
| --- | --- | --- | --- |
| December 2000 | HortResearch Ruakura persimmon-orchard geographic and self-organising-map analysis (24 orchards, two seasons) | Alistair Mowat, SIRC 2000 paper (copy deposited on ResearchGate) | Chapter 9, The CRI reorganisation |
| 2004–2006 | NIWA-led multi-CRI decision-support modelling for land-use effects on water quality; collaboration across AgResearch, HortResearch, Landcare Research and other contractors | NIWA Stage I 2004 and Stage II 2006 research reports | Chapter 9, Catchment monitoring |
| April–August 2005 | Christchurch Legionnaires' outbreak, mapped clusters, microbiological evidence, EpiSurv and multi-agency investigation | White et al., *Epidemiology and Infection*, published 2013, historical event dated 2005 | Chapter 27, A health-geoinformatics community |
| 2006 onward | GNS QMAP vector-data CDs supplied coverages, shapefiles, and configured GIS projects | National Library of New Zealand vector-CD catalogue (2006–2014) | Chapter 9, Rebuilding the geological map |
| 2006 | Crown Forestry Rental Trust ArcFlax 2.0 Whanganui GIS DVD, ArcReader 9.1 | National Library of New Zealand catalogue, 2006 | Chapter 35, From viewer to task; Māori GIS theme |
| 1 December 2008 | HortResearch and Crop & Food Research merged to form Plant & Food Research | Contemporary Minister's announcement | Organisation records and relationships |

## Evidential and editorial limits

The 2004–2006 multi-CRI GIS programme is recorded as commissioned research and model-integration work. Do not claim that a final user-facing GIS application was fully deployed from the Stage II report alone. Mowat's 'self-organising map' is a statistical visualisation, not a printed cartographic sheet or evidence of proprietary GIS platform use. In the 2005 Christchurch investigation, ESR provided national disease surveillance and laboratory confirmation; GIS analysis involved a broader epidemiological and public-health team. The original 2005 outbreak and the 2013 paper publication have separate dates. The 2006 QMAP CD record establishes product format and a range of publication dates, not identical publication dates for all regional maps. ArcFlax edition 2.0 is proven; the first-edition date and the detailed private layer inventory remain unverified.

## Image alignment

The existing verified GNS Christchurch QMAP map, 2008, `qmap-christchurch-2008`, is anchored after `research-cri-qmap-cd-2006` in Chapter 9 using the editorial placement helper. Its caption calls it a printed geological map product, not an interface screenshot or the 2006 vector CD. Original image binary and archive metadata remain unchanged. Alignment register entry appended to `docs/media/cri-1990-2010-image-alignment-20261012.csv`. No other new image was placed because no relevant original depiction had been authenticated.

## Preservation and release checks

Five paragraph insertions maintain every previous paragraph, block ID and source. Section metadata and records were extended additively. The Māori GIS theme gains the documented 2006 ArcFlax episode and its earlier catalogued event. Four CRI programmes, the five historic/successor organisational entries and Alistair Mowat gain source-linked records and connections. Run `npm ci`, `npm test`, `npm run build`, the editorial exclusion/preservation checks, and Cloudflare preview and production page checks. Confirm that no unsupported relationship endpoints were added.

## Highest-value gap

Retrieve a preserved copy of the ArcFlax DVD and its original documentation if available, and contemporaneous NIWA GIS screenshots or diagrams from the Stage I and Stage II reports. Each may justify additional illustrated sections, but neither has been examined as a file in this release.
