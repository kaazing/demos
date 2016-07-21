/*	| --------------------------------------------------------------------	|
	| ---> JavaScript for Kaazing FX Demo page								|
	|		Copyright (C) 2011, Kaazing Corporation							|
	| packaged as a single js file to reduce http download requests			|
	| --------------------------------------------------------------------	|
*/

// Start with a shim to let us pause/resume the data flow when this is embedded in mobile apps.
function pauseConnection(callback) {
        if (!wsCtl.connection || wsCtl.connectionStatus != 1) return;
        wsCtl.connection.stop(function() { wsCtl.connectionStatus = 0; if (callback) callback() } );
}

function resumeConnection (callback) {
        if (!wsCtl.connection || wsCtl.connectionStatus == 1) return;
        wsCtl.connection.start(function() { wsCtl.connectionStatus = 1; if (callback) callback() } );
}

// -----------------> GLOBALS (including single-instance inline objects)
var fxTrade = { // the order widget object, one instance
	// volatiles
	isOpen : false,
	symbol : '',
	tradeSide : '',
	lots : '',	// number of lots
	quote : '',
	amount : '',
	orderType : '',	// GTC, Market, Limit, etc
	errQty : false,
	errPrice : false,
	lotSize : 100000,	// units per standard lot
	baseCurrency : '',
	quoteCurrency : '',
	// take element handles at startup so we only do these once:
	hWindow : document.getElementById('tradeWindow'),
	hSymbol : document.getElementById('twSymbol'),
	hQty : document.getElementById('twQuantity'),
	hPrice : document.getElementById('twPrice'),
	hButtons : document.getElementById('twBuySellButtons'),
	hSummary : document.getElementById('twTradeSummary'),
	hSummaryText : document.getElementById('twSummaryText'),
	hSButtons : document.getElementById('twBuySellButtons'),
	hErrors : document.getElementById('twErrors'),
	hErrorText : document.getElementById('twErrorText'),
	hHelp : document.getElementById('twHelp')
}
var metricCnt = {	// the websocket status widget object, one instance
	isOpen : false,
	serverConnected : false,
	platform : navigator.platform,
	iDevice :	(navigator.platform.match(/(iPad|iPhone)/i)) ? true : false,
	subscriptions : 0,
	msgsIn : 0,
	msgsOut : 0,
	rateCnt : 1,
	msgRate : 0,  // per second
	latency : 0,
	Hz :	50,	  // quote frequency from server
	sessionStart : new Date(), // timestamp for rate calculation = star session or rate change
	sessionNow : null,
	tstampProbed : null, // roundtrip latency;
	tstampReturn : null,
	// handles to metricsWindow content
	hWindow : document.getElementById('metricsWindow'),
	hSubscribed : document.getElementById('wSubs'),
	hMsgsSent : document.getElementById('wSent'),
	hMsgsRecd : document.getElementById('wRecd'),
	hMsgRate : document.getElementById('wRate'),
	hLatency : document.getElementById('wLatency'),
	hStatusBar : document.getElementById('statusBar'),
	repaint : function() {
				metricCnt.hSubscribed.innerHTML = metricCnt.subscriptions;
				metricCnt.hMsgsRecd.innerHTML = metricCnt.msgsIn.toString();
				metricCnt.hMsgsSent.innerHTML = metricCnt.msgsOut;
				metricCnt.hLatency.innerHTML = metricCnt.latency + ' ms';
				metricCnt.sessionNow = new Date();
				var intervalSecs = (metricCnt.sessionNow.getTime() - metricCnt.sessionStart.getTime()) / 1000;
				var rate = metricCnt.rateCnt/intervalSecs;
				metricCnt.hMsgRate.innerHTML = rate.toFixed(1) + ' /sec';
				},
	calcLatency : function() {
				metricCnt.tstampReturn = new Date();
				metricCnt.latency = metricCnt.tstampReturn.getTime() - metricCnt.tstampProbed.getTime(); // ms
				},
	showStatus : function(message) {
				metricCnt.hStatusBar.innerHTML = message;
				metricCnt.repaint();
				},
	clearStatus : function() {
				metricCnt.hStatusBar.innerHTML = '';
				}
}
var fxPositions = { // the positions widget object, one instance
	// volatiles for the Order History window
	isOpen : false,
	symbol : '',
	netLots : 0, // net of buys minus sells in order history
	value : 0,
	hWindow : document.getElementById('positionWindow'),
	hTable : document.getElementById('pwTable'),
	hValuation : document.getElementById('pwValue'),
	repaint :	function() {
					fxPositions.hValuation.innerHTML = fxPositions.value.toFixed(0);
				},
	recalc :	function() { //realtime valuation
					var instantQuote = widgetList[fxPositions.symbol].newSell[0];
					fxPositions.value = fxPositions.netLots * instantQuote;
					fxPositions.repaint();
				}
}
var newsCtl = { // the news control object, one instance
	newsPresent : false,
	slot : 0,
	headlines : {},
	scrollInterval : 2500, //ms
	timer : 0,
	container : document.getElementById('newsFeed'),
	update :	function(newsObject) {
					newsCtl.headlines = newsObject;
					newsCtl.slot = 0;
					newsCtl.newsPresent = true;
					newsCtl.rotate();
				},
	rotate :	function() { // news scroll
					if (!newsCtl.newsPresent) {return;}
					var lastRow = newsCtl.container.insertRow(-1);
					var newsCell = lastRow.insertCell(0);
					var cellContent = '<a href="' + newsCtl.headlines[newsCtl.slot].url + '" target="_blank">'
					cellContent += newsCtl.headlines[newsCtl.slot].title + ' &nbsp;[+]</a>';
					newsCell.innerHTML = cellContent;
					newsCtl.slot++;
					newsCtl.container.deleteRow(0);
					if (newsCtl.slot >= newsCtl.headlines.length) {
						newsCtl.newsPresent = false;
						newsCtl.slot = 0;
						newsCtl.timer = setTimeout('getNewsFeed()',1000);
						}
					else {
						newsCtl.timer = setTimeout('newsCtl.rotate()',newsCtl.scrollInterval);
						}
				}
}
var execCtl = { // the execution panel control object, one instance
	container : document.getElementById('executions'),
	update :	function(orderConfirm) {
					var lastRow = execCtl.container.insertRow(0);
					var orderCell = lastRow.insertCell(0);
					var cellContent = 'content from command response';
					orderCell.innerHTML = cellContent;
					execCtl.container.deleteRow(-1);
				}
}
var fxClk = {	// jQuery clock slider in the masthead
	date : document.getElementById('clockDate'),
	container : document.getElementById('slidePane'),
	clockId : [ document.getElementById('clock1'),
				document.getElementById('clock2'),
				document.getElementById('clock3'),
				document.getElementById('clock4'),
				document.getElementById('clock5')],
	city : ['GMT','New York','London', 'Geneva', 'Hong Kong'],
	offset : [0, -5, 0, 1, 8],
	dst : [1,1,1,1,0],	// codepoint: calculate this array for DST
	timer: null,
	easingSpeed: 2000,	//ms
	cycleCount: 0,
	showing: 0,			// the clock that is visible
	set :		function() {
					updateClocks();
					document.getElementById('mastLeft').style.width = '68px';
					fxClk.container.style.display = 'block'; // wait 'till now for IE7-8
					},  
	update : function() {updateClocks();}
}
var fxErr = { // utility error handler, alerts and posts into status window
	errtext : [ 'Internal error: Drag source absent',
				'You are already subscribed for ',
				'Server subscription timeout',
				'Unexpected command response received: ',
				'Server unreachable ',
				'All positions are in use. Please close a currency pair before adding another.'
				],
	hWindow : document.getElementById('alertBox'),
	hContent : document.getElementById('alertContent'),
	popAlert : function(type, code, particulars) {
		var msg = ((type == 1) ? 'Error: code = ' + code + ', ' : '');
		msg += fxErr.errtext[code] + particulars;
		metricCnt.showStatus(msg);
		fxErr.hContent.innerHTML = msg;
		fxErr.hWindow.style.display = 'block';
		}
}
var fxCurSym = {
	USD : '$ ', GBP : '£ ', EUR : '€ ', CAD : '$ ', AUD : '$ ', NZD : '$ ',
	CHF : 'CHF ', JPY : '¥ ', HKD : '$ ', SGD : '$ ', ILS : '₪ ', RUB : 'ру,; '
}
//DnD drag icon
var dragIcon = document.createElement('img');
dragIcon.src = 'images/panelthumb.jpg';
dragIcon.width = 80;
var dNd = { // volatile, persists only from ondragstart through ondragend events
	that : null,
	altDTO : null // Chrome dataTransfer bug workaround
}
//var that; // volatile: drag source element handle

