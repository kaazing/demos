/**
 * Kaazing JavaScript Universal Client facade that communicates with the gateway based on specified protocol. Script downloads necessary libraries except of JmsClient.js - that script has to be added to the <head> section.
 * @param protocol Specifies protocol that should be used for communications: jms - for communication with Kaazing JMS Gateway, amqp - for communication with Kaazing AMQP Gateway.
 * @returns {JavascriptUniversalClient} object that implements communication functions
 */
var UniversalClientDef=function(protocol){
    /**
     * Provides communication services with JMS or AMQP server. Created within UniversalClientDef constructor.
     * @class
     */
    var JavascriptUniversalClient = {};
    var client = null;

    /**
     * Connects to Kaazing WebSocket Gateway (AMQP or JMS)
     * @param connectionInfo {ConnectionInfo} Connection info object that should contain url, username and password properties
     * @param errorFuncHandle {function} function that is used for error handling in a format of function(error)
     * @param connectFunctionHandle {function} function this is called when connection is established in a format: function(ConnectionObject).
     */
    JavascriptUniversalClient.connect = function (connectionInfo, errorFunctionHandle, connectedFunctionHandle) {
        if (!connectionInfo || (typeof connectionInfo!=='object')){
            throw "Connection info is not an object!";
        }

        if (!connectionInfo.url){
            throw "Connection info must contain url property!";
        }

        if (!errorFunctionHandle || (typeof errorFunctionHandle !=='function')){
            throw "Error handling function must be defined via errorFunctionHandle";
        }

        if (!connectedFunctionHandle || (typeof connectedFunctionHandle !=='function')){
            throw "Connection established callback must be defined via connectedFunctionHandle";
        }


        if (client!=null && client.connected)
            return;

        var logInformation = function (severity, message) {
            if (JavascriptUniversalClient.loggerFuncHandle && JavascriptUniversalClient.loggerFuncHandle !== null)
                JavascriptUniversalClient.loggerFuncHandle(severity, message);
            if (severity == "INFO") {
                console.info(message);
            }
            else if (severity == "ERROR") {
                console.error(message);
            }
            else if (severity == "WARN") {
                console.warn(message);
            }
            else
                console.trace(message);
        }
        if (protocol.toLowerCase() === "amqp") {
                requirejs(['bower_components/kaazing-amqp-0-9-1-client-javascript/javascript/WebSocket.js'],function(){
                    requirejs(['bower_components/jquery/dist/jquery.js','bower_components/kaazing-amqp-0-9-1-client-javascript/javascript/Amqp-0-9-1.js', 'bower_components/kaazing-javascript-universal-client/javascript/src/AmqpUniversalClient.js'], function () {
                        console.info("Using AMQP protocol!");
                        client = amqpClientFunction(logInformation);
                        client.connect(connectionInfo, errorFunctionHandle, connectedFunctionHandle);
                    });
                });
        }
        else if (protocol.toLowerCase() === "jms") {
                requirejs(['bower_components/kaazing-jms-client-javascript/javascript/src/WebSocket.js','bower_components/kaazing-javascript-universal-client/javascript/src/JMSUniversalClient.js'], function () {
                console.info("Using JMS protocol!");
                client = jmsClientFunction(logInformation);
                client.connect(connectionInfo, errorFunctionHandle, connectedFunctionHandle);
            });
        }
        else {
            alert("Unsupported protocol " + protocol);
        }
    }

    /**
     * Sends messages to a publishing endpoint.
     * @param msg Message to be sent. As messages are sent in a text format msg will be converted to JSON if it is not a string.
     */
    JavascriptUniversalClient.sendMessage = function (msg) {
        client.sendMessage(msg);
    }

    /**
     * Disconnects from Kaazing WebSocket Gateway
     */
    JavascriptUniversalClient.close=function(){
        client.close();
    }

    return JavascriptUniversalClient;

};
