export class ApiConst {
  static readonly API_PLAYERS = '/api/players';
  static readonly API_PLAYERS_FIND_OR_CREATE = '/api/players/find-or-create';
  static readonly API_ROOMS = '/api/rooms';
  static readonly API_SIGN_UP = '/api/signup';
  static readonly API_TOKEN = '/api/token';

  static readonly HEADER_AUTH = 'Authorization';
  static readonly HEADER_AUTH_PREFIX = 'bearer';

  // Have to set some fake host and post. Without them new WebSocket(ApiConst.WS_HOST) doesn't work.
  // The real connection is established via dev server proxy, see the proxy.conf.json file.
  static readonly WS_HOST = `ws://localhost:4200/ws`;
  static readonly WS_DASHBOARD = 'dashboard';
  static readonly WS_ROOM = 'room';
}
