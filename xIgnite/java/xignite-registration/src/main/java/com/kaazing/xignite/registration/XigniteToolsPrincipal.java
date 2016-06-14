package com.kaazing.xignite.registration;

import java.security.Principal;

public class XigniteToolsPrincipal implements Principal {
	
	private final ClientRegistrationManager registrationManager;
	
	public XigniteToolsPrincipal(ClientRegistrationManager registrationManager) {
		this.registrationManager=registrationManager;
	}
	
	@Override
	public String getName() {
		return "XIGNITETOOLS";
	}

	public ClientRegistrationManager getRegistrationManager() {
		return registrationManager;
	}

}
