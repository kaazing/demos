/**
 * Created by romans on 9/15/15.
 */

/**
 * Facade function that implements Kaazing WebSocket communications via AMQP server
 * @param logInformation function that is used for logging events in a format of function(severity, message).
 * @returns {{AmqpClient}} object that implements communication functions
 */
var amqpClientFunction=function(logInformation){
    var routingKey="broadcastkey";
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


    var appId = (function () {
        var fmt = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        var ret=fmt.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return ret;
    })();

    var handleException = function (e) {
        logInformation("ERROR","Error! " + e);
        if (typeof (errorFunction)!="undefined" && errorFunction!=null)
            errorFunction(e);
    }
    /**
     * Provides communication services with AMQP server. Created within amqpClientFunction constructor.
     * @class
     */
    var AmqpClient = {subscriptions:[]};
    var errorFunction=null;
    var amqpClient=null;

    // Convert a string to an ArrayBuffer.
    //
    var stringToArrayBuffer = function(str) {
        var buf = new ArrayBuffer(str.length);
        var bufView = new Uint8Array(buf);
        for (var i=0, strLen=str.length; i<strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    // Convert an ArrayBuffer to a string.
    //
    var arrayBufferToString = function(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

    // Create a WebSocketFactory which can be used for multiple AMQP clients if
    // required. This lets you defined the attributes of a WebSocket connection
    // just once – such as a ChallengeHandler – and reuse it.
    //
    var createWebSocketFactory = function() {
        try{
            webSocketFactory = new $gatewayModule.WebSocketFactory();
        }
        catch(e){
            try{
                webSocketFactory = new WebSocketFactory();
            }
            catch(e){
                return null;
            }
        }
        return webSocketFactory;
    }
    var createSubscriptionObject=function(amqpClient, topicPub, topicSub, noLocal, messageReceivedFunc, user){
        /**
         * Subscription object containing all information about subscription.
         * @class
         */
        var SubscriptionObject = {
            amqpClient:amqpClient,
            topicPub:topicPub,
            topicSub:topicSub,
            noLocal:noLocal,
            publishChannel:null,
            consumeChannel:null,
            publishChannelOpened:$.Deferred(),
            consumeChannelOpened:$.Deferred(),
            queueName:null,
            clientId:null,
            messageIdCounter:0,
            user:user,
            closed:null,
            messageReceivedFunc:messageReceivedFunc,
            subscribed:false,
            init:function(subscribedCallback){
                this.queueName="client" + Math.floor(Math.random() * 1000000);
                this.clientId=appId;
                this.messageIdCounter = getRandomInt(1, 100000);
                var that=this;
                logInformation("INFO","OPEN: Publish Channel");
                this.publishChannel = amqpClient.openChannel(function(){that.publishChannelOpenHandler(that)});

                logInformation("INFO", "OPEN: Consume Channel");
                this.consumeChannel = amqpClient.openChannel(function(){that.consumeChannelOpenHandler(that)});
                $.when(this.publishChannelOpened, this.consumeChannelOpened).done(function(){
                    that.closed=$.Deferred();
                    that.subscribed=true;
                    subscribedCallback(that);
                });

            },
            publishChannelOpenHandler:function(that){
                logInformation("INFO","OPENED: Publish Channel "+this.topicPub);

                that.publishChannel.declareExchange({exchange: this.topicPub, type: "fanout"});

                // Listen for these requests to return
                that.publishChannel.addEventListener("declareexchange", function() {
                    logInformation("INFO","EXCHANGE DECLARED: " + that.topicPub);
                    that.publishChannelOpened.resolve();
                });

                that.publishChannel.addEventListener("error", function(e) {
                    handleException(that.topicPub+" CHANNEL ERROR: Publish Channel - " + e.message);
                });

                that.publishChannel.addEventListener("close", function() {
                    logInformation("INFO",that.topicPub+" CHANNEL CLOSED: Publish Channel");
                });

            },
            consumeChannelOpenHandler:function(that){
                logInformation("INFO","OPENED: Consume Channel "+that.topicSub);

                that.consumeChannel.addEventListener("declarequeue", function() {
                    logInformation("INFO","QUEUE DECLARED: " + that.queueName+" for "+that.topicSub);
                });

                that.consumeChannel.addEventListener("bindqueue", function() {
                    logInformation("INFO","QUEUE BOUND: " + that.topicSub+ " - " + that.queueName);
                });

                that.consumeChannel.addEventListener("consume", function() {
                    logInformation("INFO","CONSUME FROM QUEUE: " + that.queueName+" for "+that.topicSub);
                    that.consumeChannelOpened.resolve();
                });

                that.consumeChannel.addEventListener("close", function() {
                    logInformation("INFO",that.topicSub+" CHANNEL CLOSED: Consume Channel");
                });

                that.consumeChannel.addEventListener("message", function(message) {
                    var body = null;

                    // Check how the payload was packaged since older browsers like IE7 don't
                    // support ArrayBuffer. In those cases, a Kaazing ByteBuffer was used instead.
                    if (typeof(ArrayBuffer) === "undefined") {
                        body = message.getBodyAsByteBuffer().getString(Charset.UTF8);
                    }
                    else {
                        body = arrayBufferToString(message.getBodyAsArrayBuffer())
                    }
                    logInformation("DEBUG",that.topicSub+" Received from the wire "+body);
                    try{
                        body= JSON.parse(body);
                    }
                    catch(e){
                        handleException(that.topicSub+" Received message "+body+" was not an object!");
                        return;
                    }
                    if (!that.noLocal || body.clientId!==that.clientId)
                        that.messageReceivedFunc(body);
					else{
						logInformation("DEBUG",that.topicSub+" Message "+body+" is ignored!");
					}
                });

                // The default value for noAck is true. Passing a false value for 'noAck' in
                // the AmqpChannel.consumeBasic() function means there should be be explicit
                // acknowledgement when the message is received. If set to true, then no
                // explicit acknowledgement is required when the message is received.
                that.consumeChannel.declareQueue({queue: that.queueName})
                    .bindQueue({queue: that.queueName, exchange: that.topicSub, routingKey: routingKey })
                    .consumeBasic({queue: that.queueName, consumerTag: that.clientId, noAck: true, noLocal:that.noLocal });
            },
            /**
             * Sends messages to a publishing endpoint.
             * @param msg Message to be sent. As messages are sent in a text format msg will be converted to JSON if it is not a string.
             */
            sendMessage:function(msg){
                if (typeof msg ==="object"){
					msg.clientId=this.clientId;
                    msg=JSON.stringify(msg);
                }
                else{
                    handleException("Message "+msg+" should be an object!");
                }

                var body = null;
                if (typeof(ArrayBuffer) === "undefined") {
                    body = new ByteBuffer();
                    body.putString(msg, Charset.UTF8);
                    body.flip();
                }
                else {
                    body = stringToArrayBuffer(msg);
                }
                var props = new AmqpProperties();
                props.setContentType("text/plain");
                props.setContentEncoding("UTF-8");
                props.setDeliveryMode("1");
                props.setMessageId((this.messageIdCounter++).toString());
                props.setPriority("6");
                props.setTimestamp(new Date());
                props.setUserId(this.user);
				logInformation("sent","Sending message to "+this.topicPub+": "+ msg, "sent");
                this.publishChannel.publishBasic({body: body, properties: props, exchange: this.topicPub, routingKey: routingKey});
            },
            disconnect:function(){
                if (!this.subscribed){
                    this.closed.resolve();
                }
                else{
                    this.subscribed=false;
                    var config = {
                        replyCode: 0,
                        replyText: '',
                        classId: 0,
                        methodId: 0
                    };
                    this.consumeChannel.deleteQueue({queue:this.queueName, ifEmpty: false}, function(){
                        this.consumeChannel.closeChannel(config, function(){
                            this.publishChannel.closeChannel(config, function(){
                                this.closed.resolve();
                            });
                        });
                    });
                }
            }
        };
        return SubscriptionObject;

    }

    var createConnectionObject=function(connection, amqpClient, user){
        /**
         * Contains infomration about established connection.
         * @class
         */
        var ConnectionObject = {
            connection:connection,
            user:user,
            amqpClient:amqpClient,
            /**
             * Creates a subscription.
             * @param topicPub {string} name of the topic to publish
             * @param topicSub {string} name of the topic to subscribe
             * @param messageReceivedFunc {function} callback to receive messages in a format function(msg) where msg is expected to be a valid JSON
             * @param noLocal {boolean} if set to true and publishing and subscription topics are the same, the client will not receive its own messages
             * @param subscribedCallbackFunction {function} callback function if a format function(SubcriptionObject) to be called when SubsriptionObject is created.
             */
            subscribe:function(topicPub, topicSub, messageReceivedFunc, noLocal, subscribedCallbackFunction){
                logInformation("INFO","CONNECTED!!!");
                var subscription=createSubscriptionObject(this.amqpClient, topicPub, topicSub, noLocal, messageReceivedFunc, this.user);
				var that=this;
                subscription.init(function(subscription){
					that.connection.subscriptions.push(subscription);
                    subscribedCallbackFunction(subscription);
                });
            }
        };
        return ConnectionObject;
    }

    /**
     * Connects to Kaazing WebSocket Gateway (AMQP or JMS)
     * @param connectionInfo {ConnectionInfo} Connection info object that should contain url, username and password properties
     * @param errorFuncHandle {function} function that is used for error handling in a format of function(error)
     * @param connectFunctionHandle {function} function this is called when connection is established in a format: function(ConnectionObject).
     */
    AmqpClient.connect=function(connectionInfo, errorFunctionHandle, connectedFunctionHandle){
        errorFunction=errorFunctionHandle;
        var amqpClientFactory = new AmqpClientFactory();
        var webSocketFactory = createWebSocketFactory();
        if (webSocketFactory==null){
            handleException("Cannot create WebSocket factory - module is not loaded!");
        }
        amqpClientFactory.setWebSocketFactory(webSocketFactory);
        amqpClient = amqpClientFactory.createAmqpClient();
        amqpClient.addEventListener("close", function() {
            logInformation("INFO","Connection closed.");
        });

        amqpClient.addEventListener("error", function(e) {
            handleException(e.message);
        });
        var credentials = {username: connectionInfo.username, password: connectionInfo.password};
        var options = {
            url: connectionInfo.url,
            virtualHost: "/",
            credentials: credentials
        };
		try{
			var that=this;
			amqpClient.connect(options, function(){
                var connection=createConnectionObject(that, amqpClient,connectionInfo.username);
                connectedFunctionHandle(connection);
            });
		}
        catch(e){
			handleException(e.message);
		}
    }

    /**
     * Disconnects from Kaazing WebSocket AMQP Gateway
     */
    AmqpClient.close=function(){
        for(var i=0;i<this.subscriptions.length;i++){
            this.subscriptions[i].disconnect();
        }
        $.when.apply($,this.subscriptions).then(function() {
            amqpClient.disconnect();
        });
    }

    return AmqpClient;
};
