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
var postMessage0=(function(){
var _49=new URI((browser=="ie")?document.URL:location.href);
var _4a={"http":80,"https":443};
if(_49.port==null){
_49.port=_4a[_49.scheme];
_49.authority=_49.host+":"+_49.port;
}
var _4b=_49.scheme+"://"+_49.authority;
var _4c="/.kr";
if(typeof (postMessage)!=="undefined"){
return function(_4d,_4e,_4f){
if(typeof (_4e)!="string"){
throw new Error("Unsupported type. Messages must be strings");
}
if(_4f==="null"){
_4f="*";
}
switch(browser){
case "ie":
case "opera":
case "firefox":
setTimeout(function(){
_4d.postMessage(_4e,_4f);
},0);
break;
default:
_4d.postMessage(_4e,_4f);
break;
}
};
}else{
function MessagePipe(_50){
this.sourceToken=toPaddedHex(Math.floor(Math.random()*(Math.pow(2,32)-1)),8);
this.iframe=_50;
this.bridged=false;
this.lastWrite=0;
this.lastRead=0;
this.lastReadIndex=2;
this.lastSyn=0;
this.lastAck=0;
this.queue=[];
this.escapedFragments=[];
};
var _51=MessagePipe.prototype;
_51.attach=function(_52,_53,_54,_55,_56,_57){
this.target=_52;
this.targetOrigin=_53;
this.targetToken=_54;
this.reader=_55;
this.writer=_56;
this.writerURL=_57;
try{
this._lastHash=_55.location.hash;
this.poll=pollLocationHash;
}
catch(permissionDenied){
this._lastDocumentURL=_55.document.URL;
this.poll=pollDocumentURL;
}
if(_52==parent){
dequeue(this,true);
}
};
_51.detach=function(){
this.poll=function(){
};
delete this.target;
delete this.targetOrigin;
delete this.reader;
delete this.lastFragment;
delete this.writer;
delete this.writerURL;
};
_51.poll=function(){
};
function pollLocationHash(){
var _58=this.reader.location.hash;
if(this._lastHash!=_58){
process(this,_58.substring(1));
this._lastHash=_58;
}
};
function pollDocumentURL(){
var _59=this.reader.document.URL;
if(this._lastDocumentURL!=_59){
var _5a=_59.indexOf("#");
if(_5a!=-1){
process(this,_59.substring(_5a+1));
this._lastDocumentURL=_59;
}
}
};
_51.post=function(_5b,_5c,_5d){
bridgeIfNecessary(this,_5b);
var _5e=1000;
var _5f=escape(_5c);
var _60=[];
while(_5f.length>_5e){
var _61=_5f.substring(0,_5e);
_5f=_5f.substring(_5e);
_60.push(_61);
}
_60.push(_5f);
this.queue.push([_5d,_60]);
if(this.writer!=null&&this.lastAck>=this.lastSyn){
dequeue(this,false);
}
};
function bridgeIfNecessary(_62,_63){
if(_62.lastWrite<1&&!_62.bridged){
if(_63.parent==window){
var src=_62.iframe.src;
var _65=src.split("#");
var _66=null;
var _67=document.getElementsByTagName("meta");
for(var i=0;i<_67.length;i++){
if(_67[i].name=="kaazing:resources"){
alert("kaazing:resources is no longer supported. Please refer to the Administrator's Guide section entitled \"Configuring a Web Server to Integrate with Kaazing Gateway\"");
}
}
var _69=_4b;
var _6a=_69.toString()+_4c+"?.kr=xsp&.kv=10.05";
if(_66){
var _6b=new URI(_69.toString());
var _65=_66.split(":");
_6b.host=_65.shift();
if(_65.length){
_6b.port=_65.shift();
}
_6a=_6b.toString()+_4c+"?.kr=xsp&.kv=10.05";
}
for(var i=0;i<_67.length;i++){
if(_67[i].name=="kaazing:postMessageBridgeURL"){
var _6c=_67[i].content;
var _6d=new URI(_6c);
var _6e=new URI(location.toString());
if(!_6d.authority){
_6d.host=_6e.host;
_6d.port=_6e.port;
_6d.scheme=_6e.scheme;
if(_6c.indexOf("/")!=0){
var _6f=_6e.path.split("/");
_6f.pop();
_6f.push(_6c);
_6d.path=_6f.join("/");
}
}
postMessage0.BridgeURL=_6d.toString();
}
}
if(postMessage0.BridgeURL){
_6a=postMessage0.BridgeURL;
}
var _70=["I",_69,_62.sourceToken,escape(_6a)];
if(_65.length>1){
var _71=_65[1];
_70.push(escape(_71));
}
_65[1]=_70.join("!");
setTimeout(function(){
_63.location.replace(_65.join("#"));
},200);
_62.bridged=true;
}
}
};
function flush(_72,_73){
var _74=_72.writerURL+"#"+_73;
_72.writer.location.replace(_74);
};
function fromHex(_75){
return parseInt(_75,16);
};
function toPaddedHex(_76,_77){
var hex=_76.toString(16);
var _79=[];
_77-=hex.length;
while(_77-->0){
_79.push("0");
}
_79.push(hex);
return _79.join("");
};
function dequeue(_7a,_7b){
var _7c=_7a.queue;
var _7d=_7a.lastRead;
if((_7c.length>0||_7b)&&_7a.lastSyn>_7a.lastAck){
var _7e=_7a.lastFrames;
var _7f=_7a.lastReadIndex;
if(fromHex(_7e[_7f])!=_7d){
_7e[_7f]=toPaddedHex(_7d,8);
flush(_7a,_7e.join(""));
}
}else{
if(_7c.length>0){
var _80=_7c.shift();
var _81=_80[0];
if(_81=="*"||_81==_7a.targetOrigin){
_7a.lastWrite++;
var _82=_80[1];
var _83=_82.shift();
var _84=3;
var _7e=[_7a.targetToken,toPaddedHex(_7a.lastWrite,8),toPaddedHex(_7d,8),"F",toPaddedHex(_83.length,4),_83];
var _7f=2;
if(_82.length>0){
_7e[_84]="f";
_7a.queue.unshift(_80);
}
if(_7a.resendAck){
var _85=[_7a.targetToken,toPaddedHex(_7a.lastWrite-1,8),toPaddedHex(_7d,8),"a"];
_7e=_85.concat(_7e);
_7f+=_85.length;
}
flush(_7a,_7e.join(""));
_7a.lastFrames=_7e;
_7a.lastReadIndex=_7f;
_7a.lastSyn=_7a.lastWrite;
_7a.resendAck=false;
}
}else{
if(_7b){
_7a.lastWrite++;
var _7e=[_7a.targetToken,toPaddedHex(_7a.lastWrite,8),toPaddedHex(_7d,8),"a"];
var _7f=2;
if(_7a.resendAck){
var _85=[_7a.targetToken,toPaddedHex(_7a.lastWrite-1,8),toPaddedHex(_7d,8),"a"];
_7e=_85.concat(_7e);
_7f+=_85.length;
}
flush(_7a,_7e.join(""));
_7a.lastFrames=_7e;
_7a.lastReadIndex=_7f;
_7a.resendAck=true;
}
}
}
};
function process(_86,_87){
var _88=_87.substring(0,8);
var _89=fromHex(_87.substring(8,16));
var _8a=fromHex(_87.substring(16,24));
var _8b=_87.charAt(24);
if(_88!=_86.sourceToken){
throw new Error("postMessage emulation tampering detected");
}
var _8c=_86.lastRead;
var _8d=_8c+1;
if(_89==_8d){
_86.lastRead=_8d;
}
if(_89==_8d||_89==_8c){
_86.lastAck=_8a;
}
if(_89==_8d||(_89==_8c&&_8b=="a")){
switch(_8b){
case "f":
var _8e=_87.substr(29,fromHex(_87.substring(25,29)));
_86.escapedFragments.push(_8e);
dequeue(_86,true);
break;
case "F":
var _8f=_87.substr(29,fromHex(_87.substring(25,29)));
if(_86.escapedFragments!==undefined){
_86.escapedFragments.push(_8f);
_8f=_86.escapedFragments.join("");
_86.escapedFragments=[];
}
var _90=unescape(_8f);
dispatch(_90,_86.target,_86.targetOrigin);
dequeue(_86,true);
break;
case "a":
if(_87.length>25){
process(_86,_87.substring(25));
}else{
dequeue(_86,false);
}
break;
default:
throw new Error("unknown postMessage emulation payload type: "+_8b);
}
}
};
function dispatch(_91,_92,_93){
var _94=document.createEvent("Events");
_94.initEvent("message",false,true);
_94.data=_91;
_94.origin=_93;
_94.source=_92;
dispatchEvent(_94);
};
var _95={};
var _96=[];
function pollReaders(){
for(var i=0,len=_96.length;i<len;i++){
var _99=_96[i];
_99.poll();
}
setTimeout(pollReaders,20);
};
function findMessagePipe(_9a){
if(_9a==parent){
return _95["parent"];
}else{
if(_9a.parent==window){
var _9b=document.getElementsByTagName("iframe");
for(var i=0;i<_9b.length;i++){
var _9d=_9b[i];
if(_9a==_9d.contentWindow){
return supplyIFrameMessagePipe(_9d);
}
}
}else{
throw new Error("Generic peer postMessage not yet implemented");
}
}
};
function supplyIFrameMessagePipe(_9e){
var _9f=_9e._name;
if(_9f===undefined){
_9f="iframe$"+String(Math.random()).substring(2);
_9e._name=_9f;
}
var _a0=_95[_9f];
if(_a0===undefined){
_a0=new MessagePipe(_9e);
_95[_9f]=_a0;
}
return _a0;
};
function postMessage0(_a1,_a2,_a3){
if(typeof (_a2)!="string"){
throw new Error("Unsupported type. Messages must be strings");
}
if(_a1==window){
if(_a3=="*"||_a3==_4b){
dispatch(_a2,window,_4b);
}
}else{
var _a4=findMessagePipe(_a1);
_a4.post(_a1,_a2,_a3);
}
};
postMessage0.attach=function(_a5,_a6,_a7,_a8,_a9,_aa){
var _ab=findMessagePipe(_a5);
_ab.attach(_a5,_a6,_a7,_a8,_a9,_aa);
_96.push(_ab);
};
var _ac=function(_ad){
var _ae=new URI((browser=="ie")?document.URL:location.href);
var _af;
var _b0={"http":80,"https":443};
if(_ae.port==null){
_ae.port=_b0[_ae.scheme];
_ae.authority=_ae.host+":"+_ae.port;
}
var _b1=unescape(_ae.fragment||"");
if(_b1.length>0){
var _b2=_b1.split(",");
var _b3=_b2.shift();
var _b4=_b2.shift();
var _b5=_b2.shift();
var _b6=_ae.scheme+"://"+document.domain+":"+_ae.port;
var _b7=_ae.scheme+"://"+_ae.authority;
var _b8=_b3+"/.kr?.kr=xsc&.kv=10.05";
var _b9=document.location.toString().split("#")[0];
var _ba=_b8+"#"+escape([_b6,_b4,escape(_b9)].join(","));
if(typeof (ActiveXObject)!="undefined"){
_af=new ActiveXObject("htmlfile");
_af.open();
try{
_af.parentWindow.opener=window;
}
catch(domainError){
if(_ad){
_af.domain=_ad;
}
_af.parentWindow.opener=window;
}
_af.write("<html>");
_af.write("<body>");
if(_ad){
_af.write("<script>CollectGarbage();document.domain='"+_ad+"';</"+"script>");
}
_af.write("<iframe src=\""+_b8+"\"></iframe>");
_af.write("</body>");
_af.write("</html>");
_af.close();
var _bb=_af.body.lastChild;
var _bc=_af.parentWindow;
var _bd=parent;
var _be=_bd.parent.postMessage0;
if(typeof (_be)!="undefined"){
_bb.onload=function(){
var _bf=_bb.contentWindow;
_bf.location.replace(_ba);
_be.attach(_bd,_b3,_b5,_bc,_bf,_b8);
};
}
}else{
var _bb=document.createElement("iframe");
_bb.src=_ba;
document.body.appendChild(_bb);
var _bc=window;
var _c0=_bb.contentWindow;
var _bd=parent;
var _be=_bd.parent.postMessage0;
if(typeof (_be)!="undefined"){
_be.attach(_bd,_b3,_b5,_bc,_c0,_b8);
}
}
}
window.onunload=function(){
try{
var _c1=window.parent.parent.postMessage0;
if(typeof (_c1)!="undefined"){
_c1.detach(_bd);
}
}
catch(permissionDenied){
}
if(typeof (_af)!=="undefined"){
_af.parentWindow.opener=null;
_af.open();
_af.close();
_af=null;
CollectGarbage();
}
};
};
postMessage0.__init__=function(_c2,_c3){
var _c4=_ac.toString();
_c2.URI=URI;
_c2.browser=browser;
if(!_c3){
_c3="";
}
_c2.setTimeout("("+_c4+")('"+_c3+"')",0);
};
postMessage0.bridgeURL=false;
postMessage0.detach=function(_c5){
var _c6=findMessagePipe(_c5);
for(var i=0;i<_96.length;i++){
if(_96[i]==_c6){
_96.splice(i,1);
}
}
_c6.detach();
};
if(window!=top){
_95["parent"]=new MessagePipe();
function initializeAsTargetIfNecessary(){
var _c8=new URI((browser=="ie")?document.URL:location.href);
var _c9=_c8.fragment||"";
if(document.body!=null&&_c9.length>0&&_c9.charAt(0)=="I"){
var _ca=unescape(_c9);
var _cb=_ca.split("!");
if(_cb.shift()=="I"){
var _cc=_cb.shift();
var _cd=_cb.shift();
var _ce=unescape(_cb.shift());
var _cf=_4b;
if(_cc==_cf){
try{
parent.location.hash;
}
catch(permissionDenied){
document.domain=document.domain;
}
}
var _d0=_cb.shift()||"";
switch(browser){
case "firefox":
location.replace([location.href.split("#")[0],_d0].join("#"));
break;
default:
location.hash=_d0;
break;
}
var _d1=findMessagePipe(parent);
_d1.targetToken=_cd;
var _d2=_d1.sourceToken;
var _d3=_ce+"#"+escape([_cf,_cd,_d2].join(","));
var _d4;
_d4=document.createElement("iframe");
_d4.src=_d3;
_d4.style.position="absolute";
_d4.style.left="-10px";
_d4.style.top="10px";
_d4.style.visibility="hidden";
_d4.style.width="0px";
_d4.style.height="0px";
document.body.appendChild(_d4);
return;
}
}
setTimeout(initializeAsTargetIfNecessary,20);
};
initializeAsTargetIfNecessary();
}
var _d5=document.getElementsByTagName("meta");
for(var i=0;i<_d5.length;i++){
if(_d5[i].name==="kaazing:postMessage"){
if("immediate"==_d5[i].content){
var _d7=function(){
var _d8=document.getElementsByTagName("iframe");
for(var i=0;i<_d8.length;i++){
var _da=_d8[i];
if(_da.style["KaaPostMessage"]=="immediate"){
_da.style["KaaPostMessage"]="none";
var _db=supplyIFrameMessagePipe(_da);
bridgeIfNecessary(_db,_da.contentWindow);
}
}
setTimeout(_d7,20);
};
setTimeout(_d7,20);
}
break;
}
}
for(var i=0;i<_d5.length;i++){
if(_d5[i].name==="kaazing:postMessagePrefix"){
var _dc=_d5[i].content;
if(_dc!=null&&_dc.length>0){
if(_dc.charAt(0)!="/"){
_dc="/"+_dc;
}
_4c=_dc;
}
}
}
setTimeout(pollReaders,20);
return postMessage0;
}
})();
var XDRHttpDirect=(function(){
var id=0;
function XDRHttpDirect(_de){
this.outer=_de;
};
var _df=XDRHttpDirect.prototype;
_df.open=function(_e0,_e1){
var _e2=this;
var xhr=this.outer;
xhr.responseText="";
var _e4=2;
var _e5=0;
var _e6=0;
this._method=_e0;
this._location=_e1;
if(_e1.indexOf("?")==-1){
_e1+="?.kac=ex&.kct=application/x-message-http";
}else{
_e1+="&.kac=ex&.kct=application/x-message-http";
}
this.location=_e1;
var xdr=this.xdr=new XDomainRequest();
var _e8=function(e){
try{
var _ea=xdr.responseText;
if(_e4<=2){
var _eb=_ea.indexOf("\r\n\r\n");
if(_eb==-1){
return;
}
var _ec=_ea.indexOf("\r\n");
var _ed=_ea.substring(0,_ec);
var _ee=_ed.match(/HTTP\/1\.\d\s(\d+)\s([^\r\n]+)/);
xhr.status=parseInt(_ee[1]);
xhr.statusText=_ee[2];
var _ef=_ec+2;
_e6=_eb+4;
var _f0=_ea.substring(_ef,_eb).split("\r\n");
xhr._responseHeaders={};
for(var i=0;i<_f0.length;i++){
var _f2=_f0[i].split(":");
if(_f2.length>1){
var _f3=_f2[0].replace(/^\s+|\s+$/g,"");
var _f4=_f2[1].replace(/^\s+|\s+$/g,"");
var _f5=xhr._responseHeaders[_f3];
var _f6=_f4;
if(_f5&&(_f4.replace(/^\s+|\s+$/g,"").length>0)){
_f6=_f5.concat(",").concat(_f4);
}
xhr._responseHeaders[_f3]=_f6;
}
}
_e5=_e6;
_e4=xhr.readyState=3;
if(typeof (_e2.onreadystatechange)=="function"){
_e2.onreadystatechange(xhr);
}
}
var _f7=xdr.responseText.length;
if(_f7>_e5){
xhr.responseText=_ea.slice(_e6);
_e5=_f7;
if(typeof (_e2.onprogress)=="function"){
_e2.onprogress(xhr);
}
}else{
}
}
catch(e1){
_e2.onload(xhr);
}
};
xdr.onprogress=_e8;
xdr.onerror=function(e){
xhr.readyState=0;
if(typeof (xhr.onerror)=="function"){
xhr.onerror(xhr);
}
};
xdr.onload=function(e){
if(_e4<=3){
_e8(e);
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
xdr.open("POST",_e1);
xdr.timeout=30000;
};
_df.send=function(_fb){
var _fc=this._method+" "+this.location.substring(this.location.indexOf("/",9),this.location.indexOf("&.kct"))+" HTTP/1.1\r\n";
for(var i=0;i<this.outer._requestHeaders.length;i++){
_fc+=this.outer._requestHeaders[i][0]+": "+this.outer._requestHeaders[i][1]+"\r\n";
}
var _fe=_fb||"";
if(_fe.length>0||this._method.toUpperCase()==="POST"){
var len=0;
for(var i=0;i<_fe.length;i++){
len++;
if(_fe.charCodeAt(i)>=128){
len++;
}
}
_fc+="Content-Length: "+len+"\r\n";
}
_fc+="\r\n";
_fc+=_fe;
this.xdr.send(_fc);
};
_df.abort=function(){
this.xdr.abort();
};
return XDRHttpDirect;
})();
var XMLHttpBridge=(function(){
var _100={"http":80,"https":443};
var _101=location.protocol.replace(":","");
var _102=location.port;
if(_102==null){
_102=_100[_101];
}
var _103=_101+"://"+location.hostname+":"+_102;
var _104={};
var _105={};
var _106=0;
function XMLHttpBridge(_107){
this.outer=_107;
};
var _108=XMLHttpBridge.prototype;
_108.open=function(_109,_10a){
var id=register(this);
var pipe=supplyPipe(this,_10a);
pipe.attach(id);
this._pipe=pipe;
this._method=_109;
this._location=_10a;
this.outer.readyState=1;
this.outer.status=0;
this.outer.statusText="";
this.outer.responseText="";
var _10d=this;
setTimeout(function(){
_10d.outer.readyState=1;
onreadystatechange(_10d);
},0);
};
_108.send=function(_10e){
doSend(this,_10e);
};
_108.abort=function(){
var pipe=this._pipe;
if(pipe!==undefined){
pipe.post(["a",this._id].join(""));
pipe.detach(this._id);
}
};
function onreadystatechange(_110){
if(typeof (_110.onreadystatechange)!=="undefined"){
_110.onreadystatechange(_110.outer);
}
switch(_110.outer.readyState){
case 3:
if(typeof (_110.onprogress)!=="undefined"){
_110.onprogress(_110.outer);
}
break;
case 4:
if(_110.outer.status<100||_110.outer.status>=500){
if(typeof (_110.onerror)!=="undefined"){
_110.onerror(_110.outer);
}
}else{
if(typeof (_110.onprogress)!=="undefined"){
_110.onprogress(_110.outer);
}
if(typeof (_110.onload)!=="undefined"){
_110.onload(_110.outer);
}
}
break;
}
};
function onerror(_111){
if(typeof (_111.outer.onerror)!=="undefined"){
_111.outer.onerror();
}
};
function fromHex(_112){
return parseInt(_112,16);
};
function toPaddedHex(_113,_114){
var hex=_113.toString(16);
var _116=[];
_114-=hex.length;
while(_114-->0){
_116.push("0");
}
_116.push(hex);
return _116.join("");
};
function register(_117){
var id=toPaddedHex(_106++,8);
_105[id]=_117;
_117._id=id;
return id;
};
function doSend(_119,_11a){
if(typeof (_11a)!=="string"){
_11a="";
}
var _11b=_119._method.substring(0,10);
var _11c=_119._location;
var _11d=_119.outer._requestHeaders;
var _11e=toPaddedHex(_119.outer.timeout,4);
var _11f=(_119.outer.onprogress!==undefined)?"t":"f";
var _120=["s",_119._id,_11b.length,_11b,toPaddedHex(_11c.length,4),_11c,toPaddedHex(_11d.length,4)];
for(var i=0;i<_11d.length;i++){
var _122=_11d[i];
_120.push(toPaddedHex(_122[0].length,4));
_120.push(_122[0]);
_120.push(toPaddedHex(_122[1].length,4));
_120.push(_122[1]);
}
_120.push(toPaddedHex(_11a.length,8),_11a,toPaddedHex(_11e,4),_11f);
_119._pipe.post(_120.join(""));
};
function supplyPipe(_123,_124){
var uri=new URI(_124);
var _126=(uri.scheme!=null&&uri.authority!=null);
var _127=_126?uri.scheme:_101;
var _128=_126?uri.authority:_103;
if(_128!=null&&uri.port==null){
_128=uri.host+":"+_100[_127];
}
var _129=_127+"://"+_128;
var pipe=_104[_129];
if(pipe!==undefined){
if(!("iframe" in pipe&&"contentWindow" in pipe.iframe&&typeof pipe.iframe.contentWindow=="object")){
pipe=_104[_129]=undefined;
}
}
if(pipe===undefined){
var _12b=document.createElement("iframe");
_12b.style.position="absolute";
_12b.style.left="-10px";
_12b.style.top="10px";
_12b.style.visibility="hidden";
_12b.style.width="0px";
_12b.style.height="0px";
var _12c=new URI(_129);
_12c.query=".kr=xs";
_12c.path="/";
_12b.src=_12c.toString();
function post(_12d){
this.buffer.push(_12d);
};
function attach(id){
var _12f=this.attached[id];
if(_12f===undefined){
_12f={};
this.attached[id]=_12f;
}
if(_12f.timerID!==undefined){
clearTimeout(_12f.timerID);
delete _12f.timerID;
}
};
function detach(id){
var _131=this.attached[id];
if(_131!==undefined&&_131.timerID===undefined){
var _132=this;
_131.timerID=setTimeout(function(){
delete _132.attached[id];
var xhr=_105[id];
if(xhr._pipe==pipe){
delete _105[id];
delete xhr._id;
delete xhr._pipe;
}
postMessage0(pipe.iframe.contentWindow,["d",id].join(""),pipe.targetOrigin);
},0);
}
};
pipe={"targetOrigin":_129,"iframe":_12b,"buffer":[],"post":post,"attach":attach,"detach":detach,"attached":{count:0}};
_104[_129]=pipe;
function sendInitWhenReady(){
var _134=_12b.contentWindow;
if(!_134){
setTimeout(sendInitWhenReady,20);
}else{
postMessage0(_134,"I",_129);
}
};
pipe.handshakeID=setTimeout(function(){
_104[_129]=undefined;
pipe.post=function(_135){
_123.readyState=4;
_123.status=0;
onreadystatechange(_123);
};
if(pipe.buffer.length>0){
pipe.post();
}
},30000);
document.body.appendChild(_12b);
if(typeof (postMessage)==="undefined"){
sendInitWhenReady();
}
}
return pipe;
};
function onmessage(_136){
var _137=_136.origin;
var _138={"http":":80","https":":443"};
var _139=_137.split(":");
if(_139.length===2){
_137+=_138[_139[0]];
}
var pipe=_104[_137];
if(pipe!==undefined&&pipe.iframe!==undefined&&_136.source==pipe.iframe.contentWindow){
if(_136.data=="I"){
clearTimeout(pipe.handshakeID);
var _13b;
while((_13b=pipe.buffer.shift())!==undefined){
postMessage0(pipe.iframe.contentWindow,_13b,pipe.targetOrigin);
}
pipe.post=function(_13c){
postMessage0(pipe.iframe.contentWindow,_13c,pipe.targetOrigin);
};
}else{
var _13b=_136.data;
if(_13b.length>=9){
var _13d=0;
var type=_13b.substring(_13d,_13d+=1);
var id=_13b.substring(_13d,_13d+=8);
var _140=_105[id];
if(_140!==undefined){
switch(type){
case "r":
var _141={};
var _142=fromHex(_13b.substring(_13d,_13d+=2));
for(var i=0;i<_142;i++){
var _144=fromHex(_13b.substring(_13d,_13d+=4));
var _145=_13b.substring(_13d,_13d+=_144);
var _146=fromHex(_13b.substring(_13d,_13d+=4));
var _147=_13b.substring(_13d,_13d+=_146);
_141[_145]=_147;
}
var _148=fromHex(_13b.substring(_13d,_13d+=4));
var _149=fromHex(_13b.substring(_13d,_13d+=2));
var _14a=_13b.substring(_13d,_13d+=_149);
switch(_148){
case 301:
case 302:
case 307:
var _14b=_141["Location"];
var _14c=_136.origin;
if(typeof (_140.outer.onredirectallowed)==="function"){
if(!_140.outer.onredirectallowed(_14c,_14b)){
return;
}
}
var id=register(_140);
var pipe=supplyPipe(_140,_14b);
pipe.attach(id);
_140._pipe=pipe;
_140._method="GET";
_140._location=_14b;
_140._redirect=true;
break;
case 403:
_140.outer.status=_148;
onreadystatechange(_140);
break;
case 404:
_140.outer.status=_148;
_140.outer.statusText=_14a;
onerror(_140);
break;
default:
_140.outer._responseHeaders=_141;
_140.outer.status=_148;
_140.outer.statusText=_14a;
break;
}
break;
case "p":
var _14d=parseInt(_13b.substring(_13d,_13d+=1));
if(_140._id===id){
_140.outer.readyState=_14d;
var _14e=fromHex(_13b.substring(_13d,_13d+=8));
var _14f=_13b.substring(_13d,_13d+=_14e);
if(_14f.length>0){
_140.outer.responseText+=_14f;
}
onreadystatechange(_140);
}else{
if(_140._redirect){
_140._redirect=false;
doSend(_140,"");
}
}
if(_14d==4){
pipe.detach(id);
}
break;
case "e":
if(_140._id===id){
_140.outer.status=0;
_140.outer.statusText="";
_140.outer.readyState=4;
onreadystatechange(_140);
}
pipe.detach(id);
break;
case "t":
if(_140._id===id){
_140.outer.status=0;
_140.outer.statusText="";
_140.outer.readyState=4;
if(typeof (_140.ontimeout)!=="undefined"){
_140.ontimeout();
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
var _150=location.protocol.replace(":","");
var _151={"http":80,"https":443};
var _152=location.port;
if(_152==null){
_152=_151[_150];
}
var _153=location.hostname+":"+_152;
function onreadystatechange(_154){
if(typeof (_154.onreadystatechange)!=="undefined"){
_154.onreadystatechange();
}
};
function onprogress(_155){
if(typeof (_155.onprogress)!=="undefined"){
_155.onprogress();
}
};
function onerror(_156){
if(typeof (_156.onerror)!=="undefined"){
_156.onerror();
}
};
function onload(_157){
if(typeof (_157.onload)!=="undefined"){
_157.onload();
}
};
function XMLHttpRequest0(){
this._requestHeaders=[];
this.responseHeaders={};
this.withCredentials=false;
};
var _158=XMLHttpRequest0.prototype;
_158.readyState=0;
_158.responseText="";
_158.status=0;
_158.statusText="";
_158.timeout=0;
_158.onreadystatechange;
_158.onerror;
_158.onload;
_158.onprogress;
_158.onredirectallowed;
_158.open=function(_159,_15a,_15b){
if(!_15b){
throw new Error("Asynchronous is required for cross-origin XMLHttpRequest emulation");
}
switch(this.readyState){
case 0:
case 4:
break;
default:
throw new Error("Invalid ready state");
}
var _15c=this;
this._method=_159;
this._location=_15a;
this.readyState=1;
this.status=0;
this.statusText="";
this.responseText="";
var xhr;
var _15e=new URI(_15a);
if(_15e.port==null){
_15e.port=_151[_15e.scheme];
_15e.authority=_15e.host+":"+_15e.port;
}
if(browser=="ie"&&typeof (XDomainRequest)!=="undefined"&&_15e.scheme==_150&&!this.withCredentials){
xhr=new XDRHttpDirect(this);
}else{
if(_15e.scheme==_150&&_15e.authority==_153){
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
xhr.open(_159,_15a);
this.xhr=xhr;
setTimeout(function(){
if(_15c.readyState>1){
return;
}
if(_15c.readyState<1){
_15c.readyState=1;
}
onreadystatechange(_15c);
},0);
};
_158.setRequestHeader=function(_15f,_160){
if(this.readyState!==1){
throw new Error("Invalid ready state");
}
this._requestHeaders.push([_15f,_160]);
};
_158.send=function(_161){
if(this.readyState!==1){
throw new Error("Invalid ready state");
}
var _162=this;
setTimeout(function(){
if(_162.readyState>2){
return;
}
if(_162.readyState<2){
_162.readyState=2;
}
onreadystatechange(_162);
},0);
this.xhr.send(_161);
};
_158.abort=function(){
this.xhr.abort();
};
_158.getResponseHeader=function(_163){
if(this.status==0){
throw new Error("Invalid ready state");
}
var _164=this._responseHeaders;
return _164[_163];
};
_158.getAllResponseHeaders=function(){
if(this.status==0){
throw new Error("Invalid ready state");
}
return this._responseHeaders;
};
return XMLHttpRequest0;
})();
var coverNativeSSE=true;
if(coverNativeSSE||typeof (window.EventSource)==="undefined"){
var EventSource=(function(){
function EventSource(_165){
this.lastEventId=null;
this.immediate=false;
this.retry=3000;
var _166=new URI(_165);
var _167={"http":80,"https":443};
if(_166.port==null){
_166.port=_167[_166.scheme];
_166.authority=_166.host+":"+_166.port;
}
this.origin=_166.scheme+"://"+_166.authority;
this.location=_165;
this.lineQueue=[];
this.xhr=null;
this.reconnectTimer=null;
var _168=this;
setTimeout(function(){
_connect(_168,false);
},0);
};
var _169=EventSource.prototype;
_169.readyState=0;
_169.onopen=function(){
};
_169.onmessage=function(_16a){
};
_169.onerror=function(){
};
_169.disconnect=function(){
if(this.readyState!==2){
_disconnect(this);
}
};
function _connect(_16b,_16c,_16d){
if(_16b.reconnectTimer!==null){
_16b.reconnectTimer=null;
}
var _16e=new URI(_16b.location);
if(_16d===undefined){
_16d=[];
}
if(_16b.lastEventId!==null){
_16d.push(".ka="+this.lastEventId);
}
if(_16b.location.indexOf("&.kb=")===-1&&_16b.location.indexOf("?.kb=")===-1){
_16d.push(".kb=512");
}
switch(browser){
case "ie":
case "safari":
_16d.push(".kp=256");
break;
case "firefox":
_16d.push(".kp=1025");
_16d.push(String(Math.random()).substring(2));
break;
case "android":
_16d.push(".kp=4096");
_16d.push(".kbp=4096");
break;
}
if(_16d.length>0){
if(_16e.query===undefined){
_16e.query=_16d.join("&");
}else{
_16e.query+="&"+_16d.join("&");
}
}
var xhr=_16b.xhr=new XMLHttpRequest0();
var _170={"xhr":xhr,"position":0};
if(_16b.location.indexOf(".ki=p")==-1||_16b.location.indexOf("https://")==0){
xhr.onprogress=function(){
setTimeout(function(){
_process(_16b,_170);
},0);
};
}
xhr.onload=function(){
_process(_16b,_170);
if(_16b.xhr==_170.xhr&&_16b.readyState!=2){
_reconnect(_16b);
}
};
xhr.onerror=function(){
if(_16b.readyState!=2){
_disconnect(_16b);
_error(_16b);
}
};
xhr.ontimeout=function(){
if(_16b.readyState!=2){
_disconnect(_16b);
_error(_16b);
}
};
xhr.onreadystatechange=function(){
if(!_16c){
if(xhr.readyState>=3){
_16b.readyState=1;
if(typeof (_16b.onopen)==="function"){
_16b.onopen();
}
xhr.onreadystatechange=function(){
};
}
}
};
xhr.open("GET",_16e.toString(),true);
xhr.send(null);
if(_16b.location.indexOf(".ki=p")==-1){
setTimeout(function(){
if(xhr.readyState<3&&_16b.readyState<2){
_connect(_16b,false,new Array(".ki=p"));
}
},3000);
}
};
function _disconnect(_171){
if(_171.reconnectTimer!==null){
clearTimeout(_171.reconnectTimer);
_171.reconnectTimer=null;
}
_171.lineQueue=[];
_171.lastEventId=null;
_171.location=null;
_171.readyState=2;
if(_171.xhr!==null){
_171.xhr.onprogress=function(){
};
_171.xhr.onload=function(){
};
_171.xhr.onerror=function(){
};
_171.xhr.onreadystatechange=function(){
};
_171.xhr.abort();
}
};
function _reconnect(_172){
_172.readyState=0;
if(_172.location!==null){
var _173=_172.retry;
var _174=_172.immediate;
if(_174){
_172.immediate=false;
_173=0;
}else{
_error(_172);
}
if(_172.readyState==0){
_172.reconnectTimer=setTimeout(function(){
_connect(_172,_174);
},_173);
}
}
};
var _175=/[^\r\n]+|\r\n|\r|\n/g;
function _process(_176,_177){
var _178=_177.xhr.responseText;
var _179=_178.slice(_177.position);
var _17a=_179.match(_175)||[];
var _17b=_176.lineQueue;
var _17c="";
while(_17a.length>0){
var _17d=_17a.shift();
switch(_17d.charAt(0)){
case "\r":
case "\n":
_177.position+=_17c.length+_17d.length;
if(_17c===""){
_dispatch(_176);
}else{
_17b.push(_17c);
_17c="";
}
break;
default:
_17c=_17d;
break;
}
}
};
function _dispatch(_17e){
var data="";
var name="message";
var _181=_17e.lineQueue;
while(_181.length>0){
var line=_181.shift();
var _183=null;
var _184="";
var _185=line.indexOf(":");
if(_185==-1){
_183=line;
_184="";
}else{
if(_185===0){
continue;
}else{
_183=line.slice(0,_185);
var _186=_185+1;
if(line.charAt(_186)==" "){
_186++;
}
_184=line.slice(_186);
}
}
switch(_183){
case "event":
name=_184;
break;
case "id":
_17e.lastEventId=_184;
break;
case "retry":
_184=parseInt(_184,10);
if(!isNaN(_184)){
_17e.retry=_184;
}
break;
case "data":
if(data.length>0){
data+="\n";
}
data+=_184;
break;
case "location":
if(_184!=""){
_17e.location=_184;
}
break;
case "reconnect":
_17e.immediate=true;
break;
default:
break;
}
}
if(data.length>0||(name.length>0&&name!="message")){
var e=document.createEvent("Events");
e.initEvent(name,true,true);
e.lastEventId=_17e.lastEventId;
e.data=data;
e.origin=_17e.origin;
if(e.source!==null){
e.source=null;
}
if(typeof (_17e.onmessage)==="function"){
_17e.onmessage(e);
}
}
};
function _error(_188){
var e=document.createEvent("Events");
e.initEvent("error",true,true);
if(typeof (_188.onerror)==="function"){
_188.onerror(e);
}
};
return EventSource;
})();
}else{
window.EventSource=(function(){
var _18a={};
var _18b={};
var _18c=0;
function EventSource(_18d){
this.readyState=0;
var id=register(this);
var pipe=supplyPipe(this,_18d);
pipe.attach(id);
var _190=["c",id,toPaddedHex(_18d.length,4),_18d].join("");
pipe.post(_190);
this._id=id;
this._pipe=pipe;
};
var _191=EventSource.prototype;
_191.disconnect=function(){
var pipe=this._pipe;
if(pipe!==undefined){
pipe.post(["a",this._id].join(""));
pipe.detach(this._id);
}
this.readyState=2;
};
function register(_193){
var id=toPaddedHex(_18c++,8);
_18b[id]=_193;
_193._id=id;
return id;
};
function supplyPipe(_195,_196){
var uri=new URI(_196);
var _198=(uri.scheme!=null&&uri.authority!=null);
var _199=_198?uri.scheme:locationURI.scheme;
var _19a=_198?uri.authority:locationURI.authority;
if(_19a!=null&&uri.port==null){
_19a=uri.host+":"+defaultPorts[_199];
}
var _19b=_199+"://"+_19a;
var pipe=_18a[_19b];
if(pipe===undefined){
var _19d=document.createElement("iframe");
_19d.style.position="absolute";
_19d.style.left="-10px";
_19d.style.top="10px";
_19d.style.visibility="hidden";
_19d.style.width="0px";
_19d.style.height="0px";
var _19e=new URI(_19b);
_19e.query=".kr=xse&.kv=10.05";
_19e.path="/";
_19d.src=_19e.toString();
function post(_19f){
this.buffer.push(_19f);
};
function attach(id){
var _1a1=this.attached[id];
if(_1a1===undefined){
_1a1={};
this.attached[id]=_1a1;
}
if(_1a1.timerID!==undefined){
clearTimeout(_1a1.timerID);
delete _1a1.timerID;
}
};
function detach(id){
var _1a3=this.attached[id];
if(_1a3!==undefined&&_1a3.timerID===undefined){
var _1a4=this;
_1a3.timerID=setTimeout(function(){
delete _1a4.attached[id];
postMessage0(pipe.iframe.contentWindow,["d",id].join(""),pipe.targetOrigin);
},10000);
}
};
pipe={"targetOrigin":_19b,"iframe":_19d,"buffer":[],"post":post,"attach":attach,"detach":detach,"attached":{count:0}};
_18a[_19b]=pipe;
function sendInitWhenReady(){
var _1a5=_19d.contentWindow;
if(!_1a5){
setTimeout(sendInitWhenReady,20);
}else{
postMessage0(_1a5,"I",_19b);
}
};
pipe.handshakeID=setTimeout(function(){
_18a[_19b]=undefined;
pipe.post=function(_1a6){
_195.readyState=4;
_195.status=0;
onreadystatechange(_195);
};
if(pipe.buffer.length>0){
pipe.post();
}
},30000);
document.body.appendChild(_19d);
sendInitWhenReady();
}
return pipe;
};
function onmessage(_1a7){
var _1a8=_1a7.origin;
var _1a9={"http":":80","https":":443"};
var _1aa=_1a8.split(":");
if(_1aa.length===2){
_1a8+=_1a9[_1aa[0]];
}
var pipe=_18a[_1a8];
if(pipe!==undefined&&pipe.iframe!==undefined&&_1a7.source==pipe.iframe.contentWindow){
if(_1a7.data=="I"){
clearTimeout(pipe.handshakeID);
var _1ac;
while((_1ac=pipe.buffer.shift())!==undefined){
postMessage0(pipe.iframe.contentWindow,_1ac,pipe.targetOrigin);
}
pipe.post=function(_1ad){
postMessage0(pipe.iframe.contentWindow,_1ad,pipe.targetOrigin);
};
}else{
var _1ac=_1a7.data;
if(_1ac.length>=9){
var _1ae=0;
var type=_1ac.substring(_1ae,_1ae+=1);
var id=_1ac.substring(_1ae,_1ae+=8);
var _1b1=_18b[id];
if(_1b1!==undefined){
switch(type){
case "D":
var _1b2=fromHex(_1ac.substring(_1ae,_1ae+=4));
var name=_1ac.substring(_1ae,_1ae+=_1b2);
var _1b4=fromHex(_1ac.substring(_1ae,_1ae+=4));
var data=_1ac.substring(_1ae,_1ae+=_1b4);
if(data.length>0||(name.length>0&&name!="message")){
var e=document.createEvent("Events");
e.initEvent(name,true,true);
e.lastEventId=_1b1.lastEventId;
e.data=data;
e.origin=_1b1.origin;
if(typeof (_1b1.onmessage)==="function"){
_1b1.onmessage(e);
}
}
break;
case "O":
_1b1.readyState=1;
_1b1.onopen();
break;
case "E":
if(_1b1._id===id){
_1b1.onerror();
}
break;
}
}
}
}
}else{
}
};
function fromHex(_1b7){
return parseInt(_1b7,16);
};
function toPaddedHex(_1b8,_1b9){
var hex=_1b8.toString(16);
var _1bb=[];
_1b9-=hex.length;
while(_1b9-->0){
_1bb.push("0");
}
_1bb.push(hex);
return _1bb.join("");
};
window.addEventListener("message",onmessage,false);
return EventSource;
})();
}
