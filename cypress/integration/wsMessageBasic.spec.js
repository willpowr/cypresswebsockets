describe('Backend Websocket Tests', () => {

    it('Sends and receives a text message', () => {

        const wsUri = "wss://echo.websocket.org/?encoding=text"
        const testMessage = 'Test message 1'

        // Create WebSocket connection.
        const websocket = new WebSocket(wsUri)

        // An event listener to be called when the connection is opened
        websocket.onopen = function () {
            console.log("WebSocket is open now.")

            // Send a message to the server
            websocket.send(testMessage)
        }

        // An event listener to be called when a message is received from the server.
        websocket.onmessage = function (messageEvent) {
            console.log("Message received")

            // Assert that the message from the server matches the original
            expect(messageEvent.data).to.equal(testMessage)
        }
    })
})
