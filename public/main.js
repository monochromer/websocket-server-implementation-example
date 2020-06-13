class WebSocketConnection {
  static get STATE() {
    return {
      'CONNECTING': 0, // соединение ещё не установлено,
      'OPEN': 1, // обмен данными,
      'CLOSING': 2, // соединение закрывается,
      'CLOSED': 3, // соединение закрыто.
    }
  }

  constructor(url, protocols) {
    this.ws = new WebSocket(url, protocols);
    this.addEventListeners(this.ws);
  }

  get events() {
    return (
      this._events ||
      Object.defineProperty(this, '_events', {
        value: Object.getOwnPropertyNames(this.constructor.prototype)
          .filter(type => /^on/.test(type))
          .map(type => type.slice(2))
      })._events
    );
  }

  handleEvent(event) {
    this['on' + event.type](event);
  }

  addEventListeners(target) {
    for (
      let events = this.events, i = events.length;
      i--;
      target.addEventListener(events[i], this)
    );
  }

  removeEventListeners(target) {
    for (
      let events = this.events, i = events.length;
      i--;
      target.removeEventListener(events[i], this)
    );
  }

  send(data) {
    this.ws.send(data);
  }

  close(code, reason) {
    this.ws.close(code, reason);
  }

  onopen(event) {
    console.log('Connection is open: ', event);
  }

  onclose(event) {
    console.log('Connection is closed: ', event);
  }

  onerror(event) {
    console.log('Connection error: ', event);
  }

  onmessage(event) {
    console.log('message: ', event);
  }
}

const socket = new WebSocketConnection('ws://localhost:3000/ws', ['json']);

setTimeout(() => {
  socket.send(JSON.stringify({
    message: 'Hello'
  }))
}, 1000)