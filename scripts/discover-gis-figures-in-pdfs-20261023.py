#!/usr/bin/env python3
"""Identify genuine computer-GIS maps/screens in *already local* historical PDFs.
This is candidate research: publication requires further visual and paragraph review.
"""
import os,re,json,fitz
from pathlib import Path
from datetime import datetime,timezone

BASE=Path("public/assets/publications/pdfs")
EXTRA=Path("public/assets/historical/documents")
INCLUDE=re.compile(r"(gis|geo(spatial|graphic|detic|logic)?|spatial|lidar|terrain|bathym|forest|census|map|catchment|river|hydrolog|earthquake|hazard|transport|satellite|landcover|land-cover|land_use|land-use|topo|wetland|data|remote|landscape|survey|coastal|landonline|landinfo|environment)",re.I)
EXCLUDE=re.compile(r"(newsletter-|rare-bits|maps-and-plans-guide|old-map|19th-century|historical-maps)",re.I)
COMPUTER=re.compile(r"\b(GIS|ArcView|ARC/INFO|ArcGIS|ArcMap|ArcInfo|MapInfo|QGIS|Quantum GIS|GeoMedia|Intergraph|PostGIS|raster|LiDAR|digital elevation|hillshade|satellite|DEM|DTM|DTM|TIN|spatial data|geodatabase|vector layer|web map|web GIS|landcover|land cover|land-use|land use|cadastral|orthophoto|geoprocess|geoportal|flood hazard|thematic map|modelled map|delineat(?:ion|ed)|coastal inundation)\b",re.I)
CAPTION=re.compile(r"(?i)\b(?:fig(?:ure)?\.?\s*\d+[a-z]?|map\s*\d+[a-z]?|plate\s*\d+[a-z]?)\s*[:.\- ]\s*(.{10,220})")
MAPKEY=re.compile(r"\b(map|geospatial|spatial|ArcGIS|ArcView|ARC/INFO|MapInfo|QGIS|GIS|raster|terrain|LiDAR|satellite|classification|land cover|hydrology|flood|elevation|model|contour|screen|interface)\b",re.I)
files=sorted([p for base in (BASE,EXTRA) if base.exists() for p in base.glob("*.pdf") if INCLUDE.search(p.name) and not EXCLUDE.search(p.name)])
results=[];errors=[];pages_scanned=0
for pdf in files:
 try:
  doc=fitz.open(pdf)
  if doc.is_encrypted or doc.page_count==0 or pdf.stat().st_size>55_000_000:
   errors.append({"file":pdf.name,"reason":"Encrypted, zero pages, or larger than 55MB"});continue
  reviewed=[]
  for n in range(min(doc.page_count,75)):
   page=doc[n];pages_scanned+=1;text=page.get_text("text",sort=True)
   if not text or not COMPUTER.search(text):continue
   candidates=[]
   for match in CAPTION.finditer(text):
    phrase=" ".join(match.group(0).split())[:260]
    if MAPKEY.search(phrase):candidates.append(phrase)
   # Avoid conflating prose mentioning GIS with actual GIS figures.
   if not candidates:continue
   images=[]
   for img in page.get_images(full=True):
    xref=img[0]
    for rect in page.get_image_rects(xref):
     if rect.is_empty or rect.width<60 or rect.height<50:continue
     images.append({"xref":xref,"rect":[round(x,1) for x in rect],"displayArea":round(rect.width*rect.height),"pixelSize":[img[2],img[3]]})
   # A computer map may be wholly vector graphics, so retain figure-caption pages
   # without a bitmap but mark them for screenshot-only crop review.
   images.sort(key=lambda x:x["displayArea"],reverse=True)
   reviewed.append({"page":n+1,"captions":candidates[:5],"images":images[:4],"pageSize":[round(page.rect.width),round(page.rect.height)],"pageExcerpt":" ".join(text.split())[:450]})
  if reviewed:
   results.append({"pdfPath":str(pdf),"sourcePdf":"/"+str(pdf).replace("public/",""),"file":pdf.name,"documentPages":doc.page_count,"pages":reviewed[:20],"candidateCount":len(reviewed)})
 except Exception as e:errors.append({"file":pdf.name,"reason":str(e)[:200]})
summary={"filesAttempted":len(files),"filesWithFigures":len(results),"candidatePages":sum(len(x["pages"]) for x in results),"pagesScanned":pages_scanned,"errors":len(errors)}
out={"generatedAt":datetime.now(timezone.utc).isoformat(),"summary":summary,"documents":results,"errors":errors}
dest=Path("docs/media/gis-figure-research-wave3-20261023.json")
dest.parent.mkdir(parents=True,exist_ok=True)
dest.write_text(json.dumps(out,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
print("GIS figure PDF inventory",json.dumps(summary))
