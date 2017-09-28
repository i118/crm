define([
    "app", "models/vnds_list_prc_db"
],function(app, vnds_list_prc_db){
    var popup = webix.ui({
        view: "popup",
        id: "vnd_mode",
        height: 300,
        width: 280,
        timeout: null,
        body:{
            rows:[
                {
                    view:"segmented",  id: 'vnd_mode_sg', value: 'mode3', multiview: true, options: [
                        { 
                            value: 'Все',  
                            id: 'mode1'
                        },
                        { value: 'Избранное',  id: 'mode2'}
                    ],
                    on: {
                        onItemClick: function(id, e){
                            var mode = $$(id).getValue().replace("mode", ""),
                                new_conf = app.user_info,
                                me = this;
                            new_conf.options.select_mode = mode;
                            app.setUserInfoOptions(new_conf);
                            
                            if (mode*1 === 2) {
                                $$('mode2').clearSelection();
                            } else {
                                if (mode*1 === 1) {
                                    $$('mode1').clearSelection();
                                }
                            }
                            
                            //обновляем меню и строку кнопок поставщиков в заказе
                            $$('vnds_list_prc_db').my_parse();
                            $$('order_stat_db').my_parse();
                            $$('order_stat_db').refresh_menu();
                            
                            $$('vnd_list_bnt').config.label = app.get_select_mode_title();
                            $$('vnd_list_bnt').refresh();
                            
                            clearTimeout(me.config.timeout);
                            me.config.timeout = setTimeout(function(){
                                if ( $$('main_search').getValue() !== "" ) {
                                    $$('price_db').clear_data();
                                    $$('price_db').load();
                                }
                                try {
                                    $$('orders_body_db').load();
                                } catch(er) {}
                                
                            }, 500);
                        }
                    }
                },    
                {   
                    id:"mymulti",
                    animate: false,
                    cells:[
                        {
                            id: 'mode1',
                            view:"datatable",
                            scrollX: false,
                            header: false,
                            hover: 'hover_table',
                            navigation: true,
                            select: 'row',
                            columns:[                  
                                { 
                                    id:"name",   
                                    width: 220, 
                                    template: "<div class='vnd_list_menu'>" +
                                    "<span style='width: 90px;'>#name#</span>" +
                                    "<span style='width: 50px;'>#count#</span>" +
                                    "<span style='width: 50px;'>#date#</span>" +
                                    "</div>"
                                }                  
                            ],
                            data: vnds_list_prc_db,
                            on: {
                                onItemClick: function(id){
                                    $$('mode2').config.set_one(id, this);
                                }
                            }
                        },                       
                        {
                            id: 'mode2',
                            view:"activeTable",
                            scrollX: false,
                            header: false,
                            hover: 'hover_table',
                            select: 'row',
                            columns:[                  
                                { 
                                    id:"name",   
                                    width: 220, 
                                    template: "<div class='vnd_list_menu'>" +
                                    "<span style='width: 90px;'>#name#</span>" +
                                    "<span style='width: 50px;'>#count#</span>" +
                                    "<span style='width: 50px;'>#date#</span></div>"
                                },
                                {   
                                    id:"izb", template:"{common.checkbox()}"
                                }
                                
                            ],
                            data: vnds_list_prc_db,
                            set_one: function(id, me){
                                var item = me.getItem(id),
                                    code = item.code,
                                    new_conf = app.user_info;
                                
                                new_conf.options.select_vnd["3"] = {};    
                                new_conf.options.select_vnd["3"][code+""] = item.name;
                                
                                if (new_conf.options.select_mode*1 === 2) {
                                    $$('vnd_mode_sg').setValue('mode1');
                                    $$('vnd_mode_sg').callEvent('onItemClick',['vnd_mode_sg']);
                                }
                                
                                $$('vnd_mode_sg').setValue('mode3');
                                $$('vnd_mode_sg').callEvent('onItemClick',['vnd_mode_sg']);
                                
                                $$('mode1').showItem(id);
                                $$('mode1').select(id);
                                
                                //$$('order_stat_db').my_parse();
                                //$$('order_stat_db').refresh_menu();
                                
                            },
                            on: {
                                onItemClick: function(id){
                                    this.config.set_one(id, this);
                                },
                                onCheck: function(id, column, state){
                                    var code = this.getItem(id).code,
                                        new_conf = app.user_info;
                                    
                                    if (state===1) {
                                        new_conf.options.select_vnd["2"][code+""] = 1;
                                    } else {
                                        delete new_conf.options.select_vnd["2"][code+""];
                                    }
                                    app.setUserInfoOptions(new_conf);
                                    $$('vnd_mode_sg').callEvent('onItemClick',['vnd_mode_sg']);
                                }
                            }
                        }
                    ]
                }
            ]
        },
        on: {
            onShow: function(){
                $$('vnd_mode_sg').setValue('mode'+app.user_info.options.select_mode);
                if (app.user_info.options.select_mode*1 === 3) {
                    
                    var row = $$('mode1').find(function(obj){
                        return obj.code+"" == Object.keys(app.user_info.options.select_vnd[3])[0] +"";
                    });
                    
                    $$('mode1').showItem(row[0].id);
                    $$('mode1').select(row[0].id);
                }
            }
        }
    });
    
    
    return {
        $ui: popup
    };
    
});