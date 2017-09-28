"use strict";

var req_url = "/crm_logic";
var auth_key = "11";
var user = "Краснов";

//webix events attaches
webix.i18n.setLocale('ru-RU');
webix.attachEvent("onBeforeAjax", 
    function(mode, url, data, request, headers, files, promise){
        headers["Content-type"] = "application/json";
        headers["x-api-key"] = auth_key;
        }
    );

var clients = new webix.DataCollection({
    id: "clients_dc",
    url: {
        $proxy:true,
        source: req_url,
        load: function(view, callback) {
            var params = {"get_clients": user};
            webix.ajax().post(this.source, params)
                .then(function(data){
                    webix.ajax.$callback(view, callback, "", data, -1);
                    $$("clients_dc").clearAll();
                    data = data.json();
                    $$("clients_dc").parse(data);
                    });
                }
        },
    });

var alerts = new webix.DataCollection({
    id: "alerts_dc",
    url: {
        $proxy:true,
        source: req_url,
        load: function(view, callback) {
            var params = {"get_alerts": user};
            webix.ajax().post(this.source, params)
                .then(function(data){
                    webix.ajax.$callback(view, callback, "", data, -1);
                    $$("alerts_dc").clearAll();
                    data = data.json();
                    $$("alerts_dc").parse(data);
                    });
                }
        },
    });

var users = new webix.DataCollection({
    id: "users_dc",
    url: {
        $proxy:true,
        source: req_url,
        load: function(view, callback) {
            var params = {"get_users": user};
            webix.ajax().post(this.source, params)
                .then(function(data){
                    webix.ajax.$callback(view, callback, "", data, -1);
                    $$("users_dc").clearAll();
                    data = data.json();
                    $$("users_dc").parse(data);
                    });
                }
        },
    });

var topics = new webix.DataCollection({
    id: "topics_dc",
    url: {
        $proxy:true,
        source: req_url,
        load: function(view, callback) {
            var params = {"get_topics": user};
            webix.ajax().post(this.source, params)
                .then(function(data){
                    webix.ajax.$callback(view, callback, "", data, -1);
                    $$("topics_dc").clearAll();
                    data = data.json();
                    $$("topics_dc").parse(data);
                    });
                }
        },
    });

function upd_all() {
    var tt = new webix.DataCollection({
        id: "all_upd",
        url: {
            $proxy:true,
            source: req_url,
            load: function(view, callback) {
                var params = {"get_all": user};
                webix.ajax().post(this.source, params)
                    .then(function(data){
                        webix.ajax.$callback(view, callback, "", data, -1);
                        $$("all_upd").clearAll();
                        data = data.json();
                        $$("all_upd").parse(data);
                        });
                    }
            },
        });
    return tt
    };

function upd_my() {
    var tt = new webix.DataCollection({
        id: "my_upd",
        url: {
            $proxy:true,
            source: req_url,
            load: function(view, callback) {
                var params = {"get_my": user};
                webix.ajax().post(this.source, params)
                    .then(function(data){
                        webix.ajax.$callback(view, callback, "", data, -1);
                        $$("my_upd").clearAll();
                        data = data.json();
                        $$("my_upd").parse(data);
                        });
                    }
            },
        });
    return tt
    };

function upd_cli_apps() {
    var cli_apps = new webix.DataCollection({
        id: "cli_apps_upd",
        url: {
            $proxy:true,
            source: req_url,
            load: function(view, callback) {
                var item;
                var cv = get_current_view();
                item = $$(cv).getSelectedItem();
                console.log(item);
                var params = {"get_reqs": item};
                webix.ajax().post(this.source, params)
                    .then(function(data){
                        webix.ajax.$callback(view, callback, "", data, -1);
                        $$("cli_apps_upd").clearAll();
                        data = data.json();
                        $$("cli_apps_upd").parse(data);
                        });
                    }
            },
        });
    return cli_apps
    };

//для образца оставим
var all_appls = new webix.DataCollection({
    id: "all_dc",
    url: {
        $proxy:true,
        source: req_url,
        load: function(view, callback) {
            var params = {"get_all": user};
            webix.ajax().post(this.source, params)
                .then(function(data){
                    webix.ajax.$callback(view, callback, "", data, -1);
                    $$("all_dc").clearAll();
                    data = data.json();
                    $$("all_dc").parse(data);
                    });
                }
        },
    });
