define([
    "app", "models/order_stat_db","views/price/reorder_pnl"
], function (app, store, reorder_pnl) {
    var popup = webix.ui({
        view: "popup",
        id: "order_summ_pp",
        width: 380,
        body: {
            width: 380,
            rows: [
                {
                    cols: [

                        //{width: 50},
                        {
                            view: "button",
                            css: "button_info button_raised",
                            id: 'harch_btn_s',
                            //width: 100,
                            value: "Заказ в архив"
                        }/*,
                        {
                            view:"button",
                            css:"button_warning",
                            //width: 100,
                            value:"Архив"
                        }*/
                    ]
                },
                { height: 20 },
                {
                    id: 'order_summ_pp_tbl',
                    view: "datatable",
                    scrollX: false,
                    header: false,
                    height: 200,
                    hover: 'hover_table',
                    navigation: true,
                    type: {
                        reord_cls: function (obj) {
                            return obj.select === 1 ? 'togli' : ''
                        },
                        reord_title: function (obj) {
                            return obj.select === 1 ? 'togli' : ''
                        }
                    },
                    columns: [
                        {
                            id: "izb", template: "{common.checkbox()}",
                            width: 45
                        },
                        {
                            id: "name", template: "<div class='vnd_list_menu'>" +
                                "<span style='width: 90px;'>#name#</span>" +
                                "<span style='width: 50px;'>#count#</span>" +
                                "<span style='width: 70px;'>{common.sp_summa_render_osp()}</span>" +
                                "<span class='reorder_zak_btn {common.reord_cls()}' id='rzb_#code#' title='{common.reord_title()}'></span></div>",//#summ#
                            width: 300
                        },

                    ],
                    data: store,
                    on: {
                        onCheck: function (id, column, state) {
                            var code = this.getItem(id).code,
                                new_conf = app.user_info;

                            new_conf.options.select_vnd["2"] = {};

                            this.data.each(function (el) {
                                //console.log(el)
                                if (el.izb === 1) {
                                    new_conf.options.select_vnd["2"][el.code + ""] = 1;
                                } else {
                                    delete new_conf.options.select_vnd["2"][el.code + ""];
                                }
                            });

                            app.setUserInfoOptions(new_conf);
                            $$('vnd_mode_sg').setValue('mode2');
                            $$('vnd_mode_sg').callEvent('onItemClick', ['vnd_mode_sg']);
                            $$('order_summ_pp').callEvent('onShow');
                        },
                        onItemClick: function (id) {
                            var item = this.getItem(id),
                                m2_id = $$('mode2').find(function (el) {
                                    return el.code + "" === item.code + "";
                                })[0];
                            //console.log(1)
                            if (app.user_info.options.select_mode * 1 !== 3 ||
                                (item.izb === 0 && app.user_info.options.select_mode * 1 === 3)) {
                                $$('vnd_mode_sg').setValue('mode3');
                                $$('vnd_mode_sg').callEvent('onItemClick', ['vnd_mode_sg']);
                                $$('mode2').config.set_one(m2_id.id, $$('mode2'));
                            } else {
                                if (item.izb === 1 && app.user_info.options.select_mode * 1 === 3) {
                                    $$('vnd_mode_sg').setValue('mode1');
                                    $$('vnd_mode_sg').callEvent('onItemClick', ['vnd_mode_sg']);
                                }
                            }
                            $$('order_summ_pp').callEvent('onShow');
                        }
                    },
                    onClick: {
                        "reorder_zak_btn": function (e, id) {
                            var item = this.getItem(id),
                                code = item.code,
                                select = item.select,
                                new_conf = app.user_info,
                                orders_error_db = $$('orders_error_db');
                            //orders_error_db
                            if (select === 1) {                                
                                item.select = 0;
                                orders_error_db.find(function(obj){                                                                        
                                    if (obj.scode == code) {                                        
                                        orders_error_db.remove(obj.id)
                                    }                                     
                                    return 1!=1
                                });
                                if (orders_error_db.count() === 0 ) {
                                    $$('reorder_pnl').close() 
                                } else {
                                    if (orders_error_db.getFirstId()!==orders_error_db.getCursor()) {
                                        orders_error_db.setCursor(orders_error_db.getFirstId());
                                    } else {
                                        orders_error_db.callEvent('onAfterCursorChange', [orders_error_db.getFirstId()])
                                    }
                                }
                            } else {
                                //orders_error_db
                                item.select = 1;
                                
                                $$('orders_body_db').find(function(obj){                                    
                                    if (obj.SCODE == code) {                                        
                                        $$("orders_error_db").add({
                                            title: obj.TITLE,
                                            new: obj.SP_COUNT,
                                            old: obj.SP_COUNT,                                                                                
                                            scode: obj.SCODE,
                                            src_str: obj.SRC_STR,
                                            vendor: obj.VENDOR,
                                            stitle: obj.STITLE,
                                            acode: obj.ACODE,
                                            sp_count: obj.SP_COUNT,
                                            id_spr: obj.ID_SPR,
                                        })
                                    }
                                     
                                    return 1!=1
                                });
                                
                                if ($$('reorder_pnl') === undefined) {
                                    webix.ui(reorder_pnl).show();
                                }
                                
                                if (orders_error_db.getFirstId()!==orders_error_db.getCursor()) {
                                    orders_error_db.setCursor(orders_error_db.getFirstId());
                                } else {
                                    orders_error_db.callEvent('onAfterCursorChange', [orders_error_db.getFirstId()])
                                }
                                
                            }
                            
                            $$('order_summ_pp_tbl').refresh()
                            return false;

                        }
                    },
                },
                { height: 20 },
                {
                    view: "button",
                    id: 'select_all_vnd',
                    hidden: true,
                    css: "button_primary button_raised",
                    value: "Выделить все",
                    click: function () {
                        var new_conf = app.user_info;

                        new_conf.options.select_vnd["2"] = {};

                        $$('order_summ_pp_tbl').data.each(function (el) {
                            new_conf.options.select_vnd["2"][el.code + ""] = 1;
                        });

                        app.setUserInfoOptions(new_conf);
                        $$('vnd_mode_sg').setValue('mode2');
                        $$('vnd_mode_sg').callEvent('onItemClick', ['vnd_mode_sg']);
                        $$('order_summ_pp').callEvent('onShow');
                    }
                }
            ]
        },
        on: {
            onShow: function () {
                if ($$('order_summ_pp_tbl').find(function (el) { return el.izb === 0; }).length > 0) {
                    $$('select_all_vnd').show();
                } else {
                    $$('select_all_vnd').hide();
                }


                var inarch_btn1 = $$('harch_btn_s').getNode().querySelector('button'),
                    collection = $$('orders_head_db');
                inarch_btn1.timeOut = undefined;
                webix.event(inarch_btn1, webix.env.mouse.down, function () {
                    inarch_btn1.classList.add('load_cur1');
                    inarch_btn1.timeOut = setTimeout(function () {
                        if (inarch_btn1.classList.contains('load_cur1')) {
                            inarch_btn1.classList.remove('load_cur1');
                            collection.in_archive();
                        }
                    }, 1500);
                });

                webix.event(inarch_btn1, webix.env.mouse.up, function () {
                    //console.log(inarch_btn1.timeOut)
                    clearTimeout(inarch_btn1.timeOut);
                    inarch_btn1.classList.remove('load_cur1');
                });
            }
        }
    });

    return {
        $ui: popup
    };

});