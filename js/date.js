/*

 XMS - Online Web Development

 Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 Licensed under GPL license.
 http://www.aws-dms.com

 Date: 2010-10-24
*/
Date.CultureInfo={name:"en-US",englishName:"English (United States)",nativeName:"English (United States)",dayNames:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),abbreviatedDayNames:"Sun Mon Tue Wed Thu Fri Sat".split(" "),shortestDayNames:"Su Mo Tu We Th Fr Sa".split(" "),firstLetterDayNames:"SMTWTFS".split(""),monthNames:"January February March April May June July August September October November December".split(" "),abbreviatedMonthNames:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
amDesignator:"AM",pmDesignator:"PM",firstDayOfWeek:0,twoDigitYearMax:2029,dateElementOrder:"mdy",formatPatterns:{shortDate:"M/d/yyyy",longDate:"dddd, MMMM dd, yyyy",shortTime:"h:mm tt",longTime:"h:mm:ss tt",fullDateTime:"dddd, MMMM dd, yyyy h:mm:ss tt",sortableDateTime:"yyyy-MM-ddTHH:mm:ss",universalSortableDateTime:"yyyy-MM-dd HH:mm:ssZ",rfc1123:"ddd, dd MMM yyyy HH:mm:ss GMT",monthDay:"MMMM dd",yearMonth:"MMMM, yyyy"},regexPatterns:{jan:/^jan(uary)?/i,feb:/^feb(ruary)?/i,mar:/^mar(ch)?/i,apr:/^apr(il)?/i,
may:/^may/i,jun:/^jun(e)?/i,jul:/^jul(y)?/i,aug:/^aug(ust)?/i,sep:/^sep(t(ember)?)?/i,oct:/^oct(ober)?/i,nov:/^nov(ember)?/i,dec:/^dec(ember)?/i,sun:/^su(n(day)?)?/i,mon:/^mo(n(day)?)?/i,tue:/^tu(e(s(day)?)?)?/i,wed:/^we(d(nesday)?)?/i,thu:/^th(u(r(s(day)?)?)?)?/i,fri:/^fr(i(day)?)?/i,sat:/^sa(t(urday)?)?/i,future:/^next/i,past:/^last|past|prev(ious)?/i,add:/^(\+|after|from)/i,subtract:/^(\-|before|ago)/i,yesterday:/^yesterday/i,today:/^t(oday)?/i,tomorrow:/^tomorrow/i,now:/^n(ow)?/i,millisecond:/^ms|milli(second)?s?/i,
second:/^sec(ond)?s?/i,minute:/^min(ute)?s?/i,hour:/^h(ou)?rs?/i,week:/^w(ee)?k/i,month:/^m(o(nth)?s?)?/i,day:/^d(ays?)?/i,year:/^y((ea)?rs?)?/i,shortMeridian:/^(a|p)/i,longMeridian:/^(a\.?m?\.?|p\.?m?\.?)/i,timezone:/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i,ordinalSuffix:/^\s*(st|nd|rd|th)/i,timeContext:/^\s*(\:|a|p)/i},abbreviatedTimeZoneStandard:{GMT:"-000",EST:"-0400",CST:"-0500",MST:"-0600",PST:"-0700"},abbreviatedTimeZoneDST:{GMT:"-000",EDT:"-0500",CDT:"-0600",
MDT:"-0700",PDT:"-0800"}};Date.getMonthNumberFromName=function(a){var b=Date.CultureInfo.monthNames,c=Date.CultureInfo.abbreviatedMonthNames;a=a.toLowerCase();for(var d=0;d<b.length;d++)if(b[d].toLowerCase()==a||c[d].toLowerCase()==a)return d;return-1};Date.getDayNumberFromName=function(a){var b=Date.CultureInfo.dayNames,c=Date.CultureInfo.abbreviatedDayNames;a=a.toLowerCase();for(var d=0;d<b.length;d++)if(b[d].toLowerCase()==a||c[d].toLowerCase()==a)return d;return-1};
Date.isLeapYear=function(a){return 0===a%4&&0!==a%100||0===a%400};Date.getDaysInMonth=function(a,b){return[31,Date.isLeapYear(a)?29:28,31,30,31,30,31,31,30,31,30,31][b]};Date.getTimezoneOffset=function(a,b){return b?Date.CultureInfo.abbreviatedTimeZoneDST[a.toUpperCase()]:Date.CultureInfo.abbreviatedTimeZoneStandard[a.toUpperCase()]};
Date.getTimezoneAbbreviation=function(a,b){var c=b?Date.CultureInfo.abbreviatedTimeZoneDST:Date.CultureInfo.abbreviatedTimeZoneStandard,d;for(d in c)if(c[d]===a)return d;return null};Date.prototype.clone=function(){return new Date(this.getTime())};Date.prototype.compareTo=function(a){if(isNaN(this))throw Error(this);if(a instanceof Date&&!isNaN(a))return this>a?1:this<a?-1:0;throw new TypeError(a);};Date.prototype.equals=function(a){return 0===this.compareTo(a)};
Date.prototype.between=function(a,b){var c=this.getTime();return c>=a.getTime()&&c<=b.getTime()};Date.prototype.addMilliseconds=function(a){this.setMilliseconds(this.getMilliseconds()+a);return this};Date.prototype.addSeconds=function(a){return this.addMilliseconds(1E3*a)};Date.prototype.addMinutes=function(a){return this.addMilliseconds(6E4*a)};Date.prototype.addHours=function(a){return this.addMilliseconds(36E5*a)};Date.prototype.addDays=function(a){return this.addMilliseconds(864E5*a)};
Date.prototype.addWeeks=function(a){return this.addMilliseconds(6048E5*a)};Date.prototype.addMonths=function(a){var b=this.getDate();this.setDate(1);this.setMonth(this.getMonth()+a);this.setDate(Math.min(b,this.getDaysInMonth()));return this};Date.prototype.addYears=function(a){return this.addMonths(12*a)};
Date.prototype.add=function(a){if("number"==typeof a)return this._orient=a,this;(a.millisecond||a.milliseconds)&&this.addMilliseconds(a.millisecond||a.milliseconds);(a.second||a.seconds)&&this.addSeconds(a.second||a.seconds);(a.minute||a.minutes)&&this.addMinutes(a.minute||a.minutes);(a.hour||a.hours)&&this.addHours(a.hour||a.hours);(a.month||a.months)&&this.addMonths(a.month||a.months);(a.year||a.years)&&this.addYears(a.year||a.years);(a.day||a.days)&&this.addDays(a.day||a.days);return this};
Date._validate=function(a,b,c,d){if("number"!=typeof a)throw new TypeError(a+" is not a Number.");if(a<b||a>c)throw new RangeError(a+" is not a valid value for "+d+".");return!0};Date.validateMillisecond=function(a){return Date._validate(a,0,999,"milliseconds")};Date.validateSecond=function(a){return Date._validate(a,0,59,"seconds")};Date.validateMinute=function(a){return Date._validate(a,0,59,"minutes")};Date.validateHour=function(a){return Date._validate(a,0,23,"hours")};
Date.validateDay=function(a,b,c){return Date._validate(a,1,Date.getDaysInMonth(b,c),"days")};Date.validateMonth=function(a){return Date._validate(a,0,11,"months")};Date.validateYear=function(a){return Date._validate(a,1,9999,"seconds")};
Date.prototype.set=function(a){a.millisecond||0===a.millisecond||(a.millisecond=-1);a.second||0===a.second||(a.second=-1);a.minute||0===a.minute||(a.minute=-1);a.hour||0===a.hour||(a.hour=-1);a.day||0===a.day||(a.day=-1);a.month||0===a.month||(a.month=-1);a.year||0===a.year||(a.year=-1);-1!=a.millisecond&&Date.validateMillisecond(a.millisecond)&&this.addMilliseconds(a.millisecond-this.getMilliseconds());-1!=a.second&&Date.validateSecond(a.second)&&this.addSeconds(a.second-this.getSeconds());-1!=a.minute&&
Date.validateMinute(a.minute)&&this.addMinutes(a.minute-this.getMinutes());-1!=a.hour&&Date.validateHour(a.hour)&&this.addHours(a.hour-this.getHours());-1!==a.month&&Date.validateMonth(a.month)&&this.addMonths(a.month-this.getMonth());-1!=a.year&&Date.validateYear(a.year)&&this.addYears(a.year-this.getFullYear());-1!=a.day&&Date.validateDay(a.day,this.getFullYear(),this.getMonth())&&this.addDays(a.day-this.getDate());a.timezone&&this.setTimezone(a.timezone);a.timezoneOffset&&this.setTimezoneOffset(a.timezoneOffset);
return this};Date.prototype.clearTime=function(){this.setHours(0);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);return this};Date.prototype.isLeapYear=function(){var a=this.getFullYear();return 0===a%4&&0!==a%100||0===a%400};Date.prototype.isWeekday=function(){return!(this.is().sat()||this.is().sun())};Date.prototype.getDaysInMonth=function(){return Date.getDaysInMonth(this.getFullYear(),this.getMonth())};Date.prototype.moveToFirstDayOfMonth=function(){return this.set({day:1})};
Date.prototype.moveToLastDayOfMonth=function(){return this.set({day:this.getDaysInMonth()})};Date.prototype.moveToDayOfWeek=function(a,b){var c=(a-this.getDay()+7*(b||1))%7;return this.addDays(0===c?c+7*(b||1):c)};Date.prototype.moveToMonth=function(a,b){var c=(a-this.getMonth()+12*(b||1))%12;return this.addMonths(0===c?c+12*(b||1):c)};Date.prototype.getDayOfYear=function(){return Math.floor((this-new Date(this.getFullYear(),0,1))/864E5)};
Date.prototype.getWeekOfYear=function(a){var b=this.getFullYear(),c=this.getMonth(),d=this.getDate();a=a||Date.CultureInfo.firstDayOfWeek;var e=8-(new Date(b,0,1)).getDay();8==e&&(e=1);c=(Date.UTC(b,c,d,0,0,0)-Date.UTC(b,0,1,0,0,0))/864E5+1;c=Math.floor((c-e+7)/7);c===a&&(b--,b=8-(new Date(b,0,1)).getDay(),c=2==b||8==b?53:52);return c};Date.prototype.isDST=function(){console.log("isDST");return"D"==this.toString().match(/(E|C|M|P)(S|D)T/)[2]};
Date.prototype.getTimezone=function(){return Date.getTimezoneAbbreviation(this.getUTCOffset,this.isDST())};Date.prototype.setTimezoneOffset=function(a){var b=this.getTimezoneOffset();this.addMinutes(-6*Number(a)/10-b);return this};Date.prototype.setTimezone=function(a){return this.setTimezoneOffset(Date.getTimezoneOffset(a))};Date.prototype.getUTCOffset=function(){var a=-10*this.getTimezoneOffset()/6;if(0>a)return a=(a-1E4).toString(),a[0]+a.substr(2);a=(a+1E4).toString();return"+"+a.substr(1)};
Date.prototype.getDayName=function(a){return a?Date.CultureInfo.abbreviatedDayNames[this.getDay()]:Date.CultureInfo.dayNames[this.getDay()]};Date.prototype.getMonthName=function(a){return a?Date.CultureInfo.abbreviatedMonthNames[this.getMonth()]:Date.CultureInfo.monthNames[this.getMonth()]};Date.prototype._toString=Date.prototype.toString;
Date.prototype.toString=function(a){var b=this,c=function(a){return 1==a.toString().length?"0"+a:a};return a?a.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g,function(a){switch(a){case "hh":return c(13>b.getHours()?b.getHours():b.getHours()-12);case "h":return 13>b.getHours()?b.getHours():b.getHours()-12;case "HH":return c(b.getHours());case "H":return b.getHours();case "mm":return c(b.getMinutes());case "m":return b.getMinutes();case "ss":return c(b.getSeconds());case "s":return b.getSeconds();
case "yyyy":return b.getFullYear();case "yy":return b.getFullYear().toString().substring(2,4);case "dddd":return b.getDayName();case "ddd":return b.getDayName(!0);case "dd":return c(b.getDate());case "d":return b.getDate().toString();case "MMMM":return b.getMonthName();case "MMM":return b.getMonthName(!0);case "MM":return c(b.getMonth()+1);case "M":return b.getMonth()+1;case "t":return 12>b.getHours()?Date.CultureInfo.amDesignator.substring(0,1):Date.CultureInfo.pmDesignator.substring(0,1);case "tt":return 12>
b.getHours()?Date.CultureInfo.amDesignator:Date.CultureInfo.pmDesignator;case "zzz":case "zz":case "z":return""}}):this._toString()};Date.now=function(){return new Date};Date.today=function(){return Date.now().clearTime()};Date.prototype._orient=1;Date.prototype.next=function(){this._orient=1;return this};Date.prototype.last=Date.prototype.prev=Date.prototype.previous=function(){this._orient=-1;return this};Date.prototype._is=!1;Date.prototype.is=function(){this._is=!0;return this};
Number.prototype._dateElement="day";Number.prototype.fromNow=function(){var a={};a[this._dateElement]=this;return Date.now().add(a)};Number.prototype.ago=function(){var a={};a[this._dateElement]=-1*this;return Date.now().add(a)};
(function(){for(var a=Date.prototype,b=Number.prototype,c="sunday monday tuesday wednesday thursday friday saturday".split(/\s/),d="january february march april may june july august september october november december".split(/\s/),e="Millisecond Second Minute Hour Day Week Month Year".split(/\s/),p=function(a){return function(){return this._is?(this._is=!1,this.getDay()==a):this.moveToDayOfWeek(a,this._orient)}},l=0;l<c.length;l++)a[c[l]]=a[c[l].substring(0,3)]=p(l);c=function(a){return function(){return this._is?
(this._is=!1,this.getMonth()===a):this.moveToMonth(a,this._orient)}};for(p=0;p<d.length;p++)a[d[p]]=a[d[p].substring(0,3)]=c(p);c=function(a){return function(){"s"!=a.substring(a.length-1)&&(a+="s");return this["add"+a](this._orient)}};p=function(a){return function(){this._dateElement=a;return this}};for(l=0;l<e.length;l++)d=e[l].toLowerCase(),a[d]=a[d+"s"]=c(e[l]),b[d]=b[d+"s"]=p(d)})();Date.prototype.toJSONString=function(){return this.toString("yyyy-MM-ddThh:mm:ssZ")};
Date.prototype.toShortDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortDatePattern)};Date.prototype.toLongDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.longDatePattern)};Date.prototype.toShortTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortTimePattern)};Date.prototype.toLongTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.longTimePattern)};
Date.prototype.getOrdinal=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th"}};
(function(){Date.Parsing={Exception:function(a){this.message="Parse error at '"+a.substring(0,10)+" ...'"}};for(var a=Date.Parsing,b=a.Operators={rtoken:function(b){return function(c){var k=c.match(b);if(k)return[k[0],c.substring(k[0].length)];throw new a.Exception(c);}},token:function(a){return function(a){return b.rtoken(new RegExp("^s*"+a+"s*"))(a)}},stoken:function(a){return b.rtoken(new RegExp("^"+a))},until:function(a){return function(b){for(var c=[],f=null;b.length;){try{f=a.call(this,b)}catch(g){c.push(f[0]);
b=f[1];continue}break}return[c,b]}},many:function(a){return function(b){for(var c=[],f=null;b.length;){try{f=a.call(this,b)}catch(g){break}c.push(f[0]);b=f[1]}return[c,b]}},optional:function(a){return function(b){var c=null;try{c=a.call(this,b)}catch(f){return[null,b]}return[c[0],c[1]]}},not:function(b){return function(c){try{b.call(this,c)}catch(d){return[null,c]}throw new a.Exception(c);}},ignore:function(a){return a?function(b){var c=null,c=a.call(this,b);return[null,c[1]]}:null},product:function(){for(var a=
arguments[0],c=Array.prototype.slice.call(arguments,1),d=[],f=0;f<a.length;f++)d.push(b.each(a[f],c));return d},cache:function(b){var c={},d=null;return function(f){try{d=c[f]=c[f]||b.call(this,f)}catch(g){d=c[f]=g}if(d instanceof a.Exception)throw d;return d}},any:function(){var b=arguments;return function(c){for(var d=null,f=0;f<b.length;f++)if(null!=b[f]){try{d=b[f].call(this,c)}catch(g){d=null}if(d)return d}throw new a.Exception(c);}},each:function(){var b=arguments;return function(c){for(var d=
[],f=null,g=0;g<b.length;g++)if(null!=b[g]){try{f=b[g].call(this,c)}catch(m){throw new a.Exception(c);}d.push(f[0]);c=f[1]}return[d,c]}},all:function(){var a=a;return a.each(a.optional(arguments))},sequence:function(c,d,k){d=d||b.rtoken(/^\s*/);k=k||null;return 1==c.length?c[0]:function(b){for(var g=null,m=null,e=[],h=0;h<c.length;h++){try{g=c[h].call(this,b)}catch(n){break}e.push(g[0]);try{m=d.call(this,g[1])}catch(q){m=null;break}b=m[1]}if(!g)throw new a.Exception(b);if(m)throw new a.Exception(m[1]);
if(k)try{g=k.call(this,g[1])}catch(t){throw new a.Exception(g[1]);}return[e,g?g[1]:b]}},between:function(a,c,d){d=d||a;var f=b.each(b.ignore(a),c,b.ignore(d));return function(a){a=f.call(this,a);return[[a[0][0],r[0][2]],a[1]]}},list:function(a,c,d){c=c||b.rtoken(/^\s*/);d=d||null;return a instanceof Array?b.each(b.product(a.slice(0,-1),b.ignore(c)),a.slice(-1),b.ignore(d)):b.each(b.many(b.each(a,b.ignore(c))),px,b.ignore(d))},set:function(c,d,k){d=d||b.rtoken(/^\s*/);k=k||null;return function(f){for(var g=
null,m=g=null,e=null,h=[[],f],n=!1,q=0;q<c.length;q++){g=m=null;n=1==c.length;try{g=c[q].call(this,f)}catch(t){continue}e=[[g[0]],g[1]];if(0<g[1].length&&!n)try{m=d.call(this,g[1])}catch(u){n=!0}else n=!0;n||0!==m[1].length||(n=!0);if(!n){g=[];for(n=0;n<c.length;n++)q!=n&&g.push(c[n]);g=b.set(g,d).call(this,m[1]);0<g[0].length&&(e[0]=e[0].concat(g[0]),e[1]=g[1])}e[1].length<h[1].length&&(h=e);if(0===h[1].length)break}if(0===h[0].length)return h;if(k){try{m=k.call(this,h[1])}catch(v){throw new a.Exception(h[1]);
}h[1]=m[1]}return h}},forward:function(a,b){return function(c){return a[b].call(this,c)}},replace:function(a,b){return function(c){c=a.call(this,c);return[b,c[1]]}},process:function(a,b){return function(c){c=a.call(this,c);return[b.call(this,c[0]),c[1]]}},min:function(b,c){return function(d){var f=c.call(this,d);if(f[0].length<b)throw new a.Exception(d);return f}}},c=function(a){return function(){var b=null,c=[];1<arguments.length?b=Array.prototype.slice.call(arguments):arguments[0]instanceof Array&&
(b=arguments[0]);if(b)for(var f=b.shift();0<f.length;)return b.unshift(f[0]),c.push(a.apply(null,b)),b.shift(),c;else return a.apply(null,arguments)}},d="optional not ignore cache".split(/\s/),e=0;e<d.length;e++)b[d[e]]=c(b[d[e]]);c=function(a){return function(){return arguments[0]instanceof Array?a.apply(null,arguments[0]):a.apply(null,arguments)}};d="each any all".split(/\s/);for(e=0;e<d.length;e++)b[d[e]]=c(b[d[e]])})();
(function(){var a=function(b){for(var c=[],d=0;d<b.length;d++)b[d]instanceof Array?c=c.concat(a(b[d])):b[d]&&c.push(b[d]);return c};Date.Grammar={};Date.Translator={hour:function(a){return function(){this.hour=Number(a)}},minute:function(a){return function(){this.minute=Number(a)}},second:function(a){return function(){this.second=Number(a)}},meridian:function(a){return function(){this.meridian=a.slice(0,1).toLowerCase()}},timezone:function(a){return function(){var b=a.replace(/[^\d\+\-]/g,"");b.length?
this.timezoneOffset=Number(b):this.timezone=a.toLowerCase()}},day:function(a){var b=a[0];return function(){this.day=Number(b.match(/\d+/)[0])}},month:function(a){return function(){this.month=3==a.length?Date.getMonthNumberFromName(a):Number(a)-1}},year:function(a){return function(){var b=Number(a);this.year=2<a.length?b:b+(b+2E3<Date.CultureInfo.twoDigitYearMax?2E3:1900)}},rday:function(a){return function(){switch(a){case "yesterday":this.days=-1;break;case "tomorrow":this.days=1;break;case "today":this.days=
0;break;case "now":this.days=0,this.now=!0}}},finishExact:function(a){a=a instanceof Array?a:[a];var b=new Date;this.year=b.getFullYear();this.month=b.getMonth();this.day=1;for(b=this.second=this.minute=this.hour=0;b<a.length;b++)a[b]&&a[b].call(this);this.hour="p"==this.meridian&&13>this.hour?this.hour+12:this.hour;if(this.day>Date.getDaysInMonth(this.year,this.month))throw new RangeError(this.day+" is not a valid value for days.");a=new Date(this.year,this.month,this.day,this.hour,this.minute,this.second);
this.timezone?a.set({timezone:this.timezone}):this.timezoneOffset&&a.set({timezoneOffset:this.timezoneOffset});return a},finish:function(b){b=b instanceof Array?a(b):[b];if(0===b.length)return null;for(var c=0;c<b.length;c++)"function"==typeof b[c]&&b[c].call(this);if(this.now)return new Date;b=Date.today();if(null!=this.days||this.orient||this.operator){var d,e;e="past"==this.orient||"subtract"==this.operator?-1:1;this.weekday&&(this.unit="day",c=Date.getDayNumberFromName(this.weekday)-b.getDay(),
d=7,this.days=c?(c+e*d)%d:e*d);this.month&&(this.unit="month",c=this.month-b.getMonth(),d=12,this.months=c?(c+e*d)%d:e*d,this.month=null);this.unit||(this.unit="day");if(null==this[this.unit+"s"]||null!=this.operator)this.value||(this.value=1),"week"==this.unit&&(this.unit="day",this.value*=7),this[this.unit+"s"]=this.value*e;return b.add(this)}this.meridian&&this.hour&&(this.hour=13>this.hour&&"p"==this.meridian?this.hour+12:this.hour);this.weekday&&!this.day&&(this.day=b.addDays(Date.getDayNumberFromName(this.weekday)-
b.getDay()).getDate());this.month&&!this.day&&(this.day=1);return b.set(this)}};var b=Date.Parsing.Operators,c=Date.Grammar,d=Date.Translator,e;c.datePartDelimiter=b.rtoken(/^([\s\-\.\,\/\x27]+)/);c.timePartDelimiter=b.stoken(":");c.whiteSpace=b.rtoken(/^\s*/);c.generalDelimiter=b.rtoken(/^(([\s\,]|at|on)+)/);var p={};c.ctoken=function(a){var c=p[a];if(!c){for(var c=Date.CultureInfo.regexPatterns,d=a.split(/\s+/),e=[],h=0;h<d.length;h++)e.push(b.replace(b.rtoken(c[d[h]]),d[h]));c=p[a]=b.any.apply(null,
e)}return c};c.ctoken2=function(a){return b.rtoken(Date.CultureInfo.regexPatterns[a])};c.h=b.cache(b.process(b.rtoken(/^(0[0-9]|1[0-2]|[1-9])/),d.hour));c.hh=b.cache(b.process(b.rtoken(/^(0[0-9]|1[0-2])/),d.hour));c.H=b.cache(b.process(b.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/),d.hour));c.HH=b.cache(b.process(b.rtoken(/^([0-1][0-9]|2[0-3])/),d.hour));c.m=b.cache(b.process(b.rtoken(/^([0-5][0-9]|[0-9])/),d.minute));c.mm=b.cache(b.process(b.rtoken(/^[0-5][0-9]/),d.minute));c.s=b.cache(b.process(b.rtoken(/^([0-5][0-9]|[0-9])/),
d.second));c.ss=b.cache(b.process(b.rtoken(/^[0-5][0-9]/),d.second));c.hms=b.cache(b.sequence([c.H,c.mm,c.ss],c.timePartDelimiter));c.t=b.cache(b.process(c.ctoken2("shortMeridian"),d.meridian));c.tt=b.cache(b.process(c.ctoken2("longMeridian"),d.meridian));c.z=b.cache(b.process(b.rtoken(/^(\+|\-)?\s*\d\d\d\d?/),d.timezone));c.zz=b.cache(b.process(b.rtoken(/^(\+|\-)\s*\d\d\d\d/),d.timezone));c.zzz=b.cache(b.process(c.ctoken2("timezone"),d.timezone));c.timeSuffix=b.each(b.ignore(c.whiteSpace),b.set([c.tt,
c.zzz]));c.time=b.each(b.optional(b.ignore(b.stoken("T"))),c.hms,c.timeSuffix);c.d=b.cache(b.process(b.each(b.rtoken(/^([0-2]\d|3[0-1]|\d)/),b.optional(c.ctoken2("ordinalSuffix"))),d.day));c.dd=b.cache(b.process(b.each(b.rtoken(/^([0-2]\d|3[0-1])/),b.optional(c.ctoken2("ordinalSuffix"))),d.day));c.ddd=c.dddd=b.cache(b.process(c.ctoken("sun mon tue wed thu fri sat"),function(a){return function(){this.weekday=a}}));c.M=b.cache(b.process(b.rtoken(/^(1[0-2]|0\d|\d)/),d.month));c.MM=b.cache(b.process(b.rtoken(/^(1[0-2]|0\d)/),
d.month));c.MMM=c.MMMM=b.cache(b.process(c.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"),d.month));c.y=b.cache(b.process(b.rtoken(/^(\d\d?)/),d.year));c.yy=b.cache(b.process(b.rtoken(/^(\d\d)/),d.year));c.yyy=b.cache(b.process(b.rtoken(/^(\d\d?\d?\d?)/),d.year));c.yyyy=b.cache(b.process(b.rtoken(/^(\d\d\d\d)/),d.year));e=function(){return b.each(b.any.apply(null,arguments),b.not(c.ctoken2("timeContext")))};c.day=e(c.d,c.dd);c.month=e(c.M,c.MMM);c.year=e(c.yyyy,c.yy);c.orientation=b.process(c.ctoken("past future"),
function(a){return function(){this.orient=a}});c.operator=b.process(c.ctoken("add subtract"),function(a){return function(){this.operator=a}});c.rday=b.process(c.ctoken("yesterday tomorrow today now"),d.rday);c.unit=b.process(c.ctoken("minute hour day week month year"),function(a){return function(){this.unit=a}});c.value=b.process(b.rtoken(/^\d\d?(st|nd|rd|th)?/),function(a){return function(){this.value=a.replace(/\D/g,"")}});c.expression=b.set([c.rday,c.operator,c.value,c.unit,c.orientation,c.ddd,
c.MMM]);e=function(){return b.set(arguments,c.datePartDelimiter)};c.mdy=e(c.ddd,c.month,c.day,c.year);c.ymd=e(c.ddd,c.year,c.month,c.day);c.dmy=e(c.ddd,c.day,c.month,c.year);c.date=function(a){return(c[Date.CultureInfo.dateElementOrder]||c.mdy).call(this,a)};c.format=b.process(b.many(b.any(b.process(b.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/),function(a){if(c[a])return c[a];throw Date.Parsing.Exception(a);}),b.process(b.rtoken(/^[^dMyhHmstz]+/),function(a){return b.ignore(b.stoken(a))}))),
function(a){return b.process(b.each.apply(null,a),d.finishExact)});var l={},k=function(a){return l[a]=l[a]||c.format(a)[0]};c.formats=function(a){if(a instanceof Array){for(var c=[],d=0;d<a.length;d++)c.push(k(a[d]));return b.any.apply(null,c)}return k(a)};c._formats=c.formats(["yyyy-MM-ddTHH:mm:ss","ddd, MMM dd, yyyy H:mm:ss tt","ddd MMM d yyyy HH:mm:ss zzz","d"]);c._start=b.process(b.set([c.date,c.time,c.expression],c.generalDelimiter,c.whiteSpace),d.finish);c.start=function(a){try{var b=c._formats.call({},
a);if(0===b[1].length)return b}catch(d){}return c._start.call({},a)}})();Date._parse=Date.parse;Date.parse=function(a){var b=null;if(!a)return null;try{b=Date.Grammar.start.call({},a)}catch(c){return null}return 0===b[1].length?b[0]:null};Date.getParseFunction=function(a){var b=Date.Grammar.formats(a);return function(a){var d=null;try{d=b.call({},a)}catch(e){return null}return 0===d[1].length?d[0]:null}};Date.parseExact=function(a,b){return Date.getParseFunction(b)(a)};
