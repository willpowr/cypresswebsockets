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
    cy.visit(url).then(window => {

        // Connection opened
        cy.spy(window, 'onOpen')
        // cy.stub(win, 'onOpen', evt => {
        //     console.log("WebSocket is re open now.")
        // })

        // Listen for messages
        cy.spy(window, 'onMessage')
        // cy.stub(win, 'onMessage', evt => {
        //     console.log('NO MESSAGE')
        // })

        cy.get('#connect').click()

        // Assert that the connection is open and ready to communicate. 
        cy.log('Checking ready state...')

        cy.wrap(window).should(win => {
            expect(win.websocket.readyState).to.eq(1)
        }).then(() => {
            cy.log('Sending message...')
            cy.wrap(window.websocket.send(testMessage)).as('SendMessage')
            cy.wrap(window.websocket.worker).as('Worker')

        }).then(() => {

            cy.get('#consoleLog').contains(`RECEIVED: ${testMessage}`)

        })
    })
})
