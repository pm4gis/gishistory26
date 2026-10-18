// Early LINZ annual reports and statements of intent relevant to New Zealand GIS history.
// Dates describe the original publications, not their 2026 archival acquisition.
import {mirroredLinzReportSlugs} from './linz-historical-reports-mirrored.mjs';
const mirrored = new Set(mirroredLinzReportSlugs);
const source = [
  [
    "linz-annual-report-2001",
    "Land Information New Zealand Annual Report 2000/01",
    "2001",
    "2000/01 financial year",
    "Historical annual report",
    "Records early electronic land-information systems, the organisational information-management programme and the operating context preceding national digital mapping services.",
    "https://www.linz.govt.nz/sites/default/files/corp/annual-report.pdf",
    "Landonline, information systems, land records"
  ],
  [
    "linz-annual-report-2004",
    "Land Information New Zealand Annual Report 2003/04",
    "2004",
    "2003/04 financial year",
    "Historical annual report",
    "Documents nationwide electronic survey in Landonline, the 2003 survey conversion of 1.35 million parcels and improvements to digital land-information services.",
    "https://www.linz.govt.nz/sites/default/files/corp/linz-annual-report-2004.pdf",
    "Landonline, survey conversion, cadastre"
  ],
  [
    "linz-annual-report-2005",
    "Land Information New Zealand Annual Report 2004/05",
    "2005",
    "2004/05 financial year",
    "Historical annual report",
    "Contemporary evidence of the development of Landonline, geographic information policy and the transition towards coordinated public-sector spatial data.",
    "https://www.linz.govt.nz/sites/default/files/corp/linz-annual-report-2005.pdf",
    "Landonline, land records, geospatial policy"
  ],
  [
    "linz-annual-report-2006",
    "Land Information New Zealand Annual Report 2005/06",
    "2006",
    "2005/06 financial year",
    "Historical annual report",
    "Describes consultation on the proposed New Zealand Geospatial Strategy, the Ocean Survey 20/20 programme and the move to mandatory electronic lodgement.",
    "https://www.linz.govt.nz/sites/default/files/corp/linz-annual-report-2006.pdf",
    "geospatial strategy, Ocean Survey 20/20, Landonline"
  ],
  [
    "linz-annual-report-2007",
    "Land Information New Zealand Annual Report 2006/07",
    "2007",
    "2006/07 financial year",
    "Historical annual report",
    "Records the national authoritative geospatial record, digital land and seabed information services and implementation of the first New Zealand Geospatial Strategy.",
    "https://www.linz.govt.nz/sites/default/files/corp/linz-annual-report-2007.pdf",
    "New Zealand Geospatial Strategy, cadastral data, Landonline"
  ],
  [
    "linz-annual-report-2009",
    "Land Information New Zealand Annual Report 2008/09",
    "2009",
    "2008/09 financial year",
    "Historical annual report",
    "Documents implementation of the New Zealand Geospatial Strategy, improving access to location information and public-sector coordination.",
    "https://www.linz.govt.nz/sites/default/files/corp/annual_report_2008-2009.pdf",
    "geospatial strategy, spatial data, SDI"
  ],
  [
    "linz-annual-report-2010",
    "Land Information New Zealand Annual Report 2009/10",
    "2010",
    "2009/10 financial year",
    "Historical annual report",
    "Captures work on New Zealand geospatial information infrastructure and digital land-information services immediately before the LINZ Data Service era.",
    "https://www.linz.govt.nz/sites/default/files/corp/linz-annual-report-2009-2010.pdf",
    "geospatial information, Landonline, national infrastructure"
  ],
  [
    "linz-statement-of-intent-2005",
    "Land Information New Zealand Statement of Intent 2005/06",
    "2005",
    "2005/06 planning year",
    "Historical strategy",
    "Describes the 2004 geospatial discussion document and proposed government coordination of GIS datasets, interoperability and geospatial information discovery.",
    "https://www.linz.govt.nz/sites/default/files/corp/soi-2005.pdf",
    "2004 discussion document, GIS, national strategy"
  ],
  [
    "linz-statement-of-intent-2007",
    "Land Information New Zealand Statement of Intent 2007/08",
    "2007",
    "2007/08 planning year",
    "Historical strategy",
    "Defines the emerging New Zealand Geospatial Office and its role in coordinating government geographic information after the 2007 strategy.",
    "https://www.linz.govt.nz/sites/default/files/corp/soi-2007.pdf",
    "NZGO, Geospatial Strategy, spatial information"
  ],
  [
    "linz-statement-of-intent-2008",
    "Land Information New Zealand Statement of Intent 2008/09",
    "2008",
    "2008/09 planning year",
    "Historical strategy",
    "Sets out LINZ objectives for digital land-information delivery, government location-information markets and national coordination.",
    "https://www.linz.govt.nz/sites/default/files/corp/statement-intent-0809.pdf",
    "geospatial coordination, data availability, land information"
  ],
  [
    "linz-statement-of-intent-2009",
    "Land Information New Zealand Statement of Intent 2009–2012",
    "2009",
    "2009–2012 planning period",
    "Historical strategy",
    "Presents a government spatial-data infrastructure framework covering governance, data quality, interoperability and public access to geospatial services.",
    "https://www.linz.govt.nz/sites/default/files/corp/statement-intent-2009-2012.pdf",
    "SDI, geospatial access, interoperability"
  ],
  [
    "linz-statement-of-intent-2010",
    "Land Information New Zealand Statement of Intent 2010–2013",
    "2010",
    "2010–2013 planning period",
    "Historical strategy",
    "Describes growing use of GIS in New Zealand business and government and the planned expansion of national survey and mapping datasets and services.",
    "https://www.linz.govt.nz/sites/default/files/corp/statement-intent-2010-2013.pdf",
    "GIS, open geospatial data, national mapping"
  ],
  [
    "linz-statement-of-intent-2011",
    "Land Information New Zealand Statement of Intent 2011–2014",
    "2011",
    "2011–2014 planning period",
    "Historical strategy",
    "Details the New Zealand Geospatial Office mandate, projected productivity benefits from location information and the programme for connecting datasets with users.",
    "https://www.linz.govt.nz/sites/default/files/corp/statement-intent-2011-2014.pdf",
    "NZGO, economic value, SDI, GIS"
  ]
];
export const linzHistoricalReports = source.map(([slug,title,year,date,kind,summary,sourceUrl,topic]) => ({
 slug,title,year,date,kind,summary,sourceUrl,topic,
 fileName: slug+'.pdf',
 creator:'Land Information New Zealand',
 sourceName:'Toitū Te Whenua – Land Information New Zealand',
 sourceLabel:'Original LINZ publication',
 externalPdfUrl:mirrored.has(slug)?undefined:sourceUrl,
 license:'LINZ-authored website content is generally CC BY 4.0 unless source-specific conditions state otherwise.',
 licenseUrl:'https://www.linz.govt.nz/copyright',
 attribution:'Source: Toitū Te Whenua Land Information New Zealand. '+title+' ('+year+'). https://www.linz.govt.nz/copyright',
 themeIds:['profession','open-practice'],keywords:topic.split(',').map(s=>s.trim()),
 isLinzArchiveAddition:true,generatedCover:!mirrored.has(slug)
}));
