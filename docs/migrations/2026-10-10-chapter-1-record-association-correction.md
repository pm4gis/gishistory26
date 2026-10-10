# Chapter 1 record association correction — 10 October 2026

Base revision: `038ecd8ad7f7beb76625b46e09b3d8f70792804b`

In `src/content/passages/chapter-1-p003.json`, remove the passage association `entity:traverse-seamless`. The passage describes pre-digital triangulation, geodetic control and the Department of Lands and Survey. It does not discuss Traverse Seamless or any 2025 vendor product. The association was unrelated to the passage and created a misleading profile link.

Retain `person:rachel-gillanders`, which is named in the text, and add `entity:department-of-lands-and-survey`, which is the department responsible for the cited survey work. This correction changes only the chapter’s entity associations; it does not change the passage ID, text evidence or relationship records.

The change is documented in the Chapter 1 editorial review and checked in the updated preservation manifest and repository build.
