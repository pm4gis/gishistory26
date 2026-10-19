// Compatibility export for consumers of the original homepage selection list.
import {homeStories} from './home-stories.mjs';
export const homeHighlightSlugs=Object.freeze(homeStories.map(story=>story.slug));
