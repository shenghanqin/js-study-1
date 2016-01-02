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

    // 判断浏览器信息
    this.browser.coreInit();

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

    return target;

}

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
    }, options.time());
};