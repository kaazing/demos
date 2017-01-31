# Kaazing Javascript & ReactJS TodoMVC Example


Application enhances [ReactJS TodoMVC](http://todomvc.com/examples/react/#/) with real-time capabilities.
Kaazing WebSocket enables Web application to use publish/subscribe model. Application notifies other instances when:
- Item is created
- Item is complete/incomplete
- Item text is modified
- Item is ‘busy’ - somebody is working on it to help dealing with the race conditions.


![TODOMvc demo](TodoMVC-app.png "TODOMvc demo")

#To start this demo follow these steps:

**Prerequisite is that you have the Kaazing Websocket Gateway and AMQP(QPID) up and running (more information [here](https://kaazing.com/doc/5.0/about/setup-guide/index.html))**

1. Install NodeJS: for Linux go [here](https://nodejs.org/en/download/package-manager/), For Windows and MacOS use the installers [here](https://nodejs.org/en/download/) 
**You need both NodeJS and NPM**
3. Navigate in the terminal/command line to where you cloned the kaazing demos repository and to the /todomvc folder (ex: ~/demos/todomvc);
4. Run:
	**npm install** to resolve needed dependencie;
**NOTE** If your AMQP is **NOT** listening on "localhost:5672" you will have to edit this file: ~/demos/todomvc/serverws.js. You have to edit line 1 : "var amqpURL='amqp://localhost:5672';" to "var amqpURL='amqp://{AMQP.HOSTNAME}:{AMQP.IP}'";
**NOTE** If your gateway is **NOT** accepting JMS connections on "ws://localhost:8000/amqp" you will have to edit this file: ~/demos/todomvc/js/app.jsx. You have to edit line 186 : "var url='ws://localhost:8000/amqp';" to "var url='ws://{GATEWAY.AMQP.URI}';";
7. Run:
	**node serverws.js**
8. 11. Now you are done and you can access either localhost:3000!

To start building your own application with Kaazing Websocket Gateway, visit our [Getting Started](https://kaazing.com/getting-started/) page. </br>

Please [Contact Us](https://kaazing.com/contact/) for more information.</br>

Go back to [Demos](http://kaazing.com/products/demos/) page.
