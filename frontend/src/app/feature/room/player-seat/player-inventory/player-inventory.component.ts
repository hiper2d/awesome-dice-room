import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Inventory, Item} from '../../../../model/inventory';

@Component({
  selector: 'player-inventory',
  templateUrl: './player-inventory.component.html',
  styleUrls: ['./player-inventory.component.scss']
})
export class PlayerInventoryComponent {
  @Input() inventory: Inventory;
  @Input() readonly = false;
  @Output() save = new EventEmitter();

  removeItem = (idx: number) => this.inventory.items.splice(idx, 1);
  addItem = () => this.inventory.items.push(new Item());
  onSave = () => this.save.emit(this.inventory);
}
