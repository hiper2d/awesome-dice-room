import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayerModel} from '../../../model/player.model';

@Component({
  selector: 'app-player-seat',
  templateUrl: './player-seat.component.html',
  styleUrls: ['./player-seat.component.scss']
})
export class PlayerSeatComponent implements OnInit {

  @Input() player: PlayerModel;
  @Output() roll = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onRoll() {
    this.roll.emit();
  }
}
