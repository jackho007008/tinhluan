/** Presentation only: preserve the stored claim and the source's local grade. */
export function p1ReaderText(ruleIds: string[], text: string): string {
  const kind = ['cuc', 'empty', 'one'].find(k => ruleIds.includes(`npl.life-foundation-${k}`));
  if (!kind) return text;
  const terms = kind === 'cuc'
    ? 'Bản Mệnh ở đây là hành nạp âm của năm sinh; Cục là nhóm ngũ hành dùng trong cách lập lá số. '
    : kind === 'empty'
      ? 'Hành cung là ngũ hành của địa chi nơi đặt Mệnh; phép xét này không mượn sao đối cung. '
      : 'Hành cung là ngũ hành của địa chi nơi đặt Mệnh; hành sao là thuộc tính của chính tinh theo bảng nguồn. ';
  return terms + text.replace('trường hợp này được xếp', 'trường hợp này mang nhãn')
    + ' Phép xét này đứng riêng với các chú giải sao; không dùng nó để chọn bên thắng giữa các nhận định khác chiều.';
}
