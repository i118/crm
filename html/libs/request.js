"use strict";

function c_date() {
    var date = new Date();
    var format = webix.Date.dateToStr("%d.%m.%Y");
    date = format(date);
    return date;
    }

    
var new_point_elements;
var new_user_elements;


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
                data: alerts()
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
            required: true, placeholder: "Выберите клиента", width: 630, labelWidth: 120,
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
            $$("pop_new_customer_form").show();
            }
            }
        ]},
    {cols: [
        {view:"combo", label:"Точка", name:"client_point", id: 'customer_point', invalidMessage: "Выберите точку",
            required: true, placeholder: "Выберите точку", width: 630, labelWidth: 120,
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
                    var cli = $$("customer_new").getValue();
                    if (cli) {
                        $$("add_point").enable();
                    } else {
                        $$("add_point").disable();
                    };
                    if ($$("send_form").config.point_ch === 1) {
                        $$("send_form").config.client_ch = 0;
                        var c_po = $$("points_dc").getItem(rid).customer_id;
                        $$("customer_new").setValue(c_po);
                        $$("customer_new").refresh()
                    };
                    }
                }
            },
        {view: "button", type:"icon", icon: 'plus', autoWidth: true, id: "add_point", disabled: true, click: function(){
            $$("pop_new_point_form").show();
            }
            }
        ]},
    {cols: [
        {view:"combo", label:"Тема", id: "n_topic", name:"topic", required: true, value: 3,
            invalidMessage: "Выберите тему", placeholder: "Выберите тему", labelWidth: 120, width: 630,
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
                console.log(vv);
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

var new_customer_form = {
    view:"form", 
    id: "_new_customer",
    width: 700,
    rules:{
        "display_name": webix.rules.isNotEmpty,
        "full_name": webix.rules.isNotEmpty,
        "address": webix.rules.isNotEmpty,
        "inn":  webix.rules.isNotEmpty,
        "kpp":  webix.rules.isNotEmpty
        },
    elements: [
        {view:"text", label:"Отображаемое имя", name: "display_name", id: '_dname', invalidMessage: "Введите имя для отображения",
            placeholder: "Аптека", width: 730, labelWidth: 220, required: true},
        {view:"text", label:"Полное наименование организации", name: "full_name", id: '_fname', invalidMessage: "Введите полное название организации",
            placeholder: "ООО ХХХ", width: 730, labelWidth: 220, required: true},
        {view: "checkbox", label: "Клиент(аптека)", labelWidth: 220, id: '_cli', name: "client", value: true},
        {view: "checkbox", label: "Поставщик", labelWidth: 220, id: '_suppl', name: "supplier"},
        {view:"text", label:"Юридический адрес", name: "address", id: '_addr', invalidMessage: "Введите юридичесский адрес организации",
            placeholder: "Россия, г. Тула, пр. Ленина, 77, оф. 111", width: 730, labelWidth: 220, required: true},
        {view:"text", label:"ИНН организации", name: "inn", id: '_inn', invalidMessage: "Введите ИНН организации",
            placeholder: "2255448877", width: 730, labelWidth: 220, required: true},
        {view:"text", label:"КПП организации", name: "kpp", id: '_kpp', invalidMessage: "Введите КПП организации",
            placeholder: "2255448877", width: 730, labelWidth: 220, required: true},
        {view:"text", label:"ФИО директора", name: "director", id: '_dir', placeholder: "Петров Петр Петрович", width: 730, labelWidth: 220},
        {view:"text", label:"ФИО контактного лица", name: "contact", id: '_cont', placeholder: "Петров Петр Петрович", width: 730, labelWidth: 220},
        {view:"text", label:"Контактный телефон", name: "phone_num", id: '_phone', placeholder: "+7(XXX)XXX-XXXX", width: 730, labelWidth: 220},
        {view:"text", label:"Адрес электронной почты", name: "email", id: '_email', placeholder: "email@domain.ru", width: 730, labelWidth: 220},
        {cols: [
            {},
            {view:"button", value:"test", click: function(){
                let qq = $$("_new_customer").validate({disabled:false});
                console.log(qq);
                console.log($$("_new_customer").getValues());
                }
                },
            {view:"button", value:"Отменить", click: function(){
                $$("pop_new_customer_form").hide();
                $$("_new_customer").reconstruct();
                }
                },
            {view:"button", id: "_send_customer", value:"Отправить", click: function(){
                let qq = $$("_new_customer").validate({disabled:false});
                if (qq) {
                    let item = $$("_new_customer").getValues(); 
                    submit_new_customer(item);
                    };
                }
                }
            ]}
        ]
    };

var new_point_form = {
    view:"form", 
    id: "_new_point",
    rules:{
        "display_name": webix.rules.isNotEmpty,
        "full_name": webix.rules.isNotEmpty,
        "address": webix.rules.isNotEmpty,
        "phone_num":  webix.rules.isNotEmpty
        },
    elements: [
        {view:"text", label:"Клиент", name: "customer_id", id: '_c_id', width: 730, labelWidth: 220, disabled: true},
        {view:"text", label:"Отображаемое имя", name: "display_name", id: '_pdname', invalidMessage: "Введите имя для отображения",
            placeholder: "Аптека", width: 730, labelWidth: 220, required: true},
        {view:"text", label:"Полное наименование организации", name: "full_name", id: '_pfname', invalidMessage: "Введите полное название точки",
            placeholder: "ООО ХХХ", width: 730, labelWidth: 220, required: true},
        {view:"text", label:"Фактический адрес", name: "address", id: '_paddr', invalidMessage: "Введите фактический адрес точки",
            placeholder: "Россия, г. Тула, пр. Ленина, 77, оф. 111", width: 730, labelWidth: 220, required: true},
        {view:"text", label:"ФИО контактного лица", name: "contact", id: '_pcont', placeholder: "Петров Петр Петрович", width: 730, labelWidth: 220},
        {view:"text", label:"Контактный телефон", name: "phone_num", id: '_pphone', placeholder: "+7(XXX)XXX-XXXX", width: 730, labelWidth: 220,
            required: true, ivalidMessage: "Укажите телефон"},
        {view:"text", label:"Адрес электронной почты", name: "email", id: '_pemail', placeholder: "email@domain.ru", width: 730, labelWidth: 220},
        {view:"textarea", label:"Комментарий", name: "comment", id: '_pcom', placeholder: "Введите комментарий здесь", width: 730, labelWidth: 220,
            labelPosition:"top", height: 130},
        {cols: [
            {},
            {view:"button", value:"test", click: function(){
                let qq = $$("_new_point").validate({disabled:false});
                console.log($$("_new_point").getValues());
                }
                },
            {view:"button", value:"Отменить", click: function(){
                $$("pop_new_point_form").hide();
                $$("_new_point").reconstruct();
                }
                },
            {view:"button", id: "_send_point", value:"Отправить", click: function(){
                let qq = $$("_new_point").validate({disabled:false});
                if (qq) {
                    let item = $$("_new_point").getValues(); 
                    submit_new_point(item);
                    };
                }
                }
            ]}
        ]
    };
    
    
var send_form_body = {
    view:"form", 
    id:"send_form",
    width: 700,
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

var req_res = webix.ui({
    view: "popup",
    position:"center",
    id: "pop_result",
    modal: true,
    body: {
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
        },
    on: {
        onShow: function(id){
            $$("ok_but").focus();
            }
        }
    });

var new_c = webix.ui({
    view: "cWindow",
    modal: false,
    id: "pop_new_customer_form",
    body: new_customer_form,
    position: "center",
    on: {
        onBeforeShow: function() {
            },
        onShow: function() {
            }
        }
    });

var new_p = webix.ui({
    view: "cWindow",
    modal: false,
    id: "pop_new_point_form",
    body: new_point_form,
    position: "center",
    on: {
        onBeforeShow: function() {
            if ($$("pop_customers").isVisible()) {
                let name = $$("customers_dt").getSelectedItem().display_name;
                $$('_c_id').setValue(name);
            } else if ($$("pop_send_form").isVisible()) {
                let cc = $$("send_form").getValues().client;
                let name = $$("clients_dc").getItem(cc).display_name;
                $$('_c_id').setValue(name);
                };
            },
        onShow: function() {
            }
        }
    });

var new_r = webix.ui({
    view: "popup",
    modal: false,
    id: "pop_send_form",
    body: send_form_body,
    on: {
        onBeforeShow: function() {
            $$("_send").hotkey_setter("enter+ctrl");
            $$("_send").refresh();
            },
        onShow: function() {
            $$("send_form").focus("description");
            }
        }
    });

var submit_new_point = function (item) {
    $$("_new_point").hide();
    item["create_user"] = user;
    item["create_date"] = new Date();
    item["change_date"] = new Date();
    webix.message("добавление точки, доделать обновление списка точек");
    $$("_new_point").reconstruct();
    let params = {"put_point":item};
    item = request(req_url, params, !0).response
    //item = data.json()[0];
    console.log(item);
    };

var submit_new_customer = function (item) {
    $$("_new_customer").hide();
    item["create_user"] = user;
    item["create_date"] = new Date();
    item["change_date"] = new Date();
    webix.message("добавление клиента, доделать обновление списка клиентов");
    $$("_new_customer").reconstruct();
    let params = {"put_customer":item};
    item = request(req_url, params, !0)
    console.log(item);
    };

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


