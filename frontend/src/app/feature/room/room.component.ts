import {Component, OnInit} from '@angular/core';
import {WebSocketUtil} from '../../util/web-socket.util';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DieModel} from '../../model/die.model';
import {MatDialog} from '@angular/material';
import {RoomDialogComponent} from './room-dialog/room-dialog.component';
import {Router} from '@angular/router';
import {PlayerModel} from '../../model/player.model';
import {RoomModel} from '../../model/room.model';
import {UserService} from '../../core/service/user.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  num: string;
  name: string;
  diceFormGroup: FormGroup; // move this and other things from here to PlayerSeatComponent
  room = new RoomModel([]);

  // todo: make this component beautiful again
  // I finally made the handshake but it was hard. Now I need to redesign this all and to get back dice rolling.

  private readonly diceValues: Array<DieModel>; // rename me

  private wsConnection: WebSocket;

  constructor(
    fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {
    // remove this when players handshake be done
    this.diceValues = [
      new DieModel('d6', 'white', false),
      new DieModel('d6', 'white', true),
      new DieModel('d6', 'white', false)
    ];

    this.diceFormGroup = fb.group({
      dice: fb.array(this.diceValues)
    });
  }

  ngOnInit(): void {
    setTimeout(() => { // hack to avoid 'value has been changed before check'
      const dialogRef = this.dialog.open(RoomDialogComponent, {
        width: '250px'
      });

      dialogRef.afterClosed().subscribe(name => {
        if (!name) {
          this.router.navigate(['/']);
        } else {
          this.name = name;
          this.room.players.push(new PlayerModel(name, this.userService.userId));
          this.wsConnection = WebSocketUtil.connect(this.getWsMessageCallback());
          this.wsConnection.onopen = () => this.notifyOtherClientsThatYouJoined();
        }
      });
    });
  }

  get dice(): FormArray {
    return this.diceFormGroup.get('dice') as FormArray;
  }

  notifyOtherClientsThatYouJoined() {
    this.wsConnection.send(JSON.stringify({type: 'whatsup', data: this.name, uuid: this.userService.userId}));
  }

  addDie() {
    const newDie = new DieModel('d6', 'white', false); // this should go to separate popup
    this.dice.push(new FormControl(newDie));
  }

  removeDie() {
    this.dice.removeAt(this.dice.length - 1);
  }

  roll() {
    // this should go to popup
    console.log(this.dice.getRawValue());
    const diceValues = this.dice.getRawValue().filter((v: DieModel) => v.selected).map(() => 'd6').join(';');
    console.log(diceValues);
    this.wsConnection.send(JSON.stringify({type: 'roll', data: diceValues, uuid: this.userService.userId}));
  }

  // need to add message type check to distinguish handshake messages and die rolls
  private getWsMessageCallback(): (string) => void {
    return (message) => {
      const signal = JSON.parse(message.data);

      if (signal['type'] === 'dice') {
        this.num = signal.data;
      }

      console.log(signal);

      if (signal['type'] === 'whatsup' && signal['uuid'] !== this.userService.userId) {
        this.room.players.push(new PlayerModel(signal['data'], signal['uuid']));
        this.wsConnection.send(
          JSON.stringify({type: 'nicetomeetyou', data: this.name, uuid: this.userService.userId, direct: 'true', to: signal['uuid']})
        );
      }

      if (signal['type'] === 'nicetomeetyou' && signal['direct'] && signal['to'] === this.userService.userId) {
        this.room.players.push(new PlayerModel(signal['data'], signal['uuid']));
      }
    };
  }
}
