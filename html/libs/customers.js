"use strict";

var clean_point_data = {"uid": "", "display_name": "", "customer_id": "", "address": "", "phone_num": "",
              "email": "", "contact": "", "create_date": "", "create_user": "",
              "change_date": "", "active": false, "deleted": false, "id_old": "",
              "comments": ""
            };

var clean_customer_data = {"uid": "", "display_name": "", "full_name": "", "address": "", "inn": "",
              "kpp": "", "phone_num": "", "email": "", "director": "",
              "contact": "", "create_date": "", "create_user": "", "change_date": "",
              "active": false, "deleted": false, "id_old": ""
            }

var customers_list = [
                {view: "datatable",
                    id: "customers_dt",
                    navigation: "row",
                    select: true,
                    width: 700,
                    resizeColumn:true,
                    fixedRowHeight:false,
                    rowLineHeight:32,
                    rowHeight:row_height,
                    columns: [
                        {id: "id", width: 70, sort: "int", css: "num_s",
                        header: [{text: "uid", css: 'header_data'},
                            {content:"textFilter"}]
                            },
                        {id: "display_name",
                        fillspace: 1,
                        sort: "text",
                        header:[
                            {text: "Клиент", css: 'header_data'},
                            {content:"textFilter"}],
                            }
                        ],
                    on: {
                        onBeforeUnselect: function(item) {
                            this.removeRowCss(item.id, "r_css");
                            },
                        onBeforeSelect: function(c_row) {
                            $$("_cedit").enable();
                            $$("_cedit").refresh();
                            $$("_pedit").disable();
                            $$("_pedit").refresh();
                            this.addRowCss(c_row.id, "r_css");
                            var params = {"get_c_customer": c_row.row};
                            var item = request(req_url, params, !0).response;
                            $$("customers_prop").parse(item);
                            $$("customers_prop").refresh();
                            params = {"get_c_points": c_row.row};
                            item = request(req_url, params, !0).response;
                            item = JSON.parse(item);
                            $$("points_dt").clearAll();
                            $$("points_dt").parse(item);
                            $$("points_dt").refresh();
                            $$("points_prop").parse(clean_point_data);
                            $$("points_prop").refresh();
                            }
                        },
                    data: clients
                    },
            {cols: [
                {},
                {view:"button", id: "_a_c", type:"imageButton", image: './libs/img/add.svg',
                    label: "Добавить клиента", width: 160, tooltip: "Добавление клиента",
                    click: function() {
                        webix.message('добавление клиента');
                        }
                    },
                ]},
            ];

var customer_property = [
            {view: "property", id: "customers_prop",// width:450,
                complexData:true,
                disabled: true,
                nameWidth: 220,
                elements:[
                    { label:"Информация о клиенте", type:"label" },
                    { label:"Отображаемое имя", type:"text", id:"display_name"},
                    { label:"Полное название", type:"text", id:"full_name"},
                    { label:"Юр. адрес", type:"text", id:"address"},
                    { label:"ИНН", type:"text", id:"inn"},
                    { label:"КПП", type:"text", id:"kpp"},
                    { label:"Номер телефона", type:"text", id:"phone_num"},
                    { label:"Электронная почта", type:"text", id:"email"},
                    { label:"Директор", type:"text", id:"director"},
                    { label:"Контактное лицо", type:"text", id:"contact"},
                    { label:"Дата создания", type:"text", id:"create_date"},
                    { label:"Кто создал", type:"text", id:"create_user"},
                    { label:"Дата изменения", type:"text", id:"change_date"},
                    { label:"Активный", type:"checkbox", id:"active", value: false},
                    { label:"Удаленный", type:"checkbox", id:"deleted", value: false},
                    { label:"Старый ID", type:"text", id:"id_old"}
                ]
            },
            {cols: [
                {},
                {view:"button", id: "___1", type:"imageButton", image: './libs/img/points.svg',label: "Точки", width: 100,
                    click: function() {
                        $$("customers_dt").config.width = 500;
                        $$("customers_dt").refresh();
                        $$("cell_2").show();
                        console.log('points');
                        }
                    },
                {view:"button", id: "_cedit", type:"imageButton", image: './libs/img/edit.svg',label: "Редактировать", width: 160, disabled: true,
                    click: function() {
                        console.log('edit');
                        }
                    },
                {view:"button", id: "___3", type:"imageButton", image: './libs/img/confirm.svg',label: "Применить", width: 140, disabled: true,
                    click: function() {
                        console.log('b_3');
                        }
                    }
                ]}
            ];

