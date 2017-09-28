// главная форма заказов
define([
    "app", "views/popups/vnd_mode", "views/tables/price_tbl", "views/tables/orders_tbl",
    "views/price/pvm_toolbar_row2", "views/price/pvm_toolbar_row3", "views/price/pvm_toolbar_row1", "views/price/options_pnl",
    "views/price/old_zakaz_tbl", "views/tables/defecture_tbl",
    "models/orders_body_db", "views/popups/order_list_pp", "views/popups/edit_pp", "views/popups/order_summ_pp",
    "views/popups/trash_pp"
], function (app, vnd_mode, price_tbl, orders_tbl, pvm_toolbar_row2, pvm_toolbar_row3, pvm_toolbar_row1, options_pnl, old_zakaz_tbl, defecture_tbl) {

    var _layout = {
        id: "price_main_view",

        rows: [
            {
                id: "pvm_header",
                padding: 15,
                //css:"bg_panel",
                cols: [
                    { view: "icon", css: "logo_30", align: "left" },
                    { view: "label", label: "Прайс " + '&nbsp;<span class="ver_info">' + app.config.version + "</span>", css: "text_primary logo_title", align: "left" },
                    {
                        cols: [
                            {}, {
                                id: "alert_pnl"
                                //$$('alert_pnl').getNode().innerHTML = "<span class='text_warning' id='testa' style='padding: 5px; border: 2px solid blue'>sadasd asd asda<br> asda</span>"
                            }, {}
                        ]
                    },
                    {
                        rows: [
                            {
                                view: "label", align: "right", css: "user_name_title",
                                height: 13,
                                on: {
                                    onBeforeRender: function () {
                                        this.config.label = app.user_info.name;
                                    }
                                }
                            },
                            {
                                view: "label",
                                //width: 300,
                                id: "order_list_mn",
                                css: "order_list_mn",
                                height: 13,
                                align: "right",
                                popup: "order_list_pp",
                                on: {
                                    onItemClick: function () {
                                        setTimeout(function () {
                                            $$('order_list_pp').show();
                                        }, 100);
                                    }
                                }
                            }

                        ]
                    },

                    {
                        view: "button",
                        css: "button_warning button_raised",
                        id: "hbtn_arch",
                        width: 100,

                        value: "Архив",
                        click: function () {
                            app.show('archive')
                        }
                    },
                    {
                        view: "button",
                        css: "button_info",
                        width: 100,
                        value: "Выход",
                        click: function () {
                            //app.deleteCookie("plxlitesid");
                            location.reload();
                        }
                    }
                ]
            },
            {
                id: "pvm_toolbar",
                css: "bg_panel",
                padding: 5,
                view: "form",
                elements: [
                    {
                        rows: [
                            //pvm_toolbar_row1,
                            pvm_toolbar_row2,
                            pvm_toolbar_row3
                        ]
                    }

                ]
            },
            {
                id: "vnd_panel_flx",
                autoheight: true,
                //height: 30,             
                cols: []
            },
            {
                id: "pvm_body",
                type: "material",
                cols: [
                    { css: 'bg_clean' },
                    {
                        width: window.innerWidth > 1170 ? 1170 : 980,
                        id: "tp_test",
                        rows: [
                            {
                                animate: false,
                                cells: [
                                    price_tbl,
                                    orders_tbl,
                                    defecture_tbl
                                ]
                            },
                            old_zakaz_tbl
                        ],
                    },
                    { css: 'bg_clean' }
                ],

            },

            {
                id: "pvm_footer",
                height: 40,

                cols: [
                    {
                        view: "button",
                        css: "button_info",
                        autowidth: true,
                        value: "Настройки",
                        click: function () {
                            options_pnl.show();
                        }
                    },
                    {
                        view: "button",
                        css: "button_info",
                        autowidth: true,
                        value: "Кoрзина",
                        popup: "trash_pp"
                    },
                    {},
                    {
                        view: "button",
                        css: "button_primary help_js",
                        autowidth: true,
                        value: "Помощь",
                        click: function () {
                            var enjoyhint_script_steps = [
                                {
                                    selector: '[title = "Новый заказ"]',
                                    event: 'next',
                                    description: 'Нажмите на кнопку "Новый заказ"',
                                    nextButton: { className: "myNext", text: "ДАЛЬШЕ" },
                                    showSkip: false,
                                    showNext: true
                                },
                                {
                                    selector: '[view_id = adres_win_tb]',
                                    event: 'next',
                                    description: 'Выбирете адрес для которого создаете заказ.',
                                    nextButton: { className: "myNext", text: "ДАЛЬШЕ" },
                                    showSkip: false,
                                    showNext: true
                                },
                                {
                                    selector: '.olmn_div',
                                    event: 'next',
                                    description: 'Ваш заказ создан',
                                    nextButton: { className: "myNext", text: "ДАЛЬШЕ" },
                                    showSkip: false,
                                    showNext: true
                                }
                            ];

                            var enjoyhint_instance = new EnjoyHint({
                                onStart: function () {
                                    //do something
                                }
                            });

                            enjoyhint_instance.set(enjoyhint_script_steps);
                            enjoyhint_instance.run()

                        }
                    }
                ]
            }
        ],
        $init: function () {
            webix.ui({
                id: 'shirma',
                view: 'window',
                modal: true,
                fullscreen: true,
                on: {
                    onShow: function () {
                        setTimeout(function () {
                            // $$('shirma').close()    
                            //$$('orders_tbl').getNode().classList.add('orders_tbl_ob')
                            $$('segment_vw').getNode().querySelectorAll('button').forEach(function(el){
                                el.onkeydown=function(e){
                                       e.stopPropagation()
                                  }
                            })
                            //$$('orders_body_db').bind_event()

                            document.onkeydown = function(e){
                                //console.log(e.keyCode)
                            }
                            
                            
                        }, 700);
                    }
                }
            }).show()
            

        }
    };

    return _layout;
});