const StompJs = require('@stomp/stompjs')

const wsUri = "wss://echo.websocket.org/?encoding=text"
const options = new Object
options["brokerURL"] = wsUri

options["connectHeaders"] = new Object
options.connectHeaders["Sec-WebSocket-Protocol"] = "soap"

const client = new StompJs.Client(options);




it('Sends and receives a text message', () => {
    console.log(options)
    console.log(client)
    client.activate()

})
