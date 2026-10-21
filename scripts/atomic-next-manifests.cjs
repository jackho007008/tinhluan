// Next 15 dev emits manifests while requests read them. Publish complete files by
// same-directory rename; never recover a failed read with invented/cached data.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
function install(projectRoot) {
  const root = path.resolve(projectRoot, '.next') + path.sep;
  const match = p => typeof p === 'string' && path.resolve(p).startsWith(root) && /manifest\.(json|js)$/.test(p);
  const key = Symbol.for('tuvi.atomic-next-manifests');
  if (fs[key]?.has(root)) return fs[key].get(root);
  if (!fs[key]) fs[key] = new Map();
  const write = fs.promises.writeFile.bind(fs.promises);
  const rename = fs.promises.rename.bind(fs.promises);
  const unlink = fs.promises.unlink.bind(fs.promises);
  const atomic = async (file, data, options) => {
    const temp = file + '.pending-' + process.pid + '-' + crypto.randomUUID();
    try { await write(temp, data, options); await rename(temp, file); }
    catch (error) { await unlink(temp).catch(() => {}); throw error; }
  };
  const previousPromise = fs.promises.writeFile.bind(fs.promises);
  fs.promises.writeFile = (file, data, options) => match(file) ? atomic(file,data,options) : previousPromise(file,data,options);
  const previous = fs.writeFile.bind(fs);
  fs.writeFile = function(file,data,options,callback) {
    if(!match(file)) return previous(file,data,options,callback);
    if(typeof options === 'function') { callback=options; options=undefined; }
    if(typeof callback !== 'function') return previous(file,data,options,callback);
    atomic(file,data,options).then(()=>callback(null),callback);
  };
  // webpack may have captured graceful-fs before config evaluation.
  const plugin = {apply(compiler) {
    compiler.hooks.afterEnvironment.tap('AtomicNextManifests',()=> {
      const output=compiler.outputFileSystem, original=output.writeFile.bind(output);
      output.writeFile=(file,data,...rest)=> {
        if(!match(file)) return original(file,data,...rest);
        const callback=rest.pop(), options=rest[0];
        atomic(file,data,options).then(()=>callback(null),callback);
      };
    });
  }};
  fs[key].set(root, plugin);
  return plugin;
}
module.exports={install};
