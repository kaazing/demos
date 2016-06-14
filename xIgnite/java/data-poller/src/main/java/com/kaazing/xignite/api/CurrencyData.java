package com.kaazing.xignite.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CurrencyData {
	@JsonProperty("Outcome")
	private String Outcome="";
	
	@JsonProperty("Message")
	private String Message="";
	
	@JsonProperty("Identity")
	private String Identity="";
	
	@JsonProperty("Delay")
	private double Delay=-1;
	
	@JsonProperty("BaseCurrency")
	private String BaseCurrency="";
	
	@JsonProperty("QuoteCurrency")
	private String QuoteCurrency="";
	
	@JsonProperty("Symbol")
	private String Symbol="";
	
	@JsonProperty("Date")
	private String Date="";
	
	@JsonProperty("Time")
	private String Time="";
	
	@JsonProperty("QuoteType")
	private String QuoteType="";
	
	@JsonProperty("Bid")
	private double Bid=-1;
	
	@JsonProperty("Mid")
	private double Mid=-1;
	
	@JsonProperty("Ask")
	private double Ask=-1;
	
	@JsonProperty("Spread")
	private double Spread=-1;
	
	@JsonProperty("Text")
	private String Text="";
	
	@JsonProperty("Source")
	private String Source="";
	
	public CurrencyData(){
		
	}
	
	public CurrencyData(String currencySymbol, double tradePrice){
		this.setSymbol(currencySymbol);
		this.setMid(tradePrice);
	}

	public String getOutcome() {
		return Outcome;
	}

	public void setOutcome(String outcome) {
		Outcome = outcome;
	}

	public String getMessage() {
		return Message;
	}

	public void setMessage(String message) {
		Message = message;
	}

	public String getIdentity() {
		return Identity;
	}

	public void setIdentity(String identity) {
		Identity = identity;
	}

	public double getDelay() {
		return Delay;
	}

	public void setDelay(double delay) {
		Delay = delay;
	}

	public String getBaseCurrency() {
		return BaseCurrency;
	}

	public void setBaseCurrency(String baseCurrency) {
		BaseCurrency = baseCurrency;
	}

	public String getQuoteCurrency() {
		return QuoteCurrency;
	}

	public void setQuoteCurrency(String quoteCurrency) {
		QuoteCurrency = quoteCurrency;
	}

	public String getSymbol() {
		return Symbol;
	}

	public void setSymbol(String symbol) {
		Symbol = symbol;
	}

	public String getDate() {
		return Date;
	}

	public void setDate(String date) {
		Date = date;
	}

	public String getTime() {
		return Time;
	}

	public void setTime(String time) {
		Time = time;
	}

	public String getQuoteType() {
		return QuoteType;
	}

	public void setQuoteType(String quoteType) {
		QuoteType = quoteType;
	}

	public double getBid() {
		return Bid;
	}

	public void setBid(double bid) {
		Bid = bid;
	}

	public double getMid() {
		return Mid;
	}

	public void setMid(double mid) {
		Mid = mid;
	}

	public double getAsk() {
		return Ask;
	}

	public void setAsk(double ask) {
		Ask = ask;
	}

	public double getSpread() {
		return Spread;
	}

	public void setSpread(double spread) {
		Spread = spread;
	}

	public String getText() {
		return Text;
	}

	public void setText(String text) {
		Text = text;
	}

	public String getSource() {
		return Source;
	}

	public void setSource(String source) {
		Source = source;
	}
	
	@Override
	public boolean equals(Object obj) {
		if (obj == null)
			return false;
		if (!(obj instanceof CurrencyData)){
			return false;
		}
		CurrencyData cd=(CurrencyData)obj;
		if (!doublesEqual(cd.getAsk(),this.getAsk()))
			return false;
		if (!stringsEqual(cd.getBaseCurrency(),this.getBaseCurrency()))
			return false;
		if (!doublesEqual(cd.getBid(),this.getBid()))
			return false;
		/*if (!stringsEqual(cd.getDate(),this.getDate()))
			return false;*/
		/*if (!doublesEqual(cd.getDelay(),this.getDelay()))
			return false;*/
		/*if (!stringsEqual(cd.getIdentity(),this.getIdentity()))
			return false;*/
		/*if (!stringsEqual(cd.getMessage(),this.getMessage()))
			return false;*/
		if (!doublesEqual(cd.getMid(),this.getMid()))
			return false;
		/*if (!stringsEqual(cd.getOutcome(),this.getOutcome()))
			return false;*/
		/*if (!stringsEqual(cd.getQuoteCurrency(),this.getQuoteCurrency()))
			return false;*/
		if (!stringsEqual(cd.getQuoteType(),this.getQuoteType()))
			return false;
		/*if (!stringsEqual(cd.getSource(),this.getSource()))
			return false;*/
		/*if (!doublesEqual(cd.getSpread(),this.getSpread()))
			return false;*/
		if (!stringsEqual(cd.getSymbol(),this.getSymbol()))
			return false;
		/*if (!stringsEqual(cd.getText(),this.getText()))
			return false;*/
		/*if (!stringsEqual(cd.getTime(),this.getTime()))
			return false;*/
		return true;
	}
	
	private boolean stringsEqual(String s1, String s2){
		if (s1==null && s2==null)
			return true;
		if (s1!=null && s2!=null)
			return s1.equals(s2);
		return false;
	}
	
	public boolean doublesEqual(double a, double b) {
		double EPSILON = 0.00001;
	    if (a==b) return true;
	    double abs = Math.abs(a - b);
	    double cmp = EPSILON * Math.max(Math.abs(a), Math.abs(b));
	    if (abs<=cmp)
	    	return true;
	    else
	    	return false;
	  }
	
}
