// Bounded engine-generated synthetic birth input, no orders/database writes.
import fs from "node:fs";
import { calculate } from "../lib/tuvi-engine";
import { compareLinh } from "../lib/internal-review/linh-trial";
search: for (let month = 1; month <= 12; month++)
  for (let hour = 0; hour < 24; hour++) {
    const input = {
      date: `2000-${String(month).padStart(2, "0")}-16`,
      hour,
      minute: 0,
      unknownTime: false,
      place: "Hà Nội",
      gender: "male",
      calendar: "solar",
      profile: "vn-utc7-midnight-v1",
      timezone: "Asia/Ho_Chi_Minh",
      consent: true,
    };
    const snapshot = await calculate(input),
      result = compareLinh(snapshot);
    if (result.status === "compared" && result.lifeMovement === "vào Mệnh") {
      fs.writeFileSync(
        "lib/internal-review/engine-samples/linh-trial.json",
        JSON.stringify(
          {
            id: "linh-entry",
            kind: "engine",
            provenance:
              "Thông tin sinh giả lập, tìm tháng 1–12, giờ 0–23 tăng dần, dừng ở ca đầu vào Mệnh; không xác nhận chuyên môn",
            input,
            snapshot,
          },
          null,
          2,
        ),
      );
      console.log(
        "Found bounded engine sample",
        hour,
        result.old.branch,
        result.proposed.branch,
      );
      break search;
    }
  }
