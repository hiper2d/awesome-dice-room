class RoomDialogInputData {
  constructor(public roomId: string) {}
}

export class RoomDialogInput {
  data: RoomDialogInputData;

  constructor(public roomId: string) {
    this.data = new RoomDialogInputData(roomId);
  }
}
