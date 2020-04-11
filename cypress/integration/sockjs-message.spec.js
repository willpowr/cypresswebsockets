const Stomp = require('stompjs')
const SockJS = require('sockjs-client')

var url = "ws://demos.kaazing.com/echo";
var client = Stomp.client(url);

function createStompClient() {
    return new Promise((resolve, reject) => {

        const socketUrl = 'http://demos.kaazing.com/echo/'
        const sock = SockJS(socketUrl, { transports: ['websocket', 'ws', 'wss'] })
        resolve(Stomp.over(sock))
    })
}

function connectStompClient(failOnMsgErr = true) {
    createStompClient()
        .then(stompClient => {
            stompClient.connect(
                {},
                connectCallback(),
                errorCallback()
            )
        })

    // cy.get('@stompClient', { timeout: 10000 }).should(client => {
    //     expect(client.connected, 'Client connected').to.be.true
    // })
}



var connectCallback = function () {
    // called back after the client is connected and authenticated to the STOMP server
};

var errorCallback = function (error) {
    // display the error's message header:
    cy.log(error.headers.message);
};

var headers = {
    // login: 'mylogin',
    // passcode: 'mypasscode',
    // // additional header
    // 'client-id': 'my-client-id'
};

it('Sends and receives a text message', () => {
    connectStompClient(true)

})