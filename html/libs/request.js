"use strict";

var req_url = "/crm_logic";
var auth_key = "11";
var user = "Кашинцев";

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
                    //console.log($$("all_dc"));
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

function filter_combo(item, value) {
    return item.display_name.toString().toLowerCase().indexOf(value.toLowerCase()) != -1;
    };

var input_form = [
    {view:"combo", label:"Пользователь", name:"create_user", id: 'input_user', placeholder: "Выберите пользователя",
        //value: user, readonly: true, disabled: true,
        options:  {
            filter:filter_combo,
            body: {
                template:"#display_name#",
                yCount:15,
                data: users
                }
            },
        },
    {view:"datepicker", label:"Дата заявки", name:"create_date", stringResult:"true",
        value: new Date(), readonly: true, disabled: true},
    {view:"combo", label: "Приоритет", name: "alert", id: "alert_input", value: 3, 
        options:  {
            filter: filter_combo,
            body: {
                template:"#name#",
                yCount:15,
                data: alerts
                }
            },
        },
    {view:"combo", label:"Клиент", name:"client", id: 'customer_new', invalidMessage: "Выберите клиента",
        required: true, placeholder: "Выберите клиента", //labelWidth: 80,
        options:  {
            filter: filter_combo,
            body: {
                template:"#display_name#",
                yCount:15,
                data: clients
                }
            },
        },
    {view:"combo", label:"Тема", id: "n_topic", name:"topic", required: true,
        invalidMessage: "Выберите тему", placeholder: "Выберите тему", //labelWidth: 80, 
        options:  {
            filter: filter_combo,
            body: {
                template:"#name#",
                yCount: 5,
                data: topics
                }
            },
        },
    {view:"textarea", label:"Описание проблемы", name:"description", required: true, labelPosition:"top",
        id: "n_desc", height: 130, invalidMessage: "Введите описание", placeholder: "Введите описание проблемы"},
    {cols:[
        {},
        {},
        {view:"button", value:"Отменить", click: function(){
            $$("pop_send_form").hide();
            $$("send_form").reconstruct();
            }},
        {view:"button", value:"Отправить", click: function(){
            var vl_2 = $$("customer_new").validate();
            var vl = $$("n_desc").validate();
            var vl_1 = $$("n_topic").validate();
            if (vl & vl_1 & vl_2) {
                submit();
            };
            }}
        ]
    }];

var send_form_body = {
    view:"form", 
    id:"send_form",
    width: 600,
    rules:{
        "topic": webix.rules.isNotEmpty,
        "description": webix.rules.isNotEmpty,
        "client": webix.rules.isNotEmpty
        },
    elementsConfig:{
        labelWidth: 120
        },
    elements: input_form
    };

function topics_load() {
    var params = {'get_topics': user};
    webix.ajax().post(req_url, params, function(text, data){
        data = data.json();
        console.log(data);
        $$("topics_list").clearAll();
        $$("topics_list").parse(data);
        });
    };

function submit(){
    $$("pop_send_form").hide();
    var data_send = $$("send_form").getValues()
    var params = {"put_apply": data_send};
    webix.ajax().post(req_url, params, function(text, data){
        $$("view_2").data.sync(upd_all());
        webix.message(data.json());
        });
    $$("send_form").reconstruct();
    };
