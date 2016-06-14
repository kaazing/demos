package com.kaazing.xignite.registration;

import java.security.Principal;
import java.util.Map;
import java.util.Set;

import javax.security.auth.Subject;
import javax.security.auth.callback.CallbackHandler;
import javax.security.auth.login.LoginException;
import javax.security.auth.spi.LoginModule;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class ReauthXigniteLoginModule implements LoginModule {
	public static final Logger logger = LoggerFactory.getLogger(ReauthXigniteLoginModule.class);
	private Subject subject;
	private CallbackHandler handler;
	private Map<String, ?> options;
	private Principal principal;
	private XigniteUserPrincipal xigniteUser;
	private XigniteToolsPrincipal redisPrincipal;

	public void initialize(Subject subject, CallbackHandler callbackHandler, Map<String, ?> sharedState, Map<String, ?> options) {
		logger.info("initializing Xignite Login Module");

		this.subject = subject;
		this.handler = callbackHandler;
		this.options = options;

		String redisHost = (String) this.options.get("redis.host");
		String listCurrencies = (String) this.options.get("list.currencies");
		if (listCurrencies == null) {
			logger.error("Option <list.currencies> is not set for Xignite login module!");
			throw new RuntimeException("Option <list.currencies> is not set for Xignite login module!");
		}
		String currenciesCounters = (String) this.options.get("currency.counter.prefix");
		if (currenciesCounters == null) {
			logger.error("Option <currency.counter.prefix> is not set for Xignite login module!");
			throw new RuntimeException("Option <currency.counter.prefix> is not set for Xignite login module!");
		}

		String userCurrenciesPrefix = (String) this.options.get("user.currencies.prefix");
		if (userCurrenciesPrefix == null) {
			logger.error("Option <user.currencies.prefix> is not set for Xignite login module!");
			throw new RuntimeException("Option <user.currencies.prefix> is not set for Xignite login module!");
		}
		ClientRegistrationManager registrationManager = new ClientRegistrationManager(listCurrencies, currenciesCounters, userCurrenciesPrefix, redisHost);

		Set<?> keys = this.options.keySet();
		if (keys.size() > 0) {
			logger.info("Logging module options:");
			for (Object key : keys) {
				logger.info(key + "=" + this.options.get(key));
			}
		}
		this.redisPrincipal = new XigniteToolsPrincipal(registrationManager);
		logger.info("initializing Xignite Login Module");
	}

	public boolean login() throws LoginException {
		logger.info("Executing login");

		String[] userPassword = this.getUserPassword();
		if (userPassword == null) {
			logger.error("Cannot obtain user and password for authentication!");
			return false;
		}

		this.principal = new Principal() {
			public String getName() {
				return "AUTHORIZED";
			}
		};

		this.xigniteUser = new XigniteUserPrincipal(userPassword[0], userPassword[1]);

		return true;

	}

	protected abstract String[] getUserPassword();

	public boolean commit() throws LoginException {
		logger.debug("commit()");
		if (this.principal == null) {
			logger.error("No role granted");
			return false;
		}
		this.subject.getPrincipals().add(this.principal);
		logger.debug("User granted role: " + this.principal.getName());

		this.subject.getPrincipals().add(this.xigniteUser);
		this.subject.getPrincipals().add(this.redisPrincipal);

		return true;
	}

	public boolean abort() throws LoginException {
		logger.debug("abort()");
		if (this.principal == null) {
			logger.error("No role granted");
			return false;
		}
		try {
			clearRole();

			return true;
		} catch (Exception ex) {
			LoginException e = new LoginException("Unexpected error during abort().");
			e.initCause(ex);
			logger.error(e.getMessage(), e);
			throw e;
		}
	}

	public boolean logout() throws LoginException {
		logger.debug("logout()");
		try {
			this.redisPrincipal.getRegistrationManager().unregisterCurrencies(this.xigniteUser.getName());
			clearRole();

			return true;
		} catch (Exception ex) {
			LoginException e = new LoginException("Unexpected error during logout().");
			e.initCause(ex);
			logger.error(e.getMessage(), e);
			throw e;
		}
	}

	private void clearRole() {
		this.subject.getPrincipals().remove(this.principal);
		this.subject.getPrincipals().remove(this.redisPrincipal);
		this.subject.getPrincipals().remove(this.xigniteUser);
	}

	protected CallbackHandler getHandler() {
		return handler;
	}
}