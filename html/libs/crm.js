"use strict";

var vendors = {template: "по нажатию кнопки будет переход на страницу 'Поставщики'(админка поставщиков)"}
var knowbase = {template: "по нажатию кнопки будет переход на страницу 'База знаний'"}

function add_str(data) {
    var len = data.toString(10).length;
    if (0 < len) data = data + " дн.";
    return data;
    };

var dt_formating = function (d) {
    var data = d.order;
    var format = webix.Date.strToDate("%d.%m.%Y");
    data.forEach(function(item, i, data) {
        var obj = d.getItem(item);
        var f_date = format(obj.change_date);
        obj.change_date = format(f_date);
        obj.$css = (obj.alert === prior[0]) ? "high_pr":
                   (obj.alert === prior[1]) ? "med_pr":
                   (obj.alert === prior[3]) ? "low_pr":
                   "nothing";
        });
    };
    
var _appl_from_mass = [
                    { label:"Информация о заявке", type:"label" },
                    { label:"В работе с", type:"text", id:"to_work_date"},
                    { label:"Последнее изменение", type:"text", id:"change_date"},
                    { label:"Статус", type:"text", id:"status"},
                    { label:"Приоритет", type:"text", id:"alert"},
                    { label:"Автор запроса", type:"text", id:"create_user"},
                    { label:"Назначен", type:"text", id:"ordered"},
                    { label:"Тема", type:"text", id:"topic"},
                ]

var mass_appl = {
    view: "fieldset",
    id: "appl_mass_fs",
    label: "Заявка номер 45",
    body: {
        cols: [
            {rows: [
                {view: "property", id: "request_prop",
                    complexData:true,
                    disabled: true,
                    width: 500,
                    height: 200,
                    nameWidth: 160,
                    elements: _appl_from_mass
                    },
                {view: "textarea", id: "_app_desc", disabled: true,
                    label:"Описание проблемы", labelPosition: "top", height: 180},
                {view: "textarea", id: "_app_res_desc", disabled: true,
                    label:"Решение проблемы", labelPosition: "top", height: 180},
                {},
                {cols: [
                    {},
                    {view:"button", type:"imageButton", image: './libs/img/edit.svg', tooltip: "Нажать для редактирования заявки. пока недоступно", //disabled: true,
                        label: 'Редактировать', width: 160},
                    {view:"button", id: 'close_button_mass', type:"imageButton", image: './libs/img/cancel.svg', 
                        label: 'Закрыть', width: 100}
                    ]}
            ]},
            {rows: [
                {view: "property",
                    disabled: true,
                    height: 24,
                    elements: [{ label:"История заявок по теме", type:"label" },]
                    },
                {view: "list",
                    id: "topic_mass_list",
                    width: 550,
                    tooltip: {
                        template: "<div> <span class='f_list_cl_2'>Описание: </span> <span class='f_list_cl_txt'>#description#</span></div>" +
                              "<div> <span class='f_list_cl_2'>Решение: </span> <span class='f_list_cl_txt'>#result_desc#</span></div>"
                        },
                    type: {
                        css: 'f_list_cl',
                        height: "auto",
                        },
                    navigation: true,
                    scroll: true,
                    template: "<div> <span class='f_list_cl'>Заявка номер: </span> <span class='f_list_cl_txt'>#num#</span>  <span class='f_list_cl_2'>от: </span> <span class='f_list_cl_txt'>#create_date#</span></div>" +
                              "<div> <span class='f_list_cl_2'>Описание: </span> <span class='f_list_cl_txt'>#description#</span></div>" +
                              "<div> <span class='f_list_cl_2'>Решение: </span> <span class='f_list_cl_txt'>#result_desc#</span></div>"
                }
                ]}
        ]
        }
    };

var _appl_from_var = [
                    { label:"Информация о заявке", type:"label" },
                    { label:"В работе с", type:"text", id:"to_work_date"},
                    { label:"Последнее изменение", type:"text", id:"change_date"},
                    { label:"Статус", type:"text", id:"status"},
                    { label:"Приоритет", type:"text", id:"alert"},
                    { label:"Организация", type:"text", id:"client"},
                    { label:"Точка", type:"text", id:"point"},
                    { label:"Автор запроса", type:"text", id:"create_user"},
                    { label:"Назначен", type:"text", id:"ordered"},
                    { label:"Тема", type:"text", id:"topic"},
                ]

