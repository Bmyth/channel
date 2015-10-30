'use strict';

angular.module('channel').directive('imageelement', ['$rootScope','$compile', '$templateCache', 'channelService', function($rootScope, $compile, $templateCache, channelService) {

    function linker(scope, element, attrs) {
        element.html($templateCache.get('image_element.html'));
        $compile(element.contents())(scope);

        scope.getSrcUri = function(element){
            if(!channelService.getAttr(element, 'thumbnailWidth')){
                return element.value;
            }
            
            var img = element.value;
            if (img.indexOf("imageMogr2/thumbnail") < 0 && img.indexOf("qiniu") > 0) {
              img = img + "?imageMogr2/thumbnail/" + channelService.getAttr(element, 'thumbnailWidth');
            }
            return img;
        }

        scope.isDetetable = function(element){
            return channelService.getAttr(element, 'deletable') != 'no';
        }

        scope.getLink = function(element){
            return channelService.getAttr(element, 'linkUrl');
        }

        scope.setAttr = function(element, key, value){
            channelService.setAttr(element, key, value);
        }

        scope.getAttr = function(element, key){
            return channelService.getAttr(element, key);
        }
    }

    function getType(content){
        var attr = _.find(content.attributes, function(attribute){
            return attribute.key = "type";
        });
        return attr ? attr.value : "";
    }

    function getLink(element){
        return channelService.getAttr(element, 'linkUrl');
    }

    return {
        restrict: "E",
        link: linker,
        scope: {
            element:'=',
            division:'=',
            mode:'='
        }
    };
}]);
