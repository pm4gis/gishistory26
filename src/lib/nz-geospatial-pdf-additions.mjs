// Additional pre-2025 geospatial publications from New Zealand agencies,
// councils, DOC and university repositories. PDFs remain on their publishers' sites.
const defaultLicense = "Check the publisher or repository terms before reuse; this catalogue links to the publisher-hosted copy.";
const makeItem = (entry) => {
 const date = entry.date || entry.year;
 const series = entry.series ? " · " + entry.series : "";
 const sourceUrl = entry.sourceUrl || (entry.publisher === "Ministry for Primary Industries"
   ? "https://www.mpi.govt.nz/dmsdocument/" + entry.id + "/sitemap/"
   : entry.pdfUrl);
 const pdfUrl = entry.pdfUrl || "https://www.mpi.govt.nz/dmsdocument/" + entry.id + "/direct";
 return {
  slug:entry.slug, fileName:entry.slug+".pdf", externalPdfUrl:pdfUrl, pdfPath:pdfUrl,
  hostedLocally:false, isPdf:true, isNewAddition:true,
  title:entry.title, creator:entry.creator || entry.publisher, year:String(entry.year),
  date:date + (series ? series : ""), kind:entry.kind || (entry.publisher.includes("Research Repository") || entry.publisher.includes("Research Commons") || entry.publisher==="Massey Research Online" ? "University research thesis" : "Technical report"),
  topic:entry.tags.slice(0,4).join(" · "), summary:entry.summary,
  sourceName:entry.publisher, sourceUrl, sourceLabel:entry.sourceLabel || "Publisher or repository record",
  license:entry.license || defaultLicense,
  attribution:entry.attribution || entry.publisher + " (" + entry.year + "), " + entry.title + ".",
  themeIds:["profession","open-practice"], keywords:entry.tags,
  thumbnailPath:"/assets/publications/thumbnails/nz-source-document.svg"
 };
};
const entries=[
  {
    "slug": "mpi-spatial-grids-marine-data-2022",
    "title": "A standardised approach for creating spatial grids for New Zealand marine environment and species data",
    "year": "2022",
    "publisher": "Ministry for Primary Industries",
    "id": "52945",
    "series": "AEBR 288",
    "summary": "Proposes a common coordinate reference system and grid origin so marine environment and species datasets can be overlaid, combined and reused with fewer resampling and reprojection artefacts.",
    "tags": [
      "spatial grids",
      "marine data",
      "coordinate reference systems",
      "GIS"
    ]
  },
  {
    "slug": "mpi-catchmapper-spatial-catch-mapping-2018",
    "title": "Forecasting quantity of displaced fishing. Part 2: CatchMapper – Mapping EEZ catch and effort",
    "year": "2018",
    "publisher": "Ministry for Primary Industries",
    "id": "29675",
    "series": "AEBR 200",
    "summary": "Describes CatchMapper, a spatial system for bringing together and mapping commercial fishing catch and effort information across New Zealand waters.",
    "tags": [
      "CatchMapper",
      "fisheries",
      "spatial database",
      "marine GIS"
    ]
  },
  {
    "slug": "mpi-hectors-dolphin-local-spatial-risk-2023",
    "title": "Local-scale spatial risk assessment of inshore commercial fisheries on Hector’s dolphins",
    "year": "2023",
    "publisher": "Ministry for Primary Industries",
    "id": "56332",
    "series": "AEBR 308",
    "summary": "Maps and assesses localised fisheries risk to Hector's and Māui dolphins using spatial fishing and species information.",
    "tags": [
      "Hector's dolphin",
      "Māui dolphin",
      "spatial risk",
      "fisheries"
    ]
  },
  {
    "slug": "mpi-fish-climate-spatiotemporal-distribution-2022",
    "title": "Climate change and the distribution of commercially caught marine fish species in New Zealand. Part 1: Spatio-temporal changes since 1989",
    "year": "2022",
    "publisher": "Ministry for Primary Industries",
    "id": "51745",
    "series": "AEBR 286",
    "summary": "Examines depth, temperature, length and geographic patterns in research and commercial catches to describe changes in the distribution of New Zealand fish species.",
    "tags": [
      "climate change",
      "fish distribution",
      "spatiotemporal analysis",
      "marine"
    ]
  },
  {
    "slug": "mpi-spatial-decision-support-bottom-fishing-2024",
    "title": "Exploration of a spatial decision-support tool for managing the impacts of bottom fishing on in-zone seafloor habitats",
    "year": "2024",
    "publisher": "Ministry for Primary Industries",
    "id": "64260",
    "series": "AEBR 336",
    "summary": "Uses spatial prioritisation software and scenario analysis to explore options for reducing bottom-fishing impacts on vulnerable seabed habitats and species.",
    "tags": [
      "spatial decision support",
      "marine habitats",
      "bottom fishing",
      "conservation planning"
    ]
  },
  {
    "slug": "mpi-spatial-benthic-impact-assessment-2024",
    "title": "Spatially explicit benthic impact assessments for bottom trawling in New Zealand",
    "year": "2024",
    "publisher": "Ministry for Primary Industries",
    "id": "61720",
    "series": "AEBR 329",
    "summary": "Develops a spatially explicit assessment of bottom-fishing effects on seabed environments in New Zealand fisheries areas.",
    "tags": [
      "benthic impact",
      "spatial assessment",
      "fisheries",
      "seabed"
    ]
  },
  {
    "slug": "mpi-spatial-risk-sharks-turtles-2023",
    "title": "Development of spatial fisheries risk assessment methods for sharks and turtles in New Zealand waters",
    "year": "2023",
    "publisher": "Ministry for Primary Industries",
    "id": "58438",
    "series": "AEBR 319",
    "summary": "Assesses the spatial distribution of fishing activity and associated risk to shark and turtle species in New Zealand fisheries.",
    "tags": [
      "sharks",
      "turtles",
      "spatial risk",
      "fisheries"
    ]
  },
  {
    "slug": "mpi-spatial-seabird-distribution-models-2022",
    "title": "Spatial distribution modelling for New Zealand seabirds at risk from commercial fisheries",
    "year": "2022",
    "publisher": "Ministry for Primary Industries",
    "id": "54454",
    "series": "AEBR 298",
    "summary": "Uses distribution modelling to map seabird exposure to commercial fishing activity and support fisheries risk assessment.",
    "tags": [
      "seabirds",
      "distribution modelling",
      "spatial risk",
      "fisheries"
    ]
  },
  {
    "slug": "mpi-spatiotemporal-inshore-fish-cephalopods-2023",
    "title": "Spatial-temporal distribution of inshore fish and cephalopod species of interest to selected top predators",
    "year": "2023",
    "publisher": "Ministry for Primary Industries",
    "id": "55807",
    "series": "AEBR 305",
    "summary": "Maps changes in the spatial and temporal distribution of inshore fish and cephalopod species from fisheries and biological observations.",
    "tags": [
      "inshore fisheries",
      "spatiotemporal analysis",
      "cephalopods",
      "distribution"
    ]
  },
  {
    "slug": "mpi-historical-set-net-effort-mapping-2022",
    "title": "Historical reconstruction and characterisation of spatially explicit historical set-net fishing effort data",
    "year": "2022",
    "publisher": "Ministry for Primary Industries",
    "id": "54658",
    "series": "AEBR 299",
    "summary": "Reconstructs historical set-net effort spatially to improve the evidence available for fisheries and protected-species management.",
    "tags": [
      "fishing effort",
      "historical mapping",
      "spatial reconstruction",
      "fisheries"
    ]
  },
  {
    "slug": "mpi-deepwater-shark-spatiotemporal-distribution-2021",
    "title": "Spatial and temporal distribution of seven deepwater sharks in New Zealand waters",
    "year": "2021",
    "publisher": "Ministry for Primary Industries",
    "id": "47827",
    "series": "AEBR 271",
    "summary": "Analyses spatial and temporal patterns in deepwater shark observations and catches to inform fisheries assessment.",
    "tags": [
      "deepwater sharks",
      "spatial distribution",
      "fisheries",
      "marine"
    ]
  },
  {
    "slug": "mpi-marine-mammal-spatial-risk-2022",
    "title": "Updated spatially explicit fisheries risk assessment for New Zealand marine mammal populations",
    "year": "2022",
    "publisher": "Ministry for Primary Industries",
    "id": "53301",
    "series": "AEBR 290",
    "summary": "Applies a multi-species spatial fisheries risk assessment to 54 marine mammal populations in New Zealand waters.",
    "tags": [
      "marine mammals",
      "spatial risk",
      "fisheries",
      "spatial modelling"
    ]
  },
  {
    "slug": "mpi-hectors-maui-dolphin-risk-2019",
    "title": "Spatial risk assessment of commercial fishing to Hector's and Māui dolphins",
    "year": "2019",
    "publisher": "Ministry for Primary Industries",
    "id": "35007",
    "series": "AEBR 214",
    "summary": "Combines spatial fishing activity and dolphin distribution to assess commercial-fisheries risk to Hector's and Māui dolphins.",
    "tags": [
      "dolphins",
      "fisheries",
      "spatial risk",
      "marine conservation"
    ]
  },
  {
    "slug": "mpi-auckland-islands-sea-lion-risk-2019",
    "title": "Spatial risk assessment for New Zealand sea lions at the Auckland Islands",
    "year": "2019",
    "publisher": "Ministry for Primary Industries",
    "id": "36375",
    "series": "AEBR 224",
    "summary": "Maps fisheries interactions and sea-lion distribution around the Auckland Islands to assess spatial patterns of risk.",
    "tags": [
      "sea lions",
      "Auckland Islands",
      "spatial risk",
      "fisheries"
    ]
  },
  {
    "slug": "mpi-marine-mammal-risk-sefra-2018",
    "title": "Marine mammal risk assessment for New Zealand commercial fisheries using SEFRA",
    "year": "2018",
    "publisher": "Ministry for Primary Industries",
    "id": "27163",
    "series": "AEBR 189",
    "summary": "Applies a spatially explicit fisheries risk-assessment approach to marine mammals in New Zealand commercial fisheries.",
    "tags": [
      "SEFRA",
      "marine mammals",
      "spatial risk",
      "fisheries"
    ]
  },
  {
    "slug": "mpi-spatial-benthic-population-models-2014",
    "title": "An initial development of spatially explicit population models of benthic impacts to inform Ecological Risk Assessments in New Zealand deepwater fisheries",
    "year": "2014",
    "publisher": "Ministry for Primary Industries",
    "id": "4254",
    "series": "AEBR 106",
    "summary": "Explores spatially explicit population modelling for benthic species to support fisheries assessment and marine management.",
    "tags": [
      "benthic species",
      "population modelling",
      "spatial models",
      "fisheries"
    ]
  },
  {
    "slug": "mpi-highly-migratory-species-distribution-2015",
    "title": "Factors affecting the distribution of highly migratory species in New Zealand waters",
    "year": "2015",
    "publisher": "Ministry for Primary Industries",
    "id": "5575",
    "series": "AEBR 146",
    "summary": "Compiles distribution information for highly migratory species to support spatial fisheries planning and assessment.",
    "tags": [
      "highly migratory species",
      "distribution mapping",
      "fisheries",
      "marine"
    ]
  },
  {
    "slug": "mpi-geographic-shark-ray-catches-2015",
    "title": "Geographic distribution of commercial catches of cartilaginous fishes in New Zealand waters, 2008–13",
    "year": "2015",
    "publisher": "Ministry for Primary Industries",
    "id": "9698",
    "series": "AEBR 156",
    "summary": "Maps commercial catch, fishing effort and catch-per-unit-effort for New Zealand shark, ray and chimaera species.",
    "tags": [
      "sharks",
      "rays",
      "catch mapping",
      "fisheries"
    ]
  },
  {
    "slug": "mpi-vulnerable-marine-ecosystem-spatial-options-2015",
    "title": "Developing spatial management options for the protection of vulnerable marine ecosystems in the South Pacific Ocean region",
    "year": "2015",
    "publisher": "Ministry for Primary Industries",
    "id": "9551",
    "series": "AEBR 155",
    "summary": "Examines spatial options for managing fishing interactions with vulnerable marine ecosystems and seabed habitats.",
    "tags": [
      "vulnerable marine ecosystems",
      "spatial management",
      "seabed",
      "fisheries"
    ]
  },
  {
    "slug": "mpi-bottom-contact-fishing-footprint-2021",
    "title": "The extent of bottom-contact fishing in New Zealand waters",
    "year": "2021",
    "publisher": "Ministry for Primary Industries",
    "id": "45028",
    "series": "AEBR 260",
    "summary": "Estimates the geographic footprint of bottom-contact fishing and its overlap with New Zealand marine environments.",
    "tags": [
      "fishing footprint",
      "spatial analysis",
      "seabed",
      "marine"
    ]
  },
  {
    "slug": "mpi-shark-turtle-spatial-distribution-models-2023",
    "title": "Development and testing of spatial distribution models for selected shark and turtle species",
    "year": "2023",
    "publisher": "Ministry for Primary Industries",
    "id": "56902",
    "series": "AEBR 311",
    "summary": "Tests spatial distribution modelling methods for selected sharks and a turtle species, with recommendations for future spatial fisheries-risk models.",
    "tags": [
      "distribution models",
      "sharks",
      "turtles",
      "spatial modelling"
    ]
  },
  {
    "slug": "mpi-chatham-campbell-habitat-suitability-2022",
    "title": "Assessing the utility of habitat suitability models developed for Chatham Rise when applied to Campbell Plateau",
    "year": "2022",
    "publisher": "Ministry for Primary Industries",
    "id": "50236",
    "series": "AEBR 281",
    "summary": "Tests how well habitat suitability models from Chatham Rise predict species and community distributions on Campbell Plateau.",
    "tags": [
      "habitat suitability",
      "Chatham Rise",
      "Campbell Plateau",
      "spatial modelling"
    ]
  },
  {
    "slug": "mpi-trawl-footprint-monitoring-2014",
    "title": "Monitoring New Zealand's trawl footprint for deepwater fisheries: 1989–90 to 2009–10",
    "year": "2014",
    "publisher": "Ministry for Primary Industries",
    "id": "4281",
    "series": "AEBR 110",
    "summary": "Maps the spatial and temporal distribution of deepwater bottom-contact trawling over 21 years, including effort by species, depth zone and habitat.",
    "tags": [
      "trawl footprint",
      "deepwater fisheries",
      "spatial mapping",
      "marine"
    ]
  },
  {
    "slug": "mpi-longfin-eel-gis-mapping-2016",
    "title": "GIS mapping of the longfin eel commercial fishery throughout New Zealand, and estimates of longfin habitat and proportion fished",
    "year": "2016",
    "publisher": "Ministry for Primary Industries",
    "id": "12687",
    "series": "FAR 2016/32",
    "summary": "Uses GIS to map commercial longfin eel fishing effort in rivers, lakes and harbours, and estimate the area and proportion of habitat fished.",
    "tags": [
      "GIS",
      "longfin eel",
      "freshwater",
      "fisheries mapping"
    ]
  },
  {
    "slug": "mpi-longfin-eel-spatial-assessment-2016",
    "title": "Feasibility of longfin eel stock assessment",
    "year": "2016",
    "publisher": "Ministry for Primary Industries",
    "id": "12684",
    "series": "FAR 2016/29",
    "summary": "Reviews stock-assessment options for longfin eel, including GIS-based approaches suited to fragmented populations and spatially variable data.",
    "tags": [
      "GIS",
      "longfin eel",
      "stock assessment",
      "spatial modelling"
    ]
  },
  {
    "slug": "mpi-ling-spatial-temporal-distribution-2015",
    "title": "Spatial and temporal distribution of ling in New Zealand",
    "year": "2015",
    "publisher": "Ministry for Primary Industries",
    "id": "5158",
    "series": "FAR 2015/03",
    "summary": "Analyses geographic and temporal patterns in ling catches and fisheries observations around New Zealand.",
    "tags": [
      "ling",
      "spatiotemporal analysis",
      "fisheries",
      "marine"
    ]
  },
  {
    "slug": "mfe-lucas-2020-land-use-map-methods-2024",
    "title": "Establishing New Zealand's LUCAS 2020 land-use map",
    "year": "2024",
    "publisher": "Ministry for the Environment",
    "sourceUrl": "https://environment.govt.nz/publications/establishing-new-zealands-lucas-2020-land-use-map/",
    "pdfUrl": "https://environment.govt.nz/assets/publications/land/Establishing-New-Zealands-LUCAS-2020-Land-Use-Map.pdf",
    "summary": "Documents methods for establishing the 2020 LUCAS land-use map, including national land-use classification and mapping.",
    "tags": [
      "LUCAS",
      "land-use mapping",
      "remote sensing",
      "national mapping"
    ]
  },
  {
    "slug": "mfe-deforestation-mapping-2017-2018-2020",
    "title": "Deforestation mapping 2017–2018",
    "year": "2020",
    "publisher": "Ministry for the Environment",
    "sourceUrl": "https://environment.govt.nz/publications/deforestation-mapping-2017-2018/",
    "pdfUrl": "https://environment.govt.nz/assets/publications/climate-change/2017-2018-deforestation-mapping-report-Lynker-Analytics-Consortium-1.pdf",
    "summary": "Describes the mapping process used to identify and quantify deforestation in New Zealand during 2017 and 2018.",
    "tags": [
      "deforestation",
      "land cover",
      "mapping",
      "remote sensing"
    ]
  },
  {
    "slug": "mfe-spatial-lake-water-quality-2019",
    "title": "Spatial modelling of lake water-quality state",
    "year": "2019",
    "publisher": "Ministry for the Environment",
    "sourceUrl": "https://environment.govt.nz/publications/spatial-modelling-of-lake-water-quality-state/",
    "pdfUrl": "https://environment.govt.nz/assets/Publications/Files/spatial-modelling-of-lake-water-quality-state.pdf",
    "summary": "Presents modelled spatial patterns in lake water quality to support freshwater environmental reporting.",
    "tags": [
      "spatial modelling",
      "lakes",
      "water quality",
      "environmental reporting"
    ]
  },
  {
    "slug": "mfe-spatial-river-water-quality-2016-2020",
    "title": "Spatial modelling of river water-quality state: 2016–2020",
    "year": "2022",
    "publisher": "Ministry for the Environment",
    "sourceUrl": "https://environment.govt.nz/publications/spatial-modelling-of-river-water-quality-state/",
    "pdfUrl": "https://environment.govt.nz/assets/publications/spatial-modelling-river-quality.pdf",
    "summary": "Maps modelled river water-quality state across New Zealand using monitoring data from 2016 to 2020.",
    "tags": [
      "spatial modelling",
      "rivers",
      "water quality",
      "environmental reporting"
    ]
  },
  {
    "slug": "mfe-highly-erodible-land-data-update-2024",
    "title": "Update to highly erodible land and estimated long-term soil erosion datasets for environmental reporting",
    "year": "2024",
    "publisher": "Ministry for the Environment",
    "sourceUrl": "https://environment.govt.nz/publications/update-to-highly-erodible-land-and-estimated-long-term-soil-erosion-data-sets-for-environmental-reporting/",
    "pdfUrl": "https://environment.govt.nz/assets/publications/Environmental-Reporting/Update-to-highly-erodible-land-and-estimated-long-term-soil-erosion-data-sets-for-environmental-reporting-2.pdf",
    "summary": "Documents updated national spatial datasets for highly erodible land and estimated long-term soil erosion used in environmental reporting.",
    "tags": [
      "soil erosion",
      "spatial datasets",
      "land mapping",
      "environmental reporting"
    ]
  },
  {
    "slug": "mfe-wetland-spatial-framework-2018",
    "title": "Considering a future spatial framework for wetland mapping and monitoring in New Zealand",
    "year": "2018",
    "publisher": "Ministry for the Environment",
    "sourceUrl": "https://environment.govt.nz/publications/considering-a-future-spatial-framework-for-wetland-mapping-and-monitoring-in-new-zealand/",
    "pdfUrl": "https://environment.govt.nz/assets/Publications/Files/Considering-a-future-spatial-framework-for-wetland-mapping-and-monitoring-in-New-Zealand.pdf",
    "summary": "Proposes a spatial framework for consistent wetland mapping and monitoring across New Zealand.",
    "tags": [
      "wetlands",
      "spatial framework",
      "mapping",
      "monitoring"
    ]
  },
  {
    "slug": "mfe-wetland-mapping-proof-of-concept-2021",
    "title": "Wetland mapping methods: proof of concept",
    "year": "2021",
    "publisher": "Ministry for the Environment",
    "sourceUrl": "https://environment.govt.nz/publications/wetland-mapping-methods-proof-of-concept/",
    "pdfUrl": "https://environment.govt.nz/assets/publications/Wetland-mapping-methods-proof-of-concept.pdf",
    "summary": "Tests practical methods for identifying and mapping wetlands using geospatial data and remote sensing.",
    "tags": [
      "wetlands",
      "mapping methods",
      "remote sensing",
      "GIS"
    ]
  },
  {
    "slug": "mfe-wetland-mapping-literature-review-2021",
    "title": "Wetland mapping methods review: discovery approach",
    "year": "2021",
    "publisher": "Ministry for the Environment",
    "sourceUrl": "https://environment.govt.nz/publications/wetland-mapping-methods-review-discovery-approach/",
    "pdfUrl": "https://environment.govt.nz/assets/publications/Wetland-mapping-methods-review-discovery-approach.pdf",
    "summary": "Reviews methods and evidence for discovering, classifying and mapping wetlands using spatial information.",
    "tags": [
      "wetlands",
      "mapping",
      "literature review",
      "spatial data"
    ]
  },
  {
    "slug": "mfe-protected-areas-network-nz-phase-1-2024",
    "title": "Protected Areas Network of New Zealand: Phase I methodology review",
    "year": "2024",
    "publisher": "Ministry for the Environment",
    "sourceUrl": "https://environment.govt.nz/publications/protected-areas-network-of-new-zealand-phase-i-methodology-review/",
    "pdfUrl": "https://environment.govt.nz/assets/publications/land/Protected-Areas-Network-of-NZ-report.pdf",
    "summary": "Reviews methodology for developing a national protected-areas network map and associated spatial analyses.",
    "tags": [
      "protected areas",
      "national mapping",
      "spatial analysis",
      "conservation"
    ]
  },
  {
    "slug": "mfe-protected-areas-network-nz-phase-2-2024",
    "title": "Protected Areas Network of New Zealand: Phase II stakeholder engagement",
    "year": "2024",
    "publisher": "Ministry for the Environment",
    "sourceUrl": "https://environment.govt.nz/publications/protected-areas-network-of-new-zealand-phase-ii-stakeholder-engagement/",
    "pdfUrl": "https://environment.govt.nz/assets/publications/land/Protected-Areas-Network-of-NZ-report-phase-II.pdf",
    "summary": "Reports stakeholder engagement on the national Protected Areas Network mapping project and its spatial framework.",
    "tags": [
      "protected areas",
      "national mapping",
      "spatial framework",
      "conservation"
    ]
  },
  {
    "slug": "mfe-high-risk-agricultural-activities-mapping-2019",
    "title": "Identification of high-risk agricultural activities on hill-country land",
    "year": "2019",
    "publisher": "Ministry for the Environment",
    "sourceUrl": "https://environment.govt.nz/publications/identification-of-high-risk-agricultural-activities-on-hill-country-land/",
    "pdfUrl": "https://environment.govt.nz/assets/Publications/Files/identification-of-high-risk-agricultural-activities-on-hill-country-land.pdf",
    "summary": "Uses a national map of winter cropping and intensive grazing on hill country to identify high-risk agricultural activities.",
    "tags": [
      "national mapping",
      "agriculture",
      "land use",
      "GIS"
    ]
  },
  {
    "slug": "mfe-deforestation-mapping-2019-2020-2023",
    "title": "Deforestation mapping 2019 and 2020: technical report",
    "year": "2023",
    "publisher": "Ministry for the Environment",
    "sourceUrl": "https://environment.govt.nz/publications/deforestation-mapping-2019-and-2020-technical-report/",
    "pdfUrl": "https://environment.govt.nz/assets/publications/Deforestation-mapping-2019-and-2020-technical-report.pdf",
    "summary": "Describes the methods and spatial data used to map New Zealand deforestation during 2019 and 2020.",
    "tags": [
      "deforestation",
      "land cover",
      "mapping",
      "remote sensing"
    ]
  },
  {
    "slug": "doc-benthic-terrain-modeller-2022",
    "title": "Using Benthic Terrain Modeller to characterise Aotearoa New Zealand seafloor geomorphology",
    "year": "2022",
    "publisher": "Department of Conservation",
    "pdfUrl": "https://www.doc.govt.nz/globalassets/documents/science-and-technical/drds367entire.pdf",
    "summary": "Demonstrates terrain-analysis tools for describing seafloor geomorphology and habitat from bathymetric data around New Zealand.",
    "tags": [
      "benthic terrain",
      "marine mapping",
      "bathymetry",
      "remote sensing"
    ]
  },
  {
    "slug": "doc-aerial-remote-sensing-wilding-conifers-2020",
    "title": "Use of aerial remote sensing to detect pre-coning wilding conifers in a dry grassland environment",
    "year": "2020",
    "publisher": "Department of Conservation",
    "pdfUrl": "https://www.doc.govt.nz/globalassets/documents/science-and-technical/drds364entire.pdf",
    "summary": "Tests very-high-resolution RGB and multispectral imagery to detect wilding conifers and map their locations in the Mackenzie Basin.",
    "tags": [
      "remote sensing",
      "multispectral imagery",
      "vegetation mapping",
      "Mackenzie Basin"
    ]
  },
  {
    "slug": "doc-uav-dune-vegetation-mapping-2019",
    "title": "Assessing the use of UAV-collected data for characterising sand-dune vegetation cover types at Kaitorete Spit",
    "year": "2019",
    "publisher": "Department of Conservation",
    "pdfUrl": "https://www.doc.govt.nz/globalassets/documents/science-and-technical/drds359entire.pdf",
    "summary": "Evaluates UAV imagery for mapping the distribution and frequency of sand-dune vegetation cover types at Kaitorete Spit.",
    "tags": [
      "UAV",
      "remote sensing",
      "dune vegetation",
      "mapping"
    ]
  },
  {
    "slug": "doc-gis-wildlife-management-2008",
    "title": "Geographic Information Systems in wildlife management",
    "year": "2008",
    "publisher": "Department of Conservation",
    "pdfUrl": "https://www.doc.govt.nz/globalassets/documents/science-and-technical/drds303entire.pdf",
    "summary": "Introduces GIS concepts and their application to mapping wildlife distributions, habitat use and management decisions.",
    "tags": [
      "GIS",
      "wildlife management",
      "mapping",
      "spatial analysis"
    ]
  },
  {
    "slug": "doc-lcdb2-wetlands-wellington-2014",
    "title": "How well does LCDB2 map wetlands in the Wellington region?",
    "year": "2014",
    "publisher": "Department of Conservation",
    "pdfUrl": "https://www.doc.govt.nz/globalassets/documents/science-and-technical/drds341entire.pdf",
    "summary": "Evaluates the accuracy of the Land Cover Database for representing wetlands in the Wellington region.",
    "tags": [
      "LCDB",
      "wetland mapping",
      "land cover",
      "accuracy assessment"
    ]
  },
  {
    "slug": "doc-intertidal-benthic-habitats-kawhia-aotea-2011",
    "title": "Intertidal benthic habitats of Kawhia and Aotea Harbours",
    "year": "2011",
    "publisher": "Department of Conservation",
    "pdfUrl": "https://www.doc.govt.nz/globalassets/documents/science-and-technical/drds327lowres.pdf",
    "summary": "Maps and describes intertidal benthic habitats in Kawhia and Aotea Harbours to support marine conservation.",
    "tags": [
      "habitat mapping",
      "marine GIS",
      "Kawhia",
      "Aotea"
    ]
  },
  {
    "slug": "doc-land-use-pressures-stream-integrity-2011",
    "title": "Relationships between multiple land-use pressures and stream ecological integrity",
    "year": "2011",
    "publisher": "Department of Conservation",
    "pdfUrl": "https://www.doc.govt.nz/globalassets/documents/science-and-technical/drds326lowres.pdf",
    "summary": "Analyses the relationships between mapped land-use pressures and ecological integrity in New Zealand streams.",
    "tags": [
      "land use",
      "spatial analysis",
      "streams",
      "ecology"
    ]
  },
  {
    "slug": "doc-maui-dolphin-distribution-2010",
    "title": "Distribution of Māui dolphin (Cephalorhynchus hectori maui) 2000–2009",
    "year": "2010",
    "publisher": "Department of Conservation",
    "pdfUrl": "https://www.doc.govt.nz/globalassets/documents/science-and-technical/drds322.pdf",
    "summary": "Compiles distribution evidence for Māui dolphin during 2000–2009 to inform marine spatial planning and conservation.",
    "tags": [
      "Māui dolphin",
      "distribution mapping",
      "marine conservation",
      "spatial data"
    ]
  },
  {
    "slug": "doc-waterbirds-rotorua-lakes-distribution-2014",
    "title": "Abundance and distribution of water birds on Rotorua lakes, 1985–2011",
    "year": "2014",
    "publisher": "Department of Conservation",
    "pdfUrl": "https://www.doc.govt.nz/globalassets/documents/science-and-technical/drds343entire.pdf",
    "summary": "Summarises long-term waterbird abundance and distribution patterns across the Rotorua lakes.",
    "tags": [
      "bird distribution",
      "Rotorua lakes",
      "spatial ecology",
      "monitoring"
    ]
  },
  {
    "slug": "doc-braided-river-bird-counts-spatial-uncertainty-2010",
    "title": "Sources of uncertainty in estimating bird counts from braided river surveys",
    "year": "2010",
    "publisher": "Department of Conservation",
    "pdfUrl": "https://www.doc.govt.nz/globalassets/documents/science-and-technical/drds311entire.pdf",
    "summary": "Examines how survey design and spatial coverage affect estimates of bird populations on braided rivers.",
    "tags": [
      "survey design",
      "spatial sampling",
      "braided rivers",
      "birds"
    ]
  },
  {
    "slug": "auckland-albert-eden-canopy-analysis-2021",
    "title": "Albert-Eden Local Board ngahere analysis update 2021: canopy cover changes with the 2013 to 2016/2018 LiDAR data",
    "year": "2021",
    "publisher": "Auckland Council · Knowledge Auckland",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/2248/albert-eden-canopy-analysis-report-2021.pdf",
    "summary": "Reports LiDAR-based canopy cover mapping and changes for Auckland Council's Albert-Eden Local Board, using 2013 and 2016/2018 data.",
    "tags": [
      "LiDAR",
      "canopy cover",
      "urban forest",
      "Auckland",
      "local board"
    ]
  },
  {
    "slug": "auckland-howick-canopy-analysis-2021",
    "title": "Howick Local Board ngahere analysis update 2021: canopy cover changes with the 2013 to 2016/2018 LiDAR data",
    "year": "2021",
    "publisher": "Auckland Council · Knowledge Auckland",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/2250/howick-canopy-analysis-report-2021.pdf",
    "summary": "Reports LiDAR-based canopy cover mapping and changes for Auckland Council's Howick Local Board, using 2013 and 2016/2018 data.",
    "tags": [
      "LiDAR",
      "canopy cover",
      "urban forest",
      "Auckland",
      "local board"
    ]
  },
  {
    "slug": "auckland-hibiscus-bays-canopy-analysis-2021",
    "title": "Hibiscus and Bays Local Board ngahere analysis update 2021: canopy cover changes with the 2013 to 2016/2018 LiDAR data",
    "year": "2021",
    "publisher": "Auckland Council · Knowledge Auckland",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/2252/hibiscus-and-bays-canopy-analysis-report-2021.pdf",
    "summary": "Reports LiDAR-based canopy cover mapping and changes for Auckland Council's Hibiscus and Bays Local Board, using 2013 and 2016/2018 data.",
    "tags": [
      "LiDAR",
      "canopy cover",
      "urban forest",
      "Auckland",
      "local board"
    ]
  },
  {
    "slug": "auckland-kaipatiki-canopy-analysis-2021",
    "title": "Kaipātiki Local Board ngahere analysis update 2021: canopy cover changes with the 2013 to 2016/2018 LiDAR data",
    "year": "2021",
    "publisher": "Auckland Council · Knowledge Auckland",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/2254/kaip%C4%81tiki-canopy-analysis-report-2021.pdf",
    "summary": "Reports LiDAR-based canopy cover mapping and changes for Auckland Council's Kaipātiki Local Board, using 2013 and 2016/2018 data.",
    "tags": [
      "LiDAR",
      "canopy cover",
      "urban forest",
      "Auckland",
      "local board"
    ]
  },
  {
    "slug": "auckland-mangere-otahuhu-canopy-analysis-2021",
    "title": "Māngere-Ōtāhuhu Local Board ngahere analysis update 2021: canopy cover changes with the 2013 to 2016/2018 LiDAR data",
    "year": "2021",
    "publisher": "Auckland Council · Knowledge Auckland",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/2256/m%C4%81ngere-%C5%8Dt%C4%81huhu-canopy-analysis-report-2021.pdf",
    "summary": "Reports LiDAR-based canopy cover mapping and changes for Auckland Council's Māngere-Ōtāhuhu Local Board, using 2013 and 2016/2018 data.",
    "tags": [
      "LiDAR",
      "canopy cover",
      "urban forest",
      "Auckland",
      "local board"
    ]
  },
  {
    "slug": "auckland-maungakiekie-tamaki-canopy-analysis-2021",
    "title": "Maungakiekie-Tāmaki Local Board ngahere analysis update 2021: canopy cover changes with the 2013 to 2016/2018 LiDAR data",
    "year": "2021",
    "publisher": "Auckland Council · Knowledge Auckland",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/2260/maungakiekie-t%C4%81maki-canopy-analysis-report-2021.pdf",
    "summary": "Reports LiDAR-based canopy cover mapping and changes for Auckland Council's Maungakiekie-Tāmaki Local Board, using 2013 and 2016/2018 data.",
    "tags": [
      "LiDAR",
      "canopy cover",
      "urban forest",
      "Auckland",
      "local board"
    ]
  },
  {
    "slug": "auckland-otara-papatoetoe-canopy-analysis-2021",
    "title": "Ōtara-Papatoetoe Local Board ngahere analysis update 2021: canopy cover changes with the 2013 to 2016/2018 LiDAR data",
    "year": "2021",
    "publisher": "Auckland Council · Knowledge Auckland",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/2262/%C5%8Dtara-papatoetoe-canopy-analysis-report-2021.pdf",
    "summary": "Reports LiDAR-based canopy cover mapping and changes for Auckland Council's Ōtara-Papatoetoe Local Board, using 2013 and 2016/2018 data.",
    "tags": [
      "LiDAR",
      "canopy cover",
      "urban forest",
      "Auckland",
      "local board"
    ]
  },
  {
    "slug": "auckland-puketapapa-canopy-analysis-2021",
    "title": "Puketāpapa Local Board ngahere analysis update 2021: canopy cover changes with the 2013 to 2016/2018 LiDAR data",
    "year": "2021",
    "publisher": "Auckland Council · Knowledge Auckland",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/2263/puket%C4%81papa-canopy-analysis-report-2021.pdf",
    "summary": "Reports LiDAR-based canopy cover mapping and changes for Auckland Council's Puketāpapa Local Board, using 2013 and 2016/2018 data.",
    "tags": [
      "LiDAR",
      "canopy cover",
      "urban forest",
      "Auckland",
      "local board"
    ]
  },
  {
    "slug": "auckland-waitemata-canopy-analysis-2021",
    "title": "Waitematā Local Board ngahere analysis update 2021: canopy cover changes with the 2013 to 2016/2018 LiDAR data",
    "year": "2021",
    "publisher": "Auckland Council · Knowledge Auckland",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/2266/waitemat%C4%81-canopy-analysis-report-2021.pdf",
    "summary": "Reports LiDAR-based canopy cover mapping and changes for Auckland Council's Waitematā Local Board, using 2013 and 2016/2018 data.",
    "tags": [
      "LiDAR",
      "canopy cover",
      "urban forest",
      "Auckland",
      "local board"
    ]
  },
  {
    "slug": "auckland-cyclone-gabrielle-bare-earth-mapping-2024",
    "title": "Mapping bare-earth areas from Cyclone Gabrielle 2023: data quality, accuracy and development report",
    "year": "2024",
    "publisher": "Auckland Council · Knowledge Auckland",
    "sourceUrl": "https://knowledgeauckland.org.nz/publications/mapping-bare-earth-areas-from-cyclone-gabrielle-2023-data-quality-accuracy-and-development-report/",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/weffpnma/mapping-bare-earth-areas-from-cyclone-gabrielle-2023-auckland-lynker-analytics-zealandia-consulting-june-2024.pdf",
    "summary": "Describes the development and quality assessment of bare-earth mapping for areas affected by Cyclone Gabrielle in Auckland.",
    "tags": [
      "Cyclone Gabrielle",
      "LiDAR",
      "bare-earth mapping",
      "data quality"
    ]
  },
  {
    "slug": "auckland-unsealed-roads-data-quality-2024",
    "title": "Auckland unsealed roads: data quality and accuracy report",
    "year": "2024",
    "publisher": "Auckland Council · Knowledge Auckland",
    "sourceUrl": "https://knowledgeauckland.org.nz/publications/auckland-council-unsealed-roads-data-quality-accuracy-and-summary-report/",
    "pdfUrl": "https://www.knowledgeauckland.org.nz/media/aq4f5zml/auckland-council-unsealed-roads-lynker-analytics-march-2024.pdf",
    "summary": "Assesses the accuracy and quality of Auckland's mapped unsealed-road data.",
    "tags": [
      "roads",
      "geospatial data quality",
      "Auckland",
      "mapping"
    ]
  },
  {
    "slug": "auckland-coastal-inundation-sea-level-rise-2023",
    "title": "Coastal inundation from sea-level rise: Auckland region",
    "year": "2023",
    "publisher": "Auckland Council · Knowledge Auckland",
    "sourceUrl": "https://knowledgeauckland.org.nz/publications/coastal-inundation-from-sea-level-rise-auckland-region/",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/15rl4zqz/coastal-inundation-from-sea-level-rise-auckland-region-niwa-nov-2023.pdf",
    "summary": "Maps potential coastal inundation across the Auckland region under sea-level-rise scenarios.",
    "tags": [
      "coastal mapping",
      "sea-level rise",
      "hazards",
      "Auckland"
    ]
  },
  {
    "slug": "auckland-hauraki-gulf-habitat-geospatial-2024",
    "title": "Central Hauraki Gulf habitat mapping and geospatial classifications",
    "year": "2024",
    "publisher": "Auckland Council · Knowledge Auckland",
    "sourceUrl": "https://knowledgeauckland.org.nz/publications/central-hauraki-gulf-habitat-mapping-and-geospatial-classifications/",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/3k2h4snh/tr2024-12-central-hauraki-gulf-habitat-mapping-geospatial-classifications-niwa-2024.pdf",
    "summary": "Provides mapped habitat information and geospatial classifications for the central Hauraki Gulf.",
    "tags": [
      "habitat mapping",
      "geospatial classification",
      "marine",
      "Hauraki Gulf"
    ]
  },
  {
    "slug": "auckland-urban-heat-assessment-2024",
    "title": "Auckland urban heat assessment: summary",
    "year": "2024",
    "publisher": "Auckland Council · Knowledge Auckland",
    "sourceUrl": "https://knowledgeauckland.org.nz/publications/auckland-urban-heat-assessment/",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/wtjbt4n5/auckland-urban-heat-assessment-summary-auckland-council-oct-2024.pdf",
    "summary": "Summarises spatial assessment of urban heat patterns across Auckland to inform urban planning and resilience.",
    "tags": [
      "urban heat",
      "spatial analysis",
      "Auckland",
      "climate"
    ]
  },
  {
    "slug": "canterbury-lidar-aerial-imagery-christchurch-2018",
    "title": "Monitoring land-cover change with LiDAR and aerial imagery in Christchurch, New Zealand",
    "year": "2018",
    "publisher": "University of Canterbury Research Repository",
    "sourceUrl": "https://ir.canterbury.ac.nz/items/3dd08679-6b82-4ef3-b564-ff2fd22e9ebe",
    "pdfUrl": "https://ir.canterbury.ac.nz/bitstreams/3b573ff7-817b-41ae-9755-3a29573066f1/download",
    "summary": "Research thesis using LiDAR and aerial imagery to monitor land-cover change in Christchurch.",
    "tags": [
      "LiDAR",
      "aerial imagery",
      "land cover",
      "Christchurch"
    ]
  },
  {
    "slug": "canterbury-kauri-remote-sensing-lidar-2020",
    "title": "New Zealand kauri trees: identification and canopy stress analysis with optical remote sensing and LiDAR data",
    "year": "2020",
    "publisher": "University of Canterbury Research Repository",
    "sourceUrl": "https://ir.canterbury.ac.nz/items/6880e912-5cb4-4f97-b42b-4022136a566d",
    "pdfUrl": "https://ir.canterbury.ac.nz/bitstreams/fd47d54f-d779-45cb-975d-a6b010651bb0/download",
    "summary": "Combines optical remote sensing and LiDAR to identify kauri and analyse canopy stress.",
    "tags": [
      "remote sensing",
      "LiDAR",
      "kauri",
      "forest mapping"
    ]
  },
  {
    "slug": "aut-ahipara-land-cover-remote-sensing-gis-2012",
    "title": "Remote sensing and GIS models-based approach to land-cover classification on Ahipara Gumfields",
    "year": "2012",
    "publisher": "Auckland University of Technology Research Repository",
    "sourceUrl": "https://openrepository.aut.ac.nz/items/4c932863-f52f-4a3e-9ae9-45e7645246ec",
    "pdfUrl": "https://openrepository.aut.ac.nz/bitstreams/977568f0-8094-4b25-9ab1-3aa1edbecbbf/download",
    "summary": "Applies remote sensing and GIS models to classify land cover at the Ahipara Gumfields.",
    "tags": [
      "GIS",
      "remote sensing",
      "land-cover classification",
      "Ahipara"
    ]
  },
  {
    "slug": "aut-uav-sand-dune-vegetation-karekare-2022",
    "title": "Sand-dune vegetation monitoring and assessment using UAV remote sensing at Karekare",
    "year": "2022",
    "publisher": "Auckland University of Technology Research Repository",
    "sourceUrl": "https://openrepository.aut.ac.nz/items/09542e83-74a4-4d3b-b318-793813d4e1b1",
    "pdfUrl": "https://openrepository.aut.ac.nz/bitstreams/6334e48f-1823-4793-9412-3a39daaa1f20/download",
    "summary": "Uses UAV remote sensing to monitor and assess sand-dune vegetation at Karekare.",
    "tags": [
      "UAV",
      "remote sensing",
      "dune vegetation",
      "Karekare"
    ]
  },
  {
    "slug": "aut-southland-coastline-uav-satellite-2022",
    "title": "Using historic satellite and 3D UAV imagery to map the dynamics of the coast at sites with anthropogenic debris in Southland, New Zealand",
    "year": "2022",
    "publisher": "Auckland University of Technology Research Repository",
    "sourceUrl": "https://openrepository.aut.ac.nz/items/17e3daab-8246-4738-bbbd-8f6c6716133b",
    "pdfUrl": "https://openrepository.aut.ac.nz/server/api/core/bitstreams/a667624a-c4e2-4fb7-b350-8790409f843f/content",
    "summary": "Compares historical satellite imagery and 3D UAV data to assess coastline change in Southland.",
    "tags": [
      "coastal change",
      "satellite imagery",
      "UAV",
      "Southland"
    ]
  },
  {
    "slug": "waikato-wetland-remote-sensing-whangape-2021",
    "title": "Remote sensing of wetlands in the Lake Whangape catchment",
    "year": "2021",
    "publisher": "University of Waikato Research Commons",
    "sourceUrl": "https://researchcommons.waikato.ac.nz/entities/publication/c58bbe97-8be6-4086-a153-9f0af678904b",
    "pdfUrl": "https://researchcommons.waikato.ac.nz/bitstreams/11de2123-158d-4fdf-a1a9-7af6ba25104f/download",
    "summary": "Uses remote sensing to investigate and map wetlands in the Lake Whangape catchment.",
    "tags": [
      "remote sensing",
      "wetlands",
      "Lake Whangape",
      "mapping"
    ]
  },
  {
    "slug": "massey-remote-sensing-gis-westland-1995",
    "title": "An investigation of remote sensing and GIS for resource management in Westland, New Zealand",
    "year": "1995",
    "publisher": "Massey Research Online",
    "sourceUrl": "https://mro.massey.ac.nz/items/9cd2dad3-14f8-437a-bf21-62f326244309",
    "pdfUrl": "https://mro.massey.ac.nz/bitstreams/30d2b9af-a1eb-490e-b4be-c27bd80df986/download",
    "summary": "Early New Zealand thesis investigating remote sensing and GIS applications for resource management in Westland.",
    "tags": [
      "remote sensing",
      "GIS",
      "resource management",
      "Westland"
    ]
  },
  {
    "slug": "massey-gis-water-budget-horowhenua-2011",
    "title": "GIS coupled water-budget modelling for Horowhenua",
    "year": "2011",
    "publisher": "Massey Research Online",
    "sourceUrl": "https://mro.massey.ac.nz/items/24da0b53-83a5-4c6e-a676-f592c5e46fc6",
    "pdfUrl": "https://mro.massey.ac.nz/bitstreams/1c646af8-ff8c-4571-9908-c986355d2d18/download",
    "summary": "Uses GIS-linked water-budget modelling to analyse hydrology and water resources in Horowhenua.",
    "tags": [
      "GIS",
      "hydrology",
      "water budget",
      "Horowhenua"
    ]
  },
  {
    "slug": "mpi-climate-change-fish-distribution-predictions-2022",
    "title": "Climate change and the distribution of commercially caught marine fish species in New Zealand. Part 2: Predicting changes in distribution",
    "year": "2022",
    "publisher": "Ministry for Primary Industries",
    "id": "51751",
    "series": "AEBR 287",
    "summary": "Models potential climate-driven redistribution of commercially caught fish using historical trawl catches and New Zealand climate hindcasts and forecasts.",
    "tags": [
      "climate change",
      "fish distribution",
      "spatial modelling",
      "marine"
    ]
  },
  {
    "slug": "mpi-biogenic-habitats-national-survey-2018",
    "title": "Biogenic habitats on New Zealand’s continental shelf. Part II: National field survey and analysis",
    "year": "2018",
    "publisher": "Ministry for Primary Industries",
    "id": "30627",
    "series": "AEBR 202",
    "summary": "Reports a national survey of biogenic habitats, describing habitat-forming species, invertebrate communities and associated fish communities at selected sites and depths.",
    "tags": [
      "marine habitat mapping",
      "biodiversity",
      "continental shelf",
      "survey"
    ]
  },
  {
    "slug": "mpi-hauraki-gulf-trawl-corridors-spatial-tools-2023",
    "title": "Exploring the use of spatial decision-support tools to identify trawl corridors in the Hauraki Gulf Marine Park",
    "year": "2023",
    "publisher": "Ministry for Primary Industries",
    "id": "55972",
    "series": "AEBR 306",
    "summary": "Models biogenic habitat distributions and explores spatial decision-support scenarios for identifying trawl corridors in the Hauraki Gulf Marine Park.",
    "tags": [
      "spatial decision support",
      "Hauraki Gulf",
      "trawl corridors",
      "habitat modelling"
    ]
  },
  {
    "slug": "mpi-bottom-contact-effort-spatial-analysis-2023",
    "title": "Extent and intensity of bottom contact by commercial trawling and shellfish dredging in New Zealand waters, 1990–2021",
    "year": "2023",
    "publisher": "Ministry for Primary Industries",
    "id": "57907",
    "series": "AEBR 316",
    "summary": "Maps and analyses spatial bottom-contact effort by commercial trawl and shellfish dredge vessels across New Zealand waters.",
    "tags": [
      "bottom contact",
      "spatial analysis",
      "fishing effort",
      "marine"
    ]
  },
  {
    "slug": "mpi-snapper-longline-spatial-cpue-2016",
    "title": "An update of longline catch-per-unit-effort indices for snapper in SNA 1",
    "year": "2016",
    "publisher": "Ministry for Primary Industries",
    "id": "14575",
    "series": "FAR 2016/59",
    "summary": "Updates snapper longline CPUE indices and examines location-based data that show spatial changes in the Hauraki Gulf fishery.",
    "tags": [
      "snapper",
      "spatial distribution",
      "fisheries",
      "Hauraki Gulf"
    ]
  },
  {
    "slug": "linz-geospatial-education-aotearoa-2023",
    "title": "Geospatial education provision in Aotearoa New Zealand",
    "year": "2023",
    "publisher": "Toitū Te Whenua Land Information New Zealand",
    "sourceUrl": "https://www.linz.govt.nz/our-work/location-information/geospatial-capability/studying-gis",
    "pdfUrl": "https://www.linz.govt.nz/sites/default/files/doc/geospatial_education_provision_in_aotearoa_nz.pdf",
    "summary": "Reviews geospatial education provision and trends in New Zealand, including tertiary geospatial courses and international comparisons.",
    "tags": [
      "geospatial education",
      "GIS",
      "New Zealand",
      "spatial workforce"
    ]
  },
  {
    "slug": "linz-geospatial-industry-profile-survey-2023",
    "title": "New Zealand Geospatial Industry Profile Survey 2023",
    "year": "2023",
    "publisher": "Toitū Te Whenua Land Information New Zealand",
    "sourceUrl": "https://www.linz.govt.nz/our-work/location-information/geospatial-capability/working-new-zealands-geospatial-industry/new-zealand-geospatial-industry-profile-survey",
    "pdfUrl": "https://www.linz.govt.nz/sites/default/files/doc/GISS%20Report%202023.pdf",
    "summary": "Establishes a baseline profile of New Zealand's geospatial industry from a 2023 survey covering employment, education and workforce characteristics.",
    "tags": [
      "geospatial industry",
      "GIS workforce",
      "survey",
      "New Zealand"
    ]
  },
  {
    "slug": "linz-priority-geospatial-data-plan-2019-2020",
    "title": "Key datasets for resilience and climate change: data improvement plan 2019/20",
    "year": "2019",
    "publisher": "Toitū Te Whenua Land Information New Zealand",
    "pdfUrl": "https://www.linz.govt.nz/sites/default/files/key_datasets_for_resilience_and_climate_change_-_data_improvement_plan_2019_20.pdf",
    "summary": "Sets priorities for improving key national geographic datasets, including LiDAR, addresses, roads, imagery, coastline and river networks.",
    "tags": [
      "geospatial data",
      "LiDAR",
      "national datasets",
      "resilience"
    ]
  },
  {
    "slug": "linz-priority-geospatial-data-plan-2020-2021",
    "title": "Key datasets for resilience and climate change: priority data improvement plan 2020/21",
    "year": "2020",
    "publisher": "Toitū Te Whenua Land Information New Zealand",
    "pdfUrl": "https://www.linz.govt.nz/sites/default/files/key_datasets_for_resilience_and_climate_change_-_priority_data_improvement_plan_2020_21.pdf",
    "summary": "Records national geospatial data priorities for 2020/21, including LiDAR, imagery, address, property, topographic, coastline and river data.",
    "tags": [
      "geospatial data",
      "LiDAR",
      "national datasets",
      "resilience"
    ]
  },
  {
    "slug": "linz-priority-geospatial-data-plan-2021-2022",
    "title": "Key datasets for resilience and climate change: priority data improvement plan 2021/22",
    "year": "2021",
    "publisher": "Toitū Te Whenua Land Information New Zealand",
    "pdfUrl": "https://www.linz.govt.nz/sites/default/files/key_datasets_for_resilience_and_climate_change_-_priority_data_improvement_plan_2021_22.pdf",
    "summary": "Reviews progress on national key geographic datasets and identifies the next round of data improvements for resilience and emergency management.",
    "tags": [
      "geospatial data",
      "national datasets",
      "resilience",
      "emergency management"
    ]
  },
  {
    "slug": "linz-priority-geospatial-data-plan-2022-2023",
    "title": "Key datasets for resilience and climate change: priority data improvement plan 2022/23",
    "year": "2022",
    "publisher": "Toitū Te Whenua Land Information New Zealand",
    "pdfUrl": "https://www.linz.govt.nz/sites/default/files/2022-10/Key%20datasets%20for%20resilience%20and%20climate%20change%20-%20Priority%20data%20improvement%20plan%202022_23.pdf",
    "summary": "Sets agency priorities for national spatial datasets, including open LiDAR, transport networks, property boundaries, population grids, imagery and river classifications.",
    "tags": [
      "spatial datasets",
      "LiDAR",
      "national mapping",
      "resilience"
    ]
  },
  {
    "slug": "linz-priority-geospatial-data-plan-2023-2024",
    "title": "Key datasets for resilience and climate change: priority data improvement plan 2023/24",
    "year": "2023",
    "publisher": "Toitū Te Whenua Land Information New Zealand",
    "pdfUrl": "https://www.linz.govt.nz/sites/default/files/doc/Key%20datasets%20for%20resilience%20and%20climate%20change%20-%20Priority%20data%20improvement%20plan%202023_24.pdf",
    "summary": "Documents geospatial data priorities for resilience after the 2023 Auckland floods and Cyclone Gabrielle, covering people, property, transport, rivers, places, land and coasts.",
    "tags": [
      "geospatial data",
      "resilience",
      "Cyclone Gabrielle",
      "national datasets"
    ]
  },
  {
    "slug": "mfe-inherent-biophysical-risk-mapping-2024",
    "title": "Inherent biophysical risk mapping manual and methodology: working document",
    "year": "2024",
    "publisher": "Ministry for the Environment · Bay of Plenty Regional Council",
    "sourceUrl": "https://environment.govt.nz/publications/inherent-biophysical-risk-mapping-manual-methodology/",
    "pdfUrl": "https://environment.govt.nz/assets/publications/inherent-biophysical-risk-mapping-manual-and-methodology.pdf",
    "summary": "Describes GIS methods and spatial layers, including LiDAR, soils, slope and waterways, used to model contaminant-loss risks for two Bay of Plenty catchments.",
    "tags": [
      "GIS",
      "spatial risk mapping",
      "LiDAR",
      "freshwater"
    ]
  },
  {
    "slug": "mfe-digital-networks-freshwater-land-mapping-2024",
    "title": "Digital networks: challenges, solutions, and case studies to inform nationwide integrated freshwater-land mapping",
    "year": "2024",
    "publisher": "Ministry for the Environment · NIWA",
    "sourceUrl": "https://environment.govt.nz/publications/digital-networks-challenges-solutions-and-case-studies-to-inform-nationwide-integrated-freshwater-land-mapping/",
    "pdfUrl": "https://environment.govt.nz/assets/publications/Digital-networks-Challenges-solutions-and-case-studies-to-inform-nationwide-integrated-freshwater-land-mapping.pdf",
    "summary": "Reviews digital surface-water networks and the River Environment Classification as spatial frameworks for national-scale freshwater modelling and management.",
    "tags": [
      "digital networks",
      "freshwater mapping",
      "spatial framework",
      "rivers"
    ]
  },
  {
    "slug": "auckland-digital-soil-mapping-karaka-2016",
    "title": "Farm-scale digital soil mapping techniques for Karaka and Patumahoe, South Auckland",
    "year": "2016",
    "publisher": "Auckland Council · Knowledge Auckland",
    "sourceUrl": "https://knowledgeauckland.org.nz/publications/farm-scale-digital-soil-mapping-techniques-for-karaka-and-patumahoe-south-auckland/",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/2336/tr2016-013-farm-scale-digital-soil-mapping-techniques-karaka-patumahoe-auckland.pdf",
    "summary": "Uses LiDAR-derived terrain variables, radiometric data and statistical modelling to create fine-resolution digital soil maps for farms near Karaka and Patumahoe.",
    "tags": [
      "digital soil mapping",
      "LiDAR",
      "GIS",
      "Auckland"
    ]
  },
  {
    "slug": "auckland-freshwater-management-tool-baseline-inputs-2022",
    "title": "Freshwater management tool: report 1. Baseline data inputs",
    "year": "2022",
    "publisher": "Auckland Council · Knowledge Auckland",
    "sourceUrl": "https://knowledgeauckland.org.nz/publications/freshwater-management-tool-report-1-baseline-data-inputs/",
    "pdfUrl": "https://www.knowledgeauckland.org.nz/media/2463/fwmt-report-1-baseline-data-inputs-auckland-council-2021.pdf",
    "summary": "Documents the regional and national geospatial inputs used to configure Auckland's freshwater management tool, including LiDAR-derived subcatchments and stream networks.",
    "tags": [
      "freshwater management",
      "spatial data",
      "LiDAR",
      "Auckland"
    ]
  },
  {
    "slug": "auckland-urban-extents-methodology-2014",
    "title": "Measuring Auckland's urban extents: background and methodology",
    "year": "2014",
    "publisher": "Auckland Council · Knowledge Auckland",
    "sourceUrl": "https://knowledgeauckland.org.nz/publications/measuring-aucklands-urban-extents-background-and-methodology/",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/1922/measuring-aucklands-urban-extents-craig-fredrickson-august-2014.pdf",
    "summary": "Explains how historical information and aerial imagery are used to create GIS polygon datasets of Auckland's changing urban extent.",
    "tags": [
      "urban mapping",
      "aerial imagery",
      "GIS",
      "Auckland"
    ]
  },
  {
    "slug": "auckland-coastal-marine-area-boundary-gis-2012",
    "title": "Development of an updated coastal marine area boundary for the Auckland region",
    "year": "2012",
    "publisher": "Auckland Council · NIWA",
    "sourceUrl": "https://knowledgeauckland.org.nz/publications/development-of-an-updated-coastal-marine-area-boundary-for-the-auckland-region/",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/2089/development-of-updated-coastal-marine-area-boundary-for-auckland-region-niwa-july-2012.pdf",
    "summary": "Develops a GIS procedure using tide models, aerial photography and LiDAR-derived elevation to map Auckland's coastal marine area boundary.",
    "tags": [
      "GIS",
      "coastal mapping",
      "LiDAR",
      "Auckland"
    ]
  },
  {
    "slug": "auckland-impervious-surface-mapping-2010",
    "title": "Impervious surface mapping for the Auckland region",
    "year": "2010",
    "publisher": "Auckland Regional Council · Knowledge Auckland",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/1784/tr2010-037-impervious-surface-mapping-for-the-auckland-region.pdf",
    "summary": "Uses SPOT satellite imagery to map impervious surface cover across Auckland and document classification and accuracy methods.",
    "tags": [
      "satellite imagery",
      "remote sensing",
      "impervious surfaces",
      "mapping"
    ]
  },
  {
    "slug": "auckland-urban-heat-assessment-technical-2024",
    "title": "Auckland urban heat assessment: technical report",
    "year": "2024",
    "publisher": "Auckland Council · Knowledge Auckland",
    "sourceUrl": "https://knowledgeauckland.org.nz/publications/auckland-urban-heat-assessment-technical-report/",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/goliai5f/auckland-urban-heat-assessment-technical-report-arup-oct-2024.pdf",
    "summary": "Reports high-resolution spatial temperature modelling of Auckland and describes the geospatial dataset used to assess urban heat patterns.",
    "tags": [
      "spatial modelling",
      "urban heat",
      "climate",
      "Auckland"
    ]
  },
  {
    "slug": "waikato-remote-sensing-gis-vegetation-mapping-thesis-2018",
    "title": "Mapping vegetation with remote sensing and GIS data using object-based analysis and machine learning algorithms",
    "year": "2018",
    "publisher": "University of Waikato Research Commons",
    "sourceUrl": "https://researchcommons.waikato.ac.nz/entities/publication/8c52cce1-653f-46d6-a802-97965b1c7de6",
    "pdfUrl": "https://researchcommons.waikato.ac.nz/bitstreams/076ccbba-d588-46b2-9dab-c1ca95209467/download",
    "summary": "PhD thesis evaluating GIS, LiDAR and satellite imagery with object-based analysis and machine-learning methods for vegetation mapping.",
    "tags": [
      "remote sensing",
      "GIS",
      "LiDAR",
      "vegetation mapping"
    ],
    "license": "The repository permits access for private study and research. The thesis remains protected by copyright; obtain author permission before republishing material."
  },
  {
    "slug": "mpi-seabird-risk-assessment-fishery-inputs-2023",
    "title": "Fishery data inputs for the New Zealand Seabird Risk Assessment",
    "year": "2023",
    "publisher": "Ministry for Primary Industries",
    "id": "57274",
    "series": "AEBR 313",
    "summary": "Documents spatially resolved fishing effort and capture data prepared as inputs to the New Zealand Seabird Risk Assessment.",
    "tags": [
      "seabirds",
      "spatial data",
      "fisheries",
      "risk assessment"
    ]
  },
  {
    "slug": "mpi-kaipara-habitat-fisheries-mapping-2014",
    "title": "Habitats of particular significance for fisheries management: the Kaipara Harbour",
    "year": "2014",
    "publisher": "Ministry for Primary Industries",
    "id": "4367",
    "series": "AEBR 129",
    "summary": "Reviews Kaipara Harbour fish-habitat research and maps subtidal seagrass meadows as important fish nursery areas.",
    "tags": [
      "habitat mapping",
      "Kaipara Harbour",
      "fisheries",
      "seagrass"
    ]
  },
  {
    "slug": "mpi-land-based-coastal-fisheries-habitats-2023",
    "title": "Land-based effects on coastal fisheries and kaimoana and their habitats: a review",
    "year": "2023",
    "publisher": "Ministry for Primary Industries",
    "id": "56425",
    "series": "AEBR 309",
    "summary": "Reviews mechanisms and locations of land-based impacts on coastal fisheries, kaimoana and marine habitats around New Zealand.",
    "tags": [
      "coastal environments",
      "spatial impacts",
      "fisheries",
      "kaimoana"
    ]
  },
  {
    "slug": "mpi-aebar-sefra-chapter-2019-2020",
    "title": "Aquatic Environment and Biodiversity Annual Review 2019–20: Spatially Explicit Fisheries Risk Assessment (SEFRA)",
    "year": "2021",
    "publisher": "Ministry for Primary Industries",
    "id": "42111",
    "kind": "Technical review chapter",
    "pdfUrl": "https://www.mpi.govt.nz/dmsdocument/42111/direct/",
    "summary": "Describes the SEFRA method for estimating fisheries impacts and risk to non-target species using spatial distributions of species and fishing effort.",
    "tags": [
      "SEFRA",
      "spatial risk",
      "fisheries",
      "marine mammals"
    ],
    "sourceUrl": "https://www.mpi.govt.nz/dmsdocument/42111/sitemap/"
  },
  {
    "slug": "mpi-aebar-2019-2020-full-review",
    "title": "Aquatic Environment and Biodiversity Annual Review 2019–20",
    "year": "2021",
    "publisher": "Ministry for Primary Industries",
    "id": "42150",
    "kind": "Annual technical review",
    "pdfUrl": "https://www.mpi.govt.nz/dmsdocument/42150/direct",
    "summary": "Annual review of environmental interactions between fisheries and aquatic ecosystems, including spatial fisheries-risk, habitats, marine mammals and seabed impacts.",
    "tags": [
      "marine environment",
      "spatial fisheries risk",
      "habitats",
      "biodiversity"
    ],
    "sourceUrl": "https://www.mpi.govt.nz/dmsdocument/42150/sitemap/"
  },
  {
    "slug": "auckland-spatial-plan-evidence-metadata-2010",
    "title": "Auckland's Spatial Plan: evidence base metadata report",
    "year": "2010",
    "publisher": "Auckland Council · Knowledge Auckland",
    "sourceUrl": "https://knowledgeauckland.org.nz/publications/aucklands-spatial-plan-evidence-base-metadata-report/",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/1482/aucklands-spatial-plan-evidence-base-metadata-report-rimu-dec-2010.pdf",
    "summary": "Provides metadata for the data collections used in the evidence base for the Auckland Plan and its spatial planning map.",
    "tags": [
      "spatial planning",
      "metadata",
      "Auckland",
      "GIS"
    ]
  },
  {
    "slug": "auckland-liquefaction-vulnerability-mapping-2021",
    "title": "Auckland liquefaction assessment: liquefaction vulnerability maps for the Auckland region",
    "year": "2021",
    "publisher": "Auckland Council · Knowledge Auckland",
    "sourceUrl": "https://knowledgeauckland.org.nz/publications/auckland-liquefaction-assessment-liquefaction-vulnerability-maps-for-the-auckland-region/",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/hcgdrqni/tr2021-19-auckland-liquefaction-assessment-and-liquefaction-vulnerability-maps.pdf",
    "summary": "Documents the geological, groundwater, seismic and topographic data used to produce regional liquefaction vulnerability maps for Auckland.",
    "tags": [
      "hazard mapping",
      "liquefaction",
      "GIS",
      "Auckland"
    ],
    "license": "Creative Commons Attribution 4.0 International, as stated in the report.",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "slug": "auckland-clues-freshwater-geospatial-modelling-2015",
    "title": "Assessment of the CLUES model for the implementation of the National Policy Statement on Freshwater Management in the Auckland region",
    "year": "2015",
    "publisher": "Auckland Council · NIWA · Knowledge Auckland",
    "sourceUrl": "https://knowledgeauckland.org.nz/publications/assessment-of-the-clues-model-for-the-implementation-of-the-national-policy-statement-on-freshwater-management-in-the-auckland-region/",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/1322/tr2015-014-assessment-clues-model-npsfm-auckland.pdf",
    "summary": "Evaluates the CLUES freshwater model and its spatial datasets, land-cover scenarios, catchment outputs and mapped results for Auckland.",
    "tags": [
      "geospatial modelling",
      "freshwater",
      "land cover",
      "Auckland"
    ]
  },
  {
    "slug": "auckland-farm-scale-land-use-capability-classification-2017",
    "title": "Farm-scale land use capability classification for Auckland",
    "year": "2017",
    "publisher": "Auckland Council · Knowledge Auckland",
    "sourceUrl": "https://knowledgeauckland.org.nz/publications/farm-scale-land-use-capability-classification-for-auckland/",
    "pdfUrl": "https://www.knowledgeauckland.org.nz/media/1149/tr2017-016-farm-scale-land-use-capability-auckland.pdf",
    "summary": "Documents development of a farm-scale land-use capability classification and conversion of regional land-resource inventory polygons into a GIS layer.",
    "tags": [
      "land-use capability",
      "GIS",
      "land mapping",
      "Auckland"
    ]
  },
  {
    "slug": "canterbury-skelton-glacier-insar-gis-2013",
    "title": "Ice velocity and mass balance study of the Skelton Glacier, Antarctica, using remote sensing and GIS techniques",
    "year": "2013",
    "publisher": "University of Canterbury Research Repository",
    "sourceUrl": "https://ir.canterbury.ac.nz/items/e2e83193-8227-4196-9eb6-6b604f673848",
    "pdfUrl": "https://ir.canterbury.ac.nz/bitstreams/53942f69-bd53-4063-ad18-25690a37ab32/download",
    "summary": "Uses satellite radar interferometry, GIS and auxiliary elevation data to map Skelton Glacier ice velocity and estimate catchment mass balance.",
    "tags": [
      "remote sensing",
      "GIS",
      "InSAR",
      "glacier mapping"
    ]
  },
  {
    "slug": "stats-auckland-spatial-trends-2009",
    "title": "Mapping trends in the Auckland region",
    "year": 2009,
    "publisher": "Statistics New Zealand",
    "creator": "Statistics New Zealand",
    "pdfUrl": "https://www.stats.govt.nz/assets/Uploads/Reports/Mapping-Trends-in-the-Auckland-Region/Mapping-trends-in-the-Auckland-Region-June-2009.pdf",
    "sourceUrl": "https://www.stats.govt.nz/assets/Uploads/Reports/Mapping-Trends-in-the-Auckland-Region/Mapping-trends-in-the-Auckland-Region-June-2009.pdf",
    "sourceLabel": "Statistics New Zealand report PDF",
    "summary": "Maps demographic and settlement change across the Auckland region, showing how geographic patterns shifted across the region's local authority areas.",
    "tags": [
      "Auckland",
      "spatial trends",
      "regional analysis",
      "maps"
    ]
  },
  {
    "slug": "nzta-national-transport-landuse-mapping-2012",
    "title": "National mapping of integrated transport and land use",
    "year": 2012,
    "publisher": "Waka Kotahi NZ Transport Agency",
    "series": "Research Report 490",
    "pdfUrl": "https://www.nzta.govt.nz/assets/resources/research/reports/490/docs/490.pdf",
    "sourceUrl": "https://www.nzta.govt.nz/resources/research/reports/490",
    "summary": "Develops a national spatial view of transport and land use to support integrated planning and analysis.",
    "tags": [
      "transport",
      "land use",
      "national mapping",
      "spatial planning"
    ]
  },
  {
    "slug": "nzta-affordable-location-technology-2013",
    "title": "Accurate and affordable location technology",
    "year": 2013,
    "publisher": "Waka Kotahi NZ Transport Agency",
    "series": "Research Report 535",
    "pdfUrl": "https://www.nzta.govt.nz/assets/resources/research/reports/535/docs/535.pdf",
    "sourceUrl": "https://www.nzta.govt.nz/resources/research/reports/535",
    "summary": "Reviews practical location technologies and their accuracy, cost and suitability for positioning and spatial data collection.",
    "tags": [
      "location technology",
      "GNSS",
      "positioning",
      "spatial data"
    ]
  },
  {
    "slug": "nzta-digital-data-state-highways-2014",
    "title": "Identifying uses for emerging digital data about the state highway network",
    "year": 2014,
    "publisher": "Waka Kotahi NZ Transport Agency",
    "series": "Research Report 559",
    "pdfUrl": "https://nzta.govt.nz/assets/resources/research/reports/559/docs/559.pdf",
    "sourceUrl": "https://www.nzta.govt.nz/resources/research/reports/559",
    "summary": "Assesses how new digital and location-rich data can improve knowledge and management of the state highway network.",
    "tags": [
      "digital data",
      "transport GIS",
      "state highways",
      "network mapping"
    ]
  },
  {
    "slug": "nzta-auckland-strategic-spatial-view-2022",
    "title": "Auckland strategic spatial view",
    "year": 2022,
    "publisher": "Waka Kotahi NZ Transport Agency",
    "pdfUrl": "https://www.nzta.govt.nz/assets/resources/strategic-spatial-views/auckland-strategic-spatial-view.pdf",
    "sourceUrl": "https://www.nzta.govt.nz/resources/strategic-spatial-views",
    "summary": "A regional spatial overview of Auckland's transport network, growth areas, infrastructure and strategic connections.",
    "tags": [
      "Auckland",
      "spatial planning",
      "transport",
      "regional maps"
    ]
  },
  {
    "slug": "nzta-wellington-strategic-spatial-view-2024",
    "title": "Wellington strategic spatial view",
    "year": 2024,
    "publisher": "Waka Kotahi NZ Transport Agency",
    "pdfUrl": "https://nzta.govt.nz/assets/resources/strategic-spatial-views/wellington-strategic-spatial-view.pdf",
    "sourceUrl": "https://www.nzta.govt.nz/resources/strategic-spatial-views",
    "summary": "Maps key transport connections, growth areas and strategic infrastructure across the Wellington region.",
    "tags": [
      "Wellington",
      "spatial planning",
      "transport",
      "regional maps"
    ]
  },
  {
    "slug": "nzta-urban-development-position-2023",
    "title": "Urban development position: summary and key components",
    "year": 2023,
    "publisher": "Waka Kotahi NZ Transport Agency",
    "pdfUrl": "https://nzta.govt.nz/assets/resources/strategic-spatial-views/urban-development-position-summary-and-key-components-march-2023.pdf",
    "sourceUrl": "https://www.nzta.govt.nz/resources/strategic-spatial-views",
    "summary": "Sets out a spatially informed position on urban development and the relationship between transport investment, growth and place.",
    "tags": [
      "urban development",
      "spatial planning",
      "transport",
      "growth"
    ]
  },
  {
    "slug": "manaaki-nz-land-use-database-2010",
    "title": "New Zealand Land Use Database",
    "year": 2010,
    "publisher": "Manaaki Whenua – Landcare Research",
    "pdfUrl": "https://nzlum.landcareresearch.co.nz/reports/lcrx0901.pdf",
    "sourceUrl": "https://nzlum.landcareresearch.co.nz/reference/documents/",
    "summary": "Describes a national land-use database and its spatial data structure for recording and comparing land use across New Zealand.",
    "tags": [
      "land use",
      "database",
      "national mapping",
      "spatial data"
    ]
  },
  {
    "slug": "manaaki-wise-landuse-mapping-2016",
    "title": "WISE: Web Information System for Environment",
    "year": 2016,
    "publisher": "Manaaki Whenua – Landcare Research",
    "pdfUrl": "https://nzlum.landcareresearch.co.nz/external/wise.pdf",
    "sourceUrl": "https://nzlum.landcareresearch.co.nz/reference/documents/",
    "summary": "Introduces a web-based environmental information system that brings land-use and environmental datasets together for spatial exploration.",
    "tags": [
      "environmental information",
      "web mapping",
      "land use",
      "spatial data"
    ]
  },
  {
    "slug": "manaaki-landuse-classification-2023",
    "title": "Land-use mapping and classification report LC4309",
    "year": 2023,
    "publisher": "Manaaki Whenua – Landcare Research",
    "series": "Landcare Research report LC4309",
    "pdfUrl": "https://nzlum.landcareresearch.co.nz/reports/lc4309.pdf",
    "sourceUrl": "https://nzlum.landcareresearch.co.nz/reference/documents/",
    "summary": "Documents methods and classification decisions for New Zealand land-use mapping, supporting consistent interpretation of spatial land-use data.",
    "tags": [
      "land use",
      "classification",
      "mapping methods",
      "GIS"
    ]
  },
  {
    "slug": "manaaki-landuse-update-2022",
    "title": "New Zealand Land Use Map update report LC4146",
    "year": 2022,
    "publisher": "Manaaki Whenua – Landcare Research",
    "series": "Landcare Research report LC4146",
    "pdfUrl": "https://nzlum.landcareresearch.co.nz/reports/lc4146.pdf",
    "sourceUrl": "https://nzlum.landcareresearch.co.nz/reference/documents/",
    "summary": "Records updates to New Zealand land-use mapping and the datasets used to maintain a nationally consistent spatial land-use layer.",
    "tags": [
      "land use",
      "national mapping",
      "GIS",
      "spatial data"
    ]
  },
  {
    "slug": "manaaki-landuse-june-2024",
    "title": "New Zealand Land Use Map update report LC4488",
    "year": 2024,
    "publisher": "Manaaki Whenua – Landcare Research",
    "series": "Landcare Research report LC4488",
    "pdfUrl": "https://nzlum.landcareresearch.co.nz/reports/lc4488.pdf",
    "sourceUrl": "https://nzlum.landcareresearch.co.nz/reference/documents/",
    "summary": "Reports the June 2024 update to New Zealand land-use mapping, including changes to mapped classes and the national spatial dataset.",
    "tags": [
      "land use",
      "national mapping",
      "GIS",
      "spatial data"
    ]
  },
  {
    "slug": "manaaki-artificial-drainage-mapping-2018",
    "title": "Mapping the extent of artificial drainage in New Zealand",
    "year": 2018,
    "publisher": "Manaaki Whenua – Landcare Research",
    "creator": "Manderson, A.",
    "pdfUrl": "https://www.landcareresearch.co.nz/assets/Discover-Our-Research/Projects/IDA/Manderson_2018_mapping_extent_artificial_drainage_NZ.pdf",
    "sourceUrl": "https://www.landcareresearch.co.nz/discover-our-research/land/soils/",
    "summary": "Uses national spatial information to map artificial drainage and discuss the coverage and limitations of a New Zealand-wide drainage layer.",
    "tags": [
      "soil",
      "drainage",
      "national mapping",
      "GIS"
    ]
  },
  {
    "slug": "envirolink-southland-gis-landuse-2016",
    "title": "Methodology for a GIS-based land use map for Southland: a review",
    "year": 2016,
    "publisher": "Environment Southland · Envirolink",
    "series": "Envirolink report 1645-ESRC274",
    "pdfUrl": "https://envirolink.govt.nz/assets/Envirolink/Reports/1645-ESRC274-Methodology-for-a-GIS-based-Land-use-Map-for-Southland-A-Review.pdf",
    "sourceUrl": "https://envirolink.govt.nz/envirolink-reports/",
    "summary": "Reviews methods for building a Southland land-use map in GIS, including source data, classification and how the mapped information can support regional planning.",
    "tags": [
      "Southland",
      "land use",
      "GIS",
      "regional mapping"
    ]
  },
  {
    "slug": "envirolink-soil-mapping-protocols-2017",
    "title": "New Zealand soil mapping protocols and guidelines",
    "year": 2017,
    "publisher": "Envirolink · Manaaki Whenua – Landcare Research",
    "pdfUrl": "https://www.envirolink.govt.nz/assets/Envirolink/Tools/R12-4-New-Zealand-soil-mapping-protocols-and-guidelines.pdf",
    "sourceUrl": "https://www.envirolink.govt.nz/envirolink-tools/land-and-soil-tools/",
    "summary": "Provides consistent protocols for collecting, describing and mapping soils, with guidance relevant to field surveys and spatial soil information.",
    "tags": [
      "soil mapping",
      "field methods",
      "standards",
      "GIS"
    ]
  },
  {
    "slug": "envirolink-farmscale-soil-mapping-2019",
    "title": "Implementing farm-scale soil mapping protocols: workflow demonstrated with a case study",
    "year": 2019,
    "publisher": "Hawke's Bay Regional Council · Envirolink",
    "series": "Envirolink report 1932-HBRC240",
    "pdfUrl": "https://www.envirolink.govt.nz/assets/Envirolink/1932-HBRC240-Implementing-Farm-Scale-Soil-Mapping-Protocols-workflow-demonstrated-with-case-study.pdf",
    "sourceUrl": "https://www.envirolink.govt.nz/envirolink-reports/",
    "summary": "Demonstrates a repeatable farm-scale soil survey and mapping workflow, applying national soil mapping protocols in a regional case study.",
    "tags": [
      "soil mapping",
      "farm scale",
      "workflow",
      "spatial data"
    ]
  },
  {
    "slug": "envirolink-hawkes-bay-oxygen-spatial-mapping-2020",
    "title": "Spatial mapping of subsurface oxygen depletion in Hawke Bay",
    "year": 2020,
    "publisher": "Hawke's Bay Regional Council · Envirolink",
    "pdfUrl": "https://www.hbrc.govt.nz/assets/Uploads/5451-Spatial-Mapping-of-Subsurface-Oxygen-Depletion-in-Hawke-Bay.pdf",
    "sourceUrl": "https://www.hbrc.govt.nz/our-documents/reports-search/?start=90",
    "summary": "Maps the distribution of subsurface oxygen depletion in Hawke Bay using spatial observations to describe marine conditions and their extent.",
    "tags": [
      "Hawke Bay",
      "marine mapping",
      "spatial analysis",
      "environment"
    ]
  },
  {
    "slug": "envirolink-remote-sensing-groundwater-recharge-2019",
    "title": "Better spatial characterisation of evapotranspiration and rainfall recharge estimates to groundwater using remote sensing multispectral techniques",
    "year": 2019,
    "publisher": "Hawke's Bay Regional Council · Envirolink",
    "pdfUrl": "https://www.envirolink.govt.nz/assets/Envirolink/1951-HBRC245-Better-spatial-characterisation-of-evapotranspiration-and-rainfall-recharge-estimates-to-groundwater-using-remote-sensing-multispectral-techniques-at-lysimeter-sites.pdf-.pdf",
    "sourceUrl": "https://www.envirolink.govt.nz/envirolink-reports/",
    "summary": "Tests multispectral remote sensing as a way to improve spatial estimates of evapotranspiration and groundwater recharge in Hawke's Bay.",
    "tags": [
      "remote sensing",
      "multispectral",
      "groundwater",
      "spatial modelling"
    ]
  },
  {
    "slug": "envirolink-lidar-upper-waipaoa-2022",
    "title": "Application of LiDAR differencing to assess sediment load for the Upper Waipaoa River",
    "year": 2022,
    "publisher": "Gisborne District Council · Envirolink",
    "pdfUrl": "https://www.envirolink.govt.nz/assets/Envirolink/2137-GSDC165-Application-of-LiDAR-Differencing-to-assess-sediment-load-for-Upper-Waipaoa-River.pdf",
    "sourceUrl": "https://www.envirolink.govt.nz/news-and-events/older-stories/lidar-assessment-of-sediment-loads/",
    "summary": "Uses repeat LiDAR surfaces and elevation differencing to estimate sediment loads in the Upper Waipaoa catchment.",
    "tags": [
      "LiDAR",
      "elevation change",
      "sediment",
      "Gisborne"
    ]
  },
  {
    "slug": "envirolink-satellite-seagrass-hawkes-bay-2020",
    "title": "Potential of satellite imagery to detect seagrass (Zostera) patches in Hawke's Bay",
    "year": 2020,
    "publisher": "Hawke's Bay Regional Council · Envirolink",
    "pdfUrl": "https://www.envirolink.govt.nz/assets/Envirolink/2067-HBRC256-Potential-of-satellite-imagery-to-detect-seagrass-Zostera-patches-in-Hawkes-Bay-v2.pdf",
    "sourceUrl": "https://www.envirolink.govt.nz/envirolink-reports/",
    "summary": "Investigates whether satellite imagery can identify seagrass patches in Hawke's Bay and support spatial monitoring of coastal habitats.",
    "tags": [
      "satellite imagery",
      "remote sensing",
      "seagrass",
      "coastal mapping"
    ]
  },
  {
    "slug": "envirolink-otago-biodiversity-spatial-prioritisation-2023",
    "title": "Spatial prioritisation to inform indigenous biodiversity management in Otago",
    "year": 2023,
    "publisher": "Otago Regional Council · Envirolink",
    "series": "Landcare Research report LC4387",
    "pdfUrl": "https://www.envirolink.govt.nz/assets/Envirolink/LC4387_Spatial-prioritisation-informing-biodiversity-management-in-Otago.pdf",
    "sourceUrl": "https://www.envirolink.govt.nz/envirolink-reports/",
    "summary": "Applies spatial prioritisation to identify places and actions that can inform indigenous biodiversity management across Otago.",
    "tags": [
      "spatial prioritisation",
      "biodiversity",
      "Otago",
      "conservation planning"
    ]
  },
  {
    "slug": "envirolink-marlborough-raingauge-spatial-review-2023",
    "title": "Spatial review of the Marlborough District Council raingauge network",
    "year": 2023,
    "publisher": "Marlborough District Council · Envirolink",
    "pdfUrl": "https://www.envirolink.govt.nz/assets/Envirolink/2317-MLDC165-Spatial-review-of-the-Marlborough-District-Council-raingauge-network.pdf",
    "sourceUrl": "https://www.envirolink.govt.nz/envirolink-reports/",
    "summary": "Reviews rainfall gauge coverage and network placement using spatial analysis to identify gaps and opportunities for monitoring in Marlborough.",
    "tags": [
      "Marlborough",
      "spatial analysis",
      "rainfall",
      "monitoring network"
    ]
  },
  {
    "slug": "envirolink-hawkes-bay-chlorophyll-remote-sensing-2023",
    "title": "Trend analysis of chlorophyll-a in Hawke's Bay using remote sensing data, 2018–2023",
    "year": 2023,
    "publisher": "Hawke's Bay Regional Council · Envirolink",
    "pdfUrl": "https://www.envirolink.govt.nz/assets/Envirolink/2332-HBRC270-Trend-Analysis-Of-Chlorophyll-A-In-Hawkes-Bay-Using-Remote-Sensing-Data-201823.pdf",
    "sourceUrl": "https://www.envirolink.govt.nz/envirolink-reports/",
    "summary": "Analyses satellite-derived chlorophyll-a observations to map and compare coastal water trends in Hawke's Bay from 2018 to 2023.",
    "tags": [
      "remote sensing",
      "satellite data",
      "water quality",
      "Hawke's Bay"
    ]
  },
  {
    "slug": "niwa-spatial-information-nz-economy-2009",
    "title": "Spatial information in the New Zealand economy",
    "year": 2009,
    "publisher": "National Institute of Water and Atmospheric Research",
    "pdfUrl": "https://webstatic.niwa.co.nz/library/spatialinf2009.pdf",
    "sourceUrl": "https://webstatic.niwa.co.nz/library/spatialinf2009.pdf",
    "sourceLabel": "NIWA publication PDF",
    "summary": "Examines the role of spatial information in New Zealand's economy, including how location-based data and geographic information support public and private decision making.",
    "tags": [
      "spatial information",
      "New Zealand",
      "geospatial economy",
      "GIS"
    ]
  },
  {
    "slug": "niwa-remote-sensing-vehicle-emissions-2015",
    "title": "Remote sensing to enhance motor vehicle emission modelling",
    "year": 2015,
    "publisher": "National Institute of Water and Atmospheric Research",
    "pdfUrl": "https://niwa.co.nz/sites/default/files/AKL2015-012%20RSD%20evaluation%20%2800000003%29.pdf",
    "sourceUrl": "https://niwa.co.nz/atmosphere/reports",
    "summary": "Evaluates remote sensing measurements for improving emissions modelling and spatial assessment of motor vehicle pollution.",
    "tags": [
      "remote sensing",
      "emissions",
      "environmental modelling",
      "Auckland"
    ]
  },
  {
    "slug": "niwa-coastal-flood-mapping-methodology-2023",
    "title": "Coastal flood mapping methodology report",
    "year": 2023,
    "publisher": "National Institute of Water and Atmospheric Research",
    "pdfUrl": "https://niwa.co.nz/sites/default/files/Coastal%20flood%20mapping%20methodology%20report%20FINAL_0.pdf",
    "sourceUrl": "https://niwa.co.nz/natural-hazards/coastal-hazards",
    "summary": "Explains methods used to map coastal flooding and inundation, including the spatial data and assumptions behind coastal hazard layers.",
    "tags": [
      "coastal hazards",
      "flood mapping",
      "GIS",
      "methodology"
    ]
  },
  {
    "slug": "niwa-arowhenua-floodplain-mapping-2011",
    "title": "Arowhenua floodplain mapping and flood risk",
    "year": 2011,
    "publisher": "National Institute of Water and Atmospheric Research",
    "pdfUrl": "https://niwa.co.nz/sites/default/files/niwa_report_akl2011-015_0.pdf",
    "sourceUrl": "https://niwa.co.nz/atmosphere/reports",
    "summary": "Presents floodplain mapping and hazard information for Arowhenua, using spatial analysis to describe areas exposed to flooding.",
    "tags": [
      "flood mapping",
      "Arowhenua",
      "hazards",
      "spatial analysis"
    ]
  },
  {
    "slug": "niwa-waikato-lake-remote-sensing-2017",
    "title": "Remote sensing for water quality monitoring of lakes in the Waikato region",
    "year": 2017,
    "publisher": "National Institute of Water and Atmospheric Research",
    "series": "Waikato Regional Council Technical Report 2017/12",
    "pdfUrl": "https://docs.niwa.co.nz/library/public/WRCTR17-12.pdf",
    "sourceUrl": "https://docs.niwa.co.nz/library/public/WRCTR17-12.pdf",
    "sourceLabel": "NIWA and Waikato Regional Council report PDF",
    "summary": "Assesses remote sensing approaches for monitoring lake water quality and suspended material across the Waikato region.",
    "tags": [
      "remote sensing",
      "lakes",
      "water quality",
      "Waikato"
    ]
  },
  {
    "slug": "doc-remote-sensing-forest-canopy-part1-1999",
    "title": "Monitoring forest canopy condition by remote sensing: Part 1",
    "year": 1999,
    "publisher": "Department of Conservation",
    "series": "DOC Technical Series 14",
    "pdfUrl": "https://www.doc.govt.nz/globalassets/documents/science-and-technical/docts14.pdf",
    "sourceUrl": "https://www.doc.govt.nz/about-us/science-publications/series/doc-technical-series/",
    "summary": "Part one of a technical series on monitoring forest canopy condition with remote sensing, documenting methods for interpreting canopy condition from imagery.",
    "tags": [
      "remote sensing",
      "forest canopy",
      "monitoring",
      "DOC"
    ]
  },
  {
    "slug": "doc-remote-sensing-forest-canopy-part2-1999",
    "title": "Monitoring forest canopy condition by remote sensing: Part 2",
    "year": 1999,
    "publisher": "Department of Conservation",
    "series": "DOC Technical Series 14",
    "pdfUrl": "https://www.doc.govt.nz/globalassets/documents/science-and-technical/docts14a.pdf",
    "sourceUrl": "https://www.doc.govt.nz/about-us/science-publications/series/doc-technical-series/",
    "summary": "The second publisher-issued file for the DOC technical series on remote sensing of forest canopy condition, with additional methods and results.",
    "tags": [
      "remote sensing",
      "forest canopy",
      "monitoring",
      "DOC"
    ]
  },
  {
    "slug": "doc-remote-sensing-forest-canopy-part3-1999",
    "title": "Monitoring forest canopy condition by remote sensing: Part 3",
    "year": 1999,
    "publisher": "Department of Conservation",
    "series": "DOC Technical Series 14",
    "pdfUrl": "https://www.doc.govt.nz/globalassets/documents/science-and-technical/docts14b.pdf",
    "sourceUrl": "https://www.doc.govt.nz/about-us/science-publications/series/doc-technical-series/",
    "summary": "The third publisher-issued file for the DOC technical series on remote sensing of forest canopy condition, adding to the methods and evidence in the report.",
    "tags": [
      "remote sensing",
      "forest canopy",
      "monitoring",
      "DOC"
    ]
  },
  {
    "slug": "doc-linz-long-term-insights-remote-sensing-2023",
    "title": "Long-Term Insights Briefing 2023: remote sensing and LiDAR",
    "year": 2023,
    "publisher": "Department of Conservation · Toitū Te Whenua Land Information New Zealand",
    "pdfUrl": "https://www.doc.govt.nz/globalassets/documents/about-doc/long-term-insights-briefings/2023/ltib2023-doc-linz.pdf",
    "sourceUrl": "https://www.doc.govt.nz/about-us/our-role/managing-conservation/planning-for-our-future-long-term-insights-briefings/",
    "summary": "A joint DOC and LINZ briefing on the future use of remote sensing and LiDAR for understanding land, ecosystems and environmental change.",
    "tags": [
      "remote sensing",
      "LiDAR",
      "DOC",
      "LINZ"
    ]
  },
  {
    "slug": "mpi-trawl-footprint-mapping-1989-2013-2017",
    "title": "Monitoring the trawl footprint of the New Zealand commercial fishing fleet: 1989–90 to 2012–13",
    "year": 2017,
    "publisher": "Ministry for Primary Industries",
    "id": "15880",
    "series": "AEBR 176",
    "summary": "Maps the spatial footprint of commercial trawling over multiple fishing years and describes the methods used to track changes in fishing locations.",
    "tags": [
      "fisheries",
      "trawl footprint",
      "spatial analysis",
      "marine GIS"
    ]
  },
  {
    "slug": "mpi-trawl-bottom-contact-mapping-2008-2017-2019",
    "title": "The extent of bottom contact by New Zealand deepwater commercial trawl fisheries, 2008–17",
    "year": 2019,
    "publisher": "Ministry for Primary Industries",
    "id": "37050",
    "series": "AEBR 229",
    "summary": "Maps seabed contact by deepwater trawl fisheries and provides spatial measures of fishing activity across New Zealand waters.",
    "tags": [
      "fisheries",
      "seabed mapping",
      "spatial analysis",
      "marine GIS"
    ]
  },
  {
    "slug": "mpi-trawl-dredge-contact-mapping-2018-2019",
    "title": "The extent of bottom contact by trawl and dredging fisheries, 1989–90 to 2018–19",
    "year": 2021,
    "publisher": "Ministry for Primary Industries",
    "id": "45028",
    "series": "AEBR 260",
    "summary": "Updates national spatial analysis of seabed contact from trawl and dredge fisheries over three decades.",
    "tags": [
      "fisheries",
      "seabed mapping",
      "spatial analysis",
      "marine GIS"
    ]
  },
  {
    "slug": "mpi-hectors-dolphin-distribution-2016",
    "title": "Abundance and distribution of Hector's dolphins on the west coast of the South Island",
    "year": 2016,
    "publisher": "Ministry for Primary Industries",
    "id": "12129",
    "series": "AEBR 168",
    "summary": "Presents survey-based abundance and distribution estimates for Hector's dolphins on the west coast of the South Island.",
    "tags": [
      "species distribution",
      "marine mammals",
      "spatial survey",
      "conservation"
    ]
  },
  {
    "slug": "mpi-black-petrel-fisheries-spatial-overlap-2015",
    "title": "Black petrel distribution and overlap with trawl and longline fisheries",
    "year": 2015,
    "publisher": "Ministry for Primary Industries",
    "id": "10034",
    "series": "AEBR 161",
    "summary": "Maps black petrel distribution and its spatial overlap with commercial fishing methods to inform fisheries risk assessment.",
    "tags": [
      "seabirds",
      "species distribution",
      "fisheries",
      "spatial risk"
    ]
  },
  {
    "slug": "mpi-seabird-risk-maps-supplement-2014",
    "title": "Seabird risk assessment supplementary distributional maps",
    "year": 2014,
    "publisher": "Ministry for Primary Industries",
    "id": "4266",
    "series": "AEBR 109S",
    "summary": "Supplementary maps documenting seabird distributions used in spatial assessment of fisheries-related risk.",
    "tags": [
      "seabirds",
      "distribution maps",
      "fisheries",
      "spatial risk"
    ]
  },
  {
    "slug": "gns-groundwater-capture-zones-gis-2013",
    "title": "GIS tools to delineate groundwater capture zones",
    "year": 2013,
    "publisher": "GNS Science",
    "series": "Science Report 2012/06",
    "pdfUrl": "https://www.gns.cri.nz/assets/Data-and-Resources/Download-files/SR-2012-06-GIS-tools-to-delineate-groundwater-capture-zones.pdf",
    "sourceUrl": "https://www.gns.cri.nz/data-and-resources/groundwater-capture-zone-gis-toolkit/",
    "summary": "Documents GIS tools for delineating groundwater capture zones and supporting local-scale groundwater protection and management.",
    "tags": [
      "GIS",
      "groundwater",
      "capture zones",
      "spatial tools"
    ]
  },
  {
    "slug": "gns-national-aggregate-spatial-modelling-2021",
    "title": "Aggregate opportunity modelling for New Zealand",
    "year": 2021,
    "publisher": "GNS Science",
    "series": "Science Report 2021/10",
    "pdfUrl": "https://tewaihanga.govt.nz/media/ovhlybvt/aggregate-opportunity-modelling-for-nz.pdf",
    "sourceUrl": "https://shop.gns.cri.nz/sr_2021-10-pdf/",
    "summary": "Describes a spatial modelling approach for identifying aggregate resource opportunities nationally and assessing their relationship with infrastructure and land-use constraints.",
    "tags": [
      "spatial modelling",
      "aggregate resources",
      "national mapping",
      "GIS"
    ]
  },
  {
    "slug": "gns-wellington-aggregate-spatial-modelling-2024",
    "title": "Aggregate opportunity modelling for the Wellington region",
    "year": 2024,
    "publisher": "GNS Science",
    "series": "Science Report 2024/09",
    "pdfUrl": "https://media.umbraco.io/te-waihanga-30-year-strategy/13vnynce/wellington-aggregate-modelling.pdf",
    "sourceUrl": "https://shop.gns.cri.nz/sr_2024-09-pdf/",
    "summary": "Uses regional spatial modelling to identify potential aggregate resources in Wellington and document constraints relevant to future infrastructure planning.",
    "tags": [
      "Wellington",
      "spatial modelling",
      "aggregate resources",
      "GIS"
    ]
  },
  {
    "slug": "gns-north-auckland-aggregate-spatial-modelling-2024",
    "title": "Aggregate opportunity modelling for the northern Auckland region",
    "year": 2024,
    "publisher": "GNS Science",
    "series": "Science Report 2024/11",
    "pdfUrl": "https://www.fasttrack.govt.nz/__data/assets/pdf_file/0020/27623/GNS-Science-Report-2024-Aggregate-opporunity-modelling-for-northern-auckland-region.pdf",
    "sourceUrl": "https://shop.gns.cri.nz/sr_2024-11-pdf/",
    "summary": "Maps potential aggregate resource areas across northern Auckland and documents spatial factors relevant to resource planning and infrastructure.",
    "tags": [
      "Auckland",
      "spatial modelling",
      "aggregate resources",
      "GIS"
    ]
  },
  {
    "slug": "waikato-spatial-inventory-2024",
    "title": "Waikato Regional Spatial Inventory",
    "year": 2024,
    "publisher": "Waikato Regional Council",
    "series": "Policy Series PS24-16",
    "pdfUrl": "https://www.waikatoregion.govt.nz/assets/WRC/PS24-16.pdf",
    "sourceUrl": "https://www.waikatoregion.govt.nz/services/publications/ps2416/",
    "summary": "Provides a spatial inventory for the Waikato region to inform long-term planning and integrated consideration of regional resources and infrastructure.",
    "tags": [
      "Waikato",
      "spatial planning",
      "regional inventory",
      "GIS"
    ]
  },
  {
    "slug": "waikato-acid-sulfate-soil-spatial-risk-2024",
    "title": "Acid sulfate soils preliminary risk assessment",
    "year": 2024,
    "publisher": "Waikato Regional Council",
    "series": "Technical Report TR2023/24",
    "pdfUrl": "https://www.waikatoregion.govt.nz/assets/WRC/tr202324.pdf",
    "sourceUrl": "https://subsite.waikatoregion.govt.nz/services/publications/tr202324/",
    "summary": "Maps preliminary risk areas for acid sulfate soils and sets out regional evidence to guide field investigation and land management.",
    "tags": [
      "soil mapping",
      "risk assessment",
      "Waikato",
      "spatial data"
    ]
  },
  {
    "slug": "waikato-estuarine-vegetation-port-waikato-2014",
    "title": "Estuarine vegetation survey: Port Waikato",
    "year": 2014,
    "publisher": "Waikato Regional Council",
    "series": "Technical Report TR2014/25",
    "pdfUrl": "https://www.waikatoregion.govt.nz/assets/WRC/WRC-2019/TR201425.pdf",
    "sourceUrl": "https://www.waikatoregion.govt.nz/services/publications/tr201425/",
    "summary": "Maps estuarine vegetation at Port Waikato, providing a spatial baseline for monitoring habitat change and coastal ecosystem condition.",
    "tags": [
      "estuarine vegetation",
      "coastal mapping",
      "Port Waikato",
      "monitoring"
    ]
  },
  {
    "slug": "waikato-estuarine-vegetation-kawhia-2014",
    "title": "Estuarine vegetation survey: Kāwhia Harbour",
    "year": 2014,
    "publisher": "Waikato Regional Council",
    "series": "Technical Report TR2014/16",
    "pdfUrl": "https://www.waikatoregion.govt.nz/assets/WRC/WRC-2019/TR201416.pdf",
    "sourceUrl": "https://subsite.waikatoregion.govt.nz/services/publications/tr201416/",
    "summary": "Maps estuarine vegetation in Kāwhia Harbour and records a spatial baseline for future habitat monitoring.",
    "tags": [
      "estuarine vegetation",
      "coastal mapping",
      "Kāwhia",
      "monitoring"
    ]
  },
  {
    "slug": "waikato-estuarine-vegetation-raglan-2012",
    "title": "Estuarine vegetation survey: Raglan (Whaingaroa) Harbour",
    "year": 2012,
    "publisher": "Waikato Regional Council",
    "series": "Technical Report TR2012/35",
    "pdfUrl": "https://subsite.waikatoregion.govt.nz/assets/WRC/WRC-2019/TR201235.pdf",
    "sourceUrl": "https://subsite.waikatoregion.govt.nz/services/publications/tr201235/",
    "summary": "Provides mapped estuarine vegetation and habitat information for Raglan Harbour to support regional coastal monitoring.",
    "tags": [
      "estuarine vegetation",
      "coastal mapping",
      "Raglan",
      "Whaingaroa"
    ]
  },
  {
    "slug": "waikato-estuarine-vegetation-wharekawa-2008",
    "title": "Estuarine vegetation survey: Wharekawa Harbour",
    "year": 2008,
    "publisher": "Waikato Regional Council",
    "series": "Technical Report TR2008/40",
    "pdfUrl": "https://www.waikatoregion.govt.nz/assets/WRC/WRC-2019/TR0840.pdf",
    "sourceUrl": "https://subsite.waikatoregion.govt.nz/services/publications/tr200840/",
    "summary": "Documents estuarine vegetation at Wharekawa Harbour as a mapped baseline for ecological monitoring and resource management.",
    "tags": [
      "estuarine vegetation",
      "coastal mapping",
      "Wharekawa",
      "monitoring"
    ]
  },
  {
    "slug": "gw-flood-exposure-assessment-2022",
    "title": "Wellington region flood exposure assessment",
    "year": 2022,
    "publisher": "Greater Wellington Regional Council",
    "pdfUrl": "https://www.gw.govt.nz/assets/Documents/Documents/2025/11/20221122.Flood_Exposure_Report_FINAL-1.pdf",
    "sourceUrl": "https://www.gw.govt.nz/document/23846/wellington-region-flood-exposure-assessment/",
    "summary": "Combines flood hazard mapping with spatial information about people, buildings and infrastructure to assess exposure across the Wellington region.",
    "tags": [
      "flood mapping",
      "Wellington",
      "risk assessment",
      "spatial analysis"
    ]
  },
  {
    "slug": "gw-wellington-landscape-atlas-2009",
    "title": "Wellington region landscape atlas",
    "year": 2009,
    "publisher": "Greater Wellington Regional Council",
    "pdfUrl": "https://www.gw.govt.nz/assets/Documents/2022/03/6426igl2009052626s12521.pdf",
    "sourceUrl": "https://archive.gw.govt.nz/document/16951/wellington-region-landscape-atlas/",
    "summary": "Provides a mapped atlas of the Wellington region's landscape character, including geographic descriptions and spatial context for planning.",
    "tags": [
      "Wellington",
      "landscape mapping",
      "regional atlas",
      "spatial planning"
    ]
  },
  {
    "slug": "gw-hutt-landscape-study-2012",
    "title": "Hutt landscape study",
    "year": 2012,
    "publisher": "Greater Wellington Regional Council",
    "pdfUrl": "https://www.gw.govt.nz/assets/Documents/2022/03/Hutt-Landscape-Study-2012.pdf",
    "sourceUrl": "https://www.gw.govt.nz/document/12128/hutt-landscape-study/",
    "summary": "Describes and maps landscape character in the Hutt Valley to inform regional planning and management of natural and cultural values.",
    "tags": [
      "Hutt Valley",
      "landscape mapping",
      "GIS",
      "regional planning"
    ]
  },
  {
    "slug": "mfe-wetland-delineation-hydrology-2021",
    "title": "Wetland delineation hydrology tool for Aotearoa New Zealand",
    "year": 2021,
    "publisher": "Ministry for the Environment",
    "pdfUrl": "https://environment.govt.nz/assets/publications/wetland-hydrology-tool-final.pdf",
    "sourceUrl": "https://environment.govt.nz/publications/wetland-delineation-hydrology-tool-for-aotearoa-new-zealand/",
    "summary": "Provides a repeatable hydrology method for delineating wetlands, including field and spatial evidence used to define wetland boundaries.",
    "tags": [
      "wetlands",
      "delineation",
      "hydrology",
      "spatial methods"
    ]
  },
  {
    "slug": "mfe-wetland-delineation-protocols-2022",
    "title": "Wetland delineation protocols",
    "year": 2022,
    "publisher": "Ministry for the Environment",
    "pdfUrl": "https://environment.govt.nz/assets/Publications/Files/wetland-delineation-protocols.pdf",
    "sourceUrl": "https://environment.govt.nz/publications/wetland-delineation-protocols/",
    "summary": "Sets out protocols for identifying and delineating wetlands, supporting consistent field observations and mapped wetland boundaries.",
    "tags": [
      "wetlands",
      "delineation",
      "mapping protocols",
      "environment"
    ]
  },
  {
    "slug": "auckland-fwmt-review-freshwater-tool-2021",
    "title": "FWMT report 5: review of the Freshwater Management Tool",
    "year": 2021,
    "publisher": "Auckland Council · Knowledge Auckland",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/2468/fwmt-report-5-review-of-the-freshwater-management-tool-auckland-council-2021.pdf",
    "sourceUrl": "https://knowledgeauckland.org.nz/media/2468/fwmt-report-5-review-of-the-freshwater-management-tool-auckland-council-2021.pdf",
    "series": "Freshwater Management Tool report 5",
    "summary": "Reviews Auckland's spatial freshwater management tool and its role in regional planning.",
    "tags": [
      "freshwater",
      "spatial tool",
      "Auckland",
      "GIS"
    ]
  },
  {
    "slug": "auckland-fwmt-primary-sector-water-quality-2021",
    "title": "FWMT report 6: literature review of primary sector responses to water quality",
    "year": 2021,
    "publisher": "Auckland Council · Knowledge Auckland",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/2469/fwmt-report-6-literature-review-of-primary-sector-responses-to-water-quality-auckland-council-2021.pdf",
    "sourceUrl": "https://knowledgeauckland.org.nz/media/2469/fwmt-report-6-literature-review-of-primary-sector-responses-to-water-quality-auckland-council-2021.pdf",
    "series": "Freshwater Management Tool report 6",
    "summary": "Reviews primary-sector responses to water quality pressures for spatial freshwater management and catchment planning.",
    "tags": [
      "freshwater",
      "water quality",
      "land use",
      "Auckland"
    ]
  },
  {
    "slug": "auckland-fwmt-rural-mitigation-costs-2021",
    "title": "FWMT report 8: lifecycle costs and benefits for rural mitigations",
    "year": 2021,
    "publisher": "Auckland Council · Knowledge Auckland",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/2474/fwmt-report-8-lifecycle-costs-and-benefits-for-rural-mitigations-auckland-council-2021.pdf",
    "sourceUrl": "https://knowledgeauckland.org.nz/media/2474/fwmt-report-8-lifecycle-costs-and-benefits-for-rural-mitigations-auckland-council-2021.pdf",
    "series": "Freshwater Management Tool report 8",
    "summary": "Assesses lifecycle costs and benefits for rural water-quality mitigations in a spatial management framework.",
    "tags": [
      "freshwater",
      "rural land use",
      "cost-benefit",
      "spatial modelling"
    ]
  },
  {
    "slug": "auckland-fwmt-urban-devices-valuation-2021",
    "title": "FWMT report 9: total economic valuation, part 1: urban devices",
    "year": 2021,
    "publisher": "Auckland Council · Knowledge Auckland",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/2472/fwmt-report-9-total-economic-valuation-part-1-urban-devices-auckland-council-2021.pdf",
    "sourceUrl": "https://knowledgeauckland.org.nz/media/2472/fwmt-report-9-total-economic-valuation-part-1-urban-devices-auckland-council-2021.pdf",
    "series": "Freshwater Management Tool report 9",
    "summary": "Estimates values associated with urban stormwater devices in a place-based freshwater modelling framework.",
    "tags": [
      "freshwater",
      "urban stormwater",
      "valuation",
      "spatial modelling"
    ]
  },
  {
    "slug": "auckland-fwmt-urban-sources-valuation-2021",
    "title": "FWMT report 10: total economic valuation, part 2: urban sources",
    "year": 2021,
    "publisher": "Auckland Council · Knowledge Auckland",
    "pdfUrl": "https://knowledgeauckland.org.nz/media/2464/fwmt-report-10-total-economic-valuation-part-2-urban-source-auckland-council-2021.pdf",
    "sourceUrl": "https://knowledgeauckland.org.nz/media/2464/fwmt-report-10-total-economic-valuation-part-2-urban-source-auckland-council-2021.pdf",
    "series": "Freshwater Management Tool report 10",
    "summary": "Estimates economic values associated with urban freshwater pollution sources for spatial prioritisation.",
    "tags": [
      "freshwater",
      "urban pollution",
      "valuation",
      "spatial modelling"
    ]
  },
  {
    "slug": "doc-geographic-information-systems-wildlife-2008",
    "title": "Geographic Information Systems in wildlife management: a case study using yellow-eyed penguin nest site data",
    "year": 2008,
    "publisher": "Department of Conservation",
    "creator": "R. D. Clark, R. Mathieu and P. J. Seddon",
    "series": "DOC Research & Development Series 303",
    "pdfUrl": "https://dxcprod.doc.govt.nz/globalassets/documents/science-and-technical/drds303entire.pdf",
    "sourceUrl": "https://dxcprod.doc.govt.nz/about-us/science-publications/series/doc-research-and-development-series/",
    "summary": "Applies GIS to yellow-eyed penguin nest sites and shows how spatial data informs wildlife habitat analysis and management.",
    "tags": [
      "GIS",
      "wildlife management",
      "species distribution",
      "DOC"
    ]
  },
  {
    "slug": "doc-national-seafloor-geomorphology-mapping-2022",
    "title": "Using Benthic Terrain Modeller to characterise Aotearoa New Zealand seafloor geomorphology",
    "year": 2022,
    "publisher": "Department of Conservation",
    "creator": "Jodie Robertson, Enrique Pardo, Shane Geange, Arne Pallentin and Shaun Weston",
    "series": "DOC Research & Development Series 367",
    "pdfUrl": "https://dxcprod.doc.govt.nz/globalassets/documents/science-and-technical/drds367entire.pdf",
    "sourceUrl": "https://dxcprod.doc.govt.nz/about-us/science-publications/series/doc-research-and-development-series/",
    "summary": "Applies bathymetric terrain modelling and GIS to multibeam surveys, producing consistent maps across New Zealand seafloor.",
    "tags": [
      "bathymetry",
      "seafloor mapping",
      "GIS",
      "remote sensing"
    ]
  },
  {
    "slug": "doc-coastal-suspended-sediment-satellite-remote-sensing-2022",
    "title": "Monitoring coastal suspended sediment in Aotearoa New Zealand: utility of satellite remote sensing",
    "year": 2022,
    "publisher": "Department of Conservation · National Institute of Water and Atmospheric Research",
    "creator": "Matt Pinkerton, Mark Gall, John O’Callaghan, François Thoral and Andrew Swales",
    "pdfUrl": "https://dxcprod.doc.govt.nz/globalassets/documents/conservation/marine-and-coastal/sediment/monitoring-coastal-suspended-sediment-in-nz-report.pdf",
    "sourceUrl": "https://www.doc.govt.nz/monitoring-suspended-sediment",
    "summary": "Uses satellite observations to assess long-term coastal suspended-sediment trends and remote-sensing monitoring opportunities.",
    "tags": [
      "satellite remote sensing",
      "coastal monitoring",
      "sediment",
      "national mapping"
    ]
  },
  {
    "slug": "waikato-estuarine-vegetation-whangamata-2007",
    "title": "Estuarine vegetation survey: Whangamata Harbour and Otahu Estuary",
    "year": 2007,
    "publisher": "Environment Waikato · Waikato Regional Council",
    "creator": "Meg Graeme",
    "series": "Technical Report 2007/25",
    "pdfUrl": "https://www.waikatoregion.govt.nz/assets/WRC/tr0725.pdf",
    "sourceUrl": "https://www.waikatoregion.govt.nz/services/publications/tr200725/",
    "summary": "Maps estuary vegetation from aerial photography and field surveys, recording spatial overlays in the council GIS.",
    "tags": [
      "estuarine vegetation",
      "GIS",
      "coastal mapping",
      "Waikato"
    ]
  },
  {
    "slug": "waikato-estuarine-vegetation-whangapoua-2013",
    "title": "Estuarine vegetation survey: Whangapoua Harbour",
    "year": 2013,
    "publisher": "Waikato Regional Council",
    "creator": "Meg Graeme",
    "series": "Technical Report 2013/38",
    "pdfUrl": "https://www.waikatoregion.govt.nz/assets/WRC/TR201338.pdf",
    "sourceUrl": "https://www.waikatoregion.govt.nz/services/publications/tr201338/",
    "summary": "Maps estuary vegetation at Whangapoua with digitised aerial overlays and spatial data for council GIS and monitoring.",
    "tags": [
      "estuarine vegetation",
      "GIS",
      "coastal mapping",
      "Whangapoua"
    ]
  },
  {
    "slug": "waikato-estuarine-vegetation-coromandel-2013",
    "title": "Estuarine vegetation survey: Coromandel and Te Kouma Harbours",
    "year": 2013,
    "publisher": "Waikato Regional Council",
    "creator": "Meg Graeme",
    "series": "Technical Report 2013/40",
    "pdfUrl": "https://www.waikatoregion.govt.nz/assets/WRC/TR201340.pdf",
    "sourceUrl": "https://www.waikatoregion.govt.nz/services/publications/tr201340/",
    "summary": "Maps estuary vegetation in Coromandel and Te Kouma Harbours for regional GIS and environmental monitoring.",
    "tags": [
      "estuarine vegetation",
      "GIS",
      "coastal mapping",
      "Coromandel"
    ]
  },
  {
    "slug": "waikato-estuarine-vegetation-purangi-2014",
    "title": "Estuarine vegetation survey: Purangi Estuary",
    "year": 2014,
    "publisher": "Waikato Regional Council",
    "creator": "Meg Graeme",
    "series": "Technical Report 2014/28",
    "pdfUrl": "https://subsite.waikatoregion.govt.nz/assets/WRC/TR201428.pdf",
    "sourceUrl": "https://subsite.waikatoregion.govt.nz/services/publications/tr201428/",
    "summary": "Maps Purangi estuary vegetation and accompanies the report with GIS layers and digitised aerial maps.",
    "tags": [
      "estuarine vegetation",
      "GIS",
      "coastal mapping",
      "Purangi"
    ]
  }
];
export const nzGeospatialPdfAdditions = entries.map(makeItem);
