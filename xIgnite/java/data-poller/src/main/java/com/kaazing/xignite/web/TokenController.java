package com.kaazing.xignite.web;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.annotation.PostConstruct;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.http.client.ClientProtocolException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kaazing.xignite.api.CurrencyData;
import com.kaazing.xignite.api.XigniteApiManager;

@RestController
public class TokenController {
	@Value("${xignite.api.token}")
	private String token;
	
	@Value("${xignite.api.userid}")
	private String userId;
	
	@Value("${xignite.api.encryption.key}")
	private String key;
	
	@Value("${xignite.api.encryption.iv}")
	private String initVector;


	public TokenController() throws UnsupportedEncodingException {
	}
	
	@PostConstruct
	protected void init() throws UnsupportedEncodingException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException{
		IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
        SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");
        cipher = Cipher.getInstance("AES/CFB8/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
	}
	
	@Autowired
	private XigniteApiManager apiManager;

	private Cipher cipher;
	
	//@RequestMapping("/currencies")
	public CurrencyData [] currencies(@RequestParam(value="symbols")String currencies) throws ClientProtocolException, IOException{
		return this.apiManager.getCurrency(currencies.split(","), token);
	}
	
	@RequestMapping("/token")
	public XigniteToken token() throws IllegalBlockSizeException, BadPaddingException{
		return new XigniteToken(token, userId, cipher);
	}
	
}
