"use strict";

var mass_apl = {id: "view_3", template: 'Массовые заявки'};

var customers_link = {template: "по нажатию кнопки будет переход на страницу 'Клиенты' (админка клиентов)"}
var vendors = {template: "по нажатию кнопки будет переход на страницу 'Поставщики'(админка поставщиков)"}
var knowbase = {template: "по нажатию кнопки будет переход на страницу 'База знаний'"}
var users_link = {template: "по нажатию кнопки будет переход на страницу 'Пользователи' (админка пользователей)"}

function add_str(data) {
    var len = data.toString(10).length;
    if (0 < len) data = data + " дн.";

    return data;
    }

var appl_form_var = [
    {cols: [
        {view: "text", labelPosition: "left", readonly: true, id: "appl_cre",
            label: "Создана", value: "10.10.1999"
            },
        {view: "text", labelPosition: "left", readonly: true, id: "appl_work",
            label: "В работе с", value: "10.10.1999"
            },
        {view: "text", labelPosition: "left", readonly: true, id: "appl_ch",
            label: "Последнее изменение", value: "10.10.1999"
            }
        ]},
    {cols: [
        {view: "text", labelPosition: "left", readonly: true, id: "appl_stat",
            label: "Статус", value: "Заведена"
            },
        {view: "text", labelPosition: "left", id: "appl_alert",
            label: "Приоритет", value: "Обычный"
            }
        ]},
    {view: "text", id: "appl_cli",
        label: "Организация", value: "Аптека"
        },
    {view: "text", id: "appl_point",
        label: "Точка", value: "точка за углом"
        },
    {cols: [
        {view: "text", readonly: true, id: "appl_author",
            label: "Автор запроса", value: "Овсянников"
            },
        {view: "text", id: "appl_ordered",
            label: "Назначен", value: "Овсянников"
            }
        ]},
    {view: "text", id: "appl_topic",
        label: "Тема", value: "Не работает"
        },
    {view: "textarea", height: 84, id: "appl_desc", 
        label: "Описание проблемы", value: "Жутко длинное описание проблемы"
        },
    {view: "textarea", height: 84, id: "appl_res_desc", 
        label: "Решение проблемы", value: "Пока не решено"
        }

    ];

var c_appl = {
    view: "fieldset",
    id: "appl_fs",
    label: "Заявка номер 44",
    body: {
        cols: [
            {rows: [
                {view: "form",
                    id:"appl_form",
                    width: 650,
                    //readonly: true,
                    disabled: true,
                    elementsConfig:{
                        labelWidth: 120,
                        labelPosition: "top"
                        },
                    elements: appl_form_var
                    },
                {cols: [
                    {},
                    {view:"button", type:"form", tooltip: "Нажать для редактирования заявки. пока недоступно", //disabled: true,
                        label: 'Редактировать', width: 120},
                    {view:"button", id: 'close_button', type:"form", 
                        label: 'Закрыть', width: 100}
                    ]}
            ]},
            {view: "list",
                id: "cli_apps_list",
                //data: clients,
                //height: 140,
                width: 350,
                type: {
                    css: 'f_list_cl',
                    height: "auto",
                    },
                navigation: true,
                scroll: true,
                template: "<div> <span class='f_list_cl'>Номер: </span> <span class='f_list_cl_txt'>#num#</span></div>" +
                          "<div> <span class='f_list_cl_2'>Дата: </span> <span class='f_list_cl_txt'>#create_date#</span></div>" +
                          "<div> <span class='f_list_cl_2'>Тема: </span> <span class='f_list_cl_txt'>#topic#</span></div>" +
                          "<div> <span class='f_list_cl_2'>Описание: </span> <span class='f_list_cl_txt'>#description#</span></div>" +
                          "<div> <span class='f_list_cl_2'>Решение: </span> <span class='f_list_cl_txt'>#result_desc#</span></div>"                          
                }
        ]}
    };


