const COLORS = [
  'pink',
  'purple',
  'deep-purple',
  'indigo',
  'blue',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'light-green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'deep-orange',
  'brown',
  'grey',
  'blue-grey',
];

export class Color {
  static getColor(): string {
    const idx = Math.floor(Math.random() * COLORS.length);
    return COLORS[idx];
  }
}
