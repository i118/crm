define([
    "app", "models/orders_head_db", "views/price_main_view"
], function(app, orders_head_db, price_main_view, vnds_list_prc_db){
    
    
    var ui = {
            view:"window",
            id:"orders_head_win",
            head:"Выберите заказ",                                                        
            height: 600,
            position:"center",                                                        
            modal: true,
            body:{
                //width: 450,
                rows: [{
                    padding: 10,
                    rows:[
                         {
                            view:"datatable",
                            scrollX: false,
                            id: 'orders_head_win_tb',
                            height: 300,
                            hover: 'hover_table',
                            navigation: true,
                            select: 'row',
                            columns:[
                                { id: "Дата", header: "Дата", format:webix.Date.dateToStr("%d.%m.%Y"), sort: "mysort"},
                                { id: "Номер", header: "Номер", width: 110, sort: "int"},
                                { id: "Склад", header: "Склад", width: 300, sort: "string"},
                                { id: "Сумма", header: "Сумма", format: webix.Number.numToStr({
                                    groupDelimiter:",",
                                    groupSize:3,
                                    decimalDelimiter:".",
                                    decimalSize:2}),  sort: "int" 
                                },
                            ],
                            autowidth:true,
                            datatype:"jsarray",
                            run_show: function(){
                                $$('orders_head_win').hide();
                                $$('main_layout').addView(price_main_view);
                                
                                $$("orders_head_db").bind_event();
                                $$("orders_head_db").callEvent('onAfterCursorChange', [$$("orders_head_db").getCursor()]);                                
                                $$('main_search').callEvent('onChange',['','']);
                                setTimeout(function() {
                                    webix.UIManager.setFocus('main_search');
                                }, 250);
                                
                            },
                            on: {
                                onItemClick: function(id){
                                    this.config.run_show();
                                },
                                onKeyPress: function(code, e){
                                    if (code === 13) {
                                        this.config.run_show();
                                    }
                                },
                                onAfterSelect: function(id){
                                    $$("orders_head_db").setCursor(id); 
                                }
                            }
                        }
                    ]
                },{
                    padding: 5,
                    cols:[
                        
                        {view: 'spacer'},
                        {
                            view:"button", 
                            value:"Новый заказ",
                            css:"button_info",
                            width: 150,
                            click: function(){
                                $$('adres_win').show();
                            }                            
                        }
                    ]
                }]
            },
            on:{
                "onShow": function() {
                    var ohwt = $$('orders_head_win_tb');
                    ohwt.data.sync($$('orders_head_db'));
                    ohwt.select(ohwt.getFirstId());
                    webix.UIManager.setFocus("orders_head_win_tb");
                }
            }
        };
        
    return ui;
});
