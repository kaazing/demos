package com.kaazing.xignite.registration;

import java.util.Set;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public class ClientRegistrationManager {
	private final String listCurrencies;
	private final JedisPool pool;
	private final String userCurrenciesPrefix;
	private final String currencyCounterPrefix;

	public ClientRegistrationManager(String listCurrencies, String currencyCounterPrefix, String userCurrenciesPrefix){
		this(listCurrencies, currencyCounterPrefix, userCurrenciesPrefix, null);
	}
	
	public ClientRegistrationManager(String listCurrencies, String currencyCounterPrefix, String userCurrenciesPrefix, String host){
		if (host==null){
			host="localhost";
		}
		this.listCurrencies=listCurrencies;
		this.currencyCounterPrefix=currencyCounterPrefix+":";
		this.userCurrenciesPrefix=userCurrenciesPrefix+":";
		if (this.getCurrencyTopic()==null){
			throw new RuntimeException("Currency topic is not specified!");
		}
		
		pool = new JedisPool(new JedisPoolConfig(), host);
	}
	
	public void registerCurrency(String currency, String userName){
		Jedis resource = getPool().getResource();
		resource.hset(this.getCurrencyTopic(), currency, "");
		Set<String> userCurrencies = resource.smembers(this.userCurrenciesPrefix+userName);
		if (!userCurrencies.contains(currency)){
			resource.sadd(this.userCurrenciesPrefix+userName, currency);
			resource.incr(this.currencyCounterPrefix+currency);
		}
		resource.close();
	}
	
	public void unregisterCurrency(String currency, String userName){
		Jedis resource = getPool().getResource();
		resource.srem(this.userCurrenciesPrefix+userName, currency);
		int counter=Integer.parseInt(resource.get(this.currencyCounterPrefix+currency));
		if (counter>1)
			resource.decr(this.currencyCounterPrefix+currency);
		else{
			resource.del(this.currencyCounterPrefix+currency);
			resource.hdel(this.listCurrencies,currency);
		}
		resource.close();
	}

	public void unregisterCurrencies(String userName){
		Jedis resource = getPool().getResource();
		Set<String> currencies = resource.smembers(this.userCurrenciesPrefix+userName);
		for(String currency:currencies){
			this.unregisterCurrency(currency, userName);
		}
		resource.del(this.userCurrenciesPrefix+userName);
		resource.close();
	}

	
	@Override
	protected void finalize() throws Throwable {
		getPool().destroy();
	}

	protected JedisPool getPool() {
		return pool;
	}

	protected String getCurrencyTopic() {
		return listCurrencies;
	}

	protected String getUserCurrenciesPrefix() {
		return userCurrenciesPrefix;
	}

	protected String getCurrencyCounterPrefix() {
		return currencyCounterPrefix;
	}
}
