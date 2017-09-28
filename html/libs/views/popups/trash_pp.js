define([
    "app", "models/trash_db", "views/windows/report_price_win"
],function(app, store, report_price_win){
    var popup = webix.ui({
        view: "popup",
        id: "trash_pp",
        height: 450,
        scrollY: true,
        body:{
            width: 600,
            rows:[
                {
                    padding: 5,
                    cols: [
                        
                        {
                            view: 'label',
                            label: 'КОРЗИНА'
                        },
                        {
                            view: "search",
                            placeholder: "поиск по корзине..",
                            
                            keyPressTimeout: 700,
                            on: {
                                onChange: function (nv) {
                                    nv = nv.split(' ')
                                    store.filter(function (el) {
                                        result = true
                                        nv.forEach(function (el1) {
                                            if (el.TITLE.toUpperCase().indexOf(el1.toUpperCase()) === -1) {
                                                result = false
                                            }
                                        });
                                        return result
                                    })
                                },
                                onTimedKeyPress: function () {
                                    var me = this;
                                    this.callEvent('onChange', [me.getValue()]);
                                },
                            }
                        }
                    ]
                },
                {height: 10},
                {
                    id: 'tresh_pp_tbl',
                    view:"activeTable",
                    width: 600,
                    height: 380,
                    scrollX: false,
                    select: 'row',
                    hover: 'hover_table',                    
                    navigation: true,
                    type: app.tbl_types,
                    tooltip: true,
                    header: false,
                    columns:[  
                        {   
                            header: {text: "Корзина", colspan: 2},
                            id:"izb", template:"{common.undel()}",
                            width: 50,
                            tooltip: false,
                        },     
                        {
                            //$$('orders_tbl').getHeaderContent("mc1").isChecked()
                            id: "FG_INDIVID", 
                            template: app.custom_checkbox1,
                            width: 25,
                            header: '',
                            tooltip: false,
            
                        },                   
                        { id:"TITLE", 
                        header: [{ content:"textFilter"}],
                        template: "<div class='olpp_div'><p style='height: 10px; overflow: hidden;'>#TITLE#"+
                        "</p><p><span class='olpp_nm'>#VENDOR#</span>&nbsp;&nbsp;<span class='stitle_span'>#STITLE#</span><span class='olpp_sm'>"+ 
                        "{common.get_edit_dt()}</p></div>",
                        tooltip: "<div>\
                        <p><span class='sp_trsh'>название:</span> #TITLE#</p>\
                        <p><span class='sp_trsh'>производитель:</span> #VENDOR#</p>\
                        <p><span class='sp_trsh'>поставшик:</span> #STITLE#</p>\
                        <p><span class='sp_trsh'>количество:</span> #SP_COUNT#</p>\
                        <p><span class='sp_trsh'>пользователь:</span> #USER_NAME#</p>\
                        </div>",
                        fillspace: true,},
                        //{ id:"VENDOR", fillspace: true,},
                        //{ id:"DT_EDIT",fillspace: true,}
                        
                    ],
                    data: store,
                    fixedRowHeight:false, 
                    rowLineHeight:70, rowHeight:70,
                    activeContent:{
                        undel:{
                            view:"icon",
                            css: 'untrash_btn',
                            //icon: "trash-o"
                        }
                    },
                    onClick: {
                        "untrash_btn": function(evt,el,trg){
                            var item = this.getItem(el.row);
                            store.out_trash(item.ACODE, item.SCODE, item.id);
                            store.remove(item.id);
                            if (store.count() === 0) {
                                $$("trash_pp").hide();
                            }
                            return false
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