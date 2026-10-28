import type { FreeMenhView } from "@/lib/ai/free-menh";
import { CustomerEvidence } from "./CustomerReading";
import ReadingDisclosure from "./ReadingDisclosure";
export default function FreeMenhReading({ view }: { view: FreeMenhView }) {
  return (
    <section
      className="free-menh-reading"
      aria-label="Luận Mệnh miễn phí"
      data-free-menh="v1"
    >
      <p className="result-eyebrow">LUẬN MỆNH · ĐỌC MIỄN PHÍ</p>
      {view.paragraphs.length ? (
        <>
          {view.paragraphs.map(({ paragraph: p, text, editor, edit }) => (
            <article
              key={p.id}
              data-free-menh-paragraph={p.id}
              data-editor={editor}
            >
              {p.title && <h3>{p.title}</h3>}
              {text.split(/\n\n+/).map((s, i) => (
                <p key={i}>{s}</p>
              ))}
              <CustomerEvidence p={p} allowInternalLinks={false} />
              {edit && (
                <ReadingDisclosure>
                  <summary>Thông tin biên tập lời văn</summary>
                  <p>
                    Lời văn được AI biên tập từ bài gốc, không bổ sung luận
                    giải. Model: {edit.model} · {edit.promptVersion}.
                  </p>
                </ReadingDisclosure>
              )}
            </article>
          ))}
          <p className="result-muted">
            Phần đọc gồm những nội dung đã có trong bản lưu, chưa bao quát mọi
            phương diện cung Mệnh. Các chú giải truyền thống không xác nhận tính
            cách, hoàn cảnh hay tương lai thực tế của bạn.
          </p>
        </>
      ) : (
        <p>
          Phần Mệnh của bản lưu này chưa có lời biên soạn phù hợp để hiển thị.
          Bạn vẫn có thể xem dữ kiện cung Mệnh bên dưới.
        </p>
      )}
    </section>
  );
}
