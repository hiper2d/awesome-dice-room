import {Component, Input} from '@angular/core';
import {Player} from '../../../model/player';

@Component({
  selector: 'player-seat',
  templateUrl: './player-seat.component.html',
  styleUrls: ['./player-seat.component.scss']
})
export class PlayerSeatComponent {
  @Input() player: Player;
}
