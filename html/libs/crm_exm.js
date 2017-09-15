"use strict";

document.cookie='path=/';

//variables

var locale = getCookie('lang');
var auth_key = getCookie('key');
var auth_url = '/login_superwarden/logic';
var req_url = '/superwarden/logic';
var sse_url = "/events/SSE?my_id";
var eventS = new EventSource(sse_url);
var but;

var rep_body = {id: "replist", view: "list", width: 500, borderless: true,
            template: "<div class='f_name'>#datas.file_name#</div>" +
                "<br><div class='file_name'>#datas.service_name#</div>",
            select: true,
            borderless: true,
            type: {height:65},
            url: update_rep_list()
        };

var run_srv_body = {id: "serv_list", view: "treetable", 
            columns: [
                //{id: "serv_list_check", header:{ content:"masterCheckbox" }, checkValue:'on', uncheckValue:'off',
                    //template:"{common.checkbox()}", width:40},
                {id: "uid", width: 350, header: "<div class='s_header'>" + _serviceuid[locale] + "</div>",
                    template:"{common.treetable()} #uid#"},
                {id: "appname", header: _service_name[locale], width: 200},
                {id: "profile", header: _profile[locale], width: 180},
                {id: "version", header: _version[locale], width: 150}
                ],
            filterMode:{ showSubItems:false },
            select: true,
            url: update_serv_list()
        };

var srvs_form = {
    id: "srvs_info",
    view:"form",
    elements:[
        {
        cols: [
            {rows:[
                {view:"text", name:"appname", label:_service_name[locale], readonly: true, labelWidth: 120},
                {view:"text", name:"pid", label:_pid[locale], readonly: true, labelWidth: 120},
                {view:"text", name:"index", label:_index[locale], readonly: true, labelWidth: 120}
                ]},
            {rows:[
                {view:"text", name: 'version', label:_version[locale], readonly: true, labelWidth: 120},
                {view:"text", name: 'extip', label:_extip[locale], readonly: true, labelWidth: 120},
                {view:"text", name: 'nginx path', label: _accessurl[locale], readonly: true, labelWidth: 120}
                ]}
            ]
        }],
    disabled: true
    };

var rep_form = {
    view: "form",
    id: "rep_info",
    elements:[
        {view:"text", id: "f2_id_id", name: 'name', label:_filename[locale], readonly: true, labelWidth: 120, disabled: true},
        {view:"text", id: "c_line", label: _comline[locale], labelWidth: 120, disabled: true,
            tooltip: _comlinetip[locale]},
        {cols: [
        {view:"counter", id: "srvs_num", label:_number[locale], step:1, value:3, min:1, max:5,
            labelWidth: 120, disabled: true, align: 'left', tooltip: _numbertip[locale]},
        {view:"text", id: "s_start", label:_startupconf[locale], labelWidth: 120, disabled: true, popup: "pop_m_conf",
            tooltip: _startupconftip[locale]},
            ]}
        ]
    };

//functions

function switch_lang(){
    if (locale == 'rus') {
            document.cookie='lang=eng';
        }
        else {
            document.cookie='lang=rus';
        }
    document.cookie='reload=1';
    location.reload();
    }

// возвращает cookie с именем name, если есть, если нет, то пустую строку или переменную locale, если name = lang
function getCookie(name) {
    if (name === 'lang') {
        var ret = locale;
    } else {
        ret = ''
    };
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : ret;
}

function action(method){
    var spid = $$("serv_list").getSelectedItem().pid;
    after_serv_action();
    if (method == 'kill') {
        var params = {'kill': spid}
    } else if (method == 'reload') {
        params = {'reload': spid}
    };
    webix.ajax().headers({'x-api-key': auth_key, 'Content-type': 'application/json'}).post(req_url,
        params).then(function(result){
            setTimeout(function() {update_serv_list();}, 4000);
            })
            .fail(function (xhr) {
                console.log(xhr);
            });
    }

function unselect_rep(){
    $$("f2_id_id").disable();
    $$("replist").unselectAll();
    $$("serv_list").unselectAll();
    $$("c_line").setValue("");
    $$("srvs_num").setValue("3");
    $$("c_line").disable();
    $$("srvs_num").disable();
    $$("run_but").disable();
    $$("full_info_but").disable();
    $$("s_start").setValue('');
    $$("s_start").disable();
    setTimeout(function() {
        update_serv_list();
        update_rep_list();
        }, 4000);
    }

function update_rep_list() {
    new webix.DataCollection({
        url: {
            $proxy:true,
            source: req_url,
            load: function(view, callback){
                webix.ajax().headers({'x-api-key': auth_key, 'Content-type': 'application/json'}).post(this.source, {'rep_dir': ''})
                    .then(function(data){
                        webix.ajax.$callback(view, callback, "", data, -1);
                        data = data.json();
                        });
                    }
            },
        on:{
            onAfterLoad:function(){
                $$("replist").data.sync(this);
                $$("run_but").define('badge', this.data.count());
                $$("run_but").refresh();
                    }
                }
        });
    };

