"use strict";

var req_url = "/crm_logic"
var auth_key = "11"
var user = "Кашинцев"

webix.i18n.setLocale('ru-RU');

var mass_apl = {template: 'Массовые заявки'};
var my_appl = {template: "My apllications"};
var history_appl = {template: "history of applications"};

var customers_link = {template: "по нажатию кнопки будет переход на страницу 'Клиенты'"}
var vendors = {template: "по нажатию кнопки будет переход на страницу 'Поставщики'"}
var knowbase = {template: "по нажатию кнопки будет переход на страницу 'База знаний'"}

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


var input_form = [
    {view:"text", label:"Пользователь", value: user,
        readonly: true, name:"create_user", disabled: true, id: "cr_user"},
    {view:"datepicker", label:"Дата заявки", name:"create_date", stringResult:"true",
        value: new Date(), readonly: true, disabled: true},
    {view:"text", label:"Клиент", name:"client", id: 'customer_new', invalidMessage: "Выберите клиента",
        required: true, popup: "pop_customers_form_new", placeholder: "Выберите клиента"
        },
    {view:"text", label:"Тема", id: "n_topic", name:"topic", required: true,
        invalidMessage: "Выберите тему", labelWidth: 80, placeholder: "Выберите тему",
        popup: "pop_topics"
        },
    {view:"textarea", label:"Описание проблемы", name:"description", required: true, labelPosition:"top",
        id: "n_desc", height: 130, invalidMessage: "Введите описание", placeholder: "Введите описание проблемы"},
    {cols:[
        {},
        {},
        {view:"button", value:"Отправить", click: function(){
            var vl_2 = $$("customer_new").validate();
            var vl = $$("n_desc").validate();
            var vl_1 = $$("n_topic").validate();
            if (vl & vl_1 & vl_2) {
                //$$("cr_user").setValue(user);
                $$("cr_user").refresh();
                submit();
            };
            }}
        ]
    }];

var customers = {
    view:"unitlist", 
    uniteBy:function(obj){
        return obj.value.substr(0,1); 
        },
    datatype: 'JSArray',
    id: "custom_list",
    width: 600,
    height: 400,
    select: true,
    hover: "myhover",
    navigation: true,
    };

var topics = {
    view:"unitlist", 
    uniteBy:function(obj){
        return obj.value.substr(0,1); 
        },
    datatype: 'JSArray',
    id: "topics_list",
    width: 600,
    select: true,
    hover: "myhover",
    navigation: true,
    };

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

