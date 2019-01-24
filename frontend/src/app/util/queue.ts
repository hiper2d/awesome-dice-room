export class Queue<T> {
    constructor(
        private limit: number = 0,
        private elements: Array<T> = []
    ) {}

    push(element: T) {
        if (this.limit && this.elements.length === this.limit) {
            this.pop();
        }

        this.elements.push(element);
    }

    pop(): T {
        return this.elements.shift();
    }

    asArray(): Array<T> {
        return [...this.elements];
    }
}
