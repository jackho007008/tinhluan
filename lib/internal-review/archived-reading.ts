import { readFile } from 'node:fs/promises';
import type { ChartSnapshot } from '../tuvi-engine';
import type { FrozenReading } from './dynamic-reading';
/** Explicit, internal-only archive selection. No evaluator or current catalog is used. */
export async function archivedReading(version: string, sample: string) {
 if(!['1.8.0','1.9.0'].includes(version)) return null;
 const pack=JSON.parse(await readFile('exports/tanbien-review-1.9.0/readings.json','utf8'));
 const identity=sample || 'demo-wuqu-tianfu';
 const source=pack.rows.find((r: any)=>r.id===identity);
 const rows=version==='1.9.0'?pack.rows:JSON.parse(await readFile('exports/tanbien-reading-examples.json','utf8'));
 const reading=rows.find((r:any)=>r.id===identity);
 if(!reading || !source?.snapshot || reading.snapshotId!==source.snapshot.resultId) return null;
 return {snapshot:source.snapshot as ChartSnapshot, frozen:{reading,layers:{},tables:{},presentationVersion:'archive-'+version,catalogVersion:reading.catalog || reading.execution.rulesetVersion || 'archived-manifest',dynamicVersion:'archive-no-evaluation',verified:false} as FrozenReading};
}
