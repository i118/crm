"use strict";




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
    {view:"combo", label:"Точка", name:"client_point", id: 'customer_point', invalidMessage: "Выберите точку",
        required: true, placeholder: "Выберите точку", //labelWidth: 80,
        options:  {
            filter: filter_combo,
            body: {
                template:"#points#",
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
            var vl_3 = $$("customer_point").validate();
            if (vl & vl_1 & vl_2 & vl_3) {
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
        "client": webix.rules.isNotEmpty,
        "client_point":  webix.rules.isNotEmpty
        },
    elementsConfig:{
        labelWidth: 120
        },
    elements: input_form
    };

var result_box = {
    id: "res_box",
    view:"form", 
    label:"Результат",
    elements:[
        {view: "label", label:"Ваша заявка ", align:"center", id: "l1"},
        {view: "label", label:"Номер заявки № ", align:"center", id: "l2"},
        {cols: [
            {},
            {view: "button", label: "OK", click: function(){
                    $$("pop_result").hide();
                    $$("res_box").reconstruct();
                    }
                },
            {}
            ]}
        ]
    }

webix.ui({
    view: "popup",
    position:"center",
    id: "pop_result",
    body: result_box
    });

function submit(){
    $$("pop_send_form").hide();
    var data_send = $$("send_form").getValues()
    var params = {"put_apply": data_send};
    $$("send_form").reconstruct();
    webix.ajax().post(req_url, params, function(text, data){
        var item = data.json()[0];
        if (item != "error") {
            $$("view_2").add(item, 0);
            $$("l1").setValue("Ваша заявка зарегистрирована");
            $$("l2").setValue("Номер заявки: " + item.num);
        } else {
            $$("l1").setValue("Ваша заявка не зарегистрирована");
            $$("l2").setValue("");
        };
        $$("l2").refresh();
        $$("l1").refresh();
        $$("pop_result").show();
        });
    };

