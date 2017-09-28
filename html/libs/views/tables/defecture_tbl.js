//orders_tbl

define([
    "app", "models/defecture_db", "views/price/reorder_pnl",
], function (app, store, reorder_pnl) {

    var ui = {
        view: "datatable",
        id: 'defecture_tbl',
        scrollX: false,
        select: 'row',
        hover: 'hover_table',
        //width: window.innerWidth > 1170 ? 1170: 980, 
        navigation: true,
        //editable:true,
        tooltip: true,
        //areaselect: false,
        //datafetch
        //rowHeight: 30,
        type: app.tbl_types,
        doubleEnter: 0,
        columns: [
            {
                id: "matrix_need", css: "col_text_center",
                header: { text: "Потребность", css: "col_text_center" },
                template: "<span style='color:{common.get_def_color()}'>#matrix_need#<span>",
                width: 100,
                editor: "text", sort: "int"
            },
            {
                id: "title",
                header: "Товар",
                template: "<span style='color:{common.get_def_color()}'>#title#<span>",
                fillspace: 2,
                sort: "string"
            },
            {
                id: "vendor", header: "Производитель",
                template: "<span style='color:{common.get_def_color()}'>#vendor#<span>",
                width: 160,
                sort: "string",
                fillspace: 1,
            },
            {
                id: "count", css: "col_text_center",
                template: "<span style='color:{common.get_def_color()}'>{common.check_0_count()}<span>",
                header: { text: "Заказано", css: "col_text_center" },
                width: 100,

                editor: "text", sort: "int"
            },
            {
                id: "stitle", css: "col_text_center",
                template: "<span style='color:{common.get_def_color()}'>#stitle#<span>",
                header: { text: "Поставщик", css: "col_text_center" },
                width: 100,
                editor: "text", sort: "string"
            }
        ],

        data: store,
        on: {
            onItemDblClick: function (itm, ev, node) {
                var item = this.getItem(itm.row),
                    idm = item.matrix_id;
                if (item.count > 0) {
                    return
                }
                //console.log(item)
                //console.log(idm)
                var orders_error_db = $$('orders_error_db');
                this.filter(function (element) {
                    if (element.count === 0) {
                        $$("orders_error_db").add({
                            title: element.title,
                            new: element.matrix_need,
                            old: element.matrix_need,
                            scode: '',
                            src_str: element.title,
                            vendor: element.vendor,
                            stitle: '',
                            acode: '',
                            sp_count: element.matrix_need,
                            matrix_id: element.matrix_id,
                            matrix_need: element.matrix_need,
                            id_spr: element.id_spr
                        })
                    }
                    return true
                });

                $$('pvm_toolbar_row3').hide()
                //$$('pvm_toolbar_row1').show();
                $$('pvm_toolbar_row2').show();
                $$('vnd_panel_flx').show();

                app.resize_app()


                //$$("pvm_body").reconstruct()

                if ($$('reorder_pnl') === undefined) {
                    webix.ui(reorder_pnl).show();
                }

                console.log(orders_error_db.find(function (el) { return el.matrix_id === idm })[0])

                orders_error_db.setCursor(orders_error_db.find(function (el) { return el.matrix_id === idm })[0].id);
                // if (orders_error_db.getFirstId()!==orders_error_db.getCursor()) {
                //     orders_error_db.setCursor(orders_error_db.getFirstId());
                // } else {
                //     orders_error_db.callEvent('onAfterCursorChange', [orders_error_db.getFirstId()])
                // }                


            },

        },


    };

    return ui;
});
