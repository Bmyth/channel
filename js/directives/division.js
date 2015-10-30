'use strict';

angular.module('channel').directive('division', ['$compile', '$templateCache', '$modal', '$interpolate', 'channelService', 'channelModelService', function($compile, $templateCache, $modal, $interpolate, channelService, channelModelService) {
    var linker = function(scope, element, attrs) {
        scope.elementPick = false;

        prepareAttrs();
        render();

        scope.addElement = function(type){
            var element = channelModelService.generateElement(type, {width:'100%', widthTablet:'100%', widthMobile:'100%'});

            channelService.addElement(element, scope.division.divisionId).success(function(res){
                element.elementId = res.data;
                scope.division.elements.push(element);

                var compiledEle;
                var childScope = scope.$new();
                childScope.division = scope.division;
                childScope.element = element;
                childScope.mode = scope.mode;
                
                var templateHtml = '<element element="element" division="division" mode="mode"></element>';
                compiledEle = compileHtmlWithScope(templateHtml, childScope);

                angular.element(element).find(".division-container").append(compiledEle);
            });
        }

        scope.getAttr = function(element, key){
            return channelService.getAttr(element, key);
        }

        scope.isImageElement = function(element){
            return channelModelService.isImageElement(getType(element));
        }

        scope.isTextElement = function(element){
            return channelModelService.isTextElement(getType(element));
        }

        scope.isHtmlElement = function(element){
            return channelModelService.isHtmlElement(getType(element));
        }

        function compileHtmlWithScope(html, childScope){
            var template = angular.element(html);
            return $compile(template)(childScope);
        }

        function render(){
            $(element).html($templateCache.get('division.html'));
            $compile(element.contents())(scope);

            var compiledEle = $compile($templateCache.get('general_division.html'))(scope);
            $(compiledEle).appendTo($(element).find(".americano-division"));

            $(element).find(".style-container").html('<style type="text/css">' + scope.divisionAttrs.css + '</style>');

            if(scope.divisionAttrs.carousel){
                setTimeout(function () {
                    var itemNum = scope.division.elements.length;
                    var carouselNumber = Math.min(scope.divisionAttrs.carouselNumber, itemNum);
                    var carouselNumberMobile = Math.min(half(scope.divisionAttrs.carouselNumber), itemNum);

                    var listDom = angular.element(element).find(".division-container");
                    $(listDom).addClass('carousel').attr('carouselNumber', carouselNumber).attr('carouselNumberMobile', carouselNumberMobile);

                    if(scope.mode != 'publish'){
                        $(listDom).owlCarousel({
                            slideSpeed : 750,
                            itemsCustom : [
                                [320,  carouselNumberMobile],
                                [768,  carouselNumber]
                            ],
                            scrollPerPage : true,
                            navigation: true,
                            pagination: true,
                            lazyLoad : true,
                            navigationText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
                            responsiveRefreshRate : 200
                        }); 
                    }
                }, 0)
            }
        }

        function prepareAttrs(){
            scope.divisionAttrs = {
                title : getAttr(scope.division, 'title'),
                textAlign : getAttr(scope.division, 'textAlign') ? getAttr(scope.division, 'textAlign') : 'center',
                background : getAttr(scope.division, 'background') ? getAttr(scope.division, 'background') : '',
                carousel : getAttr(scope.division, 'carousel') == 'yes',
                carouselNumber : getAttr(scope.division, 'carouselNumber') ? getAttr(scope.division, 'carouselNumber') : 1
            }

            scope.divisionAttrs.width = getAttr(scope.division, 'width') ? getAttr(scope.division, 'width') : '100%';
            scope.divisionAttrs.widthTablet = getAttr(scope.division, 'widthTablet') ? getAttr(scope.division, 'widthTablet') : scope.divisionAttrs.width;
            scope.divisionAttrs.widthMobile = getAttr(scope.division, 'widthMobile') ? getAttr(scope.division, 'widthMobile') : scope.divisionAttrs.widthTablet;
            scope.divisionAttrs.css = scope.$eval($interpolate($templateCache.get('inline_division_style.html')));
        }

        function half(num){
            return parseInt(num/2) + 1;
        }

        function getAttr (element, key){
            return channelService.getAttr(element, key);
        }

        scope.edit = function(){
            var modalInstance = $modal.open({
              templateUrl: 'divisionConfigureModal',
              scope: scope
            })
        }

        scope.toggleDivisionAttr = function(attr, $event){
            var attrValue = getAttr(scope.division, attr) == 'yes' ? 'no' : 'yes';
            channelService.updateAttr('division', scope.division, attr, attrValue).success(function(){
                scope.divisionAttrs[attr] = !scope.divisionAttrs[attr];
                scope.divisionAttrs.css = scope.$eval($interpolate($templateCache.get('inline_division_style.html')));
                render();
                if($event){
                    notifySuccess('更新成功', $event.target)
                }
            });
        }

        scope.setDivisionAttr = function(attr, value, $event){
            var value = value + "";
            channelService.updateAttr('division', scope.division, attr, value).success(function(){
                scope.divisionAttrs[attr] = value;
                scope.divisionAttrs.css = scope.$eval($interpolate($templateCache.get('inline_division_style.html')));
                render();
                if($event){
                    notifySuccess('更新成功', $event.target)
                }
            });
        }

        scope.toggleElementPickPanel = function(){
            scope.elementPick = !scope.elementPick;
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
        scope: true
    };
}]);
