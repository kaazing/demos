/**
 * Copyright (c) 2007-2015, Kaazing Corporation. All rights reserved.
 */

var browser=null;
if(typeof (ActiveXObject)!="undefined"){
if(navigator.userAgent.indexOf("MSIE 10")!=-1){
browser="chrome";
}else{
browser="ie";
}
}else{
if(navigator.userAgent.indexOf("Trident/7")!=-1&&navigator.userAgent.indexOf("rv:11")!=-1){
browser="chrome";
}else{
if(navigator.userAgent.indexOf("Edge")!=-1){
browser="chrome";
}else{
if(Object.prototype.toString.call(window.opera)=="[object Opera]"){
browser="opera";
}else{
if(navigator.vendor.indexOf("Apple")!=-1){
browser="safari";
if(navigator.userAgent.indexOf("iPad")!=-1||navigator.userAgent.indexOf("iPhone")!=-1){
browser.ios=true;
}
}else{
if(navigator.vendor.indexOf("Google")!=-1){
if((navigator.userAgent.indexOf("Android")!=-1)&&(navigator.userAgent.indexOf("Chrome")==-1)){
browser="android";
}else{
browser="chrome";
}
}else{
if(navigator.product=="Gecko"&&window.find&&!navigator.savePreferences){
browser="firefox";
}else{
throw new Error("couldn't detect browser");
}
}
}
}
}
}
}
switch(browser){
case "ie":
(function(){
if(document.createEvent===undefined){
var _1=function(){
};
_1.prototype.initEvent=function(_2,_3,_4){
this.type=_2;
this.bubbles=_3;
this.cancelable=_4;
};
document.createEvent=function(_5){
if(_5!="Events"){
throw new Error("Unsupported event name: "+_5);
}
return new _1();
};
}
document._w_3_c_d_o_m_e_v_e_n_t_s_createElement=document.createElement;
document.createElement=function(_6){
var _7=this._w_3_c_d_o_m_e_v_e_n_t_s_createElement(_6);
if(_7.addEventListener===undefined){
var _8={};
_7.addEventListener=function(_9,_a,_b){
_7.attachEvent("on"+_9,_a);
return addEventListener(_8,_9,_a,_b);
};
_7.removeEventListener=function(_c,_d,_e){
return removeEventListener(_8,_c,_d,_e);
};
_7.dispatchEvent=function(_f){
return dispatchEvent(_8,_f);
};
}
return _7;
};
if(window.addEventListener===undefined){
var _10=document.createElement("div");
var _11=(typeof (postMessage)==="undefined");
window.addEventListener=function(_12,_13,_14){
if(_11&&_12=="message"){
_10.addEventListener(_12,_13,_14);
}else{
window.attachEvent("on"+_12,_13);
}
};
window.removeEventListener=function(_15,_16,_17){
if(_11&&_15=="message"){
_10.removeEventListener(_15,_16,_17);
}else{
window.detachEvent("on"+_15,_16);
}
};
window.dispatchEvent=function(_18){
if(_11&&_18.type=="message"){
_10.dispatchEvent(_18);
}else{
window.fireEvent("on"+_18.type,_18);
}
};
}
function addEventListener(_19,_1a,_1b,_1c){
if(_1c){
throw new Error("Not implemented");
}
var _1d=_19[_1a]||{};
_19[_1a]=_1d;
_1d[_1b]=_1b;
};
function removeEventListener(_1e,_1f,_20,_21){
if(_21){
throw new Error("Not implemented");
}
var _22=_1e[_1f]||{};
delete _22[_20];
};
function dispatchEvent(_23,_24){
var _25=_24.type;
var _26=_23[_25]||{};
for(var key in _26){
if(_26.hasOwnProperty(key)&&typeof (_26[key])=="function"){
try{
_26[key](_24);
}
catch(e){
}
}
}
};
})();
break;
case "chrome":
case "android":
case "safari":
if(typeof (window.postMessage)==="undefined"&&typeof (window.dispatchEvent)==="undefined"&&typeof (document.dispatchEvent)==="function"){
window.dispatchEvent=function(_28){
document.dispatchEvent(_28);
};
var addEventListener0=window.addEventListener;
window.addEventListener=function(_29,_2a,_2b){
if(_29==="message"){
document.addEventListener(_29,_2a,_2b);
}else{
addEventListener0.call(window,_29,_2a,_2b);
}
};
var removeEventListener0=window.removeEventListener;
window.removeEventListener=function(_2c,_2d,_2e){
if(_2c==="message"){
document.removeEventListener(_2c,_2d,_2e);
}else{
removeEventListener0.call(window,_2c,_2d,_2e);
}
};
}
break;
case "opera":
var addEventListener0=window.addEventListener;
window.addEventListener=function(_2f,_30,_31){
var _32=_30;
if(_2f==="message"){
_32=function(_33){
if(_33.origin===undefined&&_33.uri!==undefined){
var uri=new URI(_33.uri);
delete uri.path;
delete uri.query;
delete uri.fragment;
_33.origin=uri.toString();
}
return _30(_33);
};
_30._$=_32;
}
addEventListener0.call(window,_2f,_32,_31);
};
var removeEventListener0=window.removeEventListener;
window.removeEventListener=function(_35,_36,_37){
var _38=_36;
if(_35==="message"){
_38=_36._$;
}
removeEventListener0.call(window,_35,_38,_37);
};
break;
}
function URI(str){
str=str||"";
var _3a=0;
var _3b=str.indexOf("://");
if(_3b!=-1){
this.scheme=str.slice(0,_3b);
_3a=_3b+3;
var _3c=str.indexOf("/",_3a);
if(_3c==-1){
_3c=str.length;
str+="/";
}
var _3d=str.slice(_3a,_3c);
this.authority=_3d;
_3a=_3c;
this.host=_3d;
var _3e=_3d.indexOf(":");
if(_3e!=-1){
this.host=_3d.slice(0,_3e);
this.port=parseInt(_3d.slice(_3e+1),10);
if(isNaN(this.port)){
throw new Error("Invalid URI syntax");
}
}
}
var _3f=str.indexOf("?",_3a);
if(_3f!=-1){
this.path=str.slice(_3a,_3f);
_3a=_3f+1;
}
var _40=str.indexOf("#",_3a);
if(_40!=-1){
if(_3f!=-1){
this.query=str.slice(_3a,_40);
}else{
this.path=str.slice(_3a,_40);
}
_3a=_40+1;
this.fragment=str.slice(_3a);
}else{
if(_3f!=-1){
this.query=str.slice(_3a);
}else{
this.path=str.slice(_3a);
}
}
};
(function(){
var _41=URI.prototype;
_41.toString=function(){
var sb=[];
var _43=this.scheme;
if(_43!==undefined){
sb.push(_43);
sb.push("://");
sb.push(this.host);
var _44=this.port;
if(_44!==undefined){
sb.push(":");
sb.push(_44.toString());
}
}
if(this.path!==undefined){
sb.push(this.path);
}
if(this.query!==undefined){
sb.push("?");
sb.push(this.query);
}
if(this.fragment!==undefined){
sb.push("#");
sb.push(this.fragment);
}
return sb.join("");
};
var _45={"http":80,"ws":80,"https":443,"wss":443};
URI.replaceProtocol=function(_46,_47){
var _48=_46.indexOf("://");
if(_48>0){
return _47+_46.substr(_48);
}else{
return "";
}
};
})();
(function(){
Base64={};
Base64.encode=function(_49){
var _4a=[];
var _4b;
var _4c;
var _4d;
while(_49.length){
switch(_49.length){
case 1:
_4b=_49.shift();
_4a.push(_4e[(_4b>>2)&63]);
_4a.push(_4e[((_4b<<4)&48)]);
_4a.push("=");
_4a.push("=");
break;
case 2:
_4b=_49.shift();
_4c=_49.shift();
_4a.push(_4e[(_4b>>2)&63]);
_4a.push(_4e[((_4b<<4)&48)|((_4c>>4)&15)]);
_4a.push(_4e[(_4c<<2)&60]);
_4a.push("=");
break;
default:
_4b=_49.shift();
_4c=_49.shift();
_4d=_49.shift();
_4a.push(_4e[(_4b>>2)&63]);
_4a.push(_4e[((_4b<<4)&48)|((_4c>>4)&15)]);
_4a.push(_4e[((_4c<<2)&60)|((_4d>>6)&3)]);
_4a.push(_4e[_4d&63]);
break;
}
}
return _4a.join("");
};
Base64.decode=function(_4f){
if(_4f.length===0){
return [];
}
if(_4f.length%4!==0){
throw new Error("Invalid base64 string (must be quads)");
}
var _50=[];
for(var i=0;i<_4f.length;i+=4){
var _52=_4f.charAt(i);
var _53=_4f.charAt(i+1);
var _54=_4f.charAt(i+2);
var _55=_4f.charAt(i+3);
var _56=_57[_52];
var _58=_57[_53];
var _59=_57[_54];
var _5a=_57[_55];
_50.push(((_56<<2)&252)|((_58>>4)&3));
if(_54!="="){
_50.push(((_58<<4)&240)|((_59>>2)&15));
if(_55!="="){
_50.push(((_59<<6)&192)|(_5a&63));
}
}
}
return _50;
};
var _4e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
var _57={"=":0};
for(var i=0;i<_4e.length;i++){
_57[_4e[i]]=i;
}
if(typeof (window.btoa)==="undefined"){
window.btoa=function(s){
var _5d=s.split("");
for(var i=0;i<_5d.length;i++){
_5d[i]=(_5d[i]).charCodeAt();
}
return Base64.encode(_5d);
};
window.atob=function(_5f){
var _60=Base64.decode(_5f);
for(var i=0;i<_60.length;i++){
_60[i]=String.fromCharCode(_60[i]);
}
return _60.join("");
};
}
})();
var postMessage0=(function(){
var _62=new URI((browser=="ie")?document.URL:location.href);
var _63={"http":80,"https":443};
if(_62.port==null){
_62.port=_63[_62.scheme];
_62.authority=_62.host+":"+_62.port;
}
var _64=_62.scheme+"://"+_62.authority;
var _65="/.kr";
if(typeof (postMessage)!=="undefined"){
return function(_66,_67,_68){
if(typeof (_67)!="string"){
throw new Error("Unsupported type. Messages must be strings");
}
if(_68==="null"){
_68="*";
}
switch(browser){
case "ie":
case "opera":
case "firefox":
setTimeout(function(){
_66.postMessage(_67,_68);
},0);
break;
default:
_66.postMessage(_67,_68);
break;
}
};
}else{
function MessagePipe(_69){
this.sourceToken=toPaddedHex(Math.floor(Math.random()*(Math.pow(2,32)-1)),8);
this.iframe=_69;
this.bridged=false;
this.lastWrite=0;
this.lastRead=0;
this.lastReadIndex=2;
this.lastSyn=0;
this.lastAck=0;
this.queue=[];
this.escapedFragments=[];
};
var _6a=MessagePipe.prototype;
_6a.attach=function(_6b,_6c,_6d,_6e,_6f,_70){
this.target=_6b;
this.targetOrigin=_6c;
this.targetToken=_6d;
this.reader=_6e;
this.writer=_6f;
this.writerURL=_70;
try{
this._lastHash=_6e.location.hash;
this.poll=pollLocationHash;
}
catch(permissionDenied){
this._lastDocumentURL=_6e.document.URL;
this.poll=pollDocumentURL;
}
if(_6b==parent){
dequeue(this,true);
}
};
_6a.detach=function(){
this.poll=function(){
};
delete this.target;
delete this.targetOrigin;
delete this.reader;
delete this.lastFragment;
delete this.writer;
delete this.writerURL;
};
_6a.poll=function(){
};
function pollLocationHash(){
var _71=this.reader.location.hash;
if(this._lastHash!=_71){
process(this,_71.substring(1));
this._lastHash=_71;
}
};
function pollDocumentURL(){
var _72=this.reader.document.URL;
if(this._lastDocumentURL!=_72){
var _73=_72.indexOf("#");
if(_73!=-1){
process(this,_72.substring(_73+1));
this._lastDocumentURL=_72;
}
}
};
_6a.post=function(_74,_75,_76){
bridgeIfNecessary(this,_74);
var _77=1000;
var _78=escape(_75);
var _79=[];
while(_78.length>_77){
var _7a=_78.substring(0,_77);
_78=_78.substring(_77);
_79.push(_7a);
}
_79.push(_78);
this.queue.push([_76,_79]);
if(this.writer!=null&&this.lastAck>=this.lastSyn){
dequeue(this,false);
}
};
function bridgeIfNecessary(_7b,_7c){
if(_7b.lastWrite<1&&!_7b.bridged){
if(_7c.parent==window){
var src=_7b.iframe.src;
var _7e=src.split("#");
var _7f=null;
var _80=document.getElementsByTagName("meta");
for(var i=0;i<_80.length;i++){
if(_80[i].name=="kaazing:resources"){
alert("kaazing:resources is no longer supported. Please refer to the Administrator's Guide section entitled \"Configuring a Web Server to Integrate with Kaazing Gateway\"");
}
}
var _82=_64;
var _83=_82.toString()+_65+"?.kr=xsp&.kv=10.05";
if(_7f){
var _84=new URI(_82.toString());
var _7e=_7f.split(":");
_84.host=_7e.shift();
if(_7e.length){
_84.port=_7e.shift();
}
_83=_84.toString()+_65+"?.kr=xsp&.kv=10.05";
}
for(var i=0;i<_80.length;i++){
if(_80[i].name=="kaazing:postMessageBridgeURL"){
var _85=_80[i].content;
var _86=new URI(_85);
var _87=new URI(location.toString());
if(!_86.authority){
_86.host=_87.host;
_86.port=_87.port;
_86.scheme=_87.scheme;
if(_85.indexOf("/")!=0){
var _88=_87.path.split("/");
_88.pop();
_88.push(_85);
_86.path=_88.join("/");
}
}
postMessage0.BridgeURL=_86.toString();
}
}
if(postMessage0.BridgeURL){
_83=postMessage0.BridgeURL;
}
var _89=["I",_82,_7b.sourceToken,escape(_83)];
if(_7e.length>1){
var _8a=_7e[1];
_89.push(escape(_8a));
}
_7e[1]=_89.join("!");
setTimeout(function(){
_7c.location.replace(_7e.join("#"));
},200);
_7b.bridged=true;
}
}
};
function flush(_8b,_8c){
var _8d=_8b.writerURL+"#"+_8c;
_8b.writer.location.replace(_8d);
};
function fromHex(_8e){
return parseInt(_8e,16);
};
function toPaddedHex(_8f,_90){
var hex=_8f.toString(16);
var _92=[];
_90-=hex.length;
while(_90-->0){
_92.push("0");
}
_92.push(hex);
return _92.join("");
};
function dequeue(_93,_94){
var _95=_93.queue;
var _96=_93.lastRead;
if((_95.length>0||_94)&&_93.lastSyn>_93.lastAck){
var _97=_93.lastFrames;
var _98=_93.lastReadIndex;
if(fromHex(_97[_98])!=_96){
_97[_98]=toPaddedHex(_96,8);
flush(_93,_97.join(""));
}
}else{
if(_95.length>0){
var _99=_95.shift();
var _9a=_99[0];
if(_9a=="*"||_9a==_93.targetOrigin){
_93.lastWrite++;
var _9b=_99[1];
var _9c=_9b.shift();
var _9d=3;
var _97=[_93.targetToken,toPaddedHex(_93.lastWrite,8),toPaddedHex(_96,8),"F",toPaddedHex(_9c.length,4),_9c];
var _98=2;
if(_9b.length>0){
_97[_9d]="f";
_93.queue.unshift(_99);
}
if(_93.resendAck){
var _9e=[_93.targetToken,toPaddedHex(_93.lastWrite-1,8),toPaddedHex(_96,8),"a"];
_97=_9e.concat(_97);
_98+=_9e.length;
}
flush(_93,_97.join(""));
_93.lastFrames=_97;
_93.lastReadIndex=_98;
_93.lastSyn=_93.lastWrite;
_93.resendAck=false;
}
}else{
if(_94){
_93.lastWrite++;
var _97=[_93.targetToken,toPaddedHex(_93.lastWrite,8),toPaddedHex(_96,8),"a"];
var _98=2;
if(_93.resendAck){
var _9e=[_93.targetToken,toPaddedHex(_93.lastWrite-1,8),toPaddedHex(_96,8),"a"];
_97=_9e.concat(_97);
_98+=_9e.length;
}
flush(_93,_97.join(""));
_93.lastFrames=_97;
_93.lastReadIndex=_98;
_93.resendAck=true;
}
}
}
};
function process(_9f,_a0){
var _a1=_a0.substring(0,8);
var _a2=fromHex(_a0.substring(8,16));
var _a3=fromHex(_a0.substring(16,24));
var _a4=_a0.charAt(24);
if(_a1!=_9f.sourceToken){
throw new Error("postMessage emulation tampering detected");
}
var _a5=_9f.lastRead;
var _a6=_a5+1;
if(_a2==_a6){
_9f.lastRead=_a6;
}
if(_a2==_a6||_a2==_a5){
_9f.lastAck=_a3;
}
if(_a2==_a6||(_a2==_a5&&_a4=="a")){
switch(_a4){
case "f":
var _a7=_a0.substr(29,fromHex(_a0.substring(25,29)));
_9f.escapedFragments.push(_a7);
dequeue(_9f,true);
break;
case "F":
var _a8=_a0.substr(29,fromHex(_a0.substring(25,29)));
if(_9f.escapedFragments!==undefined){
_9f.escapedFragments.push(_a8);
_a8=_9f.escapedFragments.join("");
_9f.escapedFragments=[];
}
var _a9=unescape(_a8);
dispatch(_a9,_9f.target,_9f.targetOrigin);
dequeue(_9f,true);
break;
case "a":
if(_a0.length>25){
process(_9f,_a0.substring(25));
}else{
dequeue(_9f,false);
}
break;
default:
throw new Error("unknown postMessage emulation payload type: "+_a4);
}
}
};
function dispatch(_aa,_ab,_ac){
var _ad=document.createEvent("Events");
_ad.initEvent("message",false,true);
_ad.data=_aa;
_ad.origin=_ac;
_ad.source=_ab;
dispatchEvent(_ad);
};
var _ae={};
var _af=[];
function pollReaders(){
for(var i=0,len=_af.length;i<len;i++){
var _b2=_af[i];
_b2.poll();
}
setTimeout(pollReaders,20);
};
function findMessagePipe(_b3){
if(_b3==parent){
return _ae["parent"];
}else{
if(_b3.parent==window){
var _b4=document.getElementsByTagName("iframe");
for(var i=0;i<_b4.length;i++){
var _b6=_b4[i];
if(_b3==_b6.contentWindow){
return supplyIFrameMessagePipe(_b6);
}
}
}else{
throw new Error("Generic peer postMessage not yet implemented");
}
}
};
function supplyIFrameMessagePipe(_b7){
var _b8=_b7._name;
if(_b8===undefined){
_b8="iframe$"+String(Math.random()).substring(2);
_b7._name=_b8;
}
var _b9=_ae[_b8];
if(_b9===undefined){
_b9=new MessagePipe(_b7);
_ae[_b8]=_b9;
}
return _b9;
};
function postMessage0(_ba,_bb,_bc){
if(typeof (_bb)!="string"){
throw new Error("Unsupported type. Messages must be strings");
}
if(_ba==window){
if(_bc=="*"||_bc==_64){
dispatch(_bb,window,_64);
}
}else{
var _bd=findMessagePipe(_ba);
_bd.post(_ba,_bb,_bc);
}
};
postMessage0.attach=function(_be,_bf,_c0,_c1,_c2,_c3){
var _c4=findMessagePipe(_be);
_c4.attach(_be,_bf,_c0,_c1,_c2,_c3);
_af.push(_c4);
};
var _c5=function(_c6){
var _c7=new URI((browser=="ie")?document.URL:location.href);
var _c8;
var _c9={"http":80,"https":443};
if(_c7.port==null){
_c7.port=_c9[_c7.scheme];
_c7.authority=_c7.host+":"+_c7.port;
}
var _ca=unescape(_c7.fragment||"");
if(_ca.length>0){
var _cb=_ca.split(",");
var _cc=_cb.shift();
var _cd=_cb.shift();
var _ce=_cb.shift();
var _cf=_c7.scheme+"://"+document.domain+":"+_c7.port;
var _d0=_c7.scheme+"://"+_c7.authority;
var _d1=_cc+"/.kr?.kr=xsc&.kv=10.05";
var _d2=document.location.toString().split("#")[0];
var _d3=_d1+"#"+escape([_cf,_cd,escape(_d2)].join(","));
if(typeof (ActiveXObject)!="undefined"){
_c8=new ActiveXObject("htmlfile");
_c8.open();
try{
_c8.parentWindow.opener=window;
}
catch(domainError){
if(_c6){
_c8.domain=_c6;
}
_c8.parentWindow.opener=window;
}
_c8.write("<html>");
_c8.write("<body>");
if(_c6){
_c8.write("<script>CollectGarbage();document.domain='"+_c6+"';</"+"script>");
}
_c8.write("<iframe src=\""+_d1+"\"></iframe>");
_c8.write("</body>");
_c8.write("</html>");
_c8.close();
var _d4=_c8.body.lastChild;
var _d5=_c8.parentWindow;
var _d6=parent;
var _d7=_d6.parent.postMessage0;
if(typeof (_d7)!="undefined"){
_d4.onload=function(){
var _d8=_d4.contentWindow;
_d8.location.replace(_d3);
_d7.attach(_d6,_cc,_ce,_d5,_d8,_d1);
};
}
}else{
var _d4=document.createElement("iframe");
_d4.src=_d3;
document.body.appendChild(_d4);
var _d5=window;
var _d9=_d4.contentWindow;
var _d6=parent;
var _d7=_d6.parent.postMessage0;
if(typeof (_d7)!="undefined"){
_d7.attach(_d6,_cc,_ce,_d5,_d9,_d1);
}
}
}
window.onunload=function(){
try{
var _da=window.parent.parent.postMessage0;
if(typeof (_da)!="undefined"){
_da.detach(_d6);
}
}
catch(permissionDenied){
}
if(typeof (_c8)!=="undefined"){
_c8.parentWindow.opener=null;
_c8.open();
_c8.close();
_c8=null;
CollectGarbage();
}
};
};
postMessage0.__init__=function(_db,_dc){
var _dd=_c5.toString();
_db.URI=URI;
_db.browser=browser;
if(!_dc){
_dc="";
}
_db.setTimeout("("+_dd+")('"+_dc+"')",0);
};
postMessage0.bridgeURL=false;
postMessage0.detach=function(_de){
var _df=findMessagePipe(_de);
for(var i=0;i<_af.length;i++){
if(_af[i]==_df){
_af.splice(i,1);
}
}
_df.detach();
};
if(window!=top){
_ae["parent"]=new MessagePipe();
function initializeAsTargetIfNecessary(){
var _e1=new URI((browser=="ie")?document.URL:location.href);
var _e2=_e1.fragment||"";
if(document.body!=null&&_e2.length>0&&_e2.charAt(0)=="I"){
var _e3=unescape(_e2);
var _e4=_e3.split("!");
if(_e4.shift()=="I"){
var _e5=_e4.shift();
var _e6=_e4.shift();
var _e7=unescape(_e4.shift());
var _e8=_64;
if(_e5==_e8){
try{
parent.location.hash;
}
catch(permissionDenied){
document.domain=document.domain;
}
}
var _e9=_e4.shift()||"";
switch(browser){
case "firefox":
location.replace([location.href.split("#")[0],_e9].join("#"));
break;
default:
location.hash=_e9;
break;
}
var _ea=findMessagePipe(parent);
_ea.targetToken=_e6;
var _eb=_ea.sourceToken;
var _ec=_e7+"#"+escape([_e8,_e6,_eb].join(","));
var _ed;
_ed=document.createElement("iframe");
_ed.src=_ec;
_ed.style.position="absolute";
_ed.style.left="-10px";
_ed.style.top="10px";
_ed.style.visibility="hidden";
_ed.style.width="0px";
_ed.style.height="0px";
document.body.appendChild(_ed);
return;
}
}
setTimeout(initializeAsTargetIfNecessary,20);
};
initializeAsTargetIfNecessary();
}
var _ee=document.getElementsByTagName("meta");
for(var i=0;i<_ee.length;i++){
if(_ee[i].name==="kaazing:postMessage"){
if("immediate"==_ee[i].content){
var _f0=function(){
var _f1=document.getElementsByTagName("iframe");
for(var i=0;i<_f1.length;i++){
var _f3=_f1[i];
if(_f3.style["KaaPostMessage"]=="immediate"){
_f3.style["KaaPostMessage"]="none";
var _f4=supplyIFrameMessagePipe(_f3);
bridgeIfNecessary(_f4,_f3.contentWindow);
}
}
setTimeout(_f0,20);
};
setTimeout(_f0,20);
}
break;
}
}
for(var i=0;i<_ee.length;i++){
if(_ee[i].name==="kaazing:postMessagePrefix"){
var _f5=_ee[i].content;
if(_f5!=null&&_f5.length>0){
if(_f5.charAt(0)!="/"){
_f5="/"+_f5;
}
_65=_f5;
}
}
}
setTimeout(pollReaders,20);
return postMessage0;
}
})();
var XDRHttpDirect=(function(){
var id=0;
function XDRHttpDirect(_f7){
this.outer=_f7;
};
var _f8=XDRHttpDirect.prototype;
_f8.open=function(_f9,_fa){
var _fb=this;
var xhr=this.outer;
xhr.responseText="";
var _fd=2;
var _fe=0;
var _ff=0;
this._method=_f9;
this._location=_fa;
if(_fa.indexOf("?")==-1){
_fa+="?.kac=ex&.kct=application/x-message-http";
}else{
_fa+="&.kac=ex&.kct=application/x-message-http";
}
this.location=_fa;
var xdr=this.xdr=new XDomainRequest();
var _101=function(e){
try{
var _103=xdr.responseText;
if(_fd<=2){
var _104=_103.indexOf("\r\n\r\n");
if(_104==-1){
return;
}
var _105=_103.indexOf("\r\n");
var _106=_103.substring(0,_105);
var _107=_106.match(/HTTP\/1\.\d\s(\d+)\s([^\r\n]+)/);
xhr.status=parseInt(_107[1]);
xhr.statusText=_107[2];
var _108=_105+2;
_ff=_104+4;
var _109=_103.substring(_108,_104).split("\r\n");
xhr._responseHeaders={};
for(var i=0;i<_109.length;i++){
var _10b=_109[i].split(":");
if(_10b.length>1){
var _10c=_10b[0].replace(/^\s+|\s+$/g,"");
var _10d=_10b[1].replace(/^\s+|\s+$/g,"");
var _10e=xhr._responseHeaders[_10c];
var _10f=_10d;
if(_10e&&(_10d.replace(/^\s+|\s+$/g,"").length>0)){
_10f=_10e.concat(",").concat(_10d);
}
xhr._responseHeaders[_10c]=_10f;
}
}
_fe=_ff;
_fd=xhr.readyState=3;
if(typeof (_fb.onreadystatechange)=="function"){
_fb.onreadystatechange(xhr);
}
}
var _110=xdr.responseText.length;
if(_110>_fe){
xhr.responseText=_103.slice(_ff);
_fe=_110;
if(typeof (_fb.onprogress)=="function"){
_fb.onprogress(xhr);
}
}else{
}
}
catch(e1){
_fb.onload(xhr);
}
};
xdr.onprogress=_101;
xdr.onerror=function(e){
xhr.readyState=0;
if(typeof (xhr.onerror)=="function"){
xhr.onerror(xhr);
}
};
xdr.onload=function(e){
if(_fd<=3){
_101(e);
}
reayState=xhr.readyState=4;
if(typeof (xhr.onreadystatechange)=="function"){
xhr.onreadystatechange(xhr);
}
if(typeof (xhr.onload)=="function"){
xhr.onload(xhr);
}
};
xdr.ontimeout=function(e){
if(typeof (xhr.ontimeout)=="function"){
xhr.ontimeout(xhr);
}
};
xdr.open("POST",_fa);
xdr.timeout=30000;
};
_f8.send=function(_114){
var _115=this._method+" "+this.location.substring(this.location.indexOf("/",9),this.location.indexOf("&.kct"))+" HTTP/1.1\r\n";
for(var i=0;i<this.outer._requestHeaders.length;i++){
_115+=this.outer._requestHeaders[i][0]+": "+this.outer._requestHeaders[i][1]+"\r\n";
}
var _117=_114||"";
if(_117.length>0||this._method.toUpperCase()==="POST"){
var len=0;
for(var i=0;i<_117.length;i++){
len++;
if(_117.charCodeAt(i)>=128){
len++;
}
}
_115+="Content-Length: "+len+"\r\n";
}
_115+="\r\n";
_115+=_117;
this.xdr.send(_115);
};
_f8.abort=function(){
this.xdr.abort();
};
return XDRHttpDirect;
})();
var XMLHttpBridge=(function(){
var _119={"http":80,"https":443};
var _11a=location.protocol.replace(":","");
var _11b=location.port;
if(_11b==null){
_11b=_119[_11a];
}
var _11c=_11a+"://"+location.hostname+":"+_11b;
var _11d={};
var _11e={};
var _11f=0;
function XMLHttpBridge(_120){
this.outer=_120;
};
var _121=XMLHttpBridge.prototype;
_121.open=function(_122,_123){
var id=register(this);
var pipe=supplyPipe(this,_123);
pipe.attach(id);
this._pipe=pipe;
this._method=_122;
this._location=_123;
this.outer.readyState=1;
this.outer.status=0;
this.outer.statusText="";
this.outer.responseText="";
var _126=this;
setTimeout(function(){
_126.outer.readyState=1;
onreadystatechange(_126);
},0);
};
_121.send=function(_127){
doSend(this,_127);
};
_121.abort=function(){
var pipe=this._pipe;
if(pipe!==undefined){
pipe.post(["a",this._id].join(""));
pipe.detach(this._id);
}
};
function onreadystatechange(_129){
if(typeof (_129.onreadystatechange)!=="undefined"){
_129.onreadystatechange(_129.outer);
}
switch(_129.outer.readyState){
case 3:
if(typeof (_129.onprogress)!=="undefined"){
_129.onprogress(_129.outer);
}
break;
case 4:
if(_129.outer.status<100||_129.outer.status>=500){
if(typeof (_129.onerror)!=="undefined"){
_129.onerror(_129.outer);
}
}else{
if(typeof (_129.onprogress)!=="undefined"){
_129.onprogress(_129.outer);
}
if(typeof (_129.onload)!=="undefined"){
_129.onload(_129.outer);
}
}
break;
}
};
function onerror(_12a){
if(typeof (_12a.outer.onerror)!=="undefined"){
_12a.outer.onerror();
}
};
function fromHex(_12b){
return parseInt(_12b,16);
};
function toPaddedHex(_12c,_12d){
var hex=_12c.toString(16);
var _12f=[];
_12d-=hex.length;
while(_12d-->0){
_12f.push("0");
}
_12f.push(hex);
return _12f.join("");
};
function register(_130){
var id=toPaddedHex(_11f++,8);
_11e[id]=_130;
_130._id=id;
return id;
};
function doSend(_132,_133){
if(typeof (_133)!=="string"){
_133="";
}
var _134=_132._method.substring(0,10);
var _135=_132._location;
var _136=_132.outer._requestHeaders;
var _137=toPaddedHex(_132.outer.timeout,4);
var _138=(_132.outer.onprogress!==undefined)?"t":"f";
var _139=["s",_132._id,_134.length,_134,toPaddedHex(_135.length,4),_135,toPaddedHex(_136.length,4)];
for(var i=0;i<_136.length;i++){
var _13b=_136[i];
_139.push(toPaddedHex(_13b[0].length,4));
_139.push(_13b[0]);
_139.push(toPaddedHex(_13b[1].length,4));
_139.push(_13b[1]);
}
_139.push(toPaddedHex(_133.length,8),_133,toPaddedHex(_137,4),_138);
_132._pipe.post(_139.join(""));
};
function supplyPipe(_13c,_13d){
var uri=new URI(_13d);
var _13f=(uri.scheme!=null&&uri.authority!=null);
var _140=_13f?uri.scheme:_11a;
var _141=_13f?uri.authority:_11c;
if(_141!=null&&uri.port==null){
_141=uri.host+":"+_119[_140];
}
var _142=_140+"://"+_141;
var pipe=_11d[_142];
if(pipe!==undefined){
if(!("iframe" in pipe&&"contentWindow" in pipe.iframe&&typeof pipe.iframe.contentWindow=="object")){
pipe=_11d[_142]=undefined;
}
}
if(pipe===undefined){
var _144=document.createElement("iframe");
_144.style.position="absolute";
_144.style.left="-10px";
_144.style.top="10px";
_144.style.visibility="hidden";
_144.style.width="0px";
_144.style.height="0px";
var _145=new URI(_142);
_145.query=".kr=xs";
_145.path="/";
_144.src=_145.toString();
function post(_146){
this.buffer.push(_146);
};
function attach(id){
var _148=this.attached[id];
if(_148===undefined){
_148={};
this.attached[id]=_148;
}
if(_148.timerID!==undefined){
clearTimeout(_148.timerID);
delete _148.timerID;
}
};
function detach(id){
var _14a=this.attached[id];
if(_14a!==undefined&&_14a.timerID===undefined){
var _14b=this;
_14a.timerID=setTimeout(function(){
delete _14b.attached[id];
var xhr=_11e[id];
if(xhr._pipe==pipe){
delete _11e[id];
delete xhr._id;
delete xhr._pipe;
}
postMessage0(pipe.iframe.contentWindow,["d",id].join(""),pipe.targetOrigin);
},0);
}
};
pipe={"targetOrigin":_142,"iframe":_144,"buffer":[],"post":post,"attach":attach,"detach":detach,"attached":{count:0}};
_11d[_142]=pipe;
function sendInitWhenReady(){
var _14d=_144.contentWindow;
if(!_14d){
setTimeout(sendInitWhenReady,20);
}else{
postMessage0(_14d,"I",_142);
}
};
pipe.handshakeID=setTimeout(function(){
_11d[_142]=undefined;
pipe.post=function(_14e){
_13c.readyState=4;
_13c.status=0;
onreadystatechange(_13c);
};
if(pipe.buffer.length>0){
pipe.post();
}
},30000);
document.body.appendChild(_144);
if(typeof (postMessage)==="undefined"){
sendInitWhenReady();
}
}
return pipe;
};
function onmessage(_14f){
var _150=_14f.origin;
var _151={"http":":80","https":":443"};
var _152=_150.split(":");
if(_152.length===2){
_150+=_151[_152[0]];
}
var pipe=_11d[_150];
if(pipe!==undefined&&pipe.iframe!==undefined&&_14f.source==pipe.iframe.contentWindow){
if(_14f.data=="I"){
clearTimeout(pipe.handshakeID);
var _154;
while((_154=pipe.buffer.shift())!==undefined){
postMessage0(pipe.iframe.contentWindow,_154,pipe.targetOrigin);
}
pipe.post=function(_155){
postMessage0(pipe.iframe.contentWindow,_155,pipe.targetOrigin);
};
}else{
var _154=_14f.data;
if(_154.length>=9){
var _156=0;
var type=_154.substring(_156,_156+=1);
var id=_154.substring(_156,_156+=8);
var _159=_11e[id];
if(_159!==undefined){
switch(type){
case "r":
var _15a={};
var _15b=fromHex(_154.substring(_156,_156+=2));
for(var i=0;i<_15b;i++){
var _15d=fromHex(_154.substring(_156,_156+=4));
var _15e=_154.substring(_156,_156+=_15d);
var _15f=fromHex(_154.substring(_156,_156+=4));
var _160=_154.substring(_156,_156+=_15f);
_15a[_15e]=_160;
}
var _161=fromHex(_154.substring(_156,_156+=4));
var _162=fromHex(_154.substring(_156,_156+=2));
var _163=_154.substring(_156,_156+=_162);
switch(_161){
case 301:
case 302:
case 307:
var _164=_15a["Location"];
var _165=_14f.origin;
if(typeof (_159.outer.onredirectallowed)==="function"){
if(!_159.outer.onredirectallowed(_165,_164)){
return;
}
}
var id=register(_159);
var pipe=supplyPipe(_159,_164);
pipe.attach(id);
_159._pipe=pipe;
_159._method="GET";
_159._location=_164;
_159._redirect=true;
break;
case 403:
_159.outer.status=_161;
onreadystatechange(_159);
break;
case 404:
_159.outer.status=_161;
_159.outer.statusText=_163;
onerror(_159);
break;
default:
_159.outer._responseHeaders=_15a;
_159.outer.status=_161;
_159.outer.statusText=_163;
break;
}
break;
case "p":
var _166=parseInt(_154.substring(_156,_156+=1));
if(_159._id===id){
_159.outer.readyState=_166;
var _167=fromHex(_154.substring(_156,_156+=8));
var _168=_154.substring(_156,_156+=_167);
if(_168.length>0){
_159.outer.responseText+=_168;
}
onreadystatechange(_159);
}else{
if(_159._redirect){
_159._redirect=false;
doSend(_159,"");
}
}
if(_166==4){
pipe.detach(id);
}
break;
case "e":
if(_159._id===id){
_159.outer.status=0;
_159.outer.statusText="";
_159.outer.readyState=4;
onreadystatechange(_159);
}
pipe.detach(id);
break;
case "t":
if(_159._id===id){
_159.outer.status=0;
_159.outer.statusText="";
_159.outer.readyState=4;
if(typeof (_159.ontimeout)!=="undefined"){
_159.ontimeout();
}
}
pipe.detach(id);
break;
}
}
}
}
}else{
}
};
window.addEventListener("message",onmessage,false);
return XMLHttpBridge;
})();
var XMLHttpRequest0=(function(){
var _169=location.protocol.replace(":","");
var _16a={"http":80,"https":443};
var _16b=location.port;
if(_16b==null){
_16b=_16a[_169];
}
var _16c=location.hostname+":"+_16b;
function onreadystatechange(_16d){
if(typeof (_16d.onreadystatechange)!=="undefined"){
_16d.onreadystatechange();
}
};
function onprogress(_16e){
if(typeof (_16e.onprogress)!=="undefined"){
_16e.onprogress();
}
};
function onerror(_16f){
if(typeof (_16f.onerror)!=="undefined"){
_16f.onerror();
}
};
function onload(_170){
if(typeof (_170.onload)!=="undefined"){
_170.onload();
}
};
function XMLHttpRequest0(){
this._requestHeaders=[];
this.responseHeaders={};
this.withCredentials=false;
};
var _171=XMLHttpRequest0.prototype;
_171.readyState=0;
_171.responseText="";
_171.status=0;
_171.statusText="";
_171.timeout=0;
_171.onreadystatechange;
_171.onerror;
_171.onload;
_171.onprogress;
_171.onredirectallowed;
_171.open=function(_172,_173,_174){
if(!_174){
throw new Error("Asynchronous is required for cross-origin XMLHttpRequest emulation");
}
switch(this.readyState){
case 0:
case 4:
break;
default:
throw new Error("Invalid ready state");
}
var _175=this;
this._method=_172;
this._location=_173;
this.readyState=1;
this.status=0;
this.statusText="";
this.responseText="";
var xhr;
var _177=new URI(_173);
if(_177.port==null){
_177.port=_16a[_177.scheme];
_177.authority=_177.host+":"+_177.port;
}
if(browser=="ie"&&typeof (XDomainRequest)!=="undefined"&&_177.scheme==_169&&!this.withCredentials){
xhr=new XDRHttpDirect(this);
}else{
if(_177.scheme==_169&&_177.authority==_16c){
try{
xhr=new XMLHttpBridge(this);
}
catch(e){
xhr=new XMLHttpBridge(this);
}
}else{
xhr=new XMLHttpBridge(this);
}
}
xhr.onload=onload;
xhr.onprogress=onprogress;
xhr.onreadystatechange=onreadystatechange;
xhr.onerror=onerror;
xhr.open(_172,_173);
this.xhr=xhr;
setTimeout(function(){
if(_175.readyState>1){
return;
}
if(_175.readyState<1){
_175.readyState=1;
}
onreadystatechange(_175);
},0);
};
_171.setRequestHeader=function(_178,_179){
if(this.readyState!==1){
throw new Error("Invalid ready state");
}
this._requestHeaders.push([_178,_179]);
};
_171.send=function(_17a){
if(this.readyState!==1){
throw new Error("Invalid ready state");
}
var _17b=this;
setTimeout(function(){
if(_17b.readyState>2){
return;
}
if(_17b.readyState<2){
_17b.readyState=2;
}
onreadystatechange(_17b);
},0);
this.xhr.send(_17a);
};
_171.abort=function(){
this.xhr.abort();
};
_171.getResponseHeader=function(_17c){
if(this.status==0){
throw new Error("Invalid ready state");
}
var _17d=this._responseHeaders;
return _17d[_17c];
};
_171.getAllResponseHeaders=function(){
if(this.status==0){
throw new Error("Invalid ready state");
}
return this._responseHeaders;
};
return XMLHttpRequest0;
})();
ByteOrder=function(){
};
(function(){
var _17e=ByteOrder.prototype;
_17e.toString=function(){
throw new Error("Abstract");
};
var _17f=function(v){
return (v&255);
};
var _181=function(_182){
return (_182&128)?(_182|-256):_182;
};
var _183=function(v){
return [((v>>8)&255),(v&255)];
};
var _185=function(_186,_187){
return (_181(_186)<<8)|(_187&255);
};
var _188=function(_189,_18a){
return ((_189&255)<<8)|(_18a&255);
};
var _18b=function(_18c,_18d,_18e){
return ((_18c&255)<<16)|((_18d&255)<<8)|(_18e&255);
};
var _18f=function(v){
return [((v>>16)&255),((v>>8)&255),(v&255)];
};
var _191=function(_192,_193,_194){
return ((_192&255)<<16)|((_193&255)<<8)|(_194&255);
};
var _195=function(v){
return [((v>>24)&255),((v>>16)&255),((v>>8)&255),(v&255)];
};
var _197=function(_198,_199,_19a,_19b){
return (_181(_198)<<24)|((_199&255)<<16)|((_19a&255)<<8)|(_19b&255);
};
var _19c=function(_19d,_19e,_19f,_1a0){
var _1a1=_188(_19d,_19e);
var _1a2=_188(_19f,_1a0);
return (_1a1*65536+_1a2);
};
ByteOrder.BIG_ENDIAN=(function(){
var _1a3=function(){
};
_1a3.prototype=new ByteOrder();
var _1a4=_1a3.prototype;
_1a4._toUnsignedByte=_17f;
_1a4._toByte=_181;
_1a4._fromShort=_183;
_1a4._toShort=_185;
_1a4._toUnsignedShort=_188;
_1a4._toUnsignedMediumInt=_18b;
_1a4._fromMediumInt=_18f;
_1a4._toMediumInt=_191;
_1a4._fromInt=_195;
_1a4._toInt=_197;
_1a4._toUnsignedInt=_19c;
_1a4.toString=function(){
return "<ByteOrder.BIG_ENDIAN>";
};
return new _1a3();
})();
ByteOrder.LITTLE_ENDIAN=(function(){
var _1a5=function(){
};
_1a5.prototype=new ByteOrder();
var _1a6=_1a5.prototype;
_1a6._toByte=_181;
_1a6._toUnsignedByte=_17f;
_1a6._fromShort=function(v){
return _183(v).reverse();
};
_1a6._toShort=function(_1a8,_1a9){
return _185(_1a9,_1a8);
};
_1a6._toUnsignedShort=function(_1aa,_1ab){
return _188(_1ab,_1aa);
};
_1a6._toUnsignedMediumInt=function(_1ac,_1ad,_1ae){
return _18b(_1ae,_1ad,_1ac);
};
_1a6._fromMediumInt=function(v){
return _18f(v).reverse();
};
_1a6._toMediumInt=function(_1b0,_1b1,_1b2,_1b3,_1b4,_1b5){
return _191(_1b5,_1b4,_1b3,_1b2,_1b1,_1b0);
};
_1a6._fromInt=function(v){
return _195(v).reverse();
};
_1a6._toInt=function(_1b7,_1b8,_1b9,_1ba){
return _197(_1ba,_1b9,_1b8,_1b7);
};
_1a6._toUnsignedInt=function(_1bb,_1bc,_1bd,_1be){
return _19c(_1be,_1bd,_1bc,_1bb);
};
_1a6.toString=function(){
return "<ByteOrder.LITTLE_ENDIAN>";
};
return new _1a5();
})();
})();
function ByteBuffer(_1bf){
this.array=_1bf||[];
this._mark=-1;
this.limit=this.capacity=this.array.length;
this.order=ByteOrder.BIG_ENDIAN;
};
(function(){
ByteBuffer.allocate=function(_1c0){
var buf=new ByteBuffer();
buf.capacity=_1c0;
buf.limit=_1c0;
return buf;
};
ByteBuffer.wrap=function(_1c2){
return new ByteBuffer(_1c2);
};
var _1c3=ByteBuffer.prototype;
_1c3.autoExpand=true;
_1c3.capacity=0;
_1c3.position=0;
_1c3.limit=0;
_1c3.order=ByteOrder.BIG_ENDIAN;
_1c3.array=[];
_1c3.mark=function(){
this._mark=this.position;
return this;
};
_1c3.reset=function(){
var m=this._mark;
if(m<0){
throw new Error("Invalid mark");
}
this.position=m;
return this;
};
_1c3.compact=function(){
this.array.splice(0,this.position);
this.limit-=this.position;
this.position=0;
return this;
};
_1c3.duplicate=function(){
var buf=new ByteBuffer(this.array);
buf.position=this.position;
buf.limit=this.limit;
buf.capacity=this.capacity;
return buf;
};
_1c3.fill=function(size){
_autoExpand(this,size);
while(size-->0){
this.put(0);
}
return this;
};
_1c3.fillWith=function(b,size){
_autoExpand(this,size);
while(size-->0){
this.put(b);
}
return this;
};
_1c3.indexOf=function(b){
var _1ca=this.limit;
var _1cb=this.array;
for(var i=this.position;i<_1ca;i++){
if(_1cb[i]==b){
return i;
}
}
return -1;
};
_1c3.put=function(v){
_autoExpand(this,1);
this.array[this.position++]=v&255;
return this;
};
_1c3.putAt=function(_1ce,v){
_checkForWriteAt(this,_1ce,1);
this.array[_1ce]=v&255;
return this;
};
_1c3.putUnsigned=function(v){
_autoExpand(this,1);
this.array[this.position++]=v&255;
return this;
};
_1c3.putUnsignedAt=function(_1d1,v){
_checkForWriteAt(this,_1d1,1);
this.array[_1d1]=v&255;
return this;
};
_1c3.putShort=function(v){
_autoExpand(this,2);
_putBytesInternal(this,this.position,this.order._fromShort(v));
this.position+=2;
return this;
};
_1c3.putShortAt=function(_1d4,v){
_checkForWriteAt(this,_1d4,2);
_putBytesInternal(this,_1d4,this.order._fromShort(v));
return this;
};
_1c3.putUnsignedShort=function(v){
_autoExpand(this,2);
_putBytesInternal(this,this.position,this.order._fromShort(v&65535));
this.position+=2;
return this;
};
_1c3.putUnsignedShortAt=function(_1d7,v){
_checkForWriteAt(this,_1d7,2);
_putBytesInternal(this,_1d7,this.order._fromShort(v&65535));
return this;
};
_1c3.putMediumInt=function(v){
_autoExpand(this,3);
this.putMediumIntAt(this.position,v);
this.position+=3;
return this;
};
_1c3.putMediumIntAt=function(_1da,v){
this.putBytesAt(_1da,this.order._fromMediumInt(v));
return this;
};
_1c3.putInt=function(v){
_autoExpand(this,4);
_putBytesInternal(this,this.position,this.order._fromInt(v));
this.position+=4;
return this;
};
_1c3.putIntAt=function(_1dd,v){
_checkForWriteAt(this,_1dd,4);
_putBytesInternal(this,_1dd,this.order._fromInt(v));
return this;
};
_1c3.putUnsignedInt=function(v){
_autoExpand(this,4);
this.putUnsignedIntAt(this.position,v&4294967295);
this.position+=4;
return this;
};
_1c3.putUnsignedIntAt=function(_1e0,v){
_checkForWriteAt(this,_1e0,4);
this.putIntAt(_1e0,v&4294967295);
return this;
};
_1c3.putString=function(v,cs){
cs.encode(v,this);
return this;
};
_1c3.putPrefixedString=function(_1e4,v,cs){
if(typeof (cs)==="undefined"||typeof (cs.encode)==="undefined"){
throw new Error("ByteBuffer.putPrefixedString: character set parameter missing");
}
if(_1e4===0){
return this;
}
_autoExpand(this,_1e4);
var len=v.length;
switch(_1e4){
case 1:
this.put(len);
break;
case 2:
this.putShort(len);
break;
case 4:
this.putInt(len);
break;
}
cs.encode(v,this);
return this;
};
function _putBytesInternal(_1e8,_1e9,v){
var _1eb=_1e8.array;
for(var i=0;i<v.length;i++){
_1eb[i+_1e9]=v[i]&255;
}
};
_1c3.putBytes=function(v){
_autoExpand(this,v.length);
_putBytesInternal(this,this.position,v);
this.position+=v.length;
return this;
};
_1c3.putBytesAt=function(_1ee,v){
_checkForWriteAt(this,_1ee,v.length);
_putBytesInternal(this,_1ee,v);
return this;
};
_1c3.putByteArray=function(v){
_autoExpand(this,v.byteLength);
var u=new Uint8Array(v);
for(var i=0;i<u.byteLength;i++){
this.putAt(this.position+i,u[i]&255);
}
this.position+=v.byteLength;
return this;
};
_1c3.putBuffer=function(v){
var len=v.remaining();
_autoExpand(this,len);
var _1f5=v.array;
var _1f6=v.position;
var _1f7=this.position;
for(var i=0;i<len;i++){
this.array[i+_1f7]=_1f5[i+_1f6];
}
this.position+=len;
return this;
};
_1c3.putBufferAt=function(_1f9,v){
var len=v.remaining();
_autoExpand(this,len);
var _1fc=v.array;
var _1fd=v.position;
var _1fe=this.position;
for(var i=0;i<len;i++){
this.array[i+_1fe]=_1fc[i+_1fd];
}
return this;
};
_1c3.get=function(){
_checkForRead(this,1);
return this.order._toByte(this.array[this.position++]);
};
_1c3.getAt=function(_200){
_checkForReadAt(this,_200,1);
return this.order._toByte(this.array[_200]);
};
_1c3.getUnsigned=function(){
_checkForRead(this,1);
var val=this.order._toUnsignedByte(this.array[this.position++]);
return val;
};
_1c3.getUnsignedAt=function(_202){
_checkForReadAt(this,_202,1);
return this.order._toUnsignedByte(this.array[_202]);
};
_1c3.getBytes=function(size){
_checkForRead(this,size);
var _204=new Array();
for(var i=0;i<size;i++){
_204.push(this.order._toByte(this.array[i+this.position]));
}
this.position+=size;
return _204;
};
_1c3.getBytesAt=function(_206,size){
_checkForReadAt(this,_206,size);
var _208=new Array();
var _209=this.array;
for(var i=0;i<size;i++){
_208.push(_209[i+_206]);
}
return _208;
};
_1c3.getBlob=function(size){
var _20c=this.array.slice(this.position,size);
this.position+=size;
return BlobUtils.fromNumberArray(_20c);
};
_1c3.getBlobAt=function(_20d,size){
var _20f=this.getBytesAt(_20d,size);
return BlobUtils.fromNumberArray(_20f);
};
_1c3.getArrayBuffer=function(size){
var u=new Uint8Array(size);
u.set(this.array.slice(this.position,size));
this.position+=size;
return u.buffer;
};
_1c3.getShort=function(){
_checkForRead(this,2);
var val=this.getShortAt(this.position);
this.position+=2;
return val;
};
_1c3.getShortAt=function(_213){
_checkForReadAt(this,_213,2);
var _214=this.array;
return this.order._toShort(_214[_213++],_214[_213++]);
};
_1c3.getUnsignedShort=function(){
_checkForRead(this,2);
var val=this.getUnsignedShortAt(this.position);
this.position+=2;
return val;
};
_1c3.getUnsignedShortAt=function(_216){
_checkForReadAt(this,_216,2);
var _217=this.array;
return this.order._toUnsignedShort(_217[_216++],_217[_216++]);
};
_1c3.getUnsignedMediumInt=function(){
var _218=this.array;
return this.order._toUnsignedMediumInt(_218[this.position++],_218[this.position++],_218[this.position++]);
};
_1c3.getMediumInt=function(){
var val=this.getMediumIntAt(this.position);
this.position+=3;
return val;
};
_1c3.getMediumIntAt=function(i){
var _21b=this.array;
return this.order._toMediumInt(_21b[i++],_21b[i++],_21b[i++]);
};
_1c3.getInt=function(){
_checkForRead(this,4);
var val=this.getIntAt(this.position);
this.position+=4;
return val;
};
_1c3.getIntAt=function(_21d){
_checkForReadAt(this,_21d,4);
var _21e=this.array;
return this.order._toInt(_21e[_21d++],_21e[_21d++],_21e[_21d++],_21e[_21d++]);
};
_1c3.getUnsignedInt=function(){
_checkForRead(this,4);
var val=this.getUnsignedIntAt(this.position);
this.position+=4;
return val;
};
_1c3.getUnsignedIntAt=function(_220){
_checkForReadAt(this,_220,4);
var _221=this.array;
return this.order._toUnsignedInt(_221[_220++],_221[_220++],_221[_220++],_221[_220++]);
return val;
};
_1c3.getPrefixedString=function(_222,cs){
var len=0;
switch(_222||2){
case 1:
len=this.getUnsigned();
break;
case 2:
len=this.getUnsignedShort();
break;
case 4:
len=this.getInt();
break;
}
if(len===0){
return "";
}
var _225=this.limit;
try{
this.limit=this.position+len;
return cs.decode(this);
}
finally{
this.limit=_225;
}
};
_1c3.getString=function(cs){
try{
return cs.decode(this);
}
finally{
this.position=this.limit;
}
};
_1c3.slice=function(){
return new ByteBuffer(this.array.slice(this.position,this.limit));
};
_1c3.flip=function(){
this.limit=this.position;
this.position=0;
this._mark=-1;
return this;
};
_1c3.rewind=function(){
this.position=0;
this._mark=-1;
return this;
};
_1c3.clear=function(){
this.position=0;
this.limit=this.capacity;
this._mark=-1;
return this;
};
_1c3.remaining=function(){
return (this.limit-this.position);
};
_1c3.hasRemaining=function(){
return (this.limit>this.position);
};
_1c3.skip=function(size){
this.position+=size;
return this;
};
_1c3.getHexDump=function(){
var _228=this.array;
var pos=this.position;
var _22a=this.limit;
if(pos==_22a){
return "empty";
}
var _22b=[];
for(var i=pos;i<_22a;i++){
var hex=(_228[i]||0).toString(16);
if(hex.length==1){
hex="0"+hex;
}
_22b.push(hex);
}
return _22b.join(" ");
};
_1c3.toString=_1c3.getHexDump;
_1c3.expand=function(_22e){
return this.expandAt(this.position,_22e);
};
_1c3.expandAt=function(i,_230){
var end=i+_230;
if(end>this.capacity){
this.capacity=end;
}
if(end>this.limit){
this.limit=end;
}
return this;
};
function _autoExpand(_232,_233){
if(_232.autoExpand){
_232.expand(_233);
}
return _232;
};
function _checkForRead(_234,_235){
var end=_234.position+_235;
if(end>_234.limit){
throw new Error("Buffer underflow");
}
return _234;
};
function _checkForReadAt(_237,_238,_239){
var end=_238+_239;
if(_238<0||end>_237.limit){
throw new Error("Index out of bounds");
}
return _237;
};
function _checkForWriteAt(_23b,_23c,_23d){
var end=_23c+_23d;
if(_23c<0||end>_23b.limit){
throw new Error("Index out of bounds");
}
return _23b;
};
})();
function Charset(){
};
(function(){
var _23f=Charset.prototype;
_23f.decode=function(buf){
};
_23f.encode=function(str,buf){
};
Charset.UTF8=(function(){
function UTF8(){
};
UTF8.prototype=new Charset();
var _243=UTF8.prototype;
_243.decode=function(buf){
var _245=buf.remaining();
var _246=_245<10000;
var _247=[];
var _248=buf.array;
var _249=buf.position;
var _24a=_249+_245;
var _24b,_24c,_24d,_24e;
for(var i=_249;i<_24a;i++){
_24b=(_248[i]&255);
var _250=charByteCount(_24b);
var _251=_24a-i;
if(_251<_250){
break;
}
var _252=null;
switch(_250){
case 1:
_252=_24b;
break;
case 2:
i++;
_24c=(_248[i]&255);
_252=((_24b&31)<<6)|(_24c&63);
break;
case 3:
i++;
_24c=(_248[i]&255);
i++;
_24d=(_248[i]&255);
_252=((_24b&15)<<12)|((_24c&63)<<6)|(_24d&63);
break;
case 4:
i++;
_24c=(_248[i]&255);
i++;
_24d=(_248[i]&255);
i++;
_24e=(_248[i]&255);
_252=((_24b&7)<<18)|((_24c&63)<<12)|((_24d&63)<<6)|(_24e&63);
break;
}
if(_246){
_247.push(_252);
}else{
_247.push(String.fromCharCode(_252));
}
}
if(_246){
return String.fromCharCode.apply(null,_247);
}else{
return _247.join("");
}
};
_243.encode=function(str,buf){
var _255=buf.position;
var mark=_255;
var _257=buf.array;
for(var i=0;i<str.length;i++){
var _259=str.charCodeAt(i);
if(_259<128){
_257[_255++]=_259;
}else{
if(_259<2048){
_257[_255++]=(_259>>6)|192;
_257[_255++]=(_259&63)|128;
}else{
if(_259<65536){
_257[_255++]=(_259>>12)|224;
_257[_255++]=((_259>>6)&63)|128;
_257[_255++]=(_259&63)|128;
}else{
if(_259<1114112){
_257[_255++]=(_259>>18)|240;
_257[_255++]=((_259>>12)&63)|128;
_257[_255++]=((_259>>6)&63)|128;
_257[_255++]=(_259&63)|128;
}else{
throw new Error("Invalid UTF-8 string");
}
}
}
}
}
buf.position=_255;
buf.expandAt(_255,_255-mark);
};
_243.encodeAsByteArray=function(str){
var _25b=new Array();
for(var i=0;i<str.length;i++){
var _25d=str.charCodeAt(i);
if(_25d<128){
_25b.push(_25d);
}else{
if(_25d<2048){
_25b.push((_25d>>6)|192);
_25b.push((_25d&63)|128);
}else{
if(_25d<65536){
_25b.push((_25d>>12)|224);
_25b.push(((_25d>>6)&63)|128);
_25b.push((_25d&63)|128);
}else{
if(_25d<1114112){
_25b.push((_25d>>18)|240);
_25b.push(((_25d>>12)&63)|128);
_25b.push(((_25d>>6)&63)|128);
_25b.push((_25d&63)|128);
}else{
throw new Error("Invalid UTF-8 string");
}
}
}
}
}
return _25b;
};
_243.encodeByteArray=function(_25e){
var _25f=_25e.length;
var _260=[];
for(var i=0;i<_25f;i++){
var _262=_25e[i];
if(_262<128){
_260.push(_262);
}else{
if(_262<2048){
_260.push((_262>>6)|192);
_260.push((_262&63)|128);
}else{
if(_262<65536){
_260.push((_262>>12)|224);
_260.push(((_262>>6)&63)|128);
_260.push((_262&63)|128);
}else{
if(_262<1114112){
_260.push((_262>>18)|240);
_260.push(((_262>>12)&63)|128);
_260.push(((_262>>6)&63)|128);
_260.push((_262&63)|128);
}else{
throw new Error("Invalid UTF-8 string");
}
}
}
}
}
return String.fromCharCode.apply(null,_260);
};
_243.encodeArrayBuffer=function(_263){
var buf=new Uint8Array(_263);
var _265=buf.length;
var _266=[];
for(var i=0;i<_265;i++){
var _268=buf[i];
if(_268<128){
_266.push(_268);
}else{
if(_268<2048){
_266.push((_268>>6)|192);
_266.push((_268&63)|128);
}else{
if(_268<65536){
_266.push((_268>>12)|224);
_266.push(((_268>>6)&63)|128);
_266.push((_268&63)|128);
}else{
if(_268<1114112){
_266.push((_268>>18)|240);
_266.push(((_268>>12)&63)|128);
_266.push(((_268>>6)&63)|128);
_266.push((_268&63)|128);
}else{
throw new Error("Invalid UTF-8 string");
}
}
}
}
}
return String.fromCharCode.apply(null,_266);
};
_243.toByteArray=function(str){
var _26a=[];
var _26b,_26c,_26d,_26e;
var _26f=str.length;
for(var i=0;i<_26f;i++){
_26b=(str.charCodeAt(i)&255);
var _271=charByteCount(_26b);
var _272=null;
if(_271+i>_26f){
break;
}
switch(_271){
case 1:
_272=_26b;
break;
case 2:
i++;
_26c=(str.charCodeAt(i)&255);
_272=((_26b&31)<<6)|(_26c&63);
break;
case 3:
i++;
_26c=(str.charCodeAt(i)&255);
i++;
_26d=(str.charCodeAt(i)&255);
_272=((_26b&15)<<12)|((_26c&63)<<6)|(_26d&63);
break;
case 4:
i++;
_26c=(str.charCodeAt(i)&255);
i++;
_26d=(str.charCodeAt(i)&255);
i++;
_26e=(str.charCodeAt(i)&255);
_272=((_26b&7)<<18)|((_26c&63)<<12)|((_26d&63)<<6)|(_26e&63);
break;
}
_26a.push(_272&255);
}
return _26a;
};
function charByteCount(b){
if((b&128)===0){
return 1;
}
if((b&32)===0){
return 2;
}
if((b&16)===0){
return 3;
}
if((b&8)===0){
return 4;
}
throw new Error("Invalid UTF-8 bytes");
};
return new UTF8();
})();
})();
(function(){
var _274="WebSocket";
var _275=function(name){
this._name=name;
this._level=_275.Level.INFO;
};
(function(){
_275.Level={OFF:8,SEVERE:7,WARNING:6,INFO:5,CONFIG:4,FINE:3,FINER:2,FINEST:1,ALL:0};
var _277;
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name==="kaazing:logging"){
_277=tags[i].content;
break;
}
}
_275._logConf={};
if(_277){
var _27a=_277.split(",");
for(var i=0;i<_27a.length;i++){
var _27b=_27a[i].split("=");
_275._logConf[_27b[0]]=_27b[1];
}
}
var _27c={};
_275.getLogger=function(name){
var _27e=_27c[name];
if(_27e===undefined){
_27e=new _275(name);
_27c[name]=_27e;
}
return _27e;
};
var _27f=_275.prototype;
_27f.setLevel=function(_280){
if(_280&&_280>=_275.Level.ALL&&_280<=_275.Level.OFF){
this._level=_280;
}
};
_27f.isLoggable=function(_281){
for(var _282 in _275._logConf){
if(_275._logConf.hasOwnProperty(_282)){
if(this._name.match(_282)){
var _283=_275._logConf[_282];
if(_283){
return (_275.Level[_283]<=_281);
}
}
}
}
return (this._level<=_281);
};
var noop=function(){
};
var _285={};
_285[_275.Level.OFF]=noop;
_285[_275.Level.SEVERE]=(window.console)?(console.error||console.log||noop):noop;
_285[_275.Level.WARNING]=(window.console)?(console.warn||console.log||noop):noop;
_285[_275.Level.INFO]=(window.console)?(console.info||console.log||noop):noop;
_285[_275.Level.CONFIG]=(window.console)?(console.info||console.log||noop):noop;
_285[_275.Level.FINE]=(window.console)?(console.debug||console.log||noop):noop;
_285[_275.Level.FINER]=(window.console)?(console.debug||console.log||noop):noop;
_285[_275.Level.FINEST]=(window.console)?(console.debug||console.log||noop):noop;
_285[_275.Level.ALL]=(window.console)?(console.log||noop):noop;
_27f.config=function(_286,_287){
this.log(_275.Level.CONFIG,_286,_287);
};
_27f.entering=function(_288,name,_28a){
if(this.isLoggable(_275.Level.FINER)){
if(browser=="chrome"||browser=="safari"){
_288=console;
}
var _28b=_285[_275.Level.FINER];
if(_28a){
if(typeof (_28b)=="object"){
_28b("ENTRY "+name,_28a);
}else{
_28b.call(_288,"ENTRY "+name,_28a);
}
}else{
if(typeof (_28b)=="object"){
_28b("ENTRY "+name);
}else{
_28b.call(_288,"ENTRY "+name);
}
}
}
};
_27f.exiting=function(_28c,name,_28e){
if(this.isLoggable(_275.Level.FINER)){
var _28f=_285[_275.Level.FINER];
if(browser=="chrome"||browser=="safari"){
_28c=console;
}
if(_28e){
if(typeof (_28f)=="object"){
_28f("RETURN "+name,_28e);
}else{
_28f.call(_28c,"RETURN "+name,_28e);
}
}else{
if(typeof (_28f)=="object"){
_28f("RETURN "+name);
}else{
_28f.call(_28c,"RETURN "+name);
}
}
}
};
_27f.fine=function(_290,_291){
this.log(_275.Level.FINE,_290,_291);
};
_27f.finer=function(_292,_293){
this.log(_275.Level.FINER,_292,_293);
};
_27f.finest=function(_294,_295){
this.log(_275.Level.FINEST,_294,_295);
};
_27f.info=function(_296,_297){
this.log(_275.Level.INFO,_296,_297);
};
_27f.log=function(_298,_299,_29a){
if(this.isLoggable(_298)){
var _29b=_285[_298];
if(browser=="chrome"||browser=="safari"){
_299=console;
}
if(typeof (_29b)=="object"){
_29b(_29a);
}else{
_29b.call(_299,_29a);
}
}
};
_27f.severe=function(_29c,_29d){
this.log(_275.Level.SEVERE,_29c,_29d);
};
_27f.warning=function(_29e,_29f){
this.log(_275.Level.WARNING,_29e,_29f);
};
})();
var ULOG=_275.getLogger("com.kaazing.gateway.client.loader.Utils");
var _2a1=function(key){
ULOG.entering(this,"Utils.getMetaValue",key);
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name===key){
var v=tags[i].content;
ULOG.exiting(this,"Utils.getMetaValue",v);
return v;
}
}
ULOG.exiting(this,"Utils.getMetaValue");
};
var _2a6=function(_2a7){
ULOG.entering(this,"Utils.arrayCopy",_2a7);
var _2a8=[];
for(var i=0;i<_2a7.length;i++){
_2a8.push(_2a7[i]);
}
return _2a8;
};
var _2aa=function(_2ab,_2ac){
ULOG.entering(this,"Utils.arrayFilter",{"array":_2ab,"callback":_2ac});
var _2ad=[];
for(var i=0;i<_2ab.length;i++){
var elt=_2ab[i];
if(_2ac(elt)){
_2ad.push(_2ab[i]);
}
}
return _2ad;
};
var _2b0=function(_2b1,_2b2){
ULOG.entering(this,"Utils.indexOf",{"array":_2b1,"searchElement":_2b2});
for(var i=0;i<_2b1.length;i++){
if(_2b1[i]==_2b2){
ULOG.exiting(this,"Utils.indexOf",i);
return i;
}
}
ULOG.exiting(this,"Utils.indexOf",-1);
return -1;
};
var _2b4=function(s){
ULOG.entering(this,"Utils.decodeByteString",s);
var a=[];
for(var i=0;i<s.length;i++){
a.push(s.charCodeAt(i)&255);
}
var buf=new ByteBuffer(a);
var v=_2ba(buf,Charset.UTF8);
ULOG.exiting(this,"Utils.decodeByteString",v);
return v;
};
var _2bb=function(_2bc){
ULOG.entering(this,"Utils.decodeArrayBuffer",_2bc);
var buf=new Uint8Array(_2bc);
var a=[];
for(var i=0;i<buf.length;i++){
a.push(buf[i]);
}
var buf=new ByteBuffer(a);
var s=_2ba(buf,Charset.UTF8);
ULOG.exiting(this,"Utils.decodeArrayBuffer",s);
return s;
};
var _2c1=function(_2c2){
ULOG.entering(this,"Utils.decodeArrayBuffer2ByteBuffer");
var buf=new Uint8Array(_2c2);
var a=[];
for(var i=0;i<buf.length;i++){
a.push(buf[i]);
}
ULOG.exiting(this,"Utils.decodeArrayBuffer2ByteBuffer");
return new ByteBuffer(a);
};
var _2c6=String.fromCharCode(127);
var NULL=String.fromCharCode(0);
var _2c8="\n";
var _2c9=function(buf){
ULOG.entering(this,"Utils.encodeEscapedByte",buf);
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
var chr=String.fromCharCode(n);
switch(chr){
case _2c6:
a.push(_2c6);
a.push(_2c6);
break;
case NULL:
a.push(_2c6);
a.push("0");
break;
case _2c8:
a.push(_2c6);
a.push("n");
break;
default:
a.push(chr);
}
}
var v=a.join("");
ULOG.exiting(this,"Utils.encodeEscapedBytes",v);
return v;
};
var _2cf=function(buf,_2d1){
ULOG.entering(this,"Utils.encodeByteString",{"buf":buf,"requiresEscaping":_2d1});
if(_2d1){
return _2c9(buf);
}else{
var _2d2=buf.array;
var _2d3=(buf.position==0&&buf.limit==_2d2.length)?_2d2:buf.getBytes(buf.remaining());
var _2d4=!(XMLHttpRequest.prototype.sendAsBinary);
for(var i=_2d3.length-1;i>=0;i--){
var _2d6=_2d3[i];
if(_2d6==0&&_2d4){
_2d3[i]=256;
}else{
if(_2d6<0){
_2d3[i]=_2d6&255;
}
}
}
var _2d7=0;
var _2d8=[];
do{
var _2d9=Math.min(_2d3.length-_2d7,10000);
partOfBytes=_2d3.slice(_2d7,_2d7+_2d9);
_2d7+=_2d9;
_2d8.push(String.fromCharCode.apply(null,partOfBytes));
}while(_2d7<_2d3.length);
var _2da=_2d8.join("");
if(_2d3===_2d2){
for(var i=_2d3.length-1;i>=0;i--){
var _2d6=_2d3[i];
if(_2d6==256){
_2d3[i]=0;
}
}
}
ULOG.exiting(this,"Utils.encodeByteString",_2da);
return _2da;
}
};
var _2ba=function(buf,cs){
var _2dd=buf.position;
var _2de=buf.limit;
var _2df=buf.array;
while(_2dd<_2de){
_2dd++;
}
try{
buf.limit=_2dd;
return cs.decode(buf);
}
finally{
if(_2dd!=_2de){
buf.limit=_2de;
buf.position=_2dd+1;
}
}
};
var _2e0=window.WebSocket;
var _2e1=(function(){
var _2e2=_275.getLogger("WebSocketNativeProxy");
var _2e3=function(){
this.parent;
this._listener;
this.code=1005;
this.reason="";
};
var _2e4=(browser=="safari"&&typeof (_2e0.CLOSING)=="undefined");
var _2e5=(browser=="android");
var _2e6=_2e3.prototype;
_2e6.connect=function(_2e7,_2e8){
_2e2.entering(this,"WebSocketNativeProxy.<init>",{"location":_2e7,"protocol":_2e8});
if((typeof (_2e0)==="undefined")||_2e5){
doError(this);
return;
}
if(_2e7.indexOf("javascript:")==0){
_2e7=_2e7.substr("javascript:".length);
}
var _2e9=_2e7.indexOf("?");
if(_2e9!=-1){
if(!/[\?&]\.kl=Y/.test(_2e7.substring(_2e9))){
_2e7+="&.kl=Y";
}
}else{
_2e7+="?.kl=Y";
}
this._sendQueue=[];
try{
if(_2e8){
this._requestedProtocol=_2e8;
this._delegate=new _2e0(_2e7,_2e8);
}else{
this._delegate=new _2e0(_2e7);
}
this._delegate.binaryType="arraybuffer";
}
catch(e){
_2e2.severe(this,"WebSocketNativeProxy.<init> "+e);
doError(this);
return;
}
bindHandlers(this);
};
_2e6.onerror=function(){
};
_2e6.onmessage=function(){
};
_2e6.onopen=function(){
};
_2e6.onclose=function(){
};
_2e6.close=function(code,_2eb){
_2e2.entering(this,"WebSocketNativeProxy.close");
if(code){
if(_2e4){
doCloseDraft76Compat(this,code,_2eb);
}else{
this._delegate.close(code,_2eb);
}
}else{
this._delegate.close();
}
};
function doCloseDraft76Compat(_2ec,code,_2ee){
_2ec.code=code|1005;
_2ec.reason=_2ee|"";
_2ec._delegate.close();
};
_2e6.send=function(_2ef){
_2e2.entering(this,"WebSocketNativeProxy.send",_2ef);
doSend(this,_2ef);
return;
};
_2e6.setListener=function(_2f0){
this._listener=_2f0;
};
_2e6.setIdleTimeout=function(_2f1){
_2e2.entering(this,"WebSocketNativeProxy.setIdleTimeout",_2f1);
this.lastMessageTimestamp=new Date().getTime();
this.idleTimeout=_2f1;
startIdleTimer(this,_2f1);
return;
};
function doSend(_2f2,_2f3){
_2e2.entering(this,"WebSocketNativeProxy.doSend",_2f3);
if(typeof (_2f3)=="string"){
_2f2._delegate.send(_2f3);
}else{
if(_2f3.byteLength||_2f3.size){
_2f2._delegate.send(_2f3);
}else{
if(_2f3.constructor==ByteBuffer){
_2f2._delegate.send(_2f3.getArrayBuffer(_2f3.remaining()));
}else{
_2e2.severe(this,"WebSocketNativeProxy.doSend called with unkown type "+typeof (_2f3));
throw new Error("Cannot call send() with that type");
}
}
}
};
function doError(_2f4,e){
_2e2.entering(this,"WebSocketNativeProxy.doError",e);
setTimeout(function(){
_2f4._listener.connectionFailed(_2f4.parent);
},0);
};
function encodeMessageData(_2f6,e){
var buf;
if(typeof e.data.byteLength!=="undefined"){
buf=_2c1(e.data);
}else{
buf=ByteBuffer.allocate(e.data.length);
if(_2f6.parent._isBinary&&_2f6.parent._balanced>1){
for(var i=0;i<e.data.length;i++){
buf.put(e.data.charCodeAt(i));
}
}else{
buf.putString(e.data,Charset.UTF8);
}
buf.flip();
}
return buf;
};
function messageHandler(_2fa,e){
_2e2.entering(this,"WebSocketNativeProxy.messageHandler",e);
_2fa.lastMessageTimestamp=new Date().getTime();
if(typeof (e.data)==="string"){
_2fa._listener.textMessageReceived(_2fa.parent,e.data);
}else{
_2fa._listener.binaryMessageReceived(_2fa.parent,e.data);
}
};
function closeHandler(_2fc,e){
_2e2.entering(this,"WebSocketNativeProxy.closeHandler",e);
unbindHandlers(_2fc);
if(_2e4){
_2fc._listener.connectionClosed(_2fc.parent,true,_2fc.code,_2fc.reason);
}else{
_2fc._listener.connectionClosed(_2fc.parent,e.wasClean,e.code,e.reason);
}
};
function errorHandler(_2fe,e){
_2e2.entering(this,"WebSocketNativeProxy.errorHandler",e);
_2fe._listener.connectionError(_2fe.parent,e);
};
function openHandler(_300,e){
_2e2.entering(this,"WebSocketNativeProxy.openHandler",e);
if(_2e4){
_300._delegate.protocol=_300._requestedProtocol;
}
_300._listener.connectionOpened(_300.parent,_300._delegate.protocol);
};
function bindHandlers(_302){
_2e2.entering(this,"WebSocketNativeProxy.bindHandlers");
var _303=_302._delegate;
_303.onopen=function(e){
openHandler(_302,e);
};
_303.onmessage=function(e){
messageHandler(_302,e);
};
_303.onclose=function(e){
closeHandler(_302,e);
};
_303.onerror=function(e){
errorHandler(_302,e);
};
_302.readyState=function(){
return _303.readyState;
};
};
function unbindHandlers(_308){
_2e2.entering(this,"WebSocketNativeProxy.unbindHandlers");
var _309=_308._delegate;
_309.onmessage=undefined;
_309.onclose=undefined;
_309.onopen=undefined;
_309.onerror=undefined;
_308.readyState=WebSocket.CLOSED;
};
function startIdleTimer(_30a,_30b){
stopIdleTimer(_30a);
_30a.idleTimer=setTimeout(function(){
idleTimerHandler(_30a);
},_30b);
};
function idleTimerHandler(_30c){
var _30d=new Date().getTime();
var _30e=_30d-_30c.lastMessageTimestamp;
var _30f=_30c.idleTimeout;
if(_30e>_30f){
try{
var _310=_30c._delegate;
if(_310){
unbindHandlers(_30c);
_310.close();
}
}
finally{
_30c._listener.connectionClosed(_30c.parent,false,1006,"");
}
}else{
startIdleTimer(_30c,_30f-_30e);
}
};
function stopIdleTimer(_311){
if(_311.idleTimer!=null){
clearTimeout(_311.idleTimer);
_311.IdleTimer=null;
}
};
return _2e3;
})();
var _312=(function(){
var _313=_275.getLogger("WebSocketEmulatedFlashProxy");
var _314=function(){
this.parent;
this._listener;
};
var _315=_314.prototype;
_315.connect=function(_316,_317){
_313.entering(this,"WebSocketEmulatedFlashProxy.<init>",_316);
this.URL=_316;
try{
_318(this,_316,_317);
}
catch(e){
_313.severe(this,"WebSocketEmulatedFlashProxy.<init> "+e);
doError(this,e);
}
this.constructor=_314;
_313.exiting(this,"WebSocketEmulatedFlashProxy.<init>");
};
_315.setListener=function(_319){
this._listener=_319;
};
_314._flashBridge={};
_314._flashBridge.readyWaitQueue=[];
_314._flashBridge.failWaitQueue=[];
_314._flashBridge.flashHasLoaded=false;
_314._flashBridge.flashHasFailed=false;
_315.URL="";
_315.readyState=0;
_315.bufferedAmount=0;
_315.connectionOpened=function(_31a,_31b){
var _31b=_31b.split("\n");
for(var i=0;i<_31b.length;i++){
var _31d=_31b[i].split(":");
_31a.responseHeaders[_31d[0]]=_31d[1];
}
this._listener.connectionOpened(_31a,"");
};
_315.connectionClosed=function(_31e,_31f,code,_321){
this._listener.connectionClosed(_31e,_31f,code,_321);
};
_315.connectionFailed=function(_322){
this._listener.connectionFailed(_322);
};
_315.binaryMessageReceived=function(_323,data){
this._listener.binaryMessageReceived(_323,data);
};
_315.textMessageReceived=function(_325,s){
this._listener.textMessageReceived(_325,s);
};
_315.redirected=function(_327,_328){
this._listener.redirected(_327,_328);
};
_315.authenticationRequested=function(_329,_32a,_32b){
this._listener.authenticationRequested(_329,_32a,_32b);
};
_315.send=function(data){
_313.entering(this,"WebSocketEmulatedFlashProxy.send",data);
switch(this.readyState){
case 0:
_313.severe(this,"WebSocketEmulatedFlashProxy.send: readyState is 0");
throw new Error("INVALID_STATE_ERR");
break;
case 1:
if(data===null){
_313.severe(this,"WebSocketEmulatedFlashProxy.send: Data is null");
throw new Error("data is null");
}
if(typeof (data)=="string"){
_314._flashBridge.sendText(this._instanceId,data);
}else{
if(data.constructor==ByteBuffer){
var _32d;
var a=[];
while(data.remaining()){
a.push(String.fromCharCode(data.get()));
}
var _32d=a.join("");
_314._flashBridge.sendByteString(this._instanceId,_32d);
}else{
if(data.byteLength){
var _32d;
var a=[];
var _32f=new DataView(data);
for(var i=0;i<data.byteLength;i++){
a.push(String.fromCharCode(_32f.getUint8(i)));
}
var _32d=a.join("");
_314._flashBridge.sendByteString(this._instanceId,_32d);
}else{
if(data.size){
var _331=this;
var cb=function(_333){
_314._flashBridge.sendByteString(_331._instanceId,_333);
};
BlobUtils.asBinaryString(cb,data);
return;
}else{
_313.severe(this,"WebSocketEmulatedFlashProxy.send: Data is on invalid type "+typeof (data));
throw new Error("Invalid type");
}
}
}
}
_334(this);
return true;
break;
case 2:
return false;
break;
default:
_313.severe(this,"WebSocketEmulatedFlashProxy.send: Invalid readyState "+this.readyState);
throw new Error("INVALID_STATE_ERR");
}
};
_315.close=function(code,_336){
_313.entering(this,"WebSocketEmulatedFlashProxy.close");
switch(this.readyState){
case 0:
case 1:
_314._flashBridge.disconnect(this._instanceId,code,_336);
break;
}
};
_315.disconnect=_315.close;
var _334=function(_337){
_313.entering(this,"WebSocketEmulatedFlashProxy.updateBufferedAmount");
_337.bufferedAmount=_314._flashBridge.getBufferedAmount(_337._instanceId);
if(_337.bufferedAmount!=0){
setTimeout(function(){
_334(_337);
},1000);
}
};
var _318=function(_338,_339,_33a){
_313.entering(this,"WebSocketEmulatedFlashProxy.registerWebSocket",_339);
var _33b=function(key,_33d){
_33d[key]=_338;
_338._instanceId=key;
};
var _33e=function(){
doError(_338);
};
var _33f=[];
if(_338.parent.requestHeaders&&_338.parent.requestHeaders.length>0){
for(var i=0;i<_338.parent.requestHeaders.length;i++){
_33f.push(_338.parent.requestHeaders[i].label+":"+_338.parent.requestHeaders[i].value);
}
}
_314._flashBridge.registerWebSocketEmulated(_339,_33f.join("\n"),_33b,_33e);
};
function doError(_341,e){
_313.entering(this,"WebSocketEmulatedFlashProxy.doError",e);
setTimeout(function(){
_341._listener.connectionFailed(_341.parent);
},0);
};
return _314;
})();
var _343=(function(){
var _344=_275.getLogger("WebSocketRtmpFlashProxy");
var _345=function(){
this.parent;
this._listener;
};
var _346=_345.prototype;
_346.connect=function(_347,_348){
_344.entering(this,"WebSocketRtmpFlashProxy.<init>",_347);
this.URL=_347;
try{
_349(this,_347,_348);
}
catch(e){
_344.severe(this,"WebSocketRtmpFlashProxy.<init> "+e);
doError(this,e);
}
this.constructor=_345;
_344.exiting(this,"WebSocketRtmpFlashProxy.<init>");
};
_346.setListener=function(_34a){
this._listener=_34a;
};
_312._flashBridge={};
_312._flashBridge.readyWaitQueue=[];
_312._flashBridge.failWaitQueue=[];
_312._flashBridge.flashHasLoaded=false;
_312._flashBridge.flashHasFailed=false;
_346.URL="";
_346.readyState=0;
_346.bufferedAmount=0;
_346.connectionOpened=function(_34b,_34c){
var _34c=_34c.split("\n");
for(var i=0;i<_34c.length;i++){
var _34e=_34c[i].split(":");
_34b.responseHeaders[_34e[0]]=_34e[1];
}
this._listener.connectionOpened(_34b,"");
};
_346.connectionClosed=function(_34f,_350,code,_352){
this._listener.connectionClosed(_34f,_350,code,_352);
};
_346.connectionFailed=function(_353){
this._listener.connectionFailed(_353);
};
_346.binaryMessageReceived=function(_354,data){
this._listener.binaryMessageReceived(_354,data);
};
_346.textMessageReceived=function(_356,s){
this._listener.textMessageReceived(_356,s);
};
_346.redirected=function(_358,_359){
this._listener.redirected(_358,_359);
};
_346.authenticationRequested=function(_35a,_35b,_35c){
this._listener.authenticationRequested(_35a,_35b,_35c);
};
_346.send=function(data){
_344.entering(this,"WebSocketRtmpFlashProxy.send",data);
switch(this.readyState){
case 0:
_344.severe(this,"WebSocketRtmpFlashProxy.send: readyState is 0");
throw new Error("INVALID_STATE_ERR");
break;
case 1:
if(data===null){
_344.severe(this,"WebSocketRtmpFlashProxy.send: Data is null");
throw new Error("data is null");
}
if(typeof (data)=="string"){
_312._flashBridge.sendText(this._instanceId,data);
}else{
if(typeof (data.array)=="object"){
var _35e;
var a=[];
var b;
while(data.remaining()){
b=data.get();
a.push(String.fromCharCode(b));
}
var _35e=a.join("");
_312._flashBridge.sendByteString(this._instanceId,_35e);
return;
}else{
_344.severe(this,"WebSocketRtmpFlashProxy.send: Data is on invalid type "+typeof (data));
throw new Error("Invalid type");
}
}
_361(this);
return true;
break;
case 2:
return false;
break;
default:
_344.severe(this,"WebSocketRtmpFlashProxy.send: Invalid readyState "+this.readyState);
throw new Error("INVALID_STATE_ERR");
}
};
_346.close=function(code,_363){
_344.entering(this,"WebSocketRtmpFlashProxy.close");
switch(this.readyState){
case 1:
case 2:
_312._flashBridge.disconnect(this._instanceId,code,_363);
break;
}
};
_346.disconnect=_346.close;
var _361=function(_364){
_344.entering(this,"WebSocketRtmpFlashProxy.updateBufferedAmount");
_364.bufferedAmount=_312._flashBridge.getBufferedAmount(_364._instanceId);
if(_364.bufferedAmount!=0){
setTimeout(function(){
_361(_364);
},1000);
}
};
var _349=function(_365,_366,_367){
_344.entering(this,"WebSocketRtmpFlashProxy.registerWebSocket",_366);
var _368=function(key,_36a){
_36a[key]=_365;
_365._instanceId=key;
};
var _36b=function(){
doError(_365);
};
var _36c=[];
if(_365.parent.requestHeaders&&_365.parent.requestHeaders.length>0){
for(var i=0;i<_365.parent.requestHeaders.length;i++){
_36c.push(_365.parent.requestHeaders[i].label+":"+_365.parent.requestHeaders[i].value);
}
}
_312._flashBridge.registerWebSocketRtmp(_366,_36c.join("\n"),_368,_36b);
};
function doError(_36e,e){
_344.entering(this,"WebSocketRtmpFlashProxy.doError",e);
setTimeout(function(){
_36e._listener.connectionFailed(_36e.parent);
},0);
};
return _345;
})();
(function(){
var _370=_275.getLogger("com.kaazing.gateway.client.loader.FlashBridge");
var _371={};
_312._flashBridge.registerWebSocketEmulated=function(_372,_373,_374,_375){
_370.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.registerWebSocketEmulated",{"location":_372,"callback":_374,"errback":_375});
var _376=function(){
var key=_312._flashBridge.doRegisterWebSocketEmulated(_372,_373);
_374(key,_371);
};
if(_312._flashBridge.flashHasLoaded){
if(_312._flashBridge.flashHasFailed){
_375();
}else{
_376();
}
}else{
this.readyWaitQueue.push(_376);
this.failWaitQueue.push(_375);
}
_370.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.registerWebSocketEmulated");
};
_312._flashBridge.doRegisterWebSocketEmulated=function(_378,_379){
_370.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.doRegisterWebSocketEmulated",{"location":_378,"headers":_379});
var key=_312._flashBridge.elt.registerWebSocketEmulated(_378,_379);
_370.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.doRegisterWebSocketEmulated",key);
return key;
};
_312._flashBridge.registerWebSocketRtmp=function(_37b,_37c,_37d,_37e){
_370.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.registerWebSocketRtmp",{"location":_37b,"callback":_37d,"errback":_37e});
var _37f=function(){
var key=_312._flashBridge.doRegisterWebSocketRtmp(_37b,_37c);
_37d(key,_371);
};
if(_312._flashBridge.flashHasLoaded){
if(_312._flashBridge.flashHasFailed){
_37e();
}else{
_37f();
}
}else{
this.readyWaitQueue.push(_37f);
this.failWaitQueue.push(_37e);
}
_370.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.registerWebSocketEmulated");
};
_312._flashBridge.doRegisterWebSocketRtmp=function(_381,_382){
_370.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.doRegisterWebSocketRtmp",{"location":_381,"protocol":_382});
var key=_312._flashBridge.elt.registerWebSocketRtmp(_381,_382);
_370.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.doRegisterWebSocketRtmp",key);
return key;
};
_312._flashBridge.onready=function(){
_370.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.onready");
var _384=_312._flashBridge.readyWaitQueue;
for(var i=0;i<_384.length;i++){
var _386=_384[i];
_386();
}
_370.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.onready");
};
_312._flashBridge.onfail=function(){
_370.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.onfail");
var _387=_312._flashBridge.failWaitQueue;
for(var i=0;i<_387.length;i++){
var _389=_387[i];
_389();
}
_370.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.onfail");
};
_312._flashBridge.connectionOpened=function(key,_38b){
_370.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionOpened",key);
_371[key].readyState=1;
_371[key].connectionOpened(_371[key].parent,_38b);
_38c();
_370.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionOpened");
};
_312._flashBridge.connectionClosed=function(key,_38e,code,_390){
_370.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionClosed",key);
_371[key].readyState=2;
_371[key].connectionClosed(_371[key].parent,_38e,code,_390);
_370.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionClosed");
};
_312._flashBridge.connectionFailed=function(key){
_370.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionFailed",key);
_371[key].connectionFailed(_371[key].parent);
_370.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionFailed");
};
_312._flashBridge.binaryMessageReceived=function(key,data){
_370.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.binaryMessageReceived",{"key":key,"data":data});
var _394=_371[key];
if(_394.readyState==1){
var buf=ByteBuffer.allocate(data.length);
for(var i=0;i<data.length;i++){
buf.put(data[i]);
}
buf.flip();
_394.binaryMessageReceived(_394.parent,buf);
}
_370.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.binaryMessageReceived");
};
_312._flashBridge.textMessageReceived=function(key,data){
_370.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.textMessageReceived",{"key":key,"data":data});
var _399=_371[key];
if(_399.readyState==1){
_399.textMessageReceived(_399.parent,unescape(data));
}
_370.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.textMessageReceived");
};
_312._flashBridge.redirected=function(key,_39b){
_370.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.redirected",{"key":key,"data":_39b});
var _39c=_371[key];
_39c.redirected(_39c.parent,_39b);
_370.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.redirected");
};
_312._flashBridge.authenticationRequested=function(key,_39e,_39f){
_370.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.authenticationRequested",{"key":key,"data":_39e});
var _3a0=_371[key];
_3a0.authenticationRequested(_3a0.parent,_39e,_39f);
_370.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.authenticationRequested");
};
var _38c=function(){
_370.entering(this,"WebSocketEmulatedFlashProxy.killLoadingBar");
if(browser==="firefox"){
var e=document.createElement("iframe");
e.style.display="none";
document.body.appendChild(e);
document.body.removeChild(e);
}
};
_312._flashBridge.sendText=function(key,_3a3){
_370.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.sendText",{"key":key,"message":_3a3});
this.elt.processTextMessage(key,escape(_3a3));
setTimeout(_38c,200);
};
_312._flashBridge.sendByteString=function(key,_3a5){
_370.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.sendByteString",{"key":key,"message":_3a5});
this.elt.processBinaryMessage(key,escape(_3a5));
setTimeout(_38c,200);
};
_312._flashBridge.disconnect=function(key,code,_3a8){
_370.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.disconnect",key);
this.elt.processClose(key,code,_3a8);
};
_312._flashBridge.getBufferedAmount=function(key){
_370.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.getBufferedAmount",key);
var v=this.elt.getBufferedAmount(key);
_370.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.getBufferedAmount",v);
return v;
};
})();
(function(){
var _3ab=function(_3ac){
var self=this;
var _3ae=3000;
var ID="Loader";
var ie=false;
var _3b1=-1;
self.elt=null;
var _3b2=function(){
var exp=new RegExp(".*"+_3ac+".*.js$");
var _3b4=document.getElementsByTagName("script");
for(var i=0;i<_3b4.length;i++){
if(_3b4[i].src){
var name=(_3b4[i].src).match(exp);
if(name){
name=name.pop();
var _3b7=name.split("/");
_3b7.pop();
if(_3b7.length>0){
return _3b7.join("/")+"/";
}else{
return "";
}
}
}
}
};
var _3b8=_3b2();
var _3b9=_3b8+"Loader.swf";
self.loader=function(){
var _3ba="flash";
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name==="kaazing:upgrade"){
_3ba=tags[i].content;
}
}
if(_3ba!="flash"||!_3bd([9,0,115])){
_3be();
}else{
_3b1=setTimeout(_3be,_3ae);
_3bf();
}
};
self.clearFlashTimer=function(){
clearTimeout(_3b1);
_3b1="cleared";
setTimeout(function(){
_3c0(self.elt.handshake(_3ac));
},0);
};
var _3c0=function(_3c1){
if(_3c1){
_312._flashBridge.flashHasLoaded=true;
_312._flashBridge.elt=self.elt;
_312._flashBridge.onready();
}else{
_3be();
}
window.___Loader=undefined;
};
var _3be=function(){
_312._flashBridge.flashHasLoaded=true;
_312._flashBridge.flashHasFailed=true;
_312._flashBridge.onfail();
};
var _3c2=function(){
var _3c3=null;
if(typeof (ActiveXObject)!="undefined"){
try{
ie=true;
var swf=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
var _3c5=swf.GetVariable("$version");
var _3c6=_3c5.split(" ")[1].split(",");
_3c3=[];
for(var i=0;i<_3c6.length;i++){
_3c3[i]=parseInt(_3c6[i]);
}
}
catch(e){
ie=false;
}
}
if(typeof navigator.plugins!="undefined"){
if(typeof navigator.plugins["Shockwave Flash"]!="undefined"){
var _3c5=navigator.plugins["Shockwave Flash"].description;
_3c5=_3c5.replace(/\s*r/g,".");
var _3c6=_3c5.split(" ")[2].split(".");
_3c3=[];
for(var i=0;i<_3c6.length;i++){
_3c3[i]=parseInt(_3c6[i]);
}
}
}
var _3c8=navigator.userAgent;
if(_3c3!==null&&_3c3[0]===10&&_3c3[1]===0&&_3c8.indexOf("Windows NT 6.0")!==-1){
_3c3=null;
}
if(_3c8.indexOf("MSIE 6.0")==-1&&_3c8.indexOf("MSIE 7.0")==-1){
if(_3c8.indexOf("MSIE 8.0")>0||_3c8.indexOf("MSIE 9.0")>0){
if(typeof (XDomainRequest)!=="undefined"){
_3c3=null;
}
}else{
_3c3=null;
}
}
return _3c3;
};
var _3bd=function(_3c9){
var _3ca=_3c2();
if(_3ca==null){
return false;
}
for(var i=0;i<Math.max(_3ca.length,_3c9.length);i++){
var _3cc=_3ca[i]-_3c9[i];
if(_3cc!=0){
return (_3cc>0)?true:false;
}
}
return true;
};
var _3bf=function(){
if(ie){
var elt=document.createElement("div");
document.body.appendChild(elt);
elt.outerHTML="<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" height=\"0\" width=\"0\" id=\""+ID+"\"><param name=\"movie\" value=\""+_3b9+"\"></param></object>";
self.elt=document.getElementById(ID);
}else{
var elt=document.createElement("object");
elt.setAttribute("type","application/x-shockwave-flash");
elt.setAttribute("width",0);
elt.setAttribute("height",0);
elt.setAttribute("id",ID);
elt.setAttribute("data",_3b9);
document.body.appendChild(elt);
self.elt=elt;
}
};
self.attachToOnload=function(_3ce){
if(window.addEventListener){
window.addEventListener("load",_3ce,true);
}else{
if(window.attachEvent){
window.attachEvent("onload",_3ce);
}else{
onload=_3ce;
}
}
};
if(document.readyState==="complete"){
self.loader();
}else{
self.attachToOnload(self.loader);
}
};
var _3cf=(function(){
var _3d0=function(_3d1){
this.HOST=new _3d0(0);
this.USERINFO=new _3d0(1);
this.PORT=new _3d0(2);
this.PATH=new _3d0(3);
this.ordinal=_3d1;
};
return _3d0;
})();
var _3d2=(function(){
var _3d3=function(){
};
_3d3.getRealm=function(_3d4){
var _3d5=_3d4.authenticationParameters;
if(_3d5==null){
return null;
}
var _3d6=/realm=(\"(.*)\")/i;
var _3d7=_3d6.exec(_3d5);
return (_3d7!=null&&_3d7.length>=3)?_3d7[2]:null;
};
return _3d3;
})();
function Dictionary(){
this.Keys=new Array();
};
var _3d8=(function(){
var _3d9=function(_3da){
this.weakKeys=_3da;
this.elements=[];
this.dictionary=new Dictionary();
};
var _3db=_3d9.prototype;
_3db.getlength=function(){
return this.elements.length;
};
_3db.getItemAt=function(_3dc){
return this.dictionary[this.elements[_3dc]];
};
_3db.get=function(key){
var _3de=this.dictionary[key];
if(_3de==undefined){
_3de=null;
}
return _3de;
};
_3db.remove=function(key){
for(var i=0;i<this.elements.length;i++){
var _3e1=(this.weakKeys&&(this.elements[i]==key));
var _3e2=(!this.weakKeys&&(this.elements[i]===key));
if(_3e1||_3e2){
this.elements.remove(i);
this.dictionary[this.elements[i]]=undefined;
break;
}
}
};
_3db.put=function(key,_3e4){
this.remove(key);
this.elements.push(key);
this.dictionary[key]=_3e4;
};
_3db.isEmpty=function(){
return this.length==0;
};
_3db.containsKey=function(key){
for(var i=0;i<this.elements.length;i++){
var _3e7=(this.weakKeys&&(this.elements[i]==key));
var _3e8=(!this.weakKeys&&(this.elements[i]===key));
if(_3e7||_3e8){
return true;
}
}
return false;
};
_3db.keySet=function(){
return this.elements;
};
_3db.getvalues=function(){
var _3e9=[];
for(var i=0;i<this.elements.length;i++){
_3e9.push(this.dictionary[this.elements[i]]);
}
return _3e9;
};
return _3d9;
})();
var Node=(function(){
var Node=function(){
this.name="";
this.kind="";
this.values=[];
this.children=new _3d8();
};
var _3ed=Node.prototype;
_3ed.getWildcardChar=function(){
return "*";
};
_3ed.addChild=function(name,kind){
if(name==null||name.length==0){
throw new ArgumentError("A node may not have a null name.");
}
var _3f0=Node.createNode(name,this,kind);
this.children.put(name,_3f0);
return _3f0;
};
_3ed.hasChild=function(name,kind){
return null!=this.getChild(name)&&kind==this.getChild(name).kind;
};
_3ed.getChild=function(name){
return this.children.get(name);
};
_3ed.getDistanceFromRoot=function(){
var _3f4=0;
var _3f5=this;
while(!_3f5.isRootNode()){
_3f4++;
_3f5=_3f5.parent;
}
return _3f4;
};
_3ed.appendValues=function(){
if(this.isRootNode()){
throw new ArgumentError("Cannot set a values on the root node.");
}
if(this.values!=null){
for(var k=0;k<arguments.length;k++){
var _3f7=arguments[k];
this.values.push(_3f7);
}
}
};
_3ed.removeValue=function(_3f8){
if(this.isRootNode()){
return;
}
for(var i=0;i<this.values.length;i++){
if(this.values[i]==_3f8){
this.values.splice(i,1);
}
}
};
_3ed.getValues=function(){
return this.values;
};
_3ed.hasValues=function(){
return this.values!=null&&this.values.length>0;
};
_3ed.isRootNode=function(){
return this.parent==null;
};
_3ed.hasChildren=function(){
return this.children!=null&&this.children.getlength()>0;
};
_3ed.isWildcard=function(){
return this.name!=null&&this.name==this.getWildcardChar();
};
_3ed.hasWildcardChild=function(){
return this.hasChildren()&&this.children.containsKey(this.getWildcardChar());
};
_3ed.getFullyQualifiedName=function(){
var b=new String();
var name=[];
var _3fc=this;
while(!_3fc.isRootNode()){
name.push(_3fc.name);
_3fc=_3fc.parent;
}
name=name.reverse();
for(var k=0;k<name.length;k++){
b+=name[k];
b+=".";
}
if(b.length>=1&&b.charAt(b.length-1)=="."){
b=b.slice(0,b.length-1);
}
return b.toString();
};
_3ed.getChildrenAsList=function(){
return this.children.getvalues();
};
_3ed.findBestMatchingNode=function(_3fe,_3ff){
var _400=this.findAllMatchingNodes(_3fe,_3ff);
var _401=null;
var _402=0;
for(var i=0;i<_400.length;i++){
var node=_400[i];
if(node.getDistanceFromRoot()>_402){
_402=node.getDistanceFromRoot();
_401=node;
}
}
return _401;
};
_3ed.findAllMatchingNodes=function(_405,_406){
var _407=[];
var _408=this.getChildrenAsList();
for(var i=0;i<_408.length;i++){
var node=_408[i];
var _40b=node.matches(_405,_406);
if(_40b<0){
continue;
}
if(_40b>=_405.length){
do{
if(node.hasValues()){
_407.push(node);
}
if(node.hasWildcardChild()){
var _40c=node.getChild(this.getWildcardChar());
if(_40c.kind!=this.kind){
node=null;
}else{
node=_40c;
}
}else{
node=null;
}
}while(node!=null);
}else{
var _40d=node.findAllMatchingNodes(_405,_40b);
for(var j=0;j<_40d.length;j++){
_407.push(_40d[j]);
}
}
}
return _407;
};
_3ed.matches=function(_40f,_410){
if(_410<0||_410>=_40f.length){
return -1;
}
if(this.matchesToken(_40f[_410])){
return _410+1;
}
if(!this.isWildcard()){
return -1;
}else{
if(this.kind!=_40f[_410].kind){
return -1;
}
do{
_410++;
}while(_410<_40f.length&&this.kind==_40f[_410].kind);
return _410;
}
};
_3ed.matchesToken=function(_411){
return this.name==_411.name&&this.kind==_411.kind;
};
Node.createNode=function(name,_413,kind){
var node=new Node();
node.name=name;
node.parent=_413;
node.kind=kind;
return node;
};
return Node;
})();
var _416=(function(){
var _417=function(name,kind){
this.kind=kind;
this.name=name;
};
return _417;
})();
window.Oid=(function(){
var Oid=function(data){
this.rep=data;
};
var _41c=Oid.prototype;
_41c.asArray=function(){
return this.rep;
};
_41c.asString=function(){
var s="";
for(var i=0;i<this.rep.length;i++){
s+=(this.rep[i].toString());
s+=".";
}
if(s.length>0&&s.charAt(s.length-1)=="."){
s=s.slice(0,s.length-1);
}
return s;
};
Oid.create=function(data){
return new Oid(data.split("."));
};
return Oid;
})();
var _420=(function(){
var _421=function(){
};
_421.create=function(_422,_423,_424){
var _425=_422+":"+_423;
var _426=[];
for(var i=0;i<_425.length;++i){
_426.push(_425.charCodeAt(i));
}
var _428="Basic "+Base64.encode(_426);
return new ChallengeResponse(_428,_424);
};
return _421;
})();
function InternalDefaultChallengeHandler(){
this.canHandle=function(_429){
return false;
};
this.handle=function(_42a,_42b){
_42b(null);
};
};
window.PasswordAuthentication=(function(){
function PasswordAuthentication(_42c,_42d){
this.username=_42c;
this.password=_42d;
};
PasswordAuthentication.prototype.clear=function(){
this.username=null;
this.password=null;
};
return PasswordAuthentication;
})();
window.ChallengeRequest=(function(){
var _42e=function(_42f,_430){
if(_42f==null){
throw new Error("location is not defined.");
}
if(_430==null){
return;
}
var _431="Application ";
if(_430.indexOf(_431)==0){
_430=_430.substring(_431.length);
}
this.location=_42f;
this.authenticationParameters=null;
var _432=_430.indexOf(" ");
if(_432==-1){
this.authenticationScheme=_430;
}else{
this.authenticationScheme=_430.substring(0,_432);
if(_430.length>_432+1){
this.authenticationParameters=_430.substring(_432+1);
}
}
};
return _42e;
})();
window.ChallengeResponse=(function(){
var _433=function(_434,_435){
this.credentials=_434;
this.nextChallengeHandler=_435;
};
var _436=_433.prototype;
_436.clearCredentials=function(){
if(this.credentials!=null){
this.credentials=null;
}
};
return _433;
})();
window.BasicChallengeHandler=(function(){
var _437=function(){
this.loginHandler=undefined;
this.loginHandlersByRealm={};
};
var _438=_437.prototype;
_438.setRealmLoginHandler=function(_439,_43a){
if(_439==null){
throw new ArgumentError("null realm");
}
if(_43a==null){
throw new ArgumentError("null loginHandler");
}
this.loginHandlersByRealm[_439]=_43a;
return this;
};
_438.canHandle=function(_43b){
return _43b!=null&&"Basic"==_43b.authenticationScheme;
};
_438.handle=function(_43c,_43d){
if(_43c.location!=null){
var _43e=this.loginHandler;
var _43f=_3d2.getRealm(_43c);
if(_43f!=null&&this.loginHandlersByRealm[_43f]!=null){
_43e=this.loginHandlersByRealm[_43f];
}
var _440=this;
if(_43e!=null){
_43e(function(_441){
if(_441!=null&&_441.username!=null){
_43d(_420.create(_441.username,_441.password,_440));
}else{
_43d(null);
}
});
return;
}
}
_43d(null);
};
_438.loginHandler=function(_442){
_442(null);
};
return _437;
})();
window.DispatchChallengeHandler=(function(){
var _443=function(){
this.rootNode=new Node();
var _444="^(.*)://(.*)";
this.SCHEME_URI_PATTERN=new RegExp(_444);
};
function delChallengeHandlerAtLocation(_445,_446,_447){
var _448=tokenize(_446);
var _449=_445;
for(var i=0;i<_448.length;i++){
var _44b=_448[i];
if(!_449.hasChild(_44b.name,_44b.kind)){
return;
}else{
_449=_449.getChild(_44b.name);
}
}
_449.removeValue(_447);
};
function addChallengeHandlerAtLocation(_44c,_44d,_44e){
var _44f=tokenize(_44d);
var _450=_44c;
for(var i=0;i<_44f.length;i++){
var _452=_44f[i];
if(!_450.hasChild(_452.name,_452.kind)){
_450=_450.addChild(_452.name,_452.kind);
}else{
_450=_450.getChild(_452.name);
}
}
_450.appendValues(_44e);
};
function lookupByLocation(_453,_454){
var _455=new Array();
if(_454!=null){
var _456=findBestMatchingNode(_453,_454);
if(_456!=null){
return _456.values;
}
}
return _455;
};
function lookupByRequest(_457,_458){
var _459=null;
var _45a=_458.location;
if(_45a!=null){
var _45b=findBestMatchingNode(_457,_45a);
if(_45b!=null){
var _45c=_45b.getValues();
if(_45c!=null){
for(var i=0;i<_45c.length;i++){
var _45e=_45c[i];
if(_45e.canHandle(_458)){
_459=_45e;
break;
}
}
}
}
}
return _459;
};
function findBestMatchingNode(_45f,_460){
var _461=tokenize(_460);
var _462=0;
return _45f.findBestMatchingNode(_461,_462);
};
function tokenize(uri){
var _464=new Array();
if(uri==null||uri.length==0){
return _464;
}
var _465=new RegExp("^(([^:/?#]+):(//))?([^/?#]*)?([^?#]*)(\\?([^#]*))?(#(.*))?");
var _466=_465.exec(uri);
if(_466==null){
return _464;
}
var _467=_466[2]||"http";
var _468=_466[4];
var path=_466[5];
var _46a=null;
var _46b=null;
var _46c=null;
var _46d=null;
if(_468!=null){
var host=_468;
var _46f=host.indexOf("@");
if(_46f>=0){
_46b=host.substring(0,_46f);
host=host.substring(_46f+1);
var _470=_46b.indexOf(":");
if(_470>=0){
_46c=_46b.substring(0,_470);
_46d=_46b.substring(_470+1);
}
}
var _471=host.indexOf(":");
if(_471>=0){
_46a=host.substring(_471+1);
host=host.substring(0,_471);
}
}else{
throw new ArgumentError("Hostname is required.");
}
var _472=host.split(/\./);
_472.reverse();
for(var k=0;k<_472.length;k++){
_464.push(new _416(_472[k],_3cf.HOST));
}
if(_46a!=null){
_464.push(new _416(_46a,_3cf.PORT));
}else{
if(getDefaultPort(_467)>0){
_464.push(new _416(getDefaultPort(_467).toString(),_3cf.PORT));
}
}
if(_46b!=null){
if(_46c!=null){
_464.push(new _416(_46c,_3cf.USERINFO));
}
if(_46d!=null){
_464.push(new _416(_46d,_3cf.USERINFO));
}
if(_46c==null&&_46d==null){
_464.push(new _416(_46b,_3cf.USERINFO));
}
}
if(isNotBlank(path)){
if(path.charAt(0)=="/"){
path=path.substring(1);
}
if(isNotBlank(path)){
var _474=path.split("/");
for(var p=0;p<_474.length;p++){
var _476=_474[p];
_464.push(new _416(_476,_3cf.PATH));
}
}
}
return _464;
};
function getDefaultPort(_477){
if(defaultPortsByScheme[_477.toLowerCase()]!=null){
return defaultPortsByScheme[_477];
}else{
return -1;
}
};
function defaultPortsByScheme(){
http=80;
ws=80;
wss=443;
https=443;
};
function isNotBlank(s){
return s!=null&&s.length>0;
};
var _479=_443.prototype;
_479.clear=function(){
this.rootNode=new Node();
};
_479.canHandle=function(_47a){
return lookupByRequest(this.rootNode,_47a)!=null;
};
_479.handle=function(_47b,_47c){
var _47d=lookupByRequest(this.rootNode,_47b);
if(_47d==null){
return null;
}
return _47d.handle(_47b,_47c);
};
_479.register=function(_47e,_47f){
if(_47e==null||_47e.length==0){
throw new Error("Must specify a location to handle challenges upon.");
}
if(_47f==null){
throw new Error("Must specify a handler to handle challenges.");
}
addChallengeHandlerAtLocation(this.rootNode,_47e,_47f);
return this;
};
_479.unregister=function(_480,_481){
if(_480==null||_480.length==0){
throw new Error("Must specify a location to un-register challenge handlers upon.");
}
if(_481==null){
throw new Error("Must specify a handler to un-register.");
}
delChallengeHandlerAtLocation(this.rootNode,_480,_481);
return this;
};
return _443;
})();
window.NegotiableChallengeHandler=(function(){
var _482=function(){
this.candidateChallengeHandlers=new Array();
};
var _483=function(_484){
var oids=new Array();
for(var i=0;i<_484.length;i++){
oids.push(Oid.create(_484[i]).asArray());
}
var _487=GssUtils.sizeOfSpnegoInitialContextTokenWithOids(null,oids);
var _488=ByteBuffer.allocate(_487);
_488.skip(_487);
GssUtils.encodeSpnegoInitialContextTokenWithOids(null,oids,_488);
return ByteArrayUtils.arrayToByteArray(Base64Util.encodeBuffer(_488));
};
var _489=_482.prototype;
_489.register=function(_48a){
if(_48a==null){
throw new Error("handler is null");
}
for(var i=0;i<this.candidateChallengeHandlers.length;i++){
if(_48a===this.candidateChallengeHandlers[i]){
return this;
}
}
this.candidateChallengeHandlers.push(_48a);
return this;
};
_489.canHandle=function(_48c){
return _48c!=null&&_48c.authenticationScheme=="Negotiate"&&_48c.authenticationParameters==null;
};
_489.handle=function(_48d,_48e){
if(_48d==null){
throw Error(new ArgumentError("challengeRequest is null"));
}
var _48f=new _3d8();
for(var i=0;i<this.candidateChallengeHandlers.length;i++){
var _491=this.candidateChallengeHandlers[i];
if(_491.canHandle(_48d)){
try{
var _492=_491.getSupportedOids();
for(var j=0;j<_492.length;j++){
var oid=new Oid(_492[j]).asString();
if(!_48f.containsKey(oid)){
_48f.put(oid,_491);
}
}
}
catch(e){
}
}
}
if(_48f.isEmpty()){
_48e(null);
return;
}
};
return _482;
})();
window.NegotiableChallengeHandler=(function(){
var _495=function(){
this.loginHandler=undefined;
};
_495.prototype.getSupportedOids=function(){
return new Array();
};
return _495;
})();
window.NegotiableChallengeHandler=(function(){
var _496=function(){
this.loginHandler=undefined;
};
_496.prototype.getSupportedOids=function(){
return new Array();
};
return _496;
})();
var _497={};
(function(){
var _498=_275.getLogger("com.kaazing.gateway.client.html5.Windows1252");
var _499={8364:128,129:129,8218:130,402:131,8222:132,8230:133,8224:134,8225:135,710:136,8240:137,352:138,8249:139,338:140,141:141,381:142,143:143,144:144,8216:145,8217:146,8220:147,8221:148,8226:149,8211:150,8212:151,732:152,8482:153,353:154,8250:155,339:156,157:157,382:158,376:159};
var _49a={128:8364,129:129,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,141:141,142:381,143:143,144:144,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,157:157,158:382,159:376};
_497.toCharCode=function(n){
if(n<128||(n>159&&n<256)){
return n;
}else{
var _49c=_49a[n];
if(typeof (_49c)=="undefined"){
_498.severe(this,"Windows1252.toCharCode: Error: Could not find "+n);
throw new Error("Windows1252.toCharCode could not find: "+n);
}
return _49c;
}
};
_497.fromCharCode=function(code){
if(code<256){
return code;
}else{
var _49e=_499[code];
if(typeof (_49e)=="undefined"){
_498.severe(this,"Windows1252.fromCharCode: Error: Could not find "+code);
throw new Error("Windows1252.fromCharCode could not find: "+code);
}
return _49e;
}
};
var _49f=String.fromCharCode(127);
var NULL=String.fromCharCode(0);
var _4a1="\n";
var _4a2=function(s){
_498.entering(this,"Windows1252.escapedToArray",s);
var a=[];
for(var i=0;i<s.length;i++){
var code=_497.fromCharCode(s.charCodeAt(i));
if(code==127){
i++;
if(i==s.length){
a.hasRemainder=true;
break;
}
var _4a7=_497.fromCharCode(s.charCodeAt(i));
switch(_4a7){
case 127:
a.push(127);
break;
case 48:
a.push(0);
break;
case 110:
a.push(10);
break;
case 114:
a.push(13);
break;
default:
_498.severe(this,"Windows1252.escapedToArray: Error: Escaping format error");
throw new Error("Escaping format error");
}
}else{
a.push(code);
}
}
return a;
};
var _4a8=function(buf){
_498.entering(this,"Windows1252.toEscapedByteString",buf);
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
var chr=String.fromCharCode(_497.toCharCode(n));
switch(chr){
case _49f:
a.push(_49f);
a.push(_49f);
break;
case NULL:
a.push(_49f);
a.push("0");
break;
case _4a1:
a.push(_49f);
a.push("n");
break;
default:
a.push(chr);
}
}
return a.join("");
};
_497.toArray=function(s,_4ae){
_498.entering(this,"Windows1252.toArray",{"s":s,"escaped":_4ae});
if(_4ae){
return _4a2(s);
}else{
var a=[];
for(var i=0;i<s.length;i++){
a.push(_497.fromCharCode(s.charCodeAt(i)));
}
return a;
}
};
_497.toByteString=function(buf,_4b2){
_498.entering(this,"Windows1252.toByteString",{"buf":buf,"escaped":_4b2});
if(_4b2){
return _4a8(buf);
}else{
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
a.push(String.fromCharCode(_497.toCharCode(n)));
}
return a.join("");
}
};
})();
function CloseEvent(_4b5,_4b6,_4b7,_4b8){
this.reason=_4b8;
this.code=_4b7;
this.wasClean=_4b6;
this.type="close";
this.bubbles=true;
this.cancelable=true;
this.target=_4b5;
};
function MessageEvent(_4b9,_4ba,_4bb){
return {target:_4b9,data:_4ba,origin:_4bb,bubbles:true,cancelable:true,type:"message",lastEventId:""};
};
(function(){
if(window.KAAZING_INTERNAL_DISABLE_BLOB){
return;
}
if(typeof (Blob)!=="undefined"){
try{
var temp=new Blob(["Blob"]);
return;
}
catch(e){
}
}
var _4bd=function(_4be,_4bf){
var _4c0=_4bf||{};
if(window.WebKitBlobBuilder){
var _4c1=new window.WebKitBlobBuilder();
for(var i=0;i<_4be.length;i++){
var part=_4be[i];
if(_4c0.endings){
_4c1.append(part,_4c0.endings);
}else{
_4c1.append(part);
}
}
var blob;
if(_4c0.type){
blob=_4c1.getBlob(type);
}else{
blob=_4c1.getBlob();
}
blob.slice=blob.webkitSlice||blob.slice;
return blob;
}else{
if(window.MozBlobBuilder){
var _4c1=new window.MozBlobBuilder();
for(var i=0;i<_4be.length;i++){
var part=_4be[i];
if(_4c0.endings){
_4c1.append(part,_4c0.endings);
}else{
_4c1.append(part);
}
}
var blob;
if(_4c0.type){
blob=_4c1.getBlob(type);
}else{
blob=_4c1.getBlob();
}
blob.slice=blob.mozSlice||blob.slice;
return blob;
}else{
var _4c5=[];
for(var i=0;i<_4be.length;i++){
var part=_4be[i];
if(typeof part==="string"){
var b=BlobUtils.fromString(part,_4c0.endings);
_4c5.push(b);
}else{
if(part.byteLength){
var _4c7=new Uint8Array(part);
for(var i=0;i<part.byteLength;i++){
_4c5.push(_4c7[i]);
}
}else{
if(part.length){
_4c5.push(part);
}else{
if(part._array){
_4c5.push(part._array);
}else{
throw new Error("invalid type in Blob constructor");
}
}
}
}
}
var blob=concatMemoryBlobs(_4c5);
blob.type=_4c0.type;
return blob;
}
}
};
function MemoryBlob(_4c8,_4c9){
return {_array:_4c8,size:_4c8.length,type:_4c9||"",slice:function(_4ca,end,_4cc){
var a=this._array.slice(_4ca,end);
return MemoryBlob(a,_4cc);
},toString:function(){
return "MemoryBlob: "+_4c8.toString();
}};
};
function concatMemoryBlobs(_4ce){
var a=Array.prototype.concat.apply([],_4ce);
return new MemoryBlob(a);
};
window.Blob=_4bd;
})();
(function(_4d0){
_4d0.BlobUtils={};
BlobUtils.asString=function asString(blob,_4d2,end){
if(blob._array){
}else{
if(FileReader){
var _4d4=new FileReader();
_4d4.readAsText(blob);
_4d4.onload=function(){
cb(_4d4.result);
};
_4d4.onerror=function(e){
console.log(e,_4d4);
};
}
}
};
BlobUtils.asNumberArray=(function(){
var _4d6=[];
var _4d7=function(){
if(_4d6.length>0){
try{
var _4d8=_4d6.shift();
_4d8.cb(_4d8.blob._array);
}
finally{
if(_4d6.length>0){
setTimeout(function(){
_4d7();
},0);
}
}
}
};
var _4d9=function(cb,blob){
if(blob._array){
_4d6.push({cb:cb,blob:blob});
if(_4d6.length==1){
setTimeout(function(){
_4d7();
},0);
}
}else{
if(FileReader){
var _4dc=new FileReader();
_4dc.readAsArrayBuffer(blob);
_4dc.onload=function(){
var _4dd=new DataView(_4dc.result);
var a=[];
for(var i=0;i<_4dc.result.byteLength;i++){
a.push(_4dd.getUint8(i));
}
cb(a);
};
}else{
throw new Error("Cannot convert Blob to binary string");
}
}
};
return _4d9;
})();
BlobUtils.asBinaryString=function asBinaryString(cb,blob){
if(blob._array){
var _4e2=blob._array;
var a=[];
for(var i=0;i<_4e2.length;i++){
a.push(String.fromCharCode(_4e2[i]));
}
setTimeout(function(){
cb(a.join(""));
},0);
}else{
if(FileReader){
var _4e5=new FileReader();
if(_4e5.readAsBinaryString){
_4e5.readAsBinaryString(blob);
_4e5.onload=function(){
cb(_4e5.result);
};
}else{
_4e5.readAsArrayBuffer(blob);
_4e5.onload=function(){
var _4e6=new DataView(_4e5.result);
var a=[];
for(var i=0;i<_4e5.result.byteLength;i++){
a.push(String.fromCharCode(_4e6.getUint8(i)));
}
cb(a.join(""));
};
}
}else{
throw new Error("Cannot convert Blob to binary string");
}
}
};
BlobUtils.fromBinaryString=function fromByteString(s){
var _4ea=[];
for(var i=0;i<s.length;i++){
_4ea.push(s.charCodeAt(i));
}
return BlobUtils.fromNumberArray(_4ea);
};
BlobUtils.fromNumberArray=function fromNumberArray(a){
if(typeof (Uint8Array)!=="undefined"){
return new Blob([new Uint8Array(a)]);
}else{
return new Blob([a]);
}
};
BlobUtils.fromString=function fromString(s,_4ee){
if(_4ee&&_4ee==="native"){
if(navigator.userAgent.indexOf("Windows")!=-1){
s=s.replace("\r\n","\n","g").replace("\n","\r\n","g");
}
}
var buf=new ByteBuffer();
Charset.UTF8.encode(s,buf);
var a=buf.array;
return BlobUtils.fromNumberArray(a);
};
})(window);
var _4f1=function(){
this._queue=[];
this._count=0;
this.completion;
};
_4f1.prototype.enqueue=function(cb){
var _4f3=this;
var _4f4={};
_4f4.cb=cb;
_4f4.id=this._count++;
this._queue.push(_4f4);
var func=function(){
_4f3.processQueue(_4f4.id,cb,arguments);
};
return func;
};
_4f1.prototype.processQueue=function(id,cb,args){
for(var i=0;i<this._queue.length;i++){
if(this._queue[i].id==id){
this._queue[i].args=args;
break;
}
}
while(this._queue.length&&this._queue[0].args!==undefined){
var _4fa=this._queue.shift();
_4fa.cb.apply(null,_4fa.args);
}
};
var _4fb=(function(){
var _4fc=function(_4fd,_4fe){
this.label=_4fd;
this.value=_4fe;
};
return _4fc;
})();
var _4ff=(function(){
var _500=function(_501){
var uri=new URI(_501);
if(isValidScheme(uri.scheme)){
this._uri=uri;
}else{
throw new Error("HttpURI - invalid scheme: "+_501);
}
};
function isValidScheme(_503){
return "http"==_503||"https"==_503;
};
var _504=_500.prototype;
_504.getURI=function(){
return this._uri;
};
_504.duplicate=function(uri){
try{
return new _500(uri);
}
catch(e){
throw e;
}
return null;
};
_504.isSecure=function(){
return ("https"==this._uri.scheme);
};
_504.toString=function(){
return this._uri.toString();
};
_500.replaceScheme=function(_506,_507){
var uri=URI.replaceProtocol(_506,_507);
return new _500(uri);
};
return _500;
})();
var _509=(function(){
var _50a=function(_50b){
var uri=new URI(_50b);
if(isValidScheme(uri.scheme)){
this._uri=uri;
if(uri.port==undefined){
this._uri=new URI(_50a.addDefaultPort(_50b));
}
}else{
throw new Error("WSURI - invalid scheme: "+_50b);
}
};
function isValidScheme(_50d){
return "ws"==_50d||"wss"==_50d;
};
function duplicate(uri){
try{
return new _50a(uri);
}
catch(e){
throw e;
}
return null;
};
var _50f=_50a.prototype;
_50f.getAuthority=function(){
return this._uri.authority;
};
_50f.isSecure=function(){
return "wss"==this._uri.scheme;
};
_50f.getHttpEquivalentScheme=function(){
return this.isSecure()?"https":"http";
};
_50f.toString=function(){
return this._uri.toString();
};
var _510=80;
var _511=443;
_50a.setDefaultPort=function(uri){
if(uri.port==0){
if(uri.scheme=="ws"){
uri.port=_510;
}else{
if(uri.scheme=="wss"){
uri.port=_511;
}else{
if(uri.scheme=="http"){
uri.port=80;
}else{
if(uri.schemel=="https"){
uri.port=443;
}else{
throw new Error("Unknown protocol: "+uri.scheme);
}
}
}
}
uri.authority=uri.host+":"+uri.port;
}
};
_50a.addDefaultPort=function(_513){
var uri=new URI(_513);
if(uri.port==undefined){
_50a.setDefaultPort(uri);
}
return uri.toString();
};
_50a.replaceScheme=function(_515,_516){
var uri=URI.replaceProtocol(_515,_516);
return new _50a(uri);
};
return _50a;
})();
var _518=(function(){
var _519={};
_519["ws"]="ws";
_519["wss"]="wss";
_519["javascript:wse"]="ws";
_519["javascript:wse+ssl"]="wss";
_519["javascript:ws"]="ws";
_519["javascript:wss"]="wss";
_519["flash:wsr"]="ws";
_519["flash:wsr+ssl"]="wss";
_519["flash:wse"]="ws";
_519["flash:wse+ssl"]="wss";
var _51a=function(_51b){
var _51c=getProtocol(_51b);
if(isValidScheme(_51c)){
this._uri=new URI(URI.replaceProtocol(_51b,_519[_51c]));
this._compositeScheme=_51c;
this._location=_51b;
}else{
throw new SyntaxError("WSCompositeURI - invalid composite scheme: "+getProtocol(_51b));
}
};
function getProtocol(_51d){
var indx=_51d.indexOf("://");
if(indx>0){
return _51d.substr(0,indx);
}else{
return "";
}
};
function isValidScheme(_51f){
return _519[_51f]!=null;
};
function duplicate(uri){
try{
return new _51a(uri);
}
catch(e){
throw e;
}
return null;
};
var _521=_51a.prototype;
_521.isSecure=function(){
var _522=this._uri.scheme;
return "wss"==_519[_522];
};
_521.getWSEquivalent=function(){
try{
var _523=_519[this._compositeScheme];
return _509.replaceScheme(this._location,_523);
}
catch(e){
throw e;
}
return null;
};
_521.getPlatformPrefix=function(){
if(this._compositeScheme.indexOf("javascript:")===0){
return "javascript";
}else{
if(this._compositeScheme.indexOf("flash:")===0){
return "flash";
}else{
return "";
}
}
};
_521.toString=function(){
return this._location;
};
return _51a;
})();
var _524=(function(){
var _525=function(_526,_527,_528){
if(arguments.length<3){
var s="ResumableTimer: Please specify the required parameters 'callback', 'delay', and 'updateDelayWhenPaused'.";
throw Error(s);
}
if((typeof (_526)=="undefined")||(_526==null)){
var s="ResumableTimer: Please specify required parameter 'callback'.";
throw Error(s);
}else{
if(typeof (_526)!="function"){
var s="ResumableTimer: Required parameter 'callback' must be a function.";
throw Error(s);
}
}
if(typeof (_527)=="undefined"){
var s="ResumableTimer: Please specify required parameter 'delay' of type integer.";
throw Error(s);
}else{
if((typeof (_527)!="number")||(_527<=0)){
var s="ResumableTimer: Required parameter 'delay' should be a positive integer.";
throw Error(s);
}
}
if(typeof (_528)=="undefined"){
var s="ResumableTimer: Please specify required boolean parameter 'updateDelayWhenPaused'.";
throw Error(s);
}else{
if(typeof (_528)!="boolean"){
var s="ResumableTimer: Required parameter 'updateDelayWhenPaused' is a boolean.";
throw Error(s);
}
}
this._delay=_527;
this._updateDelayWhenPaused=_528;
this._callback=_526;
this._timeoutId=-1;
this._startTime=-1;
};
var _52a=_525.prototype;
_52a.cancel=function(){
if(this._timeoutId!=-1){
window.clearTimeout(this._timeoutId);
this._timeoutId=-1;
}
this._delay=-1;
this._callback=null;
};
_52a.pause=function(){
if(this._timeoutId==-1){
return;
}
window.clearTimeout(this._timeoutId);
var _52b=new Date().getTime();
var _52c=_52b-this._startTime;
this._timeoutId=-1;
if(this._updateDelayWhenPaused){
this._delay=this._delay-_52c;
}
};
_52a.resume=function(){
if(this._timeoutId!=-1){
return;
}
if(this._callback==null){
var s="Timer cannot be resumed as it has been canceled.";
throw new Error(s);
}
this.start();
};
_52a.start=function(){
if(this._delay<0){
var s="Timer delay cannot be negative";
}
this._timeoutId=window.setTimeout(this._callback,this._delay);
this._startTime=new Date().getTime();
};
return _525;
})();
var _52f=(function(){
var _530=function(){
this._parent=null;
this._challengeResponse=new ChallengeResponse(null,null);
};
_530.prototype.toString=function(){
return "[Channel]";
};
return _530;
})();
var _531=(function(){
var _532=function(_533,_534,_535){
_52f.apply(this,arguments);
this._location=_533;
this._protocol=_534;
this._extensions=[];
this._controlFrames={};
this._controlFramesBinary={};
this._escapeSequences={};
this._handshakePayload="";
this._isEscape=false;
this._bufferedAmount=0;
};
var _536=_532.prototype=new _52f();
_536.getBufferedAmount=function(){
return this._bufferedAmount;
};
_536.toString=function(){
return "[WebSocketChannel "+_location+" "+_protocol!=null?_protocol:"-"+"]";
};
return _532;
})();
var _537=(function(){
var _538=function(){
this._nextHandler;
this._listener;
};
var _539=_538.prototype;
_539.processConnect=function(_53a,_53b,_53c){
this._nextHandler.processConnect(_53a,_53b,_53c);
};
_539.processAuthorize=function(_53d,_53e){
this._nextHandler.processAuthorize(_53d,_53e);
};
_539.processTextMessage=function(_53f,text){
this._nextHandler.processTextMessage(_53f,text);
};
_539.processBinaryMessage=function(_541,_542){
this._nextHandler.processBinaryMessage(_541,_542);
};
_539.processClose=function(_543,code,_545){
this._nextHandler.processClose(_543,code,_545);
};
_539.setIdleTimeout=function(_546,_547){
this._nextHandler.setIdleTimeout(_546,_547);
};
_539.setListener=function(_548){
this._listener=_548;
};
_539.setNextHandler=function(_549){
this._nextHandler=_549;
};
return _538;
})();
var _54a=function(_54b){
this.connectionOpened=function(_54c,_54d){
_54b._listener.connectionOpened(_54c,_54d);
};
this.textMessageReceived=function(_54e,s){
_54b._listener.textMessageReceived(_54e,s);
};
this.binaryMessageReceived=function(_550,obj){
_54b._listener.binaryMessageReceived(_550,obj);
};
this.connectionClosed=function(_552,_553,code,_555){
_54b._listener.connectionClosed(_552,_553,code,_555);
};
this.connectionError=function(_556,e){
_54b._listener.connectionError(_556,e);
};
this.connectionFailed=function(_558){
_54b._listener.connectionFailed(_558);
};
this.authenticationRequested=function(_559,_55a,_55b){
_54b._listener.authenticationRequested(_559,_55a,_55b);
};
this.redirected=function(_55c,_55d){
_54b._listener.redirected(_55c,_55d);
};
this.onBufferedAmountChange=function(_55e,n){
_54b._listener.onBufferedAmountChange(_55e,n);
};
};
var _560=(function(){
var _561=function(){
var _562="";
var _563="";
};
_561.KAAZING_EXTENDED_HANDSHAKE="x-kaazing-handshake";
_561.KAAZING_SEC_EXTENSION_REVALIDATE="x-kaazing-http-revalidate";
_561.HEADER_SEC_PROTOCOL="X-WebSocket-Protocol";
_561.HEADER_SEC_EXTENSIONS="X-WebSocket-Extensions";
_561.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT="x-kaazing-idle-timeout";
_561.KAAZING_SEC_EXTENSION_PING_PONG="x-kaazing-ping-pong";
return _561;
})();
var _564=(function(){
var _565=function(_566,_567){
_531.apply(this,arguments);
this.requestHeaders=[];
this.responseHeaders={};
this.readyState=WebSocket.CONNECTING;
this.authenticationReceived=false;
this.wasCleanClose=false;
this.closeCode=1006;
this.closeReason="";
this.preventFallback=false;
};
return _565;
})();
var _568=(function(){
var _569=function(){
};
var _56a=_569.prototype;
_56a.createChannel=function(_56b,_56c,_56d){
var _56e=new _564(_56b,_56c,_56d);
return _56e;
};
return _569;
})();
var _56f=(function(){
var _570=function(){
};
var _571=_570.prototype;
_571.createChannel=function(_572,_573){
var _574=new _564(_572,_573);
return _574;
};
return _570;
})();
var _575=(function(){
var _576=function(_577,_578){
this._location=_577.getWSEquivalent();
this._protocol=_578;
this._webSocket;
this._compositeScheme=_577._compositeScheme;
this._connectionStrategies=[];
this._selectedChannel;
this.readyState=0;
this._closing=false;
this._negotiatedExtensions={};
this._compositeScheme=_577._compositeScheme;
};
var _579=_576.prototype=new _531();
_579.getReadyState=function(){
return this.readyState;
};
_579.getWebSocket=function(){
return this._webSocket;
};
_579.getCompositeScheme=function(){
return this._compositeScheme;
};
_579.getNextStrategy=function(){
if(this._connectionStrategies.length<=0){
return null;
}else{
return this._connectionStrategies.shift();
}
};
_579.getRedirectPolicy=function(){
return this.getWebSocket().getRedirectPolicy();
};
return _576;
})();
var _57a=(function(){
var _57b="WebSocketControlFrameHandler";
var LOG=_275.getLogger(_57b);
var _57d=function(){
LOG.finest(_57b,"<init>");
};
var _57e=function(_57f,_580){
var _581=0;
for(var i=_580;i<_580+4;i++){
_581=(_581<<8)+_57f.getAt(i);
}
return _581;
};
var _583=function(_584){
if(_584.byteLength>3){
var _585=new DataView(_584);
return _585.getInt32(0);
}
return 0;
};
var _586=function(_587){
var _588=0;
for(var i=0;i<4;i++){
_588=(_588<<8)+_587.charCodeAt(i);
}
return _588;
};
var ping=[9,0];
var pong=[10,0];
var _58c={};
var _58d=function(_58e){
if(typeof _58c.escape==="undefined"){
var _58f=[];
var i=4;
do{
_58f[--i]=_58e&(255);
_58e=_58e>>8;
}while(i);
_58c.escape=String.fromCharCode.apply(null,_58f.concat(pong));
}
return _58c.escape;
};
var _591=function(_592,_593,_594,_595){
if(_560.KAAZING_SEC_EXTENSION_REVALIDATE==_593._controlFrames[_595]){
var url=_594.substr(5);
if(_593._redirectUri!=null){
if(typeof (_593._redirectUri)=="string"){
var _597=new URI(_593._redirectUri);
url=_597.scheme+"://"+_597.authority+url;
}else{
url=_593._redirectUri.getHttpEquivalentScheme()+"://"+_593._redirectUri.getAuthority()+url;
}
}else{
url=_593._location.getHttpEquivalentScheme()+"://"+_593._location.getAuthority()+url;
}
_592._listener.authenticationRequested(_593,url,_560.KAAZING_SEC_EXTENSION_REVALIDATE);
}else{
if(_560.KAAZING_SEC_EXTENSION_PING_PONG==_593._controlFrames[_595]){
if(_594.charCodeAt(4)==ping[0]){
var pong=_58d(_595);
_592._nextHandler.processTextMessage(_593,pong);
}
}
}
};
var _599=_57d.prototype=new _537();
_599.handleConnectionOpened=function(_59a,_59b){
LOG.finest(_57b,"handleConnectionOpened");
var _59c=_59a.responseHeaders;
if(_59c[_560.HEADER_SEC_EXTENSIONS]!=null){
var _59d=_59c[_560.HEADER_SEC_EXTENSIONS];
if(_59d!=null&&_59d.length>0){
var _59e=_59d.split(",");
for(var j=0;j<_59e.length;j++){
var tmp=_59e[j].split(";");
var ext=tmp[0].replace(/^\s+|\s+$/g,"");
var _5a2=new WebSocketExtension(ext);
_5a2.enabled=true;
_5a2.negotiated=true;
if(tmp.length>1){
var _5a3=tmp[1].replace(/^\s+|\s+$/g,"");
if(_5a3.length==8){
try{
var _5a4=parseInt(_5a3,16);
_59a._controlFrames[_5a4]=ext;
if(_560.KAAZING_SEC_EXTENSION_REVALIDATE===ext){
_59a._controlFramesBinary[_5a4]=ext;
}
_5a2.escape=_5a3;
}
catch(e){
LOG.finest(_57b,"parse control frame bytes error");
}
}
}
_59a.parent._negotiatedExtensions[ext]=_5a2;
}
}
}
this._listener.connectionOpened(_59a,_59b);
};
_599.handleTextMessageReceived=function(_5a5,_5a6){
LOG.finest(_57b,"handleMessageReceived",_5a6);
if(_5a5._isEscape){
_5a5._isEscape=false;
this._listener.textMessageReceived(_5a5,_5a6);
return;
}
if(_5a6==null||_5a6.length<4){
this._listener.textMessageReceived(_5a5,_5a6);
return;
}
var _5a7=_586(_5a6);
if(_5a5._controlFrames[_5a7]!=null){
if(_5a6.length==4){
_5a5._isEscape=true;
return;
}else{
_591(this,_5a5,_5a6,_5a7);
}
}else{
this._listener.textMessageReceived(_5a5,_5a6);
}
};
_599.handleMessageReceived=function(_5a8,_5a9){
LOG.finest(_57b,"handleMessageReceived",_5a9);
if(_5a8._isEscape){
_5a8._isEscape=false;
this._listener.binaryMessageReceived(_5a8,_5a9);
return;
}
if(typeof (_5a9.byteLength)!="undefined"){
var _5aa=_583(_5a9);
if(_5a8._controlFramesBinary[_5aa]!=null){
if(_5a9.byteLength==4){
_5a8._isEscape=true;
return;
}else{
_591(this,_5a8,String.fromCharCode.apply(null,new Uint8Array(_5a9,0)),_5aa);
}
}else{
this._listener.binaryMessageReceived(_5a8,_5a9);
}
}else{
if(_5a9.constructor==ByteBuffer){
if(_5a9==null||_5a9.limit<4){
this._listener.binaryMessageReceived(_5a8,_5a9);
return;
}
var _5aa=_57e(_5a9,_5a9.position);
if(_5a8._controlFramesBinary[_5aa]!=null){
if(_5a9.limit==4){
_5a8._isEscape=true;
return;
}else{
_591(this,_5a8,_5a9.getString(Charset.UTF8),_5aa);
}
}else{
this._listener.binaryMessageReceived(_5a8,_5a9);
}
}
}
};
_599.processTextMessage=function(_5ab,_5ac){
if(_5ac.length>=4){
var _5ad=_586(_5ac);
if(_5ab._escapeSequences[_5ad]!=null){
var _5ae=_5ac.slice(0,4);
this._nextHandler.processTextMessage(_5ab,_5ae);
}
}
this._nextHandler.processTextMessage(_5ab,_5ac);
};
_599.setNextHandler=function(_5af){
var _5b0=this;
this._nextHandler=_5af;
var _5b1=new _54a(this);
_5b1.connectionOpened=function(_5b2,_5b3){
_5b0.handleConnectionOpened(_5b2,_5b3);
};
_5b1.textMessageReceived=function(_5b4,buf){
_5b0.handleTextMessageReceived(_5b4,buf);
};
_5b1.binaryMessageReceived=function(_5b6,buf){
_5b0.handleMessageReceived(_5b6,buf);
};
_5af.setListener(_5b1);
};
_599.setListener=function(_5b8){
this._listener=_5b8;
};
return _57d;
})();
var _5b9=(function(){
var LOG=_275.getLogger("RevalidateHandler");
var _5bb=function(_5bc){
LOG.finest("ENTRY Revalidate.<init>");
this.channel=_5bc;
};
var _5bd=function(_5be){
var _5bf=_5be.parent;
if(_5bf){
return (_5bf.readyState>=2);
}
return false;
};
var _5c0=_5bb.prototype;
_5c0.connect=function(_5c1){
LOG.finest("ENTRY Revalidate.connect with {0}",_5c1);
if(_5bd(this.channel)){
return;
}
var _5c2=this;
var _5c3=new XMLHttpRequest0();
_5c3.withCredentials=true;
_5c3.open("GET",_5c1+"&.krn="+Math.random(),true);
if(_5c2.channel._challengeResponse!=null&&_5c2.channel._challengeResponse.credentials!=null){
_5c3.setRequestHeader("Authorization",_5c2.channel._challengeResponse.credentials);
this.clearAuthenticationData(_5c2.channel);
}
_5c3.onreadystatechange=function(){
switch(_5c3.readyState){
case 2:
if(_5c3.status==403){
_5c3.abort();
}
break;
case 4:
if(_5c3.status==401){
_5c2.handle401(_5c2.channel,_5c1,_5c3.getResponseHeader("WWW-Authenticate"));
return;
}
break;
}
};
_5c3.send(null);
};
_5c0.clearAuthenticationData=function(_5c4){
if(_5c4._challengeResponse!=null){
_5c4._challengeResponse.clearCredentials();
}
};
_5c0.handle401=function(_5c5,_5c6,_5c7){
if(_5bd(_5c5)){
return;
}
var _5c8=this;
var _5c9=_5c6;
if(_5c9.indexOf("/;a/")>0){
_5c9=_5c9.substring(0,_5c9.indexOf("/;a/"));
}else{
if(_5c9.indexOf("/;ae/")>0){
_5c9=_5c9.substring(0,_5c9.indexOf("/;ae/"));
}else{
if(_5c9.indexOf("/;ar/")>0){
_5c9=_5c9.substring(0,_5c9.indexOf("/;ar/"));
}
}
}
var _5ca=new ChallengeRequest(_5c9,_5c7);
var _5cb;
if(this.channel._challengeResponse.nextChallengeHandler!=null){
_5cb=this.channel._challengeResponse.nextChallengeHandler;
}else{
_5cb=_5c5.challengeHandler;
}
if(_5cb!=null&&_5cb.canHandle(_5ca)){
_5cb.handle(_5ca,function(_5cc){
try{
if(_5cc!=null&&_5cc.credentials!=null){
_5c8.channel._challengeResponse=_5cc;
_5c8.connect(_5c6);
}
}
catch(e){
}
});
}
};
return _5bb;
})();
var _5cd=(function(){
var _5ce="WebSocketNativeDelegateHandler";
var LOG=_275.getLogger(_5ce);
var _5d0=function(){
LOG.finest(_5ce,"<init>");
};
var _5d1=_5d0.prototype=new _537();
_5d1.processConnect=function(_5d2,uri,_5d4){
LOG.finest(_5ce,"connect",_5d2);
if(_5d2.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
if(_5d2._delegate==null){
var _5d5=new _2e1();
_5d5.parent=_5d2;
_5d2._delegate=_5d5;
_5d6(_5d5,this);
}
_5d2._delegate.connect(uri.toString(),_5d4);
};
_5d1.processTextMessage=function(_5d7,text){
LOG.finest(_5ce,"processTextMessage",_5d7);
if(_5d7._delegate.readyState()==WebSocket.OPEN){
_5d7._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_5d1.processBinaryMessage=function(_5d9,obj){
LOG.finest(_5ce,"processBinaryMessage",_5d9);
if(_5d9._delegate.readyState()==WebSocket.OPEN){
_5d9._delegate.send(obj);
}else{
throw new Error("WebSocket is already closed");
}
};
_5d1.processClose=function(_5db,code,_5dd){
LOG.finest(_5ce,"close",_5db);
try{
_5db._delegate.close(code,_5dd);
}
catch(e){
LOG.finest(_5ce,"processClose exception: ",e);
}
};
_5d1.setIdleTimeout=function(_5de,_5df){
LOG.finest(_5ce,"idleTimeout",_5de);
try{
_5de._delegate.setIdleTimeout(_5df);
}
catch(e){
LOG.finest(_5ce,"setIdleTimeout exception: ",e);
}
};
var _5d6=function(_5e0,_5e1){
var _5e2=new _54a(_5e1);
_5e0.setListener(_5e2);
};
return _5d0;
})();
var _5e3=(function(){
var _5e4="WebSocketNativeBalancingHandler";
var LOG=_275.getLogger(_5e4);
var _5e6=function(){
LOG.finest(_5e4,"<init>");
};
var _5e7=function(_5e8,_5e9,_5ea){
_5e9._redirecting=true;
_5e9._redirectUri=_5ea;
_5e8._nextHandler.processClose(_5e9);
};
var _5eb=_5e6.prototype=new _537();
_5eb.processConnect=function(_5ec,uri,_5ee){
_5ec._balanced=0;
this._nextHandler.processConnect(_5ec,uri,_5ee);
};
_5eb.handleConnectionClosed=function(_5ef,_5f0,code,_5f2){
if(_5ef._redirecting==true){
_5ef._redirecting=false;
var _5f3=_5ef._redirectUri;
var _5f4=_5ef._location;
var _5f5=_5ef.parent;
var _5f6=_5f5.getRedirectPolicy();
if(_5f6 instanceof HttpRedirectPolicy){
if(!_5f6.isRedirectionAllowed(_5f4.toString(),_5f3.toString())){
_5ef.preventFallback=true;
var s=_5f6.toString()+": Cannot redirect from "+_5f4.toString()+" to "+_5f3.toString();
this._listener.connectionClosed(_5ef,false,1006,s);
return;
}
}
_5ef._redirected=true;
_5ef.handshakePayload="";
var _5f8=[_560.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_5ef._protocol.length;i++){
_5f8.push(_5ef._protocol[i]);
}
this.processConnect(_5ef,_5ef._redirectUri,_5f8);
}else{
this._listener.connectionClosed(_5ef,_5f0,code,_5f2);
}
};
_5eb.handleMessageReceived=function(_5fa,obj){
LOG.finest(_5e4,"handleMessageReceived",obj);
if(_5fa._balanced>1){
this._listener.binaryMessageReceived(_5fa,obj);
return;
}
var _5fc=_2bb(obj);
if(_5fc.charCodeAt(0)==61695){
if(_5fc.match("N$")){
_5fa._balanced++;
if(_5fa._balanced==1){
this._listener.connectionOpened(_5fa,_560.KAAZING_EXTENDED_HANDSHAKE);
}else{
this._listener.connectionOpened(_5fa,_5fa._acceptedProtocol||"");
}
}else{
if(_5fc.indexOf("R")==1){
var _5fd=new _509(_5fc.substring(2));
_5e7(this,_5fa,_5fd);
}else{
LOG.warning(_5e4,"Invalidate balancing message: "+target);
}
}
return;
}else{
this._listener.binaryMessageReceived(_5fa,obj);
}
};
_5eb.setNextHandler=function(_5fe){
this._nextHandler=_5fe;
var _5ff=new _54a(this);
var _600=this;
_5ff.connectionOpened=function(_601,_602){
if(_560.KAAZING_EXTENDED_HANDSHAKE!=_602){
_601._balanced=2;
_600._listener.connectionOpened(_601,_602);
}
};
_5ff.textMessageReceived=function(_603,_604){
LOG.finest(_5e4,"textMessageReceived",_604);
if(_603._balanced>1){
_600._listener.textMessageReceived(_603,_604);
return;
}
if(_604.charCodeAt(0)==61695){
if(_604.match("N$")){
_603._balanced++;
if(_603._balanced==1){
_600._listener.connectionOpened(_603,_560.KAAZING_EXTENDED_HANDSHAKE);
}else{
_600._listener.connectionOpened(_603,"");
}
}else{
if(_604.indexOf("R")==1){
var _605=new _509(_604.substring(2));
_5e7(_600,_603,_605);
}else{
LOG.warning(_5e4,"Invalidate balancing message: "+target);
}
}
return;
}else{
_600._listener.textMessageReceived(_603,_604);
}
};
_5ff.binaryMessageReceived=function(_606,obj){
_600.handleMessageReceived(_606,obj);
};
_5ff.connectionClosed=function(_608,_609,code,_60b){
_600.handleConnectionClosed(_608,_609,code,_60b);
};
_5fe.setListener(_5ff);
};
_5eb.setListener=function(_60c){
this._listener=_60c;
};
return _5e6;
})();
var _60d=(function(){
var _60e="WebSocketNativeHandshakeHandler";
var LOG=_275.getLogger(_60e);
var _610="Sec-WebSocket-Protocol";
var _611="Sec-WebSocket-Extensions";
var _612="Authorization";
var _613="WWW-Authenticate";
var _614="Set-Cookie";
var _615="GET";
var _616="HTTP/1.1";
var _617=":";
var _618=" ";
var _619="\r\n";
var _61a=function(){
LOG.finest(_60e,"<init>");
};
var _61b=function(_61c,_61d){
LOG.finest(_60e,"sendCookieRequest with {0}",_61d);
var _61e=new XMLHttpRequest0();
var path=_61c._location.getHttpEquivalentScheme()+"://"+_61c._location.getAuthority()+(_61c._location._uri.path||"");
path=path.replace(/[\/]?$/,"/;api/set-cookies");
_61e.open("POST",path,true);
_61e.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_61e.send(_61d);
};
var _620=function(_621,_622,_623){
var _624=[];
var _625=[];
_624.push("WebSocket-Protocol");
_625.push("");
_624.push(_610);
_625.push(_622._protocol.join(","));
var _626=[_560.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT,_560.KAAZING_SEC_EXTENSION_PING_PONG];
var ext=_622._extensions;
if(ext.length>0){
_626.push(ext);
}
_624.push(_611);
_625.push(_626.join(","));
_624.push(_612);
_625.push(_623);
var _628=_629(_622._location,_624,_625);
_621._nextHandler.processTextMessage(_622,_628);
};
var _629=function(_62a,_62b,_62c){
LOG.entering(_60e,"encodeGetRequest");
var _62d=[];
_62d.push(_615);
_62d.push(_618);
var path=[];
if(_62a._uri.path!=undefined){
path.push(_62a._uri.path);
}
if(_62a._uri.query!=undefined){
path.push("?");
path.push(_62a._uri.query);
}
_62d.push(path.join(""));
_62d.push(_618);
_62d.push(_616);
_62d.push(_619);
for(var i=0;i<_62b.length;i++){
var _630=_62b[i];
var _631=_62c[i];
if(_630!=null&&_631!=null){
_62d.push(_630);
_62d.push(_617);
_62d.push(_618);
_62d.push(_631);
_62d.push(_619);
}
}
_62d.push(_619);
var _632=_62d.join("");
return _632;
};
var _633=function(_634,_635,s){
if(s.length>0){
_635.handshakePayload+=s;
return;
}
var _637=_635.handshakePayload.split("\n");
_635.handshakePayload="";
var _638="";
for(var i=_637.length-1;i>=0;i--){
if(_637[i].indexOf("HTTP/1.1")==0){
var temp=_637[i].split(" ");
_638=temp[1];
break;
}
}
if("101"==_638){
var _63b=[];
var _63c="";
for(var i=0;i<_637.length;i++){
var line=_637[i];
if(line!=null&&line.indexOf(_611)==0){
_63b.push(line.substring(_611.length+2));
}else{
if(line!=null&&line.indexOf(_610)==0){
_63c=line.substring(_610.length+2);
}else{
if(line!=null&&line.indexOf(_614)==0){
_61b(_635,line.substring(_614.length+2));
}
}
}
}
_635._acceptedProtocol=_63c;
if(_63b.length>0){
var _63e=[];
var _63f=_63b.join(", ").split(", ");
for(var j=0;j<_63f.length;j++){
var tmp=_63f[j].split(";");
var ext=tmp[0].replace(/^\s+|\s+$/g,"");
var _643=new WebSocketExtension(ext);
if(_560.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT===ext){
var _644=tmp[1].match(/\d+/)[0];
if(_644>0){
_634._nextHandler.setIdleTimeout(_635,_644);
}
continue;
}else{
if(_560.KAAZING_SEC_EXTENSION_PING_PONG===ext){
try{
var _645=tmp[1].replace(/^\s+|\s+$/g,"");
var _646=parseInt(_645,16);
_635._controlFrames[_646]=ext;
_635._escapeSequences[_646]=ext;
continue;
}
catch(e){
throw new Error("failed to parse escape key for x-kaazing-ping-pong extension");
}
}else{
if(tmp.length>1){
var _645=tmp[1].replace(/^\s+|\s+$/g,"");
if(_645.length==8){
try{
var _646=parseInt(_645,16);
_635._controlFrames[_646]=ext;
if(_560.KAAZING_SEC_EXTENSION_REVALIDATE===ext){
_635._controlFramesBinary[_646]=ext;
}
_643.escape=_645;
}
catch(e){
LOG.finest(_60e,"parse control frame bytes error");
}
}
}
}
}
_643.enabled=true;
_643.negotiated=true;
_63e.push(_63f[j]);
}
if(_63e.length>0){
_635.parent._negotiatedExtensions[ext]=_63e.join(",");
}
}
return;
}else{
if("401"==_638){
_635.handshakestatus=2;
var _647="";
for(var i=0;i<_637.length;i++){
if(_637[i].indexOf(_613)==0){
_647=_637[i].substring(_613.length+2);
break;
}
}
_634._listener.authenticationRequested(_635,_635._location.toString(),_647);
}else{
_634._listener.connectionFailed(_635);
}
}
};
var _648=function(_649,_64a){
try{
_64a.handshakestatus=3;
_649._nextHandler.processClose(_64a);
}
finally{
_649._listener.connectionFailed(_64a);
}
};
var _64b=_61a.prototype=new _537();
_64b.processConnect=function(_64c,uri,_64e){
_64c.handshakePayload="";
var _64f=[_560.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_64e.length;i++){
_64f.push(_64e[i]);
}
this._nextHandler.processConnect(_64c,uri,_64f);
if((typeof (_64c.parent.connectTimer)=="undefined")||(_64c.parent.connectTimer==null)){
_64c.handshakestatus=0;
var _651=this;
setTimeout(function(){
if(_64c.handshakestatus==0){
_648(_651,_64c);
}
},5000);
}
};
_64b.processAuthorize=function(_652,_653){
_620(this,_652,_653);
};
_64b.handleConnectionOpened=function(_654,_655){
LOG.finest(_60e,"handleConnectionOpened");
if(_560.KAAZING_EXTENDED_HANDSHAKE==_655){
_620(this,_654,null);
_654.handshakestatus=1;
if((typeof (_654.parent.connectTimer)=="undefined")||(_654.parent.connectTimer==null)){
var _656=this;
setTimeout(function(){
if(_654.handshakestatus<2){
_648(_656,_654);
}
},5000);
}
}else{
_654.handshakestatus=2;
this._listener.connectionOpened(_654,_655);
}
};
_64b.handleMessageReceived=function(_657,_658){
LOG.finest(_60e,"handleMessageReceived",_658);
if(_657.readyState==WebSocket.OPEN){
_657._isEscape=false;
this._listener.textMessageReceived(_657,_658);
}else{
_633(this,_657,_658);
}
};
_64b.handleBinaryMessageReceived=function(_659,_65a){
LOG.finest(_60e,"handleMessageReceived",_65a);
if(_659.readyState==WebSocket.OPEN){
_659._isEscape=false;
this._listener.binaryMessageReceived(_659,_65a);
}else{
_633(this,_659,String.fromCharCode.apply(null,new Uint8Array(_65a)));
}
};
_64b.setNextHandler=function(_65b){
this._nextHandler=_65b;
var _65c=this;
var _65d=new _54a(this);
_65d.connectionOpened=function(_65e,_65f){
_65c.handleConnectionOpened(_65e,_65f);
};
_65d.textMessageReceived=function(_660,buf){
_65c.handleMessageReceived(_660,buf);
};
_65d.binaryMessageReceived=function(_662,buf){
_65c.handleBinaryMessageReceived(_662,buf);
};
_65d.connectionClosed=function(_664,_665,code,_667){
if(_664.handshakestatus<3){
_664.handshakestatus=3;
}
_65c._listener.connectionClosed(_664,_665,code,_667);
};
_65d.connectionFailed=function(_668){
if(_668.handshakestatus<3){
_668.handshakestatus=3;
}
_65c._listener.connectionFailed(_668);
};
_65b.setListener(_65d);
};
_64b.setListener=function(_669){
this._listener=_669;
};
return _61a;
})();
var _66a=(function(){
var _66b="WebSocketNativeAuthenticationHandler";
var LOG=_275.getLogger(_66b);
var _66d=function(){
LOG.finest(_66b,"<init>");
};
var _66e=_66d.prototype=new _537();
_66e.handleClearAuthenticationData=function(_66f){
if(_66f._challengeResponse!=null){
_66f._challengeResponse.clearCredentials();
}
};
_66e.handleRemoveAuthenticationData=function(_670){
this.handleClearAuthenticationData(_670);
_670._challengeResponse=new ChallengeResponse(null,null);
};
_66e.doError=function(_671){
this._nextHandler.processClose(_671);
this.handleClearAuthenticationData(_671);
this._listener.connectionFailed(_671);
};
_66e.handle401=function(_672,_673,_674){
var _675=this;
var _676=_672._location;
var _677=null;
if(typeof (_672.parent.connectTimer)!="undefined"){
_677=_672.parent.connectTimer;
if(_677!=null){
_677.pause();
}
}
if(_672.redirectUri!=null){
_676=_672._redirectUri;
}
if(_560.KAAZING_SEC_EXTENSION_REVALIDATE==_674){
var ch=new _564(_676,_672._protocol,_672._isBinary);
ch.challengeHandler=_672.parent.challengeHandler;
ch.parent=_672.parent;
var _679=new _5b9(ch);
_679.connect(_673);
}else{
var _67a=new ChallengeRequest(_676.toString(),_674);
var _67b;
if(_672._challengeResponse.nextChallengeHandler!=null){
_67b=_672._challengeResponse.nextChallengeHandler;
}else{
_67b=_672.parent.challengeHandler;
}
if(_67b!=null&&_67b.canHandle(_67a)){
_67b.handle(_67a,function(_67c){
try{
if(_67c==null||_67c.credentials==null){
_675.doError(_672);
}else{
if(_677!=null){
_677.resume();
}
_672._challengeResponse=_67c;
_675._nextHandler.processAuthorize(_672,_67c.credentials);
}
}
catch(e){
_675.doError(_672);
}
});
}else{
this.doError(_672);
}
}
};
_66e.handleAuthenticate=function(_67d,_67e,_67f){
_67d.authenticationReceived=true;
this.handle401(_67d,_67e,_67f);
};
_66e.setNextHandler=function(_680){
this._nextHandler=_680;
var _681=this;
var _682=new _54a(this);
_682.authenticationRequested=function(_683,_684,_685){
_681.handleAuthenticate(_683,_684,_685);
};
_680.setListener(_682);
};
_66e.setListener=function(_686){
this._listener=_686;
};
return _66d;
})();
var _687=(function(){
var _688="WebSocketHixie76FrameCodecHandler";
var LOG=_275.getLogger(_688);
var _68a=function(){
LOG.finest(_688,"<init>");
};
var _68b=_68a.prototype=new _537();
_68b.processConnect=function(_68c,uri,_68e){
this._nextHandler.processConnect(_68c,uri,_68e);
};
_68b.processBinaryMessage=function(_68f,data){
if(data.constructor==ByteBuffer){
var _691=data.array.slice(data.position,data.limit);
this._nextHandler.processTextMessage(_68f,Charset.UTF8.encodeByteArray(_691));
}else{
if(data.byteLength){
this._nextHandler.processTextMessage(_68f,Charset.UTF8.encodeArrayBuffer(data));
}else{
if(data.size){
var _692=this;
var cb=function(_694){
_692._nextHandler.processBinaryMessage(_68f,Charset.UTF8.encodeByteArray(_694));
};
BlobUtils.asNumberArray(cb,data);
}else{
throw new Error("Invalid type for send");
}
}
}
};
_68b.setNextHandler=function(_695){
this._nextHandler=_695;
var _696=this;
var _697=new _54a(this);
_697.textMessageReceived=function(_698,text){
_696._listener.binaryMessageReceived(_698,ByteBuffer.wrap(Charset.UTF8.toByteArray(text)));
};
_697.binaryMessageReceived=function(_69a,buf){
throw new Error("draft76 won't receive binary frame");
};
_695.setListener(_697);
};
_68b.setListener=function(_69c){
this._listener=_69c;
};
return _68a;
})();
var _69d=(function(){
var _69e="WebSocketNativeHandler";
var LOG=_275.getLogger(_69e);
var _6a0=function(){
var _6a1=new _66a();
return _6a1;
};
var _6a2=function(){
var _6a3=new _60d();
return _6a3;
};
var _6a4=function(){
var _6a5=new _57a();
return _6a5;
};
var _6a6=function(){
var _6a7=new _5e3();
return _6a7;
};
var _6a8=function(){
var _6a9=new _5cd();
return _6a9;
};
var _6aa=function(){
var _6ab=new _687();
return _6ab;
};
var _6ac=(browser=="safari"&&typeof (WebSocket.CLOSING)=="undefined");
var _6ad=_6a0();
var _6ae=_6a2();
var _6af=_6a4();
var _6b0=_6a6();
var _6b1=_6a8();
var _6b2=_6aa();
var _6b3=function(){
LOG.finest(_69e,"<init>");
if(_6ac){
this.setNextHandler(_6b2);
_6b2.setNextHandler(_6ad);
}else{
this.setNextHandler(_6ad);
}
_6ad.setNextHandler(_6ae);
_6ae.setNextHandler(_6af);
_6af.setNextHandler(_6b0);
_6b0.setNextHandler(_6b1);
};
var _6b4=function(_6b5,_6b6){
LOG.finest(_69e,"<init>");
};
var _6b7=_6b3.prototype=new _537();
_6b7.setNextHandler=function(_6b8){
this._nextHandler=_6b8;
var _6b9=new _54a(this);
_6b8.setListener(_6b9);
};
_6b7.setListener=function(_6ba){
this._listener=_6ba;
};
return _6b3;
})();
var _6bb=(function(){
var _6bc=_275.getLogger("com.kaazing.gateway.client.html5.WebSocketEmulatedProxyDownstream");
var _6bd=512*1024;
var _6be=1;
var _6bf=function(_6c0,_6c1,_6c2){
_6bc.entering(this,"WebSocketEmulatedProxyDownstream.<init>",_6c0);
this.sequence=_6c1;
this.retry=3000;
if(_6c0.indexOf("/;e/dtem/")>0){
this.requiresEscaping=true;
}
var _6c3=new URI(_6c0);
var _6c4={"http":80,"https":443};
if(_6c3.port==undefined){
_6c3.port=_6c4[_6c3.scheme];
_6c3.authority=_6c3.host+":"+_6c3.port;
}
this.origin=_6c3.scheme+"://"+_6c3.authority;
this.location=_6c0;
this.activeXhr=null;
this.reconnectTimer=null;
this.idleTimer=null;
this.idleTimeout=null;
this.lastMessageTimestamp=null;
this.buf=new ByteBuffer();
this.connectTimer=null;
this.connectionTimeout=_6c2;
var _6c5=this;
setTimeout(function(){
connect(_6c5,true);
_6c5.activeXhr=_6c5.mostRecentXhr;
startProxyDetectionTimer(_6c5,_6c5.mostRecentXhr);
},0);
_6bc.exiting(this,"WebSocketEmulatedProxyDownstream.<init>");
};
var _6c6=_6bf.prototype;
var _6c7=0;
var _6c8=255;
var _6c9=1;
var _6ca=128;
var _6cb=129;
var _6cc=127;
var _6cd=137;
var _6ce=3000;
_6c6.readyState=0;
function connect(_6cf,_6d0){
_6bc.entering(this,"WebSocketEmulatedProxyDownstream.connect");
if(_6cf.reconnectTimer!==null){
_6cf.reconnectTimer=null;
}
stopIdleTimer(_6cf);
startConnectTimer(_6cf,_6cf.connectionTimeout);
var _6d1=new URI(_6cf.location);
var _6d2=[];
var _6d3=_6cf.sequence++;
_6d2.push(".ksn="+_6d3);
switch(browser){
case "ie":
_6d2.push(".kns=1");
_6d2.push(".kf=200&.kp=2048");
break;
case "safari":
_6d2.push(".kp=256");
break;
case "firefox":
_6d2.push(".kp=1025");
break;
case "android":
_6d2.push(".kp=4096");
_6d2.push(".kbp=4096");
break;
}
if(browser=="android"||browser.ios){
_6d2.push(".kkt=20");
}
_6d2.push(".kc=text/plain;charset=windows-1252");
_6d2.push(".kb=4096");
_6d2.push(".kid="+String(Math.random()).substring(2));
if(_6d2.length>0){
if(_6d1.query===undefined){
_6d1.query=_6d2.join("&");
}else{
_6d1.query+="&"+_6d2.join("&");
}
}
var xhr=new XMLHttpRequest0();
xhr.id=_6be++;
xhr.position=0;
xhr.opened=false;
xhr.reconnect=false;
xhr.requestClosing=false;
xhr.onreadystatechange=function(){
if(xhr.readyState==3){
stopConnectTimer(_6cf);
if(_6cf.idleTimer==null){
var _6d5=xhr.getResponseHeader("X-Idle-Timeout");
if(_6d5){
if(!_6d5.match(/^[\d]+$/)){
doError(_6cf);
throw "Invalid response of header X-Idle-Timeout";
}
var _6d6=parseInt(_6d5);
if(_6d6>0){
_6d6=_6d6*1000;
_6cf.idleTimeout=_6d6;
_6cf.lastMessageTimestamp=new Date().getTime();
startIdleTimer(_6cf,_6d6);
}
}
}
}
};
xhr.onprogress=function(){
if(xhr==_6cf.activeXhr&&_6cf.readyState!=2){
_process(_6cf);
}
};
xhr.onload=function(){
if(xhr==_6cf.activeXhr&&_6cf.readyState!=2){
_process(_6cf);
xhr.onerror=function(){
};
xhr.ontimeout=function(){
};
xhr.onreadystatechange=function(){
};
if(!xhr.reconnect){
doError(_6cf);
}else{
if(xhr.requestClosing){
doClose(_6cf);
}else{
if(_6cf.activeXhr==_6cf.mostRecentXhr){
connect(_6cf);
_6cf.activeXhr=_6cf.mostRecentXhr;
startProxyDetectionTimer(_6cf,_6cf.activeXhr);
}else{
var _6d7=_6cf.mostRecentXhr;
_6cf.activeXhr=_6d7;
switch(_6d7.readyState){
case 1:
case 2:
startProxyDetectionTimer(_6cf,_6d7);
break;
case 3:
_process(_6cf);
break;
case 4:
_6cf.activeXhr.onload();
break;
default:
}
}
}
}
}
};
xhr.ontimeout=function(){
_6bc.entering(this,"WebSocketEmulatedProxyDownstream.connect.xhr.ontimeout");
doError(_6cf);
};
xhr.onerror=function(){
_6bc.entering(this,"WebSocketEmulatedProxyDownstream.connect.xhr.onerror");
doError(_6cf);
};
xhr.open("GET",_6d1.toString(),true);
xhr.send("");
_6cf.mostRecentXhr=xhr;
};
function startProxyDetectionTimer(_6d8,xhr){
if(_6d8.location.indexOf(".ki=p")==-1){
setTimeout(function(){
if(xhr&&xhr.readyState<3&&_6d8.readyState<2){
if(_6d8.location.indexOf("?")==-1){
_6d8.location+="?.ki=p";
}else{
_6d8.location+="&.ki=p";
}
connect(_6d8,false);
}
},_6ce);
}
};
_6c6.disconnect=function(){
_6bc.entering(this,"WebSocketEmulatedProxyDownstream.disconnect");
if(this.readyState!==2){
_disconnect(this);
}
};
function _disconnect(_6da){
_6bc.entering(this,"WebSocketEmulatedProxyDownstream._disconnect");
if(_6da.reconnectTimer!==null){
clearTimeout(_6da.reconnectTimer);
_6da.reconnectTimer=null;
}
stopIdleTimer(_6da);
if(_6da.mostRecentXhr!==null){
_6da.mostRecentXhr.onprogress=function(){
};
_6da.mostRecentXhr.onload=function(){
};
_6da.mostRecentXhr.onerror=function(){
};
_6da.mostRecentXhr.abort();
}
if(_6da.activeXhr!=_6da.mostRecentXhr&&_6da.activeXhr!==null){
_6da.activeXhr.onprogress=function(){
};
_6da.activeXhr.onload=function(){
};
_6da.activeXhr.onerror=function(){
};
_6da.activeXhr.abort();
}
_6da.lineQueue=[];
_6da.lastEventId=null;
_6da.location=null;
_6da.readyState=2;
};
function _process(_6db){
_6db.lastMessageTimestamp=new Date().getTime();
var xhr=_6db.activeXhr;
var _6dd=xhr.responseText;
if(_6dd.length>=_6bd){
if(_6db.activeXhr==_6db.mostRecentXhr){
connect(_6db,false);
}
}
var _6de=_6dd.slice(xhr.position);
xhr.position=_6dd.length;
var buf=_6db.buf;
var _6e0=_497.toArray(_6de,_6db.requiresEscaping);
if(_6e0.hasRemainder){
xhr.position--;
}
buf.position=buf.limit;
buf.putBytes(_6e0);
buf.position=0;
buf.mark();
parse:
while(true){
if(!buf.hasRemaining()){
break;
}
var type=buf.getUnsigned();
switch(type&128){
case _6c7:
var _6e2=buf.indexOf(_6c8);
if(_6e2==-1){
break parse;
}
var _6e3=buf.array.slice(buf.position,_6e2);
var data=new ByteBuffer(_6e3);
var _6e5=_6e2-buf.position;
buf.skip(_6e5+1);
buf.mark();
if(type==_6c9){
handleCommandFrame(_6db,data);
}else{
dispatchText(_6db,data.getString(Charset.UTF8));
}
break;
case _6ca:
case _6cb:
var _6e6=0;
var _6e7=false;
while(buf.hasRemaining()){
var b=buf.getUnsigned();
_6e6=_6e6<<7;
_6e6|=(b&127);
if((b&128)!=128){
_6e7=true;
break;
}
}
if(!_6e7){
break parse;
}
if(buf.remaining()<_6e6){
break parse;
}
var _6e9=buf.array.slice(buf.position,buf.position+_6e6);
var _6ea=new ByteBuffer(_6e9);
buf.skip(_6e6);
buf.mark();
if(type==_6ca){
dispatchBytes(_6db,_6ea);
}else{
if(type==_6cd){
dispatchPingReceived(_6db);
}else{
dispatchText(_6db,_6ea.getString(Charset.UTF8));
}
}
break;
default:
throw new Error("Emulation protocol error. Unknown frame type: "+type);
}
}
buf.reset();
buf.compact();
};
function handleCommandFrame(_6eb,data){
while(data.remaining()){
var _6ed=String.fromCharCode(data.getUnsigned());
switch(_6ed){
case "0":
break;
case "1":
_6eb.activeXhr.reconnect=true;
break;
case "2":
_6eb.activeXhr.requestClosing=true;
break;
default:
throw new Error("Protocol decode error. Unknown command: "+_6ed);
}
}
};
function dispatchBytes(_6ee,buf){
var e=document.createEvent("Events");
e.initEvent("message",true,true);
e.lastEventId=_6ee.lastEventId;
e.data=buf;
e.decoder=_2b4;
e.origin=_6ee.origin;
if(e.source!==null){
e.source=null;
}
if(typeof (_6ee.onmessage)==="function"){
_6ee.onmessage(e);
}
};
function dispatchText(_6f1,data){
var e=document.createEvent("Events");
e.initEvent("message",true,true);
e.lastEventId=_6f1.lastEventId;
e.text=data;
e.origin=_6f1.origin;
if(e.source!==null){
e.source=null;
}
if(typeof (_6f1.onmessage)==="function"){
_6f1.onmessage(e);
}
};
function dispatchPingReceived(_6f4){
if(typeof (_6f4.onping)==="function"){
_6f4.onping();
}
};
function doClose(_6f5){
doError(_6f5);
};
function doError(_6f6){
if(_6f6.readyState!=2){
_6f6.disconnect();
fireError(_6f6);
}
};
function fireError(_6f7){
var e=document.createEvent("Events");
e.initEvent("error",true,true);
if(typeof (_6f7.onerror)==="function"){
_6f7.onerror(e);
}
};
function startIdleTimer(_6f9,_6fa){
stopIdleTimer(_6f9);
_6f9.idleTimer=setTimeout(function(){
idleTimerHandler(_6f9);
},_6fa);
};
function idleTimerHandler(_6fb){
var _6fc=new Date().getTime();
var _6fd=_6fc-_6fb.lastMessageTimestamp;
var _6fe=_6fb.idleTimeout;
if(_6fd>_6fe){
doError(_6fb);
}else{
startIdleTimer(_6fb,_6fe-_6fd);
}
};
function stopIdleTimer(_6ff){
if(_6ff.idleTimer!=null){
clearTimeout(_6ff.idleTimer);
_6ff.idleTimer=null;
}
};
function startConnectTimer(_700,_701){
stopConnectTimer(_700);
_700.connectTimer=setTimeout(function(){
connectTimerHandler(_700);
},_701);
};
function connectTimerHandler(_702){
doError(_702);
};
function stopConnectTimer(_703){
if(_703.connectTimer!=null){
clearTimeout(_703.connectTimer);
_703.connectTimer=null;
}
};
return _6bf;
})();
var _704=(function(){
var _705=_275.getLogger("WebSocketEmulatedProxy");
var _706=function(){
this.parent;
this._listener;
this.closeCode=1005;
this.closeReason="";
this.sequence=0;
};
var _707=_706.prototype;
_707.connect=function(_708,_709){
_705.entering(this,"WebSocketEmulatedProxy.connect",{"location":_708,"subprotocol":_709});
this.URL=_708.replace("ws","http");
this.protocol=_709;
this._prepareQueue=new _4f1();
this._sendQueue=[];
_70a(this);
_705.exiting(this,"WebSocketEmulatedProxy.<init>");
};
_707.readyState=0;
_707.bufferedAmount=0;
_707.URL="";
_707.onopen=function(){
};
_707.onerror=function(){
};
_707.onmessage=function(_70b){
};
_707.onclose=function(){
};
var _70c=128;
var _70d=129;
var _70e=0;
var _70f=255;
var _710=1;
var _711=138;
var _712=[_710,48,49,_70f];
var _713=[_710,48,50,_70f];
var _714=function(buf,_716){
_705.entering(this,"WebSocketEmulatedProxy.encodeLength",{"buf":buf,"length":_716});
var _717=0;
var _718=0;
do{
_718<<=8;
_718|=(_716&127);
_716>>=7;
_717++;
}while(_716>0);
do{
var _719=_718&255;
_718>>=8;
if(_717!=1){
_719|=128;
}
buf.put(_719);
}while(--_717>0);
};
_707.send=function(data){
var _71b=this;
_705.entering(this,"WebSocketEmulatedProxy.send",{"data":data});
switch(this.readyState){
case 0:
_705.severe(this,"WebSocketEmulatedProxy.send: Error: readyState is 0");
throw new Error("INVALID_STATE_ERR");
case 1:
if(data===null){
_705.severe(this,"WebSocketEmulatedProxy.send: Error: data is null");
throw new Error("data is null");
}
var buf=new ByteBuffer();
if(typeof data=="string"){
_705.finest(this,"WebSocketEmulatedProxy.send: Data is string");
var _71d=new ByteBuffer();
_71d.putString(data,Charset.UTF8);
buf.put(_70d);
_714(buf,_71d.position);
buf.putBytes(_71d.array);
}else{
if(data.constructor==ByteBuffer){
_705.finest(this,"WebSocketEmulatedProxy.send: Data is ByteBuffer");
buf.put(_70c);
_714(buf,data.remaining());
buf.putBuffer(data);
}else{
if(data.byteLength){
_705.finest(this,"WebSocketEmulatedProxy.send: Data is ByteArray");
buf.put(_70c);
_714(buf,data.byteLength);
buf.putByteArray(data);
}else{
if(data.size){
_705.finest(this,"WebSocketEmulatedProxy.send: Data is Blob");
var cb=this._prepareQueue.enqueue(function(_71f){
var b=new ByteBuffer();
b.put(_70c);
_714(b,_71f.length);
b.putBytes(_71f);
b.flip();
doSend(_71b,b);
});
BlobUtils.asNumberArray(cb,data);
return true;
}else{
_705.severe(this,"WebSocketEmulatedProxy.send: Error: Invalid type for send");
throw new Error("Invalid type for send");
}
}
}
}
buf.flip();
this._prepareQueue.enqueue(function(_721){
doSend(_71b,buf);
})();
return true;
case 2:
return false;
default:
_705.severe(this,"WebSocketEmulatedProxy.send: Error: invalid readyState");
throw new Error("INVALID_STATE_ERR");
}
_705.exiting(this,"WebSocketEmulatedProxy.send");
};
_707.close=function(code,_723){
_705.entering(this,"WebSocketEmulatedProxy.close");
switch(this.readyState){
case 0:
_724(this);
break;
case 1:
if(code!=null&&code!=0){
this.closeCode=code;
this.closeReason=_723;
}
doSend(this,new ByteBuffer(_713));
break;
}
};
_707.setListener=function(_725){
this._listener=_725;
};
function openUpstream(_726){
if(_726.readyState!=1){
return;
}
var xdr=new XMLHttpRequest0();
xdr.onreadystatechange=function(){
if(xdr.readyState==4){
switch(xdr.status){
case 200:
setTimeout(function(){
doFlush(_726);
},0);
break;
}
}
};
xdr.onload=function(){
openUpstream(_726);
};
xdr.ontimeout=function(){
if(_726.upstreamXHR!=null){
_726.upstreamXHR.abort();
}
openUpstream(_726);
};
xdr.onerror=function(){
if(_726._downstream){
_726._downstream.disconnect();
}
_724(_726);
};
var url=appendRandomNumberQueryString(_726._upstream);
xdr.open("POST",url,true);
_726.upstreamXHR=xdr;
};
function doSend(_729,buf){
_705.entering(this,"WebSocketEmulatedProxy.doSend",buf);
_729.bufferedAmount+=buf.remaining();
_729._sendQueue.push(buf);
_72b(_729);
if(!_729._writeSuspended){
doFlush(_729);
}
};
function appendRandomNumberQueryString(url){
var _72d=".krn="+Math.random();
url+=((url.indexOf("?")==-1)?"?":"&")+_72d;
return url;
};
function doFlush(_72e){
_705.entering(this,"WebSocketEmulatedProxy.doFlush");
var _72f=_72e._sendQueue;
var _730=_72f.length;
_72e._writeSuspended=(_730>0);
if(_730>0){
var _731=_72e.sequence++;
if(_72e.useXDR){
if(_72e.upstreamXHR==null){
openUpstream(_72e);
}
var out=new ByteBuffer();
while(_72f.length){
out.putBuffer(_72f.shift());
}
out.putBytes(_712);
out.flip();
_72e.upstreamXHR.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_72e.upstreamXHR.setRequestHeader("X-Sequence-No",_731.toString());
_72e.upstreamXHR.send(_2cf(out,_72e.requiresEscaping));
}else{
var xhr=new XMLHttpRequest0();
xhr.onreadystatechange=function(){
if(xhr.readyState==4){
_705.finest(this,"WebSocketEmulatedProxy.doFlush: xhr.status="+xhr.status);
switch(xhr.status){
case 200:
setTimeout(function(){
doFlush(_72e);
},0);
break;
default:
_724(_72e);
break;
}
}
};
xhr.onerror=function(){
_705.finest(this,"WebSocketEmulatedProxy.doFlush: xhr.onerror status = "+xhr.status);
if(_72e._downstream){
_72e._downstream.disconnect();
}
_724(_72e);
};
var url=appendRandomNumberQueryString(_72e._upstream);
xhr.open("POST",url,true);
var out=new ByteBuffer();
while(_72f.length){
out.putBuffer(_72f.shift());
}
out.putBytes(_712);
out.flip();
xhr.setRequestHeader("X-Sequence-No",_731.toString());
if(browser=="firefox"){
if(xhr.sendAsBinary){
_705.finest(this,"WebSocketEmulatedProxy.doFlush: xhr.sendAsBinary");
xhr.setRequestHeader("Content-Type","application/octet-stream");
xhr.sendAsBinary(_2cf(out));
}else{
xhr.send(_2cf(out));
}
}else{
xhr.setRequestHeader("Content-Type","text/plain; charset=utf-8");
xhr.send(_2cf(out,_72e.requiresEscaping));
}
}
}
_72e.bufferedAmount=0;
_72b(_72e);
};
var _70a=function(_735){
_705.entering(this,"WebSocketEmulatedProxy.connect");
var url=new URI(_735.URL);
url.scheme=url.scheme.replace("ws","http");
if(browser=="ie"&&typeof (XDomainRequest)!=="undefined"&&location.protocol.replace(":","")==url.scheme){
_735.useXDR=true;
}
switch(browser){
case "opera":
_735.requiresEscaping=true;
break;
case "ie":
if(!_735.useXDR){
_735.requiresEscaping=true;
}else{
if((typeof (Object.defineProperties)==="undefined")&&(navigator.userAgent.indexOf("MSIE 8")>0)){
_735.requiresEscaping=true;
}else{
_735.requiresEscaping=false;
}
}
break;
default:
_735.requiresEscaping=false;
break;
}
var _737=_735.requiresEscaping?"/;e/ctem":"/;e/ctm";
url.path=url.path.replace(/[\/]?$/,_737);
var _738=url.toString();
var _739=_738.indexOf("?");
if(_739==-1){
_738+="?";
}else{
_738+="&";
}
_738+=".kn="+String(Math.random()).substring(2);
_705.finest(this,"WebSocketEmulatedProxy.connect: Connecting to "+_738);
var _73a=new XMLHttpRequest0();
var _73b=false;
_73a.withCredentials=true;
_73a.open("GET",_738,true);
_73a.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_73a.setRequestHeader("X-WebSocket-Version","wseb-1.0");
_73a.setRequestHeader("X-Accept-Commands","ping");
var _73c=_735.sequence++;
_73a.setRequestHeader("X-Sequence-No",_73c.toString());
if(_735.protocol.length){
var _73d=_735.protocol.join(",");
_73a.setRequestHeader("X-WebSocket-Protocol",_73d);
}
for(var i=0;i<_735.parent.requestHeaders.length;i++){
var _73f=_735.parent.requestHeaders[i];
_73a.setRequestHeader(_73f.label,_73f.value);
}
_73a.onerror=function(){
_705.info(this,"WebSocketEmulatedProxy.onerror",{"status":_73a.status});
doError(_735);
};
_73a.onredirectallowed=function(_740,_741){
var _742=_735.parent.parent;
var _743=_742.getRedirectPolicy();
if((typeof (_743)!="undefined")&&(_743!=null)){
if(!_743.isRedirectionAllowed(_740,_741)){
_73a.statusText=_743.toString()+": Cannot redirect from "+_740+" to "+_741;
_735.closeCode=1006;
_735.closeReason=_73a.statusText;
_735.parent.closeCode=_735.closeCode;
_735.parent.closeReason=_735.closeReason;
_735.parent.preventFallback=true;
doError(_735);
return false;
}
}
return true;
};
_73a.onreadystatechange=function(){
switch(_73a.readyState){
case 2:
if(_73a.status==403){
doError(_735);
}else{
var _744=_735.parent.parent._webSocket.connectTimeout;
if(_744==0){
_744=5000;
}
timer=setTimeout(function(){
if(!_73b){
doError(_735);
}
},_744);
}
break;
case 3:
break;
case 4:
_73b=true;
if(_73a.status==401){
_735._listener.authenticationRequested(_735.parent,_73a.xhr._location,_73a.getResponseHeader("WWW-Authenticate"));
return;
}
if(_735.readyState<1){
if(_73a.status==201){
_735.parent.responseHeaders[_560.HEADER_SEC_PROTOCOL]=_73a.getResponseHeader(_560.HEADER_SEC_PROTOCOL);
_735.parent.responseHeaders[_560.HEADER_SEC_EXTENSIONS]=_73a.getResponseHeader(_560.HEADER_SEC_EXTENSIONS);
var _745=10*1000;
var _746=_73a.getResponseHeader(_560.HEADER_SEC_EXTENSIONS);
if(_746){
var _747=_746.split(",");
for(var j=0;j<_747.length;j++){
var _749=_747[j].split(";");
var _74a=_749[0].replace(/^\s+|\s+$/g,"");
if(_560.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT===_74a){
_745=_749[1].match(/\d+/)[0];
_705.info(this,"WebSocketEmulatedProxy.onreadystatechange",{"timeout":_745});
break;
}
}
}
var _74b=_73a.responseText.split("\n");
var _74c=_74b[0];
var _74d=_74b[1];
var _74e=new URI(_73a.xhr._location);
var _74f=new URI(_74c);
var _750=new URI(_74d);
if(_74e.host.toLowerCase()!=_74f.host.toLowerCase()){
throw new Error("Hostname in original URI does not match with the hostname in the upstream URI.");
}
if(_74e.host.toLowerCase()!=_750.host.toLowerCase()){
throw new Error("Hostname in original URI does not match with the hostname in the downstream URI.");
}
_735._upstream=_74e.scheme+"://"+_74e.authority+_74f.path;
_735._downstream=new _6bb(_74d,_735.sequence,_745);
var _751=_74d.substring(0,_74d.indexOf("/;e/"));
if(_751!=_735.parent._location.toString().replace("ws","http")){
_735.parent._redirectUri=_751;
}
_752(_735,_735._downstream);
_753(_735);
}else{
doError(_735);
}
}
break;
}
};
_73a.send(null);
_705.exiting(this,"WebSocketEmulatedProxy.connect");
};
var _753=function(_754){
_705.entering(this,"WebSocketEmulatedProxy.doOpen");
_754.readyState=1;
var _755=_754.parent;
_755._acceptedProtocol=_755.responseHeaders["X-WebSocket-Protocol"]||"";
if(_754.useXDR){
this.upstreamXHR=null;
openUpstream(_754);
}
_754._listener.connectionOpened(_754.parent,_755._acceptedProtocol);
};
function doError(_756){
if(_756.readyState<2){
_705.entering(this,"WebSocketEmulatedProxy.doError");
_756.readyState=2;
if(_756.upstreamXHR!=null){
_756.upstreamXHR.abort();
}
if(_756.onerror!=null){
_756._listener.connectionFailed(_756.parent);
}
}
};
var _724=function(_757,_758,code,_75a){
_705.entering(this,"WebSocketEmulatedProxy.doClose");
switch(_757.readyState){
case 2:
break;
case 0:
case 1:
_757.readyState=WebSocket.CLOSED;
if(_757.upstreamXHR!=null){
_757.upstreamXHR.abort();
}
if(typeof _758==="undefined"){
_757._listener.connectionClosed(_757.parent,true,1005,"");
}else{
_757._listener.connectionClosed(_757.parent,_758,code,_75a);
}
break;
default:
}
};
var _72b=function(_75b){
};
var _75c=function(_75d,_75e){
_705.finest("WebSocket.handleMessage: A WebSocket frame received on a WebSocket");
if(_75e.text){
_75d._listener.textMessageReceived(_75d.parent,_75e.text);
}else{
if(_75e.data){
_75d._listener.binaryMessageReceived(_75d.parent,_75e.data);
}
}
};
var _75f=function(_760){
var _761=ByteBuffer.allocate(2);
_761.put(_711);
_761.put(0);
_761.flip();
doSend(_760,_761);
};
var _752=function(_762,_763){
_705.entering(this,"WebSocketEmulatedProxy.bindHandlers");
_763.onmessage=function(_764){
switch(_764.type){
case "message":
if(_762.readyState==1){
_75c(_762,_764);
}
break;
}
};
_763.onping=function(){
if(_762.readyState==1){
_75f(_762);
}
};
_763.onerror=function(){
try{
_763.disconnect();
}
finally{
_724(_762,true,_762.closeCode,_762.closeReason);
}
};
_763.onclose=function(_765){
try{
_763.disconnect();
}
finally{
_724(_762,true,this.closeCode,this.closeReason);
}
};
};
return _706;
})();
var _766=(function(){
var _767="WebSocketEmulatedDelegateHandler";
var LOG=_275.getLogger(_767);
var _769=function(){
LOG.finest(_767,"<init>");
};
var _76a=_769.prototype=new _537();
_76a.processConnect=function(_76b,uri,_76d){
LOG.finest(_767,"connect",_76b);
if(_76b.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
var _76e=!!window.MockWseTransport?new MockWseTransport():new _704();
_76e.parent=_76b;
_76b._delegate=_76e;
_76f(_76e,this);
_76e.connect(uri.toString(),_76d);
};
_76a.processTextMessage=function(_770,text){
LOG.finest(_767,"connect",_770);
if(_770.readyState==WebSocket.OPEN){
_770._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_76a.processBinaryMessage=function(_772,obj){
LOG.finest(_767,"processBinaryMessage",_772);
if(_772.readyState==WebSocket.OPEN){
_772._delegate.send(obj);
}else{
throw new Error("WebSocket is already closed");
}
};
_76a.processClose=function(_774,code,_776){
LOG.finest(_767,"close",_774);
try{
_774._delegate.close(code,_776);
}
catch(e){
listener.connectionClosed(_774);
}
};
var _76f=function(_777,_778){
var _779=new _54a(_778);
_777.setListener(_779);
};
return _769;
})();
var _77a=(function(){
var _77b="WebSocketEmulatedAuthenticationHandler";
var LOG=_275.getLogger(_77b);
var _77d=function(){
LOG.finest(_77b,"<init>");
};
var _77e=_77d.prototype=new _537();
_77e.handleClearAuthenticationData=function(_77f){
if(_77f._challengeResponse!=null){
_77f._challengeResponse.clearCredentials();
}
};
_77e.handleRemoveAuthenticationData=function(_780){
this.handleClearAuthenticationData(_780);
_780._challengeResponse=new ChallengeResponse(null,null);
};
_77e.handle401=function(_781,_782,_783){
var _784=this;
var _785=null;
if(typeof (_781.parent.connectTimer)!="undefined"){
_785=_781.parent.connectTimer;
if(_785!=null){
_785.pause();
}
}
if(_560.KAAZING_SEC_EXTENSION_REVALIDATE==_783){
var _786=new _5b9(_781);
_781.challengeHandler=_781.parent.challengeHandler;
_786.connect(_782);
}else{
var _787=_782;
if(_787.indexOf("/;e/")>0){
_787=_787.substring(0,_787.indexOf("/;e/"));
}
var _788=new _509(_787.replace("http","ws"));
var _789=new ChallengeRequest(_787,_783);
var _78a;
if(_781._challengeResponse.nextChallengeHandler!=null){
_78a=_781._challengeResponse.nextChallengeHandler;
}else{
_78a=_781.parent.challengeHandler;
}
if(_78a!=null&&_78a.canHandle(_789)){
_78a.handle(_789,function(_78b){
try{
if(_78b==null||_78b.credentials==null){
_784.handleClearAuthenticationData(_781);
_784._listener.connectionFailed(_781);
}else{
if(_785!=null){
_785.resume();
}
_781._challengeResponse=_78b;
_784.processConnect(_781,_788,_781._protocol);
}
}
catch(e){
_784.handleClearAuthenticationData(_781);
_784._listener.connectionFailed(_781);
}
});
}else{
this.handleClearAuthenticationData(_781);
this._listener.connectionFailed(_781);
}
}
};
_77e.processConnect=function(_78c,_78d,_78e){
if(_78c._challengeResponse!=null&&_78c._challengeResponse.credentials!=null){
var _78f=_78c._challengeResponse.credentials.toString();
for(var i=_78c.requestHeaders.length-1;i>=0;i--){
if(_78c.requestHeaders[i].label==="Authorization"){
_78c.requestHeaders.splice(i,1);
}
}
var _791=new _4fb("Authorization",_78f);
for(var i=_78c.requestHeaders.length-1;i>=0;i--){
if(_78c.requestHeaders[i].label==="Authorization"){
_78c.requestHeaders.splice(i,1);
}
}
_78c.requestHeaders.push(_791);
this.handleClearAuthenticationData(_78c);
}
this._nextHandler.processConnect(_78c,_78d,_78e);
};
_77e.handleAuthenticate=function(_792,_793,_794){
_792.authenticationReceived=true;
this.handle401(_792,_793,_794);
};
_77e.setNextHandler=function(_795){
this._nextHandler=_795;
var _796=new _54a(this);
var _797=this;
_796.authenticationRequested=function(_798,_799,_79a){
_797.handleAuthenticate(_798,_799,_79a);
};
_795.setListener(_796);
};
_77e.setListener=function(_79b){
this._listener=_79b;
};
return _77d;
})();
var _79c=(function(){
var _79d="WebSocketEmulatedHandler";
var LOG=_275.getLogger(_79d);
var _79f=new _77a();
var _7a0=new _57a();
var _7a1=new _766();
var _7a2=function(){
LOG.finest(_79d,"<init>");
this.setNextHandler(_79f);
_79f.setNextHandler(_7a0);
_7a0.setNextHandler(_7a1);
};
var _7a3=_7a2.prototype=new _537();
_7a3.processConnect=function(_7a4,_7a5,_7a6){
var _7a7=[];
for(var i=0;i<_7a6.length;i++){
_7a7.push(_7a6[i]);
}
var _7a9=[];
_7a9.push(_7a4._extensions);
_7a9.push(_560.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT);
_7a4.requestHeaders.push(new _4fb(_560.HEADER_SEC_EXTENSIONS,_7a9.join(",")));
this._nextHandler.processConnect(_7a4,_7a5,_7a7);
};
_7a3.setNextHandler=function(_7aa){
this._nextHandler=_7aa;
var _7ab=this;
var _7ac=new _54a(this);
_7ac.commandMessageReceived=function(_7ad,_7ae){
if(_7ae=="CloseCommandMessage"&&_7ad.readyState==1){
}
_7ab._listener.commandMessageReceived(_7ad,_7ae);
};
_7aa.setListener(_7ac);
};
_7a3.setListener=function(_7af){
this._listener=_7af;
};
return _7a2;
})();
var _7b0=(function(){
var _7b1="WebSocketFlashEmulatedDelegateHandler";
var LOG=_275.getLogger(_7b1);
var _7b3=function(){
LOG.finest(_7b1,"<init>");
};
var _7b4=_7b3.prototype=new _537();
_7b4.processConnect=function(_7b5,uri,_7b7){
LOG.finest(_7b1,"connect",_7b5);
if(_7b5.readyState==2){
throw new Error("WebSocket is already closed");
}
var _7b8=new _312();
_7b8.parent=_7b5;
_7b5._delegate=_7b8;
_7b9(_7b8,this);
_7b8.connect(uri.toString(),_7b7);
};
_7b4.processTextMessage=function(_7ba,text){
LOG.finest(_7b1,"connect",_7ba);
if(_7ba.readyState==1){
_7ba._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_7b4.processBinaryMessage=function(_7bc,_7bd){
LOG.finest(_7b1,"connect",_7bc);
if(_7bc.readyState==1){
_7bc._delegate.send(_7bd);
}else{
throw new Error("WebSocket is already closed");
}
};
_7b4.processClose=function(_7be,code,_7c0){
LOG.finest(_7b1,"close",_7be);
_7be._delegate.close(code,_7c0);
};
var _7b9=function(_7c1,_7c2){
var _7c3=new _54a(_7c2);
_7c1.setListener(_7c3);
_7c3.redirected=function(_7c4,_7c5){
_7c4._redirectUri=_7c5;
};
};
return _7b3;
})();
var _7c6=(function(){
var _7c7="WebSocketFlashEmulatedHandler";
var LOG=_275.getLogger(_7c7);
var _7c9=function(){
var _7ca=new _77a();
return _7ca;
};
var _7cb=function(){
var _7cc=new _57a();
return _7cc;
};
var _7cd=function(){
var _7ce=new _7b0();
return _7ce;
};
var _7cf=_7c9();
var _7d0=_7cb();
var _7d1=_7cd();
var _7d2=function(){
LOG.finest(_7c7,"<init>");
this.setNextHandler(_7cf);
_7cf.setNextHandler(_7d0);
_7d0.setNextHandler(_7d1);
};
var _7d3=_7d2.prototype=new _537();
_7d3.processConnect=function(_7d4,_7d5,_7d6){
var _7d7=[_560.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_7d6.length;i++){
_7d7.push(_7d6[i]);
}
var _7d9=_7d4._extensions;
if(_7d9.length>0){
_7d4.requestHeaders.push(new _4fb(_560.HEADER_SEC_EXTENSIONS,_7d9.join(";")));
}
this._nextHandler.processConnect(_7d4,_7d5,_7d7);
};
_7d3.setNextHandler=function(_7da){
this._nextHandler=_7da;
var _7db=new _54a(this);
_7da.setListener(_7db);
};
_7d3.setListener=function(_7dc){
this._listener=_7dc;
};
return _7d2;
})();
var _7dd=(function(){
var _7de="WebSocketFlashRtmpDelegateHandler";
var LOG=_275.getLogger(_7de);
var _7e0;
var _7e1=function(){
LOG.finest(_7de,"<init>");
_7e0=this;
};
var _7e2=_7e1.prototype=new _537();
_7e2.processConnect=function(_7e3,uri,_7e5){
LOG.finest(_7de,"connect",_7e3);
if(_7e3.readyState==2){
throw new Error("WebSocket is already closed");
}
var _7e6=new _343();
_7e6.parent=_7e3;
_7e3._delegate=_7e6;
_7e7(_7e6,this);
_7e6.connect(uri.toString(),_7e5);
};
_7e2.processTextMessage=function(_7e8,text){
LOG.finest(_7de,"connect",_7e8);
if(_7e8.readyState==1){
_7e8._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_7e2.processBinaryMessage=function(_7ea,_7eb){
LOG.finest(_7de,"connect",_7ea);
if(_7ea.readyState==1){
_7ea._delegate.send(_7eb);
}else{
throw new Error("WebSocket is already closed");
}
};
_7e2.processClose=function(_7ec,code,_7ee){
LOG.finest(_7de,"close",_7ec);
_7ec._delegate.close(code,_7ee);
};
var _7e7=function(_7ef,_7f0){
var _7f1=new _54a(_7f0);
_7f1.redirected=function(_7f2,_7f3){
_7f2._redirectUri=_7f3;
};
_7ef.setListener(_7f1);
};
return _7e1;
})();
var _7f4=(function(){
var _7f5="WebSocketFlashRtmpHandler";
var LOG=_275.getLogger(_7f5);
var _7f7=function(){
var _7f8=new _77a();
return _7f8;
};
var _7f9=function(){
var _7fa=new _57a();
return _7fa;
};
var _7fb=function(){
var _7fc=new _7dd();
return _7fc;
};
var _7fd=_7f7();
var _7fe=_7f9();
var _7ff=_7fb();
var _800=function(){
LOG.finest(_7f5,"<init>");
this.setNextHandler(_7fd);
_7fd.setNextHandler(_7fe);
_7fe.setNextHandler(_7ff);
};
var _801=function(_802,_803){
LOG.finest(_7f5,"<init>");
};
var _804=_800.prototype=new _537();
_804.setNextHandler=function(_805){
this._nextHandler=_805;
var _806=new _54a(this);
_805.setListener(_806);
};
_804.setListener=function(_807){
this._listener=_807;
};
return _800;
})();
var _808=(function(){
var _809="WebSocketSelectedHandler";
var _LOG=_275.getLogger(_809);
var _80b=function(){
_LOG.fine(_809,"<init>");
};
var _80c=_80b.prototype=new _537();
_80c.processConnect=function(_80d,uri,_80f){
_LOG.fine(_809,"connect",_80d);
if(_80d.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
this._nextHandler.processConnect(_80d,uri,_80f);
};
_80c.handleConnectionOpened=function(_810,_811){
_LOG.fine(_809,"handleConnectionOpened");
var _812=_810;
if(_812.readyState==WebSocket.CONNECTING){
_812.readyState=WebSocket.OPEN;
this._listener.connectionOpened(_810,_811);
}
};
_80c.handleMessageReceived=function(_813,_814){
_LOG.fine(_809,"handleMessageReceived",_814);
if(_813.readyState!=WebSocket.OPEN){
return;
}
this._listener.textMessageReceived(_813,_814);
};
_80c.handleBinaryMessageReceived=function(_815,_816){
_LOG.fine(_809,"handleBinaryMessageReceived",_816);
if(_815.readyState!=WebSocket.OPEN){
return;
}
this._listener.binaryMessageReceived(_815,_816);
};
_80c.handleConnectionClosed=function(_817,_818,code,_81a){
_LOG.fine(_809,"handleConnectionClosed");
var _81b=_817;
if(_81b.readyState!=WebSocket.CLOSED){
_81b.readyState=WebSocket.CLOSED;
this._listener.connectionClosed(_817,_818,code,_81a);
}
};
_80c.handleConnectionFailed=function(_81c){
_LOG.fine(_809,"connectionFailed");
if(_81c.readyState!=WebSocket.CLOSED){
_81c.readyState=WebSocket.CLOSED;
this._listener.connectionFailed(_81c);
}
};
_80c.handleConnectionError=function(_81d,e){
_LOG.fine(_809,"connectionError");
this._listener.connectionError(_81d,e);
};
_80c.setNextHandler=function(_81f){
this._nextHandler=_81f;
var _820={};
var _821=this;
_820.connectionOpened=function(_822,_823){
_821.handleConnectionOpened(_822,_823);
};
_820.redirected=function(_824,_825){
throw new Error("invalid event received");
};
_820.authenticationRequested=function(_826,_827,_828){
throw new Error("invalid event received");
};
_820.textMessageReceived=function(_829,buf){
_821.handleMessageReceived(_829,buf);
};
_820.binaryMessageReceived=function(_82b,buf){
_821.handleBinaryMessageReceived(_82b,buf);
};
_820.connectionClosed=function(_82d,_82e,code,_830){
_821.handleConnectionClosed(_82d,_82e,code,_830);
};
_820.connectionFailed=function(_831){
_821.handleConnectionFailed(_831);
};
_820.connectionError=function(_832,e){
_821.handleConnectionError(_832,e);
};
_81f.setListener(_820);
};
_80c.setListener=function(_834){
this._listener=_834;
};
return _80b;
})();
var _835=(function(){
var _836=function(_837,_838,_839){
this._nativeEquivalent=_837;
this._handler=_838;
this._channelFactory=_839;
};
return _836;
})();
var _83a=(function(){
var _83b="WebSocketCompositeHandler";
var _LOG=_275.getLogger(_83b);
var _83d="javascript:ws";
var _83e="javascript:wss";
var _83f="javascript:wse";
var _840="javascript:wse+ssl";
var _841="flash:wse";
var _842="flash:wse+ssl";
var _843="flash:wsr";
var _844="flash:wsr+ssl";
var _845={};
var _846={};
var _847=new _56f();
var _848=new _568();
var _849=true;
var _84a={};
if(Object.defineProperty){
try{
Object.defineProperty(_84a,"prop",{get:function(){
return true;
}});
_849=false;
}
catch(e){
}
}
var _84b=function(){
this._handlerListener=createListener(this);
this._nativeHandler=createNativeHandler(this);
this._emulatedHandler=createEmulatedHandler(this);
this._emulatedFlashHandler=createFlashEmulatedHandler(this);
this._rtmpFlashHandler=createFlashRtmpHandler(this);
_LOG.finest(_83b,"<init>");
pickStrategies();
_845[_83d]=new _835("ws",this._nativeHandler,_847);
_845[_83e]=new _835("wss",this._nativeHandler,_847);
_845[_83f]=new _835("ws",this._emulatedHandler,_848);
_845[_840]=new _835("wss",this._emulatedHandler,_848);
_845[_841]=new _835("ws",this._emulatedFlashHandler,_848);
_845[_842]=new _835("wss",this._emulatedFlashHandler,_848);
_845[_843]=new _835("ws",this._rtmpFlashHandler,_848);
_845[_844]=new _835("wss",this._rtmpFlashHandler,_848);
};
function isIE6orIE7(){
if(browser!="ie"){
return false;
}
var _84c=navigator.appVersion;
return (_84c.indexOf("MSIE 6.0")>=0||_84c.indexOf("MSIE 7.0")>=0);
};
function isXdrDisabledonIE8IE9(){
if(browser!="ie"){
return false;
}
var _84d=navigator.appVersion;
return ((_84d.indexOf("MSIE 8.0")>=0||_84d.indexOf("MSIE 9.0")>=0)&&typeof (XDomainRequest)==="undefined");
};
function pickStrategies(){
if(isIE6orIE7()||isXdrDisabledonIE8IE9()){
_846["ws"]=new Array(_83d,_841,_83f);
_846["wss"]=new Array(_83e,_842,_840);
}else{
_846["ws"]=new Array(_83d,_83f);
_846["wss"]=new Array(_83e,_840);
}
};
function createListener(_84e){
var _84f={};
_84f.connectionOpened=function(_850,_851){
_84e.handleConnectionOpened(_850,_851);
};
_84f.binaryMessageReceived=function(_852,buf){
_84e.handleMessageReceived(_852,buf);
};
_84f.textMessageReceived=function(_854,text){
var _856=_854.parent;
_856._webSocketChannelListener.handleMessage(_856._webSocket,text);
};
_84f.connectionClosed=function(_857,_858,code,_85a){
_84e.handleConnectionClosed(_857,_858,code,_85a);
};
_84f.connectionFailed=function(_85b){
_84e.handleConnectionFailed(_85b);
};
_84f.connectionError=function(_85c,e){
_84e.handleConnectionError(_85c,e);
};
_84f.authenticationRequested=function(_85e,_85f,_860){
};
_84f.redirected=function(_861,_862){
};
_84f.onBufferedAmountChange=function(_863,n){
_84e.handleBufferedAmountChange(_863,n);
};
return _84f;
};
function createNativeHandler(_865){
var _866=new _808();
var _867=new _69d();
_866.setListener(_865._handlerListener);
_866.setNextHandler(_867);
return _866;
};
function createEmulatedHandler(_868){
var _869=new _808();
var _86a=new _79c();
_869.setListener(_868._handlerListener);
_869.setNextHandler(_86a);
return _869;
};
function createFlashEmulatedHandler(_86b){
var _86c=new _808();
var _86d=new _7c6();
_86c.setListener(_86b._handlerListener);
_86c.setNextHandler(_86d);
return _86c;
};
function createFlashRtmpHandler(_86e){
var _86f=new _808();
var _870=new _7f4();
_86f.setListener(_86e._handlerListener);
_86f.setNextHandler(_870);
return _86f;
};
var _871=function(_872,_873){
var _874=_845[_873];
var _875=_874._channelFactory;
var _876=_872._location;
var _877=_875.createChannel(_876,_872._protocol);
_872._selectedChannel=_877;
_877.parent=_872;
_877._extensions=_872._extensions;
_877._handler=_874._handler;
_877._handler.processConnect(_872._selectedChannel,_876,_872._protocol);
};
var _878=_84b.prototype;
_878.fallbackNext=function(_879){
_LOG.finest(_83b,"fallbackNext");
var _87a=_879.getNextStrategy();
if(_87a==null){
this.doClose(_879,false,1006,"");
}else{
_871(_879,_87a);
}
};
_878.doOpen=function(_87b,_87c){
if(_87b._lastErrorEvent!==undefined){
delete _87b._lastErrorEvent;
}
if(_87b.readyState===WebSocket.CONNECTING){
_87b.readyState=WebSocket.OPEN;
if(_849){
_87b._webSocket.readyState=WebSocket.OPEN;
}
_87b._webSocketChannelListener.handleOpen(_87b._webSocket,_87c);
}
};
_878.doClose=function(_87d,_87e,code,_880){
if(_87d._lastErrorEvent!==undefined){
_87d._webSocketChannelListener.handleError(_87d._webSocket,_87d._lastErrorEvent);
delete _87d._lastErrorEvent;
}
if(_87d.readyState===WebSocket.CONNECTING||_87d.readyState===WebSocket.OPEN||_87d.readyState===WebSocket.CLOSING){
_87d.readyState=WebSocket.CLOSED;
if(_849){
_87d._webSocket.readyState=WebSocket.CLOSED;
}
_87d._webSocketChannelListener.handleClose(_87d._webSocket,_87e,code,_880);
}
};
_878.doBufferedAmountChange=function(_881,n){
_881._webSocketChannelListener.handleBufferdAmountChange(_881._webSocket,n);
};
_878.processConnect=function(_883,_884,_885){
_LOG.finest(_83b,"connect",_883);
var _886=_883;
_LOG.finest("Current ready state = "+_886.readyState);
if(_886.readyState===WebSocket.OPEN){
_LOG.fine("Attempt to reconnect an existing open WebSocket to a different location");
throw new Error("Attempt to reconnect an existing open WebSocket to a different location");
}
var _887=_886._compositeScheme;
if(_887!="ws"&&_887!="wss"){
var _888=_845[_887];
if(_888==null){
throw new Error("Invalid connection scheme: "+_887);
}
_LOG.finest("Turning off fallback since the URL is prefixed with java:");
_886._connectionStrategies.push(_887);
}else{
var _889=_846[_887];
if(_889!=null){
for(var i=0;i<_889.length;i++){
_886._connectionStrategies.push(_889[i]);
}
}else{
throw new Error("Invalid connection scheme: "+_887);
}
}
this.fallbackNext(_886);
};
_878.processTextMessage=function(_88b,_88c){
_LOG.finest(_83b,"send",_88c);
var _88d=_88b;
if(_88d.readyState!=WebSocket.OPEN){
_LOG.fine("Attempt to post message on unopened or closed web socket");
throw new Error("Attempt to post message on unopened or closed web socket");
}
var _88e=_88d._selectedChannel;
_88e._handler.processTextMessage(_88e,_88c);
};
_878.processBinaryMessage=function(_88f,_890){
_LOG.finest(_83b,"send",_890);
var _891=_88f;
if(_891.readyState!=WebSocket.OPEN){
_LOG.fine("Attempt to post message on unopened or closed web socket");
throw new Error("Attempt to post message on unopened or closed web socket");
}
var _892=_891._selectedChannel;
_892._handler.processBinaryMessage(_892,_890);
};
_878.processClose=function(_893,code,_895){
_LOG.finest(_83b,"close");
var _896=_893;
if(_893.readyState===WebSocket.CONNECTING||_893.readyState===WebSocket.OPEN){
_893.readyState=WebSocket.CLOSING;
if(_849){
_893._webSocket.readyState=WebSocket.CLOSING;
}
}
var _897=_896._selectedChannel;
_897._handler.processClose(_897,code,_895);
};
_878.setListener=function(_898){
this._listener=_898;
};
_878.handleConnectionOpened=function(_899,_89a){
var _89b=_899.parent;
this.doOpen(_89b,_89a);
};
_878.handleMessageReceived=function(_89c,obj){
var _89e=_89c.parent;
switch(_89e.readyState){
case WebSocket.OPEN:
if(_89e._webSocket.binaryType==="blob"&&obj.constructor==ByteBuffer){
obj=obj.getBlob(obj.remaining());
}else{
if(_89e._webSocket.binaryType==="arraybuffer"&&obj.constructor==ByteBuffer){
obj=obj.getArrayBuffer(obj.remaining());
}else{
if(_89e._webSocket.binaryType==="blob"&&obj.byteLength){
obj=new Blob([new Uint8Array(obj)]);
}else{
if(_89e._webSocket.binaryType==="bytebuffer"&&obj.byteLength){
var u=new Uint8Array(obj);
var _8a0=[];
for(var i=0;i<u.byteLength;i++){
_8a0.push(u[i]);
}
obj=new ByteBuffer(_8a0);
}else{
if(_89e._webSocket.binaryType==="bytebuffer"&&obj.size){
var cb=function(_8a3){
var b=new ByteBuffer();
b.putBytes(_8a3);
b.flip();
_89e._webSocketChannelListener.handleMessage(_89e._webSocket,b);
};
BlobUtils.asNumberArray(cb,data);
return;
}
}
}
}
}
_89e._webSocketChannelListener.handleMessage(_89e._webSocket,obj);
break;
case WebSocket.CONNECTING:
case WebSocket.CLOSING:
case WebSocket.CLOSED:
break;
default:
throw new Error("Socket has invalid readyState: "+$this.readyState);
}
};
_878.handleConnectionClosed=function(_8a5,_8a6,code,_8a8){
var _8a9=_8a5.parent;
if(_8a9.readyState===WebSocket.CONNECTING&&!_8a5.authenticationReceived&&!_8a5.preventFallback){
this.fallbackNext(_8a9);
}else{
this.doClose(_8a9,_8a6,code,_8a8);
}
};
_878.handleConnectionFailed=function(_8aa){
var _8ab=_8aa.parent;
var _8ac=1006;
var _8ad="";
if(_8aa.closeReason.length>0){
_8ac=_8aa.closeCode;
_8ad=_8aa.closeReason;
}
if(_8ab.readyState===WebSocket.CONNECTING&&!_8aa.authenticationReceived&&!_8aa.preventFallback){
this.fallbackNext(_8ab);
}else{
this.doClose(_8ab,false,_8ac,_8ad);
}
};
_878.handleConnectionError=function(_8ae,e){
_8ae.parent._lastErrorEvent=e;
};
return _84b;
})();
(function(){
var _8b0="HttpRedirectPolicy";
var LOG=_275.getLogger(_8b0);
window.HttpRedirectPolicy=function(name){
if(arguments.length<1){
var s="HttpRedirectPolicy: Please specify the policy name.";
throw Error(s);
}
if(typeof (name)=="undefined"){
var s="HttpRedirectPolicy: Please specify required 'name' parameter.";
throw Error(s);
}else{
if(typeof (name)!="string"){
var s="HttpRedirectPolicy: Required parameter 'name' is a string.";
throw Error(s);
}
}
this.name=name;
};
var _8b4=HttpRedirectPolicy.prototype;
_8b4.toString=function(){
return "HttpRedirectPolicy."+this.name;
};
_8b4.isRedirectionAllowed=function(_8b5,_8b6){
if(arguments.length<2){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Please specify both the 'originalLoc' and the 'redirectLoc' parameters.";
throw Error(s);
}
if(typeof (_8b5)=="undefined"){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Please specify required 'originalLoc' parameter.";
throw Error(s);
}else{
if(typeof (_8b5)!="string"){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Required parameter 'originalLoc' is a string.";
throw Error(s);
}
}
if(typeof (_8b6)=="undefined"){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Please specify required 'redirectLoc' parameter.";
throw Error(s);
}else{
if(typeof (_8b6)!="string"){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Required parameter 'redirectLoc' is a string.";
throw Error(s);
}
}
var _8b8=false;
var _8b9=new URI(_8b5.toLowerCase().replace("http","ws"));
var _8ba=new URI(_8b6.toLowerCase().replace("http","ws"));
switch(this.name){
case "ALWAYS":
_8b8=true;
break;
case "NEVER":
_8b8=false;
break;
case "PEER_DOMAIN":
_8b8=isPeerDomain(_8b9,_8ba);
break;
case "SAME_DOMAIN":
_8b8=isSameDomain(_8b9,_8ba);
break;
case "SAME_ORIGIN":
_8b8=isSameOrigin(_8b9,_8ba);
break;
case "SUB_DOMAIN":
_8b8=isSubDomain(_8b9,_8ba);
break;
default:
var s="HttpRedirectPolicy.isRedirectionAllowed(): Invalid policy: "+this.name;
throw new Error(s);
}
return _8b8;
};
function isPeerDomain(_8bb,_8bc){
if(isSameDomain(_8bb,_8bc)){
return true;
}
var _8bd=_8bb.scheme.toLowerCase();
var _8be=_8bc.scheme.toLowerCase();
if(_8be.indexOf(_8bd)==-1){
return false;
}
var _8bf=_8bb.host;
var _8c0=_8bc.host;
var _8c1=getBaseDomain(_8bf);
var _8c2=getBaseDomain(_8c0);
if(_8c0.indexOf(_8c1,(_8c0.length-_8c1.length))==-1){
return false;
}
if(_8bf.indexOf(_8c2,(_8bf.length-_8c2.length))==-1){
return false;
}
return true;
};
function isSameDomain(_8c3,_8c4){
if(isSameOrigin(_8c3,_8c4)){
return true;
}
var _8c5=_8c3.scheme.toLowerCase();
var _8c6=_8c4.scheme.toLowerCase();
if(_8c6.indexOf(_8c5)==-1){
return false;
}
var _8c7=_8c3.host.toLowerCase();
var _8c8=_8c4.host.toLowerCase();
if(_8c7==_8c8){
return true;
}
return false;
};
function isSameOrigin(_8c9,_8ca){
var _8cb=_8c9.scheme.toLowerCase();
var _8cc=_8ca.scheme.toLowerCase();
var _8cd=_8c9.authority.toLowerCase();
var _8ce=_8ca.authority.toLowerCase();
if((_8cb==_8cc)&&(_8cd==_8ce)){
return true;
}
return false;
};
function isSubDomain(_8cf,_8d0){
if(isSameDomain(_8cf,_8d0)){
return true;
}
var _8d1=_8cf.scheme.toLowerCase();
var _8d2=_8d0.scheme.toLowerCase();
if(_8d2.indexOf(_8d1)==-1){
return false;
}
var _8d3=_8cf.host.toLowerCase();
var _8d4=_8d0.host.toLowerCase();
if(_8d4.length<_8d3.length){
return false;
}
var s="."+_8d3;
if(_8d4.indexOf(s,(_8d4.length-s.length))==-1){
return false;
}
return true;
};
function getBaseDomain(host){
var _8d7=host.split(".");
var len=_8d7.length;
if(len<=2){
return host;
}
var _8d9="";
for(var i=1;i<len;i++){
_8d9+="."+_8d7[i];
}
return _8d9;
};
HttpRedirectPolicy.ALWAYS=new HttpRedirectPolicy("ALWAYS");
HttpRedirectPolicy.NEVER=new HttpRedirectPolicy("NEVER");
HttpRedirectPolicy.PEER_DOMAIN=new HttpRedirectPolicy("PEER_DOMAIN");
HttpRedirectPolicy.SAME_DOMAIN=new HttpRedirectPolicy("SAME_DOMAIN");
HttpRedirectPolicy.SAME_ORIGIN=new HttpRedirectPolicy("SAME_ORIGIN");
HttpRedirectPolicy.SUB_DOMAIN=new HttpRedirectPolicy("SUB_DOMAIN");
return HttpRedirectPolicy;
})();
(function(){
var _8db=new _83a();
window.WebSocket=(function(){
var _8dc="WebSocket";
var LOG=_275.getLogger(_8dc);
var _8de={};
var _8df=function(url,_8e1,_8e2,_8e3,_8e4,_8e5){
LOG.entering(this,"WebSocket.<init>",{"url":url,"protocol":_8e1});
this.url=url;
this.protocol=_8e1;
this.extensions=_8e2||[];
this.connectTimeout=0;
this._challengeHandler=_8e3;
this._redirectPolicy=HttpRedirectPolicy.ALWAYS;
if(typeof (_8e4)!="undefined"){
_8e6(_8e4);
this.connectTimeout=_8e4;
}
if(typeof (_8e5)!="undefined"){
_8e7(_8e5);
this._redirectPolicy=_8e5;
}
this._queue=[];
this._origin="";
this._eventListeners={};
setProperties(this);
_8e8(this,this.url,this.protocol,this.extensions,this._challengeHandler,this.connectTimeout);
};
var _8e9=function(s){
if(s.length==0){
return false;
}
var _8eb="()<>@,;:\\<>/[]?={}\t \n";
for(var i=0;i<s.length;i++){
var c=s.substr(i,1);
if(_8eb.indexOf(c)!=-1){
return false;
}
var code=s.charCodeAt(i);
if(code<33||code>126){
return false;
}
}
return true;
};
var _8ef=function(_8f0){
if(typeof (_8f0)==="undefined"){
return true;
}else{
if(typeof (_8f0)==="string"){
return _8e9(_8f0);
}else{
for(var i=0;i<_8f0.length;i++){
if(!_8e9(_8f0[i])){
return false;
}
}
return true;
}
}
};
var _8e8=function(_8f2,_8f3,_8f4,_8f5,_8f6,_8f7){
if(!_8ef(_8f4)){
throw new Error("SyntaxError: invalid protocol: "+_8f4);
}
var uri=new _518(_8f3);
if(!uri.isSecure()&&document.location.protocol==="https:"){
throw new Error("SecurityException: non-secure connection attempted from secure origin");
}
var _8f9=[];
if(typeof (_8f4)!="undefined"){
if(typeof _8f4=="string"&&_8f4.length){
_8f9=[_8f4];
}else{
if(_8f4.length){
_8f9=_8f4;
}
}
}
_8f2._channel=new _575(uri,_8f9);
_8f2._channel._webSocket=_8f2;
_8f2._channel._webSocketChannelListener=_8de;
_8f2._channel._extensions=_8f5;
if(typeof (_8f6)!="undefined"){
_8f2._channel.challengeHandler=_8f6;
}
if((typeof (_8f7)!="undefined")&&(_8f7>0)){
var _8fa=_8f2._channel;
var _8fb=new _524(function(){
if(_8fa.readyState==_8df.CONNECTING){
_8db.doClose(_8fa,false,1006,"Connection timeout");
_8db.processClose(_8fa,0,"Connection timeout");
_8fa.connectTimer=null;
}
},_8f7,false);
_8f2._channel.connectTimer=_8fb;
_8fb.start();
}
_8db.processConnect(_8f2._channel,uri.getWSEquivalent());
};
function setProperties(_8fc){
_8fc.onmessage=null;
_8fc.onopen=null;
_8fc.onclose=null;
_8fc.onerror=null;
if(Object.defineProperty){
try{
Object.defineProperty(_8fc,"readyState",{get:function(){
if(_8fc._channel){
return _8fc._channel.readyState;
}else{
return _8df.CLOSED;
}
},set:function(){
throw new Error("Cannot set read only property readyState");
}});
var _8fd="blob";
Object.defineProperty(_8fc,"binaryType",{enumerable:true,configurable:true,get:function(){
return _8fd;
},set:function(val){
if(val==="blob"||val==="arraybuffer"||val==="bytebuffer"){
_8fd=val;
}else{
throw new SyntaxError("Invalid binaryType. Valid values are 'blob', 'arraybuffer' and 'bytebuffer'");
}
}});
Object.defineProperty(_8fc,"bufferedAmount",{get:function(){
return _8fc._channel.getBufferedAmount();
},set:function(){
throw new Error("Cannot set read only property bufferedAmount");
}});
}
catch(ex){
_8fc.readyState=_8df.CONNECTING;
_8fc.binaryType="blob";
_8fc.bufferedAmount=0;
}
}else{
_8fc.readyState=_8df.CONNECTING;
_8fc.binaryType="blob";
_8fc.bufferedAmount=0;
}
};
var _8ff=_8df.prototype;
_8ff.send=function(data){
switch(this.readyState){
case 0:
LOG.error("WebSocket.send: Error: Attempt to send message on unopened or closed WebSocket");
throw new Error("Attempt to send message on unopened or closed WebSocket");
case 1:
if(typeof (data)==="string"){
_8db.processTextMessage(this._channel,data);
}else{
_8db.processBinaryMessage(this._channel,data);
}
break;
case 2:
case 3:
break;
default:
LOG.error("WebSocket.send: Illegal state error");
throw new Error("Illegal state error");
}
};
_8ff.close=function(code,_902){
if(typeof code!="undefined"){
if(code!=1000&&(code<3000||code>4999)){
var _903=new Error("code must equal to 1000 or in range 3000 to 4999");
_903.name="InvalidAccessError";
throw _903;
}
}
if(typeof _902!="undefined"&&_902.length>0){
var buf=new ByteBuffer();
buf.putString(_902,Charset.UTF8);
buf.flip();
if(buf.remaining()>123){
throw new SyntaxError("SyntaxError: reason is longer than 123 bytes");
}
}
switch(this.readyState){
case 0:
case 1:
_8db.processClose(this._channel,code,_902);
break;
case 2:
case 3:
break;
default:
LOG.error("WebSocket.close: Illegal state error");
throw new Error("Illegal state error");
}
};
_8ff.getChallengeHandler=function(){
return this._challengeHandler||null;
};
_8ff.setChallengeHandler=function(_905){
if(typeof (_905)=="undefined"){
var s="WebSocket.setChallengeHandler(): Parameter 'challengeHandler' is required";
throw new Error(s);
}
this._challengeHandler=_905;
this._channel.challengeHandler=_905;
};
_8ff.getRedirectPolicy=function(){
return this._redirectPolicy;
};
_8ff.setRedirectPolicy=function(_907){
_8e7(_907);
this._redirectPolicy=_907;
};
var _8e6=function(_908){
if(typeof (_908)=="undefined"){
var s="WebSocket.setConnectTimeout(): int parameter 'connectTimeout' is required";
throw new Error(s);
}
if(typeof (_908)!="number"){
var s="WebSocket.setConnectTimeout(): connectTimeout should be an integer";
throw new Error(s);
}
if(_908<0){
var s="WebSocket.setConnectTimeout(): Connect timeout cannot be negative";
throw new Error(s);
}
return;
};
var _8e7=function(_90a){
if(typeof (_90a)=="undefined"){
var s="WebSocket.validateHttpRedirectPolicy(): Parameter 'redirectPolicy' is required";
throw new Error(s);
}
if(!(_90a instanceof HttpRedirectPolicy)){
var s="WebSocket.validateHttpRedirectPolicy(): Parameter 'redirectPolicy' must be of type HttpRedirectPolicy";
throw new Error(s);
}
};
var _90c=function(_90d,data){
var _90f=new MessageEvent(_90d,data,_90d._origin);
_90d.dispatchEvent(_90f);
};
var _910=function(_911){
var _912=new Date().getTime();
var _913=_912+50;
while(_911._queue.length>0){
if(new Date().getTime()>_913){
setTimeout(function(){
_910(_911);
},0);
return;
}
var buf=_911._queue.shift();
var ok=false;
try{
if(_911.readyState==_8df.OPEN){
_90c(_911,buf);
ok=true;
}else{
_911._queue=[];
return;
}
}
finally{
if(!ok){
if(_911._queue.length==0){
_911._delivering=false;
}else{
setTimeout(function(){
_910(_911);
},0);
}
}
}
}
_911._delivering=false;
};
var _916=function(_917,_918,code,_91a){
LOG.entering(_917,"WebSocket.doClose");
delete _917._channel;
setTimeout(function(){
var _91b=new CloseEvent(_917,_918,code,_91a);
_917.dispatchEvent(_91b);
},0);
};
_8de.handleOpen=function(_91c,_91d){
_91c.protocol=_91d;
var _91e={type:"open",bubbles:true,cancelable:true,target:_91c};
_91c.dispatchEvent(_91e);
};
_8de.handleMessage=function(_91f,obj){
if(!Object.defineProperty&&!(typeof (obj)==="string")){
var _921=_91f.binaryType;
if(!(_921==="blob"||_921==="arraybuffer"||_921==="bytebuffer")){
var _922={type:"error",bubbles:true,cancelable:true,target:_91f,message:"Invalid binaryType. Valid values are 'blob', 'arraybuffer' and 'bytebuffer'"};
_91f.dispatchEvent(_922);
return;
}
}
_91f._queue.push(obj);
if(!_91f._delivering){
_91f._delivering=true;
_910(_91f);
}
};
_8de.handleClose=function(_923,_924,code,_926){
_916(_923,_924,code,_926);
};
_8de.handleError=function(_927,_928){
LOG.entering(_927,"WebSocket.handleError"+_928);
setTimeout(function(){
_927.dispatchEvent(_928);
},0);
};
_8de.handleBufferdAmountChange=function(_929,n){
_929.bufferedAmount=n;
};
_8ff.addEventListener=function(type,_92c,_92d){
this._eventListeners[type]=this._eventListeners[type]||[];
this._eventListeners[type].push(_92c);
};
_8ff.removeEventListener=function(type,_92f,_930){
var _931=this._eventListeners[type];
if(_931){
for(var i=0;i<_931.length;i++){
if(_931[i]==_92f){
_931.splice(i,1);
return;
}
}
}
};
_8ff.dispatchEvent=function(e){
var type=e.type;
if(!type){
throw new Error("Cannot dispatch invalid event "+e);
}
try{
var _935=this["on"+type];
if(typeof _935==="function"){
_935(e);
}
}
catch(e){
LOG.severe(this,type+" event handler: Error thrown from application");
}
var _936=this._eventListeners[type];
if(_936){
for(var i=0;i<_936.length;i++){
try{
_936[i](e);
}
catch(e2){
LOG.severe(this,type+" event handler: Error thrown from application");
}
}
}
};
_8df.CONNECTING=_8ff.CONNECTING=0;
_8df.OPEN=_8ff.OPEN=1;
_8df.CLOSING=_8ff.CLOSING=2;
_8df.CLOSED=_8ff.CLOSED=3;
return _8df;
})();
window.WebSocket.__impls__={};
window.WebSocket.__impls__["flash:wse"]=_312;
}());
(function(){
window.WebSocketExtension=(function(){
var _938="WebSocketExtension";
var LOG=_275.getLogger(_938);
var _93a=function(name){
this.name=name;
this.parameters={};
this.enabled=false;
this.negotiated=false;
};
var _93c=_93a.prototype;
_93c.getParameter=function(_93d){
return this.parameters[_93d];
};
_93c.setParameter=function(_93e,_93f){
this.parameters[_93e]=_93f;
};
_93c.getParameters=function(){
var arr=[];
for(var name in this.parameters){
if(this.parameters.hasOwnProperty(name)){
arr.push(name);
}
}
return arr;
};
_93c.parse=function(str){
var arr=str.split(";");
if(arr[0]!=this.name){
throw new Error("Error: name not match");
}
this.parameters={};
for(var i=1;i<arr.length;i++){
var _945=arr[i].indexOf("=");
this.parameters[arr[i].subString(0,_945)]=arr[i].substring(_945+1);
}
};
_93c.toString=function(){
var arr=[this.name];
for(var p in this.parameters){
if(this.parameters.hasOwnProperty(p)){
arr.push(p.name+"="+this.parameters[p]);
}
}
return arr.join(";");
};
return _93a;
})();
})();
(function(){
window.WebSocketRevalidateExtension=(function(){
var _948=function(){
};
var _949=_948.prototype=new WebSocketExtension(_560.KAAZING_SEC_EXTENSION_REVALIDATE);
return _948;
})();
})();
(function(){
window.WebSocketFactory=(function(){
var _94a="WebSocketFactory";
var LOG=_275.getLogger(_94a);
var _94c=function(){
this.extensions={};
var _94d=new WebSocketRevalidateExtension();
this.extensions[_94d.name]=_94d;
this.redirectPolicy=HttpRedirectPolicy.ALWAYS;
};
var _94e=_94c.prototype;
_94e.getExtension=function(name){
return this.extensions[name];
};
_94e.setExtension=function(_950){
this.extensions[_950.name]=_950;
};
_94e.setChallengeHandler=function(_951){
if(typeof (_951)=="undefined"){
var s="WebSocketFactory.setChallengeHandler(): Parameter 'challengeHandler' is required";
throw new Error(s);
}
this.challengeHandler=_951;
var _953=this.extensions[_560.KAAZING_SEC_EXTENSION_REVALIDATE];
_953.enabled=(_951!=null);
};
_94e.getChallengeHandler=function(){
return this.challengeHandler||null;
};
_94e.createWebSocket=function(url,_955){
var ext=[];
for(var key in this.extensions){
if(this.extensions.hasOwnProperty(key)&&this.extensions[key].enabled){
ext.push(this.extensions[key].toString());
}
}
var _958=this.getChallengeHandler();
var _959=this.getDefaultConnectTimeout();
var _95a=this.getDefaultRedirectPolicy();
var ws=new WebSocket(url,_955,ext,_958,_959,_95a);
return ws;
};
_94e.setDefaultConnectTimeout=function(_95c){
if(typeof (_95c)=="undefined"){
var s="WebSocketFactory.setDefaultConnectTimeout(): int parameter 'connectTimeout' is required";
throw new Error(s);
}
if(typeof (_95c)!="number"){
var s="WebSocketFactory.setDefaultConnectTimeout(): connectTimeout should be an integer";
throw new Error(s);
}
if(_95c<0){
var s="WebSocketFactory.setDefaultConnectTimeout(): Connect timeout cannot be negative";
throw new Error(s);
}
this.connectTimeout=_95c;
};
_94e.getDefaultConnectTimeout=function(){
return this.connectTimeout||0;
};
_94e.setDefaultRedirectPolicy=function(_95e){
if(typeof (_95e)=="undefined"){
var s="WebSocketFactory.setDefaultRedirectPolicy(): int parameter 'redirectPolicy' is required";
throw new Error(s);
}
if(!(_95e instanceof HttpRedirectPolicy)){
var s="WebSocketFactory.setDefaultRedirectPolicy(): redirectPolicy should be an instance of HttpRedirectPolicy";
throw new Error(s);
}
this.redirectPolicy=_95e;
};
_94e.getDefaultRedirectPolicy=function(){
return this.redirectPolicy;
};
return _94c;
})();
})();
window.___Loader=new _3ab(_274);
})();
})();