function update_serv_list() {
    new webix.DataCollection({
        url: {
            $proxy:true,
            source: req_url,
            load: function(view, callback){         
                webix.ajax().headers({'x-api-key': auth_key, 'Content-type': 'application/json'}).post(this.source, {'pr_list':''})
                    .then(function(data){
                        webix.ajax.$callback(view, callback, "", data, -1);
                        data = data.json();
                        });
                    }
            },
      on:{
        onAfterLoad:function(){
            $$("serv_list").data.sync(this);
            $$("stop_but").define('badge', this.data.count());
            $$("stop_but").refresh();
                }
            }
        });
};

function serv_list_ungroup(){
    $$("serv_list").ungroup();
    $$("pop_m").hide()
    update_serv_list();
    update_rep_list();
    after_serv_action()
    };

function after_serv_action(){
    $$("serv_list").unselectAll();
    $$("r_serv_info").disable();
    $$("reload_but").disable();
    $$("stop_but").disable();
    };

if (auth_key != '') {
    document.but = {view:"button", id: 'logout_button', type:"htmlbutton", css: 'but', inputHeight: 26,
                label: _logout[locale], width: 66};
} else {
    document.but = {view:"button", id: 'login_button', type:"htmlbutton", css: 'but', inputHeight: 26,
                label: _login[locale], width: 56, popup: "auth_form"};
    }

//main
 webix.ui({
    id: "m1",
    view: 'layout',
    rows:[
        {view: 'toolbar',
        cols: [
            {view: "label", label: "<a href='http://ms71.org'><span class='ms-logo'></span></a>", width: 50,
                align: 'center', height: 46},
            {view: "label", label: _manuscript[locale] + ": superwarden", css: 'ms-logo-text',
                height: 46},
            {view: "label", id: 'payload', label: 'No event source connection', height: 46},
            document.but,
            {view:"button", id: 'lang_button', type:"htmlbutton", css: 'but', inputHeight: 26,
                label: _lang[locale], width: 46},
            ]},
        {cols:[
            {rows: [
                {id: "rep_header", type: "header", template: _replist[locale], align: 'center'},
                {view:"text", borderless: true, id:"rep_filter",
                    label:_filterfn[locale], labelWidth:120},
                {type: "header", body: rep_body},
                {type: "header", body: rep_form},
                {cols:[
                    {view: "button", id: "run_but", value: _runs[locale], type: 'form',
                        inputHeight: 30, disabled: true, css: "w_pad"},
                    {view: "button", id: "full_info_but", value: _fullinfo[locale], type: 'form',
                        inputHeight: 30, disabled: true, css: "w_pad"},
                    {view: "button", type: "button", id: "unused_but", value: _unass[locale], type: 'form',
                        inputHeight: 30, css: "w_pad"}
                    ]}
                ]},
            {view: "spacer", width: 10},
            {rows: [
                {type: "header", template: _runslist[locale]},
                {view:"text", borderless: true, id:"srvs_filter",
                    label:_filtern[locale], labelWidth:120},
                {type: "header", body: run_srv_body, gravity: 2},
                {type: "header", body: srvs_form},
                {cols:[
                    {view: "button", id: "r_serv_info", value: _servinfo[locale], type: 'form', inputHeight: 30,
                        disabled: true, css: "w_pad"},
                    {view: "button", id: "reload_but", value: _reload[locale], type: 'form', inputHeight: 30,
                        disabled: true, css: "w_pad"},
                    {view: "button", id: "stop_but", value: _stop[locale], type: 'form', inputHeight: 30,
                        disabled: true, css: "w_pad"},
                    {view: "button", id: "group_but", value: _group[locale], type: 'form', inputHeight: 30,
                        popup: "pop_m", css: "w_pad"}
                    ]},
                ]}
                ]
            },
        {template: _servon[locale] + '&nbsp;<span class="serv_info">' + location.hostname + "</span>",
            height: 30, id: "foot1"}
        ]
    });

webix.ui({
    view: "popup",
    id: "pop_m_conf",
    body: 
        {id: "c_list", view:"list", width: 250, borderless: true, template:"#name#",
        select:true, disabled: false,
        data:[
            {id:1, 'name': 'name 1', 'value':"Item 1"},
            {id:2, 'name': 'name 2', 'value':"Item 2"},
            {id:3, 'name': 'name 3', 'value':"Item 3"},
            ]
        }
    });

webix.ui({
    view: "popup",
    id: "auth_form",
    body:
        {view:"form", 
        id:"log_form",
        width:300,
        elements:[
            { view:"text", id: "log_view", label: _log_txt[locale], name:"login"},
            { view:"text", id: "pass_view", label: _pass[locale], name:"password", type:"password"},
            {cols:[
                {},
                {view:"button", id: "log_but", value: _login[locale] , type:"form"},
                {}
                ]}
            ]}
    });

webix.ui({
    view: "popup",
    head: "sub-menu",
    id: "pop_m",
    width: 200,
    body: {
        rows: [
            {view: "button", id: "group1_but", value: _group1[locale], type: 'form'},
            {view: "button", id: "group2_but", value: _group2[locale], type: 'form'},
            {view: "button", id: "ungroup_but", value: _group3[locale], type: 'form'}
            ]}
    });