var complete = {
    view:"form", 
    id:"complete_form",
    width: 600,
    rules:{
        "c_description": webix.rules.isNotEmpty
        },
    elementsConfig:{
        labelWidth: 120
        },
    elements: [
        {view:"radio", id: "result_status",label:"Результат", value:1, labelPosition:"top", name: "c_success", options:[
            { id:1, value:"Успешно" },
            { id:0, value:"Полный провал" }
        ]},
        {view:"textarea", label:"Описание результата", name:"c_description", required: true, labelPosition:"top",
            id: "c_desc", height: 130, invalidMessage: "Введите описание", placeholder: "Введите описание результата"},
        {cols:[
            {},
            {},
            {view:"button", value:"Отменить", click: function(){
                $$("context_menu").hide();
                $$("complete_form").reconstruct();
                }},
            {view:"button", value:"Отправить", id: "send_result", hotkey: "s+ctrl", tooltip: "<Ctrl>+S"}
            ]}
        ]
    };

webix.protoUI({
    name:"activeDataTable" 
},webix.ui.datatable, webix.ActiveContent);

var history_appl = {id: "view_4", view: "activeDataTable",
    //select: true,
    navigation: "row",
    select: true,
    data: upd_history(),
    resizeColumn:true,
    fixedRowHeight:false,
    rowLineHeight:32,
    rowHeight:32,
    onContext: {},
    on:{
        onSubViewCreate:function(view, item){
            view.setValues(item);
            },
        onBeforeSelect: function(item) {
            this.addRowCss(item.id, "r_css");
            },
        onBeforeUnselect: function(item) {
            this.removeRowCss(item.id, "r_css");
            },
        onBeforeRender: function(d) {
            var data = d.order
            var format = webix.Date.strToDate("%d.%m.%Y");
            data.forEach(function(item, i, data) {
                var obj = d.getItem(item);
                var f_date = format(obj.change_date);
                obj.change_date = format(f_date);
                });
            }
        },
    columns:[
    { id:"num",
      sort: "int",
      css: "num_s",
      width: 85,
      header: [{text: "№ заявки", css: 'header_data'},
        {content:"textFilter"}
        ]
        },
    { id:"change_date",
      width: 105,
      format: webix.Date.dateToStr("%d.%m.%Y"),
      css: "date_s",
      sort:"date",
      header: [
        {text: "Дата", css: 'header_data'},
        {content: "datepickerFilter"}
        ]
    },
    { id:"client",
      fillspace: 2,
      width: 360,
      sort: "text",
      header:[
        {text: "Клиент", css: 'header_data'},
        {content:"textFilter"}],
        },
    { id:"topic",
      width: 225,
      fillspace: 1,
      header: [
        {text: "Тема", heigth: 18, css: 'header_data'},
        { content:"selectFilter", height: 18}
        ]}
    ]};



var my_appl = {id: "view_1", view: "activeDataTable",
    //select: true,
    navigation: "row",
    select: true,
    data: upd_my(),
    resizeColumn:true,
    fixedRowHeight:false,
    rowLineHeight:32,
    rowHeight:32,
    onContext: {},
    on:{
        onSubViewCreate:function(view, item){
            view.setValues(item);
            },
        onBeforeSelect: function(item) {
            this.addRowCss(item.id, "r_css");
            },
        onBeforeUnselect: function(item) {
            this.removeRowCss(item.id, "r_css");
            },
        onBeforeRender: function(d) {
            var data = d.order
            var format = webix.Date.strToDate("%d.%m.%Y");
            data.forEach(function(item, i, data) {
                var obj = d.getItem(item);
                var f_date = format(obj.change_date);
                obj.change_date = format(f_date);
                obj.$css = (obj.alert === "Высокий") ? "high_pr":
                           (obj.alert === "Средний") ? "med_pr":
                           (obj.alert === "Низкий") ? "low_pr":
                           "nothing";
                });
            }
        },
    columns:[
    { id:"num",
      sort: "int",
      css: "num_s",
      width: 85,
      header: [{text: "№ заявки", css: 'header_data'},
        {content:"textFilter"}
        ]
        },
    { id:"alert",
      width: 85,
      sort:"text",
      header: [
        {text: "Приоритет", css: 'header_data'},
        {content:"selectFilter"}
        ]
    },
    { id:"change_date",
      width: 105,
      format: webix.Date.dateToStr("%d.%m.%Y"),
      css: "date_s",
      sort:"date",
      header: [
        {text: "Дата", css: 'header_data'},
        {content: "datepickerFilter"}
        ]
    },
    { id:"status",
      width: 100,
      sort: "text",
      header: [
        {text: "Статус", css: 'header_data'},
        { content:"selectFilter"}
        ]},
    { id:"create_user",
      width: 145,
      sort: "text",
      header: [
        {text: "Создал", css: 'header_data'},
        { content:"selectFilter"}
        ]},
    { id:"client",
      fillspace: 2,
      width: 360,
      sort: "text",
      header:[
        {text: "Клиент", css: 'header_data'},
        {content:"textFilter"}],
        },
    { id:"in_work",
      width: 80,
      css: "num_s",
      sort: "int",
      format: add_str,
      header: [{text: "В работе", css: 'header_data'},
               {content: "numberFilter"}]
        },
    { id:"topic",
      width: 225,
      fillspace: 1,
      header: [
        {text: "Тема", heigth: 18, css: 'header_data'},
        { content:"selectFilter", height: 18}
        ]}
    ]}

