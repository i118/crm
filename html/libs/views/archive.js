define([
    "app", "views/windows/login_win", "models/adres_db", "models/avnd_list_db", "models/users_list_db", "views/archive_main_view"
    ],function(app, login_win, adres_db, avnd_list_db, users_list_db, archive_main_view){
    
    var main_layout = {                       
        id: 'mma',
        cols: [{
            width: window.innerWidth,
            id: "arc_main_layout",
            rows: []
        }]
        
    };
    
    return {
        $ui: main_layout,
        $windows:[
            login_win
        ],
        $oninit:function(view,$scope){            
            
            if (app.user_info.id !== undefined) {
                // загружаем вспомогательные таблицы
                adres_db.load();
                avnd_list_db.load();
                users_list_db.load();
                //console.log(adres_db.count())
                // загружаем заказы архива
                
                //orders_head_db.load();
                $$("orders_head_arch").load();
                $$("arc_main_layout").addView(archive_main_view);
                $$("archive_orders_head").config.refresh_oper_vis();
            } else {
                webix.alert('Ошибка авторизации')
            }
        }
    };
});
