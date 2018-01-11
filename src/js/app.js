var Constants = require("constants");
var Grid = require("ui2/grid");
var Retriever = require("retriever");
var Settings = require("settings");
var Theme = require("theme");
var UI = require("ui");
var Utility = require("utility");
var Vector2 = require("vector2");
var WindowUtils = require('ui2/windowUtils');

var fullscreen = true;
var currentIndex, prevIndex = 0;

var buildBasaltMenu = function() {
  var gridItems = [];
  gridItems.push(
    { helpbarText: "Hours", icon: "images/Hours-24.png" }, 
    { helpbarText: "Ride", icon: "images/Ride-24.png" }, 
    { helpbarText: "Dine", icon: "images/Dine-24.png" }, 
    { helpbarText: "Top Wait Times", icon: "images/TopAttractions-24.png" },  
    { helpbarText: "Weather", icon: "images/Weather-24.png" }, 
    { helpbarText: "What's Near Me?", icon: "images/Marker-24.png" }
  );
  
  var helpbar = new UI.Text({
    text: "WDWNT Now!",
    backgroundColor: Theme.HelpbarBackgroundColor,
    font: "GOTHIC_14",
    position: new Vector2(0, WindowUtils.getWindowHeight(fullscreen) - 20),
    size: new Vector2(WindowUtils.getWindowWidth(fullscreen), 20)
  });
  
  var grid = new Grid({
    fullscreen: fullscreen,
    itemsPerRow: 3,
    backgroundColor: Theme.GridBackgroundColor,
    borderSpacing: 1,
    itemDefaultStyle: {
      titleColor: Theme.GridItemTitle,
      backgroundColor: Theme.GridItemBackgroundColor,
      highlightBackgroundColor: Theme.GridItemHighlightBackgroundColor,
      borderWidth: 0
    },
    items: gridItems
  });
  
  var updateHelpbar = function() {
    helpbar.text(gridItems[currentIndex].helpbarText || "");
  };
  
  grid.on("highlight", function(e) {
    prevIndex = currentIndex;
    currentIndex = e.itemIndex;
    updateHelpbar();
  });
  
  grid.on("select", function(e) {
    if (currentIndex === 0) {
      Retriever.getParkHours();
    } else if (currentIndex === 1) {
      Retriever.getRideList();
    } else if (currentIndex === 2) {
      Retriever.getDineList();
    } else if (currentIndex === 3) {
      Retriever.getTopWaitTimes();
    } else if (currentIndex === 4) {
      Retriever.getWeather();
    } else if (currentIndex === 5) {
      Retriever.getCurrentPositionForWhatsNearMe();
    }
  });
  
  grid.add(helpbar);
  grid.show();
};

var buildApliteMenu = function() {
  var items = [];
  items.push(
    { title: "Hours" }, 
    { title: "Ride" }, 
    { title: "Dine" }, 
    { title: "Top Wait Times" },  
    { title: "Weather" }, 
    { title: "What's Near Me?" }
  );
  
  var mainMenu = new UI.Menu({
    sections: [{
      title: "WDWNT Now!",
      items: items
    }]
  });

  mainMenu.on("select", function(e) {
    if (e.itemIndex === 0) {
      Retriever.getParkHours();
    } else if (e.itemIndex === 1) {
      Retriever.getRideList();
    } else if (e.itemIndex === 2) {
      Retriever.getDineList();
    } else if (e.itemIndex === 3) {
      Retriever.getTopWaitTimes();
    } else if (e.itemIndex === 4) {
      Retriever.getWeather();
    } else if (e.itemIndex === 5) {
      Retriever.getCurrentPositionForWhatsNearMe();
    }
  });

  mainMenu.show();
};

if (Utility.isBasalt()) {
  buildBasaltMenu();
} else {
  buildApliteMenu();
}

if (Pebble.getTimelineToken) {
  Pebble.getTimelineToken(
    function(token) {
        Settings.config(
          { url: Constants.ApiBaseUrl + Constants.ApiUrls.Config + token },
          function(e) {
            Settings.option("userid", e.options.userid);
            Settings.option("apiaccesstoken", e.options.apiaccesstoken);
          }
        );
      },
      function(error) {
        console.log("Error getting timeline token: " + error);
      }
  );
}