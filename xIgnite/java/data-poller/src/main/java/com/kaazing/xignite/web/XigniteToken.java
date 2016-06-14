package com.kaazing.xignite.web;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import org.apache.commons.codec.binary.Hex;

public class XigniteToken {
	private final String token;
	private DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US);
	private final String userId;
	
	public XigniteToken(String token, String userId, Cipher cipher) throws IllegalBlockSizeException, BadPaddingException{
		
		dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
		String dtStr=dateFormat.format(new Date());
		String value=token+"|"+dtStr;
		byte[] encrypted = cipher.doFinal(value.getBytes());
		this.token=Hex.encodeHexString(encrypted);
		this.userId=userId;
	}
	public String getToken() {
		return token;
	}
	public String getUserId() {
		return userId;
	}

}
