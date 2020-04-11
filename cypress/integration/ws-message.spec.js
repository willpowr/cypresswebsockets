const wsUri = "wss://echo.websocket.org/?encoding=text"
const url = 'https://www.websocket.org/echo.html'


describe('Backend Websocket Tests', () => {

    function connectWebSocket(testMessage) {
        return new Promise(resolve => {
            // Create WebSocket connection.
            const websocket = new WebSocket(wsUri);

            // Connection opened
            websocket.onopen = function (event) {
                console.log("WebSocket is open now.");
                websocket.send(testMessage);
            }

            // Listen for incoming message
            websocket.onmessage = function (event) {
                resolve(event.data)
            }
        })
    }


    it.skip('Sends and receives a text message', () => {
        const testMessage = 'Test message 1'

        cy.wrap(connectWebSocket(testMessage))
            .then(incomingMessage => {
                expect(incomingMessage).to.equal(testMessage)
            })
    })
})


it('Loads demo page and sends message', () => {
    const testMessage = 'Test message 2'
    // cy.spy(window, 'onopen', (stream) => {
    //     console.log('WS connected!');
    //   })
    cy.visit(url)
        .then(window => {
            cy.get('#connect').click()
                .then(() => {
                    cy.spy(window.websocket, 'send')

                    cy.wrap(window.websocket)
                    

                    const websocket = window.websocket

                    // Connection opened
                    websocket.onopen = function (event) {
                        console.log("WebSocket is open now.");
                        websocket.send(testMessage);
                    }

                    // Listen for incoming message
                    // websocket.onmessage = function (event) {
                    //     // console.log(event.data)
                    // }
                })
            // cy.get('#consoleLog').contains(`RECEIVED: ${testMessage}`)
        })
})