var c_appl = {
    view: "fieldset",
    id: "appl_fs",
    label: "Заявка номер 44",
    body: {
        cols: [
            {rows: [
                {view: "property", id: "request_prop_1",
                    complexData:true,
                    disabled: true,
                    width: 500,
                    height: 246,
                    nameWidth: 160,
                    elements: _appl_from_var
                    },
                {view: "textarea", id: "_app_desc_1", disabled: true,
                    label:"Описание проблемы", labelPosition: "top", height: 180},
                {view: "textarea", id: "_app_res_desc_1", disabled: true,
                    label:"Решение проблемы", labelPosition: "top", height: 180},
                {},
                {cols: [
                    {},
                    {view:"button", type:"imageButton", image: './libs/img/edit.svg', tooltip: "Нажать для редактирования заявки. пока недоступно", //disabled: true,
                        label: 'Редактировать', width: 160},
                    {view:"button", id: 'close_button', type:"imageButton", image: './libs/img/cancel.svg',
                        label: 'Закрыть', width: 100}
                    ]}
            ]},
            {rows: [
                {view: "property",
                    disabled: true,
                    height: 24,
                    elements: [{ label:"История заявок по клиенту", type:"label" },]
                    },
                {view: "list",
                    id: "cli_apps_list",
                    width: 550,
                    tooltip: {
                        template: "<div> <span class='f_list_cl_2'>Описание: </span> <span class='f_list_cl_txt'>#description#</span></div>" +
                              "<div> <span class='f_list_cl_2'>Решение: </span> <span class='f_list_cl_txt'>#result_desc#</span></div>"
                        },
                    type: {
                        css: 'f_list_cl',
                        height: "auto",
                        },
                    navigation: true,
                    scroll: true,
                    template: "<div> <span class='f_list_cl'>Заявка номер: </span> <span class='f_list_cl_txt'>#num#</span>  <span class='f_list_cl_2'>от: </span> <span class='f_list_cl_txt'>#create_date#</span>        </div>" +
                              "<div> <span class='f_list_cl_2'>Тема: </span> <span class='f_list_cl_txt'>#topic#</span></div>" +
                              "<div> <span class='f_list_cl_2'>Описание: </span> <span class='f_list_cl_txt'>#description#</span></div>" +
                              "<div> <span class='f_list_cl_2'>Решение: </span> <span class='f_list_cl_txt'>#result_desc#</span></div>"                          
                    }
                ]}
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
            {view:"button", value:"Отправить", id: "send_result" , tooltip: "<Ctrl>+Enter"}
            ]}
        ]
    };

webix.protoUI({
    name:"activeDataTable" 
},webix.ui.datatable, webix.ActiveContent);

function oneForAll(value, filter, obj){
    if (obj.point.toString().toLowerCase().indexOf(filter) != -1) return true;
    if (obj.client.toString().toLowerCase().indexOf(filter)!= -1) return true;
    return false;
    }



var mass_apl = {id: "view_3", view: "datatable",
    navigation: "row",
    select: true,
    data: upd_mass(),
    resizeColumn:true,
    fixedRowHeight:false,
    rowLineHeight:32,
    rowHeight:row_height,
    onContext: {},
    on:{
        onBeforeSelect: function(item) {
            this.addRowCss(item.id, "r_css");
            },
        onBeforeUnselect: function(item) {
            this.removeRowCss(item.id, "r_css");
            },
        onBeforeRender: dt_formating
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
      width: 90,
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
    { id:"description",
      fillspace: 2,
      width: 360,
      sort: "text",
      header:[
        {text: "Описание", css: 'header_data'},
        {content:"textFilter"}],
        },
    { id:"in_work",
      width: 80,
      css: "num_s",
      format: add_str,
      sort: "int",
      header: [{text: "В работе", css: 'header_data'},
               {content: "numberFilter"}]
        },
    { id:"topic",
      width: 225,
      fillspace: 1,
      header: [
        {text: "Тема", css: 'header_data'},//, heigth: 18},
        { content:"selectFilter"}//, height: 18}
        ]}
    ]}


