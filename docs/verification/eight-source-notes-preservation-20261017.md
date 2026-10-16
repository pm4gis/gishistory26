# Reviewed source-note preservation update

Base production source: `9154100596ddf94e5c697f1c7091ec0e9f97552d`. Exactly eight complete story source files had a single new documented source note appended. For all eight files, this operation checked the previous file hash against the accepted preservation manifest and compared every existing key and pre-existing note to the original baseline. No accepted text or source note changed.

| Story file | Before SHA-256 | Reviewed SHA-256 | New source note |
| --- | --- | --- | --- |
| `src/content/articles/government-goes-spatial.json` | `6ba47853a9144c45843ab3e0f92a65fd2296be2b5142159095b545bc70bdfda8` | `bcfbed19033a48cd2b53b9f1016dc51fd46cf2d4a2907313c7d2f8247ac9a6bb` | `source-nz-geospatial-strategy-2007` |
| `src/content/articles/mapping-land-as-data.json` | `a46bdff1d053b538ebe2066491d8330c74ac8cbf4f02b39e5fba1d35a196cca1` | `dc03c98cf1c6a5cb0bd47e251acab7b0bf05f5178806306c897df44207a160ec` | `source-cfrt-gis-conference-handout-2007` |
| `src/content/articles/the-spatial-infrastructure-idea.json` | `5f1b474d1674888beae57408d12b364d41b7ffce5d50f423e47a98053fdb93cd` | `d67e1e845564e721c66e8015e11a1fbf0cd39514b4b16c9b69895dd1251f7c68` | `source-nz-sdi-state-of-play-2012` |
| `src/content/articles/universities-build-a-field.json` | `9fc877ec031083530065756aebc9b2164dbbf303f7ce033a79e187fe91b6cd3b` | `25e99477619bacebde37050d2c307493802ab4d002765d3de0ce818010bebe24` | `source-linz-geospatial-rd-priorities-2015` |
| `src/content/articles/becoming-a-gis-professional.json` | `81f71d1405047d153a9cf5e46f10dadf98d3cb12aa40133fdc8c15d21eafbaae` | `71a415d263167492959ce748df594ba04d1d3919764ec80a9b59c789f4f8d636` | `source-gis-day-education-poster-2018` |
| `src/content/articles/an-industry-and-community-form.json` | `519663dbf0d179cdec01a917fe31df248bb6e4f19fc647b551e2a62ffe43f951` | `e254a3917293cc8c16e79e09f22cd846ff43b7c6e48d36e69e54f40c24569a8c` | `source-place19-maori-gis-programme-2019` |
| `src/content/articles/safety-policing-and-emergency-gis.json` | `b45396f681c218236187406b678c0563ac2f03806066ffe43111598913f1ef8e` | `5e47ea118a20194da36a256ca37b45efb56437ebfc1ff8c20f44efde0ea0def5` | `source-taranaki-cdem-geospatial-strategy-2021` |
| `src/content/articles/conservation-and-environment.json` | `d242d8b4ef7c5a2f435548302b9fa19266a632777146e9cade141d8731a9a8f1` | `93d85675e1223b1e3309b4c3ffe7f4942f150403d10d1e06b3ead51d5ef70cc5` | `source-gis-mapping-wetland-projects-2021` |

The public timeline uses the pre-2026 date cut-off. The originals are described in `docs/research/eight-contributed-sources-20261017.md`; no user-uploaded binary is falsely represented as hosted.

Verification required: `npm ci`, `npm test`, `npm run build`, Chromium source-route QA and production Cloudflare deployment check.
