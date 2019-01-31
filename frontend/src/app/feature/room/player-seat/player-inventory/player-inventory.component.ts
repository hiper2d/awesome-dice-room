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

  removeItem = (id: number) => this.inventory.items.splice(this.inventory.items.findIndex(i => i.id === id), 1);
  addItem = () => this.inventory.items.unshift(new Item(this.inventory.items.length));
  onSave = () => this.save.emit(this.inventory);
}
