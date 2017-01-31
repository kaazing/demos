# FX Trader Application

This demo application uses WebSocket to update forex price information in real-time. Simulated price data is provided by a back-end service over JMS (Java Message System) built with Apache ActiveMQ. The demo application allows you to simulate the buying and selling currencies.

![FX Trader Application demo](Forex.png "FX Trader App Demo")

#To start this demo follow these steps:

**Prerequisite is that you have the Kaazing Websocket Gateway and ActiveMQ up and running (more information [here](https://kaazing.com/doc/5.0/about/setup-guide/index.html))**

1. Navigate in the terminal/command line to where you cloned the kaazing demos repository and to the /forex folder (ex: ~/demos/forex);
2. Navigate to /forex/feed/, here you can find:
	for Linux/MacOS a script "forex.sh" 
	for Windows a bat "forex.bat";
**NOTE** If your ActiveMQ is **NOT** listening to tcp://localhost:61616 hen you run the script in the step above, you will have pass the URL that your ActiveMQ is listening to as the first parameter of the script, i.e.:  
	for Linux/MacOS - **./stock-trading-service tcp://{ACTIVEMQ.IP}:{ACTIVEMQ.PORT}** 
	for Windows - **.\stock-trading-service.bat tcp://{ACTIVEMQ.IP}:{ACTIVEMQ.PORT}**
4. Navigate to /forex/javascript/ and open index.html in your browser;
**NOTE** If your gateway is **NOT** accepting JMS connections on "ws://localhost:8000/jms" you will have edit the Location input to suite your gateway URI;
6. Click connect and you will see at the bottom of the page, the stock data will start to come in!
Enjoy!


To start building your own application with Kaazing Websocket Gateway, visit our [Getting Started](https://kaazing.com/getting-started/) page. </br>

Please [Contact Us](https://kaazing.com/contact/) for more information.</br>

Go back to [Demos](http://kaazing.com/products/demos/) page.

