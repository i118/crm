define([
    "app",
], function (app, store) {
    var ui = {
        id: 'pvm_toolbar_row2',
        css: "pvm_toolbar_col",
        cols: [
            {
                view: "text",
                value: '',
                id: "main_search",
                placeholder: "Поиск",
                old_search: '',
                timeout: null,
                width: window.innerWidth <= 1170 ? 100 : 402,
                keyPressTimeout: 700,
                on: {
                    onChange: function (newv) {
                        //console.log('onChange')
                        var me = this;
                        if (newv !== '') {
                            //console.log(11111111111) 
                            if ($$('orders_tbl').isVisible) {
                                $$('orders_tbl').hide();
                                $$('price_tbl').show();
                            }
                            clearTimeout(me.config.timeout);
                            me.config.timeout = setTimeout(function () {
                                if (me.config.old_search !== newv) {
                                    var tmp_s = me.config.old_search;
                                    me.config.old_search = newv;
                                    $$('old_zakaz_pnl').hide()
                                    if (tmp_s !== '') {
                                        $$('price_db').clear_data();
                                    }
                                    if (newv[0] === '_') {
                                        $$('price_db').config.sort_conf = ['TITLE', "asc"]
                                    }
                                    $$('price_db').load();
                                }
                            }, 350);
                        } else {
                            $$('price_db').clear_data();
                            me.config.old_search = newv;
                            if ($$('price_tbl').isVisible) {
                                $$('price_tbl').hide();
                                $$('orders_tbl').show();
                                window.onresize();
                            }
                        }
                    },
                    onTimedKeyPress: function () {
                        var me = this;
                        this.callEvent('onChange', [me.getValue()]);
                    },
                    onKeyPress: function (code, e) {                        
                        if (code === 220) {
                            return false
                        }
                        
                        if (code === 40) {
                            var table = $$('price_tbl').isVisible() ? $$('price_tbl') : $$('orders_tbl'),
                                dtstore = $$('price_tbl').isVisible() ? $$('price_db') : $$('orders_body_db'),
                                table_n = $$('price_tbl').isVisible() ? 'price_tbl' : 'orders_tbl';
                            if (dtstore.count() > 0) {
                                table.select(table.getFirstId());
                                webix.UIManager.setFocus(table_n);
                            }
                        }
                    }
                }

            },
            {
                view: "button", id: "vnd_list_bnt", align: "left", label: "", width: 200, popup: "vnd_mode", badge: '&#9660;',
                on: {
                    onItemClick: function () {
                        setTimeout(function () {
                            $$('vnd_mode').show();
                        }, 100);

                    }
                }
            },
            {
                view: "segmented",
                id: 'segment_vw',
                align: "left",
                value: '0',
                width: 100,
                options: [
                    { id: app.user_info.id, value: "<span class='segment_btn segment_ind' title='Работать с индивидуальным заказом'>" },
                    { id: 0, value: "<span class='segment_btn segment_ob' title='Работать с общим заказом' >" }
                ],
                on: {
                    onItemClick: function () {
                        try {
                            $$('orders_tbl').getHeaderContent("mc1").uncheck()
                        } catch (er) { }

                        if (this.getValue() === '0') {
                            $$('price_tbl').getNode().classList.remove('orders_tbl_ind')
                            $$('orders_tbl').getNode().classList.remove('orders_tbl_ind')
                            $$('ob_tbr').enable()
                            $$('in_ind_btn').show()
                            $$('in_ob_btn').hide()
                        } else {
                            $$('price_tbl').getNode().classList.add('orders_tbl_ind')
                            $$('orders_tbl').getNode().classList.add('orders_tbl_ind')
                            $$('ob_tbr').disable()
                            $$('in_ind_btn').hide()
                            $$('in_ob_btn').show()
                        }
                        $$('orders_body_db').load()
                        $$('order_stat_db').load()
                        var curr_val_srch = $$('main_search').getValue()

                        if (curr_val_srch.length > 0) {
                            $$('main_search').config.old_search = ''
                            $$('main_search').setValue('')
                            $$('main_search').setValue(curr_val_srch)
                        }
                    },

                }
            },
            {
                view: "button",
                id: "order_summ",
                badge: '&#9660;',
                //autowidth: true,
                maxWidth: 200,
                popup: "order_summ_pp",
                on: {
                    onItemClick: function () {
                        setTimeout(function () {
                            $$('order_summ_pp').show();
                        }, 100);
                    }
                }
            },
        ]
    };

    return ui

});
