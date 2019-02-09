import {Player} from './player';

export class RoomMessage {
    constructor (
        public body: string,
        public author: Player,
        public timestamp: string
    ) {}
}
