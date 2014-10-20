DOGEticker = {

    url: "http://rockytv.url.ph/price.txt",
	urlGrab: "http://rockytv.url.ph/grab.php",
    reloadInterval: 600000, // 10 mins in ms

    badgeBackgroundColor: [186, 159, 51, 255], // yellow
    clearBadgeTextTimeout: 10000, // 10 secs in ms

    changeTooltipText: function(text){ chrome.browserAction.setTitle({title: text}); },

    changeBadgeText: function(text){ chrome.browserAction.setBadgeText({text: parseInt(text) + ""}); },
    changeBadgeBackgroundColor: function(color){ 
        chrome.browserAction.setBadgeBackgroundColor({color: color}); 
    },

	loadPrice: function(){
		var scope = this;
		var xhr = new XMLHttpRequest();
		
		xhr.open("GET", this.urlGrab, true);
		xhr.onreadstatechange = function() {
			if ((xhr.readyState == 4) && (xhr.status == 200)) {
				scope.loadQuote();
			}
		}
	},
	
    loadQuote: function(){
        var scope = this;
        var xhr = new XMLHttpRequest();
    
        xhr.open("GET", this.url, true);
        xhr.onreadystatechange = function() {
          if ((xhr.readyState == 4) && (xhr.status == 200)) {
              var actualQuote = xhr.responseText * 100000000;
              //if (actualQuote.match(/^\d+(?:\,\d*)$/)) {
                scope.onloadQuote(actualQuote);
              //}
          }
        }
        xhr.send();
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
        window.setInterval(function(){ scope.loadPrice(); }, this.reloadInterval);
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