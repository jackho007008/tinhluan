import { mkdir, writeFile, rename } from "node:fs/promises";
import path from "node:path";
export interface EmailProvider {
  send(message: { id: string; to: string; link: string }): Promise<void>;
}
export const localEmail: EmailProvider = {
  async send(m) {
    if (
      (process.env.NODE_ENV === "production" && !(process.env.QA_LOCAL_MAIL_ENABLED === "true" && ["localhost", "127.0.0.1", "[::1]"].includes(new URL(process.env.DATABASE_URL || "postgresql://localhost:55439/tuvi").hostname))) ||
      process.env.EMAIL_PROVIDER !== "local"
    )
      throw new Error("EMAIL_PROVIDER_UNAVAILABLE");
    const dir = path.resolve(process.env.LOCAL_MAIL_DIR || path.join(process.cwd(), ".local/mail"));
    await mkdir(dir, { recursive: true, mode: 0o700 });
    const dest = path.join(dir, `${m.id}.json`);
    await writeFile(
      dest + ".tmp",
      JSON.stringify(
        {
          to: m.to,
          subject: "Báo cáo Tử vi của bạn",
          text: "Liên kết dùng một lần, hết hạn sau 15 phút.",
          link: m.link,
        },
        null,
        2,
      ),
      { mode: 0o600 },
    );
    await rename(dest + ".tmp", dest);
  },
};

/** One dispatch path for the existing queue; no fallback after SMTP failure. */
export async function sendEmail(message:Parameters<EmailProvider['send']>[0]){
 if(process.env.EMAIL_PROVIDER==='gmail-smtp'){
  const {gmailEmail}=await import('./gmail');return gmailEmail.send(message);
 }
 return localEmail.send(message);
}
