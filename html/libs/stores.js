"use strict";

var user = getCookie("user");
var admin = getCookie("admin");
var auth_key = getCookie("auth_key");

webix.i18n.setLocale('ru-RU');
//webix.attachEvent("onBeforeAjax", 
    //function(mode, url, data, request, headers, files, promise){
        //headers["Content-type"] = "application/json";
        //headers["x-api-key"] = auth_key;
        //}
    //);

var prior = {0: "О", 1: "В", 2: "О", 3: "Н"}
var row_height = 32;

function request(url, params){
    var tt = webix.ajax().headers({'x-api-key': 'key', 'Content-type': 'application/json'}).post(url, params)
    return tt
    };

var request1 =  function(url, params, f){
    var tt = webix.ajax().sync().headers({'x-api-key': 'key', 'Content-type': 'application/json'}).post(url, params,f)
    };

var gm = function() {
    var params = {"get_item": 1}, r = 0;
    return request1(req_url, params, function(e) {
        var t = JSON.parse(e);
        r = t[0]
        }), r
    }

console.log(gm());

function upd_points() {
    var points = new webix.DataCollection({
        id: "points_dc",
        url: {
            $proxy:true,
            source: req_url,
            load: function(view, callback) {
                var params = {"get_points": user};
                request(this.source, params).then(function(data){
                        $$("points_dc").clearAll();
                        data = data.json();
                        $$("points_dc").parse(data);
                        });
                    }
            },
        });
        return points;
    }

var clients = new webix.DataCollection({
    id: "clients_dc",
    url: {
        $proxy:true,
        source: req_url,
        load: function(view, callback) {
            var params = {"get_clients": user};
            request(this.source, params).then(function(data){
            //webix.ajax().post(this.source, params)
                //.then(function(data){
                    //webix.ajax.$callback(view, callback, "", data, -1);
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
            request(this.source, params).then(function(data){
            //webix.ajax().post(this.source, params)
                //.then(function(data){
                    //webix.ajax.$callback(view, callback, "", data, -1);
                $$("alerts_dc").clearAll();
                data = data.json();
                $$("alerts_dc").parse(data);
                data.forEach(function(i, q, data) {
                    prior[q] = i.name;
                    })
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
            request(this.source, params).then(function(data){
            //webix.ajax().post(this.source, params)
                //.then(function(data){
                    //webix.ajax.$callback(view, callback, "", data, -1);
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
            request(this.source, params).then(function(data){
            //webix.ajax().post(this.source, params)
                //.then(function(data){
                    //webix.ajax.$callback(view, callback, "", data, -1);
                    $$("topics_dc").clearAll();
                    data = data.json();
                    $$("topics_dc").parse(data);
                    });
                }
        },
    });

function upd_history() {
    var tt = new webix.DataCollection({
        id: "hist_upd",
        url: {
            $proxy:true,
            source: req_url,
            load: function(view, callback) {
                var params = {"get_hist": user};
                request(this.source, params).then(function(data){
                //webix.ajax().post(this.source, params)
                    //.then(function(data){
                        //webix.ajax.$callback(view, callback, "", data, -1);
                        $$("hist_upd").clearAll();
                        data = data.json();
                        $$("hist_upd").parse(data);
                        });
                    }
            },
        });
    return tt
    };


function upd_all() {
    var tt = new webix.DataCollection({
        id: "all_upd",
        url: {
            $proxy:true,
            source: req_url,
            load: function(view, callback) {
                var params = {"get_all": user};
                request(this.source, params).then(function(data){
                //webix.ajax().post(this.source, params)
                    //.then(function(data){
                        //webix.ajax.$callback(view, callback, "", data, -1);
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
                request(this.source, params).then(function(data){
                //webix.ajax().post(this.source, params)
                    //.then(function(data){
                        //webix.ajax.$callback(view, callback, "", data, -1);
                        $$("my_upd").clearAll();
                        data = data.json();
                        $$("my_upd").parse(data);
                        });
                    }
            },
        });
    return tt
    };

function upd_mass() {
    var tt= new webix.DataCollection({
        id: "mass_upd",
        url: {
            $proxy:true,
            source: req_url,
            load: function(view, callback) {
                var params = {"get_mass": user};
                request(this.source, params).then(function(data){
                        $$("mass_upd").clearAll();
                        data = data.json();
                        $$("mass_upd").parse(data);
                        });
                    }
            },
        });
    return tt
    };


//"topic_mass_list"
function upd_top_apps() {
    var cli_apps = new webix.DataCollection({
        id: "top_apps_upd",
        url: {
            $proxy:true,
            source: req_url,
            load: function(view, callback) {
                var item;
                var cv = get_current_view();
                item = $$(cv).getSelectedItem();
                var params = {"get_reqs_by_topic": item};
                request(this.source, params).then(function(data){
                        $$("top_apps_upd").clearAll();
                        data = data.json();
                        $$("top_apps_upd").parse(data);
                        });
                    }
            },
        });
    return cli_apps
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
                //console.log(item);
                var params = {"get_reqs": item};
                request(this.source, params).then(function(data){
                //webix.ajax().post(this.source, params)
                    //.then(function(data){
                        //webix.ajax.$callback(view, callback, "", data, -1);
                        $$("cli_apps_upd").clearAll();
                        data = data.json();
                        $$("cli_apps_upd").parse(data);
                        });
                    }
            },
        });
    return cli_apps
    };



    





