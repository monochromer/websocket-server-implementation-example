# Пример реализации WebSocket на Node.js

## Статьи
- [WebSocket](https://learn.javascript.ru/websocket)
- [Сергей Кучин. Пишем свой dependency free WebSocket сервер на Node.js](https://habr.com/ru/post/513224/)
- [Srushtika Neelakantam. Implementing a WebSocket server with Node.js](https://medium.com/hackernoon/implementing-a-websocket-server-with-node-js-d9b78ec5ffa8)
- [Alexander Zlatkov. How JavaScript works: Deep dive into WebSockets and HTTP/2 with SSE + how to pick the right path](https://blog.sessionstack.com/how-javascript-works-deep-dive-into-websockets-and-http-2-with-sse-how-to-pick-the-right-path-584e6b8e3bf7)

## Заметки

Браузер делает http-запрос для утановления ws-соединения:
```http
GET /chat
Host: javascript.info
Origin: https://javascript.info
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Key: Iv8io/9s+lYFgZWcXczP8Q==
Sec-WebSocket-Version: 13
```

Если сервер согласен переключиться на WebSocket, то он должен отправить в ответ код 101:
```http
101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: hsBlbuDTkk24srzEOTBUlZAlC2g=
```
