"use strict";

//webix.i18n.setLocale('ru-RU');

var mass_apl = {id: "view_3", template: 'Массовые заявки'};
var my_appl = {id: "view_1", template: "My apllications"};
var history_appl = {id: "view_4", template: "history of applications"};

var customers_link = {template: "по нажатию кнопки будет переход на страницу 'Клиенты'"}
var vendors = {template: "по нажатию кнопки будет переход на страницу 'Поставщики'"}
var knowbase = {template: "по нажатию кнопки будет переход на страницу 'База знаний'"}


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
                        $$("all_dc").clearAll();
                        data = data.json();
                        $$("all_dc").parse(data);
                        });
                    }
            },
        //on:{
            //onAfterLoad:function(){
                //$$("replist").data.sync(this);
                //$$("run_but").define('badge', this.data.count());
                //$$("run_but").refresh();
                    //}
                //}
        });
    return tt
    };


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

var appl = {
    rows: [
        {template: "здесь будет полная информация о заявке"},
        {cols: [
            {},
            {view:"button", id: 'close_button', type:"form", 
                label: 'Закрыть', width: 100}
            ]}
        ]
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
        {view:"radio", id: "result_status",label:"Результат", value:1, labelPosition:"top", options:[
            { id:1, value:"Успешно" },
            { id:2, value:"Полный провал" }
        ]},
        {view:"textarea", label:"Описание результата", name:"c_description", required: true, labelPosition:"top",
            id: "c_desc", height: 130, invalidMessage: "Введите описание", placeholder: "Введите описание результата"},
        {cols:[
            {},
            {},
            {view:"button", value:"Отменить", click: function(){
                $$("pop_complete_form").hide();
                $$("complete_form").reconstruct();
                webix.message("Canceled");
                }},
            {view:"button", value:"Отправить", click: function(){
                var vl = $$("c_desc").validate();
                if (vl) {
                    $$("pop_complete_form").hide();
                    webix.message("Applied");
                    $$("complete_form").reconstruct();
                    };
                }}
            ]}
    ]};