// -----------------> START WIDGET CONTROL ARRAYS
var widgetList = {}; // Object array of WidgetControllers
var dropLocList = new Array(8);	// tracks which drop locations have a resident
var dropLocations = []; // handles to the drop location <div>s (mobile devices)
// -----------------> END WIDGET CONTROL ARRAYS
// -----------------> END GLOBALS

// -----------------> START WIDGET CONSTRUCTORS (abstract higher functions from screen details)
function WidgetController(pairName, flagImg, dropTarget) { // the DnD object controller
	var that = this; //private instance variable to supply 'this' to private/external functions (Crockford)
	this.type = 1;			// 1 = FX currency pair
	this.symbol = pairName; // e.g., USDGBP
	this.curSym = fxCurSym[this.symbol.slice(3)];
	this.image = flagImg;	// relative path to flag
	this.dropLoc = Math.floor(dropTarget.getAttribute('name'));	// drop location number: 0 - 7
	this.container = dropTarget; // the drop location
	this.topHandle = null;	// the top div of the html
	this.valuTable = document.getElementById('vTable');
	this.valuRow = 0;
	this.valuCol = 0;
	this.valuQty = 0;
	this.netPosition = 0.00;	// retrieved from the server
	this.lastBuy = ['',''];
	this.newBuy = ['',''];
	this.buyHandle = null;
	this.buyChange = null;
	this.buyTick = null;
	this.lastSell = ['',''];
	this.newSell = ['',''];
	this.sellHandle = null;
	this.sellChange = null;
	this.sellTick = null;
	this.needsRepaint = true;
	this.update = function(buyPrice, sellPrice) {
			this.lastBuy[0] = this.newBuy[0];
			this.newBuy[0] = (buyPrice-0).toFixed(4);
			this.newBuy[1] = (this.newBuy[0] - this.lastBuy[0]).toFixed(4);
			this.lastSell[0] = this.newSell[0];
			this.newSell[0] = (sellPrice-0).toFixed(4);
			this.newSell[1] = (this.newSell[0] - this.lastSell[0]).toFixed(4);
			this.netPosition = this.valuQty * fxTrade.lotSize * (sellPrice-0);
			this.needsRepaint = true;
			};
	this.repaint = function() {
			if (!this.needsRepaint) return;
			this.buyHandle.innerHTML = this.newBuy[0];
			this.buyChange.innerHTML = this.newBuy[1];
			this.sellHandle.innerHTML = this.newSell[0];
			this.sellChange.innerHTML = this.newSell[1];
			this.valuTable.rows[this.valuRow+1].cells[this.valuCol].innerHTML = this.curSym + this.netPosition.toFixed();
			if (this.newBuy[1] < 0) {
				this.buyHandle.className = 'tradePrice red';
				this.buyTick.className = 'tradeTick down';
				this.buyChange.className = 'tradeChange red';
				}
			else {
				this.buyHandle.className = 'tradePrice green';
				this.buyTick.className = 'tradeTick up';
				this.buyChange.className = 'tradeChange green';
				}
			if (this.newSell[1] < 0) {
				this.sellHandle.className = 'tradePrice red';
				this.sellTick.className = 'tradeTick down';
				this.sellChange.className = 'tradeChange red';
				this.valuTable.rows[this.valuRow+1].cells[this.valuCol].style.color = 'red';
				}
			else {
				this.sellHandle.className = 'tradePrice green';
				this.sellTick.className = 'tradeTick up';
				this.sellChange.className = 'tradeChange green';
				this.valuTable.rows[this.valuRow+1].cells[this.valuCol].style.color = '#53c300';;
				}
			this.needsRepaint = false;
			};
	this.setValu = function(netCost, netQty) {
			this.netPosition = Math.floor(netCost);
			this.valuQty = Math.floor(netQty);
			this.valuTable.rows[this.valuRow+1].cells[this.valuCol].innerHTML = fxCurSym[this.symbol.slice(3)] + this.netPosition.toFixed();
			}
	this.initValu = function() {
			if (this.dropLoc < 4) {
				this.valuRow = 0;
				this.valuCol = this.dropLoc;
				}
			else {
				this.valuRow = 2;
				this.valuCol = this.dropLoc - 4;
				}
			this.valuTable.rows[this.valuRow].cells[this.valuCol].innerHTML = this.symbol;
			this.valuTable.rows[this.valuRow+1].cells[this.valuCol].innerHTML = fxCurSym[this.symbol.slice(3)] + this.netPosition.toFixed();
			retrieveValuation(this.symbol); // asynchronous response event invokes setValue method
			};
	this.clearValu = function() {
			this.valuTable.rows[this.valuRow].cells[this.valuCol].innerHTML = '';
			this.valuTable.rows[this.valuRow+1].cells[this.valuCol].innerHTML = '';
			this.valuRow = this.valuCol = 0;
			}
}
//---
function ChartController(pairName, chartTarget, seriesColor, pointCount, chartPrime) { // the chart object controller
	var that = this;
	this.type = 2;			// 2 = chart
	this.symbol = pairName; // e.g., USDXAG
	this.containerId = chartTarget; // id attribute of <canvas>
	this.plot = {};		// the rGraph control block;
	this.priceArray = [];	// the prices to be charted
	this.xCount = pointCount;		// number of points on x axis
	this.yCenter = chartPrime;		// centerpoint
	this.yFloor = Math.floor(this.yCenter * 0.5);	//y  axis floor
	this.yLimit = Math.floor(this.yCenter * 1.5);	// y axis top
	this.lineColor = '#0067b1';
	this.refreshRate = 500;	// msec, for realtime graphs
	this.needsRepaint = true;
	this.update = function(nextPrice) {
		this.priceArray = this.priceArray.slice(1);// treat as a little-endian FIFO
		this.priceArray.push(Math.round(nextPrice));
		this.plot.original_data[0] = this.priceArray;
		this.needsRepaint = true;
		};
	this.repaint = function() {
		if (this.needsRepaint) {
        	this.plot.Draw();
			this.needsRepaint = false;
			}
		};
	this.randomizer = function() { //primitive test structure for realtime graphs
		var lastPoint = this.priceArray[this.xCount-1];
		var tmp = Math.floor(lastPoint + Math.random() * 11 - 5);
		if (tmp >= this.yLimit || tmp <= this.yFloor) {
			tmp = this.yCenter;
		}
		this.update(tmp);
		this.repaint();
		};
	this.init = function(rChart) {
		for (var i=0; i< this.xCount; i++) { // initialize the array
			this.priceArray[i] = this.yCenter;
			}
		this.plot = rChart; // the rGraph object created by caller
		this.plot.Set('chart.background.barcolor1', 'black');
		this.plot.Set('chart.background.barcolor2', 'black');
		this.plot.Set('chart.background.grid', true);
		this.plot.Set('chart.background.grid.color', '#4c4c4c');
		this.plot.Set('chart.linewidth', 2);
		//this.plot.Set('chart.shadow', true);
		//this.plot.Set('chart.shadow.color', '#fff');
		//this.plot.Set('chart.stepped', true);
		this.plot.Set('chart.gutter.top', 4);
		this.plot.Set('chart.gutter.left', (this.yCenter>1000) ? 46 : 32);
		this.plot.Set('chart.gutter.right', 0);
		this.plot.Set('chart.gutter.bottom', 5);
		this.plot.Set('chart.hmargin', 5);
		this.plot.Set('chart.noaxes', false);
		this.plot.Set('chart.axis.color', '#888');
		this.plot.Set('chart.xaxispos', 'bottom');
		this.plot.Set('chart.title', this.symbol);
		this.plot.Set('chart.title.color', '#eee');
		this.plot.Set('chart.title.vpos', 2.5);
		this.plot.Set('chart.text.color', '#eee');
		this.plot.Set('chart.tickmarks', null);
		this.plot.Set('chart.xticks', 8);
		this.plot.Set('chart.ymin', this.yFloor);
		this.plot.Set('chart.ymax', this.yLimit);
		this.plot.Set('chart.colors', [this.lineColor]);
		this.plot.Set('chart.background.grid.autofit', true);
		this.plot.Set('chart.background.grid.autofit.numhlines', 8);
		this.plot.original_data[0] = this.priceArray;
		this.plot.Draw();
		};
	this.setAxis = function(centerpoint) { // sets the y-axis scale values
		this.yCenter = centerpoint;
		}
}
//---
function MarketWatchController(mktSymbol, cellPosition) {
	var that = this;
	this.type = 3;			// 2 = market index
	this.market = mktSymbol;
	this.lastLevel = 0;  //for up/down tick colors
	this.level = 0;
	this.change = 0;
	this.changePct = 0;
	this.tickDown = false;		// tick direction
	this.hTable = document.getElementById('iTable'); // rows = 3, cols = 12
	this.rootCell = cellPosition;
	this.tRow = Math.floor(cellPosition / 12);
	this.tCell = Math.floor(cellPosition % 12);
	this.update = 	function(mktLevel, mktChange) {
						this.lastLevel = this.level;
						this.level = mktLevel;
						this.change = mktChange;
						this.lastTick = this.tickDown;
						this.tickDown = (this.change < 0) ? true : false;
						this.changePct = (Math.abs(this.change-0) == 0) ? 0 : (this.change-0) / Math.floor(this.level-0 + (this.change * -1)) * 100;
						this.repaint();
					}
	this.repaint = 	function(){
						this.hTable.rows[this.tRow].cells[this.tCell+1].innerHTML = this.level;
						this.hTable.rows[this.tRow].cells[this.tCell+2].innerHTML = this.change;
						this.hTable.rows[this.tRow].cells[this.tCell+3].innerHTML = ((this.tickDown) ? '' : '+') + this.changePct.toFixed(1) + '%';
						if (this.tickDown) {
							this.hTable.rows[this.tRow].cells[this.tCell+1].style.color = 'red';
							this.hTable.rows[this.tRow].cells[this.tCell+2].style.color = 'red';
							this.hTable.rows[this.tRow].cells[this.tCell+3].style.color = 'red';
							}
						else {
							this.hTable.rows[this.tRow].cells[this.tCell+1].style.color = '#53c300';// green
							this.hTable.rows[this.tRow].cells[this.tCell+2].style.color = '#53c300'; 
							this.hTable.rows[this.tRow].cells[this.tCell+3].style.color = '#53c300';
							}
					}
}
// -----------------> END WIDGET CONSTRUCTORS

