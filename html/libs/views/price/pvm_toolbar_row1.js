define([
    "app", 'views/windows/report_price_win'
],function(app, report_price_win){
    
    var ui = {
            id: "pvm_toolbar_row1",
            css: "pvm_toolbar_col",
            cols: [
                {
                    view:   "button", 
                    id:     "order_summ", 
                    badge: '&#9660;', 
                    //autowidth: true,
                    maxWidth: 200,
                    popup:  "order_summ_pp",
                    on: {
                        onItemClick: function(){
                            setTimeout(function(){
                                $$('order_summ_pp').show();
                            },100);
                            
                        }
                    }
                },
                {
                    id: 'order_util_pnl',
                    cols: [
                        { 
                            view:"icon",
                            css: "hmatrix_btn htools_btn", 
                            align:"right",
                            tooltip: "Заказ по дефектуре",
                            click: function(){                                                               
                                $$('pvm_toolbar_row1').hide();
                                $$('pvm_toolbar_row2').hide();
                                $$('vnd_panel_flx').hide();                                
                                $$('pvm_toolbar_row3').show()
                                if ($$('reorder_pnl') !== undefined) {
                                    $$('reorder_pnl').close();
                                }
                                $$("pvm_body").reconstruct()                               
                                $$('defecture_db').load()
                                $$('defecture_tbl').show()
                                setTimeout(function() {
                                    webix.UIManager.setFocus('matrix_search');
                                }, 250);
                            }
                        },
                        {width: 20},
                        { 
                            view:"icon",
                            css: "hnew_btn htools_btn", 
                            align:"right",
                            tooltip: "Новый заказ",
                            click: function(){
                                $$('adres_win').show();
                                $$('adres_win_footer').show();
                            }
                        },
                        {width: 10},
                        { 
                            view:"icon",
                            css: "report_btn htools_btn", 
                            align:"right",
                            tooltip: "Печать",
                            click: function() {
                                
                                if ($$('report_price_win') === undefined) {
                                    webix.ui(report_price_win);
                                }
                                $$('report_price_win').cur_id = undefined;
                                $$('report_price_win').show();
                                
                            }
                        },
                        {width: 10},
                        { 
                            view:"icon",
                            css: "hedit_btn htools_btn", 
                            align:"right",
                            tooltip: "Изменить",
                            popup: 'edit_pp',
                             on: {
                                onItemClick: function(){
                                    setTimeout(function(){
                                        $$('edit_pp').show();
                                    },100);
                                }
                            }
                        },
                        {width: 10},
                        { 
                            view:"icon",
                            id: "harch_btn",
                            css: "harch_btn htools_btn", 
                            ln_ev: undefined,
                            //hidden: true,
                            align:"right",
                            tooltip: "Заказ в архив, УДЕРЖИВАЙТЕ чтобы отправить" 
                        },
                        {width: 10},
                        { 
                            view:"icon",
                            id: 'htrash_btn',
                            css: "htrash_btn htools_btn", 
                            ln_ev: undefined,
                            align:"right",
                            tooltip: "Удалить заказ, УДЕРЖИВАЙТЕ чтобы удалить",
                        }, { 
                            view:"icon",
                            css: "report_btn htools_btn", 
                            align:"right",
                            hidden: true,
                            tooltip: "Отчеты"
                            
                        },{ 
                            view:"icon",
                            css: "lacks_btn htools_btn", 
                            align:"right",
                            hidden: true,
                            tooltip: "Отказы"
                        },
                        { 
                            view:"icon",
                            css: "hautos_btn htools_btn", 
                            align:"right",
                            hidden: true,
                            tooltip: "Автоподбор по матрице"
                        },
                    ]
                }
                
            ]
        };
    
    return ui
    
});