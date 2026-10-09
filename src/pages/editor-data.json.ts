import {rawDataset} from '../lib/raw.mjs';import {hash} from '../lib/editorial.mjs';export async function GET(){const data=rawDataset();return Response.json({revision:hash(data),data});}