var all_appl = {id: "view_2", view: "activeDataTable",
    select: true,
    //hover: "myhover",
    navigation: "row",
    select: true,
    data: upd_all(),
    //multiselect: true,
    resizeColumn:true,
    fixedRowHeight:false,
    rowLineHeight:32,
    rowHeight:32,
    onContext: {},
    on:{
        onBeforeSelect: function(item) {
            this.addRowCss(item.id, "r_css");
            },
        onBeforeUnselect: function(item) {
            this.removeRowCss(item.id, "r_css");
            },
        onBeforeRender: function(d) {
            var data = d.order
            var format = webix.Date.strToDate("%d.%m.%Y");
            data.forEach(function(item, i, data) {
                var obj = d.getItem(item);
                var f_date = format(obj.change_date);
                obj.change_date = format(f_date);
                obj.$css = (obj.alert === "Высокий") ? "high_pr":
                           (obj.alert === "Средний") ? "med_pr":
                           (obj.alert === "Низкий") ? "low_pr":
                           "nothing";
                });
            },
        "onresize": webix.once(function(){ 
            //this.adjustRowHeight();
            })
        },
    scheme: {
        $init: function(obj){
            //obj.$css = (obj.alert === "Высокий") ? "high_pr":
                       //(obj.alert === "Средний") ? "med_pr":
                       //(obj.alert === "Низкий") ? "low_pr":
                       //"nothing";


            //obj - data object from incoming data
            //obj.count = obj.cells[0]; //set value based on some data in incoming dataset
            //obj.price = obj.cells[1];
            //obj.total = obj.price * obj.count;   //or calculate values on the fly
            }
        },
    columns:[
    { id:"num",
      sort: "int",
      css: "num_s",
      //cssFormat: shrink, 
      width: 85,
      header: [{text: "№ заявки", css: 'header_data'},
        {content:"textFilter"}
        ]
        },
    { id:"alert",
      width: 85,
      sort:"text",
      header: [
        {text: "Приоритет", css: 'header_data'},
        {content:"selectFilter"}
        ]
    },
    { id:"change_date",
      width: 105,
      format: webix.Date.dateToStr("%d.%m.%Y"),
      css: "date_s",
      sort:"date",
      header: [
        {text: "Дата", css: 'header_data'},
        {content: "datepickerFilter"}
        ]
    },
    { id:"status",
      width: 100,
      sort: "text",
      header: [
        {text: "Статус", css: 'header_data'},
        { content:"selectFilter"}
        ]},
    { id:"create_user",
      width: 145,
      sort: "text",
      header: [
        {text: "Создал", css: 'header_data'},
        { content:"selectFilter"}
        ]},
    { id:"ordered",
      width: 145,
      sort: "text",
      header: [
        {text: "Назначен", css: 'header_data'},
        { content:"selectFilter"}
        ]},
    { id:"client",
      fillspace: 2,
      width: 360,
      sort: "text",
      header:[
        {text: "Клиент", css: 'header_data'},
        {content:"textFilter"}],
        },
    { id:"in_work",
      width: 80,
      css: "num_s",
      format: add_str,
      //template: "<div>#in_work# дн.</div>",
      sort: "int",
      header: [{text: "В работе", css: 'header_data'},
               {content: "numberFilter"}]
        },
    { id:"topic",
      width: 225,
      fillspace: 1,
      header: [
        {text: "Тема", heigth: 18, css: 'header_data'},
        { content:"selectFilter", height: 18}
        ]}
    ]}


