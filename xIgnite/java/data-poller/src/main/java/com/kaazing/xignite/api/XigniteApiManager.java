package com.kaazing.xignite.api;

import java.io.IOException;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.fluent.Request;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class XigniteApiManager {
	@Value("${xignite.currency.api.url}")
	private String currencyApiUrl;

	private DataFactory dataFactory=new DataFactory();
	public CurrencyData [] getCurrency(String [] currency, String token) throws ClientProtocolException, IOException{
		String currencies="Symbols=";
		for(String c:currency){
			currencies+=c+",";
		}
		String fullURL=currencyApiUrl+currencies+"&_token="+token;
		String ret = Request.Get(fullURL)
				.connectTimeout(1000)
				.socketTimeout(1000)
				.execute().returnContent().asString();
		return this.dataFactory.getCurrenciesData(ret);
	}
}
