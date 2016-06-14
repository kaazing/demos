/**
 * Created by romans on 9/15/15.
 */
/**
 * Facade function that implements Kaazing WebSocket communications via JMS server
 * @param logInformation function that is used for logging events in a format of function(severity, message).
 * @returns {JMSClient} object that implements communication functions
 */
var jmsClientFunction=function(logInformation){
    var appId = (function () {
        var fmt = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        var ret=fmt.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return ret;
    })();


    var initialized=false;

     /**
     * Provides communication services with JMS server.
     * @class
     */
    var JMSClient = {connected:false, subscriptions:[]};


	var createSubscriptionObject=function(session, topicPub, topicSub, noLocal, producer, consumer){
		/**
		 * Subscription object containing all information about subscription.
		 * @class
		 */
		var SubscriptionObject = {
			session:session,
			producer:producer,
			consumer:consumer,
			topicPub:topicPub,
			topicSub:topicSub,
			noLocal:noLocal,
			messagesToSend:[],
			inSend:false,
			subscribed:true,
			closed:$.Deferred(),
			sendMessageOverTheWire:function(){
				var msg = this.messagesToSend.pop();
				logInformation("sent","Sending message to "+this.topicPub+": " + msg, "sent");
				var textMsg = this.session.createTextMessage(msg);
				if (this.noLocal)
					textMsg.setStringProperty("appId", appId);
				var that=this;
				this.producer.send(textMsg, function(){that.sendComplete(that)});
			},
			sendComplete:function(subscription) {
				logInformation("INFO", "Send over "+subscription.topicPub+" is Complete");
				if (subscription.messagesToSend.length > 0) {
					logInformation("INFO", "Sending queued messages to "+subscription.topicPub+"...");
					subscription.sendMessageOverTheWire();
				}
				else{
					subscription.inSend = false;
				}
			},
			/**
			 * Sends messages to a publishing endpoint.
			 * @param msg {object} Message to be sent. As messages are sent in a text format msg will be converted to JSON if it is not a string.
			 */
			sendMessage:function(msg){
				if (typeof msg ==="object"){
					msg=JSON.stringify(msg);
				}
				else{
					handleException("Message ["+msg+"] to be sent to "+this.topicPub+" is not an object!");
				}

				try {
					this.messagesToSend.push(msg);
					if (this.inSend == false) {
						logInformation("sent","Sending message to "+this.topicPub+": "+ msg, "sent");
						this.inSend = true;
						this.sendMessageOverTheWire();
					}
					else{
						logInformation("sent","Queing message for "+this.topicPub+": " + msg, "sent");
					}
				} catch (e) {
					handleException(e);
				}

			},
			/**
			 * Closes the subscrpiption and releases all the resources.
			 */
			disconnect:function(){
				if (!this.subscribed){
					this.closed.resolve();
				}
				else{
					this.producer.close();
					this.consumer.close(function(){
						this.subscribed=false;
						this.closed.resolve();
					});
				}
			}
		};
		return SubscriptionObject;

	}


	var startsWith=function(string, startString){
		return string.substring(0,startString.length)===startString;
	}

	var createConnectionObject=function(session, connection){
		/**
		 * Contains infomration about established connection.
		 * @class
		 */
		var ConnectionObject = {
			connection:connection,
			session:session,
			/**
			 * Creates a subscription.
			 * @param topicPub {string} name of the topic to publish
			 * @param topicSub {string} name of the topic to subscribe
			 * @param messageReceivedFunc {function} callback to receive messages in a format function(msg) where msg is expected to be a valid JSON
			 * @param noLocal {boolean} if set to true and publishing and subscription topics are the same, the client will not receive its own messages
			 * @param subscribedCallbackFunction {function} callback function if a format function(SubcriptionObject) to be called when SubsriptionObject is created.
			 */
			subscribe:function(topicPub, topicSub, messageReceivedFunc, noLocal, subscribedCallbackFunction){
				if (!startsWith(topicPub,"/topic/")){
					topicPub="/topic/"+topicPub;
				}
				if (!startsWith(topicSub,"/topic/")){
					topicSub="/topic/"+topicSub;
				}

				var pubDest = this.session.createTopic(topicPub);
				var producer = this.session.createProducer(pubDest);
				logInformation("INFO","Producer for "+topicPub+" is ready! AppID=" + appId);
				var subDest = this.session.createTopic(topicSub);
				var consumer=null;
				if (noLocal)
					consumer = this.session.createConsumer(subDest, "appId<>'" + appId + "'");
				else
					consumer = session.createConsumer(subDest);
				consumer.setMessageListener(function (message) {
					var body=message.getText();
					logInformation("DEBUG","Received from the topic "+topicSub+" "+body);
					try{
						body=JSON.parse(body);
					}
					catch(e){
						logInformation("WARN","Object received from "+topicSub+" is not JSON");
					}
					messageReceivedFunc(body);
				});
				logInformation("INFO","Consumer for "+topicSub+" is ready!");
				var subscription=createSubscriptionObject(session, topicPub, topicSub, noLocal, producer, consumer);
				subscription.closed.resolve();
				this.connection.subscriptions.push(subscription);
				subscribedCallbackFunction(subscription);
			}
		};
		return ConnectionObject;
	}

	var connectionEstablishedFunc=null;
    var errorFunction;

    var handleException = function (e) {
        logInformation("ERROR","Error! " + e);
		if (typeof (errorFunction)!="undefined" && errorFunction!=null)
        	errorFunction(e);
    }
    var connection=null;
    var session=null;

	/**
	 * Connects to Kaazing WebSocket Gateway (AMQP or JMS)
	 * @param connectionInfo {ConnectionInfo} Connection info object that should contain url, username and password properties
	 * @param errorFuncHandle {function} function that is used for error handling in a format of function(error)
	 * @param connectFunctionHandle {function} function this is called when connection is established in a format: function(ConnectionObject).
	 */
	JMSClient.connect=function(connectionInfo, errorFunctionHandle, connectedFunctionHandle){
        errorFunction=errorFunctionHandle;
		connectionEstablishedFunc=connectedFunctionHandle;

        logInformation("INFO","CONNECTING TO: " + connectionInfo.url);

		var connectionProperties = new JmsConnectionProperties();
        var jmsConnectionFactory = new JmsConnectionFactory(connectionInfo.url, connectionProperties);

        try {
            var connectionFuture = jmsConnectionFactory.createConnection(connectionInfo.username, connectionInfo.password, function () {
                    if (!connectionFuture.exception) {
                        try {
                            connection = connectionFuture.getValue();
                            connection.setExceptionListener(handleException);

                            logInformation("INFO","CONNECTED");

                            session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);

                            connection.start(function () {
                                logInformation("INFO","JMS session created");
                                var connectionObject=createConnectionObject(session, JMSClient);
                                connectedFunctionHandle(connectionObject);
                            });
                        }
                        catch (e) {
                            handleException(e);
                        }
                    }
                    else {
                        handleException(connectionFuture.exception);
                    }
                });
        }
        catch (e) {
            handleException(e);
        }
    }

    /**
     * Disconnects from Kaazing WebSocket JMS Gateway, closes all the subscription and releases all the resources.
     */
    JMSClient.close=function(){
		for(var i=0;i<this.subscriptions.length;i++){
			this.subscriptions[i].disconnect();
		}
		$.when.apply($,this.subscriptions).then(function() {
			connection.stop(function(){
				session.close(function () {
					connection.close(function () {

					});
				});
			});
		});
    }

    return JMSClient;
};
