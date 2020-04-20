// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


// Create object containing dummy spy functions
const dummySpies = {
    onOpen() { },
    onMessage() { }
}

function connectWebSocket(wsUri) {

    // Create the spy
    cy.spy(dummySpies, 'onOpen').as('onOpenSpy')

    // Create WebSocket connection.
    const websocket = new WebSocket(wsUri)

    // An event listener to be called when the connection is opened
    websocket.onopen = function () {
        console.log("WebSocket is open now.")

        // Call the spied on dummy onOpen method
        dummySpies.onOpen()
    }

    // An event listener to be called when a message is received from the server.
    websocket.onmessage = function (event) {
        console.log("Message received")

        // Call the spied on dummy method
        dummySpies.onMessage(event)
    }

    return (websocket)

}

function sendMessage(websocket, testMessage) {

    // Create the spy
    cy.spy(dummySpies, 'onMessage').as('onMessageSpy')

    // Send a message to the server
    websocket.send(testMessage)

}

Cypress.Commands.add("connectWebSocket", connectWebSocket)
Cypress.Commands.add("sendMessage", sendMessage)