// -----------------> RUNs on LOAD, RESIZE, READY, and UNLOAD
window.onload = function () { // initialize the spot charts
	var symbol = 'USDXAU';
	widgetList[symbol] = new ChartController(symbol, 'chart1', '#0067b1', 50, 1800);
	metricCnt.subscriptions++;
	var widgetCtl = widgetList[symbol];
	var plotObject = new RGraph.Line(widgetCtl.containerId, widgetCtl.priceArray);
	widgetCtl.init(plotObject);
	var symbol = 'USDXAG';
	widgetList[symbol] = new ChartController(symbol, 'chart2', '#0067b1', 50, 40);
	metricCnt.subscriptions++;
	var widgetCtl = widgetList[symbol];
	plotObject = new RGraph.Line(widgetCtl.containerId, widgetCtl.priceArray);
	widgetCtl.init(plotObject);
//----- for serverless testing; comment or remove this when server response values are available
	//chartTest();
}
// if rGraph charts' <canvas> flash a white background after a resize, uncomment this
/*
window.onresize = function () {
	if (widgetList['USDXAU']) {widgetList['USDXAU'].repaint;}
	if (widgetList['USDXAG']) {widgetList['USDXAG'].repaint;}
	metricCnt.showStatus('Charts re-drawn.');
}*/
$(document).ready(function() {
	fxClk.set();
	fxClk.timer = setInterval(fxClk.update, 1000);
	attachDnDEvents();
	if (metricCnt.iDevice) {
		document.getElementById('browserScript').style.display = 'none';
		document.getElementById('mobileScript').style.display = 'block';
		}
	else {
		$(function() {
			$("#tradeWindow").draggable();
			$("#positionWindow").draggable();
			$("#metricsWindow").draggable();
			$("#scriptWindow").draggable();
			});
		}
	document.getElementById('rateSelect').msgRate[1].checked = true; // resets needed for Firefox reload
/* comment out for local testing */
	document.body.style.cursor = 'progress';
	metricCnt.showStatus('Opening websockets...');
	wsCtl.init(); //Kaazing websocket initializer
	metricCnt.showStatus('Connection pending...');
// end testing
	initMarketWatch();
	
});
$(document).unload(function() {
	if (metricCnt.isOpen) {hideMetrics(metricCnt.hWindow);};
	if (fxTrade.isOpen) {cleanupOrderWindow();};
	if (fxPositions.isOpen) {closePositionWindow(fxPositions.hWindow);};
	// codepoint: unsubscribe from Kaazing Gateway if required
});
// -----------------> END RUN ON LOAD

