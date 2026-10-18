// Historical 1978–1999 national geospatial, mapping and database publications.
// Publisher URLs and bibliographic metadata were checked on 18 October 2026.
// Local archival status is populated only after PDF inspection and checksum verification.
import {mirroredPre2000PdfSlugs} from './pre2000-pdfs-mirrored.mjs';
const mirrored=new Set(mirroredPre2000PdfSlugs);
const source=[
  [
    "nzgd49-wgs84-transformation-1997",
    "Recommended transformation parameters from WGS84 to NZGD49",
    "Merrin Pearse and Chris Crook · LINZ",
    "1997",
    "26 August 1997 · Geodetic System Technical Report 1997/11",
    "Datum transformation report",
    "Compares transformation approaches for relating GPS-derived WGS84 positions to NZGD49 and records the errors remaining after selected conversions.",
    "https://www.linz.govt.nz/sites/default/files/static/tr1997-11-transformation-parameters-wgs84-nzgd2000.pdf",
    "GPS, WGS84, NZGD49, coordinate transformation",
    "profession"
  ],
  [
    "geodetic-strategic-business-plan-1998",
    "New Zealand Geodetic Strategic Business Plan",
    "Office of the Surveyor-General · LINZ",
    "1998",
    "1 July 1998 · OSG Technical Report 3",
    "Geodetic strategy",
    "Documents GIS, GPS and digital mapping as drivers for a modern geodetic reference system and sets short- and long-term development goals.",
    "https://www.linz.govt.nz/sites/default/files/static/tr03-new-zealand-geodetic-strategic-business-plan-1998.pdf",
    "GIS, GPS, spatial referencing, geodetic strategy",
    "profession"
  ],
  [
    "continuous-spatial-access-1999",
    "Proposal for Continuous Access to the New Zealand Spatial Infrastructure",
    "Office of the Surveyor-General · LINZ",
    "1999",
    "16 November 1999 · OSG Technical Report 6",
    "Geodetic infrastructure report",
    "Proposes continuous GNSS-based access to national coordinate infrastructure and explains the changing demands of spatial data users.",
    "https://www.linz.govt.nz/sites/default/files/cust/tr06-proposal-for-continuous-access-to-nz-spatial-infrastructure-1999.pdf",
    "GNSS, geodetic infrastructure, spatial data services",
    "profession"
  ],
  [
    "ross-dependency-geodesy-1999",
    "Ross Dependency (Antarctica): Current and Future Geodetic Activities",
    "Office of the Surveyor-General · LINZ",
    "1999",
    "16 May 1999 · OSG Technical Report 7",
    "Antarctic geodetic report",
    "Reviews Antarctic geodetic stations, the LINZ geodetic database and priorities for integrating survey observations into official spatial records.",
    "https://www.linz.govt.nz/sites/default/files/cust/tr07-ross-dependency-current-and-future-activities-1999.pdf",
    "Antarctica, geodetic database, GPS",
    "profession"
  ],
  [
    "nzgd2000-meridional-circuits-1999",
    "Proposal for Datum 2000 Meridional Circuits",
    "Office of the Surveyor-General · LINZ",
    "1999",
    "16 April 1999 · OSG Technical Report 8",
    "Projection and cadastre report",
    "Traces the historical cadastral circuits and proposes their adaptation for NZGD2000 digital survey workflows.",
    "https://www.linz.govt.nz/sites/default/files/tr08-proposal-for-nzgd2000-meridional-circuits-1999.pdf",
    "NZGD2000, meridional circuits, cadastral coordinates",
    "profession"
  ],
  [
    "seabed-cadastre-principles-1999",
    "Principles for a Seabed Cadastre",
    "Office of the Surveyor-General · LINZ",
    "1999",
    "24 June 1999 · OSG Technical Report 9",
    "Marine cadastre report",
    "Sets out how a digital marine cadastre could represent rights and spatial extents within New Zealand's offshore jurisdiction.",
    "https://www.linz.govt.nz/sites/default/files/cust/tr09-principles-for-seabed-cadastre-1999.pdf",
    "marine cadastre, spatial rights, EEZ",
    "profession"
  ],
  [
    "cadastre-reforms-1999",
    "Cadastre 2014 Reforms in New Zealand",
    "Tony Bevin · LINZ",
    "1999",
    "October 1999 · NZIS and FIG Commission VII conference",
    "Conference paper",
    "Contemporary account of Landonline, Digital Cadastral Database conversion, cadastral regulation and the proposed automated survey and titles system.",
    "https://www.linz.govt.nz/sites/default/files/cust/cadastre2014reformsinnz.pdf",
    "Landonline, DCDB, digital cadastre, surveying",
    "profession"
  ],
  [
    "doc-gis-1990",
    "Geographical Information Systems (GIS) and the Department of Conservation",
    "Mary McEwen · Department of Conservation",
    "1990",
    "July 1990 · Science and Research Internal Report 80",
    "Historical GIS assessment",
    "Early DOC review of GIS systems, spatial data requirements and potential conservation applications.",
    "https://www.doc.govt.nz/globalassets/documents/science-and-technical/srir80.pdf",
    "DOC, GIS implementation, conservation mapping",
    "open-practice"
  ],
  [
    "doc-national-database-workshop-1990",
    "Report on the Department of Conservation's National Database Workshop",
    "Helen Adcock and Mary McEwen · DOC",
    "1990",
    "October 1990 · Science and Research Internal Report 88",
    "Information-systems workshop report",
    "Documents DOC's early database plans, GIS-related data standards and participation by DSIR and land-information specialists.",
    "https://www.doc.govt.nz/globalassets/documents/science-and-technical/srir88.pdf",
    "DOCnet, digital databases, GIS, NZLRI",
    "open-practice"
  ],
  [
    "doc-databases-management-1990",
    "Databases and Their Application to Management Planning",
    "Mary McEwen · Department of Conservation",
    "1990",
    "1990 · Science and Research Internal Report 75",
    "Conservation information paper",
    "Examines the organisation of databases for conservation management planning during DOC's early computerisation.",
    "https://www.doc.govt.nz/globalassets/documents/science-and-technical/srir75.pdf",
    "conservation databases, management planning, digital systems",
    "open-practice"
  ],
  [
    "doc-conservation-information-1989",
    "Conservation Information: Where to Find It",
    "Mary McEwen and Helen Adcock · DOC",
    "1989",
    "1989 · Science and Research Internal Report 63",
    "Information catalogue",
    "A late-1980s guide to conservation data and its institutional sources, showing the information environment preceding integrated GIS.",
    "https://www.doc.govt.nz/globalassets/documents/science-and-technical/srir63.pdf",
    "DOC, information sources, data discovery",
    "open-practice"
  ],
  [
    "doc-conservancy-information-1992",
    "Report of an Analysis of DOC Conservancy Information",
    "M. Harrison and L. Jones · Department of Conservation",
    "1992",
    "1992 · Science and Research Internal Report 135",
    "Information requirements report",
    "Reviews conservation-office information holdings and needs as government departments expanded electronic databases.",
    "https://www.doc.govt.nz/globalassets/documents/science-and-technical/srir135.pdf",
    "DOC, database systems, regional information",
    "open-practice"
  ],
  [
    "nz-ecological-regions-maps-1987",
    "Ecological Regions and Districts of New Zealand: Map Sheets",
    "W. M. McEwen (editor) · Department of Conservation",
    "1987",
    "1987 · New Zealand Biological Resources Centre Publication 5",
    "Ecological district maps",
    "Monochrome scans of the four ecological district maps published at 1:500,000, an early national thematic mapping foundation for later GIS datasets.",
    "https://www.doc.govt.nz/globalassets/documents/science-and-technical/ecological_regions_maps.pdf",
    "ecological districts, thematic maps, conservation geography",
    "open-practice"
  ],
  [
    "nz-ecological-regions-booklet-1-1987",
    "Ecological Regions and Districts: Northern North Island",
    "W. M. McEwen (editor) · Department of Conservation",
    "1987",
    "1987 · Publication 5, Sheet 1",
    "Ecological districts reference",
    "The accompanying booklet describing ecological regions and districts of the northern North Island, including the Kermadec area.",
    "https://www.doc.govt.nz/globalassets/documents/science-and-technical/ecoregions1.pdf",
    "ecological regions, national mapping, North Island",
    "open-practice"
  ],
  [
    "nz-ecological-regions-booklet-2-1987",
    "Ecological Regions and Districts: Central North Island",
    "W. M. McEwen (editor) · Department of Conservation",
    "1987",
    "1987 · Publication 5, Sheet 2",
    "Ecological districts reference",
    "The published regional inventory for the central North Island, supporting the ecological districts map series.",
    "https://www.doc.govt.nz/globalassets/documents/science-and-technical/ecoregions2.pdf",
    "ecological regions, national mapping, central North Island",
    "open-practice"
  ],
  [
    "nz-ecological-regions-booklet-3-1987",
    "Ecological Regions and Districts: Central New Zealand",
    "W. M. McEwen (editor) · Department of Conservation",
    "1987",
    "1987 · Publication 5, Sheet 3",
    "Ecological districts reference",
    "The published central New Zealand district descriptions covering the southern North Island, upper South Island and Chatham Islands.",
    "https://www.doc.govt.nz/globalassets/documents/science-and-technical/ecoregions3.pdf",
    "ecological regions, national mapping, Chatham Islands",
    "open-practice"
  ],
  [
    "nz-ecological-regions-booklet-4-1987",
    "Ecological Regions and Districts: Southern South Island",
    "W. M. McEwen (editor) · Department of Conservation",
    "1987",
    "1987 · Publication 5, Sheet 4",
    "Ecological districts reference",
    "Descriptions and regional classification for the southern South Island and southern offshore islands in the 1987 ecological mapping series.",
    "https://www.doc.govt.nz/globalassets/documents/science-and-technical/ecoregions4.pdf",
    "ecological regions, national mapping, South Island",
    "open-practice"
  ]
];
export const pre2000PdfPublications=source.map(([slug,title,creator,year,date,kind,summary,url,tags,theme])=>({
 slug,title,creator,year,date,kind,summary,topic:tags,sourceName:url.includes('doc.govt.nz')?'Department of Conservation':'Land Information New Zealand',
 sourceUrl:url,sourceLabel:'Original publisher PDF',externalPdfUrl:mirrored.has(slug)?undefined:url,
 fileName:slug+'.pdf',license:'Original publisher publication; source credit retained.',
 attribution:creator+' ('+year+'), '+title+'. Source: '+url,
 themeIds:[theme],keywords:tags.split(',').map(x=>x.trim()),
 isPre2000Addition:true,generatedCover:!mirrored.has(slug)
}));
