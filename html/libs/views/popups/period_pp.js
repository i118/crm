define([
    "app"
],function(app){
    var popup = webix.ui({
        view: "popup",
        id: "period_pp",
        scroll: false,
        body:{
            rows:[
                {
                    id: 'period_pp_tbl',
                    view:"list",
                    height: 150,
                    width: 150,
                    scroll: false,
                    type:{
                        template: function(obj){
                            return "<div class='olpp_div'><p>"+obj.name+"</p></span></div>";
                        }
                    },
                    data: [
                        {id: 1, name: "Сегодня"},
                        {id: 7, name: "Неделя"},
                        {id: 30, name: "Месяц"},
                        {id: 91, name: "Квартал"},
                        {id: 363, name: "Год"}
                    ], 
                    on: {
                        onItemClick: function(id){
                            var item = this.getItem(id);
                            this.select(id); 
                            $$('avnd_list_bnt3').setValue(item.name);
                            $$('avnd_list_bnt3').refresh();
                            $$('orders_head_arch').load();
                            $$('period_pp').hide();
                        }
                        
                    }
                }
            ]
        },
        on: {
            onShow: function(){ 
                if ($$('period_pp_tbl').getSelectedId() === "") {
                    $$('period_pp_tbl').select(1); 
                }
            }
        }
    });
    return {
        $ui: popup
    };
    
});