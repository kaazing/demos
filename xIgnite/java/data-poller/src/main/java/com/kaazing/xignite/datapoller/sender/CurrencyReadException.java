package com.kaazing.xignite.datapoller.sender;

public class CurrencyReadException extends Exception {

	public CurrencyReadException(String message) {
		super(message);
	}
	
	public CurrencyReadException(String message, Throwable t) {
		super(message, t);
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
}
