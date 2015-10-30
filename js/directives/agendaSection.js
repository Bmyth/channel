'use strict';

angular.module('channel').directive('agendasection', ['$compile', '$templateCache', 'channelService', 'channelSyncService', function($compile, $templateCache, channelService, channelSyncService) {
    var linker = function(scope, element, attrs) {
        channelSyncService.adaptAgenda(function(section){
            var navs = _.sortBy(section.owlCarousel.nav, function(nav){
                return nav.idx;
            })
            _.each(navs, function(nav){
                var childScope = scope.$new();
                childScope.nav = nav;
                var compiledEle = compileHtmlWithScope($templateCache.get('agenda_nav.html'), childScope);
                angular.element(element).find(".agenda-content .owl-nav-slider").append(compiledEle);
            })
            
            var conents = _.sortBy(section.owlCarousel.content, function(content){
                return content.idx;
            })
            _.each(conents, function(content){
                var childScope = scope.$new();
                childScope.content = content;
                var compiledEle = compileHtmlWithScope($templateCache.get('agenda_content.html'), childScope);
                angular.element(element).find(".agenda-content .owl-content-slider").append(compiledEle);
            })
            
            if(scope.mode != 'publish'){
                owlSlide(element);
            }
        });

        scope.getAttr = function(element, key){
            return channelService.getAttr(element, key);
        }

        scope.getThumbnail = function(element){
            var img = channelService.getAttr(element, 'avatar');
            if (img.indexOf("imageMogr2/thumbnail") < 0 && img.indexOf("qiniu") > 0) {
              img = img + "?imageMogr2/thumbnail/" + 200;
            }
            return img;
        }

        function compileHtmlWithScope(html, childScope){
            var template = angular.element(html);
            return $compile(template)(childScope);
        }

        function owlSlide(element){
            var content = $(element).find(".owl-content-slider");
            content.owlCarousel({
                singleItem : true,
                slideSpeed : 1000,
                navigation: false,
                pagination: true,
                // afterAction : syncPosition,
                responsiveRefreshRate : 200,
            });

            var nav = $(element).find(".owl-nav-slider");

            var itemNum = $(nav).find(".nav-item").length;
            var itemsMobileNum = itemNum > 2 ? 3 : itemNum;
            nav.owlCarousel({
                items : itemNum,
                itemsDesktop      : [1199, itemNum],
                itemsDesktopSmall     : [979, itemNum],
                itemsTablet       : [768, itemsMobileNum],
                itemsMobile       : [479, 1],
                pagination: false,
                responsiveRefreshRate : 200,
                afterInit : function(el){
                  el.find(".owl-item").eq(0).addClass("synced");
                }
            });
        }
    }

    return {
        restrict: "E",
        template: '<div class="agenda-content"><div class="owl-nav-slider"></div><div class="owl-content-slider"></div></div>',
        transclude: true,
        link: linker,
        scope: {
            section : '=',
            mode : '='
        }
    };
}]);
