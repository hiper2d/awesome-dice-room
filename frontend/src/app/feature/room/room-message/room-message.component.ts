import {Component, Input, OnInit, SecurityContext} from '@angular/core';
import {RoomMessage} from '../../../model/room-message';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'room-message',
    templateUrl: './room-message.component.html',
    styleUrls: ['./room-message.component.scss']
})
export class RoomMessageComponent implements OnInit {
    @Input() message: RoomMessage;
    sanitizedMessage: string;

    constructor(private sanitizer: DomSanitizer) {}

    getAuthorStyle() {
        return {
            color: this.message.author.isSystem() && 'red' || `#${this.message.author.color}`
        };
    }

    getMessageStyle() {
        return {
            color: this.message.author.isSystem() && 'red',
            'word-break': 'break-all'
        };
    }

    ngOnInit(): void {
        this.sanitizedMessage = this.sanitizer.sanitize(SecurityContext.HTML, this.message.body);
    }
}