var view_cells = [
            {header: 'Мои заявки', body: my_appl},
            {header: 'Все заявки', body: all_appl},
            {header: 'Массовые заявки', body: mass_apl},
            {header: 'История заявок', body: history_appl}
            ];

var buttons = [
    {view:"button", id: '_new_button', type:"imageButton", popup: "pop_send_form", image: './libs/img/add.svg',
        label: 'Новая заявка', width: 140, tooltip: "Создание новой заявки, <Shift>+A", hotkey: "a+shift"},//ctrl"},
    {view:"button", id: '_vendors', type:"form", popup: "pop_vendors_form",
        label: 'Поставщики', width: 120, tooltip: "Список поставщиков"},
    {view:"button", id: '_customers', type:"form", popup: "pop_customers_form",
        label: 'Клиенты', width: 120, tooltip: "Список клиентов"},
    {view:"button", id: '_users', type:"form", popup: "pop_users_form",
        label: 'Пользователи', width: 120, tooltip: "Админка пользователей"},
    {view:"button", id: '_knowledge_base', type:"form", popup: "pop_knowbase_form",
        label: 'База знаний', width: 120, tooltip: "Наиболее частые проблемы и их решения"},
    {},
    {view:"button", id: "_refresh", type:"imageButton", image: './libs/img/sync.svg',
        label: "Обновить заявки", width: 160},
    {view:"button", id: "_filters", type:"imageButton", image: './libs/img/filter.svg',
        label: "Сбросить фильтры", width: 180},
    {view:"button", id: "_excel", type:"imageButton", image: './libs/img/excel.svg',
        label: "Экспорт в Excel", width: 180}
    ];

var buttons_2floor = [
    {view:"button", id: '_to_work', type:"form", height: 35,
        label: 'Взять в работу', width: 150},
    {view:"button", id: '_order', type:"form", height: 35, popup: "pop_ch_users_list",
        label: 'Назначить', width: 150},
    {view:"button", id: '_ch_alert', type:"form", height: 35, popup: "pop_ch_alert_list",
        label: 'Сменить приоритет', width: 150},
    {view:"button", id: '_complete', type:"form", popup: "pop_complete_form", height: 35,
        label: 'Выполненно', width: 150},
    {view:"button", id: '_archive', type:"form", height: 35,
        label: 'В архив', width: 150},
    {view:"button", id: '_delete', type:"form", height: 35,
        label: 'Удалить', width: 150}
    ];

var bottom = [
    {template: 'Вы находитесь на сервере: ' + '&nbsp;<span class="serv_info">' + location.hostname + "</span>",
        height: 30, id: "foot1"},
    {}
];

//functions

function get_current_view() {
    var hide1 = $$("view_1").isVisible();
    var hide2 = $$("view_2").isVisible();
    var hide3 = $$("view_3").isVisible();
    var hide4 = $$("view_4").isVisible();
    var c_view = (hide1) ? "view_1":
               (hide2) ? "view_2":
               (hide3) ? "view_3":
               "view_4";
    return c_view;
    };

function shrink(value, config) {
    var ret = (value > 999) ? {"font-size":"95%", "padding-left": "5px !important"}:
              (value > 9999) ? {"font-size":"85%", "padding-left": "2px !important"}:
              value;
    return ret;
};