var all_appl = {id: "view_2", view: "datatable",
    select: true,
    //hover: "myhover",
    navigation: "row",
    select: true,
    data: upd_all(),
    //data: all_appls,
    //multiselect: true,
    resizeColumn:true,
    fixedRowHeight:false,  rowLineHeight:34, rowHeight:34,
    on:{
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
      css: "date_s",
      sort:"int",
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
      fillspace: 3,
      width: 360,
      sort: "text",
      header:[
        {text: "Клиент", css: 'header_data'},
        {content:"textFilter"}]
        },
    { id:"in_work",
      width: 80,
      css: "num_s",
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
    {view:"button", id: '_new_button', type:"form", popup: "pop_send_form",
        label: 'Новая заявка', width: 120, tooltip: "Создание новой заявки"},
    {view:"button", id: '_vendors', type:"form", popup: "pop_vendors_form",
        label: 'Поставщики', width: 120, tooltip: "Список поставщиков"},
    {view:"button", id: '_customers', type:"form", popup: "pop_customers_form",
        label: 'Клиенты', width: 120, tooltip: "Список клиентов"},
    {view:"button", id: '_knowledge_base', type:"form", popup: "pop_knowbase_form",
        label: 'База знаний', width: 120, tooltip: "Наиболее частые проблемы и их решения"},
    {},
    {view:"button", id: "_refresh", type:"form",
        label: "Sync", width: 100},
    {view:"button", id: "_filters", type:"form",
        label: "Фильтры", width: 100}
    ];

var buttons_2floor = [
    {},
    {view:"button", id: '_to_work', type:"form",
        label: 'Взять в работу', width: 100},
    {view:"button", id: '_order', type:"form",
        label: 'Назначить', width: 100},
    {view:"button", id: '_ch_alert', type:"form",
        label: 'Сменить приоритет', width: 100},
    {view:"button", id: '_complete', type:"form", popup: "pop_complete_form", 
        label: 'Выполненно', width: 100},
    {view:"button", id: '_delete', type:"form",
        label: 'Удалить заявку', width: 100},
    {}
    ];

var bottom = [
    {template: 'bottom' + '&nbsp;<span class="serv_info">' + location.hostname + "</span>",
        height: 30, id: "foot1"},
    {}
];

//functions

function get_current_view() {
    var hide1 = $$("view_1").isVisible();
    var hide2 = $$("view_2").isVisible();
    var hide3 = $$("view_3").isVisible();
    var hide4 = $$("view_4").isVisible();
    var logg = (hide1) ? "view_1":
               (hide2) ? "view_2":
               (hide3) ? "view_3":
               "view_4";
    return(logg);
    };

function shrink(value, config) {
    var ret = (value > 999) ? {"font-size":"95%", "padding-left": "5px !important"}:
              (value > 9999) ? {"font-size":"85%", "padding-left": "2px !important"}:
              value;
    return ret;
};


function update_my(){
    var params = {'get_my': user};
    webix.ajax().post(req_url, params, function(text, data){
        data = data.json();
        //$$("view_1").clearAll();
        //$$("view_1").parse(data);
        });
    };

function update_mass(){
    var params = {'get_mass': user};
    webix.ajax().post(req_url, params, function(text, data){
        data = data.json();
        //$$("view_3").clearAll();
        //$$("view_3").parse(data);
        });
    };

function update_history(){
    var params = {'get_history': user};
    webix.ajax().post(req_url, params, function(text, data){
        data = data.json();
        //$$("view_4").clearAll();
        //$$("view_4").parse(data);
        });
    };

function open_appl(view, id) {
    var c_item = view.getItem(id.row);
    console.log(c_item);
    $$("pop_application").show();
    //webix.message(c_item);
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
            {view: "label", label: "Пользователь: " + user, css: 'user-text'
                },
            {view:"button", id: '_login', type:"form", css: 'buttons',
                label: 'Войти', width: 120}
            ]},
        {cols: [
            {},
            {rows: buttons_2floor},
            {rows: [
                {height: 36, cols:buttons},
                //{height: 36, cols:buttons_2floor},
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
    view: "popup",
    id: "pop_knowbase_form",
    body: knowbase
    });

webix.ui ({
    view: "popup",
    id: "pop_complete_form",
    body: complete
    });

webix.ui({
    view: "popup",
    id: "pop_application",
    position:"center",
    height:600,
    width:800,
    //modal:true,
    move:true,
    body: appl
    });

webix.ui({
    view: "popup",
    id: "pop_customers_form",
    body: customers_link
    });


webix.ui({
    view: "popup",
    id: "pop_vendors_form",
    body: vendors
    });

webix.ui({
    view: "popup",
    id: "pop_topics",
    body: topics
    });

webix.ui({
    view: "popup",
    id: "pop_send_form",
    body: send_form_body
    });

update_my();


//elemnts attachs

$$('_order').attachEvent("onItemClick", function(){
    var cv = get_current_view();
    var item = $$(cv).getSelectedItem();
    var id = $$(cv).getSelectedId()
    console.log(item);
    item["ordered"] = "Краснов"; //новое значение
    item["change_date"] = new Date(); //новое значение
    var params = {"set_ordered": item};
    webix.ajax().post(req_url, params, function(text, data){
        //возарвщаем новое значение строки в item
        //item = data.json();
        $$("view_2").updateItem(id, item)
        //$$("view_2").data.sync(upd_all());
        webix.message(data.json());
        });
    //console.log(item);
    });

$$("view_2").attachEvent("onItemDblClick", function(id, e, node){
    open_appl($$("view_2"), id);
    });

$$("close_button").attachEvent("onItemClick", function(){
    $$("pop_application").hide();
    });

$$("_filters").attachEvent("onItemClick", function(){
    var cv = get_current_view();
    console.log($$("all_dc"));
    $$("all_dc").data.$init();
    //console.log(cv);
    //console.log($$(cv));
    webix.message('Filters');
    });
