import type { ChartData } from './index';
export const NATAL_TRANSFORMATIONS_VERSION = 'natal-transformations-1.0.0';
const kinds = ['Lộc', 'Quyền', 'Khoa', 'Kỵ'] as const;
export type NatalTransformations = {
  version: typeof NATAL_TRANSFORMATIONS_VERSION;
  scope: 'origin'; status: 'complete';
  method: string; source: string; sourceStatus: string;
  entries: { kind: string; star: string; palace: string; branch: string; path: string }[];
};
/** Called only at the current v2 adapter boundary, after the existing formula.
 * Certifies its four existing assignments; never computes or fills star metadata.
 */
export function certifyNatalTransformations(chart: ChartData): NatalTransformations {
  const trace = chart.tanBien?.trace.find(t => t.id === 'mutagens');
  if (!trace || !Array.isArray(trace.result) || trace.result.length !== 4 || new Set(trace.result).size !== 4) throw Error('MUTAGEN_CONTRACT_TRACE');
  const all = chart.palaces.flatMap((p,i) => (['majorStars','minorStars','adjectiveStars'] as const).flatMap(g => p[g].map((s,j) => ({s,p,path:`chart.palaces.${i}.${g}.${j}`}))));
  const transformed = all.filter(x => typeof x.s.mutagen === 'string' && x.s.mutagen !== '');
  if (transformed.length !== 4) throw Error('MUTAGEN_CONTRACT_COUNT');
  const entries = kinds.map((kind,i) => {
    const xs = transformed.filter(x => x.s.mutagen === kind && x.s.name === (trace.result as string[])[i] && (x.s as {scope?:string}).scope === 'origin');
    if(xs.length !== 1 || all.filter(x=>x.s.name===xs[0].s.name).length!==1) throw Error('MUTAGEN_CONTRACT_ASSIGNMENT');
    const x=xs[0];return {kind,star:x.s.name,palace:x.p.name,branch:x.p.earthlyBranch,path:x.path};
  });
  return {version:NATAL_TRANSFORMATIONS_VERSION,scope:'origin',status:'complete',method:chart.tanBien!.version,source:trace.source,sourceStatus:trace.status,entries};
}
/** Historical snapshots without this certificate remain unknown. Recheck the
 * assignments so an inconsistent imported/mutated object cannot assert absence. */
export function verifiedNatalTransformations(chart: ChartData): NatalTransformations | undefined {
  const c=chart.natalTransformations;
  if(!c || c.version!==NATAL_TRANSFORMATIONS_VERSION) return;
  try {const actual=certifyNatalTransformations(chart);if(JSON.stringify(c)===JSON.stringify(actual))return c;}catch{/* incomplete stays unknown */}
}