// -----------------> BEGIN STARTUP ROUTINES
function initMarketWatch() {
	var watchMarkets = [ ['DOW',0], ['NASDAQ',12], ['S&P 500',24], ['FTSE 100',4], ['DAX',16], ['CAC 40',28], ['Nikkei',8], ['Hang Seng',20], ['Shanghai',32] ];
	
	for (var i=0; i<watchMarkets.length; i++) {
		marketName = watchMarkets[i][0];
		widgetList[marketName] = new MarketWatchController(marketName, watchMarkets[i][1]); // market name and root cell in the iTable
		widgetList[marketName].update('0','0');
		metricCnt.subscriptions++;
	}
}
function chartTest() { // this is a check routine for local (serverless) testing of realtime chart widgets
	widgetList['USDXAU'].randomizer();
	widgetList['USDXAG'].randomizer();
	setTimeout(chartTest, 750);  //testing, update charts twice per second
}
// -----------------> END STARTUP ROUTINES

// -----------------> BEGIN SERVER WEBSOCKETS INTERFACE
// send the message with response to the temporary response queue created during initialization.
function sendCommand(commandMessage, callback) {
	if (!metricCnt.serverConnected) {return}; // server connection not established, will fail
	metricCnt.msgsOut++;
	metricCnt.rateCnt++;
	commandMessage.setJMSReplyTo(wsCtl.responseQueue);
	commandMessage.setJMSCorrelationID('cmd-' + metricCnt.msgsOut);
	wsCtl.commandProducer.send(commandMessage, callback || null);
	}
// session server commands respond here (topic streams respond further below)
function onCommandResponse(response) {
	var data = '', controller = null;
	metricCnt.msgsIn++;
	metricCnt.rateCnt++;
	var symbol = response.getStringProperty('symbol');
	var command = response.getStringProperty('command');
	var msgId = response.getJMSCorrelationID();
	
	switch (command) {
		case 'place_order':  // responds with execution data
					metricCnt.showStatus('Order received (ID = ' + msgId + ')');
					data = response.getStringProperty('result');
					executionHistory(data, symbol);
					if (fxPositions.isOpen && fxPositions.symbol == symbol) {
						retrieveOrder(symbol);
						}
					else {
						retrieveValuation(symbol);
					}
					break;
		case 'set_rate':
					metricCnt.sessionStart = new Date();
					metricCnt.rateCnt = 1;
					metricCnt.showStatus('Message Rate set to ' + metricCnt.Hz + ' messages per second. (' + msgId + ')');
					break;
		case 'get_orders':
					metricCnt.showStatus('Order history retrieved for ' +  symbol + ' (ID = ' + msgId + ')');
					data = response.getStringProperty('result');
					orderHistory(data, symbol);
					break;
		case 'get_net_order':
					if (response.getStringProperty('result') == null) {
						metricCnt.showStatus('No orders found for ' + symbol);
						return;
						}
					else {
						metricCnt.clearStatus();
						}
					data = response.getStringProperty('result').split(':');
					symbol = data[0];
					var controller = widgetList[symbol];
					if (controller == undefined) { return; }
					controller.setValu(data[1], data[2]); // currency pair position value (more precisely, net orders on file)
					break;
		case 'ping':
					metricCnt.calcLatency();
					if (metricCnt.latency < 5000) {
						metricCnt.showStatus('Server turnaround received (' + msgId + '); Roundtrip latency calculated as ' + metricCnt.latency + ' ms.');
						}
					else {
						metricCnt.latency = 0;
						metricCnt.showStatus('Network Timeout at 5000ms (' + msgId + '); Please retry the latency probe.');
						}
					break;
		case 'get_spot_prices':
					if (!response.getStringProperty('result')) {return;};
					data = response.getStringProperty('result').split(':');
					controller = widgetList[symbol];
					if (controller) {
						controller.setAxis(parseInt(data[1])); // initial chart value - for setting the y-axis scale
						}
					break;
		case 'get_news':
					data = response.getStringProperty('result');
					var headlines = (window.JSON) ? JSON.parse(data) : eval(data); // JSON.parse is 'way faster if present
					if (headlines) {
						newsCtl.update(headlines);
						}
					break;
		default:
					metricCnt.showStatus('Unexpected command response received: ' + command);
						if (wsCtl.fxDebug) {fxErr.popAlert(2, 3, command)};
					break;
		}
}
// quote topic responds here
function currenciesReceived(response) {  // types 1 & 2 widget
		metricCnt.msgsIn++;
		metricCnt.rateCnt++;
		var messageContent = response.getText();
		var pairUpdate = messageContent.split(':'); // company, ticker, price, shares
		var targetWidget = widgetList[pairUpdate[0]]; //find the widget
		if (targetWidget != undefined && (targetWidget.type == 1 || targetWidget.type == 2)) { // ignore if symbol not being displayed
			targetWidget.update(pairUpdate[1], pairUpdate[2]); // (buy, sell) or (spot price, null)
			targetWidget.repaint();
			}
}
// Market Indices topic responds here
function indicesReceived(response) {  // type 3 widget
		metricCnt.msgsIn++;
		metricCnt.rateCnt++;
		var messageContent = response.getText();
		var pairUpdate = messageContent.split(':'); // market, level, change
		var targetWidget = widgetList[pairUpdate[0]]; //find the widget
		if (targetWidget != undefined && targetWidget.type === 3) { // ignore if that symbol is not being displayed
			targetWidget.update(pairUpdate[1], pairUpdate[2]); // (level, change)
			}
}
// Spot Prices topic (charts) responds here
function spotPriceReceived(response) {  // type 3 widget
		metricCnt.msgsIn++;
		metricCnt.rateCnt++;
		var messageContent = response.getText();
		var pairUpdate = messageContent.split(':'); // commodity, price in USD
		var chartWidget = widgetList[pairUpdate[0]]; //find this chart widget
		if (chartWidget != undefined && chartWidget.type === 2) { // ignore if that symbol is not being charted
			var price = Math.round(pairUpdate[1]);
			chartWidget.update(price);
			chartWidget.repaint();
			}
}
// Orders originate here
function placeOrder() {	
		var orderCommand = wsCtl.session.createTextMessage('');
		orderCommand.setStringProperty('command', 'place_order');
		orderCommand.setStringProperty('symbol', fxTrade.symbol);
		orderCommand.setStringProperty('action', fxTrade.tradeSide);   // {buy, sell}
		orderCommand.setStringProperty('orderType', fxTrade.orderType); // GTC
		orderCommand.setStringProperty('lotCount', fxTrade.lots);	// 1 - 9999
		orderCommand.setStringProperty('quote', fxTrade.quote);
		orderCommand.setStringProperty('baseAmount', fxTrade.amount); // units, usually 100,000
		orderCommand.setStringProperty('quoteAmount', (fxTrade.amount * fxTrade.quote).toFixed(2));
		sendCommand(orderCommand);
}
// Order History request originate here
function retrieveOrder(symbol) {
		fxPositions.symbol = symbol;
		var retrieveCommand = wsCtl.session.createTextMessage('');
		retrieveCommand.setStringProperty('command', 'get_orders');
		retrieveCommand.setStringProperty('symbol', symbol);
		sendCommand(retrieveCommand);
}
// Position Valuation request originate here
function retrieveValuation(symbol) {
		var retrieveValCommand = wsCtl.session.createTextMessage('');
		retrieveValCommand.setStringProperty('command', 'get_net_order');
		retrieveValCommand.setStringProperty('symbol', symbol);
		sendCommand(retrieveValCommand);
}
// Ping originate here
function latencyProbe() {  // ping
		metricCnt.showStatus('Latency calculation in process...'); // eliminates casual viewer confusion
		var pingCommand = wsCtl.session.createTextMessage('');
		pingCommand.setStringProperty('command', 'ping');
		sendCommand(pingCommand);
		metricCnt.tstampProbed = new Date();
}
// Rate Change originate here
function throttleRate(hertz) {  // set quote topic speed in Hz for currency pair updates
		metricCnt.Hz = hertz;
		var rateCommand = wsCtl.session.createTextMessage('');
		rateCommand.setStringProperty('command', 'set_rate');
		rateCommand.setStringProperty('rate', metricCnt.Hz.toFixed(0)); 
		sendCommand(rateCommand);
}
// One-time Spot Price retrieval originates here
function getSpotPrice(symbol) {  // set quote topic speed in Hz for currency pair updates
		var spotCommand = wsCtl.session.createTextMessage('');
		spotCommand.setStringProperty('command', 'get_spot_prices');
		spotCommand.setStringProperty('symbol', symbol); 
		sendCommand(spotCommand);
}
// News Feed Retrieval originates here
function getNewsFeed() {
		var newsCommand = wsCtl.session.createTextMessage('');
		newsCommand.setStringProperty('command', 'get_news');
		sendCommand(newsCommand);
}
// Server connection success responds here
function connectionResponse() {
		document.body.style.cursor = 'default';
		metricCnt.msgsIn++;
		metricCnt.rateCnt++;
		metricCnt.serverConnected = true;
		metricCnt.showStatus('Websocket connections established with demo.kaazing.com');
			if (wsCtl.fxDebug) {console.log('Websocket connection established with demo.kaazing.com');}
		getNewsFeed();
		metricCnt.showStatus('News feeds started.');
			if (wsCtl.fxDebug) {console.log('News feeds started.');}
}
// -----------------> END SERVER WEBSOCKETS INTERFACE

