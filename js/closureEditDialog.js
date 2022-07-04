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

/*EXEMPLU INITIALIZARE
$("<div/>").closureEditDialog(directions.get(which).polylineOptions, {
autoOpen : true,
showType : true,
close : function() {
directions.get(which).polylineOptions = this.closure;
directions.get(which).poly.setOptions(this.closure);
},
constraints : {
strokeOpacity : 0.5,
strokeColor : function(userVal) {
var predefColors = {
"red" : true,
"green" : true,
"blue" : true,
"yellow" : true
};

if ( userVal in predefColors)
return userVal;
else {
alert(userVal + " color not in list");
return "red";
}
},
strokeWeight : function(userVal) {
if (userVal > 2 && userVal < 5)
return userVal;
else {
alert("2<val<5");
return 3;
}
}
},
blacklist : function(key) {
var list = {
map : false,
path : false
};

if (list.hasOwnProperty(key))
return list[key];
else
return true;
}
});

* */

//cu json nativ nu pot sa afisez tot - swith de la al meu la nativ
$.fn.closureEditDialog = function(closure, o) {
	var obj = this.get(0);

	if (closure == null)
		closure = obj.marker.customDetails;

	var dialog = this;

	obj.defaults = {
		autoOpen : false,
		width : $(window).width() * 0.3,
		maxHeight : $(window).height() * 0.9,
		create : function() {
			obj.objectToTable.apply(this, [closure]);
		},
		open : function() {
			obj.objectToTable.apply(this, [closure]);
		},
		buttons : {
			"Add property" : function() {
				var key = prompt("Name");
				if (obj.options.blacklist(key) === true) {
					var val = confirm('Single Value (OK) or List ["",""] (Cancel)?') ? "" : [];

					Object.defineProperty(closure, key, {
						enumerable : true,
						configurable : true,
						writable : true,
						value : val
					});
					dialog.trigger("MARKER_CUSTOM_DETAILS_CHANGED");
				} else
					alert("Not allowed to create such property: " + key);
			}
		},
		blacklist : function(key) {
			return true;
		},
		types : function(key) {
			var ar = this;
			return typeOf(ar[key]);
		},
		constraints : {},
		showType : false
	}

	obj.options = $.extend({}, obj.defaults, o);

	dialog.markerDetailsEditDialog_valueToTR = function(key, val, doc) {
		var ar = this;
		var tr = doc.createElement("tr");
		var td1 = doc.createElement("td");
		var td2 = doc.createElement("td");
		var td3 = doc.createElement("td");
		if (obj.options.showType)
			var td4 = doc.createElement("td");

		var delControl = doc.createElement("span");
		delControl.setAttribute("class", "ui-icon ui-icon-trash");
		delControl.style.display = "display: inline-block;";

		td3.appendChild(delControl);
		td2.style.align = "center";
		var input = doc.createElement("input");
		input.setAttribute("type", "text");
		input.style.textAlign = "center";
		input.size = "40";
		input.ref = val;

		tr.appendChild(td1);
		tr.appendChild(td2);
		if (obj.options.showType)
			tr.appendChild(td4);
		tr.appendChild(td3);

		var content;
		//console.log(key + " = " + ar[key] + " typeOf = " + typeOf(ar[key]));
		var typeOfVal = obj.options.types.apply(ar, [key]);

		if (obj.options.showType)
			td4.appendChild(td4.ownerDocument.createTextNode(typeOfVal + (typeOfVal == "Array" ? "(" + ar[key].length + ")" : "")));

		if (typeOfVal == "String" && !isNaN(ar[key]))
			typeOfVal = "Number";

		input.valType = typeOfVal;

		switch (typeOfVal) {
		case "Array":
		case "Object":
			if (typeOf(val) == "Object" || typeOf(val) == "Array")
				content = JSON.stringify(val);
			break;
		case "Function":
			content = val;
			break;
		case "String":
			content = val;
			break;
		case "Number":
			content = val;
			break;
		case "Boolean":
			content = val;
			input.setAttribute("type", "checkbox");
			input.checked = Boolean(val);
			break;
		}

		input.valType = typeOfVal;

		td1.appendChild(doc.createTextNode(key));
		td2.appendChild(input);
		input.setAttribute("value", content);

		delControl.onclick = function() {
			if (confirm("Delete property " + key + " ?"))
				if (ar[key] == val) {
					delete ar[key];
					dialog.trigger("MARKER_CUSTOM_DETAILS_CHANGED");
				}
		}

		input.onchange = function() {
			var val = $(this).val();
			var typeOfVal = this.valType;

			switch (typeOfVal) {
			case "Array":
			case "Object":
				val = JSON.parse(val);
				break;
			case "Function":
				val = val;
				break;
			case "String":
				val = val;
				break;
			case "Boolean":
				val = $(this).is(":checked") ? true : false;
				break;
			case "Number":
				val = Number(val);
				break;
			}
			ar[key] = obj.getValueFromConstraints(key, val);
		}
		return tr;
	}
	//se apeleaza cu apply si this este referinta catre un nod html care sa contina tabelul
	obj.objectToTable = function(objRef) {
		obj.closure = objRef;
		$(this).empty();
		var table = obj.ownerDocument.createElement("table");
		table.style.width = "100%";

		if ( typeof objRef == "object") {
			for (var key in objRef) {
				if (obj.options.blacklist(key) === true) {
					var content = dialog.markerDetailsEditDialog_valueToTR.apply(objRef, [key, objRef[key], obj.ownerDocument]);
					table.appendChild(content);
				}
			}

			dialog.append(table);
		}
		$(this).find("tr:even").addClass("ui-state-active");
	}

	obj.hasConstraints = function(key) {
		if (obj.options.constraints.hasOwnProperty(key))
			return true;
		else
			return false;
	}

	obj.getConstraints = function(key) {
		if (obj.options.constraints.hasOwnProperty(key))
			return obj.options.constraints[key];
		else
			return false;
	}

	obj.getValueFromConstraints = function(key, userVal) {
		if (obj.hasConstraints(key)) {
			var constr = obj.getConstraints(key);
			if ( typeof constr == "function")
				return constr(userVal);
			else
				return constr;
		} else
			return userVal;
	}

	dialog.on("MARKER_CUSTOM_DETAILS_CHANGED", function() {
		obj.objectToTable.apply(this, [closure]);
	});

	return this.dialog(obj.options);
}

