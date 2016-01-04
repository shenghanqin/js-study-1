/*
 * ★ 网站开发常用 方法.
 * Version  : 1.0
 * Author   : 王子墨
 * Website  : lab.julying.com/july.js/
 * Email    : i@julying.com
 * QQ       : 31697011
 *
 * created  : 2012/06/08 20:20
 * updated  : 2013/12/20 22:00
 *
 *
 * Demo:
 * <script type="text/javascript" src="july.js"></script>
 * <script type="text/javascript">
 *      //定义 ，可以不填写
 *  julyJs.config = {
 *          errorUrl : 'http://julying.com/?404' // 上报 window.onerror 的网址，用于后台统计、告警
 * };
 *  //初始化调用
 *  julyJs.init();
 * </script>
**/

;'use strict';

// console

window.console = window.console || {
    log: function () {}
};

window.julyJs = {
     // julyJs 版本号
    version: '1.0.0',

    // 空函数
    noop: function () {
        return function () {};
    },

    //# 判断变量 是否为数组
    isArray: Array.isArray || function (array) {
        return '[object Array]' == Object.prototype.toString.call(array);
    }
};

// 初始化函数
julyJs.init = function () {
    // 合并 参数
    this.option = this.extend(this.option, this.config);

    //// 判断浏览器信息
    //this.browser.coreInit();
    //
    // bad js
    this.badJs();
};

//默认初始值 , 会和 用户 输入的 julyJs.config 合并
julyJs.option = {
    //当 js 发生错误，需要将错误上报， 如：http://julying.com/？badjs
    errorUrl: '',
    //是否 上报当前发生的错误
    isPostError   : false

};

// 对象扩展
julyJs.extend = function () {
    var target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      options;

    if (typeof target != 'object' && typeof target != 'function') {
        target = {};
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (var name in options) {
                    if (options.hasOwnProperty(name)) {
                        var copy = options[name];
                        if (target === copy) {
                            continue;
                        }

                        if (copy !== undefined) {
                            target[name] = copy;
                        }

                    }
                }
            }
        }
    }

    return target;

};

// 加载 js
//# 加载js文件（支持跨域）
julyJs.loadJs = function (src, option) {
    var head = document.getElementsByTagName('head')[0] || document.documentElement,
      script = document.createElement('script'),
      options = {
          // 加载成功 回调
          onload: this.noop(),
          // onerror
          onerror: this.noop(),
          // 编码
          charset: 'utf-8',
          // 超时时间
          timeout: 2e3
      },
      // 超时
      timer = null;

    //不允许地址为空
    if (!src) {
        return ;
    }

    options = this.extend(options, option);

    script.type = 'text/javascript';
    script.src = src;
    script.charset = options.charset;
    script.onload = function () {
        options.onload();
        clearTimeout(timer);
    };
    script.onerror = options.onerror;

    script.onreadystatechange = function () {
        var state = this.readyState;
        console.log(state);
        if (state === 'loaded' || state ==='complete') {
            script.onreadystatechange = null;
            // 清除超时事件
            clearTimeout(timer);
            options.onload();
        }
    };

    head.insertBefore(script, head.firstChild);

    // 检测超时
    timer = setTimeout(function () {
        head.removeChild(script);

        // 触发错误
        options.onerror();
    }, options.timeout);
};

//构造url参数
//# 构造url参数
julyJs.param = function (option, isCode, url) {
    var array = [];
    // 连接符
    var joins = '';
    // tmp
    var value = '';

    url = url || '';
    for (var o in  option){
        if (option.hasOwnProperty(o) && o) {
            if (isCode) {
                value = encodeURIComponent(option[o] || '');
            } else {
                value = (option[o] || '');
            }

            array.push(o + '=' + value);

        }
    }

    if (url) {
        joins = url.indexOf('?') > -1 ? '&' : '?';
    }

    return url + joins + array.join('&');
};

// 二维码
julyJs.qr = function () {
    console.log(vl);
};

//1、运行时错误，例如无效的对象引用或安全限制， 2、下载错误，如图片， 3、在IE9中，获取多媒体数据失败也会引发
//window 对象都支持 onerror ， <css> 和 <iframe> 不支持onerror。
//对于引用外部js文件中的错误，Webkit和Mozilla类浏览器会篡改原始的错误信息，导致最后onerror获取到的三个入参为： “Script error.”,”", 0
julyJs.badJs = function (postUrl) {
    var errorUrl = this.option.errorUrl;
    if (!errorUrl) return;

    // 上报
    window.onerror = function (msg, url, line) {
        var option = {
            browser: window.navigator.userAgent,
            referrer: document.referrer,
            url: url,
            line: line
        };
        var iframe = document.createElement('iframe');
        iframe.src = julyJs.param(option, true, errorUrl);
        iframe.onload = function () {
            document.body.removeChild(iframe);
        };
        iframe.style.display = 'none';

        //julyJs.loadJs( errorUrl ); 此处不能 用 js 方式！万一请求源错误，或者 返回错误js代码，会导致死循环。
        document.body.appendChild(iframe);
        console.log('js error', option);


    };



};
//############ 一些事件 event

julyJs.event = {
    //# 事件禁止
    //@type : 类型
    //@area : 范围
    disable: function (type, area) {
        area = area || document.body;
        switch (type) {
            // 选择文字
            case 'select':
                area.onselectstart = function () {
                    return false;
                };
                break;
            case 'rightMouse':
                area.oncontextmenu = function () {
                    return false;
                };
                break;
            case 'copy':
                area.oncopy = function () {
                    return false;
                };
                break;
            case 'paste':
                area.onpaste = function () {
                    return false;
                };
            break
        }
    },
    // 输入框 限定字数
    //@inputDom 输入框
    //@numDom 数字
    //@maxDum
    textCount: function (inputDom, numDom, maxNum) {
        var text = inputDom.value || '';
        var len = text.length;
        var overplus = maxNum - len;
        if (overplus < 0) {
            inputDom.value = text.slice(0, maxNum);
            overplus = 0;
        }
        numDom.innerHTML = overplus;
    }
};