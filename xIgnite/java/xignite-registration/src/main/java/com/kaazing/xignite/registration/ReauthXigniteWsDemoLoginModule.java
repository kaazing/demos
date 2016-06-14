package com.kaazing.xignite.registration;

public class ReauthXigniteWsDemoLoginModule extends ReauthXigniteLoginModule {

	public static final String KAAZING_DEMO_PASSWORD = "KAAZING-DEMO-WEBSOCKET";

	@Override
	protected String[] getUserPassword() {
		// TODO Auto-generated method stub
		return new String[]{null, KAAZING_DEMO_PASSWORD};
	}

}
