'use strict';

angular.module('channel', []).directive('section', ['$compile', '$templateCache', '$interpolate', '$modal', 'channelService', 'channelModelService', function($compile, $templateCache, $interpolate, $modal, channelService, channelModelService) {
    var linker = function(scope, element, attrs) {
        if(!scope.section)
            return;
        scope.divisionPick = false;
        scope.sampleDivision = _.find(scope.section.divisions, function(division){
            return getAttr(division, 'sample') == 'yes';
        })

        prepareAttrs();
        render();

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

        scope.addDivision = function(type){
            var division;
            if(type == 'sample'){
                channelService.setAttr(scope.sampleDivision, 'sample', 'no');
                division = scope.sampleDivision;
            }else if(type == 'w100'){
                division = channelModelService.generateDivision('empty', {width:'100%', widthTablet:'100%', widthMobile:'100%'});
            }else if(type == 'w50'){
                division = channelModelService.generateDivision('empty', {width:'50%', widthTablet:'50%', widthMobile:'100%'});
            }else if(type == 'w25'){
                division = channelModelService.generateDivision('empty', {width:'25%', widthTablet:'50%', widthMobile:'100%'});
            }
            channelService.addDivision(division, scope.section.sectionId).success(function(res){
                scope.section.divisions.push(res.data);
                if(type == 'sample'){
                    channelService.setAttr(scope.sampleDivision, 'sample', 'yes');
                }
                render();
            });
        }

        scope.deleteDivision = function(division){
            channelService.deleteDivision(scope.section, division.divisionId).success(function(){
                render();
            })
        }

        scope.openSectionConfigurePanel = function(){
            var modalInstance = $modal.open({
              templateUrl: 'sectionConfigureModal',
              scope: scope
            })

            scope.cancel = function(){
                modalInstance.dismiss();
            }
        }

        scope.toggleDivisionPickPanel = function(){
            scope.divisionPick = !scope.divisionPick;
        }

        scope.toggleCssEditPanel = function(){
            scope.showCssEditPanel = !scope.showCssEditPanel;
        }

        scope.toggleJsonEditPanel = function(){
            scope.showJsonEditPanel = !scope.showJsonEditPanel;
        }

        scope.cancel = function(){
            scope.inEdit = false;
        }

        function half(num){
            return parseInt(num/2) + 1;
        }

        function compileHtmlWithScope(html, childScope){
            var template = angular.element(html);
            return $compile(template)(childScope);
        }

        function prepareAttrs(){
            scope.attrs = {
                css : getAttr(scope.section, 'cssValue'),
                json : JSON.stringify(scope.section),
                title : getAttr(scope.section, 'title'), 
                width : getAttr(scope.section, 'width') == 'full' ? '100%' : '1000px',
                textAlign : getAttr(scope.section, 'textAlign') ? getAttr(scope.section, 'textAlign') : 'center',
                background : getAttr(scope.section, 'background') ? getAttr(scope.section, 'background') : '',
                carousel : getAttr(scope.section, 'carousel') == 'yes',
                carouselNumber : getAttr(scope.section, 'carouselNumber') ? getAttr(scope.section, 'carouselNumber') : 1
            };
            if(!scope.attrs.css && getAttr(scope.section, 'cssKey')){
                scope.attrs.css = scope.$eval($interpolate($templateCache.get('section_' + getAttr(scope.section, 'cssKey') + '_style.html')));
            }
            scope.attrs.css += scope.$eval($interpolate($templateCache.get('inline_section_style.html')));
        }

        function render(){
            angular.element(element).empty().html($templateCache.get('section_content.html'));
            $compile(element.contents())(scope);

            angular.element(element).find(".section-style-container").html('<style type="text/css">' + scope.attrs.css + '</style>');

            _.each(scope.section.divisions, function(division){
                if(getAttr(division, 'sample') != 'yes'){
                    var compiledEle;
                    var childScope = scope.$new(false);
                    childScope.division = division;
                    childScope.getAttr = scope.getAttr;
                    var templateHtml = '<division division="division" mode="mode" section="section"></division>';
                    compiledEle = compileHtmlWithScope(templateHtml, childScope);

                    angular.element(element).find(".divisions-container").append(compiledEle);
                }
            })

            if(scope.attrs.carousel){
                setTimeout(function () {
                    var itemNum = scope.section.divisions.length;
                    if(scope.sampleDivision)
                        itemNum--;

                    var carouselNumber = Math.min(scope.attrs.carouselNumber, itemNum);
                    var carouselNumberMobile = Math.min(half(scope.attrs.carouselNumber), itemNum);

                    var listDom = angular.element(element).find(".divisions-container");
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

        scope.syncData = function(section){
            scope.$emit('syncSection', section);
        }

        scope.saveCss = function(cssValue){
            channelService.updateAttr('section', scope.section, 'cssValue', cssValue).success(function(){
                scope.showCssEditPanel = false;
                render();
            });
        }

        scope.saveJson = function(jsonValue){
            scope.$emit('updateSection', JSON.parse(jsonValue));
        }

        scope.toggleAttr = function(attr){
            var attrValue = getAttr(scope.section, attr) == 'yes' ? 'no' : 'yes';
            channelService.updateAttr('section', scope.section, attr, attrValue).success(function(){
                scope.attrs[attr] = !scope.attrs[attr];
                prepareAttrs();
                render();
            });
        }

        scope.setAttr = function(attr, value){
            channelService.updateAttr('section', scope.section, attr, value).success(function(){
                scope.attrs[attr] = value;
                prepareAttrs();
                render();
            });
        }
    }

    return {
        restrict: "E",
        link: linker,
        scope: {
            mode:'=',
            section:'=',
            theme:'=',
            engineer:'='
        }
    };
}]);
