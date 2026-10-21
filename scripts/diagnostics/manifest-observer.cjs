// Diagnostic only: log failing manifest reads, never contents. Does not recover or alter IO.
const fs = require('node:fs');
const original = fs.readFileSync;
fs.readFileSync = function(path, ...args) {
 const result=original.call(this,path,...args);
 if(typeof path==='string' && path.includes('.next/') && path.endsWith('.json') && path.includes('manifest')) {
  try {JSON.parse(String(result));} catch(e) {console.error('MANIFEST_DIAGNOSTIC',JSON.stringify({path:path.slice(path.indexOf('.next/')),bytes:Buffer.byteLength(result),stack:new Error('manifest-read').stack}));}
 }
 return result;
};
