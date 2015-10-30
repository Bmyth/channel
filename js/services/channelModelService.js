"use strict";
angular.module('channel')
    .service('channelModelService', ['channelSampleDataService', function (channelSampleDataService) {

    this.generateChannel = function (type, params) {
        return {
            eventId : params.eventId,
            sections : [{
                attributes: [
                {
                    key : "head",
                    value : "yes"
                }]
            }],
            attributes : [{
                key : "type",
                value : type
            },{
                key : "eventId",
                value : params.eventId
            },{
                key : "americanoVersion",
                value : '2.2'
            }]
        }
    }

    this.generateSection = function (category) {
        var that = this;

        var sectionParams = channelSampleDataService.sectionAttrs(category);
        var section = newSection(sectionParams);
        if(sectionParams.sampleDivision){
            var division = sectionParams.sampleDivision();
            setAttr(division, 'sample', 'yes');
            section.divisions.push(division);
            for(var i = 0; i < sectionParams.sampleDivisionRepeat; i++){
                section.divisions.push(sectionParams.sampleDivision());
            }
        }
        return section;
    };

    this.generateDivision = function (category, params) {
        if(category == 'ticket'){
            var division = {
                attributes: [{
                    key : 'deletable', value : 'no'
                },{
                    key : 'editable', value : 'no'
                },{
                    key : 'width', value : '24.5%'
                },{
                    key : 'widthTablet', value : '49.5%'
                },{
                    key : 'widthMobile', value : '100%'
                }],
                elements : []
            }
            division.elements.push(htmlElement({
                value : params.html,
                attributes : [
                {
                    key : 'editable', value :'no'
                },
                {
                    key : 'deletable', value :'no'
                },
                {
                    key : 'width', value : '200px'
                }]
            }))
            return division;
        }else if(category == 'speakers'){
            return {
                attributes: [{
                    key : 'deletable', value : 'no'
                },{
                    key : 'insertNew', value : 'no'
                },{
                    key : 'carousel', value : 'yes'
                },{
                    key : 'carouselNumber', value : '5'
                }],
                elements : []
            }
        }else if(category == 'organizations'){
            return {
                attributes: [{
                    key : 'deletable', value : 'no'
                },{
                    key : 'editable', value : 'no'
                },{
                    key: 'hideWhenEmpty', 
                    value:'yes'
                }],
                elements : []
            }
        }else if(category == 'empty'){
            return {
                attributes: [{
                    key : 'width', value : params.width
                },{
                    key : 'widthTablet', value : params.widthTablet
                },{
                    key : 'widthMobile', value : params.widthMobile
                }],
                elements : []
            }
        }
    }

    this.generateElement = function (type, params) {
        if(type == 'text'){
            return textElement(params);
        }else if(type == 'image'){
            return imageElement(params);
        }else if(type == 'text'){
            return textElement(params);
        }else if(type == 'sectionTitle'){
            return sectionTitleElement(params);
        }else if(type == 'logo'){
            return imageElement(channelSampleDataService.elementParams('logo'));
        }else if(type == 'richtext'){
            return richTextElement()
        }else if(type == 'html'){
            return htmlElement()
        }else if(type == 'media'){
            return mediaElement()
        }
    }

    this.getSectionTemplte = function(section){
        if(getAttr(section, 'eventSyncKey') == 'agenda'){
            return 'agenda_section.html';
        }else{
            return 'section.html';
        }
    }

    this.isImageElement = function(type){
        if(type == 'image'){
            return true;
        }
        return false;
    }

    this.isTextElement = function(type){
        if(type == 'sectiontitle' || type == 'itemtitle' || type == 'text' || type == 'description'|| type == 'icontext'  || type == 'linktext'){
            return true;
        }
        return false;
    }

    this.isHtmlElement = function(type){
        if(type == 'html'){
            return true;
        }
        return false;
    }

    this.isPersonElement = function(type){
        if(type == 'person'){
            return true;
        }
        return false;
    }

    this.nextAlign = function(align){
        if(align == 'center'){
            return 'left';
        }else if(align == 'left'){
            return 'right';
        }else if(align == 'right'){
            return 'center';
        }else{
            return 'left';
        }
    }

    this.getSectionContentEditUrl = function(section, eventId){
        switch(getAttr(section, 'category')){
            case 'persons':
                return "#/event/" + eventId + "/speakers";
            case 'agenda':
                return "#/event/" + eventId + "/agenda";
            case 'tickets':
                return "#/event/" + eventId + "/tickets";
            case 'organizations':
                return "#/event/" + eventId + "/organizations";
            default:
                return "";
        }
    }

    function textElement(params){
        var params = params ? params : {};
        params.attributes = params.attributes ? params.attributes : [];
        return {
            key : "",
            value : params.value ? params.value : "text",
            attributes : _.union([{
                key : "type",
                value : params.type ? params.type : 'text'
            }], params.attributes)
        }
    }

    function imageElement(params){
        var params = params ? params : {};
        var value = "http://placehold.it/200x200?text=image";
        params.attributes = params.attributes ? params.attributes : [];

        if(params.height && params.width){
            value = 'http://placehold.it/' + params.width + 'x' + params.height + '?text=image';
        }

        if(params.value){
            value = params.value;
        }
        var attributes = [
            { key : 'type', value : params.type ? params.type : 'image' },
            { key : 'linkUrl', value : params.linkUrl ? params.linkUrl : '' },
            { key : 'altText', value : params.altText ? params.altText : '' }
        ];

        return {
            key : '',
            value : value,
            attributes: _.union(attributes, params.attributes)
        }
    }

    function sectionTitleElement(params){
        var params = params ? params : {};
        return {
            key : params.key ? params.key : "",
            value : params.value,
            attributes : [{
                key : "type",
                value : "sectiontitle"
            },
            {
                key : "linkUrl",
                value : ""
            },
            {
                key : "editable",
                value : "no"
            },
            {
                key : "deletable",
                value : "no"
            },
            {
                key : "sectionAttrSync",
                value : "title"
            },
            {
                key : "sectionId",
                value : params.sectionId
            }]
        }
    }

    function htmlElement(params){
        var params = params ? params : {};
        params.attributes = params.attributes ? params.attributes : [];

        return {
            key : '',
            value : params.value ? params.value : '<div></div>',
            attributes: _.union([{
                key : 'type',
                value : 'html'
            }], params.attributes)
        }
    }


    function richTextElement(params){
        var params = params ? params : {};
        params.attributes = params.attributes ? params.attributes : [];

        return {
            key : '',
            value : params.value ? params.value : '',
            attributes: _.union([{
                key : 'type',
                value : 'richtext'
            }], params.attributes)
        }
    }

    function mediaElement(params){
        var params = params ? params : {};
        params.attributes = params.attributes ? params.attributes : [];

        return {
            key : '',
            value : params.value ? params.value : '',
            attributes: _.union([{
                key : 'type',
                value : 'media'
            }], params.attributes)
        }
    }

    function generalDivision(params){
        var params = params ? params : {};
        return {
            attributes : [
            {
                key : "deletable",
                value : params.deletable ? params.deletable : 'yes'
            },
            {
                key : "insertNew",
                value : params.insertNew ? params.insertNew : 'any'
            }],
            elements : params.elements ? params.elements : []
        }
    }

    function listDivision(params){
        var params = params ? params : {};
        var division = {
            attributes: [
            {
                key : "category",
                value : "list"
            },
            {
                key : "deletable",
                value : params.deletable ? params.deletable : 'yes'
            },
            {
                key : "newItemKey",
                value : params.newItemKey ? params.newItemKey : ''
            },
            {
                key : "hideIfEmpty",
                value : params.hideIfEmpty ? params.hideIfEmpty : ''
            }],
            elements : params.elements ? params.elements : []
        }
        return division;
    }

    function newSection(params){
        var section = {
            attributes : [
            { 
                key : "title", 
                value : params.title ? params.title : "新模块"
            },
            { 
                key : "sequence", 
                value : params.sequence ? params.sequence : "2"
            },
            { 
                key : "displayTitle", 
                value : params.displayTitle ? params.displayTitle : "yes"
            },
            {
                key : "width", 
                value : params.width ? params.width : "1000"
            },
            {
                key : "textAlign", 
                value : params.textAlign ? params.textAlign : "center"
            },
            {
                key : "carousel",
                value : params.carousel ? params.carousel : ""
            },{
                key : "cssKey", 
                value : params.cssKey ? params.cssKey : ""
            },{
                key : "eventSyncKey", 
                value : params.eventSyncKey ? params.eventSyncKey : ""
            }],
            divisions : params.divisions ? params.divisions : []
        }
        return section;
    }
}]);