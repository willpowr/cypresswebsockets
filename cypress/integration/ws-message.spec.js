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
    const modifiedMessage = 'Modified message'

    cy.visit(url).then(window => {

        // Connection opened
        cy.spy(window, 'onOpen')
        // cy.stub(win, 'onOpen', evt => {
        //     console.log("WebSocket is re open now.")
        // })
        console.log('orig func', window.onMessage.toString())


        let funcBodyString = window.onMessage.toString()
            // Remove enclosing braces    
            .match(/{([\s\S]*)}/)[1]

            // Modify returned string
            .replace('evt.data', '`${modifiedMessage}`')

            // Add window reference to log element call
            .replace('logElementToConsole', 'window.logElementToConsole')

        // let onMessage
        eval(`window.onMessage = function onMessage(evt) { ${funcBodyString} }`)

        // Listen for messages
        cy.spy(window, 'onMessage')
        // cy.stub(window, 'onMessage', window.onMessage)

    })


    cy.get('#connect').click()

    // Assert that the connection is open and ready to communicate. 
    cy.window({ timeout: 10000 }).should(window => {
        expect(window.websocket.readyState).to.eq(1)
    }).then(window => {
        cy.wrap(window.websocket.send(testMessage))

        // Assert that onMessage is called 
        cy.window().its('onMessage').should('be.called')

        cy.get('#consoleLog').contains(`RECEIVED: ${modifiedMessage}`)
    })
})
