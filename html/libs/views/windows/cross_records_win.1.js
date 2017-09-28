define([
    "app", "models/cross_records_db"
], function(app, store){
    
    
    var ui = {
            view:"window",
            id:"cross_records_win",
            head:"<span style='color: orange'>Внимание повторяющиеся позиции</span>", 
            height: 450,
            width: 600,
            position:"center",                                                        
            modal: true,
            body:{
                rows: [{
                    padding: 10,
                    rows:[
                         {
                            view:"activeTable",
                            scrollX: false,
                            id: 'cross_win_tb',
                            height: 300,
                            //hover: 'hover_table',
                            fixedRowHeight:false,
                            type: {
                                get_acode: function(obj) {
                                    return obj.acode;//.replace(/-/g, '_');
                                }
                            },
                            cross_rec: {},
                            columns:[
                                { id: "title", header: "Название", fillspace: true},
                                { 
                                    id: "min_c", header: "Мин", width: 70,
                                    template: "<span class='cross_r js_a_{common.get_acode()}' onclick='$$(\"cross_win_tb\").config.select_c(\"{common.get_acode()}\", this)'>\
                                    #min_c#</span>"
                                },
                                { 
                                    id: "max_c", header: "Макс", width: 70, 
                                    template: "<span class='cross_r js_a_{common.get_acode()}' onclick='$$(\"cross_win_tb\").config.select_c(\"{common.get_acode()}\", this)'>\
                                    #max_c#</span>"
                                },
                                { 
                                    id: "sum_c", header: "Сумма", width: 70, 
                                    template: "<span class='cross_r js_a_{common.get_acode()}' onclick='$$(\"cross_win_tb\").config.select_c(\"{common.get_acode()}\", this)'>\
                                    #sum_c#</span>"
                                }
                            ],
                            select_c: function(acode, el){
                                try {
                                    //document.querySelector('.cross_r_h.js_a_' + acode).classList.remove('cross_r_h');
                                    //console.log('.cross_r_h.js_a_' + acode);
                                    [].map.call(document.querySelectorAll('.cross_r_h.js_a_' + acode), function(el){ try { el.classList.remove('cross_r_h') } catch(er) {} })
                                } catch(er) {}
                                
                                el.classList.add('cross_r_h');
                                $$("cross_win_tb").config.cross_rec[acode] = el.innerHTML;
                                
                                if (store.count() === Object.keys($$("cross_win_tb").config.cross_rec).length) {
                                    $$("cross_yes_btn").show();
                                }
                            },
                            
                            //width: '100%',
                            datatype:"jsarray",
                            data: store
                        }
                    ]
                },{
                    padding: 5,
                    cols:[
                        {
                            view:"button", 
                            value:"Отменить",
                            css:"button_info",
                            width: 150,
                            click: function(){
                                $$('cross_records_win').close();
                            }                            
                        },
                        {view: 'spacer'},
                        {
                            view:"button", 
                            value:"Продолжить",
                            css:"button_success",
                            hidden: true,
                            id: "cross_yes_btn",
                            width: 150,
                            click: function(){
                                var cross = $$('cross_win_tb').config.cross_rec;
                                $$('cross_records_win').close();
                                
                                
                                var req = {
                                    method: 'archive.combine_orders', 
                                    params: [store.ids[0], store.ids, app.user_info.id, cross]
                                };            
                                
                                app.request(req, function(text) {
                                    var respons = JSON.parse(text);
                                    if(app.check_response(respons)){
                                        var rows = respons.result[0];
                                        $$('orders_head_arch').load();
                                    }
                                }, true);
                                
                                
                            }                            
                        }
                    ]
                }]
            },
            on: {
                onBeforeShow: function() {
                    $$("cross_win_tb").resize();
                },
                onShow: function() {
                    $$("cross_win_tb").config.cross_rec = {};
                }
            }
        };
        
    return ui;
});
