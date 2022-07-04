/**
 * @preserve
 * XMS - Online Web Development
 * 
 * Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 * Licensed under GPL license.
 * http://www.aws-dms.com
 *
 * Date: 2010-10-24
 */

//0.4.23 small tweaks on splitter
//0.4.22 duplicateNode tool
//0.4.22 trash tool visibility when elements are checked
//0.4.21 splitter
//0.4.20 defaultRootElemOnInit default document type html5
//0.4.20 runtime option to show/hide node tools by default
//0.4.20 automatically empty checkedStack on new document
//0.4.20 fixed runtimeOptions not showing true values of checked options
//0.4.20 node tools visibility: display according to node type
//0.4.19 return and ctrl return on wrap around, search dialog, insertNode
//0.4.17 setElementToolsVisibility
//0.4.16 below improved for nodeTools
//0.4.12 using smartArray; swithed from active to selected on most node tools
//0.4.12 fileOpenDialog: Ctrl+return to open a file in new window
//0.4.12 minor changes and populate bind changed to on
//0.4.11 inserting/updating recent files in ::processDataSource to have it centralized (show/record url when GET[datasrc] also)
//0.4.10 fileOpenDialog to show recent files records in reversed order
//0.4.10 fileOpenDialog to show prev or next sibling of the deleted (with Clear) option
//0.4.10 fixed fileOpenDialog on return switched from blur to focus to set lastFocused
//0.4.09 improved scrollTo
//0.4.04 recent files feature
//0.4.02 using Database class for DOMStorage
//0.4.01 jquery xpath plugin introduced; xpath search and run works
//0.3.02-beta - runtime options to window.localStorage
//0.3.01-beta - switched from bubble to jquery tooltip
//0.3.01-beta - switched from event triger to kvaTree methods on expand collapse tree nodes
//0.24.02 - console messages
//0.24.01 - Upgraded to jquery 1.10.2 and ui 1.10.4
//0.23.01 - Fixed Chrome bug on initAttributeTools - attr did not had the ownerElement property - why?
//0.22.01 - displays the messages from server when saving files
//0.21.01 - html entities encoded in show text pi comment....
//0.19.01 - obj.processDataSourceCallback changed DATA_IMPORT to xml to match xmlserve.php
//0.19.01 - dynamic scroll
//0.18.01 - saveCallback - document save transfer as xml content type
//0.17.01 - fixed cut child nodes bug
//0.16.xx - reload tree on various node operations - improved
//0.16.xx - help on F1 key
//TODO
//direct in Database, daca dimensiunea inregistrarilor atinge max - alert; depaseste max sa ceara sa stergi inregistrari
//imbunatatire regex pt insertNode
//schimb activare node tools de ;a active la check
$.fn.xmlEditor = function (options) {
    var obj = this;
    var DOMObj = this.get(0);
    obj.instanceOf = "Designer";
    obj.version = "0.4";
    obj.releaseDate = "2015-03-28";
    obj.credentials = "23";
    obj.UId = obj.instanceOf + "_" + obj.get(0).nodeName.toUpperCase() + "_" + obj.attr("id") + "_" + Math.ceil(1000000 * Math.random());
    obj.attr("UID", obj.UId).attr("iof", obj.instanceOf);

    obj.clipboard = new Array();

    //holds the list of the checked elements in the tree
    obj.checkedStack = new Array();

    obj.checkedStack.afterPush = function (status) {
        console.info(this.length + " Checked elements");
    };
    obj.checkedStack.afterSplice = function (from, howMany) {
        console.info("checkedStack - Removed " + howMany + " item");
    };
    obj.checkedStack.onDepleted = function () {
        console.info("checkedStack Depleted");
    };

    this.rigths = "";
    this.defaults = {
        autoinit: true,
        alterDOM: false,
        name: $(this).attr("id"),
        id: $(this).attr("id"),
        dataSource: $(this).attr("dataSrc"),
        showDOMElementsOnly: false,
        isMobile: function () {
            var mobile = (/iphone|ipad|mobile|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
            if (mobile) {
                return true
            } else {
                return false
            }
        },
        defaultRootElemOnInit: '<app outputxsl="xsl/aws2html5.xsl"/>',
        serverEngine: "xmlserver.php",
        insertNode_allowWhenForbiden: true,
        acceptNodes: function (thisOne, parent) {
            var whereTo = o.documentMap.nodes[parent.nodeName];
            if (whereTo) {
                return whereTo[thisOne]
            } else {
                return true
            }
        },
        acceptAttributes: function (thisOne, parent) {
            var whereTo = o.documentMap.attributes[parent.nodeName];
            if (whereTo) {
                return whereTo[thisOne]
            } else {
                return true
            }
        },
        documentMap: {
            nodes: {},
            attributes: {}
        },
        runtimeOptions: {
            showDOMElementsOnly: {
                name: "showDOMElementsOnly",
                message: "Show DOMElements only?",
                value: false,
                type: "checkbox",
                alt: ""
            },
            namespaceFix: {
                name: "namespaceFix",
                message: "Apply XML Stylesheet when saving document?",
                value: false,
                type: "checkbox",
                alt: ""
            },
            usethisstylesheet: {
                name: "usethisstylesheet",
                message: "XSL to apply when above selected",
                value: "xsl/namespacefix-xmldoc.xsl",
                type: "text",
                alt: ""
            },
            defaultPathOnLoad: {
                name: "defaultPathOnLoad",
                message: "Open URL default value",
                value: "templates/appTemplate.xml",
                type: "text",
                alt: ""
            },
            newDocDefaultRootNode: {
                name: "newDocDefaultRootNode",
                message: "New document default root",
                value: "app",
                type: "text",
                alt: ""
            },
            showThisAttributeInsteadTreeNodeName: {
                name: "showThisAttributeInsteadTreeNodeName",
                message: "Attribute value to show instead of node name in dom tree when set",
                value: "name",
                type: "text",
                alt: ""
            },
            autoClearClipboard: {
                name: "autoClearClipboard",
                message: "Clear clipboard automatically after paste?",
                value: true,
                type: "checkbox",
                alt: ""
            },
            defaultPITarget: {
                name: "defaultPITarget",
                message: "Default #PI target",
                value: "aws",
                type: "text",
                alt: ""
            },
            displayNodesFilter: {
                name: "displayNodesFilter",
                message: "Tree nodes display filter",
                value: "{'remotetemplate':true, 'use':true, 'init':true, 'name':true, 'client':true, 'content':true, 'header':true, 'exec':true, 'replace':true, 'runhere':true, 'replace':true, 'case':true, 'filter':true, 'runfirst':true, 'eachnode':true, 'eachnamednode':true, 'import':true, 'advancedimport':true, 'run':true, 'eachreference':true, 'eachnamedreference':true, 'norecords':true, 'return':true, 'check':true, 'socket':true, 'data':true,'finally':true,'default':true,'parsers':true,'item':true,'callback':true,'nodelist':true,'xpath':true,'templates':true}",
                type: "text",
                alt: "Ex: {nodeName:true, anotherNode:false}"
            },
            applyDisplayFilters: {
                name: "applyDisplayFilters",
                message: "Check this to apply above nodes tree display filter?",
                value: false,
                type: "checkbox",
                alt: ""
            },
            clearRecentFilesWhenLogoff: {
                name: "clearRecentFilesWhenLogoff",
                message: "Clear recent files when logoff?",
                value: false,
                type: "checkbox",
                alt: ""
            },
            nodeToolsAlwaysShow: {
                name: "nodeToolsAlwaysShow",
                message: "Always show node tools?",
                value: true,
                type: "checkbox",
                alt: ""
            }
        },
        treeDisplayFilter: function (node) {
            if (obj.runtimeOptions.applyDisplayFilters.value) {
                var toReturn = false;
                if (obj.displayNodesFilter[node.nodeName] == true) {
                    toReturn = true
                } else {
                    for (a in obj.displayNodesFilter) {
                        if ($(a, node).length > 0) {
                            toReturn = true
                        }
                    }
                }
            } else {
                toReturn = true
            }
            return toReturn
        },
        documentRules: {
            blank: {
                nodes: {},
                attributes: {}
            },
            rss: {
                nodes: {
                    rss: {
                        channel: true
                    },
                    channel: {
                        title: true,
                        description: true,
                        lastBuildDate: true,
                        pubDate: true,
                        item: true,
                        language: true,
                        copyright: true,
                        title : true,
                                managingEditor: true,
                        webMaster: true,
                        category: true,
                        generator: true,
                        docs: true,
                        cloud: true,
                        ttl: true,
                        image: true,
                        rating: true,
                        textInput: true,
                        skipHours: true,
                        skipDays: true
                    },
                    image: {
                        url: true,
                        title: true,
                        link: true
                    },
                    textInput: {
                        title: true,
                        description: true,
                        link: true,
                        name: true
                    },
                    item: {
                        title: true,
                        description: true,
                        link: true,
                        author: true,
                        guid: true,
                        pubDate: true,
                        category: true,
                        content: true,
                        subject: true,
                        date: true,
                        type: true,
                        comments: true,
                        enclosure: true,
                        source: true
                    }
                },
                attributes: {}
            },
            userParsers: {
                nodes: {
                    parsers: {
                        item: true
                    },
                    item: {
                        alias: true,
                        check: true,
                        xpath: true,
                        callback: true
                    }
                },
                attributes: {}
            },
            lang: {
                nodes: {
                    lang: {
                        RO: true,
                        EN: true,
                        GE: true,
                        FR: true,
                        RU: true
                    },
                    RO: {
                        app: true
                    },
                    EN: {
                        app: true
                    },
                    GE: {
                        app: true
                    },
                    FR: {
                        app: true
                    },
                    RU: {
                        app: true
                    },
                    app: {
                        ui: true,
                        err: true,
                        sys: true
                    },
                    ui: {
                        message: true
                    },
                    err: {
                        message: true
                    },
                    sys: {
                        message: true
                    }
                },
                attributes: {
                    app: {
                        id: true
                    },
                    message: {
                        id: true
                    }
                }
            },
            iptables: {
                nodes: {
                    "iptables-rules": {
                        table: true
                    },
                    table: {
                        chain: true
                    },
                    chain: {
                        rule: true
                    },
                    rule: {
                        conditions: true,
                        actions: true
                    },
                    conditions: {
                        match: true,
                        state: true,
                        pkttype: true,
                        tcp: true,
                        udp: true,
                        icmp: true
                    },
                    pkttype: {
                        "pkt-type": true
                    },
                    icmp: {
                        "icmp-type": true
                    },
                    tcp: {
                        "tcp-flags": true,
                        dport: true,
                        sport: true
                    },
                    udp: {
                        "udp-flags": true,
                        dport: true,
                        sport: true
                    },
                    match: {
                        i: true,
                        o: true,
                        s: true,
                        d: true,
                        p: true,
                        f: true
                    },
                    state: {
                        state: true
                    },
                    actions: {
                        ACCEPT: true,
                        DROP: true,
                        REJECT: true,
                        RETURN: true,
                        LOG: true,
                        NOTRACK: true,
                        MASQUERADE: true,
                        call: true
                    },
                    LOG: {
                        "log-prefix": true
                    }
                },
                attributes: {
                    "iptables-rules": {
                        version: true
                    },
                    table: {
                        name: true
                    },
                    chain: {
                        name: true,
                        policy: true,
                        "packet-count": true,
                        "byte-count": true
                    }
                }
            },
            config: {
                nodes: {},
                attributes: {}
            },
            appTemplate: {
                nodes: {
                    app: {
                        name: true,
                        client: true,
                        filters: true,
                        templates: true,
                        parsers: true,
                        init: true
                    },
                    client: {
                        header: true,
                        content: true
                    },
                    header: {
                        load: true,
                        run: true,
                        title: true,
                        style: true,
                        metas: true,
                        links: true,
                        keywords: true
                    },
                    metas: {
                        element: true
                    },
                    links: {
                        element: true
                    },
                    filters: {
                        ob: true,
                        dom: true
                    },
                    exec: {
                        param: true,
                        "return": true
                    },
                    "import": {
                        filter: true,
                        check: true
                    },
                    advancedimport: {
                        filter: true,
                        check: true,
                        http: true,
                        ftp: true,
                        data: true,
                        socket: true
                    },
                    xmlimport: {
                        filter: true,
                        check: true
                    },
                    advancedxmlimport: {
                        filter: true,
                        check: true,
                        http: true,
                        ftp: true,
                        data: true,
                        socket: true
                    },
                    ob: {
                        filter: true
                    },
                    dom: {
                        filter: true
                    },
                    filter: {
                        marker: true,
                        "eval": true,
                        match: true,
                        matchIterator: true,
                        xpath: true,
                        nodeList: true,
                        domiterator: true
                    },
                    parsers: {
                        item: true
                    },
                    item: {
                        alias: true,
                        check: true,
                        xpath: true,
                        callback: true
                    },
                    domiterator: {
                        eachreference: true
                    },
                    init: {
                        "return": true
                    }
                },
                attributes: {
                    app: {
                        outputxsl: true,
                        outputdisabled: true
                    },
                    "import": {
                        source: true,
                        xpath: true
                    },
                    advancedimport: {
                        source: true,
                        xpath: true
                    },
                    xmlimport: {
                        source: true,
                        xpath: true
                    },
                    advancedxmlimport: {
                        source: true,
                        xpath: true
                    },
                    http: {
                        method: true,
                        header: true,
                        content: true,
                        timeout: true,
                        proxy: true,
                        request_fulluri: true,
                        user_agent: true
                    },
                    ftp: {
                        method: true,
                        header: true,
                        content: true,
                        timeout: true,
                        proxy: true,
                        request_fulluri: true,
                        user_agent: true
                    }
                }
            }
        },
        denyNodes: function (thisOne, parent) {
            var N = new String(thisOne).toUpperCase();
            if (N == "HTML" || N == "HEAD") {
                return true
            } else {
                return false
            }
        },
        denyAttributes: function (thisOne, parent) {
            var N = new String(thisOne).toLowerCase();
            if (N == "awsuid") {
                return true
            } else {
                return false
            }
        },
        treeOptions: {
            multi: true,
            autoclose: false,
            onNodeCheckedCallback: function (status) {
                if (status) {
                    //daca este checked
                    if (!obj.checkedStack.contains(this))
                        //adauga daca nu exista
                        obj.checkedStack.push(this);
                } else {
                    //daca nu este checked
                    if (obj.checkedStack.contains(this))
                        //sterge daca exista
                        obj.checkedStack.removeItem(this);
                }
            },
            onClick: function (e, node) {

                var xmlDomEq = obj.activeInXmlDoc().get(0);
                obj.showNodeInfo(xmlDomEq);
                obj.showAttributes(xmlDomEq);
                obj.showTextNode(xmlDomEq);
                obj.showComments(xmlDomEq);
                obj.showCdata(xmlDomEq);
                obj.showPIS(xmlDomEq)

            },
            onAddNode: function (node, documentRef) {
                node.get(0).documentRef = documentRef
            },
            onBeforeExpand: function (node) {
                obj.trigger({
                    type: "populate",
                    which: node
                })
            },
            onAfterExpand: function () {
            },
            onAfterCollapse: function (node) {
                $($("ul", node), obj.nodeList).empty()
            },
            onDrag_: function (e, sourceLi) {
            },
            dropOk_: function (e, targetLi) {
            }
        },
        windowTemplate: '<div id="xmlEditorWindow" style="textSize: 12px;"><div id="leftHandControls" class="ui-widget ui-widget-content" style="width:30%; height: 100%; float: left;"><div id="nodeListDiv" style="border: 0px; width:100%; height: 98%; float: left; overflow:auto;"><div id="nodeList_" style="width:98%; height: 98%; border: 0px;"/></div></div><fieldset id="info_" style="width:65%;  border: 0px; float: right; margin-bottom: 20px; overflow-x: auto;"><legend class="ui-corner-all ui-state-active" style="border: 1px solid;  font-weight: bold;">Element info</legend>None</fieldset><br/><fieldset id="attributes_" style="width:65%;  border: 0px; float: right; margin-bottom: 20px; overflow-x: auto;"><legend class="ui-corner-all ui-state-active" style="border: 1px solid;  font-weight: bold;">Attributes</legend>None</fieldset><br/><fieldset id="cdata_" style="width:65%;  border: 0px; float: right; margin-bottom: 20px; overflow-x: auto;"><legend class="ui-corner-all ui-state-active" style="border: 1px solid;  font-weight: bold;">CData</legend>None</fieldset><br/><fieldset id="comments_" style="width:65%;  border: 0px; float: right; margin-bottom: 20px; overflow-x: auto;"><legend class="ui-corner-all ui-state-active" style="border: 1px solid;  font-weight: bold;">Comments</legend>None</fieldset><br/><fieldset id="content_" style="width:65%;  border: 0px; float: right; margin-bottom: 20px; overflow-x: auto;"><legend class="ui-corner-all ui-state-active" style="border: 1px solid;  font-weight: bold;">Text</legend>None</fieldset><br/><fieldset id="processingInstructions_" style="width:65%;  border: 0px; float: right; margin-bottom: 20px; overflow-x: auto;"><legend class="ui-corner-all ui-state-active" style="border: 1px solid;  font-weight: bold;">ProcessingInstructions</legend>None</fieldset><br/></div>',
        draggable: false,
        customDragHandler: false,
        resizable: false,
        width: "99%",
        header: true,
        showMainWindowCloseThick: true,
        autoClearClipboard: true,
        autoCreateBookmarks: true,
        shortcuts: {
            "help": {
                keys: "f1",
                message: "Help"
            },
            "save": {
                keys: "Ctrl+s",
                message: "Saves the document"
            },
            "open": {
                keys: "Ctrl+o",
                message: "Open a document"
            },
            "new": {
                keys: "Alt+Ctrl+n",
                message: "Create a new document"
            },
            "search": {
                keys: "Ctrl+f",
                message: "Search elements in document"
            },
            "rules": {
                keys: "Ctrl+r",
                message: "Load document rules"
            },
            "bookmarks": {
                keys: "Ctrl+b",
                message: "Open bookmark manager"
            },
            "nodeExtend": {
                keys: "Ctrl+right",
                message: "Extend active node"
            },
            "nodeCollapse": {
                keys: "Ctrl+left",
                message: "Collapse active node"
            },
            "parentToggle": {
                keys: "Ctrl+shift+return",
                message: "Toggle parent node"
            },
            "load": {
                keys: "Ctrl+l",
                message: "Load document source"
            },
            "up": {
                keys: "Ctrl+up",
                message: "Move cursor up"
            },
            "down": {
                keys: "Ctrl+down",
                message: "Move cursor down"
            },
            "toggleNode": {
                keys: "Ctrl+return",
                message: "Toggle active node"
            },
            "toggleSelectionActive": {
                keys: "Ctrl+space",
                message: "Select / Clear selection of active node"
            }
        },
        beforeSave: function () {
            return true
        },
        afterSave: function () {
            return true
        },
        beforeUpdate: function () {
            return true
        },
        afterUpdate: function () {
            return true
        },
        beforeInsert: function () {
            return true
        },
        afterInsert: function () {
            return true
        },
        beforeDelete: function (w) {
            if (confirm("Really delete element '" + this.activeInXmlDoc().get(0).nodeName + "' ?")) {
                return true
            } else {
                return false
            }
        },
        afterDelete: function () {
            return true
        },
        beforeProcessDataSource: function () {
            return true
        },
        afterProcessDataSource: function () {
            return true
        },
        rigths: false,
        map: {
            UPDATE: "SEL",
            INSERT: "INS",
            DELETE: "DEL"
        },
        whereToCheck: {
            UPDATE: $(this).attr("dataSrc"),
            DELETE: $(this).attr("dataSrc"),
            INSERT: $(this).attr("dataSrc")
        },
        check: function (w) {
            return true
        }
    };
    obj.o = $.extend({}, obj.defaults, options);
    var o = obj.o;
    obj.name = obj.o.name;

    if (typeof JSON.parse == "function" && is_html_5_client()) {

        obj.session_storage = new Database({
            driver: new Database.drivers.StorageDriver({
                name: obj.instanceOf,
                storage: window.sessionStorage
            })
        });

        obj.persistent_storage = new Database({
            name: obj.instanceOf
        });

        var databaseRuntimeOptionsRecord = obj.persistent_storage.find({
            "name": "runtimeOptions"
        });
        //daca avem recordset length >0
        if (typeOf(databaseRuntimeOptionsRecord) == "Array" && databaseRuntimeOptionsRecord.length > 0)
            obj.runtimeOptions = databaseRuntimeOptionsRecord[0].content;
        else
            obj.runtimeOptions = o.runtimeOptions;

        obj.runtimeOptionsBackup = JSON.parse(JSON.stringify(o.runtimeOptions));
    } else {
        obj.runtimeOptionsBackup = obj.defaults.runtimeOptions
    }
    o.check("UPDATE");
    if ($("config", obj.rigths).html() != null) {
        var adminSettings = eval("new Object({" + $("config", obj.rigths).html() + "})");
        for (keyVar in adminSettings) {
            o[keyVar] = adminSettings[keyVar]
        }
    }
    if (o.settingsHandlerEnabled) {
        o = $.extend({}, o, eval("new Object({" + $.session.get(obj.name) + "})"))
    }
    obj.beforeSave = o.beforeSave;
    obj.afterSave = o.afterSave;
    obj.beforeUpdate = o.beforeUpdate;
    obj.afterUpdate = o.afterUpdate;
    obj.beforeDelete = o.beforeDelete;
    obj.afterDelete = o.afterDelete;
    obj.beforeInsert = o.beforeInsert;
    obj.afterInsert = o.afterInsert;
    obj.beforeProcessDataSource = o.beforeProcessDataSource;
    obj.afterProcessDataSource = o.afterProcessDataSource;
    obj.displayNodesFilter = {};
    obj.dataSource = {
        from: (o.dataSource ? "initOptions" : ""),
        initOptions: o.dataSource,
        url: false,
        documentSource: false,
        newDocument: false,
        fromEmbedXMLDOC: false
    };
    obj.windowTemplate = o.windowTemplate;
    obj.windowOptions = {
        title: obj.instanceOf + " " + obj.version + "-" + obj.credentials + " / " + obj.releaseDate,
        modal: true,
        height: window.innerHeight - 10,
        width: window.innerWidth - 10,
        draggable: o.draggable,
        closeOnEscape: false,
        open: function () {
            $("#leftHandControls").height(obj.height());
            $("#nodeListDiv").height(obj.height());
            obj.initTools();
            obj.initKeyboardShortcuts();
            obj.setCheckedElementsTools();
            obj.setActiveElementsTools();
        },
        close: function () {
            if (obj.runtimeOptions.clearRecentFilesWhenLogoff.value) {
                var databaserecentlyOpenedRecord = obj.persistent_storage.find({
                    "name": "recentlyOpened"
                });

                databaserecentlyOpenedRecord.forEach(function (record, index, recordset) {
                    obj.persistent_storage.delete(record.id);
                });
            }
            obj.logoff();
        },
        beforeClose: function () {
            return confirm("Logoff?");
        },
        buttons: {
            "New document": function () {
                var rootNodeName = false;
                do {
                    rootNodeName = prompt("Please root node name:", obj.runtimeOptions.newDocDefaultRootNode.value)
                } while (/[^a-zA]/.test(rootNodeName));
                if (rootNodeName) {
                    obj.dataSource.from = "newDocument";
                    obj.dataSource.newDocument = rootNodeName;
                    obj.processDataSource();
                }
            },
            "Open": function () {
                obj.fileOpenDialog.dialog("open");
            },
            "Load Document Source": function () {
                obj.loadDocumentFromSource();
            },
            "View": function () {
                obj.view({
                    toJson: false
                })
            },
            "Save": function () {
                var fileName = prompt("File Name:", (obj.dataSource.from == "url" ? obj.dataSource.url : (obj.dataSource.from == "initOptions" ? obj.dataSource.initOptions : "")));
                if (fileName) {
                    obj.save({
                        fileName: fileName,
                        keepUIDs: false
                    })
                }
            },
            "Search": function () {
                obj.searchDialog.dialog("open");
            },
            "Runtime Options": function () {
                obj.runtimeOptionsDialog.dialog("open");
            }
        }
    };

    var getScrollbarWidth = (function () {
        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar";
        // needed for WinJS apps

        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    })();

    var $splitter = $('#splitter');
    var $right = $('#right');
    var $rightInner = $('#rightInner');

    var splitterWidth = $splitter.width();
    var splitterPosition = null;
    var splitterPositionBackup = null;

    function setSplitterPosition(position) {
        splitterPosition = position;

        $("#leftHandControls").width(position);
        $right.css('margin-left', position + splitterWidth);
        $splitter.css('left', position + getScrollbarWidth + splitterWidth);
    }

    function setContentWidth() {
        var width = $rightInner.outerWidth(true);
    }


    $splitter.mousedown(function () {
        $splitter.addClass('active');

        $(document).mousemove(function (event) {
            if (event.pageX >= $(document).width() / 6 && $(document).width() - event.pageX >= $(document).width() / 2 + splitterWidth) {
                setSplitterPosition(event.pageX);
                setContentWidth();
            }
        });

        $().add($splitter).add($(document)).mouseup(function () {
            $splitter.removeClass('active').unbind('mouseup');
            $(document).unbind('mousemove').unbind('mouseup');

        });

        return false;
    });

    function setInitialDimensions(w) {
        if (w == undefined)
            w = parseInt($(document).width() / 4);

        $("#leftHandControls").width(w);
        $splitter.css("height", obj.outerHeight());
        setSplitterPosition($("#leftHandControls").outerWidth(true));
        setContentWidth();
    }


    obj.init = function () {
        obj.dialog(obj.windowOptions);

        if (!obj.o.showMainWindowCloseThick) {
            $(".ui-dialog-titlebar-close").get(0).style.display = "none";
        }
        obj.nodeInfo = $("#info_", obj);
        obj.nodeList = $("#nodeList_", obj);
        obj.nodeAttributes = $("#attributes_", obj);
        obj.nodeContent = $("#content_", obj);
        obj.nodeComments = $("#comments_", obj);
        obj.nodeCdata = $("#cdata_", obj);
        obj.nodeProcessingInstructions = $("#processingInstructions_", obj);
        obj.dataSourceInitialized = false;
        if (!o.dataSource) {
            obj.dataSource.from = "documentSource"
        }

        window.onresize = function () {
            obj.dialog("option", "width", window.innerWidth - 10).dialog("option", "height", window.innerHeight - 10);
            $("#leftHandControls").height(obj.height());
            $("#nodeListDiv").height(obj.height());
            setInitialDimensions();
        };

        setInitialDimensions();

        obj.dataSource.documentSource = obj.o.defaultRootElemOnInit;
        obj.processDataSource();
        if (obj.o.isMobile()) {
            $("div#nodeListDiv").css("overflow-x", "scroll").css("overflow-y", "scroll");
        }
    };

    if (typeof obj.runtimeOptionsDialog != "object") {
        obj.runtimeOptionsDialog = $('<div><fieldset style="border: 0px;"><legend></legend><table id="runtimeOptionsDialogTable" style="width:100%;"></table></fieldset></div>').dialog({
            title: "Runtime options",
            width: 600,
            height: 400,
            modal: true,
            autoOpen: false,
            open: function () {
                var optTemplate = "";
                var hroojb = 0;
                for (which in obj.runtimeOptions) {
                    console.log("Runtime options init " + which + ": " + obj.runtimeOptions[which].value);
                    switch (obj.runtimeOptions[which].type) {
                        case "checkbox":
                            optTemplate = '<input type="checkbox" title="' + (new String(obj.runtimeOptions[which].alt)) + '" name="' + which + '" ' + (obj.runtimeOptions[which].value == true ? 'checked="checked"' : '') + '>';
                            break;
                        default:
                            optTemplate = '<input type="text" title="' + (new String(obj.runtimeOptions[which].alt)) + '" style="width:90%;" name="' + which + '" value="' + obj.runtimeOptions[which].value + '">';
                            break
                    }
                    $("table#runtimeOptionsDialogTable", this).append("<tr " + (hroojb % 2 ? 'class="ui-state-active"' : "") + '><td width="50%"><b>' + obj.runtimeOptions[which].message + "<b/></td><td>" + optTemplate + "</td></tr>");
                    hroojb++;
                }

            },
            close: function () {
                $("table#runtimeOptionsDialogTable", this).empty();
            },
            buttons: {
                Ok: function () {
                    $("input", this).each(function () {
                        switch (this.getAttribute("type")) {
                            case "checkbox":
                                obj.runtimeOptions[this.getAttribute("name")].value = ($(this).is(':checked') ? true : false);
                                console.log(this.getAttribute("name") + " bool: " + ($(this).is(':checked') ? "checked" : "off"));
                                break;
                            default:
                                obj.runtimeOptions[this.getAttribute("name")].value = $(this).val();
                                console.log(this.getAttribute("name") + ": " + $(this).val());
                                break
                        }
                    });

                    if (is_html_5_client()) {
                        //window.localStorage.setItem("XMS_DESIGNER_RUNTIME_OPTIONS", JSON.stringify(obj.runtimeOptions));
                        console.log("Saving options on local storage");
                        var databaseRuntimeOptionsRecord = obj.persistent_storage.find({
                            "name": "runtimeOptions"
                        });
                        //daca avem recordset length >0
                        if (databaseRuntimeOptionsRecord.length > 0)
                            //facem update
                            obj.persistent_storage.update(databaseRuntimeOptionsRecord[0].id, {
                                "name": "runtimeOptions",
                                "content": obj.runtimeOptions
                            });
                        else
                            //daca nu avem inregistrari -> insert
                            obj.persistent_storage.insert({
                                "name": "runtimeOptions",
                                "content": obj.runtimeOptions
                            });
                    } else
                        alert("storage not available");

                    if (obj.runtimeOptions.applyDisplayFilters.value) {
                        obj.displayNodesFilter = eval("new Object(" + obj.runtimeOptions.displayNodesFilter.value + ")");

                    } else {
                        obj.displayNodesFilter = {}
                    }
                    $(this).dialog("close")
                },
                Cancel: function () {
                    $(this).dialog("close")
                },
                Defaults: function () {
                    $("input", this).each(function () {
                        switch (this.getAttribute("type")) {
                            case "checkbox":
                                obj.runtimeOptionsBackup[this.getAttribute("name")]["value"] == "checked" ? $(this).prop("checked", "checked") : $(this).prop("checked", false);
                                break;
                            default:
                                $(this).val(obj.runtimeOptionsBackup[this.getAttribute("name")]["value"]);
                                break
                        }
                    })
                },
                "Undo changes": function () {
                    $("input", this).each(function () {
                        switch (this.getAttribute("type")) {
                            case "checkbox":
                                obj.runtimeOptions[this.getAttribute("name")]["value"] == "checked" ? $(this).prop("checked", "checked") : $(this).prop("checked", false);
                                break;
                            default:
                                $(this).val(obj.runtimeOptions[this.getAttribute("name")].value);
                                break
                        }
                    })
                },
                "Clear": function () {
                    var databaserecentlyOpenedRecord = obj.persistent_storage.find({
                        "name": "runtimeOptions"
                    });

                    databaserecentlyOpenedRecord.forEach(function (record, index, recordset) {
                        obj.persistent_storage.delete(record.id);
                    });
                    console.log("Designer's runtime options in persistent storage deleted");
                    $(this).dialog("close");
                },
                "Load rules": function () {
                    obj.templateRulesSelectDialog.dialog("open");
                }
            }
        })
    }
    ;

    if (typeof obj.searchDialog != "object") {
        obj.searchDialog = $('<div id="__search__" style="font-size: 12px;"><center><fieldset style="border: 0px none ;"><table style="width: 95%; font-size: 12px;" class="ui-widget-content"><tbody><tr align="absmiddle"><td><input placeholder="CSS Query" title="CSS Query" style="width: 90%; text-align: center;" id="cssstring"/></td></tr><tr align="absmiddle"><td><input placeholder="XPath Query" title="XPath Query" style="width: 90%; text-align: center;" id="xpathstring"/></td></tr></tbody></table><br/><table style="width: 95%; font-size: 12px;" class="ui-widget-content"><tbody><tr align="left"><td><span>Code to run (function will be called by JQuery.each)</span></td></tr><tr align="absmiddle"><td><textarea style="width: 90%;" rows="5" id="runCodeSource"></textarea></td></tr></tbody></table><br/><table style="width: 95%;font-size: 12px;" class="ui-widget-content" id="results"><tbody><tr><td>None yet</td></tr></tbody></table></fieldset></center></div>').dialog({
            title: "Node search",
            height: 400,
            width: 600,
            autoOpen: false,
            open: function () {
                $("#cssstring", this).focus();
            },
            create: function () {
                var dialog = this;

                var buttons = $(dialog).dialog("option", "buttons");

                var inputcss = $("#cssstring", dialog);

                var inputxpath = $("#xpathstring", dialog);

                var inputRunCode = $("#runCodeSource", dialog);

                inputcss.on("focus", function () {
                    obj.searchDialog.lastFocused = this;
                });

                inputxpath.on("focus", function () {
                    obj.searchDialog.lastFocused = this;
                });

                inputcss.bind("keyup", "return", function () {
                    buttons.Search.apply(dialog);
                });

                inputxpath.bind("keyup", "return", function () {
                    buttons.Search.apply(dialog);
                });

                inputRunCode.bind("keyup", "Ctrl+return", function () {
                    buttons.Run.apply(dialog);
                });
            },
            buttons: {
                Search: function () {
                    var lastFocusedID = obj.searchDialog.lastFocused.getAttribute("id");
                    var cssstring = $("input#" + lastFocusedID, this).val();
                    console.log("Searching for " + cssstring);
                    var dumpPathTo = $("table#results", obj.searchDialog);
                    dumpPathTo.html('<th><td colspan="2">Path Found for ' + cssstring + "</td></th>");
                    if (lastFocusedID == "cssstring")
                        var found = $(cssstring, obj.xmlDoc);
                    else
                        var found = $(obj.xmlDoc).xpe(cssstring);

                    found.each(function (i, e) {
                        if (lastFocusedID == "cssstring")
                            var csspath = obj.elementCSSPath({
                                elem: $(this),
                                useIndexes: true
                            });
                        else {
                            var csspath = obj.elementCSSPath({
                                elem: $(this),
                                useIndexes: true
                            });
                            var xpath = obj.elementXpath({
                                elem: $(this),
                                useIndexes: true
                            });
                        }

                        dumpPathTo.append('<tr ecsspath="' + csspath + '"><td>#' + (i + 1) + "</td><td>" + (lastFocusedID == "cssstring" ? csspath : xpath) + "</td></tr>");
                        $("tr[ecsspath='" + csspath + "']", obj.searchDialog).dblclick(function () {
                            obj.extendCssPath(csspath);
                        });
                        $("tr:odd", obj.searchDialog).addClass("ui-state-active")
                    }).length

                    console.log("Found: " + found);
                },
                Run: function () {
                    var lastFocusedID = obj.searchDialog.lastFocused.getAttribute("id");
                    var cssstring = $("input#" + lastFocusedID, this).val();

                    if (lastFocusedID == "cssstring")
                        var found = $(cssstring, obj.xmlDoc);
                    else
                        var found = $(obj.xmlDoc).xpe(cssstring);

                    var codetorun = $("textarea#runCodeSource", this).val();
                    console.log("On: '" + cssstring + "' running: '" + codetorun + "'");
                    eval("var funcToRun = function(i,e){" + unescape(codetorun) + "};");

                    found.each(funcToRun);
                },
                Close: function () {
                    $(this).dialog("close")
                }
            }
        })
    }
    ;

    if (typeof obj.fileOpenDialog != "object") {
        obj.fileOpenDialog = $('<div id="fileOpenDialogWindow" align="center" style=""><input placeholder="New File" type="text" style="width:90%;;text-align: center;" id="newFile"/><select id="recentFileList" size="10" style="width:90%;text-align: center;"></select></div>').dialog({
            "title": "Open file",
            modal: true,
            autoOpen: false,
            create: function () {
                var dialog = this;

                var buttons = $(dialog).dialog("option", "buttons");

                //TODO: focus pe buton Open cand ies din newFile sau fileListSelect
                //$("button:contains('Open')", dialog).get(0).tabIndex = 1;

                var newFile = $("#newFile", dialog);
                //input pt fisier nou
                var fileListSelect = $("#recentFileList", dialog);

                fileListSelect.on("change", function () {
                    //cand se shimba optiune copii in input valoarea
                    newFile.get(0).value = $(":selected", this).get(0).textContent;
                });

                newFile.on("focus", function () {
                    dialog.lastSelected = this;
                });

                fileListSelect.on("focus", function () {
                    dialog.lastSelected = this;
                });

                newFile.bind("keyup", "return", function () {
                    buttons.Open.apply(dialog);
                });

                fileListSelect.bind("keyup", "return", function () {
                    buttons.Open.apply(dialog);
                });

                newFile.bind("keyup", "Ctrl+return", function () {
                    buttons["New window"].apply(dialog);
                });

                fileListSelect.bind("keyup", "Ctrl+return", function () {
                    buttons["New window"].apply(dialog);
                });
            },
            open: function () {

                var dialog = this;
                obj.fileOpenDialog.showFiles.apply(dialog);

                var fileListSelect = $("#recentFileList", dialog);
                var fileListSelect_options = $("option", fileListSelect);

                //afizes toate fisierele din db
                if (fileListSelect_options.length > 0) {
                    //daca sunt fisiere
                    fileListSelect_options.get(0).selected = true;
                    //focus pe primul in select
                    dialog.lastSelected = fileListSelect.get(0);
                    //atribui lastSelected pt a trece mai departe la apasare enter
                }
            },
            buttons: {
                "Open": function () {
                    var dialog = this;

                    var newFile = $("#newFile", dialog);
                    //input pt fisier nou
                    var fileListSelect = $("#recentFileList", dialog);
                    //lista fisiere in db

                    var fileListSelect_selected = $(":selected", fileListSelect);
                    //cauta optiunile selected in select
                    if (fileListSelect_selected.length > 0 && dialog.lastSelected == fileListSelect.get(0)) {
                        //daca avem optiune/fisier selectat si ultimul input focus a fost select
                        var url = fileListSelect_selected.get(0).textContent;

                    } else if (newFile.get(0).value && dialog.lastSelected == newFile.get(0)) {
                        //daca nu avem optiune selectata testam daca avem ceva intridus in input fiser nou
                        //si ultimul input co focus este input#newFile
                        var url = newFile.get(0).value;
                    } else
                        alert("No file selected");

                    if (!url || 0 === url.length || /^\s*$/.test(url) || !url.trim())
                        //daca nu avem url sau este empty
                        alert("Seems it is a blank record");
                    else {
                        //daca avem url
                        obj.dataSource.from = "url";
                        obj.dataSource.url = url;
                        obj.processDataSource();
                        //deschidem
                    }

                    $(dialog).dialog("close");
                },
                "New window": function () {
                    var dialog = this;

                    var newFile = $("#newFile", dialog);
                    //input pt fisier nou
                    var fileListSelect = $("#recentFileList", dialog);
                    //lista fisiere in db

                    var fileListSelect_selected = $(":selected", fileListSelect);
                    //cauta optiunile selected in select
                    if (fileListSelect_selected.length > 0 && dialog.lastSelected == fileListSelect.get(0)) {
                        //daca avem optiune/fisier selectat si ultimul input focus a fost select
                        var url = fileListSelect_selected.get(0).textContent;

                    } else if (newFile.get(0).value && dialog.lastSelected == newFile.get(0)) {
                        //daca nu avem optiune selectata testam daca avem ceva intridus in input fiser nou
                        //si ultimul input co focus este input#newFile
                        var url = newFile.get(0).value;
                    } else
                        alert("No file selected");

                    if (!url || 0 === url.length || /^\s*$/.test(url) || !url.trim())
                        //daca nu avem url sau este empty
                        alert("Seems it is a blank record");
                    else {
                        window.open("index.php?use=templates/designer.xml&datasrc=" + url, "_blank", "fullscreen: 1; resizable: 1; status: 0; location: 0;", false);
                    }

                    $(dialog).dialog("close");
                },
                "Clear": function () {
                    var dialog = this;
                    var fileListSelect = $("#recentFileList", dialog);
                    var fileListSelect_selected = $(":selected", fileListSelect);

                    if (fileListSelect_selected.length > 0) {
                        //daca este optiune selectata
                        var id = fileListSelect_selected.get(0).value;
                        //iau id elem selectat din option.value
                        var siblingText = (fileListSelect_selected.get(0).nextSibling ? fileListSelect_selected.get(0).nextSibling.textContent : (fileListSelect_selected.get(0).previousSibling ? fileListSelect_selected.get(0).previousSibling.textContent : ""));

                        obj.persistent_storage.delete(parseInt(id));
                        //sterg
                        obj.fileOpenDialog.showFiles.apply(this, [siblingText]);
                        //refresh optiuni
                    } else {
                        //daca nu avem optiune selectata stergem toate inregistrarile recentlyOpened
                        var databaserecentlyOpenedRecord = obj.persistent_storage.find({
                            "name": "recentlyOpened"
                        });

                        databaserecentlyOpenedRecord.forEach(function (record, index, recordset) {
                            obj.persistent_storage.delete(record.id);
                        });

                        var dialog = this;
                        var fileListSelect = $("#recentFileList", dialog);

                        obj.fileOpenDialog.showFiles.apply(this);
                    }
                },
                "Close": function () {
                    $(this).dialog("close");
                }
            }
        });

        obj.fileOpenDialog.showFiles = function (focusOptionWithText) {
            var dialog = this;
            var fileListSelect = $("#recentFileList", dialog);

            while (fileListSelect.get(0).options.length > 0)
                fileListSelect.get(0).options.remove(0);

            fileListSelect.get(0).focus();

            var databaserecentlyOpenedRecord = obj.persistent_storage.find({
                "name": "recentlyOpened"
            }).reverse();

            databaserecentlyOpenedRecord.forEach(function (record, index, recordset) {
                var option = dialog.ownerDocument.createElement("option");
                option.textContent = record.fileName;
                option.value = record.id;
                fileListSelect.get(0).options.add(option, index);

                if (focusOptionWithText != undefined)
                    //daca este dat parametrul focusOptionWithText
                    if (record.fileName == focusOptionWithText)
                        option.selected = true;
                //selectex optiunea cu acest text
            });
        }
    }

    if (typeof obj.templateRulesSelectDialog != "object") {
        obj.templateRulesSelectDialog = $('<div><fieldset style="border: 0px;"><legend>Select Document Rules</legend><select id="templateSelect" size="10" style="width: 100%;"></select></fieldset></div>').dialog({
            title: "Available templates",
            modal: true,
            open: function () {
                var sel = $("#templateSelect", this);
                var selElem = sel.get(0);

                sel.empty();

                for (which in o.documentRules) {
                    var opt = document.createElement("option");
                    opt.text = opt.value = which;
                    selElem.add(opt, null)
                }
            },
            buttons: {
                Ok: function () {
                    var selElem = $("#templateSelect", this).get(0);
                    o.documentMap = o.documentRules[selElem.options[selElem.selectedIndex].value];
                    console.log("Loading " + selElem.options[selElem.selectedIndex].value + " document rules");
                    $(this).dialog("close");
                },
                Cancel: function () {
                    $(this).dialog("close")
                }
            }
        })
    }
    ;

    if (typeof obj.helpDialog != "object") {
        obj.helpDialog = $('<div><fieldset style="border: 0px;"><legend>Keyboard shortcuts</legend><table id="shortcutsDisplay" style="width: 100%;"></table></fieldset><br/><center><a href="http://aws-dms.com/temp.php?use=templates/docs.designer.xml" target="_blank">More info about Designer</a></center></div>').dialog({
            title: "Help",
            open: function () {
                var selElem = $("#shortcutsDisplay", this).get(0);
                var click = true;
                for (which in obj.o.shortcuts) {
                    var row = document.createElement("tr");
                    var d1 = document.createElement("td");
                    d1.appendChild(document.createTextNode(obj.o.shortcuts[which].keys));
                    var d2 = document.createElement("td");
                    d2.appendChild(document.createTextNode(obj.o.shortcuts[which].message));
                    row.appendChild(d1);
                    row.appendChild(d2);
                    selElem.appendChild(row);
                    if (click)
                        $(row).css("background-color", "#cccccc");
                    click = !click;
                }
                ;
            },
            buttons: {
                Ok: function () {
                    $(this).dialog("close")
                }
            }
        })
    }

    if (typeof obj.insertNodeDialog != "object") {
        obj.insertNodeDialog = $('<div><center><fieldset style="border: 0px;"><table class="ui-widget-content" style="width:95%;"><tbody><tr align="absmiddle"><td><input id="tagName" style="width: 90%;text-align:center;" placeholder="Element name"></td></tr></tbody></table></fieldset><fieldset style="border: 0px;"><legend>Where</legend><table class="ui-widget-content" style="width:95%;"><tbody><tr align="absmiddle"><td style="width:30%;">Selected</td><td>Before</td><td>After</td></tr><tr align="absmiddle"><td><input type="radio" name="where" value="self" checked /></td><td style="width:30%;"><input type="radio" name="where" value="before" /></td><td><input type="radio" name="where" value="after" /></td></tr></tbody></table></fieldset><fieldset style="border: 0px;"><legend>How</legend><table class="ui-widget-content" style="width:95%;"><tbody><tr align="absmiddle"><td style="width: 30%;">Append</td><td>Prepend</td><td style="width: 50%">Replace content</td></tr><tr align="absmiddle"><td style="width: 30%"><input type="radio" name="how" value="append" checked /></td><td><input type="radio" name="how" value="prepend" /></td><td style="width: 50%"><input type="radio" name="how" value="html" /></td></tr></tbody></table></fieldset></center></div>').dialog({
            modal: true,
            create: function () {
                var dialog = this;
                var buttons = $(dialog).dialog("option", "buttons");
                var tagName = $("#tagName", dialog);

                tagName.on("focus", function () {
                    dialog.lastSelected = this;
                });

                tagName.bind("keyup", "return", function () {
                    buttons.Ok.apply(dialog);
                });
            },
            open: function () {
                var dialog = this;
                $(":radio[name=where][value=self]", dialog).get(0).checked = true;
                $(":radio[name=how][value=append]", dialog).get(0).checked = true;
                //$("input[name='where'][value='self']", dialog).prop("checked", true);
                //$("input[name='how'][value='append']", dialog).prop("checked", true);
            },
            buttons: {
                Ok: function () {
                    var check = true;
                    var dialog = this;
                    var insertDialog = $(dialog);
                    var path = $("#tagName", dialog).val();
                    var where = $("[name=where]:checked", dialog).val();
                    var how = $("[name=how]:checked", dialog).val();

                    if (where && how) {
                        obj.checked().each(function () {
                            var targetNode = obj.checkedInXmlDoc(this).get(0);
                            console.log("Inserting " + path + " " + where + " " + targetNode.nodeName);
                            var splitObjects = path.split("|");
                            for (xx = 0; xx < splitObjects.length; xx++) {
                                var last = false;
                                var elements = new Array;
                                var splitObjects = path.split("|");
                                var newElement = false;
                                var splitPath = splitObjects[xx].split("/");
                                for (dd = 0; dd < splitPath.length; dd++) {
                                    var individualObjectNamesArray = splitPath[dd].split("*");
                                    if (individualObjectNamesArray.length == 1) {
                                        individualObjectNamesArray.push(1)
                                    }
                                    for (ioai = 0; ioai < individualObjectNamesArray[1]; ioai++) {
                                        if (individualObjectNamesArray[0]) {
                                            if (newElement) {
                                                targetNode = newElement
                                            }
                                            if (!o.acceptNodes(individualObjectNamesArray[0], targetNode)) {
                                                var allowed = o.documentMap.nodes[targetNode.nodeName];
                                                var allowedText = "";
                                                for (i in allowed) {
                                                    allowedText = allowedText + " '" + i + "'"
                                                }
                                                if (o.insertNode_allowWhenForbiden) {
                                                    if (!confirm("Creating node '" + individualObjectNamesArray[0] + "' has been DENIED by the acceptNodes Filter; \n Allowed only: " + allowedText + "\n Do you still want to create it?")) {
                                                        check = false
                                                    } else {
                                                        check = true
                                                    }
                                                } else {
                                                    alert("Creating node '" + individualObjectNamesArray[0] + "' has been DENIED by the acceptNodes Filter; \n Allowed only: " + allowedText);
                                                    check = false
                                                }
                                            }
                                            if (o.denyNodes(individualObjectNamesArray[0], targetNode)) {
                                                if (o.insertNode_allowWhenForbiden) {
                                                    if (!confirm("Creating node '" + individualObjectNamesArray[0] + "' has been DENIED by the denyNodes Filter\n Do you still want to create it?")) {
                                                        check = false
                                                    } else {
                                                        check = true
                                                    }
                                                } else {
                                                    check = false;
                                                    alert("Creating node '" + individualObjectNamesArray[0] + "' has been DENIED by the denyNodes Filter")
                                                }
                                            }
                                            if (check) {
                                                newElement = obj.xmlDoc.createElement(individualObjectNamesArray[0]);
                                                elements.push(newElement)
                                            }
                                        }
                                    }
                                }
                                for (de = elements.length - 1; de > 0; de--) {
                                    elements[de - 1].appendChild(elements[de])
                                }
                                if (elements.length > 0) {
                                    switch (where) {
                                        case "before":
                                        case "after":
                                            var active = obj.checkedInXmlDoc(this).parents("*:first").get(0);
                                            var before = obj.checkedInXmlDoc(this).get(0);
                                            obj.insert({
                                                where: where,
                                                active: active,
                                                before: before,
                                                thisOne: elements[0]
                                            });
                                            break;
                                        default:
                                            var active = obj.checkedInXmlDoc(this);
                                            obj.insert({
                                                how: how,
                                                active: active,
                                                thisOne: elements[0]
                                            });
                                            break
                                    }
                                }
                            }
                            if (where == "self") {
                                obj.reloadTreeBranch(this, "self")
                            } else {
                                obj.reloadTreeBranch(this)
                            }
                        });
                        obj.tree.kvaTree.InitKvaTree();
                        obj.uncheckAll();
                        $(this).dialog("close");
                    } else
                        alert("Select Where and How options");
                },
                Close: function () {
                    $(this).dialog("close")
                }
            },
            title: "Insert new elements to selected ones"
        })
    }

    if (typeof obj.wrapAroundNodeDialog != "object") {
        obj.wrapAroundNodeDialog = $('<div><center><fieldset style="border: 0px;"><table class="ui-widget-content" style="width:95%;"><tbody><tr align="absmiddle"><td><input id="tagName" style="width: 90%;text-align:center;" placeholder="Elements separated by /"></td></tr></tbody></table></fieldset></center></div>').dialog({
            modal: true,
            create: function () {
                var dialog = this;

                var buttons = $(dialog).dialog("option", "buttons");

                var inputtagName = $("#tagName", dialog);

                inputtagName.on("focus", function () {
                    dialog.lastFocused = this;
                });

                inputtagName.bind("keyup", "return", function () {
                    buttons.Ok.apply(dialog);
                });
            },
            buttons: {
                Ok: function () {
                    var check = true;
                    var dialog = this;
                    var insertDialog = $(dialog);
                    var path = $("#tagName", dialog).val();
                    obj.checked().each(function () {
                        var targetNode = obj.checkedInXmlDoc(this).get(0);
                        var last = false;
                        var elements = new Array;
                        var splitPath = path.split("/");
                        var newElement = false;
                        for (dd = 0; dd < splitPath.length; dd++) {
                            if (splitPath[dd]) {
                                if (newElement) {
                                    targetNode = newElement
                                }
                                if (!o.acceptNodes(splitPath[dd], targetNode)) {
                                    var allowed = o.documentMap.nodes[targetNode.nodeName];
                                    var allowedText = "";
                                    for (i in allowed) {
                                        allowedText = allowedText + " '" + i + "'"
                                    }
                                    if (o.insertNode_allowWhenForbiden) {
                                        if (!confirm("Creating node '" + splitPath[dd] + "' has been DENIED by the acceptNodes Filter; \n Allowed only: " + allowedText + "\n Do you still want to create it?")) {
                                            check = false
                                        } else {
                                            check = true
                                        }
                                    } else {
                                        alert("Creating node '" + splitPath[dd] + "' has been DENIED by the acceptNodes Filter; \n Allowed only: " + allowedText);
                                        check = false
                                    }
                                }
                                if (o.denyNodes(splitPath[dd], targetNode)) {
                                    if (o.insertNode_allowWhenForbiden) {
                                        if (!confirm("Creating node '" + splitPath[dd] + "' has been DENIED by the denyNodes Filter\n Do you still want to create it?")) {
                                            check = false
                                        } else {
                                            check = true
                                        }
                                    } else {
                                        check = false;
                                        alert("Creating node '" + splitPath[dd] + "' has been DENIED by the denyNodes Filter")
                                    }
                                }
                                if (check) {
                                    newElement = obj.xmlDoc.createElement(splitPath[dd]);
                                    elements.push(newElement)
                                }
                            }
                        }
                        var active = obj.checkedInXmlDoc(this).get(0);
                        var clone = active.cloneNode(true);
                        elements[elements.length - 1].appendChild(clone);
                        for (de = elements.length - 1; de > 0; de--) {
                            elements[de - 1].appendChild(elements[de])
                        }
                        active.parentNode.replaceChild(elements[0], active);
                        obj.reloadTreeBranch(this)
                    });
                    obj.tree.kvaTree.InitKvaTree();
                    obj.uncheckAll();
                    $(this).dialog("close")
                },
                Close: function () {
                    $(this).dialog("close")
                }
            },
            title: "Wrap around checked ones"
        })
    }

    obj.populateAdvancedClipboardTable = function (table) {
        $("tr:gt(0)", table).replaceWith("");
        for (i = 0; i < obj.clipboard.length; i++) {
            table.append('<tr><td id="nodeType" align="center">' + obj.clipboard[i].nodeType + '</td><td align="center">' + obj.clipboard[i].nodeName + '</td><td align="center">' + obj.clipboard[i].textContent + '</td><td style="width:20px;"><span id="delClipboardItems" class="node-tool ui-icon ui-icon-trash" title="Delete this element from clipboard" which="' + i + '"></span></td><td  style="width:20px;"><span id="pasteAdvancedClipboardItem" class="node-tool ui-icon ui-icon-clipboard" title="Paste this one to active node" which="' + i + '" ></span></td><td  style="width:20px;"><span id="pasteAdvancedClipboardItemBeforeOrAfter" class="node-tool ui-icon ui-icon-newwin" which="' + i + '" title="Paste this one before/after active node"></span></td></tr>');

            $("tr", table).filter(":last").data("linkToClip", obj.clipboard[i])
        }
        $("td#nodeType", table).each(function () {
            switch ($(this).html()) {
                case "1":
                    $(this).html("<strong>ELEMENT</strong>");
                    break;
                case "2":
                    $(this).html("<strong>ATTR</strong>");
                    break;
                case "3":
                    $(this).html("<strong>TEXT</strong>");
                    break;
                case "4":
                    $(this).html("<strong>CDATA</strong>");
                    break;
                case "7":
                    $(this).html("<strong>COMMENT</strong>");
                    break;
                case "8":
                    $(this).html("<strong>COMMENT</strong>");
                    break
            }
        });
        $("span#delClipboardItems.ui-icon-trash", table).click(function () {
            for (j = 0; j < obj.clipboard.length; j++) {
                if ($(this).parents("tr:first").data("linkToClip") === obj.clipboard[j]) {
                    var pos = j
                }
            }
            obj.clipboard.splice(pos, 1);
            $(this).parents("tr").replaceWith("")
        });
        $("span#pasteAdvancedClipboardItem.ui-icon-clipboard", table).click(function () {
            for (j = 0; j < obj.clipboard.length; j++) {
                if ($(this).parents("tr:first").data("linkToClip") === obj.clipboard[j]) {
                    var pos = j
                }
            }
            if (confirm("Paste the node itself (Ok) or a duplicate (Cancel)?")) {
                obj.pasteThisToActiveNode(obj.clipboard[pos])
            } else {
                obj.pasteThisToActiveNode(obj.clipboard[pos].cloneNode(true))
            }
            obj.reloadTreeBranch(obj.active().get(0), "self")
        });
        $("span#pasteAdvancedClipboardItemBeforeOrAfter.ui-icon-newwin", table).click(function () {
            for (j = 0; j < obj.clipboard.length; j++) {
                if ($(this).parents("tr:first").data("linkToClip") === obj.clipboard[j]) {
                    var pos = j
                }
            }
            if (confirm("Paste the node itself (Ok) or a duplicate (Cancel)?")) {
                obj.pasteSpecialThisToActiveNode(obj.clipboard[pos])
            } else {
                obj.pasteSpecialThisToActiveNode(obj.clipboard[pos].cloneNode(true))
            }
            obj.reloadTreeBranch(obj.active().get(0))
        })
    };

    if (typeof obj.advancedClipboardDialog != "object") {
        obj.advancedClipboardDialog = $('<div><center><fieldset style="border: 0px;"><table class="ui-widget-content" style="width:95%;" id="advcliptbl"><tbody><tr><th>Type</th><th>Name</th><th>Details</th><th></th></tr></tbody></table></fieldset></center></div>').dialog({
            height: $(document).height() / 2,
            width: $(document).width() / 2,
            closeOnEscape: true,
            buttons: {
                "Paste all": function () {
                    obj.pasteNode();
                    if (obj.runtimeOptions.autoClearClipboard.value)
                        obj.clipboard.empty(false);

                    obj.reloadTreeBranch(obj.active().get(0), "self");
                },
                "Paste all before / after": function () {
                    obj.pasteSpecialNode();
                    if (obj.runtimeOptions.autoClearClipboard.value)
                        obj.clipboard.empty(false);

                    obj.reloadTreeBranch(obj.active().get(0));
                },
                "Clear clipboard": function () {
                    obj.clipboard.empty(false);
                },
                Close: function () {
                    $(this).dialog("close")
                }
            },
            title: "Advanced Clipboard",
            open: function () {
                obj.populateAdvancedClipboardTable($("#advcliptbl", this))
            }
        })
    }

    if (typeof obj.insertDocumentFragmentDialog != "object") {
        obj.insertDocumentFragmentDialog = $('<div><center><textarea type="text"  style="width:98%;"/></center><br/><fieldset style="border: 0px;"><legend>Where</legend><center><table class="ui-widget-content" style="width:95%;"><tbody><tr align="absmiddle"><td style="width:30%;">Selected</td><td>Before</td><td>After</td></tr><tr align="absmiddle"><td><input type="radio" checked="checked"  name="where" value="self"></td><td style="width:30%;"><input type="radio" name="where" value="before"></td><td><input type="radio" name="where" value="after"></td></tr></tbody></table></center></fieldset><fieldset style="border: 0px;"><legend>How</legend><center><table class="ui-widget-content" style="width:95%;"><tbody><tr align="absmiddle"><td style="width:30%;">Append</td><td>Prepend</td><td>Replace content</td></tr><tr align="absmiddle"><td><input type="radio" checked="checked"  name="how" value="append"></td><td style="width:30%;"><input type="radio" name="how" value="prepend"></td><td><input type="radio" name="how" value="html"></td></tr></tbody></table></center></fieldset></div>').dialog({
            height: $(document).height() / 2,
            width: $(document).width() / 2,
            modal: false,
            title: "Please enter document fragment source",
            open: function () {
                var dialog = this;
                $(":radio[name=where][value=self]", dialog).get(0).checked = true;
                $(":radio[name=how][value=append]", dialog).get(0).checked = true;
                $("textarea:first", dialog).focus();
            },
            create: function () {
                var dialog = this;

                var buttons = $(dialog).dialog("option", "buttons");

                var inputtagName = $("textarea:first", dialog);

                inputtagName.on("focus", function () {
                    dialog.lastFocused = this;
                });

                inputtagName.bind("keyup", "Ctrl+return", function () {
                    buttons.Ok.apply(dialog);
                });
            },
            buttons: {
                Ok: function () {
                    var dialog = this;
                    if ($("textarea:first", dialog).val()) {
                        var where = $("[name=where]:checked", dialog).val();
                        var how = $("[name=how]:checked", dialog).val();
                        var DSRC_STRING = $("textarea:first", dialog).val();
                        var parser = $.parseXML("<dfRootElem>" + DSRC_STRING + "</dfRootElem>");
                        var docRoot = parser.documentElement;
                        obj.checked().each(function () {
                            var activeElem = obj.checkedInXmlDoc(this).get(0);
                            console.log("Inserting document fragment " + where + " " + activeElem.nodeName);
                            for (i = 0; i < docRoot.childNodes.length; i++) {
                                var newElem = obj.xmlDoc.importNode(docRoot.childNodes[i], true);
                                switch (where) {
                                    case "before":
                                        var nodeToInsertBefore = activeElem;
                                        obj.checkedInXmlDoc(this).parents("*:first").get(0).insertBefore(newElem, nodeToInsertBefore);
                                        break;
                                    case "after":
                                        var nodeToInsertBefore = activeElem.nextSibling;
                                        obj.checkedInXmlDoc(this).parents("*:first").get(0).insertBefore(newElem, nodeToInsertBefore);
                                        break;
                                    case "self":
                                        if (how == "append") {
                                            activeElem.appendChild(newElem)
                                        }
                                        if (how == "prepend") {
                                            var nodeToInsertBefore = activeElem.firstChild;
                                            activeElem.insertBefore(newElem, nodeToInsertBefore)
                                        }
                                        if (how == "html") {
                                            var nodeToInsertIn = activeElem;
                                            while (nodeToInsertIn.hasChildNodes()) {
                                                nodeToInsertIn.removeChild(nodeToInsertIn.firstChild)
                                            }
                                            nodeToInsertIn.appendChild(newElem)
                                        }
                                        break
                                }
                            }
                            obj.reloadTreeBranch(this, "self")
                        })
                    }
                    obj.uncheckAll();
                    $(this).dialog("close")
                },
                Cancel: function () {
                    $(this).dialog("close")
                }
            }
        })
    }

    if (typeof obj.loadDocumentFromSourceDialog != "object") {
        obj.loadDocumentFromSourceDialog = $('<center><textarea type="text"  style="width:95%;"/></center>').dialog({
            height: $(document).height() / 2,
            width: $(document).width() / 2,
            modal: true,
            title: "Please enter document source",
            open: function () {
                $("textarea:first", this).focus()
            },
            buttons: {
                Ok: function () {
                    if ($("textarea:first", this).val()) {
                        obj.dataSource.from = "documentSource";
                        obj.dataSource.documentSource = $("textarea:first", this).val();
                        obj.processDataSource();
                    }
                    $(this).dialog("close")
                },
                Cancel: function () {
                    $(this).dialog("close")
                }
            }
        })
    }

    if (typeof obj.bookmarksDialog != "object") {
        obj.bookmarksDialog = $('<div id="____bookmarks___" style="font-size: 12px;"><center><table style="width: 95%;font-size: 12px;" class="ui-widget-content" id="results"></table></center></div>').dialog({
            title: "Bookmarks",
            height: 400,
            width: 600,
            open: function () {
                var dumpPathTo = $("table#results", this);
                dumpPathTo.html('<th><td colspan="3">Bookmars found:</td></th>');
                if (typeof obj.root == "object") {
                    for (i = 0; i < obj.root.childNodes.length; i++) {
                        if (obj.root.childNodes[i].nodeType == 1 && obj.root.childNodes[i].nodeName == "bookmarks") {
                            obj.bookmarks = obj.root.childNodes[i]
                        }
                    }
                    if (typeof obj.bookmarks == "object") {
                        for (j = 0; j < obj.bookmarks.childNodes.length; j++) {
                            if (obj.bookmarks.childNodes[j].nodeType == 1) {
                                dumpPathTo.append('<tr><td width="5%">#' + (j + 1) + "</td><td>" + obj.bookmarks.childNodes[j].getAttribute("name") + '</td><td width="5%" class="showElement" csspath="' + obj.bookmarks.childNodes[j].textContent + '" title="Double click to jump here">Show</td></tr>')
                            }
                        }
                    }
                    $("td.showElement", obj.bookmarksDialog).dblclick(function () {
                        obj.extendCssPath(this.getAttribute("csspath"));
                        this.innerHTML = "Done!!"
                    });
                    $("tr:odd", this).addClass("ui-state-active")
                }
            },
            buttons: {
                Close: function () {
                    $(this).dialog("close")
                }
            }
        })
    }

    obj.initKeyboardShortcuts = function () {
        jQuery(document).bind("keydown", obj.o.shortcuts.help.keys, function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            obj.helpDialog.dialog("open");
            return false;
        });
        jQuery(document).bind("keydown", obj.o.shortcuts.save.keys, function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var fileName = prompt("File Name:", (obj.dataSource.from == "url" ? obj.dataSource.url : (obj.dataSource.from == "initOptions" ? obj.dataSource.initOptions : "")));
            if (fileName) {
                obj.save({
                    fileName: fileName,
                    keepUIDs: false
                })
            }
            return false;
        });
        jQuery(document).bind("keydown", obj.o.shortcuts.open.keys, function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            obj.fileOpenDialog.dialog("open");
            return false;
        });
        jQuery(document).bind("keydown", obj.o.shortcuts["new"].keys, function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var rootNodeName = prompt("Please root node name:", obj.runtimeOptions.newDocDefaultRootNode.value);
            if (rootNodeName) {
                obj.dataSource.from = "newDocument";
                obj.dataSource.newDocument = rootNodeName;
                obj.processDataSource();
                console.log("Opening new document with root element: " + rootNodeName);
            }
            return false
        });
        jQuery(document).bind("keydown", obj.o.shortcuts.rules.keys, function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            obj.templateRulesSelectDialog.dialog("open");
            return false
        });
        jQuery(document).bind("keydown", obj.o.shortcuts.bookmarks.keys, function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            obj.manageBookmarks();
            return false
        });
        jQuery(document).bind("keydown", obj.o.shortcuts.search.keys, function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            obj.searchDialog.dialog("open");
            return false
        });
        jQuery(document).bind("keydown", obj.o.shortcuts.load.keys, function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            obj.loadDocumentFromSource();
            return false
        });
        jQuery(document).bind("keydown", obj.o.shortcuts.down.keys, function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            console.log("Moving cursor down");
            var indexActiveNodeForUpMoveOfCursor = 0;
            $("span.text", obj.tree).each(function (i) {
                if ($(this).hasClass("ui-state-highlight")) {
                    indexActiveNodeForUpMoveOfCursor = i
                }
            });
            var elementOnIndexActiveNodeForUpMoveOfCursor = $("span.text", obj.tree).get(indexActiveNodeForUpMoveOfCursor + 1);
            $(elementOnIndexActiveNodeForUpMoveOfCursor).trigger("click");

            $("#nodeListDiv").scrollTo(obj.active().get(0));

            return false
        });
        jQuery(document).bind("keydown", obj.o.shortcuts.parentToggle.keys, function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var parent = obj.active().parents("li.open").first();
            obj.reloadTreeBranch();
            var show = parent.children("span.text");
            show.trigger("click");

            return false
        });
        jQuery(document).bind("keydown", obj.o.shortcuts.nodeExtend.keys, function (evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var activ = obj.activeInXmlDoc().get(0);
            var al = +" " + activ.childNodes.length + " child nodes of ";
            if (!obj.active().hasClass("open")) {
                console.time("Extending " + al + "`" + activ.nodeName + (activ.nodeType == 1 ? (activ.hasAttribute("id") ? "#" + activ.getAttribute("id") : "") : "") + "`");
                obj.tree.get(0).ExpandNode(obj.active());
                console.timeEnd("Extending " + al + "`" + activ.nodeName + (activ.nodeType == 1 ? (activ.hasAttribute("id") ? "#" + activ.getAttribute("id") : "") : "") + "`");
            }
            return false
        });
        jQuery(document).bind("keydown", obj.o.shortcuts.nodeCollapse.keys, function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            if (obj.active().hasClass("open")) {
                console.log("Collapsing " + obj.activeInXmlDoc().get(0).nodeName);
                obj.tree.get(0).CollapseNode(obj.active());
                $("#nodeListDiv").scrollTo(obj.active().get(0));
            }
            return false
        });
        jQuery(document).bind("keydown", obj.o.shortcuts.up.keys, function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            console.log("Moving cursor up");
            var indexActiveNodeForUpMoveOfCursor = false;
            $("span.text", obj.tree).each(function (i) {
                if ($(this).hasClass("ui-state-highlight")) {
                    indexActiveNodeForUpMoveOfCursor = i
                }
            });
            if (!indexActiveNodeForUpMoveOfCursor) {
                indexActiveNodeForUpMoveOfCursor = $("span.text", obj.tree).length
            }
            var elementOnIndexActiveNodeForUpMoveOfCursor = $("span.text", obj.tree).get(indexActiveNodeForUpMoveOfCursor - 1);
            $(elementOnIndexActiveNodeForUpMoveOfCursor).trigger("click");

            $("#nodeListDiv").scrollTo(obj.active().get(0));

            return false
        });
        jQuery(document).bind("keydown", obj.o.shortcuts.toggleNode.keys, function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            obj.tree.get(0).ToggleNode(obj.active());
            return false
        });
        jQuery(document).bind("keydown", obj.o.shortcuts.toggleSelectionActive.keys, function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            $("input:checkbox:first", obj.active()).trigger("click");
            return false
        })
    };

    obj.selected = function () {
        return $(".open", obj)
    };
    obj.logoff = function () {
        var toServer = {
            cat: "LOGOFF"
        };
        $.ajax({
            url: o.serverEngine,
            type: "POST",
            async: false,
            cache: false,
            data: toServer,
            dataType: "text",
            success: function (msg) {
                console.log("USER LOGGED OUT");
                window.location.reload()
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus)
            }
        })
    };
    obj.active = function () {
        return $("span.ui-state-highlight", obj.tree).parents("li").filter(":first")
    };
    obj.activeInXmlDoc = function () {
        if (obj.active().get(0))
            return $(obj.active().get(0).documentRef)
    };
    obj.uncheckAll = function () {
        console.info("Unchecking elements");
        obj.checked().each(function () {
            var checkbox = $(this).children("input:checkbox:first").get(0);
            checkbox.checked = false;
            obj.checkedStack.removeItem(this);
            //$(this).trigger("click");
            //daca fac cu trigger le scoate automat din checkedStack pt ca vine prin kvaTree::onNodeCheckedCallback
        })
    };
    obj.checked = function () {
        return $(obj.checkedStack)
    };
    obj.checkedInXmlDoc = function (thisOne) {
        return $($(thisOne).get(0).documentRef)
    };
    obj.view = function (o) {
        var fakeDocument = obj.root.cloneNode(true);
        if (!o.toJson) {
            var data = awsNativeDOMSerializer(fakeDocument)
        }
        if (typeof obj.viewDocumentContentDialog != "object") {
            obj.viewDocumentContentDialog = $('<center><textarea type="text"  style="width:95%;"/></center>').dialog({
                height: $(document).height() - 100,
                width: $(document).width() - 100,
                open: function () {
                    $("textarea:first", this).focus()
                },
                bgiFrame: true,
                modal: true,
                title: "Content of dataSource"
            })
        } else {
            obj.viewDocumentContentDialog.dialog("open")
        }
        $("textarea:first", obj.viewDocumentContentDialog).val(data);
        var parentNode_viewDialog = $("textarea", obj.viewDocumentContentDialog).parents(".ui-dialog-content.ui-widget-content:first").get(0);
        $("textarea", obj.viewDocumentContentDialog).css("height", $(parentNode_viewDialog).height() - 30)
    };
    obj.viewNode = function () {
        if (typeof obj.viewNodeDialog != "object") {
            obj.viewNodeDialog = $('<center><textarea type="text"  style="width:95%"/></center>').dialog({
                height: $(document).height() - 100,
                width: $(document).width() - 100,
                bgiFrame: true,
                modal: true,
                title: "Content of dataSource"
            })
        } else {
            obj.viewNodeDialog.dialog("open")
        }
        $("textarea:first", obj.viewNodeDialog).val(awsNativeDOMSerializer(obj.activeInXmlDoc().get(0)));
        var parentNode_viewDialog = $("textarea", obj.viewNodeDialog).parents(".ui-dialog-content.ui-widget-content:first").get(0);
        $("textarea", obj.viewNodeDialog).css("height", $(parentNode_viewDialog).height() - 30)
    };
    obj.insertNode = function () {
        if (obj.insertNodeDialog.dialog("isOpen"))
            obj.insertNodeDialog.dialog("close");

        obj.insertNodeDialog.dialog("open");
    };
    obj.wrapAroundNode = function () {
        if (obj.wrapAroundNodeDialog.dialog("isOpen"))
            obj.wrapAroundNodeDialog.dialog("close");

        obj.wrapAroundNodeDialog.dialog("open")
    };

    obj.clipboard.afterPush = function (item) {
        console.log("Item pushed to clipboard " + item.nodeName);
        console.info("Clipboard size: " + this.length);
        obj.populateAdvancedClipboardTable($("#advcliptbl", obj.advancedClipboardDialog));
    };

    obj.clipboard.afterSplice = function () {
        console.log("Item removed from clipboard");
        obj.populateAdvancedClipboardTable($("#advcliptbl", obj.advancedClipboardDialog));
    };

    obj.clipboard.onDepleted = function () {
        console.log("Clipboard depleted");
        obj.populateAdvancedClipboardTable($("#advcliptbl", obj.advancedClipboardDialog));
    };

    obj.cutNode = function () {
        var toCut = false;
        obj.checked().each(function () {
            toCut = obj.checkedInXmlDoc(this);
            console.log("Cutting " + toCut.get(0).nodeName);
            obj.clipboard.push(toCut.get(0));
            toCut.get(0).parentNode.removeChild(toCut.get(0));
            obj.reloadTreeBranch(this)
        });

        obj.uncheckAll()
    };
    obj.copyNode = function () {
        obj.checked().each(function () {
            var toCopy = obj.checkedInXmlDoc(this);
            console.log("Copy " + toCopy.get(0).nodeName);
            var clipboard = toCopy.clone();
            obj.clipboard.push(clipboard.get(0))
        });

        obj.uncheckAll()
    };

    obj.copyChildNodes = function () {
        var checkedStack_clone = obj.checkedStack.unique();
        //lucrez pe o clona a checkedStack
        var onItemPicked = function (items, index) {
            var that = this;
            var xmlDocEq = items[0].documentRef;
            if (xmlDocEq.nodeType == 1) {
                console.log("Copy child nodes of " + xmlDocEq.nodeName);
                $(xmlDocEq.childNodes).each(function () {
                    var child = this.cloneNode(true);
                    obj.clipboard.push(child);
                });
            }
        };
        while (checkedStack_clone.pickOne(obj.checkedStack.pickFirst, onItemPicked)) {
        }
        ;
        obj.uncheckAll();
    };

    obj.cutChildNodes = function () {
        var checkedStack_clone = obj.checkedStack.unique();
        //lucrez pe o clona a checkedStack
        var onItemPicked = function (items, index) {
            var that = this;
            var xmlDocEq = items[0].documentRef;
            if (xmlDocEq.nodeType == 1) {
                console.log("Copy child nodes of " + xmlDocEq.nodeName);
                $(xmlDocEq.childNodes).each(function () {
                    obj.clipboard.push(this);
                    this.parentNode.removeChild(this);
                });
            }
        };
        while (checkedStack_clone.pickOne(obj.checkedStack.pickFirst, onItemPicked)) {
        }
        ;
        obj.uncheckAll();
    };

    obj.copyNodeAttributes = function () {
        obj.checked().each(function () {
            var xmlDocEq = obj.checkedInXmlDoc(this).get(0);
            console.log("Copy attributes of " + xmlDocEq.nodeName);
            for (i = 0; i < xmlDocEq.attributes.length; i++) {
                obj.clipboard.push(xmlDocEq.attributes[i].cloneNode(true))
            }
        });

        obj.uncheckAll()
    };

    obj.pasteNode = function () {
        if (obj.checkedStack.length > 0) {
            var checkedStack_clone = obj.checkedStack.unique();
            //lucrez pe o clona a checkedStack

            var onItemPicked = function (items, index) {
                var that = this;

                var activeElement = items[0].documentRef;

                console.info("Item picked from obj.checkedStack to paste to. Items remaining: " + this.length);

                if (activeElement.nodeType == 1)
                    //paste doar la dom element
                    obj.clipboard.forEach(function (elem, index) {
                        if (that.length > 0) {
                            //daca nu suntem la ultimul element
                            console.info("Cloning node");
                            elem = elem.cloneNode(true);
                            //folosim o clona a obiectului din clipboard
                        }
                        switch (elem.nodeType) {
                            //other DOMNode
                            default:
                                if (activeElement == elem) {
                                    alert("You cannot paste a cutted a node into itself. Use Copy instead of Cut!!!")
                                } else {
                                    activeElement.appendChild(elem);
                                    console.info("Paste node " + elem.nodeName + " to " + activeElement.nodeName);
                                }
                                break;
                                //DOMAttributeNode
                            case 2:
                                activeElement.setAttributeNode(elem);
                                console.info("Paste attribute " + elem.name + " to " + activeElement.nodeName);
                                break;
                        }
                    });
            };

            while (checkedStack_clone.pickOne(obj.checkedStack.pickFirst, onItemPicked)) {
            }
            ;

            obj.uncheckAll();

            if (obj.runtimeOptions.autoClearClipboard.value)
                obj.clipboard.empty(false);
        } else
            alert("No node selected");
    };

    obj.pasteSpecialNode = function () {
        if (obj.checkedStack.length > 0) {
            var checkedStack_clone = obj.checkedStack.unique();
            //lucrez pe o clona a checkedStack

            var onItemPicked = function (items, index) {
                var that = this;

                var activeElement = items[0].documentRef;

                console.info("Item picked from obj.checkedStack to paste to. Items remaining: " + this.length);

                obj.clipboard.forEach(function (elem, index) {
                    if (that.length > 0) {
                        //daca nu suntem la ultimul element
                        console.info("Cloning node");
                        elem = elem.cloneNode(true);
                        //folosim o clona a obiectului din clipboard
                    }
                    switch (elem.nodeType) {
                        //other DOMNode
                        default:
                            if (activeElement == elem) {
                                alert("You cannot paste a cutted a node into itself. Use Copy instead of Cut!!!")
                            } else {
                                if (confirm("Paste '" + elem.nodeName + "'\n   Before " + activeElement.nodeName + ": Press OK\n   After " + activeElement.nodeName + ": Press Cancel")) {
                                    activeElement.parentNode.insertBefore(elem, activeElement);
                                    console.info("Paste " + elem.nodeName + " Before " + activeElement.nodeName);
                                } else {
                                    activeElement.parentNode.insertBefore(elem, activeElement.nextSibling);
                                    console.info("Paste " + elem.nodeName + " After " + activeElement.nodeName);
                                }

                            }
                            break;
                            //DOMAttributeNode
                        case 2:
                            console.info("Paste attribute before or after DOMElement not possible");
                            break;
                    }
                });
            };

            while (checkedStack_clone.pickOne(obj.checkedStack.pickFirst, onItemPicked)) {
            }
            ;

            obj.uncheckAll();

            if (obj.runtimeOptions.autoClearClipboard.value)
                obj.clipboard.empty(false);
        } else
            alert("No node selected");
    };

    obj.pasteThisToActiveNode = function (elem) {
        var activeElement = obj.activeInXmlDoc().get(0);
        switch (elem.nodeType) {
            case 1:
                if (activeElement == elem) {
                    alert("You cannot paste a cutted a node into itself. Use Copy instead of Cut!!!")
                } else {
                    activeElement.appendChild(elem);
                    console.log("Paste " + elem.nodeName + " to " + activeElement.nodeName);
                }
                break;
            case 2:
                activeElement.setAttribute(elem.name, elem.value);
                console.log("Paste attribute " + elem.nodeName + " to " + activeElement.nodeName);
                break;
            default:
                activeElement.appendChild(elem);
                console.log("Paste " + elem.nodeName + " to " + activeElement.nodeName);
                break
        }
        obj.reloadTreeBranch(obj.active().get(0), "self")
    };

    obj.pasteSpecialThisToActiveNode = function (elem) {
        var activ = obj.activeInXmlDoc().get(0);
        if (elem.nodeType != 2) {
            if (activ == elem) {
                alert("You cannot paste a cutted a node into itself. Use Copy instead of Cut!!!")
            } else {
                if (confirm("Paste '" + elem.nodeName + "'\n   Before " + activ.nodeName + ": Press OK\n   After " + activ.nodeName + ": Press Cancel")) {
                    console.log("Paste " + elem.nodeName + " Before " + activ.nodeName);
                    activ.parentNode.insertBefore(elem, activ);
                } else {
                    console.log("Paste " + elem.nodeName + " after " + activ.nodeName);
                    activ.parentNode.insertBefore(elem, activ.nextSibling);
                }
                obj.reloadTreeBranch(obj.active().get(0))
            }
        } else {
            alert("Attributes cannot be copied before or after an element but to the element only!")
        }
    };

    obj.advancedClipboard = function () {
        if (obj.advancedClipboardDialog.dialog("isOpen"))
            obj.advancedClipboardDialog.dialog("close");

        obj.advancedClipboardDialog.dialog("open");
    };

    obj.deleteNode = function (params) {
        obj.checked().each(function () {
            var xmldocEq = obj.checkedInXmlDoc(this).get(0);
            if (xmldocEq != obj.root) {
                if (confirm("Delete node '" + xmldocEq.nodeName + "' ?")) {
                    console.log("Deleting " + xmldocEq.nodeName);

                    obj.tree.kvaTree.DeleteNode(this);
                    xmldocEq.parentNode.removeChild(xmldocEq);
                }
            } else {
                alert("You cannot delete root element")
            }
            obj.reloadTreeBranch(this);
        });
        obj.uncheckAll();
        return true
    };

    obj.duplicateNode = function (params) {
        obj.checked().each(function () {
            var xmldocEq = obj.checkedInXmlDoc(this).get(0);
            if (xmldocEq != obj.root) {
                console.info("Duplicating " + xmldocEq.nodeName);
                xmldocEq.parentNode.insertBefore(xmldocEq.cloneNode(true), xmldocEq);
            } else {
                console.log("You cannot duplicate the root element")
            }
            obj.reloadTreeBranch(this);
        });
        obj.uncheckAll();
        return true
    };

    obj.deleteAttribute = function (name, element) {
        if (confirm("Really delete attribute " + name + "?")) {
            console.log("Deleting attribute " + name + " of " + element.nodeName);
            element.removeAttribute(name);
            return true
        } else {
            return false
        }
    };
    obj.editNode = function () {
        if (obj.active()) {
            var xmlDocEq = obj.activeInXmlDoc().get(0);
            var newName = prompt("New name", xmlDocEq.nodeName);
            if (newName) {
                try {
                    var newNode = xmlDocEq.ownerDocument.createElement(newName);
                    if (xmlDocEq.nodeType == 1 && xmlDocEq.hasAttributes()) {
                        for (i = 0; i < xmlDocEq.attributes.length; i++) {
                            newNode.setAttribute(xmlDocEq.attributes[i].name, xmlDocEq.attributes[i].value)
                        }
                    }
                    if (xmlDocEq.nodeType == 1 && xmlDocEq.hasChildNodes()) {
                        for (i = 0; i < xmlDocEq.childNodes.length; i++) {
                            newNode.appendChild(xmlDocEq.childNodes[i].cloneNode(true))
                        }
                    }
                    console.log("Rename node " + xmlDocEq.nodeName + " as " + newNode.nodeName);
                    xmlDocEq.parentNode.replaceChild(newNode, xmlDocEq);
                } catch (e) {
                    alert(e.toSource())
                }
            }
            if (xmlDocEq == obj.root) {
                var oldDataSource = obj.dataSource.from;
                obj.dataSource.from = "fromEmbedXMLDOC";
                obj.processDataSource();
                obj.dataSource.from = oldDataSource
            } else {
                obj.reloadTreeBranch(obj.active().get(0))
            }
        }
    };
    obj.elementXpath = function (param) {
        var reversed = new Array();
        var parents = $(param.elem).parents();
        var foundPath = "";
        var findElementIndex = function (node) {
            switch (node.nodeType) {
                case 2:
                    var parent = node.ownerElement;
                    break;
                case 1:
                    var parent = node.parentNode;
                    break;
                default:
                    var parent = node.parentNode;
                    break
            }
            var toReturn = 0;
            var current = parent.firstChild;
            var index = 1;
            do {
                if (current.nodeType == 1) {
                    if (current.nodeName == node.nodeName) {
                        if (current == node) {
                            toReturn = index
                        } else {
                            index++
                        }
                    }
                }
            } while (current = current.nextSibling);
            return toReturn
        };
        parents.each(function () {
            if (this.nodeType == 1) {
                reversed.unshift($(this))
            }
        });
        reversed.push($(param.elem));
        if (reversed.length > 0) {
            $(reversed).each(function () {
                if (!param.useIndexes) {
                    foundPath = foundPath + "/" + $(this).get(0).nodeName + "[" + findElementIndex($(this).get(0)) + "]"
                } else {
                    if ($(this).get(0).nodeType == 1 && $(this).get(0).hasAttribute("id") && $(this).get(0).getAttribute("id") != null && $(this).get(0).getAttribute("id") != undefined) {
                        var quotes = '@id="' + $(this).get(0).getAttribute("id") + '"'
                    } else {
                        var quotes = findElementIndex($(this).get(0))
                    }
                    foundPath = foundPath + "/" + $(this).get(0).nodeName + "[" + quotes + "]"
                }
            })
        }
        return "/" + foundPath
    };
    obj.elementCSSPath = function (param) {
        var reversed = new Array();
        var parents = $(param.elem).parents();
        var foundPath = "";
        var findElementIndex = function (node) {
            switch (node.nodeType) {
                case 2:
                    var parent = node.ownerElement;
                    break;
                case 1:
                    var parent = node.parentNode;
                    break;
                default:
                    var parent = node.parentNode;
                    break
            }
            var toReturn = 0;
            var current = parent.firstChild;
            var index = 0;
            do {
                if (current.nodeType == 1) {
                    if (current.nodeName == node.nodeName) {
                        if (current == node) {
                            toReturn = index
                        } else {
                            index++
                        }
                    }
                }
            } while (current = current.nextSibling);
            return toReturn
        };
        parents.each(function () {
            if (this.nodeType == 1) {
                reversed.unshift($(this))
            }
        });
        reversed.push($(param.elem));
        if (reversed.length > 0) {
            $(reversed).each(function () {
                if (!param.useIndexes) {
                    foundPath = foundPath + ">" + $(this).get(0).nodeName + ":eq(" + findElementIndex($(this).get(0)) + ")"
                } else {
                    if ($(this).get(0).nodeType == 1 && $(this).get(0).hasAttribute("id") && $(this).get(0).getAttribute("id") != null && $(this).get(0).getAttribute("id") != undefined) {
                        var quotes = "#" + $(this).get(0).getAttribute("id")
                    } else {
                        var quotes = ":eq(" + findElementIndex($(this).get(0)) + ")"
                    }
                    foundPath = foundPath + ">" + $(this).get(0).nodeName + quotes
                }
            })
        }
        return foundPath.slice(1)
    };
    obj.prepareDataSource = function (contentString) {
        if (contentString) {
            var DSRC_STRING = contentString
        } else {
            var DSRC_STRING = obj.dataSourceContent
        }
        obj.root = false;

        obj.xmlDoc = $.parseXML(DSRC_STRING);

        if ($.isXMLDoc(obj.xmlDoc))
            console.log("XML Document loaded from " + obj.dataSource.from);

        obj.root = obj.xmlDoc.documentElement;
        if (obj.root.localName == "app" && obj.o.autoCreateBookmarks) {
            for (i = 0; i < obj.root.childNodes.length; i++) {
                if (obj.root.childNodes[i].nodeType == 1 && obj.root.childNodes[i].nodeName == "bookmarks") {
                    obj.bookmarks = obj.root.childNodes[i]
                }
            }
            if (typeof obj.bookmarks != "object") {
                var newBookmark = obj.xmlDoc.createElement("bookmarks");
                obj.root.appendChild(newBookmark)
            }
        }

        if (obj.dataSource.from == "url")
            var url = obj.dataSource.url;

        if (obj.dataSource.from == "initOptions")
            var url = obj.dataSource.initOptions;

        //scriu url dom storage daca este nevoie
        if (url != undefined) {
            var databaserecentlyOpenedRecord = obj.persistent_storage.find({
                "name": "recentlyOpened",
                "fileName": url
            });
            //daca avem recordset length >0
            if (typeOf(databaserecentlyOpenedRecord) == "Array" && databaserecentlyOpenedRecord.length > 0) {
                //daca exista url in db, update cu noua data
                obj.persistent_storage.update(databaserecentlyOpenedRecord[0].id, {
                    "name": "recentlyOpened",
                    "fileName": url,
                    "date": Date.now()
                });
            } else {
                //daca nu exista url in db inseram obiect nou
                obj.persistent_storage.insert({
                    "name": "recentlyOpened",
                    "fileName": url,
                    "date": Date.now()
                });
            }
            obj.dialog("option", "title", url);
        }

        if (obj.dataSource.from != "url" && obj.dataSource.from != "initOptions")
            obj.dialog("option", "title", obj.instanceOf + " " + obj.version + "-" + obj.credentials + " / " + obj.releaseDate);
    };

    obj.buildTree = function () {
        obj.prepareDataSource(obj.dataSourceContent);
        if ($("ul.domtree", obj.nodeList).length != 0) {
            $("ul.domtree", obj.nodeList).replaceWith("")
        }
        obj.nodeList.append('<ul class="domtree"><li rootnode="true"><input type="checkbox" style="position:relative; left: -54px; top: -3px;"/><span style="position:relative; left: -20px; top: -4px;">' + obj.root.nodeName + '</span><ul id="' + obj.root.nodeName + '"></ul></li></ul>');
        $("li[rootnode=true]", obj.nodeList).get(0).documentRef = obj.root;
        obj.tree = $("ul.domtree", obj.nodeList);
        obj.tree.kvaTree(o.treeOptions);

        obj.dataSourceInitialized = true;
    };
    obj.showNodeInfo = function (xmlDomEq) {
        obj.nodeInfo.html('<legend class="ui-corner-all ui-state-active" style="border: 1px solid; font-weight: bold;">Available Information for ' + xmlDomEq.nodeName + '</legend><div style="overflow:auto;"><table id="elementInfo" class="ui-widget ui-widget-content" style="overflow-x: auto;width:100%"><tr><td style="width:30%">Name</td><td>Value</td></tr></table></div>');
        $("<tr><td>Node Name</td><td>" + xmlDomEq.nodeName + "</tr>").appendTo($("#elementInfo", obj.nodeInfo));
        $("<tr><td>Node Type</td><td>" + xmlDomEq.nodeType + "</tr>").appendTo($("#elementInfo", obj.nodeInfo));
        $("<tr><td>Child nodes</td><td>" + (xmlDomEq.nodeType == 1 ? xmlDomEq.childNodes.length : "Not available") + "</tr>").appendTo($("#elementInfo", obj.nodeInfo));
        $("<tr><td>Attributes</td><td>" + (xmlDomEq.nodeType == 1 ? xmlDomEq.attributes.length : "Not available") + "</tr>").appendTo($("#elementInfo", obj.nodeInfo));
        $("<tr><td>XPath</td><td>" + (xmlDomEq.nodeType == 1 ? obj.elementXpath({
            elem: xmlDomEq,
            useIndexes: true
        }) : "Not available") + "</tr>").appendTo($("#elementInfo", obj.nodeInfo));
        $("<tr><td>CSSPath</td><td>" + (xmlDomEq.nodeType == 1 ? obj.elementCSSPath({
            elem: xmlDomEq,
            useIndexes: true
        }) : "Not available") + "</tr>").appendTo($("#elementInfo", obj.nodeInfo));
        $("tr:even", obj.nodeInfo).each(function () {
            $(this).addClass("ui-state-active")
        })
    };
    obj.showAttributes = function (xmlDomEq) {
        obj.nodeAttributes.html('<legend class="ui-corner-all ui-state-active" style="border: 1px solid; font-weight: bold;">Attributes for ' + xmlDomEq.nodeName + '</legend><table id="elementAttributes" class="ui-widget ui-widget-content" style="width:100%"><tr><td style="width:30%">Name</td><td>Value</td></tr><tr><td><input type="text" value="New Attribute Name" id="newAttribute"/></td><td id="attributeValue">Value</td></tr></table>');
        if (xmlDomEq.nodeType == 1) {
            $(xmlDomEq.attributes).each(function () {

                $("#elementAttributes", obj.nodeAttributes).append($('<tr><td attr="' + this.name + '">' + this.name + '</td><td id="attributeValue" title="Click to change attribute value" style="word-break:break-all;">' + this.value + "</td></tr>"));
                var thisRow = $("tr:last", $("#elementAttributes", obj.nodeAttributes)).get(0);

                obj.initAttributeTools(this, thisRow, xmlDomEq);
            });

            $("#newAttribute", obj.nodeAttributes).css({
                width: $("#newAttribute", obj.nodeAttributes).parents("td:first").innerWidth()
            }).click(function () {
                $(this).val("")
            }).change(function () {
                if ($(this).val()) {
                    $(this).parents("td:first").attr("attr", $(this).val()).html($(this).val())
                } else {
                    $(this).val("New Attribute Name")
                }
            });
            obj.showAttributes_attachEditEvent(xmlDomEq)

        }
        $("tr:even", obj.nodeAttributes).each(function () {
            $(this).addClass("ui-state-active")
        })
    }

    obj.showAttributes_attachEditEvent = function (xmlDomEq) {
        $("td#attributeValue", obj.nodeAttributes).click(function () {
            var attrName = this.previousSibling.getAttribute("attr");
            if (!o.acceptAttributes(attrName, xmlDomEq)) {
                var allowed = o.documentMap.attributes[obj.active().get(0).documentRef.nodeName];
                var allowedText = "";
                for (i in allowed) {
                    allowedText = allowedText + " '" + i + "'"
                }
                alert("Creating attribute '" + attrName + "' has been DENIED by the acceptAttributes Filter;\n Allowed only: " + allowedText)
            } else {
                if (o.denyAttributes(attrName, xmlDomEq)) {
                    alert("Creating attribute '" + attrName + "' has been DENIED by the denyAttributes Filter")
                } else {
                    var newAttrValue = prompt("New value for attribute " + attrName, $(this).html());
                    xmlDomEq.setAttribute(attrName, newAttrValue);
                    $(this).html(newAttrValue);
                    obj.showAttributes(xmlDomEq)
                }
            }
        })
    };
    obj.createNodeByType = function (domdocument, type, data) {
        var piTarget = false;
        var toRet = false;
        var nodeTypes = {
            3: "#text",
            4: "#cdata-section",
            7: "#pi",
            8: "#comment"
        };
        if (type == 7) {
            do {
                piTarget = prompt("#pi Target", obj.runtimeOptions.defaultPITarget.value)
            } while (/[^a-zA]/.test(piTarget))
        }
        switch (type) {
            case 3:
                toRet = domdocument.createTextNode(data);
                break;
            case 4:
                toRet = domdocument.createCDATASection(data);
                break;
            case 7:
                toRet = domdocument.createProcessingInstruction(piTarget, data);
                break;
            case 8:
                toRet = domdocument.createComment(data);
                break
        }
        return toRet
    };
    obj.showNodeByType = function (xmlDomEq, interfaceContainer, nodeTypeToShow, handler) {
        var nodesToShow = new Array();
        var nodeTypes = {
            3: "#text",
            4: "#cdata-section",
            7: "#pi",
            8: "#comment"
        };
        if (xmlDomEq.nodeType == 1) {
            for (i = 0; i < xmlDomEq.childNodes.length; i++) {
                if (xmlDomEq.childNodes[i].nodeType == nodeTypeToShow) {
                    nodesToShow.push(xmlDomEq.childNodes[i])
                }
            }
        } else {
            if (xmlDomEq.nodeType == nodeTypeToShow) {
                nodesToShow.push(xmlDomEq)
            }
        }
        interfaceContainer.html('<legend title="Click to add new ' + nodeTypes[nodeTypeToShow] + '" class="ui-corner-all ui-state-active" style="border: 1px solid; font-weight: bold; pading: 5px;">' + nodeTypes[nodeTypeToShow] + " of " + xmlDomEq.nodeName + "</legend>");

        for (i = 0; i < nodesToShow.length; i++) {
            if (nodesToShow[i].nodeType == nodeTypeToShow) {
                var nodeToShow = nodesToShow[i];
                interfaceContainer.append('<div id="comment_' + i + '" title="Click to edit or delete ' + nodeTypes[nodeTypeToShow] + '" class="ui-widget ui-widget-content comment" style="margin: 5px; min-height: 14px;">' + (nodeToShow != null || nodeToShow != undefined ? nodeToShow.nodeValue.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : "No Text") + "</div>");
                $("#comment_" + i + ".comment", interfaceContainer).get(0).documentRef = nodeToShow;
                $("#comment_" + i + ".comment", interfaceContainer).click(function () {
                    var that = this;
                    var textEditor = $('<div><textarea style="width:98%; height: 98%"></textarea></div>').dialog({
                        modal: true,
                        height: 400,
                        width: 400,
                        title: "Edit " + nodeTypes[nodeTypeToShow] + " inside " + xmlDomEq.nodeName,
                        open: function () {
                            $("textarea", this).val(that.documentRef.nodeValue).focus()
                        },
                        buttons: {
                            Ok: function () {
                                if (that.documentRef) {
                                    that.documentRef.nodeValue = $("textarea:first", textEditor).val()
                                } else {
                                    if (confirm("There is no " + +nodeTypes[nodeTypeToShow] + ", would you like to create one?")) {
                                        var newCommentElement = obj.createNodeByType(xmlDomEq.ownerDocument, nodeTypeToShow, $("textarea:first", this).val());
                                        xmlDomEq.appendChild(newCommentElement)
                                    }
                                    handler(xmlDomEq)
                                }
                                obj.tree.kvaTree.InitKvaTree();
                                $(this).dialog("destroy").replaceWith(" ")
                            },
                            Delete: function () {
                                if (confirm("Really delete " + nodeTypes[nodeTypeToShow] + ":\n" + that.documentRef.nodeValue + "\n?")) {
                                    if (xmlDomEq !== that.documentRef) {
                                        xmlDomEq.removeChild(that.documentRef)
                                    } else {
                                        xmlDomEq.parentNode.removeChild(that.documentRef)
                                    }
                                    handler(xmlDomEq)
                                }
                                $(this).dialog("destroy").replaceWith(" ")
                            },
                            Cancel: function () {
                                $(this).dialog("destroy").replaceWith(" ")
                            }
                        }
                    })
                })
            }
        }
        $("legend.ui-state-active:first", interfaceContainer).click(function () {
            var that = false;
            if (xmlDomEq.nodeType == 1) {
                var textEditor = $('<div><textarea style="width:98%; height: 98%"></textarea></div>').dialog({
                    modal: true,
                    height: 400,
                    width: 400,
                    title: "New " + nodeTypes[nodeTypeToShow] + " " + xmlDomEq.nodeName,
                    open: function () {
                        $("textarea", this).focus()
                    },
                    buttons: {
                        Ok: function () {
                            var commentData = $("textarea:first", textEditor).val();
                            var create = true;
                            if (!commentData) {
                                if (!confirm("No data supplied for this " + nodeTypes[nodeTypeToShow] + " node. Should still be created?")) {
                                    create = false
                                }
                            }
                            if (create) {
                                var newCommentElement = obj.createNodeByType(xmlDomEq.ownerDocument, nodeTypeToShow, commentData);
                                xmlDomEq.appendChild(newCommentElement);
                                obj.tree.kvaTree.InitKvaTree();
                                handler(xmlDomEq)
                            }
                            $(this).dialog("destroy").replaceWith(" ")
                        },
                        Cancel: function () {
                            $(this).dialog("destroy").replaceWith(" ")
                        }
                    }
                })
            }
        })
    };
    obj.showTextNode = function (xmlDomEq) {
        obj.showNodeByType(xmlDomEq, obj.nodeContent, 3, obj.showTextNode)
    };
    obj.showComments = function (xmlDomEq) {
        obj.showNodeByType(xmlDomEq, obj.nodeComments, 8, obj.showComments)
    };
    obj.showCdata = function (xmlDomEq) {
        obj.showNodeByType(xmlDomEq, obj.nodeCdata, 4, obj.showCdata)
    };
    obj.showPIS = function (xmlDomEq) {
        obj.showNodeByType(xmlDomEq, obj.nodeProcessingInstructions, 7, obj.showPIS)
    };
    obj.deleteChildNodes = function () {
        obj.checked().each(function () {
            if (confirm("Really delete child nodes of element " + this.textContent + "?")) {
                var xmlDomEq = obj.checkedInXmlDoc(this).get(0);
                if (xmlDomEq.hasChildNodes()) {
                    while (xmlDomEq.firstChild) {
                        xmlDomEq.removeChild(xmlDomEq.firstChild)
                    }
                }
            }
            obj.reloadTreeBranch(this)
        });
        obj.uncheckAll()
    };

    obj.runCodeOnSelectedNode = function () {
        if (obj.active().length > 0) {
            if (typeof obj.runCodeOnSelectedNodeDialog != "object") {
                obj.runCodeOnSelectedNodeDialog = $('<div><textarea type="text"  style="width:99%;height:98%;"/></div>').dialog({
                    height: 400,
                    modal: false,
                    width: 700,
                    title: "Enter code to run on selected node",
                    open: function () {
                        $("textarea:first", this).focus()
                    },
                    buttons: {
                        Ok: function () {
                            var xmlDomEq = obj.active().get(0).documentRef;
                            eval("var funcToRun = function(i,e){" + unescape($("textarea", this).val()) + "};");
                            console.log("On: " + xmlDomEq.nodeName + " Running: '" + funcToRun + "'");
                            $(xmlDomEq).each(funcToRun);
                            $(this).dialog("close")
                        },
                        Cancel: function () {
                            $(this).dialog("close")
                        }
                    }
                })
            } else {
                obj.runCodeOnSelectedNodeDialog.dialog("open")
            }
        } else {
            alert("Please select a node")
        }
    };
    obj.insertDocumentFragment = function () {
        if (obj.insertDocumentFragmentDialog.dialog("isOpen"))
            obj.insertDocumentFragmentDialog.dialog("close");

        obj.insertDocumentFragmentDialog.dialog("open");

        var parentNode_loadDocumentFragmentDialog = $("textarea", obj.insertDocumentFragmentDialog).parents(".ui-dialog-content.ui-widget-content:first").get(0);
        $("textarea", obj.insertDocumentFragmentDialog).css("height", $(parentNode_loadDocumentFragmentDialog).height() - 160)
    };
    obj.loadDocumentFromSource = function () {
        if (obj.loadDocumentFromSourceDialog.dialog("isOpen"))
            obj.loadDocumentFromSourceDialog.dialog("close");

        obj.loadDocumentFromSourceDialog.dialog("open")

        var parentNode_loadDocumentSourceDialog = $("textarea", obj.loadDocumentFromSourceDialog).parents(".ui-dialog-content.ui-widget-content:first").get(0);
        $("textarea", obj.loadDocumentFromSourceDialog).css("height", $(parentNode_loadDocumentSourceDialog).height() - 30)
    };

    obj.sourceDocElem = false;
    obj.doImport = function () {
        try {
            var dest = obj.active().get(0).documentRef;
            dest.appendChild(dest.ownerDocument.importNode(obj.sourceDocElem, true));
            alert("Document import done!!")
        } catch (e) {
            alert("Source interogation failed:\n" + e.toSource())
        }
    };
    obj.importHTML = function () {
        if (obj.active().length > 0) {
            var url = prompt("Please enter URL to import from:", "mockup/test.html");
            if (url) {
                $.ajax({
                    async: false,
                    url: o.serverEngine,
                    type: "POST",
                    data: ({
                        cat: "HTML2AWS",
                        location: url
                    }),
                    dataType: "xml",
                    success: function (msg) {
                        obj.sourceDocElem = msg.documentElement;
                        console.time("Importing html");
                        obj.doImport();
                        console.timeEnd("Importing html");
                        obj.reloadTreeBranch(obj.active().get(0), "self");
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.error(errorThrown);
                        alert("jqForms populate request " + textStatus + ":" + errorThrown + XMLHttpRequest.responseText)
                    }
                })
            }
        } else {
            alert("Select a target node first!")
        }
    };

    obj.createBookmark = function () {
        var bookmarkName = prompt("Bookmark name", (obj.activeInXmlDoc().get(0).hasAttribute("name") ? obj.activeInXmlDoc().get(0).getAttribute("name") : (obj.activeInXmlDoc().get(0).hasAttribute("id") ? obj.activeInXmlDoc().get(0).getAttribute("id") : "")));
        if (bookmarkName && obj.root.nodeName == "app") {
            for (i = 0; i < obj.root.childNodes.length; i++) {
                if (obj.root.childNodes[i].nodeType == 1 && obj.root.childNodes[i].nodeName == "bookmarks") {
                    obj.bookmarks = obj.root.childNodes[i]
                }
            }
            if (typeof obj.bookmarks == "object") {
                var newBookmark = obj.xmlDoc.createElement("bookmark");
                var csspath = obj.elementCSSPath({
                    elem: $(obj.activeInXmlDoc()),
                    useIndexes: true
                });
                newBookmark.setAttribute("name", bookmarkName);
                newBookmark.appendChild(obj.xmlDoc.createTextNode(csspath));
                obj.bookmarks.appendChild(newBookmark);
                console.log("Bookmarking: " + csspath);
            } else {
                alert("Bookmark element doesn't exist!! \n Please create one element with 'bookmarks' name, as a child of the root node")
            }
        }
    };

    obj.manageBookmarks = function () {
        if (obj.bookmarksDialog.dialog("isOpen"))
            obj.bookmarksDialog.dialog("close");

        obj.bookmarksDialog.dialog("open");
    };

    obj.extendActive = function () {
        var activ = obj.active();

        if (activ.length > 0) {
            console.log("Extending active node");

            if (!activ.hasClass("open"))
                obj.tree.get(0).ExpandNode(activ);
        }
    };
    obj.extendCssPath = function (csspath) {
        console.time("Extending path: " + csspath);
        var split = csspath.split(">");
        $("li", obj.tree).each(function () {
            if (this.documentRef === $(split[0], obj.xmlDoc).get(0)) {
                obj.tree.get(0).CollapseNode($(this));
            }
        });
        var collect = "";
        $(split).each(function (i) {
            collect += ">" + this;
            var currentNodeinXMLDoc = $(collect.slice(1), obj.xmlDoc).get(0);
            $("li", obj.tree).each(function () {
                if (this.documentRef === currentNodeinXMLDoc) {
                    obj.tree.get(0).ExpandNode($(this));
                }
            })
        });

        $("li", obj.tree).each(function () {
            if (this.documentRef === $(collect.slice(1), obj.xmlDoc).get(0)) {
                $(this).children("span.text").trigger("click")
            }
        });

        console.timeEnd("Extending path: " + csspath);
    };

    //TODO: cut delete cope and paste doesnt work because we lose the content while toggle
    obj.reloadTreeBranch = obj.toggleNodeParent = function (thisOne, what) {
        if (thisOne == null)
            thisOne = obj.active();

        if (what == "self") {
            if ($(thisOne).children("span").hasClass(".sign"))
                if (thisOne.children("span.sign.minus").length > 0)
                    obj.tree.get(0).redrawOpenNode(thisOne);
                else
                    //pt leaf
                    obj.tree.get(0).redrawOpenNode($(thisOne).parents("li.node").first());

            //pt leaf
            //else
            //$(thisOne).parents("li:first").children("span.sign.minus").trigger("click").trigger("click");
        } else {
            var activeParent = $(thisOne).parents("li:first");
            if (activeParent.children("span.sign.minus").length > 0)
                obj.tree.get(0).redrawOpenNode(activeParent);
        }
    }
    obj.toggleNodeListDiv = function () {
        var elem = $("div#leftHandControls");
        /*
         var availableW = elem.parent().innerWidth();
         var currentW = elem.outerWidth();
         if (currentW <= availableW/2) {
         elem.width(currentW + availableW / 3)
         } else {
         elem.width(availableW / 2)
         }*/

        setInitialDimensions(elem.outerWidth(true));
    };

    obj.setElementToolsVisibility = function (condition, list) {

        list.forEach(function (item, index) {
            var _class = "";
            var statusActive = false;

            if (condition > 0)
                statusActive = true;

            if (typeof item == "object") {
                //daca avem obiect luam clasa din eticheta si callback
                //activez daca callback returneaza true sau false sa o val convertibila
                for (var itemName in item) {
                }
                ;

                _class = itemName;
                var cb = item[itemName];

                statusActive = Boolean(cb.apply(obj, [itemName])) && statusActive;
            } else
                //daca este string activez/dezactivez in functie de conditia initiala (obj.checked sau obj.active)
                _class = item;

            if (statusActive)
                $("span.ui-icon." + _class).removeClass("ui-state-disabled")
            else
                $("span.ui-icon." + _class).addClass("ui-state-disabled")
        });
    };

    obj.setActiveElementsTools = function () {
        var list = new Array({
            "ui-icon-cart": function () {
                return this.clipboard.length;
            }
        }, "ui-icon-pencil", "ui-icon-comment", "ui-icon-star", "ui-icon-play", "ui-icon-folder-open", "ui-icon-transfer-e-w");
        obj.setElementToolsVisibility(obj.active().length, list);
    };

    function checkFor_all_DOMElement_in_CheckedStack() {
        var toRet = true;
        obj.checkedStack.forEach(function (item) {
            if (item.documentRef.nodeType != 1) {
                toRet = false;
                console.info("One or more of the selected items are not DOMElements");
            }
        });
        return toRet;
    }
    ;

    obj.setCheckedElementsTools = function () {
        var list = new Array({
            "ui-icon-clipboard": function () {
                return this.clipboard.length;
            }
        }, {
            "ui-icon-newwin": function () {
                return this.clipboard.length;
            }
        }, {
            "ui-icon-trash": function () {
                return obj.checkedStack.length;
            }
        }, {
            "ui-icon-carat-2-n-s": function () {
                return obj.checkedStack.length;
            }
        }, {
            "ui-icon-plus": checkFor_all_DOMElement_in_CheckedStack
        }, "ui-icon-transferthick-e-w", {
            "ui-icon-battery-3": checkFor_all_DOMElement_in_CheckedStack
        }, {
            "ui-icon-circle-minus": checkFor_all_DOMElement_in_CheckedStack
        }, "ui-icon-scissors", {
            "ui-icon-suitcase": checkFor_all_DOMElement_in_CheckedStack
        }, "ui-icon-copy", {
            "ui-icon-person": checkFor_all_DOMElement_in_CheckedStack
        }, {
            "ui-icon-flag": checkFor_all_DOMElement_in_CheckedStack
        });

        obj.setElementToolsVisibility(obj.checked().length, list);
    };

    obj.initTools = function () {
        var nodeToolsContainerTemplate = $('<div style="position:absolute;" id="controls">' + (obj.o.isMobile() ? '<span style="background-color: white;" title="TOGGLE ACTIVE" class="node-tool ui-icon ui-icon-transfer-e-w"></span>' : "") + '<span style="background-color: white;" title="IMPORT HTML INTO ACTIVE NODE" class="node-tool ui-icon ui-icon-folder-open"></span><span style="background-color: white;" title="RELOAD TREE" class="node-tool ui-icon ui-icon-refresh"></span><span style="background-color: white;" title="RUN CODE ON ACTIVE NODE" class="node-tool ui-icon ui-icon-play"></span><span style="background-color: white;" title="INSERT NODE TO SELECTED" class="node-tool ui-icon ui-icon-plus"></span><span style="background-color: white;" title="WRAP AROUND SELECTED" class="node-tool ui-icon ui-icon-transferthick-e-w"></span><span style="background-color: white;" title="INSERT DOCUMENT FRAGMENT TO SELECTED" class="node-tool ui-icon ui-icon-battery-3"></span><span style="background-color: white;" title="DUPLICATE SELECTED" class="node-tool ui-icon ui-icon-carat-2-n-s"></span><span style="background-color: white;" title="DELETE SELECTED NODES" class="node-tool ui-icon ui-icon-trash"></span><span style="background-color: white;" title="DELETE CHILD NODES OF SELECTED" class="node-tool ui-icon ui-icon-circle-minus"></span><span style="background-color: white;" title="CUT SELECTED NODES" class="node-tool ui-icon ui-icon-scissors"></span><span style="background-color: white;" title="CUT CHILD NODES OF SELECTED" class="node-tool ui-icon ui-icon-suitcase"></span><span style="background-color: white;" title="COPY SELECTED NODES" class="node-tool ui-icon ui-icon-copy"></span><span style="background-color: white;" title="COPY CHILD NODES OF SELECTED" class="node-tool ui-icon ui-icon-person"></span><span style="background-color: white;" title="COPY ATTRIBUTES OF SELECTED" class="node-tool ui-icon ui-icon-flag"></span><span style="background-color: white;" title="PASTE TO SELECTED" class="node-tool ui-icon ui-icon-clipboard"></span><span style="background-color: white;" title="PASTE BEFORE / AFTER SELECTED" class="node-tool ui-icon ui-icon-newwin"></span><span style="background-color: white;" title="ADVANCED CLIPBOARD" class="node-tool ui-icon ui-icon-cart"></span><span style="background-color: white;" title="VIEW SOURCE OF ACTIVE NODE" class="node-tool ui-icon ui-icon-comment"></span><span style="background-color: white;" title="RENAME ACTIVE NODE" class="node-tool ui-icon ui-icon-pencil"></span><span style="background-color: white;" title="BOOKMARK ACTIVE NODE" class="node-tool ui-icon ui-icon-star"></span><span style="background-color: white;" title="BOOKMARKS LIST" class="node-tool ui-icon ui-icon-bookmark"></span></div>').appendTo($("#leftHandControls", obj)).hide();
        $("span.node-tool", nodeToolsContainerTemplate).each(function () {
            $(this).mouseover(function () {
                $(this).css("background-color", "yellow")
            }).mouseout(function () {
                $(this).css("background-color", "white")
            })
        });
        $("span.ui-icon-folder-open", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.importHTML()
            }
        });
        $("span.ui-icon-refresh", nodeToolsContainerTemplate).click(function () {
            obj.processDataSource()
        });
        $("span.ui-icon-comment", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.viewNode()
            }
        });
        $("span.ui-icon-plus", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.insertNode()
            }
        });
        $("span.ui-icon-transferthick-e-w", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.wrapAroundNode()
            }
        });
        $("span.ui-icon-transfer-e-w", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.extendActive()
            }
        });
        $("span.ui-icon-battery-3", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.insertDocumentFragment()
            }
        });
        $("span.ui-icon-scissors", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.cutNode()
            }
        });
        $("span.ui-icon-copy", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.copyNode()
            }
        });
        $("span.ui-icon-person", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.copyChildNodes();
                obj.uncheckAll();
            }
        });
        $("span.ui-icon-suitcase", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.cutChildNodes();
            }

        });
        $("span.ui-icon-flag", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.copyNodeAttributes()
            }
        });
        $("span.ui-icon-clipboard", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.pasteNode()
            }

        });
        $("span.ui-icon-newwin", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.pasteSpecialNode()
            }
        });
        $("span.ui-icon-cart", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.advancedClipboard()
            }
        });
        $("span.ui-icon-trash", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.deleteNode()
            }
        });
        $("span.ui-icon-carat-2-n-s", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.duplicateNode()
            }
        });
        $("span.ui-icon-circle-minus", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.deleteChildNodes()
            }
        });
        $("span.ui-icon-pencil", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.editNode()
            }
        });
        $("span.ui-icon-play", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.runCodeOnSelectedNode()
            }
        });
        $("span.ui-icon-star", nodeToolsContainerTemplate).click(function () {
            if (!$(this).hasClass("ui-state-disabled")) {
                obj.createBookmark()
            }
        });
        $("span.ui-icon-bookmark", nodeToolsContainerTemplate).click(function () {
            obj.manageBookmarks()
        });

        var position = $("#nodeListDiv", obj).position();

        if (obj.runtimeOptions.nodeToolsAlwaysShow.value) {
            nodeToolsContainerTemplate.css({
                top: position.top + 20,
                left: position.left,
                width: 10,
                "z-index": 1001
            }).show()
        } else {

            $("#leftHandControls", obj).mouseover(function () {
                nodeToolsContainerTemplate.css({
                    top: position.top + 20,
                    left: position.left,
                    width: 10,
                    "z-index": 1001
                }).show()
            });
            $("#leftHandControls", obj).mouseout(function () {
                nodeToolsContainerTemplate.hide()
            })
        }

    };

    obj.initAttributeTools = function (attr, row, owner) {
        var attributesToolsContainerTemplate = $('<div style="position:absolute; width: 10px; height: 10px;" attr="' + attr.name + '"><table style="border: 0px; margin:0px; padding: 0px;"><tr><td><span style="background-color: white; text-align:center;" title="COPY ATTRIBUTE <br/>' + attr.name + " of " + ' this NODE ' + '" class="node-tool ui-icon ui-icon-copy"></span></td><td><span style="background-color: white; text-align:center;" title="CUT ATTRIBUTE <br/>' + attr.name + " of " + " this NODE " + '" class="node-tool ui-icon ui-icon-scissors"></span></td><td><span style="background-color: white; text-align:center;" title="DELETES ATTRIBUTE <br/>' + attr.name + " of "
                // +                                                                                                                                                                                                                                                                                                                                                                                                                 'attr.ownerElement.nodeName'
                + " this NODE " + '" class="node-tool ui-icon ui-icon-trash"></span></td></tr></table></div>');

        attributesToolsContainerTemplate.appendTo($("td[attr=" + attr.name + "]", obj.nodeAttributes)).hide();
        $("span.node-tool", attributesToolsContainerTemplate).each(function () {
            $(this).mouseover(function () {
                $(this).css({
                    "background-color": "red"
                })
            }).mouseout(function () {
                $(this).css({
                    "background-color": "white"
                })
            }).addClass("ui-icon")
        });
        $("span.ui-icon-trash", attributesToolsContainerTemplate).click(function () {
            if (obj.deleteAttribute(attr.name, owner)) {
                var toDelElementParent = owner;
                $("div[attr=" + attr.name + "]", obj.nodeAttributes).replaceWith("");
                $(row).replaceWith();
                obj.showAttributes(toDelElementParent)
            }
        });
        $("span.ui-icon-copy", attributesToolsContainerTemplate).click(function () {
            obj.clipboard.push(attr.cloneNode(true));
            obj.populateAdvancedClipboardTable($("#advcliptbl", obj.advancedClipboardDialog))
        });
        $("span.ui-icon-scissors", attributesToolsContainerTemplate).click(function () {
            var toCutElementParent = owner;
            obj.clipboard.push(attr);
            $("div[attr=" + attr.name + "]", obj.nodeAttributes).replaceWith("");
            owner.removeAttributeNode(attr);
            obj.showAttributes(toCutElementParent);
            obj.populateAdvancedClipboardTable($("#advcliptbl", obj.advancedClipboardDialog))
        });
        var position = function () {
            return $(row).position()
        };
        $("td:eq(0)", row).mouseover(function () {
            attributesToolsContainerTemplate.css({
                top: position().top - attributesToolsContainerTemplate.height() + 6,
                left: position().left + $("td[attr=" + attr.name + "]", obj.nodeAttributes).width() - 60
            }).show()
        });
        $("td:eq(0)", row).mouseout(function () {
            attributesToolsContainerTemplate.hide()
        })
    };

    $(document).bind("click", function () {
        obj.setCheckedElementsTools();
        obj.setActiveElementsTools();
    });

    obj.processDataSourceCallback = function (params) {
        switch (obj.dataSource.from) {
            case "initOptions":
                var ajaxResp = $.ajax({
                    async: false,
                    url: o.serverEngine,
                    type: "POST",
                    data: ({
                        cat: "DATA_IMPORT",
                        location: o.dataSource
                    }),
                    dataType: "xml",
                    success: function (msg) {
                        obj.dataSourceContent = awsNativeDOMSerializer(msg);
                        obj.buildTree()
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("jqForms populate request " + textStatus + ":" + errorThrown + XMLHttpRequest.responseText)
                    }
                });
                break;
            case "fromEmbedXMLDOC":
                obj.dataSourceContent = awsNativeDOMSerializer(obj.xmlDoc);
                obj.buildTree();
                break;
            case "documentSource":
                obj.dataSourceContent = obj.dataSource.documentSource;
                obj.buildTree();
                break;
            case "newDocument":
                obj.dataSourceContent = "<" + obj.dataSource.newDocument + "/>";
                obj.buildTree();
                break;
            case "url":
                var ajaxResp = $.ajax({
                    async: false,
                    url: o.serverEngine,
                    type: "POST",
                    data: ({
                        cat: "DATA_IMPORT",
                        location: obj.dataSource.url
                    }),
                    dataType: "text",
                    success: function (msg) {
                        obj.dataSourceContent = msg;
                        obj.buildTree()
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("jqForms populate request " + textStatus + ":" + errorThrown + XMLHttpRequest.responseText)
                    }
                });
                break
        }
        return true
    };
    obj.on("processDataSource", function (opts) {
        var extendedOpts = opts;
        var callbackFunction = obj.processDataSourceCallback;
        var checkOK = true;
        if (obj.attr("rCheck") == "true") {
            if (!o.check("UPDATE")) {
                checkOK = false
            }
        }
        if (checkOK) {
            if (obj.beforeProcessDataSource.apply(obj)) {
                if (callbackFunction.apply(obj, [extendedOpts])) {
                    $(document).trigger({
                        type: "processDataSourceDone",
                        entityId: obj.UId
                    });
                    obj.afterProcessDataSource.apply(obj)
                }
            }
        } else {
            alert("jqForms: processDataSource not allowed")
        }
    });
    obj.processDataSource = function (opts) {
        obj.checkedStack.empty(false);
        var extendedOpts = $.extend({}, {
            type: "processDataSource"
        }, opts);
        obj.trigger(extendedOpts)
    };
    obj.saveCallback = function (params) {
        var fakeDocument = obj.root.cloneNode(true);
        if (!params.toJson) {
            var data = awsNativeDOMSerializer(fakeDocument)
        }
        ;
        var requestOptions = {
            cat: "SAVE_FILE_FROM_POST",
            location: params.fileName,
            namespaceFix: (obj.runtimeOptions.namespaceFix.value == "checked" ? "true" : "false"),
            usethisstylesheet: obj.runtimeOptions.usethisstylesheet.value
        };
        $.ajax({
            async: false,
            url: o.serverEngine + "?" + $.param(requestOptions),
            type: "POST",
            data: data,
            contentType: "text/xml",
            cache: false,
            dataType: "xml",
            success: function (msg) {
                console.log("Saving document status: " + msg.documentElement.textContent);
                alert(msg.documentElement.textContent);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("jqForms populate request " + textStatus + ":" + errorThrown + XMLHttpRequest.responseText)
            }
        });
        return true
    };
    obj.on("save", function (opts) {
        var extendedOpts = opts;
        var callbackFunction = obj.saveCallback;
        var checkOK = true;
        if (obj.attr("rCheck") == "true") {
            if (!o.check("SAVE")) {
                checkOK = false
            }
        }
        if (checkOK) {
            if (obj.beforeSave.apply(obj)) {
                if (callbackFunction.apply(obj, [extendedOpts])) {
                    $(document).trigger({
                        type: "savedone",
                        entityId: obj.UId
                    });
                    obj.afterSave.apply(obj)
                }
            }
        } else {
            alert("jqForms: Save not allowed")
        }
    });
    obj.save = function (opts) {
        var extendedOpts = $.extend({}, {
            type: "save"
        }, opts);
        obj.trigger(extendedOpts)
    };
    obj.deleteCallback = function (params) {
        var xmldocEq = obj.activeInXmlDoc().get(0);
        if (xmldocEq != obj.root) {
            xmldocEq.parentNode.removeChild(xmldocEq);
            obj.tree.kvaTree.DeleteNode(params.which)
        } else {
            alert("You cannot delete root element of the document")
        }
        return true
    };
    obj.bind("delete", function (opts) {
        var extendedOpts = opts;
        var callbackFunction = obj.deleteCallback;
        var checkOK = true;
        if (obj.attr("rCheck") == "true") {
            if (!o.check("DELETE")) {
                checkOK = false
            }
        }
        if (checkOK) {
            if (obj.beforeDelete.apply(obj, [extendedOpts])) {
                if (callbackFunction.apply(obj, [extendedOpts])) {
                    $(document).trigger({
                        type: "deletedone",
                        entityId: obj.UId
                    });
                    obj.afterDelete.apply(obj)
                }
            }
        } else {
            alert("jqForms: DELETE not allowed")
        }
    });
    obj.del = function (opts) {
        var extendedOpts = $.extend({}, {
            type: "delete"
        }, opts);
        obj.trigger(extendedOpts)
    };
    obj.insertCallback = function (params) {
        switch (params.where) {
            case "before":
                params.active.insertBefore(params.thisOne, params.before);
                break;
            case "after":
                params.active.insertBefore(params.thisOne, params.before.nextSibling);
                break;
            default:
                if (params.how == "append") {
                    $(params.active).append(params.thisOne)
                }
                if (params.how == "prepend") {
                    $(params.active).prepend(params.thisOne)
                }
                if (params.how == "html") {
                    $(params.active).html(params.thisOne)
                }
                break
        }
        return true
    };
    obj.bind("insert", function (opts) {
        var extendedOpts = opts;
        var callbackFunction = obj.insertCallback;
        var checkOK = true;
        if (obj.attr("rCheck") == "true") {
            if (!o.check("INSERT")) {
                checkOK = false
            }
        }
        if (checkOK) {
            if (obj.beforeInsert.apply(obj, [extendedOpts])) {
                if (callbackFunction.apply(obj, [extendedOpts])) {
                    $(document).trigger({
                        type: "insertdone",
                        entityId: obj.UId
                    });
                    obj.afterInsert.apply(obj, [extendedOpts])
                }
            }
        } else {
            alert("jqForms: INSERT not allowed")
        }
    });
    obj.insert = function (opts) {
        var extendedOpts = $.extend({}, {
            type: "insert"
        }, opts);
        obj.trigger(extendedOpts)
    };
    obj.updateCallback = function (params) {
        if (obj.dataSourceInitialized) {
            var treeElem = params.which;
            var toPopulate = treeElem.children("ul:eq(0)");
            var elemFromSource = treeElem.get(0).documentRef;
            if (elemFromSource instanceof Node && typeof elemFromSource.hasChildNodes == "function" && elemFromSource.hasChildNodes()) {
                $(elemFromSource.childNodes).each(function () {
                    switch (this.nodeType) {
                        case 1:
                            var name = (this.hasAttribute(obj.runtimeOptions.showThisAttributeInsteadTreeNodeName.value) && this.getAttribute(obj.o.showThisAttributeInsteadTreeNodeName) != "" ? this.getAttribute(obj.runtimeOptions.showThisAttributeInsteadTreeNodeName.value) : this.nodeName);
                            var type = (this.hasChildNodes() ? "node" : "leaf");
                            break;
                        default:
                            var name = this.nodeName;
                            var type = "leaf";
                            break
                    }
                    if (o.treeDisplayFilter(this)) {
                        if (obj.runtimeOptions.showDOMElementsOnly.value) {
                            if (this.nodeType == 1) {
                                obj.tree.kvaTree.AddNodeTo(name, type, this)
                            }
                        } else {
                            obj.tree.kvaTree.AddNodeTo(name, type, this)
                        }
                    }
                })
            }
        }
        return true
    };
    obj.on("populate", function (opts) {
        var extendedOpts = opts;
        var callbackFunction = obj.updateCallback;
        var checkOK = true;
        if (obj.attr("rCheck") == "true") {
            if (!o.check("UPDATE")) {
                checkOK = false
            }
        }
        if (checkOK) {
            if (obj.beforeUpdate.apply(obj)) {
                if (callbackFunction.apply(obj, [extendedOpts])) {
                    $(document).trigger({
                        type: "populatedone",
                        entityId: obj.UId
                    });
                    obj.afterUpdate.apply(obj)
                }
            }
        } else {
            alert("jqForms: UPDATE not allowed")
        }
    });
    obj.update = function (opts) {
        var extendedOpts = $.extend({}, {
            type: "populate"
        }, opts);
        obj.trigger(extendedOpts)
    };
    if (o.autoinit) {
        obj.init()
    }
    if (o.alterDOM) {
        $.extend(DOMObj, {
            jqf: obj,
            UID: obj.UId
        })
    }
    return this
};
