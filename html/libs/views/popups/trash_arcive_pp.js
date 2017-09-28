//trash_arcive_pp.js
define([
    "app", "models/trash_archive_db"
],function(app, store){
    var popup = webix.ui({
        view: "popup",
        id: "trash_arcive_pp",
        body:{
            rows:[
                {
                    id: 'tresh_arcive_pp_tbl',
                    view:"activeTable",
                    scrollX: false,
                    //header: false,
                    //hover: 'hover_table',
                    navigation: true,
                    columns:[  
                        {   
                            header: {text: "Корзина", colspan: 2},
                            id:"izb", template:"{common.undel()}",
                            width: 50
                        },
                        { id:"sklad", template: "<div class='olpp_div'><p>#sklad#"+
                            "</p><p><span class='olpp_nm'>№ #n_order#</span>&nbsp;&nbsp;#user#<span class='olpp_sm'>"+ 
                            "#summ#</p></div>",
                            width: 400
                        },
                        
                    ],
                    data: store,
                    fixedRowHeight:false, autoheight:true, autowidth:true,
                    rowLineHeight:70, rowHeight:70,
                    activeContent:{
                        undel:{
                            view:"icon",
                            css: 'untrash_btn',
                            tooltip: "Востановить"
                            //icon: "trash-o"
                        }
                    },
                    onClick: {
                        "untrash_btn": function(evt,el,trg){
                            var item = this.getItem(el.row);
                            store.out_trash(item.id);
                            store.remove(item.id);
                            if (store.count() === 0) {
                                $$("trash_archive_pp").hide();
                            }
                        }
                    }
                }
                
            ]
        },
        on: {
            onBeforeShow: function() {
                store.load();
                this.resize();
            }
        }
    });
    
    return {
        $ui: popup
    };
    
});