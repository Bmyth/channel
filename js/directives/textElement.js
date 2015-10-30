'use strict';

angular.module('channel').directive('textelement', ['$rootScope','$compile', '$templateCache', 'channelService', 'channelUtilService', function($rootScope, $compile, $templateCache, channelService, channelUtilService) {

    function linker(scope, element, attrs) {
        scope.inEdit = false;
        scope.editMode = scope.mode == 'edit';
        scope.editable = channelService.getAttr(scope.element, 'editable') != 'no';
        element.html($templateCache.get('text_element.html'));
        $compile(element.contents())(scope);

        scope.edit = function(element, $event){
            scope.inEdit = true;
            scope.oldValue = element;
            if(scope.getType(element) == 'linkText'){
                scope.element.linkUrl = scope.getLink(element);
            }
            
            var offset = $($event.target).closest(".americano-element").offset();
            var editTemplate = scope.getType(element) != 'richText' ? "text_editor.html" : "richtext_editor.html";
            var editor = $compile($templateCache.get(editTemplate))(scope);
            $(editor).css({'top':(offset.top - 5), 'left':(offset.left - 5)}).appendTo($('body'));
        }

        scope.update = function(element){
            channelService.updateElement(element).success(function(){
                var param = prepareAttrParam(element);
                channelService.updateElementsAttr('element', param.ids, param.attrs).success(function(res){
                    scope.inEdit = false;
                    $(".text-editor-container").remove();
                })
            })
        }

        scope.text = function(element){
            if(channelService.getAttr(element, 'channelAttrSync')){
                return syncChannelAttr(channelService.getAttr(element, 'channelAttrSync'));
            }else if(channelService.getAttr(element, 'sectionAttrSync')){
                return element.value;
            }else{
                return element.value;
            }

            function syncChannelAttr (key){
                var attr = _.find(channelUtilService.getItem('pageChannel').attributes, function(attr){
                    return attr.key == key;
                })
                return attr ? attr.value : "";
            }
        }

        scope.cancel = function($event){
            scope.inEdit = false;
            scope.element = scope.oldValue;
            $($event.target).closest(".text-editor-container").remove();
        }

        scope.delete = function(element, $event){
            channelService.deleteElement(scope.division, element.elementId).success(function(){
                scope.inEdit = false;
                $($event.target).closest(".text-editor-container").remove();
            })
        }

        scope.isDetetable = function(element){
            return channelService.getAttr(element, 'deletable') != 'no';
        }

        scope.getLink = function(element){
            return channelService.getAttr(element, 'linkUrl');
        }

        scope.getAlign = function(element){
            if(channelService.getAttr(element, 'align')){
              return channelService.getAttr(element, 'align')  
            }else{
                channelService.setAttr(element, 'align', 'center');
                return "center";
            }
        }

        scope.getType = function(element){
            return channelService.getAttr(element, 'type');
        }

        scope.setAttr = function(element, key, value){
            channelService.setAttr(element, key, value);
        }

        scope.getAttr = function(element, key){
            return channelService.getAttr(element, key);
        }

        scope.elementTypeClass = function(element){
            if(scope.getType(element) == 'sectionTitle'){
                return 'americano-title-element';
            }else if(scope.getType(element) == 'text'){
                return 'americano-text-element';
            }else if(scope.getType(element) == 'linkText'){
                return 'americano-link-text-element';
            }else if(scope.getType(element) == 'itemTitle'){
                return 'americano-item-title-element';
            }else if(scope.getType(element) == 'description'){
                return 'americano-description-text-element';
            }else if(scope.getType(element) == 'richText'){
                return 'americano-rich-text-element';
            }
        }

        function prepareAttrParam(element){
            var ids = [];
            var attrs = [];
            if(getType(element) == 'linkText'){
                channelService.setAttr(element, 'linkUrl', element.linkUrl);
            }
            _.each(element.attributes, function(attr){
                attrs.push({key:attr.key, value: attr.value});
                ids.push(element.elementId);
            })
            return {
                attrs : attrs,
                ids : ids
            }
        }
    }

    function getType(content){
        var attr = _.find(content.attributes, function(attribute){
            return attribute.key = "type";
        });
        return attr ? attr.value : "";
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
