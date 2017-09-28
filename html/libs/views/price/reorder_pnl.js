define([
    "app", "models/orders_error_db"
], function(app, orders_error_db){
    
    
    var ui = {
        view:"window",
        
        head:{
            view:"toolbar", cols:[
                {
                    view:"checkbox", 
                    id:"hide_seller_ch", 
                    label:"Исключить пост.", 
                    labelWidth: 130,
                    labelAlign: 'right',
                    value: 0,
                    on: {
                        onChange: function(newv, oldv){
                            $$('price_db').filter(function(el){    
                                if (newv) {
                                    return el.SCODE+"" !== $$('orders_error_db').getItem($$('orders_error_db').getCursor()).scode+"";
                                } else {return true;}
                            });
                        }
                    }
                },{ },
                {
                    view: "button",
                    value: "Закрыть",
                    width: 100,
                    click: function(){
                        orders_error_db.clearAll();
                        $$('reorder_pnl').close();
                        $$('order_summ_pp_tbl').find(function(obj){obj.select=0});
                        $$('order_summ_pp_tbl').refresh();
                    }
                }
            ]
        },
        padding: 0,
        id: "reorder_pnl",
        height: 130,
        move: true,
        left: (window.innerWidth / 2)-250,
        body:{
            width:654,
            cols: [{                
                rows: [
                   {
                        cols: [{
                            rows: [
                                    { 
                                        view:"label", 
                                        label: "Label", 
                                        id: "f_reorder_rec_l",
                                        css: 'reorder_title f_smaller'
                                    },
                                    { 
                                        view:"label", 
                                        label: "Label", 
                                        id: "c_reorder_rec_l",
                                        css: 'reorder_title'
                                    },
                                    { 
                                        view:"label", 
                                        label: "Label", 
                                        id: "n_reorder_rec_l",
                                        css: 'reorder_title f_smaller'
                                    }
                                ]
                            },{
                                width: 40,
                                padding: '0 0 0 5',
                                rows: [
                                    { view:"icon",  css: "up_btn htools_btn",
                                        click: function() {
                                            var item = $$('orders_error_db').getCursor();
                                            if ($$('orders_error_db').getFirstId() !== item) {
                                                $$('orders_error_db').setCursor($$('orders_error_db').getPrevId(item));
                                            } else {
                                                webix.UIManager.setFocus("main_search");
                                            }
                                        },
                                        hotkey: 'Ctrl+Up'
                                    },
                                    { view:"icon",  css: "down_btn htools_btn",
                                        click: function() {
                                            var item = $$('orders_error_db').getCursor();
                                            if ($$('orders_error_db').getLastId() !== item) {
                                                $$('orders_error_db').setCursor($$('orders_error_db').getNextId(item));
                                            } else {
                                                webix.UIManager.setFocus("main_search");
                                            }
                                            
                                        },
                                        hotkey: 'Ctrl+Down'
                                    },
                                    
                                ]
                                
                            }
                        ]
                    }
                    
                ]
                
            }]
        },
        on: {
            onShow: function(){
                setTimeout(function() {
                    var oedi = $$('orders_error_db').getItem($$('orders_error_db').getCursor());                
                    console.log(oedi.matrix_id)
                    if (oedi !== undefined && oedi.matrix_id!==undefined){
                        $$('hide_seller_ch').hide()
                    }    
                }, 250);
                
            }
        }
    }
    return ui;
});