var all_appl = {id: "view_2", view: "datatable",
    select: true,
    hover: "myhover",
    navigation: true, 
    multiselect: true,
    resizeColumn:true,
    fixedRowHeight:false,  //rowLineHeight:34, rowHeight:34,
    on:{
        //"onresize": webix.once(function(){ 
            //this.adjustRowHeight("client", true);
            //})

        //onBeforeSelect: webix.once(function(){
            //this.adjustRowHeight("client", true);
            //}),
        //onBeforeUnSelect: webix.once(function(){
            //this.adjustRowHeight("num", true);
            //}),
        //onAfterUnSelect: webix.once(function(){
            //this.adjustRowHeight("num", true);
            //})
        },
    scheme: {
        $init: function(obj){
            obj.create_date = webix.i18n.dateFormatStr(obj.create_date);
            if (obj.to_work_date != "") {
                obj.to_work_date = webix.i18n.dateFormatStr(obj.to_work_date);
            };
            obj.$css = (obj.alert === 0) ? "warning":
                       (obj.alert === 1) ? "info":
                       (obj.alert === 2) ? "success":
                       "nothing";
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
      cssFormat: shrink, 
      width: 40,
      header: {text: "№", autoheight: true, css: 'header_data'}
        },
    { id:"create_date",
      width: 85,
      css: "date_s",
      sort:"int",
      header: [
        {text: "Создано", autoheight: true, css: 'header_data'},
        {id: "c_filter", content:"textFilter"}
        ]
    },
    { id:"to_work_date",
      width: 85,
      css: "date_s",
      sort: "int",
      header: [
        {text: "В работу", autoheight: true, css: 'header_data'},
        {content:"textFilter"}
        ]
    },
    { id:"status",
      width: 100,
      sort: "text",
      header: [
        {text: "Статус", autoheight: true, css: 'header_data'},
        { content:"selectFilter"}
        ]},
    { id:"create_user",
      width: 145,
      sort: "text",
      header: [
        {text: "Создал", autoheight: true, css: 'header_data'},
        { content:"selectFilter"}
        ]},
    { id:"ordered",
      width: 145,
      sort: "text",
      header: [
        {text: "Назначен", autoheight: true, css: 'header_data'},
        { content:"selectFilter"}
        ]},
    { id:"client",
      fillspace: 3,
      width: 360,
      sort: "text",
      header:[
        {text: "Клиент", height: 10, css: 'header_data'},
        {content:"textFilter"}]
        },
    { id:"in_work",
      width: 80,
      css: "center",
      sort: "int",
      header: [{text: "В работе", autoheight: true, css: 'header_data'},
               {content: "numberFilter"}]
        },
    { id:"topic",
      width: 225,
      fillspace: 1,
      header: [
        {text: "Тема", heigth: 10, css: 'header_data'},
        { content:"selectFilter", height: 20}
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
                label: 'Новая заявка', width: 100, tooltip: "Создание новой заявки"},
            {view:"button", id: '_vendors', type:"form", popup: "pop_vendors_form",
                label: 'Поставщики', width: 100, tooltip: "Список поставщиков"},
            {view:"button", id: '_customers', type:"form", popup: "pop_customers_form",
                label: 'Клиенты', width: 100, tooltip: "Список клиентов"},
            {view:"button", id: '_knowledge_base', type:"form", popup: "pop_knowbase_form",
                label: 'База знаний', width: 100, tooltip: "Наиболее частые проблемы и их решения"},
            {},
            {view:"button", id: "_reset_f", type:"form",
                label: 'Сбросить фильтры', width: 140},
            {view:"button", id: '_action', type:"form",
                label: 'Действия', width: 140}
            ];

var bottom = [
    {template: 'bottom' + '&nbsp;<span class="serv_info">' + location.hostname + "</span>",
        height: 30, id: "foot1"},
    {},
    {template: 'Внимание!',
        label: 'Alert', width: 90, css: "warning_inf"},
    {template: 'Инфо',
        label: 'Info', width: 90, css: "info_inf"},
    {template: 'Успешно',
        label: 'Success', width: 90, css: "success_inf"},
    {template: 'Обычные',
        label: 'Ordinary', width: 90, css: "nothing_inf"},
    {template: 'Выделенные',
        label: 'Selected', width: 90, css: "selected_inf"},
];

//functions
function shrink(value, config) {
    var ret = (value > 999) ? {"font-size":"95%", "padding-left": "5px !important"}:
              (value > 9999) ? {"font-size":"85%", "padding-left": "2px !important"}:
              value;
    return ret;
};

function customers_load() {
    var params = {"get_clients": user};
    webix.ajax().post(req_url, params, function(text, data){
        data = data.json();
        $$("custom_list").clearAll();
        $$("custom_list").parse(data);
        });
    };

function topics_load() {
    var params = {'get_topics': user};
    webix.ajax().post(req_url, params, function(text, data){
        data = data.json();
        $$("topics_list").clearAll();
        $$("topics_list").parse(data);
        });
    };

function update_all(){
    var params = {'get_all': user};
    webix.ajax().post(req_url, params, function(text, data){
        data = data.json();
        $$("view_2").clearAll();
        $$("view_2").refresh();
        $$("view_2").parse(data);
        });
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

function submit(){
    $$("pop_send_form").hide();
    var data_send = $$("send_form").getValues()
    var params = {"put_apply": data_send};
    webix.ajax().post(req_url, params, function(text, data){
        update_all();
        });
    $$("send_form").reconstruct();
    };

function open_appl(id) {
    var c_item = $$("view_2").getItem(id.row);
    console.log(c_item);
    $$("pop_application").show();
    //webix.message(c_item);
    };

function remove_filters(){
    $$('view_2').filter(function(obj){
        console.dir($$("view_2"));
        //console.log(obj);
        return obj.status != "", obj.ordered != "", obj.create_user != "",
               obj.create_date != "", obj.to_work_date != "", obj.client != "",
               obj.in_work != "", obj.topic != "";
    });
    //$$('view_2').resize();
    }
    
    

//webix events attaches
webix.attachEvent("onBeforeAjax", 
    function(mode, url, data, request, headers, files, promise){
        headers["Content-type"] = "application/json";
        headers["x-api-key"] = auth_key;
        }
    );



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
        {height: 30, cols:buttons},
        {view: "tabview",
            id:"tabview1",
            animate:false,
            cells: view_cells,
            multiview: true
            },
        {cols: bottom}
        ]
    });

webix.ui({
    view: "popup",
    id: "pop_knowbase_form",
    body: knowbase
    });

webix.ui({
    view: "popup",
    id: "pop_application",
    position:"center",
    height:600,
    width:800,
    modal:true,
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
    id: "pop_customers_form_new",
    body: customers
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

update_all();
update_my();
topics_load();
customers_load();

//elemnts attachs

$$("custom_list").attachEvent("onAfterSelect", function(){
    var curent_customer = $$("custom_list").getSelectedItem().value;
    $$("pop_customers_form_new").hide();
    $$("custom_list").unselectAll();
    $$("customer_new").setValue(curent_customer);
    });
    
$$("topics_list").attachEvent("onAfterSelect", function(){
    var curent_topic = $$("topics_list").getSelectedItem().value;
    $$("pop_topics").hide();
    $$("topics_list").unselectAll();
    $$('n_topic').setValue(curent_topic);
    });

$$("view_2").attachEvent("onItemDblClick", function(id, e, node){
    open_appl(id);
    });

$$("close_button").attachEvent("onItemClick", function(){
    $$("pop_application").hide();
    });

$$("_reset_f").attachEvent("onItemClick", function(){
    console.log('dd');
    remove_filters();
    //$$("view_2").refreshFilter();
    //$$("view_2").render();
    });

$$("view_2").attachEvent("onresize", webix.once(function(){ 
            this.adjustRowHeight();
            })
    );
