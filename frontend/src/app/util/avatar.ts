import {NumberUtil} from './number.util';

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
    const idx = NumberUtil.rand(AVATARS.length);
    return getPath(AVATARS[idx]);
  }
}
