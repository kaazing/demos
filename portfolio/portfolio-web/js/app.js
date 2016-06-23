/**
 * Created by romans on 6/21/16.
 */
'use strict';

angular.module("portfolio-demo", [])
	.constant("connectionInfo", {
		"url": "ws://localhost:8000/jms",
		"topicName":"/topic/portfolioStock"
	})
	.controller("mainCtl", function ($scope, $log, $timeout, connectionInfo) {
		$scope.stockArray=new Array();
		$scope.stocks=[
		];

		$scope.error=null;
		$scope.isBuyingOrSelling=false;

		$scope.buyOrSell={};
		$scope.buyOrSell.ticker=null;
		$scope.buyOrSell.value=null;
		$scope.buyOrSell.isBuying=false;


		$scope.buy=function(ticker){
			$scope.buyOrSell.ticker=ticker;
			$scope.buyOrSell.isBuying=true;
			$scope.isBuyingOrSelling=true;
		}
		$scope.sell=function(ticker){
			$scope.buyOrSell.ticker=ticker;
			$scope.buyOrSell.isBuying=false;
			$scope.isBuyingOrSelling=true;
		}

		$scope.complete=function () {
			$scope.isBuyingOrSelling=false;
			$scope.buyOrSell.ticker=null;
			$scope.buyOrSell.value=null;
			$scope.buyOrSell.isBuying=false;
		}

		$scope.confirm=function () {
			if ($scope.buyOrSell.isBuying)
				$log.info("Buying "+$scope.buyOrSell.value+" shares of "+$scope.buyOrSell.ticker);
			else
				$log.info("Selling "+$scope.buyOrSell.value+" shares of "+$scope.buyOrSell.ticker);
			$scope.performAction();
			$scope.complete();
		}

		$scope.handleException=function(e){
			$timeout(function () {
				$scope.error=e.message;
			},100);
		}

		$scope.connection=null;
		$scope.session=null;
		$scope.commandQueue=null;
		$scope.commandProducer=null;
		$scope.responseQueue=null;
		$scope.responseConsumer=null;
		$scope.stockTopic = null;
		$scope.stockConsumer = null;
		
		$scope.hasPortfolio=false;

		$scope.availableCash=0;

		$scope.totalShares=0;
		$scope.totalValue=0;

		function parseStock(recordText) {
			var fields = recordText.split(':'); // company, ticker, price, shares
			var fieldNames = [ 'company', 'ticker', 'price', 'shares' ];
			var stock = {};
			for ( var i = 0; i < fieldNames.length; i++) {
				stock[fieldNames[i]] = fields[i];
			}
			stock.value = ((stock.shares || 0) * (stock.price || 0)).toFixed(2);
			stock.change = 0; // placeholder for future value
			return stock;
		}

		$scope.calcTotalShares=function() {
			var result = 0;
			for (var ticker in $scope.stocks) {
				if ($scope.stocks.hasOwnProperty(ticker))
					result += $scope.stocks[ticker].shares * 1;
			}
			return result;
		}

		$scope.calcTotalValue=function() {
			var result = 0;
			for (var ticker in $scope.stocks) {
				if ($scope.stocks.hasOwnProperty(ticker)) {
					var stock = $scope.stocks[ticker];
					result += stock.shares * stock.price;
				}
			}
			return result.toFixed(2);
		}


		$scope.buildPortfolio=function(messageText) {
			var stocks = [];
			var records = messageText.split('|');
			var stockArray = records.map(function(obj) {return parseStock(obj)});
			stockArray.sort(function(a, b) {
				return (a.company < b.company) ? -1 : (a.company > b.company) ? 1 : 0
			});
			$scope.$apply(function () {
				stockArray.forEach(function(obj) {
					$scope.stocks.push(obj)// store in a hash
				});
				$scope.totalShares=$scope.calcTotalShares();
				$scope.totalValue=$scope.calcTotalValue();
			})
			$log.info("Portfolio loaded...");
		}

		$scope.setAvailableCash=function(value) {
			$timeout(function () {
				$scope.availableCash=value*1;
			},100);
		}

		$scope.updateBudget=function(change) {
			if (!change) return;
			var newValue = $scope.availableCash*1 + change*1;
			$scope.setAvailableCash(newValue.toFixed(2));
		}


		$scope.updateStockRow=function(stock) {
			var row=-1;
			for(var i=0;i<$scope.stocks.length;i++){
				if (stock.ticker===$scope.stocks[i].ticker){
					row=i;
					break;
				}
			}
			var oldStock = $scope.stocks[row];
			var oldPrice = oldStock.price;

			// Replace the entry in the stock array and objects
			$scope.$apply(function () {
				$scope.stocks[row].price = stock.price;
				$scope.stocks[row].change = ((oldPrice != 0) ? (stock.price - oldPrice) : 0).toFixed(2);
				$scope.stocks[row].shares = stock.shares;
				$scope.stocks[row].value = stock.value;
				$scope.totalShares=$scope.calcTotalShares();
				$scope.totalValue=$scope.calcTotalValue();
			})
		}

		$scope.onCommandResponse=function(response){
			try {
				var status = response.getStringProperty('status');
				if (status != 'ok')
					return;
				var command = response.getStringProperty('command');
				var result = response.getStringProperty('result');
				var stock;
				$log.debug('command: "' + command + '"');
				$log.debug('result: ' + result);
				if (command == 'get_portfolio') {
					$scope.buildPortfolio(result);
					$scope.hasPortfolio = true;
				} else if (command == 'get_balance') {
					$scope.setAvailableCash(response.getStringProperty('value'));
				} else if (command == 'buy') {
					stock = parseStock(result);
					var value = response.getFloatProperty('value');
					$scope.updateBudget(-value);
					$scope.updateStockRow(stock);
				} else if (command == 'sell') {
					stock = parseStock(result);
					var value = response.getFloatProperty('value');
					$scope.updateBudget(value);
					$scope.updateStockRow(stock);
				}
			} catch (exception) {
				$scope.handleException(exception);
			}
		}

		$scope.performAction=function() {
			var commandMessage = $scope.session.createTextMessage('');
			var command=null;
			if ($scope.buyOrSell.isBuying){
				command='buy';
			}
			else{
				command='sell';
			}
			commandMessage.setStringProperty('command', command);
			commandMessage.setStringProperty('ticker', $scope.buyOrSell.ticker);
			commandMessage.setStringProperty('quantity', $scope.buyOrSell.value);
			$scope.sendCommand(commandMessage);
		}

		$scope.onStockMessage=function(message){
			try {
				if ($scope.hasPortfolio)
					$scope.updateStockRow(parseStock(message.getText()));
			} catch (exception) {
				$scope.handleException(exception);
			}
		}

		$scope.connect=function(){
			var jmsConnectionFactory = new JmsConnectionFactory(connectionInfo.url);
			var connectionFuture =  jmsConnectionFactory.createConnection("", "", function () {
				if (!connectionFuture.exception) {
					try {
						$scope.connection = connectionFuture.getValue();
						$scope.connection.setExceptionListener($scope.handleException);

						$log.info("CONNECTED to "+connectionInfo.url);

						$scope.session = $scope.connection.createSession(false, Session.AUTO_ACKNOWLEDGE);

						$scope.commandQueue = $scope.session.createQueue("/queue/portfolioCommand");
						$scope.commandProducer = $scope.session.createProducer($scope.commandQueue);
						// Another way to set up a temporary queue
						var randomNumber = Math.floor(Math.random() * 1000000000);
						$scope.responseQueue = $scope.session.createQueue("/queue/q" + randomNumber);
						// ===
						$scope.responseConsumer = $scope.session.createConsumer($scope.responseQueue);
						$scope.responseConsumer.setMessageListener($scope.onCommandResponse);

						$scope.stockTopic = $scope.session.createTopic(connectionInfo.topicName);
						$scope.stockConsumer = $scope.session.createConsumer($scope.stockTopic);
						$scope.stockConsumer.setMessageListener($scope.onStockMessage);
						$scope.connection.start(function () {
							$log.info("Sending initialization info...");
							$scope.init();
						});
					}
					catch (e) {
						$scope.handleException(e);
					}
				}
				else {
					$scope.handleException(connectionFuture.exception);
				}
			});
		}

		$scope.sendCount=0;

		$scope.sendCommand=function(commandMessage, callback){
			commandMessage.setJMSReplyTo($scope.responseQueue);
			commandMessage.setJMSCorrelationID('cmd-' + $scope.sendCount++);
			$scope.commandProducer.send(commandMessage, callback || null);
		}

		$scope.init=function(){
			var portfolioCommand = $scope.session.createTextMessage('');
			portfolioCommand.setStringProperty('command', 'get_portfolio');
			$log.debug("Requesting portfolio...");
			$scope.sendCommand(portfolioCommand, function() {
				$log.debug('Requesting balance...');
				var balanceCommand = $scope.session.createTextMessage('');
				balanceCommand.setStringProperty('command', 'get_balance');
				$scope.sendCommand(balanceCommand);
			});
		}
	});