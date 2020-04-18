
describe('Backend Websocket Tests', () => {
    const wsUri = "wss://echo.websocket.org/?encoding=text"

    it('Sends and receives a text message', () => {
        const testMessage = 'Test message 1'

        cy.connectWebSocket(wsUri)
            .then(websocket => {
                // Assert that the onOpen spy has been called
                cy.get('@onOpenSpy', { timeout: 10000 }).should('be.called')

                cy.sendMessage(websocket, testMessage, { timeout: 10000 })
                    .then(() => {
                        cy.get('@onMessageSpy').should(onMessageSpy => {

                            // Assert that the onMessage spy has been called
                            expect(onMessageSpy).to.be.called

                            // Assert that the message from the server matches the original
                            expect(onMessageSpy.args[0][0].data).to.eq(testMessage)
                        })
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