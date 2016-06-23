package com.kaazing.gateway.samples.portfolio;

public class PurchasedStock {

    final private Stock stock;
    private int quantity = 0;

    public PurchasedStock(Stock stock) {
        this.stock = stock;
    }

    public String getName() {
        return stock.getName();
    }

    public String getSymbol() {
        return stock.getSymbol();
    }

    public double getStartingValue() {
        return stock.getStartingValue();
    }

    public float getValue() {
        return stock.getValue();
    }

    public float getTotalValue() {
        return stock.getValue() * quantity;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Stock getStock() {
        return stock;
    }

    @Override
    public String toString() {
        return stock.toString() + ':' + Integer.toString(quantity);
    }
    
    

}