var history_appl = {id: "view_4", view: "datatable",
    navigation: "row",
    select: true,
    data: upd_history(),
    resizeColumn:true,
    fixedRowHeight:false,
    rowLineHeight:32,
    rowHeight:row_height,
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
    { id:"point",
      fillspace: 2,
      width: 360,
      sort: "text",
      header:[
        {text: "Точка / Клиент", css: 'header_data'},
        {content:"textFilter", compare: oneForAll}],
      template: "#point#" + " / " + "#client#"
        },
    { id:"topic",
      width: 225,
      fillspace: 1,
      header: [
        {text: "Тема", heigth: 18, css: 'header_data'},
        { content:"selectFilter", height: 18}
        ]}
    ]};

var my_appl = {id: "view_1", view: "datatable",
    navigation: "row",
    select: true,
    data: upd_my(),
    resizeColumn:true,
    fixedRowHeight:false,
    rowLineHeight:32,
    rowHeight:row_height,
    onContext: {},
    on:{
        onBeforeSelect: function(item) {
            this.addRowCss(item.id, "r_css");
            },
        onBeforeUnselect: function(item) {
            this.removeRowCss(item.id, "r_css");
            },
        onBeforeRender: dt_formating
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
      width: 90,
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
        //{content: "dateRangeFilter"}
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
    { id:"point",
      fillspace: 2,
      width: 360,
      sort: "text",
      header:[
        {text: "Точка / Клиент", css: 'header_data'},
        {content:"textFilter", compare: oneForAll}],
        template: "#point#" + " / " + "#client#"
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
    navigation: "row",
    select: true,
    data: upd_all(),
    resizeColumn:true,
    fixedRowHeight:false,
    rowLineHeight:32,
    rowHeight:row_height,
    onContext: {},
    on:{
        onBeforeSelect: function(item) {
            this.addRowCss(item.id, "r_css");
            },
        onBeforeUnselect: function(item) {
            this.removeRowCss(item.id, "r_css");
            },
        onBeforeRender: dt_formating
        },
    columns:[
    { id:"num",
      sort: "int",
      css: "num_s",
      //cssFormat: shrink1, 
      width: 85,
      header: [{text: "№ заявки", css: 'header_data'},
        {content:"textFilter"}
        ]
        },
    { id:"alert",
      width: 90,
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
    { id:"point",
      fillspace: 2,
      width: 360,
      sort: "text",
      header:[
        {text: "Точка / Клиент", css: 'header_data'},
        {content:"textFilter", compare: oneForAll}],
        template: "#point#" + " / " + "#client#"
        },
    { id:"in_work",
      width: 80,
      css: "num_s",
      format: add_str,
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
        label: 'Новая заявка', width: 140, tooltip: "Создание новой заявки, <Ctrl>+A", hotkey: "a+ctrl"},
    //{view:"button", id: '_vendors', type:"imageButton", popup: "pop_vendors_form", image: './libs/img/supplies.svg',
        //label: 'Поставщики', width: 130, tooltip: "Список поставщиков"},
    {view:"button", id: '_customers', type:"imageButton", image: './libs/img/customers.svg', //popup: "pop_customers_form", 
        label: 'Контрагенты', width: 130, tooltip: "Список контрагентов", click: function() { $$("pop_customers").show()}},
    {view:"button", id: '_users', type:"imageButton", image: './libs/img/admin.svg', click: function() { $$("pop_options").show()},//popup: "pop_options",//popup: "pop_users_form",
        label: 'Настройки', width: 130, tooltip: "Админка настроек"},
    {view:"button", id: '_knowledge_base', type:"imageButton", popup: "pop_knowbase_form", image: './libs/img/kn_base.svg',
        label: 'База знаний', width: 130, tooltip: "Наиболее частые проблемы и их решения"},
    {},
    {view:"button", id: "_refresh", type:"imageButton", image: './libs/img/sync.svg',
        label: "Обновить заявки", width: 160, tooltip: "Синхронизация с сервером"},
    {view:"button", id: "_filters", type:"imageButton", image: './libs/img/filter.svg',
        label: "Сбросить фильтры", width: 170},
    {view:"button", id: "_excel", type:"imageButton", image: './libs/img/excel.svg',
        label: "Экспорт в Excel", width: 160}
    ];

var buttons_2floor = [
    {view:"button", id: '_to_work', type:"form", height: 35,
        label: 'Взять в работу', width: 150},
    {view:"button", id: '_order', type:"form", height: 35, popup: "pop_ch_users_list",
        label: 'Назначить', width: 150, click: function(){
            var cv = get_current_view();
            var item = $$(cv).getSelectedItem();
            if (!item) {
                $$("context_menu").hide();
            }}
        },
    {view:"button", id: '_ch_alert', type:"form", height: 35, popup: "pop_ch_alert_list",
        label: 'Сменить приоритет', width: 150, click: function(){
            var cv = get_current_view();
            var item = $$(cv).getSelectedItem();
            if (!item) {
                $$("context_menu").hide();
            }}
        },
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
    var c_view = ($$("view_1").isVisible()) ? "view_1":
                 ($$("view_2").isVisible()) ? "view_2":
                 ($$("view_3").isVisible()) ? "view_3":
                 "view_4";
    return c_view;
    };

function shrink1(value, config) {
    var ret = (value > 999) ? {"font-size":"95%", "padding-left": "5px !important"}:
              (value > 9999) ? {"font-size":"85%", "padding-left": "2px !important"}:
              value;
    return ret;
};


function set_m_appl_info(item) {
    $$("appl_mass_fs").label_setter('Заявка номер ' + item.num + ' от ' + item.create_date);
    $$("request_prop").parse(item);
    $$("request_prop").refresh();
    $$("_app_desc").setValue(item.description);
    $$("_app_desc").refresh();
    $$("_app_res_desc").setValue(item.res_desc);
    $$("_app_res_desc").refresh();
    }


function set_appl_info(item) {
    $$("appl_fs").label_setter('Заявка номер ' + item.num + ' от ' + item.create_date);
    $$("request_prop_1").parse(item);
    $$("request_prop_1").refresh();
    $$("_app_desc_1").setValue(item.description);
    $$("_app_desc_1").refresh();
    $$("_app_res_desc_1").setValue(item.res_desc);
    $$("_app_res_desc_1").refresh();
    }


function open_appl(view, id) {
    var num = view.getSelectedItem().num;
    var params = {"get_item": num};
    var item = request(req_url, params, !0).response
    item = JSON.parse(item)[0];
    if (view.config.id === "view_3") {
        set_m_appl_info(item);
        $$("pop_m_application").show();
    } else if (view.config.id === "view_4"){
        //set_h_appl_info(item);
        //$$("pop_h_application").show();
    } else {
        set_appl_info(item);
        $$("pop_application").show();
    }
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
            {view:"button", id: "_logout", type:"imageButton", image: './libs/img/exit.svg',
                label: 'Выйти', width: 100, click: function() {
                    deleteCookie('user');
                    deleteCookie('admin');
                    deleteCookie('auth_key');
                    location.reload();
                    }
                }
            ]},
        {cols: [
            {},
            {rows: [
                {height: 36, cols:buttons},
                {view: "tabview",
                    width: document.documentElement.clientWidth,
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
    id:"context_arch",
    width: 186,
    height: 60,
    on: {
        onBeforeShow: function(i){
            var row = i.srcElement.attributes[1].value - 1;
            var cv = get_current_view();
            var qq = $$(cv).getIdByIndex(row);
            $$(cv).select(qq);
            },
        onShow: function(event) {
            var cv = get_current_view();
            var sid = $$(cv).getSelectedId();
            if (!sid) this.hide();
            }
        },
    body: //{
        
        //view: 'toolbar',
        //rows: [
            {view: 'button', id: "_return", height: 35, width: 156,
                label: "Вернуть из архива"
                }
            //]
        //}
    });


webix.ui({
    view:"context",
    id:"context_menu",
    on: {
        onBeforeShow: function(i){
            var row = i.srcElement.attributes[1].value - 1;
            var cv = get_current_view();
            var qq = $$(cv).getIdByIndex(row);
            $$(cv).select(qq);
            },
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
            };
            }
        },
    body: {
        view: 'toolbar',
        rows: buttons_2floor
        }
    });

$$("context_menu").attachTo($$("view_3"));
$$("context_menu").attachTo($$("view_2"));
$$("context_menu").attachTo($$("view_1"));
$$("context_arch").attachTo($$("view_4"));


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
        onBeforeShow: function() {
            $$("send_result").hotkey_setter("enter+ctrl");
            $$("send_result").refresh();
            },
        onShow: function(id){
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
    move:true,
    body: c_appl
    });

webix.ui({
    view: "popup",
    autofit: true,
    header: "текущая заяка",
    id: "pop_m_application",
    position:"center",
    move:true,
    body: mass_appl
    });

webix.ui({
    view: "popup",
    id: "pop_ch_alert_list",
    body: {
        view: "list",
        id: "ch_alert_list",
        data: alerts(),
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
        width: 170,
        navigation: true,
        template: "#display_name#"
        }
    });

webix.ui({
    view: "popup",
    id: "pop_vendors_form",
    body: vendors
    });

//elemnts attachs

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
        item = data.json()[0];
        $$(cv).updateItem(id, item)
        $$(cv).unselectAll();
        upd_views();
        });
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
        item = data.json()[0];
        $$(cv).remove(id);
        $$(cv).unselectAll();
        upd_views();
        });
    }
    });

