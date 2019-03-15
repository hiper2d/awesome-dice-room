import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Inventory, Item} from '../../../../model/inventory';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'player-inventory',
  templateUrl: './player-inventory.component.html',
  styleUrls: ['./player-inventory.component.scss']
})
export class PlayerInventoryComponent implements OnInit {
  @Input() inventory: Inventory;
  @Input() readonly = false;
  @Output() save = new EventEmitter();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      items: fb.array([])
    });
  }

  ngOnInit() {
    const items = this.form.get('items') as FormArray;
    this.inventory.items.forEach(it => items.push(this.createItem(it)));
  }

  createItem(it?: Item): FormGroup {
    return this.fb.group({
      name: [it ? it.name : '', Validators.required],
      description: [it ? it.description : '', Validators.required]
    });
  }

  removeItem(index: number) {
    this.getItems().removeAt(index);
    this.form.markAsDirty();
  }

  addItem() {
    this.getItems().insert(0, this.createItem(new Item()));
  }

  onSave() {
    this.save.emit(this.form.value);
    this.form.markAsPristine();
  }

  getItems() {
    return this.form.get('items') as FormArray;
  }

  isDisabled() {
    return this.form.invalid || this.form.pristine;
  }
}
