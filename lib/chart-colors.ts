import reference from './chart-reference-colors.json';
// Visual reference only: never used by calculations, facts or interpretation.
// Darker shades retain the reference hue while keeping small text legible.
const palette: Record<string, string> = {
  'rgb(239, 68, 68)': '#c83232',
  'rgb(3, 152, 85)': '#087b48',
  'rgb(247, 144, 9)': '#a65b00',
  'rgb(83, 88, 98)': '#535862',
  'rgb(24, 29, 39)': '#181d27',
};
export function chartColor(name: string): string {
  const key = name.replace(/^Lưu /, '').toLocaleLowerCase('vi').trim();
  return palette[(reference.colors as Record<string, string>)[key]] || '#282624';
}

// Legend names follow the visual reference, not a newly verified elemental table.
export const COLOR_LEGEND = [
  ['Kim', '#535862'], ['Mộc', '#087b48'], ['Thủy', '#181d27'],
  ['Hỏa', '#c83232'], ['Thổ', '#a65b00'],
] as const;
