//orders_tbl

define([
    "app", "models/orders_body_archive_db"
], function(app, store){

    var ui = {
        view:"datatable", 
        id: 'archive_order_body_tbl',
        scrollX: false,
        select: 'row',
        hover: 'hover_table',
        hidden: true,
        navigation:true,
        editable:true,
        tooltip:true,
        /*type:{
            price_color: function(obj,type) {
                return obj.PRICE > obj.SP_PRICE && obj.SP_PRICE > 0 ? "red": "";
            },
            price_value: function(obj,type) {
                return app.moneyView(obj.PRICE);
            },
            life_render: function(obj,type) {
                var oldval = obj.LIFE.replace(/(\d+)-(\d+)-(\d+)/, "$2/$3/$1"),
                    month_names = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл',
                        'авг', 'сен', 'окт', 'ноя', 'дек'],
                    r = new Date(oldval),
                    i = new Date(),  
                    r1 = r,
                    y = '',
                    F = '';
                
                if(obj.LIFE > "") {
                    
                    var godn = 356;//$b('#godn')[0].value*1;
                    i = i.setDate(i.getDate()+godn);
                    r1 = r1.setDate(r.getDate());
                    
                    y = (r1 < i) ? " text_danger" : ''; 
                    
                    oldval = oldval.split('/');
                    
                    F = '<span class="pull-right ' + y + '">' + 
                        month_names[(oldval[0]*1)-1] + " " + oldval[2].substr(2,2) + "</span> ";
                }
                return F;
            },
            vnd_color: function(obj) {
                var raznicaD = Math.ceil((new Date() - new Date(obj.DT)) / (1000 * 60 * 60 * 24))-1,
                    result;
                
                if (raznicaD === 0) {
                    result = 'text_success';
                }
                if (raznicaD > 2) {
                    result = 'text_silver';
                }
                
                return result;
            },
            rest_render: function(obj) {
                if (obj.REST === 0) {
                    return('нет');
                }
                if (obj.REST >= 10000) {
                    return('много');
                }
                return Math.round(obj.REST);
            },
            sp_count_render: function(obj) {
                return obj.SP_COUNT !== 0 ? obj.SP_COUNT : "";
            },
            rate_render: function(obj) {
                var display_text = (obj.RATE > 1) ? '<span class="text_danger">/'+
                    obj.RATE+'</span>':
                    (obj.MINZAK > 1) ? '<span class="text_danger">/'+
                    obj.MINZAK+'</span>': "/" + obj.MINZAK;
                    
                return display_text;
            },
            sp_summa_render: function(obj) {
                return obj.SP_SUMMA !== 0 ? app.moneyView(obj.SP_SUMMA): "";
            },
            reestr_render: function(obj) {
                return obj.REESTR !== 0 ? obj.REESTR: "";
            },
            count_render: function(obj) {
                // будующая функция обработки количества в других заказах
                var tmp_s = obj.SP_COUNT;
                    
                if (tmp_s.indexOf('old') !== -1) {
                    sp_count.addClass('color_lblue');
                    tmp_s = tmp_s.replace('old','').split('_');
                    var sum_w = tmp_s[1]*1 + tmp_s[2]*1;
                    _r_ = sum_w > 0 ? sp_count.html(tmp_s[0] +' / ' + sum_w): sp_count.html(tmp_s[0]);
                    sp_count.attr('title', 'в наборе: ' + tmp_s[1] + ' в архиве: ' + tmp_s[2] +  ' отправлено: ' + tmp_s[3]);
                } else {
                    sp_count.removeClass('color_silver');
                }
            }
        },*/
        type: app.tbl_types,
        doubleEnter: 0,
        columns:[
            { 
                id:"STITLE", header:"Поставщик", 
                template:"<span class='{common.vnd_color()}'>#STITLE#</span>",
                width: 85, 
                sort: "string"
            },
            { 
                id:"PRICE",    
                css:"col_text_right", 
                header: {text: "Цена", css: "col_text_right", adjust: true},     
                template:"<span style='color:{common.price_color1()}'>{common.price_value()}</span>",
                width: 75, 
                sort: "int"
            },
            { 
                id:"TITLE",    
                header:"Товар", 
                template:"<span class='tovar_title'>{common.title_render_arh()}</span>{common.life_render()}",
                css: "title_prc",
                fillspace: true,
                //width: (window.innerWidth - 490) / 2,
                //width: window.innerWidth > 1170? 460: 300,
                //adjust: true,
                sort: "string"
                
            },
            { 
                id:"VENDOR", header:"Производитель",  template:"<span class='vendor_title'>{common.vendor_render_arh()}</span>",  
                //width: (window.innerWidth - 490) / 2, 
                width: 160,
                sort: "string"
                
            },
            { 
                id:"REST",   header:{text:"Остаток", css: "col_text_right"}, css: "col_text_right",
                template:"{common.rest_render()}",
                width: 70, sort: "int"
            },
            { 
                id:"SP_COUNT", css: "col_text_right", header:{text:"Кол-во", css: "col_text_right"}, 
                 template:"{common.sp_count_render()}",
                 width: 100,
                 editor:"text", sort: "int"
            },
            { 
                id:"SP_SUMMA", css:"col_text_right", header: {text: "Сумма", css: "col_text_right"},  
                template:"{common.sp_summa_render()}",
                width: 120, 
                sort: "int"
            },
            { id:"RATE",   header:"Упак", 
                width: 70,
                template:"{common.rate_render()}",
            },
            
            { id:"REESTR",   header:"ЖВНЛС",  template:"{common.reestr_render()}",
                width: 70
            }
        ],
        data: store,
        on: {
            onKeyPress: function(code, e) {
                var me = this,
                    cur_sel = me.getSelectedId().id,
                    ostate;
                if (this.getEditState() === false) {
                    ostate = $$('archive_orders_head').getItem($$('orders_head_arch').getCursor()).state;
                    if ((app.isCharCode(code) || code === 32)  && code !== 8) {
                        if (code !== 8 && code !== 32) {
                            $$('main_search_ord').setValue('');
                        }else{
                            if (code === 32) {
                                $$('main_search_ord').setValue($$('main_search_ord').getValue() + ' ');
                            }
                        }
                        $$('main_search_ord').focus();
                        setTimeout(function(){
                            $$('main_search_ord').callEvent('onChange', [$$('main_search_ord').getValue()]);
                        }, 100);
                    }else if (code === 8) {
                        $$('main_search_ord').focus();
                        setTimeout(function(){
                            $$('main_search_ord').callEvent('onChange', [$$('main_search_ord').getValue()]);
                        }, 100);
                    }
                    
                    if ((code === 13 || app.isNumberCode(code)) && ostate*1 !== 26) {
                        //if ($$("orders_head_arch").getItem($$("orders_head_arch").getCursor()).state*1 === 26) {
                            //return false;
                        //}
                        setTimeout(function(){
                            me.edit({
                                row: me.getSelectedId(),
                                column: "SP_COUNT"
                            });
                            if (app.isNumberCode(code)) {
                                $$('archive_order_body_tbl').getEditor().node.querySelector('input').value = String.fromCharCode(code);
                            }
                            //console.log(cur_sel)
                            //me.select(cur_sel);
                        },100);
                    }
                    
                    if (code === 46 && e.ctrlKey && ostate*1 !== 26) {
                        var item = me.getSelectedItem();
                        item.SP_COUNT = 0;
                        item.SP_SUMMA = 0;
                        $$('orders_body_archive_db').config.del_rec(item);
                        $$('archive_order_body_tbl').refresh();
                    }
                    
                } else {
                    if (code === 40) {
                        me.editStop();
                        console.log(me.getSelectedId().id+'', me.getLastId()+'', cur_sel)
                        if(me.getSelectedId().id+'' !== me.getLastId()+''){
                            me.select(me.getNextId(cur_sel));
                        }else{
                            me.select(cur_sel);
                        }
                        
                    }
                    if (app.isCharCode(code)) {
                        return false;
                    }
                }
            },
            onAfterEditStop: function(state, editor, ignoreUpdate){
                
                var tbl = $$('archive_order_body_tbl'),
                    item = tbl.getSelectedItem();
                //console.log(item)
                return 
                if (state.value*1 === 0*1) {
                    item.SP_COUNT = 0;
                    item.SP_SUMMA = 0;
                    $$('orders_body_archive_db').config.del_rec(item);
                    $$('archive_order_body_tbl').refresh();
                    return false;
                }
                
                if(state.value != state.old){
                    
                    // проверить кратность
                    //var tmp_count = app.setCount(item.SP_COUNT, item.RATE, item.MINZAK);
                    //console.log(tmp_count, state.value)
                    //var item = $$('price_tbl').getSelectedItem();
                    //item.SP_COUNT = tmp_count;
                    item.SP_SUMMA = item.SP_COUNT*item.PRICE;
                    item.SP_PRICE = item.PRICE;
                    $$('orders_body_archive_db').config.app_rec(item);
                    $$('archive_order_body_tbl').refresh();
                    item = $$('archive_order_body_tbl').find(function(el){
                        return el.ACODE == item.ACODE && el.SCODE == item.SCODE;
                    });
                    console.log(item)
                    $$('archive_order_body_tbl').select(item[0].id);
                        
                    
                }else{
                    if (item.PRICE>item.SP_PRICE) {
                        item.SP_PRICE = item.PRICE;
                        $$('orders_body_archive_db').config.app_rec(item);
                        $$('archive_order_body_tbl').refresh();
                        item = $$('archive_order_body_tbl').find(function(el){
                            return el.ACODE == item.ACODE && el.SCODE == item.SCODE;
                        });
                        $$('archive_order_body_tbl').select(item[0].id);
                    }
                }
                
                
            },
            onAfterSelect: function(id){
                store.setCursor(id);
            },
            onAfterRender: function () {
                if ($$('archive_orders_head').getItem($$('orders_head_arch').getCursor()).state*1 === 26) {
                    this.config.editable = false
                } else {
                    this.config.editable = true
                }
            }
        }
    };
    //$$('price_db').add({ "ACODE": "", "DT": "", "ID_SPR": "", "LIFE": "", "MAXPACK": "", "MINZAK": "", "NDS": "", "PRICE": "", "RATE": "", "REESTR": "", "REST": "", "SCODE": "", "SP_COUNT": "", "SP_DATE": "", "SP_PRICE": "", "SP_SUMMA": "", "STITLE": "", "TITLE": "", "VENDOR": "", "VV1SP_TITLE": "", "VV2VENDOR": "", "VV3MNN": "" })   
    return ui;
});
