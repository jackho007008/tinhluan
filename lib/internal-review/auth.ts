import { createHmac, timingSafeEqual } from "node:crypto";
const secret = () => process.env.INTERNAL_REVIEW_KEY || "";
export function validKey(value: string) {
  const key = secret();
  return (
    key.length >= 32 &&
    value.length <= 256 &&
    timingSafeEqual(
      Buffer.from(createHmac("sha256", key).update(value).digest("hex")),
      Buffer.from(createHmac("sha256", key).update(key).digest("hex")),
    )
  );
}
export function issueReviewSession(now = Date.now()) {
  if (secret().length < 32) throw Error("INTERNAL_NOT_CONFIGURED");
  const expiry = String(now + 60 * 60 * 1000);
  return (
    expiry +
    "." +
    createHmac("sha256", secret())
      .update("internal-review:" + expiry)
      .digest("hex")
  );
}
export function reviewAuthorized(value: string | undefined, now = Date.now()) {
  if (!value || secret().length < 32 || !/^\d{13}\.[a-f0-9]{64}$/.test(value))
    return false;
  const [expiry, signature] = value.split(".");
  if (Number(expiry) <= now || Number(expiry) > now + 60 * 60 * 1000)
    return false;
  const expected = createHmac("sha256", secret())
    .update("internal-review:" + expiry)
    .digest("hex");
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
