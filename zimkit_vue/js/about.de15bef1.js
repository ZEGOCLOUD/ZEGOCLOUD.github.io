(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["about"],{1969:function(t,e,n){"use strict";n("c354")},a55b:function(t,e,n){"use strict";n.r(e);var o=function(){var t=this,e=t._self._c;t._self._setupProxy;return e("div",{staticClass:"login-con"},[e("div",{staticClass:"login"},[e("div",{staticClass:"login-box"},[e("div",{staticClass:"welcome-box"},[e("div",{staticClass:"welcome-text"},[t._v(t._s(t.$t("demo_welcome")))])]),e("div",{staticClass:"form",class:{"en-form":t.lang.includes("en")}},[e("div",{staticClass:"id"},[e("div",{staticClass:"label"},[t._v(t._s(t.$t("demo_user_id_login")))]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.userID,expression:"userID"}],class:{"en-input":t.lang.includes("en")},attrs:{placeholder:t.$t("demo_input_placeholder_w")},domProps:{value:t.userID},on:{input:[function(e){e.target.composing||(t.userID=e.target.value)},t.handleUserIdChange]}}),t.errTip?e("div",{staticClass:"login-err-tip"},[t._v(t._s(t.$t("demo_input_user_id_error_tips")))]):t._e()]),e("div",{staticClass:"name"},[e("div",{staticClass:"label"},[t._v(t._s(t.$t("demo_user_name_w")))]),e("div",{staticClass:"user-name"},[t._v(t._s(t.userName))])]),e("button",{staticClass:"login-btn",attrs:{disabled:t.loginDisabled},on:{click:t.loginFun}},[e("div",{directives:[{name:"show",rawName:"v-show",value:t.loading,expression:"loading"}],staticClass:"loading"}),t._v(" "+t._s(t.$t("demo_login"))+" ")])])])])])},r=[],i=(n("d9e2"),n("f8c9"),n("14d9"),n("1b40")),a=n("f87a"),s=n("3356"),c=n("f00f"),u=n("206b"),l=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},t(e,n)};return function(e,n){if("function"!==typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),p=function(t,e,n,o){var r,i=arguments.length,a=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)a=Reflect.decorate(t,e,n,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(i<3?r(a):i>3?r(e,n,a):r(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a},f=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.userID="",e.userName="",e.errTip=!1,e.loginDisabled=!0,e.lang=navigator.language,e.loading=!1,e}return l(e,t),e.prototype.beforeMount=function(){this.userName=Object(c["e"])("").userName},e.prototype.handleUserIdChange=function(t){var e=t.target.value;e.length?(this.userName=Object(c["e"])(e).userName,e.length<6||e.length>12?(this.errTip=!0,this.loginDisabled=!0):(this.loginDisabled=!1,this.errTip=!1)):(this.errTip=!1,this.loginDisabled=!0)},e.prototype.loginFun=function(){var t=this;if(u["a"].tokenURL)Object(s["a"])(this.userID,u["a"]).then((function(e){t.zimKitLogin(e)}));else{var e=a["a"].getInstance().generateKitTokenForTest(u["a"].appID,u["a"].serverSecret,this.userID);this.zimKitLogin(e)}},e.prototype.zimKitLogin=function(t){var e=this;this.loginDisabled=!0,this.loading=!0;var n={userID:this.userID,userName:this.userName,userAvatarUrl:Object(c["c"])(this.userID)};a["a"].getInstance().connectUser(n,t).then((function(){e.loginDisabled=!1,e.loading=!1,Object(c["f"])(n),Object(c["a"])(n),e.$router.push({name:"Main"})})).catch((function(t){console.log("kitlog login err",t),e.errTip=!0,e.loginDisabled=!0,e.loading=!1}))},e=p([Object(i["a"])({})],e),e}(i["c"]),g=f,d=g,h=(n("1969"),n("2877")),v=Object(h["a"])(d,o,r,!1,null,"5ef7f128",null);e["default"]=v.exports},c1d9:function(t,e,n){"use strict";n("d666")},c354:function(t,e,n){},cd56:function(t,e,n){"use strict";n.r(e);var o=function(){var t=this,e=t._self._c;t._self._setupProxy;return e("div",{staticClass:"main"},[e("Common")],1)},r=[],i=(n("d9e2"),n("f8c9"),n("14d9"),n("1b40")),a=n("e2ca"),s=n("1601"),c=n("06e8"),u=n("0151"),l=n("f87a"),p=n("f00f"),f=n("83bc"),g=n("56b9"),d=n("f377"),h=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},t(e,n)};return function(e,n){if("function"!==typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),v=function(t,e,n,o){var r,i=arguments.length,a=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)a=Reflect.decorate(t,e,n,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(i<3?r(a):i>3?r(e,n,a):r(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a},b=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.showGroupUI=!1,e}return h(e,t),e.prototype.beforeMount=function(){l["a"].getInstance().on("connectionStateChanged",this.onConnectionStateChange()),l["a"].getInstance().on("loggedStateChanged",this.onLogout())},e.prototype.mounted=function(){var t=this;g["a"].on("groupUIOperation",(function(e){t.showGroupUI=!e&&!t.showGroupUI})),l["a"].getInstance().isLoggedIn||(this.$router.push({name:"Login"}),Object(p["b"])())},e.prototype.createGroupChat=function(t,e){l["a"].getInstance().createGroup(t,e).then((function(t){console.log("===data",t);var e=t.groupInfo,n=t.errorUserList,o=e.baseInfo;if(n.length);else{var r=o.groupID;f["a"].getInstance().initWithConversationID(r,d["a"].ZIMKitConversationTypeGroup)}})).catch((function(t){}))},e.prototype.showPeerChat=function(){var t="aaavue";f["a"].getInstance().initWithConversationID(t,d["a"].ZIMKitConversationTypePeer)},e.prototype.showGroup=function(){var t="";f["a"].getInstance().initWithConversationID(t,d["a"].ZIMKitConversationTypeGroup)},e.prototype.beforeDestroy=function(){l["a"].getInstance().off("connectionStateChanged",this.onConnectionStateChange()),l["a"].getInstance().off("loggedStateChanged",this.onLogout())},e.prototype.onConnectionStateChange=function(){var t=this;return function(e){(0===e.state&&4===e.event||0===e.state&&0===e.event)&&(t.$router.push({name:"Login"}),Object(p["b"])())}},e.prototype.onLogout=function(){var t=this;return function(e){e||(t.$router.push({name:"Login"}),Object(p["b"])())}},e=v([Object(i["a"])({components:{Common:a["a"],Conversation:s["a"],Message:c["a"],Group:u["a"]}})],e),e}(i["c"]),_=b,y=_,m=(n("c1d9"),n("2877")),C=Object(m["a"])(y,o,r,!1,null,"3cc23c5f",null);e["default"]=C.exports},d666:function(t,e,n){}}]);