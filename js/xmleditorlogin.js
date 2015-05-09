/*

 XMS - Online Web Development

 Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 Licensed under GPL license.
 http://www.aws-dms.com

 Date: 2010-10-24
*/
$(document).ready(function(){$.fn.xmleditorlogin=function(e){this.defaults={retries:3,modOpt:{close:!1,containerCss:{height:"30px",width:"300px",border:"0px"}},inputFormsContainer:"#inputFormsContainer",userContainer:"tr:eq(0)",passContainer:"tr:eq(1)",accessGranted:"#allowed",accessDenied:"#denied",user:"#user",pass:"#pass"};var a=this.o=$.extend({},this.defaults,e),f=0;e=$(a.inputFormsContainer,this);$(a.userContainer,e);$(a.userContainer,this);var h=$(a.accessGranted,this),k=$(a.accessDenied,this),
b=$(a.user,this),c=$(a.pass,this),g="",l=function(a){a=$.extend({},{user:b.val(),pass:a},{cat:"LOGIN"});$.ajax({url:"xmlserver.php",type:"POST",async:!1,cache:!1,data:a,dataType:"text",success:function(a){g=a},error:function(a,b,c){alert(b)}});if("allowed"==$("login",g).html())return!0;alert($("login",g).html());f+=1;return!1},m=function(){h.show();setTimeout(function(){window.location.reload()},1E3)},d=function(){h.hide();k.hide();b.val("");c.val("");b.trigger("focus")};b.bind("keyup","return",function(){c.trigger("focus")}).bind("keyup",
"esc",d);c.bind("keyup","return",function(){f<=a.retries-1?l(c.val())?m():d():k.show()}).bind("keyup","esc",d);this.init=function(){b.trigger("focus");d()};this.init();return this};$("#inForm").xmleditorlogin()});
