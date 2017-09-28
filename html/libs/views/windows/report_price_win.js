define([
    "app"
], function (app) {

    var ui = {
        view: "window",
        id: "report_price_win",
        //head:"<span class='title_print'>My Window</span>",
        headHeight: 0,
        fullscreen: true,
        body: {
            rows: [
                {
                    css: 'no_print',
                    autoheight: true,
                    cols: [
                        {},
                        {
                            view: "segmented",
                            id: "report_win_segmented",
                            width: 430,
                            value: 2,
                            options: [
                                { id: "2", value: "Краткий" },
                                { id: "3", value: "Полный" }
                            ],
                            on: {
                                "onItemClick": function (id, e) {
                                    var value = this.getValue();
                                    if (value * 1 > 1) {
                                        $$('reset_flt').hide();
                                        $$("free_space").config.width = 300;
                                        $$("free_space").resize();
                                    } else {

                                        $$('reset_flt').show();
                                        $$("free_space").config.width = 100;
                                        $$("free_space").resize();

                                    }
                                    var tname = $$('report_price_win').cur_id === undefined ? 'orders_body_db' : 'trash_db';
                                    $$(tname).get_report(value);
                                }
                            }
                        },
                        { width: 100, id: "free_space" },
                        {
                            view: "button",
                            value: "Сбросить фильтр",
                            id: "reset_flt",
                            width: 200,
                            css: "button_warning",
                            click: function () {
                                //$$('main_search_ord').setValue('');
                                var tname = $$('report_price_win').cur_id === undefined ? 'orders_body_db' : 'trash_db';
                                console.log(tname)
                                $$(tname).get_report(1);
                                this.hide();
                                $$("free_space").config.width = 300;
                                $$("free_space").resize();
                            }
                        },
                        {
                            view: "button",
                            value: "Печатать",
                            id: "print_btn",
                            width: 150,
                            css: "button_success",
                            click: function () {
                                text = document.querySelector('.report').innerHTML;
                                printwin = open('', 'printwin', 'width=1024,height=780');
                                printwin.document.open();
                                printwin.document.writeln('<html><head><title></title>' +
                                    '<link rel="stylesheet" type="text/css" href="assets/print.css" media="print" />' +
                                    '<link rel="stylesheet" type="text/css" href="assets/print.css"  />' +
                                    '</head><body onload=print();close();>');
                                printwin.document.writeln('<div class="report">' + text + '</div>');
                                printwin.document.writeln('</body></html>');
                                printwin.document.close();
                            }
                        },
                        {
                            view: "button",
                            value: "Закрыть",
                            width: 150,
                            css: "button_info",
                            click: function () {
                                $$('report_price_win').close();
                            }
                        },
                        {}
                    ]

                },
                {
                    id: "report_table",
                    padding: 10,
                    template: ""
                }
            ]

        },
        on: {
            onShow: function () {

                var tname = this.cur_id === undefined ? 'orders_body_db' : 'trash_db';

                $$(tname).get_report(2);
                //if ($$('main_search_ord').getValue() === '') {
                $$('reset_flt').hide();
                $$("free_space").config.width = 300;
                $$("free_space").resize();


                //var item = $$('adres_db').getItem($$('adres_db').getCursor());

                //webix.UIManager.setFocus('report_win');
                document.querySelector('[view_id=report_price_win]').focus();
                document.querySelector('[view_id=report_price_win]').onkeydown = function (e) {
                    if (e.keyCode === 80 && e.ctrlKey) {
                        $$('print_btn').config.click();
                        return false;
                    }
                };
            }
        }
    };

    return ui;
});