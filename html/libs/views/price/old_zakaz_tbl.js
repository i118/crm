
define([
    "app", "models/old_zak_db"
], function(app, store){
    
    
    var ui = {
        css: 'old_zak_pnl',
        id: 'old_zakaz_pnl',
        hidden: true,
        rows:[
            {
                cols: [
                    { 
                        view:"label", 
                        label: "Прошлые заказы",
                        css: 'old_zak_lbl',
                        inputWidth:100, 
                        align:"left"
                    },
                    {},
                    {
                        view:"checkbox", 
                        css: 'old_zak_lbl',
                        id: "fix_old_zak_pnl", 
                        width: 120,
                        labelWidth: 90,
                        label:"Закрепить", 
                        align:"right",
                        value: 0,
                         on: {
                            onChange: function(newv){
                                $$("options_menu").config.save_options(this.config.id, newv);
                            }
                        }
                    }
                ]
            },
            {
                view:"datatable", 
                id: 'old_zakaz_tbl',
                scrollX: false,
                //select: 'row',
                hover: 'hover_table',
                //navigation:true,
                editable:true,
                tooltip:true,
                height: 120,
                //hidden: true,
                rowHeight: 30,
                doubleEnter: 0,
                //width: window.innerWidth > 1170 ? 1170: 980,
                type: app.tbl_types,
                //Кол-во| Цена |дата|поставщик|наименование|производ|статус|заказ|
                columns:[
                    { 
                        id:"old_count",    header:"Кол-во",
                        css: "title_prc", width: 80                        
                    },
                     { 
                        id:"price",    header:"Цена",
                        css: "title_prc", width: 80                        
                    },
                    { 
                        id:"date_in",    header:"Дата",      
                        format:webix.Date.dateToStr("%d.%m.%Y"),                                                
                        sort: "string"
                    },
                    { 
                        id:"stitle", header:"Поставщик", 
                        //template:"<span class='{common.vnd_color()}'>#stitle#</span>",
                        width: 85, sort: "string"
                    },
                    { 
                        id:"title",    header:"Товар", 
                        template:"<span class='tovar_title'>{common.oz_title_render()}</span>",
                        css: "title_prc",
                        fillspace: true,
                        sort: "string"
                    },
                    { 
                        id:"vendor", header:"Производитель",  
                        template:"<span class='vendor_title'>{common.oz_vendor_render()}</span>",  
                        width: 160,
                        sort: "string"
                    },
                    { 
                        id:"state", header:"Статус", 
                        template:"{common.state_render()}",
                        width: 85, sort: "string"
                    },                    
                    { 
                        id:"order",    header:"Заказ",
                        css: "title_prc"                        
                    },
                    { 
                        id:"user",    header:"Пользователь",
                        css: "title_prc",
                        sort: "string"
                    }
                ],
                data: store,
                on: {
                    onBeforeRender: function() {
                        $$('fix_old_zak_pnl').setValue(app.user_info.options.options.fix_old_zak_pnl);
                    }
                }
            }
        ]
    };

    return ui;
});
