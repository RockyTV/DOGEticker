DOGEticker = {

    url: "http://pubapi.cryptsy.com/api.php?method=singlemarketdata&marketid=132",
    reloadInterval: 300000, // 5 mins in ms

    badgeBackgroundColor: [186, 159, 51, 255], // brown
    clearBadgeTextTimeout: 10000, // 10 secs in ms

    changeTooltipText: function(text){ chrome.browserAction.setTitle({title: text}); },

    changeBadgeText: function(text){ chrome.browserAction.setBadgeText({text: parseInt(text) + ""}); },
    changeBadgeBackgroundColor: function(color){ 
        chrome.browserAction.setBadgeBackgroundColor({color: color}); 
    },
	
    loadQuote: function(){
        var scope = this;
		
		$.getJSON(this.url, function(data){
			var lastPrice = data['return']['markets']['DOGE']['lasttradeprice'] * 100000000;
			scope.onloadQuote(lastPrice);
		});
    },

    onloadQuote: function(actualQuote){
        var tooltipText = "1 dogecoin is worth " + actualQuote + " satoshi today";
        this.changeTooltipText(tooltipText);
        this.changeBadgeText(actualQuote);
    },

    attachBehaviors: function(){
        var scope = this;
        chrome.browserAction.onClicked.addListener(function() {
            window.open("https://www.cryptsy.com/markets/view/DOGE_BTC");
            scope.trackEvent("BrowserIcon", "click");
        });
    },

    startReloadInterval: function(){
        var scope = this;
        window.setInterval(function(){ scope.loadQuote(); }, this.reloadInterval);
    },
    
    trackEvent: function(category, action){
        _gaq.push(['_trackEvent', category, action]);
    },

    init: function(){
        this.changeBadgeBackgroundColor(this.badgeBackgroundColor);
        this.attachBehaviors();
		
        this.loadQuote();
        this.startReloadInterval();
    }
};

DOGEticker.init();