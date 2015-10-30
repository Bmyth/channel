angular.module('channel', []);

window.channelConstant = {
    baseUrl : "/eventslin-api"
};

var setAttr = function(element, key, value){
    var t = _.find(element.attributes, function(attr){
        return attr.key == key;
    })
    if(t){
        t.value = value;
    }else{
        element.attributes.push({key:key, value:value});
    }
}

var getAttr = function(element, key){
    var attr = _.find(element.attributes, function(attr){
        return attr.key == key;
    })
    if(attr){
        return attr.value;
    }else{
        return "";
    }
}