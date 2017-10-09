"use strict";

var user_opt_data = new webix.DataCollection({
    id: "users_dc_opt",
    url: {
        $proxy:true,
        source: req_url,
        load: function(view) {
            var params = {"get_users": user};
            request(this.source, params).then(function(data){
                    view.clearAll();
                    data = data.json();
                    view.parse(data);
                    });
                }
        },
    on: {
        onAfterLoad: function(){
            this.sort("#id#","asc","int");
            }
        }
    });

var users_view = {
    cols: [
        {},
        {view: "datatable",
            id: "users_dt",
            navigation: "row",
            select: true,
            width:470,
            resizeColumn:true,
            fixedRowHeight:false,
            rowLineHeight:32,
            rowHeight:row_height,
            columns: [
                {id: "id", width: 70, sort: "int", css: "num_s",
                header: [{text: "id", css: 'header_data'},
                    {content:"textFilter"}]
                    },
                {id: "display_name", header: "Пользователь", 
                fillspace: 1,
                sort: "text",
                header:[
                    {text: "Пользователь", css: 'header_data'},
                    {content:"textFilter"}],
                    }
                ],
            on: {
                onBeforeUnselect: function(item) {
                    this.removeRowCss(item.id, "r_css");
                    },
                onBeforeSelect: function(c_row) {
                    $$("_ch_password").enable();
                    $$("_change").enable();
                    this.addRowCss(c_row.id, "r_css");
                    //console.log(c_row);
                    var uid = c_row.row;
                    var params = {"get_c_user": uid};
                    var item = request(req_url, params, !0).response
                    item = JSON.parse(item)[0];
                    $$("user_prop").parse(item);
                    $$("user_prop").refresh()
                    }
                },
            data: users
        },
        {view: "resizer"},
        {rows: [
            {view: "property", id: "user_prop", width:850,
                complexData:true,
                disabled: true,
                nameWidth: 220,
                elements:[
                    { label:"Информация о пользователе", type:"label" },
                    { label:"Отображаемое имя", type:"text", id:"display_name"},
                    { label:"Фамилия", type:"text", id:"last_name"},
                    { label:"Имя", type:"text", id:"first_name"},
                    { label:"Телефон", type:"text", id:"phone_number"},
                    { label:"Внутренний номер", type:"text", id:"int_number"},
                    { label:"Имя skype", type:"text", id:"skype_name"},
                    { label:"Электронная почта", type:"text", id:"email"},
                    { label:"Администратор", type:"checkbox", id:"admin", value: false},
                    { label:"Клиент", type:"checkbox", id:"customer", value: false},
                    { label:"Активный", type:"checkbox", id:"active", value: false},
                    
                    //{ label:"Type", type:"select", options:["json","xml","csv"], id:"data.type"},
                    //{ label:"Password", type:"password", id:"data.pass"},
                    //{ label:"Use JSONP", type:"checkbox", id:"data.jsonp"},
                    //{ label:"Position", type:"select", options:position_options, id:"style.position"},
                    //{ label:"Color", type:"combo", options:color_options, id:"style.color"}
                ]
            },
            {cols: [
                {},
                {view:"button", id: "_add_user", type:"imageButton", image: './libs/img/add-user.svg',
                    label: "Добавить пользователя", width: 200, tooltip: "Добавление пользователя",
                    click: function() {
                        webix.message('добавление пользователя');
                        }
                    },
                {view:"button", id: "_ch_password", type:"imageButton", image: './libs/img/password.svg',label: "Сменить пароль", width: 150, disabled: true,
                    click: function() {webix.message('смена пароля')}
                    },
                {view:"button", id: "_change", type:"imageButton", image: './libs/img/edit.svg',label: "Редактировать", width: 150, disabled: true,
                    click: function() {
                        $$("user_prop").enable();
                        $$("_apply_chgs").enable();
                        $$("_change").disable();
                        }
                    },
                {view:"button", id: "_apply_chgs", type:"imageButton", image: './libs/img/confirm.svg',label: "Применить изменения", width: 200, disabled: true,
                    click: function() {
                        $$("_apply_chgs").disable();
                        $$("_change").enable();
                        $$("user_prop").disable();
                        var item = $$("user_prop").getValues();
                        var params = {"set_c_user": item};
                        item = request(req_url, params, !0).response
                        item = JSON.parse(item)[0];
                        $$("user_prop").parse(item);
                        $$("user_prop").refresh()
                        }
                    }
                ]}
            ]},
        {}
    ]
    };


var topics_view = {id: "topics_dt", template: "темы"};
var status_view = {id: "status_dt", template: "статусы"};
var alerts_view = {id: "alerts_dt", template: "алерты"};

var view_cells_options = [
            {header: 'Пользователи', body: users_view},
            {header: 'Темы', body: topics_view},
            {header: 'Статусы', body: status_view},
            {header: 'Приоритеты', body: alerts_view}
            ];

var u_buttons = [
    {},
    {view:"button", id: "_opt_refresh", type:"imageButton", image: './libs/img/sync.svg',
        label: "Обновить", width: 120, tooltip: "Синхронизация с сервером, <Ctrl>+Q", hotkey: "q+ctrl",
        click: function() {
            opt_refresh();
            webix.message('refresh');
            }
        },
    {view:"button", id: "_back", type:"imageButton", image: './libs/img/back.svg',label: "Назад", width: 90,
        click: function() {$$("pop_options").hide()}
        }
    ];

//main ui's
var opt = webix.ui({
    view: "popup",
    id: "pop_options",
    position: "center",
    body: {
        id: "options_ui",
        view: 'layout',
        rows:[
            {view: 'toolbar',
            css: 'header_css',
            cols: [
                {view: "label", label: "<a href='http://ms71.org'><span class='ms-logo'></span></a>",
                    width: 60, align: 'center', height: 36},
                {view: "label", label: "Манускрипт солюшн: CRM: настройки", css: 'ms-logo-text'
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
                        {height: 36, cols: u_buttons},
                        {view: "tabview",
                            width: document.documentElement.clientWidth,
                            height: document.documentElement.clientHeight-72-30-14,
                            id:"tabview2",
                            animate:false,
                            cells: view_cells_options,
                            multiview: true
                            }
                        ]},
                    {}
                    ]},
                {cols: [
                    {template: 'Вы находитесь на сервере: ' + '&nbsp;<span class="serv_info">' + location.hostname + "</span>",
                        height: 30},
                    {}
                ]}
            ]
        }
    });

var get_c_view_opt = function () {
    var c_view = ($$("users_dt").isVisible()) ? "users_dt":
                 ($$("topics_dt").isVisible()) ? "topics_dt":
                 ($$("status_dt").isVisible()) ? "status_dt":
                 "alerts_dt";
    return c_view;
    };

var opt_refresh = function () {
    var cv = get_c_view_opt();
    $$(cv).refreshColumns();
    $$(cv).refresh();
    };
