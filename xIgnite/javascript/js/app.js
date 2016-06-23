/**
 * Created by romans on 3/15/16.
 */
'use strict';

angular.module("xIgnite-demo", ['rzModule', 'uiSwitch','LocalStorageModule'])
	.config(function (localStorageServiceProvider) {
		localStorageServiceProvider.setPrefix('kaazing-xignite-demo');
		localStorageServiceProvider.setStorageType('localStorage');
		})
	.controller("mainCtl", function ($scope, $timeout, $http, localStorageService) {
		var vm = this;
		vm.refreshSlider = function () {
			$timeout(function () {
				$scope.$broadcast('rzSliderForceRender');
			});
		};


		$scope.saveCurrencies = function(){
			var currencies = [];
			for(var i=0; i<$scope.currencies.length; i++){
				var currency = {symbol:$scope.currencies[i].symbol,image:$scope.currencies[i].image,enabled:$scope.currencies[i].enabled};
				currencies.push(currency);
			}
			localStorageService.set("currencies", currencies);
		};

		var currencies = localStorageService.get("currencies");
		if (currencies != null){
			for(var i = 0; i < currencies.length; i++){
				currencies[i].webSocket = {};
				currencies[i].rest = {};
				currencies[i].subscription = null;
			}
			$scope.currencies = currencies;
		}
		else{
			$scope.currencies = [
				{
					symbol: "USDGBP",
					image: "uk.png",
					enabled: true,
					webSocket: {},
					rest: {},
					mismatch:false
				},
				{
					symbol: "USDEUR",
					image: "europe.png",
					enabled: true,
					webSocket: {},
					rest: {},
					mismatch:false
				},
				{
					symbol: "USDCAD",
					image: "canada.png",
					enabled: false,
					webSocket: {},
					rest: {},
					mismatch:false
				},
				{
					symbol: "USDAUD",
					image: "oz.png",
					enabled: false,
					webSocket: {},
					rest: {},
					mismatch:false
				},
				{
					symbol: "USDNZD",
					image: "nz.png",
					enabled: false,
					webSocket: {},
					rest: {},
					mismatch:false
				},
				{
					symbol: "USDCHF",
					image: "switz.png",
					enabled: false,
					webSocket: {},
					rest: {},
					mismatch:false
				},
				{
					symbol: "GBPUSD",
					image: "usa.png",
					enabled: true,
					webSocket: {},
					rest: {},
					mismatch:false
				},
				{
					symbol: "GBPEUR",
					image: "europe.png",
					enabled: true,
					webSocket: {},
					rest: {},
					mismatch:false
				},
				{
					symbol: "GBPCAD",
					image: "canada.png",
					enabled: false,
					webSocket: {},
					rest: {},
					mismatch:false
				},
				{
					symbol: "GBPAUD",
					image: "oz.png",
					enabled: false,
					webSocket: {},
					rest: {},
					mismatch:false
				},
				{
					symbol: "GBPNZD",
					image: "nz.png",
					enabled: false,
					webSocket: {},
					rest: {},
					mismatch:false
				},
				{
					symbol: "GBPCHF",
					image: "switz.png",
					enabled: false,
					webSocket: {},
					rest: {},
					mismatch:false
				}
			];
			$scope.saveCurrencies();
		}



		var sizeof = function( object ) {
			var objectList = [];
			var recurse = function( value ) {
				var bytes = 0;

				if ( typeof value === 'boolean' ) {
					bytes = 4;
				} else if ( typeof value === 'string' ) {
					bytes = value.length * 2;
				} else if ( typeof value === 'number' ) {
					bytes = 8;
				} else if (typeof value === 'object'
					&& objectList.indexOf( value ) === -1) {
					objectList[ objectList.length ] = value;
					for( var i in value ) {
						bytes += 8; // assumed existence overhead
						bytes += recurse( value[i] )
					}
				}
				return bytes;
			};
			return recurse( object );
		};

		$scope.wsData = 0;
		$scope.wsDataPrior = 0;
		$scope.wsChanges = 0;
		$scope.wsChangesPrior = 0;
		$scope.restData = 0;
		$scope.restDataPrior = 0;
		$scope.restChanges = 0;
		$scope.restChangesPrior = 0;

		$scope.wsDataRate = 0;
		$scope.wsChangesRate = 0;
		$scope.restDataRate = 0;
		$scope.restChangesRate = 0;

		$scope.updateInterval = 0.5;

		var sliderValue = localStorageService.get("rest-speed");
		if (sliderValue == null){
			sliderValue = 1000;
		}

		$scope.speedSlider = {
			value: sliderValue,
			options: {
				floor: 200,
				ceil: 2000,
				showSelectionBar: true,

				getSelectionBarColor: function (value) {
					if (value <= 200)
						return 'red';
					if (value <= 500)
						return 'yellow';
					return '#2AE02A';
				}
			}
		};

		$scope.tickCounter = 1;

		$scope.drawDataConsistencyLineChart = function () {
			var total = 0;
			var matches = 0;
			for(var i=0; i<$scope.currencies.length;i++){
				var currency = $scope.currencies[i];
				if (currency.enabled){
					total++;
					currency = $scope.currencies[i];
					if (currency.webSocket.bid == currency.rest.bid && currency.webSocket.ask == currency.rest.ask){
						matches++;
						currency.mismatch = false;
					}
					else{
						currency.mismatch = true;
					}
				}
			}
			var currPercentage = (matches/total)*100;

			$scope.dataConsistencyLineChartData.addRows([[$scope.tickCounter, currPercentage]]);
			$scope.dataConsistencyLineChart.draw($scope.dataConsistencyLineChartData, google.charts.Line.convertOptions($scope.dataConsistencyLineChartOptions));
		};

		$scope.drawDataAndChangesCharts = function () {
			var wsDataRate = 0.9*$scope.wsDataRate + 0.1*($scope.wsData - $scope.wsDataPrior)/$scope.updateInterval;
			$scope.wsDataPrior = $scope.wsData;
			$scope.wsDataRate = wsDataRate;

			var wsChangesRate = 0.9*$scope.wsChangesRate + 0.1*($scope.wsChanges - $scope.wsChangesPrior)/$scope.updateInterval;
			$scope.wsChangesPrior = $scope.wsChanges;
			$scope.wsChangesRate = wsChangesRate;

			$scope.webSocketChartDataData.setValue(0, 1,  Math.round(wsDataRate));
			$scope.webSocketChartChangesData.setValue(0, 1,  Math.round(wsChangesRate));
			$scope.webSocketDataChart.draw($scope.webSocketChartDataData, $scope.dataChartOptions);
			$scope.webSocketChangesChart.draw($scope.webSocketChartChangesData, $scope.changesChartOptions);


			var restChangesRate = 0.9*$scope.restChangesRate + 0.1*($scope.restChanges - $scope.restChangesPrior)/$scope.updateInterval;
			$scope.restChangesPrior = $scope.restChanges;
			$scope.restChangesRate = restChangesRate;

			var restDataRate = 0.9*$scope.restDataRate + 0.1*($scope.restData - $scope.restDataPrior)/$scope.updateInterval;
			$scope.restDataPrior = $scope.restData;
			$scope.restDataRate = restDataRate;


			$scope.restChartDataData.setValue(0, 1,  Math.round(restDataRate));
			$scope.restChartChangesData.setValue(0, 1,  Math.round(restChangesRate));
			$scope.restDataChart.draw($scope.restChartDataData, $scope.dataChartOptions);
			$scope.restChangesChart.draw($scope.restChartChangesData, $scope.changesChartOptions);
		};

		$scope.dataConsistencyChart = null;
		$scope.dataConsistencyChartData = null;

		$scope.webSocketChartDataData = null;
		$scope.webSocketDataChart = null;

		$scope.webSocketChartChangesData = null;
		$scope.webSocketChangesChart = null;

		$scope.restChartDataData = null;
		$scope.restChartChangesData = null;

		$scope.restDataChart = null;
		$scope.restChangesChart = null;

		$scope.restCallsLimitMin = 3;

		$scope.maxTicks = Math.ceil($scope.restCallsLimitMin*60/$scope.updateInterval / 100.0) * 100;

		$scope.dataConsistencyLineChartOptions = {
			width: 500,
			hAxis: {
				title: 'Time',
				viewWindow: {
					max: $scope.maxTicks
				}
			},
			vAxis: {
				title: '% of Matches',
				minValue:0,
				maxValue:100,
				viewWindow:{
					min:0,
					max:100
				}
			},
			legend: {position: 'none'}
		};

		$scope.dataConsistencyLineChartData = null;
		$scope.dataConsistencyLineChart = null;


		$scope.changesChartOptions = {
			width: 120, height: 120,
			redFrom: 150, redTo: 200,
			yellowFrom: 100, yellowTo: 150,
			minorTicks: 5,
			max: 200
		};

		$scope.dataChartOptions = {
			width: 120, height: 120,
			redFrom: 3000, redTo: 4000,
			yellowFrom: 2000, yellowTo: 4000,
			minorTicks: 5,
			max: 4000
		};

		$scope.updateCharts = function(){
			$scope.drawDataAndChangesCharts();
			if (!$scope.restStopped) {
				$scope.drawDataConsistencyLineChart();
				$scope.tickCounter++;
			}
			localStorageService.set("rest-speed", $scope.speedSlider.value);
			$timeout($scope.updateCharts, $scope.updateInterval*1000);
		};


		$scope.drawChart = function () {
			$scope.dataConsistencyLineChartData = new google.visualization.DataTable();
			$scope.dataConsistencyLineChartData.addColumn('number', 'Update');
			$scope.dataConsistencyLineChartData.addColumn('number', '% of Matches');
			$scope.dataConsistencyLineChartData.addRows([[0, 100]]);


			$scope.dataConsistencyLineChart = new google.charts.Line(document.getElementById('data_consistency_chart_div'));
			$scope.dataConsistencyLineChart.draw($scope.dataConsistencyLineChartData, google.charts.Line.convertOptions($scope.dataConsistencyLineChartOptions));

			$scope.webSocketChartDataData = google.visualization.arrayToDataTable([
				['Label', 'Value'],
				['Updates/sec', 0]
			]);

			$scope.webSocketChartChangesData = google.visualization.arrayToDataTable([
				['Label', 'Value'],
				['Changes/sec', 0]
			]);


			$scope.webSocketDataChart = new google.visualization.Gauge(document.getElementById('websocket_chart_data_div'));
			$scope.webSocketChangesChart = new google.visualization.Gauge(document.getElementById('websocket_chart_changes_div'));
			$scope.webSocketDataChart.draw($scope.webSocketChartDataData, $scope.dataChartOptions);
			$scope.webSocketChangesChart.draw($scope.webSocketChartChangesData, $scope.changesChartOptions);

			$scope.restChartDataData = google.visualization.arrayToDataTable([
				['Label', 'Value'],
				['Updates/sec', 0]
			]);

			$scope.restChartChangesData = google.visualization.arrayToDataTable([
				['Label', 'Value'],
				['Changes/sec', 0]
			]);


			$scope.restDataChart = new google.visualization.Gauge(document.getElementById('rest_chart_data_div'));
			$scope.restChangesChart = new google.visualization.Gauge(document.getElementById('rest_chart_changes_div'));

			$scope.restDataChart.draw($scope.restChartDataData, $scope.dataChartOptions);
			$scope.restChangesChart.draw($scope.restChartChangesData, $scope.changesChartOptions);

			$timeout($scope.updateCharts, $scope.updateInterval*1000);
		};


		$scope.enabledDisabled = function(currency){
			$scope.createRestRequestSymbolsString(currency.symbol, currency.value);
			$scope.subscribeUnsibscribeCurrencies(currency.symbol, currency.value);
			$scope.saveCurrencies();
		};

		$scope.onWsQuoteUpdate = function(currency){
			var wsSize = sizeof(currency);
			$scope.wsData++;
			$scope.wsChanges++;
			$scope.wsErrors = null;
			for (var i = 0; i < $scope.currencies.length; i++) {
				if (currency.Symbol===$scope.currencies[i].symbol){
					var bidChange = 0;
					if ($scope.currencies[i].webSocket.bid){
						bidChange = currency.Bid - $scope.currencies[i].webSocket.bid;
						bidChange = bidChange.toFixed(4);
					}
					var askChange = 0;
					if ($scope.currencies[i].webSocket.ask){
						askChange = currency.Ask - $scope.currencies[i].webSocket.ask;
						askChange = askChange.toFixed(4);
					}
					if (bidChange!=0 || !$scope.currencies[i].webSocket.bid){
						$scope.currencies[i].webSocket.bid = currency.Bid;
						$scope.currencies[i].webSocket.bidChange = bidChange;
					}
					if (askChange!=0 || !$scope.currencies[i].webSocket.ask){
						$scope.currencies[i].webSocket.ask = currency.Ask;
						$scope.currencies[i].webSocket.askChange = askChange;
					}
				}
			}
			$scope.$apply();
		};

		$scope.restQuoteUpdate = function(receivedCurrencies){
			for (var k=0; k<receivedCurrencies.length; k++){
				$scope.restData++;
				var currency = receivedCurrencies[k];
				var changed = false;
				for (var i = 0; i < $scope.currencies.length; i++) {
					if (currency.Symbol===$scope.currencies[i].symbol){
						var bidChange = 0;
						if ($scope.currencies[i].rest.bid){
							bidChange = currency.Bid - $scope.currencies[i].rest.bid;
							bidChange = bidChange.toFixed(4);
						}
						var askChange = 0;
						if ($scope.currencies[i].rest.ask){
							askChange = currency.Ask - $scope.currencies[i].rest.ask;
							askChange = askChange.toFixed(4);
						}

						if (bidChange!=0 || !$scope.currencies[i].rest.bid){
							$scope.currencies[i].rest.bid = currency.Bid;
							$scope.currencies[i].rest.bidChange = bidChange;
							changed = true;
						}
						if (askChange!=0 || !$scope.currencies[i].rest.ask){
							$scope.currencies[i].rest.ask = currency.Ask;
							$scope.currencies[i].rest.askChange = askChange;
							changed = true;
						}
					}
				}
				if (changed)
					$scope.restChanges++;
			}
		};
		var connectionInfo = {
			//url: "wss://demo-stage.kaazing.com:80/redis?token=Your_xIgnite_Token",
			url: "ws://localhost:8002/redis?token=Your_xIgnite_Token",
			username: "",
			password: ""
		};

		$scope.client = UniversalClientDef("jms");
		$scope.connection = null;
		var topicPrefix = "/topic/";
		topicPrefix += "currency.";

		$scope.onWSError = function(error){
			$timeout(function(){
				$scope.wsErrors = error.type + ": " + error.message;
			},100);
		};

		$scope.subscribeUnsibscribeCurrencies = function(symbol, value){
			for (var i = 0; i < $scope.currencies.length; i++) {
				if ($scope.currencies[i].symbol == symbol){
					$scope.currencies[i].value = value;
				}
				if ($scope.connection == null)
					continue;
				if ($scope.currencies[i].enabled){
					var num = i;
					$scope.connection.subscribe(topicPrefix + $scope.currencies[i].symbol, topicPrefix + $scope.currencies[i].symbol,$scope.onWsQuoteUpdate, false, function(subscr){
						$scope.currencies[num].subscription = subscr;
					});
				}
				else{
					if ($scope.currencies[i].subscription && $scope.currencies[i].subscription!=null){
						$scope.currencies[i].subscription.disconnect();
						$scope.currencies[i].subscription = null;
					}
				}
			}
		};

		$scope.totalUsers = "1000";
		$scope.getWsServersLoad = function(){
			var tU = parseInt($scope.totalUsers);
			var res = tU*($scope.wsChangesRate + $scope.wsDataRate)/1000000;
			return res.toFixed(1);
		};

		$scope.getRestServersLoad = function(){
			var tU = parseInt($scope.totalUsers);
			var res = tU*($scope.restChangesRate + $scope.restDataRate)/1000000;
			return res.toFixed(1);
		};

		$scope.getWsServersAPICalls = function(){
			var tU = parseInt($scope.totalUsers);
			return 0;
		};

		$scope.getRestServersAPICalls = function(){
			var tU = parseInt($scope.totalUsers);
			var calc = 1000/$scope.speedSlider.value*tU;
			return calc.toFixed(0);
		};

		$scope.restRequestSymbolsString = "";

		$scope.createRestRequestSymbolsString = function(symbol, value){
			var reqString = "";
			for (var i = 0; i < $scope.currencies.length; i++) {
				if ($scope.currencies[i].symbol == symbol){
					$scope.currencies[i].value = value;
				}
				if ($scope.currencies[i].enabled) {
					reqString += $scope.currencies[i].symbol + ",";
				}
			}
			$scope.restRequestSymbolsString = reqString.substring(0, reqString.length - 1);
		};

		$scope.restStopped = false;

		$scope.stopRestCalls = function(){
			$scope.restStopped = true;
			$scope.restErrors = "REST Demo is limited to " + $scope.restCallsLimitMin + " minutes."
		};

		$scope.stopWsCalls = function () {
			$scope.client.close();
			$timeout(function(){
				$scope.wsErrors = "WebSocket Demo is limited to " + $scope.restCallsLimitMin + " minutes."
			}, 1000);
		}

		$scope.getXigniteToken = function(){
			$http({
				method:'GET',
				//url:'http://demo-stage.kaazing.com/token'
				url:'http://localhost:8080/token'
			}).then(function(success){
				$scope.xigniteToken = success.data.token;
				$scope.xigniteUserId = success.data.userId;
				$scope.createRestRequestSymbolsString();
				$scope.executeRestGet();
				$timeout($scope.stopRestCalls, $scope.restCallsLimitMin*60*1000)
			}, function (error) {
				if (error.statusText)
					$scope.restErrors = "Error getting token: " + error.statusText;
				else
					$scope.restErrors = "Error getting token!";
			});
		};
		
		$scope.client.connect(connectionInfo, $scope.onWSError, function(connection){
			$scope.connection = connection;
			$scope.subscribeUnsibscribeCurrencies();
			google.charts.load('current', {'packages': ['line','gauge']});
			google.charts.setOnLoadCallback($scope.drawChart);
			$timeout($scope.stopWsCalls, $scope.restCallsLimitMin*60*1000);
			$scope.getXigniteToken();

		});

		$scope.xigniteToken = null;
		$scope.xigniteUserId = null;
		$scope.restErrors = null;
		$scope.wsErrors = null;

		$scope.executeRestGet = function(){
			var url = 'https://kaazing.xignite.com/xGlobalCurrencies.json/GetRealTimeRates?Symbols=' +
				$scope.restRequestSymbolsString + "&_token=" + $scope.xigniteToken + "&_token_userid=" + $scope.xigniteUserId;
			$scope.restData += sizeof(url);
			try{
				$http({
					method: 'GET',
					url: url
				}).success(function(response, status, headers,config) {
					var restSize = sizeof(response);
					var headSize = sizeof(headers());
					$scope.restQuoteUpdate(response);
					if (!$scope.restStopped){
						$scope.restErrors = null;
						$timeout($scope.executeRestGet, $scope.speedSlider.value);
					}
				}).error(function(response) {
					if (response.status<0){
						$scope.restErrors = "Browser Error.";
					}
					else{
						$scope.restErrors = "Error: " + response.status + ", message: " + response.statusText;
					}
				});
			}
			catch(e){
				$scope.restErrors = e;
			}
		}


	});