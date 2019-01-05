import { Component, OnInit } from '@angular/core';
import {WebSocketService} from '../core/service/websocket.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  num: string;
  diceFormGroup: FormGroup;

  private wsConnection: WebSocket;
  private uuid: string;

  constructor(
    fb: FormBuilder,
    public webSocketService: WebSocketService
  ) {
    this.diceFormGroup = fb.group({
      dice: fb.array([
        false, true, false
      ])
    });
  }

  ngOnInit(): void {
    this.uuid = this.createUuid();
    this.wsConnection = this.webSocketService.connect(this.getWsMessageCallback());
  }

  get dice(): FormArray {
    return this.diceFormGroup.get('dice') as FormArray;
  }

  addDie() {
    this.dice.push(new FormControl(true));
  }

  roll() {
    const diceValues = this.dice.getRawValue().filter(v => !!v).map(_ => 'd6').join(';');
    console.log(diceValues);
    this.wsConnection.send(JSON.stringify({ type: 'roll', data: diceValues, uuid: this.uuid }));
  }

  private getWsMessageCallback(): (string) => void {
    return (message) => {
      /*const signal = JSON.parse(message.data);
      if (signal.uuid === this.uuid) {
        console.log('Received self signal');
        return;
      }*/
      this.num = message.data;
    };
  }

  // Taken from http://stackoverflow.com/a/105074/515584
  // Strictly speaking, it's not a real UUID, but it gets the job done here
  private createUuid(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}
