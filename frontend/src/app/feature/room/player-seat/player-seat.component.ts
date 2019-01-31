import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Player} from '../../../model/player';
import {Inventory} from '../../../model/inventory';

@Component({
  selector: 'player-seat',
  templateUrl: './player-seat.component.html',
  styleUrls: ['./player-seat.component.scss']
})
export class PlayerSeatComponent {
  @Input() player: Player;
  @Input() readonly = true;
  @Output() inventorySave = new EventEmitter();

  onInventorySave = (inventory: Inventory) => this.inventorySave.emit(inventory);
}