// -----------------> START EVENT HANDLERS
// ----> misc event handlers and direct functions
function destroyWidget(that) { // remove a currency pair widget
	var container = that.parentNode; //the drop location
	var symbol = container.getAttribute('id');
	container.removeChild(that);
	widgetList[symbol].clearValu(); // de-link the valuation table
	container.setAttribute('id', null);
	dropLocList[widgetList[symbol].dropLoc] = null; // location is now unoccupied
	delete widgetList[symbol];
	metricCnt.subscriptions--;	
}
/* unimplemented in server
function changeFeed(selectList,section) { // change external / internal News feeds
	if (selectList.value == 'NY Times') {
		var msg = '<i>New York Times news feed is running</i>';
		section.rows[0].cells[0].innerHTML = msg;
		//getNewsFeed();
		}
	else {
		var msg = '<b>' + selectList.value + ' news feed is not available in this Demo' + '</b>';
		section.rows[0].cells[0].innerHTML = msg;
		// codepoint: add code to serve news from other channels if/when subscription is obtained
		}
		metricCnt.showStatus(msg);
}
*/
function showMetrics() { // display connection metrics compiled by client
	metricCnt.repaint();
	metricCnt.hWindow.style.display='block';
	latencyProbe();
	metricCnt.isOpen = true;
}
function hideMetrics(that) { // put it away
	that.style.display='none';
	metricCnt.isOpen = false;
}
function openNewsWindow(exURL) {
	window.open(exURL, "newsWindow", "directories=no,status=yes,scrollbars=yes,resizable=yes,width=1024,height=750");
}
//---- START Order Processing events
function openOrderWindow(that) { //recondition the widget
	fxTrade.hSymbol.innerHTML = that.firstChild.innerHTML;
	fxTrade.symbol = that.firstChild.innerHTML.slice(-6);
	fxTrade.baseCurrency = fxTrade.symbol.slice(0,3);
	fxTrade.quoteCurrency = fxTrade.symbol.slice(3,6);
	fxTrade.hQty.value = fxTrade.hPrice.value = ''; //clear the <input> nodes
	fxTrade.tradeSide = fxTrade.lots = fxTrade.quote = fxTrade.amount = ''; // clear residue from the control object
	fxTrade.errQty = fxTrade.errPrice = false;
	fxTrade.hQty.readOnly = false;
	fxTrade.hPrice.readOnly = false;
	fxTrade.hButtons.style.display = 'block';
	fxTrade.hSummary.style.display = 'none';
	fxTrade.hErrors.style.display = 'none';
	fxTrade.hHelp.style.display = 'none';
	fxTrade.hWindow.style.display = 'block';
	fxTrade.hQty.focus();
	fxTrade.isOpen = true;
}
function cleanupOrderWindow() { // re-initialize the control object values and close the order window
	fxTrade.tradeSide = fxTrade.lots = fxTrade.quote = fxTrade.amount = '';
	fxTrade.isOpen = fxTrade.errQty = fxTrade.errPrice = false;
	fxTrade.hWindow.style.display = 'none';
}
function processOrder(that, tradeSide) {
	fxTrade.tradeSide = tradeSide;
	fxTrade.quote = fxTrade.hPrice.value;

	var qty = fxTrade.hQty.value;	
	qty = qty.replace(/,/g, '');
	fxTrade.lots = qty.replace(/k/i, '000');
	fxTrade.errQty = !/^[0-9]{1,4}$/.test(fxTrade.lots);
	if (!fxTrade.errQty) {fxTrade.hQty.value = fxTrade.lots};
	
	fxTrade.errPrice = !/^[0-9]{1,4}.[0-9]{4,5}$/.test(fxTrade.quote);
	if (fxTrade.errQty || fxTrade.errPrice) {
		fxTrade.hErrorText.innerHTML = (fxTrade.errQty) ? 'Invalid Lot Quantity.<br />' : '';
		fxTrade.hErrorText.innerHTML += (fxTrade.errPrice) ? 'Invalid Quote.' : '';
		that.style.display = 'none';
		fxTrade.hErrors.style.display = 'block';
		}
	else {
		fxTrade.amount = ((fxTrade.lots - 0) * fxTrade.lotSize).toFixed(2); // coerce both ways
		fxTrade.hSummaryText.innerHTML = 'You are placing a GTC order to ' + fxTrade.tradeSide + ' ' + fxTrade.lots + ((fxTrade.lots == 1) ? ' lot ' : ' lots ') +
			fxTrade.symbol + ' at ' + fxTrade.quote +
			':<br /><i>Base currency</i>: ' + fxCurSym[fxTrade.baseCurrency] + ((fxTrade.baseCurrency == 'GBP') ? fxTrade.amount.replace('.', ',') : fxTrade.amount) +
			'; <br /><i>Quote currency</i>: ' + fxCurSym[fxTrade.quoteCurrency] +
			((fxTrade.quoteCurrency == 'GBP') ? (fxTrade.amount * fxTrade.quote).toFixed(2).replace('.', ',') : (fxTrade.amount * fxTrade.quote).toFixed(2));

		fxTrade.hQty.readOnly = true;
		fxTrade.hPrice.readOnly = true;
		that.style.display = 'none';
		fxTrade.hSummary.style.display = 'block';
		}
}
function retryOrder() {
		fxTrade.hErrors.style.display = 'none';
		fxTrade.hHelp.style.display = 'none';
		fxTrade.hButtons.style.display = 'block';
		fxTrade.hQty.focus();
}
function showOrderHelp() {
		fxTrade.hHelp.style.display = 'block';
}
function submitOrder(that) {
	fxTrade.hWindow.style.display = 'none';
	placeOrder(); // parms are in fxTrade object
}
function openPositionWindow (that){
	var symbol = fxPositions.symbol = that.firstChild.innerHTML.slice(-6);
	document.getElementById('positionSymbol').innerHTML = symbol;
	fxPositions.hValuation.innerHTML = '';
	var rowCount = fxPositions.hTable.rows.length;
	for (var i = 0; i < rowCount; i++) {
			fxPositions.hTable.deleteRow(-1);
			}
	retrieveOrder(symbol);
	if (!fxPositions.isOpen) {
		document.getElementById('positionWindow').style.display = 'block';
		fxPositions.isOpen = true;
		}
}
function closePositionWindow (that) {
	that.style.display = 'none';
	fxPositions.isOpen = false;

}
//---- END Order Processing events

