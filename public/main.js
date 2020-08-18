class WebSocketConnection {
  // TODO: just use WebSocket.OPEN, WebSocket.CLOSED and etc.
  static get STATES() {
    return {
      'CONNECTING': 0, // соединение ещё не установлено,
      'OPEN': 1, // обмен данными,
      'CLOSING': 2, // соединение закрывается,
      'CLOSED': 3, // соединение закрыто.
    }
  }

  constructor(url, protocols, onmessage) {
    this.ws = new WebSocket(url, protocols);
    this.addEventListeners(this.ws);
    this.messageHandler = onmessage;
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
    this.messageHandler(event);
  }
}

const socket = new WebSocketConnection('ws://localhost:3000/ws', ['json'], onMessage);

const user = prompt('Enter your name');

const chatElement = document.getElementById('chat');
const form = document.querySelector('form');
const input = form.elements[0];

function createMessageElement(user, text) {
  const item = document.createElement('li');
  item.innerHTML = `
    <span class="username">${user}</span>. <span>${text}</span>
  `;
  chatElement.appendChild(item);
}

function onMessage(event) {
  try {
    console.log(event.data);
    const { message, user } = JSON.parse(event.data);
    createMessageElement(user, message);
  } catch (error) {
    console.error(error);
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const message = input.value.trim();
  socket.send(JSON.stringify({
    message,
    user
  }));
  input.value = '';
})
