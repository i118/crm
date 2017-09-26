"use strict";

var mass_apl = {id: "view_3", template: 'Массовые заявки'};
//var my_appl = {id: "view_1", template: "My apllications"};
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
                webix.ajax().post(this.source, params)
                    .then(function(data){
                        webix.ajax.$callback(view, callback, "", data, -1);
                        $$("my_upd").clearAll();
                        data = data.json();
                        $$("my_upd").parse(data);
                        });
                    }
            },
        });
    return tt
    };

//для образца оставим
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
            {view:"button", value:"Отправить", id: "send_result"}
            ]}
        ]
    };

webix.protoUI({
    name:"activeDataTable" 
},webix.ui.datatable, webix.ActiveContent);

var my_appl = {id: "view_1", view: "activeDataTable",
    select: true,
    navigation: "row",
    select: true,
    data: upd_my(),
    resizeColumn:true,
    fixedRowHeight:false,
    onContext: {},
    activeContent: {
        deleteButton: {
            id:"deleteButtonId",
            view:"button",
            label:"Del",
            type: "form",
            width:20
            }
        },
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
      css: "date_s",
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
      fillspace: 3,
      width: 360,
      sort: "text",
      header:[
        {text: "Клиент", css: 'header_data'},
        {content:"textFilter"}],
      //template: "<div>#client#</div>" + "<div>{common.deleteButton()}</div>"
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

var all_appl = {id: "view_2", view: "activeDataTable",
    select: true,
    //hover: "myhover",
    navigation: "row",
    select: true,
    data: upd_all(),
    //multiselect: true,
    resizeColumn:true,
    fixedRowHeight:false,
    //rowLineHeight:34,
    //rowHeight:34,
    onContext: {},
    activeContent: {
        "deleteButton": {
            id:"deleteButtonId",
            view:"button",
            label:"Del",
            type: "form",
            width:20
            }
        },
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
      fillspace: 3,
      width: 360,
      sort: "text",
      header:[
        {text: "Клиент", css: 'header_data'},
        {content:"textFilter"}],
      //template: "<div>#client#</div>" + "<div>{common.deleteButton()}</div>"
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
        label: "Сбросить фильтры", width: 120}
    ];

var buttons_2floor = [
    {view:"button", id: '_to_work', type:"form", height: 25,
        label: 'Взять в работу', width: 150},
    {view:"button", id: '_order', type:"form", height: 25, popup: "pop_ch_users_list",
        label: 'Назначить', width: 150},
    {view:"button", id: '_ch_alert', type:"form", height: 25, popup: "pop_ch_alert_list",
        label: 'Сменить приоритет', width: 150},
    {view:"button", id: '_complete', type:"form", popup: "pop_complete_form", height: 25,
        label: 'Выполненно', width: 150},
    {view:"button", id: '_archive', type:"form", height: 25,
        label: 'В архив', width: 150},
    {view:"button", id: '_delete', type:"form", height: 25,
        label: 'Удалить заявку', width: 150}
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


function open_appl(view, id) {
    var c_item = view.getItem(id.row);
    console.log(c_item);
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
            {view: "label", label: "Пользователь: " + user, css: 'user-text'
                },
            {view:"button", id: '_login', type:"form", css: 'buttons',
                label: 'Войти', width: 120}
            ]},
        {cols: [
            {},
            //{rows: buttons_2floor},
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
    view:"context",
    id:"context_menu",
    body: {
        view: 'toolbar',
        height: 100,
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
        height: 140,
        width: 100,
        navigation: true,
        scroll: false,
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
    webix.ajax().post(req_url, params, function(text, data){
        item = data.json()[0];
        $$(cv).updateItem(id, item)
        $$(cv).unselectAll();
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
    webix.ajax().post(req_url, params, function(text, data){
        item = data.json()[0];
        $$(cv).updateItem(id, item)
        $$(cv).unselectAll();
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
    webix.ajax().post(req_url, params, function(text, data){
        item = data.json()[0];
        $$(cv).updateItem(id, item)
        $$(cv).unselectAll();
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
    webix.ajax().post(req_url, params, function(text, data){
        item = data.json()[0];
        $$(cv).remove(id);
        $$(cv).unselectAll();
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
    webix.ajax().post(req_url, params, function(text, data){
        item = data.json()[0];
        $$(cv).remove(id);
        $$(cv).unselectAll();
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
        item['result'] = form_values['c_description'];
        $$("complete_form").reconstruct();
        var params = {"update_row": item};
        webix.ajax().post(req_url, params, function(text, data){
            item = data.json()[0];
            $$(cv).updateItem(id, item)
            $$(cv).unselectAll();
            });
    };
    });

    
function adj_row(item, id, silent) {
    if (id) {
        var config = $$("view_2").getColumnConfig(id);
        var container;
        var d = webix.html.create("DIV",{"class":"webix_table_cell webix_measure_size webix_cell"},"");
        d.style.cssText = "width:"+config.width+"px; height:1px; visibility:hidden; position:absolute; top:0px; left:0px; overflow:hidden;";
        $$("view_2").$view.appendChild(d);
        if (d.offsetHeight < 1){
            container = $$("view_2").$view.cloneNode(true);
            document.body.appendChild(container);
            container.appendChild(d);
        }
        $$("view_2").data.each(function(obj){
            if (obj){
                if (obj.id === item) {
                    d.innerHTML = $$("view_2")._getValue(obj, config, 0);
                    var d_h = d.scrollHeight;
                    console.dir(d);
                    obj.$height = (d_h > $$("view_2")._settings.rowHeight) ? $$("view_2")._settings.rowHeight * 2:
                        $$("view_2")._settings.rowHeight;
                }
            }
        }, $$("view_2"));

        d = webix.html.remove(d);
        if (container)
            webix.html.remove(container);
    } else {
        var heightsArr = new Array($$("view_2").data.count()+1).join('0').split('');
        var cols = $$("view_2").config.columns;
        for (var i = 0; i < cols.length; i++) {
            adj_row(item, cols[i].id, true)
            $$("view_2").data.each(function(obj, index){
                    if (obj.id === item.row) {
                    if (obj.$height > heightsArr[index]) {
                        heightsArr[index] = obj.$height;
                        }
                    obj.$height = heightsArr[index];
                    };
                });
            }
        };
   if (!silent)
        $$("view_2").refresh();
    };

$$("view_2").attachEvent("onBeforeSelect", function(item, e, node){
    //adj_row(item.row)
    });


$$("view_2").attachEvent("onBeforeUnSelect", function(item){
    //console.log('uuu');
    //console.dir(item.row);
    
    });
    

$$("view_2").attachEvent("onItemDblClick", function(id, e, node){
    open_appl($$("view_2"), id);
    });

$$("close_button").attachEvent("onItemClick", function(){
    $$("pop_application").hide();
    });

$$("_filters").attachEvent("onItemClick", function(){
    var cv = get_current_view();
    var columns = $$(cv)._columns
    columns.forEach(function(item, i, data) {
        $$(cv).refreshFilter(item.id);
        $$(cv).filter(item.id,"");
        
        });
    });
console.log($$('tabview1'))

