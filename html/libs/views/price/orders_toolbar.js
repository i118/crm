define([
    "app", 'views/windows/report_price_win', 'views/windows/cross_records_win', 'models/cross_records_db'
], function (app, report_price_win, cross_records_win, cross_records_db) {

    var ui = {
        id: "orders_toolbar",
        //css: "pvm_toolbar_col",
        container: 'tlbr_orders',
        cols: [
            {
                id: 'tlbr_ord_gr',
                disabled: true,
                cols: [
                    {
                        id: 'in_ind_btn',
                        view: "button",
                        type: "image",
                        image: "./img/individ-24g.png",
                        label: "&nbsp;в индивидуальные",
                        width: 185,
                        click: function () {
                           

                        },
                        on: {
                            onAfterRender: function(){                                
                                var inarch_btn = this.getNode().querySelector('button');
                                app.bind_tooltip(
                                    inarch_btn,
                                    "<span class='text_warning'><strong>Удерживайте</strong></span><br> чтобы отправить в индивидуальные"
                                )
                                
                                // обработчик кнопки в архив
                                inarch_btn.timeOut = undefined;
                                
                                if (inarch_btn.ln_ev !== undefined) {
                                    webix.eventRemove(inarch_btn.ln_ev);
                                }
                        
                                inarch_btn.ln_ev = webix.event(inarch_btn, webix.env.mouse.down, function () {
                                    inarch_btn.classList.add('load_cur');
                                    inarch_btn.timeOut = setTimeout(function () {
                                        inarch_btn.classList.remove('load_cur');
                                        var ch_item = $$('orders_body_db').find(function (obj) {
                                            return obj.izb === 1;
                                        })
            
                                        ch_item.forEach(function (item) {
                                            //console.log(item)
                                            item.FG_INDIVID = $$('segment_vw').getValue() * 1
                                            cross_records_db.ids.push([item.ACODE, item.SCODE, item.id])
            
                                        })
            
                                        cross_records_db.load()
                                        if (cross_records_db.count() > 0) {
                                            webix.ui(cross_records_win).show()
                                        }
                                    }, 1500);
                                });
                        
                                webix.event(inarch_btn, webix.env.mouse.up, function () {
                                    clearTimeout(inarch_btn.timeOut);
                                    inarch_btn.classList.remove('load_cur');
                                });

                            }
                        }

                    },
                    {
                        id: 'in_ob_btn',
                        view: "button",
                        type: "image",
                        image: "./img/common-24.png",
                        label: "&nbsp;в общие",
                        hidden: true,
                        width: 115,
                        click: function () {
                            ///$$('in_ind_btn').config.click();
                        },
                        on: {
                            onAfterRender: function(){                                
                                var inarch_btn = this.getNode().querySelector('button');
                                app.bind_tooltip(
                                    inarch_btn,
                                    "<span class='text_warning'><strong>Удерживайте</strong></span><br> чтобы отправить в общие"
                                )

                                // обработчик кнопки в архив
                                inarch_btn.timeOut = undefined;
                                
                                if (inarch_btn.ln_ev !== undefined) {
                                    webix.eventRemove(inarch_btn.ln_ev);
                                }
                        
                                inarch_btn.ln_ev = webix.event(inarch_btn, webix.env.mouse.down, function () {
                                    inarch_btn.classList.add('load_cur');
                                    inarch_btn.timeOut = setTimeout(function () {
                                        inarch_btn.classList.remove('load_cur');
                                        var ch_item = $$('orders_body_db').find(function (obj) {
                                            return obj.izb === 1;
                                        })
            
                                        ch_item.forEach(function (item) {
                                            //console.log(item)
                                            item.FG_INDIVID = $$('segment_vw').getValue() * 1
                                            cross_records_db.ids.push([item.ACODE, item.SCODE, item.id])
            
                                        })
            
                                        cross_records_db.load()
                                        if (cross_records_db.count() > 0) {
                                            webix.ui(cross_records_win).show()
                                        }
                                    }, 1500);
                                });
                        
                        
                                webix.event(inarch_btn, webix.env.mouse.up, function () {
                                    clearTimeout(inarch_btn.timeOut);
                                    inarch_btn.classList.remove('load_cur');
                                });
                            }
                        }
                    },
                    {
                        id: 'harch_btn',
                        view: "button",
                        type: "image",
                        image: "./img/arch-24.png",
                        label: "&nbsp;В архив",
                        width: 110,
                        on: {
                            onAfterRender: function(){                                
                                var el_btn = this.getNode().querySelector('button');
                                app.bind_tooltip(
                                    el_btn,
                                    "<span class='text_warning'><strong>Удерживайте</strong></span><br> чтобы отправить корзину"
                                )
                            }
                        }
                    },
                    {
                        id: 'htrash_btn',
                        view: "button",
                        type: "image",
                        image: "./img/trash-24.png",
                        label: "&nbsp;удалить",
                        title: '<b>sss</b>',
                        
                        width: 115,
                        on: {
                            onAfterRender: function(){                                
                                $$('orders_body_db').bind_event();
                                
                                var el_btn = this.getNode().querySelector('button');
                                app.bind_tooltip(
                                    el_btn,
                                    "<span class='text_warning'><strong>Удерживайте</strong></span><br> чтобы удалить"
                                )
                            }
                        }
                    },
                    {

                        view: "button",
                        type: "image",
                        image: "./img/print-24.png",
                        label: "&nbsp;печать",
                        width: 115,
                        click: function () {
                            if ($$('report_price_win') === undefined) {
                                webix.ui(report_price_win);
                            }
                            $$('report_price_win').cur_id = undefined;
                            $$('report_price_win').show();
                            //$$('orders_body_db').get_report()
                        },
                        on: {
                            onAfterRender: function () {
                                var el_btn = this.getNode().querySelector('button');
                                app.bind_tooltip(
                                    el_btn,
                                    "<span class='text_success'>Печатать выбранные</span>"
                                )
                            }
                        },
                    }
                ]
            },
            {},
            {
                view: "search",
                placeholder: "поиск по заказу..",
                width: 300,
                keyPressTimeout: 700,
                on: {
                    onChange: function (nv) {
                        nv = nv.split(' ')
                        $$('orders_body_db').filter(function (el) {
                            result = true
                            nv.forEach(function (el1) {
                                if (el.TITLE.toUpperCase().indexOf(el1.toUpperCase()) === -1) {
                                    result = false
                                }
                            });
                            return result
                        })
                    },
                    onTimedKeyPress: function () {
                        var me = this;
                        this.callEvent('onChange', [me.getValue()]);
                    },
                }
            },
            {
                id: 'ob_tbr',
                cols: [
                    {
                        view: "button",
                        id: 'defecture_btn',
                        type: "image",
                        image: "./img/matrix-24.png",
                        label: "&nbsp;дефектура",
                        width: 130,
                        click: function(){                                                               
                            //$$('pvm_toolbar_row1').hide();
                            $$('orders_tbl').getHeaderContent("mc1").uncheck()
                            $$('pvm_toolbar_row2').hide();
                            
                            $$('vnd_panel_flx').hide();                                
                            $$('pvm_toolbar_row3').show()
                            if ($$('reorder_pnl') !== undefined) {
                                $$('reorder_pnl').close();
                            }

                            app.resize_app()
                            //$$("pvm_body").reconstruct()                               
                            $$('defecture_db').load()
                            $$('defecture_tbl').show()
                            setTimeout(function() {
                                $$('matrix_search').setValue('');
                                webix.UIManager.setFocus('matrix_search');
                            }, 250);
                        },
                        on: {
                            onAfterRender: function(){                                
                                var el_btn = this.getNode().querySelector('button');
                                app.bind_tooltip(
                                    el_btn,
                                    "<span class='text_success'>Заказ по дефектуре</span>"
                                )
                            }
                        }
                    },
                ]
            }

        ]
    };

    return ui

});