//binds
$$("srvs_info").bind($$("serv_list"));
$$("rep_info").bind($$("replist"));


//webix actions

$$("rep_filter").attachEvent("onTimedKeyPress",function(){
    var value = this.getValue().toLowerCase();
    $$("replist").filter(function(obj){
        return obj.datas.file_name.toLowerCase().indexOf(value)==0;
    })
});

$$("srvs_filter").attachEvent("onTimedKeyPress",function(){
    var value = this.getValue().toLowerCase();
    $$("serv_list").filter(function(obj){
        return obj.appname.toLowerCase().indexOf(value)==0;
    })
});

$$("replist").attachEvent("onAfterSelect", function(){
    var ee;
    ee = $$("replist").getSelectedItem().datas.file_name;
    $$("f2_id_id").setValue(ee)
    $$("f2_id_id").enable();
    $$("run_but").enable();
    $$("full_info_but").enable();
    $$("c_line").enable();
    $$("srvs_num").enable();
    $$("s_start").enable();
    });

$$("serv_list").attachEvent("onAfterSelect", function(){
    $$("r_serv_info").enable();
    $$("reload_but").enable();
    $$("stop_but").enable();
    });

$$("run_but").attachEvent("onItemClick", function(){
    var run_name = $$("f2_id_id").getValue().slice(0, -4);
    var s_com_line = $$("c_line").getValue();
    var s_num = $$("srvs_num").getValue();
    var conf_value = $$("s_start").getValue();
    var s_com_line_value = run_name + ',' + s_num;
    console.log(run_name, s_com_line, s_num, conf_value);
    webix.ajax().headers({'x-api-key': auth_key, 'Content-type': 'application/json'}).post(req_url,
        {"jsonrpc": "2.0", "run": s_com_line_value}).then(function(result){
            unselect_rep();
                });
    });
    
$$("stop_but").attachEvent("onItemClick", function(){
    action('kill');
    });

$$("reload_but").attachEvent("onItemClick", function(){
    action('reload');
    });

$$("group1_but").attachEvent("onItemClick", function (){
    serv_list_ungroup();
    setTimeout(function(){
        $$("serv_list").group({
            by:"appname",
            map:{uid:["appname"]}
            }); }, 500);
    });

$$("group2_but").attachEvent("onItemClick", function (){
    serv_list_ungroup();
    setTimeout(function(){
        $$("serv_list").group({
            by:"profile",
            map:{uid:["profile"]}
            }); }, 500);
    });
    
$$("ungroup_but").attachEvent("onItemClick", function (){
    serv_list_ungroup();
    });

$$("unused_but").attachEvent("onItemClick", function (){
    webix.message('unassigned button');
    });

$$("c_list").attachEvent("onAfterSelect", function (){
    $$("s_start").setValue($$("c_list").getSelectedItem().value);
    $$("c_list").unselectAll();
    $$("pop_m_conf").hide();
    });

$$('lang_button').attachEvent("onItemClick", function (){
    switch_lang();
    });

$$("log_but").attachEvent("onItemClick", function(){
    $$("auth_form").hide();
    var user = $$("log_view").getValue();
    var pass = $$("pass_view").getValue();
    $$("log_view").setValue('');
    $$("pass_view").setValue('');
    var hash = md5(user + pass);
    webix.ajax().headers({'x-api-key': hash, 'Content-type': 'application/json'})
                .post(auth_url, {'login': user})
                .then(function(result){
                    var ret = result.json();
                    if (ret != '') {
                        document.cookie='key=' + ret + ';expire=';
                        document.cookie='reload=1';
                        document.cookie='user=' + user
                        location.reload();
                    } else {
                        console.log('A error');
                    }
                    });
    });

if (auth_key != '') {
    $$("logout_button").attachEvent("onItemClick", function(){
        var user =  getCookie('user');
        document.cookie = 'reload=1';
        var date = new Date;
        date.setDate(date.getDate() - 1);
        var d1 = '' + ';expire=' + date.toUTCString();
        document.cookie = 'key=' + d1;
        webix.ajax().headers({'Content-type': 'application/json'})
                    .post(auth_url, {'logout': user});
        location.reload();
        });
    }

window.addEventListener('beforeunload', function (event_s) {
    var rel = getCookie('reload');
    var user =  getCookie('user');
    var date = new Date;
    date.setDate(date.getDate() - 1);
    var d1 = '' + ';expire=' + date.toUTCString();
    document.cookie = 'reload=' + d1;
    if (rel != '1') {
        document.cookie = 'key=' + d1;
        document.cookie = 'user=' + d1;
        webix.ajax().headers({'Content-type': 'application/json'}).post(auth_url, {'logout': user});
        };
}, false);

eventS.onmessage = function(e) {
    $$('payload').setValue(e.data);
    $$('payload').refresh();
};

eventS.addEventListener('join', function(e) {
    $$('payload').setValue(e.data);
    $$('payload').refresh();
});

eventS.addEventListener('close', function(e) {
    eventS.close();
});

    


