# Real-Time Portfolio via JMS and WebSockets

This demo application uses WebSocket to update stock price information in real-time. Simulated price data is provided by a back-end service over JMS (Java Message System) built with Apache ActiveMQ. The demo application allows you to simulate the buying and selling of stocks with an initial fake balance of $10,000. Although the initial prices shown in the demo are current, the high-speed changes are simulated and should not inform any real world trading decisions.

![Portfolio demo](Portfolio-app.png "Xignite demo")


#To start this demo follow these steps:

**Prerequisite is that you have the Kaazing Websocket Gateway and ActiveMQ up and running (more information [here](https://kaazing.com/doc/5.0/about/setup-guide/index.html))**

1. Install gradle: follow the steps [here](https://gradle.org/gradle-download/?_ga=1.147510451.589111043.1485507259).
1. Install NodeJS: for Linux, go [here](https://nodejs.org/en/download/package-manager/), and for Windows and MacOS use the installers [here](https://nodejs.org/en/download/).  
**You need both NodeJS and NPM**.
1. Navigate in the terminal/command line to where you cloned the kaazing demos repository and to the /portfolio folder (ex: ~/demos/portfolio).
1. Navigate to ~/demos/portfolio/stock-trading-service/ and run:  
  **gradle installDist**.
1. Navigate to /stock-trading-service/build/install/stock-trading-service/bin. Here you can find:  
  for Linux Distribuition/MacOS, a script, **stock-trading-service**.  
  for Windows, a batch file, **stock-trading-service.bat**.
1. Run the script/batch file that fits your environment by running:  
  for Linux/MacOS - **./stock-trading-service**  
  for Windows - **.\stock-trading-service.bat**  
**NOTE** - If your ActiveMQ is **NOT** listening to **tcp://localhost:61616**, when you run the script in the step above, you will have to pass the URL that your ActiveMQ is listening to as the first parameter of the script, i.e.:  
  for Linux/MacOS - **./stock-trading-service tcp://{ACTIVEMQ.IP}:{ACTIVEMQ.PORT}**  
  for Windows - **.\stock-trading-service.bat tcp://{ACTIVEMQ.IP}:{ACTIVEMQ.PORT}**
replacing the variables shown above:  
  replace **{ACTIVEMQ.IP}** with the IP address of your ActiveMQ server.  
  replace **{ACTIVEMQ.PORT}** with the port on which it is listening.  
With that, the ticker that fetches and posts the stock data should have started successfully.
1. Navigate to ~/demos/portfolio/portfolio-web/ and run, to resolve needed depencencies:  
  **npm install**
1. If your gateway is **NOT** accepting JMS connections on **ws://localhost:8000/jms**, you will have to edit this file:  
~/demos/portfolio/portfolio-web/server.js. You have to edit line 3:  
  change **uri: 'localhost'** to **uri: '"'{GATEWAY.IP}'**.
1. Now in ~/demos/portfolio/portfolio-web/, run:  
  **node server.js**.
1. Now you are done. Depending on how you configured above, you can access the demo at either:  
  **http://localhost:3000** or **http://{GATEWAY.IP}:3000**.  
Enjoy!
 
To start building your own application with Kaazing Websocket Gateway, visit our [Getting Started](https://kaazing.com/getting-started/) page. </br>

Please [Contact Us](https://kaazing.com/contact/) for more information.

Go back to [Demos](http://kaazing.com/products/demos/) page.
