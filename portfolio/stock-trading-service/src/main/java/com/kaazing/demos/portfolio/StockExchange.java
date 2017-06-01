package com.kaazing.demos.portfolio;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import yahoofinance.YahooFinance;

public class StockExchange {

	private static final float FLUCTUATION_PERCENT = 0.01F;
	private static final int MIN_VALUE_PENNIES = 10;
	private static final int MAX_VALUE_PENNIES = 30000;

	private Random _random;
	private List<Stock> stocks;
	private int counter = 0;
	
	final static Logger logger = LoggerFactory.getLogger(StockExchange.class);

	public StockExchange() throws IOException {
		logger.info("Getting initial stock values...");
		stocks = new ArrayList<Stock>();
		stocks.add(new Stock("Twitter Inc", "TWTR", YahooFinance.get("TWTR").getQuote().getPrice().floatValue()));
		stocks.add(new Stock("Facebook", "FB", YahooFinance.get("FB").getQuote().getPrice().floatValue()));
		stocks.add(new Stock("Boeing Co.", "BA", YahooFinance.get("BA").getQuote().getPrice().floatValue()));
		stocks.add(new Stock("Citigroup, Inc.", "C", YahooFinance.get("C").getQuote().getPrice().floatValue()));
		stocks.add(new Stock("Tesla", "TSLA", YahooFinance.get("TSLA").getQuote().getPrice().floatValue()));
		stocks.add(new Stock("Intel Corporation", "INTC", YahooFinance.get("INTC").getQuote().getPrice().floatValue()));
		stocks.add(new Stock("Comcast", "CMCSA", YahooFinance.get("CMCSA").getQuote().getPrice().floatValue()));
		stocks.add(new Stock("Broadcom", "AVGO", YahooFinance.get("AVGO").getQuote().getPrice().floatValue()));
		stocks.add(new Stock("Microsoft Corporation", "MSFT", YahooFinance.get("MSFT").getQuote().getPrice().floatValue()));
		stocks.add(new Stock("Verizon Communications", "VZ", YahooFinance.get("VZ").getQuote().getPrice().floatValue()));
		stocks.add(new Stock("Apple Inc", "AAPL", YahooFinance.get("AAPL").getQuote().getPrice().floatValue()));
		logger.info("Ready to run...");
		_random = new SecureRandom(new SecureRandom().generateSeed(20));
	}

	public List<Stock> getStocks() {
		return stocks;
	}

	public Stock getStockForSymbol(String symbol) {
		for (Stock probe : stocks) {
			if (symbol.equalsIgnoreCase(probe.getSymbol()))
				return probe;
		}
		return null;
	}

	/**
	 * Alters the stock price as a percentage of the old value.
	 * 
	 * @param stock
	 *            the stock to be modified.
	 * @throws IOException
	 */
	public void changeStock(Stock stock) {
		counter++;
		if (counter == 1000) {
			try {
				logger.info("Resetting the value of "+stock.getName()+" based on the counter.");
				stock.resetValue();
				counter = 0;
				return;
			} catch (IOException e) {
				logger.error("Error resetting the value (based on the counter) of the stock "+stock.getName(), e);
			}

		}
		float oldVal = stock.getValue();

		// calculate the percent change (and round it)
		// the maximum fluctuation is a percentage of the current value...
		float maxFluctuate = FLUCTUATION_PERCENT * oldVal;

		// ... take a random percentage of that maximum...
		float actualFluctuate = _random.nextFloat() * maxFluctuate;

		// now round it to two decimal places
		actualFluctuate = 100 * actualFluctuate;
		long delta = Math.round(actualFluctuate);

		// minimum delta change should never go below zero
		if (delta < 1)
			delta = 1;

		// randomly switch positive / negative delta
		if (_random.nextFloat() < 0.5)
			delta = -delta;

		delta += (long) (oldVal * 100);

		// if a stock ever falls too low, reset it to original value
		if ((delta < MIN_VALUE_PENNIES) || (delta > MAX_VALUE_PENNIES)){
			try{
				logger.info("Resetting the value of "+stock.getName()+" based on the min/max.");
				stock.resetValue();		
			}
			catch(Exception e){
				logger.error("Error resetting the value (based on the min/max) of the stock "+stock.getName(), e);
			}
		}
		else {
			float newVal = (float) delta / 100;
			stock.setValue(newVal);
		}
	}

	/**
	 * @return the price for the stock with the specified symbol. Returns 0 if
	 *         the stock doesn't exist.
	 */
	public float getStockPrice(String symbol) {
		Stock stock = getStockForSymbol(symbol);
		return stock == null ? 0.0f : stock.getValue();
	}

}