function set_appl_info(item) {
    $$("appl_fs").label_setter('Заявка номер ' + item.num);
    $$("appl_cre").setValue(item.create_date);
    $$("appl_work").setValue(item.to_work_date);
    $$("appl_ordered").setValue(item.ordered);
    $$("appl_ch").setValue(item.change_date.toLocaleDateString());
    $$("appl_stat").setValue(item.status);
    $$("appl_alert").setValue(item.alert);
    $$("appl_cli").setValue(item.client);
    $$("appl_point").setValue("Неизвестная точка за углом");
    $$("appl_author").setValue(item.create_user);
    $$("appl_topic").setValue(item.topic);
    $$("appl_desc").setValue(item.description);
    console.log(item.res_desc);
    $$("appl_res_desc").setValue(item.res_desc);
    $$("appl_form").refresh();
    }

function open_appl(view, id) {
    var c_item = view.getSelectedItem();
    set_appl_info(c_item);
    $$("pop_application").show();
    };

//main ui's
webix.ui({
    id: "main_ui",
    view: 'layout',
    rows:[
        {view: 'toolbar',
        css: 'header_css',
        cols: [
            {view: "label", label: "<a href='http://ms71.org'><span class='ms-logo'></span></a>",
                width: 60, align: 'center', height: 36},
            {view: "label", label: "Манускрипт солюшн: CRM", css: 'ms-logo-text'
                },
            {},
            {view: "label", label: "Пользователь: " + user, css: 'user-text', width: 250
                },
            {view:"button", id: "_logout", type:"form",
                label: 'Выйти', width: 120, click: function() {
                    deleteCookie('user');
                    deleteCookie('admin');
                    deleteCookie('auth_key');
                    location.reload();
                    }
                }
            ]},
        {cols: [
            {},
            //{rows: buttons_2floor},
            {rows: [
                {height: 36, cols:buttons},
                {view: "tabview",
                    width: 1280,
                    id:"tabview1",
                    animate:false,
                    cells: view_cells,
                    multiview: true
                    }
                ]},
            {}
            ]},
        {cols: bottom}
        ]
    });

webix.ui({
    view:"context",
    id:"context_menu",
    on: {
        onShow: function(event) {
            var cv = get_current_view();
            var sid = $$(cv).getSelectedId();
            if (!sid) {
                this.hide();
            } else {
                var item = $$(cv).getSelectedItem();
                if (admin) {
                    $$('_order').enable();
                    $$('_archive').enable();
                    $$('_delete').enable();
                } else {
                    $$('_order').disable();
                    $$('_archive').disable();
                    $$('_delete').disable();
                };
                if (item.status === 'Назначена') {
                    $$('_to_work').enable();
                } else {
                    $$('_to_work').disable();
                };
                if (item.status === 'Решено' || item.status === 'Не решено') {
                    $$('_to_work').enable();
                    $$('_complete').disable();
                    $$('_order').disable();
                    $$('_ch_alert').disable();
                } else {
                    $$('_complete').enable();
                    $$('_order').enable();
                    $$('_ch_alert').enable();
                };

                //console.log(item)
                //webix.message('selected')
            };
            }
        },
    body: {
        view: 'toolbar',
        //height: 150,
        rows: buttons_2floor
        }
    });

$$("context_menu").attachTo($$("view_2"));
$$("context_menu").attachTo($$("view_1"));


webix.ui({
    view: "popup",
    id: "pop_knowbase_form",
    body: knowbase
    });

webix.ui ({
    view: "popup",
    id: "pop_complete_form",
    body: complete,
    on: {
        "onShow": function(id){
            $$("complete_form").focus("c_description");
            }
        }
    });

webix.ui({
    view: "popup",
    autofit: true,
    header: "текущая заяка",
    id: "pop_application",
    position:"center",
    //height:600,
    //width:800,
    //modal:true,
    move:true,
    body: c_appl
    });

webix.ui({
    view: "popup",
    id: "pop_customers_form",
    body: customers_link
    });

webix.ui({
    view: "popup",
    id: "pop_users_form",
    body: users_link
    });

