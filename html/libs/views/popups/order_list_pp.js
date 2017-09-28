define([
    "app"
], function (app) {
    var popup = webix.ui({
        view: "popup",
        id: "order_list_pp",
        body: {
            rows: [
                {
                    id: 'order_list_pp_tbl',
                    view: "list",
                    height: 350,
                    width: 450,
                    type: {
                        height: 55,
                        template: function (obj) {
                            //{id: 10, sklad: "БиоЛайф ООО", inn: "000000000000_dem1", summ_ob: 0, summ_ind: 0}
                            var id_db = $$("adres_db").getItem($$("adres_db").getCursor()).id,
                                sel_class = (obj.id === id_db) ? "text_info" : "",
                                ss = obj.summ_ob + obj.summ_ind;

                            return "<div class='olpp_div " + sel_class + "'><p>" + obj.sklad +
                                "</p><p>" +"<span class='olpp_nm'>"+app.moneyView(ss)+"</span>&nbsp;&nbsp;(<span style='color:orange'>"+
                                app.moneyView(obj.summ_ob)+"</span> / <span style='color:#098d99'>"+ 
                                app.moneyView(obj.summ_ind) +"<span>)</p></div>";
                        }
                    },
                    data: "",
                    on: {
                        onItemClick: function (id) {
                            $$("adres_db").setCursor(id);
                            // очищаем price
                            $$('main_search').setValue('');
                            $$('main_search').config.old_search = '';
                        }
                    }
                }
            ]
        }
    });
    $$('order_list_pp_tbl').data.sync($$('adres_db'));
    return {
        $ui: popup
    };

});