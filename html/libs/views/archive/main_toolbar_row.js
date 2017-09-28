define([
    "app", "views/windows/report_win", "views/windows/cross_records_win"
], function (app, report_win, cross_records_win) {

    var ui = {
        id: "avm_toolbar",
        css: "bg_panel",
        height: 50,
        padding: 5,
        view: "form",
        elements: [
            {
                id: "arch_head_pnl",
                css: "pvm_toolbar_col",
                padding: 10,
                cols: [
                    {
                        view: "button", id: "avnd_list_bnt", align: "left", label: "Поставщики", width: 170,
                        popup: "avnd_mode", badge: '&#9660;',
                        on: {
                            onItemClick: function () {
                                setTimeout(function () {
                                    $$('avnd_mode').show();
                                }, 100);

                            }
                        }
                    },
                    {
                        view: "button", id: "avnd_list_bnt1", align: "left", label: "Адрес",
                        autowidth: true, popup: "adres_pp", badge: '&#9660;',

                        on: {
                            onItemClick: function () {
                                setTimeout(function () {
                                    $$('adres_pp').show();
                                }, 100);
                            }
                        }
                    },
                    {
                        view: "button", id: "avnd_list_bnt2", align: "left", label: "Автор", autowidth: true,
                        popup: "author_pp", badge: '&#9660;',
                        on: {
                            onItemClick: function () {
                                setTimeout(function () {
                                    $$('author_pp').show();
                                }, 100);

                            }
                        }
                    },
                    {
                        view: "button", id: "avnd_list_bnt3", align: "left", value: "Сегодня", autowidth: true,
                        popup: "period_pp", badge: '&#9660;',
                        on: {
                            onItemClick: function () {
                                setTimeout(function () {
                                    $$('period_pp').show();
                                }, 100);

                            }
                        }
                    },
                    { width: 420 },
                    {
                        cols: [
                            {
                                view: "icon",
                                css: "return_btn htools_btn",
                                id: "return_btn",
                                align: "right",
                                on: {
                                    onAfterRender: function () {

                                        var el_btn = this.getNode().querySelector('button');

                                        el_btn.timeOutMM = undefined;
                                        el_btn.timeOut = undefined;

                                        // обработчик показа подсказки

                                        webix.event(el_btn, 'mouseout', function (e) {
                                            webix.delay(function () {
                                                clearTimeout(el_btn.timeOutMM);
                                                if ($$('return_btn_tooltip') !== undefined) {
                                                    $$('return_btn_tooltip').destructor();
                                                }
                                            }, {}, [], 250);

                                        })

                                        webix.event(el_btn, webix.env.mouse.move, function (e) {
                                            this.timeOutMM = setTimeout(function () {
                                                if ($$('return_btn_tooltip') === undefined) {
                                                    webix.ui({
                                                        view: "tooltip",
                                                        id: 'return_btn_tooltip',
                                                        template: "<span class='text_warning'>УДЕРЖИВАЙТЕ</span><br> чтобы <span class='text_success'>вернуть на доработку группу</span>",
                                                        height: 100
                                                    }).show({}, { x: e.x, y: e.y });
                                                }
                                            }, 250);
                                        });

                                        // обработчик кнопки удаления заказа 

                                        webix.event(el_btn, webix.env.mouse.down, function () {
                                            el_btn.classList.add('load_cur');
                                            this.timeOut = setTimeout(function () {
                                                el_btn.classList.remove('load_cur');
                                                var tmp = [], i = 1, len = 0;
                                                $$('orders_head_arch').filter(function (el) {
                                                    if (el.izb) {
                                                        tmp.push(el);
                                                    }
                                                    return true;
                                                });
                                                len = tmp.length;
                                                tmp.forEach(function (el) {
                                                    $$('archive_orders_head').config.utils.return_ord(el.id, el.svod, len > i ? true : false);
                                                    i += 1;
                                                });
                                            }, 1500);
                                        });

                                        webix.event(el_btn, webix.env.mouse.up, function () {
                                            clearTimeout(el_btn.timeOut);
                                            el_btn.classList.remove('load_cur');
                                        });
                                    }
                                },
                                click: function () {
                                    return false

                                }
                            },
                            { width: 20 },
                            {
                                view: "icon",
                                css: "send_btn htools_btn",
                                id: "send_btn",
                                //hidden: true,
                                align: "right",
                                //tooltip: "УДЕРЖИВАЙТЕ чтобы отправить группу",
                                on: {
                                    onAfterRender: function () {
                                        //console.log('onAfterRender', this.getNode().querySelector('button'))
                                        var el_btn = this.getNode().querySelector('button');

                                        el_btn.timeOutMM = undefined;
                                        el_btn.timeOut = undefined;

                                        // обработчик показа подсказки

                                        webix.event(el_btn, 'mouseout', function (e) {
                                            webix.delay(function () {
                                                clearTimeout(el_btn.timeOutMM);
                                                if ($$('return_btn_tooltip') !== undefined) {
                                                    $$('return_btn_tooltip').destructor();
                                                }
                                            }, {}, [], 250);

                                        })

                                        webix.event(el_btn, webix.env.mouse.move, function (e) {
                                            this.timeOutMM = setTimeout(function () {
                                                if ($$('return_btn_tooltip') === undefined) {
                                                    webix.ui({
                                                        view: "tooltip",
                                                        id: 'return_btn_tooltip',
                                                        template: "<span class='text_warning'>УДЕРЖИВАЙТЕ</span><br> чтобы <span class='text_success'>отправить группу</span>",
                                                        height: 100
                                                    }).show({}, { x: e.x, y: e.y });
                                                }
                                            }, 250);
                                        });

                                        // обработчик кнопки удаления заказа 

                                        webix.event(el_btn, webix.env.mouse.down, function () {
                                            el_btn.classList.add('load_cur');
                                            this.timeOut = setTimeout(function () {
                                                el_btn.classList.remove('load_cur');
                                                var tmp = [], i = 1, len = 0;
                                                $$('orders_head_arch').filter(function (el) {
                                                    if (el.izb) {
                                                        tmp.push(el);
                                                    }
                                                    return true;
                                                });
                                                len = tmp.length;
                                                tmp.forEach(function (el) {
                                                    $$('archive_orders_head').config.utils.send(el.id, len > i ? true : false);
                                                    i += 1;
                                                });
                                            }, 1500);
                                        });

                                        webix.event(el_btn, webix.env.mouse.up, function () {
                                            clearTimeout(el_btn.timeOut);
                                            el_btn.classList.remove('load_cur');
                                        });
                                    }
                                },
                                click: function () {
                                    return false

                                }
                            },
                            { width: 20 },
                            {
                                view: "icon",
                                css: "union_btn htools_btn",
                                id: "union_btn",
                                align: "right",
                                on: {
                                    onAfterRender: function () {
                                        //console.log('onAfterRender', this.getNode().querySelector('button'))
                                        var el_btn = this.getNode().querySelector('button');

                                        el_btn.timeOutMM = undefined;
                                        el_btn.timeOut = undefined;

                                        // обработчик показа подсказки

                                        webix.event(el_btn, 'mouseout', function (e) {
                                            webix.delay(function () {
                                                clearTimeout(el_btn.timeOutMM);
                                                if ($$('return_btn_tooltip') !== undefined) {
                                                    $$('return_btn_tooltip').destructor();
                                                }
                                            }, {}, [], 250);

                                        })

                                        webix.event(el_btn, webix.env.mouse.move, function (e) {
                                            this.timeOutMM = setTimeout(function () {
                                                if ($$('return_btn_tooltip') === undefined) {
                                                    webix.ui({
                                                        view: "tooltip",
                                                        id: 'return_btn_tooltip',
                                                        template: "<span class='text_warning'>УДЕРЖИВАЙТЕ</span><br> чтобы <span class='text_success'>чтобы объединить группу</span>",
                                                        height: 100
                                                    }).show({}, { x: e.x, y: e.y });
                                                }
                                            }, 250);
                                        });


                                        // обработчик кнопки удаления заказа 

                                        webix.event(el_btn, webix.env.mouse.down, function () {
                                            el_btn.classList.add('load_cur');
                                            this.timeOut = setTimeout(function () {
                                                el_btn.classList.remove('load_cur');
                                                var tmp = [];

                                                $$('orders_head_arch').filter(function (el) {
                                                    if (el.izb) {
                                                        tmp.push(el.id);
                                                    }
                                                    return true;
                                                });

                                                $$('cross_records_db').ids = tmp;
                                                $$('cross_records_db').load();

                                                if ($$('cross_records_db').count() > 0) {
                                                    webix.ui(cross_records_win).show();
                                                } else {
                                                    var req = {
                                                        method: 'archive.combine_orders',
                                                        params: [$$('cross_records_db').ids[0], $$('cross_records_db').ids, app.user_info.id]
                                                    };

                                                    app.request(req, function (text) {
                                                        var respons = JSON.parse(text);
                                                        if (app.check_response(respons)) {
                                                            var rows = respons.result[0];
                                                            $$('orders_head_arch').load();
                                                        }
                                                    }, true);
                                                }
                                            }, 1500);
                                        });

                                        webix.event(el_btn, webix.env.mouse.up, function () {
                                            clearTimeout(el_btn.timeOut);
                                            el_btn.classList.remove('load_cur');
                                        });
                                    }
                                }
                            }
                        ]
                    },

                ]
            },
            {
                hidden: true,
                id: "arch_order_pnl",
                css: "pvm_toolbar_col",
                cols: [
                    {
                        view: "button",
                        id: "return_archive_btn",
                        value: "Назад",
                        width: 110,
                        click: function () {
                            $$('arch_head_pnl').show();
                            $$("arch_order_pnl").hide();
                            //$$('archive_orders_head').unselectAll();
                            $$('archive_orders_head').show();
                            $$('archive_order_body_tbl').hide();

                            $$('orders_head_arch').load();
                        }
                    }, {
                        view: "text",
                        value: '',
                        id: "main_search_ord",
                        placeholder: "Поиск",
                        old_search: '',
                        timeout: null,
                        width: window.innerWidth <= 1024 ? 100 : 402,
                        keyPressTimeout: 700,
                        on: {
                            onChange: function (newv) {
                                console.log('onChange');
                                this.config.old_search = newv;
                                $$('orders_body_archive_db').filter(function (el) {
                                    return el.TITLE.toUpperCase().indexOf(newv.toUpperCase()) > -1;
                                });
                            },
                            onTimedKeyPress: function () {
                                var me = this;
                                if (me.config.old_search !== me.getValue()) {
                                    me.callEvent('onChange', [me.getValue()]);
                                }

                            },
                            onKeyPress: function (code, e) {
                                if (code === 40) {
                                    $$('archive_order_body_tbl').select($$('archive_order_body_tbl').getFirstId());
                                    webix.UIManager.setFocus($$('archive_order_body_tbl'));
                                }
                            }
                        }

                    },
                    { width: 450 },
                    {
                        padding: 10,
                        cols: [

                            {
                                view: "icon",
                                id: "return_btn_htools_btn",
                                css: "return_btn htools_btn",
                                align: "right",
                                tooltip: "Вернуть на доработку",
                                click: function () {
                                    var item = $$("orders_head_arch").getItem($$("orders_head_arch").getCursor());
                                    $$('archive_orders_head').config.utils.return_ord(item.id, item.svod);
                                    $$('return_archive_btn').config.click();
                                }
                            },
                            { width: 10 },
                            {
                                view: "icon",
                                id: "send_btn_htools_btn",
                                css: "send_btn htools_btn",
                                align: "right",
                                tooltip: "Отправить",
                                click: function () {
                                    var item = $$("orders_head_arch").getItem($$("orders_head_arch").getCursor());
                                    $$('archive_orders_head').config.utils.send(item.id);
                                    $$('return_archive_btn').config.click();
                                }
                            },
                            { width: 10 },
                            {
                                view: "icon",
                                css: 'copy_btn htools_btn',
                                tooltip: 'Копировать',
                                click: function () {
                                    var item = $$("orders_head_arch").getItem($$("orders_head_arch").getCursor());
                                    $$('archive_orders_head').config.utils.copy(item.id);
                                    $$('return_archive_btn').config.click();
                                }
                            },
                            { width: 10 },
                            {
                                view: "icon",
                                css: "report_btn htools_btn",
                                align: "right",
                                tooltip: "Печать",
                                click: function () {
                                    webix.ui(report_win).show();
                                }
                            },
                            { width: 20 },
                            {
                                view: "icon",
                                id: 'htrash_btn',
                                css: "htrash_btn htools_btn",
                                align: "right",
                                tooltip: "Удалить заказ, УДЕРЖИВАЙТЕ чтобы удалить",
                                on: {
                                    onAfterRender: function () {
                                        //console.log('onAfterRender', this.getNode().querySelector('button'))
                                        var el_btn = this.getNode().querySelector('button');
                                        // обработчик кнопки удаления заказа 
                                        el_btn.timeOut = undefined;
                                        webix.event(el_btn, webix.env.mouse.down, function () {
                                            el_btn.classList.add('load_cur');
                                            this.timeOut = setTimeout(function () {
                                                el_btn.classList.remove('load_cur');
                                                $$('orders_head_arch').in_trash();
                                                $$('return_archive_btn').config.click();
                                            }, 1500);
                                        });

                                        webix.event(el_btn, webix.env.mouse.up, function () {
                                            clearTimeout(el_btn.timeOut);
                                            el_btn.classList.remove('load_cur');
                                        });
                                    }
                                }
                            }
                        ]
                    },
                    {},
                    {
                        view: "label",
                        align: "right",
                        id: "order_list_mn",
                        css: "order_list_mn oa"
                    },
                    {
                        view: "label",
                        id: "order_summ",
                        align: "right",
                        //badge: '&#9660;', 
                        autowidth: true,
                        on: {
                            onItemClick: function () {


                            }
                        }
                    },
                ]
            }
        ]
    }
    return ui

});
