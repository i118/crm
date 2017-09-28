define([
    "app", "models/orders_head_db", 
    "views/windows/orders_head_win",
    "models/adres_db", "views/windows/adres_win", "views/windows/login_win", "views/windows/order_errors_win",
    "views/price_main_view"
    ],function(app, orders_head_db, 
        orders_head_win, 
        adres_db, adres_win, login_win, order_errors_win, price_main_view){
    
    var main_layout = {
        //gravity: 1,
        app: app,
        id: 'mmp',
        cols: [{
            width: window.innerWidth,
            id: "main_layout",
            rows: []
        }]
    };
    
    return {
        $ui: main_layout,
        $windows:[
            orders_head_win, 
            adres_win, login_win, order_errors_win
        ],
        $oninit:function(view,$scope){
            
            try{            
                
                if (app.user_info.id !== undefined) {
                    
                    // загружаем вспомогательные таблицы
                    adres_db.load();
                    //console.log(adres_db.count())
                    // загружаем заказы
                    //orders_head_db.load();
                    
                    $$('adres_win').show();
                    // тут позагрузка с ордера из куки
                    // var cur_order = app.getCookie('lp_cur_ord');
                    // if (cur_order !== undefined) {
                    //     $$('main_layout').addView(price_main_view);
                    //     orders_head_db.setCursor(cur_order);
                    //     app.deleteCookie('lp_cur_ord');
                    // } else {
                    //     // если заказы есть показываем октно с выбором заказа
                    //     if ($$('orders_head_db').count() > 0) {
                    //         $$('orders_head_win').show();
                    //     } else {
                    //     // если нет показываем октно с выбором адресса
                    //         $$('adres_win').show();
                    //     }
                    // }
                    
                    window.onresize = function(){                        
                        setTimeout(function(){                            
                            if ($$("orders_tbl") !== undefined) {
                                $$("orders_tbl").adjust()
                            }
                            if ($$("price_tbl") !== undefined) {
                                $$("price_tbl").adjust()
                            }
                        }, 100);
                    }
                    
                    Object.keys(app.user_info.options.options).forEach(function(el){
                        if ($$(el) !== undefined) {
                            $$(el).setValue(app.user_info.options.options[el])
                        }
                    })

                    
                } else {
                    webix.alert('Ошибка авторизации')
                }
                

                
            }catch(er) {}
        }
    };
});
