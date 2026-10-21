import { test as base, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
export { expect };
// Only payment journey tests own a worker. The fault-injection retry test must run without one.
export const test = base.extend<{ localWorker: void }>({
 localWorker: [async ({}, use) => {
  const child=spawn(process.execPath,['--import','tsx','scripts/worker.ts'],{env:process.env,stdio:'ignore'});
  let stopped=false;const exit=new Promise<void>(resolve=>child.once('exit',()=>{stopped=true;resolve();}));
  try{await use();}finally{if(!stopped)child.kill('SIGTERM');await exit;}
 },{auto:true}]
});
