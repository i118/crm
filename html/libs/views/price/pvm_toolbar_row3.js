define([
    "app"
],function(app){
    var ui = {
                id: 'pvm_toolbar_row3',
                css: "pvm_toolbar_col",
                hidden: true,
                cols: [
                    {view:"button", align:"left", label: "назад", width:100, 
                        on: {
                            onItemClick: function(){
                                $$('pvm_toolbar_row3').hide()
                                //$$('pvm_toolbar_row1').show();
                                $$('pvm_toolbar_row2').show();
                                $$('vnd_panel_flx').show();                                
                                
                                app.resize_app() 

                                $$('main_search').setValue('')                                                            
                                $$('main_search').callEvent('onChange',['','']);
                                setTimeout(function() {
                                    webix.UIManager.setFocus('main_search');                                    
                                }, 250);
                            }
                        }
                    },
                    { 
                        view:"text", 
                        value:'',
                        id: "matrix_search",
                        placeholder:"Поиск",
                        old_search: '',                        
                        timeout: null,
                        width: window.innerWidth <= 1170 ? 100: 402,
                        keyPressTimeout: 700,
                        on: {
                            onChange: function(newv) {
                                //console.log('onChange')
                                var me = this;
                                if (newv !== ''){
                                    $$('defecture_db').filter(function(el){
                                        return el.title.toUpperCase().indexOf(newv.toUpperCase()) > -1
                                    })
                                } else {
                                    $$('defecture_db').filter(function(el){
                                        return 1
                                    })
                                }
                            },
                            onTimedKeyPress: function() {
                                var me = this;
                                this.callEvent('onChange', [me.getValue()]);
                            },
                            onKeyPress: function(code, e){
                                
                                if (code === 40 ) {
                                    var table = $$('defecture_tbl'),
                                        dtstore = $$('defecture_db'),
                                        table_n = 'defecture_tbl';
                                    if ( dtstore.count() > 0) {
                                        table.select(table.getFirstId());
                                        webix.UIManager.setFocus(table_n);
                                    }
                                }
                                
                            }
                        }
                        
                    }
                    
                ]
            };
    
    return ui
    
});