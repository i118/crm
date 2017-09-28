define([
    "app"
], function (app) {


    var ui = {
        view: "window",
        id: "cr_confirm_win",
        head: "<span style='color: orange'>Внимание !!!</span>",
        position: "center",
        modal: true,
        body: {
            width: 400,
            height: 200,
            padding: 10,
            rows: [
                { height: 10 },
                {
                    view: 'label',
                    label: "Вы выбрали групповое действие, <br>но у Вас имеються выбранные вручную значения, <br>что с ними делать?",
                },
                {},
                {

                    cols: [
                        {
                            view: "button",
                            value: "Игонорировать",
                            on: {
                                onAfterRender: function () {
                                    var el_btn = this.getNode().querySelector('button');
                                    app.bind_tooltip(
                                        el_btn,
                                        "<span class='text_warning'>Выбранные значения будут <strong>ПРОИГНОРИРОВАНЫ</strong></span><br> ко всем записям будет применено групповое действие"
                                    )
                                }
                            },
                            click: function () {
                                var cross = $$('cross_win_tb').config.cross_rec;
                                $$('cross_records_db').find(function (el) {
                                    cross[el.id] = [el.min_c, el.old_id, el.price]
                                });
                                $$('cross_yes_btn').config.click();
                                $$('cr_confirm_win').close();
                            }
                        },
                        { view: 'spacer', width: 10 },
                        {
                            view: "button",
                            value: "Применить",
                            css: "button_warning",
                            on: {
                                onAfterRender: function () {
                                    var el_btn = this.getNode().querySelector('button');
                                    app.bind_tooltip(
                                        el_btn,
                                        "<span class='text_warning'>Выбранные значения будут <strong>ПРИМЕНЕНЫ</strong></span><br> ко всем не назначенным записям будет применено групповое действие"
                                    )
                                }
                            },
                            click: function () {
                                var cross = $$('cross_win_tb').config.cross_rec;
                                console.log(cross)
                                $$('cross_records_db').find(function (el) {
                                    if (cross[el.id]===undefined){
                                        cross[el.id] = [el.min_c, el.old_id, el.price]
                                    }                                    
                                });
                                $$('cross_yes_btn').config.click();
                                $$('cr_confirm_win').close();
                            }
                        }
                    ]
                }
            ]
        }
    };

    return ui;
});
