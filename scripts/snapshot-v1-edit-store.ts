import {
  snapshotV1EditStore,
  verifyV1EditSnapshot,
} from "../lib/ai/v1-edit-transfer";
const [action, source, destination] = process.argv.slice(2);
const result =
  action === "snapshot" && source && destination
    ? await snapshotV1EditStore(source, destination)
    : action === "verify" && source && !destination
      ? await verifyV1EditSnapshot(source)
      : null;
if (!result)
  throw Error(
    "Usage: snapshot-v1-edit-store snapshot <source> <new-directory> | verify <snapshot-directory>",
  );
console.log(
  JSON.stringify({
    fileCount: result.fileCount,
    manifestHash: result.manifestHash,
    apiCalls: 0,
  }),
);
