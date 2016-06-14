/**
 * Copyright (c) 2007-2015, Kaazing Corporation. All rights reserved.
 */

ByteOrder=function(){};
(function(){var g=ByteOrder.prototype;
g.toString=function(){throw new Error("Abstract")
};
var d=function(m){return(m&255)
};
var i=function(m){return(m&128)?(m|-256):m
};
var c=function(m){return[((m>>8)&255),(m&255)]
};
var l=function(m,n){return(i(m)<<8)|(n&255)
};
var b=function(m,n){return((m&255)<<8)|(n&255)
};
var e=function(m,n,o){return((m&255)<<16)|((n&255)<<8)|(o&255)
};
var j=function(m){return[((m>>16)&255),((m>>8)&255),(m&255)]
};
var k=function(m,n,o){return((m&255)<<16)|((n&255)<<8)|(o&255)
};
var f=function(m){return[((m>>24)&255),((m>>16)&255),((m>>8)&255),(m&255)]
};
var h=function(p,m,n,o){return(i(p)<<24)|((m&255)<<16)|((n&255)<<8)|(o&255)
};
var a=function(r,m,o,q){var n=b(r,m);
var p=b(o,q);
return(n*65536+p)
};
ByteOrder.BIG_ENDIAN=(function(){var n=function(){};
n.prototype=new ByteOrder();
var m=n.prototype;
m._toUnsignedByte=d;
m._toByte=i;
m._fromShort=c;
m._toShort=l;
m._toUnsignedShort=b;
m._toUnsignedMediumInt=e;
m._fromMediumInt=j;
m._toMediumInt=k;
m._fromInt=f;
m._toInt=h;
m._toUnsignedInt=a;
m.toString=function(){return"<ByteOrder.BIG_ENDIAN>"
};
return new n()
})();
ByteOrder.LITTLE_ENDIAN=(function(){var n=function(){};
n.prototype=new ByteOrder();
var m=n.prototype;
m._toByte=i;
m._toUnsignedByte=d;
m._fromShort=function(o){return c(o).reverse()
};
m._toShort=function(o,p){return l(p,o)
};
m._toUnsignedShort=function(o,p){return b(p,o)
};
m._toUnsignedMediumInt=function(o,p,q){return e(q,p,o)
};
m._fromMediumInt=function(o){return j(o).reverse()
};
m._toMediumInt=function(r,s,t,o,p,q){return k(q,p,o,t,s,r)
};
m._fromInt=function(o){return f(o).reverse()
};
m._toInt=function(r,o,p,q){return h(q,p,o,r)
};
m._toUnsignedInt=function(r,o,p,q){return a(q,p,o,r)
};
m.toString=function(){return"<ByteOrder.LITTLE_ENDIAN>"
};
return new n()
})()
})();
function Charset(){}(function(){var a=Charset.prototype;
a.decode=function(b){};
a.encode=function(c,b){};
Charset.UTF8=(function(){function d(){}d.prototype=new Charset();
var c=d.prototype;
c.decode=function(f){var k=f.remaining();
var n=k<10000;
var r=[];
var m=f.array;
var l=f.position;
var j=l+k;
var t,q,p,o;
for(var h=l;
h<j;
h++){t=(m[h]&255);
var e=b(t);
var g=j-h;
if(g<e){break
}var s=null;
switch(e){case 1:s=t;
break;
case 2:h++;
q=(m[h]&255);
s=((t&31)<<6)|(q&63);
break;
case 3:h++;
q=(m[h]&255);
h++;
p=(m[h]&255);
s=((t&15)<<12)|((q&63)<<6)|(p&63);
break;
case 4:h++;
q=(m[h]&255);
h++;
p=(m[h]&255);
h++;
o=(m[h]&255);
s=((t&7)<<18)|((q&63)<<12)|((p&63)<<6)|(o&63);
break
}if(n){r.push(s)
}else{r.push(String.fromCharCode(s))
}}if(n){return String.fromCharCode.apply(null,r)
}else{return r.join("")
}};
c.encode=function(j,f){var h=f.position;
var l=h;
var k=f.array;
for(var g=0;
g<j.length;
g++){var e=j.charCodeAt(g);
if(e<128){k[h++]=e
}else{if(e<2048){k[h++]=(e>>6)|192;
k[h++]=(e&63)|128
}else{if(e<65536){k[h++]=(e>>12)|224;
k[h++]=((e>>6)&63)|128;
k[h++]=(e&63)|128
}else{if(e<1114112){k[h++]=(e>>18)|240;
k[h++]=((e>>12)&63)|128;
k[h++]=((e>>6)&63)|128;
k[h++]=(e&63)|128
}else{throw new Error("Invalid UTF-8 string")
}}}}}f.position=h;
f.expandAt(h,h-l)
};
c.encodeAsByteArray=function(h){var f=new Array();
for(var g=0;
g<h.length;
g++){var e=h.charCodeAt(g);
if(e<128){f.push(e)
}else{if(e<2048){f.push((e>>6)|192);
f.push((e&63)|128)
}else{if(e<65536){f.push((e>>12)|224);
f.push(((e>>6)&63)|128);
f.push((e&63)|128)
}else{if(e<1114112){f.push((e>>18)|240);
f.push(((e>>12)&63)|128);
f.push(((e>>6)&63)|128);
f.push((e&63)|128)
}else{throw new Error("Invalid UTF-8 string")
}}}}}return f
};
c.encodeByteArray=function(j){var h=j.length;
var f=[];
for(var g=0;
g<h;
g++){var e=j[g];
if(e<128){f.push(e)
}else{if(e<2048){f.push((e>>6)|192);
f.push((e&63)|128)
}else{if(e<65536){f.push((e>>12)|224);
f.push(((e>>6)&63)|128);
f.push((e&63)|128)
}else{if(e<1114112){f.push((e>>18)|240);
f.push(((e>>12)&63)|128);
f.push(((e>>6)&63)|128);
f.push((e&63)|128)
}else{throw new Error("Invalid UTF-8 string")
}}}}}return String.fromCharCode.apply(null,f)
};
c.encodeArrayBuffer=function(k){var g=new Uint8Array(k);
var j=g.length;
var f=[];
for(var h=0;
h<j;
h++){var e=g[h];
if(e<128){f.push(e)
}else{if(e<2048){f.push((e>>6)|192);
f.push((e&63)|128)
}else{if(e<65536){f.push((e>>12)|224);
f.push(((e>>6)&63)|128);
f.push((e&63)|128)
}else{if(e<1114112){f.push((e>>18)|240);
f.push(((e>>12)&63)|128);
f.push(((e>>6)&63)|128);
f.push((e&63)|128)
}else{throw new Error("Invalid UTF-8 string")
}}}}}return String.fromCharCode.apply(null,f)
};
c.toByteArray=function(h){var l=[];
var o,m,k,j;
var f=h.length;
for(var g=0;
g<f;
g++){o=(h.charCodeAt(g)&255);
var e=b(o);
var n=null;
if(e+g>f){break
}switch(e){case 1:n=o;
break;
case 2:g++;
m=(h.charCodeAt(g)&255);
n=((o&31)<<6)|(m&63);
break;
case 3:g++;
m=(h.charCodeAt(g)&255);
g++;
k=(h.charCodeAt(g)&255);
n=((o&15)<<12)|((m&63)<<6)|(k&63);
break;
case 4:g++;
m=(h.charCodeAt(g)&255);
g++;
k=(h.charCodeAt(g)&255);
g++;
j=(h.charCodeAt(g)&255);
n=((o&7)<<18)|((m&63)<<12)|((k&63)<<6)|(j&63);
break
}l.push(n&255)
}return l
};
function b(e){if((e&128)===0){return 1
}if((e&32)===0){return 2
}if((e&16)===0){return 3
}if((e&8)===0){return 4
}throw new Error("Invalid UTF-8 bytes")
}return new d()
})()
})();
function ByteBuffer(a){this.array=a||[];
this._mark=-1;
this.limit=this.capacity=this.array.length;
this.order=ByteOrder.BIG_ENDIAN
}(function(){ByteBuffer.allocate=function(g){var h=new ByteBuffer();
h.capacity=g;
h.limit=g;
return h
};
ByteBuffer.wrap=function(g){return new ByteBuffer(g)
};
var b=ByteBuffer.prototype;
b.autoExpand=true;
b.capacity=0;
b.position=0;
b.limit=0;
b.order=ByteOrder.BIG_ENDIAN;
b.array=[];
b.mark=function(){this._mark=this.position;
return this
};
b.reset=function(){var g=this._mark;
if(g<0){throw new Error("Invalid mark")
}this.position=g;
return this
};
b.compact=function(){this.array.splice(0,this.position);
this.limit-=this.position;
this.position=0;
return this
};
b.duplicate=function(){var g=new ByteBuffer(this.array);
g.position=this.position;
g.limit=this.limit;
g.capacity=this.capacity;
return g
};
b.fill=function(g){e(this,g);
while(g-->0){this.put(0)
}return this
};
b.fillWith=function(g,h){e(this,h);
while(h-->0){this.put(g)
}return this
};
b.indexOf=function(g){var h=this.limit;
var k=this.array;
for(var j=this.position;
j<h;
j++){if(k[j]==g){return j
}}return -1
};
b.put=function(g){e(this,1);
this.array[this.position++]=g&255;
return this
};
b.putAt=function(h,g){c(this,h,1);
this.array[h]=g&255;
return this
};
b.putUnsigned=function(g){e(this,1);
this.array[this.position++]=g&255;
return this
};
b.putUnsignedAt=function(h,g){c(this,h,1);
this.array[h]=g&255;
return this
};
b.putShort=function(g){e(this,2);
a(this,this.position,this.order._fromShort(g));
this.position+=2;
return this
};
b.putShortAt=function(h,g){c(this,h,2);
a(this,h,this.order._fromShort(g));
return this
};
b.putUnsignedShort=function(g){e(this,2);
a(this,this.position,this.order._fromShort(g&65535));
this.position+=2;
return this
};
b.putUnsignedShortAt=function(h,g){c(this,h,2);
a(this,h,this.order._fromShort(g&65535));
return this
};
b.putMediumInt=function(g){e(this,3);
this.putMediumIntAt(this.position,g);
this.position+=3;
return this
};
b.putMediumIntAt=function(h,g){this.putBytesAt(h,this.order._fromMediumInt(g));
return this
};
b.putInt=function(g){e(this,4);
a(this,this.position,this.order._fromInt(g));
this.position+=4;
return this
};
b.putIntAt=function(h,g){c(this,h,4);
a(this,h,this.order._fromInt(g));
return this
};
b.putUnsignedInt=function(g){e(this,4);
this.putUnsignedIntAt(this.position,g&4294967295);
this.position+=4;
return this
};
b.putUnsignedIntAt=function(h,g){c(this,h,4);
this.putIntAt(h,g&4294967295);
return this
};
b.putString=function(g,h){h.encode(g,this);
return this
};
b.putPrefixedString=function(h,i,j){if(typeof(j)==="undefined"||typeof(j.encode)==="undefined"){throw new Error("ByteBuffer.putPrefixedString: character set parameter missing")
}if(h===0){return this
}e(this,h);
var g=i.length;
switch(h){case 1:this.put(g);
break;
case 2:this.putShort(g);
break;
case 4:this.putInt(g);
break
}j.encode(i,this);
return this
};
function a(k,h,g){var l=k.array;
for(var j=0;
j<g.length;
j++){l[j+h]=g[j]&255
}}b.putBytes=function(g){e(this,g.length);
a(this,this.position,g);
this.position+=g.length;
return this
};
b.putBytesAt=function(h,g){c(this,h,g.length);
a(this,h,g);
return this
};
b.putByteArray=function(g){e(this,g.byteLength);
var h=new Uint8Array(g);
for(var j=0;
j<h.byteLength;
j++){this.putAt(this.position+j,h[j]&255)
}this.position+=g.byteLength;
return this
};
b.putBuffer=function(h){var g=h.remaining();
e(this,g);
var m=h.array;
var l=h.position;
var k=this.position;
for(var j=0;
j<g;
j++){this.array[j+k]=m[j+l]
}this.position+=g;
return this
};
b.putBufferAt=function(j,h){var g=h.remaining();
e(this,g);
var n=h.array;
var m=h.position;
var l=this.position;
for(var k=0;
k<g;
k++){this.array[k+l]=n[k+m]
}return this
};
b.get=function(){f(this,1);
return this.order._toByte(this.array[this.position++])
};
b.getAt=function(g){d(this,g,1);
return this.order._toByte(this.array[g])
};
b.getUnsigned=function(){f(this,1);
var g=this.order._toUnsignedByte(this.array[this.position++]);
return g
};
b.getUnsignedAt=function(g){d(this,g,1);
return this.order._toUnsignedByte(this.array[g])
};
b.getBytes=function(j){f(this,j);
var g=new Array();
for(var h=0;
h<j;
h++){g.push(this.order._toByte(this.array[h+this.position]))
}this.position+=j;
return g
};
b.getBytesAt=function(h,k){d(this,h,k);
var g=new Array();
var l=this.array;
for(var j=0;
j<k;
j++){g.push(l[j+h])
}return g
};
b.getBlob=function(h){var g=this.array.slice(this.position,h);
this.position+=h;
return BlobUtils.fromNumberArray(g)
};
b.getBlobAt=function(h,i){var g=this.getBytesAt(h,i);
return BlobUtils.fromNumberArray(g)
};
b.getArrayBuffer=function(h){var g=new Uint8Array(h);
g.set(this.array.slice(this.position,h));
this.position+=h;
return g.buffer
};
b.getShort=function(){f(this,2);
var g=this.getShortAt(this.position);
this.position+=2;
return g
};
b.getShortAt=function(g){d(this,g,2);
var h=this.array;
return this.order._toShort(h[g++],h[g++])
};
b.getUnsignedShort=function(){f(this,2);
var g=this.getUnsignedShortAt(this.position);
this.position+=2;
return g
};
b.getUnsignedShortAt=function(g){d(this,g,2);
var h=this.array;
return this.order._toUnsignedShort(h[g++],h[g++])
};
b.getUnsignedMediumInt=function(){var g=this.array;
return this.order._toUnsignedMediumInt(g[this.position++],g[this.position++],g[this.position++])
};
b.getMediumInt=function(){var g=this.getMediumIntAt(this.position);
this.position+=3;
return g
};
b.getMediumIntAt=function(g){var h=this.array;
return this.order._toMediumInt(h[g++],h[g++],h[g++])
};
b.getInt=function(){f(this,4);
var g=this.getIntAt(this.position);
this.position+=4;
return g
};
b.getIntAt=function(g){d(this,g,4);
var h=this.array;
return this.order._toInt(h[g++],h[g++],h[g++],h[g++])
};
b.getUnsignedInt=function(){f(this,4);
var g=this.getUnsignedIntAt(this.position);
this.position+=4;
return g
};
b.getUnsignedIntAt=function(g){d(this,g,4);
var h=this.array;
return this.order._toUnsignedInt(h[g++],h[g++],h[g++],h[g++]);
return val
};
b.getPrefixedString=function(h,i){var g=0;
switch(h||2){case 1:g=this.getUnsigned();
break;
case 2:g=this.getUnsignedShort();
break;
case 4:g=this.getInt();
break
}if(g===0){return""
}var j=this.limit;
try{this.limit=this.position+g;
return i.decode(this)
}finally{this.limit=j
}};
b.getString=function(g){try{return g.decode(this)
}finally{this.position=this.limit
}};
b.slice=function(){return new ByteBuffer(this.array.slice(this.position,this.limit))
};
b.flip=function(){this.limit=this.position;
this.position=0;
this._mark=-1;
return this
};
b.rewind=function(){this.position=0;
this._mark=-1;
return this
};
b.clear=function(){this.position=0;
this.limit=this.capacity;
this._mark=-1;
return this
};
b.remaining=function(){return(this.limit-this.position)
};
b.hasRemaining=function(){return(this.limit>this.position)
};
b.skip=function(g){this.position+=g;
return this
};
b.getHexDump=function(){var m=this.array;
var l=this.position;
var g=this.limit;
if(l==g){return"empty"
}var k=[];
for(var h=l;
h<g;
h++){var j=(m[h]||0).toString(16);
if(j.length==1){j="0"+j
}k.push(j)
}return k.join(" ")
};
b.toString=b.getHexDump;
b.expand=function(g){return this.expandAt(this.position,g)
};
b.expandAt=function(h,j){var g=h+j;
if(g>this.capacity){this.capacity=g
}if(g>this.limit){this.limit=g
}return this
};
function e(h,g){if(h.autoExpand){h.expand(g)
}return h
}function f(i,h){var g=i.position+h;
if(g>i.limit){throw new Error("Buffer underflow")
}return i
}function d(j,h,i){var g=h+i;
if(h<0||g>j.limit){throw new Error("Index out of bounds")
}return j
}function c(j,h,i){var g=h+i;
if(h<0||g>j.limit){throw new Error("Index out of bounds")
}return j
}})();
function URI(h){h=h||"";
var b=0;
var e=h.indexOf("://");
if(e!=-1){this.scheme=h.slice(0,e);
b=e+3;
var d=h.indexOf("/",b);
if(d==-1){d=h.length;
h+="/"
}var f=h.slice(b,d);
this.authority=f;
b=d;
this.host=f;
var c=f.indexOf(":");
if(c!=-1){this.host=f.slice(0,c);
this.port=parseInt(f.slice(c+1),10);
if(isNaN(this.port)){throw new Error("Invalid URI syntax")
}}}var g=h.indexOf("?",b);
if(g!=-1){this.path=h.slice(b,g);
b=g+1
}var a=h.indexOf("#",b);
if(a!=-1){if(g!=-1){this.query=h.slice(b,a)
}else{this.path=h.slice(b,a)
}b=a+1;
this.fragment=h.slice(b)
}else{if(g!=-1){this.query=h.slice(b)
}else{this.path=h.slice(b)
}}}(function(){var a=URI.prototype;
a.toString=function(){var e=[];
var d=this.scheme;
if(d!==undefined){e.push(d);
e.push("://");
e.push(this.host);
var c=this.port;
if(c!==undefined){e.push(":");
e.push(c.toString())
}}if(this.path!==undefined){e.push(this.path)
}if(this.query!==undefined){e.push("?");
e.push(this.query)
}if(this.fragment!==undefined){e.push("#");
e.push(this.fragment)
}return e.join("")
};
var b={http:80,ws:80,https:443,wss:443};
URI.replaceProtocol=function(c,e){var d=c.indexOf("://");
if(d>0){return e+c.substr(d)
}else{return""
}}
})();
function JmsConnectionFactory(c,b){if(b){if(!(b instanceof JmsConnectionProperties)){throw new Error("Invalid value for argument - connectionProperties")
}}else{b=new JmsConnectionProperties()
}var d=this;
this.webSocketFactory=null;
if(typeof(WebSocketFactory)=="function"){this.webSocketFactory=new WebSocketFactory()
}if(typeof JmsConnectionFactory.init=="function"){JmsConnectionFactory.init(d,c,d.webSocketFactory,b)
}this.createConnection=function(){var e=null;
var k=arguments.length;
var j=this;
var m;
var g=null;
var l=null;
var h="";
var n=false;
var f={};
if(k==1){m=arguments[0];
g=null;
l=null;
h=null
}else{if(k==3){g=arguments[0];
l=arguments[1];
m=arguments[2];
h=null
}else{if(k==4){g=arguments[0];
l=arguments[1];
h=arguments[2];
m=arguments[3]
}else{throw new Error("Wrong number of arguments to JmsConnectionFactory.createConnection()")
}}}function i(p){if(typeof JmsConnectionFactory.init=="function"){JmsConnectionFactory.init(j,c,j.webSocketFactory,b);
var o=JmsConnectionFactory.createConnection(j,g,l,h,function(){if(o.value!==undefined){f.value=o.value
}else{if(o.exception!==undefined){f.exception=o.exception
}}f.getValue=function(){return o.getValue()
};
p()
})
}else{setTimeout(function(){i(p)
},50)
}}i(m);
return f
};
this.getWebSocketFactory=function(){return this.webSocketFactory
};
this.setWebSocketFactory=function(e){this.webSocketFactory=e
};
function a(){if(typeof JmsConnectionFactory.init=="function"){JmsConnectionFactory.init(d,c,d.webSocketFactory,b)
}else{setTimeout(function(){a()
},50)
}}a()
}function JmsConnectionProperties(){this.connectionTimeout=15000;
this.shutdownDelay=5000;
this.reconnectDelay=3000;
this.reconnectAttemptsMax=-1
}function JmsClient(){var M="",dc="\n-",ub='" for "gwt:onLoadErrorFn"',sb='" for "gwt:onPropertyErrorFn"',Sb='"<script src=\\"',fb='"><\/script>',W="#",cc=");",Wb="-\n",ec="-></scr",Tb='.cache.js\\"></scr" + "ipt>"',Y="/",ib="//",Jb="044B299E3B837324A1C39174F5BCE8A0",Kb="0D1754AC47916821D0CBE69DED4DB484",Lb="52D96B4F8585F9A9117EC18B3C071EEE",Mb="761092AC7AB921CC729D4A9A662951D2",Nb="9E7EF02171DCD8CC27F2FAB0AF52DBAD",Pb=":",mb="::",Ub="<scr",eb='<script id="',pb="=",X="?",rb='Bad handler "',Gb="Cross-site hosted mode not yet implemented. See issue ",Ob="DF5963E0C7FF945789FBBD2CCD142D2F",Qb="DOMContentLoaded",N="JmsClient",bb="JmsClient.nocache.js",lb="JmsClient::",gb="SCRIPT",db="__gwt_marker_JmsClient",hb="base",_="baseUrl",Q="begin",P="bootstrap",$="clear.cache.gif",ob="content",bc="document.write(",V="end",Zb='evtGroup: "loadExternalRefs", millis:(new Date()).getTime(),',_b='evtGroup: "moduleStartup", millis:(new Date()).getTime(),',Db="gecko",Eb="gecko1_8",R="gwt.codesvr.JmsClient=",S="gwt.hosted=",T="gwt.hybrid",tb="gwt:onLoadErrorFn",qb="gwt:onPropertyErrorFn",nb="gwt:property",Hb="http://code.google.com/p/google-web-toolkit/issues/detail?id=2079",Cb="ie6",Bb="ie8",Ab="ie9",Z="img",fc="ipt>",Vb="ipt><!-",Rb="loadExternalRefs",jb="meta",Yb='moduleName:"JmsClient", sessionId:window.__gwtStatsSessionId, subSystem:"startup",',U="moduleStartup",zb="msie",kb="name",wb="opera",yb="safari",ab="script",Ib="selectingPermutation",O="startup",$b='type: "end"});',ac='type: "moduleRequested"});',cb="undefined",Fb="unknown",vb="user.agent",xb="webkit",Xb="window.__gwtStatsEvent && window.__gwtStatsEvent({";
var m=window,n=document,o=m.__gwtStatsEvent?function(a){return m.__gwtStatsEvent(a)
}:null,p=m.__gwtStatsSessionId?m.__gwtStatsSessionId:null,q,r,s=M,t={},u=[],v=[],w=[],x=0,y,z;
o&&o({moduleName:N,sessionId:p,subSystem:O,evtGroup:P,millis:(new Date).getTime(),type:Q});
if(!m.__gwt_stylesLoaded){m.__gwt_stylesLoaded={}
}if(!m.__gwt_scriptsLoaded){m.__gwt_scriptsLoaded={}
}function A(){var b=false;
try{var c=m.location.search;
return(c.indexOf(R)!=-1||(c.indexOf(S)!=-1||m.external&&m.external.gwtOnLoad))&&c.indexOf(T)==-1
}catch(a){}A=function(){return b
};
return b
}function B(){if(q&&r){q(y,N,s,x);
o&&o({moduleName:N,sessionId:p,subSystem:O,evtGroup:U,millis:(new Date).getTime(),type:V})
}}function C(){function e(a){var b=a.lastIndexOf(W);
if(b==-1){b=a.length
}var c=a.indexOf(X);
if(c==-1){c=a.length
}var d=a.lastIndexOf(Y,Math.min(c,b));
return d>=0?a.substring(0,d+1):M
}function f(a){if(a.match(/^\w+:\/\//)){}else{var b=n.createElement(Z);
b.src=a+$;
a=e(b.src)
}return a
}function g(){var a=E(_);
if(a!=null){return a
}return M
}function h(){var a=n.getElementsByTagName(ab);
for(var b=0;
b<a.length;
++b){if(a[b].src.indexOf(bb)!=-1){return e(a[b].src)
}}return M
}function i(){var a;
if(typeof isBodyLoaded==cb||!isBodyLoaded()){var b=db;
var c;
n.write(eb+b+fb);
c=n.getElementById(b);
a=c&&c.previousSibling;
while(a&&a.tagName!=gb){a=a.previousSibling
}if(c){c.parentNode.removeChild(c)
}if(a&&a.src){return e(a.src)
}}return M
}function j(){var a=n.getElementsByTagName(hb);
if(a.length>0){return a[a.length-1].href
}return M
}function k(){var a=n.location;
return a.href==a.protocol+ib+a.host+a.pathname+a.search+a.hash
}var l=g();
if(l==M){l=h()
}if(l==M){l=i()
}if(l==M){l=j()
}if(l==M&&k()){l=e(n.location.href)
}l=f(l);
s=l;
return l
}function D(){var b=document.getElementsByTagName(jb);
for(var c=0,d=b.length;
c<d;
++c){var e=b[c],f=e.getAttribute(kb),g;
if(f){f=f.replace(lb,M);
if(f.indexOf(mb)>=0){continue
}if(f==nb){g=e.getAttribute(ob);
if(g){var h,i=g.indexOf(pb);
if(i>=0){f=g.substring(0,i);
h=g.substring(i+1)
}else{f=g;
h=M
}t[f]=h
}}else{if(f==qb){g=e.getAttribute(ob);
if(g){try{z=eval(g)
}catch(a){alert(rb+g+sb)
}}}else{if(f==tb){g=e.getAttribute(ob);
if(g){try{y=eval(g)
}catch(a){alert(rb+g+ub)
}}}}}}}}function E(a){var b=t[a];
return b==null?null:b
}function F(a,b){var c=w;
for(var d=0,e=a.length-1;
d<e;
++d){c=c[a[d]]||(c[a[d]]=[])
}c[a[e]]=b
}function G(a){var b=v[a](),c=u[a];
if(b in c){return b
}var d=[];
for(var e in c){d[c[e]]=e
}if(z){z(a,d,b)
}throw null
}v[vb]=function(){var b=navigator.userAgent.toLowerCase();
var c=function(a){return parseInt(a[1])*1000+parseInt(a[2])
};
if(function(){return b.indexOf(wb)!=-1
}()){return wb
}if(function(){return b.indexOf(xb)!=-1
}()){return yb
}if(function(){return b.indexOf(zb)!=-1&&n.documentMode>=9
}()){return Ab
}if(function(){return b.indexOf(zb)!=-1&&n.documentMode>=8
}()){return Bb
}if(function(){var a=/msie ([0-9]+)\.([0-9]+)/.exec(b);
if(a&&a.length==3){return c(a)>=6000
}}()){return Cb
}if(function(){return b.indexOf(Db)!=-1
}()){return Eb
}return Fb
};
u[vb]={gecko1_8:0,ie6:1,ie8:2,ie9:3,opera:4,safari:5};
JmsClient.onScriptLoad=function(a){JmsClient.onScriptLoad=null;
q=a;
B()
};
if(A()){alert(Gb+Hb);
return
}D();
C();
o&&o({moduleName:N,sessionId:p,subSystem:O,evtGroup:P,millis:(new Date).getTime(),type:Ib});
var H;
try{F([Bb],Jb);
F([Cb],Kb);
F([Ab],Lb);
F([wb],Mb);
F([Eb],Nb);
F([yb],Ob);
H=w[G(vb)];
var I=H.indexOf(Pb);
if(I!=-1){x=Number(H.substring(I+1));
H=H.substring(0,I)
}}catch(a){return
}var J;
function K(){if(!r){r=true;
B();
if(n.removeEventListener){n.removeEventListener(Qb,K,false)
}if(J){clearInterval(J)
}}}if(n.addEventListener){n.addEventListener(Qb,function(){K()
},false)
}var J=setInterval(function(){if(/loaded|complete/.test(n.readyState)){K()
}},50);
o&&o({moduleName:N,sessionId:p,subSystem:O,evtGroup:P,millis:(new Date).getTime(),type:V});
o&&o({moduleName:N,sessionId:p,subSystem:O,evtGroup:Rb,millis:(new Date).getTime(),type:Q});
var L=Sb+s+H+Tb;
n.write(Ub+Vb+Wb+Xb+Yb+Zb+$b+Xb+Yb+_b+ac+bc+L+cc+dc+ec+fc)
}JmsClient();