webix.ui({
    view: "popup",
    id: "pop_ch_alert_list",
    body: {
        view: "list",
        id: "ch_alert_list",
        data: alerts,
        height: 140,
        width: 100,
        navigation: true,
        scroll: false,
        template: "#name#"
        }
    });

webix.ui({
    view: "popup",
    id: "pop_ch_users_list",
    body: {
        view: "list",
        id: "ch_users_list",
        data: users,
        height: 240,
        width: 140,
        navigation: true,
        //scroll: false,
        template: "#display_name#"
        }
    });


webix.ui({
    view: "popup",
    id: "pop_vendors_form",
    body: vendors
    });


webix.ui({
    view: "popup",
    id: "pop_send_form",
    body: send_form_body
    });

//elemnts attachs

$$('_order').attachEvent("onItemClick", function(){
    var cv = get_current_view();
    var item = $$(cv).getSelectedItem();
    if (!item) {
        $$("context_menu").hide();
    }
    });

$$("ch_users_list").attachEvent("onItemClick", function(i_id, ev, val){
    var ordered = $$("users_dc").getItem(i_id).display_name;
    var cv = get_current_view();
    var item = $$(cv).getSelectedItem();
    var id = $$(cv).getSelectedId();
    item["ordered"] = ordered; //новое значение
    item["status"] = "Назначена"; //новое значение
    item["change_date"] = new Date(); //новое значение
    $$("context_menu").hide();
    var params = {"update_row": item};
    request(req_url, params).then(function(data){
    //webix.ajax().post(req_url, params, function(text, data){
        item = data.json()[0];
        $$(cv).updateItem(id, item)
        $$(cv).unselectAll();
        upd_views();
        });
    });

$$('_to_work').attachEvent("onItemClick", function(){
    var cv = get_current_view();
    var item = $$(cv).getSelectedItem();
    var id = $$(cv).getSelectedId();
    $$("context_menu").hide();
    if (item) {
    item["status"] = "В работе"; //новое значение
    item["change_date"] = new Date(); //новое значение
    item["to_work_date"] = new Date(); //новое значение
    var params = {"update_row": item};
    request(req_url, params).then(function(data){
    //webix.ajax().post(req_url, params, function(text, data){
        item = data.json()[0];
        $$(cv).updateItem(id, item)
        $$(cv).unselectAll();
        upd_views();
        });
    }
    });

$$('_ch_alert').attachEvent("onItemClick", function(){
    var cv = get_current_view();
    var item = $$(cv).getSelectedItem();
    if (!item) {
        $$("context_menu").hide();
    }
    });

$$("ch_alert_list").attachEvent("onItemClick", function(i_id, ev, val){
    var alert = $$("alerts_dc").getItem(i_id).name;
    var cv = get_current_view();
    var item = $$(cv).getSelectedItem();
    var id = $$(cv).getSelectedId();
    item["change_date"] = new Date(); //новое значение
    item["alert"] = alert; //новое значение
    $$("context_menu").hide();
    var params = {"update_row": item};
    request(req_url, params).then(function(data){
    //webix.ajax().post(req_url, params, function(text, data){
        item = data.json()[0];
        $$(cv).updateItem(id, item)
        $$(cv).unselectAll();
        upd_views();
        });
    });

$$('_archive').attachEvent("onItemClick", function(){
    $$("context_menu").hide();
    var cv = get_current_view();
    var item = $$(cv).getSelectedItem();
    var id = $$(cv).getSelectedId();
    if (item) {
    item["change_date"] = new Date(); //новое значение
    item["archived"] = true;
    var params = {"update_row": item};
    request(req_url, params).then(function(data){
    //webix.ajax().post(req_url, params, function(text, data){
        item = data.json()[0];
        $$(cv).remove(id);
        $$(cv).unselectAll();
        upd_views();
        });
    }
    });

$$('_delete').attachEvent("onItemClick", function(){
    $$("context_menu").hide();
    var cv = get_current_view();
    var item = $$(cv).getSelectedItem();
    var id = $$(cv).getSelectedId();
    if (item) {
    item["change_date"] = new Date(); //новое значение
    item["deleted"] = true;
    var params = {"update_row": item};
    request(req_url, params).then(function(data){
    //webix.ajax().post(req_url, params, function(text, data){
        item = data.json()[0];
        $$(cv).remove(id);
        $$(cv).unselectAll();
        upd_views();
        });
    }
    });

