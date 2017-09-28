//order_errors
define([
    "app", "models/orders_error_db", "views/price/reorder_pnl"
], function(app, orders_error_db, reorder_pnl){
    
    
    var ui = {
            view:"window",
            id:"order_errors_win",
            head: "<span style='color: orange'>Внимание ошибки</span>", 
            animate:{type:"flip", subtype:"vertical"},
            height: 534,
            //autoheight: true,
            position:"center",                                                        
            modal: true,
            type: 'warning',
            body:{
                width: 850,
                rows: [{
                    padding: 10,
                    rows:[
                         {
                            view:"datatable",
                            scrollX: false,
                            id: 'order_errors_tbl',
                            height: 300,
                            hover: 'hover_table',
                            navigation: true,
                            //select: 'row',
                           // width: '100%',
                            tooltip:true,
                            columns:[
                                { id: "title", header: "Название", fillspace: 3},
                                { id: "new", header: "Новое", fillspace: 0.5},
                                { id: "old", header: "Старое", fillspace: 0.5},
                                { id: "err", header: "Ошибка", fillspace: 1.5},
                            ],
                            //autowidth:true,
                            data: orders_error_db
                        }
                    ]
                },{
                    padding: 5,
                    cols:[
                        
                        {view: 'spacer'},
                        {
                            view:"button", 
                            value:"Отменить",
                            css:"button_info",
                            //width: 150,
                            autowidth: true,
                            click: function(){
                                orders_error_db.clearAll();
                                $$('order_errors_win').hide();
                            }                            
                        },
                        {
                            view:"button", 
                            value:"Перезаказать",
                            css:"button_success",
                            //width: 150,
                            autowidth: true,
                            click: function(){
                                if ($$('reorder_pnl') !== undefined) {
                                    $$('reorder_pnl').close()
                                }
                                
                                webix.ui(reorder_pnl).show();
                                //$$('order_errors_tbl1').parse($$('order_errors_win').d_arr)
                                
                                $$('order_errors_win').hide();
                                
                                orders_error_db.setCursor(orders_error_db.getFirstId());
                                
                                //
                                
                                
                            }                            
                        },
                        {
                            view:"button", 
                            value:"Отправить как есть",
                            css:"button_warning",
                            //width: 150,
                            autowidth: true,
                            click: function(){
                                orders_error_db.clearAll();
                                $$('order_errors_win').hide();
                                $$('orders_head_db').in_archive_();
                            }                            
                        }
                    ]
                }]
            },
            on:{
                "onShow": function() {
                    //var ohwt = $$('orders_head_win_tb');
                    //ohwt.data.sync($$('orders_head_db'));
                    //ohwt.select(ohwt.getFirstId());
                    //webix.UIManager.setFocus("orders_head_win_tb");
                }
            }
        };
        
    return ui;
});
