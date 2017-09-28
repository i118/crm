define([
    "app", "models/cross_records_db", "views/windows/cr_confirm_win"
], function(app, store, cr_confirm_win){
    
    
    var ui = {
            view:"window",
            id:"cross_records_win",
            head:"<span style='color: orange'>Внимание пересекающиеся позиции</span>", 
            height: 450,
            width: 650,
            position:"center",                                                        
            modal: true,
            body:{
                width: 650,
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
                                get_id: function(obj) {
                                    return obj.id;//.replace(/-/g, '_');
                                }
                            },
                            cross_rec: {},
                            columns:[
                                { id: "title", header: "Название", fillspace: true},
                                { 
                                    id: "min_c", header: "Мин", width: 70,
                                    template: "<span class='cross_r js_a_{common.get_id()}' onclick='$$(\"cross_win_tb\").config.select_c(\"{common.get_id()}\", this)'>\
                                    #min_c#</span>"
                                },
                                { 
                                    id: "max_c", header: "Макс", width: 70, 
                                    template: "<span class='cross_r js_a_{common.get_id()}' onclick='$$(\"cross_win_tb\").config.select_c(\"{common.get_id()}\", this)'>\
                                    #max_c#</span>"
                                },
                                { 
                                    id: "sum_c", header: "Сумма", width: 70, 
                                    template: "<span class='cross_r js_a_{common.get_id()}' onclick='$$(\"cross_win_tb\").config.select_c(\"{common.get_id()}\", this)'>\
                                    #sum_c#</span>"
                                }
                            ],
                            select_c: function(acode, el){
                                try {
                                    //document.querySelector('.cross_r_h.js_a_' + acode).classList.remove('cross_r_h');
                                    //console.log('.cross_r_h.js_a_' + acode);
                                    [].map.call(
                                        document.querySelectorAll('.cross_r_h.js_a_' + acode), 
                                        function(el){ 
                                            try { 
                                                el.classList.remove('cross_r_h') 
                                            } catch(er) {} 
                                        }
                                    )
                                } catch(er) {}
                                
                                el.classList.add('cross_r_h');

                                var ff = store.find(function(sel){
                                    console.log(sel.id*1, el*1)
                                    return sel.id*1 === acode*1
                                })
                                
                                $$("cross_win_tb").config.cross_rec[acode] = [el.innerHTML*1, ff[0].old_id, ff[0].price];
                                
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
                            width: 100,
                            click: function(){
                                $$('cross_records_win').close();
                            }                            
                        },
                        {view: 'spacer', width: 70},
                        {
                            view:"button", 
                            value:"все мин",
                            css:"button_warning",
                            width: 100,
                            tooltip: "Все позиции по минимуму",
                            click: function(){
                                var cross = $$('cross_win_tb').config.cross_rec;

                                if(Object.keys(cross).length>0){
                                    webix.ui(cr_confirm_win).show()
                                }else{
                                    store.find(function(el) {
                                        cross[el.id] = [el.min_c, el.old_id, el.price]
                                    });
                                    $$('cross_yes_btn').config.click()
                                }
                                
                            }                            
                        },
                        {
                            view:"button", 
                            value:"все макс",
                            css:"button_warning",
                            width: 100,
                            tooltip: "Все позиции по максимуму",
                            click: function(){
                                var cross = $$('cross_win_tb').config.cross_rec;

                                if(Object.keys(cross).length>0){
                                    webix.ui(cr_confirm_win).show()
                                }else{
                                    store.find(function(el) {
                                        cross[el.id] = [el.max_c, el.old_id, el.price]
                                    });
                                    $$('cross_yes_btn').config.click()
                                }
                            }                            
                        },
                        {
                            view:"button", 
                            value:"все сум",
                            css:"button_warning",
                            width: 100,
                            tooltip: "Все позиции в сумму по позиции",
                            click: function(){
                                var cross = $$('cross_win_tb').config.cross_rec;
                                
                                if(Object.keys(cross).length>0){
                                    webix.ui(cr_confirm_win).show()
                                }else{
                                    store.find(function(el) {
                                        cross[el.id] = [el.sum_c, el.old_id, el.price]
                                    });
                                    $$('cross_yes_btn').config.click()
                                }
                            }                            
                        },
                        {view: 'spacer', width: 40},
                        {
                            view:"button", 
                            value:"Продолжить",
                            css:"button_success",
                            hidden: true,
                            id: "cross_yes_btn",
                            width: 150,
                            click: function(){
                                var cross = $$('cross_win_tb').config.cross_rec, el,
                                cur_order = $$('adres_db').getItem($$('adres_db').getCursor());
                                $$('cross_records_win').close();
                                //console.log(cross)
                                
                                var req = {
                                    method: 'orders.combine_rec', 
                                    params: [cross, $$('segment_vw').getValue(), app.user_info.id, cur_order.id]
                                };            
                                
                                app.request(req, function(text) {
                                    var respons = JSON.parse(text);
                                    if(app.check_response(respons)){
                                        var rows = respons.result[0];
                                        if ($$('segment_vw').getValue()*1 === 1){
                                            $$('orders_body_db').load()
                                        }
                                        var cnt =  Object.keys(cross).length;
                                        if($$('segment_vw').getValue()*1 === 0){
                                            app.ms_box('В индивидуальном заказе созданно ' + cnt + ' позиций', '', {}, 2000)
                                        }else{
                                            app.ms_box('В общий заказ перенесено ' + cnt + ' позиций', '', {}, 2000)
                                        }

                                        cur_order.summ_ob = rows[0];
                                        cur_order.summ_ind = rows[1];

                                        $$("adres_db").callEvent('onAfterCursorChange', [cur_order.id, true]);
                                        $$('orders_tbl').getHeaderContent("mc1").uncheck()
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
