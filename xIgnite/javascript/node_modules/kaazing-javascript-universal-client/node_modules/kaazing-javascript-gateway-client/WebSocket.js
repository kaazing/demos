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
var _2a0=function(key){
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name===key){
var v=tags[i].content;
return v;
}
}
};
var _2a5=function(_2a6){
var _2a7=[];
for(var i=0;i<_2a6.length;i++){
_2a7.push(_2a6[i]);
}
return _2a7;
};
var _2a9=function(_2aa,_2ab){
var _2ac=[];
for(var i=0;i<_2aa.length;i++){
var elt=_2aa[i];
if(_2ab(elt)){
_2ac.push(_2aa[i]);
}
}
return _2ac;
};
var _2af=function(_2b0,_2b1){
for(var i=0;i<_2b0.length;i++){
if(_2b0[i]==_2b1){
return i;
}
}
return -1;
};
var _2b3=function(s){
var a=[];
for(var i=0;i<s.length;i++){
a.push(s.charCodeAt(i)&255);
}
var buf=new ByteBuffer(a);
var v=_2b9(buf,Charset.UTF8);
return v;
};
var _2ba=function(_2bb){
var buf=new Uint8Array(_2bb);
var a=[];
for(var i=0;i<buf.length;i++){
a.push(buf[i]);
}
var buf=new ByteBuffer(a);
var s=_2b9(buf,Charset.UTF8);
return s;
};
var _2c0=function(_2c1){
var buf=new Uint8Array(_2c1);
var a=[];
for(var i=0;i<buf.length;i++){
a.push(buf[i]);
}
return new ByteBuffer(a);
};
var _2c5=String.fromCharCode(127);
var NULL=String.fromCharCode(0);
var _2c7="\n";
var _2c8=function(buf){
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
var chr=String.fromCharCode(n);
switch(chr){
case _2c5:
a.push(_2c5);
a.push(_2c5);
break;
case NULL:
a.push(_2c5);
a.push("0");
break;
case _2c7:
a.push(_2c5);
a.push("n");
break;
default:
a.push(chr);
}
}
var v=a.join("");
return v;
};
var _2ce=function(buf,_2d0){
if(_2d0){
return _2c8(buf);
}else{
var _2d1=buf.array;
var _2d2=(buf.position==0&&buf.limit==_2d1.length)?_2d1:buf.getBytes(buf.remaining());
var _2d3=!(XMLHttpRequest.prototype.sendAsBinary);
for(var i=_2d2.length-1;i>=0;i--){
var _2d5=_2d2[i];
if(_2d5==0&&_2d3){
_2d2[i]=256;
}else{
if(_2d5<0){
_2d2[i]=_2d5&255;
}
}
}
var _2d6=0;
var _2d7=[];
do{
var _2d8=Math.min(_2d2.length-_2d6,10000);
partOfBytes=_2d2.slice(_2d6,_2d6+_2d8);
_2d6+=_2d8;
_2d7.push(String.fromCharCode.apply(null,partOfBytes));
}while(_2d6<_2d2.length);
var _2d9=_2d7.join("");
if(_2d2===_2d1){
for(var i=_2d2.length-1;i>=0;i--){
var _2d5=_2d2[i];
if(_2d5==256){
_2d2[i]=0;
}
}
}
return _2d9;
}
};
var _2b9=function(buf,cs){
var _2dc=buf.position;
var _2dd=buf.limit;
var _2de=buf.array;
while(_2dc<_2dd){
_2dc++;
}
try{
buf.limit=_2dc;
return cs.decode(buf);
}
finally{
if(_2dc!=_2dd){
buf.limit=_2dd;
buf.position=_2dc+1;
}
}
};
var _2df=window.WebSocket;
var _2e0=(function(){
var _2e1=function(){
this.parent;
this._listener;
this.code=1005;
this.reason="";
};
var _2e2=(browser=="safari"&&typeof (_2df.CLOSING)=="undefined");
var _2e3=(browser=="android");
var _2e4=_2e1.prototype;
_2e4.connect=function(_2e5,_2e6){
if((typeof (_2df)==="undefined")||_2e3){
doError(this);
return;
}
if(_2e5.indexOf("javascript:")==0){
_2e5=_2e5.substr("javascript:".length);
}
var _2e7=_2e5.indexOf("?");
if(_2e7!=-1){
if(!/[\?&]\.kl=Y/.test(_2e5.substring(_2e7))){
_2e5+="&.kl=Y";
}
}else{
_2e5+="?.kl=Y";
}
this._sendQueue=[];
try{
if(_2e6){
this._requestedProtocol=_2e6;
this._delegate=new _2df(_2e5,_2e6);
}else{
this._delegate=new _2df(_2e5);
}
this._delegate.binaryType="arraybuffer";
}
catch(e){
doError(this);
return;
}
bindHandlers(this);
};
_2e4.onerror=function(){
};
_2e4.onmessage=function(){
};
_2e4.onopen=function(){
};
_2e4.onclose=function(){
};
_2e4.close=function(code,_2e9){
if(code){
if(_2e2){
doCloseDraft76Compat(this,code,_2e9);
}else{
this._delegate.close(code,_2e9);
}
}else{
this._delegate.close();
}
};
function doCloseDraft76Compat(_2ea,code,_2ec){
_2ea.code=code|1005;
_2ea.reason=_2ec|"";
_2ea._delegate.close();
};
_2e4.send=function(_2ed){
doSend(this,_2ed);
return;
};
_2e4.setListener=function(_2ee){
this._listener=_2ee;
};
_2e4.setIdleTimeout=function(_2ef){
this.lastMessageTimestamp=new Date().getTime();
this.idleTimeout=_2ef;
startIdleTimer(this,_2ef);
return;
};
function doSend(_2f0,_2f1){
if(typeof (_2f1)=="string"){
_2f0._delegate.send(_2f1);
}else{
if(_2f1.byteLength||_2f1.size){
_2f0._delegate.send(_2f1);
}else{
if(_2f1.constructor==ByteBuffer){
_2f0._delegate.send(_2f1.getArrayBuffer(_2f1.remaining()));
}else{
throw new Error("Cannot call send() with that type");
}
}
}
};
function doError(_2f2,e){
setTimeout(function(){
_2f2._listener.connectionFailed(_2f2.parent);
},0);
};
function encodeMessageData(_2f4,e){
var buf;
if(typeof e.data.byteLength!=="undefined"){
buf=_2c0(e.data);
}else{
buf=ByteBuffer.allocate(e.data.length);
if(_2f4.parent._isBinary&&_2f4.parent._balanced>1){
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
function messageHandler(_2f8,e){
_2f8.lastMessageTimestamp=new Date().getTime();
if(typeof (e.data)==="string"){
_2f8._listener.textMessageReceived(_2f8.parent,e.data);
}else{
_2f8._listener.binaryMessageReceived(_2f8.parent,e.data);
}
};
function closeHandler(_2fa,e){
unbindHandlers(_2fa);
if(_2e2){
_2fa._listener.connectionClosed(_2fa.parent,true,_2fa.code,_2fa.reason);
}else{
_2fa._listener.connectionClosed(_2fa.parent,e.wasClean,e.code,e.reason);
}
};
function errorHandler(_2fc,e){
_2fc._listener.connectionError(_2fc.parent,e);
};
function openHandler(_2fe,e){
if(_2e2){
_2fe._delegate.protocol=_2fe._requestedProtocol;
}
_2fe._listener.connectionOpened(_2fe.parent,_2fe._delegate.protocol);
};
function bindHandlers(_300){
var _301=_300._delegate;
_301.onopen=function(e){
openHandler(_300,e);
};
_301.onmessage=function(e){
messageHandler(_300,e);
};
_301.onclose=function(e){
closeHandler(_300,e);
};
_301.onerror=function(e){
errorHandler(_300,e);
};
_300.readyState=function(){
return _301.readyState;
};
};
function unbindHandlers(_306){
var _307=_306._delegate;
_307.onmessage=undefined;
_307.onclose=undefined;
_307.onopen=undefined;
_307.onerror=undefined;
_306.readyState=WebSocket.CLOSED;
};
function startIdleTimer(_308,_309){
stopIdleTimer(_308);
_308.idleTimer=setTimeout(function(){
idleTimerHandler(_308);
},_309);
};
function idleTimerHandler(_30a){
var _30b=new Date().getTime();
var _30c=_30b-_30a.lastMessageTimestamp;
var _30d=_30a.idleTimeout;
if(_30c>_30d){
try{
var _30e=_30a._delegate;
if(_30e){
unbindHandlers(_30a);
_30e.close();
}
}
finally{
_30a._listener.connectionClosed(_30a.parent,false,1006,"");
}
}else{
startIdleTimer(_30a,_30d-_30c);
}
};
function stopIdleTimer(_30f){
if(_30f.idleTimer!=null){
clearTimeout(_30f.idleTimer);
_30f.IdleTimer=null;
}
};
return _2e1;
})();
var _310=(function(){
var _311=function(){
this.parent;
this._listener;
};
var _312=_311.prototype;
_312.connect=function(_313,_314){
this.URL=_313;
try{
_315(this,_313,_314);
}
catch(e){
doError(this,e);
}
this.constructor=_311;
};
_312.setListener=function(_316){
this._listener=_316;
};
_311._flashBridge={};
_311._flashBridge.readyWaitQueue=[];
_311._flashBridge.failWaitQueue=[];
_311._flashBridge.flashHasLoaded=false;
_311._flashBridge.flashHasFailed=false;
_312.URL="";
_312.readyState=0;
_312.bufferedAmount=0;
_312.connectionOpened=function(_317,_318){
var _318=_318.split("\n");
for(var i=0;i<_318.length;i++){
var _31a=_318[i].split(":");
_317.responseHeaders[_31a[0]]=_31a[1];
}
this._listener.connectionOpened(_317,"");
};
_312.connectionClosed=function(_31b,_31c,code,_31e){
this._listener.connectionClosed(_31b,_31c,code,_31e);
};
_312.connectionFailed=function(_31f){
this._listener.connectionFailed(_31f);
};
_312.binaryMessageReceived=function(_320,data){
this._listener.binaryMessageReceived(_320,data);
};
_312.textMessageReceived=function(_322,s){
this._listener.textMessageReceived(_322,s);
};
_312.redirected=function(_324,_325){
this._listener.redirected(_324,_325);
};
_312.authenticationRequested=function(_326,_327,_328){
this._listener.authenticationRequested(_326,_327,_328);
};
_312.send=function(data){
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
break;
case 1:
if(data===null){
throw new Error("data is null");
}
if(typeof (data)=="string"){
_311._flashBridge.sendText(this._instanceId,data);
}else{
if(data.constructor==ByteBuffer){
var _32a;
var a=[];
while(data.remaining()){
a.push(String.fromCharCode(data.get()));
}
var _32a=a.join("");
_311._flashBridge.sendByteString(this._instanceId,_32a);
}else{
if(data.byteLength){
var _32a;
var a=[];
var _32c=new DataView(data);
for(var i=0;i<data.byteLength;i++){
a.push(String.fromCharCode(_32c.getUint8(i)));
}
var _32a=a.join("");
_311._flashBridge.sendByteString(this._instanceId,_32a);
}else{
if(data.size){
var _32e=this;
var cb=function(_330){
_311._flashBridge.sendByteString(_32e._instanceId,_330);
};
BlobUtils.asBinaryString(cb,data);
return;
}else{
throw new Error("Invalid type");
}
}
}
}
_331(this);
return true;
break;
case 2:
return false;
break;
default:
throw new Error("INVALID_STATE_ERR");
}
};
_312.close=function(code,_333){
switch(this.readyState){
case 0:
case 1:
_311._flashBridge.disconnect(this._instanceId,code,_333);
break;
}
};
_312.disconnect=_312.close;
var _331=function(_334){
_334.bufferedAmount=_311._flashBridge.getBufferedAmount(_334._instanceId);
if(_334.bufferedAmount!=0){
setTimeout(function(){
_331(_334);
},1000);
}
};
var _315=function(_335,_336,_337){
var _338=function(key,_33a){
_33a[key]=_335;
_335._instanceId=key;
};
var _33b=function(){
doError(_335);
};
var _33c=[];
if(_335.parent.requestHeaders&&_335.parent.requestHeaders.length>0){
for(var i=0;i<_335.parent.requestHeaders.length;i++){
_33c.push(_335.parent.requestHeaders[i].label+":"+_335.parent.requestHeaders[i].value);
}
}
_311._flashBridge.registerWebSocketEmulated(_336,_33c.join("\n"),_338,_33b);
};
function doError(_33e,e){
setTimeout(function(){
_33e._listener.connectionFailed(_33e.parent);
},0);
};
return _311;
})();
var _340=(function(){
var _341=function(){
this.parent;
this._listener;
};
var _342=_341.prototype;
_342.connect=function(_343,_344){
this.URL=_343;
try{
_345(this,_343,_344);
}
catch(e){
doError(this,e);
}
this.constructor=_341;
};
_342.setListener=function(_346){
this._listener=_346;
};
_310._flashBridge={};
_310._flashBridge.readyWaitQueue=[];
_310._flashBridge.failWaitQueue=[];
_310._flashBridge.flashHasLoaded=false;
_310._flashBridge.flashHasFailed=false;
_342.URL="";
_342.readyState=0;
_342.bufferedAmount=0;
_342.connectionOpened=function(_347,_348){
var _348=_348.split("\n");
for(var i=0;i<_348.length;i++){
var _34a=_348[i].split(":");
_347.responseHeaders[_34a[0]]=_34a[1];
}
this._listener.connectionOpened(_347,"");
};
_342.connectionClosed=function(_34b,_34c,code,_34e){
this._listener.connectionClosed(_34b,_34c,code,_34e);
};
_342.connectionFailed=function(_34f){
this._listener.connectionFailed(_34f);
};
_342.binaryMessageReceived=function(_350,data){
this._listener.binaryMessageReceived(_350,data);
};
_342.textMessageReceived=function(_352,s){
this._listener.textMessageReceived(_352,s);
};
_342.redirected=function(_354,_355){
this._listener.redirected(_354,_355);
};
_342.authenticationRequested=function(_356,_357,_358){
this._listener.authenticationRequested(_356,_357,_358);
};
_342.send=function(data){
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
break;
case 1:
if(data===null){
throw new Error("data is null");
}
if(typeof (data)=="string"){
_310._flashBridge.sendText(this._instanceId,data);
}else{
if(typeof (data.array)=="object"){
var _35a;
var a=[];
var b;
while(data.remaining()){
b=data.get();
a.push(String.fromCharCode(b));
}
var _35a=a.join("");
_310._flashBridge.sendByteString(this._instanceId,_35a);
return;
}else{
throw new Error("Invalid type");
}
}
_35d(this);
return true;
break;
case 2:
return false;
break;
default:
throw new Error("INVALID_STATE_ERR");
}
};
_342.close=function(code,_35f){
switch(this.readyState){
case 1:
case 2:
_310._flashBridge.disconnect(this._instanceId,code,_35f);
break;
}
};
_342.disconnect=_342.close;
var _35d=function(_360){
_360.bufferedAmount=_310._flashBridge.getBufferedAmount(_360._instanceId);
if(_360.bufferedAmount!=0){
setTimeout(function(){
_35d(_360);
},1000);
}
};
var _345=function(_361,_362,_363){
var _364=function(key,_366){
_366[key]=_361;
_361._instanceId=key;
};
var _367=function(){
doError(_361);
};
var _368=[];
if(_361.parent.requestHeaders&&_361.parent.requestHeaders.length>0){
for(var i=0;i<_361.parent.requestHeaders.length;i++){
_368.push(_361.parent.requestHeaders[i].label+":"+_361.parent.requestHeaders[i].value);
}
}
_310._flashBridge.registerWebSocketRtmp(_362,_368.join("\n"),_364,_367);
};
function doError(_36a,e){
setTimeout(function(){
_36a._listener.connectionFailed(_36a.parent);
},0);
};
return _341;
})();
(function(){
var _36c={};
_310._flashBridge.registerWebSocketEmulated=function(_36d,_36e,_36f,_370){
var _371=function(){
var key=_310._flashBridge.doRegisterWebSocketEmulated(_36d,_36e);
_36f(key,_36c);
};
if(_310._flashBridge.flashHasLoaded){
if(_310._flashBridge.flashHasFailed){
_370();
}else{
_371();
}
}else{
this.readyWaitQueue.push(_371);
this.failWaitQueue.push(_370);
}
};
_310._flashBridge.doRegisterWebSocketEmulated=function(_373,_374){
var key=_310._flashBridge.elt.registerWebSocketEmulated(_373,_374);
return key;
};
_310._flashBridge.registerWebSocketRtmp=function(_376,_377,_378,_379){
var _37a=function(){
var key=_310._flashBridge.doRegisterWebSocketRtmp(_376,_377);
_378(key,_36c);
};
if(_310._flashBridge.flashHasLoaded){
if(_310._flashBridge.flashHasFailed){
_379();
}else{
_37a();
}
}else{
this.readyWaitQueue.push(_37a);
this.failWaitQueue.push(_379);
}
};
_310._flashBridge.doRegisterWebSocketRtmp=function(_37c,_37d){
var key=_310._flashBridge.elt.registerWebSocketRtmp(_37c,_37d);
return key;
};
_310._flashBridge.onready=function(){
var _37f=_310._flashBridge.readyWaitQueue;
for(var i=0;i<_37f.length;i++){
var _381=_37f[i];
_381();
}
};
_310._flashBridge.onfail=function(){
var _382=_310._flashBridge.failWaitQueue;
for(var i=0;i<_382.length;i++){
var _384=_382[i];
_384();
}
};
_310._flashBridge.connectionOpened=function(key,_386){
_36c[key].readyState=1;
_36c[key].connectionOpened(_36c[key].parent,_386);
_387();
};
_310._flashBridge.connectionClosed=function(key,_389,code,_38b){
_36c[key].readyState=2;
_36c[key].connectionClosed(_36c[key].parent,_389,code,_38b);
};
_310._flashBridge.connectionFailed=function(key){
_36c[key].connectionFailed(_36c[key].parent);
};
_310._flashBridge.binaryMessageReceived=function(key,data){
var _38f=_36c[key];
if(_38f.readyState==1){
var buf=ByteBuffer.allocate(data.length);
for(var i=0;i<data.length;i++){
buf.put(data[i]);
}
buf.flip();
_38f.binaryMessageReceived(_38f.parent,buf);
}
};
_310._flashBridge.textMessageReceived=function(key,data){
var _394=_36c[key];
if(_394.readyState==1){
_394.textMessageReceived(_394.parent,unescape(data));
}
};
_310._flashBridge.redirected=function(key,_396){
var _397=_36c[key];
_397.redirected(_397.parent,_396);
};
_310._flashBridge.authenticationRequested=function(key,_399,_39a){
var _39b=_36c[key];
_39b.authenticationRequested(_39b.parent,_399,_39a);
};
var _387=function(){
if(browser==="firefox"){
var e=document.createElement("iframe");
e.style.display="none";
document.body.appendChild(e);
document.body.removeChild(e);
}
};
_310._flashBridge.sendText=function(key,_39e){
this.elt.processTextMessage(key,escape(_39e));
setTimeout(_387,200);
};
_310._flashBridge.sendByteString=function(key,_3a0){
this.elt.processBinaryMessage(key,escape(_3a0));
setTimeout(_387,200);
};
_310._flashBridge.disconnect=function(key,code,_3a3){
this.elt.processClose(key,code,_3a3);
};
_310._flashBridge.getBufferedAmount=function(key){
var v=this.elt.getBufferedAmount(key);
return v;
};
})();
(function(){
var _3a6=function(_3a7){
var self=this;
var _3a9=3000;
var ID="Loader";
var ie=false;
var _3ac=-1;
self.elt=null;
var _3ad=function(){
var exp=new RegExp(".*"+_3a7+".*.js$");
var _3af=document.getElementsByTagName("script");
for(var i=0;i<_3af.length;i++){
if(_3af[i].src){
var name=(_3af[i].src).match(exp);
if(name){
name=name.pop();
var _3b2=name.split("/");
_3b2.pop();
if(_3b2.length>0){
return _3b2.join("/")+"/";
}else{
return "";
}
}
}
}
};
var _3b3=_3ad();
var _3b4=_3b3+"Loader.swf";
self.loader=function(){
var _3b5="flash";
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name==="kaazing:upgrade"){
_3b5=tags[i].content;
}
}
if(_3b5!="flash"||!_3b8([9,0,115])){
_3b9();
}else{
_3ac=setTimeout(_3b9,_3a9);
_3ba();
}
};
self.clearFlashTimer=function(){
clearTimeout(_3ac);
_3ac="cleared";
setTimeout(function(){
_3bb(self.elt.handshake(_3a7));
},0);
};
var _3bb=function(_3bc){
if(_3bc){
_310._flashBridge.flashHasLoaded=true;
_310._flashBridge.elt=self.elt;
_310._flashBridge.onready();
}else{
_3b9();
}
window.___Loader=undefined;
};
var _3b9=function(){
_310._flashBridge.flashHasLoaded=true;
_310._flashBridge.flashHasFailed=true;
_310._flashBridge.onfail();
};
var _3bd=function(){
var _3be=null;
if(typeof (ActiveXObject)!="undefined"){
try{
ie=true;
var swf=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
var _3c0=swf.GetVariable("$version");
var _3c1=_3c0.split(" ")[1].split(",");
_3be=[];
for(var i=0;i<_3c1.length;i++){
_3be[i]=parseInt(_3c1[i]);
}
}
catch(e){
ie=false;
}
}
if(typeof navigator.plugins!="undefined"){
if(typeof navigator.plugins["Shockwave Flash"]!="undefined"){
var _3c0=navigator.plugins["Shockwave Flash"].description;
_3c0=_3c0.replace(/\s*r/g,".");
var _3c1=_3c0.split(" ")[2].split(".");
_3be=[];
for(var i=0;i<_3c1.length;i++){
_3be[i]=parseInt(_3c1[i]);
}
}
}
var _3c3=navigator.userAgent;
if(_3be!==null&&_3be[0]===10&&_3be[1]===0&&_3c3.indexOf("Windows NT 6.0")!==-1){
_3be=null;
}
if(_3c3.indexOf("MSIE 6.0")==-1&&_3c3.indexOf("MSIE 7.0")==-1){
if(_3c3.indexOf("MSIE 8.0")>0||_3c3.indexOf("MSIE 9.0")>0){
if(typeof (XDomainRequest)!=="undefined"){
_3be=null;
}
}else{
_3be=null;
}
}
return _3be;
};
var _3b8=function(_3c4){
var _3c5=_3bd();
if(_3c5==null){
return false;
}
for(var i=0;i<Math.max(_3c5.length,_3c4.length);i++){
var _3c7=_3c5[i]-_3c4[i];
if(_3c7!=0){
return (_3c7>0)?true:false;
}
}
return true;
};
var _3ba=function(){
if(ie){
var elt=document.createElement("div");
document.body.appendChild(elt);
elt.outerHTML="<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" height=\"0\" width=\"0\" id=\""+ID+"\"><param name=\"movie\" value=\""+_3b4+"\"></param></object>";
self.elt=document.getElementById(ID);
}else{
var elt=document.createElement("object");
elt.setAttribute("type","application/x-shockwave-flash");
elt.setAttribute("width",0);
elt.setAttribute("height",0);
elt.setAttribute("id",ID);
elt.setAttribute("data",_3b4);
document.body.appendChild(elt);
self.elt=elt;
}
};
self.attachToOnload=function(_3c9){
if(window.addEventListener){
window.addEventListener("load",_3c9,true);
}else{
if(window.attachEvent){
window.attachEvent("onload",_3c9);
}else{
onload=_3c9;
}
}
};
if(document.readyState==="complete"){
self.loader();
}else{
self.attachToOnload(self.loader);
}
};
var _3ca=(function(){
var _3cb=function(_3cc){
this.HOST=new _3cb(0);
this.USERINFO=new _3cb(1);
this.PORT=new _3cb(2);
this.PATH=new _3cb(3);
this.ordinal=_3cc;
};
return _3cb;
})();
var _3cd=(function(){
var _3ce=function(){
};
_3ce.getRealm=function(_3cf){
var _3d0=_3cf.authenticationParameters;
if(_3d0==null){
return null;
}
var _3d1=/realm=(\"(.*)\")/i;
var _3d2=_3d1.exec(_3d0);
return (_3d2!=null&&_3d2.length>=3)?_3d2[2]:null;
};
return _3ce;
})();
function Dictionary(){
this.Keys=new Array();
};
var _3d3=(function(){
var _3d4=function(_3d5){
this.weakKeys=_3d5;
this.elements=[];
this.dictionary=new Dictionary();
};
var _3d6=_3d4.prototype;
_3d6.getlength=function(){
return this.elements.length;
};
_3d6.getItemAt=function(_3d7){
return this.dictionary[this.elements[_3d7]];
};
_3d6.get=function(key){
var _3d9=this.dictionary[key];
if(_3d9==undefined){
_3d9=null;
}
return _3d9;
};
_3d6.remove=function(key){
for(var i=0;i<this.elements.length;i++){
var _3dc=(this.weakKeys&&(this.elements[i]==key));
var _3dd=(!this.weakKeys&&(this.elements[i]===key));
if(_3dc||_3dd){
this.elements.remove(i);
this.dictionary[this.elements[i]]=undefined;
break;
}
}
};
_3d6.put=function(key,_3df){
this.remove(key);
this.elements.push(key);
this.dictionary[key]=_3df;
};
_3d6.isEmpty=function(){
return this.length==0;
};
_3d6.containsKey=function(key){
for(var i=0;i<this.elements.length;i++){
var _3e2=(this.weakKeys&&(this.elements[i]==key));
var _3e3=(!this.weakKeys&&(this.elements[i]===key));
if(_3e2||_3e3){
return true;
}
}
return false;
};
_3d6.keySet=function(){
return this.elements;
};
_3d6.getvalues=function(){
var _3e4=[];
for(var i=0;i<this.elements.length;i++){
_3e4.push(this.dictionary[this.elements[i]]);
}
return _3e4;
};
return _3d4;
})();
var Node=(function(){
var Node=function(){
this.name="";
this.kind="";
this.values=[];
this.children=new _3d3();
};
var _3e8=Node.prototype;
_3e8.getWildcardChar=function(){
return "*";
};
_3e8.addChild=function(name,kind){
if(name==null||name.length==0){
throw new ArgumentError("A node may not have a null name.");
}
var _3eb=Node.createNode(name,this,kind);
this.children.put(name,_3eb);
return _3eb;
};
_3e8.hasChild=function(name,kind){
return null!=this.getChild(name)&&kind==this.getChild(name).kind;
};
_3e8.getChild=function(name){
return this.children.get(name);
};
_3e8.getDistanceFromRoot=function(){
var _3ef=0;
var _3f0=this;
while(!_3f0.isRootNode()){
_3ef++;
_3f0=_3f0.parent;
}
return _3ef;
};
_3e8.appendValues=function(){
if(this.isRootNode()){
throw new ArgumentError("Cannot set a values on the root node.");
}
if(this.values!=null){
for(var k=0;k<arguments.length;k++){
var _3f2=arguments[k];
this.values.push(_3f2);
}
}
};
_3e8.removeValue=function(_3f3){
if(this.isRootNode()){
return;
}
for(var i=0;i<this.values.length;i++){
if(this.values[i]==_3f3){
this.values.splice(i,1);
}
}
};
_3e8.getValues=function(){
return this.values;
};
_3e8.hasValues=function(){
return this.values!=null&&this.values.length>0;
};
_3e8.isRootNode=function(){
return this.parent==null;
};
_3e8.hasChildren=function(){
return this.children!=null&&this.children.getlength()>0;
};
_3e8.isWildcard=function(){
return this.name!=null&&this.name==this.getWildcardChar();
};
_3e8.hasWildcardChild=function(){
return this.hasChildren()&&this.children.containsKey(this.getWildcardChar());
};
_3e8.getFullyQualifiedName=function(){
var b=new String();
var name=[];
var _3f7=this;
while(!_3f7.isRootNode()){
name.push(_3f7.name);
_3f7=_3f7.parent;
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
_3e8.getChildrenAsList=function(){
return this.children.getvalues();
};
_3e8.findBestMatchingNode=function(_3f9,_3fa){
var _3fb=this.findAllMatchingNodes(_3f9,_3fa);
var _3fc=null;
var _3fd=0;
for(var i=0;i<_3fb.length;i++){
var node=_3fb[i];
if(node.getDistanceFromRoot()>_3fd){
_3fd=node.getDistanceFromRoot();
_3fc=node;
}
}
return _3fc;
};
_3e8.findAllMatchingNodes=function(_400,_401){
var _402=[];
var _403=this.getChildrenAsList();
for(var i=0;i<_403.length;i++){
var node=_403[i];
var _406=node.matches(_400,_401);
if(_406<0){
continue;
}
if(_406>=_400.length){
do{
if(node.hasValues()){
_402.push(node);
}
if(node.hasWildcardChild()){
var _407=node.getChild(this.getWildcardChar());
if(_407.kind!=this.kind){
node=null;
}else{
node=_407;
}
}else{
node=null;
}
}while(node!=null);
}else{
var _408=node.findAllMatchingNodes(_400,_406);
for(var j=0;j<_408.length;j++){
_402.push(_408[j]);
}
}
}
return _402;
};
_3e8.matches=function(_40a,_40b){
if(_40b<0||_40b>=_40a.length){
return -1;
}
if(this.matchesToken(_40a[_40b])){
return _40b+1;
}
if(!this.isWildcard()){
return -1;
}else{
if(this.kind!=_40a[_40b].kind){
return -1;
}
do{
_40b++;
}while(_40b<_40a.length&&this.kind==_40a[_40b].kind);
return _40b;
}
};
_3e8.matchesToken=function(_40c){
return this.name==_40c.name&&this.kind==_40c.kind;
};
Node.createNode=function(name,_40e,kind){
var node=new Node();
node.name=name;
node.parent=_40e;
node.kind=kind;
return node;
};
return Node;
})();
var _411=(function(){
var _412=function(name,kind){
this.kind=kind;
this.name=name;
};
return _412;
})();
window.Oid=(function(){
var Oid=function(data){
this.rep=data;
};
var _417=Oid.prototype;
_417.asArray=function(){
return this.rep;
};
_417.asString=function(){
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
var _41b=(function(){
var _41c=function(){
};
_41c.create=function(_41d,_41e,_41f){
var _420=_41d+":"+_41e;
var _421=[];
for(var i=0;i<_420.length;++i){
_421.push(_420.charCodeAt(i));
}
var _423="Basic "+Base64.encode(_421);
return new ChallengeResponse(_423,_41f);
};
return _41c;
})();
function InternalDefaultChallengeHandler(){
this.canHandle=function(_424){
return false;
};
this.handle=function(_425,_426){
_426(null);
};
};
window.PasswordAuthentication=(function(){
function PasswordAuthentication(_427,_428){
this.username=_427;
this.password=_428;
};
PasswordAuthentication.prototype.clear=function(){
this.username=null;
this.password=null;
};
return PasswordAuthentication;
})();
window.ChallengeRequest=(function(){
var _429=function(_42a,_42b){
if(_42a==null){
throw new Error("location is not defined.");
}
if(_42b==null){
return;
}
var _42c="Application ";
if(_42b.indexOf(_42c)==0){
_42b=_42b.substring(_42c.length);
}
this.location=_42a;
this.authenticationParameters=null;
var _42d=_42b.indexOf(" ");
if(_42d==-1){
this.authenticationScheme=_42b;
}else{
this.authenticationScheme=_42b.substring(0,_42d);
if(_42b.length>_42d+1){
this.authenticationParameters=_42b.substring(_42d+1);
}
}
};
return _429;
})();
window.ChallengeResponse=(function(){
var _42e=function(_42f,_430){
this.credentials=_42f;
this.nextChallengeHandler=_430;
};
var _431=_42e.prototype;
_431.clearCredentials=function(){
if(this.credentials!=null){
this.credentials=null;
}
};
return _42e;
})();
window.BasicChallengeHandler=(function(){
var _432=function(){
this.loginHandler=undefined;
this.loginHandlersByRealm={};
};
var _433=_432.prototype;
_433.setRealmLoginHandler=function(_434,_435){
if(_434==null){
throw new ArgumentError("null realm");
}
if(_435==null){
throw new ArgumentError("null loginHandler");
}
this.loginHandlersByRealm[_434]=_435;
return this;
};
_433.canHandle=function(_436){
return _436!=null&&"Basic"==_436.authenticationScheme;
};
_433.handle=function(_437,_438){
if(_437.location!=null){
var _439=this.loginHandler;
var _43a=_3cd.getRealm(_437);
if(_43a!=null&&this.loginHandlersByRealm[_43a]!=null){
_439=this.loginHandlersByRealm[_43a];
}
var _43b=this;
if(_439!=null){
_439(function(_43c){
if(_43c!=null&&_43c.username!=null){
_438(_41b.create(_43c.username,_43c.password,_43b));
}else{
_438(null);
}
});
return;
}
}
_438(null);
};
_433.loginHandler=function(_43d){
_43d(null);
};
return _432;
})();
window.DispatchChallengeHandler=(function(){
var _43e=function(){
this.rootNode=new Node();
var _43f="^(.*)://(.*)";
this.SCHEME_URI_PATTERN=new RegExp(_43f);
};
function delChallengeHandlerAtLocation(_440,_441,_442){
var _443=tokenize(_441);
var _444=_440;
for(var i=0;i<_443.length;i++){
var _446=_443[i];
if(!_444.hasChild(_446.name,_446.kind)){
return;
}else{
_444=_444.getChild(_446.name);
}
}
_444.removeValue(_442);
};
function addChallengeHandlerAtLocation(_447,_448,_449){
var _44a=tokenize(_448);
var _44b=_447;
for(var i=0;i<_44a.length;i++){
var _44d=_44a[i];
if(!_44b.hasChild(_44d.name,_44d.kind)){
_44b=_44b.addChild(_44d.name,_44d.kind);
}else{
_44b=_44b.getChild(_44d.name);
}
}
_44b.appendValues(_449);
};
function lookupByLocation(_44e,_44f){
var _450=new Array();
if(_44f!=null){
var _451=findBestMatchingNode(_44e,_44f);
if(_451!=null){
return _451.values;
}
}
return _450;
};
function lookupByRequest(_452,_453){
var _454=null;
var _455=_453.location;
if(_455!=null){
var _456=findBestMatchingNode(_452,_455);
if(_456!=null){
var _457=_456.getValues();
if(_457!=null){
for(var i=0;i<_457.length;i++){
var _459=_457[i];
if(_459.canHandle(_453)){
_454=_459;
break;
}
}
}
}
}
return _454;
};
function findBestMatchingNode(_45a,_45b){
var _45c=tokenize(_45b);
var _45d=0;
return _45a.findBestMatchingNode(_45c,_45d);
};
function tokenize(uri){
var _45f=new Array();
if(uri==null||uri.length==0){
return _45f;
}
var _460=new RegExp("^(([^:/?#]+):(//))?([^/?#]*)?([^?#]*)(\\?([^#]*))?(#(.*))?");
var _461=_460.exec(uri);
if(_461==null){
return _45f;
}
var _462=_461[2]||"http";
var _463=_461[4];
var path=_461[5];
var _465=null;
var _466=null;
var _467=null;
var _468=null;
if(_463!=null){
var host=_463;
var _46a=host.indexOf("@");
if(_46a>=0){
_466=host.substring(0,_46a);
host=host.substring(_46a+1);
var _46b=_466.indexOf(":");
if(_46b>=0){
_467=_466.substring(0,_46b);
_468=_466.substring(_46b+1);
}
}
var _46c=host.indexOf(":");
if(_46c>=0){
_465=host.substring(_46c+1);
host=host.substring(0,_46c);
}
}else{
throw new ArgumentError("Hostname is required.");
}
var _46d=host.split(/\./);
_46d.reverse();
for(var k=0;k<_46d.length;k++){
_45f.push(new _411(_46d[k],_3ca.HOST));
}
if(_465!=null){
_45f.push(new _411(_465,_3ca.PORT));
}else{
if(getDefaultPort(_462)>0){
_45f.push(new _411(getDefaultPort(_462).toString(),_3ca.PORT));
}
}
if(_466!=null){
if(_467!=null){
_45f.push(new _411(_467,_3ca.USERINFO));
}
if(_468!=null){
_45f.push(new _411(_468,_3ca.USERINFO));
}
if(_467==null&&_468==null){
_45f.push(new _411(_466,_3ca.USERINFO));
}
}
if(isNotBlank(path)){
if(path.charAt(0)=="/"){
path=path.substring(1);
}
if(isNotBlank(path)){
var _46f=path.split("/");
for(var p=0;p<_46f.length;p++){
var _471=_46f[p];
_45f.push(new _411(_471,_3ca.PATH));
}
}
}
return _45f;
};
function getDefaultPort(_472){
if(defaultPortsByScheme[_472.toLowerCase()]!=null){
return defaultPortsByScheme[_472];
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
var _474=_43e.prototype;
_474.clear=function(){
this.rootNode=new Node();
};
_474.canHandle=function(_475){
return lookupByRequest(this.rootNode,_475)!=null;
};
_474.handle=function(_476,_477){
var _478=lookupByRequest(this.rootNode,_476);
if(_478==null){
return null;
}
return _478.handle(_476,_477);
};
_474.register=function(_479,_47a){
if(_479==null||_479.length==0){
throw new Error("Must specify a location to handle challenges upon.");
}
if(_47a==null){
throw new Error("Must specify a handler to handle challenges.");
}
addChallengeHandlerAtLocation(this.rootNode,_479,_47a);
return this;
};
_474.unregister=function(_47b,_47c){
if(_47b==null||_47b.length==0){
throw new Error("Must specify a location to un-register challenge handlers upon.");
}
if(_47c==null){
throw new Error("Must specify a handler to un-register.");
}
delChallengeHandlerAtLocation(this.rootNode,_47b,_47c);
return this;
};
return _43e;
})();
window.NegotiableChallengeHandler=(function(){
var _47d=function(){
this.candidateChallengeHandlers=new Array();
};
var _47e=function(_47f){
var oids=new Array();
for(var i=0;i<_47f.length;i++){
oids.push(Oid.create(_47f[i]).asArray());
}
var _482=GssUtils.sizeOfSpnegoInitialContextTokenWithOids(null,oids);
var _483=ByteBuffer.allocate(_482);
_483.skip(_482);
GssUtils.encodeSpnegoInitialContextTokenWithOids(null,oids,_483);
return ByteArrayUtils.arrayToByteArray(Base64Util.encodeBuffer(_483));
};
var _484=_47d.prototype;
_484.register=function(_485){
if(_485==null){
throw new Error("handler is null");
}
for(var i=0;i<this.candidateChallengeHandlers.length;i++){
if(_485===this.candidateChallengeHandlers[i]){
return this;
}
}
this.candidateChallengeHandlers.push(_485);
return this;
};
_484.canHandle=function(_487){
return _487!=null&&_487.authenticationScheme=="Negotiate"&&_487.authenticationParameters==null;
};
_484.handle=function(_488,_489){
if(_488==null){
throw Error(new ArgumentError("challengeRequest is null"));
}
var _48a=new _3d3();
for(var i=0;i<this.candidateChallengeHandlers.length;i++){
var _48c=this.candidateChallengeHandlers[i];
if(_48c.canHandle(_488)){
try{
var _48d=_48c.getSupportedOids();
for(var j=0;j<_48d.length;j++){
var oid=new Oid(_48d[j]).asString();
if(!_48a.containsKey(oid)){
_48a.put(oid,_48c);
}
}
}
catch(e){
}
}
}
if(_48a.isEmpty()){
_489(null);
return;
}
};
return _47d;
})();
window.NegotiableChallengeHandler=(function(){
var _490=function(){
this.loginHandler=undefined;
};
_490.prototype.getSupportedOids=function(){
return new Array();
};
return _490;
})();
window.NegotiableChallengeHandler=(function(){
var _491=function(){
this.loginHandler=undefined;
};
_491.prototype.getSupportedOids=function(){
return new Array();
};
return _491;
})();
var _492={};
(function(){
var _493={8364:128,129:129,8218:130,402:131,8222:132,8230:133,8224:134,8225:135,710:136,8240:137,352:138,8249:139,338:140,141:141,381:142,143:143,144:144,8216:145,8217:146,8220:147,8221:148,8226:149,8211:150,8212:151,732:152,8482:153,353:154,8250:155,339:156,157:157,382:158,376:159};
var _494={128:8364,129:129,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,141:141,142:381,143:143,144:144,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,157:157,158:382,159:376};
_492.toCharCode=function(n){
if(n<128||(n>159&&n<256)){
return n;
}else{
var _496=_494[n];
if(typeof (_496)=="undefined"){
throw new Error("Windows1252.toCharCode could not find: "+n);
}
return _496;
}
};
_492.fromCharCode=function(code){
if(code<256){
return code;
}else{
var _498=_493[code];
if(typeof (_498)=="undefined"){
throw new Error("Windows1252.fromCharCode could not find: "+code);
}
return _498;
}
};
var _499=String.fromCharCode(127);
var NULL=String.fromCharCode(0);
var _49b="\n";
var _49c=function(s){
var a=[];
for(var i=0;i<s.length;i++){
var code=_492.fromCharCode(s.charCodeAt(i));
if(code==127){
i++;
if(i==s.length){
a.hasRemainder=true;
break;
}
var _4a1=_492.fromCharCode(s.charCodeAt(i));
switch(_4a1){
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
throw new Error("Escaping format error");
}
}else{
a.push(code);
}
}
return a;
};
var _4a2=function(buf){
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
var chr=String.fromCharCode(_492.toCharCode(n));
switch(chr){
case _499:
a.push(_499);
a.push(_499);
break;
case NULL:
a.push(_499);
a.push("0");
break;
case _49b:
a.push(_499);
a.push("n");
break;
default:
a.push(chr);
}
}
return a.join("");
};
_492.toArray=function(s,_4a8){
if(_4a8){
return _49c(s);
}else{
var a=[];
for(var i=0;i<s.length;i++){
a.push(_492.fromCharCode(s.charCodeAt(i)));
}
return a;
}
};
_492.toByteString=function(buf,_4ac){
if(_4ac){
return _4a2(buf);
}else{
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
a.push(String.fromCharCode(_492.toCharCode(n)));
}
return a.join("");
}
};
})();
function CloseEvent(_4af,_4b0,_4b1,_4b2){
this.reason=_4b2;
this.code=_4b1;
this.wasClean=_4b0;
this.type="close";
this.bubbles=true;
this.cancelable=true;
this.target=_4af;
};
function MessageEvent(_4b3,_4b4,_4b5){
return {target:_4b3,data:_4b4,origin:_4b5,bubbles:true,cancelable:true,type:"message",lastEventId:""};
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
var _4b7=function(_4b8,_4b9){
var _4ba=_4b9||{};
if(window.WebKitBlobBuilder){
var _4bb=new window.WebKitBlobBuilder();
for(var i=0;i<_4b8.length;i++){
var part=_4b8[i];
if(_4ba.endings){
_4bb.append(part,_4ba.endings);
}else{
_4bb.append(part);
}
}
var blob;
if(_4ba.type){
blob=_4bb.getBlob(type);
}else{
blob=_4bb.getBlob();
}
blob.slice=blob.webkitSlice||blob.slice;
return blob;
}else{
if(window.MozBlobBuilder){
var _4bb=new window.MozBlobBuilder();
for(var i=0;i<_4b8.length;i++){
var part=_4b8[i];
if(_4ba.endings){
_4bb.append(part,_4ba.endings);
}else{
_4bb.append(part);
}
}
var blob;
if(_4ba.type){
blob=_4bb.getBlob(type);
}else{
blob=_4bb.getBlob();
}
blob.slice=blob.mozSlice||blob.slice;
return blob;
}else{
var _4bf=[];
for(var i=0;i<_4b8.length;i++){
var part=_4b8[i];
if(typeof part==="string"){
var b=BlobUtils.fromString(part,_4ba.endings);
_4bf.push(b);
}else{
if(part.byteLength){
var _4c1=new Uint8Array(part);
for(var i=0;i<part.byteLength;i++){
_4bf.push(_4c1[i]);
}
}else{
if(part.length){
_4bf.push(part);
}else{
if(part._array){
_4bf.push(part._array);
}else{
throw new Error("invalid type in Blob constructor");
}
}
}
}
}
var blob=concatMemoryBlobs(_4bf);
blob.type=_4ba.type;
return blob;
}
}
};
function MemoryBlob(_4c2,_4c3){
return {_array:_4c2,size:_4c2.length,type:_4c3||"",slice:function(_4c4,end,_4c6){
var a=this._array.slice(_4c4,end);
return MemoryBlob(a,_4c6);
},toString:function(){
return "MemoryBlob: "+_4c2.toString();
}};
};
function concatMemoryBlobs(_4c8){
var a=Array.prototype.concat.apply([],_4c8);
return new MemoryBlob(a);
};
window.Blob=_4b7;
})();
(function(_4ca){
_4ca.BlobUtils={};
BlobUtils.asString=function asString(blob,_4cc,end){
if(blob._array){
}else{
if(FileReader){
var _4ce=new FileReader();
_4ce.readAsText(blob);
_4ce.onload=function(){
cb(_4ce.result);
};
_4ce.onerror=function(e){
console.log(e,_4ce);
};
}
}
};
BlobUtils.asNumberArray=(function(){
var _4d0=[];
var _4d1=function(){
if(_4d0.length>0){
try{
var _4d2=_4d0.shift();
_4d2.cb(_4d2.blob._array);
}
finally{
if(_4d0.length>0){
setTimeout(function(){
_4d1();
},0);
}
}
}
};
var _4d3=function(cb,blob){
if(blob._array){
_4d0.push({cb:cb,blob:blob});
if(_4d0.length==1){
setTimeout(function(){
_4d1();
},0);
}
}else{
if(FileReader){
var _4d6=new FileReader();
_4d6.readAsArrayBuffer(blob);
_4d6.onload=function(){
var _4d7=new DataView(_4d6.result);
var a=[];
for(var i=0;i<_4d6.result.byteLength;i++){
a.push(_4d7.getUint8(i));
}
cb(a);
};
}else{
throw new Error("Cannot convert Blob to binary string");
}
}
};
return _4d3;
})();
BlobUtils.asBinaryString=function asBinaryString(cb,blob){
if(blob._array){
var _4dc=blob._array;
var a=[];
for(var i=0;i<_4dc.length;i++){
a.push(String.fromCharCode(_4dc[i]));
}
setTimeout(function(){
cb(a.join(""));
},0);
}else{
if(FileReader){
var _4df=new FileReader();
if(_4df.readAsBinaryString){
_4df.readAsBinaryString(blob);
_4df.onload=function(){
cb(_4df.result);
};
}else{
_4df.readAsArrayBuffer(blob);
_4df.onload=function(){
var _4e0=new DataView(_4df.result);
var a=[];
for(var i=0;i<_4df.result.byteLength;i++){
a.push(String.fromCharCode(_4e0.getUint8(i)));
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
var _4e4=[];
for(var i=0;i<s.length;i++){
_4e4.push(s.charCodeAt(i));
}
return BlobUtils.fromNumberArray(_4e4);
};
BlobUtils.fromNumberArray=function fromNumberArray(a){
if(typeof (Uint8Array)!=="undefined"){
return new Blob([new Uint8Array(a)]);
}else{
return new Blob([a]);
}
};
BlobUtils.fromString=function fromString(s,_4e8){
if(_4e8&&_4e8==="native"){
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
var _4eb=function(){
this._queue=[];
this._count=0;
this.completion;
};
_4eb.prototype.enqueue=function(cb){
var _4ed=this;
var _4ee={};
_4ee.cb=cb;
_4ee.id=this._count++;
this._queue.push(_4ee);
var func=function(){
_4ed.processQueue(_4ee.id,cb,arguments);
};
return func;
};
_4eb.prototype.processQueue=function(id,cb,args){
for(var i=0;i<this._queue.length;i++){
if(this._queue[i].id==id){
this._queue[i].args=args;
break;
}
}
while(this._queue.length&&this._queue[0].args!==undefined){
var _4f4=this._queue.shift();
_4f4.cb.apply(null,_4f4.args);
}
};
var _4f5=(function(){
var _4f6=function(_4f7,_4f8){
this.label=_4f7;
this.value=_4f8;
};
return _4f6;
})();
var _4f9=(function(){
var _4fa=function(_4fb){
var uri=new URI(_4fb);
if(isValidScheme(uri.scheme)){
this._uri=uri;
}else{
throw new Error("HttpURI - invalid scheme: "+_4fb);
}
};
function isValidScheme(_4fd){
return "http"==_4fd||"https"==_4fd;
};
var _4fe=_4fa.prototype;
_4fe.getURI=function(){
return this._uri;
};
_4fe.duplicate=function(uri){
try{
return new _4fa(uri);
}
catch(e){
throw e;
}
return null;
};
_4fe.isSecure=function(){
return ("https"==this._uri.scheme);
};
_4fe.toString=function(){
return this._uri.toString();
};
_4fa.replaceScheme=function(_500,_501){
var uri=URI.replaceProtocol(_500,_501);
return new _4fa(uri);
};
return _4fa;
})();
var _503=(function(){
var _504=function(_505){
var uri=new URI(_505);
if(isValidScheme(uri.scheme)){
this._uri=uri;
if(uri.port==undefined){
this._uri=new URI(_504.addDefaultPort(_505));
}
}else{
throw new Error("WSURI - invalid scheme: "+_505);
}
};
function isValidScheme(_507){
return "ws"==_507||"wss"==_507;
};
function duplicate(uri){
try{
return new _504(uri);
}
catch(e){
throw e;
}
return null;
};
var _509=_504.prototype;
_509.getAuthority=function(){
return this._uri.authority;
};
_509.isSecure=function(){
return "wss"==this._uri.scheme;
};
_509.getHttpEquivalentScheme=function(){
return this.isSecure()?"https":"http";
};
_509.toString=function(){
return this._uri.toString();
};
var _50a=80;
var _50b=443;
_504.setDefaultPort=function(uri){
if(uri.port==0){
if(uri.scheme=="ws"){
uri.port=_50a;
}else{
if(uri.scheme=="wss"){
uri.port=_50b;
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
_504.addDefaultPort=function(_50d){
var uri=new URI(_50d);
if(uri.port==undefined){
_504.setDefaultPort(uri);
}
return uri.toString();
};
_504.replaceScheme=function(_50f,_510){
var uri=URI.replaceProtocol(_50f,_510);
return new _504(uri);
};
return _504;
})();
var _512=(function(){
var _513={};
_513["ws"]="ws";
_513["wss"]="wss";
_513["javascript:wse"]="ws";
_513["javascript:wse+ssl"]="wss";
_513["javascript:ws"]="ws";
_513["javascript:wss"]="wss";
_513["flash:wsr"]="ws";
_513["flash:wsr+ssl"]="wss";
_513["flash:wse"]="ws";
_513["flash:wse+ssl"]="wss";
var _514=function(_515){
var _516=getProtocol(_515);
if(isValidScheme(_516)){
this._uri=new URI(URI.replaceProtocol(_515,_513[_516]));
this._compositeScheme=_516;
this._location=_515;
}else{
throw new SyntaxError("WSCompositeURI - invalid composite scheme: "+getProtocol(_515));
}
};
function getProtocol(_517){
var indx=_517.indexOf("://");
if(indx>0){
return _517.substr(0,indx);
}else{
return "";
}
};
function isValidScheme(_519){
return _513[_519]!=null;
};
function duplicate(uri){
try{
return new _514(uri);
}
catch(e){
throw e;
}
return null;
};
var _51b=_514.prototype;
_51b.isSecure=function(){
var _51c=this._uri.scheme;
return "wss"==_513[_51c];
};
_51b.getWSEquivalent=function(){
try{
var _51d=_513[this._compositeScheme];
return _503.replaceScheme(this._location,_51d);
}
catch(e){
throw e;
}
return null;
};
_51b.getPlatformPrefix=function(){
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
_51b.toString=function(){
return this._location;
};
return _514;
})();
var _51e=(function(){
var _51f=function(_520,_521,_522){
if(arguments.length<3){
var s="ResumableTimer: Please specify the required parameters 'callback', 'delay', and 'updateDelayWhenPaused'.";
throw Error(s);
}
if((typeof (_520)=="undefined")||(_520==null)){
var s="ResumableTimer: Please specify required parameter 'callback'.";
throw Error(s);
}else{
if(typeof (_520)!="function"){
var s="ResumableTimer: Required parameter 'callback' must be a function.";
throw Error(s);
}
}
if(typeof (_521)=="undefined"){
var s="ResumableTimer: Please specify required parameter 'delay' of type integer.";
throw Error(s);
}else{
if((typeof (_521)!="number")||(_521<=0)){
var s="ResumableTimer: Required parameter 'delay' should be a positive integer.";
throw Error(s);
}
}
if(typeof (_522)=="undefined"){
var s="ResumableTimer: Please specify required boolean parameter 'updateDelayWhenPaused'.";
throw Error(s);
}else{
if(typeof (_522)!="boolean"){
var s="ResumableTimer: Required parameter 'updateDelayWhenPaused' is a boolean.";
throw Error(s);
}
}
this._delay=_521;
this._updateDelayWhenPaused=_522;
this._callback=_520;
this._timeoutId=-1;
this._startTime=-1;
};
var _524=_51f.prototype;
_524.cancel=function(){
if(this._timeoutId!=-1){
window.clearTimeout(this._timeoutId);
this._timeoutId=-1;
}
this._delay=-1;
this._callback=null;
};
_524.pause=function(){
if(this._timeoutId==-1){
return;
}
window.clearTimeout(this._timeoutId);
var _525=new Date().getTime();
var _526=_525-this._startTime;
this._timeoutId=-1;
if(this._updateDelayWhenPaused){
this._delay=this._delay-_526;
}
};
_524.resume=function(){
if(this._timeoutId!=-1){
return;
}
if(this._callback==null){
var s="Timer cannot be resumed as it has been canceled.";
throw new Error(s);
}
this.start();
};
_524.start=function(){
if(this._delay<0){
var s="Timer delay cannot be negative";
}
this._timeoutId=window.setTimeout(this._callback,this._delay);
this._startTime=new Date().getTime();
};
return _51f;
})();
var _529=(function(){
var _52a=function(){
this._parent=null;
this._challengeResponse=new ChallengeResponse(null,null);
};
_52a.prototype.toString=function(){
return "[Channel]";
};
return _52a;
})();
var _52b=(function(){
var _52c=function(_52d,_52e,_52f){
_529.apply(this,arguments);
this._location=_52d;
this._protocol=_52e;
this._extensions=[];
this._controlFrames={};
this._controlFramesBinary={};
this._escapeSequences={};
this._handshakePayload="";
this._isEscape=false;
this._bufferedAmount=0;
};
var _530=_52c.prototype=new _529();
_530.getBufferedAmount=function(){
return this._bufferedAmount;
};
_530.toString=function(){
return "[WebSocketChannel "+_location+" "+_protocol!=null?_protocol:"-"+"]";
};
return _52c;
})();
var _531=(function(){
var _532=function(){
this._nextHandler;
this._listener;
};
var _533=_532.prototype;
_533.processConnect=function(_534,_535,_536){
this._nextHandler.processConnect(_534,_535,_536);
};
_533.processAuthorize=function(_537,_538){
this._nextHandler.processAuthorize(_537,_538);
};
_533.processTextMessage=function(_539,text){
this._nextHandler.processTextMessage(_539,text);
};
_533.processBinaryMessage=function(_53b,_53c){
this._nextHandler.processBinaryMessage(_53b,_53c);
};
_533.processClose=function(_53d,code,_53f){
this._nextHandler.processClose(_53d,code,_53f);
};
_533.setIdleTimeout=function(_540,_541){
this._nextHandler.setIdleTimeout(_540,_541);
};
_533.setListener=function(_542){
this._listener=_542;
};
_533.setNextHandler=function(_543){
this._nextHandler=_543;
};
return _532;
})();
var _544=function(_545){
this.connectionOpened=function(_546,_547){
_545._listener.connectionOpened(_546,_547);
};
this.textMessageReceived=function(_548,s){
_545._listener.textMessageReceived(_548,s);
};
this.binaryMessageReceived=function(_54a,obj){
_545._listener.binaryMessageReceived(_54a,obj);
};
this.connectionClosed=function(_54c,_54d,code,_54f){
_545._listener.connectionClosed(_54c,_54d,code,_54f);
};
this.connectionError=function(_550,e){
_545._listener.connectionError(_550,e);
};
this.connectionFailed=function(_552){
_545._listener.connectionFailed(_552);
};
this.authenticationRequested=function(_553,_554,_555){
_545._listener.authenticationRequested(_553,_554,_555);
};
this.redirected=function(_556,_557){
_545._listener.redirected(_556,_557);
};
this.onBufferedAmountChange=function(_558,n){
_545._listener.onBufferedAmountChange(_558,n);
};
};
var _55a=(function(){
var _55b=function(){
var _55c="";
var _55d="";
};
_55b.KAAZING_EXTENDED_HANDSHAKE="x-kaazing-handshake";
_55b.KAAZING_SEC_EXTENSION_REVALIDATE="x-kaazing-http-revalidate";
_55b.HEADER_SEC_PROTOCOL="X-WebSocket-Protocol";
_55b.HEADER_SEC_EXTENSIONS="X-WebSocket-Extensions";
_55b.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT="x-kaazing-idle-timeout";
_55b.KAAZING_SEC_EXTENSION_PING_PONG="x-kaazing-ping-pong";
return _55b;
})();
var _55e=(function(){
var _55f=function(_560,_561){
_52b.apply(this,arguments);
this.requestHeaders=[];
this.responseHeaders={};
this.readyState=WebSocket.CONNECTING;
this.authenticationReceived=false;
this.wasCleanClose=false;
this.closeCode=1006;
this.closeReason="";
this.preventFallback=false;
};
return _55f;
})();
var _562=(function(){
var _563=function(){
};
var _564=_563.prototype;
_564.createChannel=function(_565,_566,_567){
var _568=new _55e(_565,_566,_567);
return _568;
};
return _563;
})();
var _569=(function(){
var _56a=function(){
};
var _56b=_56a.prototype;
_56b.createChannel=function(_56c,_56d){
var _56e=new _55e(_56c,_56d);
return _56e;
};
return _56a;
})();
var _56f=(function(){
var _570=function(_571,_572){
this._location=_571.getWSEquivalent();
this._protocol=_572;
this._webSocket;
this._compositeScheme=_571._compositeScheme;
this._connectionStrategies=[];
this._selectedChannel;
this.readyState=0;
this._closing=false;
this._negotiatedExtensions={};
this._compositeScheme=_571._compositeScheme;
};
var _573=_570.prototype=new _52b();
_573.getReadyState=function(){
return this.readyState;
};
_573.getWebSocket=function(){
return this._webSocket;
};
_573.getCompositeScheme=function(){
return this._compositeScheme;
};
_573.getNextStrategy=function(){
if(this._connectionStrategies.length<=0){
return null;
}else{
return this._connectionStrategies.shift();
}
};
_573.getRedirectPolicy=function(){
return this.getWebSocket().getRedirectPolicy();
};
return _570;
})();
var _574=(function(){
var _575=function(){
};
var _576=function(_577,_578){
var _579=0;
for(var i=_578;i<_578+4;i++){
_579=(_579<<8)+_577.getAt(i);
}
return _579;
};
var _57b=function(_57c){
if(_57c.byteLength>3){
var _57d=new DataView(_57c);
return _57d.getInt32(0);
}
return 0;
};
var _57e=function(_57f){
var _580=0;
for(var i=0;i<4;i++){
_580=(_580<<8)+_57f.charCodeAt(i);
}
return _580;
};
var ping=[9,0];
var pong=[10,0];
var _584={};
var _585=function(_586){
if(typeof _584.escape==="undefined"){
var _587=[];
var i=4;
do{
_587[--i]=_586&(255);
_586=_586>>8;
}while(i);
_584.escape=String.fromCharCode.apply(null,_587.concat(pong));
}
return _584.escape;
};
var _589=function(_58a,_58b,_58c,_58d){
if(_55a.KAAZING_SEC_EXTENSION_REVALIDATE==_58b._controlFrames[_58d]){
var url=_58c.substr(5);
if(_58b._redirectUri!=null){
if(typeof (_58b._redirectUri)=="string"){
var _58f=new URI(_58b._redirectUri);
url=_58f.scheme+"://"+_58f.authority+url;
}else{
url=_58b._redirectUri.getHttpEquivalentScheme()+"://"+_58b._redirectUri.getAuthority()+url;
}
}else{
url=_58b._location.getHttpEquivalentScheme()+"://"+_58b._location.getAuthority()+url;
}
_58a._listener.authenticationRequested(_58b,url,_55a.KAAZING_SEC_EXTENSION_REVALIDATE);
}else{
if(_55a.KAAZING_SEC_EXTENSION_PING_PONG==_58b._controlFrames[_58d]){
if(_58c.charCodeAt(4)==ping[0]){
var pong=_585(_58d);
_58a._nextHandler.processTextMessage(_58b,pong);
}
}
}
};
var _591=_575.prototype=new _531();
_591.handleConnectionOpened=function(_592,_593){
var _594=_592.responseHeaders;
if(_594[_55a.HEADER_SEC_EXTENSIONS]!=null){
var _595=_594[_55a.HEADER_SEC_EXTENSIONS];
if(_595!=null&&_595.length>0){
var _596=_595.split(",");
for(var j=0;j<_596.length;j++){
var tmp=_596[j].split(";");
var ext=tmp[0].replace(/^\s+|\s+$/g,"");
var _59a=new WebSocketExtension(ext);
_59a.enabled=true;
_59a.negotiated=true;
if(tmp.length>1){
var _59b=tmp[1].replace(/^\s+|\s+$/g,"");
if(_59b.length==8){
try{
var _59c=parseInt(_59b,16);
_592._controlFrames[_59c]=ext;
if(_55a.KAAZING_SEC_EXTENSION_REVALIDATE===ext){
_592._controlFramesBinary[_59c]=ext;
}
_59a.escape=_59b;
}
catch(e){
}
}
}
_592.parent._negotiatedExtensions[ext]=_59a;
}
}
}
this._listener.connectionOpened(_592,_593);
};
_591.handleTextMessageReceived=function(_59d,_59e){
if(_59d._isEscape){
_59d._isEscape=false;
this._listener.textMessageReceived(_59d,_59e);
return;
}
if(_59e==null||_59e.length<4){
this._listener.textMessageReceived(_59d,_59e);
return;
}
var _59f=_57e(_59e);
if(_59d._controlFrames[_59f]!=null){
if(_59e.length==4){
_59d._isEscape=true;
return;
}else{
_589(this,_59d,_59e,_59f);
}
}else{
this._listener.textMessageReceived(_59d,_59e);
}
};
_591.handleMessageReceived=function(_5a0,_5a1){
if(_5a0._isEscape){
_5a0._isEscape=false;
this._listener.binaryMessageReceived(_5a0,_5a1);
return;
}
if(typeof (_5a1.byteLength)!="undefined"){
var _5a2=_57b(_5a1);
if(_5a0._controlFramesBinary[_5a2]!=null){
if(_5a1.byteLength==4){
_5a0._isEscape=true;
return;
}else{
_589(this,_5a0,String.fromCharCode.apply(null,new Uint8Array(_5a1,0)),_5a2);
}
}else{
this._listener.binaryMessageReceived(_5a0,_5a1);
}
}else{
if(_5a1.constructor==ByteBuffer){
if(_5a1==null||_5a1.limit<4){
this._listener.binaryMessageReceived(_5a0,_5a1);
return;
}
var _5a2=_576(_5a1,_5a1.position);
if(_5a0._controlFramesBinary[_5a2]!=null){
if(_5a1.limit==4){
_5a0._isEscape=true;
return;
}else{
_589(this,_5a0,_5a1.getString(Charset.UTF8),_5a2);
}
}else{
this._listener.binaryMessageReceived(_5a0,_5a1);
}
}
}
};
_591.processTextMessage=function(_5a3,_5a4){
if(_5a4.length>=4){
var _5a5=_57e(_5a4);
if(_5a3._escapeSequences[_5a5]!=null){
var _5a6=_5a4.slice(0,4);
this._nextHandler.processTextMessage(_5a3,_5a6);
}
}
this._nextHandler.processTextMessage(_5a3,_5a4);
};
_591.setNextHandler=function(_5a7){
var _5a8=this;
this._nextHandler=_5a7;
var _5a9=new _544(this);
_5a9.connectionOpened=function(_5aa,_5ab){
_5a8.handleConnectionOpened(_5aa,_5ab);
};
_5a9.textMessageReceived=function(_5ac,buf){
_5a8.handleTextMessageReceived(_5ac,buf);
};
_5a9.binaryMessageReceived=function(_5ae,buf){
_5a8.handleMessageReceived(_5ae,buf);
};
_5a7.setListener(_5a9);
};
_591.setListener=function(_5b0){
this._listener=_5b0;
};
return _575;
})();
var _5b1=(function(){
var _5b2=function(_5b3){
this.channel=_5b3;
};
var _5b4=function(_5b5){
var _5b6=_5b5.parent;
if(_5b6){
return (_5b6.readyState>=2);
}
return false;
};
var _5b7=_5b2.prototype;
_5b7.connect=function(_5b8){
if(_5b4(this.channel)){
return;
}
var _5b9=this;
var _5ba=new XMLHttpRequest0();
_5ba.withCredentials=true;
_5ba.open("GET",_5b8+"&.krn="+Math.random(),true);
if(_5b9.channel._challengeResponse!=null&&_5b9.channel._challengeResponse.credentials!=null){
_5ba.setRequestHeader("Authorization",_5b9.channel._challengeResponse.credentials);
this.clearAuthenticationData(_5b9.channel);
}
_5ba.onreadystatechange=function(){
switch(_5ba.readyState){
case 2:
if(_5ba.status==403){
_5ba.abort();
}
break;
case 4:
if(_5ba.status==401){
_5b9.handle401(_5b9.channel,_5b8,_5ba.getResponseHeader("WWW-Authenticate"));
return;
}
break;
}
};
_5ba.send(null);
};
_5b7.clearAuthenticationData=function(_5bb){
if(_5bb._challengeResponse!=null){
_5bb._challengeResponse.clearCredentials();
}
};
_5b7.handle401=function(_5bc,_5bd,_5be){
if(_5b4(_5bc)){
return;
}
var _5bf=this;
var _5c0=_5bd;
if(_5c0.indexOf("/;a/")>0){
_5c0=_5c0.substring(0,_5c0.indexOf("/;a/"));
}else{
if(_5c0.indexOf("/;ae/")>0){
_5c0=_5c0.substring(0,_5c0.indexOf("/;ae/"));
}else{
if(_5c0.indexOf("/;ar/")>0){
_5c0=_5c0.substring(0,_5c0.indexOf("/;ar/"));
}
}
}
var _5c1=new ChallengeRequest(_5c0,_5be);
var _5c2;
if(this.channel._challengeResponse.nextChallengeHandler!=null){
_5c2=this.channel._challengeResponse.nextChallengeHandler;
}else{
_5c2=_5bc.challengeHandler;
}
if(_5c2!=null&&_5c2.canHandle(_5c1)){
_5c2.handle(_5c1,function(_5c3){
try{
if(_5c3!=null&&_5c3.credentials!=null){
_5bf.channel._challengeResponse=_5c3;
_5bf.connect(_5bd);
}
}
catch(e){
}
});
}
};
return _5b2;
})();
var _5c4=(function(){
var _5c5=function(){
};
var _5c6=_5c5.prototype=new _531();
_5c6.processConnect=function(_5c7,uri,_5c9){
if(_5c7.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
if(_5c7._delegate==null){
var _5ca=new _2e0();
_5ca.parent=_5c7;
_5c7._delegate=_5ca;
_5cb(_5ca,this);
}
_5c7._delegate.connect(uri.toString(),_5c9);
};
_5c6.processTextMessage=function(_5cc,text){
if(_5cc._delegate.readyState()==WebSocket.OPEN){
_5cc._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_5c6.processBinaryMessage=function(_5ce,obj){
if(_5ce._delegate.readyState()==WebSocket.OPEN){
_5ce._delegate.send(obj);
}else{
throw new Error("WebSocket is already closed");
}
};
_5c6.processClose=function(_5d0,code,_5d2){
try{
_5d0._delegate.close(code,_5d2);
}
catch(e){
}
};
_5c6.setIdleTimeout=function(_5d3,_5d4){
try{
_5d3._delegate.setIdleTimeout(_5d4);
}
catch(e){
}
};
var _5cb=function(_5d5,_5d6){
var _5d7=new _544(_5d6);
_5d5.setListener(_5d7);
};
return _5c5;
})();
var _5d8=(function(){
var _5d9=function(){
};
var _5da=function(_5db,_5dc,_5dd){
_5dc._redirecting=true;
_5dc._redirectUri=_5dd;
_5db._nextHandler.processClose(_5dc);
};
var _5de=_5d9.prototype=new _531();
_5de.processConnect=function(_5df,uri,_5e1){
_5df._balanced=0;
this._nextHandler.processConnect(_5df,uri,_5e1);
};
_5de.handleConnectionClosed=function(_5e2,_5e3,code,_5e5){
if(_5e2._redirecting==true){
_5e2._redirecting=false;
var _5e6=_5e2._redirectUri;
var _5e7=_5e2._location;
var _5e8=_5e2.parent;
var _5e9=_5e8.getRedirectPolicy();
if(_5e9 instanceof HttpRedirectPolicy){
if(!_5e9.isRedirectionAllowed(_5e7.toString(),_5e6.toString())){
_5e2.preventFallback=true;
var s=_5e9.toString()+": Cannot redirect from "+_5e7.toString()+" to "+_5e6.toString();
this._listener.connectionClosed(_5e2,false,1006,s);
return;
}
}
_5e2._redirected=true;
_5e2.handshakePayload="";
var _5eb=[_55a.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_5e2._protocol.length;i++){
_5eb.push(_5e2._protocol[i]);
}
this.processConnect(_5e2,_5e2._redirectUri,_5eb);
}else{
this._listener.connectionClosed(_5e2,_5e3,code,_5e5);
}
};
_5de.handleMessageReceived=function(_5ed,obj){
if(_5ed._balanced>1){
this._listener.binaryMessageReceived(_5ed,obj);
return;
}
var _5ef=_2ba(obj);
if(_5ef.charCodeAt(0)==61695){
if(_5ef.match("N$")){
_5ed._balanced++;
if(_5ed._balanced==1){
this._listener.connectionOpened(_5ed,_55a.KAAZING_EXTENDED_HANDSHAKE);
}else{
this._listener.connectionOpened(_5ed,_5ed._acceptedProtocol||"");
}
}else{
if(_5ef.indexOf("R")==1){
var _5f0=new _503(_5ef.substring(2));
_5da(this,_5ed,_5f0);
}else{
}
}
return;
}else{
this._listener.binaryMessageReceived(_5ed,obj);
}
};
_5de.setNextHandler=function(_5f1){
this._nextHandler=_5f1;
var _5f2=new _544(this);
var _5f3=this;
_5f2.connectionOpened=function(_5f4,_5f5){
if(_55a.KAAZING_EXTENDED_HANDSHAKE!=_5f5){
_5f4._balanced=2;
_5f3._listener.connectionOpened(_5f4,_5f5);
}
};
_5f2.textMessageReceived=function(_5f6,_5f7){
if(_5f6._balanced>1){
_5f3._listener.textMessageReceived(_5f6,_5f7);
return;
}
if(_5f7.charCodeAt(0)==61695){
if(_5f7.match("N$")){
_5f6._balanced++;
if(_5f6._balanced==1){
_5f3._listener.connectionOpened(_5f6,_55a.KAAZING_EXTENDED_HANDSHAKE);
}else{
_5f3._listener.connectionOpened(_5f6,"");
}
}else{
if(_5f7.indexOf("R")==1){
var _5f8=new _503(_5f7.substring(2));
_5da(_5f3,_5f6,_5f8);
}else{
}
}
return;
}else{
_5f3._listener.textMessageReceived(_5f6,_5f7);
}
};
_5f2.binaryMessageReceived=function(_5f9,obj){
_5f3.handleMessageReceived(_5f9,obj);
};
_5f2.connectionClosed=function(_5fb,_5fc,code,_5fe){
_5f3.handleConnectionClosed(_5fb,_5fc,code,_5fe);
};
_5f1.setListener(_5f2);
};
_5de.setListener=function(_5ff){
this._listener=_5ff;
};
return _5d9;
})();
var _600=(function(){
var _601="Sec-WebSocket-Protocol";
var _602="Sec-WebSocket-Extensions";
var _603="Authorization";
var _604="WWW-Authenticate";
var _605="Set-Cookie";
var _606="GET";
var _607="HTTP/1.1";
var _608=":";
var _609=" ";
var _60a="\r\n";
var _60b=function(){
};
var _60c=function(_60d,_60e){
var _60f=new XMLHttpRequest0();
var path=_60d._location.getHttpEquivalentScheme()+"://"+_60d._location.getAuthority()+(_60d._location._uri.path||"");
path=path.replace(/[\/]?$/,"/;api/set-cookies");
_60f.open("POST",path,true);
_60f.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_60f.send(_60e);
};
var _611=function(_612,_613,_614){
var _615=[];
var _616=[];
_615.push("WebSocket-Protocol");
_616.push("");
_615.push(_601);
_616.push(_613._protocol.join(","));
var _617=[_55a.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT,_55a.KAAZING_SEC_EXTENSION_PING_PONG];
var ext=_613._extensions;
if(ext.length>0){
_617.push(ext);
}
_615.push(_602);
_616.push(_617.join(","));
_615.push(_603);
_616.push(_614);
var _619=_61a(_613._location,_615,_616);
_612._nextHandler.processTextMessage(_613,_619);
};
var _61a=function(_61b,_61c,_61d){
var _61e=[];
_61e.push(_606);
_61e.push(_609);
var path=[];
if(_61b._uri.path!=undefined){
path.push(_61b._uri.path);
}
if(_61b._uri.query!=undefined){
path.push("?");
path.push(_61b._uri.query);
}
_61e.push(path.join(""));
_61e.push(_609);
_61e.push(_607);
_61e.push(_60a);
for(var i=0;i<_61c.length;i++){
var _621=_61c[i];
var _622=_61d[i];
if(_621!=null&&_622!=null){
_61e.push(_621);
_61e.push(_608);
_61e.push(_609);
_61e.push(_622);
_61e.push(_60a);
}
}
_61e.push(_60a);
var _623=_61e.join("");
return _623;
};
var _624=function(_625,_626,s){
if(s.length>0){
_626.handshakePayload+=s;
return;
}
var _628=_626.handshakePayload.split("\n");
_626.handshakePayload="";
var _629="";
for(var i=_628.length-1;i>=0;i--){
if(_628[i].indexOf("HTTP/1.1")==0){
var temp=_628[i].split(" ");
_629=temp[1];
break;
}
}
if("101"==_629){
var _62c=[];
var _62d="";
for(var i=0;i<_628.length;i++){
var line=_628[i];
if(line!=null&&line.indexOf(_602)==0){
_62c.push(line.substring(_602.length+2));
}else{
if(line!=null&&line.indexOf(_601)==0){
_62d=line.substring(_601.length+2);
}else{
if(line!=null&&line.indexOf(_605)==0){
_60c(_626,line.substring(_605.length+2));
}
}
}
}
_626._acceptedProtocol=_62d;
if(_62c.length>0){
var _62f=[];
var _630=_62c.join(", ").split(", ");
for(var j=0;j<_630.length;j++){
var tmp=_630[j].split(";");
var ext=tmp[0].replace(/^\s+|\s+$/g,"");
var _634=new WebSocketExtension(ext);
if(_55a.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT===ext){
var _635=tmp[1].match(/\d+/)[0];
if(_635>0){
_625._nextHandler.setIdleTimeout(_626,_635);
}
continue;
}else{
if(_55a.KAAZING_SEC_EXTENSION_PING_PONG===ext){
try{
var _636=tmp[1].replace(/^\s+|\s+$/g,"");
var _637=parseInt(_636,16);
_626._controlFrames[_637]=ext;
_626._escapeSequences[_637]=ext;
continue;
}
catch(e){
throw new Error("failed to parse escape key for x-kaazing-ping-pong extension");
}
}else{
if(tmp.length>1){
var _636=tmp[1].replace(/^\s+|\s+$/g,"");
if(_636.length==8){
try{
var _637=parseInt(_636,16);
_626._controlFrames[_637]=ext;
if(_55a.KAAZING_SEC_EXTENSION_REVALIDATE===ext){
_626._controlFramesBinary[_637]=ext;
}
_634.escape=_636;
}
catch(e){
}
}
}
}
}
_634.enabled=true;
_634.negotiated=true;
_62f.push(_630[j]);
}
if(_62f.length>0){
_626.parent._negotiatedExtensions[ext]=_62f.join(",");
}
}
return;
}else{
if("401"==_629){
_626.handshakestatus=2;
var _638="";
for(var i=0;i<_628.length;i++){
if(_628[i].indexOf(_604)==0){
_638=_628[i].substring(_604.length+2);
break;
}
}
_625._listener.authenticationRequested(_626,_626._location.toString(),_638);
}else{
_625._listener.connectionFailed(_626);
}
}
};
var _639=function(_63a,_63b){
try{
_63b.handshakestatus=3;
_63a._nextHandler.processClose(_63b);
}
finally{
_63a._listener.connectionFailed(_63b);
}
};
var _63c=_60b.prototype=new _531();
_63c.processConnect=function(_63d,uri,_63f){
_63d.handshakePayload="";
var _640=[_55a.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_63f.length;i++){
_640.push(_63f[i]);
}
this._nextHandler.processConnect(_63d,uri,_640);
if((typeof (_63d.parent.connectTimer)=="undefined")||(_63d.parent.connectTimer==null)){
_63d.handshakestatus=0;
var _642=this;
setTimeout(function(){
if(_63d.handshakestatus==0){
_639(_642,_63d);
}
},5000);
}
};
_63c.processAuthorize=function(_643,_644){
_611(this,_643,_644);
};
_63c.handleConnectionOpened=function(_645,_646){
if(_55a.KAAZING_EXTENDED_HANDSHAKE==_646){
_611(this,_645,null);
_645.handshakestatus=1;
if((typeof (_645.parent.connectTimer)=="undefined")||(_645.parent.connectTimer==null)){
var _647=this;
setTimeout(function(){
if(_645.handshakestatus<2){
_639(_647,_645);
}
},5000);
}
}else{
_645.handshakestatus=2;
this._listener.connectionOpened(_645,_646);
}
};
_63c.handleMessageReceived=function(_648,_649){
if(_648.readyState==WebSocket.OPEN){
_648._isEscape=false;
this._listener.textMessageReceived(_648,_649);
}else{
_624(this,_648,_649);
}
};
_63c.handleBinaryMessageReceived=function(_64a,_64b){
if(_64a.readyState==WebSocket.OPEN){
_64a._isEscape=false;
this._listener.binaryMessageReceived(_64a,_64b);
}else{
_624(this,_64a,String.fromCharCode.apply(null,new Uint8Array(_64b)));
}
};
_63c.setNextHandler=function(_64c){
this._nextHandler=_64c;
var _64d=this;
var _64e=new _544(this);
_64e.connectionOpened=function(_64f,_650){
_64d.handleConnectionOpened(_64f,_650);
};
_64e.textMessageReceived=function(_651,buf){
_64d.handleMessageReceived(_651,buf);
};
_64e.binaryMessageReceived=function(_653,buf){
_64d.handleBinaryMessageReceived(_653,buf);
};
_64e.connectionClosed=function(_655,_656,code,_658){
if(_655.handshakestatus<3){
_655.handshakestatus=3;
}
_64d._listener.connectionClosed(_655,_656,code,_658);
};
_64e.connectionFailed=function(_659){
if(_659.handshakestatus<3){
_659.handshakestatus=3;
}
_64d._listener.connectionFailed(_659);
};
_64c.setListener(_64e);
};
_63c.setListener=function(_65a){
this._listener=_65a;
};
return _60b;
})();
var _65b=(function(){
var _65c=function(){
};
var _65d=_65c.prototype=new _531();
_65d.handleClearAuthenticationData=function(_65e){
if(_65e._challengeResponse!=null){
_65e._challengeResponse.clearCredentials();
}
};
_65d.handleRemoveAuthenticationData=function(_65f){
this.handleClearAuthenticationData(_65f);
_65f._challengeResponse=new ChallengeResponse(null,null);
};
_65d.doError=function(_660){
this._nextHandler.processClose(_660);
this.handleClearAuthenticationData(_660);
this._listener.connectionFailed(_660);
};
_65d.handle401=function(_661,_662,_663){
var _664=this;
var _665=_661._location;
var _666=null;
if(typeof (_661.parent.connectTimer)!="undefined"){
_666=_661.parent.connectTimer;
if(_666!=null){
_666.pause();
}
}
if(_661.redirectUri!=null){
_665=_661._redirectUri;
}
if(_55a.KAAZING_SEC_EXTENSION_REVALIDATE==_663){
var ch=new _55e(_665,_661._protocol,_661._isBinary);
ch.challengeHandler=_661.parent.challengeHandler;
ch.parent=_661.parent;
var _668=new _5b1(ch);
_668.connect(_662);
}else{
var _669=new ChallengeRequest(_665.toString(),_663);
var _66a;
if(_661._challengeResponse.nextChallengeHandler!=null){
_66a=_661._challengeResponse.nextChallengeHandler;
}else{
_66a=_661.parent.challengeHandler;
}
if(_66a!=null&&_66a.canHandle(_669)){
_66a.handle(_669,function(_66b){
try{
if(_66b==null||_66b.credentials==null){
_664.doError(_661);
}else{
if(_666!=null){
_666.resume();
}
_661._challengeResponse=_66b;
_664._nextHandler.processAuthorize(_661,_66b.credentials);
}
}
catch(e){
_664.doError(_661);
}
});
}else{
this.doError(_661);
}
}
};
_65d.handleAuthenticate=function(_66c,_66d,_66e){
_66c.authenticationReceived=true;
this.handle401(_66c,_66d,_66e);
};
_65d.setNextHandler=function(_66f){
this._nextHandler=_66f;
var _670=this;
var _671=new _544(this);
_671.authenticationRequested=function(_672,_673,_674){
_670.handleAuthenticate(_672,_673,_674);
};
_66f.setListener(_671);
};
_65d.setListener=function(_675){
this._listener=_675;
};
return _65c;
})();
var _676=(function(){
var _677=function(){
};
var _678=_677.prototype=new _531();
_678.processConnect=function(_679,uri,_67b){
this._nextHandler.processConnect(_679,uri,_67b);
};
_678.processBinaryMessage=function(_67c,data){
if(data.constructor==ByteBuffer){
var _67e=data.array.slice(data.position,data.limit);
this._nextHandler.processTextMessage(_67c,Charset.UTF8.encodeByteArray(_67e));
}else{
if(data.byteLength){
this._nextHandler.processTextMessage(_67c,Charset.UTF8.encodeArrayBuffer(data));
}else{
if(data.size){
var _67f=this;
var cb=function(_681){
_67f._nextHandler.processBinaryMessage(_67c,Charset.UTF8.encodeByteArray(_681));
};
BlobUtils.asNumberArray(cb,data);
}else{
throw new Error("Invalid type for send");
}
}
}
};
_678.setNextHandler=function(_682){
this._nextHandler=_682;
var _683=this;
var _684=new _544(this);
_684.textMessageReceived=function(_685,text){
_683._listener.binaryMessageReceived(_685,ByteBuffer.wrap(Charset.UTF8.toByteArray(text)));
};
_684.binaryMessageReceived=function(_687,buf){
throw new Error("draft76 won't receive binary frame");
};
_682.setListener(_684);
};
_678.setListener=function(_689){
this._listener=_689;
};
return _677;
})();
var _68a=(function(){
var _68b=function(){
var _68c=new _65b();
return _68c;
};
var _68d=function(){
var _68e=new _600();
return _68e;
};
var _68f=function(){
var _690=new _574();
return _690;
};
var _691=function(){
var _692=new _5d8();
return _692;
};
var _693=function(){
var _694=new _5c4();
return _694;
};
var _695=function(){
var _696=new _676();
return _696;
};
var _697=(browser=="safari"&&typeof (WebSocket.CLOSING)=="undefined");
var _698=_68b();
var _699=_68d();
var _69a=_68f();
var _69b=_691();
var _69c=_693();
var _69d=_695();
var _69e=function(){
if(_697){
this.setNextHandler(_69d);
_69d.setNextHandler(_698);
}else{
this.setNextHandler(_698);
}
_698.setNextHandler(_699);
_699.setNextHandler(_69a);
_69a.setNextHandler(_69b);
_69b.setNextHandler(_69c);
};
var _69f=function(_6a0,_6a1){
};
var _6a2=_69e.prototype=new _531();
_6a2.setNextHandler=function(_6a3){
this._nextHandler=_6a3;
var _6a4=new _544(this);
_6a3.setListener(_6a4);
};
_6a2.setListener=function(_6a5){
this._listener=_6a5;
};
return _69e;
})();
var _6a6=(function(){
var _6a7=512*1024;
var _6a8=1;
var _6a9=function(_6aa,_6ab,_6ac){
this.sequence=_6ab;
this.retry=3000;
if(_6aa.indexOf("/;e/dtem/")>0){
this.requiresEscaping=true;
}
var _6ad=new URI(_6aa);
var _6ae={"http":80,"https":443};
if(_6ad.port==undefined){
_6ad.port=_6ae[_6ad.scheme];
_6ad.authority=_6ad.host+":"+_6ad.port;
}
this.origin=_6ad.scheme+"://"+_6ad.authority;
this.location=_6aa;
this.activeXhr=null;
this.reconnectTimer=null;
this.idleTimer=null;
this.idleTimeout=null;
this.lastMessageTimestamp=null;
this.buf=new ByteBuffer();
this.connectTimer=null;
this.connectionTimeout=_6ac;
var _6af=this;
setTimeout(function(){
connect(_6af,true);
_6af.activeXhr=_6af.mostRecentXhr;
startProxyDetectionTimer(_6af,_6af.mostRecentXhr);
},0);
};
var _6b0=_6a9.prototype;
var _6b1=0;
var _6b2=255;
var _6b3=1;
var _6b4=128;
var _6b5=129;
var _6b6=127;
var _6b7=137;
var _6b8=3000;
_6b0.readyState=0;
function connect(_6b9,_6ba){
if(_6b9.reconnectTimer!==null){
_6b9.reconnectTimer=null;
}
stopIdleTimer(_6b9);
startConnectTimer(_6b9,_6b9.connectionTimeout);
var _6bb=new URI(_6b9.location);
var _6bc=[];
var _6bd=_6b9.sequence++;
_6bc.push(".ksn="+_6bd);
switch(browser){
case "ie":
_6bc.push(".kns=1");
_6bc.push(".kf=200&.kp=2048");
break;
case "safari":
_6bc.push(".kp=256");
break;
case "firefox":
_6bc.push(".kp=1025");
break;
case "android":
_6bc.push(".kp=4096");
_6bc.push(".kbp=4096");
break;
}
if(browser=="android"||browser.ios){
_6bc.push(".kkt=20");
}
_6bc.push(".kc=text/plain;charset=windows-1252");
_6bc.push(".kb=4096");
_6bc.push(".kid="+String(Math.random()).substring(2));
if(_6bc.length>0){
if(_6bb.query===undefined){
_6bb.query=_6bc.join("&");
}else{
_6bb.query+="&"+_6bc.join("&");
}
}
var xhr=new XMLHttpRequest0();
xhr.id=_6a8++;
xhr.position=0;
xhr.opened=false;
xhr.reconnect=false;
xhr.requestClosing=false;
xhr.onreadystatechange=function(){
if(xhr.readyState==3){
stopConnectTimer(_6b9);
if(_6b9.idleTimer==null){
var _6bf=xhr.getResponseHeader("X-Idle-Timeout");
if(_6bf){
if(!_6bf.match(/^[\d]+$/)){
doError(_6b9);
throw "Invalid response of header X-Idle-Timeout";
}
var _6c0=parseInt(_6bf);
if(_6c0>0){
_6c0=_6c0*1000;
_6b9.idleTimeout=_6c0;
_6b9.lastMessageTimestamp=new Date().getTime();
startIdleTimer(_6b9,_6c0);
}
}
}
}
};
xhr.onprogress=function(){
if(xhr==_6b9.activeXhr&&_6b9.readyState!=2){
_process(_6b9);
}
};
xhr.onload=function(){
if(xhr==_6b9.activeXhr&&_6b9.readyState!=2){
_process(_6b9);
xhr.onerror=function(){
};
xhr.ontimeout=function(){
};
xhr.onreadystatechange=function(){
};
if(!xhr.reconnect){
doError(_6b9);
}else{
if(xhr.requestClosing){
doClose(_6b9);
}else{
if(_6b9.activeXhr==_6b9.mostRecentXhr){
connect(_6b9);
_6b9.activeXhr=_6b9.mostRecentXhr;
startProxyDetectionTimer(_6b9,_6b9.activeXhr);
}else{
var _6c1=_6b9.mostRecentXhr;
_6b9.activeXhr=_6c1;
switch(_6c1.readyState){
case 1:
case 2:
startProxyDetectionTimer(_6b9,_6c1);
break;
case 3:
_process(_6b9);
break;
case 4:
_6b9.activeXhr.onload();
break;
default:
}
}
}
}
}
};
xhr.ontimeout=function(){
doError(_6b9);
};
xhr.onerror=function(){
doError(_6b9);
};
xhr.open("GET",_6bb.toString(),true);
xhr.send("");
_6b9.mostRecentXhr=xhr;
};
function startProxyDetectionTimer(_6c2,xhr){
if(_6c2.location.indexOf(".ki=p")==-1){
setTimeout(function(){
if(xhr&&xhr.readyState<3&&_6c2.readyState<2){
if(_6c2.location.indexOf("?")==-1){
_6c2.location+="?.ki=p";
}else{
_6c2.location+="&.ki=p";
}
connect(_6c2,false);
}
},_6b8);
}
};
_6b0.disconnect=function(){
if(this.readyState!==2){
_disconnect(this);
}
};
function _disconnect(_6c4){
if(_6c4.reconnectTimer!==null){
clearTimeout(_6c4.reconnectTimer);
_6c4.reconnectTimer=null;
}
stopIdleTimer(_6c4);
if(_6c4.mostRecentXhr!==null){
_6c4.mostRecentXhr.onprogress=function(){
};
_6c4.mostRecentXhr.onload=function(){
};
_6c4.mostRecentXhr.onerror=function(){
};
_6c4.mostRecentXhr.abort();
}
if(_6c4.activeXhr!=_6c4.mostRecentXhr&&_6c4.activeXhr!==null){
_6c4.activeXhr.onprogress=function(){
};
_6c4.activeXhr.onload=function(){
};
_6c4.activeXhr.onerror=function(){
};
_6c4.activeXhr.abort();
}
_6c4.lineQueue=[];
_6c4.lastEventId=null;
_6c4.location=null;
_6c4.readyState=2;
};
function _process(_6c5){
_6c5.lastMessageTimestamp=new Date().getTime();
var xhr=_6c5.activeXhr;
var _6c7=xhr.responseText;
if(_6c7.length>=_6a7){
if(_6c5.activeXhr==_6c5.mostRecentXhr){
connect(_6c5,false);
}
}
var _6c8=_6c7.slice(xhr.position);
xhr.position=_6c7.length;
var buf=_6c5.buf;
var _6ca=_492.toArray(_6c8,_6c5.requiresEscaping);
if(_6ca.hasRemainder){
xhr.position--;
}
buf.position=buf.limit;
buf.putBytes(_6ca);
buf.position=0;
buf.mark();
parse:
while(true){
if(!buf.hasRemaining()){
break;
}
var type=buf.getUnsigned();
switch(type&128){
case _6b1:
var _6cc=buf.indexOf(_6b2);
if(_6cc==-1){
break parse;
}
var _6cd=buf.array.slice(buf.position,_6cc);
var data=new ByteBuffer(_6cd);
var _6cf=_6cc-buf.position;
buf.skip(_6cf+1);
buf.mark();
if(type==_6b3){
handleCommandFrame(_6c5,data);
}else{
dispatchText(_6c5,data.getString(Charset.UTF8));
}
break;
case _6b4:
case _6b5:
var _6d0=0;
var _6d1=false;
while(buf.hasRemaining()){
var b=buf.getUnsigned();
_6d0=_6d0<<7;
_6d0|=(b&127);
if((b&128)!=128){
_6d1=true;
break;
}
}
if(!_6d1){
break parse;
}
if(buf.remaining()<_6d0){
break parse;
}
var _6d3=buf.array.slice(buf.position,buf.position+_6d0);
var _6d4=new ByteBuffer(_6d3);
buf.skip(_6d0);
buf.mark();
if(type==_6b4){
dispatchBytes(_6c5,_6d4);
}else{
if(type==_6b7){
dispatchPingReceived(_6c5);
}else{
dispatchText(_6c5,_6d4.getString(Charset.UTF8));
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
function handleCommandFrame(_6d5,data){
while(data.remaining()){
var _6d7=String.fromCharCode(data.getUnsigned());
switch(_6d7){
case "0":
break;
case "1":
_6d5.activeXhr.reconnect=true;
break;
case "2":
_6d5.activeXhr.requestClosing=true;
break;
default:
throw new Error("Protocol decode error. Unknown command: "+_6d7);
}
}
};
function dispatchBytes(_6d8,buf){
var e=document.createEvent("Events");
e.initEvent("message",true,true);
e.lastEventId=_6d8.lastEventId;
e.data=buf;
e.decoder=_2b3;
e.origin=_6d8.origin;
if(e.source!==null){
e.source=null;
}
if(typeof (_6d8.onmessage)==="function"){
_6d8.onmessage(e);
}
};
function dispatchText(_6db,data){
var e=document.createEvent("Events");
e.initEvent("message",true,true);
e.lastEventId=_6db.lastEventId;
e.text=data;
e.origin=_6db.origin;
if(e.source!==null){
e.source=null;
}
if(typeof (_6db.onmessage)==="function"){
_6db.onmessage(e);
}
};
function dispatchPingReceived(_6de){
if(typeof (_6de.onping)==="function"){
_6de.onping();
}
};
function doClose(_6df){
doError(_6df);
};
function doError(_6e0){
if(_6e0.readyState!=2){
_6e0.disconnect();
fireError(_6e0);
}
};
function fireError(_6e1){
var e=document.createEvent("Events");
e.initEvent("error",true,true);
if(typeof (_6e1.onerror)==="function"){
_6e1.onerror(e);
}
};
function startIdleTimer(_6e3,_6e4){
stopIdleTimer(_6e3);
_6e3.idleTimer=setTimeout(function(){
idleTimerHandler(_6e3);
},_6e4);
};
function idleTimerHandler(_6e5){
var _6e6=new Date().getTime();
var _6e7=_6e6-_6e5.lastMessageTimestamp;
var _6e8=_6e5.idleTimeout;
if(_6e7>_6e8){
doError(_6e5);
}else{
startIdleTimer(_6e5,_6e8-_6e7);
}
};
function stopIdleTimer(_6e9){
if(_6e9.idleTimer!=null){
clearTimeout(_6e9.idleTimer);
_6e9.idleTimer=null;
}
};
function startConnectTimer(_6ea,_6eb){
stopConnectTimer(_6ea);
_6ea.connectTimer=setTimeout(function(){
connectTimerHandler(_6ea);
},_6eb);
};
function connectTimerHandler(_6ec){
doError(_6ec);
};
function stopConnectTimer(_6ed){
if(_6ed.connectTimer!=null){
clearTimeout(_6ed.connectTimer);
_6ed.connectTimer=null;
}
};
return _6a9;
})();
var _6ee=(function(){
var _6ef=function(){
this.parent;
this._listener;
this.closeCode=1005;
this.closeReason="";
this.sequence=0;
};
var _6f0=_6ef.prototype;
_6f0.connect=function(_6f1,_6f2){
this.URL=_6f1.replace("ws","http");
this.protocol=_6f2;
this._prepareQueue=new _4eb();
this._sendQueue=[];
_6f3(this);
};
_6f0.readyState=0;
_6f0.bufferedAmount=0;
_6f0.URL="";
_6f0.onopen=function(){
};
_6f0.onerror=function(){
};
_6f0.onmessage=function(_6f4){
};
_6f0.onclose=function(){
};
var _6f5=128;
var _6f6=129;
var _6f7=0;
var _6f8=255;
var _6f9=1;
var _6fa=138;
var _6fb=[_6f9,48,49,_6f8];
var _6fc=[_6f9,48,50,_6f8];
var _6fd=function(buf,_6ff){
var _700=0;
var _701=0;
do{
_701<<=8;
_701|=(_6ff&127);
_6ff>>=7;
_700++;
}while(_6ff>0);
do{
var _702=_701&255;
_701>>=8;
if(_700!=1){
_702|=128;
}
buf.put(_702);
}while(--_700>0);
};
_6f0.send=function(data){
var _704=this;
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
case 1:
if(data===null){
throw new Error("data is null");
}
var buf=new ByteBuffer();
if(typeof data=="string"){
var _706=new ByteBuffer();
_706.putString(data,Charset.UTF8);
buf.put(_6f6);
_6fd(buf,_706.position);
buf.putBytes(_706.array);
}else{
if(data.constructor==ByteBuffer){
buf.put(_6f5);
_6fd(buf,data.remaining());
buf.putBuffer(data);
}else{
if(data.byteLength){
buf.put(_6f5);
_6fd(buf,data.byteLength);
buf.putByteArray(data);
}else{
if(data.size){
var cb=this._prepareQueue.enqueue(function(_708){
var b=new ByteBuffer();
b.put(_6f5);
_6fd(b,_708.length);
b.putBytes(_708);
b.flip();
doSend(_704,b);
});
BlobUtils.asNumberArray(cb,data);
return true;
}else{
throw new Error("Invalid type for send");
}
}
}
}
buf.flip();
this._prepareQueue.enqueue(function(_70a){
doSend(_704,buf);
})();
return true;
case 2:
return false;
default:
throw new Error("INVALID_STATE_ERR");
}
};
_6f0.close=function(code,_70c){
switch(this.readyState){
case 0:
_70d(this);
break;
case 1:
if(code!=null&&code!=0){
this.closeCode=code;
this.closeReason=_70c;
}
doSend(this,new ByteBuffer(_6fc));
break;
}
};
_6f0.setListener=function(_70e){
this._listener=_70e;
};
function openUpstream(_70f){
if(_70f.readyState!=1){
return;
}
var xdr=new XMLHttpRequest0();
xdr.onreadystatechange=function(){
if(xdr.readyState==4){
switch(xdr.status){
case 200:
setTimeout(function(){
doFlush(_70f);
},0);
break;
}
}
};
xdr.onload=function(){
openUpstream(_70f);
};
xdr.ontimeout=function(){
if(_70f.upstreamXHR!=null){
_70f.upstreamXHR.abort();
}
openUpstream(_70f);
};
xdr.onerror=function(){
if(_70f._downstream){
_70f._downstream.disconnect();
}
_70d(_70f);
};
var url=appendRandomNumberQueryString(_70f._upstream);
xdr.open("POST",url,true);
_70f.upstreamXHR=xdr;
};
function doSend(_712,buf){
_712.bufferedAmount+=buf.remaining();
_712._sendQueue.push(buf);
_714(_712);
if(!_712._writeSuspended){
doFlush(_712);
}
};
function appendRandomNumberQueryString(url){
var _716=".krn="+Math.random();
url+=((url.indexOf("?")==-1)?"?":"&")+_716;
return url;
};
function doFlush(_717){
var _718=_717._sendQueue;
var _719=_718.length;
_717._writeSuspended=(_719>0);
if(_719>0){
var _71a=_717.sequence++;
if(_717.useXDR){
if(_717.upstreamXHR==null){
openUpstream(_717);
}
var out=new ByteBuffer();
while(_718.length){
out.putBuffer(_718.shift());
}
out.putBytes(_6fb);
out.flip();
_717.upstreamXHR.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_717.upstreamXHR.setRequestHeader("X-Sequence-No",_71a.toString());
_717.upstreamXHR.send(_2ce(out,_717.requiresEscaping));
}else{
var xhr=new XMLHttpRequest0();
xhr.onreadystatechange=function(){
if(xhr.readyState==4){
switch(xhr.status){
case 200:
setTimeout(function(){
doFlush(_717);
},0);
break;
default:
_70d(_717);
break;
}
}
};
xhr.onerror=function(){
if(_717._downstream){
_717._downstream.disconnect();
}
_70d(_717);
};
var url=appendRandomNumberQueryString(_717._upstream);
xhr.open("POST",url,true);
var out=new ByteBuffer();
while(_718.length){
out.putBuffer(_718.shift());
}
out.putBytes(_6fb);
out.flip();
xhr.setRequestHeader("X-Sequence-No",_71a.toString());
if(browser=="firefox"){
if(xhr.sendAsBinary){
xhr.setRequestHeader("Content-Type","application/octet-stream");
xhr.sendAsBinary(_2ce(out));
}else{
xhr.send(_2ce(out));
}
}else{
xhr.setRequestHeader("Content-Type","text/plain; charset=utf-8");
xhr.send(_2ce(out,_717.requiresEscaping));
}
}
}
_717.bufferedAmount=0;
_714(_717);
};
var _6f3=function(_71e){
var url=new URI(_71e.URL);
url.scheme=url.scheme.replace("ws","http");
if(browser=="ie"&&typeof (XDomainRequest)!=="undefined"&&location.protocol.replace(":","")==url.scheme){
_71e.useXDR=true;
}
switch(browser){
case "opera":
_71e.requiresEscaping=true;
break;
case "ie":
if(!_71e.useXDR){
_71e.requiresEscaping=true;
}else{
if((typeof (Object.defineProperties)==="undefined")&&(navigator.userAgent.indexOf("MSIE 8")>0)){
_71e.requiresEscaping=true;
}else{
_71e.requiresEscaping=false;
}
}
break;
default:
_71e.requiresEscaping=false;
break;
}
var _720=_71e.requiresEscaping?"/;e/ctem":"/;e/ctm";
url.path=url.path.replace(/[\/]?$/,_720);
var _721=url.toString();
var _722=_721.indexOf("?");
if(_722==-1){
_721+="?";
}else{
_721+="&";
}
_721+=".kn="+String(Math.random()).substring(2);
var _723=new XMLHttpRequest0();
var _724=false;
_723.withCredentials=true;
_723.open("GET",_721,true);
_723.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_723.setRequestHeader("X-WebSocket-Version","wseb-1.0");
_723.setRequestHeader("X-Accept-Commands","ping");
var _725=_71e.sequence++;
_723.setRequestHeader("X-Sequence-No",_725.toString());
if(_71e.protocol.length){
var _726=_71e.protocol.join(",");
_723.setRequestHeader("X-WebSocket-Protocol",_726);
}
for(var i=0;i<_71e.parent.requestHeaders.length;i++){
var _728=_71e.parent.requestHeaders[i];
_723.setRequestHeader(_728.label,_728.value);
}
_723.onerror=function(){
doError(_71e);
};
_723.onredirectallowed=function(_729,_72a){
var _72b=_71e.parent.parent;
var _72c=_72b.getRedirectPolicy();
if((typeof (_72c)!="undefined")&&(_72c!=null)){
if(!_72c.isRedirectionAllowed(_729,_72a)){
_723.statusText=_72c.toString()+": Cannot redirect from "+_729+" to "+_72a;
_71e.closeCode=1006;
_71e.closeReason=_723.statusText;
_71e.parent.closeCode=_71e.closeCode;
_71e.parent.closeReason=_71e.closeReason;
_71e.parent.preventFallback=true;
doError(_71e);
return false;
}
}
return true;
};
_723.onreadystatechange=function(){
switch(_723.readyState){
case 2:
if(_723.status==403){
doError(_71e);
}else{
var _72d=_71e.parent.parent._webSocket.connectTimeout;
if(_72d==0){
_72d=5000;
}
timer=setTimeout(function(){
if(!_724){
doError(_71e);
}
},_72d);
}
break;
case 3:
break;
case 4:
_724=true;
if(_723.status==401){
_71e._listener.authenticationRequested(_71e.parent,_723.xhr._location,_723.getResponseHeader("WWW-Authenticate"));
return;
}
if(_71e.readyState<1){
if(_723.status==201){
_71e.parent.responseHeaders[_55a.HEADER_SEC_PROTOCOL]=_723.getResponseHeader(_55a.HEADER_SEC_PROTOCOL);
_71e.parent.responseHeaders[_55a.HEADER_SEC_EXTENSIONS]=_723.getResponseHeader(_55a.HEADER_SEC_EXTENSIONS);
var _72e=10*1000;
var _72f=_723.getResponseHeader(_55a.HEADER_SEC_EXTENSIONS);
if(_72f){
var _730=_72f.split(",");
for(var j=0;j<_730.length;j++){
var _732=_730[j].split(";");
var _733=_732[0].replace(/^\s+|\s+$/g,"");
if(_55a.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT===_733){
_72e=_732[1].match(/\d+/)[0];
break;
}
}
}
var _734=_723.responseText.split("\n");
var _735=_734[0];
var _736=_734[1];
var _737=new URI(_723.xhr._location);
var _738=new URI(_735);
var _739=new URI(_736);
if(_737.host.toLowerCase()!=_738.host.toLowerCase()){
throw new Error("Hostname in original URI does not match with the hostname in the upstream URI.");
}
if(_737.host.toLowerCase()!=_739.host.toLowerCase()){
throw new Error("Hostname in original URI does not match with the hostname in the downstream URI.");
}
_71e._upstream=_737.scheme+"://"+_737.authority+_738.path;
_71e._downstream=new _6a6(_736,_71e.sequence,_72e);
var _73a=_736.substring(0,_736.indexOf("/;e/"));
if(_73a!=_71e.parent._location.toString().replace("ws","http")){
_71e.parent._redirectUri=_73a;
}
_73b(_71e,_71e._downstream);
_73c(_71e);
}else{
doError(_71e);
}
}
break;
}
};
_723.send(null);
};
var _73c=function(_73d){
_73d.readyState=1;
var _73e=_73d.parent;
_73e._acceptedProtocol=_73e.responseHeaders["X-WebSocket-Protocol"]||"";
if(_73d.useXDR){
this.upstreamXHR=null;
openUpstream(_73d);
}
_73d._listener.connectionOpened(_73d.parent,_73e._acceptedProtocol);
};
function doError(_73f){
if(_73f.readyState<2){
_73f.readyState=2;
if(_73f.upstreamXHR!=null){
_73f.upstreamXHR.abort();
}
if(_73f.onerror!=null){
_73f._listener.connectionFailed(_73f.parent);
}
}
};
var _70d=function(_740,_741,code,_743){
switch(_740.readyState){
case 2:
break;
case 0:
case 1:
_740.readyState=WebSocket.CLOSED;
if(_740.upstreamXHR!=null){
_740.upstreamXHR.abort();
}
if(typeof _741==="undefined"){
_740._listener.connectionClosed(_740.parent,true,1005,"");
}else{
_740._listener.connectionClosed(_740.parent,_741,code,_743);
}
break;
default:
}
};
var _714=function(_744){
};
var _745=function(_746,_747){
if(_747.text){
_746._listener.textMessageReceived(_746.parent,_747.text);
}else{
if(_747.data){
_746._listener.binaryMessageReceived(_746.parent,_747.data);
}
}
};
var _748=function(_749){
var _74a=ByteBuffer.allocate(2);
_74a.put(_6fa);
_74a.put(0);
_74a.flip();
doSend(_749,_74a);
};
var _73b=function(_74b,_74c){
_74c.onmessage=function(_74d){
switch(_74d.type){
case "message":
if(_74b.readyState==1){
_745(_74b,_74d);
}
break;
}
};
_74c.onping=function(){
if(_74b.readyState==1){
_748(_74b);
}
};
_74c.onerror=function(){
try{
_74c.disconnect();
}
finally{
_70d(_74b,true,_74b.closeCode,_74b.closeReason);
}
};
_74c.onclose=function(_74e){
try{
_74c.disconnect();
}
finally{
_70d(_74b,true,this.closeCode,this.closeReason);
}
};
};
return _6ef;
})();
var _74f=(function(){
var _750=function(){
};
var _751=_750.prototype=new _531();
_751.processConnect=function(_752,uri,_754){
if(_752.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
var _755=!!window.MockWseTransport?new MockWseTransport():new _6ee();
_755.parent=_752;
_752._delegate=_755;
_756(_755,this);
_755.connect(uri.toString(),_754);
};
_751.processTextMessage=function(_757,text){
if(_757.readyState==WebSocket.OPEN){
_757._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_751.processBinaryMessage=function(_759,obj){
if(_759.readyState==WebSocket.OPEN){
_759._delegate.send(obj);
}else{
throw new Error("WebSocket is already closed");
}
};
_751.processClose=function(_75b,code,_75d){
try{
_75b._delegate.close(code,_75d);
}
catch(e){
listener.connectionClosed(_75b);
}
};
var _756=function(_75e,_75f){
var _760=new _544(_75f);
_75e.setListener(_760);
};
return _750;
})();
var _761=(function(){
var _762=function(){
};
var _763=_762.prototype=new _531();
_763.handleClearAuthenticationData=function(_764){
if(_764._challengeResponse!=null){
_764._challengeResponse.clearCredentials();
}
};
_763.handleRemoveAuthenticationData=function(_765){
this.handleClearAuthenticationData(_765);
_765._challengeResponse=new ChallengeResponse(null,null);
};
_763.handle401=function(_766,_767,_768){
var _769=this;
var _76a=null;
if(typeof (_766.parent.connectTimer)!="undefined"){
_76a=_766.parent.connectTimer;
if(_76a!=null){
_76a.pause();
}
}
if(_55a.KAAZING_SEC_EXTENSION_REVALIDATE==_768){
var _76b=new _5b1(_766);
_766.challengeHandler=_766.parent.challengeHandler;
_76b.connect(_767);
}else{
var _76c=_767;
if(_76c.indexOf("/;e/")>0){
_76c=_76c.substring(0,_76c.indexOf("/;e/"));
}
var _76d=new _503(_76c.replace("http","ws"));
var _76e=new ChallengeRequest(_76c,_768);
var _76f;
if(_766._challengeResponse.nextChallengeHandler!=null){
_76f=_766._challengeResponse.nextChallengeHandler;
}else{
_76f=_766.parent.challengeHandler;
}
if(_76f!=null&&_76f.canHandle(_76e)){
_76f.handle(_76e,function(_770){
try{
if(_770==null||_770.credentials==null){
_769.handleClearAuthenticationData(_766);
_769._listener.connectionFailed(_766);
}else{
if(_76a!=null){
_76a.resume();
}
_766._challengeResponse=_770;
_769.processConnect(_766,_76d,_766._protocol);
}
}
catch(e){
_769.handleClearAuthenticationData(_766);
_769._listener.connectionFailed(_766);
}
});
}else{
this.handleClearAuthenticationData(_766);
this._listener.connectionFailed(_766);
}
}
};
_763.processConnect=function(_771,_772,_773){
if(_771._challengeResponse!=null&&_771._challengeResponse.credentials!=null){
var _774=_771._challengeResponse.credentials.toString();
for(var i=_771.requestHeaders.length-1;i>=0;i--){
if(_771.requestHeaders[i].label==="Authorization"){
_771.requestHeaders.splice(i,1);
}
}
var _776=new _4f5("Authorization",_774);
for(var i=_771.requestHeaders.length-1;i>=0;i--){
if(_771.requestHeaders[i].label==="Authorization"){
_771.requestHeaders.splice(i,1);
}
}
_771.requestHeaders.push(_776);
this.handleClearAuthenticationData(_771);
}
this._nextHandler.processConnect(_771,_772,_773);
};
_763.handleAuthenticate=function(_777,_778,_779){
_777.authenticationReceived=true;
this.handle401(_777,_778,_779);
};
_763.setNextHandler=function(_77a){
this._nextHandler=_77a;
var _77b=new _544(this);
var _77c=this;
_77b.authenticationRequested=function(_77d,_77e,_77f){
_77c.handleAuthenticate(_77d,_77e,_77f);
};
_77a.setListener(_77b);
};
_763.setListener=function(_780){
this._listener=_780;
};
return _762;
})();
var _781=(function(){
var _782=new _761();
var _783=new _574();
var _784=new _74f();
var _785=function(){
this.setNextHandler(_782);
_782.setNextHandler(_783);
_783.setNextHandler(_784);
};
var _786=_785.prototype=new _531();
_786.processConnect=function(_787,_788,_789){
var _78a=[];
for(var i=0;i<_789.length;i++){
_78a.push(_789[i]);
}
var _78c=[];
_78c.push(_787._extensions);
_78c.push(_55a.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT);
_787.requestHeaders.push(new _4f5(_55a.HEADER_SEC_EXTENSIONS,_78c.join(",")));
this._nextHandler.processConnect(_787,_788,_78a);
};
_786.setNextHandler=function(_78d){
this._nextHandler=_78d;
var _78e=this;
var _78f=new _544(this);
_78f.commandMessageReceived=function(_790,_791){
if(_791=="CloseCommandMessage"&&_790.readyState==1){
}
_78e._listener.commandMessageReceived(_790,_791);
};
_78d.setListener(_78f);
};
_786.setListener=function(_792){
this._listener=_792;
};
return _785;
})();
var _793=(function(){
var _794=function(){
};
var _795=_794.prototype=new _531();
_795.processConnect=function(_796,uri,_798){
if(_796.readyState==2){
throw new Error("WebSocket is already closed");
}
var _799=new _310();
_799.parent=_796;
_796._delegate=_799;
_79a(_799,this);
_799.connect(uri.toString(),_798);
};
_795.processTextMessage=function(_79b,text){
if(_79b.readyState==1){
_79b._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_795.processBinaryMessage=function(_79d,_79e){
if(_79d.readyState==1){
_79d._delegate.send(_79e);
}else{
throw new Error("WebSocket is already closed");
}
};
_795.processClose=function(_79f,code,_7a1){
_79f._delegate.close(code,_7a1);
};
var _79a=function(_7a2,_7a3){
var _7a4=new _544(_7a3);
_7a2.setListener(_7a4);
_7a4.redirected=function(_7a5,_7a6){
_7a5._redirectUri=_7a6;
};
};
return _794;
})();
var _7a7=(function(){
var _7a8=function(){
var _7a9=new _761();
return _7a9;
};
var _7aa=function(){
var _7ab=new _574();
return _7ab;
};
var _7ac=function(){
var _7ad=new _793();
return _7ad;
};
var _7ae=_7a8();
var _7af=_7aa();
var _7b0=_7ac();
var _7b1=function(){
this.setNextHandler(_7ae);
_7ae.setNextHandler(_7af);
_7af.setNextHandler(_7b0);
};
var _7b2=_7b1.prototype=new _531();
_7b2.processConnect=function(_7b3,_7b4,_7b5){
var _7b6=[_55a.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_7b5.length;i++){
_7b6.push(_7b5[i]);
}
var _7b8=_7b3._extensions;
if(_7b8.length>0){
_7b3.requestHeaders.push(new _4f5(_55a.HEADER_SEC_EXTENSIONS,_7b8.join(";")));
}
this._nextHandler.processConnect(_7b3,_7b4,_7b6);
};
_7b2.setNextHandler=function(_7b9){
this._nextHandler=_7b9;
var _7ba=new _544(this);
_7b9.setListener(_7ba);
};
_7b2.setListener=function(_7bb){
this._listener=_7bb;
};
return _7b1;
})();
var _7bc=(function(){
var _7bd;
var _7be=function(){
_7bd=this;
};
var _7bf=_7be.prototype=new _531();
_7bf.processConnect=function(_7c0,uri,_7c2){
if(_7c0.readyState==2){
throw new Error("WebSocket is already closed");
}
var _7c3=new _340();
_7c3.parent=_7c0;
_7c0._delegate=_7c3;
_7c4(_7c3,this);
_7c3.connect(uri.toString(),_7c2);
};
_7bf.processTextMessage=function(_7c5,text){
if(_7c5.readyState==1){
_7c5._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_7bf.processBinaryMessage=function(_7c7,_7c8){
if(_7c7.readyState==1){
_7c7._delegate.send(_7c8);
}else{
throw new Error("WebSocket is already closed");
}
};
_7bf.processClose=function(_7c9,code,_7cb){
_7c9._delegate.close(code,_7cb);
};
var _7c4=function(_7cc,_7cd){
var _7ce=new _544(_7cd);
_7ce.redirected=function(_7cf,_7d0){
_7cf._redirectUri=_7d0;
};
_7cc.setListener(_7ce);
};
return _7be;
})();
var _7d1=(function(){
var _7d2=function(){
var _7d3=new _761();
return _7d3;
};
var _7d4=function(){
var _7d5=new _574();
return _7d5;
};
var _7d6=function(){
var _7d7=new _7bc();
return _7d7;
};
var _7d8=_7d2();
var _7d9=_7d4();
var _7da=_7d6();
var _7db=function(){
this.setNextHandler(_7d8);
_7d8.setNextHandler(_7d9);
_7d9.setNextHandler(_7da);
};
var _7dc=function(_7dd,_7de){
};
var _7df=_7db.prototype=new _531();
_7df.setNextHandler=function(_7e0){
this._nextHandler=_7e0;
var _7e1=new _544(this);
_7e0.setListener(_7e1);
};
_7df.setListener=function(_7e2){
this._listener=_7e2;
};
return _7db;
})();
var _7e3=(function(){
var _7e4=function(){
};
var _7e5=_7e4.prototype=new _531();
_7e5.processConnect=function(_7e6,uri,_7e8){
if(_7e6.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
this._nextHandler.processConnect(_7e6,uri,_7e8);
};
_7e5.handleConnectionOpened=function(_7e9,_7ea){
var _7eb=_7e9;
if(_7eb.readyState==WebSocket.CONNECTING){
_7eb.readyState=WebSocket.OPEN;
this._listener.connectionOpened(_7e9,_7ea);
}
};
_7e5.handleMessageReceived=function(_7ec,_7ed){
if(_7ec.readyState!=WebSocket.OPEN){
return;
}
this._listener.textMessageReceived(_7ec,_7ed);
};
_7e5.handleBinaryMessageReceived=function(_7ee,_7ef){
if(_7ee.readyState!=WebSocket.OPEN){
return;
}
this._listener.binaryMessageReceived(_7ee,_7ef);
};
_7e5.handleConnectionClosed=function(_7f0,_7f1,code,_7f3){
var _7f4=_7f0;
if(_7f4.readyState!=WebSocket.CLOSED){
_7f4.readyState=WebSocket.CLOSED;
this._listener.connectionClosed(_7f0,_7f1,code,_7f3);
}
};
_7e5.handleConnectionFailed=function(_7f5){
if(_7f5.readyState!=WebSocket.CLOSED){
_7f5.readyState=WebSocket.CLOSED;
this._listener.connectionFailed(_7f5);
}
};
_7e5.handleConnectionError=function(_7f6,e){
this._listener.connectionError(_7f6,e);
};
_7e5.setNextHandler=function(_7f8){
this._nextHandler=_7f8;
var _7f9={};
var _7fa=this;
_7f9.connectionOpened=function(_7fb,_7fc){
_7fa.handleConnectionOpened(_7fb,_7fc);
};
_7f9.redirected=function(_7fd,_7fe){
throw new Error("invalid event received");
};
_7f9.authenticationRequested=function(_7ff,_800,_801){
throw new Error("invalid event received");
};
_7f9.textMessageReceived=function(_802,buf){
_7fa.handleMessageReceived(_802,buf);
};
_7f9.binaryMessageReceived=function(_804,buf){
_7fa.handleBinaryMessageReceived(_804,buf);
};
_7f9.connectionClosed=function(_806,_807,code,_809){
_7fa.handleConnectionClosed(_806,_807,code,_809);
};
_7f9.connectionFailed=function(_80a){
_7fa.handleConnectionFailed(_80a);
};
_7f9.connectionError=function(_80b,e){
_7fa.handleConnectionError(_80b,e);
};
_7f8.setListener(_7f9);
};
_7e5.setListener=function(_80d){
this._listener=_80d;
};
return _7e4;
})();
var _80e=(function(){
var _80f=function(_810,_811,_812){
this._nativeEquivalent=_810;
this._handler=_811;
this._channelFactory=_812;
};
return _80f;
})();
var _813=(function(){
var _814="javascript:ws";
var _815="javascript:wss";
var _816="javascript:wse";
var _817="javascript:wse+ssl";
var _818="flash:wse";
var _819="flash:wse+ssl";
var _81a="flash:wsr";
var _81b="flash:wsr+ssl";
var _81c={};
var _81d={};
var _81e=new _569();
var _81f=new _562();
var _820=true;
var _821={};
if(Object.defineProperty){
try{
Object.defineProperty(_821,"prop",{get:function(){
return true;
}});
_820=false;
}
catch(e){
}
}
var _822=function(){
this._handlerListener=createListener(this);
this._nativeHandler=createNativeHandler(this);
this._emulatedHandler=createEmulatedHandler(this);
this._emulatedFlashHandler=createFlashEmulatedHandler(this);
this._rtmpFlashHandler=createFlashRtmpHandler(this);
pickStrategies();
_81c[_814]=new _80e("ws",this._nativeHandler,_81e);
_81c[_815]=new _80e("wss",this._nativeHandler,_81e);
_81c[_816]=new _80e("ws",this._emulatedHandler,_81f);
_81c[_817]=new _80e("wss",this._emulatedHandler,_81f);
_81c[_818]=new _80e("ws",this._emulatedFlashHandler,_81f);
_81c[_819]=new _80e("wss",this._emulatedFlashHandler,_81f);
_81c[_81a]=new _80e("ws",this._rtmpFlashHandler,_81f);
_81c[_81b]=new _80e("wss",this._rtmpFlashHandler,_81f);
};
function isIE6orIE7(){
if(browser!="ie"){
return false;
}
var _823=navigator.appVersion;
return (_823.indexOf("MSIE 6.0")>=0||_823.indexOf("MSIE 7.0")>=0);
};
function isXdrDisabledonIE8IE9(){
if(browser!="ie"){
return false;
}
var _824=navigator.appVersion;
return ((_824.indexOf("MSIE 8.0")>=0||_824.indexOf("MSIE 9.0")>=0)&&typeof (XDomainRequest)==="undefined");
};
function pickStrategies(){
if(isIE6orIE7()||isXdrDisabledonIE8IE9()){
_81d["ws"]=new Array(_814,_818,_816);
_81d["wss"]=new Array(_815,_819,_817);
}else{
_81d["ws"]=new Array(_814,_816);
_81d["wss"]=new Array(_815,_817);
}
};
function createListener(_825){
var _826={};
_826.connectionOpened=function(_827,_828){
_825.handleConnectionOpened(_827,_828);
};
_826.binaryMessageReceived=function(_829,buf){
_825.handleMessageReceived(_829,buf);
};
_826.textMessageReceived=function(_82b,text){
var _82d=_82b.parent;
_82d._webSocketChannelListener.handleMessage(_82d._webSocket,text);
};
_826.connectionClosed=function(_82e,_82f,code,_831){
_825.handleConnectionClosed(_82e,_82f,code,_831);
};
_826.connectionFailed=function(_832){
_825.handleConnectionFailed(_832);
};
_826.connectionError=function(_833,e){
_825.handleConnectionError(_833,e);
};
_826.authenticationRequested=function(_835,_836,_837){
};
_826.redirected=function(_838,_839){
};
_826.onBufferedAmountChange=function(_83a,n){
_825.handleBufferedAmountChange(_83a,n);
};
return _826;
};
function createNativeHandler(_83c){
var _83d=new _7e3();
var _83e=new _68a();
_83d.setListener(_83c._handlerListener);
_83d.setNextHandler(_83e);
return _83d;
};
function createEmulatedHandler(_83f){
var _840=new _7e3();
var _841=new _781();
_840.setListener(_83f._handlerListener);
_840.setNextHandler(_841);
return _840;
};
function createFlashEmulatedHandler(_842){
var _843=new _7e3();
var _844=new _7a7();
_843.setListener(_842._handlerListener);
_843.setNextHandler(_844);
return _843;
};
function createFlashRtmpHandler(_845){
var _846=new _7e3();
var _847=new _7d1();
_846.setListener(_845._handlerListener);
_846.setNextHandler(_847);
return _846;
};
var _848=function(_849,_84a){
var _84b=_81c[_84a];
var _84c=_84b._channelFactory;
var _84d=_849._location;
var _84e=_84c.createChannel(_84d,_849._protocol);
_849._selectedChannel=_84e;
_84e.parent=_849;
_84e._extensions=_849._extensions;
_84e._handler=_84b._handler;
_84e._handler.processConnect(_849._selectedChannel,_84d,_849._protocol);
};
var _84f=_822.prototype;
_84f.fallbackNext=function(_850){
var _851=_850.getNextStrategy();
if(_851==null){
this.doClose(_850,false,1006,"");
}else{
_848(_850,_851);
}
};
_84f.doOpen=function(_852,_853){
if(_852._lastErrorEvent!==undefined){
delete _852._lastErrorEvent;
}
if(_852.readyState===WebSocket.CONNECTING){
_852.readyState=WebSocket.OPEN;
if(_820){
_852._webSocket.readyState=WebSocket.OPEN;
}
_852._webSocketChannelListener.handleOpen(_852._webSocket,_853);
}
};
_84f.doClose=function(_854,_855,code,_857){
if(_854._lastErrorEvent!==undefined){
_854._webSocketChannelListener.handleError(_854._webSocket,_854._lastErrorEvent);
delete _854._lastErrorEvent;
}
if(_854.readyState===WebSocket.CONNECTING||_854.readyState===WebSocket.OPEN||_854.readyState===WebSocket.CLOSING){
_854.readyState=WebSocket.CLOSED;
if(_820){
_854._webSocket.readyState=WebSocket.CLOSED;
}
_854._webSocketChannelListener.handleClose(_854._webSocket,_855,code,_857);
}
};
_84f.doBufferedAmountChange=function(_858,n){
_858._webSocketChannelListener.handleBufferdAmountChange(_858._webSocket,n);
};
_84f.processConnect=function(_85a,_85b,_85c){
var _85d=_85a;
if(_85d.readyState===WebSocket.OPEN){
throw new Error("Attempt to reconnect an existing open WebSocket to a different location");
}
var _85e=_85d._compositeScheme;
if(_85e!="ws"&&_85e!="wss"){
var _85f=_81c[_85e];
if(_85f==null){
throw new Error("Invalid connection scheme: "+_85e);
}
_85d._connectionStrategies.push(_85e);
}else{
var _860=_81d[_85e];
if(_860!=null){
for(var i=0;i<_860.length;i++){
_85d._connectionStrategies.push(_860[i]);
}
}else{
throw new Error("Invalid connection scheme: "+_85e);
}
}
this.fallbackNext(_85d);
};
_84f.processTextMessage=function(_862,_863){
var _864=_862;
if(_864.readyState!=WebSocket.OPEN){
throw new Error("Attempt to post message on unopened or closed web socket");
}
var _865=_864._selectedChannel;
_865._handler.processTextMessage(_865,_863);
};
_84f.processBinaryMessage=function(_866,_867){
var _868=_866;
if(_868.readyState!=WebSocket.OPEN){
throw new Error("Attempt to post message on unopened or closed web socket");
}
var _869=_868._selectedChannel;
_869._handler.processBinaryMessage(_869,_867);
};
_84f.processClose=function(_86a,code,_86c){
var _86d=_86a;
if(_86a.readyState===WebSocket.CONNECTING||_86a.readyState===WebSocket.OPEN){
_86a.readyState=WebSocket.CLOSING;
if(_820){
_86a._webSocket.readyState=WebSocket.CLOSING;
}
}
var _86e=_86d._selectedChannel;
_86e._handler.processClose(_86e,code,_86c);
};
_84f.setListener=function(_86f){
this._listener=_86f;
};
_84f.handleConnectionOpened=function(_870,_871){
var _872=_870.parent;
this.doOpen(_872,_871);
};
_84f.handleMessageReceived=function(_873,obj){
var _875=_873.parent;
switch(_875.readyState){
case WebSocket.OPEN:
if(_875._webSocket.binaryType==="blob"&&obj.constructor==ByteBuffer){
obj=obj.getBlob(obj.remaining());
}else{
if(_875._webSocket.binaryType==="arraybuffer"&&obj.constructor==ByteBuffer){
obj=obj.getArrayBuffer(obj.remaining());
}else{
if(_875._webSocket.binaryType==="blob"&&obj.byteLength){
obj=new Blob([new Uint8Array(obj)]);
}else{
if(_875._webSocket.binaryType==="bytebuffer"&&obj.byteLength){
var u=new Uint8Array(obj);
var _877=[];
for(var i=0;i<u.byteLength;i++){
_877.push(u[i]);
}
obj=new ByteBuffer(_877);
}else{
if(_875._webSocket.binaryType==="bytebuffer"&&obj.size){
var cb=function(_87a){
var b=new ByteBuffer();
b.putBytes(_87a);
b.flip();
_875._webSocketChannelListener.handleMessage(_875._webSocket,b);
};
BlobUtils.asNumberArray(cb,data);
return;
}
}
}
}
}
_875._webSocketChannelListener.handleMessage(_875._webSocket,obj);
break;
case WebSocket.CONNECTING:
case WebSocket.CLOSING:
case WebSocket.CLOSED:
break;
default:
throw new Error("Socket has invalid readyState: "+$this.readyState);
}
};
_84f.handleConnectionClosed=function(_87c,_87d,code,_87f){
var _880=_87c.parent;
if(_880.readyState===WebSocket.CONNECTING&&!_87c.authenticationReceived&&!_87c.preventFallback){
this.fallbackNext(_880);
}else{
this.doClose(_880,_87d,code,_87f);
}
};
_84f.handleConnectionFailed=function(_881){
var _882=_881.parent;
var _883=1006;
var _884="";
if(_881.closeReason.length>0){
_883=_881.closeCode;
_884=_881.closeReason;
}
if(_882.readyState===WebSocket.CONNECTING&&!_881.authenticationReceived&&!_881.preventFallback){
this.fallbackNext(_882);
}else{
this.doClose(_882,false,_883,_884);
}
};
_84f.handleConnectionError=function(_885,e){
_885.parent._lastErrorEvent=e;
};
return _822;
})();
(function(){
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
var _889=HttpRedirectPolicy.prototype;
_889.toString=function(){
return "HttpRedirectPolicy."+this.name;
};
_889.isRedirectionAllowed=function(_88a,_88b){
if(arguments.length<2){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Please specify both the 'originalLoc' and the 'redirectLoc' parameters.";
throw Error(s);
}
if(typeof (_88a)=="undefined"){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Please specify required 'originalLoc' parameter.";
throw Error(s);
}else{
if(typeof (_88a)!="string"){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Required parameter 'originalLoc' is a string.";
throw Error(s);
}
}
if(typeof (_88b)=="undefined"){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Please specify required 'redirectLoc' parameter.";
throw Error(s);
}else{
if(typeof (_88b)!="string"){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Required parameter 'redirectLoc' is a string.";
throw Error(s);
}
}
var _88d=false;
var _88e=new URI(_88a.toLowerCase().replace("http","ws"));
var _88f=new URI(_88b.toLowerCase().replace("http","ws"));
switch(this.name){
case "ALWAYS":
_88d=true;
break;
case "NEVER":
_88d=false;
break;
case "PEER_DOMAIN":
_88d=isPeerDomain(_88e,_88f);
break;
case "SAME_DOMAIN":
_88d=isSameDomain(_88e,_88f);
break;
case "SAME_ORIGIN":
_88d=isSameOrigin(_88e,_88f);
break;
case "SUB_DOMAIN":
_88d=isSubDomain(_88e,_88f);
break;
default:
var s="HttpRedirectPolicy.isRedirectionAllowed(): Invalid policy: "+this.name;
throw new Error(s);
}
return _88d;
};
function isPeerDomain(_890,_891){
if(isSameDomain(_890,_891)){
return true;
}
var _892=_890.scheme.toLowerCase();
var _893=_891.scheme.toLowerCase();
if(_893.indexOf(_892)==-1){
return false;
}
var _894=_890.host;
var _895=_891.host;
var _896=getBaseDomain(_894);
var _897=getBaseDomain(_895);
if(_895.indexOf(_896,(_895.length-_896.length))==-1){
return false;
}
if(_894.indexOf(_897,(_894.length-_897.length))==-1){
return false;
}
return true;
};
function isSameDomain(_898,_899){
if(isSameOrigin(_898,_899)){
return true;
}
var _89a=_898.scheme.toLowerCase();
var _89b=_899.scheme.toLowerCase();
if(_89b.indexOf(_89a)==-1){
return false;
}
var _89c=_898.host.toLowerCase();
var _89d=_899.host.toLowerCase();
if(_89c==_89d){
return true;
}
return false;
};
function isSameOrigin(_89e,_89f){
var _8a0=_89e.scheme.toLowerCase();
var _8a1=_89f.scheme.toLowerCase();
var _8a2=_89e.authority.toLowerCase();
var _8a3=_89f.authority.toLowerCase();
if((_8a0==_8a1)&&(_8a2==_8a3)){
return true;
}
return false;
};
function isSubDomain(_8a4,_8a5){
if(isSameDomain(_8a4,_8a5)){
return true;
}
var _8a6=_8a4.scheme.toLowerCase();
var _8a7=_8a5.scheme.toLowerCase();
if(_8a7.indexOf(_8a6)==-1){
return false;
}
var _8a8=_8a4.host.toLowerCase();
var _8a9=_8a5.host.toLowerCase();
if(_8a9.length<_8a8.length){
return false;
}
var s="."+_8a8;
if(_8a9.indexOf(s,(_8a9.length-s.length))==-1){
return false;
}
return true;
};
function getBaseDomain(host){
var _8ac=host.split(".");
var len=_8ac.length;
if(len<=2){
return host;
}
var _8ae="";
for(var i=1;i<len;i++){
_8ae+="."+_8ac[i];
}
return _8ae;
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
var _8b0=new _813();
window.WebSocket=(function(){
var _8b1={};
var _8b2=function(url,_8b4,_8b5,_8b6,_8b7,_8b8){
this.url=url;
this.protocol=_8b4;
this.extensions=_8b5||[];
this.connectTimeout=0;
this._challengeHandler=_8b6;
this._redirectPolicy=HttpRedirectPolicy.ALWAYS;
if(typeof (_8b7)!="undefined"){
_8b9(_8b7);
this.connectTimeout=_8b7;
}
if(typeof (_8b8)!="undefined"){
_8ba(_8b8);
this._redirectPolicy=_8b8;
}
this._queue=[];
this._origin="";
this._eventListeners={};
setProperties(this);
_8bb(this,this.url,this.protocol,this.extensions,this._challengeHandler,this.connectTimeout);
};
var _8bc=function(s){
if(s.length==0){
return false;
}
var _8be="()<>@,;:\\<>/[]?={}\t \n";
for(var i=0;i<s.length;i++){
var c=s.substr(i,1);
if(_8be.indexOf(c)!=-1){
return false;
}
var code=s.charCodeAt(i);
if(code<33||code>126){
return false;
}
}
return true;
};
var _8c2=function(_8c3){
if(typeof (_8c3)==="undefined"){
return true;
}else{
if(typeof (_8c3)==="string"){
return _8bc(_8c3);
}else{
for(var i=0;i<_8c3.length;i++){
if(!_8bc(_8c3[i])){
return false;
}
}
return true;
}
}
};
var _8bb=function(_8c5,_8c6,_8c7,_8c8,_8c9,_8ca){
if(!_8c2(_8c7)){
throw new Error("SyntaxError: invalid protocol: "+_8c7);
}
var uri=new _512(_8c6);
if(!uri.isSecure()&&document.location.protocol==="https:"){
throw new Error("SecurityException: non-secure connection attempted from secure origin");
}
var _8cc=[];
if(typeof (_8c7)!="undefined"){
if(typeof _8c7=="string"&&_8c7.length){
_8cc=[_8c7];
}else{
if(_8c7.length){
_8cc=_8c7;
}
}
}
_8c5._channel=new _56f(uri,_8cc);
_8c5._channel._webSocket=_8c5;
_8c5._channel._webSocketChannelListener=_8b1;
_8c5._channel._extensions=_8c8;
if(typeof (_8c9)!="undefined"){
_8c5._channel.challengeHandler=_8c9;
}
if((typeof (_8ca)!="undefined")&&(_8ca>0)){
var _8cd=_8c5._channel;
var _8ce=new _51e(function(){
if(_8cd.readyState==_8b2.CONNECTING){
_8b0.doClose(_8cd,false,1006,"Connection timeout");
_8b0.processClose(_8cd,0,"Connection timeout");
_8cd.connectTimer=null;
}
},_8ca,false);
_8c5._channel.connectTimer=_8ce;
_8ce.start();
}
_8b0.processConnect(_8c5._channel,uri.getWSEquivalent());
};
function setProperties(_8cf){
_8cf.onmessage=null;
_8cf.onopen=null;
_8cf.onclose=null;
_8cf.onerror=null;
if(Object.defineProperty){
try{
Object.defineProperty(_8cf,"readyState",{get:function(){
if(_8cf._channel){
return _8cf._channel.readyState;
}else{
return _8b2.CLOSED;
}
},set:function(){
throw new Error("Cannot set read only property readyState");
}});
var _8d0="blob";
Object.defineProperty(_8cf,"binaryType",{enumerable:true,configurable:true,get:function(){
return _8d0;
},set:function(val){
if(val==="blob"||val==="arraybuffer"||val==="bytebuffer"){
_8d0=val;
}else{
throw new SyntaxError("Invalid binaryType. Valid values are 'blob', 'arraybuffer' and 'bytebuffer'");
}
}});
Object.defineProperty(_8cf,"bufferedAmount",{get:function(){
return _8cf._channel.getBufferedAmount();
},set:function(){
throw new Error("Cannot set read only property bufferedAmount");
}});
}
catch(ex){
_8cf.readyState=_8b2.CONNECTING;
_8cf.binaryType="blob";
_8cf.bufferedAmount=0;
}
}else{
_8cf.readyState=_8b2.CONNECTING;
_8cf.binaryType="blob";
_8cf.bufferedAmount=0;
}
};
var _8d2=_8b2.prototype;
_8d2.send=function(data){
switch(this.readyState){
case 0:
throw new Error("Attempt to send message on unopened or closed WebSocket");
case 1:
if(typeof (data)==="string"){
_8b0.processTextMessage(this._channel,data);
}else{
_8b0.processBinaryMessage(this._channel,data);
}
break;
case 2:
case 3:
break;
default:
throw new Error("Illegal state error");
}
};
_8d2.close=function(code,_8d5){
if(typeof code!="undefined"){
if(code!=1000&&(code<3000||code>4999)){
var _8d6=new Error("code must equal to 1000 or in range 3000 to 4999");
_8d6.name="InvalidAccessError";
throw _8d6;
}
}
if(typeof _8d5!="undefined"&&_8d5.length>0){
var buf=new ByteBuffer();
buf.putString(_8d5,Charset.UTF8);
buf.flip();
if(buf.remaining()>123){
throw new SyntaxError("SyntaxError: reason is longer than 123 bytes");
}
}
switch(this.readyState){
case 0:
case 1:
_8b0.processClose(this._channel,code,_8d5);
break;
case 2:
case 3:
break;
default:
throw new Error("Illegal state error");
}
};
_8d2.getChallengeHandler=function(){
return this._challengeHandler||null;
};
_8d2.setChallengeHandler=function(_8d8){
if(typeof (_8d8)=="undefined"){
var s="WebSocket.setChallengeHandler(): Parameter 'challengeHandler' is required";
throw new Error(s);
}
this._challengeHandler=_8d8;
this._channel.challengeHandler=_8d8;
};
_8d2.getRedirectPolicy=function(){
return this._redirectPolicy;
};
_8d2.setRedirectPolicy=function(_8da){
_8ba(_8da);
this._redirectPolicy=_8da;
};
var _8b9=function(_8db){
if(typeof (_8db)=="undefined"){
var s="WebSocket.setConnectTimeout(): int parameter 'connectTimeout' is required";
throw new Error(s);
}
if(typeof (_8db)!="number"){
var s="WebSocket.setConnectTimeout(): connectTimeout should be an integer";
throw new Error(s);
}
if(_8db<0){
var s="WebSocket.setConnectTimeout(): Connect timeout cannot be negative";
throw new Error(s);
}
return;
};
var _8ba=function(_8dd){
if(typeof (_8dd)=="undefined"){
var s="WebSocket.validateHttpRedirectPolicy(): Parameter 'redirectPolicy' is required";
throw new Error(s);
}
if(!(_8dd instanceof HttpRedirectPolicy)){
var s="WebSocket.validateHttpRedirectPolicy(): Parameter 'redirectPolicy' must be of type HttpRedirectPolicy";
throw new Error(s);
}
};
var _8df=function(_8e0,data){
var _8e2=new MessageEvent(_8e0,data,_8e0._origin);
_8e0.dispatchEvent(_8e2);
};
var _8e3=function(_8e4){
var _8e5=new Date().getTime();
var _8e6=_8e5+50;
while(_8e4._queue.length>0){
if(new Date().getTime()>_8e6){
setTimeout(function(){
_8e3(_8e4);
},0);
return;
}
var buf=_8e4._queue.shift();
var ok=false;
try{
if(_8e4.readyState==_8b2.OPEN){
_8df(_8e4,buf);
ok=true;
}else{
_8e4._queue=[];
return;
}
}
finally{
if(!ok){
if(_8e4._queue.length==0){
_8e4._delivering=false;
}else{
setTimeout(function(){
_8e3(_8e4);
},0);
}
}
}
}
_8e4._delivering=false;
};
var _8e9=function(_8ea,_8eb,code,_8ed){
delete _8ea._channel;
setTimeout(function(){
var _8ee=new CloseEvent(_8ea,_8eb,code,_8ed);
_8ea.dispatchEvent(_8ee);
},0);
};
_8b1.handleOpen=function(_8ef,_8f0){
_8ef.protocol=_8f0;
var _8f1={type:"open",bubbles:true,cancelable:true,target:_8ef};
_8ef.dispatchEvent(_8f1);
};
_8b1.handleMessage=function(_8f2,obj){
if(!Object.defineProperty&&!(typeof (obj)==="string")){
var _8f4=_8f2.binaryType;
if(!(_8f4==="blob"||_8f4==="arraybuffer"||_8f4==="bytebuffer")){
var _8f5={type:"error",bubbles:true,cancelable:true,target:_8f2,message:"Invalid binaryType. Valid values are 'blob', 'arraybuffer' and 'bytebuffer'"};
_8f2.dispatchEvent(_8f5);
return;
}
}
_8f2._queue.push(obj);
if(!_8f2._delivering){
_8f2._delivering=true;
_8e3(_8f2);
}
};
_8b1.handleClose=function(_8f6,_8f7,code,_8f9){
_8e9(_8f6,_8f7,code,_8f9);
};
_8b1.handleError=function(_8fa,_8fb){
setTimeout(function(){
_8fa.dispatchEvent(_8fb);
},0);
};
_8b1.handleBufferdAmountChange=function(_8fc,n){
_8fc.bufferedAmount=n;
};
_8d2.addEventListener=function(type,_8ff,_900){
this._eventListeners[type]=this._eventListeners[type]||[];
this._eventListeners[type].push(_8ff);
};
_8d2.removeEventListener=function(type,_902,_903){
var _904=this._eventListeners[type];
if(_904){
for(var i=0;i<_904.length;i++){
if(_904[i]==_902){
_904.splice(i,1);
return;
}
}
}
};
_8d2.dispatchEvent=function(e){
var type=e.type;
if(!type){
throw new Error("Cannot dispatch invalid event "+e);
}
try{
var _908=this["on"+type];
if(typeof _908==="function"){
_908(e);
}
}
catch(e){
}
var _909=this._eventListeners[type];
if(_909){
for(var i=0;i<_909.length;i++){
try{
_909[i](e);
}
catch(e2){
}
}
}
};
_8b2.CONNECTING=_8d2.CONNECTING=0;
_8b2.OPEN=_8d2.OPEN=1;
_8b2.CLOSING=_8d2.CLOSING=2;
_8b2.CLOSED=_8d2.CLOSED=3;
return _8b2;
})();
window.WebSocket.__impls__={};
window.WebSocket.__impls__["flash:wse"]=_310;
}());
(function(){
window.WebSocketExtension=(function(){
var _90b=function(name){
this.name=name;
this.parameters={};
this.enabled=false;
this.negotiated=false;
};
var _90d=_90b.prototype;
_90d.getParameter=function(_90e){
return this.parameters[_90e];
};
_90d.setParameter=function(_90f,_910){
this.parameters[_90f]=_910;
};
_90d.getParameters=function(){
var arr=[];
for(var name in this.parameters){
if(this.parameters.hasOwnProperty(name)){
arr.push(name);
}
}
return arr;
};
_90d.parse=function(str){
var arr=str.split(";");
if(arr[0]!=this.name){
throw new Error("Error: name not match");
}
this.parameters={};
for(var i=1;i<arr.length;i++){
var _916=arr[i].indexOf("=");
this.parameters[arr[i].subString(0,_916)]=arr[i].substring(_916+1);
}
};
_90d.toString=function(){
var arr=[this.name];
for(var p in this.parameters){
if(this.parameters.hasOwnProperty(p)){
arr.push(p.name+"="+this.parameters[p]);
}
}
return arr.join(";");
};
return _90b;
})();
})();
(function(){
window.WebSocketRevalidateExtension=(function(){
var _919=function(){
};
var _91a=_919.prototype=new WebSocketExtension(_55a.KAAZING_SEC_EXTENSION_REVALIDATE);
return _919;
})();
})();
(function(){
window.WebSocketFactory=(function(){
var _91b=function(){
this.extensions={};
var _91c=new WebSocketRevalidateExtension();
this.extensions[_91c.name]=_91c;
this.redirectPolicy=HttpRedirectPolicy.ALWAYS;
};
var _91d=_91b.prototype;
_91d.getExtension=function(name){
return this.extensions[name];
};
_91d.setExtension=function(_91f){
this.extensions[_91f.name]=_91f;
};
_91d.setChallengeHandler=function(_920){
if(typeof (_920)=="undefined"){
var s="WebSocketFactory.setChallengeHandler(): Parameter 'challengeHandler' is required";
throw new Error(s);
}
this.challengeHandler=_920;
var _922=this.extensions[_55a.KAAZING_SEC_EXTENSION_REVALIDATE];
_922.enabled=(_920!=null);
};
_91d.getChallengeHandler=function(){
return this.challengeHandler||null;
};
_91d.createWebSocket=function(url,_924){
var ext=[];
for(var key in this.extensions){
if(this.extensions.hasOwnProperty(key)&&this.extensions[key].enabled){
ext.push(this.extensions[key].toString());
}
}
var _927=this.getChallengeHandler();
var _928=this.getDefaultConnectTimeout();
var _929=this.getDefaultRedirectPolicy();
var ws=new WebSocket(url,_924,ext,_927,_928,_929);
return ws;
};
_91d.setDefaultConnectTimeout=function(_92b){
if(typeof (_92b)=="undefined"){
var s="WebSocketFactory.setDefaultConnectTimeout(): int parameter 'connectTimeout' is required";
throw new Error(s);
}
if(typeof (_92b)!="number"){
var s="WebSocketFactory.setDefaultConnectTimeout(): connectTimeout should be an integer";
throw new Error(s);
}
if(_92b<0){
var s="WebSocketFactory.setDefaultConnectTimeout(): Connect timeout cannot be negative";
throw new Error(s);
}
this.connectTimeout=_92b;
};
_91d.getDefaultConnectTimeout=function(){
return this.connectTimeout||0;
};
_91d.setDefaultRedirectPolicy=function(_92d){
if(typeof (_92d)=="undefined"){
var s="WebSocketFactory.setDefaultRedirectPolicy(): int parameter 'redirectPolicy' is required";
throw new Error(s);
}
if(!(_92d instanceof HttpRedirectPolicy)){
var s="WebSocketFactory.setDefaultRedirectPolicy(): redirectPolicy should be an instance of HttpRedirectPolicy";
throw new Error(s);
}
this.redirectPolicy=_92d;
};
_91d.getDefaultRedirectPolicy=function(){
return this.redirectPolicy;
};
return _91b;
})();
})();
window.___Loader=new _3a6(_274);
})();
})();
