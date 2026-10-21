"use client";
import {useState} from 'react';
import ChartSheet from './ChartSheet';
import ChartPeriods, {useChartPeriods} from './ChartPeriods';
import type {ChartSnapshot} from '@/lib/tuvi-engine';
export default function CustomerChart({snapshot,birthTimeLabel,interactive=false}:{snapshot:ChartSnapshot;birthTimeLabel?:string;interactive?:boolean}){
 // Viewing another year changes only the chart in this session, never the saved natal reading.
 const periods=useChartPeriods(snapshot, undefined, interactive);
 const [zoom,setZoom]=useState(false);
 const displayed=interactive?periods.snapshot:snapshot;
 return <div className={`customer-chart${interactive?' customer-chart-interactive':''}`}>
  {interactive&&<><ChartPeriods state={periods}/></>}
  {(!interactive||periods.ready)&&<ChartSheet compactControls={interactive} onToggleZoom={interactive?()=>setZoom(!zoom):undefined} birthTimeLabel={birthTimeLabel} snapshot={displayed} layers={interactive?periods.layers:undefined} context={displayed.chart.tanBien?'tanbien':'engine'} full zoom={interactive&&zoom} onSelect={index=>{const name=displayed.chart.palaces[index]?.name;const link=document.querySelector<HTMLAnchorElement>(`[data-customer-palace="${name}"]`);link?.click();}}/>}
 </div>;
}
