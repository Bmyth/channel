'use strict';

angular.module('channel').directive('mediaelement', ['$rootScope','$compile', '$templateCache', '$sce', 'channelService', function($rootScope, $compile, $templateCache, $sce, channelService) {

    function linker(scope, element, attrs) {
        
        if(getAttr(scope.element, 'mediaType') == 'audio'){
            var audio = { src: scope.element.value, type: 'audio/ogg'};
            scope.playlist = [audio];  
            element.html($templateCache.get('media_audio_element.html'));
        }else if(getAttr(scope.element, 'mediaType') == 'video'){
            var video = { src: scope.element.value, type: 'video/mkv'};
            scope.playlist = [video];  
            element.html($templateCache.get('media_video_element.html'));
        }
        $compile(element.contents())(scope);

        scope.setAttr = function(element, key, value){
            channelService.setAttr(element, key, value);
        }

        scope.getAttr = function(element, key){
            return getAttr(element, key);
        }
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
