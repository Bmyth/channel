"use strict";
angular.module('channel')
    .service('channelSampleDataService', [function () {

    this.sectionAttrs = function(category){
        if(category == 'head'){
            return headSectionAttrs();
        }else if(category == 'banners'){
            return bannersSectionAttrs();
        }else if(category == 'features'){
            return featuresSectionAttrs();
        }else if(category == 'tickets'){
            return ticketsSectionAttrs();
        }else if(category == 'agenda'){
            return agendaSectionAttrs();
        }else if(category == 'persons'){
            return personsSectionAttrs();
        }else if(category == 'organizations'){
            return organizationsSectionAttrs();
        }else if(category == 'contacts'){
            return contactsSectionAttrs();
        }else if(category == 'host'){
            return hostSectionAttrs();
        }else if(category == 'venues'){
            return venuesSectionAttrs();
        }else{
            return newSectionParams();
        }
    }

    function headSectionAttrs(){
        return  {
            head : 'yes',
            sampleDivision : headDivision,
            sampleDivisionRepeat : 1
        }

        function headDivision(){
            var division = {
                attributes : [],
                elements : []
            }
            division.elements.push(
                textElement({
                    value : "简介文字",
                    type : "itemtitle",
                    attributes : [{key : 'width', value : '50%'}]
                })
            );
            return division;
        }
    }

    function bannersSectionAttrs(){
        return  {
            title : "置顶图片",
            displayTitle : 'no',
            width : "full",
            carousel : "yes", 
            sampleDivision : bannerDivision,
            sampleDivisionRepeat : 1
        }

        function bannerDivision(){
            var division = {
                attributes : [{
                    key : 'width', value : '100%'
                },{
                    key : 'insertNew', value : 'no'
                },{
                    key : 'textAlign', value : 'center'
                }],
                elements : []
            }
            var params = {
                height : 200,
                width : 600,
                attributes : []
            }
            division.elements.push(imageElement(params));
            return division;
        }
    }

    function featuresSectionAttrs(){
        return {
            title : "特色亮点",
            sampleDivision : featureDivision,
            sampleDivisionRepeat : 2
        }

        function featureDivision(){
            var params = {
                thumbnail : "http://7vzu7n.com1.z0.glb.clouddn.com/icon1.png",
                title : "特色亮点",
                description : "描述文字"
            }

            var division = {
                attributes: [{
                    key : 'width', value : '33%'
                },{
                    key : 'widthTablet', value : '49.5%'
                },{
                    key : 'widthMobile', value : '100%'
                },{key : "textAlign", value : "center"}],
                elements : []
            }

            division.elements.push(
                imageElement({
                    value : params.thumbnail,
                    attributes : [{key : 'width', value : '200px'},{}]
                })
            )
            
            division.elements.push(
                textElement({
                    value : params.title ? params.title : "标题文字",
                    type : "itemtitle",
                    attributes : [{key : 'deletable', value : 'yes'}]
                })
            );
            division.elements.push(
                textElement({
                    value : params.description ? params.description : "介绍文字...",
                    type : "description",
                    attributes : [{key : 'deletable', value : 'yes'}]
                })
            );
            return division; 
        };
    }

    function ticketsSectionAttrs(){
        return {
            title : "参会门票",
            cssKey : "tickets",
            eventSyncKey : "tickets"
        }
    }

    function agendaSectionAttrs(){
        return {
            title : "会议日程",
            eventSyncKey : "agenda"
        }
    }

    function personsSectionAttrs(){
        return {
            title : "嘉宾列表",
            eventSyncKey : "speakers"
        }
    }

    function organizationsSectionAttrs(){
        return {
            title : "组织机构",
            eventSyncKey : "organizations"
        }
    }

    function contactsSectionAttrs(){
        return {
            title : "联系方式",
            cssKey : "contacts",
            divisions : [{
                elements : [{
                    key : '', value : '固定电话',
                    attributes : 
                    [{key : 'type',value : 'icontext'},
                    {key : 'iconType',value : 'fontawesome'},
                    {key : 'iconValue',value : 'fa-phone'},
                    {key : 'linkUrl',value : ''}]
                },
                {
                    key : '', value : '移动电话',
                    attributes : 
                    [{key : 'type',value : 'icontext'},
                    {key : 'iconType',value : 'fontawesome'},
                    {key : 'iconValue',value : 'fa-mobile'},
                    {key : 'linkUrl',value : ''}]
                },
                {
                    key : '',value : '电子邮件',
                    attributes : 
                    [{key : 'type',value : 'icontext'},
                    {key : 'iconType',value : 'fontawesome'},
                    {key : 'iconValue',value : 'fa-envelope'},
                    {key : 'linkUrl',value : ''}]
                },
                {
                    key : '',value : '传真',
                    attributes : [
                    {key : 'type',value : 'icontext'},
                    {key : 'iconType',value : 'fontawesome'},
                    {key : 'iconValue',value : 'fa-print'},
                    {key : 'linkUrl',value : ''}]
                }]
            },{
                elements : [{
                    key : '', value : '/assets/images/qrcode_for_Eventslin.jpg',
                    attributes : 
                    [{key : 'type',value : 'image'},
                    {key : 'category',value : 'qrcode'},
                    {key : 'description',value : '官方公众号'},
                    {key : 'linkUrl',value : ''},
                    {key : 'block',value : 'yes'}]
                },
                {
                    key : '',value : '/assets/images/social/weixin.png',
                    attributes : 
                    [{key : 'type',value : 'image' },
                    {key : 'category',value : 'social'},
                    {key : 'description',value : '微信'},
                    {key : 'linkUrl',value : ''}]
                },
                {
                    key : '',value : '/assets/images/social/weibo.png',
                    attributes : 
                    [{key : 'type',value : 'image'},
                     {key : 'category',value : 'social'},
                    {key : 'description',value : '新浪微博'},
                    {key : 'linkUrl',value : ''}]
                },
                {
                    key : '', value : '/assets/images/social/linkedin.png',
                    attributes : 
                    [{key : 'type',value : 'image'},
                    {key : 'category',value : 'social'},
                    {key : 'description',value : '领英'},
                    {key : 'linkUrl',value : ''}]
                },
                {
                    key : '',value : '/assets/images/social/gplus.png',
                    attributes : 
                    [{key : 'type',value : 'image'},
                    {key : 'category',value : 'social'},
                    {key : 'description',value : 'Google+'},
                    {key : 'linkUrl',value : ''}]
                },
                {
                    key : '',value : '/assets/images/social/twitter.png',
                    attributes : 
                    [{key : 'type',value : 'image'},
                    {key : 'category',value : 'social'},
                    {key : 'description',value : 'twitter'},
                    {key : 'linkUrl',value : ''}]
                },
                {
                    key : '',value : '/assets/images/social/facebook.png',
                    attributes : 
                    [{key : 'type',value : 'image'},
                    {key : 'category',value : 'social'},
                    {key : 'description',value : 'facebook'},
                    {key : 'linkUrl',value : ''}]
                }]
            }]
        }
    }

    function hostSectionAttrs(){
        return {
            title : "主办方信息",
            cssKey : "host",
            divisions : [{
                elements : [{
                    key : '',
                    value : '/assets/images/eventslin-logo-5.png',
                    attributes: [
                    {
                        key : 'type',
                        value : 'image'
                    },
                    {
                        key : 'width',
                        value : '140px'
                    },
                    {
                        key : 'category',
                        value : 'logo'
                    },
                    {
                        key : 'linkUrl',
                        value : 'www.eventslin.com'
                    }]
                }]
            },
            {
                elements : [{
                    key : "",
                    value : "Copyright © 2015 | 会邻 EVENTSLIN.COM",
                    attributes : [
                    {
                        key : "type",
                        value : "text"
                    },
                    {
                        key : "category",
                        value : "copyright"
                    }]
                },
                {
                    key : "",
                    value : "",
                    attributes : [{
                        key : "type",
                        value : "linktext"
                    },
                    {
                        key : "category",
                        value : "beian"
                    },
                    {
                        key : "linkUrl",
                        value : "http://www.miitbeian.gov.cn"
                    },
                    {
                        key : "channelAttrSync",
                        value : "beian"
                    }]
                }]
            }]
        }
    }

    function venuesSectionAttrs(){
        return {
            title : "场馆信息",
            divisions : [{
                elements : [{
                    key : '',value : 'http://elbucket.qiniudn.com/o_1a1006ke311iah07ifk14cf1ee9c.jpg',
                    attributes : 
                    [{
                        key : 'widthPc', value : '6'},{
                        key : 'widthTablet', value : '6'},{
                        key : 'widthMobile', value : '12'},{
                        key : 'type',value : 'image' },{
                        key : 'category',value : 'mainphoto'},{
                        key : 'linkUrl',value : ''}]
                },{
                    key : '',value : '举办城市及会场信息',
                    attributes : 
                    [{
                        key : 'widthPc', value : '6'},{
                        key : 'widthTablet', value : '6'},{
                        key : 'widthMobile', value : '12'},{
                        key : 'type',value : 'html' },{
                        key : 'category',value : 'city'}] 
                }]
            },{
                elements : [{
                    key : '',value : 'http://elbucket.qiniudn.com/o_1a100lv6n1n711pn71p3j8aui9ur.jpg',
                    attributes : 
                    [{
                        key : 'type',value : 'image' },{
                        key : 'widthPc', value : '3'},{
                        key : 'widthTablet', value : '3'},{
                        key : 'widthMobile', value : '6'},{
                        key : 'category',value : 'photo'},{
                        key : 'linkUrl',value : ''}]
                },
                {
                    key : '',value : 'http://elbucket.qiniudn.com/o_1a100n0j66dgi781im11u7s70f15.jpg',
                    attributes : 
                    [{
                        key : 'type',value : 'image' },{
                        key : 'widthPc', value : '3'},{
                        key : 'widthTablet', value : '3'},{
                        key : 'widthMobile', value : '6'},{
                        key : 'category',value : 'photo'},{
                        key : 'linkUrl',value : ''}]
                },
                {
                    key : '',value : 'http://elbucket.qiniudn.com/o_1a100p5bkqk1vh4a6511ap1sv21p.jpg',
                    attributes : 
                    [{
                        key : 'type',value : 'image' },{
                        key : 'widthPc', value : '3'},{
                        key : 'widthTablet', value : '3'},{
                        key : 'widthMobile', value : '6'},{
                        key : 'category',value : 'photo'},{
                        key : 'linkUrl',value : ''}]
                },
                {
                    key : '',value : 'http://elbucket.qiniudn.com/o_1a100lv6n1n711pn71p3j8aui9ur.jpg',
                    attributes : 
                    [{
                        key : 'type',value : 'image' },{
                        key : 'widthPc', value : '3'},{
                        key : 'widthTablet', value : '3'},{
                        key : 'widthMobile', value : '6'},{
                        key : 'category',value : 'photo'},{
                        key : 'linkUrl',value : ''}]
                }]
            },{
                elements : [{
                    key : '',value : 'http://elbucket.qiniudn.com/o_1a101hit01ljk71912ku1it2e1cr.png',
                    attributes : 
                    [{key : 'widthPc', value : '6'},
                    {key : 'widthTablet', value : '6'},
                    {key : 'widthMobile', value : '12'},
                    {key : 'type',value : 'image' },
                    {key : 'category',value : 'mainphoto'},
                    {key : 'linkUrl',value : 'http://j.map.baidu.com/aYWqD'}]
                },{
                    key : '',value : '乘车路线，交通信息',
                    attributes : 
                    [{key : 'widthPc', value : '6'},
                    {key : 'widthTablet', value : '6'},
                    {key : 'widthMobile', value : '12'},
                    {key : 'type',value : 'html' },
                    {key : 'category',value : 'city'}] 
                }]
            }]
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

    function logoElementParams(){
        return {
            height : "52",
            width : "136",
            attributes : [{
                key : "category",
                value : "logo"
            }]
        }
    }
}]);