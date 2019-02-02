export class NumberUtil {

  static rand = (max: number): number => Math.floor(Math.random() * max);

  static range = (size: number, startFrom: number = 0) => Array.from(new Array(20), (x, i) => i + startFrom);
}
