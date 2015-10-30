'use strict';

angular.module('channel').directive('htmlelement', ['$rootScope','$compile', '$templateCache', '$sce', 'channelService', function($rootScope, $compile, $templateCache, $sce, channelService) {

    function linker(scope, element, attrs) {
        scope.html = $sce.trustAsHtml(scope.element.value);
        element.html($templateCache.get('html_element.html'));
        $compile(element.contents())(scope);

        scope.getAttr = function(element, key){
            return channelService.getAttr(element, key);
        }
    }

    return {
        restrict: "E",
        link: linker,
        scope: {
            element:'=',
            division:'=',
            mode:'=',
            idx:'='
        }
    };
}]);
