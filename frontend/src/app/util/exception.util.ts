export class ExceptionUtil {

  static throwIfEmpty = (obj: any, exceptionText: string) => {
    if (!obj) {
      throw new Error(exceptionText);
    }
  }
}
