//price_tbl
define([
    "app", "models/price_db", "models/old_zak_db"
], function (app, store, old_zak_db) {


    var ui = {
        view: "datatable",
        id: 'price_tbl',
        scrollX: false,
        select: 'row',
        hover: 'hover_table',
        navigation: true,
        editable: true,
        tooltip: true,
        hidden: true,
        rowHeight: 30,
        doubleEnter: 0,
        old_zak_load: undefined,
        //width: window.innerWidth > 1170 ? 1170: 980,
        type: app.tbl_types,
        columns: [
            {
                id: "STITLE", header: "Поставщик",
                template: "<span class='{common.vnd_color()} ' style='{common.vnd_txt()}'>#STITLE#</span>",
                width: 85, sort: "string"
            },
            {
                id: "PRICE",
                css: "col_text_right",
                header: { text: "Цена", css: "col_text_right", adjust: true },
                template: "<span style='border-bottom:{common.color_bg()} 2px solid'><span style='color:{common.price_color()}'>{common.price_value()}</span></span>",
                width: 85, sort: "int"
            },
            {
                id: "TITLE", header: "Товар",
                template: "<span style='border-bottom:{common.color_bg()} 2px solid'><span class='tovar_title'>{common.title_render()}</span>{common.life_render()}</span>",
                css: "title_prc",
                //width: (window.innerWidth - 560) / 2, 
                fillspace: true,
                sort: "string"
            },
            {
                id: "VENDOR", header: "Производитель",
                template: "<span style='border-bottom:{common.color_bg()} 2px solid; {common.vnd_txt()}'><span class='vendor_title'>{common.vendor_render()}</span></span>",
                //width: (window.innerWidth - 560) / 2, 
                width: 160,
                sort: "string"

            },
            {
                id: "REST", header: { text: "Остаток", css: "col_text_right" }, css: "col_text_right",
                template: "{common.rest_render()}",
                width: 70, sort: "int"
            },
            {
                id: "SP_COUNT", css: "col_text_right", header: { text: "Кол-во", css: "col_text_right" },
                template: "{common.sp_count_render()}",
                width: 70,
                editor: "text", sort: "int"
            },
            {
                id: "SP_SUMMA", css: "col_text_right", header: { text: "Сумма", css: "col_text_right" }, adjust: true,
                template: "{common.sp_summa_render()}",
                width: 100
            },
            {
                id: "RATE", header: "Упак", width: 100,
                template: "{common.rate_render()}", sort: "int"
            },

            {
                id: "REESTR", header: "ЖВНЛС", template: "{common.reestr_render()}",
                width: 100, sort: "int"
            }
        ],
        data: store,
        on: {
            onAfterEditStart: function () {
                var tbl = $$('price_tbl'),
                    item = tbl.getSelectedItem();

                if (item.SP_COUNT === "x" || item.SP_COUNT === ".") {
                    tbl.editStop()
                }
            },
            onKeyPress: function (code, e) {
                var me = this,
                    item = me.getSelectedItem();

                if (item.SP_COUNT === "x" || item.SP_COUNT === ".") {
                    return
                }

                if (this.getEditState() === false) {
                    if ((app.isCharCode(code) || code === 32 || code === 187 || code === 107) && code !== 8) {
                        if (code !== 8 && code !== 32 && code !== 187 && code !== 107) {
                            $$('main_search').setValue('');
                        } else {
                            if (code === 32) {
                                $$('main_search').setValue($$('main_search').getValue() + ' ');
                            }
                            //if (code === 187 || code === 107) {
                            //    $$('main_search').setValue($$('main_search').getValue() + '+');
                            //}
                        }
                        $$('main_search').focus();
                    } else if (code === 8) {
                        $$('main_search').focus();
                        setTimeout(function () {
                            $$('main_search').callEvent('onChange', [$$('main_search').getValue()]);
                        }, 100);
                        //$$('main_search').callEvent('onChange', [$$('main_search').getValue()]);
                    }

                    if (code === 13 || app.isNumberCode(code)) {
                        setTimeout(function () {
                            me.edit({
                                row: me.getSelectedId(),
                                column: "SP_COUNT"
                            });

                            if ($$('orders_error_db').getCursor() !== null && code === 13) {
                                $$('price_tbl').getEditor().node.querySelector('input').value = $$('orders_error_db').getItem($$('orders_error_db').getCursor()).old;
                            }

                            if (app.isNumberCode(code)) {
                                $$('price_tbl').getEditor().node.querySelector('input').value = String.fromCharCode(code);
                            }
                        }, 10);
                    }

                    if (code === 46 && e.ctrlKey) {
                        var item = me.getSelectedItem();
                        item.SP_COUNT = 0;
                        item.SP_SUMMA = 0;
                        $$('orders_body_db').config.del_rec(item);
                        $$('price_tbl').refresh();
                    }

                } else {
                    var id = me.getSelectedId(),
                        n_id = id;
                    if (code === 40) {
                        me.editStop();
                        n_id = me.getNextId(id);
                    } else {
                        if (code === 38) {
                            me.editStop();
                            n_id = me.getPrevId(id);
                        }
                    }
                    if (n_id !== undefined) {
                        me.select(n_id);
                    }
                    if (app.isCharCode(code)) {
                        return false;
                    }
                }
            },
            onAfterEditStop: function (state, editor, ignoreUpdate) {
                var tbl = $$('price_tbl'),
                    item = tbl.getSelectedItem();

                if (item.SP_COUNT === "x" || item.SP_COUNT === ".") {
                    return false
                }

                if (state.value * 1 === 0 * 1) {
                    item.SP_COUNT = 0;
                    item.SP_SUMMA = 0;
                    $$('orders_body_db').config.del_rec(item);
                    $$('price_tbl').refresh();
                    return false;
                }

                if (state.value != state.old) {
                    setTimeout(function () {
                        item.SP_PRICE = item.PRICE;
                        tbl.config.edit_price(tbl, item, state);
                    }, 10);

                } else {
                    if (item.PRICE > item.SP_PRICE) {
                        item.SP_PRICE = item.PRICE;
                        $$('orders_body_db').config.app_rec(item);
                        $$('price_tbl').refresh();
                    }
                }
            },
            onAfterSelect: function (id) {
                //get_count_in_old_orders(self, sklad, acode, scode, orderid, old_period)
                var item = this.getItem(id.row),
                    days = item.OLD_ZAK > 0 ? $$('value_old_count').getValue() : 365;
                //$$('check_old_count').getValue() === 1 ? $$('value_old_count').getValue()
                if ($$('check_old_count').getValue() === 1) {
                    old_zak_db.clearAll();
                    if (item.OLD_ZAK > 0 || app.user_info.options.options.fix_old_zak_pnl) {
                        if ($$("price_db").config.old_zak_load !== undefined) {
                            clearTimeout($$("price_db").config.old_zak_load)
                        }
                        $$("price_db").config.old_zak_load = setTimeout(function () {
                            old_zak_db.load(days);
                        }, 750)
                        $$('old_zakaz_pnl').show()
                    } else {
                        $$('old_zakaz_pnl').hide()
                    }
                }


                $$("price_db").setCursor(id);
                var pos = $$("price_db").getIndexById(id),
                    count = $$("price_db").count(),
                    pcount = $$('price_db').config.datafetch;

                if (pos >= count - (pcount / 2)) {
                    $$('price_db').load();
                }

                //$$('price_db').load();
            },
            onBeforeSort: function (by, dir, as) {
                //console.log(by, dir, as)
                if (by !== 'SP_COUNT') {
                    $$('price_db').clear_data();
                    $$('price_db').config.sort_conf = [by, dir];
                    $$('price_db').load();
                }


                return false;
            },
            onScrollY: function () {
                var new_state = this.getScrollState().y,
                    h_table = $$("price_tbl")._dtable_height;
                if (h_table / 2 <= new_state) {
                    $$('price_db').load();
                }
            }

        },
        onClick: {
            "old_zak_ico": function (e, id) {
                //console.log(e, id)
                //$$('old_zakaz_pnl').show()
                //return false;//prevents row selection
            }
        },
        edit_price: function (tbl, item, state) {
            // проверить кратность
            var tmp_count = app.setCount(item.SP_COUNT, item.RATE, item.MINZAK);
            //console.log(tmp_count, state.value)
            if (tmp_count != state.value) {
                var str_com = 'Поставщиком установлена кратность <span class="text_info">{0} шт.</span> и <br>минимальный заказ <span class="text_info">{2} шт.</span> \n' +
                    '<p>Сохравнить заказ в количестве <span class="text_warning">{1} шт.</span>?</p>';
                str_com = str_com
                    .replace('{0}', item.RATE)
                    .replace('{2}', item.MINZAK)
                    .replace('{1}', tmp_count);

                webix.ui({
                    view: "window",
                    id: "rate_alert",
                    head: "Внимание !!!",
                    width: 350,
                    height: 200,
                    position: "center",
                    modal: true,
                    body: {
                        rows: [
                            { template: str_com },
                            {
                                padding: 5,
                                cols: [
                                    {
                                        view: "button",
                                        value: "Сохранить",
                                        id: 'save_rate_btn',
                                        css: "button_warning",
                                        width: 150,
                                        click: function () {
                                            //var item = item;//tbl.getSelectedItem();
                                            $$('rate_alert').close();
                                            item.SP_COUNT = tmp_count;
                                            item.SP_SUMMA = item.SP_COUNT * item.PRICE;
                                            $$('orders_body_db').config.app_rec(item);
                                            tbl.refresh();
                                            webix.UIManager.setFocus(tbl);
                                        }
                                    },
                                    { view: 'spacer' },
                                    {
                                        view: "button",
                                        value: "Отменить",
                                        id: 'cancel_rate_btn',
                                        width: 150,
                                        click: function () {
                                            $$('rate_alert').close();
                                            item.SP_COUNT = state.old;
                                            //tbl.getSelectedItem().SP_COUNT = state.old;
                                            tbl.refresh();
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    on: {
                        onShow: function () {
                            $$('save_rate_btn').$view.querySelector('button').classList.add('act');
                            $$('cancel_rate_btn').$view.querySelector('button').classList.add('js_act');
                        },
                        onKeyPress: function (code, e) {
                            if (code === 13) {
                                $$('rate_alert').$view.querySelector('button.act').click();
                            }
                            if (code === 37 || code === 39) {
                                var js_act = $$('rate_alert').$view.querySelector('button.js_act'),
                                    act = $$('rate_alert').$view.querySelector('button.act');

                                act.classList.remove('act');
                                act.classList.add('js_act');

                                js_act.classList.remove('js_act');
                                js_act.classList.add('act');
                            }
                        }
                    }
                }).show();
            }
            else {
                //var item = $$('price_tbl').getSelectedItem();
                item.SP_COUNT = tmp_count;
                item.SP_SUMMA = item.SP_COUNT * item.PRICE;
                item.SP_PRICE = item.PRICE;
                $$('orders_body_db').config.app_rec(item);
                tbl.refresh();
            }
        }
    };
    //$$('price_db').add({ "ACODE": "", "DT": "", "ID_SPR": "", "LIFE": "", "MAXPACK": "", "MINZAK": "", "NDS": "", "PRICE": "", "RATE": "", "REESTR": "", "REST": "", "SCODE": "", "SP_COUNT": "", "SP_DATE": "", "SP_PRICE": "", "SP_SUMMA": "", "STITLE": "", "TITLE": "", "VENDOR": "", "VV1SP_TITLE": "", "VV2VENDOR": "", "VV3MNN": "" })   
    return ui;
});
