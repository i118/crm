// archive_orders_head
define([
    "app", "models/orders_head_arch"
], function (app, store) {
    var utils = {
        view: function (id) {
            //console.log('view', id);

            $$("arch_head_pnl").hide();
            $$("arch_order_pnl").show();

            $$('archive_orders_head').hide();
            //$$('archive_order_body_tbl').config.edi
            store.setCursor(id);
            $$('archive_order_body_tbl').show();
            $$('main_search_ord').focus();

            //$$('orders_body_archive_db').callEvent()
            
            //$$("orders_head_arch").callEvent('onAfterCursorChange', [id]);

        },
        return_ord: function (id, svod, multi) {
            multi = multi || false;
            //console.log('return', id);
            var req = {
                method: 'archive.archive_return_order',
                params: [id, app.user_info.id, svod]
            };

            app.request(req, function (text) {
                var respons = JSON.parse(text);
                if (app.check_response(respons)) {
                    var rows = respons.result[0];
                    if (!multi) {
                        store.load();
                    }
                }
            });
        },
        copy: function (id) {
            //console.log('copy', id);
            var req = {
                method: 'archive.archive_copy_order',
                params: [id, app.user_info.id]
            };

            app.request(req, function (text) {
                var respons = JSON.parse(text);
                if (app.check_response(respons)) {
                    var rows = respons.result[0];
                    store.load();

                }
            });
        },
        send: function (id, multi) {
            multi = multi || false;
            ///console.log('send', id);
            var req = {
                method: 'archive.genOrdersFile',
                params: [id, app.user_info.id]
            };

            app.request(req, function (text) {
                var respons = JSON.parse(text);
                if (app.check_response(respons)) {
                    var rows = respons.result[0];
                    if (!multi) {
                        store.load();
                    }
                }
            });
        }
    };

    var ui = {
        view: "activeTable",
        scrollX: false,
        id: 'archive_orders_head',
        hover: 'hover_table',
        //navigation: true,
        //select: 'row',
        editable: true,
        rowHeight: 45,
        tooltip: true,
        utils: utils,
        type: {
            get_row_color: function (obj) {
                if (obj.state * 1 === 26) {
                    return "send_rec_color";
                }
            },
            get_enable: function (obj) {
                if (obj.state * 1 === 26) {
                    return "visibility: hidden;";
                }
            },
            summa_render: function (obj) {
                return app.moneyView(obj.summ);
            },
            dt_render: function (obj) {
                var format = webix.Date.dateToStr("%d.%m.%Y");
                return format(obj.dt);
            },
            get_view_btn: function (obj) {
                return "<span id='hview_btn_" + obj.id + "' class='view_btn ahb' title='Просмотр'></span>"
            },
            get_copy_btn: function (obj) {
                return "<span id='copy_btn_" + obj.id + "' class='copy_btn ahb' title='Копировать'></span>"
            },
            get_return_ord: function (obj) {
                if (obj.state * 1 === 26) {
                    return "<span id='return_btn_" + obj.id + "' class='return_btn ahb' style='visibility: hidden;' title='Вернуть на доработку'></span>"
                }
                setTimeout(function () {
                    // обработчик кнопки удаления заказа 
                    var del_btn = webix.toNode("return_btn_" + obj.id);

                    if (del_btn === null) {
                        return
                    }

                    del_btn.timeOut = undefined;
                    if (del_btn.ln_ev !== undefined) {
                        webix.eventRemove(del_btn.ln_ev);
                    }

                    del_btn.ln_ev = webix.event(del_btn, webix.env.mouse.down, function () {
                        del_btn.classList.add('load_cur');
                        del_btn.timeOut = setTimeout(function () {
                            del_btn.classList.remove('load_cur');
                            $$('archive_orders_head').config.utils.return_ord(obj.id, obj.svod);
                        }, 1500);

                    });

                    webix.event(del_btn, webix.env.mouse.up, function () {
                        del_btn.classList.remove('load_cur');
                        clearTimeout(del_btn.timeOut)
                    });
                }, 100)
                //<span style='{common.get_enable()}'>{common.return_ord()}</span>\               
                return "<span id='return_btn_" + obj.id + "' class='return_btn ahb' title='Вернуть на доработку'></span>"
            },
            get_send_btn: function (obj) {
                if (obj.state * 1 === 26) {
                    return "<span id='send_btn_" + obj.id + "' class='send_btn ahb' style='visibility: hidden;' title='Отправить'></span>"
                }
                setTimeout(function () {
                    // обработчик кнопки удаления заказа 
                    var del_btn = webix.toNode("send_btn_" + obj.id);

                    if (del_btn === null) {
                        return
                    }

                    del_btn.timeOut = undefined;
                    if (del_btn.ln_ev !== undefined) {
                        webix.eventRemove(del_btn.ln_ev);
                    }

                    del_btn.ln_ev = webix.event(del_btn, webix.env.mouse.down, function () {
                        del_btn.classList.add('load_cur');
                        del_btn.timeOut = setTimeout(function () {
                            del_btn.classList.remove('load_cur');
                            $$('archive_orders_head').config.utils.send(obj.id);
                        }, 1500);

                    });
                    webix.event(del_btn, webix.env.mouse.up, function () {
                        del_btn.classList.remove('load_cur');
                        clearTimeout(del_btn.timeOut)
                    });
                }, 100)
                
                return "<span id='send_btn_" + obj.id + "' class='send_btn ahb' title='Отправить'></span>"
            }
        },
        columns: [
            {
                id: "izb", header: '', template: "<span style='{common.get_enable()}'>{common.checkbox()}</span>",
                width: 45
            },
            {
                header: "",
                tooltip: false,
                id: "view", template: "\
                {common.get_view_btn()}\
                {common.get_return_ord()}\
                {common.get_copy_btn()}\
                {common.get_send_btn()}",
                width: 160
            },
            {
                id: "summ",
                //header: "Сумма", 
                width: 80,
                header: { text: "Сумма", css: "col_text_right" },
                css: "col_text_right",
                template: "<span class='{common.get_row_color()}'>{common.summa_render()}</span>",
                sort: "int"
            },
            {
                id: "n_order", header: "Номер",
                template: "<span class='{common.get_row_color()}'>#n_order#<p><span class='user_title'>#stitle#</span></p></span>", width: 120, sort: "int"
            },
            {
                id: "ord_count", sort: "int",
                header: { text: "Позиций", css: "col_text_right" },
                css: "col_text_right",
                template: "<span class='{common.get_row_color()}'>#ord_count#</span>",
                width: 70
            },
            {
                id: "sklad", header: "Склад", fillspace: true, sort: "string",
                template: "<div><span class='vendor_title {common.get_row_color()}'>#sklad#</span>" +
                "<p><span class='user_title {common.get_row_color()}'>#user#</span></p></div>"
            },
            /*{ id: "user", header: "Автор", sort: "string",  width: 100,
                template:"<span class='vendor_title {common.get_row_color()}'>#user#</span>"
            },*/
            {
                id: "comment", header: "Коментарий", width: 180, sort: "string",
                template: "<span class='vendor_title {common.get_row_color()}'>#comment#</span>",
                editor: "text"
            },
            {
                id: "dt", header: "Дата", sort: "mysort",
                template: "<span class='{common.get_row_color()}'>{common.dt_render()}</span>"


            },



        ],
        
        data: store,
        on: {
            onItemClick: function (id) {
                var item = this.getItem(id);
                if (item.state === 26) {
                    return;
                }
                //console.log(id);
                store.setCursor(id);
                item.izb = !item.izb;
                this.refresh();
                this.config.refresh_oper_vis();
            },
            onCheck: function (id, column, state) {
                var item = this.getItem(id);
                if (item.state === 26) {
                    return false;
                }
                store.setCursor(id);
                this.config.refresh_oper_vis();
            },
            onShow: function () {
                var table = $$('archive_orders_head');
                table.select(table.getFirstId());
                webix.UIManager.setFocus(table_n);
            },
            onKeyPress: function (code, e) {
                var me = this,
                    id = me.getSelectedId().id;

                if (this.getEditState()) {
                    if (code === 40 || code === 13) {
                        // console.log(id)
                        me.editStop();
                        //me.select(me.getNextId(id));
                    }
                } else {
                    if (code === 13) {
                        setTimeout(function () {
                            me.edit({
                                row: id,
                                column: "comment"
                            });

                        }, 0);
                    }
                }
            },
            onAfterEditStop: function (state, editor, ignoreUpdate) {
                var tbl = $$('archive_orders_head'),
                    item = tbl.getSelectedItem();

                store.setCursor(editor.row);
                store.set_coment();
            },
            onAfterSelect: function (id) {
                store.setCursor(id);
            }
        },
        onClick: {
            "view_btn": function (evt, el, trg) {
                evt.stopPropagation();
                var item = this.getItem(el.row);
                this.config.utils.view(item.id);
                return false;
            },
            "return_btn": function (evt, el, trg) {
                evt.stopPropagation();
                //var item = this.getItem(el.row);
                //this.config.utils.return_ord(item.id, item.svod);
                return false;
            },
            "copy_btn": function (evt, el, trg) {
                evt.stopPropagation();
                var item = this.getItem(el.row);
                this.config.utils.copy(item.id);
                return false;

            },
            "send_btn": function (evt, el, trg) {
                evt.stopPropagation();
                //var item = this.getItem(el.row);
                //this.config.utils.send(item.id);
                return false;

            }
        },
        refresh_oper_vis: function () {
            //console.log('refresh_oper_vis');

            var tmp = 0,
                vnds = {},
                adress = {},
                me = $$('archive_orders_head');

            me.eachRow(
                function (row) {
                    var item = me.getItem(row);

                    if (item.izb) {
                        tmp += 1;
                        vnds[item.stitle] = 1;
                        adress[item.sklad] = 1;
                    }
                    //console.log(tmp)
                }
            );

            try {
                //console.log(tmp)
                if (tmp > 1) {
                    $$('return_btn').show();
                    $$('send_btn').show();
                    if (Object.keys(vnds).length === 1 && Object.keys(adress).length === 1) {
                        $$('union_btn').show();
                    } else {
                        $$('union_btn').hide();
                    }
                } else {
                    $$('return_btn').hide();
                    $$('union_btn').hide();
                    $$('send_btn').hide();
                }
            } catch (er) { }
        }
    };

    return ui;
});
