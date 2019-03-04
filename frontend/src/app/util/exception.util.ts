export class ExceptionUtil {

  static throwIfEmpty = (obj: any, exceptionText: string) => {
    if (!obj) {
      console.error(exceptionText);
      throw new Error(exceptionText);
    }
  }
}