$$("view_2").attachEvent("onBeforeFilter", function(id, value, config){
    if (id==='change_date') {
        //console.log(id);
        //console.log(value);
        //console.log(config);
    }
    })


$$('_complete').attachEvent("onItemClick", function(){
    var cv = get_current_view();
    var item = $$(cv).getSelectedItem();
    if (!item) {
        $$("context_menu").hide();
    }
    });

$$("send_result").attachEvent("onItemClick", function(){
    var vl = $$("c_desc").validate();
    if (vl) {
        var cv = get_current_view();
        var item = $$(cv).getSelectedItem();
        var id = $$(cv).getSelectedId();
        var form_values = $$("complete_form").getValues();
        $$("pop_complete_form").hide();
        $$("context_menu").hide();
        item["change_date"] = new Date(); //новое значение
        item['status'] = (form_values['c_success'] === 1) ? "Решено":
            "Не решено";
        item['res_desc'] = form_values['c_description'];
        console.log(item['res_desc']);
        $$("complete_form").reconstruct();
        var params = {"update_row": item};
        request(req_url, params).then(function(data){
        //webix.ajax().post(req_url, params, function(text, data){
            item = data.json()[0];
            $$(cv).updateItem(id, item)
            $$(cv).unselectAll();
            upd_views();
            });
    };
    });

$$("pop_application").attachEvent("onBeforeShow", function(item, e){
    var data = upd_cli_apps();
    $$("cli_apps_list").data.sync(data);
    });

$$("pop_application").attachEvent("onHide", function(){
    var cv = get_current_view();
    $$(cv).getSelectedId();
    });

$$("view_1").attachEvent("onItemDblClick", function(id, e){
    open_appl($$("view_1"));
    });

$$("view_2").attachEvent("onItemDblClick", function(id, e){
    open_appl($$("view_2"));
    });

$$("view_1").attachEvent("onKeyPress", function(code, e){
    if (13 === code) {
        //var ci = $$("view_1").getSelectedItem();
        open_appl($$("view_1"));
    }
    });

$$("view_2").attachEvent("onKeyPress", function(code, e){
    if (13 === code) {
        //var ci = $$("view_2").getSelectedItem();
        open_appl($$("view_2"));
    }
    });

$$("close_button").attachEvent("onItemClick", function(){
    $$("pop_application").hide();
    });

$$("_filters").attachEvent("onItemClick", function(){
    webix.message('Пока работает не так, как надо. Чуть позже исправим.');
    var cv = get_current_view();
    var columns = $$(cv)._columns
    columns.forEach(function(item, i, data) {
        $$(cv).refreshFilter(item.id);
        $$(cv).filter(item.id,"");
        });
    });

$$("_excel").attachEvent("onItemClick", function(){
    var cv = get_current_view();
    webix.toExcel($$(cv), {
        filename: "requests", // for filename
        name: "requests" // for sheet nam
        });
    //экспорт в pdf
    //webix.toPdf($$(cv), {
        //filename: "requests", // for filename
        //});
    });


$$("_refresh").attachEvent("onItemClick", function(){
    upd_my();
    upd_all();
    //upd_mass();
    upd_history();
    $$("view_1").parse($$("my_upd"));
    $$("view_2").parse($$("all_upd"));
    //$$("view_3").parse($$("mass_upd"));
    $$("view_4").parse($$("hist_upd"));
    });

function upd_views() {
    var cv = get_current_view();
    if (cv === "view_1") {
        upd_all();
        $$("view_2").parse($$("all_upd"));
        upd_history();
        $$("view_4").parse($$("hist_upd"));
    } else if (cv === "view_2"){
        upd_my();
        $$("view_1").parse($$("my_upd"));
        upd_history();
        $$("view_4").parse($$("hist_upd"));
    }
    };

