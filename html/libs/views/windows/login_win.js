define([
    "app"
], function(app){
    
    var ui = {
            view: "window",
            id: "login_win",
            head: "Вход",                                                        
            height: 300,
            width: 339,
            position:"center",                                                        
            modal: true,
            body:{
                //width: 125,
                rows: [
                    {
                        view: "form",
                        elements: [
                            {
                                view: "text",
                                id: "login",
                                label: "",
                                labelWidth: "100",
                                value: "",
                                placeholder: "Логин",
                                on: {
                                    onKeyPress: function(code, e){
                                        var login = $$('login').getValue();
                                        if ( code === 13 && login !== "") {
                                            webix.UIManager.setFocus("password");
                                        }
                                    }
                                }
                            },
                            {
                                view: "text",
                                id: "password",
                                label: "",
                                labelWidth: "100",
                                placeholder: "Пароль",
                                type:"password",
                                on: {
                                    onKeyPress: function(code, e){
                                        var password = $$('password').getValue(),
                                            login = $$('login').getValue();
                                        if ( code === 13 && password !== "") {
                                            if (login !== "") {
                                                webix.UIManager.setFocus("indoor");
                                            } else {
                                                webix.UIManager.setFocus("login");
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {   
                        padding: 2,
                        cols: [
                            {
                                view: "button",
                                id: "indoor",
                                value: "Войти",
                                login: function(){
                                    var password = $$('password').getValue(),
                                        login = $$('login').getValue();
                                    if (password !== "" && login !== "") {
                                        app.login(login, password);
                                    } else {
                                        webix.UIManager.setFocus("login");
                                    }
                                },
                                on: {
                                    onItemClick: function(){
                                        $$('indoor').config.login();
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            on: {
                onShow: function(){
                    webix.UIManager.setFocus("login");
                }
            }
        };
        
    return ui;
});
