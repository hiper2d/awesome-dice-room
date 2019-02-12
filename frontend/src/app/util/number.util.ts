export class NumberUtil {

  static rand = (max: number): number => Math.floor(Math.random() * max);

  static range = (size: number, startFrom: number = 0) => Array.from(new Array(size), (x, i) => i + startFrom);
}
