# LINZ Our Whakapapa panels and photographs, 16 October 2026

The photographer confirmed that the five photographs were taken by Duane Wilkins on 16 October 2026. The dates in the panel headings are the historical periods described by the exhibition; they are not the dates of the photographs or necessarily the dates of every image reproduced inside each panel.

## Source files and preservation

The uploaded `Photos-1-001 (6).zip` was read from the local attachment path, not from Library. Its SHA-256 is `eb0e9d96b97e66a68de521a2c0676eb95cec1a484aed9b5b9bbfa32f08b5c3c2`. All five original JPEG byte streams are stored unchanged in `public/assets/historical/original/`, using their exact source filenames. EXIF records `Orientation 6`; the originals are 4000 × 1638 pixels and display upright at 1638 × 4000 pixels.

The separately named `LINZ_Our_Whakapapa_1900-1999_upright_photo_archive.zip` was not present in the accessible local attachments or workspace. The site derivatives were therefore made directly from the supplied originals: the full-size WebP applies the EXIF rotation at the original display dimensions, and the smaller card WebP resizes the complete panel to fit without cropping. No content was removed or added. Each original remains downloadable from its image-detail page, and its SHA-256, original dimensions, upright display dimensions and derivative checksums are recorded in the matching JSON record.

| Source filename | Historical panel | Original SHA-256 |
|---|---|---|
| `20261016_134012.jpg` | 1900–1929 | `2b6bd191715fc1752ea1d85009bbab8203b6ec16a0c823b0be3f92e5b957417d` |
| `20261016_133941.jpg` | 1930–1959 | `80f6da67870ee611a084dca195af8c68f399903374af07db863cd356b8f564db` |
| `20261016_133949.jpg` | 1960–1979 | `6e6db728d086dd60e5b45ad01262d156202e7ed3c15301cc6093a58ef8a62e85` |
| `20261016_133955.jpg` | 1980–1989 | `699715aeefef5a059d133914e324a6ab95ff0dba59d6f8650b10509c81b549fd` |
| `20261016_134000.jpg` | 1990–1999 | `1c60ae920f9a104890b43e9c5288f8e04cd065a840dd1ca0f0622438602dfee7` |

The photographs show exhibition panels, not original scans of the historical photographs printed on those panels. No people have been identified from appearance. Source filenames remain visible in each image record.

## Attribution and reproduction terms

LINZ’s current [copyright statement](https://www.linz.govt.nz/copyright) identifies LINZ-produced material as Crown copyright and states that, unless otherwise specified, content is licensed under Creative Commons Attribution 4.0 International. It requires written attribution. The image credits name Duane Wilkins as the photographer and Toitū Te Whenua Land Information New Zealand as the exhibition-content source, with the official terms linked from every image page.

The photographer supplied the photographs for this project. That authorisation covers their use in this draft website; it does not grant an onward licence to reuse the camera photographs. No panel-specific exception was visible in the photographs. The panels contain embedded historical photographs with no readable per-image credits or rights notices. Their individual reproduction permissions therefore remain unresolved and must be checked before merge or any public release. The panel display photographs are retained in the draft with this limitation disclosed on every image page.

## Historical cross-check and editorial decisions

| Panel | Existing records and chapter links | Cross-check and decision |
|---|---|---|
| 1900–1929 | Department of Lands and Survey; New Zealand Geographic Board; Chapter 1 | The panel’s provisional Geographic Board appointment and early survey account are kept as retrospective exhibition statements. Herbert Girdlestone is named, but no independently matched existing person record was found; no new profile or dated event was created. |
| 1930–1959 | Department of Lands and Survey; existing Bill Robertson record; Chapters 1 and 20 | The panel’s World War II map-production and aerial-survey material fits existing chapters. The named Bill Robertson is associated with the existing profile; no second person record was created. |
| 1960–1979 | Lands and Survey; existing 1979 Computer Mapping Unit, Chris Kinzett, Joyce Baillie, MAPPAK and M. S. Colley records; Chapters 3 and 5 | The panel dates the Computer Mapping Unit to 1979 and names Chris Kinzett; it does not establish that he founded the unit. MAPPAK remains a separate system documented by Colley’s 1979 thesis. The panel dates the first NZMS 260 sheet to 1978, while Te Ara identifies T12 Thames as published in 1977. The accepted 1977 event and chapter date are retained; no duplicate event or person was added. |
| 1980–1989 | Lands and Survey and DOSLI; DCDB; Chapters 5, 13, 15 and 18 | The panel says teams digitised cadastral record sheets in all twelve district offices and describes computer terminals and electronic data systems. LINZ independently places DCDB map digitisation in the mid-1980s; Allan Wilson’s April 1990 article documents the programme in progress. The panel dates New Zealand’s first GPS survey to Fiordland in March 1989, while Te Ara says 1986. Chapter 18 retains 1986 as the earliest identified GPS survey and notes that the original survey record is unrecovered. No 1989 first-survey event was added. The panel’s reference to William Alexander Robertson in 1991 is not conflated with the existing Bill Robertson profile without further identity evidence. |
| 1990–1999 | DOSLI and LINZ; Landonline; existing Graeme Jupp profile; Chapters 13, 14, 19 and 30 | The existing record and event preserve the DOSLI–LINZ split on 1 July 1996; Chapter 19 and the existing event cover NZGD2000 in 1998; Chapter 14 covers Landonline’s late-1990s start. Graeme Jupp’s existing profile is linked. Names in the panel without a verified existing match were not converted into new profiles. |

The 1960–1979 chapter now distinguishes the Computer Mapping Unit from MAPPAK. Chapter 13 and the DOSLI organisation record now preserve the panel’s district-office account, clearly attributed as retrospective and cross-checked against official LINZ material and Wilson’s contemporary account. Each image-detail page links to relevant organisation records and chapters; the three organisation records link back to their applicable panel image pages. Existing person, event and relationship IDs are retained. No new timeline events were added, and the 31 December 2025 historical cutoff remains unchanged; the 2026 capture date appears only as image provenance.

## Verification expected on the PR head

The image test checks all five exact source filenames, SHA-256 values, source EXIF orientation, upright derivative dimensions and hashes, chapter links, related routes, institutional links, existing people/events and the 31 December 2025 cutoff. The panel photographs remain collection images rather than in-line chapter figures or chapter-card thumbnails. The final branch verification must also include `npm test`, `npm run validate`, and `npm run build`; the draft must remain unmerged and unpublished while embedded-image permissions remain unresolved.
