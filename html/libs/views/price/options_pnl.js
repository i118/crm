define([
    "app", 
],function(app, store){
    //{"check_seller_name": true, "check_mnn": true, "mz_v": true, "czv": "7", "kc_ost": "1", "czh": true, "godn": "365"}
    var ui = webix.ui({
                view: "sidemenu",
                id: "options_menu",
                width: 550,
                position: "left",
                save_options: function(id, newv) {
                    app.user_info.options.options[id] = newv;
                    app.setUserInfoOptions(app.user_info);
                },
                body:{
                    view:"form", 
                    elements:[
                        {
                            view:"fieldset", 
                            label:"Поиск",
                            body:{
                                rows:[
                                    { 
                                        view:"checkbox", 
                                        id: 'check_seller_name',
                                        label:"Отображать исходные названия поставщика",
                                        labelWidth: 400,
                                        inputAlign: 'right',
                                        value: 1,
                                        on: {
                                            onChange: function(newv){
                                                if ($$("price_tbl") === undefined) {
                                                    return
                                                }
                                                if ($$("price_tbl").isVisible()) {
                                                    $$("price_tbl").refresh()
                                                } else {
                                                    $$("orders_tbl").refresh()
                                                }
                                                $$("options_menu").config.save_options(this.config.id, newv);
                                            }
                                        }
                                    },
                                    { 
                                        view:"checkbox", 
                                        id: 'check_mnn',
                                        label:"Поиск по мнн",
                                        inputAlign: 'right',
                                        labelWidth: 400,
                                        value: 1,
                                        on: {
                                            onChange: function(newv){
                                                if ($$("price_tbl") === undefined) {
                                                    return
                                                }
                                                
                                                if ($$("price_tbl").isVisible()) {
                                                    $$("price_tbl").refresh()
                                                } else {
                                                    $$("orders_tbl").refresh()
                                                }
                                                
                                                $$("options_menu").config.save_options(this.config.id, newv);
                                            }
                                        }
                                    },                                    
                                    {   //если удалять удалить все ссылки по коду + убрать из опций
                                        view:"checkbox", 
                                        id: 'check_vnd',
                                        label:"Поиск по поставщику",
                                        inputAlign: 'right',
                                        hidden: true,
                                        labelWidth: 400,
                                        value: 0,
                                        on: {
                                            onChange: function(newv){
                                                /*
                                                if ($$("price_tbl") === undefined) {
                                                    return
                                                }
                                                
                                                if ($$("price_tbl").isVisible()) {
                                                    $$("price_tbl").refresh()
                                                } else {
                                                    $$("orders_tbl").refresh()
                                                }
                                                
                                                $$("options_menu").config.save_options(this.config.id, newv);
                                                */
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            view:"fieldset", 
                            label:"Прошлые заказы",
                            body:{
                                rows: [
                                    { 
                                        view:"checkbox", 
                                        id: 'check_old_count',
                                        label:"Отображать количество в прошлых заказах",
                                        inputAlign: 'right',
                                        labelWidth: 400,
                                        value: 1,
                                        on: {
                                            onChange: function(newv){
                                                $$("options_menu").config.save_options(this.config.id, newv);
                                            }
                                        }
                                    },
                                    { 
                                        view:"counter", 
                                        id: 'value_old_count',
                                        label:"Количество дней для подсчёта в прошлых заказах", 
                                        labelWidth: 400,
                                        step:1, 
                                        value:7,
                                        on: {
                                            onChange: function(newv){
                                                $$("options_menu").config.save_options(this.config.id, newv);
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            view:"fieldset", 
                            label:"Дефектура",
                            body:{
                                rows: [
                                    { 
                                        view:"checkbox", 
                                        id: 'check_def_zpoz',
                                        label:"Отображать заказанные позициии",
                                        inputAlign: 'right',
                                        labelWidth: 400,
                                        value: 0,
                                        on: {
                                            onChange: function(newv){
                                                $$("options_menu").config.save_options(this.config.id, newv);
                                                if($$('defecture_tbl').isVisible() === true) {
                                                    $$('defecture_db').load()
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            view:"fieldset", 
                            label:"Остатки",
                            body:{
                                rows: [
                                    { 
                                        view:"checkbox", 
                                        id: 'check_rest',
                                        label:"Показывать остатки",
                                        inputAlign: 'right',
                                        labelWidth: 400,
                                        value: 1,
                                        on: {
                                            onChange: function(newv){
                                                $$("options_menu").config.save_options(this.config.id, newv);
                                            }
                                        }
                                    }
                                ]
                            }
                        }                        
                    ]
                }
            });
    return ui;
    
});            