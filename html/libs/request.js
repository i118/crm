"use strict";


function c_date() {
    var date = new Date();
    var format = webix.Date.dateToStr("%d.%m.%Y");
    date = format(date);
    return date;
}

var input_form = [
    {view:"text", label:"Пользователь", name:"create_user", id: 'input_user',
        value: user, readonly: true, disabled: true, labelWidth: 120},
    {cols: [
        {view:"text", label:"Дата заявки", name:"create_date",
            value: c_date(), readonly: true, disabled: true, width: 280, labelWidth: 120},
        {},
        {view: "checkbox", labelRight: "Массовая заявка", width: 180, labelAlign: "left", name: "mass",
            on: {
                onChange: function(c_item) {
                    $$("send_form").focus("description");
                    $$("send_form").clearValidation();
                    $$("send_form").config.mass = c_item
                    if (c_item === 1) {
                        $$("customer_new").disable();
                        $$("customer_point").disable();
                    } else {
                        $$("customer_new").enable();
                        $$("customer_point").enable();
                    };
                    }
                }

            }
        ]},
    {view:"combo", label: "Приоритет", name: "alert",
        id: "alert_input", value: 2, labelWidth: 120,
        options:  {
            filter: filter_combo_c,
            body: {
                template:"#name#",
                yCount:10,
                data: alerts
                }
            },
        on: {
            onBeforeRender: function(d) {
                var data = $$("alerts_dc").data.order;
                data.forEach(function(item, i, data) {
                    var obj = $$("alerts_dc").getItem(item);
                    obj.$css = (obj.name === prior[0]) ? "high_pr":
                               (obj.name === prior[1]) ? "med_pr":
                               (obj.name === prior[3]) ? "low_pr":
                               "nothing";
                    });
                }
            }
        },
    {cols: [
        {view:"combo", label:"Клиент", name:"client", id: 'customer_new', invalidMessage: "Выберите клиента",
            required: true, placeholder: "Выберите клиента", width: 530, labelWidth: 120,
            options:  {
                filter: filter_combo_c,
                body: {
                    template:"#display_name#",
                    yCount:10,
                    data: clients
                    }
                },
            on: {
                onChange: function(rid){
                    if ($$("send_form").config.client_ch === 1) {
                        var params = {"get_c_points": rid};
                        request(req_url, params).then(function(data){
                            $$("points_dc").clearAll();
                            data = data.json();
                            $$("send_form").config.point_ch = 0;
                            $$('customer_point').setValue('');
                            $$('customer_point').refresh();
                            $$("points_dc").parse(data);
                            })
                    } else if ( $$("send_form").config.client_ch === 0 && $$("send_form").config.point_ch === 1 ) {
                        $$("send_form").config.client_ch = 1;
                    };
                    }
                }
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
                    template:"#display_name#",
                    yCount:10,
                    data: upd_points()
                    }
                },
            on: {
                onChange: function(rid){
                    if ($$("send_form").config.point_ch === 1) {
                        $$("send_form").config.client_ch = 0;
                        var c_po = $$("points_dc").getItem(rid).customer_id;
                        var cli = $$("customer_new").getValue();
                        $$("customer_new").setValue(c_po);
                        $$("customer_new").refresh()
                    };
                    }
                }
            },
        {view: "button", type:"icon", icon: 'plus', autoWidth: true, id: "add_point", click: function(){
            webix.message('Будет добавление точки');
            }
            }
        ]},
    {cols: [
        {view:"combo", label:"Тема", id: "n_topic", name:"topic", required: true, value: 3,
            invalidMessage: "Выберите тему", placeholder: "Выберите тему", labelWidth: 120, width: 530,
            options:  {
                filter: filter_combo,
                body: {
                    template:"#name#",
                    yCount: 10,
                    data: topics
                    }
                },
            },
        {view: "button", type:"icon", icon: 'plus', autoWidth: true, id: "add_topic", click: function(){
            webix.message('Будет добавление темы');
            }
            }
        ]},
    {view:"textarea", label:"Описание проблемы", name:"description", required: true, labelPosition:"top", labelWidth: 120,
        id: "n_desc", height: 130, invalidMessage: "Введите описание", placeholder: "Введите описание проблемы"},
    {cols:[
        {},
        {},
        {view:"button", value:"test", click: function(){
                var vv = $$("send_form").validate({disabled:false});
                console.log($$("send_form").getValues());
            }
            },
        {view:"button", value:"Отменить", click: function(){
            $$("send_form").config.point_ch = 1;
            $$("send_form").config.client_ch = 1;
            $$("pop_send_form").hide();
            $$("send_form").reconstruct();
            upd_points();
            $$('customer_point').getList().data.sync($$("points_dc"));
            }},
        {view:"button", id: "_send", value:"Отправить", click: function(){
            var vv = $$("send_form").validate({disabled:false});
            if (vv) submit();
            }, tooltip: "<Cnrl>+Enter"}
        ]
    }];

var send_form_body = {
    view:"form", 
    id:"send_form",
    width: 600,
    mass: 0,
    point_ch: 1,
    client_ch: 1,
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
            {view: "button", label: "OK", width: 100, id: "ok_but",click: function(){
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
    body: result_box,
    on: {
        onShow: function(id){
            $$("ok_but").focus();
            }
        }
    });

webix.ui({
    view: "popup",
    id: "pop_send_form",
    body: send_form_body,
    on: {
        onBeforeShow: function() {
            $$("_send").hotkey_setter("enter+ctrl");
            $$("_send").refresh();
            },
        onHide: function() {
            //console.log('hide');
            },
        onShow: function() {
            $$("send_form").focus("description");
            }
        }
    });

function submit(){
    $$("pop_send_form").hide();
    var data_send = $$("send_form").getValues()
    data_send['res_desc'] = 'Пока не решена';
    var params = {"put_apply": data_send};
    $$("send_form").reconstruct();
    request(req_url, params).then(function(data){
        var item = data.json()[0];
        if (item != "error") {
            if (item.mass) {
                $$("view_3").add(item, 0);
            } else {
                $$("view_2").add(item, 0);
            };
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


