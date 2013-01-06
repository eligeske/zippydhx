
var guidGenerator = function() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

var zippydhx = function (config) {
    var self = this;
    
    var config = config;
    
    this.config = {
    	iconPath: "",
    	imgPath: ""
    }
    
    // 1,2,3,4 (# of rows)

    // 1: body
    // 2: header,body
    // 3: header,top menu,body
    // 4: header,top menu,body,footer
    // 5: header,left menu,body

    this.application = function (layoutType, headers) {
        //$('head').append('<style>body,html{height:100%;width:100%;}</style>');
        var l = (jQuery.inArray(layoutType, [1, 2, 3, 4, 5])) ? layoutType : 1;
        var a = ""; if (l == 1) { a = "1C"; } else if (l < 4) { a = l + "E"; }
        else if (l > 4) { a = "2E"; } else { a = "3E" } l = (l == 4) ? 3 : l;
        var ly = new dhtmlXLayoutObject(document.body, a);
        if (l == 4) { var lyl = ly.cells('c').attachLayout('2E'); }
        else if (l == 5) { var lyl = ly.cells('b').attachLayout('2U'); }
        var rt = {};
        switch (l) {
            case 1: rt = { Body: ly.cells('a') }; break;
            case 2: rt = { Header: ly.cells('a'), Body: ly.cells('b') }; break;
            case 3: rt = { Header: ly.cells('a'), Menu: ly.cells('b'), Body: ly.cells('c') }; break;
            case 4: rt = { Header: ly.cells('a'), Menu: ly.cells('b'), Body: lyl.cells('a'), Footer: lyl.cells('b') }; break;
            case 5: rt = { Header: ly.cells('a'), Menu: lyl.cells('a'), Body: lyl.cells('b') }; break;
        }
        if (!headers) {
            for (var key in rt) {
                rt[key].hideHeader();
            }
        }
        rt.Layout = ly;
        return rt;
    };
    // layoutType, 2Col, 1Col
    this.twoColPage = function (name, container, headerLeft, headerRight) {
        this.Name = name;
        var layout = container.attachLayout('2U');
        this.Layout = layout;
        this.LeftCell = layout.cells('a');
        this.RightCell = layout.cells('b');
        if (headerLeft != undefined && headerLeft == false) { this.LeftCell.hideHeader(); }
        else { this.LeftCell.setText(headerLeft); }
        if (headerRight != undefined && headerRight == false) { this.RightCell.hideHeader(); }
        else { this.RightCell.setText(headerRight); }
    };
    // layoutType, 2Col, 1Col
    this.oneColPage = function (name, container, header) {
        this.Name = name;
        var layout = container.attachLayout('1C');
        this.Layout = layout;
        this.ContentCell = layout.cells('a');
        if (header != undefined && header == false) { this.ContentCell.hideHeader(); }
        else { this.ContentCell.setText(header); }
    };
    this.twoRowPage = function (name, container, headerTop, headerBottom) {
        this.Name = name;
        var layout = container.attachLayout('2E');
        this.Layout = layout;
        this.TopCell = layout.cells('a');
        this.BottomCell = layout.cells('b');
        if (headerTop != undefined && headerTop == false) { this.TopCell.hideHeader(); }
        else { this.TopCell.setText(headerTop); }
        if (headerBottom != undefined && headerBottom == false) { this.BottomCell.hideHeader(); }
        else { this.BottomCell.setText(headerBottom); }
    };
    this.view = function (parentCell) {

    };
    this.horizontalMenu = function () {

    };
  

    /*
    tabs = {
    tab1:{view: view, vm: viewmodel, text: "", width: "100px", active: true},
    tab2:{},
    tab3:{}
    }
    */
    this.tabLayout = function (container, tabs, handler) {

        var tabbar = container.attachTabbar();
        tabbar.setMargin('3');
        tabbar.setImagePath(self.config.imgPath);
        if (handler != undefined && handler != null) {
            tabbar.attachEvent('onSelect', handler);
        }
        for (var key in tabs) {
            var obj = tabs[key];
            tabbar.addTab(key, tabs[key]['text'], tabs[key]['width']);
            if (typeof (tabs[key].view) != 'undefined' && tabs[key].view != false && tabs[key].vm != null) {
                tabs[key].view = new tabs[key].view(tabbar.cells(key), tabs[key].vm);
            }
            if (tabs[key].active != undefined) {
                tabbar.setTabActive(key);
            }
        }

        return tabbar;
    }
    /*
    tabs = {
    tab1:{view: view, vm: viewmodel, text: "", width: "100px", active: true},
    tab2:{},
    tab3:{}
    }
    */
    this.addTabs = function (tabbar, tabs) {
        for (var key in tabs) {
            var obj = tabs[key];
            tabbar.addTab(key, tabs[key]['text'], tabs[key]['width']);
            if (typeof (tabs[key].view) != 'undefined' && tabs[key].view != false) {
                tabs[key].view = new tabs[key].view(tabbar.cells(key), tabs[key].vm);
            }
            if (tabs[key].active != undefined) {
                tabbar.setTabActive(key);
            }
        }
        tabbar.tabs = tabs;
        return tabbar;
    }
    // toolbarSettings: { // this contains a buttons array of object
    //            align: "left|right", // optional
    //            items: [  (type: "Button|ButtonTwoState|ButtonSelect|Input|Text|Separator")
    //                  {type: "Button", text: "", icon: "", callback: "" } // callback fires on "Click" 
    //                  {type: "Separator" } // places separator
    //                  {type: "ButtonTwoState", text: "", icon: "", callback: "", } // callback fires on "StateChange" returns state (true/false)
    //                  {type: "ButtonSelect", text: "", icon: "", callback: "", options: [ (type: "Button|Separator")
    //                                                                                        {},
    //                                                                                      ]} // callback fires on "StateChange" 
    //                  {type: "Input", text: "", value: "", width: "", callback: ""} // callback fires on "onEnter", returns input value (string)
    //                  {type: "Text", text: ""} 
    //            ]

    this.toolbar = function (container, settings) {
        var self_toolbar = this;
        var tid = guidGenerator();
        var toolbar = (typeof (container) == "string")? new dhtmlXToolbarObject(container):container.attachToolbar();
        toolbar.setIconPath(self.config.iconPath);
        this.toolbar = toolbar;


        /*  settings = {
        align: "left",
        items: [
        { type: "CheckBox", callback: function(state){ } }
        { type: "Separator" },
        { type: "Button", text: "Button", tooltip: "", icon: Icons.edit, iconDisabled: Icons.editDisabled, callback: function () { alert('a button was clicked'); } },
        { type: "Separator" },
        { type: "ButtonTwoState", text: "ButtonTwoState", icon: Icons.edit, callback: function (state) { alert('state was changed: ' + state); } ,args: "" },
        { type: "Separator" },
        { type: "Input", width: "100", placeholder: '', callback: function (text) { alert(text); } },
        ??
        { type: "Select", width: "100", items: [{text:'',icon:'', callback: function },{}]},
        ]
        }*/

        // SET ALIGN
        if (settings.align != undefined && (settings.align.toLowerCase() == "right" || settings.align.toLowerCase() == "left")) {
            toolbar.setAlign(settings.align.toLowerCase());
        }

        var createItem = {
            button: function (i) {
                toolbar.addButton(settings.items[i].id, i, (settings.items[i].text != undefined) ? settings.items[i].text : "", (settings.items[i].icon != undefined) ? settings.items[i].icon : null, (settings.items[i].iconDisabled != undefined) ? settings.items[i].iconDisabled : null);
                if ((settings.items[i].callback != undefined)) { clicks["event_" + i] = settings.items[i].callback; }
                if (settings.items[i].tooltip != undefined) { toolbar.setItemToolTip(settings.items[i].id, settings.items[i].tooltip); }
            },
            separator: function (i) {
                toolbar.addSeparator(settings.items[i].id);
            },
            buttontwostate: function (i) {
                toolbar.addButtonTwoState(settings.items[i].id, i, (settings.items[i].text != undefined) ? settings.items[i].text : "", (settings.items[i].icon != undefined) ? settings.items[i].icon : null, (settings.items[i].iconDisabled != undefined) ? settings.items[i].iconDisabled : null);
                if ((settings.items[i].callback != undefined)) { statechanged["event_" + i] = settings.items[i].callback; }
                if (settings.items[i].tooltip != undefined) { toolbar.setItemToolTip(settings.items[i].id, settings.items[i].tooltip); }
            },
            checkbox: function (i) {
                toolbar.addButtonTwoState(settings.items[i].id, i, (settings.items[i].text != undefined) ? settings.items[i].text : "", null);

                var check = function () {
                    var id = settings.items[i].id;
                    var checked = self_toolbar.toolbar.getItemState(id);
                    var isEnabled = self_toolbar.toolbar.isEnabled(id);
                    var img = (checked) ? Icons.checkbox_on : Icons.checkbox_off;
                    var imgd = (checked) ? Icons.checkedbox_on_disabled : Icons.checkbox_off_disabled;

                    if (toolbar.isEnabled(id)) {
                        toolbar.setItemImage(id, img); toolbar.setItemImage(id, img);
                    } else {
                        toolbar.setItemImageDis(id, imgd); toolbar.setItemImage(id, imgd);
                    }
                }
                settings.items[i].setChecked = function (state) {
                    var id = settings.items[i].id;
                    var isEnabled = self_toolbar.toolbar.isEnabled(id);
                    var img = (state) ? Icons.checkbox_on : Icons.checkbox_off;
                    var imgd = (state) ? Icons.checkedbox_on_disabled : Icons.checkbox_off_disabled;

                    if (toolbar.isEnabled(id)) {
                        toolbar.setItemImage(id, img); toolbar.setItemImage(id, img);
                    } else {
                        toolbar.setItemImageDis(id, imgd); toolbar.setItemImage(id, imgd);
                    }
                    self_toolbar.toolbar.setItemState(id, state);
                }
                if ((settings.items[i].callback != undefined)) {
                    statechanged["event_" + i] = function (state) { settings.items[i].callback(state); check() }
                } else {
                    statechanged["event_" + i] = check;
                }
                check();
                if (settings.items[i].tooltip != undefined) { toolbar.setItemToolTip(settings.items[i].id, settings.items[i].tooltip); }
            },
            select: function (i) {
                toolbar.addButtonSelect(settings.items[i].id, i, (settings.items[i].text != undefined) ? settings.items[i].text : "", [], (settings.items[i].icon != undefined) ? settings.items[i].icon : null, (settings.items[i].iconDisabled != undefined) ? settings.items[i].iconDisabled : null);
                if ((settings.items[i].callback != undefined)) { clicks["event_" + i] = settings.items[i].callback; }
                if ((settings.items[i].args != undefined)) { args["event_" + i] = settings.items[i].args; }

                this.len = settings.items[i].items.length;
                this.i = this.len - 1;
                for (this.i = this.i; this.i >= 0; this.i--) {
                    settings.items[i].items[this.i].id = settings.items[i].id + "o" + this.i;
                    toolbar.addListOption(settings.items[i].id, settings.items[i].id + "o" + this.i, this.i, 'button', settings.items[i].items[this.i].text);
                    if ((settings.items[i].items[this.i].callback != undefined)) { clicks["event_" + i + "o" + this.i] = settings.items[i].items[this.i].callback; }
                    if ((settings.items[i].items[this.i].args != undefined)) { args["event_" + i + "o" + this.i] = settings.items[i].items[this.i].args; }
                }

            },
            input: function (i) {
                toolbar.addInput(settings.items[i].id, i, (settings.items[i].value != undefined) ? settings.items[i].value : "", (settings.items[i].width != undefined) ? settings.items[i].width : 100);
                if ((settings.items[i].callback != undefined) && (settings.items[i].id != undefined)) { onenter["event_" + settings.items[i].id] = settings.items[i].callback; }
                else if (settings.items[i].callback != undefined) { onenter["event_" + i] = settings.items[i].callback; }
                if (settings.items[i].placeholder != undefined) {
                    $(toolbar.cont).find('input').attr('placeholder', settings.items[i].placeholder);
                }
            },
            text: function (i) {
                toolbar.addText(settings.items[i].id, i, (settings.items[i].text != undefined) ? settings.items[i].text : "");
            }
        };

        var onClick = function (id) {
            if (clicks["event_" + id.split('_')[1]] != undefined) {
                if (args["event_" + id.split('_')[1]] != undefined) {
                    clicks["event_" + id.split('_')[1]](args["event_" + id.split('_')[1]]);
                } else {
                    clicks["event_" + id.split('_')[1]]();
                }
            }
        };
        var onStateChange = function (id) {
            if (statechanged["event_" + id.split('_')[1]] != undefined) {
                statechanged["event_" + id.split('_')[1]](toolbar.getItemState(id));
            }
        };
        var onEnter = function (id) {
            if (onenter["event_" + id] != undefined) {
                onenter["event_" + id](toolbar.getValue(id));
            }
            if (onenter["event_" + id.split('_')[1]] != undefined) {
                onenter["event_" + id.split('_')[1]](toolbar.getValue(id));
            }
        };

        var clicks = {};
        var args = {};
        var statechanged = {};
        var onenter = {};

        // apply items
        if (settings.items != undefined && settings.items.length > 0) {
            for (i = 0; i < settings.items.length; i++) {
                if (createItem[settings.items[i].type.toLowerCase()] == undefined) {
                    alert("Your toolbar has an incorrect/missing type in the items array.");
                }
                if (settings.items[i].id == undefined) {
                    settings.items[i].id = tid + "_" + i;
                }
                createItem[settings.items[i].type.toLowerCase()](i);
                if (settings.items[i].spacer != undefined) {
                    toolbar.addSpacer(settings.items[i].id);
                }
            }
            toolbar.items = settings.items;
        }
        // create callback methods for item id's

        // events
        toolbar.attachEvent('onClick', function (id) { onClick(id); });
        toolbar.attachEvent('onStateChange', onStateChange);
        toolbar.attachEvent('onEnter', onEnter);
        return toolbar;
    }

    this.expandTreeItems = function (tree) {
        var items = tree.getAllItemsWithKids();
        items = items.split(",");
        for (i = 0; i < items.length; i++) {
            tree.openAllItems(items[i]);
        }
    }
    this.collapseTreeItems = function (tree) {
        var items = tree.getAllItemsWithKids();
        items = items.split(",");
        for (i = 0; i < items.length; i++) {
            tree.closeAllItems(items[i]);
        }
    }

};

zippy = new zippydhx();