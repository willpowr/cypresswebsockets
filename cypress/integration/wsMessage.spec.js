
describe('Backend Websocket Tests', () => {
    const wsUri = "wss://echo.websocket.org/?encoding=text"

    // Create object containing dummy spy functions
    const dummySpies = {
        onOpen() { },
        onMessage() { }
    }

    function connectWebSocket(wsUri) {
        return new Promise(resolve => {
            
            // Create the spy
            cy.spy(dummySpies, 'onOpen').as('onOpenSpy')

            // Create WebSocket connection.
            const websocket = new WebSocket(wsUri)

            // An event listener to be called when the connection is opened
            websocket.onopen = function () {
                console.log("WebSocket is open now.")

                // Call the spied on dummy method
                dummySpies.onOpen()
            }

            // An event listener to be called when a message is received from the server.
            websocket.onmessage = function (event) {
                console.log("Message received")

                // Call the spied on dummy method
                dummySpies.onMessage(event)
            }

            cy.get('@onOpenSpy', { timeout: 10000 })
                .should(onOpenSpy => {

                    // Assert that the spy has been called
                    expect(onOpenSpy).to.be.called

                    // Yield the websocket object
                    resolve(websocket)
                })
        })
    }

    function sendMessage(websocket, testMessage) {
        return new Promise(resolve => {
            
            // Create the spy
            cy.spy(dummySpies, 'onMessage').as('onMessageSpy')

            // Send a message to the server
            websocket.send(testMessage)

            cy.get('@onMessageSpy')
                .should(onMessageSpy => {

                    // Assert that the spy has been called
                    expect(onMessageSpy).to.be.called
                    
                    // Yield the message event data passed to the stub
                    resolve(onMessageSpy.args[0][0])
                })
        })
    }

    it('Sends and receives a text message', () => {
        const testMessage = 'Test message 1'
        
        cy.wrap(connectWebSocket(wsUri))
            .then(websocket => {
                sendMessage(websocket, testMessage)
                    .then(messageEvent => {
                        
                        // Assert that the message from the server matches the original
                        expect(messageEvent.data).to.equal(testMessage)
                    })
            })
    })
})

describe('Frontend Websocket Tests', () => {
    const url = 'https://www.websocket.org/echo.html'

    it('Loads demo page, sends a message and displays modified message', () => {
        const testMessage = 'Test message 2'
        const modifiedMessage = 'Modified message'

        cy.visit(url)
        .then(window => {

            // Connection opened
            cy.spy(window, 'onOpen')

            // Modify the app's onmessage handler
            let funcBodyString = window.onMessage.toString()
                
                // Remove enclosing braces    
                .match(/{([\s\S]*)}/)[1]

                // Modify returned string
                .replace('evt.data', '`${modifiedMessage}`')

                // Add window reference to log element call
                .replace('logElementToConsole', 'window.logElementToConsole')

            // Using eval makes it possible to create a new named function based on text
            eval(`window.onMessage = function onMessage(evt) { ${funcBodyString} }`)

            // Listen for messages
            cy.spy(window, 'onMessage')

        })


        cy.get('#connect').click()

        // Assert that the connection is open and ready to communicate. 
        cy.window({ timeout: 10000 })
            .should(window => {
                expect(window.websocket.readyState).to.eq(1)
            })
            .then(window => {
                
                // Send a message to the server
                window.websocket.send(testMessage)

                // Assert that onMessage is called 
                cy.window().its('onMessage').should('be.called')

                cy.get('#consoleLog').contains(`RECEIVED: ${modifiedMessage}`)
            })
    })
})