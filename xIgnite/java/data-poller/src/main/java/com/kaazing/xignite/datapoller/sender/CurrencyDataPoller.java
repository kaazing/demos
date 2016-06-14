package com.kaazing.xignite.datapoller.sender;

import com.kaazing.xignite.api.CurrencyData;

public interface CurrencyDataPoller {
	public CurrencyData getCurrencyPrice(String currency) throws CurrencyReadException;
}