$.fn.closureEditor = function(closure, o) {
	var obj = this.get(0);

	if (closure == null)
		closure = obj.marker.customDetails;

	var dialog = this;

	obj.defaults = {
		autoOpen : false,
		width : $(window).width() * 0.3,
		maxHeight : $(window).height() * 0.9,

		buttons : {
			"Add property" : function() {
				var obj = this;
				var key = prompt("Name");
				if (obj.options.blacklist(key) === true) {
					var val = confirm('Single Value (OK) or List ["",""] (Cancel)?') ? "" : [];

					Object.defineProperty(closure, key, {
						enumerable : true,
						configurable : true,
						writable : true,
						value : val
					});
					dialog.trigger("MARKER_CUSTOM_DETAILS_CHANGED");
				} else
					alert("Not allowed to create such property: " + key);
			}
		},
		blacklist : function(key) {
			return true;
		},
		types : function(key) {
			var ar = this;
			return typeOf(ar[key]);
		},
		constraints : {},
		showType : false
	}

	obj.options = $.extend({}, obj.defaults, o);

	obj.addButton = function(buttonName, attacheBFunction) {
		var button = obj.ownerDocument.createElement("button");
		button.textContent = buttonName;
		obj.buttonsPanel.appendChild(button);

		$(button).click(function() {
			attacheBFunction.apply(obj, []);
		});
	}
	
	dialog.append('<div id="closureEditorContainer"/><div id="closureEditorContainer_buttonsPanel"/>');
	obj.container = dialog.find("#closureEditorContainer").get(0);
	obj.buttonsPanel = dialog.find("#closureEditorContainer_buttonsPanel").get(0);

	for (var buttonName in obj.options.buttons)
	obj.addButton(buttonName, obj.options.buttons[buttonName]);

	dialog.markerDetailsEditDialog_valueToTR = function(key, val, doc) {
		var ar = this;
		var tr = doc.createElement("tr");
		var td1 = doc.createElement("td");
		var td2 = doc.createElement("td");
		var td3 = doc.createElement("td");
		if (obj.options.showType)
			var td4 = doc.createElement("td");

		var delControl = doc.createElement("span");
		delControl.setAttribute("class", "ui-icon ui-icon-trash");
		delControl.style.display = "display: inline-block;";

		td3.appendChild(delControl);
		td2.style.align = "center";
		var input = doc.createElement("input");
		input.setAttribute("type", "text");
		input.style.textAlign = "center";
		input.size = "40";
		input.ref = val;

		tr.appendChild(td1);
		tr.appendChild(td2);
		if (obj.options.showType)
			tr.appendChild(td4);
		tr.appendChild(td3);

		var content;
		//console.log(key + " = " + ar[key] + " typeOf = " + typeOf(ar[key]));
		var typeOfVal = obj.options.types.apply(ar, [key]);

		if (obj.options.showType)
			td4.appendChild(td4.ownerDocument.createTextNode(typeOfVal + (typeOfVal == "Array" ? "(" + ar[key].length + ")" : "")));

		if (typeOfVal == "String" && !isNaN(ar[key]))
			typeOfVal = "Number";

		input.valType = typeOfVal;

		switch (typeOfVal) {
		case "Array":
		case "Object":
			if (typeOf(val) == "Object" || typeOf(val) == "Array")
				content = JSON.stringify(val);
			break;
		case "Function":
			content = val;
			break;
		case "String":
			content = val;
			break;
		case "Number":
			content = val;
			break;
		case "Boolean":
			content = val;
			input.setAttribute("type", "checkbox");
			input.checked = Boolean(val);
			break;
		}

		input.valType = typeOfVal;

		td1.appendChild(doc.createTextNode(key));
		td2.appendChild(input);
		input.setAttribute("value", content);

		delControl.onclick = function() {
			if (confirm("Delete property " + key + " ?"))
				if (ar[key] == val) {
					delete ar[key];
					dialog.trigger("MARKER_CUSTOM_DETAILS_CHANGED");
				}
		}

		input.onchange = function() {
			var val = $(this).val();
			var typeOfVal = this.valType;

			switch (typeOfVal) {
			case "Array":
			case "Object":
				val = JSON.parse(val);
				break;
			case "Function":
				val = val;
				break;
			case "String":
				val = val;
				break;
			case "Boolean":
				val = $(this).is(":checked") ? true : false;
				break;
			case "Number":
				val = Number(val);
				break;
			}
			ar[key] = obj.getValueFromConstraints(key, val);
		}
		return tr;
	}
	//se apeleaza cu apply si this este referinta catre un nod html care sa contina tabelul
	obj.objectToTable = function(objRef) {
		obj.closure = objRef;
		var container = this.get(0).container;
		$(container).empty();
		var table = obj.ownerDocument.createElement("table");
		table.style.width = "100%";

		if ( typeof objRef == "object") {
			for (var key in objRef) {
				if (obj.options.blacklist(key) === true) {
					var content = dialog.markerDetailsEditDialog_valueToTR.apply(objRef, [key, objRef[key], obj.ownerDocument]);
					table.appendChild(content);
				}
			}

			container.appendChild(table);
		}
		$(this).find("tr:even").addClass("ui-state-active");
	}

	obj.hasConstraints = function(key) {
		if (obj.options.constraints.hasOwnProperty(key))
			return true;
		else
			return false;
	}

	obj.getConstraints = function(key) {
		if (obj.options.constraints.hasOwnProperty(key))
			return obj.options.constraints[key];
		else
			return false;
	}

	obj.getValueFromConstraints = function(key, userVal) {
		if (obj.hasConstraints(key)) {
			var constr = obj.getConstraints(key);
			if ( typeof constr == "function")
				return constr(userVal);
			else
				return constr;
		} else
			return userVal;
	}

	dialog.on("MARKER_CUSTOM_DETAILS_CHANGED", function() {
		obj.objectToTable.apply(dialog, [closure]);
	});

	obj.objectToTable.apply(dialog, [closure]);

	return this;
}