function updateClocks() { // maintain locale clocks
	var timeHere = new Date();
	var utc, timeThere;
	if (metricCnt.isOpen) {
		metricCnt.repaint();
		}
	fxClk.date.innerHTML = timeHere.toDateString();
	for (var i=0; i<fxClk.clockId.length; i++) {
    	utc = timeHere.getTime() + (timeHere.getTimezoneOffset() * 60000); // convert to msec, add local time zone offset =  UTC time in msec	  
		timeThere = new Date(utc + (3600000*(fxClk.offset[i]+fxClk.dst[i]))); // create new Date object for this city using supplied offset
   		fxClk.clockId[i].innerHTML = timeThere.toLocaleTimeString();
		if (timeThere.getDay() != timeHere.getDay()) {fxClk.clockId[i].innerHTML += ' +1';}
		}
	// jQuery easing
	if (fxClk.cycleCount++ > (fxClk.easingSpeed / 1000)) {
		fxClk.cycleCount = 0;
		if (fxClk.showing == 5) {
			fxClk.showing = 0;
			document.getElementById('cityTime').style.left = '0px';
			}
		else {
			fxClk.showing++;
			$("div#cityTime").animate(({left: '-=170px'}));
		}
	}
}
// ----> START DnD and TOUCH EVENT HANDLERS -------------------------------------------------------------------------
// attach event handlers (this saves a boatload of HTML and simplifies cross-platform variations)
function attachDnDEvents() {
	var draglist, elem;
	switch (metricCnt.iDevice) {
		case true:
 			dragList = document.querySelectorAll('li.dragEnabled');
			for (var i=0; i<dragList.length; i++) {
				elem = dragList[i];
				elem.onclick = iClick;
				elem.onmouseover = '';
				elem.draggable = false;
				elem.style.cursor = 'default';
				}
		 	dragList = document.getElementById('section1').getElementsByTagName('div');
			for (var i=0; i<dragList.length; i++) {
				dropLocations[i] = dragList[i]; // no drop event, so remember drop locations
				}
			break;
			
		case false:
			// attach event handlers to drag sources
 			dragList = document.getElementById('dragSources').getElementsByTagName('li'); // this approach in deference to lte IE 7
			for (var i=0; i<dragList.length; i++) {
				elem = dragList[i];
				if (elem.className.match(/dragEnabled/i)) {
					elem.draggable = true;
					elem.ondragstart = dragStart;
					elem.ondragend = dragEnd;
					}
			}
		 // attach handlers to drop targets
		 	dragList = document.getElementById('section1').getElementsByTagName('div');  // cross-browser incl lte IE 7
			for (var i=0; i<dragList.length; i++) {
				var elem = dragList[i];
				elem.draggable = true;
				elem.ondragstart = dragStart;
				elem.ondragend = dragEnd;
				elem.ondragenter = dragEnter;
				elem.ondragleave = dragLeave;
				elem.ondragover = dragOver;
				elem.ondrop = dragDrop;
				}
			break;
	}
}
//----> touch event handlers --------------------------------------------------------------------
function iClick(evntObj) {
	var imageSrc, dropIndex, dropHandle;
	var pairName = this.firstChild.getAttribute('title');
	
	if (widgetList[pairName] !== undefined) { // duplicate
		fxErr.popAlert(2, 1, pairName);
		return;
		}
	// find a location to 'drop' the currency pair
	for (dropIndex=0; dropIndex < dropLocList.length && dropLocList[dropIndex] == 'in-use'; dropIndex++) {}
	if (dropIndex == dropLocList.length) {
		fxErr.popAlert(2, 5, '');
		return;
		}
	// build the widget & controller
	dropLocList[dropIndex] = 'in-use';
	dropHandle = dropLocations[dropIndex]; 
	imageSrc = this.firstChild.getAttribute('src');
	widgetList[pairName] = new WidgetController(pairName, imageSrc, dropHandle);
	dropHandle.setAttribute('id', pairName);
	createWidget(widgetList[pairName]); // create a new widget
	widgetList[pairName].initValu(); // set up valuation table
	metricCnt.subscriptions++;
}


//----> drag-and-drop event handlers ----------------------------------------------------------------------
function dragStart(evntObj) { // 'this' = drag source
	if (!evntObj) evntObj = window.event //  IE
	
	if (this.className.match(/mktBlock/)) { // dragging from a drop target, i.e., repositioning
		// some (any) data as follows is *required* for all browsers; cross-browser setData() only in this handler
		// evntObj.dataTransfer.setData("URL", this.firstChild.firstChild.firstChild.getAttribute('src')); // flag
		dNd.altDTO = this.firstChild.getAttribute('src'); // Chrome workaround
		evntObj.dataTransfer.setData("Text", this.getAttribute('id')); // currency pair
		}
	else {
		evntObj.dataTransfer.setDragImage(dragIcon, 30, -30);
		dNd.altDTO = this.firstChild.getAttribute('src'); // Chrome workaround
		evntObj.dataTransfer.setData("Text", this.firstChild.getAttribute('title')); //ensure flag img title is not absent!
	}
	evntObj.dataTransfer.effectAllowed='copy'; // required for IE
	that = this;
	return true; //required for drag to start
}
function dragEnter(evntObj) {  // 'this' = element dragged into
	if (!evntObj) evntObj = window.event //  IE
	evntObj.dataTransfer.dropEffect='copy';
	evntObj.preventDefault();
	return false; //  IE
}
function dragOver(evntObj) {  // 'this' = element dragged over
	if (!evntObj) evntObj = window.event //  IE
	evntObj.dataTransfer.dropEffect = 'copy';
	if (dropLocList[this.getAttribute('name')] != 'in-use') {
		evntObj.target.style.background = '#333';
		}
	evntObj.preventDefault(); //  IE
	return false;
}
function dragLeave(evntObj) {  // 'this' = element dragged out of (i.e., passing *through* a drop target)
	if (!evntObj) evntObj = window.event //  IE
	if (dropLocList[this.getAttribute('name')] != 'in-use') {
		this.style.background = null;
		}
	evntObj.preventDefault();
	return false;
}
function dragEnd(evntObj) { // 'this' = drag source; this dragEnd event is fired AFTER ondrop
	if (!evntObj) evntObj = window.event //  IE
	evntObj.preventDefault();  // IE
	if (this == that) {return false;} // dropped on self
	if (dropLocList[this.getAttribute('name')] == 'in-use') {
		this.style.background = null;
		}
	return true;
}
// OK, Here's the Beef ;-)
function dragDrop(evntObj) {// 'this' = drop target; this event occurs BEFORE ondragend
	if (!evntObj) evntObj = window.event //  IE
	evntObj.stopPropagation(); // stops inexplicable redirection
	evntObj.preventDefault();
	if (that == this) { return false}; // don't drop it on yourself when repositioning
	var payloadSymbol = evntObj.dataTransfer.getData("Text");
	var payloadImg = dNd.altDTO; // Chrome workaround for dataTransfer bug
	var subscribed = (widgetList[payloadSymbol] === undefined) ? false : true;
	var occupied = (dropLocList[this.getAttribute('name')] == 'in-use') ? true : false;
	var repositioning = (that.className.match(/mktBlock/)) ? true : false;
	var dropIndex = this.getAttribute('name');
	
	this.style.background = null;
	evntObj.dataTransfer.dropEffect='copy';
	if (subscribed && !repositioning) {
		fxErr.popAlert(2, 1, payloadSymbol);
		return false;
		}
	if (occupied) { // there's already a widget in this drop location; cleanup
		this.removeChild(this.firstChild);
		widgetList[this.getAttribute('id')].clearValu(); // de-link the valuation table
		delete widgetList[this.getAttribute('id')];
		this.setAttribute('id', null);
		metricCnt.subscriptions--;	
		}
	if (repositioning) {
		that.removeChild(that.firstChild); //clear the drag source if dragging from a another drop target
		widgetList[payloadSymbol].clearValu(); // de-link the valuation table
		dropLocList[that.getAttribute('name')] = null;
		widgetList[payloadSymbol].container = this; // this becomes the new drop target (for createWdiget())
		widgetList[payloadSymbol].dropLoc = dropIndex; // associate the Valuations table)
		}
	else {
		widgetList[payloadSymbol] = new WidgetController(payloadSymbol, payloadImg, this);
		metricCnt.subscriptions++;
		}
	this.setAttribute('id', payloadSymbol);
	dropLocList[dropIndex] = 'in-use';
	createWidget(widgetList[payloadSymbol]); // create a new widget, uses existing controller if repositioning
	widgetList[payloadSymbol].initValu(); // set up valuation table
	metricCnt.clearStatus();
	that = this; // that now = the drop target rather than the drop source, updated for the ondragend event, volatile afterwards
	return false; // return false so the event will not be propagated to the browser (IE)
}
// -----------------> END EVENT HANDLERS

