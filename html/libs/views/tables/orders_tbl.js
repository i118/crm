//orders_tbl

define([
    "app", "models/orders_body_db", "views/price/orders_toolbar", "models/cross_records_db",
    "views/windows/cross_records_win"
], function (app, store, orders_toolbar, cross_records_db, cross_records_win) {


    var ui = {
        view: "datatable",
        id: 'orders_tbl',
        scrollX: false,
        select: 'row',
        hover: 'hover_table',
        //width: window.innerWidth > 1170 ? 1170: 980,
        navigation: true,
        editable: true,
        tooltip: true,
        //areaselect: false,
        //datafetch
        rowHeight: 30,
        type: app.tbl_types,
        doubleEnter: 0,
        header: { height: 10 },
        checkboxRefresh: true,
        columns: [
            {
                //$$('orders_tbl').getHeaderContent("mc1").isChecked()
                id: "izb", header: [{ content: "masterCheckbox", contentId: "mc1" }, ""],
                template: "{common.checkbox()}",
                width: 35

            },
            {
                //$$('orders_tbl').getHeaderContent("mc1").isChecked()
                id: "FG_INDIVID", header: ["", ""],
                template: app.custom_checkbox,
                width: 35,
                tooltip: false,

            },
            {
                id: "STITLE", header: [{ text: "<div id='tlbr_orders'></div>", colspan: 9 }, "Поставщик"],
                template: "<span class='{common.vnd_color()}'>#STITLE#</span>",
                width: 85,
                sort: "string"
            },
            {
                id: "PRICE",
                css: "col_text_right",
                header: ["", { text: "Цена", css: "col_text_right", adjust: true }],
                template: "<span style='color:{common.price_color1()}'>{common.price_value()}</span>",
                width: 75,
                sort: "int"
            },
            {
                id: "TITLE",
                header: ["", "Товар"],
                template: "<span class='tovar_title'>{common.title_render()}</span>{common.life_render()}",
                css: "title_prc",
                fillspace: true,
                //width: (window.innerWidth - 490) / 2,
                //width: window.innerWidth > 1170? 460: 300,
                //adjust: true,
                sort: "string"

            },
            {
                id: "VENDOR", header: ["", "Производитель"], template: "<span class='vendor_title'>{common.vendor_render()}</span>",
                //width: (window.innerWidth - 490) / 2, 
                width: 160,
                sort: "string"

            },
            {
                id: "REST", header: ["", { text: "Остаток", css: "col_text_right" }], css: "col_text_right",
                template: "{common.rest_render()}",
                width: 70, sort: "int"
            },
            {
                id: "SP_COUNT", css: "col_text_right", header: ["", { text: "Кол-во", css: "col_text_right" }],
                template: "{common.sp_count_render()}",
                width: 100,
                editor: "text", sort: "int"
            },
            {
                id: "SP_SUMMA", css: "col_text_right", header: ["", { text: "Сумма", css: "col_text_right" }],
                template: "{common.sp_summa_render()}",
                width: 120,
                sort: "int"
            },
            {
                id: "RATE", header: ["", "Упак"],
                width: 70,
                template: "{common.rate_render()}",
            },

            {
                id: "REESTR", header: ["", "ЖВНЛС"], template: "{common.reestr_render()}",
                width: 70
            }
        ],

        data: store,
        on: {
            onCheck: function (row, column, state) {
                //console.log(row, column, state)
                var me = this;
                if (column === 'izb') {
                    if (me.ch_main_time !== undefined) {
                        clearTimeout(me.ch_main_time)
                    }

                    me.ch_main_time = setTimeout(function () {

                        var count_ch = $$('orders_body_db').find(function (obj) {
                            return obj.izb === 1;
                        }).length;

                        try {
                            if (count_ch === 0 && $$('orders_tbl').getHeaderContent("mc1").isChecked()) {
                                $$('orders_tbl').getHeaderContent("mc1").uncheck()
                            }
                        } catch (er) { }


                        if (count_ch > 0) {
                            $$('tlbr_ord_gr').enable()
                        } else {
                            $$('tlbr_ord_gr').disable()
                        }

                    }, 250)
                } else {
                    if (column === 'FG_INDIVID') {
                        var item = this.getItem(row)
                        //console.log(item)
                        item.FG_INDIVID = $$('segment_vw').getValue() * 1
                        cross_records_db.ids.push([item.ACODE, item.SCODE, item.id])
                        cross_records_db.load()
                        if (cross_records_db.count() > 0) {
                            webix.ui(cross_records_win).show()
                        }
                    }
                }




                //$$('orders_tbl').getHeaderContent("mc1").isChecked()

            },
            onKeyPress: function (code, e) {
                var me = this;
                if (this.getEditState() === false) {
                    if ((app.isCharCode(code) || code === 32) && code !== 8) {
                        if (code !== 8 && code !== 32) {
                            $$('main_search').setValue('');
                        } else {
                            if (code === 32) {
                                $$('main_search').setValue($$('main_search').getValue() + ' ');
                            }
                        }
                        $$('main_search').focus();
                        setTimeout(function () {
                            $$('main_search').callEvent('onChange', [$$('main_search').getValue()]);
                        }, 100);
                    } else if (code === 8) {
                        $$('main_search').focus();
                        setTimeout(function () {
                            $$('main_search').callEvent('onChange', [$$('main_search').getValue()]);
                        }, 100);
                    }


                    if (code === 13 || app.isNumberCode(code)) {
                        setTimeout(function () {
                            me.edit({
                                row: me.getSelectedId(),
                                column: "SP_COUNT"
                            });
                            if (app.isNumberCode(code)) {
                                $$('orders_tbl').getEditor().node.querySelector('input').value = String.fromCharCode(code);
                            }
                        }, 10);
                    }

                    if (code === 46 && e.ctrlKey) {
                        var item = me.getSelectedItem();
                        item.SP_COUNT = 0;
                        item.SP_SUMMA = 0;
                        $$('orders_body_db').config.del_rec(item);
                        $$('orders_tbl').refresh();
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

                var tbl = $$('orders_tbl'),
                    item = tbl.getSelectedItem();

                if (state.value * 1 === 0 * 1) {
                    item.SP_COUNT = 0;
                    item.SP_SUMMA = 0;
                    $$('orders_body_db').config.del_rec(item);
                    $$('orders_tbl').refresh();
                    return false;
                }

                if (state.value != state.old) {
                    setTimeout(function () {
                        tbl.config.edit_price(tbl, item, state);
                    }, 10);
                } else {
                    if (item.PRICE > item.SP_PRICE) {
                        item.SP_PRICE = item.PRICE;
                        $$('orders_body_db').config.app_rec(item);
                        $$('orders_tbl').refresh();
                        item = $$('orders_tbl').find(function (el) {
                            return el.ACODE == item.ACODE && el.SCODE == item.SCODE;
                        });
                        $$('orders_tbl').select(item[0].id);
                    }
                }


            },
            onAfterSelect: function (id) {
                store.setCursor(id);
            },
            onBeforeRender: function () {
                if ($$('old_zakaz_pnl') !== undefined) {
                    $$('old_zakaz_pnl').hide();
                }

            },
            onAfterRender: function () {
                if (document.querySelector('[view_id=orders_toolbar]') === null) {
                    webix.ui(orders_toolbar)
                }

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
                                            //var item = $$('orders_tbl').getSelectedItem();
                                            $$('rate_alert').close();
                                            item.SP_COUNT = tmp_count;
                                            item.SP_SUMMA = item.SP_COUNT * item.PRICE;
                                            $$('orders_body_db').config.app_rec(item);
                                            tbl.refresh();
                                            /*
                                            item = tbl.find(function(el){
                                                return el.ACODE == item.ACODE && el.SCODE == item.SCODE;
                                            });
                                            tbl.select(item[0].id);
                                            */
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
                                            tbl.getSelectedItem().SP_COUNT = state.old;
                                            tbl.refresh();
                                            webix.UIManager.setFocus(tbl);
                                            /*
                                            item = $$('orders_tbl').find(function(el){
                                                return el.ACODE == item.ACODE && el.SCODE == item.SCODE;
                                            });
                                            $$('orders_tbl').select(item[0].id);
                                            */
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
                //tbl.refresh();
                webix.UIManager.setFocus(tbl);


                /*
                item = $$('orders_tbl').find(function(el){
                    return el.ACODE == item.ACODE && el.SCODE == item.SCODE;
                });
                $$('orders_tbl').select(item[0].id);
                */
            }
        },

    };
    //$$('price_db').add({ "ACODE": "", "DT": "", "ID_SPR": "", "LIFE": "", "MAXPACK": "", "MINZAK": "", "NDS": "", "PRICE": "", "RATE": "", "REESTR": "", "REST": "", "SCODE": "", "SP_COUNT": "", "SP_DATE": "", "SP_PRICE": "", "SP_SUMMA": "", "STITLE": "", "TITLE": "", "VENDOR": "", "VV1SP_TITLE": "", "VV2VENDOR": "", "VV3MNN": "" })   
    return ui;
});
