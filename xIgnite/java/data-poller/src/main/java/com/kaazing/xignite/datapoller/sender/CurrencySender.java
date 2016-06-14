package com.kaazing.xignite.datapoller.sender;

import java.io.IOException;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.kaazing.xignite.api.CurrencyData;
import com.kaazing.xignite.api.DataFactory;
import com.kaazing.xignite.api.XigniteApiManager;

@Component
public class CurrencySender {
	protected static final Logger LOGGER = LoggerFactory.getLogger(CurrencySender.class);
	@Autowired
	private StringRedisTemplate template;

	@Autowired
	private DataFactory dataFactory;

	@Value("${list.currencies}")
	private String subscribedCurrencyHash;

	@Value("${currency.counter.prefix}")
	private String currencyCounterPrefix;

	@Value("${xignite.api.token}")
	private String apiToken;

	@Value("${cleanup.delay.sec}")
	private int cleanupDelay;

	private long lastCleanupTimeMsec = System.currentTimeMillis();

	@Autowired
	private XigniteApiManager apiManager;

	public void cleanupCurrencies() {
		for (Object c : this.template.opsForHash().keys(subscribedCurrencyHash)) {
			String currency = (String) c;
			String currencyKey = this.currencyCounterPrefix + ":" + currency;
			String val = this.template.opsForValue().get(currencyKey);
			if (val == null || Long.parseLong(val) == 0) {
				LOGGER.info("Removing currency " + currency);
				this.template.opsForHash().delete(subscribedCurrencyHash, currency);
				this.template.delete(currencyKey);
			}
		}
	}

	@Scheduled(fixedRateString = "${poll.frequency.msec}")
	public void executeBatchRun() {
		long currTimeMsec = System.currentTimeMillis();
		if ((currTimeMsec - this.lastCleanupTimeMsec) > (this.cleanupDelay * 1000)) {
			this.cleanupCurrencies();
			this.lastCleanupTimeMsec = currTimeMsec;
		}
		Set<Object> currencies = this.template.opsForHash().keys(subscribedCurrencyHash);
		if (currencies.isEmpty())
			return;
		LOGGER.info("Obtaining currencies...");
		String[] c = currencies.toArray(new String[currencies.size()]);
		CurrencyData[] currencyInfo = null;
		try {
			currencyInfo = this.apiManager.getCurrency(c, this.apiToken);
		} catch (Exception e) {
			LOGGER.error("Cannot obtain currencies!", e);
			return;
		}
		int i = 0;
		for (CurrencyData data : currencyInfo) {
			if (data.getSymbol().isEmpty()) {
				data.setSymbol(c[i]);
			}
			this.updateCurrency(data);
			i++;
		}
	}

	public void removeAllCurrencies() {
		Set<Object> currencies = this.template.opsForHash().keys(subscribedCurrencyHash);
		for (Object c : currencies) {
			LOGGER.info("Removing currency "+c);
			this.template.opsForHash().delete(subscribedCurrencyHash, c);
		}

	}

	protected void updateCurrency(CurrencyData data) {
		try {
			String currencyDataJson = dataFactory.currencyDataToJson(data);
			if (this.isSymbolChanged(data)) {
				String jsonStr = dataFactory.currencyDataToJson(data);
				LOGGER.info("Updating symbol " + data.getSymbol() + " with data: " + jsonStr);
				this.template.convertAndSend("currency." + data.getSymbol(), jsonStr);
			}
			this.template.opsForHash().put(this.subscribedCurrencyHash, data.getSymbol(), currencyDataJson);

		} catch (JsonProcessingException e) {
			LOGGER.error("Cannot convert to json currency " + data.getSymbol(), e);
		}
	}

	private boolean isSymbolChanged(CurrencyData data) {
		Object storedObj = this.template.opsForHash().get(this.subscribedCurrencyHash, data.getSymbol());
		if (storedObj != null) {
			String s = (String) storedObj;
			if (!s.equals("")) {
				try {
					CurrencyData dt = dataFactory.getCurrencyData(s);
					if (!dt.equals(data)) {
						return true;
					}
				} catch (IOException e) {
					return true;
				}
			} else
				return true;
		}
		return false;
	}

	protected String getSubscribedCurrencyHash() {
		return subscribedCurrencyHash;
	}

	protected int getCleanupDelay() {
		return cleanupDelay;
	}

	protected long getLastCleanupTimeMsec() {
		return lastCleanupTimeMsec;
	}


	protected StringRedisTemplate getTemplate() {
		return template;
	}
	
	protected void setLastCleanupTimeMsec(long lastCleanupTimeMsec) {
		this.lastCleanupTimeMsec = lastCleanupTimeMsec;
	}

}
