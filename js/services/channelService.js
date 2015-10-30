"use strict";
angular.module('channel')
    .service('channelService', ['$http', '$window', '$location', '$routeParams', '$templateCache', '$compile', 'channelModelService', function ($http, $window, $location, $routeParams, $templateCache, $compile, channelModelService) {

    var baseURL = window.channelConstant.baseUrl;
    this.americanoVersion = "2.2";

    this.renderSection = function(section, index, scope, mode, container, theme, engineer){
        var templateHtml = $templateCache.get(channelModelService.getSectionTemplte(section));
        var childScope = scope.$new(false);
        childScope.section = section;
        childScope.engineer = engineer;
        childScope.sectionIndex = index;
        childScope.theme = theme;
        childScope.mode = mode;
        childScope.getAttr =  getAttr;
        if(getAttr(section, 'displayTitle') != 'no' && getAttr(section, 'head') != 'yes'){
            childScope.titleElement = titleElement(section);
        }

        $(container).append(compileHtmlWithScope(templateHtml, childScope))
    }

    this.getEventChannelsInfo = function (eventId) {
        return $http.get(baseURL + '/channel/eventChannelsInfo/' + eventId, {
            withCredentials: true,
            params: {}
        });
    }

    this.getChannel = function (channelId) {
        return $http.get(baseURL + '/channel/' + channelId, {
            withCredentials: true,
            params: {}
        });
    }

    this.createEventChannel = function (eventId, channel) {
        return $http.post(baseURL + '/channel/addChannelToEvent/' + eventId, channel);
    };

    this.deleteEventChannel = function (eventId, channelId) {
        return $http.post(baseURL + '/channel/deleteChannelFromEvent/' + eventId + '/' + channelId, {
            withCredentials: true,
            params: {}
        });
    };

    this.getPublicSectionChannel = function (eventId){
        return $http.get(baseURL + '/channel/eventChannel/' + eventId, {
            withCredentials: true,
            params: {
                type: "publicSectionChannel"
            }
        });
    }

    this.getBackpackChannel = function (eventId){
        return $http.get(baseURL + '/channel/eventChannel/' + eventId, {
            withCredentials: true,
            params: {
                type: "backpackChannel"
            }
        });
    }

    this.getEventChannels = function (eventId) {
        return $http.get(baseURL + '/channel/eventChannels/' + eventId, {
            withCredentials: true,
            params: {
                type : "channel"
            }
        });
    };

    this.getEventChannelsByType = function (eventId, type) {
        return $http.get(baseURL + '/channel/eventChannels/' + eventId, {
            withCredentials: true,
            params: {
                type : type
            }
        });
    };

    this.addSection = function(section, channelId){
        return $http.post(baseURL + '/channel/' + channelId + '/section/add', section);
    }

    this.deleteSection = function(sectionId){
        return $http.post(baseURL + '/channel/section/' + sectionId + '/delete/', {
            withCredentials: true,
            params: {}
        });
    }

    this.addDivision = function(division, sectionId){
        return $http.post(baseURL + '/channel/section/' + sectionId + '/addDivision', division);
    }

    this.deleteDivision = function(section, divisionId){
        this.deleteDivisionLocal(section, divisionId);
        return this.deleteDivisionApi(section, divisionId);
    }

    this.deleteDivisionLocal = function(section, divisionId){
        section.divisions = _.without(section.divisions, _.findWhere(section.divisions, {divisionId: divisionId}));
    }

    this.deleteDivisionApi = function(section, divisionId){
        return $http.post(baseURL + '/channel/division/' + divisionId + '/delete/', {
            withCredentials: true,
            params: {}
        });
    }

    this.updateAttr = function(elementType, element, key, value){
        updateElementAttr(element, key, value);
        return this.updateAttrApi(elementType, element, key, value);
    }

    this.updateAttrLocal = function(element, key, value){
        updateElementAttr(element, key, value);
    }

    this.updateAttrApi = function(elementType, element, key, value){
        if(elementType == 'channel'){
            return $http.post(baseURL + '/channel/' + element.channelId + '/attrUpdate', {key : key,value : value});
        }else if(elementType == 'section'){
            return this.updateElementsAttr(elementType, [element.sectionId], [{key : key,value : value}]);
        }else if(elementType == 'division'){
            return this.updateElementsAttr(elementType, [element.divisionId], [{key : key,value : value}]);
        }else if(elementType == 'element'){
            return this.updateElementsAttr(elementType, [element.elementId], [{key : key,value : value}]);
        }
    }

    this.updateChannelAttr = function(channelId, key, value){
        return $http.post(baseURL + '/channel/' + channelId + '/attrUpdate', {
            key : key,
            value : value
        });
    }

    this.updateElementsAttr = function(elementType, idList, attrList){
        var param = {
            elementType : elementType,
            idList : idList,
            attrList : attrList
        }
        return $http.post(baseURL + '/channel/updateElementsAttr/', param);
    }

    this.addElement = function(element, divisionId){
        return $http.post(baseURL + '/channel/division/' + divisionId + '/addElement', element);
    }

    this.updateElement = function(element){
        return $http.post(baseURL + '/channel/element/update/' +  element.elementId, {
            key : element.key,
            value : element.value
        });
    }

    this.deleteElement = function(division, elementId){
        division.elements = _.without(division.elements, _.findWhere(division.elements, {elementId: elementId}));
        return $http.post(baseURL + '/channel/element/' + elementId + '/delete', {
            withCredentials: true,
            params: {}
        });
    }

    function updateElementAttr(element, key, value){
        var t = _.find(element.attributes, function(attr){
            return attr.key == key;
        })
        if(t){
            t.value = value;
        }else{
            element.attributes.push({key:key, value:value});
        }
    }

    this.setAttr = function(element, key, value){
        updateElementAttr(element, key, value);
    }

    this.getAttr = function(element, key){
        var attr = _.find(element.attributes, function(attr){
            return attr.key == key;
        })
        if(attr){
            return attr.value;
        }else{
            return "";
        }
    }

    function titleElement(section){
        var params = {
            value : getAttr(section, 'title') ? getAttr(section, 'title') : "",
            sectionId : section.sectionId
        }
        var ele = channelModelService.generateElement('sectionTitle', params);
        return ele;
    }

    function compileHtmlWithScope(html, childScope){
        var template = angular.element(html);
        return $compile(template)(childScope);
    }

}]);