/* -----------------> START WIDGET FACTORY 
	build html fragments dynamically in order to cache pointers to internal elements in the widget controller object, thereby
	avoiding tens-of-thousands of subsequent document.getElementsById() as websocket updates arrive 
*/
function createWidget(controller) {
	var widget, topDiv, newDiv, subDiv, tmp;
	
			widget = document.createDocumentFragment();
			topDiv = document.createElement("div");
				topDiv.setAttribute("class", "fxWidgetPrototype")
			newDiv = document.createElement("div");
				newDiv.setAttribute("class", "pairSymbol")
				tmp = document.createElement("img");
					tmp.src = controller.image;
					tmp.className = "flag";
				newDiv.appendChild(tmp);
				tmp = document.createTextNode(controller.symbol);
				newDiv.appendChild(tmp);
				topDiv.appendChild(newDiv);
			newDiv = document.createElement("div");
				newDiv.setAttribute("class", "unsubscribe")
				newDiv.setAttribute("onclick", "destroyWidget(this.parentNode);")
				newDiv.setAttribute("title", "Unsubscribe")
				topDiv.appendChild(newDiv);
			newDiv = document.createElement("div");
				newDiv.setAttribute("class", "clearLeft")
				topDiv.appendChild(newDiv);
			newDiv = document.createElement("div");
				newDiv.setAttribute("class", "tradeSide")
				subDiv = document.createElement("div");
					subDiv.setAttribute("class", "tradePrice")
					tmp = document.createTextNode('0.0000');
					subDiv.appendChild(tmp);
					controller.buyHandle = newDiv.appendChild(subDiv);
				subDiv = document.createElement("div");
					subDiv.setAttribute("class", "tradeChange")
					tmp = document.createTextNode('0.0000');
					subDiv.appendChild(tmp);
					controller.buyChange = newDiv.appendChild(subDiv);
				subDiv = document.createElement("div");
					subDiv.setAttribute("class", "tradeTick up")
					tmp = document.createTextNode("");
					tmp.innerHTML = '&#x25b2;';
					subDiv.appendChild(tmp);
					controller.buyTick = newDiv.appendChild(subDiv);
				subDiv = document.createElement("div");
					subDiv.setAttribute("class", "tradeType")
					tmp = document.createTextNode('Buy');
					subDiv.appendChild(tmp);
					newDiv.appendChild(subDiv);
				topDiv.appendChild(newDiv);
			newDiv = document.createElement("div");
				newDiv.setAttribute("class", "tradeSide")
				subDiv = document.createElement("div");
					subDiv.setAttribute("class", "tradePrice red");
					tmp = document.createTextNode('0.0000');
					subDiv.appendChild(tmp);
					controller.sellHandle = newDiv.appendChild(subDiv);
				subDiv = document.createElement("div");
					subDiv.setAttribute("class", "tradeChange red")
					tmp = document.createTextNode('0.0000');
					subDiv.appendChild(tmp);
					controller.sellChange = newDiv.appendChild(subDiv);
				subDiv = document.createElement("div");
					subDiv.setAttribute("class", "tradeTick down")
					tmp = document.createTextNode('');
					tmp.innerHTML = '&#x25bc;';
					subDiv.appendChild(tmp);
					controller.sellTick = newDiv.appendChild(subDiv);
				subDiv = document.createElement("div");
					subDiv.setAttribute("class", "tradeType")
					tmp = document.createTextNode('Sell');
					subDiv.appendChild(tmp);
					newDiv.appendChild(subDiv);
				topDiv.appendChild(newDiv);
			newDiv = document.createElement("div");
				newDiv.setAttribute("class", "widgetLink")
				newDiv.setAttribute("title", "Enter an order")
				newDiv.setAttribute("onclick", "openOrderWindow(this.parentNode);");
				tmp = document.createTextNode('Trade');
				newDiv.appendChild(tmp);
				topDiv.appendChild(newDiv);
			newDiv = document.createElement("div");
				newDiv.setAttribute("class", "widgetLink")
				newDiv.setAttribute("title", "View Orders and Net Position")
				newDiv.setAttribute("onclick", "openPositionWindow(this.parentNode);");
				tmp = document.createTextNode('History');
				newDiv.appendChild(tmp);
				topDiv.appendChild(newDiv);
			controller.topHandle = widget.appendChild(topDiv);
		controller.container.appendChild(widget);
}
function orderHistory(serverData, symbol) { // trades are split() from 'get_orders' server response
	var docfrag, rows, columns, tr, td, tmp, fmt, utc, dayTime, symbol;
	var sequence = 	[7, 1, 3, 4, 6]; // timestamp, buy/sell, lots, quote, amount
	var format = 	[1, 2, 0, 0, 3]; // 1 = Date, 2 = initial cap, 3 = currency
	var parentController = widgetList[symbol];
	
			parentController.netPosition = parentController.valuQty = 0;
			var rowCount = fxPositions.hTable.rows.length;
			for (var i = 0; i < rowCount; i++) {
					fxPositions.hTable.deleteRow(-1);
					}
			docfrag = document.createDocumentFragment();
			rows = serverData.split('|');
			if (rows[0] == '') {
				utc = new Date().getTime();
				rows[0] = symbol + ':- none -::::::' + utc;
				}
			for (var i=rows.length-1; i>=0; i--) {
				columns = rows[i].split(':');
				tr = document.createElement("tr");
				for (var x=0; x<sequence.length; x++) {
					td = document.createElement('td');
					switch (format[x]) {
						case 1:
							utc = new Date(columns[sequence[x]] - 0);
							dayTime = utc.getMonth() + '/' + utc.getDate() + '/' + utc.getFullYear().toString().slice(2); // arghh! format the date
							dayTime += ' @ ' + utc.getHours() + ':' + ((utc.getMinutes() < 10) ? '0' + utc.getMinutes() : utc.getMinutes()) + '';
							tmp = document.createTextNode(dayTime);
							break;
						case 2:
							fmt = columns[sequence[x]];
							fmt = fmt.slice(0,1).toUpperCase() + fmt.slice(1);
							tmp = document.createTextNode(fmt);
							break;
						case 3:
							if (columns[sequence[x]] != '') {
								tmp = document.createTextNode(fxCurSym[symbol.slice(3)] + columns[sequence[x]]);
								td.setAttribute("class", "right");
								}
							break;
						default:
							tmp = document.createTextNode(columns[sequence[x]]);
							td.setAttribute("class", "right");
							break;
						}
					td.appendChild(tmp);
					tr.appendChild(td);
					}
				docfrag.appendChild(tr);
				parentController.netPosition += (columns[1] == 'buy') ? (columns[6]-0) : (columns[6] * -1);
				parentController.valuQty += (columns[1] == 'buy') ? (columns[3]-0) : (columns[3] * -1);
				}
			fxPositions.hTable.appendChild(docfrag);
			fxPositions.hValuation.innerHTML = fxCurSym[symbol.slice(3)] + parentController.netPosition.toFixed(2);		
}
function executionHistory(serverData, symbol) { // to allow a diffeent column set for execution
	var sequence = 	[7, 1, 3, 0, 4, 5, 6]; // timestamp, buy/sell, lots, symbol, quote, base amount, quote amount
	var format = 	[1, 2, 0, 0, 0, 4, 3]; // 1 = Date, 2 = initial cap, 3 = quote currency, 4 = base currency
	var container = document.getElementById('executions');
	var orderCell, utc, dayTime, tmp, fmt;
	var columns = serverData.split(':');
	var firstRow = container.insertRow(0);
	
			for (var x=0; x<sequence.length; x++) {
				orderCell = firstRow.insertCell(-1);
				switch (format[x]) {
					case 1:
						utc = new Date(columns[sequence[x]] - 0);
						dayTime = utc.getMonth() + '/' + utc.getDate() + '/' + utc.getFullYear().toString().slice(2);
						dayTime += ' @ ' + utc.getHours() + ':' + ((utc.getMinutes() < 10) ? '0' + utc.getMinutes() : utc.getMinutes()) + '';
						orderCell.innerHTML = dayTime;
						break;
					case 2:
						fmt = columns[sequence[x]]
						orderCell.innerHTML = fmt.slice(0,1).toUpperCase() + fmt.slice(1); // initial cap
						break;
					case 3:
						orderCell.innerHTML = fxCurSym[symbol.slice(3)] + columns[sequence[x]];
						orderCell.style.textAlign = "right";
						break;
					case 4:
						orderCell.innerHTML = fxCurSym[symbol.slice(0,3)] + columns[sequence[x]];
						orderCell.style.textAlign = "right";
						break;
					default:
						orderCell.innerHTML = columns[sequence[x]];
						orderCell.style.textAlign = "right";
						break;
					}
				}
			container.deleteRow(-1);
}
	
