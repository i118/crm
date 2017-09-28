define([
    "app", "models/avnd_list_db"
],function(app, store){
    var popup = webix.ui({
        view: "popup",
        id: "avnd_mode",
        height: 300,
        width: 200,
        timeout: null,
        paddingY: 0,
        body:{
            padding: 0,
            rows:[
                {   
                    id: "avnd_mode_tbl",
                    view:"activeTable",
                    scrollX: false,
                    header: false,
                    hover: 'hover_table',
                    type: app.tbl_types,
                    //select: 'row',
                    columns:[                  
                        { 
                            id:"name",
                            template: "<span style='text-transform: capitalize'>{common.vnd_name()}</span>",width: 120
                        },
                        {   
                            id:"izb", template:"{common.checkbox()}",width: 50
                        }
                        
                    ],
                    data: store,
                    on: {
                        onItemClick: function(id) {
                            var item = this.getItem(id);
                            item.izb = !item.izb*1;
                            this.refresh();
                            
                            this.callEvent("onCheck", [id]);
                        },
                        onCheck: function(id){
                            var item = this.getItem(id);
                            $$('orders_head_arch').load();
                        }
                    }
                },
                { height: 10 },
                {
                    
                    view:"button",
                    css:"button_primary",
                    value:"снять выделение",
                    click: function() {
                        $$('avnd_list_db').find(function(el){
                            el.izb = 0;
                            return el.izb === 1;
                        });
                        $$('avnd_mode_tbl').refresh();
                        $$('orders_head_arch').load();
                    }
                    
                }
            ]
        },
        on: {
            onShow: function(){
               
            }
        }
    });
    
    
    return {
        $ui: popup
    };
    
});