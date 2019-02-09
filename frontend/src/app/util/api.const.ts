export class ApiConst {
  static readonly API_PLAYERS = '/api/players';
  static readonly API_PLAYERS_FIND_OR_CREATE = '/api/players/find-or-create';
  static readonly API_ROOMS = '/api/rooms';

  static readonly WS_HOST = `ws://${window.location.hostname}:8080/ws`;
  static readonly WS_DASHBOARD = 'dashboard';
  static readonly WS_ROOM = 'room';
}