// -----------------> END WIDGET FACTORY 

/*	|-----------------------------------------------------------------------------------|
	| JavaScript for Kaazing Corp's ForEx Demo											|
	| websocket connections adapted from Richard Clark's portfolio-completed.html		|
	|-----------------------------------------------------------------------------------|
*/
var wsUrl = makeURL ('jms', 'wss');
if (location.hostname==="localhost"){
	wsUrl="ws://localhost:8000/jms";
}
var wsCtl = { //Kaazing Websocket control structure, isolate from naming conflicts via this object
	debug : 			true,
	fxDebug:			true,
	url : 				wsUrl, // e.g. ws://localhost:80/jms
	connection : 		null,
	connectionStatus :	-1,
	session : 			null,
	commandQueue :		null,
	commandProducer :	null,
	responseQueue :		null,
	responseConsumer :	null,
	firstTopic :		null,
	init :				function() {
								if (wsCtl.fxDebug) console.log('url == ' + wsCtl.url);
							var jmsConnectionFactory = new JmsConnectionFactory(wsCtl.url);
								if (wsCtl.fxDebug) console.log(jmsConnectionFactory);
							var connectionFuture = jmsConnectionFactory.createConnection('','',function() {
							  try {
								wsCtl.connection = connectionFuture.getValue();
									if (wsCtl.fxDebug) console.log(wsCtl.connection);
								wsCtl.session = wsCtl.connection.createSession(false,Session.AUTO_ACKNOWLEDGE);
									if (wsCtl.fxDebug) console.log('Set up command queue and listener');
								wsCtl.commandQueue = wsCtl.session.createQueue("/queue/command");
								wsCtl.commandProducer = wsCtl.session.createProducer(wsCtl.commandQueue);
								wsCtl.responseQueue = wsCtl.session.createTemporaryQueue();
								wsCtl.responseConsumer = wsCtl.session.createConsumer(wsCtl.responseQueue);
								wsCtl.responseConsumer.setMessageListener(onCommandResponse);
								wsCtl.connection.start(connectionResponse);
								wsCtl.connectionStatus = 1;
									if (wsCtl.fxDebug) console.log('connection started');
								// ----> Currency Quote stream
									if (wsCtl.fxDebug) console.log('Setting up currency subscription');
								var stockTopic = wsCtl.session.createTopic("/topic/currencies");   // rtw: unique for each topic consumed
								var stockConsumer = wsCtl.session.createConsumer(stockTopic);
								stockConsumer.setMessageListener(currenciesReceived);  // rtw: this topic's callback for /topic/currencies
									if (wsCtl.fxDebug) console.log('/topic/currencies subscribed');
								// ----> Market Index stream
									if (wsCtl.fxDebug) console.log('Setting up Market Index subscription');
								var indexTopic = wsCtl.session.createTopic("/topic/indices");
								var indexConsumer = wsCtl.session.createConsumer(indexTopic);
								indexConsumer.setMessageListener(indicesReceived);
									if (wsCtl.fxDebug) console.log('/topic/indices subscribed');
								// ----> Spot Price stream
									if (wsCtl.fxDebug) console.log('Setting up Spot Price subscription');
								var spotTopic = wsCtl.session.createTopic("/topic/spot_prices");
								var spotConsumer = wsCtl.session.createConsumer(spotTopic);
								spotConsumer.setMessageListener(spotPriceReceived);
									if (wsCtl.fxDebug) console.log('/topic/spot_prices subscribed');
								}
							  catch (e) {
								metricCnt.serverConnected = false;
									if (wsCtl.fxDebug) console.log(e.message);
								fxErr.popAlert(1, 4, ' (' + e.message + ')');
								document.body.style.cursor = 'default';
								}
							});
						}
};		
