package com.kaazing.xignite.registration;

import java.nio.ByteBuffer;
import java.security.Principal;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import javax.security.auth.Subject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.kaazing.gateway.jms.server.spi.JmsMessageType;
import com.kaazing.gateway.jms.server.spi.JmsPersistence;
import com.kaazing.gateway.jms.server.spi.JmsQueue;
import com.kaazing.gateway.jms.server.spi.JmsTopic;
import com.kaazing.gateway.jms.server.spi.security.JmsAuthorization;
import com.kaazing.gateway.jms.server.spi.security.JmsAuthorizationFactory;

public class ReauthXigniteAuthFactory extends JmsAuthorizationFactory {
	public static final Logger logger = LoggerFactory.getLogger(ReauthXigniteAuthFactory.class);	
	
	public ReauthXigniteAuthFactory(){
		logger.debug("Creating the Authorization factory for xIgnite authorizations.");
	}

	public JmsAuthorization newAuthorization(Subject subject) {
		logger.info("Creating new Authorization!");
		try{
			CustomAuthorization customAuthorization = new CustomAuthorization(subject);
			logger.info("Created new Authorization.");
			return customAuthorization;
		}
		catch(Exception e){
			logger.error("Error creating new Authorization", e);
			return null;
		}		
	}

	/**
	 *
	 * This class is a simple demonstration of methods that you can intercept to
	 * check for fine grained authorization that can be enforced based on the
	 * subject.
	 *
	 * You can customize these methods to suite your needs by making a complex
	 * check that involves the Subject, Topic or Queue name, Selector. You can
	 *
	 */
	class CustomAuthorization extends JmsAuthorization {

		
		private final Set<String> demoCurrencies=new HashSet<>(Arrays.asList(
				"USDGBP",
				"USDEUR",
				"USDCAD",
				"USDAUD",
				"USDNZD",
				"USDCHF",
				"GBPUSD",
				"GBPEUR",
				"GBPCAD",
				"GBPAUD",
				"GBPNZD",
				"GBPCHF"));
				
		@SuppressWarnings({ "unused" })
		private Subject subject;
		private String username;
		private String apiIdentifier;		
		private ClientRegistrationManager clientRegistrationManager;
		
		public CustomAuthorization(Subject subject) {
			this.subject = subject;

			logger.info("Checking principals for for "+subject+" total principals: "+subject.getPrincipals().size());
			for (Principal principal : subject.getPrincipals()) {
				if (principal instanceof XigniteUserPrincipal) {
					username = principal.getName();
					logger.debug("Found User Principal. User "+username);
					this.apiIdentifier = ((XigniteUserPrincipal) principal).getApiIdentifier();
				} else if (principal instanceof XigniteToolsPrincipal) {
					this.clientRegistrationManager = ((XigniteToolsPrincipal) principal).getRegistrationManager();
					logger.debug("Found Registration Manager principal.");
				}
			}
			logger.debug("Creating API manager...");
			logger.info("Creating JMSAuthorization for " + username);
		}

		@Override
		public boolean canDurableSubscribeToTopic(String topicName, String selector) {
			logger.info("User " + username + " canDurableSubscribeToTopic: " + topicName);
			return false;
		}

		@Override
		public boolean canSubscribeToTopic(JmsTopic topicKind, String topicName, String selector) {
			logger.info("User " + username + " is trying to Subscribe To Topic: " + topicName + "(kind=" + topicKind
					+ ", selector=" + selector + ")");
			// TODO: Figure out better way to deal with types
			try {
				if (topicName.startsWith("currency.")) {
					topicName = topicName.substring(topicName.indexOf(".") + 1);
					if (username.equals(ReauthXigniteWsDemoLoginModule.KAAZING_DEMO_PASSWORD)){
						if (this.demoCurrencies.contains(topicName)){
							this.clientRegistrationManager.registerCurrency(topicName, username);
							logger.info("Demo mode, client is subscribed To Topic: " + topicName + "(kind=" + topicKind
									+ ", selector=" + selector + ")");
							return true;
						}
						else{
							logger.warn("Demo mode, client cannot subscribe to Topic: " + topicName + "! Not allowed for the demo!");
							return false;
						}
					} else {
						logger.error("User " + username + " is not entitled to Subscribe To Topic: " + topicName
								+ "(kind=" + topicKind + ", selector=" + selector + ")");
						this.clientRegistrationManager.unregisterCurrencies(username);
						return false;
					}
				} else {
					logger.error("Unknown type of API" + this.apiIdentifier);
					this.clientRegistrationManager.unregisterCurrencies(username);
					return false;
				}
			} catch (Exception e) {
				logger.error("Exception checking entitlement for user " + username + ", topic " + topicName, e);
				return false;
			}
		}

		@Override
		public boolean canSubscribeToQueue(JmsQueue queueKind, String queueName, String selector) {
			logger.info("User " + username + " canSubscribeToQueue: " + queueName);
			return false;
		}

		@Override
		public boolean canPublishToTopic(JmsTopic topicKind, String topicName, JmsPersistence persistence,
				JmsMessageType bodyType, ByteBuffer body) {
			logger.info("User " + username + " canPublishToTopic " + topicName);
			return false;
		}

		@Override
		public boolean canPublishToQueue(JmsQueue queueKind, String queueName, JmsPersistence persistence,
				JmsMessageType bodyType, ByteBuffer body) {
			return false;
		}

		@Override
		public boolean canTransact() {
			return false;
		}

		@Override
		public boolean canAcknowledge() {
			return true;
		}

		@Override
		public boolean canConnect(String clientID) {
			return true;
		}
	}
}