$$("_return").attachEvent("onItemClick", function(){
    $$("context_arch").hide();
    var cv = get_current_view();
    var item = $$(cv).getSelectedItem();
    var id = $$(cv).getSelectedId();
    if (item) {
        var params = {"ret_row": item};
        request(req_url, params).then(function(data){
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

$$("pop_m_application").attachEvent("onBeforeShow", function(item, e){
    var data = upd_top_apps();
    $$("topic_mass_list").data.sync(data);
    });

$$("view_1").attachEvent("onItemDblClick", function(id, e){
    open_appl($$("view_1"));
    });

$$("view_2").attachEvent("onItemDblClick", function(id, e){
    open_appl($$("view_2"));
    });

$$("view_3").attachEvent("onItemDblClick", function(id, e){
    open_appl($$("view_3"));
    });

$$("view_1").attachEvent("onKeyPress", function(code, e){
    if (13 === code) {
        $$("view_1").callEvent("onItemDblClick");
    }
    });

$$("view_2").attachEvent("onKeyPress", function(code, e){
    if (13 === code) {
        $$("view_2").callEvent("onItemDblClick");
    }
    });

$$("view_3").attachEvent("onKeyPress", function(code, e){
    if (13 === code) {
        $$("view_3").callEvent("onItemDblClick");
    }
    });

$$("close_button").attachEvent("onItemClick", function(){
    $$("pop_application").hide();
    });

$$("close_button_mass").attachEvent("onItemClick", function(){
    $$("pop_m_application").hide();
    });

$$("_filters").attachEvent("onItemClick", function(){
    var cv = get_current_view();
    var columns = $$(cv)._columns
    columns.forEach(function(item){//, i, data) {
        $$(cv).getFilter(item.id).value = '';
        });
    $$(cv).filterByAll();
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
    upd_mass();
    upd_history();
    $$("view_1").parse($$("my_upd"));
    $$("view_2").parse($$("all_upd"));
    $$("view_3").parse($$("mass_upd"));
    $$("view_4").parse($$("hist_upd"));
    });

function upd_filters(cv){
    cv.filterByAll();
    }

function upd_views() {
    upd_filters($$("view_1"));
    upd_filters($$("view_2"));
    upd_filters($$("view_3"));
    upd_filters($$("view_4"));
    var cv = get_current_view();
    if (cv === "view_1") {
        upd_all();
        $$("view_2").parse($$("all_upd"));
        upd_mass();
        $$("view_3").parse($$("mass_upd"));
        upd_history();
        $$("view_4").parse($$("hist_upd"));
    } else if (cv === "view_2"){
        upd_my();
        $$("view_1").parse($$("my_upd"));
        upd_mass();
        $$("view_3").parse($$("mass_upd"));
        upd_history();
        $$("view_4").parse($$("hist_upd"));
    } else if (cv === "view_3"){
        upd_my();
        $$("view_1").parse($$("my_upd"));
        upd_all();
        $$("view_2").parse($$("all_upd"));
        upd_history();
        $$("view_4").parse($$("hist_upd"));
    } else if (cv === "view_4"){
        upd_my();
        $$("view_1").parse($$("my_upd"));
        upd_all();
        $$("view_2").parse($$("all_upd"));
        upd_mass();
        $$("view_3").parse($$("mass_upd"));
    }
    };
