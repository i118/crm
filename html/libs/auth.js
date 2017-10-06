"use strict";

var req_url = "/crm_logic";

//webix events attaches
webix.i18n.setLocale('ru-RU');

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : NaN;
    };

function setCookie(name, value, options) {
    options = options || {};
    var expires = options.expires;
    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    };
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    };
    value = encodeURIComponent(value);
    var updatedCookie = name + "=" + value;
    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        };
    };
    document.cookie = updatedCookie;
    }

function deleteCookie(name) {
    setCookie(name, "", {
        expires: -1
        })
    }

function filter_combo_c(item, value) {
    return item.display_name.toString().toLowerCase().indexOf(value.toLowerCase()) != -1;
    };

function filter_combo(item, value) {
    return item.name.toString().toLowerCase().indexOf(value.toLowerCase()) != -1;
    };
    
var auth_users = new webix.DataCollection({
    id: "users_auth",
    url: {
        $proxy:true,
        source: req_url,
        load: function(view, callback) {
            var params = {"get_users": 'auth'};
            webix.ajax().headers({'x-api-key': 'key', 'Content-type': 'application/json'}).post(this.source, params)
                .then(function(data){
                    webix.ajax.$callback(view, callback, "", data, -1);
                    $$("users_auth").clearAll();
                    data = data.json();
                    $$("users_auth").parse(data);
                    });
                }
        },
    });

function include(url) {
        var script = document.createElement('script');
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

function a_action() {
    include("./libs/stores.js");
    setTimeout(function() {
        include("./libs/request.js");
        include("./libs/crm.js");
        include("./libs/options.js");
         }, 100);
    };

function validate_user(user, password) {
    console.log("validation");
    var ret;
    ret = (user) ? true : false;
    return ret;
    }

var auth_form = {
    id: "auth_box",
    view:"form", 
    label:"Аутентификация",
    elements:[
        {view:"combo", label:"Пользователь", name:"login_user", id: 'login_user', placeholder: "Выберите пользователя", labelWidth: 120,
            options:  {
                filter:filter_combo,
                body: {
                    template:"#display_name#",
                    yCount:10,
                    data: auth_users
                    }
                },
            width: 400
            },
        { view:"text", type:"password", label:"Пароль", name:"password", labelWidth: 120, width: 400, tooltip: "пока можно без пароля"},
        {cols: [
            {},
            {view: "button", label: "OK", click: function(){
                    var user = $$("login_user").getText();
                    var pass = $$("auth_box").getValues().password;
                    if (validate_user(user, pass)) {
                        $$("pop_auth").hide();
                        var admin = true;
                        var auth_key = '122';
                        setCookie('user', user);
                        setCookie('admin', admin);
                        setCookie('auth_key', auth_key);
                        $$("auth_box").clear();
                        a_action();
                    } else {
                        console.log('не авторизованно');
                    }
                    }
                },
            {}
            ]}
        ]
    }

webix.ui({
    view: "popup",
    autofit: true,
    header: "Логин",
    id: "pop_auth",
    position:"center",
    modal:true,
    move:true,
    body: auth_form
    });

function get_c(){
    var user = getCookie("user");
    var admin = getCookie("admin");
    var auth_key = getCookie("auth_key");
    if (user && admin && auth_key) {
        a_action();
    } else {
        $$("pop_auth").show();
    }
};

get_c();




