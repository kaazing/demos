package com.kaazing.xignite.registration;

import java.security.Principal;

/**
 * Store the username or user id that uniquely identifies a user. 
 */
public class XigniteUserPrincipal implements Principal {
	
	private String username;
	private String apiIdentifier;
	
	public XigniteUserPrincipal(String apiIdentifier, String username) {
		this.username = username;
		this.setApiIdentifier(apiIdentifier);
	}

	@Override
	public String getName() {
		return username;
	}

	public String getApiIdentifier() {
		return apiIdentifier;
	}

	public void setApiIdentifier(String apiIdentifier) {
		this.apiIdentifier = apiIdentifier;
	}

}
