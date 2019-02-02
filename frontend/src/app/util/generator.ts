import {NumberUtil} from './number.util';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

export class Generator {

  static uuid(): string {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  static str = (len: number) => NumberUtil.range(len).reduce((acc) => acc + ALPHABET.charAt(NumberUtil.rand(ALPHABET.length)), '');
}
