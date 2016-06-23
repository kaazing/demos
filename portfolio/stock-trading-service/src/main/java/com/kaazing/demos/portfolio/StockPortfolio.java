package com.kaazing.demos.portfolio;

import java.util.LinkedList;
import java.util.List;

public class StockPortfolio {

    private float availableCash;
    private List<PurchasedStock> holdings;
    private final StockExchange exchange;

    public StockPortfolio(StockExchange exchange, List<Stock> stocks) {
        this.exchange = exchange;
        availableCash = 10000.00F;
        holdings = new LinkedList<PurchasedStock>();
        for (Stock stock : stocks) {
            holdings.add(new PurchasedStock(stock));
        }
    }

    public List<PurchasedStock> getHoldings() {
        return holdings;
    }

    public float getAvailableCash() {
        return availableCash;
    }

    public float getTotalValue() {
        return availableCash;
    }

    public void updateValue(String symbol, float value) {
        getStockForSymbol(symbol).getStock().setValue(value);
    }

    public PurchasedStock getStockForSymbol(String symbol) {
        for (PurchasedStock probe : holdings) {
            if ( probe.getStock().getSymbol().equalsIgnoreCase(symbol) )
                return probe;
        }
        return null;
    }

    /**
     * Buy and add a stock to the portfolio.
     * @param symbol the stock symbol to add.
     * @param quantity the number of shares to buy.
     * @return the total value of the purchase, or 0 if it couldn't be made (e.g. for insufficient funds).
     */
    public float buy(String symbol, int quantity) {
        float cost = 0;
        PurchasedStock stock = getStockForSymbol(symbol);
        if ( stock != null ) {
            synchronized (this) {
                float totalCost = exchange.getStockPrice(symbol) * quantity;
                if ( totalCost <= availableCash ) {
                    availableCash -= totalCost;
                    stock.setQuantity(stock.getQuantity() + quantity);
                    cost = totalCost;
                }
            }
        }
        return cost;
    }

    public float sell(String symbol, int quantity) {
        float cost = 0;
        PurchasedStock stock = getStockForSymbol(symbol);
        if ( stock != null && quantity <= stock.getQuantity() ) {
            synchronized (this) {
                float totalCost = exchange.getStockPrice(symbol) * quantity;
                availableCash += totalCost;
                stock.setQuantity(stock.getQuantity() - quantity);
                cost = totalCost;
            }
        }
        return cost;
    }


}
