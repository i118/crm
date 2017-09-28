// главная форма архива
define([
    "app", "views/tables/archive_orders_head", "views/popups/avnd_mode", "views/tables/archive_order_body_tbl",
     "views/windows/cross_records_win", "views/archive/main_toolbar_row",
    "views/popups/adres_pp", "views/popups/author_pp", "views/popups/period_pp", "views/popups/trash_arcive_pp",
    "models/cross_records_db"
], function (app, archive_orders_head, avnd_mode, archive_order_body_tbl, cross_records_win, main_toolbar_row) {

    var _layout = {
        id: "archive_main_view",
        rows: [
            {
                id: "avm_header",
                padding: 10,
                //css:"bg_panel",
                cols: [
                    { view: "icon", css: "logo_30", align: "left" },
                    { view: "label", label: "Архив" + '&nbsp;<span class="ver_info">' + app.config.version + "</span>", css: "text_warning logo_title", align: "left" },
                    { type: "spacer" },
                    {
                        view: "label", align: "right", css: "user_name_title",
                        on: {
                            onBeforeRender: function () {
                                this.config.label = app.user_info.name;
                            }
                        }
                    },
                    {
                        view: "button",
                        css: "button_primary button_raised",
                        width: 100,
                        value: "Прайс",
                        click: function () {                            
                            app.show('price')
                        }

                    },
                    {
                        view: "button",
                        css: "button_info",
                        width: 100,
                        value: "Выход",
                        click: function () {
                            app.deleteCookie("plxlitesid");
                            location.reload();
                        }
                    }
                ]
            },
            main_toolbar_row,
            {
                id: "avm_body",
                type: "material",
                cols: [
                    { css: 'bg_clean' },
                    {
                        width: window.innerWidth > 1170 ? 1170 : 980,
                        id: "tp_test",
                        cols: [
                            archive_orders_head,
                            archive_order_body_tbl
                        ]
                    }
                    ,
                    { css: 'bg_clean' }
                ],
                /*type:"material",
                cols: [
                    {css: 'bg_clean'},
                    {
                        width: window.innerWidth > 1170 ? 1170: 980,
                        id: "tp_test",
                        rows:[
                            {
                                cols:[
                                    price_tbl,
                                    orders_tbl
                                ]
                            },
                            old_zakaz_tbl                            
                        ]
                        
                    },
                    {css: 'bg_clean'}
                ]*/
            },
            {
                id: "avm_footer",
                height: 40,
                cols: [
                    /*
                    {
                        view: "button",
                        css: "button_info",
                        autowidth: true,
                        value: "Настройки",
                        click: function () {
                            webix.ui({
                                view: "sidemenu",
                                width: 200,
                                position: "left",
                                body: {
                                    view: "list",
                                    borderless: true,
                                    scroll: false,
                                    template: "<span class='webix_icon fa-#icon#'></span> #value#",
                                    data: [
                                        { id: 1, value: "Users", icon: "user" },
                                        { id: 2, value: "Products", icon: "cube" },
                                        { id: 3, value: "Reports", icon: "line-chart" }
                                    ]
                                }
                            }).show();
                        }
                    },*/
                    {
                        view: "button",
                        css: "button_info",
                        autowidth: true,
                        value: "Кoрзина",
                        popup: "trash_arcive_pp"
                    },
                    {}
                ]
            }
        ]
    };

    _layout.refresh_toolbar = function () {
        if ($$("orders_head_arch").getItem($$("orders_head_arch").getCursor()).state * 1 === 26) {
            $$('htrash_btn').hide();
            $$('send_btn_htools_btn').hide();
            $$('return_btn_htools_btn').hide();
        } else {
            $$('htrash_btn').show();
            $$('send_btn_htools_btn').show();
            $$('return_btn_htools_btn').show();
        }
    };

    return _layout;
});