"use strict";
angular.module('channel')
    .service('channelThemeService', ['channelService', function (channelService) {

    this.getTheme = function (themeCat) {
        var theme = _.find(colorIndex, function(ci){
            return ci.name == themeCat;
        })
        if(!theme){
            theme = colorIndex[0];
        }
        return theme;
    }

    this.getChannelTheme = function(channel) {
        return {
            mainColor : getAttr(channel, 'theme_mainColor') ? channelService.getAttr(channel, 'theme_mainColor') : "#666",
            mainContrastColor : getAttr(channel, 'theme_mainContrastColor') ? channelService.getAttr(channel, 'theme_mainContrastColor') : "#fff",
            secondColor : getAttr(channel, 'theme_secondColor') ? channelService.getAttr(channel, 'theme_secondColor') : "#eee",
            secondContrastColor : getAttr(channel, 'theme_secondContrastColor') ? channelService.getAttr(channel, 'theme_secondContrastColor') : "#666",
            sectionGeneralBackColor1 : getAttr(channel, 'theme_sectionGeneralBackColor1') ? channelService.getAttr(channel, 'theme_sectionGeneralBackColor1') : "#fff",
            sectionGeneralBackColor2 : getAttr(channel, 'theme_sectionGeneralBackColor2') ? channelService.getAttr(channel, 'theme_sectionGeneralBackColor2') : "#fff",
            footerBackgroundColor : getAttr(channel, 'theme_footerBackgroundColor') ? channelService.getAttr(channel, 'theme_footerBackgroundColor') : "#fff",
            footerFontColor : getAttr(channel, 'theme_footerFontColor') ? channelService.getAttr(channel, 'theme_footerFontColor') : "#666"
        }
    }
    
    var colorIndex = [
        {
            name: "blue",
            mainColor: "#455583",
            mainContrastColor: "#fff",
            secondColor: "#eee",
            secondContrastColor: "#666"
        },{
            name: "dark-blue",
            mainColor: "#155086",
            mainContrastColor: "#fff",
            secondColor: "#eee",
            secondContrastColor: "#666"
        },{
            name: "dark-red",
            mainColor: "#8c0b08",
            mainContrastColor: "#fff",
            secondColor: "#eee",
            secondContrastColor: "#666"
        },{
            name: "dark-yellow",
            mainColor: "#8c0b08",
            mainContrastColor: "#fff",
            secondColor: "#eee",
            secondContrastColor: "#666"
        },{
            name: "green",
            mainColor: "#4b9636",
            mainContrastColor: "#fff",
            secondColor: "#eee",
            secondContrastColor: "#666"
        },{
            name: "light-blue",
            mainColor: "#8c0b08",
            mainContrastColor: "#fff",
            secondColor: "#eee",
            secondContrastColor: "#666"
        },{
            name: "light-green",
            mainColor: "#54b14e",
            mainContrastColor: "#fff",
            secondColor: "#eee",
            secondContrastColor: "#666"
        },{
            name: "orange",
            mainColor: "#cf9418",
            mainContrastColor: "#fff",
            secondColor: "#eee",
            secondContrastColor: "#666"
        },{
            name: "pink",
            mainColor: "#dc4582",
            mainContrastColor: "#fff",
            secondColor: "#eee",
            secondContrastColor: "#666"
        },{
            name: "red",
            mainColor: "#c1222e",
            mainContrastColor: "#fff",
            secondColor: "#eee",
            secondContrastColor: "#666"
        },{
            name: "yellow",
            mainColor: "#f38b1f",
            mainContrastColor: "#fff",
            secondColor: "#eee",
            secondContrastColor: "#666"
        }];
}]);