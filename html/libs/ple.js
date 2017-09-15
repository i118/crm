var requirejs, require, define;
!function(e) {
    function t(e, t) {
        return m.call(e, t)
    }
    function r(e, t) {
        var r, o, i, n, s, a, d, c, l, _, u, p = t && t.split("/"), h = f.map, v = h && h["*"] || {};
        if (e && "." === e.charAt(0))
            if (t) {
                for (e = e.split("/"),
                s = e.length - 1,
                f.nodeIdCompat && $.test(e[s]) && (e[s] = e[s].replace($, "")),
                e = p.slice(0, p.length - 1).concat(e),
                l = 0; l < e.length; l += 1)
                    if (u = e[l],
                    "." === u)
                        e.splice(l, 1),
                        l -= 1;
                    else if (".." === u) {
                        if (1 === l && (".." === e[2] || ".." === e[0]))
                            break;
                        l > 0 && (e.splice(l - 1, 2),
                        l -= 2)
                    }
                e = e.join("/")
            } else
                0 === e.indexOf("./") && (e = e.substring(2));
        if ((p || v) && h) {
            for (r = e.split("/"),
            l = r.length; l > 0; l -= 1) {
                if (o = r.slice(0, l).join("/"),
                p)
                    for (_ = p.length; _ > 0; _ -= 1)
                        if (i = h[p.slice(0, _).join("/")],
                        i && (i = i[o])) {
                            n = i,
                            a = l;
                            break
                        }
                if (n)
                    break;
                !d && v && v[o] && (d = v[o],
                c = l)
            }
            !n && d && (n = d,
            a = c),
            n && (r.splice(0, a, n),
            e = r.join("/"))
        }
        return e
    }
    function o(t, r) {
        return function() {
            var o = b.call(arguments, 0);
            return "string" != typeof o[0] && 1 === o.length && o.push(null),
            l.apply(e, o.concat([t, r]))
        }
    }
    function i(e) {
        return function(t) {
            return r(t, e)
        }
    }
    function n(e) {
        return function(t) {
            p[e] = t
        }
    }
    function s(r) {
        if (t(h, r)) {
            var o = h[r];
            delete h[r],
            v[r] = !0,
            c.apply(e, o)
        }
        if (!t(p, r) && !t(v, r))
            throw new Error("No " + r);
        return p[r]
    }
    function a(e) {
        var t, r = e ? e.indexOf("!") : -1;
        return r > -1 && (t = e.substring(0, r),
        e = e.substring(r + 1, e.length)),
        [t, e]
    }
    function d(e) {
        return function() {
            return f && f.config && f.config[e] || {}
        }
    }
    var c, l, _, u, p = {}, h = {}, f = {}, v = {}, m = Object.prototype.hasOwnProperty, b = [].slice, $ = /\.js$/;
    _ = function(e, t) {
        var o, n = a(e), d = n[0];
        return e = n[1],
        d && (d = r(d, t),
        o = s(d)),
        d ? e = o && o.normalize ? o.normalize(e, i(t)) : r(e, t) : (e = r(e, t),
        n = a(e),
        d = n[0],
        e = n[1],
        d && (o = s(d))),
        {
            f: d ? d + "!" + e : e,
            n: e,
            pr: d,
            p: o
        }
    }
    ,
    u = {
        require: function(e) {
            return o(e)
        },
        exports: function(e) {
            var t = p[e];
            return "undefined" != typeof t ? t : p[e] = {}
        },
        module: function(e) {
            return {
                id: e,
                uri: "",
                exports: p[e],
                config: d(e)
            }
        }
    },
    c = function(r, i, a, d) {
        var c, l, f, m, b, $, g = [], w = typeof a;
        if (d = d || r,
        "undefined" === w || "function" === w) {
            for (i = !i.length && a.length ? ["require", "exports", "module"] : i,
            b = 0; b < i.length; b += 1)
                if (m = _(i[b], d),
                l = m.f,
                "require" === l)
                    g[b] = u.require(r);
                else if ("exports" === l)
                    g[b] = u.exports(r),
                    $ = !0;
                else if ("module" === l)
                    c = g[b] = u.module(r);
                else if (t(p, l) || t(h, l) || t(v, l))
                    g[b] = s(l);
                else {
                    if (!m.p)
                        throw new Error(r + " missing " + l);
                    m.p.load(m.n, o(d, !0), n(l), {}),
                    g[b] = p[l]
                }
            f = a ? a.apply(p[r], g) : void 0,
            r && (c && c.exports !== e && c.exports !== p[r] ? p[r] = c.exports : f === e && $ || (p[r] = f))
        } else
            r && (p[r] = a)
    }
    ,
    requirejs = require = l = function(t, r, o, i, n) {
        if ("string" == typeof t)
            return u[t] ? u[t](r) : s(_(t, r).f);
        if (!t.splice) {
            if (f = t,
            f.deps && l(f.deps, f.callback),
            !r)
                return;
            r.splice ? (t = r,
            r = o,
            o = null) : t = e
        }
        return r = r || function() {}
        ,
        "function" == typeof o && (o = i,
        i = n),
        i ? c(e, t, r, o) : setTimeout(function() {
            c(e, t, r, o)
        }, 4),
        l
    }
    ,
    l.config = function(e) {
        return l(e)
    }
    ,
    requirejs._defined = p,
    define = function(e, r, o) {
        if ("string" != typeof e)
            throw new Error("See almond README: incorrect module build, no module name");
        r.splice || (o = r,
        r = []),
        t(p, e) || t(h, e) || (h[e] = [e, r, o])
    }
    ,
    define.amd = {
        jQuery: !0
    }
}(),
define("libs/almond/almond.js", function() {}),
function(e) {
    var t = []
      , r = {}
      , o = "routie"
      , i = e[o]
      , n = function(e, t) {
        this.name = t,
        this.path = e,
        this.keys = [],
        this.fns = [],
        this.params = {},
        this.regex = s(this.path, this.keys, !1, !1)
    };
    n.prototype.addHandler = function(e) {
        this.fns.push(e)
    }
    ,
    n.prototype.removeHandler = function(e) {
        for (var t = 0, r = this.fns.length; t < r; t++) {
            var o = this.fns[t];
            if (e == o)
                return void this.fns.splice(t, 1)
        }
    }
    ,
    n.prototype.run = function(e) {
        for (var t = 0, r = this.fns.length; t < r; t++)
            this.fns[t].apply(this, e)
    }
    ,
    n.prototype.match = function(e, t) {
        var r = this.regex.exec(e);
        if (!r)
            return !1;
        for (var o = 1, i = r.length; o < i; ++o) {
            var n = this.keys[o - 1]
              , s = "string" == typeof r[o] ? decodeURIComponent(r[o]) : r[o];
            n && (this.params[n.name] = s),
            t.push(s)
        }
        return !0
    }
    ,
    n.prototype.toURL = function(e) {
        var t = this.path;
        for (var r in e)
            t = t.replace("/:" + r, "/" + e[r]);
        if (t = t.replace(/\/:.*\?/g, "/").replace(/\?/g, ""),
        t.indexOf(":") != -1)
            throw new Error("missing parameters for url: " + t);
        return t
    }
    ;
    var s = function(e, t, r, o) {
        return e instanceof RegExp ? e : (e instanceof Array && (e = "(" + e.join("|") + ")"),
        e = e.concat(o ? "" : "/?").replace(/\/\(/g, "(?:/").replace(/\+/g, "__plus__").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(e, r, o, i, n, s) {
            return t.push({
                name: i,
                optional: !!s
            }),
            r = r || "",
            "" + (s ? "" : r) + "(?:" + (s ? r : "") + (o || "") + (n || o && "([^/.]+?)" || "([^/]+?)") + ")" + (s || "")
        }).replace(/([\/.])/g, "\\$1").replace(/__plus__/g, "(.+)").replace(/\*/g, "(.*)"),
        new RegExp("^" + e + "$",r ? "" : "i"))
    }
      , a = function(e, o) {
        var i = e.split(" ")
          , s = 2 == i.length ? i[0] : null;
        e = 2 == i.length ? i[1] : i[0],
        r[e] || (r[e] = new n(e,s),
        t.push(r[e])),
        r[e].addHandler(o)
    }
      , d = function(e, t) {
        if ("function" == typeof t)
            a(e, t),
            d.reload();
        else if ("object" == typeof e) {
            for (var r in e)
                a(r, e[r]);
            d.reload()
        } else
            "undefined" == typeof t && d.navigate(e)
    };
    d.lookup = function(e, r) {
        for (var o = 0, i = t.length; o < i; o++) {
            var n = t[o];
            if (n.name == e)
                return n.toURL(r)
        }
    }
    ,
    d.remove = function(e, t) {
        var o = r[e];
        o && o.removeHandler(t)
    }
    ,
    d.removeAll = function() {
        r = {},
        t = []
    }
    ,
    d.navigate = function(e, t) {
        t = t || {};
        var r = t.silent || !1;
        r && p(),
        setTimeout(function() {
            window.location.hash = e,
            r && setTimeout(function() {
                u()
            }, 1)
        }, 1)
    }
    ,
    d.noConflict = function() {
        return e[o] = i,
        d
    }
    ;
    var c = function() {
        return window.location.hash.substring(1)
    }
      , l = function(e, t) {
        var r = [];
        return !!t.match(e, r) && (t.run(r),
        !0)
    }
      , _ = d.reload = function() {
        for (var e = c(), r = 0, o = t.length; r < o; r++) {
            var i = t[r];
            if (l(e, i))
                return
        }
    }
      , u = function() {
        e.addEventListener ? e.addEventListener("hashchange", _, !1) : e.attachEvent("onhashchange", _)
    }
      , p = function() {
        e.removeEventListener ? e.removeEventListener("hashchange", _) : e.detachEvent("onhashchange", _)
    };
    u(),
    e[o] = d
}(window),
define("libs/routie/lib/routie", function() {}),
define("libs/webix-mvc-core/core", ["libs/routie/lib/routie"], function() {
    function e(e, o) {
        if (o == -1)
            return a(this, e);
        if (this._subs[e])
            return a(this._subs[e], o);
        var i = t(this)
          , s = this.index;
        if ("string" == typeof e) {
            0 === e.indexOf("./") && (s++,
            e = e.substr(2));
            var d = n(e);
            i.path = i.path.slice(0, s).concat(d)
        } else
            webix.extend(i.path[s].params, e, !0);
        i.show(r(i.path), -1)
    }
    function t(e) {
        for (; e; ) {
            if (e.app)
                return e;
            e = e.parent
        }
        return g
    }
    function r(e) {
        for (var t = [], r = g.config.layout ? 1 : 0; r < e.length; r++) {
            t.push("/" + e[r].page);
            var i = o(e[r].params);
            i && t.push(":" + i)
        }
        return t.join("")
    }
    function o(e) {
        var t = [];
        for (var r in e)
            t.length && t.push(":"),
            t.push(r + "=" + e[r]);
        return t.join("")
    }
    function i(t, r, o) {
        if (c(b, t, r, o, this) !== !1) {
            if (r.page != this.name) {
                this.name = r.page,
                this.ui = h,
                this.on = l,
                this.show = e,
                this.module = t,
                u.call(this),
                this._init = [],
                this._destroy = [],
                this._windows = [],
                this._events = [],
                this._subs = {},
                this.$layout = !1;
                var n = s(t, null, this);
                n.$scope = this,
                f.call(this, n),
                this.$layout && (this.$layout = {
                    root: (this._ui.$$ || webix.$$)(this.name + ":subview"),
                    sub: i,
                    parent: this,
                    index: this.index + 1
                })
            }
            return c(m, t, r, o, this),
            t.$onurlchange && t.$onurlchange.call(t, r.params, o, this) === !1 ? void 0 : this.$layout
        }
    }
    function n(e) {
        var t = e.split("/");
        t[0] || (g.config.layout ? t[0] = g.config.layout : t.shift());
        for (var r = 0; r < t.length; r++) {
            var o = t[r]
              , i = []
              , n = o.indexOf(":");
            if (n !== -1) {
                var s = o.substr(n + 1).split(":")
                  , a = s[0].indexOf("=") !== -1;
                if (a) {
                    i = {};
                    for (var d = 0; d < s.length; d++) {
                        var c = s[d].split("=");
                        i[c[0]] = c[1]
                    }
                } else
                    i = s
            }
            t[r] = {
                page: n > -1 ? o.substr(0, n) : o,
                params: i
            }
        }
        return t
    }
    function s(e, t, r) {
        if (e.$oninit && r._init.push(e.$oninit),
        e.$ondestroy && r._destroy.push(e.$ondestroy),
        e.$onevent)
            for (var o in e.$onevent)
                r._events.push(o, e.$onevent[o]);
        if (e.$windows && r._windows.push.apply(r._windows, e.$windows),
        e.$subview)
            if ("string" == typeof e.$subview) {
                var n = r.name + ":subview:" + e.$subview;
                r._subs[e.$subview] = {
                    parent: this,
                    root: n,
                    sub: i,
                    index: 0,
                    app: !0
                };
                e.id = n
            } else
                e = {
                    id: r.name + ":subview"
                },
                r.$layout = !0;
        if (e.$ui && (e = e.$ui),
        e.$init)
            return e;
        t = t || (webix.isArray(e) ? [] : {});
        for (var a in e)
            e[a] && "object" == typeof e[a] && !webix.isDate(e[a]) ? t[a] = s(e[a], webix.isArray(e[a]) ? [] : {}, r) : t[a] = e[a];
        return t
    }
    function a(e, t) {
        e.root && (e.root = webix.$$(e.root));
        var r = n(t);
        e.path = [].concat(r),
        d(e, r)
    }
    function d(e, t) {
        var r = t[0];
        if (r) {
            var o = r.page
              , i = 0 === o.indexOf(".");
            if (i && (o = (e.fullname || "") + o),
            o = o.replace(/\./g, "/"),
            c($, o, r, t, e) === !1)
                return;
            var n = function(o) {
                "function" == typeof o && (o = o()),
                t.shift();
                var n = e.sub(o, r, t);
                n ? (n.fullname = (i ? e.fullname || "" : "") + r.page,
                d(n, t)) : (webix.ui.$freeze = !1,
                webix.ui.resize())
            };
            require(["views/" + o], function(e) {
                e.then ? e.then(n) : n(e)
            })
        } else
            webix.ui.$freeze = !1,
            webix.ui.resize()
    }
    function c(e, t, r, o, i) {
        for (var n = 0; n < e.length; n++)
            if (e[n](t, r, o, i) === !1)
                return !1;
        return !0
    }
    function l(e, t, r) {
        var o = e.attachEvent(t, r);
        return this._handlers.push({
            obj: e,
            id: o
        }),
        o
    }
    function _(e, t, r) {
        if (e)
            for (var o = 0; o < e.length; o++)
                e[o](t, r)
    }
    function u() {
        if (this._ui) {
            this.$layout && u.call(this.$layout);
            for (var e = this._handlers, t = e.length - 1; t >= 0; t--)
                e[t].obj.detachEvent(e[t].id);
            this._handlers = [];
            for (var r = this._uis, t = r.length - 1; t >= 0; t--)
                r[t] && r[t].destructor && r[t].destructor();
            this._uis = [],
            _(this._destroy, this._ui, this),
            !this.parent && this._ui && this._ui.destructor()
        }
    }
    function p(e) {
        delete webix.ui.views[e.config.id],
        e.config.id = "";
        for (var t = e.getChildViews(), r = t.length - 1; r >= 0; r--)
            p(t[r])
    }
    function h(e, t) {
        var r, o = {
            _init: [],
            _destroy: [],
            _windows: [],
            _events: []
        }, i = s(e, null, o);
        if (i.$scope = this,
        i.id && (r = $$(i.id)),
        !r) {
            for (var n = 0; n < o._windows.length; n++)
                this.ui(o._windows[n]);
            r = webix.ui(i, t),
            this._uis.push(r);
            for (var n = 0; n < o._events.length; n += 2)
                this.on(g, o._events[n], o._events[n + 1]);
            _(o._init, r, this)
        }
        return r
    }
    function f(e) {
        this._uis = [],
        this._handlers = [],
        this.root && this.root.config && p(this.root);
        for (var t = 0; t < this._windows.length; t++)
            this.ui(this._windows[t]);
        this._ui = webix.ui(e, this.root),
        this.parent && (this.root = this._ui);
        for (var t = 0; t < this._events.length; t += 2)
            this.on(g, this._events[t], this._events[t + 1]);
        _(this._init, this._ui, this)
    }
    function v(e) {
        if (g.debug && console.log(e.stack),
        !e.requireModules)
            throw e;
        g.debug && webix.message({
            type: "error",
            expire: 5e3,
            text: "Can't load " + e.requireModules.join(", ")
        }),
        g.show(g.config.start)
    }
    var m = []
      , b = []
      , $ = []
      , g = {
        create: function(e) {
            g.config = webix.extend({
                name: "App",
                version: "1.0",
                container: document.body,
                start: "/home"
            }, e, !0),
            g.debug = e.debug,
            g.$layout = {
                sub: i,
                root: g.config.container,
                index: 0,
                add: !0
            },
            webix.extend(g, webix.EventSystem),
            webix.attachEvent("onClick", function(e) {
                if (e) {
                    var t = e.target || e.srcElement;
                    if (t && t.getAttribute) {
                        var r = t.getAttribute("trigger");
                        r && g.trigger(r)
                    }
                }
            }),
            setTimeout(function() {
                g.start()
            }, 1);
            var t = document.getElementsByTagName("title")[0];
            t && (t.innerHTML = g.config.name);
            var r = g.config.container;
            return webix.html.addCss(r, "webixappstart"),
            setTimeout(function() {
                webix.html.removeCss(r, "webixappstart"),
                webix.html.addCss(r, "webixapp")
            }, 10),
            g
        },
        ui: h,
        router: function(e) {
            var t = n(e);
            g.path = [].concat(t),
            webix.ui.$freeze = !0,
            d(g.$layout, t)
        },
        show: function(e, t) {
            routie.navigate("!" + e, t)
        },
        start: function(e) {
            routie("!*", g.router),
            window.location.hash ? (webix.ui.$freeze = !1,
            webix.ui.resize()) : g.show(g.config.start)
        },
        use: function(e, t) {
            e.$oninit && e.$oninit(this, t || {}),
            e.$onurlchange && b.push(e.$onurlchange),
            e.$onurl && $.push(e.$onurl),
            e.$onui && m.push(e.$onui)
        },
        trigger: function(e) {
            g.apply(e, [].splice.call(arguments, 1))
        },
        apply: function(e, t) {
            g.callEvent(e, t)
        },
        action: function(e) {
            return function() {
                g.apply(e, arguments)
            }
        },
        on: function(e, t) {
            this.attachEvent(e, t)
        },
        _uis: [],
        _handlers: []
    };
    return requirejs.onError = v,
    g
}),
define("libs/webix-mvc-core/plugins/menu", [], function() {
    function e(e, t) {
        var r = $$(e);
        r.setValue ? r.setValue(t) : r.select && r.exists(t) && r.select(t)
    }
    function t(e) {
        if (e.parent)
            return e.parent.module.$menu || t(e.parent)
    }
    return {
        $onurlchange: function(r, o, i, n) {
            if (r.$menuid) {
                var s = r.$menuid.call ? r.$menuid.call(r, r, o, i) : r.$menuid
                  , a = t(n);
                a && s && e(a, s)
            }
        },
        $onui: function(t, r, o, i) {
            if (t.$menu && o.length) {
                var n = o[0].page;
                0 === n.indexOf(".") && (n = n.substr(1)),
                e(t.$menu, n)
            }
        }
    }
});
var cre_popup = function(e) {
    webix.ui({
        view: "context",
        body: {
            view: "toolbar",
            cols: [{
                view: "button",
                value: "Button1",
                width: 100
            }, {
                view: "button",
                value: "Button2",
                width: 100
            }]
        },
        width: 300,
        master: e
    })
};
define("app", ["libs/webix-mvc-core/core", "libs/webix-mvc-core/plugins/menu"], function(e, t) {
    var o = "0.0.3"
      , i = e.create({
        id: "plexper",
        name: "Прайс-Лист Эксперт: " + o,
        version: o,
        debug: !0,
        start: "/price"
    });
    i.use(t),
    i.client_options = {},
    i.server_url = "scgi/",
    i.request = function(e, t, r) {
        var o;
        e.method;
        e = JSON.stringify(e),
        o = r === !0 ? webix.ajax().sync().headers({
            "Content-type": "application/json"
        }).post(i.server_url, e, t) : webix.ajax().headers({
            "Content-type": "application/json"
        }).post(i.server_url, e, t)
    }
    ,
    i.check_response = function(e) {
        var t = !0;
        return void 0 !== e.error && (webix.message({
            type: "error",
            text: e.error[1]
        }),
        t = !1),
        t
    }
    ,
    i.getCookie = function(e) {
        var t = document.cookie.match(new RegExp("(?:^|; )" + e.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
        return t ? decodeURIComponent(t[1]) : void 0
    }
    ,
    i.setCookie = function(e, t, r) {
        r = r || {};
        var o = r.expires;
        if ("number" == typeof o && o) {
            var i = new Date;
            i.setTime(i.getTime() + 1e3 * o),
            o = r.expires = i
        }
        o && o.toUTCString && (r.expires = o.toUTCString()),
        t = encodeURIComponent(t);
        var n = e + "=" + t;
        for (var s in r) {
            n += "; " + s;
            var a = r[s];
            a !== !0 && (n += "=" + a)
        }
        document.cookie = n
    }
    ,
    i.deleteCookie = function(e) {
        i.setCookie(e, "", {
            expires: -1
        })
    }
    ,
    i.user_info = {};
    var n = {
        method: "user.server_user_info_env",
        params: [i.getCookie("manuscriptsid")]
    };
    return i.user_info = {},
    i.request(n, function(e) {
        var t = JSON.parse(e);
        i.check_response(t) && (i.user_info = t.result[0])
    }, !0),
    i.admin_flag = 1,
    6 == i.user_info.role && (i.admin_flag = 1),
    i.setUserInfoOptions = function(e) {
        i.user_info = e;
        var t = {
            method: "user.set_option",
            params: [i.user_info.options, i.user_info.id]
        };
        i.request(t, function(e) {
            var t = JSON.parse(e);
            i.check_response(t) && console.log(t.result[0])
        }, !1)
    }
    ,
    i.get_order_summ = function(e) {
        var t = {
            method: "get_order_summ",
            params: [e]
        }
          , r = 0;
        return i.request(t, function(e) {
            var t = JSON.parse(e);
            i.check_response(t) && (r = t.result[0])
        }, !0),
        r
    }
    ,
    i.get_select_mode_title = function() {
        var e = i.user_info.options.select_mode;
        if (1 * e === 1)
            return "Поставщик: Все.";
        if (1 * e === 2)
            return "Поставщик: Избр.";
        var t = i.user_info.options.select_vnd[3]
          , r = Object.keys(t);
        return t[r[0]]
    }
    ,
    webix.i18n.setLocale("ru-RU"),
    webix.protoUI({
        name: "activeTable"
    }, webix.ui.datatable, webix.ActiveContent),
    webix.DataStore.prototype.sorting.as.mysort = function(e, t) {
        return e > t ? 1 : -1
    }
    ,
    i.moneyView = function(e, t, r) {
        var o = "undefined" != typeof t ? t : 2
          , i = "undefined" != typeof r ? r : "&nbsp;";
        if ("" === e)
            return "";
        var n = parseFloat(e)
          , s = Math.pow(10, o);
        n = Math.round(n * s) / s;
        var a = Number(n).toFixed(o).toString().split(".")
          , d = a[0].replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, "$1" + i);
        return n = d + "," + a[1]
    }
    ,
    i.kolvoView = function(e, t, r) {
        if (Math.round(e) === e)
            return e;
        var o = "undefined" != typeof t ? t : 3
          , i = "undefined" != typeof r ? r : "&nbsp;";
        if ("" === e)
            return "";
        var n = parseFloat(e)
          , s = Math.pow(10, o);
        n = Math.round(n * s) / s;
        var a = Number(n).toFixed(o).toString().split(".")
          , d = a[0].replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, "$1" + i);
        return n = d + "," + a[1]
    }
    ,
    i.isCharCode = function(e) {
        if (e >= 65 && e <= 90 || e >= 186 && e <= 192 || e >= 219 && e <= 222)
            return !0
    }
    ,
    i.isNumberCode = function(e) {
        if (e >= 48 && e <= 57)
            return !0
    }
    ,
    i.setCount = function(e, t, r) {
        var o = !1
          , i = 1 * e
          , n = 1 * t
          , s = 1 * r;
        if (s > 0 && i && i < s && (i = s,
        o = !0),
        n > 0 && i) {
            var a = i % n;
            a && a < n / 2 && i - a > 0 ? (i -= a,
            i - a && (o = !0)) : a && (a >= n / 2 || i - a <= 0) && (i = i - a + n,
            o = !0)
        }
        return 1 * i
    }
    ,
    i.setComment = function(e, t, r) {
        var o = {
            method: "orders.set_order_comment",
            params: [e, t, i.user_info.id, r]
        };
        i.request(o, function(e) {
            var t = JSON.parse(e);
            i.check_response(t)
        }, !0)
    }
    ,
    i.month_str = {
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
    },
    i.id_spr_color = {},
    i.check_color = function(e) {
        var t = !1;
        i.id_spr_color;
        for (var r in i.id_spr_color)
            i.id_spr_color[r] === e && (t = !0);
        return t
    }
    ,
    i.tbl_types = {
        color_bg: function(e, t) {
            if (e.ID_SPR < 0)
                return i.convertHextoRGBA((16777216 * Math.random() | 0).toString(16), 1);
            var r = i.convertHextoRGBA((16777216 * Math.random() | 0).toString(16), 50);
            if (void 0 === i.id_spr_color[e.ID_SPR]) {
                for (; i.check_color(r) === !0; )
                    r = i.convertHextoRGBA((16777216 * Math.random() | 0).toString(16), 50);
                i.id_spr_color[e.ID_SPR] = r
            } else
                r = i.id_spr_color[e.ID_SPR];
            return i.convertHextoRGBA((16777216 * Math.random() | 0).toString(16), 1)
        },
        price_color: function(e, t) {
            var r = "";
            return e.REESTR > 0 && (r = "green"),
            e.PRICE > e.SP_PRICE && e.SP_PRICE > 0 && (r = "red"),
            r
        },
        price_color1: function(e, t) {
            var r = "";
            return e.REESTR > 0 && (r = "green"),
            e.PRICE < e.SP_PRICE && (r = "red"),
            r
        },
        price_value: function(e, t) {
            return i.moneyView(e.PRICE)
        },
        life_render: function(e, t) {
            if (null !== e.LIFE) {
                var r = e.LIFE.replace(/(\d+)-(\d+)-(\d+)/, "$2/$3/$1")
                  , o = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
                  , i = new Date(r)
                  , n = new Date
                  , s = i
                  , a = ""
                  , d = "";
                if (e.LIFE > "") {
                    var c = 356;
                    n = n.setDate(n.getDate() + c),
                    s = s.setDate(i.getDate()),
                    a = s < n ? " text_danger" : "",
                    r = r.split("/"),
                    d = '<span class="pull-right ' + a + '">' + o[1 * r[0] - 1] + " " + r[2].substr(2, 2) + "</span> "
                }
                return d
            }
        },
        title_render: function(e) {
            var t = $$("check_seller_name").getValue()
              , r = new RegExp("(" + $$("main_search").getValue().split("+")[0].split(" ").filter(function(e, t) {
                return "" !== e
            }).join("|") + ")","gi")
              , o = 1 === $$("check_mnn").getValue() ? ' <span class="mnn_title">' + e.SP_MNN.replace(r, "<span class='rsearch'>$1</span>") + "</span>" : ""
              , i = 1 === t ? e.TITLE.replace(r, "<span class='rsearch'>$1</span>") + o : e.SP_TITLE.replace(r, "<span class='rsearch'>$1</span>") + o;
            return i
        },
        title_render_arh: function(e) {
            var t = i.user_info.options.options.check_seller_name
              , r = i.user_info.options.options.check_mnn
              , o = 1 === r ? ' <span class="mnn_title">' + e.SP_MNN + "</span>" : ""
              , n = 1 === t ? e.TITLE + o : e.SP_TITLE + o;
            return n
        },
        vendor_render_arh: function(e) {
            var t = i.user_info.options.options.check_seller_name
              , r = 1 === t ? e.VENDOR : e.SP_VENDOR;
            return r
        },
        vendor_render: function(e) {
            var t = $$("main_search").getValue().split("+")
              , r = $$("check_seller_name").getValue()
              , o = 1 === r ? e.VENDOR : e.SP_VENDOR;
            if (t.length < 2)
                return o;
            t = t[1];
            var i = new RegExp("(" + t.split(" ").filter(function(e, t) {
                return "" !== e
            }).join("|") + ")","gi");
            return o = o.replace(i, "<span class='rsearch'>$1</span>")
        },
        vnd_color: function(e) {
            var t, r = Math.ceil((new Date - new Date(e.DT)) / 864e5) - 1;
            return 0 === r && (t = "text_success"),
            r > 2 && (t = "text_silver"),
            t
        },
        rest_render: function(e) {
            return 0 === e.REST ? "нет" : e.REST >= 1e4 ? "много" : Math.round(e.REST)
        },
        sp_count_render: function(e) {
            var t = ""
              , r = 0 === e.SP_COUNT ? "" : e.SP_COUNT
              , o = "";
            return e.OLD_ZAK > 0 && (r > 0 && (o = ""),
            t = "&nbsp;<span class='old_zak_ico webix_icon fa-lightbulb-o " + o + "' id='prc_" + e.id + "'></span>"),
            '<span style="font-weight: 900;">' + r + "</span>" + t
        },
        rate_render: function(e) {
            var t = e.RATE > 1 ? '<span class="text_danger">/' + e.RATE + "</span>" : e.MINZAK > 1 ? '<span class="text_danger">/' + e.MINZAK + "</span>" : "/" + e.MINZAK;
            return t
        },
        sp_summa_render: function(e) {
            return 0 !== e.SP_SUMMA ? i.moneyView(e.SP_SUMMA) : ""
        },
        sp_summa_render_osp: function(e) {
            return 0 !== e.summ ? i.moneyView(e.summ) : ""
        },
        reestr_render: function(e) {
            return 0 !== e.REESTR ? i.moneyView(e.REESTR) : ""
        },
        count_render: function(e) {
            var t = e.SP_COUNT;
            if (t.indexOf("old") !== -1) {
                sp_count.addClass("color_lblue"),
                t = t.replace("old", "").split("_");
                var r = 1 * t[1] + 1 * t[2];
                _r_ = r > 0 ? sp_count.html(t[0] + " / " + r) : sp_count.html(t[0]),
                sp_count.attr("title", "в наборе: " + t[1] + " в архиве: " + t[2] + " отправлено: " + t[3])
            } else
                sp_count.removeClass("color_silver")
        },
        old_zak_ico: function(e) {
            return "<span class='old_zak_ico webix_icon fa-lightbulb-o' id='prc_" + e.id + "'></span>"
        },
        oz_title_render: function(e) {
            var t = $$("check_seller_name").getValue()
              , r = new RegExp("(" + "".split(" ").filter(function(e, t) {
                return "" !== e
            }).join("|") + ")","gi")
              , o = 1 === $$("check_mnn").getValue() ? ' <span class="mnn_title">' + e.sp_mnn.replace(r, "<span class='rsearch'>$1</span>") + "</span>" : ""
              , i = 1 === t ? e.title.replace(r, "<span class='rsearch'>$1</span>") + o : e.sp_title.replace(r, "<span class='rsearch'>$1</span>") + o;
            return i
        },
        oz_vendor_render: function(e) {
            var t = $$("check_seller_name").getValue()
              , r = new RegExp("(" + "".split(" ").filter(function(e, t) {
                return "" !== e
            }).join("|") + ")","gi")
              , o = 1 === t ? e.vendor : e.sp_vendor;
            return 1 === $$("check_vnd").getValue() && (o = o.replace(r, "<span class='rsearch'>$1</span>")),
            o
        },
        state_render: function(e) {
            var t = "не знаю";
            switch (1 * e.state) {
            case 1:
                t = "<span style='color:#3498db'>сводный</span>";
                break;
            case 2:
                t = "<span style='color:#ffa21a'>архив</span>";
                break;
            case 26:
                t = "<span style='color:silver'>отправлен</span>"
            }
            return t
        }
    },
    i.ms_box = function(e, t, r, o) {
        var i = "btn_" + webix.uid()
          , n = [];
        o = o || 1e4,
        n[0] = "<div class='msg'>" + e + "</div>",
        void 0 !== t && "" !== t && (n[1] = '<div id="' + i + '" class="msg_f webix_view webix_control webix_el_button button_warning button_raised"><button type="button" >' + t + "</button></div>"),
        webix.message({
            type: "warning",
            id: "test",
            text: n.join(""),
            expire: o
        });
        try {
            document.querySelector("#" + i).onclick = r
        } catch (s) {}
        var a = document.querySelector(".webix_message_area");
        a.style.left = window.innerWidth / 2 - a.offsetWidth + "px"
    }
    ,
    i.convertHextoRGBA = function(e, t) {
        return e = e.replace("#", ""),
        r = parseInt(e.substring(0, 2), 16),
        g = parseInt(e.substring(2, 4), 16),
        b = parseInt(e.substring(4, 6), 16),
        result = "rgba(" + r + "," + g + "," + b + "," + t / 100 + ")",
        result
    }
    ,
    i
}),
define("models/svod_order_db", ["app"], function(e) {
    var t = new webix.DataCollection({
        id: "svod_order_db",
        datatype: "jsarray",
        fieldMap: {
            0: "ACODE",
            1: "DT",
            2: "ID_SPR",
            3: "LIFE",
            4: "MAXPACK",
            5: "MINZAK",
            6: "NDS",
            7: "PRICE",
            8: "RATE",
            9: "REESTR",
            10: "REST",
            11: "SCODE",
            12: "SP_COUNT",
            13: "SP_DATE",
            14: "SP_PRICE",
            15: "SP_SUMMA",
            16: "STITLE",
            17: "TITLE",
            18: "VENDOR",
            19: "SP_TITLE",
            20: "SP_VENDOR",
            21: "SP_MNN",
            22: "ID_ORDER"
        }
    });
    return t.load = function(r) {
        this.clearAll();
        var o = {
            method: "get_svod_recs",
            params: [r]
        };
        e.request(o, function(r) {
            var o = JSON.parse(r);
            if (e.check_response(o)) {
                var i = o.result[0]
                  , n = i.map(function(e) {
                    var r, o, i = e.length, n = {};
                    for (r = 0; r < i; r++)
                        o = e[r],
                        "STITLE" === t.config.fieldMap[r] && (o = o.replace("'", "")),
                        n[t.config.fieldMap[r]] = o;
                    return n
                });
                t.parse(n),
                t.sort({
                    by: "STITLE",
                    dir: "asc"
                })
            }
        }, !0)
    }
    ,
    t
}),
define("models/orders_head_arch", ["app", "models/svod_order_db"], function(e, t) {
    var r = new webix.DataCollection({
        id: "orders_head_arch",
        datatype: "jsarray",
        fieldMap: {
            0: "id",
            1: "id_sklad",
            2: "comment",
            3: "dt",
            4: "n_order",
            5: "state",
            6: "summ",
            7: "id_user",
            8: "sklad",
            9: "user",
            10: "ord_count",
            11: "stitle",
            12: "svod"
        },
        on: {
            onAfterCursorChange: function(t) {
                try {
                    var r = this.getItem(t)
                      , o = $$("order_list_mn")
                      , i = $$("order_summ")
                      , n = "Заказ: " + r.n_order + " " + r.sklad;
                    o.setHTML("<div class='olmn_div'><p>" + n + "</p></div>"),
                    i.setValue(e.moneyView(r.summ).replace(/&nbsp;/g, " ")),
                    i.refresh(),
                    $$("orders_body_archive_db").load()
                } catch (s) {
                    console.log(s)
                }
            }
        }
    });
    return life_render = function(e) {
        var t = e.LIFE.replace(/(\d+)-(\d+)-(\d+)/, "$2/$3/$1")
          , r = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
          , o = new Date(t)
          , i = new Date
          , n = o
          , s = ""
          , a = "";
        if (e.LIFE > "") {
            var d = 356;
            i = i.setDate(i.getDate() + d),
            n = n.setDate(o.getDate()),
            s = n < i ? " text_danger" : "",
            t = t.split("/"),
            a = '<span class="' + s + '">' + r[1 * t[0] - 1] + " " + t[2].substr(2, 2) + "</span> "
        }
        return a
    }
    ,
    r.set_coment = function() {
        var t = r.getItem(r.getCursor())
          , o = {
            method: "orders.set_order_comment",
            params: [t.comment, t.id_sklad, e.user_info.id, t.id]
        };
        e.request(o, function(t) {
            var o = JSON.parse(t);
            e.check_response(o) && r.load()
        }, !0)
    }
    ,
    r.in_trash = function() {
        var t = r.getCursor()
          , o = {
            method: "orders.del_order",
            params: [null !== t.id && void 0 !== t.id ? t.id : t, e.user_info.id]
        };
        e.request(o, function(t) {
            var o = JSON.parse(t);
            e.check_response(o) && r.load()
        }, !0)
    }
    ,
    r.get_report = function(o) {
        var i, n, s, a, d = this, c = d.getCursor(), l = d.getItem(c), _ = $$("archive_order_body_tbl"), u = "<div class='report'>", p = 0, h = 0;
        if (e.request({
            method: "filters.get_sklad_info",
            params: [l.id_sklad]
        }, function(t) {
            var r = JSON.parse(t);
            e.check_response(r) && (s = r.result[0])
        }, !0),
        void 0 === o && (o = 1),
        o = 1 * o,
        1 === o && (a = l.dt.split(" "),
        a = a[0].split("-").reverse(),
        a[1] = e.month_str[1 * a[1]][0],
        a = a.join(" "),
        u += "<h1>Заказ " + l.stitle.toUpperCase().replace("'", "") + " №" + l.n_order + " от " + a + " г.</h1>",
        u += "<p><span class='pull-left'>" + s[7] + ", <strong>" + s[2] + "</strong></span><span class='pull-right'>" + l.comment + "</span></p>",
        u += "<p>&nbsp</p>",
        u += ["<table><thead>", "<tr>", '<th class="">№</th>', '<th class="">товар</th>', '<th class="" width="60">кол-во</th>', '<th class="" width="70">цена</th>', '<th class="" width="80">сумма</th>', "</tr>", "</thead><tbody>"].join(""),
        i = 1,
        _.eachRow(function(t) {
            h = i;
            var r = _.getItem(t);
            u += '<tr><td class="col_text_center">' + i + "</td><td><strong>" + r.TITLE + "</strong> <span class='report_grey_font'>(" + life_render(r) + ", " + r.VENDOR + ')</span></td><td class="col_text_right">' + r.SP_COUNT + '</td><td class="col_text_right">' + e.moneyView(r.PRICE) + '</td><td class="col_text_right">' + e.moneyView(r.SP_SUMMA) + "</td></tr>",
            i += 1,
            p += r.SP_SUMMA
        }),
        u += '<tr><td class="itog col_text_right" colspan=4>ИТОГО:</td><td class="summa col_text_right">' + e.moneyView(p) + "</td></tr>",
        u += "</tbody></table><p>&nbsp;</p>",
        u += "<p style = 'font-size: larger;'>Всего наименований товаров: " + h + ", на сумму " + e.moneyView(p) + " руб.</p>",
        u += "<p style='border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p>",
        u += "<p style = 'font-size: larger;'>Автор: " + l.user + "</p>",
        u += "<p style='border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p></div>",
        $$("report_table").$view.innerHTML = u),
        2 === o && (n = d.get_svod_info(l.svod),
        a = n[3].split(" "),
        a = a[0].split("-").reverse(),
        a[1] = e.month_str[1 * a[1]][0],
        a = a.join(" "),
        u += "<h1>Архивные заказы из сводного  №" + n[4] + " от " + a + " г.</h1>",
        u += "<p><span class='pull-left'>" + s[7] + ", <strong>" + s[2] + "</strong></span><span class='pull-right'>" + n[2] + "</span></p>",
        u += "<p>&nbsp</p>",
        u += ["<table><thead>", "<tr>", '<th class="">№</th>', '<th class="">товар</th>', '<th class="" width="60">кол-во</th>', '<th class="" width="70">цена</th>', '<th class="" width="80">сумма</th>', "</tr>", "</thead><tbody>"].join(""),
        i = 1,
        t.load(n[4]),
        t.filter(function(t) {
            return h = i,
            u += '<tr><td class="col_text_center">' + i + "</td><td><strong>" + t.TITLE + "</strong> <span class='report_grey_font'>(" + life_render(t) + ", " + t.VENDOR + ')</span></td><td class="col_text_right">' + t.STITLE.replace("'", "") + '</td></td><td class="col_text_right">' + t.SP_COUNT + '</td><td class="col_text_right">' + e.moneyView(t.PRICE) + '</td><td class="col_text_right">' + e.moneyView(t.SP_SUMMA) + "</td></tr>",
            i += 1,
            p += t.SP_SUMMA,
            !0
        }),
        u += '<tr><td class="itog col_text_right" colspan=5>ИТОГО:</td><td class="summa col_text_right">' + e.moneyView(p) + "</td></tr>",
        u += "</tbody></table><p>&nbsp;</p>",
        u += "<p style = 'font-size: larger;'>Всего наименований товаров: " + h + ", на сумму " + e.moneyView(p) + " руб.</p>",
        u += "<p style='border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p>",
        u += "<p style = 'font-size: larger;'>Автор: " + l.user + "</p>",
        u += "<p style='border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p></div>",
        $$("report_table").$view.innerHTML = u),
        3 === o) {
            n = d.get_svod_info(l.svod),
            a = n[3].split(" "),
            a = a[0].split("-").reverse(),
            a[1] = e.month_str[1 * a[1]][0],
            a = a.join(" "),
            u += "<h1>Архивные заказы из сводного  №" + n[4] + " от " + a + " г.</h1>",
            u += "<p><span class='pull-left'>" + s[7] + ", <strong>" + s[2] + "</strong></span><span class='pull-right'>" + n[2] + "</span></p>",
            u += "<p>&nbsp</p>",
            u += ["<table><thead>", "<tr>", '<th class="">№</th>', '<th class="">товар</th>', '<th class="" width="60">кол-во</th>', '<th class="" width="70">цена</th>', '<th class="" width="80">сумма</th>', "</tr>", "</thead><tbody>"].join(""),
            i = 1;
            var f = 0
              , v = 0
              , m = "";
            t.load(n[4]),
            t.filter(function(t) {
                if (f !== t.SCODE) {
                    0 !== f && (u += '<tr><td class="itog col_text_right" colspan=4>' + m.replace("'", "") + ':</td><td class="summa col_text_right">' + e.moneyView(v) + "</td></tr>");
                    var o = r.get_svod_info(t.ID_ORDER);
                    a = o[3].split(" "),
                    a = a[0].split("-").reverse(),
                    a[1] = e.month_str[1 * a[1]][0],
                    a = a.join(" "),
                    u += '<tr><td class="itog" colspan=5>' + t.STITLE.toUpperCase().replace("'", "") + ' <span class="report_font1">№' + l.n_order + " от " + a + " г.</span></td></tr>",
                    i = 1,
                    v = 0
                }
                return m = t.STITLE.replace("'", ""),
                f = t.SCODE,
                h += 1,
                u += '<tr><td class="col_text_center">' + i + "</td><td><strong>" + t.TITLE + "</strong> <span class='report_grey_font'>(" + life_render(t) + ", " + t.VENDOR + ')</span></td><td class="col_text_right">' + t.SP_COUNT + '</td><td class="col_text_right">' + e.moneyView(t.PRICE) + '</td><td class="col_text_right">' + e.moneyView(t.SP_SUMMA) + "</td></tr>",
                i += 1,
                p += t.SP_SUMMA,
                v += t.SP_SUMMA,
                !0
            }),
            0 !== f && (u += '<tr><td class="itog col_text_right" colspan=4>' + m + ':</td><td class="summa col_text_right">' + e.moneyView(v) + "</td></tr>"),
            u += '<tr><td class="itog col_text_right" colspan=4>ИТОГО:</td><td class="summa col_text_right">' + e.moneyView(p) + "</td></tr>",
            u += "</tbody></table><p>&nbsp;</p>",
            u += "<p style = 'font-size: larger;'>Всего наименований товаров: " + h + ", на сумму " + e.moneyView(p) + " руб.</p>",
            u += "<p style='border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p>",
            u += "<p style = 'font-size: larger;'>Автор: " + l.user + "</p>",
            u += "<p style='border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p></div>",
            $$("report_table").$view.innerHTML = u
        }
    }
    ,
    r.get_svod_info = function(t) {
        var r, o = {
            method: "orders.get_order_head",
            params: [t]
        };
        return e.request(o, function(t) {
            var o = JSON.parse(t);
            if (e.check_response(o)) {
                var i = o.result[0];
                r = i
            }
        }, !0),
        r
    }
    ,
    r.del_rec = function(t) {
        var r = {
            method: "orders.del_order",
            params: [t, e.user_info.id, 1]
        };
        e.request(r, function(t) {
            var r = JSON.parse(t);
            if (e.check_response(r)) {
                r.result[0]
            }
        }, !0)
    }
    ,
    r.load = function() {
        this.clearAll();
        var t = []
          , o = []
          , i = []
          , n = 1;
        try {
            $$("avnd_list_db").find(function(e) {
                return 1 === e.izb && t.push(e.code),
                1 === e.izb
            })
        } catch (s) {}
        try {
            $$("adres_db").find(function(e) {
                return 1 === e.izb && o.push(e[0]),
                1 === e.izb
            })
        } catch (s) {}
        try {
            $$("users_list_db").find(function(e) {
                return 1 === e.izb && i.push(e[0]),
                1 === e.izb
            })
        } catch (s) {}
        try {
            n = $$("period_pp_tbl").getSelectedId(),
            "" === n && (n = 1)
        } catch (a) {}
        var d = {
            method: "orders.get_orders_archive",
            params: [void 0 !== e.user_info.sklad ? e.user_info.sklad : [], t, o, i, n]
        };
        e.request(d, function(t) {
            var o = JSON.parse(t);
            if (e.check_response(o)) {
                var i = o.result[0]
                  , n = i.map(function(e) {
                    var t, o = e.length, i = {};
                    for (t = 0; t < o; t++)
                        i[r.config.fieldMap[t]] = e[t];
                    return i
                });
                r.parse(n),
                $$("orders_head_arch").sort({
                    by: "Дата",
                    dir: "desc",
                    as: "mysort"
                });
                try {
                    var s = $$("archive_orders_head");
                    s.count() > 0 && (s.select(s.getFirstId()),
                    webix.UIManager.setFocus(table_n))
                } catch (a) {}
                try {
                    $$("archive_orders_head").config.refresh_oper_vis()
                } catch (a) {}
            }
        }, !0)
    }
    ,
    r
}),
define("views/tables/archive_orders_head", ["app", "models/orders_head_arch"], function(e, t) {
    var r = {
        view: function(e) {
            $$("arch_head_pnl").hide(),
            $$("arch_order_pnl").show(),
            $$("archive_orders_head").hide(),
            t.setCursor(e),
            $$("archive_order_body_tbl").show(),
            $$("main_search_ord").focus()
        },
        return_ord: function(r, o, i) {
            i = i || !1;
            var n = {
                method: "archive.archive_return_order",
                params: [r, e.user_info.id, o]
            };
            e.request(n, function(r) {
                var o = JSON.parse(r);
                if (e.check_response(o)) {
                    o.result[0];
                    i || t.load()
                }
            })
        },
        copy: function(r) {
            var o = {
                method: "archive.archive_copy_order",
                params: [r, e.user_info.id]
            };
            e.request(o, function(r) {
                var o = JSON.parse(r);
                if (e.check_response(o)) {
                    o.result[0];
                    t.load()
                }
            })
        },
        send: function(r, o) {
            o = o || !1;
            var i = {
                method: "archive.genOrdersFile",
                params: [r, e.user_info.id]
            };
            e.request(i, function(r) {
                var i = JSON.parse(r);
                if (e.check_response(i)) {
                    i.result[0];
                    o || t.load()
                }
            })
        }
    }
      , o = {
        view: "activeTable",
        scrollX: !1,
        id: "archive_orders_head",
        hover: "hover_table",
        editable: !0,
        rowHeight: 45,
        tooltip: !0,
        utils: r,
        type: {
            get_row_color: function(e) {
                if (1 * e.state === 26)
                    return "send_rec_color"
            },
            get_enable: function(e) {
                if (1 * e.state === 26)
                    return "visibility: hidden;"
            },
            summa_render: function(t) {
                return e.moneyView(t.summ)
            },
            dt_render: function(e) {
                var t = webix.Date.dateToStr("%d.%m.%Y");
                return t(e.dt)
            },
            get_view_btn: function(e) {
                return "<span id='hview_btn_" + e.id + "' class='view_btn ahb' title='Просмотр'></span>"
            },
            get_copy_btn: function(e) {
                return "<span id='copy_btn_" + e.id + "' class='copy_btn ahb' title='Копировать'></span>"
            },
            get_return_ord: function(e) {
                return 1 * e.state === 26 ? "<span id='return_btn_" + e.id + "' class='return_btn ahb' style='visibility: hidden;' title='Вернуть на доработку'></span>" : (setTimeout(function() {
                    var t = webix.toNode("return_btn_" + e.id);
                    null !== t && (t.timeOut = void 0,
                    void 0 !== t.ln_ev && webix.eventRemove(t.ln_ev),
                    t.ln_ev = webix.event(t, webix.env.mouse.down, function() {
                        t.classList.add("load_cur"),
                        t.timeOut = setTimeout(function() {
                            t.classList.remove("load_cur"),
                            $$("archive_orders_head").config.utils.return_ord(e.id, e.svod)
                        }, 1500)
                    }),
                    webix.event(t, webix.env.mouse.up, function() {
                        t.classList.remove("load_cur"),
                        clearTimeout(t.timeOut)
                    }))
                }, 100),
                "<span id='return_btn_" + e.id + "' class='return_btn ahb' title='Вернуть на доработку'></span>")
            },
            get_send_btn: function(e) {
                return 1 * e.state === 26 ? "<span id='send_btn_" + e.id + "' class='send_btn ahb' style='visibility: hidden;' title='Отправить'></span>" : (setTimeout(function() {
                    var t = webix.toNode("send_btn_" + e.id);
                    null !== t && (t.timeOut = void 0,
                    void 0 !== t.ln_ev && webix.eventRemove(t.ln_ev),
                    t.ln_ev = webix.event(t, webix.env.mouse.down, function() {
                        t.classList.add("load_cur"),
                        t.timeOut = setTimeout(function() {
                            t.classList.remove("load_cur"),
                            $$("archive_orders_head").config.utils.send(e.id)
                        }, 1500)
                    }),
                    webix.event(t, webix.env.mouse.up, function() {
                        t.classList.remove("load_cur"),
                        clearTimeout(t.timeOut)
                    }))
                }, 100),
                "<span id='send_btn_" + e.id + "' class='send_btn ahb' title='Отправить'></span>")
            }
        },
        columns: [{
            id: "izb",
            header: "",
            template: "<span style='{common.get_enable()}'>{common.checkbox()}</span>",
            width: 45
        }, {
            header: "",
            tooltip: !1,
            id: "view",
            template: "                {common.get_view_btn()}                {common.get_return_ord()}                {common.get_copy_btn()}                {common.get_send_btn()}",
            width: 160
        }, {
            id: "summ",
            width: 80,
            header: {
                text: "Сумма",
                css: "col_text_right"
            },
            css: "col_text_right",
            template: "<span class='{common.get_row_color()}'>{common.summa_render()}</span>",
            sort: "int"
        }, {
            id: "n_order",
            header: "Номер",
            template: "<span class='{common.get_row_color()}'>#n_order#<p><span class='user_title'>#stitle#</span></p></span>",
            width: 120,
            sort: "int"
        }, {
            id: "ord_count",
            sort: "int",
            header: {
                text: "Позиций",
                css: "col_text_right"
            },
            css: "col_text_right",
            template: "<span class='{common.get_row_color()}'>#ord_count#</span>",
            width: 70
        }, {
            id: "sklad",
            header: "Склад",
            fillspace: !0,
            sort: "string",
            template: "<div><span class='vendor_title {common.get_row_color()}'>#sklad#</span><p><span class='user_title {common.get_row_color()}'>#user#</span></p></div>"
        }, {
            id: "comment",
            header: "Коментарий",
            width: 180,
            sort: "string",
            template: "<span class='vendor_title {common.get_row_color()}'>#comment#</span>",
            editor: "text"
        }, {
            id: "dt",
            header: "Дата",
            sort: "mysort",
            template: "<span class='{common.get_row_color()}'>{common.dt_render()}</span>"
        }],
        data: t,
        on: {
            onItemClick: function(e) {
                var r = this.getItem(e);
                26 !== r.state && (t.setCursor(e),
                r.izb = !r.izb,
                this.refresh(),
                this.config.refresh_oper_vis())
            },
            onCheck: function(e, r, o) {
                var i = this.getItem(e);
                return 26 !== i.state && (t.setCursor(e),
                void this.config.refresh_oper_vis())
            },
            onShow: function() {
                var e = $$("archive_orders_head");
                e.select(e.getFirstId()),
                webix.UIManager.setFocus(table_n)
            },
            onKeyPress: function(e, t) {
                var r = this
                  , o = r.getSelectedId().id;
                this.getEditState() ? 40 !== e && 13 !== e || r.editStop() : 13 === e && setTimeout(function() {
                    r.edit({
                        row: o,
                        column: "comment"
                    })
                }, 0)
            },
            onAfterEditStop: function(e, r, o) {
                var i = $$("archive_orders_head");
                i.getSelectedItem();
                t.setCursor(r.row),
                t.set_coment()
            },
            onAfterSelect: function(e) {
                t.setCursor(e)
            }
        },
        onClick: {
            view_btn: function(e, t, r) {
                e.stopPropagation();
                var o = this.getItem(t.row);
                return this.config.utils.view(o.id),
                !1
            },
            return_btn: function(e, t, r) {
                return e.stopPropagation(),
                !1
            },
            copy_btn: function(e, t, r) {
                e.stopPropagation();
                var o = this.getItem(t.row);
                return this.config.utils.copy(o.id),
                !1
            },
            send_btn: function(e, t, r) {
                return e.stopPropagation(),
                !1
            }
        },
        refresh_oper_vis: function() {
            var e = 0
              , t = {}
              , r = {}
              , o = $$("archive_orders_head");
            o.eachRow(function(i) {
                var n = o.getItem(i);
                n.izb && (e += 1,
                t[n.stitle] = 1,
                r[n.sklad] = 1)
            });
            try {
                e > 1 ? ($$("return_btn").show(),
                $$("send_btn").show(),
                1 === Object.keys(t).length && 1 === Object.keys(r).length ? $$("union_btn").show() : $$("union_btn").hide()) : ($$("return_btn").hide(),
                $$("union_btn").hide(),
                $$("send_btn").hide())
            } catch (i) {}
        }
    };
    return o
}),
define("models/avnd_list_db", ["app"], function(e) {
    var t = new webix.DataCollection({
        id: "avnd_list_db",
        datatype: "jsarray"
    });
    return t.load = function() {
        this.clearAll();
        var r = {
            method: "archive.get_archiv_vnd_list",
            params: []
        };
        e.request(r, function(r) {
            var o = JSON.parse(r);
            if (e.check_response(o)) {
                var i = o.result[0];
                t.parse(i),
                t.sort("name", "asc", "string")
            }
        }, !0)
    }
    ,
    t
}),
define("views/popups/avnd_mode", ["app", "models/avnd_list_db"], function(e, t) {
    var r = webix.ui({
        view: "popup",
        id: "avnd_mode",
        height: 300,
        width: 200,
        timeout: null,
        paddingY: 0,
        body: {
            padding: 0,
            rows: [{
                id: "avnd_mode_tbl",
                view: "activeTable",
                scrollX: !1,
                header: !1,
                hover: "hover_table",
                columns: [{
                    id: "name",
                    template: "#name#",
                    width: 120
                }, {
                    id: "izb",
                    template: "{common.checkbox()}",
                    width: 50
                }],
                data: t,
                on: {
                    onItemClick: function(e) {
                        var t = this.getItem(e);
                        t.izb = 1 * !t.izb,
                        this.refresh(),
                        this.callEvent("onCheck", [e])
                    },
                    onCheck: function(e) {
                        this.getItem(e);
                        $$("orders_head_arch").load()
                    }
                }
            }, {
                height: 10
            }, {
                view: "button",
                css: "button_primary",
                value: "снять выделение",
                click: function() {
                    $$("avnd_list_db").find(function(e) {
                        return e.izb = 0,
                        1 === e.izb
                    }),
                    $$("avnd_mode_tbl").refresh(),
                    $$("orders_head_arch").load()
                }
            }]
        },
        on: {
            onShow: function() {}
        }
    });
    return {
        $ui: r
    }
}),
define("models/orders_body_archive_db", ["app"], function(e) {
    var t = new webix.DataCollection({
        id: "orders_body_archive_db",
        datatype: "jsarray",
        fieldMap: {
            0: "ACODE",
            1: "DT",
            2: "ID_SPR",
            3: "LIFE",
            4: "MAXPACK",
            5: "MINZAK",
            6: "NDS",
            7: "PRICE",
            8: "RATE",
            9: "REESTR",
            10: "REST",
            11: "SCODE",
            12: "SP_COUNT",
            13: "SP_DATE",
            14: "SP_PRICE",
            15: "SP_SUMMA",
            16: "STITLE",
            17: "TITLE",
            18: "VENDOR",
            19: "SP_TITLE",
            20: "SP_VENDOR",
            21: "SP_MNN",
            22: "ID_ORDER",
            23: "SRC_STR"
        },
        on: {
            onAfterAdd: function(t, r) {
                var o = this.getItem(t)
                  , i = [];
                for (var n in o)
                    "id" !== n && i.push(o[n]);
                var s = {
                    method: "orders.add_orders_rec",
                    params: [i, e.user_info.id]
                };
                e.request(s, function(t) {
                    var r = JSON.parse(t);
                    if (e.check_response(r)) {
                        var o = r.result[0]
                          , i = $$("orders_head_arch").getItem($$("orders_head_arch").getCursor())
                          , n = o;
                        i.summ = n,
                        $$("orders_head_arch").callEvent("onAfterCursorChange", [i.id])
                    }
                }, !0)
            }
        },
        app_rec: function(t) {
            console.log("app_rec");
            var r = $$(this.id)
              , o = r.find(function(e) {
                return e.ACODE === t.ACODE && e.SCODE === t.SCODE
            });
            if (0 !== t.SP_COUNT) {
                o[0].SP_COUNT = t.SP_COUNT,
                o[0].SP_SUMMA = t.SP_SUMMA;
                var i = {
                    method: "orders.edit_orders_rec",
                    params: [[t.SP_COUNT, t.SP_SUMMA, t.PRICE, o[0].SRC_STR, t.ACODE, t.SCODE, o[0].ID_ORDER], e.user_info.id]
                };
                e.request(i, function(t) {
                    var r = JSON.parse(t);
                    if (e.check_response(r)) {
                        var o = r.result[0]
                          , i = $$("orders_head_arch").getItem($$("orders_head_arch").getCursor())
                          , n = o;
                        i.summ = n,
                        $$("orders_head_arch").callEvent("onAfterCursorChange", [i.id])
                    }
                }, !0)
            }
        },
        del_rec: function(t) {
            var r = $$(this.id)
              , o = r.find(function(e) {
                return e.ACODE === t.ACODE && e.SCODE === t.SCODE
            });
            if (o.length > 0) {
                r.remove(o[0].id);
                var i = {
                    method: "del_order_rec",
                    params: [[o[0].ACODE, o[0].SCODE, o[0].ID_ORDER], e.user_info.id]
                };
                e.request(i, function(t) {
                    var r = JSON.parse(t);
                    if (e.check_response(r)) {
                        var o = r.result[0]
                          , i = $$("orders_head_arch").getItem($$("orders_head_arch").getCursor())
                          , n = o;
                        i.summ = n,
                        i.summ > 0 ? $$("orders_head_arch").callEvent("onAfterCursorChange", [i.id]) : ($$("orders_head_arch").del_rec(i.id),
                        $$("return_archive_btn").config.click())
                    }
                }, !0)
            }
        }
    });
    return t.load = function(r) {
        void 0 === r && (r = $$("orders_head_arch").getItem($$("orders_head_arch").getCursor()).id),
        this.clearAll();
        var o = [];
        if (1 * e.user_info.options.select_mode !== 1 && (o = Object.keys(e.user_info.options.select_vnd[e.user_info.options.select_mode]),
        0 === o.length))
            return void t.callEvent("onAfterLoad");
        var i = {
            method: "orders.get_order_recs",
            params: [r, o]
        };
        e.request(i, function(r) {
            var o = JSON.parse(r);
            if (e.check_response(o)) {
                var i = o.result[0]
                  , n = i.map(function(e) {
                    var r, o = e.length, i = {};
                    for (r = 0; r < o; r++)
                        i[t.config.fieldMap[r]] = e[r];
                    return i
                });
                t.parse(n),
                $$("archive_main_view").config.refresh_toolbar()
            }
        }, !1)
    }
    ,
    t
}),
define("views/tables/archive_order_body_tbl", ["app", "models/orders_body_archive_db"], function(e, t) {
    var r = {
        view: "datatable",
        id: "archive_order_body_tbl",
        scrollX: !1,
        select: "row",
        hover: "hover_table",
        hidden: !0,
        navigation: !0,
        editable: !0,
        tooltip: !0,
        type: e.tbl_types,
        doubleEnter: 0,
        columns: [{
            id: "STITLE",
            header: "Поставщик",
            template: "<span class='{common.vnd_color()}'>#STITLE#</span>",
            width: 85,
            sort: "string"
        }, {
            id: "PRICE",
            css: "col_text_right",
            header: {
                text: "Цена",
                css: "col_text_right",
                adjust: !0
            },
            template: "<span style='color:{common.price_color1()}'>{common.price_value()}</span>",
            width: 75,
            sort: "int"
        }, {
            id: "TITLE",
            header: "Товар",
            template: "<span class='tovar_title'>{common.title_render_arh()}</span>{common.life_render()}",
            css: "title_prc",
            fillspace: !0,
            sort: "string"
        }, {
            id: "VENDOR",
            header: "Производитель",
            template: "<span class='vendor_title'>{common.vendor_render_arh()}</span>",
            width: 160,
            sort: "string"
        }, {
            id: "REST",
            header: {
                text: "Остаток",
                css: "col_text_right"
            },
            css: "col_text_right",
            template: "{common.rest_render()}",
            width: 70,
            sort: "int"
        }, {
            id: "SP_COUNT",
            css: "col_text_right",
            header: {
                text: "Кол-во",
                css: "col_text_right"
            },
            template: "{common.sp_count_render()}",
            width: 100,
            editor: "text",
            sort: "int"
        }, {
            id: "SP_SUMMA",
            css: "col_text_right",
            header: {
                text: "Сумма",
                css: "col_text_right"
            },
            template: "{common.sp_summa_render()}",
            width: 120,
            sort: "int"
        }, {
            id: "RATE",
            header: "Упак",
            width: 70,
            template: "{common.rate_render()}"
        }, {
            id: "REESTR",
            header: "ЖВНЛС",
            template: "{common.reestr_render()}",
            width: 70
        }],
        data: t,
        on: {
            onKeyPress: function(t, r) {
                var o, i = this, n = i.getSelectedId().id;
                if (this.getEditState() === !1) {
                    if (o = $$("archive_orders_head").getItem($$("orders_head_arch").getCursor()).state,
                    !e.isCharCode(t) && 32 !== t || 8 === t ? 8 === t && ($$("main_search_ord").focus(),
                    setTimeout(function() {
                        $$("main_search_ord").callEvent("onChange", [$$("main_search_ord").getValue()])
                    }, 100)) : (8 !== t && 32 !== t ? $$("main_search_ord").setValue("") : 32 === t && $$("main_search_ord").setValue($$("main_search_ord").getValue() + " "),
                    $$("main_search_ord").focus(),
                    setTimeout(function() {
                        $$("main_search_ord").callEvent("onChange", [$$("main_search_ord").getValue()])
                    }, 100)),
                    13 !== t && !e.isNumberCode(t) || 1 * o === 26 || setTimeout(function() {
                        i.edit({
                            row: i.getSelectedId(),
                            column: "SP_COUNT"
                        }),
                        e.isNumberCode(t) && ($$("archive_order_body_tbl").getEditor().node.querySelector("input").value = String.fromCharCode(t))
                    }, 100),
                    46 === t && r.ctrlKey && 1 * o !== 26) {
                        var s = i.getSelectedItem();
                        s.SP_COUNT = 0,
                        s.SP_SUMMA = 0,
                        $$("orders_body_archive_db").config.del_rec(s),
                        $$("archive_order_body_tbl").refresh()
                    }
                } else if (40 === t && (i.editStop(),
                console.log(i.getSelectedId().id + "", i.getLastId() + "", n),
                i.getSelectedId().id + "" != i.getLastId() + "" ? i.select(i.getNextId(n)) : i.select(n)),
                e.isCharCode(t))
                    return !1
            },
            onAfterEditStop: function(e, t, r) {
                var o = $$("archive_order_body_tbl");
                o.getSelectedItem()
            },
            onAfterSelect: function(e) {
                t.setCursor(e)
            },
            onAfterRender: function() {
                1 * $$("archive_orders_head").getItem($$("orders_head_arch").getCursor()).state === 26 ? this.config.editable = !1 : this.config.editable = !0
            }
        }
    };
    return r
}),
define("models/cross_records_db", ["app", "models/svod_order_db"], function(e, t) {
    var r = new webix.DataCollection({
        id: "cross_records_db",
        datatype: "jsarray",
        fieldMap: {
            0: "title",
            1: "min_c",
            2: "max_c",
            3: "sum_c",
            4: "dt",
            5: "acode"
        }
    });
    return r.ids = [],
    r.load = function() {
        this.clearAll();
        var t = {
            method: "archive.get_cross_rec",
            params: [r.ids]
        };
        e.request(t, function(t) {
            var o = JSON.parse(t);
            if (e.check_response(o)) {
                var i = o.result[0]
                  , n = i.map(function(e) {
                    var t, o = e.length, i = {};
                    for (t = 0; t < o; t++)
                        i[r.config.fieldMap[t]] = e[t];
                    return i
                });
                r.parse(n)
            }
        }, !0)
    }
    ,
    r
}),
define("views/windows/cross_records_win", ["app", "models/cross_records_db"], function(e, t) {
    var r = {
        view: "window",
        id: "cross_records_win",
        head: "<span style='color: orange'>Внимание повторяющиеся позиции</span>",
        height: 450,
        width: 600,
        position: "center",
        modal: !0,
        body: {
            rows: [{
                padding: 10,
                rows: [{
                    view: "activeTable",
                    scrollX: !1,
                    id: "cross_win_tb",
                    height: 300,
                    fixedRowHeight: !1,
                    type: {
                        get_acode: function(e) {
                            return e.acode
                        }
                    },
                    cross_rec: {},
                    columns: [{
                        id: "title",
                        header: "Название",
                        fillspace: !0
                    }, {
                        id: "min_c",
                        header: "Мин",
                        width: 70,
                        template: "<span class='cross_r js_a_{common.get_acode()}' onclick='$$(\"cross_win_tb\").config.select_c(\"{common.get_acode()}\", this)'>                                    #min_c#</span>"
                    }, {
                        id: "max_c",
                        header: "Макс",
                        width: 70,
                        template: "<span class='cross_r js_a_{common.get_acode()}' onclick='$$(\"cross_win_tb\").config.select_c(\"{common.get_acode()}\", this)'>                                    #max_c#</span>"
                    }, {
                        id: "sum_c",
                        header: "Сумма",
                        width: 70,
                        template: "<span class='cross_r js_a_{common.get_acode()}' onclick='$$(\"cross_win_tb\").config.select_c(\"{common.get_acode()}\", this)'>                                    #sum_c#</span>"
                    }],
                    select_c: function(e, r) {
                        try {
                            [].map.call(document.querySelectorAll(".cross_r_h.js_a_" + e), function(e) {
                                try {
                                    e.classList.remove("cross_r_h")
                                } catch (t) {}
                            })
                        } catch (o) {}
                        r.classList.add("cross_r_h"),
                        $$("cross_win_tb").config.cross_rec[e] = r.innerHTML,
                        t.count() === Object.keys($$("cross_win_tb").config.cross_rec).length && $$("cross_yes_btn").show()
                    },
                    datatype: "jsarray",
                    data: t
                }]
            }, {
                padding: 5,
                cols: [{
                    view: "button",
                    value: "Отменить",
                    css: "button_info",
                    width: 150,
                    click: function() {
                        $$("cross_records_win").close()
                    }
                }, {
                    view: "spacer"
                }, {
                    view: "button",
                    value: "Продолжить",
                    css: "button_success",
                    hidden: !0,
                    id: "cross_yes_btn",
                    width: 150,
                    click: function() {
                        var r = $$("cross_win_tb").config.cross_rec;
                        $$("cross_records_win").close();
                        var o = {
                            method: "archive.combine_orders",
                            params: [t.ids[0], t.ids, e.user_info.id, r]
                        };
                        e.request(o, function(t) {
                            var r = JSON.parse(t);
                            if (e.check_response(r)) {
                                r.result[0];
                                $$("orders_head_arch").load()
                            }
                        }, !0)
                    }
                }]
            }]
        },
        on: {
            onBeforeShow: function() {
                $$("cross_win_tb").resize()
            },
            onShow: function() {
                $$("cross_win_tb").config.cross_rec = {}
            }
        }
    };
    return r
}),
define("views/windows/report_win", ["app"], function(e) {
    var t = {
        view: "window",
        id: "report_win",
        headHeight: 0,
        fullscreen: !0,
        body: {
            rows: [{
                css: "no_print",
                autoheight: !0,
                cols: [{}, {
                    view: "segmented",
                    id: "report_win_segmented",
                    width: 430,
                    value: 1,
                    options: [{
                        id: "1",
                        value: "Обычный"
                    }, {
                        id: "2",
                        value: "Сводный (краткий)"
                    }, {
                        id: "3",
                        value: "Сводный (полный)"
                    }],
                    on: {
                        onItemClick: function(e, t) {
                            var r = this.getValue();
                            1 * r > 1 ? ($$("reset_flt").hide(),
                            $$("free_space").config.width = 300,
                            $$("free_space").resize()) : "" !== $$("main_search_ord").getValue() && ($$("reset_flt").show(),
                            $$("free_space").config.width = 100,
                            $$("free_space").resize()),
                            $$("orders_head_arch").get_report(r)
                        }
                    }
                }, {
                    width: 100,
                    id: "free_space"
                }, {
                    view: "button",
                    value: "Сбросить фильтр",
                    id: "reset_flt",
                    width: 200,
                    css: "button_warning",
                    click: function() {
                        $$("main_search_ord").setValue(""),
                        $$("orders_head_arch").get_report(1),
                        this.hide(),
                        $$("free_space").config.width = 300,
                        $$("free_space").resize()
                    }
                }, {
                    view: "button",
                    value: "Печатать",
                    id: "print_btn",
                    width: 150,
                    css: "button_success",
                    click: function() {
                        text = document.querySelector(".report").innerHTML,
                        printwin = open("", "printwin", "width=1024,height=780"),
                        printwin.document.open(),
                        printwin.document.writeln('<html><head><title></title><link rel="stylesheet" type="text/css" href="assets/print.css" media="print" /><link rel="stylesheet" type="text/css" href="assets/print.css"  /></head><body onload=print();close();>'),
                        printwin.document.writeln('<div class="report">' + text + "</div>"),
                        printwin.document.writeln("</body></html>"),
                        printwin.document.close()
                    }
                }, {
                    view: "button",
                    value: "Закрыть",
                    width: 150,
                    css: "button_info",
                    click: function() {
                        $$("report_win").close()
                    }
                }, {}]
            }, {
                id: "report_table",
                padding: 10,
                template: ""
            }]
        },
        on: {
            onShow: function() {
                $$("orders_head_arch").get_report(1),
                "" === $$("main_search_ord").getValue() && ($$("reset_flt").hide(),
                $$("free_space").config.width = 300,
                $$("free_space").resize());
                var e = $$("orders_head_arch").getItem($$("orders_head_arch").getCursor());
                (1 * e.state === 26 || e.svod < 1) && ($$("report_win_segmented").hide(),
                $$("free_space").config.width = 650,
                $$("free_space").resize()),
                document.querySelector("[view_id=report_win]").focus(),
                document.querySelector("[view_id=report_win]").onkeydown = function(e) {
                    if (80 === e.keyCode && e.ctrlKey)
                        return $$("print_btn").config.click(),
                        !1
                }
            }
        }
    };
    return t
}),
define("views/archive/main_toolbar_row", ["app", "views/windows/report_win", "views/windows/cross_records_win"], function(e, t, r) {
    var o = {
        id: "avm_toolbar",
        css: "bg_panel",
        height: 50,
        padding: 5,
        view: "form",
        elements: [{
            id: "arch_head_pnl",
            css: "pvm_toolbar_col",
            padding: 10,
            cols: [{
                view: "button",
                id: "avnd_list_bnt",
                align: "left",
                label: "Поставщики",
                width: 170,
                popup: "avnd_mode",
                badge: "&#9660;",
                on: {
                    onItemClick: function() {
                        setTimeout(function() {
                            $$("avnd_mode").show()
                        }, 100)
                    }
                }
            }, {
                view: "button",
                id: "avnd_list_bnt1",
                align: "left",
                label: "Адрес",
                autowidth: !0,
                popup: "adres_pp",
                badge: "&#9660;",
                on: {
                    onItemClick: function() {
                        setTimeout(function() {
                            $$("adres_pp").show()
                        }, 100)
                    }
                }
            }, {
                view: "button",
                id: "avnd_list_bnt2",
                align: "left",
                label: "Автор",
                autowidth: !0,
                popup: "author_pp",
                badge: "&#9660;",
                on: {
                    onItemClick: function() {
                        setTimeout(function() {
                            $$("author_pp").show()
                        }, 100)
                    }
                }
            }, {
                view: "button",
                id: "avnd_list_bnt3",
                align: "left",
                value: "Сегодня",
                autowidth: !0,
                popup: "period_pp",
                badge: "&#9660;",
                on: {
                    onItemClick: function() {
                        setTimeout(function() {
                            $$("period_pp").show()
                        }, 100)
                    }
                }
            }, {
                width: 420
            }, {
                cols: [{
                    view: "icon",
                    css: "return_btn htools_btn",
                    id: "return_btn",
                    align: "right",
                    on: {
                        onAfterRender: function() {
                            var e = this.getNode().querySelector("button");
                            e.timeOutMM = void 0,
                            e.timeOut = void 0,
                            webix.event(e, "mouseout", function(t) {
                                webix.delay(function() {
                                    clearTimeout(e.timeOutMM),
                                    void 0 !== $$("return_btn_tooltip") && $$("return_btn_tooltip").destructor()
                                }, {}, [], 250)
                            }),
                            webix.event(e, webix.env.mouse.move, function(e) {
                                this.timeOutMM = setTimeout(function() {
                                    void 0 === $$("return_btn_tooltip") && webix.ui({
                                        view: "tooltip",
                                        id: "return_btn_tooltip",
                                        template: "<span class='text_warning'>УДЕРЖИВАЙТЕ</span><br> чтобы <span class='text_success'>вернуть на доработку группу</span>",
                                        height: 100
                                    }).show({}, {
                                        x: e.x,
                                        y: e.y
                                    })
                                }, 250)
                            }),
                            webix.event(e, webix.env.mouse.down, function() {
                                e.classList.add("load_cur"),
                                this.timeOut = setTimeout(function() {
                                    e.classList.remove("load_cur");
                                    var t = []
                                      , r = 1
                                      , o = 0;
                                    $$("orders_head_arch").filter(function(e) {
                                        return e.izb && t.push(e),
                                        !0
                                    }),
                                    o = t.length,
                                    t.forEach(function(e) {
                                        $$("archive_orders_head").config.utils.return_ord(e.id, e.svod, o > r),
                                        r += 1
                                    })
                                }, 1500)
                            }),
                            webix.event(e, webix.env.mouse.up, function() {
                                clearTimeout(e.timeOut),
                                e.classList.remove("load_cur")
                            })
                        }
                    },
                    click: function() {
                        return !1
                    }
                }, {
                    width: 20
                }, {
                    view: "icon",
                    css: "send_btn htools_btn",
                    id: "send_btn",
                    align: "right",
                    on: {
                        onAfterRender: function() {
                            var e = this.getNode().querySelector("button");
                            e.timeOutMM = void 0,
                            e.timeOut = void 0,
                            webix.event(e, "mouseout", function(t) {
                                webix.delay(function() {
                                    clearTimeout(e.timeOutMM),
                                    void 0 !== $$("return_btn_tooltip") && $$("return_btn_tooltip").destructor()
                                }, {}, [], 250)
                            }),
                            webix.event(e, webix.env.mouse.move, function(e) {
                                this.timeOutMM = setTimeout(function() {
                                    void 0 === $$("return_btn_tooltip") && webix.ui({
                                        view: "tooltip",
                                        id: "return_btn_tooltip",
                                        template: "<span class='text_warning'>УДЕРЖИВАЙТЕ</span><br> чтобы <span class='text_success'>отправить группу</span>",
                                        height: 100
                                    }).show({}, {
                                        x: e.x,
                                        y: e.y
                                    })
                                }, 250)
                            }),
                            webix.event(e, webix.env.mouse.down, function() {
                                e.classList.add("load_cur"),
                                this.timeOut = setTimeout(function() {
                                    e.classList.remove("load_cur");
                                    var t = []
                                      , r = 1
                                      , o = 0;
                                    $$("orders_head_arch").filter(function(e) {
                                        return e.izb && t.push(e),
                                        !0
                                    }),
                                    o = t.length,
                                    t.forEach(function(e) {
                                        $$("archive_orders_head").config.utils.send(e.id, o > r),
                                        r += 1
                                    })
                                }, 1500)
                            }),
                            webix.event(e, webix.env.mouse.up, function() {
                                clearTimeout(e.timeOut),
                                e.classList.remove("load_cur")
                            })
                        }
                    },
                    click: function() {
                        return !1
                    }
                }, {
                    width: 20
                }, {
                    view: "icon",
                    css: "union_btn htools_btn",
                    id: "union_btn",
                    align: "right",
                    on: {
                        onAfterRender: function() {
                            var t = this.getNode().querySelector("button");
                            t.timeOutMM = void 0,
                            t.timeOut = void 0,
                            webix.event(t, "mouseout", function(e) {
                                webix.delay(function() {
                                    clearTimeout(t.timeOutMM),
                                    void 0 !== $$("return_btn_tooltip") && $$("return_btn_tooltip").destructor()
                                }, {}, [], 250)
                            }),
                            webix.event(t, webix.env.mouse.move, function(e) {
                                this.timeOutMM = setTimeout(function() {
                                    void 0 === $$("return_btn_tooltip") && webix.ui({
                                        view: "tooltip",
                                        id: "return_btn_tooltip",
                                        template: "<span class='text_warning'>УДЕРЖИВАЙТЕ</span><br> чтобы <span class='text_success'>чтобы объединить группу</span>",
                                        height: 100
                                    }).show({}, {
                                        x: e.x,
                                        y: e.y
                                    })
                                }, 250)
                            }),
                            webix.event(t, webix.env.mouse.down, function() {
                                t.classList.add("load_cur"),
                                this.timeOut = setTimeout(function() {
                                    t.classList.remove("load_cur");
                                    var o = [];
                                    if ($$("orders_head_arch").filter(function(e) {
                                        return e.izb && o.push(e.id),
                                        !0
                                    }),
                                    $$("cross_records_db").ids = o,
                                    $$("cross_records_db").load(),
                                    $$("cross_records_db").count() > 0)
                                        webix.ui(r).show();
                                    else {
                                        var i = {
                                            method: "archive.combine_orders",
                                            params: [$$("cross_records_db").ids[0], $$("cross_records_db").ids, e.user_info.id]
                                        };
                                        e.request(i, function(t) {
                                            var r = JSON.parse(t);
                                            if (e.check_response(r)) {
                                                r.result[0];
                                                $$("orders_head_arch").load()
                                            }
                                        }, !0)
                                    }
                                }, 1500)
                            }),
                            webix.event(t, webix.env.mouse.up, function() {
                                clearTimeout(t.timeOut),
                                t.classList.remove("load_cur")
                            })
                        }
                    }
                }]
            }]
        }, {
            hidden: !0,
            id: "arch_order_pnl",
            css: "pvm_toolbar_col",
            cols: [{
                view: "button",
                id: "return_archive_btn",
                value: "Назад",
                width: 110,
                click: function() {
                    $$("arch_head_pnl").show(),
                    $$("arch_order_pnl").hide(),
                    $$("archive_orders_head").show(),
                    $$("archive_order_body_tbl").hide(),
                    $$("orders_head_arch").load()
                }
            }, {
                view: "text",
                value: "",
                id: "main_search_ord",
                placeholder: "Поиск",
                old_search: "",
                timeout: null,
                width: window.innerWidth <= 1024 ? 100 : 402,
                keyPressTimeout: 700,
                on: {
                    onChange: function(e) {
                        console.log("onChange"),
                        this.config.old_search = e,
                        $$("orders_body_archive_db").filter(function(t) {
                            return t.TITLE.toUpperCase().indexOf(e.toUpperCase()) > -1
                        })
                    },
                    onTimedKeyPress: function() {
                        var e = this;
                        e.config.old_search !== e.getValue() && e.callEvent("onChange", [e.getValue()])
                    },
                    onKeyPress: function(e, t) {
                        40 === e && ($$("archive_order_body_tbl").select($$("archive_order_body_tbl").getFirstId()),
                        webix.UIManager.setFocus($$("archive_order_body_tbl")))
                    }
                }
            }, {
                width: 450
            }, {
                padding: 10,
                cols: [{
                    view: "icon",
                    id: "return_btn_htools_btn",
                    css: "return_btn htools_btn",
                    align: "right",
                    tooltip: "Вернуть на доработку",
                    click: function() {
                        var e = $$("orders_head_arch").getItem($$("orders_head_arch").getCursor());
                        $$("archive_orders_head").config.utils.return_ord(e.id, e.svod),
                        $$("return_archive_btn").config.click()
                    }
                }, {
                    width: 10
                }, {
                    view: "icon",
                    id: "send_btn_htools_btn",
                    css: "send_btn htools_btn",
                    align: "right",
                    tooltip: "Отправить",
                    click: function() {
                        var e = $$("orders_head_arch").getItem($$("orders_head_arch").getCursor());
                        $$("archive_orders_head").config.utils.send(e.id),
                        $$("return_archive_btn").config.click()
                    }
                }, {
                    width: 10
                }, {
                    view: "icon",
                    css: "copy_btn htools_btn",
                    tooltip: "Копировать",
                    click: function() {
                        var e = $$("orders_head_arch").getItem($$("orders_head_arch").getCursor());
                        $$("archive_orders_head").config.utils.copy(e.id),
                        $$("return_archive_btn").config.click()
                    }
                }, {
                    width: 10
                }, {
                    view: "icon",
                    css: "report_btn htools_btn",
                    align: "right",
                    tooltip: "Печать",
                    click: function() {
                        webix.ui(t).show()
                    }
                }, {
                    width: 20
                }, {
                    view: "icon",
                    id: "htrash_btn",
                    css: "htrash_btn htools_btn",
                    align: "right",
                    tooltip: "Удалить заказ, УДЕРЖИВАЙТЕ чтобы удалить",
                    on: {
                        onAfterRender: function() {
                            var e = this.getNode().querySelector("button");
                            e.timeOut = void 0,
                            webix.event(e, webix.env.mouse.down, function() {
                                e.classList.add("load_cur"),
                                this.timeOut = setTimeout(function() {
                                    e.classList.remove("load_cur"),
                                    $$("orders_head_arch").in_trash(),
                                    $$("return_archive_btn").config.click()
                                }, 1500)
                            }),
                            webix.event(e, webix.env.mouse.up, function() {
                                clearTimeout(e.timeOut),
                                e.classList.remove("load_cur")
                            })
                        }
                    }
                }]
            }, {}, {
                view: "label",
                align: "right",
                id: "order_list_mn",
                css: "order_list_mn oa"
            }, {
                view: "label",
                id: "order_summ",
                align: "right",
                autowidth: !0,
                on: {
                    onItemClick: function() {}
                }
            }]
        }]
    };
    return o
}),
define("models/adres_db", ["app"], function(e) {
    var t = new webix.DataCollection({
        id: "adres_db"
    });
    return t.load = function() {
        this.clearAll();
        var r = {
            method: "filters.get_adres_list",
            params: [void 0 !== e.user_info.sklad ? e.user_info.sklad : []]
        };
        e.request(r, function(r) {
            var o = JSON.parse(r);
            if (e.check_response(o)) {
                var i = o.result[0];
                t.parse(i),
                t.sort("1", "asc", "string")
            }
        }, !0)
    }
    ,
    t
}),
define("views/popups/adres_pp", ["app", "models/adres_db"], function(e, t) {
    var r = webix.ui({
        view: "popup",
        id: "adres_pp",
        height: 300,
        timeout: null,
        paddingY: 0,
        body: {
            paddingY: 0,
            rows: [{
                id: "adres_pp_tbl",
                view: "activeTable",
                scrollX: !1,
                header: !1,
                hover: "hover_table",
                autowidth: !0,
                columns: [{
                    id: "1",
                    header: "Адрес",
                    sort: "string",
                    width: 350
                }, {
                    id: "izb",
                    template: "{common.checkbox()}",
                    width: 50
                }],
                data: t,
                on: {
                    onItemClick: function(e) {
                        var t = this.getItem(e);
                        t.izb = 1 * !t.izb,
                        this.refresh(),
                        this.callEvent("onCheck", [e])
                    },
                    onCheck: function(e) {
                        this.getItem(e);
                        $$("orders_head_arch").load()
                    },
                    onresize: function() {
                        this.adjustRowHeight("1", !0)
                    },
                    onShow: function() {
                        this.adjustRowHeight("1", !0)
                    }
                }
            }, {
                height: 10
            }, {
                view: "button",
                css: "button_primary",
                value: "снять выделение",
                click: function() {
                    $$("adres_db").find(function(e) {
                        return e.izb = 0,
                        1 === e.izb
                    }),
                    $$("adres_pp_tbl").refresh(),
                    $$("orders_head_arch").load()
                }
            }]
        },
        on: {
            onShow: function() {}
        }
    });
    return {
        $ui: r
    }
}),
define("models/users_list_db", ["app"], function(e) {
    var t = new webix.DataCollection({
        id: "users_list_db"
    });
    return t.load = function() {
        this.clearAll();
        var r = {
            method: "user.get_user_list",
            params: []
        };
        e.request(r, function(r) {
            var o = JSON.parse(r);
            if (e.check_response(o)) {
                var i = o.result[0];
                t.parse(i),
                t.sort("1", "asc", "string")
            }
        }, !0)
    }
    ,
    t
}),
define("views/popups/author_pp", ["app", "models/users_list_db"], function(e, t) {
    var r = webix.ui({
        view: "popup",
        id: "author_pp",
        height: 300,
        timeout: null,
        paddingY: 0,
        body: {
            paddingY: 0,
            rows: [{
                id: "author_pp_tbl",
                view: "activeTable",
                scrollX: !1,
                header: !1,
                hover: "hover_table",
                autowidth: !0,
                columns: [{
                    id: "1",
                    header: "Адрес",
                    sort: "string",
                    width: 200
                }, {
                    id: "izb",
                    template: "{common.checkbox()}",
                    width: 50
                }],
                data: t,
                on: {
                    onItemClick: function(e) {
                        var t = this.getItem(e);
                        t.izb = 1 * !t.izb,
                        this.refresh(),
                        this.callEvent("onCheck", [e])
                    },
                    onCheck: function(e) {
                        this.getItem(e);
                        $$("orders_head_arch").load()
                    }
                }
            }, {
                height: 10
            }, {
                view: "button",
                css: "button_primary",
                value: "снять выделение",
                click: function() {
                    $$("users_list_db").find(function(e) {
                        return e.izb = 0,
                        1 === e.izb
                    }),
                    $$("author_pp_tbl").refresh(),
                    $$("orders_head_arch").load()
                }
            }]
        }
    });
    return {
        $ui: r
    }
}),
define("views/popups/period_pp", ["app"], function(e) {
    var t = webix.ui({
        view: "popup",
        id: "period_pp",
        scroll: !1,
        body: {
            rows: [{
                id: "period_pp_tbl",
                view: "list",
                height: 150,
                width: 150,
                scroll: !1,
                type: {
                    template: function(e) {
                        return "<div class='olpp_div'><p>" + e.name + "</p></span></div>"
                    }
                },
                data: [{
                    id: 1,
                    name: "Сегодня"
                }, {
                    id: 7,
                    name: "Неделя"
                }, {
                    id: 30,
                    name: "Месяц"
                }, {
                    id: 91,
                    name: "Квартал"
                }, {
                    id: 363,
                    name: "Год"
                }],
                on: {
                    onItemClick: function(e) {
                        var t = this.getItem(e);
                        this.select(e),
                        $$("avnd_list_bnt3").setValue(t.name),
                        $$("avnd_list_bnt3").refresh(),
                        $$("orders_head_arch").load(),
                        $$("period_pp").hide()
                    }
                }
            }]
        },
        on: {
            onShow: function() {
                "" === $$("period_pp_tbl").getSelectedId() && $$("period_pp_tbl").select(1)
            }
        }
    });
    return {
        $ui: t
    }
}),
define("models/trash_archive_db", ["app"], function(e) {
    var t = new webix.DataCollection({
        id: "trash_archive_db",
        datatype: "jsarray",
        fieldMap: {
            0: "id",
            1: "id_sklad",
            2: "comment",
            3: "dt",
            4: "n_order",
            5: "state",
            6: "summ",
            7: "id_user",
            8: "sklad",
            9: "user"
        },
        on: {}
    });
    return t.out_trash = function(t) {
        var r = {
            method: "orders.undel_order",
            params: [t, e.user_info.id]
        };
        e.request(r, function(r) {
            var o = JSON.parse(r);
            e.check_response(o) && (e.setCookie("lp_cur_ord", t),
            location.hash = "#!/price",
            location.reload())
        }, !0)
    }
    ,
    t.load = function() {
        this.clearAll();
        var r = {
            method: "orders.get_orders_trash",
            params: [void 0 !== e.user_info.sklad ? e.user_info.sklad : []]
        };
        e.request(r, function(r) {
            var o = JSON.parse(r);
            if (e.check_response(o)) {
                var i = o.result[0]
                  , n = i.map(function(e) {
                    var r, o = e.length, i = {};
                    for (r = 0; r < o; r++)
                        i[t.config.fieldMap[r]] = e[r];
                    return i
                });
                t.parse(n)
            }
        }, !0)
    }
    ,
    t
}),
define("views/popups/trash_arcive_pp", ["app", "models/trash_archive_db"], function(e, t) {
    var r = webix.ui({
        view: "popup",
        id: "trash_arcive_pp",
        body: {
            rows: [{
                id: "tresh_arcive_pp_tbl",
                view: "activeTable",
                scrollX: !1,
                navigation: !0,
                columns: [{
                    header: {
                        text: "Корзина",
                        colspan: 2
                    },
                    id: "izb",
                    template: "{common.undel()}",
                    width: 50
                }, {
                    id: "sklad",
                    template: "<div class='olpp_div'><p>#sklad#</p><p><span class='olpp_nm'>№ #n_order#</span>&nbsp;&nbsp;#user#<span class='olpp_sm'>#summ#</p></div>",
                    width: 400
                }],
                data: t,
                fixedRowHeight: !1,
                autoheight: !0,
                autowidth: !0,
                rowLineHeight: 70,
                rowHeight: 70,
                activeContent: {
                    undel: {
                        view: "icon",
                        css: "untrash_btn",
                        tooltip: "Востановить"
                    }
                },
                onClick: {
                    untrash_btn: function(e, r, o) {
                        var i = this.getItem(r.row);
                        t.out_trash(i.id),
                        t.remove(i.id),
                        0 === t.count() && $$("trash_archive_pp").hide()
                    }
                }
            }]
        },
        on: {
            onBeforeShow: function() {
                t.load(),
                this.resize()
            }
        }
    });
    return {
        $ui: r
    }
}),
define("views/archive_main_view", ["app", "views/tables/archive_orders_head", "views/popups/avnd_mode", "views/tables/archive_order_body_tbl", "views/windows/cross_records_win", "views/archive/main_toolbar_row", "views/popups/adres_pp", "views/popups/author_pp", "views/popups/period_pp", "views/popups/trash_arcive_pp", "models/cross_records_db"], function(e, t, r, o, i, n) {
    var s = {
        id: "archive_main_view",
        rows: [{
            id: "avm_header",
            padding: 10,
            cols: [{
                view: "icon",
                css: "logo_30",
                align: "left"
            }, {
                view: "label",
                label: 'Архив&nbsp;<span class="ver_info">' + e.config.version + "</span>",
                css: "text_warning logo_title",
                align: "left"
            }, {
                type: "spacer"
            }, {
                view: "label",
                align: "right",
                css: "user_name_title",
                on: {
                    onBeforeRender: function() {
                        this.config.label = e.user_info.name
                    }
                }
            }, {
                view: "button",
                css: "button_primary button_raised",
                width: 100,
                value: "Прайс",
                click: function() {
                    e.show("price")
                }
            }, {
                view: "button",
                css: "button_info",
                width: 100,
                value: "Выход",
                click: function() {
                    e.deleteCookie("plxlitesid"),
                    location.reload()
                }
            }]
        }, n, {
            id: "avm_body",
            type: "material",
            cols: [{
                css: "bg_clean"
            }, {
                width: window.innerWidth > 1170 ? 1170 : 980,
                id: "tp_test",
                cols: [t, o]
            }, {
                css: "bg_clean"
            }]
        }, {
            id: "avm_footer",
            height: 40,
            cols: [{
                view: "button",
                css: "button_info",
                autowidth: !0,
                value: "Кoрзина",
                popup: "trash_arcive_pp"
            }, {}]
        }]
    };
    return s.refresh_toolbar = function() {
        1 * $$("orders_head_arch").getItem($$("orders_head_arch").getCursor()).state === 26 ? ($$("htrash_btn").hide(),
        $$("send_btn_htools_btn").hide(),
        $$("return_btn_htools_btn").hide()) : ($$("htrash_btn").show(),
        $$("send_btn_htools_btn").show(),
        $$("return_btn_htools_btn").show())
    }
    ,
    s
}),
define("views/windows/login_win", ["app"], function(e) {
    var t = {
        view: "window",
        id: "login_win",
        head: "Вход",
        height: 300,
        width: 339,
        position: "center",
        modal: !0,
        body: {
            rows: [{
                view: "form",
                elements: [{
                    view: "text",
                    id: "login",
                    label: "",
                    labelWidth: "100",
                    value: "",
                    placeholder: "Логин",
                    on: {
                        onKeyPress: function(e, t) {
                            var r = $$("login").getValue();
                            13 === e && "" !== r && webix.UIManager.setFocus("password")
                        }
                    }
                }, {
                    view: "text",
                    id: "password",
                    label: "",
                    labelWidth: "100",
                    placeholder: "Пароль",
                    type: "password",
                    on: {
                        onKeyPress: function(e, t) {
                            var r = $$("password").getValue()
                              , o = $$("login").getValue();
                            13 === e && "" !== r && ("" !== o ? webix.UIManager.setFocus("indoor") : webix.UIManager.setFocus("login"))
                        }
                    }
                }]
            }, {
                padding: 2,
                cols: [{
                    view: "button",
                    id: "indoor",
                    value: "Войти",
                    login: function() {
                        var t = $$("password").getValue()
                          , r = $$("login").getValue();
                        "" !== t && "" !== r ? e.login(r, t) : webix.UIManager.setFocus("login")
                    },
                    on: {
                        onItemClick: function() {
                            $$("indoor").config.login()
                        }
                    }
                }]
            }]
        },
        on: {
            onShow: function() {
                webix.UIManager.setFocus("login")
            }
        }
    };
    return t
}),
define("views/archive", ["app", "views/windows/login_win", "models/adres_db", "models/avnd_list_db", "models/users_list_db", "views/archive_main_view"], function(e, t, r, o, i, n) {
    var s = {
        id: "mma",
        cols: [{
            width: window.innerWidth,
            id: "arc_main_layout",
            rows: []
        }]
    };
    return {
        $ui: s,
        $windows: [t],
        $oninit: function(t, s) {
            void 0 !== e.user_info.id ? (r.load(),
            o.load(),
            i.load(),
            $$("orders_head_arch").load(),
            $$("arc_main_layout").addView(n),
            $$("archive_orders_head").config.refresh_oper_vis()) : webix.alert("Ошибка авторизации")
        }
    }
}),
define("views/popups/edit_pp", ["app", "models/adres_db"], function(e, t) {
    var r = webix.ui({
        view: "popup",
        id: "edit_pp",
        height: 300,
        borderless: !0,
        body: {
            type: "form",
            width: 500,
            rows: [{
                id: "comb_view",
                rows: []
            }, {
                view: "text",
                label: "Коментарий",
                labelPosition: "top",
                id: "edit_pp_com"
            }, {
                cols: [{
                    view: "button",
                    css: "button_primary",
                    value: "отменить",
                    click: function() {
                        $$("edit_pp").hide()
                    }
                }, {
                    view: "button",
                    css: "button_success",
                    value: "сохранить",
                    click: function() {
                        e.setComment($$("edit_pp_com").getValue(), $$("edit_pp_adr").getValue(), $$("orders_head_db").getItem($$("orders_head_db").getCursor()).id),
                        $$("edit_pp").hide();
                        var t = $$("orders_head_db").getItem($$("orders_head_db").getCursor()).id;
                        $$("orders_head_db").load(),
                        $$("orders_head_db").setCursor(t)
                    }
                }]
            }]
        },
        on: {
            onShow: function() {
                var e = []
                  , r = $$("orders_head_db").getItem($$("orders_head_db").getCursor());
                t.filter(function(t) {
                    return e.push({
                        id: t[0],
                        value: t[1]
                    }),
                    !0
                }),
                $$("comb_view").reconstruct(),
                $$("comb_view").addView({
                    id: "edit_pp_adr",
                    view: "richselect",
                    label: "Адрес",
                    labelPosition: "top",
                    value: r["id_Склад"],
                    borderless: !0,
                    options: {
                        view: "gridsuggest",
                        data: e,
                        id: "edit_pp_adr_",
                        borderless: !0,
                        body: {
                            header: !1,
                            width: 400,
                            scroll: !0,
                            autoheight: !1,
                            autofocus: !0,
                            yCount: 5,
                            columns: [{
                                id: "value",
                                width: 400
                            }]
                        }
                    }
                }),
                $$("edit_pp_com").setValue(r["Коментарий"])
            }
        }
    });
    return {
        $ui: r
    }
}),
define("views/popups/order_list_pp", ["app"], function(e) {
    var t = webix.ui({
        view: "popup",
        id: "order_list_pp",
        body: {
            rows: [{
                id: "order_list_pp_tbl",
                view: "list",
                height: 350,
                width: 450,
                type: {
                    height: 55,
                    template: function(t) {
                        var r = $$("orders_head_db").getItem($$("orders_head_db").getCursor()).id
                          , o = t.id === r ? "text_info" : "";
                        return "<div class='olpp_div " + o + "'><p>" + t["Склад"] + "</p><p><span class='olpp_nm'>№ " + t["Номер"] + "</span>&nbsp;&nbsp;" + t["Пользователь"] + "<span class='olpp_sm'>" + e.moneyView(t["Сумма"]) + "</p></div>"
                    }
                },
                data: "",
                on: {
                    onItemClick: function(e) {
                        $$("orders_head_db").setCursor(e),
                        $$("main_search").setValue(""),
                        $$("main_search").config.old_search = ""
                    }
                }
            }]
        }
    });
    return $$("order_list_pp_tbl").data.sync($$("orders_head_db")),
    {
        $ui: t
    }
}),
define("models/order_stat_db", ["app"], function(e) {
    var t = new webix.DataCollection({
        id: "order_stat_db"
    });
    return t.refresh_menu = function() {
        var t = $$("vnd_panel_flx")
          , r = 0;
        $$("vnd_panel_flx").reconstruct(),
        this.sort({
            by: "name",
            dir: "asc",
            as: "mysort"
        }),
        this.data.each(function(o) {
            var i = {
                view: "toggle",
                id: "vnd_btn_" + o.code,
                offLabel: o.name + "(" + o.count + ") " + e.moneyView(o.summ).replace(/&nbsp;/g, " ") + "    ",
                onLabel: o.name + "(" + o.count + ") " + e.moneyView(o.summ).replace(/&nbsp;/g, " ") + "    ",
                css: "vnd_btn ",
                autowidth: !0,
                value: o.izb,
                click: function(t) {
                    var r = this
                      , o = (e.user_info,
                    t.replace("vnd_btn_", ""))
                      , i = $$("mode2").find(function(e) {
                        return e.code + "" == o + ""
                    })[0];
                    1 * e.user_info.options.select_mode !== 3 || 0 === r.getValue() && 1 * e.user_info.options.select_mode === 3 ? ($$("vnd_mode_sg").setValue("mode3"),
                    $$("vnd_mode_sg").callEvent("onItemClick", ["vnd_mode_sg"]),
                    $$("mode2").config.set_one(i.id, $$("mode2")),
                    webix.UIManager.setFocus("main_search")) : 1 === r.getValue() && 1 * e.user_info.options.select_mode === 3 && ($$("vnd_mode_sg").setValue("mode1"),
                    $$("vnd_mode_sg").callEvent("onItemClick", ["vnd_mode_sg"]),
                    webix.UIManager.setFocus("main_search"))
                }
            };
            if (o.summ < o.min_zakaz) {
                i.type = "iconButton",
                i.icon = "down_gr";
                var n = o.min_zakaz - o.summ;
                i.tooltip = "не хватает до минимального заказа: " + n + " р."
            }
            r = 1,
            t.addView(i)
        });
        var o = window.innerHeight - $$("vnd_panel_flx").getNode().offsetHeight - $$("pvm_header").getNode().offsetHeight - $$("pvm_toolbar").getNode().offsetHeight - $$("pvm_footer").getNode().offsetHeight;
        $$("tp_test").config.height = o - 20,
        $$("tp_test").resize();
        var i = $$("pvm_footer").getNode();
        i.style.position = "absolute",
        $$("pvm_footer").hide(),
        $$("pvm_footer").show()
    }
    ,
    t.my_parse = function(t) {
        void 0 === t && (t = [],
        this.data.each(function(e) {
            t.push(e)
        })),
        this.clearAll(),
        this.parse(t.map(function(t) {
            var r = 1 * e.user_info.options.select_mode
              , o = e.user_info.options.select_vnd;
            return t.izb = 0,
            1 === r && (t.izb = 1),
            2 === r && void 0 !== o[2][t.code + ""] && (t.izb = 1),
            3 === r && void 0 !== o[3][t.code + ""] && (t.izb = 1),
            t
        }))
    }
    ,
    t.load_timeout = void 0,
    t.load = function(r) {
        void 0 !== t.load_timeout && clearTimeout(t.load_timeout),
        t.load_timeout = setTimeout(function() {
            t.clearAll();
            var o = !0;
            if (void 0 === r) {
                var i = $$("orders_head_db").getItem($$("orders_head_db").getCursor());
                r = i.id,
                o = !1
            }
            var n = {
                method: "orders.get_order_stat",
                params: [r]
            };
            e.request(n, function(r) {
                var o = JSON.parse(r);
                if (e.check_response(o)) {
                    var i = o.result[0];
                    t.my_parse(i);
                    try {
                        i.length > 0 ? $$("vnd_panel").show() : $$("vnd_panel").hide()
                    } catch (n) {}
                    try {
                        t.refresh_menu()
                    } catch (n) {}
                    t.sort({
                        by: "name",
                        dir: "asc",
                        as: "mysort"
                    })
                }
            }, !1)
        }, 250)
    }
    ,
    t
}),
define("models/orders_error_db", ["app"], function(e) {
    var t = new webix.DataCollection({
        id: "orders_error_db",
        datatype: "jsarray",
        on: {
            onAfterCursorChange: function(e) {
                console.log("onAfterCursorChange");
                var t = this.getItem(e)
                  , r = this.getItem(this.getPrevId(e))
                  , o = this.getItem(this.getNextId(e));
                $$("f_reorder_rec_l").setValue(void 0 !== r ? r.title : "");
                try {
                    $$("c_reorder_rec_l").setValue("<span style='color: red;font-weight: bold !important;font-size: medium;'>" + t.sp_count + "</span>: " + t.title + " <span class='vendor_title_reord'>{" + t.vendor + "}</span><br><span style='color: #53a1df;'>" + t.stitle + "</span>"),
                    $$("c_reorder_rec_l").config.tooltip = t.title + " (" + t.vendor + ")"
                } catch (i) {}
                $$("c_reorder_rec_l").refresh(),
                $$("n_reorder_rec_l").setValue(void 0 !== o ? o.title : "");
                var n = ""
                  , s = ""
                  , a = "";
                try {
                    n = Number(t.title.replace(/\D+/g, "")) + "",
                    s = /(.{1}|.)/g,
                    a = t.title.split(" ")[0],
                    "" === t.src_str ? (n = n.match(s),
                    n.map(function(e) {
                        a.indexOf(e) === -1 && (a += " " + e)
                    })) : a = t.src_str
                } catch (i) {
                    console.log(i)
                }
                var d = $$("main_search").getValue()
                  , c = a.replace(/"/g, "");
                $$("main_search").setValue(c),
                webix.UIManager.setFocus("main_search"),
                c === d && $$("hide_seller_ch").callEvent("onChange", [$$("hide_seller_ch").getValue()])
            }
        }
    });
    return t
}),
define("views/price/reorder_pnl", ["app", "models/orders_error_db"], function(e, t) {
    var r = {
        view: "window",
        headHeight: 1,
        padding: 0,
        id: "reorder_pnl",
        height: 110,
        body: {
            width: 654,
            cols: [{
                padding: 0,
                rows: [{
                    height: 30,
                    padding: 0,
                    cols: [{
                        view: "checkbox",
                        id: "hide_seller_ch",
                        label: "Исключить пост.",
                        labelWidth: 130,
                        labelAlign: "right",
                        value: 0,
                        on: {
                            onChange: function(e, t) {
                                $$("price_db").filter(function(t) {
                                    return !e || t.SCODE + "" != $$("orders_error_db").getItem($$("orders_error_db").getCursor()).scode + ""
                                })
                            }
                        }
                    }, {}, {
                        view: "button",
                        value: "Закрыть",
                        click: function() {
                            t.clearAll(),
                            $$("reorder_pnl").close(),
                            $$("order_summ_pp_tbl").find(function(e) {
                                e.select = 0
                            }),
                            $$("order_summ_pp_tbl").refresh()
                        }
                    }]
                }, {
                    cols: [{
                        rows: [{
                            view: "label",
                            label: "Label",
                            id: "f_reorder_rec_l",
                            css: "reorder_title f_smaller"
                        }, {
                            view: "label",
                            label: "Label",
                            id: "c_reorder_rec_l",
                            css: "reorder_title"
                        }, {
                            view: "label",
                            label: "Label",
                            id: "n_reorder_rec_l",
                            css: "reorder_title f_smaller"
                        }]
                    }, {
                        width: 40,
                        padding: "0 0 0 5",
                        rows: [{
                            view: "icon",
                            css: "up_btn htools_btn",
                            click: function() {
                                var e = $$("orders_error_db").getCursor();
                                $$("orders_error_db").getFirstId() !== e ? $$("orders_error_db").setCursor($$("orders_error_db").getPrevId(e)) : webix.UIManager.setFocus("main_search")
                            },
                            hotkey: "Ctrl+Up"
                        }, {
                            view: "icon",
                            css: "down_btn htools_btn",
                            click: function() {
                                var e = $$("orders_error_db").getCursor();
                                $$("orders_error_db").getLastId() !== e ? $$("orders_error_db").setCursor($$("orders_error_db").getNextId(e)) : webix.UIManager.setFocus("main_search")
                            },
                            hotkey: "Ctrl+Down"
                        }]
                    }]
                }]
            }]
        }
    };
    return r
}),
define("views/popups/order_summ_pp", ["app", "models/order_stat_db", "views/price/reorder_pnl"], function(e, t, r) {
    var o = webix.ui({
        view: "popup",
        id: "order_summ_pp",
        width: 380,
        body: {
            width: 380,
            rows: [{
                cols: [{
                    view: "button",
                    css: "button_info button_raised",
                    id: "harch_btn_s",
                    value: "Заказ в архив"
                }]
            }, {
                height: 20
            }, {
                id: "order_summ_pp_tbl",
                view: "datatable",
                scrollX: !1,
                header: !1,
                height: 200,
                hover: "hover_table",
                navigation: !0,
                type: {
                    reord_cls: function(e) {
                        return 1 === e.select ? "togli" : ""
                    },
                    reord_title: function(e) {
                        return 1 === e.select ? "togli" : ""
                    }
                },
                columns: [{
                    id: "izb",
                    template: "{common.checkbox()}",
                    width: 45
                }, {
                    id: "name",
                    template: "<div class='vnd_list_menu'><span style='width: 90px;'>#name#</span><span style='width: 50px;'>#count#</span><span style='width: 70px;'>{common.sp_summa_render_osp()}</span><span class='reorder_zak_btn {common.reord_cls()}' id='rzb_#code#' title='{common.reord_title()}'></span></div>",
                    width: 300
                }],
                data: t,
                on: {
                    onCheck: function(t, r, o) {
                        var i = (this.getItem(t).code,
                        e.user_info);
                        i.options.select_vnd[2] = {},
                        this.data.each(function(e) {
                            1 === e.izb ? i.options.select_vnd[2][e.code + ""] = 1 : delete i.options.select_vnd[2][e.code + ""]
                        }),
                        e.setUserInfoOptions(i),
                        $$("vnd_mode_sg").setValue("mode2"),
                        $$("vnd_mode_sg").callEvent("onItemClick", ["vnd_mode_sg"]),
                        $$("order_summ_pp").callEvent("onShow")
                    },
                    onItemClick: function(t) {
                        var r = this.getItem(t)
                          , o = $$("mode2").find(function(e) {
                            return e.code + "" == r.code + ""
                        })[0];
                        1 * e.user_info.options.select_mode !== 3 || 0 === r.izb && 1 * e.user_info.options.select_mode === 3 ? ($$("vnd_mode_sg").setValue("mode3"),
                        $$("vnd_mode_sg").callEvent("onItemClick", ["vnd_mode_sg"]),
                        $$("mode2").config.set_one(o.id, $$("mode2"))) : 1 === r.izb && 1 * e.user_info.options.select_mode === 3 && ($$("vnd_mode_sg").setValue("mode1"),
                        $$("vnd_mode_sg").callEvent("onItemClick", ["vnd_mode_sg"])),
                        $$("order_summ_pp").callEvent("onShow")
                    }
                },
                onClick: {
                    reorder_zak_btn: function(t, o) {
                        var i = this.getItem(o)
                          , n = i.code
                          , s = i.select
                          , a = (e.user_info,
                        $$("orders_error_db"));
                        return 1 === s ? (i.select = 0,
                        a.find(function(e) {
                            return e.scode == n && a.remove(e.id),
                            !1
                        }),
                        0 === a.count() ? $$("reorder_pnl").close() : a.getFirstId() !== a.getCursor() ? a.setCursor(a.getFirstId()) : a.callEvent("onAfterCursorChange", [a.getFirstId()])) : (i.select = 1,
                        $$("orders_body_db").find(function(e) {
                            return e.SCODE == n && $$("orders_error_db").add({
                                title: e.TITLE,
                                "new": e.SP_COUNT,
                                old: e.SP_COUNT,
                                scode: e.SCODE,
                                src_str: e.SRC_STR,
                                vendor: e.VENDOR,
                                stitle: e.STITLE,
                                acode: e.ACODE,
                                sp_count: e.SP_COUNT
                            }),
                            !1
                        }),
                        void 0 === $$("reorder_pnl") && webix.ui(r).show(),
                        a.getFirstId() !== a.getCursor() ? a.setCursor(a.getFirstId()) : a.callEvent("onAfterCursorChange", [a.getFirstId()])),
                        $$("order_summ_pp_tbl").refresh(),
                        !1
                    }
                }
            }, {
                height: 20
            }, {
                view: "button",
                id: "select_all_vnd",
                hidden: !0,
                css: "button_primary button_raised",
                value: "Выделить все",
                click: function() {
                    var t = e.user_info;
                    t.options.select_vnd[2] = {},
                    $$("order_summ_pp_tbl").data.each(function(e) {
                        t.options.select_vnd[2][e.code + ""] = 1
                    }),
                    e.setUserInfoOptions(t),
                    $$("vnd_mode_sg").setValue("mode2"),
                    $$("vnd_mode_sg").callEvent("onItemClick", ["vnd_mode_sg"]),
                    $$("order_summ_pp").callEvent("onShow")
                }
            }]
        },
        on: {
            onShow: function() {
                $$("order_summ_pp_tbl").find(function(e) {
                    return 0 === e.izb
                }).length > 0 ? $$("select_all_vnd").show() : $$("select_all_vnd").hide();
                var e = $$("harch_btn_s").getNode().querySelector("button")
                  , t = $$("orders_head_db");
                e.timeOut = void 0,
                webix.event(e, webix.env.mouse.down, function() {
                    e.classList.add("load_cur1"),
                    e.timeOut = setTimeout(function() {
                        e.classList.contains("load_cur1") && (e.classList.remove("load_cur1"),
                        t.in_archive())
                    }, 1500)
                }),
                webix.event(e, webix.env.mouse.up, function() {
                    clearTimeout(e.timeOut),
                    e.classList.remove("load_cur1")
                })
            }
        }
    });
    return {
        $ui: o
    }
}),
define("models/vnds_list_prc_db", ["app"], function(e) {
    var t = new webix.DataCollection({
        id: "vnds_list_prc_db"
    });
    return t.my_parse = function(t) {
        void 0 === t && (t = [],
        this.data.each(function(e) {
            t.push(e)
        })),
        this.clearAll(),
        this.parse(t.map(function(t) {
            var r = 1 * e.user_info.options.select_mode
              , o = e.user_info.options.select_vnd;
            return t.izb = 0,
            2 === r && void 0 !== o[2][t.code + ""] && (t.izb = 1),
            t
        }))
    }
    ,
    t.load_timeout = void 0,
    t.load = function() {
        void 0 !== t.load_timeout && (console.log("otmenil"),
        clearTimeout(t.load_timeout)),
        t.load_timeout = setTimeout(function() {
            console.log("vipolnil"),
            t.clearAll();
            var r = $$("orders_head_db").getItem($$("orders_head_db").getCursor())
              , o = {
                method: "vnds.get_vnd_stat_list",
                params: [r["id_Склад"]]
            };
            e.request(o, function(r) {
                var o = JSON.parse(r);
                if (e.check_response(o)) {
                    var i = o.result[0];
                    t.my_parse(i),
                    t.sort({
                        by: "name",
                        dir: "asc",
                        as: "mysort"
                    })
                }
            }, !1)
        }, 250)
    }
    ,
    t
}),
define("models/trash_db", ["app", "models/vnds_list_prc_db", "models/order_stat_db"], function(e, t, r) {
    var o = new webix.DataCollection({
        id: "trash_db",
        datatype: "jsarray",
        fieldMap: {
            0: "id",
            1: "id_sklad",
            2: "comment",
            3: "dt",
            4: "n_order",
            5: "state",
            6: "summ",
            7: "id_user",
            8: "sklad",
            9: "user"
        },
        on: {}
    });
    return o.out_trash = function(t) {
        var r = {
            method: "orders.undel_order",
            params: [t, e.user_info.id]
        };
        e.request(r, function(r) {
            var o = JSON.parse(r);
            e.check_response(o) && ($$("orders_head_db").load(),
            $$("orders_head_db").count() > 0 && $$("orders_head_db").setCursor(t))
        }, !0)
    }
    ,
    o.get_report = function(t) {
        var r, i, n, s, a, d, c, l = this, _ = $$("tresh_pp_tbl").getSelectedId().id, u = "<div class='report'>", p = 0, h = 0;
        if (e.request({
            method: "orders.get_order_head",
            params: [_]
        }, function(t) {
            var o = JSON.parse(t);
            if (e.check_response(o)) {
                var i = o.result;
                r = i.map(function(e) {
                    var t, r = e.length, o = {};
                    for (t = 0; t < r; t++)
                        o[$$("orders_head_db").config.fieldMap[t]] = e[t];
                    return o
                })[0]
            }
        }, !0),
        e.request({
            method: "orders.get_order_recs",
            params: [_]
        }, function(t) {
            var r = JSON.parse(t);
            if (e.check_response(r)) {
                var o = r.result[0];
                i = o.map(function(e) {
                    var t, r = e.length, o = {};
                    for (t = 0; t < r; t++)
                        o[$$("orders_body_db").config.fieldMap[t]] = e[t];
                    return o
                })
            }
        }, !0),
        n = i,
        e.request({
            method: "filters.get_sklad_info",
            params: [r["id_Склад"]]
        }, function(t) {
            var r = JSON.parse(t);
            e.check_response(r) && (d = r.result[0])
        }, !0),
        void 0 === t && (t = 2),
        t = 1 * t,
        1 === t && (c = r["Дата"].split(" "),
        c = c[0].split("-").reverse(),
        c[1] = e.month_str[1 * c[1]][0],
        c = c.join(" "),
        u += "<h1>Заказ " + r["Склад"].toUpperCase().replace("'", "") + " №" + r["Номер"] + " от " + c + " г.</h1>",
        u += "<p><span class='pull-left'>" + d[7] + ", <strong>" + d[2] + "</strong></span><span class='pull-right'>" + r["Коментарий"] + "</span></p>",
        u += "<p>&nbsp</p>",
        u += ["<table><thead>", "<tr>", '<th class="">№</th>', '<th class="">товар</th>', '<th class="" width="60">кол-во</th>', '<th class="" width="70">цена</th>', '<th class="" width="80">сумма</th>', "</tr>", "</thead><tbody>"].join(),
        s = 1,
        i.eachRow(function(t) {
            h = s;
            var r = i.getItem(t);
            u += '<tr><td class="col_text_center">' + s + "</td><td><strong>" + r.TITLE + "</strong> <span class='report_grey_font'>(" + life_render(r) + ", " + r.VENDOR + ')</span></td><td class="col_text_right">' + r.SP_COUNT + '</td><td class="col_text_right">' + e.moneyView(r.PRICE) + '</td><td class="col_text_right">' + e.moneyView(r.SP_SUMMA) + "</td></tr>",
            s += 1,
            p += r.SP_SUMMA
        }),
        u += '<tr><td class="itog col_text_right" colspan=4>ИТОГО:</td><td class="summa col_text_right">' + e.moneyView(p) + "</td></tr>",
        u += "</tbody></table><p>&nbsp;</p>",
        u += "<p style = 'font-size: larger;'>Всего наименований товаров: " + h + ", на сумму " + e.moneyView(p) + " руб.</p>",
        u += "<p style = 'border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p>",
        u += "<p style = 'font-size: larger;'>Автор: " + r["Пользователь"] + "</p>",
        u += "<p style = 'border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p></div>",
        $$("report_table").$view.innerHTML = u),
        2 === t && (a = l.get_svod_info(r["Номер"]),
        c = a[3].split(" "),
        c = c[0].split("-").reverse(),
        c[1] = e.month_str[1 * c[1]][0],
        c = c.join(" "),
        u += "<h1>Заказ сводный  №" + a[4] + " от " + c + " г.</h1>",
        u += "<p><span class='pull-left'>" + d[7] + ", <strong>" + d[2] + "</strong></span><span class='pull-right'>" + a[2] + "</span></p>",
        u += "<p>&nbsp</p>",
        u += ["<table><thead>", "<tr>", '<th class="">№</th>', '<th class="">товар</th>', '<th class="">пост</th>', '<th class="" width="60">кол-во</th>', '<th class="" width="70">цена</th>', '<th class="" width="80">сумма</th>', "</tr>", "</thead><tbody>"].join(""),
        s = 1,
        n.filter(function(t) {
            return h = s,
            u += '<tr><td class="col_text_center">' + s + "</td><td><strong>" + t.TITLE + "</strong> <span class='report_grey_font'>(" + life_render(t) + ", " + t.VENDOR + ')</span></td><td class="col_text_right">' + t.STITLE.replace("'", "") + '</td></td><td class="col_text_right">' + t.SP_COUNT + '</td><td class="col_text_right">' + e.moneyView(t.PRICE) + '</td><td class="col_text_right">' + e.moneyView(t.SP_SUMMA) + "</td></tr>",
            s += 1,
            p += t.SP_SUMMA,
            !0
        }),
        u += '<tr><td class="itog col_text_right" colspan=5>ИТОГО:</td><td class="summa col_text_right">' + e.moneyView(p) + "</td></tr>",
        u += "</tbody></table><p>&nbsp;</p>",
        u += "<p style = 'font-size: larger;'>Всего наименований товаров: " + h + ", на сумму " + e.moneyView(p) + " руб.</p>",
        u += "<p style='border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p>",
        u += "<p style = 'font-size: larger;'>Автор: " + r["Пользователь"] + "</p>",
        u += "<p style='border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p></div>",
        $$("report_table").$view.innerHTML = u),
        3 === t) {
            a = l.get_svod_info(r["Номер"]),
            c = a[3].split(" "),
            c = c[0].split("-").reverse(),
            c[1] = e.month_str[1 * c[1]][0],
            c = c.join(" "),
            u += "<h1>Заказ сводный  №" + a[4] + " от " + c + " г.</h1>",
            u += "<p><span class='pull-left'>" + d[7] + ", <strong>" + d[2] + "</strong></span><span class='pull-right'>" + a[2] + "</span></p>",
            u += "<p>&nbsp</p>",
            u += ["<table><thead>", "<tr>", '<th class="">№</th>', '<th class="">товар</th>', '<th class="" width="60">кол-во</th>', '<th class="" width="70">цена</th>', '<th class="" width="80">сумма</th>', "</tr>", "</thead><tbody>"].join(""),
            s = 1;
            var f = 0
              , v = 0
              , m = "";
            n.filter(function(t) {
                if (f !== t.SCODE) {
                    0 !== f && (u += '<tr><td class="itog col_text_right" colspan=4>' + m.replace("'", "") + ':</td><td class="summa col_text_right">' + e.moneyView(v) + "</td></tr>");
                    var i = o.get_svod_info(t.ID_ORDER);
                    c = i[3].split(" "),
                    c = c[0].split("-").reverse(),
                    c[1] = e.month_str[1 * c[1]][0],
                    c = c.join(" "),
                    u += '<tr><td class="itog" colspan=5>' + t.STITLE.toUpperCase().replace("'", "") + ' <span class="report_font1">№' + r["Номер"] + " от " + c + " г.</span></td></tr>",
                    s = 1,
                    v = 0
                }
                return m = t.STITLE.replace("'", ""),
                f = t.SCODE,
                h += 1,
                u += '<tr><td class="col_text_center">' + s + "</td><td><strong>" + t.TITLE + "</strong> <span class='report_grey_font'>(" + life_render(t) + ", " + t.VENDOR + ')</span></td><td class="col_text_right">' + t.SP_COUNT + '</td><td class="col_text_right">' + e.moneyView(t.PRICE) + '</td><td class="col_text_right">' + e.moneyView(t.SP_SUMMA) + "</td></tr>",
                s += 1,
                p += t.SP_SUMMA,
                v += t.SP_SUMMA,
                !0
            }),
            0 !== f && (u += '<tr><td class="itog col_text_right" colspan=4>' + m + ':</td><td class="summa col_text_right">' + e.moneyView(v) + "</td></tr>"),
            u += '<tr><td class="itog col_text_right" colspan=4>ИТОГО:</td><td class="summa col_text_right">' + e.moneyView(p) + "</td></tr>",
            u += "</tbody></table><p>&nbsp;</p>",
            u += "<p style = 'font-size: larger;'>Всего наименований товаров: " + h + ", на сумму " + e.moneyView(p) + " руб.</p>",
            u += "<p style='border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p>",
            u += "<p style = 'font-size: larger;'>Автор: " + r["Пользователь"] + "</p>",
            u += "<p style='border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p></div>",
            $$("report_table").$view.innerHTML = u
        }
    }
    ,
    o.get_svod_info = function(t) {
        var r, o = {
            method: "orders.get_order_head",
            params: [t]
        };
        return e.request(o, function(t) {
            var o = JSON.parse(t);
            if (e.check_response(o)) {
                var i = o.result[0];
                r = i
            }
        }, !0),
        r
    }
    ,
    o.load = function() {
        this.clearAll();
        var t = {
            method: "orders.get_orders_trash",
            params: [void 0 !== e.user_info.sklad ? e.user_info.sklad : []]
        };
        e.request(t, function(t) {
            var r = JSON.parse(t);
            if (e.check_response(r)) {
                var i = r.result[0]
                  , n = i.map(function(e) {
                    var t, r = e.length, i = {};
                    for (t = 0; t < r; t++)
                        i[o.config.fieldMap[t]] = e[t];
                    return i
                });
                o.parse(n),
                $$("orders_head_win_tb").sort({
                    by: "Дата",
                    dir: "desc",
                    as: "mysort"
                })
            }
        }, !0)
    }
    ,
    o
}),
define("views/windows/report_price_win", ["app"], function(e) {
    var t = {
        view: "window",
        id: "report_price_win",
        headHeight: 0,
        fullscreen: !0,
        body: {
            rows: [{
                css: "no_print",
                autoheight: !0,
                cols: [{}, {
                    view: "segmented",
                    id: "report_win_segmented",
                    width: 430,
                    value: 2,
                    options: [{
                        id: "2",
                        value: "Краткий"
                    }, {
                        id: "3",
                        value: "Полный"
                    }],
                    on: {
                        onItemClick: function(e, t) {
                            var r = this.getValue();
                            1 * r > 1 ? ($$("reset_flt").hide(),
                            $$("free_space").config.width = 300,
                            $$("free_space").resize()) : ($$("reset_flt").show(),
                            $$("free_space").config.width = 100,
                            $$("free_space").resize());
                            var o = void 0 === $$("report_price_win").cur_id ? "orders_head_db" : "trash_db";
                            $$(o).get_report(r)
                        }
                    }
                }, {
                    width: 100,
                    id: "free_space"
                }, {
                    view: "button",
                    value: "Сбросить фильтр",
                    id: "reset_flt",
                    width: 200,
                    css: "button_warning",
                    click: function() {
                        var e = void 0 === $$("report_price_win").cur_id ? "orders_head_db" : "trash_db";
                        $$(e).get_report(1),
                        this.hide(),
                        $$("free_space").config.width = 300,
                        $$("free_space").resize()
                    }
                }, {
                    view: "button",
                    value: "Печатать",
                    id: "print_btn",
                    width: 150,
                    css: "button_success",
                    click: function() {
                        text = document.querySelector(".report").innerHTML,
                        printwin = open("", "printwin", "width=1024,height=780"),
                        printwin.document.open(),
                        printwin.document.writeln('<html><head><title></title><link rel="stylesheet" type="text/css" href="assets/print.css" media="print" /><link rel="stylesheet" type="text/css" href="assets/print.css"  /></head><body onload=print();close();>'),
                        printwin.document.writeln('<div class="report">' + text + "</div>"),
                        printwin.document.writeln("</body></html>"),
                        printwin.document.close()
                    }
                }, {
                    view: "button",
                    value: "Закрыть",
                    width: 150,
                    css: "button_info",
                    click: function() {
                        $$("report_price_win").close()
                    }
                }, {}]
            }, {
                id: "report_table",
                padding: 10,
                template: ""
            }]
        },
        on: {
            onShow: function() {
                var e = void 0 === this.cur_id ? "orders_head_db" : "trash_db";
                $$(e).get_report(2),
                $$("reset_flt").hide(),
                $$("free_space").config.width = 300,
                $$("free_space").resize(),
                document.querySelector("[view_id=report_price_win]").focus(),
                document.querySelector("[view_id=report_price_win]").onkeydown = function(e) {
                    if (80 === e.keyCode && e.ctrlKey)
                        return $$("print_btn").config.click(),
                        !1
                }
            }
        }
    };
    return t
}),
define("views/popups/trash_pp", ["app", "models/trash_db", "views/windows/report_price_win"], function(e, t, r) {
    var o = webix.ui({
        view: "popup",
        id: "trash_pp",
        body: {
            rows: [{
                id: "tresh_pp_tbl",
                view: "activeTable",
                scrollX: !1,
                select: "row",
                hover: "hover_table",
                navigation: !0,
                columns: [{
                    header: {
                        text: "Корзина",
                        colspan: 2
                    },
                    id: "izb",
                    template: "{common.undel()}",
                    width: 50
                }, {
                    id: "sklad",
                    template: "<div class='olpp_div'><p>#sklad#</p><p><span class='olpp_nm'>№ #n_order#</span>&nbsp;&nbsp;#user#<span class='olpp_sm'>#summ#</p></div>",
                    width: 400
                }],
                data: t,
                fixedRowHeight: !1,
                autoheight: !0,
                autowidth: !0,
                rowLineHeight: 70,
                rowHeight: 70,
                activeContent: {
                    undel: {
                        view: "icon",
                        css: "untrash_btn"
                    }
                },
                onClick: {
                    untrash_btn: function(e, r, o) {
                        var i = this.getItem(r.row);
                        return t.out_trash(i.id),
                        t.remove(i.id),
                        0 === t.count() && $$("trash_pp").hide(),
                        !1
                    }
                },
                on: {
                    onItemClick: function(e) {
                        var t = this.getItem(e);
                        void 0 === $$("report_price_win") && webix.ui(r),
                        $$("report_price_win").cur_id = t.id,
                        $$("report_price_win").show(),
                        console.log(t.id)
                    }
                }
            }]
        },
        on: {
            onBeforeShow: function() {
                t.load(),
                this.resize()
            }
        }
    });
    return {
        $ui: o
    }
}),
define("views/popups/vnd_mode", ["app", "models/vnds_list_prc_db"], function(e, t) {
    var r = webix.ui({
        view: "popup",
        id: "vnd_mode",
        height: 300,
        width: 280,
        timeout: null,
        body: {
            rows: [{
                view: "segmented",
                id: "vnd_mode_sg",
                value: "mode3",
                multiview: !0,
                options: [{
                    value: "Все",
                    id: "mode1"
                }, {
                    value: "Избранное",
                    id: "mode2"
                }],
                on: {
                    onItemClick: function(t, r) {
                        var o = $$(t).getValue().replace("mode", "")
                          , i = e.user_info
                          , n = this;
                        i.options.select_mode = o,
                        e.setUserInfoOptions(i),
                        1 * o === 2 ? $$("mode2").clearSelection() : 1 * o === 1 && $$("mode1").clearSelection(),
                        $$("vnds_list_prc_db").my_parse(),
                        $$("order_stat_db").my_parse(),
                        $$("order_stat_db").refresh_menu(),
                        $$("vnd_list_bnt").config.label = e.get_select_mode_title(),
                        $$("vnd_list_bnt").refresh(),
                        clearTimeout(n.config.timeout),
                        n.config.timeout = setTimeout(function() {
                            "" !== $$("main_search").getValue() && ($$("price_db").clear_data(),
                            $$("price_db").load());
                            try {
                                $$("orders_body_db").load()
                            } catch (e) {}
                        }, 500)
                    }
                }
            }, {
                id: "mymulti",
                animate: !1,
                cells: [{
                    id: "mode1",
                    view: "datatable",
                    scrollX: !1,
                    header: !1,
                    hover: "hover_table",
                    navigation: !0,
                    select: "row",
                    columns: [{
                        id: "name",
                        width: 220,
                        template: "<div class='vnd_list_menu'><span style='width: 90px;'>#name#</span><span style='width: 50px;'>#count#</span><span style='width: 50px;'>#date#</span></div>"
                    }],
                    data: t,
                    on: {
                        onItemClick: function(e) {
                            $$("mode2").config.set_one(e, this)
                        }
                    }
                }, {
                    id: "mode2",
                    view: "activeTable",
                    scrollX: !1,
                    header: !1,
                    hover: "hover_table",
                    select: "row",
                    columns: [{
                        id: "name",
                        width: 220,
                        template: "<div class='vnd_list_menu'><span style='width: 90px;'>#name#</span><span style='width: 50px;'>#count#</span><span style='width: 50px;'>#date#</span></div>"
                    }, {
                        id: "izb",
                        template: "{common.checkbox()}"
                    }],
                    data: t,
                    set_one: function(t, r) {
                        var o = r.getItem(t)
                          , i = o.code
                          , n = e.user_info;
                        n.options.select_vnd[3] = {},
                        n.options.select_vnd[3][i + ""] = o.name,
                        1 * n.options.select_mode === 2 && ($$("vnd_mode_sg").setValue("mode1"),
                        $$("vnd_mode_sg").callEvent("onItemClick", ["vnd_mode_sg"])),
                        $$("vnd_mode_sg").setValue("mode3"),
                        $$("vnd_mode_sg").callEvent("onItemClick", ["vnd_mode_sg"]),
                        $$("mode1").showItem(t),
                        $$("mode1").select(t)
                    },
                    on: {
                        onItemClick: function(e) {
                            this.config.set_one(e, this)
                        },
                        onCheck: function(t, r, o) {
                            var i = this.getItem(t).code
                              , n = e.user_info;
                            1 === o ? n.options.select_vnd[2][i + ""] = 1 : delete n.options.select_vnd[2][i + ""],
                            e.setUserInfoOptions(n),
                            $$("vnd_mode_sg").callEvent("onItemClick", ["vnd_mode_sg"])
                        }
                    }
                }]
            }]
        },
        on: {
            onShow: function() {
                if ($$("vnd_mode_sg").setValue("mode" + e.user_info.options.select_mode),
                1 * e.user_info.options.select_mode === 3) {
                    var t = $$("mode1").find(function(t) {
                        return t.code + "" == Object.keys(e.user_info.options.select_vnd[3])[0] + ""
                    });
                    $$("mode1").showItem(t[0].id),
                    $$("mode1").select(t[0].id)
                }
            }
        }
    });
    return {
        $ui: r
    }
}),
define("models/price_db", ["app"], function(e) {
    var t = new webix.DataCollection({
        id: "price_db",
        datatype: "jsarray",
        datafetch: 50,
        fieldMap: {
            0: "ACODE",
            1: "DT",
            2: "ID_SPR",
            3: "LIFE",
            4: "MAXPACK",
            5: "MINZAK",
            6: "NDS",
            7: "PRICE",
            8: "RATE",
            9: "REESTR",
            10: "REST",
            11: "SCODE",
            12: "SP_COUNT",
            13: "SP_DATE",
            14: "SP_PRICE",
            15: "SP_SUMMA",
            16: "STITLE",
            17: "TITLE",
            18: "VENDOR",
            19: "SP_TITLE",
            20: "SP_VENDOR",
            21: "SP_MNN",
            22: "OLD_ZAK"
        },
        sort_conf: ["PRICE", "ASC"]
    });
    return t.load_flag = !1,
    t.start = 0,
    t.clear_data = function() {
        console.log("clear_data"),
        this.start = 0,
        this.load_flag = !1,
        this.clearAll()
    }
    ,
    t.load = function(r, o) {
        if (t.load_flag !== !0) {
            t.load_flag = !0,
            webix.extend($$("price_tbl"), webix.ProgressBar),
            $$("price_tbl").showProgress({
                type: "bottom"
            }),
            void 0 === r && (r = $$("main_search").getValue());
            var i, n = $$("orders_head_db").getItem($$("orders_head_db").getCursor()), s = [];
            1 * e.user_info.options.select_mode !== 1 && (s = Object.keys(e.user_info.options.select_vnd[e.user_info.options.select_mode])),
            0 === s.length && $$("vnds_list_prc_db").filter(function(e) {
                return s.push(e.code),
                !0
            });
            var a = []
              , d = $$("adres_db").find(function(e) {
                return e[0] === n["id_Склад"]
            })[0][2];
            i = {
                method: "prices.get_search",
                params: [t.start, t.config.datafetch, r, n["id_Склад"], s, $$("orders_head_db").getItem($$("orders_head_db").getCursor()).id, a, t.config.sort_conf, $$("check_seller_name").getValue(), $$("check_mnn").getValue(), $$("check_vnd").getValue(), 1 === $$("check_old_count").getValue() ? $$("value_old_count").getValue() : 0, d]
            },
            e.request(i, function(r) {
                var o = JSON.parse(r);
                if (e.check_response(o)) {
                    var i = o.result[0]
                      , n = i.map(function(e) {
                        var r, o = e.length, i = {};
                        for (r = 0; r < o; r++)
                            i[t.config.fieldMap[r]] = e[r];
                        return i
                    });
                    n.length > 0 ? (0 === t.count() ? (t.parse(n),
                    t.start += t.config.datafetch) : ($$("price_tbl").data.unsync($$("price_db")),
                    n.forEach(function(e) {
                        t.add(e)
                    }),
                    $$("price_tbl").data.sync($$("price_db")),
                    t.start += t.config.datafetch),
                    n.length >= t.config.datafetch && (t.load_flag = !1)) : 0 === t.start && (t.load_flag = !1),
                    $$("price_tbl").hideProgress(),
                    void 0 !== $$("hide_seller_ch") && $$("hide_seller_ch").callEvent("onChange", [$$("hide_seller_ch").getValue()])
                }
            })
        }
    }
    ,
    t
}),
define("models/old_zak_db", ["app"], function(e) {
    var t = new webix.DataCollection({
        id: "old_zak_db",
        datatype: "jsarray",
        datafetch: 100,
        fieldMap: {
            0: "state",
            1: "order",
            2: "date_in",
            3: "old_count",
            4: "user",
            5: "stitle",
            6: "title",
            7: "vendor",
            8: "sp_title",
            9: "sp_vendor",
            10: "sp_mnn",
            11: "price"
        },
        sort_conf: ["PRICE", "ASC"]
    });
    return t.load = function(r) {
        var o = $$("price_tbl").getItem($$("price_tbl").getSelectedId())
          , i = $$("orders_head_db").getItem($$("orders_head_db").getCursor());
        t.clearAll(),
        req = {
            method: "orders.get_count_in_old_orders",
            params: [i["id_Склад"], o.ACODE, o.SCODE, o.ID_SPR, i.id, r]
        },
        e.request(req, function(r) {
            var o = JSON.parse(r);
            if (e.check_response(o)) {
                var i, n = o.result[0];
                0 !== n && (i = n.map(function(e) {
                    var r, o = e.length, i = {};
                    for (r = 0; r < o; r++)
                        i[t.config.fieldMap[r]] = e[r];
                    return i
                }),
                t.parse(i))
            }
        })
    }
    ,
    t
}),
define("views/tables/price_tbl", ["app", "models/price_db", "models/old_zak_db"], function(e, t, r) {
    var o = {
        view: "datatable",
        id: "price_tbl",
        scrollX: !1,
        select: "row",
        hover: "hover_table",
        navigation: !0,
        editable: !0,
        tooltip: !0,
        hidden: !0,
        rowHeight: 30,
        doubleEnter: 0,
        old_zak_load: void 0,
        type: e.tbl_types,
        columns: [{
            id: "STITLE",
            header: "Поставщик",
            template: "<span class='{common.vnd_color()} '>#STITLE#</span>",
            width: 85,
            sort: "string"
        }, {
            id: "PRICE",
            css: "col_text_right",
            header: {
                text: "Цена",
                css: "col_text_right",
                adjust: !0
            },
            template: "<span style='border-bottom:{common.color_bg()} 2px solid'><span style='color:{common.price_color()}'>{common.price_value()}</span></span>",
            width: 85,
            sort: "int"
        }, {
            id: "TITLE",
            header: "Товар",
            template: "<span style='border-bottom:{common.color_bg()} 2px solid'><span class='tovar_title'>{common.title_render()}</span>{common.life_render()}</span>",
            css: "title_prc",
            fillspace: !0,
            sort: "string"
        }, {
            id: "VENDOR",
            header: "Производитель",
            template: "<span style='border-bottom:{common.color_bg()} 2px solid'><span class='vendor_title'>{common.vendor_render()}</span></span>",
            width: 160,
            sort: "string"
        }, {
            id: "REST",
            header: {
                text: "Остаток",
                css: "col_text_right"
            },
            css: "col_text_right",
            template: "{common.rest_render()}",
            width: 70,
            sort: "int"
        }, {
            id: "SP_COUNT",
            css: "col_text_right",
            header: {
                text: "Кол-во",
                css: "col_text_right"
            },
            template: "{common.sp_count_render()}",
            width: 70,
            editor: "text",
            sort: "int"
        }, {
            id: "SP_SUMMA",
            css: "col_text_right",
            header: {
                text: "Сумма",
                css: "col_text_right"
            },
            adjust: !0,
            template: "{common.sp_summa_render()}",
            width: 100
        }, {
            id: "RATE",
            header: "Упак",
            width: 70,
            template: "{common.rate_render()}",
            sort: "int"
        }, {
            id: "REESTR",
            header: "ЖВНЛС",
            template: "{common.reestr_render()}",
            width: 100,
            sort: "int"
        }],
        data: t,
        on: {
            onDataRequest: function(e, t) {
                console.log(e, t)
            },
            onKeyPress: function(t, r) {
                var o = this;
                if (this.getEditState() === !1) {
                    if (!e.isCharCode(t) && 32 !== t && 187 !== t && 107 !== t || 8 === t ? 8 === t && ($$("main_search").focus(),
                    setTimeout(function() {
                        $$("main_search").callEvent("onChange", [$$("main_search").getValue()])
                    }, 100)) : (8 !== t && 32 !== t && 187 !== t && 107 !== t ? $$("main_search").setValue("") : 32 === t && $$("main_search").setValue($$("main_search").getValue() + " "),
                    $$("main_search").focus()),
                    (13 === t || e.isNumberCode(t)) && setTimeout(function() {
                        o.edit({
                            row: o.getSelectedId(),
                            column: "SP_COUNT"
                        }),
                        null !== $$("orders_error_db").getCursor() && 13 === t && ($$("price_tbl").getEditor().node.querySelector("input").value = $$("orders_error_db").getItem($$("orders_error_db").getCursor()).old),
                        e.isNumberCode(t) && ($$("price_tbl").getEditor().node.querySelector("input").value = String.fromCharCode(t))
                    }, 10),
                    46 === t && r.ctrlKey) {
                        var i = o.getSelectedItem();
                        i.SP_COUNT = 0,
                        i.SP_SUMMA = 0,
                        $$("orders_body_db").config.del_rec(i),
                        $$("price_tbl").refresh()
                    }
                } else {
                    var n = o.getSelectedId()
                      , s = n;
                    if (40 === t ? (o.editStop(),
                    s = o.getNextId(n)) : 38 === t && (o.editStop(),
                    s = o.getPrevId(n)),
                    void 0 !== s && o.select(s),
                    e.isCharCode(t))
                        return !1
                }
            },
            onAfterEditStop: function(e, t, r) {
                var o = $$("price_tbl")
                  , i = o.getSelectedItem();
                return 1 * e.value === 0 ? (i.SP_COUNT = 0,
                i.SP_SUMMA = 0,
                $$("orders_body_db").config.del_rec(i),
                $$("price_tbl").refresh(),
                !1) : void (e.value != e.old ? setTimeout(function() {
                    i.SP_PRICE = i.PRICE,
                    o.config.edit_price(o, i, e)
                }, 10) : i.PRICE > i.SP_PRICE && (i.SP_PRICE = i.PRICE,
                $$("orders_body_db").config.app_rec(i),
                $$("price_tbl").refresh()))
            },
            onAfterSelect: function(t) {
                var o = this.getItem(t.row)
                  , i = o.OLD_ZAK > 0 ? $$("value_old_count").getValue() : 365;
                1 === $$("check_old_count").getValue() && (r.clearAll(),
                o.OLD_ZAK > 0 || e.user_info.options.options.fix_old_zak_pnl ? (void 0 !== $$("price_db").config.old_zak_load && clearTimeout($$("price_db").config.old_zak_load),
                $$("price_db").config.old_zak_load = setTimeout(function() {
                    r.load(i)
                }, 750),
                $$("old_zakaz_pnl").show()) : $$("old_zakaz_pnl").hide()),
                $$("price_db").setCursor(t);
                var n = $$("price_db").getIndexById(t)
                  , s = $$("price_db").count()
                  , a = $$("price_db").config.datafetch;
                n >= s - a / 2 && $$("price_db").load()
            },
            onBeforeSort: function(e, t, r) {
                return "SP_COUNT" !== e && ($$("price_db").clear_data(),
                $$("price_db").config.sort_conf = [e, t],
                $$("price_db").load()),
                !1
            },
            onScrollY: function() {
                var e = this.getScrollState().y
                  , t = $$("price_tbl")._dtable_height;
                t / 2 <= e && $$("price_db").load()
            }
        },
        onClick: {
            old_zak_ico: function(e, t) {}
        },
        edit_price: function(t, r, o) {
            var i = e.setCount(r.SP_COUNT, r.RATE, r.MINZAK);
            if (i != o.value) {
                var n = 'Поставщиком установлена кратность <span class="text_info">{0} шт.</span> и <br>минимальный заказ <span class="text_info">{2} шт.</span> \n<p>Сохравнить заказ в количестве <span class="text_warning">{1} шт.</span>?</p>';
                n = n.replace("{0}", r.RATE).replace("{2}", r.MINZAK).replace("{1}", i),
                webix.ui({
                    view: "window",
                    id: "rate_alert",
                    head: "Внимание !!!",
                    width: 350,
                    height: 200,
                    position: "center",
                    modal: !0,
                    body: {
                        rows: [{
                            template: n
                        }, {
                            padding: 5,
                            cols: [{
                                view: "button",
                                value: "Сохранить",
                                id: "save_rate_btn",
                                css: "button_warning",
                                width: 150,
                                click: function() {
                                    $$("rate_alert").close(),
                                    r.SP_COUNT = i,
                                    r.SP_SUMMA = r.SP_COUNT * r.PRICE,
                                    $$("orders_body_db").config.app_rec(r),
                                    t.refresh(),
                                    webix.UIManager.setFocus(t)
                                }
                            }, {
                                view: "spacer"
                            }, {
                                view: "button",
                                value: "Отменить",
                                id: "cancel_rate_btn",
                                width: 150,
                                click: function() {
                                    $$("rate_alert").close(),
                                    r.SP_COUNT = o.old,
                                    t.refresh()
                                }
                            }]
                        }]
                    },
                    on: {
                        onShow: function() {
                            $$("save_rate_btn").$view.querySelector("button").classList.add("act"),
                            $$("cancel_rate_btn").$view.querySelector("button").classList.add("js_act")
                        },
                        onKeyPress: function(e, t) {
                            if (13 === e && $$("rate_alert").$view.querySelector("button.act").click(),
                            37 === e || 39 === e) {
                                var r = $$("rate_alert").$view.querySelector("button.js_act")
                                  , o = $$("rate_alert").$view.querySelector("button.act");
                                o.classList.remove("act"),
                                o.classList.add("js_act"),
                                r.classList.remove("js_act"),
                                r.classList.add("act")
                            }
                        }
                    }
                }).show()
            } else
                r.SP_COUNT = i,
                r.SP_SUMMA = r.SP_COUNT * r.PRICE,
                r.SP_PRICE = r.PRICE,
                $$("orders_body_db").config.app_rec(r),
                t.refresh()
        }
    };
    return o
}),
define("models/orders_body_db", ["app"], function(e) {
    var t = new webix.DataCollection({
        id: "orders_body_db",
        datatype: "jsarray",
        fieldMap: {
            0: "ACODE",
            1: "DT",
            2: "ID_SPR",
            3: "LIFE",
            4: "MAXPACK",
            5: "MINZAK",
            6: "NDS",
            7: "PRICE",
            8: "RATE",
            9: "REESTR",
            10: "REST",
            11: "SCODE",
            12: "SP_COUNT",
            13: "SP_DATE",
            14: "SP_PRICE",
            15: "SP_SUMMA",
            16: "STITLE",
            17: "TITLE",
            18: "VENDOR",
            19: "SP_TITLE",
            20: "SP_VENDOR",
            21: "SP_MNN",
            22: "ID_ORDER",
            23: "SRC_STR"
        },
        on: {
            onAfterAdd: function(t, r) {
                var o = this.getItem(t)
                  , i = [];
                for (var n in o)
                    "id" !== n && "OLD_ZAK" !== n && i.push(o[n]);
                var s = {
                    method: "orders.add_orders_rec",
                    params: [i, e.user_info.id]
                };
                e.request(s, function(t) {
                    var r = JSON.parse(t);
                    if (e.check_response(r)) {
                        var o = r.result[0]
                          , i = $$("orders_head_db").getItem($$("orders_head_db").getCursor())
                          , n = o;
                        i["Сумма"] = n,
                        $$("orders_head_db").callEvent("onAfterCursorChange", [i.id, !0])
                    }
                }, !1)
            },
            onAfterLoad: function() {
                $$("orders_body_db").count() > 0 ? ($$("harch_btn").show(),
                $$("harch_btn_s").enable(),
                $$("orders_head_db").bind_event()) : ($$("harch_btn").hide(),
                $$("harch_btn_s").disable())
            }
        },
        app_rec: function(r) {
            var o = $$(this.id)
              , i = o.find(function(e) {
                return e.ACODE === r.ACODE && e.SCODE === r.SCODE
            })
              , n = $$("main_search").getValue();
            if (n = n.length > 3 ? n : "",
            0 === i.length)
                r.ID_ORDER = $$("orders_head_db").getItem($$("orders_head_db").getCursor()).id,
                r.SRC_STR = n,
                o.add(r);
            else if (0 !== r.SP_COUNT) {
                i[0].SP_COUNT = r.SP_COUNT,
                i[0].SP_SUMMA = r.SP_SUMMA,
                n = "" != n ? n : i[0].SRC_STR;
                var s = {
                    method: "orders.edit_orders_rec",
                    params: [[r.SP_COUNT, r.SP_SUMMA, r.PRICE, n, r.ACODE, r.SCODE, i[0].ID_ORDER], e.user_info.id]
                };
                e.request(s, function(t) {
                    var r = JSON.parse(t);
                    if (e.check_response(r)) {
                        var o = r.result[0]
                          , i = $$("orders_head_db").getItem($$("orders_head_db").getCursor())
                          , n = o;
                        i["Сумма"] = n,
                        $$("orders_head_db").callEvent("onAfterCursorChange", [i.id, !0])
                    }
                }, !1)
            }
            if (void 0 !== $$("reorder_pnl")) {
                var a = $$("orders_error_db").getItem($$("orders_error_db").getCursor());
                a.acode === r.ACODE && a.scode === r.SCODE || $$("orders_body_db").config.del_rec({
                    ACODE: a.acode,
                    SCODE: a.scode
                })
            }
            $$("orders_error_db").count() > 1 ? ($$("orders_error_db").remove($$("orders_error_db").getCursor()),
            $$("orders_error_db").setCursor($$("orders_error_db").getFirstId())) : void 0 !== $$("reorder_pnl") && ($$("orders_error_db").clearAll(),
            $$("reorder_pnl").close(),
            $$("main_search").setValue(""),
            webix.UIManager.setFocus("main_search")),
            t.callEvent("onAfterLoad", [])
        },
        del_rec: function(r) {
            var o = $$(this.id)
              , i = o.find(function(e) {
                return e.ACODE === r.ACODE && e.SCODE === r.SCODE
            });
            if (i.length > 0) {
                o.remove(i[0].id);
                var n = {
                    method: "orders.del_order_rec",
                    params: [[i[0].ACODE, i[0].SCODE, i[0].ID_ORDER], e.user_info.id]
                };
                e.request(n, function(t) {
                    var r = JSON.parse(t);
                    if (e.check_response(r)) {
                        var o = r.result[0]
                          , i = $$("orders_head_db").getItem($$("orders_head_db").getCursor())
                          , n = o;
                        i["Сумма"] = n,
                        $$("orders_head_db").callEvent("onAfterCursorChange", [i.id, !0])
                    }
                }, !1)
            }
            t.callEvent("onAfterLoad", [])
        }
    });
    return t.load = function() {
        this.clearAll();
        var r = [];
        if (1 * e.user_info.options.select_mode !== 1 && (r = Object.keys(e.user_info.options.select_vnd[e.user_info.options.select_mode]),
        0 === r.length))
            return void t.callEvent("onAfterLoad");
        var o = {
            method: "orders.get_order_recs",
            params: [$$("orders_head_db").getItem($$("orders_head_db").getCursor()).id, r]
        };
        e.request(o, function(r) {
            var o = JSON.parse(r);
            if (e.check_response(o)) {
                var i = o.result[0]
                  , n = i.map(function(e) {
                    var r, o = e.length, i = {};
                    for (r = 0; r < o; r++)
                        i[t.config.fieldMap[r]] = e[r];
                    return i
                });
                t.parse(n)
            }
        }, !0)
    }
    ,
    t
}),
define("views/tables/orders_tbl", ["app", "models/orders_body_db"], function(e, t) {
    var r = {
        view: "datatable",
        id: "orders_tbl",
        scrollX: !1,
        select: "row",
        hover: "hover_table",
        navigation: !0,
        editable: !0,
        tooltip: !0,
        rowHeight: 30,
        type: e.tbl_types,
        doubleEnter: 0,
        columns: [{
            id: "STITLE",
            header: "Поставщик",
            template: "<span class='{common.vnd_color()}'>#STITLE#</span>",
            width: 85,
            sort: "string"
        }, {
            id: "PRICE",
            css: "col_text_right",
            header: {
                text: "Цена",
                css: "col_text_right",
                adjust: !0
            },
            template: "<span style='color:{common.price_color1()}'>{common.price_value()}</span>",
            width: 75,
            sort: "int"
        }, {
            id: "TITLE",
            header: "Товар",
            template: "<span class='tovar_title'>{common.title_render()}</span>{common.life_render()}",
            css: "title_prc",
            fillspace: !0,
            sort: "string"
        }, {
            id: "VENDOR",
            header: "Производитель",
            template: "<span class='vendor_title'>{common.vendor_render()}</span>",
            width: 160,
            sort: "string"
        }, {
            id: "REST",
            header: {
                text: "Остаток",
                css: "col_text_right"
            },
            css: "col_text_right",
            template: "{common.rest_render()}",
            width: 70,
            sort: "int"
        }, {
            id: "SP_COUNT",
            css: "col_text_right",
            header: {
                text: "Кол-во",
                css: "col_text_right"
            },
            template: "{common.sp_count_render()}",
            width: 100,
            editor: "text",
            sort: "int"
        }, {
            id: "SP_SUMMA",
            css: "col_text_right",
            header: {
                text: "Сумма",
                css: "col_text_right"
            },
            template: "{common.sp_summa_render()}",
            width: 120,
            sort: "int"
        }, {
            id: "RATE",
            header: "Упак",
            width: 70,
            template: "{common.rate_render()}"
        }, {
            id: "REESTR",
            header: "ЖВНЛС",
            template: "{common.reestr_render()}",
            width: 70
        }],
        data: t,
        on: {
            onKeyPress: function(t, r) {
                var o = this;
                if (this.getEditState() === !1) {
                    if (!e.isCharCode(t) && 32 !== t || 8 === t ? 8 === t && ($$("main_search").focus(),
                    setTimeout(function() {
                        $$("main_search").callEvent("onChange", [$$("main_search").getValue()])
                    }, 100)) : (8 !== t && 32 !== t ? $$("main_search").setValue("") : 32 === t && $$("main_search").setValue($$("main_search").getValue() + " "),
                    $$("main_search").focus(),
                    setTimeout(function() {
                        $$("main_search").callEvent("onChange", [$$("main_search").getValue()])
                    }, 100)),
                    (13 === t || e.isNumberCode(t)) && setTimeout(function() {
                        o.edit({
                            row: o.getSelectedId(),
                            column: "SP_COUNT"
                        }),
                        e.isNumberCode(t) && ($$("orders_tbl").getEditor().node.querySelector("input").value = String.fromCharCode(t))
                    }, 10),
                    46 === t && r.ctrlKey) {
                        var i = o.getSelectedItem();
                        i.SP_COUNT = 0,
                        i.SP_SUMMA = 0,
                        $$("orders_body_db").config.del_rec(i),
                        $$("orders_tbl").refresh()
                    }
                } else {
                    var n = o.getSelectedId()
                      , s = n;
                    if (40 === t ? (o.editStop(),
                    s = o.getNextId(n)) : 38 === t && (o.editStop(),
                    s = o.getPrevId(n)),
                    void 0 !== s && o.select(s),
                    e.isCharCode(t))
                        return !1
                }
            },
            onAfterEditStop: function(e, t, r) {
                var o = $$("orders_tbl")
                  , i = o.getSelectedItem();
                return 1 * e.value === 0 ? (i.SP_COUNT = 0,
                i.SP_SUMMA = 0,
                $$("orders_body_db").config.del_rec(i),
                $$("orders_tbl").refresh(),
                !1) : void (e.value != e.old ? setTimeout(function() {
                    o.config.edit_price(o, i, e)
                }, 10) : i.PRICE > i.SP_PRICE && (i.SP_PRICE = i.PRICE,
                $$("orders_body_db").config.app_rec(i),
                $$("orders_tbl").refresh(),
                i = $$("orders_tbl").find(function(e) {
                    return e.ACODE == i.ACODE && e.SCODE == i.SCODE
                }),
                $$("orders_tbl").select(i[0].id)))
            },
            onAfterSelect: function(e) {
                t.setCursor(e)
            },
            onBeforeRender: function() {
                void 0 !== $$("old_zakaz_pnl") && $$("old_zakaz_pnl").hide()
            }
        },
        edit_price: function(t, r, o) {
            var i = e.setCount(r.SP_COUNT, r.RATE, r.MINZAK);
            if (i != o.value) {
                var n = 'Поставщиком установлена кратность <span class="text_info">{0} шт.</span> и <br>минимальный заказ <span class="text_info">{2} шт.</span> \n<p>Сохравнить заказ в количестве <span class="text_warning">{1} шт.</span>?</p>';
                n = n.replace("{0}", r.RATE).replace("{2}", r.MINZAK).replace("{1}", i),
                webix.ui({
                    view: "window",
                    id: "rate_alert",
                    head: "Внимание !!!",
                    width: 350,
                    height: 200,
                    position: "center",
                    modal: !0,
                    body: {
                        rows: [{
                            template: n
                        }, {
                            padding: 5,
                            cols: [{
                                view: "button",
                                value: "Сохранить",
                                id: "save_rate_btn",
                                css: "button_warning",
                                width: 150,
                                click: function() {
                                    $$("rate_alert").close(),
                                    r.SP_COUNT = i,
                                    r.SP_SUMMA = r.SP_COUNT * r.PRICE,
                                    $$("orders_body_db").config.app_rec(r),
                                    t.refresh(),
                                    webix.UIManager.setFocus(t)
                                }
                            }, {
                                view: "spacer"
                            }, {
                                view: "button",
                                value: "Отменить",
                                id: "cancel_rate_btn",
                                width: 150,
                                click: function() {
                                    $$("rate_alert").close(),
                                    t.getSelectedItem().SP_COUNT = o.old,
                                    t.refresh(),
                                    webix.UIManager.setFocus(t)
                                }
                            }]
                        }]
                    },
                    on: {
                        onShow: function() {
                            $$("save_rate_btn").$view.querySelector("button").classList.add("act"),
                            $$("cancel_rate_btn").$view.querySelector("button").classList.add("js_act")
                        },
                        onKeyPress: function(e, t) {
                            if (13 === e && $$("rate_alert").$view.querySelector("button.act").click(),
                            37 === e || 39 === e) {
                                var r = $$("rate_alert").$view.querySelector("button.js_act")
                                  , o = $$("rate_alert").$view.querySelector("button.act");
                                o.classList.remove("act"),
                                o.classList.add("js_act"),
                                r.classList.remove("js_act"),
                                r.classList.add("act")
                            }
                        }
                    }
                }).show()
            } else
                r.SP_COUNT = i,
                r.SP_SUMMA = r.SP_COUNT * r.PRICE,
                r.SP_PRICE = r.PRICE,
                $$("orders_body_db").config.app_rec(r),
                webix.UIManager.setFocus(t)
        }
    };
    return r
}),
define("views/price/pvm_toolbar_row2", ["app"], function(e, t) {
    var r = {
        id: "pvm_toolbar_row2",
        css: "pvm_toolbar_col",
        cols: [{
            view: "text",
            value: "",
            id: "main_search",
            placeholder: "Поиск",
            old_search: "",
            timeout: null,
            width: window.innerWidth <= 1170 ? 100 : 402,
            keyPressTimeout: 700,
            on: {
                onChange: function(e) {
                    var t = this;
                    "" !== e ? ($$("orders_tbl").isVisible && ($$("orders_tbl").hide(),
                    $$("price_tbl").show()),
                    clearTimeout(t.config.timeout),
                    t.config.timeout = setTimeout(function() {
                        if (t.config.old_search !== e) {
                            var r = t.config.old_search;
                            t.config.old_search = e,
                            $$("old_zakaz_pnl").hide(),
                            "" !== r && $$("price_db").clear_data(),
                            "_" === e[0] && ($$("price_db").config.sort_conf = ["TITLE", "asc"]),
                            $$("price_db").load()
                        }
                    }, 350)) : ($$("price_db").clear_data(),
                    t.config.old_search = e,
                    $$("price_tbl").isVisible && ($$("price_tbl").hide(),
                    $$("orders_tbl").show(),
                    window.onresize()))
                },
                onTimedKeyPress: function() {
                    var e = this;
                    this.callEvent("onChange", [e.getValue()])
                },
                onKeyPress: function(e, t) {
                    if (40 === e) {
                        var r = $$("price_tbl").isVisible() ? $$("price_tbl") : $$("orders_tbl")
                          , o = $$("price_tbl").isVisible() ? $$("price_db") : $$("orders_body_db")
                          , i = $$("price_tbl").isVisible() ? "price_tbl" : "orders_tbl";
                        o.count() > 0 && (r.select(r.getFirstId()),
                        webix.UIManager.setFocus(i))
                    }
                }
            }
        }, {
            view: "button",
            id: "vnd_list_bnt",
            align: "left",
            label: "",
            width: 200,
            popup: "vnd_mode",
            badge: "&#9660;",
            on: {
                onItemClick: function() {
                    setTimeout(function() {
                        $$("vnd_mode").show()
                    }, 100)
                }
            }
        }, {
            view: "label",
            id: "order_list_mn",
            css: "order_list_mn",
            popup: "order_list_pp",
            on: {
                onItemClick: function() {
                    setTimeout(function() {
                        $$("order_list_pp").show()
                    }, 100)
                }
            }
        }]
    };
    return r
}),
define("views/price/pvm_toolbar_row1", ["app", "views/windows/report_price_win"], function(e, t) {
    var r = {
        id: "pvm_toolbar_row1",
        css: "pvm_toolbar_col",
        cols: [{
            view: "button",
            id: "order_summ",
            badge: "&#9660;",
            maxWidth: 200,
            popup: "order_summ_pp",
            on: {
                onItemClick: function() {
                    setTimeout(function() {
                        $$("order_summ_pp").show()
                    }, 100)
                }
            }
        }, {
            id: "order_util_pnl",
            cols: [{
                view: "icon",
                css: "hnew_btn htools_btn",
                align: "right",
                tooltip: "Новый заказ",
                click: function() {
                    $$("adres_win").show(),
                    $$("adres_win_footer").show()
                }
            }, {
                width: 10
            }, {
                view: "icon",
                css: "report_btn htools_btn",
                align: "right",
                tooltip: "Печать",
                click: function() {
                    void 0 === $$("report_price_win") && webix.ui(t),
                    $$("report_price_win").cur_id = void 0,
                    $$("report_price_win").show()
                }
            }, {
                width: 10
            }, {
                view: "icon",
                css: "hedit_btn htools_btn",
                align: "right",
                tooltip: "Изменить",
                popup: "edit_pp",
                on: {
                    onItemClick: function() {
                        setTimeout(function() {
                            $$("edit_pp").show()
                        }, 100)
                    }
                }
            }, {
                width: 10
            }, {
                view: "icon",
                id: "harch_btn",
                css: "harch_btn htools_btn",
                ln_ev: void 0,
                align: "right",
                tooltip: "Заказ в архив, УДЕРЖИВАЙТЕ чтобы отправить"
            }, {
                width: 10
            }, {
                view: "icon",
                id: "htrash_btn",
                css: "htrash_btn htools_btn",
                ln_ev: void 0,
                align: "right",
                tooltip: "Удалить заказ, УДЕРЖИВАЙТЕ чтобы удалить"
            }, {
                view: "icon",
                css: "report_btn htools_btn",
                align: "right",
                hidden: !0,
                tooltip: "Отчеты"
            }, {
                view: "icon",
                css: "lacks_btn htools_btn",
                align: "right",
                hidden: !0,
                tooltip: "Отказы"
            }, {
                view: "icon",
                css: "hautos_btn htools_btn",
                align: "right",
                hidden: !0,
                tooltip: "Автоподбор по матрице"
            }]
        }]
    };
    return r
}),
define("views/price/options_pnl", ["app"], function(e, t) {
    var r = webix.ui({
        view: "sidemenu",
        id: "options_menu",
        width: 550,
        position: "left",
        save_options: function(t, r) {
            e.user_info.options.options[t] = r,
            e.setUserInfoOptions(e.user_info)
        },
        body: {
            view: "form",
            elements: [{
                view: "fieldset",
                label: "Поиск",
                body: {
                    rows: [{
                        view: "checkbox",
                        id: "check_seller_name",
                        label: "Отображать исходные названия поставщика",
                        labelWidth: 400,
                        inputAlign: "right",
                        value: 1,
                        on: {
                            onChange: function(e) {
                                void 0 !== $$("price_tbl") && ($$("price_tbl").isVisible() ? $$("price_tbl").refresh() : $$("orders_tbl").refresh(),
                                $$("options_menu").config.save_options(this.config.id, e))
                            }
                        }
                    }, {
                        view: "checkbox",
                        id: "check_mnn",
                        label: "Поиск по мнн",
                        inputAlign: "right",
                        labelWidth: 400,
                        value: 1,
                        on: {
                            onChange: function(e) {
                                void 0 !== $$("price_tbl") && ($$("price_tbl").isVisible() ? $$("price_tbl").refresh() : $$("orders_tbl").refresh(),
                                $$("options_menu").config.save_options(this.config.id, e))
                            }
                        }
                    }, {
                        view: "checkbox",
                        id: "check_vnd",
                        label: "Поиск по поставщику",
                        inputAlign: "right",
                        hidden: !0,
                        labelWidth: 400,
                        value: 0,
                        on: {
                            onChange: function(e) {}
                        }
                    }]
                }
            }, {
                view: "fieldset",
                label: "Прошлые заказы",
                body: {
                    rows: [{
                        view: "checkbox",
                        id: "check_old_count",
                        label: "Отображать количество в прошлых заказах",
                        inputAlign: "right",
                        labelWidth: 400,
                        value: 1,
                        on: {
                            onChange: function(e) {
                                $$("options_menu").config.save_options(this.config.id, e)
                            }
                        }
                    }, {
                        view: "counter",
                        id: "value_old_count",
                        label: "Количество дней для подсчёта в прошлых заказах",
                        labelWidth: 400,
                        step: 1,
                        value: 7,
                        on: {
                            onChange: function(e) {
                                $$("options_menu").config.save_options(this.config.id, e)
                            }
                        }
                    }]
                }
            }]
        }
    });
    return r
}),
define("views/price/old_zakaz_tbl", ["app", "models/old_zak_db"], function(e, t) {
    var r = {
        css: "old_zak_pnl",
        id: "old_zakaz_pnl",
        hidden: !0,
        rows: [{
            cols: [{
                view: "label",
                label: "Прошлые заказы",
                css: "old_zak_lbl",
                inputWidth: 100,
                align: "left"
            }, {}, {
                view: "checkbox",
                css: "old_zak_lbl",
                id: "fix_old_zak_pnl",
                width: 120,
                labelWidth: 90,
                label: "Закрепить",
                align: "right",
                value: 0,
                on: {
                    onChange: function(e) {
                        $$("options_menu").config.save_options(this.config.id, e)
                    }
                }
            }]
        }, {
            view: "datatable",
            id: "old_zakaz_tbl",
            scrollX: !1,
            hover: "hover_table",
            editable: !0,
            tooltip: !0,
            height: 120,
            rowHeight: 30,
            doubleEnter: 0,
            type: e.tbl_types,
            columns: [{
                id: "old_count",
                header: "Кол-во",
                css: "title_prc",
                width: 80
            }, {
                id: "price",
                header: "Цена",
                css: "title_prc",
                width: 80
            }, {
                id: "date_in",
                header: "Дата",
                format: webix.Date.dateToStr("%d.%m.%Y"),
                sort: "string"
            }, {
                id: "stitle",
                header: "Поставщик",
                width: 85,
                sort: "string"
            }, {
                id: "title",
                header: "Товар",
                template: "<span class='tovar_title'>{common.oz_title_render()}</span>",
                css: "title_prc",
                fillspace: !0,
                sort: "string"
            }, {
                id: "vendor",
                header: "Производитель",
                template: "<span class='vendor_title'>{common.oz_vendor_render()}</span>",
                width: 160,
                sort: "string"
            }, {
                id: "state",
                header: "Статус",
                template: "{common.state_render()}",
                width: 85,
                sort: "string"
            }, {
                id: "order",
                header: "Заказ",
                css: "title_prc"
            }, {
                id: "user",
                header: "Пользователь",
                css: "title_prc",
                sort: "string"
            }],
            data: t,
            on: {
                onBeforeRender: function() {
                    $$("fix_old_zak_pnl").setValue(e.user_info.options.options.fix_old_zak_pnl)
                }
            }
        }]
    };
    return r
}),
define("views/price_main_view", ["app", "views/popups/vnd_mode", "views/tables/price_tbl", "views/tables/orders_tbl", "views/price/pvm_toolbar_row2", "views/price/pvm_toolbar_row1", "views/price/options_pnl", "views/price/old_zakaz_tbl", "models/orders_body_db", "views/popups/order_list_pp", "views/popups/edit_pp", "views/popups/order_summ_pp", "views/popups/trash_pp"], function(e, t, r, o, i, n, s, a) {
    var d = {
        id: "price_main_view",
        rows: [{
            id: "pvm_header",
            padding: 15,
            cols: [{
                view: "icon",
                css: "logo_30",
                align: "left"
            }, {
                view: "label",
                label: 'Прайс &nbsp;<span class="ver_info">' + e.config.version + "</span>",
                css: "text_primary logo_title",
                align: "left"
            }, {
                cols: [{}, {
                    id: "alert_pnl"
                }, {}]
            }, {
                view: "label",
                align: "right",
                css: "user_name_title",
                on: {
                    onBeforeRender: function() {
                        this.config.label = e.user_info.name
                    }
                }
            }, {
                view: "button",
                css: "button_warning button_raised",
                id: "hbtn_arch",
                width: 100,
                value: "Архив",
                click: function() {
                    e.show("archive")
                }
            }, {
                view: "button",
                css: "button_info",
                width: 100,
                value: "Выход",
                click: function() {
                    location.reload()
                }
            }]
        }, {
            id: "pvm_toolbar",
            css: "bg_panel",
            padding: 5,
            view: "form",
            elements: [{
                rows: [n, i]
            }]
        }, {
            id: "vnd_panel_flx",
            autoheight: !0,
            cols: []
        }, {
            id: "pvm_body",
            type: "material",
            cols: [{
                css: "bg_clean"
            }, {
                width: window.innerWidth > 1170 ? 1170 : 980,
                id: "tp_test",
                rows: [{
                    cols: [r, o]
                }, a]
            }, {
                css: "bg_clean"
            }]
        }, {
            id: "pvm_footer",
            height: 40,
            cols: [{
                view: "button",
                css: "button_info",
                autowidth: !0,
                value: "Настройки",
                click: function() {
                    s.show()
                }
            }, {
                view: "button",
                css: "button_info",
                autowidth: !0,
                value: "Кoрзина",
                popup: "trash_pp"
            }, {}, {
                view: "button",
                css: "button_primary help_js",
                autowidth: !0,
                value: "Помощь",
                click: function() {
                    var e = [{
                        selector: '[title = "Новый заказ"]',
                        event: "next",
                        description: 'Нажмите на кнопку "Новый заказ"',
                        nextButton: {
                            className: "myNext",
                            text: "ДАЛЬШЕ"
                        },
                        showSkip: !1,
                        showNext: !0
                    }, {
                        selector: "[view_id = adres_win_tb]",
                        event: "next",
                        description: "Выбирете адрес для которого создаете заказ.",
                        nextButton: {
                            className: "myNext",
                            text: "ДАЛЬШЕ"
                        },
                        showSkip: !1,
                        showNext: !0
                    }, {
                        selector: ".olmn_div",
                        event: "next",
                        description: "Ваш заказ создан",
                        nextButton: {
                            className: "myNext",
                            text: "ДАЛЬШЕ"
                        },
                        showSkip: !1,
                        showNext: !0
                    }]
                      , t = new EnjoyHint({
                        onStart: function() {}
                    });
                    t.set(e),
                    t.run()
                }
            }]
        }]
    };
    return d
}),
define("models/orders_head_db", ["app", "models/vnds_list_prc_db", "models/order_stat_db", "models/orders_error_db", "models/orders_body_db"], function(e, t, r, o, i) {
    var n = new webix.DataCollection({
        id: "orders_head_db",
        datatype: "jsarray",
        fieldMap: {
            0: "id",
            1: "id_Склад",
            2: "Коментарий",
            3: "Дата",
            4: "Номер",
            5: "Статус",
            6: "Сумма",
            7: "id_Пользователь",
            8: "Склад",
            9: "Пользователь"
        },
        on: {
            onAfterCursorChange: function(o, i) {
                try {
                    $$("order_list_pp_tbl").refresh()
                } catch (n) {}
                try {
                    var s = this.getItem(o)
                      , a = $$("order_list_mn")
                      , d = $$("order_summ")
                      , c = "Заказ: " + s["Номер"] + " " + s["Склад"];
                    a.setHTML("<div class='olmn_div'><span>" + c + "</span><span class='webix_badge1'>&#9660;</span></div>"),
                    d.setValue(e.moneyView(s["Сумма"]).replace(/&nbsp;/g, " ")),
                    d.refresh(),
                    t.load(),
                    r.load(),
                    $$("vnd_list_bnt").config.label = e.get_select_mode_title(),
                    $$("vnd_list_bnt").refresh(),
                    i !== !0 && $$("orders_body_db").load()
                } catch (n) {}
            }
        }
    });
    return life_render = function(e) {
        var t = e.LIFE.replace(/(\d+)-(\d+)-(\d+)/, "$2/$3/$1")
          , r = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
          , o = new Date(t)
          , i = new Date
          , n = o
          , s = ""
          , a = "";
        if (e.LIFE > "") {
            var d = 356;
            i = i.setDate(i.getDate() + d),
            n = n.setDate(o.getDate()),
            s = n < i ? " text_danger" : "",
            t = t.split("/"),
            a = '<span class="' + s + '">' + r[1 * t[0] - 1] + " " + t[2].substr(2, 2) + "</span> "
        }
        return a
    }
    ,
    n.get_report = function(t) {
        var r, o, s, a, d = this, c = d.getCursor(), l = d.getItem(c), _ = $$("orders_tbl"), u = "<div class='report'>", p = 0, h = 0;
        if (e.request({
            method: "filters.get_sklad_info",
            params: [l["id_Склад"]]
        }, function(t) {
            var r = JSON.parse(t);
            e.check_response(r) && (s = r.result[0])
        }, !0),
        void 0 === t && (t = 2),
        t = 1 * t,
        1 === t && (a = l["Дата"].split(" "),
        a = a[0].split("-").reverse(),
        a[1] = e.month_str[1 * a[1]][0],
        a = a.join(" "),
        u += "<h1>Заказ " + l["Склад"].toUpperCase().replace("'", "") + " №" + l["Номер"] + " от " + a + " г.</h1>",
        u += "<p><span class='pull-left'>" + s[7] + ", <strong>" + s[2] + "</strong></span><span class='pull-right'>" + l["Коментарий"] + "</span></p>",
        u += "<p>&nbsp</p>",
        u += ["<table><thead>", "<tr>", '<th class="">№</th>', '<th class="">товар</th>', '<th class="" width="60">кол-во</th>', '<th class="" width="70">цена</th>', '<th class="" width="80">сумма</th>', "</tr>", "</thead><tbody>"].join(),
        r = 1,
        _.eachRow(function(t) {
            h = r;
            var o = _.getItem(t);
            u += '<tr><td class="col_text_center">' + r + "</td><td><strong>" + o.TITLE + "</strong> <span class='report_grey_font'>(" + life_render(o) + ", " + o.VENDOR + ')</span></td><td class="col_text_right">' + o.SP_COUNT + '</td><td class="col_text_right">' + e.moneyView(o.PRICE) + '</td><td class="col_text_right">' + e.moneyView(o.SP_SUMMA) + "</td></tr>",
            r += 1,
            p += o.SP_SUMMA
        }),
        u += '<tr><td class="itog col_text_right" colspan=4>ИТОГО:</td><td class="summa col_text_right">' + e.moneyView(p) + "</td></tr>",
        u += "</tbody></table><p>&nbsp;</p>",
        u += "<p style = 'font-size: larger;'>Всего наименований товаров: " + h + ", на сумму " + e.moneyView(p) + " руб.</p>",
        u += "<p style='border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p>",
        u += "<p style = 'font-size: larger;'>Автор: " + l["Пользователь"] + "</p>",
        u += "<p style='border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p></div>",
        $$("report_table").$view.innerHTML = u),
        2 === t && (o = d.get_svod_info(l["Номер"]),
        console.log(o),
        a = o[3].split(" "),
        a = a[0].split("-").reverse(),
        a[1] = e.month_str[1 * a[1]][0],
        a = a.join(" "),
        u += "<h1>Заказ сводный  №" + o[4] + " от " + a + " г.</h1>",
        u += "<p><span class='pull-left'>" + s[7] + ", <strong>" + s[2] + "</strong></span><span class='pull-right'>" + o[2] + "</span></p>",
        u += "<p>&nbsp</p>",
        u += ["<table><thead>", "<tr>", '<th class="">№</th>', '<th class="">товар</th>', '<th class="">пост</th>', '<th class="" width="60">кол-во</th>', '<th class="" width="70">цена</th>', '<th class="" width="80">сумма</th>', "</tr>", "</thead><tbody>"].join(""),
        r = 1,
        i.load(o[4]),
        i.filter(function(t) {
            return h = r,
            u += '<tr><td class="col_text_center">' + r + "</td><td><strong>" + t.TITLE + "</strong> <span class='report_grey_font'>(" + life_render(t) + ", " + t.VENDOR + ')</span></td><td class="col_text_right">' + t.STITLE.replace("'", "") + '</td></td><td class="col_text_right">' + t.SP_COUNT + '</td><td class="col_text_right">' + e.moneyView(t.PRICE) + '</td><td class="col_text_right">' + e.moneyView(t.SP_SUMMA) + "</td></tr>",
            r += 1,
            p += t.SP_SUMMA,
            !0
        }),
        u += '<tr><td class="itog col_text_right" colspan=5>ИТОГО:</td><td class="summa col_text_right">' + e.moneyView(p) + "</td></tr>",
        u += "</tbody></table><p>&nbsp;</p>",
        u += "<p style = 'font-size: larger;'>Всего наименований товаров: " + h + ", на сумму " + e.moneyView(p) + " руб.</p>",
        u += "<p style='border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p>",
        u += "<p style = 'font-size: larger;'>Автор: " + l["Пользователь"] + "</p>",
        u += "<p style='border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p></div>",
        $$("report_table").$view.innerHTML = u),
        3 === t) {
            o = d.get_svod_info(l["Номер"]),
            a = o[3].split(" "),
            a = a[0].split("-").reverse(),
            a[1] = e.month_str[1 * a[1]][0],
            a = a.join(" "),
            u += "<h1>Заказ сводный  №" + o[4] + " от " + a + " г.</h1>",
            u += "<p><span class='pull-left'>" + s[7] + ", <strong>" + s[2] + "</strong></span><span class='pull-right'>" + o[2] + "</span></p>",
            u += "<p>&nbsp</p>",
            u += ["<table><thead>", "<tr>", '<th class="">№</th>', '<th class="">товар</th>', '<th class="" width="60">кол-во</th>', '<th class="" width="70">цена</th>', '<th class="" width="80">сумма</th>', "</tr>", "</thead><tbody>"].join(""),
            r = 1;
            var f = 0
              , v = 0
              , m = "";
            i.load(o[4]),
            i.filter(function(t) {
                if (f !== t.SCODE) {
                    0 !== f && (u += '<tr><td class="itog col_text_right" colspan=4>' + m.replace("'", "") + ':</td><td class="summa col_text_right">' + e.moneyView(v) + "</td></tr>");
                    var o = n.get_svod_info(t.ID_ORDER);
                    a = o[3].split(" "),
                    a = a[0].split("-").reverse(),
                    a[1] = e.month_str[1 * a[1]][0],
                    a = a.join(" "),
                    u += '<tr><td class="itog" colspan=5>' + t.STITLE.toUpperCase().replace("'", "") + ' <span class="report_font1">№' + l["Номер"] + " от " + a + " г.</span></td></tr>",
                    r = 1,
                    v = 0
                }
                return m = t.STITLE.replace("'", ""),
                f = t.SCODE,
                h += 1,
                u += '<tr><td class="col_text_center">' + r + "</td><td><strong>" + t.TITLE + "</strong> <span class='report_grey_font'>(" + life_render(t) + ", " + t.VENDOR + ')</span></td><td class="col_text_right">' + t.SP_COUNT + '</td><td class="col_text_right">' + e.moneyView(t.PRICE) + '</td><td class="col_text_right">' + e.moneyView(t.SP_SUMMA) + "</td></tr>",
                r += 1,
                p += t.SP_SUMMA,
                v += t.SP_SUMMA,
                !0
            }),
            0 !== f && (u += '<tr><td class="itog col_text_right" colspan=4>' + m + ':</td><td class="summa col_text_right">' + e.moneyView(v) + "</td></tr>"),
            u += '<tr><td class="itog col_text_right" colspan=4>ИТОГО:</td><td class="summa col_text_right">' + e.moneyView(p) + "</td></tr>",
            u += "</tbody></table><p>&nbsp;</p>",
            u += "<p style = 'font-size: larger;'>Всего наименований товаров: " + h + ", на сумму " + e.moneyView(p) + " руб.</p>",
            u += "<p style='border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p>",
            u += "<p style = 'font-size: larger;'>Автор: " + l["Пользователь"] + "</p>",
            u += "<p style='border-top: 1px solid rgba(52, 152, 219, 0.13);'>&nbsp<p></div>",
            $$("report_table").$view.innerHTML = u
        }
    }
    ,
    n.get_svod_info = function(t) {
        var r, o = {
            method: "orders.get_order_head",
            params: [t]
        };
        return e.request(o, function(t) {
            var o = JSON.parse(t);
            if (e.check_response(o)) {
                var i = o.result[0];
                r = i
            }
        }, !0),
        r
    }
    ,
    n.in_trash = function() {
        var t = n.getCursor()
          , r = null !== t.id && void 0 !== t.id ? t.id : t
          , o = {
            method: "orders.del_order",
            params: [r, e.user_info.id]
        };
        e.request(o, function(t) {
            var r = JSON.parse(t);
            e.check_response(r) && (n.load(),
            n.count() > 0 ? (n.setCursor(n.getFirstId()),
            e.ms_box("Ордер перемещен в корзину", "", {}, 2e3)) : $$("adres_win").show())
        }, !0)
    }
    ,
    n.in_archive_ = function() {
        console.log("in_archive_");
        var t = n.getCursor()
          , r = null !== t.id && void 0 !== t.id ? t.id : t
          , o = this.getItem(r)["id_Склад"]
          , i = this.getItem(r)["Коментарий"]
          , s = []
          , a = {};
        1 * e.user_info.options.select_mode !== 1 && (s = Object.keys(e.user_info.options.select_vnd[e.user_info.options.select_mode])),
        a = {
            method: "orders.order_in_archive",
            params: [1 * r, s, o, e.user_info.id, i]
        },
        e.request(a, function(t) {
            var o = JSON.parse(t);
            if (e.check_response(o)) {
                var i = o.result[0];
                n.load(),
                0 === n.count() ? ($$("orders_body_db").clearAll(),
                $$("price_db").clearAll(),
                $$("vnd_panel_flx").reconstruct(),
                $$("main_search").setValue(""),
                $$("adres_win").show()) : i > 0 ? (n.setCursor(r),
                e.ms_box("Часть ордера перемещена в архив", "перейти в архив", function() {
                    $$("hbtn_arch").config.click()
                }, 5e3)) : (n.setCursor(n.getFirstId()),
                e.ms_box("Ордер перемещен в архив", "перейти в архив", function() {
                    $$("hbtn_arch").config.click()
                }, 5e3))
            }
        }, !0)
    }
    ,
    n.in_archive = function() {
        if (0 === $$("orders_body_db").count())
            return void e.ms_box("Нечего отправлять в архив", 5e3);
        var t = n.getCursor()
          , r = null !== t.id && void 0 !== t.id ? t.id : t
          , i = this.getItem(r)["id_Склад"]
          , s = []
          , a = {};
        1 * e.user_info.options.select_mode !== 1 && (s = Object.keys(e.user_info.options.select_vnd[e.user_info.options.select_mode])),
        a = {
            method: "orders.get_order_error",
            params: [1 * r, s, i]
        },
        e.request(a, function(t) {
            var r = JSON.parse(t);
            if (e.check_response(r)) {
                var i = r.result[0];
                i.length > 0 && ($$("order_errors_win").show(),
                o.clearAll(),
                o.parse(i))
            }
        }, !0),
        0 === o.count() && n.in_archive_()
    }
    ,
    n.bind_event = function() {
        var e = $$("htrash_btn").getNode().querySelector("button")
          , t = $$("harch_btn").getNode().querySelector("button");
        e.timeOut = void 0,
        void 0 !== e.ln_ev && webix.eventRemove(e.ln_ev),
        e.ln_ev = webix.event(e, webix.env.mouse.down, function() {
            e.classList.add("load_cur"),
            e.timeOut = setTimeout(function() {
                e.classList.remove("load_cur"),
                n.in_trash()
            }, 1500)
        }),
        webix.event(e, webix.env.mouse.up, function() {
            clearTimeout(e.timeOut),
            e.classList.remove("load_cur")
        }),
        t.timeOut = void 0,
        void 0 !== t.ln_ev && webix.eventRemove(t.ln_ev),
        t.ln_ev = webix.event(t, webix.env.mouse.down, function() {
            t.classList.add("load_cur"),
            t.timeOut = setTimeout(function() {
                t.classList.remove("load_cur"),
                n.in_archive()
            }, 1500)
        }),
        webix.event(t, webix.env.mouse.up, function() {
            clearTimeout(t.timeOut),
            t.classList.remove("load_cur")
        })
    }
    ,
    n.load = function() {
        this.clearAll();
        var t = {
            method: "orders.get_orders",
            params: [void 0 !== e.user_info.sklad ? e.user_info.sklad : []]
        };
        e.request(t, function(t) {
            var r = JSON.parse(t);
            if (e.check_response(r)) {
                var o = r.result[0]
                  , i = o.map(function(e) {
                    var t, r = e.length, o = {};
                    for (t = 0; t < r; t++)
                        o[n.config.fieldMap[t]] = e[t];
                    return o
                });
                n.parse(i),
                $$("orders_head_win_tb").sort({
                    by: "Дата",
                    dir: "desc",
                    as: "mysort"
                })
            }
        }, !0)
    }
    ,
    n
}),
define("views/windows/orders_head_win", ["app", "models/orders_head_db", "views/price_main_view"], function(e, t, r, o) {
    var i = {
        view: "window",
        id: "orders_head_win",
        head: "Выберите заказ",
        height: 600,
        position: "center",
        modal: !0,
        body: {
            rows: [{
                padding: 10,
                rows: [{
                    view: "datatable",
                    scrollX: !1,
                    id: "orders_head_win_tb",
                    height: 300,
                    hover: "hover_table",
                    navigation: !0,
                    select: "row",
                    columns: [{
                        id: "Дата",
                        header: "Дата",
                        format: webix.Date.dateToStr("%d.%m.%Y"),
                        sort: "mysort"
                    }, {
                        id: "Номер",
                        header: "Номер",
                        width: 110,
                        sort: "int"
                    }, {
                        id: "Склад",
                        header: "Склад",
                        width: 300,
                        sort: "string"
                    }, {
                        id: "Сумма",
                        header: "Сумма",
                        format: webix.Number.numToStr({
                            groupDelimiter: ",",
                            groupSize: 3,
                            decimalDelimiter: ".",
                            decimalSize: 2
                        }),
                        sort: "int"
                    }],
                    autowidth: !0,
                    datatype: "jsarray",
                    run_show: function() {
                        $$("orders_head_win").hide(),
                        $$("main_layout").addView(r),
                        $$("orders_head_db").bind_event(),
                        $$("orders_head_db").callEvent("onAfterCursorChange", [$$("orders_head_db").getCursor()]),
                        webix.UIManager.setFocus("main_search")
                    },
                    on: {
                        onItemClick: function(e) {
                            this.config.run_show()
                        },
                        onKeyPress: function(e, t) {
                            13 === e && this.config.run_show()
                        },
                        onAfterSelect: function(e) {
                            $$("orders_head_db").setCursor(e)
                        }
                    }
                }]
            }, {
                padding: 5,
                cols: [{
                    view: "spacer"
                }, {
                    view: "button",
                    value: "Новый заказ",
                    css: "button_info",
                    width: 150,
                    click: function() {
                        $$("adres_win").show()
                    }
                }]
            }]
        },
        on: {
            onShow: function() {
                var e = $$("orders_head_win_tb");
                e.data.sync($$("orders_head_db")),
                e.select(e.getFirstId()),
                webix.UIManager.setFocus("orders_head_win_tb")
            }
        }
    };
    return i
}),
define("views/windows/adres_win", ["app", "models/adres_db", "views/price_main_view"], function(e, t, r) {
    var o = {
        view: "window",
        id: "adres_win",
        head: "Выберите адрес для нового заказа",
        height: 600,
        position: "center",
        modal: !0,
        body: {
            rows: [{
                padding: 10,
                rows: [{
                    view: "datatable",
                    scrollX: !1,
                    id: "adres_win_tb",
                    height: 300,
                    hover: "hover_table",
                    navigation: !0,
                    select: "row",
                    columns: [{
                        id: "1",
                        header: "Адрес",
                        width: 300,
                        sort: "string"
                    }],
                    autowidth: !0,
                    datatype: "jsarray",
                    data: t,
                    add_order: function(t) {
                        var o = t.getItem(t.getSelectedId())
                          , i = {
                            method: "orders.add_order",
                            params: [o[0], e.user_info.id]
                        }
                          , n = $$("orders_head_db").find(function(e) {
                            return e.id_Склад === i.params[0]
                        });
                        0 === n.length ? e.request(i, function(t) {
                            var o = JSON.parse(t);
                            if (e.check_response(o)) {
                                var i = o.result[0];
                                $$("orders_head_win").isVisible() && $$("orders_head_win").hide(),
                                $$("adres_win").hide(),
                                void 0 === $$("price_main_view") && $$("main_layout").addView(r),
                                $$("orders_head_db").load(),
                                $$("orders_head_db").setCursor(i),
                                $$("orders_head_db").bind_event(),
                                $$("orders_head_db").callEvent("onAfterCursorChange", [i]),
                                webix.UIManager.setFocus("main_search")
                            }
                        }, !0) : webix.message({
                            type: "error",
                            text: "Для данного адресса уже существует рабочий заказ"
                        })
                    },
                    on: {
                        onItemClick: function(e) {
                            this.config.add_order(this)
                        },
                        onKeyPress: function(e, t) {
                            13 === e && this.config.add_order(this)
                        }
                    }
                }]
            }, {
                padding: 5,
                id: "adres_win_footer",
                hidden: !0,
                cols: [{
                    view: "spacer"
                }, {
                    view: "button",
                    value: "Отменить",
                    css: "button_info",
                    width: 150,
                    click: function() {
                        $$("adres_win").hide()
                    }
                }]
            }]
        },
        on: {
            onShow: function() {
                var e = $$("adres_win_tb");
                e.select(e.getFirstId()),
                webix.UIManager.setFocus("adres_win_tb"),
                $$("orders_head_win").isVisible() && $$("adres_win_footer").show(),
                0 === $$("orders_head_db").count() && $$("adres_win_footer").hide()
            }
        }
    };
    return o
}),
define("views/windows/order_errors_win", ["app", "models/orders_error_db", "views/price/reorder_pnl"], function(e, t, r) {
    var o = {
        view: "window",
        id: "order_errors_win",
        head: "<span style='color: orange'>Внимание ошибки</span>",
        animate: {
            type: "flip",
            subtype: "vertical"
        },
        height: 534,
        position: "center",
        modal: !0,
        type: "warning",
        body: {
            width: 850,
            rows: [{
                padding: 10,
                rows: [{
                    view: "datatable",
                    scrollX: !1,
                    id: "order_errors_tbl",
                    height: 300,
                    hover: "hover_table",
                    navigation: !0,
                    tooltip: !0,
                    columns: [{
                        id: "title",
                        header: "Название",
                        fillspace: 3
                    }, {
                        id: "new",
                        header: "Новое",
                        fillspace: .5
                    }, {
                        id: "old",
                        header: "Старое",
                        fillspace: .5
                    }, {
                        id: "err",
                        header: "Ошибка",
                        fillspace: 1.5
                    }],
                    data: t
                }]
            }, {
                padding: 5,
                cols: [{
                    view: "spacer"
                }, {
                    view: "button",
                    value: "Отменить",
                    css: "button_info",
                    autowidth: !0,
                    click: function() {
                        t.clearAll(),
                        $$("order_errors_win").hide()
                    }
                }, {
                    view: "button",
                    value: "Перезаказать",
                    css: "button_success",
                    autowidth: !0,
                    click: function() {
                        void 0 !== $$("reorder_pnl") && $$("reorder_pnl").close(),
                        webix.ui(r).show(),
                        $$("order_errors_win").hide(),
                        t.setCursor(t.getFirstId())
                    }
                }, {
                    view: "button",
                    value: "Отправить как есть",
                    css: "button_warning",
                    autowidth: !0,
                    click: function() {
                        t.clearAll(),
                        $$("order_errors_win").hide(),
                        $$("orders_head_db").in_archive_()
                    }
                }]
            }]
        },
        on: {
            onShow: function() {}
        }
    };
    return o
}),
define("views/price", ["app", "models/orders_head_db", "views/windows/orders_head_win", "models/adres_db", "views/windows/adres_win", "views/windows/login_win", "views/windows/order_errors_win", "views/price_main_view"], function(e, t, r, o, i, n, s, a) {
    var d = {
        app: e,
        id: "mmp",
        cols: [{
            width: window.innerWidth,
            id: "main_layout",
            rows: []
        }]
    };
    return {
        $ui: d,
        $windows: [r, i, n, s],
        $oninit: function(r, i) {
            try {
                if (void 0 !== e.user_info.id) {
                    o.load(),
                    t.load();
                    var n = e.getCookie("lp_cur_ord");
                    void 0 !== n ? ($$("main_layout").addView(a),
                    t.setCursor(n),
                    e.deleteCookie("lp_cur_ord")) : $$("orders_head_db").count() > 0 ? $$("orders_head_win").show() : $$("adres_win").show(),
                    window.onresize = function() {
                        setTimeout(function() {
                            void 0 !== $$("orders_tbl") && $$("orders_tbl").adjust(),
                            void 0 !== $$("price_tbl") && $$("price_tbl").adjust()
                        }, 100)
                    }
                    ,
                    Object.keys(e.user_info.options.options).forEach(function(t) {
                        void 0 !== $$(t) && $$(t).setValue(e.user_info.options.options[t])
                    })
                } else
                    webix.alert("Ошибка авторизации")
            } catch (s) {}
        }
    }
}),
require(["app"]);
