/*
    App configuration
*/





var cre_popup = function (id) {
    webix.ui({
        view: "context",
        body:
        {
            view: "toolbar", cols: [
                { view: "button", value: "Button1", width: 100 },
                { view: "button", value: "Button2", width: 100 }
            ]
        },
        width: 300,
        master: id
    });
}

define([
    "libs/webix-mvc-core/core",
    "libs/webix-mvc-core/plugins/menu",
], function (
    core, menu
) {
        var ver = "0.0.10";
        //configuration
        var app = core.create({
            id: "plexper",
            name: "Прайс-Лист Эксперт: " + ver,
            version: ver,
            debug: true,
            start: "/price"
        });

        app.use(menu);
        app.client_options = {};

        app.server_url = 'scgi/';
        app.request = function (params, callback, sync) {
            var req,
                met = params.method;
            params = JSON.stringify(params);
            if (sync === true) {
                req = webix.ajax().sync().headers({
                    "Content-type": "application/json"
                }).post(app.server_url, params, callback);
            } else {
                req = webix.ajax().headers({
                    "Content-type": "application/json"
                }).post(app.server_url, params, callback);
            }
        };
        app.check_response = function (respons) {
            var result = true;
            if (respons.error !== undefined) {
                webix.message({ type: "error", text: respons.error[1] });
                result = false;
            }
            return result;
        };

        app.getCookie = function (name) {
            var matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        };

        app.setCookie = function (name, value, options) {
            options = options || {};

            var expires = options.expires;

            if (typeof expires == "number" && expires) {
                var d = new Date();
                d.setTime(d.getTime() + expires * 1000);
                expires = options.expires = d;
            }
            if (expires && expires.toUTCString) {
                options.expires = expires.toUTCString();
            }

            value = encodeURIComponent(value);

            var updatedCookie = name + "=" + value;

            for (var propName in options) {
                updatedCookie += "; " + propName;
                var propValue = options[propName];
                if (propValue !== true) {
                    updatedCookie += "=" + propValue;
                }
            }

            document.cookie = updatedCookie;
        };

        app.deleteCookie = function (name) {
            app.setCookie(name, "", {
                expires: -1
            });
        };

        app.user_info = {};

        var req = {
            method: 'user.server_user_info_env',
            params: [app.getCookie('manuscriptsid')]
        };

        app.user_info = {};

        app.request(req, function (text) {
            var respons = JSON.parse(text);
            if (app.check_response(respons)) {
                app.user_info = respons.result[0];

            }
        }, true);

        app.admin_flag = 1;

        if (app.user_info.role == 6) {
            app.admin_flag = 1;
        }

        app.user_opt_tmo = undefined;
        app.setUserInfoOptions = function (new_obj) {
            if (app.user_opt_tmo !== undefined) {
                clearTimeout(app.user_opt_tmo)
            }
            app.user_opt_tmo = setTimeout(function () {
                app.user_info = new_obj;
                var req = {
                    method: 'user.set_option',
                    params: [app.user_info.options, app.user_info.id]
                    //params: [ JSON.stringify(app.user_info.options) ]
                };

                app.request(req, function (text) {
                    var respons = JSON.parse(text);
                    if (app.check_response(respons)) {
                        console.log(respons.result[0]);
                    }
                }, false);
            }, 200)


        };

        app.get_order_summ = function (n_order) {

            var req = {
                method: 'get_order_summ',
                params: [n_order]
            },
                summ = 0;

            app.request(req, function (text) {
                var respons = JSON.parse(text);
                if (app.check_response(respons)) {
                    summ = respons.result[0]
                }
            }, true);

            return summ
        };

        app.get_select_mode_title = function () {
            var mode = app.user_info.options.select_mode;

            if (mode * 1 === 1) {
                return 'Поставщик: Все.';
            } else if (mode * 1 === 2) {
                return 'Поставщик: Избр.';
            } else {
                var obj = app.user_info.options.select_vnd[3],
                    obj_k = Object.keys(obj);
                return obj[obj_k[0]];
            }
        }

        webix.i18n.setLocale("ru-RU");

        webix.protoUI({
            name: "activeTable"
        }, webix.ui.datatable, webix.ActiveContent);

        webix.DataStore.prototype.sorting.as.mysort = function (a, b) {
            //console.log(a,b)
            return a > b ? 1 : -1
        }

        app.moneyView = function (k, e, i) {
            var g = (typeof (e) != "undefined") ? e : 2;
            var h = (typeof (i) != "undefined") ? i : "&nbsp;";
            if (k === "") {
                return ""
            }
            var c = parseFloat(k);
            var d = Math.pow(10, g);
            c = Math.round(c * d) / d;
            var f = Number(c).toFixed(g).toString().split(".");
            var j = f[0].replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, "$1" + h);
            c = j + "," + f[1];
            return c
        }

        app.kolvoView = function (k, e, i) {
            //console.log('kolvoView', Math.round(k), k)
            if (Math.round(k) === k) {
                return k
            }
            var g = (typeof (e) != "undefined") ? e : 3;
            var h = (typeof (i) != "undefined") ? i : "&nbsp;";
            if (k === "") {
                return ""
            }
            var c = parseFloat(k);
            var d = Math.pow(10, g);
            c = Math.round(c * d) / d;
            var f = Number(c).toFixed(g).toString().split(".");
            var j = f[0].replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, "$1" + h);
            c = j + "," + f[1];
            return c
        }

        app.isCharCode = function (code) {
            if (code >= 65 && code <= 90 || code >= 186 && code <= 192 || code >= 219 && code <= 222) {
                return true;
            }
        };

        app.isNumberCode = function (code) {
            if (code >= 48 && code <= 57) {
                return true;
            }
        };

        app.setCount = function (count, rate, minzak) {
            var e = false;
            var t = count * 1;
            var l = rate * 1;
            var i = minzak * 1;

            //console.log(count,rate,minzak)
            if (i > 0 && t) {
                if (t < i) {
                    t = i;
                    e = true;
                }
            }
            if (l > 0 && t) {
                var n = t % l;
                if (n && (n < l / 2) && ((t - n) > 0)) {
                    t = t - n;
                    if (t - n) {
                        e = true;
                    }
                } else {
                    if (n && ((n >= l / 2) || ((t - n) <= 0))) {
                        t = t - n + l;
                        e = true
                    }
                }
            }
            return t * 1
        }

        app.setComment = function (comment, adres_id, order_id) {
            var req = {
                method: 'orders.set_order_comment',
                params: [comment, adres_id, app.user_info.id, order_id]
            };

            app.request(req, function (text) {
                var respons = JSON.parse(text);
                if (app.check_response(respons)) {

                }
            }, true);
        }

        app.month_str = {
            1: ["января", "январь"],
            2: ["февраля", "февраль"],
            3: ["марта", "март"],
            4: ["апреля", "апрель"],
            5: ["мая", "май"],
            6: ["июня", "июнь"],
            7: ["июля", "июль"],
            8: ["авнуста", "август"],
            9: ["сентября", "сентябрь"],
            10: ["октября", "октябрь"],
            11: ["ноября", "ноябрь"],
            12: ["декабря", "декабрь"]
        };

        app.id_spr_color = {}

        app.check_color = function (color) {
            var result = false;
            app.id_spr_color
            for (var i in app.id_spr_color) {
                if (app.id_spr_color[i] === color) {
                    result = true
                }
            }
            return result
        }

        app.tbl_types = {
            get_def_color: function(obj){
                return obj.count !== 0? '#1ecd97': ''
            },
            check_0_count: function(obj){
                return obj.count !== 0? obj.count: ''
            },
            get_edit_dt: function(obj){
                var tmp = obj.DT_EDIT.split(' ');
                tmp[0] = tmp[0].split('-').reverse().join('.')
                tmp[1] = tmp[1].split('.')[0]
                return tmp.join(' ')
            },
            vnd_name: function (obj) {
                return obj.name !== null && obj.name !== 'null' ? obj.name : obj.fname
            },
            color_bg: function (obj, type) {

                if (obj.ID_SPR < 0) {
                    return app.convertHextoRGBA(((Math.random() * 0x1000000) | 0).toString(16), 1)
                }

                var color = app.convertHextoRGBA(((Math.random() * 0x1000000) | 0).toString(16), 50);

                if (app.id_spr_color[obj.ID_SPR] === undefined) {
                    while (app.check_color(color) === true) {
                        color = app.convertHextoRGBA(((Math.random() * 0x1000000) | 0).toString(16), 50);
                        //console.log(color)
                    }
                    app.id_spr_color[obj.ID_SPR] = color;
                } else {
                    color = app.id_spr_color[obj.ID_SPR];
                }

                return app.convertHextoRGBA(((Math.random() * 0x1000000) | 0).toString(16), 1)//color
            },
            price_color: function (obj, type) {
                var color = "";

                if (obj.REESTR > 0) {
                    color = "green";
                }
                if ((obj.PRICE > obj.SP_PRICE && obj.SP_PRICE > 0)) {
                    color = "red";
                }

                if (obj.SP_COUNT === 'x') {
                    color = '#03a9f4'
                }

                return color
            },
            price_color1: function (obj, type) {
                var color = "";

                if (obj.REESTR > 0) {
                    color = "green";
                }
                if ((obj.PRICE < obj.SP_PRICE)) {
                    color = "red";
                }

                return color
            },
            price_value: function (obj, type) {
                return app.moneyView(obj.PRICE);
            },
            life_render: function (obj, type) {
                //console.log(obj)
                //console.log(obj.LIFE)
                if (obj.LIFE === null) {
                    return
                }
                var oldval = obj.LIFE.replace(/(\d+)-(\d+)-(\d+)/, "$2/$3/$1"),
                    month_names = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл',
                        'авг', 'сен', 'окт', 'ноя', 'дек'],
                    r = new Date(oldval),
                    i = new Date(),
                    r1 = r,
                    y = '',
                    F = '';

                if (obj.LIFE > "") {

                    var godn = 356;//$b('#godn')[0].value*1;
                    i = i.setDate(i.getDate() + godn);
                    r1 = r1.setDate(r.getDate());

                    y = (r1 < i) ? " text_danger" : '';

                    oldval = oldval.split('/');
                    try{
                        F = '<span class="pull-right ' + y + '">' +
                            month_names[(oldval[0] * 1) - 1] + " " + oldval[2].substr(2, 2) + "</span> ";
                    }catch(err){}
                    
                }
                return F;
            },
            title_render: function (obj) {
                //console.log(app.user_info.options.options.check_seller_name)
                var val = $$('check_seller_name').getValue(),
                    s = new RegExp("(" + $$('main_search').getValue().replace('_','').split("+")[0].split(" ").filter(
                        function (O, N) {
                            return O !== "";
                        }).join("|") + ")", "gi"),
                    mnn = $$('check_mnn').getValue() === 1 ? ' <span class="mnn_title">' + obj.SP_MNN.replace(s, "<span class='rsearch'>$1</span>") + '</span>' : '',
                    title = val === 0 ? obj.TITLE.replace(s, "<span class='rsearch'>$1</span>") + mnn : obj.SP_TITLE.replace(s, "<span class='rsearch'>$1</span>") + mnn;

                if (obj.SP_COUNT === 'x') {
                    title = '<div style="font-style: italic;color: rgba(84, 84, 84, 0.8); text-transform: lowercase;">' + title + '</div>'
                }

                return title;
            },
            title_render_arh: function (obj) {
                var val = app.user_info.options.options.check_seller_name,
                    check_mnn = app.user_info.options.options.check_mnn,
                    mnn = check_mnn === 1 ? ' <span class="mnn_title">' + obj.SP_MNN + '</span>' : '',
                    title = val === 1 ? obj.TITLE + mnn : obj.SP_TITLE + mnn;

                return title;
            },
            vendor_render_arh: function (obj) {
                var val = app.user_info.options.options.check_seller_name,
                    vendor = val === 1 ? obj.VENDOR : obj.SP_VENDOR;

                return vendor;
            },
            vendor_render: function (obj) {
                var sval = $$('main_search').getValue().split("+"),
                    val = $$('check_seller_name').getValue(),
                    vendor = val === 1 ? obj.VENDOR : obj.SP_VENDOR

                if (sval.length < 2) {
                    return vendor
                }
                sval = sval[1];
                var s = new RegExp("(" + sval.split(" ").filter(
                    function (O, N) {
                        return O !== "";
                    }).join("|") + ")", "gi");

                vendor = vendor.replace(s, "<span class='rsearch'>$1</span>");

                if (obj.SP_COUNT === 'x') {
                    vendor = '<div style="font-style: italic;color: rgba(84, 84, 84, 0.8); text-transform: lowercase;">' + vendor + '</div>'
                }

                return vendor;
            },
            vnd_color: function (obj) {
                var raznicaD = Math.ceil((new Date() - new Date(obj.DT)) / (1000 * 60 * 60 * 24)) - 1,
                    result;

                if (raznicaD === 0) {
                    result = 'text_success';
                }
                if (raznicaD > 2) {
                    result = 'text_silver';
                }

                return result;
            },
            vnd_txt: function (obj) {
                vendor = '';
                if (obj.SP_COUNT === 'x') {
                    vendor = 'font-style: italic;color: rgba(84, 84, 84, 0.8); text-transform: lowercase;'
                }
                return vendor
            },
            rest_render: function (obj) {
                if (obj.REST === 0) {
                    return ('нет');
                }
                if (obj.REST >= 10000) {
                    return ('много');
                }
                display_text = Math.round(obj.REST);
                if (obj.SP_COUNT === 'x') {
                    display_text = ''
                }
                return display_text
            },
            sp_count_render: function (obj) {
                //return obj.SP_COUNT !== 0 ? obj.SP_COUNT: '';

                var res = '',
                    count = obj.SP_COUNT === 0 ? '' : obj.SP_COUNT,
                    cls = '';//font_x_large';
                if (obj.OLD_ZAK > 0) {
                    if (count > 0) {
                        cls = '';
                    }
                    res = "&nbsp;<span class='old_zak_ico webix_icon fa-lightbulb-o " + cls + "' id='prc_" + obj.id + "'></span>";
                }

                display_text = '<span style="font-weight: 900;">' + count + '</span>' + res;


                if (obj.SP_COUNT === 'x') {
                    display_text = '<div color: rgba(84, 84, 84, 0.8); text-transform: lowercase;">' + obj.SP_COUNT + '</div>'
                }

                if (obj.STITLE.indexOf("'") === 0) {
                    obj.SP_COUNT = '.'
                }

                return display_text
            },
            rate_render: function (obj) {
                var display_text = (obj.RATE > 1) ? '<span class="text_danger">/' +
                    obj.RATE + '</span>' :
                    (obj.MINZAK > 1) ? '<span class="text_danger">/' +
                        obj.MINZAK + '</span>' : "/" + obj.MINZAK;

                if (obj.SP_COUNT === 'x') {
                    display_text = '<div style="font-style: italic;color: rgba(84, 84, 84, 0.8); text-transform: lowercase;font-size: smaller;">' + obj.MINZAK + '</div>'
                }

                return display_text;
            },
            sp_summa_render: function (obj) {
                return obj.SP_SUMMA !== 0 ? app.moneyView(obj.SP_SUMMA) : "";
            },
            sp_summa_render_osp: function (obj) {
                return obj.summ !== 0 ? app.moneyView(obj.summ) : "";
            },
            reestr_render: function (obj) {
                display_text = obj.REESTR + '' !== '0' ? app.moneyView(obj.REESTR) : "";
                if (obj.SP_COUNT === 'x') {
                    display_text = '<div style="font-style: italic;color: rgba(84, 84, 84, 0.8); text-transform: lowercase;">' + display_text + '</div>'
                }
                return display_text
            },
            count_render: function (obj) {
                // будующая функция обработки количества в других заказах
                var tmp_s = obj.SP_COUNT;

                if (tmp_s.indexOf('old') !== -1) {
                    sp_count.addClass('color_lblue');
                    tmp_s = tmp_s.replace('old', '').split('_');
                    var sum_w = tmp_s[1] * 1 + tmp_s[2] * 1;
                    _r_ = sum_w > 0 ? sp_count.html(tmp_s[0] + ' / ' + sum_w) : sp_count.html(tmp_s[0]);
                    sp_count.attr('title', 'в наборе: ' + tmp_s[1] + ' в архиве: ' + tmp_s[2] + ' отправлено: ' + tmp_s[3]);
                } else {
                    sp_count.removeClass('color_silver');
                }
            },
            old_zak_ico: function (obj) {
                return "<span class='old_zak_ico webix_icon fa-lightbulb-o' id='prc_" + obj.id + "'></span>";
            },
            oz_title_render: function (obj) {
                var val = $$('check_seller_name').getValue(),
                    s = new RegExp("(" + "".split(" ").filter(
                        function (O, N) {
                            return O !== "";
                        }).join("|") + ")", "gi"),
                    mnn = $$('check_mnn').getValue() === 1 ? ' <span class="mnn_title">' + obj.sp_mnn.replace(s, "<span class='rsearch'>$1</span>") + '</span>' : '',
                    title = val === 1 ? obj.title.replace(s, "<span class='rsearch'>$1</span>") + mnn : obj.sp_title.replace(s, "<span class='rsearch'>$1</span>") + mnn;

                return title;
            },
            oz_vendor_render: function (obj) {
                var val = $$('check_seller_name').getValue(),
                    s = new RegExp("(" + "".split(" ").filter(
                        function (O, N) {
                            return O !== "";
                        }).join("|") + ")", "gi"),
                    vendor = val === 1 ? obj.vendor : obj.sp_vendor;

                if ($$('check_vnd').getValue() === 1) {
                    vendor = vendor.replace(s, "<span class='rsearch'>$1</span>");
                }

                return vendor;
            },
            state_render: function (obj) {
                var state = 'не знаю';
                switch (obj.state * 1) {
                    case 1:
                        state = "<span style='color:#3498db'>сводный</span>"
                        break;
                    case 2:
                        state = "<span style='color:#ffa21a'>архив</span>"
                        break;
                    case 26:
                        state = "<span style='color:silver'>отправлен</span>"
                        //	НАТРИЯ ХЛОРИД 0,9% Р-Р Д/ИНФУЗИЙ 250МЛ КОНТ.ПОЛИМЕР
                        break;
                    default:
                        break;
                }
                return state
            }
        }

        app.ms_box = function (body, btm_title, callback, expire) {
            var id = "btn_" + webix.uid(),
                str_msg = [];

            expire = expire || 10000;

            str_msg[0] = "<div class='msg'>" + body + "</div>";

            if (btm_title !== undefined && btm_title !== '') {
                str_msg[1] = '<div id="' + id +
                    '" class="msg_f webix_view webix_control webix_el_button button_warning button_raised"><button type="button" >' +
                    btm_title + '</button></div>';
            }

            webix.message({
                type: "warning",
                id: 'test',
                text: str_msg.join(''),
                expire: expire
            })

            try {
                document.querySelector('#' + id).onclick = callback;
            } catch (er) { }

            var mv = document.querySelector('.webix_message_area');
            mv.style.left = (window.innerWidth / 2 - mv.offsetWidth) + 'px'
        }

        app.convertHextoRGBA = function (hex, opacity) {
            hex = hex.replace('#', '');
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);

            result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
            return result;
            //convertHextoRGBA(((Math.random() * 0x1000000) | 0).toString(16),50);
        }

        app.bind_tooltip = function (el_btn, template, height) {
            var id = 'btn_tooltip' + webix.uid()
            height = height || 100;
            webix.event(el_btn, 'mouseout', function (e) {
                webix.delay(function () {
                    clearTimeout(el_btn.timeOutMM);
                    if ($$(id) !== undefined) {
                        $$(id).destructor();
                    }
                }, {}, [], 250);
            })

            webix.event(el_btn, webix.env.mouse.move, function (e) {
                this.timeOutMM = setTimeout(function () {
                    if ($$(id) === undefined) {
                        webix.ui({
                            view: "tooltip",
                            id: id,
                            template: template,
                            height: height
                        }).show({}, { x: e.x, y: e.y });
                    }
                }, 250);
            });
        }

        app.custom_checkbox = function(obj, common, value){
            if (value > 0)
                return "<div class='webix_table_checkbox checked' style='color: orange' title='Отправить в общие'> <i class='fa fa-check-circle-o' aria-hidden='true'></i> </div>";
            else
                return "<div class='webix_table_checkbox notchecked'  title='Отправить в индивидуфльные'> <i class='fa fa-circle-thin' aria-hidden='true'></i> </div>";
        }

        app.custom_checkbox1 = function(obj, common, value){
            if (value > 0)
                return "<div  style='color: orange'> <i class='fa fa-check-circle-o' aria-hidden='true'></i> </div>";
            else
                return "<div > <i class='fa fa-circle-thin' aria-hidden='true'></i> </div>";
        }


        app.resize_app = function(){
            var hv = window.innerHeight - $$('vnd_panel_flx').getNode().offsetHeight - $$('pvm_header').getNode().offsetHeight -
            $$('pvm_toolbar').getNode().offsetHeight - $$('pvm_footer').getNode().offsetHeight;

            //console.log(hv)
            $$('tp_test').config.height = hv - 20;
            $$('tp_test').resize();

            var ttt = $$('pvm_footer').getNode();
            ttt.style.position = 'absolute';
            $$('pvm_footer').hide();
            $$('pvm_footer').show()
        }

        return app;
    });