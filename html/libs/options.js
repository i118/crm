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

var color_options = [
        {id:1, value:"red"},
        {id:2, value:"blue"},
        {id:3, value:"green"},
        {id:4, value:"orange"},
        {id:5, value:"grey"},
        {id:6, value:"yellow"}
    ];

    var position_options = [
        {id:1, value:"left"},
        {id:2, value:"right"},
        {id:3, value:"top"},
        {id:4, value:"bottom"}
    ];

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
                onBeforeSelect: function(item) {
                    this.addRowCss(item.id, "r_css");
                    },
                onBeforeUnselect: function(item) {
                    this.removeRowCss(item.id, "r_css");
                    },
                onItemClick: function(c_row) {
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
                {view:"button", id: "_ch_password", type:"imageButton", image: './libs/img/excel.svg',label: "Сменить пароль", width: 150,
                    click: function() {webix.message('смена пароля')}
                    },
                {view:"button", id: "_change", type:"imageButton", image: './libs/img/excel.svg',label: "Изменить данные", width: 180,
                    click: function() {
                        $$("user_prop").enable();
                        $$("_apply_chgs").enable();
                        $$("_change").disable();
                        }
                    },
                {view:"button", id: "_apply_chgs", type:"imageButton", image: './libs/img/excel.svg',label: "Применить изменения", width: 200, disabled: true,
                    click: function() {
                        $$("_apply_chgs").disable();
                        $$("_change").enable();
                        $$("user_prop").disable();
                        let item = $$("user_prop").getValues();
                        var params = {"set_c_user": item};
                        let tem = request(req_url, params, !0).response
                        //item = JSON.parse(item)[0];
                        $$("user_prop").parse(item);
                        $$("user_prop").refresh()
                        console.log(item);
                        }
                    }
                ]}
            ]},
        {}
    ]
    };


var topics_view = {template: "темы"};
var status_view = {template: "статусы"};
var alerst_view = {template: "алерты"};

var view_cells_options = [
            {header: 'Пользователи', body: users_view},
            {header: 'Темы', body: topics_view},
            {header: 'Статусы', body: status_view},
            {header: 'Приоритеты', body: alerst_view}
            ];

var u_buttons = [
    {},
    {view:"button", id: "_opt_refresh", type:"imageButton", image: './libs/img/sync.svg',
        label: "Обновить", width: 120, tooltip: "Синхронизация с сервером, <Ctrl>+Q", hotkey: "q+ctrl"},
    {view:"button", id: "_back", type:"imageButton", image: './libs/img/excel.svg',label: "Назад", width: 90,
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
                {view: "label", label: "Манускрипт солюшн: настройки CRM", css: 'ms-logo-text'
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

$$("user_prop").setValues({
        layout:{
            width:250,
            height:480
        },
        data:{
            url:"https://webix.com/data",
            type:"json"
        },
        style:{
            position:2,
            color:1
        }

    });
