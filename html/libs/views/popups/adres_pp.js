define([
    "app", "models/adres_db"
],function(app, store){
    var popup = webix.ui({
        view: "popup",
        id: "adres_pp",
        height: 300,
        timeout: null,
        paddingY: 0,
        body:{
            paddingY: 0,
            rows:[
                {   
                    id: "adres_pp_tbl",
                    view:"activeTable",
                    scrollX: false,
                    header: false,
                    hover: 'hover_table', 
                    autowidth: true,
                    columns:[                  
                        { id: "1", header: "Адрес", sort: "string", width: 350},
                        {   
                            id:"izb", template:"{common.checkbox()}", width: 50
                        }
                    ],
                    data: store,
                    //fixedRowHeight:false,  //rowLineHeight:45, rowHeight:45,  
    
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
                        },
                        onresize: function(){ 
                            this.adjustRowHeight("1", true); 
                        },
                        onShow: function(){
                           //this.adjustColumn("1");
                           this.adjustRowHeight("1", true); 
                        }
                    }
                },
                { height: 10 },
                {
                    
                    view:"button",
                    css:"button_primary",
                    value:"снять выделение",
                    click: function() {
                        $$('adres_db').find(function(el){
                            el.izb = 0;
                            return el.izb === 1;
                        });
                        $$('adres_pp_tbl').refresh();
                        $$('orders_head_arch').load();
                    }
                    
                }
            ]
        },
        on: {
            onShow: function(){
        //       this.adjustColumn("1");
            }
        }
    });
    
    
    return {
        $ui: popup
    };
    
});