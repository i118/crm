define([
    "app", "models/users_list_db"
],function(app, store){
    var popup = webix.ui({
        view: "popup",
        id: "author_pp",
        height: 300,
        timeout: null,
        paddingY: 0,
        body:{
            paddingY: 0,
            rows:[
                {
                    id: "author_pp_tbl",
                    view:"activeTable",
                    scrollX: false,
                    header: false,
                    hover: 'hover_table', 
                    autowidth: true,
                    columns:[                  
                        { id: "1", header: "Адрес", sort: "string", width: 200},
                        {   
                            id:"izb", template:"{common.checkbox()}", width: 50
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
                        $$('users_list_db').find(function(el){
                            el.izb = 0;
                            return el.izb === 1;
                        });
                        $$('author_pp_tbl').refresh();
                        $$('orders_head_arch').load();
                    }
                    
                }
            ]
        }
    });
    
    
    return {
        $ui: popup
    };
    
});