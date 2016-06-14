package com.kaazing.xignite.api;

import java.io.IOException;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class DataFactory {
	private final ObjectMapper mapper=new ObjectMapper();
	
	public CurrencyData getCurrencyData(String jsonString) throws JsonParseException, JsonMappingException, IOException{
		CurrencyData data=mapper.readValue(jsonString, CurrencyData.class);
		return data;
	}
	
	public CurrencyData [] getCurrenciesData(String jsonString) throws JsonParseException, JsonMappingException, IOException{
		CurrencyData [] data=mapper.readValue(jsonString, CurrencyData[].class);
		return data;
	}
	
	public String currencyDataToJson(CurrencyData data) throws JsonProcessingException{
		return mapper.writeValueAsString(data);
	}
}
