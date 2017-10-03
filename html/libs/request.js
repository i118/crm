"use strict";


function c_date() {
    var date = new Date();
    var format = webix.Date.dateToStr("%d.%m.%Y");
    date = format(date);
    console.log(date);
    return date;
}

var input_form = [
    {view:"text", label:"Пользователь", name:"create_user", id: 'input_user', //placeholder: "Выберите пользователя",
        value: user, readonly: true, disabled: true, labelWidth: 120},
    {cols: [
        {view:"text", label:"Дата заявки", name:"create_date", //stringResult:"true",
            value: c_date(), readonly: true, disabled: true, width: 280, labelWidth: 120},
        {},
        {view: "checkbox", labelRight: "Массовая заявка", width: 180, labelAlign: "left"}
        ]},
    {view:"combo", label: "Приоритет", name: "alert", id: "alert_input", value: 3, labelWidth: 120,
        options:  {
            filter: filter_combo_c,
            body: {
                template:"#name#",
                yCount:15,
                data: alerts
                }
            },
        },
    {cols: [
        {view:"combo", label:"Клиент", name:"client", id: 'customer_new', invalidMessage: "Выберите клиента",
            required: true, placeholder: "Выберите клиента", width: 530, labelWidth: 120,
            options:  {
                filter: filter_combo_c,
                body: {
                    template:"#display_name#",
                    yCount:15,
                    data: clients
                    }
                },
            },
        {view: "button", type:"icon", icon: 'plus', autoWidth: true, id: "add_client", click: function(){
            webix.message('Будет добавление клиента');
            }
            }
        ]},
    {cols: [
        {view:"combo", label:"Точка", name:"client_point", id: 'customer_point', invalidMessage: "Выберите точку",
            required: true, placeholder: "Выберите точку", width: 530, labelWidth: 120,
            options:  {
                filter: filter_combo_c,
                body: {
                    template:"#points#",
                    yCount:15,
                    data: clients
                    }
                },
            },
        {view: "button", type:"icon", icon: 'plus', autoWidth: true, id: "add_point", click: function(){
            webix.message('Будет добавление точки');
            }
            }
        ]},
    {view:"combo", label:"Тема", id: "n_topic", name:"topic", required: true,
        invalidMessage: "Выберите тему", placeholder: "Выберите тему", labelWidth: 120, 
        options:  {
            filter: filter_combo,
            body: {
                template:"#name#",
                yCount: 15,
                data: topics
                }
            },
        },
    {view:"textarea", label:"Описание проблемы", name:"description", required: true, labelPosition:"top", labelWidth: 120,
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
            }, hotkey: "enter+ctrl", tooltip: "<Cnrl>+Enter"}
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
        labelWidth: 0
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
            {view: "button", label: "OK", width: 100, click: function(){
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
    modal: true,
    body: result_box
    });

function submit(){
    $$("pop_send_form").hide();
    var data_send = $$("send_form").getValues()
    data_send['res_desc'] = 'Пока не решена';
    console.log(data_send);
    var params = {"put_apply": data_send};
    console.log(params);
    $$("send_form").reconstruct();
    request(req_url, params).then(function(data){
    //webix.ajax().post(req_url, params, function(text, data){
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


