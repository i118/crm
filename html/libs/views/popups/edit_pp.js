define([
    "app", "models/adres_db"
],function(app, store){
    
    var popup = webix.ui({
        view: "popup",
        id: "edit_pp",
        height: 300,
        borderless: true,
        body:{
            type: "form",
            width: 500,
            rows:[
                {
                    id: "comb_view",
                    rows: []
                },
                { 
                   view:"text", 
                   label: "Коментарий",
                   labelPosition:"top",
                   id: "edit_pp_com"
                },
                {
                    cols:[
                        {
                            view:"button",
                            css:"button_primary",
                            value:"отменить",
                            click: function() {
                                $$('edit_pp').hide();
                            }
                            
                        },
                        {
                            view:"button",
                            css:"button_success",
                            value:"сохранить",
                            click: function() {
                                var adr = $$('edit_pp_adr').getValue(),
                                    cur_order = $$("orders_head_db").find(function(obj){
                                        return obj.id_Склад === adr;
                                    });
                                
                                if (cur_order.length === 0){
                                    app.setComment(
                                        $$('edit_pp_com').getValue(), 
                                        $$('edit_pp_adr').getValue(),  
                                        $$('orders_head_db').getItem($$('orders_head_db').getCursor()).id
                                    );
                                    $$('edit_pp').hide();
                                    var id = $$('orders_head_db').getItem($$('orders_head_db').getCursor()).id;
                                    $$('orders_head_db').load();
                                    $$('orders_head_db').setCursor(id);
                                } else {
                                    webix.message({type:"error", text: "Для данного адресса уже существует рабочий заказ"});
                                }
                                
                            }
                            
                        }
                    ]
                }
            ]
        },
        on: {
            onShow: function(){
                var options = [],
                    item = $$('orders_head_db').getItem($$('orders_head_db').getCursor());
                store.filter (function(el){
                    options.push({
                        id: el[0],
                        value: el[1]
                    });
                    return true;
                });
                $$('comb_view').reconstruct();
                $$('comb_view').addView(
                    {   
                        id: "edit_pp_adr", 
                        view:"richselect", 
                        label: "Адрес",
                        labelPosition:"top",
                        value: item["id_Склад"],
                        borderless:true,
                        options:{
                            view: "gridsuggest",
                            data: options,
                            id: "edit_pp_adr_", 
                            borderless: true,
                            body: {
                                header: false,
                                width: 400,
                                scroll:true,
                                autoheight:false,
                                autofocus:true,
                                yCount:5,
                                columns: [
                                    {id:"value", width: 400, }
                                ]
                            }
                            
                        }
                    }
                );
                $$('edit_pp_com').setValue(item["Коментарий"]);
                
            }
        }
    });
    
    
    return {
        $ui: popup
    };
    
});