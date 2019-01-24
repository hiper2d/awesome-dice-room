import {Component, Input} from '@angular/core';
import {RoomMessage} from '../../../model/room-message';

@Component({
    selector: 'room-message',
    templateUrl: './room-message.component.html',
    styleUrls: ['./room-message.component.scss']
})
export class RoomMessageComponent {
    @Input() message: RoomMessage;

    getAuthorStyle() {
        return {
            color: this.message.author.isSystem() && 'red' || `#${this.message.author.color}`
        };
    }

    getMessageStyle() {
        return {
            color: this.message.author.isSystem() && 'red'
        };
    }
}
