const AVATARS = [
  'hunter',
  'mage',
  'paladin',
  'priest',
  'rogue',
  'shaman',
  'warrior'
];

const getPath = (name: string) => `assets/avatars/${name}.png`;

export class Avatar {
  static getAvatar () {
    const idx = Math.floor(Math.random() * AVATARS.length);
    return getPath(AVATARS[idx]);
  }
}