var points_list = [
            {view: "datatable",
                id: "points_dt",
                navigation: "row",
                select: true,
                width:500,
                resizeColumn:true,
                fixedRowHeight:false,
                rowLineHeight:32,
                rowHeight:row_height,
                columns: [
                    {id: "id", width: 70, sort: "int", css: "num_s",
                    header: [{text: "uid", css: 'header_data'},
                        {content:"textFilter"}]
                        },
                    {id: "display_name",
                    fillspace: 1,
                    sort: "text",
                    header:[
                        {text: "Точка", css: 'header_data'},
                        {content:"textFilter"}],
                        }
                    ],
                on: {
                    onBeforeUnselect: function(item) {
                        this.removeRowCss(item.id, "r_css");
                        },
                    onBeforeSelect: function(c_row) {
                        $$("_pedit").enable();
                        $$("_pedit").refresh();
                        this.addRowCss(c_row.id, "r_css");
                        var params = {"get_c_point": c_row.row};
                        var item = request(req_url, params, !0).response;
                        $$("points_prop").parse(item);
                        $$("points_prop").refresh();
                        }
                    },
                //data: clients
                },
            {cols: [
                {},
                {view:"button", id: "_a_p", type:"imageButton", image: './libs/img/add-point.svg',
                    label: "Добавить точку", width: 160, tooltip: "Добавление точки",
                    click: function() {
                        webix.message('добавление точки');
                        }
                    },
                ]},
            ];

var point_property = [
            {view: "property", id: "points_prop", //width:450,
                complexData:true,
                disabled: true,
                nameWidth: 160,
                elements:[
                    { label:"Информация о точке", type:"label" },
                    { label:"Отображаемое имя", type:"text", id:"display_name"},
                    { label:"Адрес", type:"text", id:"address"},
                    { label:"Контактное лицо", type:"text", id:"contact"},
                    { label:"Телефон", type:"text", id:"phone_num"},
                    { label:"Элктронная почта", type:"text", id:"email"},
                    { label:"Дата создания", type:"text", id:"create_date"},
                    { label:"Кто создал", type:"text", id:"create_user"},
                    { label:"Дата изменения", type:"text", id:"change_date"},
                    { label:"Активная", type:"checkbox", id:"active", value: false},
                    { label:"Удаленная", type:"checkbox", id:"deletes", value: false},
                    { label:"Старый ID", type:"text", id:"id_old"},
                    { label:"Коментарии", type:"text", id:"comments"},
                ]
            },
            {cols: [
                {},
                {view:"button", id: "__back", type:"imageButton", image: './libs/img/info.svg',
                    label: "Информация", width: 140, tooltip: "Информация о клиенте",
                    click: function() {
                        $$("customers_dt").config.width = 700;
                        $$("customers_dt").refresh();
                        $$("m_view").back();
                        }
                    },
                {view:"button", id: "_pedit", type:"imageButton", image: './libs/img/edit.svg',label: "Редактировать", width: 160, disabled: true,
                    click: function() {
                        console.log('b_2');
                        }
                    },
                {view:"button", id: "__13", type:"imageButton", image: './libs/img/confirm.svg',label: "Применить", width: 140, disabled: true,
                    click: function() {
                        console.log('b_3');
                        }
                    }
                ]}
            ];

var cu_buttons = [
    {},
    {view:"button", id: "_custom_refresh", type:"imageButton", image: './libs/img/sync.svg',
        label: "Обновить", width: 120, tooltip: "Синхронизация с сервером",// hotkey: "q+ctrl",
        click: function() {
            $$("customers_ui").reconstruct();
            $$("customers_prop").parse(clean_customer_data);
            $$("points_prop").parse(clean_point_data);
            }
        }//,
    //{view:"button", id: "_back_1", type:"imageButton", image: './libs/img/back.svg',label: "Назад", width: 90,
        //click: function() {
            //$$("pop_customers").hide();
            //}
        //}
    ];


//main ui's
var customs = webix.ui({
    view: "cWindow",
    modal: false,
    fullscreen: true,
    //view: "popup",
    id: "pop_customers",
    position: "center",
    body: {
        id: "customers_ui",
        view: 'layout',
        rows: [
            {view: 'toolbar',
            css: 'header_css',
            cols: [
                {view: "label", label: "<a href='http://ms71.org'><span class='ms-logo'></span></a>",
                    width: 60, align: 'center', height: 36},
                {view: "label", label: "Манускрипт солюшн: CRM: клиенты", css: 'ms-logo-text'
                    },
                {},
                {view: "label", label: "Пользователь: " + user, css: 'user-text', width: 250
                    },
                {view:"button", type:"imageButton", image: './libs/img/exit.svg',
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
                    {height: 36, cols: cu_buttons},
                    {view: "toolbar",
                        width: document.documentElement.clientWidth,
                        height: document.documentElement.clientHeight-72-30-14-28,
                        id:"c_tool",
                        animate:false,
                        css: "w_n",
                        cols: [
                            {rows: customers_list},
                            {view: "resizer"},
                            {view: "multiview",
                                animate: false,
                                id: 'm_view',
                                cells: [
                                    {view: "layout", id: "cell_1", header: 'Клиент', rows: customer_property },
                                    {view: "layout", id: "cell_2",
                                        cols: [
                                            {rows: points_list},
                                            {view: "resizer"},
                                            {rows: point_property}
                                            ]
                                        },
                                    ]
                                }
                            ]}
                    ]},
                {}
                ]},
            {cols: [
                {template: 'Вы находитесь на сервере: ' + '&nbsp;<span class="serv_info">' + location.hostname + "</span>",
                    height: 30},
                {}
                ]}
            ]}
    });
