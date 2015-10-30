"use strict";
angular.module('channel')
    .service('channelUtilService', ['$http', function ($http) {
        this.saveItem = function(key, item){
            localStorage.setItem(key, JSON.stringify(item));
        }

        this.getItem = function(key){
            return JSON.parse(localStorage.getItem(key) || "{}");
        }
        
        this.initUpload = function (config, error) {
            this.getQiniuUploadToken()
                .success(function (res) {
                    if (res.status == 'success') {
                        if (config.length) {
                            angular.forEach(config, function (json) {
                                initQiniuUpload(res.data, json.btn, json.container, json.dropzone, json.progress, json.success, json.error);
                            });
                        }
                        console.log('upload component init success...');
                    } else {
                        if (res.message) {
                            error(res.message);
                            console.log(res.message);
                        }
                        console.log('upload component init failed...');
                    }
                })
                .error(function () {
                    console.log('upload component init failed...');
                });
        };

        this.getQiniuUploadToken = function () {
            return $http.get(window.channelConstant.baseUrl + '/qiniu/uptoken/', {withCredentials: true});
        };

        function initQiniuUpload(token, btn, container, dropzone, progress, success, error) {
//            token = 'dFfgs8Yrdhd2AKpuf5h4mR2_sYKpkTQA645Hi5aW:GD9DLH2eK5YuQcXueXzEYYNcTTw=:eyJzY29wZSI6ImVsYnVja2V0IiwiZGVhZGxpbmUiOjE0MTE5OTY2Njh9';
            var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',    //上传模式,依次退化
                browse_button: btn,       //上传选择的点选按钮，**必需**
//                uptoken_url: commonService.getBaseURL() + '/qiniu/uptoken',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                // downtoken_url: '/downtoken',
                // Ajax请求downToken的Url，私有空间时使用,JS-SDK将向该地址POST文件的key和domain,服务端返回的JSON必须包含`url`字段，`url`值为该文件的下载地址
                uptoken: token, //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
                // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
                domain: 'http://elbucket.qiniudn.com/',   //bucket 域名，下载资源时用到，**必需**
                container: container,           //上传区域DOM ID，默认是browser_button的父元素，
                max_file_size: '100mb',           //最大文件体积限制
                flash_swf_url: 'lib/plupload/Moxie.swf',  //引入flash,相对路径
                max_retries: 3,                   //上传失败最大重试次数
                dragdrop: true,                   //开启可拖曳上传
                drop_element: dropzone,        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb',                //分块上传时，每片的体积
                auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传,
                //x_vals : {
                //    自定义变量，参考http://developer.qiniu.com/docs/v6/api/overview/up/response/vars.html
                //    'time' : function(up,file) {
                //        var time = (new Date()).getTime();
                // do something with 'time'
                //        return time;
                //    },
                //    'size' : function(up,file) {
                //        var size = file.size;
                // do something with 'size'
                //        return size;
                //    }
                //},
                init: {
                    'FilesAdded': function (up, files) {
                        plupload.each(files, function (file) {
                            // 文件添加进队列后,处理相关的事情
//                            console.log(1);

                        });

                    },
                    'BeforeUpload': function (up, file) {
                        // 每个文件上传前,处理相关的事情
//                        console.log(2);
                    },
                    'UploadProgress': function (up, file) {
                        // 每个文件上传时,处理相关的事情
//                        console.log(file);
                        progress(file.percent);
                    },
                    'FileUploaded': function (up, file, info) {
//                        console.log(4);
                        // 每个文件上传成功后,处理相关的事情
                        // 其中 info 是文件上传成功后，服务端返回的json，形式如
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

//                        console.log(up);
//                        console.log(file);
//                        console.log(info);

                        var domain = up.getOption('domain');
                        var res = JSON.parse(info);
                        var sourceLink = domain + res.key; //获取上传成功后的文件的Url
                        success(sourceLink);
                        console.log(sourceLink);
                    },
                    'Error': function (up, err, errTip) {
                        //上传出错时,处理相关的事情
//                        console.log(5);
//                        console.log(up);
//                        console.log(err);
                        console.log(errTip);
                        error(errTip);
                    },
                    'UploadComplete': function () {
                        //队列文件处理完毕后,处理相关的事情
//                        console.log(6);
                    },
                    'Key': function (up, file) {
//                        console.log(7);
                        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        // 该配置必须要在 unique_names: false , save_key: false 时才生效

                        var key = "";
                        // do something with key here
                        return key;
                    }
                }
            });
//            console.log(uploader);
        }
}]);