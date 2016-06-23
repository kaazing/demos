package com.kaazing.gateway.samples.portfolio;

import java.io.IOException;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

import yahoofinance.YahooFinance;

public class Stock {

    private final String name;
    private final String symbol;
    private final float startingValue;
    private float value;
    
    static private DecimalFormat _displayFormat = new DecimalFormat("####.00", new DecimalFormatSymbols(Locale.ENGLISH));
    
    public Stock(String name, String symbol, float value) {
        super();
        this.name = name;
        this.symbol = symbol;
        this.startingValue = value;
        this.value = value;
    }
    
    public String getName() {
        return name;
    }
    
    public String getSymbol() {
        return symbol;
    }
    
    public double getStartingValue() {
        return startingValue;
    }
    
    public float getValue() {
        return value;
    }

    void setValue(float newValue) {
        value = newValue;
    }

    void resetValue() throws IOException {
        value =YahooFinance.get(this.symbol).getQuote().getPrice().floatValue();
    }

    @Override
    public String toString() {
        return name + ":" + symbol + ":" +  _displayFormat.format(value);  
    }
    
}
