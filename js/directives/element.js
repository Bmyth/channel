'use strict';

angular.module('channel').directive('element', ['$compile', '$templateCache', '$modal', '$interpolate', 'channelService', 'channelModelService', 'channelUtilService', function($compile, $templateCache, $modal, $interpolate, channelService, channelModelService, channelUtilService) {

    var linker = function(scope, element, attrs) {
        init();

        function init(){
            scope.template = '';
        
            scope.attrs = {
                value : scope.element.value,
                linkUrl : getAttr(scope.element, 'linkUrl'),
                type : getAttr(scope.element, 'type'),
                category : getAttr(scope.element, 'category'),
                title : getAttr(scope.element, 'title'),
                mediaType : getAttr(scope.element, 'mediaType')
            };

            scope.attrs.textAlign = getAttr(scope.element, 'textAlign') ? getAttr(scope.element, 'textAlign') : 'center';
            scope.attrs.color = getAttr(scope.element, 'color') ? getAttr(scope.element, 'color') : '';
            scope.attrs.fontSize = getAttr(scope.element, 'fontSize') ? getAttr(scope.element, 'fontSize') : '1em';
            scope.attrs.width = getAttr(scope.element, 'width') ? getAttr(scope.element, 'width') : '100%';
            scope.attrs.widthTablet = getAttr(scope.element, 'widthTablet') ? getAttr(scope.element, 'widthTablet') : scope.attrs.width;
            scope.attrs.widthMobile = getAttr(scope.element, 'widthMobile') ? getAttr(scope.element, 'widthMobile') : scope.attrs.widthTablet;
            scope.attrs.background =  getAttr(scope.element, 'background') ? getAttr(scope.element, 'background') : '',
            scope.attrs.css = scope.$eval($interpolate($templateCache.get('inline_element_style.html')));

            var type = channelService.getAttr(scope.element, 'type');
            if(channelModelService.isImageElement(type)){
                scope.elementType = 'image';
                scope.template  = "<imageElement element='element' division='division' mode='mode' idx='idx'></imageElement>";
            }else if(channelModelService.isTextElement(type)){
                scope.elementType = 'text';
                scope.template  = "<textElement element='element' division='division' mode='mode' idx='idx'></textElement>";
            }else if(channelModelService.isHtmlElement(type)){
                scope.elementType = 'html';
                scope.template  = "<htmlElement element='element' division='division' mode='mode' idx='idx'></htmlElement>";
            }else if(channelModelService.isPersonElement(type)){
                scope.elementType = 'person';
                scope.template  = $templateCache.get('person_element.html');
            }else if(type == 'richtext'){
                scope.elementType = 'richtext';
                scope.template  = "<htmlElement element='element' division='division' mode='mode' idx='idx'></htmlElement>";
            }else if(type == 'media'){
                scope.elementType = 'media';
                scope.template  = "<mediaElement element='element' division='division' mode='mode' idx='idx'></mediaElement>";
            }

            render();
        }

        function render(){
            scope.editMode = scope.mode == 'edit';
            $(element).empty().html($templateCache.get('element_container.html'));
            $compile(element.contents())(scope);

            var compiledEle = $compile(scope.template)(scope);
            $(compiledEle).appendTo($(element).find(".americano-element"));

            $(element).find(".style-container").html('<style type="text/css">' + scope.attrs.css + '</style>');
        }

        scope.setValue = function(url, $event){
            channelService.updateElement(scope.element).success(function(){
                if($event){
                    notifySuccess('更新成功', $event.target);
                }
                scope.element.value = url;
                init();
            });
        }

        scope.setAttr = function(attr, value, $event){
            channelService.updateAttr('element', scope.element, attr, value).success(function(){
                if($event){
                    notifySuccess('更新成功', $event.target)
                }
                init();
            });
        }

        scope.getAttr = function(element, attr){
            return getAttr(element, attr);
        }

        scope.edit = function(){
            if(channelModelService.isImageElement(getAttr(scope.element, 'type'))){
                initImageUpload();
            }else if(getAttr(scope.element, 'type') == 'media'){
                initMediaUpload();
            }
            var modalTemplate = 'elementEditModal';
            var modalInstance = $modal.open({
                templateUrl: modalTemplate,
                scope: scope
            })
        }

        scope.delete = function(element){
            channelService.deleteElement(scope.division, element.elementId).success(function(){
            })
        }

        scope.getThumbnail = function(element){
            var img = channelService.getAttr(element, 'avatar');
            if (img.indexOf("imageMogr2/thumbnail") < 0 && img.indexOf("qiniu") > 0) {
              img = img + "?imageMogr2/thumbnail/" + 200;
            }
            return img;
        }

        function initImageUpload() {
            channelUtilService.initUpload([
                {
                    btn: 'image-upload',
                    container: 'image-sample-container',
                    progress: function (percent) {
                        scope.notifyMsg = "上传中.." + percent;
                    },
                    success: function (url) {
                        scope.notifyMsg = "";
                        scope.setValue(url)
                    },
                    error: function (e) {}
                }
            ], function (errorMessage) {});
        }

        function initMediaUpload() {
            channelUtilService.initUpload([
                {
                    btn: 'media-upload',
                    container: 'media-sample-container',
                    progress: function (percent) {
                        scope.notifyMsg = "上传中.." + percent;
                    },
                    success: function (url) {
                        scope.notifyMsg = "";
                        scope.setValue(url)
                    },
                    error: function (e) {}
                }
            ], function (errorMessage) {});
        }

        function notifySuccess(msg, element, direction){
            var template = "<span class='notify-cloud'><i class='fa fa-heart-o'></i>" + msg + "</span>";
            var notify = $(template).appendTo($(element));
            notify.fadeIn('normal', function(){
                notify.fadeOut(1000, function(){
                    notify.remove();
                });
            });
        }
    }

    return {
        restrict: "E",
        link: linker,
        scope: {
            division: '=',
            element:'=',
            mode:'=',
            idx:'='
        }
    };
}]);
