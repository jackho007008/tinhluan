import {safeReturn} from '../lib/customer-auth/config';
import {it,expect,vi,afterEach} from 'vitest';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {birthSubmission,readBirthForm,validateBirthForm} from '../lib/customer-form';
import ReferenceBirthForm from '../components/ReferenceBirthForm';
const access=vi.hoisted(()=>({allowed:true}));
vi.mock('next/headers',()=>({cookies:async()=>({get:()=>({value:'opaque-session'})})}));
// G3 edit now uses the same server access resolver as the reading/API, including account and verified recovery.
// Authorization itself is exercised against real storage in customer-workspace/reading-scope tests.
vi.mock('../lib/trial/reading-access',()=>({customerReadingAccess:async()=>access.allowed?{record:{inputReceipt:{entered:{name:'Bản của phiên',day:12,month:9,year:1988,calendar:'lunar',isLeap:true,hourIndex:0,gender:'female'}}}}:null}));

import EditPage from '../app/lap-la-so/page';
const input={name:'Mẫu mới',day:10,month:2,year:1997,calendar:'solar' as const,isLeap:false,hourIndex:6,gender:'female' as const};
afterEach(()=>{vi.unstubAllEnvs();access.allowed=true;});
it('missing fields have adjacent-field targets; impossible solar dates reuse calendar validation',()=>{
 const empty=new FormData();expect(readBirthForm(empty,'solar').hourIndex).toBe(-1);empty.set('hour','0');expect(readBirthForm(empty,'solar').hourIndex).toBe(0);
 expect(validateBirthForm({...input,day:0,month:0,year:0,hourIndex:-1})).toMatchObject({input:null,errors:{day:expect.any(String),month:expect.any(String),year:expect.any(String),hourIndex:expect.any(String)}});
 expect(validateBirthForm({...input,day:29,month:2})).toMatchObject({input:null,errors:{birthDate:expect.any(String)}});
 expect(validateBirthForm({...input,day:29,month:2,year:2000}).input?.day).toBe(29);
 expect(validateBirthForm(input).input).toEqual(input);
});
it('double submit sends once while pending and after successful redirect request',async()=>{
 const gate=birthSubmission();let release!:()=>void;const wait=new Promise<void>(resolve=>release=resolve),send=vi.fn(async()=>{await wait;});
 const first=gate.run(input,send);await gate.run(input,send);expect(send).toHaveBeenCalledTimes(1);expect(gate.pending).toBe(true);
 release();await first;await gate.run(input,send);expect(send).toHaveBeenCalledTimes(1);
});
it('lost-response retry uses identical ID; edited input and fresh edit form get new IDs',async()=>{
 const gate=birthSubmission(),ids:string[]=[];
 const fail=async(id:string)=>{ids.push(id);throw new TypeError('Failed to fetch');};
 await expect(gate.run(input,fail)).rejects.toThrow();expect(gate.pending).toBe(false);
 await expect(gate.run({...input},fail)).rejects.toThrow();expect(ids[1]).toBe(ids[0]);
 await expect(gate.run({...input,day:11},fail)).rejects.toThrow();expect(ids[2]).not.toBe(ids[0]);
 let fresh='';await birthSubmission().run(input,async id=>{fresh=id;});expect(fresh).not.toBe(ids[0]);
});
it('public form submits directly while internal form retains its confirmation flow; values prefill including Ty and lunar leap',()=>{
 const publicHtml=renderToStaticMarkup(React.createElement(ReferenceBirthForm,{publicTrial:true,initialInput:{...input,calendar:'lunar',isLeap:true,hourIndex:0}}));
 expect(publicHtml).toContain('method="post"');expect(publicHtml).toContain('<fieldset disabled="">');expect(publicHtml).toContain('type="submit" disabled="">Lập lá số</button>');expect(publicHtml).not.toContain('Tiếp tục');expect(publicHtml).not.toContain('Xác nhận thông tin');
 expect(publicHtml).toContain('value="Mẫu mới"');expect(publicHtml).toContain('value="0" selected');expect(publicHtml).toContain('name="leap" checked');
 expect(renderToStaticMarkup(React.createElement(ReferenceBirthForm,{}))).toContain('Tiếp tục');
});
it('edit page loads saved input only for owner, and sends no prefill to a foreign session',async()=>{
 vi.stubEnv('FREE_TRIAL_ENABLED','true');
 const own=renderToStaticMarkup(await EditPage({searchParams:Promise.resolve({edit:'e251b03b-c74f-4853-91c8-81660d573f6c'})}));expect(own).toContain('value="Bản của phiên"');expect(own).toContain('value="1988"');
 access.allowed=false;const foreign=renderToStaticMarkup(await EditPage({searchParams:Promise.resolve({edit:'e251b03b-c74f-4853-91c8-81660d573f6c'})}));expect(foreign).toContain('Không mở được thông tin');expect(foreign).not.toContain('Bản của phiên');expect(foreign).not.toContain('<form');
});

it('login return keeps a bounded structural anchor without allowing other destinations or personal fields',()=>{
 const url='/ban-doc?id=e251b03b-c74f-4853-91c8-81660d573f6c';
 expect(safeReturn(url+'&mode=basic&name=private#cung-4')).toBe(url+'&mode=basic#cung-4');
 expect(safeReturn(url+'#<script>')).toBe(url);
 expect(safeReturn('https://outside.test'+url+'#cung-4')).toBe('/la-so-cua-toi');
});
