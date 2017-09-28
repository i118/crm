define([
    "app", "models/adres_db", "views/price_main_view"
], function(app, adres_db, price_main_view){
    
    var ui = {
            view:"window",
            id:"adres_win",
            head:"Выберите адрес",                                                        
            height: 600,
            position:"center",                                                        
            modal: true,
            body:{
                rows: [{
                    padding: 10,
                    rows:[
                         {
                            view:"datatable",
                            scrollX: false,
                            id: 'adres_win_tb',
                            height: 400,
                            hover: 'hover_table',
                            navigation: true,
                            tooltip: true,
                            select: 'row',
                            columns:[
                                { id: "sklad", header: "Адрес", width: 300, sort: "string"},
                                { id: "summ_ob", header: "Общ", css: 'col_text_center', 
                                    format: webix.Number.numToStr({
                                        groupDelimiter:" ",
                                        groupSize:3,
                                        decimalDelimiter:".",
                                        decimalSize:2}),
                                    sort: "int" 
                                },
                                { id: "summ_ind", header: "Индив", css: 'col_text_center', 
                                    format: webix.Number.numToStr({
                                        groupDelimiter:" ",
                                        groupSize:3,
                                        decimalDelimiter:".",
                                        decimalSize:2}),
                                    sort: "int" 
                                },                                
                            ],
                            autowidth:true,
                            datatype:"jsarray",
                            data: adres_db,
                            add_order: function(id){
                                //console.log(id)
                                var id_order = id.row;
                                // if ($$('orders_head_win').isVisible()) {
                                //     $$('orders_head_win').hide();
                                // }
                                $$('adres_win').hide();
                                if ($$('price_main_view') === undefined) {
                                    $$('main_layout').addView(price_main_view);
                                }
                                //$$("orders_head_db").load();
                                //$$('orders_body_db').bind_event();
                                adres_db.setCursor(id_order);
                                
                                ///$$("orders_head_db").callEvent('onAfterCursorChange', [id_order]);
                                webix.UIManager.setFocus('main_search');
                            },
                            on: {
                                onItemClick: function(id){
                                    this.config.add_order(id);
                                },
                                onKeyPress: function(code, e){
                                    if (code === 13) {
                                        this.config.add_order(this.getSelectedId());
                                    }
                                },
                            }
                        }
                    ]
                },{
                    padding: 5,
                    id: 'adres_win_footer',
                    hidden: true,
                    cols:[
                        
                        {view: 'spacer'},
                        {
                            view:"button", 
                            value:"Отменить",
                            css:"button_info",
                            width: 150,
                            click: function(){
                                $$('adres_win').hide();
                            }                            
                        }
                    ]
                }]
            },
            on:{
                "onShow": function() {
                    var ohwt = $$('adres_win_tb');
                    ohwt.select(ohwt.getFirstId());
                    webix.UIManager.setFocus("adres_win_tb");
                    if ($$('orders_head_win').isVisible()) {
                        $$('adres_win_footer').show();
                    }
                    if ($$('orders_head_db').count() === 0) {
                        $$('adres_win_footer').hide();
                    }
                }
            }
        };
        
    return ui;
});
