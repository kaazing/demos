package com.kaazing.demos.portfolio;

import java.io.File;
import java.io.IOException;
import java.security.SecureRandom;
import java.util.Hashtable;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;

import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.DeliveryMode;
import javax.jms.Destination;
import javax.jms.ExceptionListener;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageListener;
import javax.jms.MessageProducer;
import javax.jms.Queue;
import javax.jms.Session;
import javax.jms.TextMessage;
import javax.jms.Topic;
import javax.naming.Context;
import javax.naming.InitialContext;

import org.apache.log4j.xml.DOMConfigurator;

public class JmsStockPortfolioService implements Runnable, MessageListener {

    public static final int THROTTLING_DIVISOR = 4;     // Slow feeds for IE by a factor of 4

    private ConnectionFactory _connectionFactory;
    private Queue _commandQueue;
    private Topic _stockBroadcastTopic;
    private Topic _throttledStockBroadcastTopic;

    private Session _stockSession;
    private Session _commandSession;
    private MessageProducer _stockProducer;
    private MessageProducer _throttledStockProducer;
    private MessageConsumer _commandConsumer;

    private StockExchange _exchange;
    private StockPortfolio _portfolio;

    private Random _random;
    private int sendCount = 1;
    private int throttleCounter = 0;

    private static final String LOG4J_CONFIG_PROPERTY = "LOG4J_CONFIG";

    public static void main(String... args) throws Exception {

        String providerURL = (args.length > 0) ? args[0] : "tcp://localhost:61616";

        Hashtable<String, String> env = new Hashtable<String, String>();
        env.put(Context.INITIAL_CONTEXT_FACTORY, "org.apache.activemq.jndi.ActiveMQInitialContextFactory");
        env.put(Context.PROVIDER_URL, providerURL);

        //Topic names prefixed with 'portfolio' to fix collision with OOTB portfolio demo
        env.put("topic.stock", "portfolioStock" );
        env.put("topic.throttledStock", "portfolioThrottledStock" );
        env.put("queue.command", "portfolioCommand");

        String log4jConfigProperty = System.getProperty(LOG4J_CONFIG_PROPERTY);
        if ( log4jConfigProperty != null ) {
            File log4jConfigFile = new File(log4jConfigProperty);
            DOMConfigurator.configure(log4jConfigFile.toURI().toURL());
        }

        InitialContext initialContext = new InitialContext(env);
        final ConnectionFactory connectionFactory = (ConnectionFactory) initialContext.lookup("ConnectionFactory");
        final Topic stockTopic = (Topic) initialContext.lookup("stock");
        final Topic throttledStockTopic = (Topic) initialContext.lookup("throttledStock");
        final Queue commandQueue = (Queue) initialContext.lookup("command");

        // Now set up and run one instance of the portfolio service
        final StockExchange exchange = new StockExchange();
        // Note that the portfolio is sharing the stock objects with the exchange.
        // This isn't how you'd do it in a distributed system, but rather pass a
        // message from one to the other.
        final StockPortfolio portfolio = new StockPortfolio(exchange, exchange.getStocks());
        final JmsStockPortfolioService service = new JmsStockPortfolioService(connectionFactory, exchange, portfolio);
        service.setStockBroadcastTopic(stockTopic);
        service.setThrottledStockBroadcastTopic(throttledStockTopic);
        service.setCommandQueue(commandQueue);
        System.out.println("* ======================================");
        System.out.println("* Kaazing Stock Portfolio Demo");
        System.out.println("* Connecting on " + providerURL);
        System.out.println("* ======================================");
        service.run();
    }

    public JmsStockPortfolioService(ConnectionFactory connectionFactory, StockExchange exchange,
            StockPortfolio portfolio) {
        _connectionFactory = connectionFactory;
        _exchange = exchange;
        _portfolio = portfolio;
        _random = new SecureRandom(new SecureRandom().generateSeed(20));
    }

    void setCommandQueue(Queue commandQueue) {
        this._commandQueue = commandQueue;
    }

    public void run() {
        try {
            connect();
            // include the functionality of the stock ticker
            while (true) {
                changeStock();
                Thread.sleep(10L); // 10ms = 100Hz
            }
        }
        catch (InterruptedException e) {
            e.printStackTrace();
        } catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }

    /**
     * Opens the connections used by this handler.
     * @throws IllegalStateException if the command queue hasn't been set.
     */
    public void connect() throws InterruptedException, IllegalStateException {
        try {
            final Connection connection = _connectionFactory.createConnection();
            connection.setExceptionListener(new ExceptionListener() {
                public void onException(JMSException exception) {
                    try {
                        connection.close();
                    }
                    catch (JMSException e) {
                        // ignore
                    }

                    try {
                        Thread.sleep(TimeUnit.SECONDS.toMillis(10));
                        connect();
                    }
                    catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            });

            _stockSession = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
            _stockProducer = _stockSession.createProducer(_stockBroadcastTopic);
            _throttledStockProducer = _stockSession.createProducer(_throttledStockBroadcastTopic);
            _commandSession = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
            _commandConsumer = _commandSession.createConsumer(_commandQueue);
            _commandConsumer.setMessageListener(this); // will call onMessage when a message arrives
            connection.start();
        }
        catch (JMSException e) {
            Thread.sleep(TimeUnit.SECONDS.toMillis(10));
            connect();
        }
    }

    public void onMessage(Message commandMessage) {
        try {
            processCommand((TextMessage) commandMessage);
        }
        catch (JMSException e) {
            e.printStackTrace();
        }
    }

    public void processCommand(Message commandMessage) throws JMSException {
        String command = commandMessage.getStringProperty("command").toLowerCase();
        String ticker = commandMessage.getStringProperty("ticker");
        String quantityString = commandMessage.getStringProperty("quantity");
        int quantity = quantityString == null ? 0 : Integer.parseInt(quantityString);
        
        System.err.println("Received command: " + command);
        if ( command.equals("buy") ) {
            float value = _portfolio.buy(ticker, quantity);
            String status = value > 0 ? "ok" : "failed";
            sendResponseWithQuote(commandMessage, command, ticker, status, value);
        }
        else if ( command.equals("sell") ) {
            float value = _portfolio.sell(ticker, quantity);
            String status = value > 0 ? "ok" : "failed";
            sendResponseWithQuote(commandMessage, command, ticker, status, value);
         }
        else if ( command.equals("quote") ) {
           System.out.println("ERROR!!!!");
        }
        else if ( command.equals("get_balance") ) {
            sendCommandResponse(commandMessage, command, null, null, _portfolio.getAvailableCash(), null, "ok");
        }
        else if ( command.equals("get_portfolio") ) {
            StringBuffer responseBuffer = new StringBuffer();
            boolean first = true;
            for (PurchasedStock holding : _portfolio.getHoldings()) {
                if ( !first ) 
                    responseBuffer.append('|');
                responseBuffer.append(holding.toString());
                first = false;
            }
            sendCommandResponse(commandMessage, command, null, null, null, responseBuffer.toString(), "ok");
        }
        else {
            sendCommandResponse(commandMessage, command, ticker, null, null, null, "unknown command");
        }
    }

    private void sendResponseWithQuote(Message commandMessage, String command, String symbol, String status, float value) throws JMSException {
        PurchasedStock stock = _portfolio.getStockForSymbol(symbol);
        if (stock == null) {
            sendCommandResponse(commandMessage, command, symbol, null, null, null, "failed");
        } else {
            sendCommandResponse(commandMessage, command, symbol, stock.getQuantity(), value, stock.toString(), status);
        }
    }
        
    private void sendCommandResponse(Message commandMessage, String command, String symbol, Integer shares, Float value, String result,
                                     String status) throws JMSException {
        Destination responseQueue = commandMessage.getJMSReplyTo();
        if ( responseQueue != null ) {
            MessageProducer responseProducer = _stockSession.createProducer(responseQueue);
            TextMessage responseMessage = _stockSession.createTextMessage();
            responseMessage.setText("-");
            responseMessage.setJMSCorrelationID(commandMessage.getJMSCorrelationID());
            responseMessage.setStringProperty("command", command);
            System.err.println("Responding: {command:'"+command+"', status:"+status+", queue:"+responseQueue + "}"); // <<< REMOVE
            if ( symbol != null )
                responseMessage.setStringProperty("symbol", symbol);
            responseMessage.setStringProperty("status", status);
            if ( shares != null )
                responseMessage.setStringProperty("shares", Integer.toString(shares));
            if ( value != null )
                responseMessage.setFloatProperty("value", value);
            if ( result != null ) {
                responseMessage.setStringProperty("result", result);
                System.err.println(result);
            }
            responseProducer.send(responseMessage, DeliveryMode.NON_PERSISTENT, Message.DEFAULT_PRIORITY, 0L);
        }
    }

    private void changeStock() throws IOException {
        List<PurchasedStock> holdings = _portfolio.getHoldings();
        int stockIndex = _random.nextInt(holdings.size());
        PurchasedStock stock = holdings.get(stockIndex);
        _exchange.changeStock(stock.getStock());
        sendStock(stock);
    }

    public void sendStock(PurchasedStock stock) {
        String body = stock.toString();

        try {
            if ( _stockSession == null )
                connect();
            TextMessage message = _stockSession.createTextMessage(body);
            message.setStringProperty("symbol", stock.getSymbol());
            message.setJMSCorrelationID("stock-" + sendCount++);
            _stockProducer.send(message, DeliveryMode.NON_PERSISTENT, Message.DEFAULT_PRIORITY, 0L);
            if (throttleCounter++ == 0)
                _throttledStockProducer.send(message, DeliveryMode.NON_PERSISTENT, Message.DEFAULT_PRIORITY, 0L);
            if (throttleCounter >= THROTTLING_DIVISOR) throttleCounter = 0;
        }
        catch (JMSException e) {
            System.err.println("Failure to send message: " + body);
        }
        catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void setStockBroadcastTopic(Topic topic) {
        this._stockBroadcastTopic = topic;
    }

    public void setThrottledStockBroadcastTopic(Topic topic) {
        this._throttledStockBroadcastTopic = topic;
    }

}
