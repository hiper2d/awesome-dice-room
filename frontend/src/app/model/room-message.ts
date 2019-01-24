import {Player} from './player';

export class RoomMessage {
    constructor (
        public body: string,
        public author: Player = Player.systemPlayer(),
        public timestamp: string
    ) {}
}
