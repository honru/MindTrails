/*!
 * PIPlayer v0.2.0
 *  License
 */

define("extensions/iat/data/properties",[],function(){return{DEBUG:!0,font:"Arial",fontSize:"2em",fontColor:"#31b404",defaultStimulus:{},instructionsStimulus:{css:{"font-size":"1.3em",color:"black",lineHeight:1.2,"text-align":"left",margin:"25px"}},background:"#EEEEEE",canvas:{maxWidth:800,proportions:.8},left:"e",right:"i",leftTouch:undefined,rightTouch:undefined,notouch:!0,timeout:0,randomize_order:!0,IATversion:"long",inter_trial_interval:500,post_instructions_interval:500,correct_errors:!0,error_feedback:{active:!0,media:"X",duration:"static"},correct_feedback:{active:!1,media:"OK",duration:300},timeout_feedback:{active:!0,media:"X",duration:500},simpleLayout:!0,separatorColor:"black",separator:{media:"or",height:5,css:{fontSize:"1.2em"}},pulse:20,images_base_url:"",templates_base_url:"extensions/iat/jst"}}),define("extensions/iat/data/categories",[],function(){return{}}),define("extensions/iat/trial/input_decorator",["../data/properties"],function(e){var t=function(n){var r=n.input,i=n.interactions;e.DEBUG&&r.push({handle:"enter",on:"enter"});switch(typeof e.left){case"undefined":r.push({handle:"left",on:"keypressed",key:"e"});break;case"string":case"number":r.push({handle:"left",on:"keypressed",key:e.left});break;default:e.left.handle="left",r.push(e.left)}switch(typeof e.right){case"undefined":r.push({handle:"right",on:"keypressed",key:"i"});break;case"string":case"number":r.push({handle:"right",on:"keypressed",key:e.right});break;default:e.right.handle="right",r.push(e.right)}if(!e.notouch){switch(typeof e.leftTouch){case"undefined":r.push({handle:"left",on:"leftTouch",touch:!0});break;default:r.push({handle:"left",on:"click",element:e.leftTouch,touch:!0})}switch(typeof e.rightTouch){case"undefined":r.push({handle:"right",on:"rightTouch",touch:!0});break;default:r.push({handle:"right",on:"click",element:e.rightTouch,touch:!0})}}return e.timeout&&(r.push({handle:"timeout",on:"timeout",duration:e.timeout}),i.push({conditions:[{type:"inputEquals",value:"timeout"}],actions:[{type:"removeInput",handle:["left","right"]},{type:"setTrialAttr",setter:{score:9}},{type:"log"},{type:"trigger",handle:"timeout_feedback"}]})),n};return t}),define("extensions/iat/trial/feedback_decorator",["../data/properties"],function(e){var t=function(t){var n=["correct","error","timeout"],r=t.interactions;for(var i=0;i<n.length;i++){var s=n[i]+"_feedback",o=e[s]||{};o.active?r.push({conditions:[{type:"inputEquals",value:s}],actions:[{type:"showStim",handle:s},{type:"setInput",input:{handle:"remove_"+s,on:"timeout",duration:o.duration>=0?o.duration:300}}]}):r.push({conditions:[{type:"inputEquals",value:s}],actions:[{type:"trigger",handle:"remove_"+s}]}),s!=="error_feedback"||!e.correct_errors?r.push({conditions:[{type:"inputEquals",value:"remove_"+s}],actions:[{type:"trigger",handle:"end"}]}):o.duration!=="static"&&r.push({conditions:[{type:"inputEquals",value:"remove_"+s}],actions:[{type:"hideStim",handle:s}]})}return t};return t}),define("extensions/iat/trial/default",["../data/properties","./input_decorator","./feedback_decorator"],function(e,t,n){function r(){var r={data:{score:0},input:[],layout:[{inherit:{type:"byData",set:"layout",data:"left"}},{inherit:{type:"byData",set:"layout",data:"right"}}],interactions:[{conditions:[{type:"begin"}],actions:[{type:"showStim",handle:"target"}]},{conditions:[{type:"inputEqualsStim",property:"side",handle:"target"}],actions:[{type:"removeInput",handle:["left","right","timeout"]},{type:"hideStim",handle:"error_feedback"},{type:"log"},{type:"trigger",handle:"correct_feedback"}]},{conditions:[{type:"inputEquals",value:"end"}],actions:[{type:"hideStim",handle:"All"},{type:"setInput",input:{handle:"endTrial",on:"timeout",duration:e.inter_trial_interval||0}}]},{conditions:[{type:"inputEquals",value:"endTrial"}],actions:[{type:"endTrial"}]},{conditions:[{type:"inputEquals",value:"enter"}],actions:[{type:"goto",destination:"nextWhere",properties:{blockStart:!0}},{type:"endTrial"}]}],stimuli:[]},i={conditions:[{type:"inputEqualsStim",property:"side",handle:"target",negate:!0},{type:"inputEquals",value:["right","left"]}],actions:[{type:"trigger",handle:"error_feedback"},{type:"setTrialAttr",setter:{score:1}}]};return e.correct_errors||i.actions.unshift({type:"removeInput",handle:["left","right","timeout"]}),r.interactions.push(i),n(r),t(r),r}return r}),define("extensions/iat/stimuli/separator",["../data/properties"],function(e){return function(n,r){var i=e.separator,s={media:i.media,css:i.css||{color:"black"}},o=i.margin||0;switch(n){case"left":s.location={left:2+o,top:r};break;case"right":s.location={right:2+o,top:r};break;case"center":s.location={top:r}}return s}}),define("extensions/iat/stimuli/category",["../data/categories"],function(e){return function(n,r,i){var s=e[n],o=s.margin||0;if(!s)throw new Error(n+" is not a category name (or has not been loaded yet)");var u=s.title||s.name,a={media:u,css:s.titleCss||{fontSize:"1.3em",color:"black"},height:s.height||5};switch(r){case"left":a.location={left:2+o,top:i};break;case"right":a.location={right:2+o,top:i};break;case"center":a.location={top:i};break;default:throw new Error("Unknow side in category")}return a}}),define("extensions/iat/trial/layout",["underscore","../data/properties","../stimuli/separator","../stimuli/category"],function(e,t,n,r){var i=function(s){var o=[];return e.each(s,function(i,s){var u=2;e.each(i,function(i,a){var f,l;a>0&&e.isObject(t.separator)&&(f=new n(s,u),o.push(f),u+=t.separator.height||4),l=new r(i,s,u),o.push(l),u+=l.height})}),o};return i}),define("extensions/iat/trial/simple_layout",["underscore","../data/properties","../data/categories"],function(e,t,n){var r=function(i){var s=[];return e.each(i,function(r,i){var o={media:{template:"layout.jst"},data:{separatorColor:t.separatorColor}},u=o.data;switch(i){case"left":o.location={left:2,top:2};break;case"right":o.location={right:2,top:2};break;default:throw new Error("Unknow side")}e.each(r,function(t){var i=t.replace(/[0-9]/g,""),s=n[t],o=e.isObject(s.title)?s.title.word:s.title;if(!o)throw new Error("We are missing a title for "+r+". are you using an advanced media type by any chance?");u[i]=o,s.titleColor&&(u[i+"Color"]=s.titleColor),s.titleSize&&(u[i+"Size"]=s.titleSize)}),s.push(o)}),s};return r}),define("extensions/iat/trial/IATlayout",["../data/properties","./layout","./simple_layout"],function(e,t,n){var r={1:{left:["concept1"],right:["concept2"]},2:{left:["attribute1"],right:["attribute2"]},3:{left:["attribute1","concept1"],right:["attribute2","concept2"]},4:{left:["attribute1","concept1"],right:["attribute2","concept2"]},5:{left:["concept2"],right:["concept1"]},6:{left:["attribute1","concept2"],right:["attribute2","concept1"]},7:{left:["attribute1","concept2"],right:["attribute2","concept1"]}};return function(i){return e.simpleLayout?n(r[i]):t(r[i])}}),define("extensions/iat/trial/instructions",["underscore","../data/properties","../data/categories","./IATlayout"],function(e,t,n,r){function i(){var e={data:{block:"generic"},input:[{handle:"space",on:"space"},{handle:"enter",on:"enter"}],interactions:[{conditions:[{type:"begin"}],actions:[{type:"showStim",handle:"All"}]},{conditions:[{type:"inputEquals",value:"space"}],actions:[{type:"hideStim",handle:"All"},{type:"setInput",input:{handle:"endTrial",on:"timeout",duration:t.post_instructions_interval||0}}]},{conditions:[{type:"inputEquals",value:"endTrial"}],actions:[{type:"endTrial"}]},{conditions:[{type:"inputEquals",value:"enter"}],actions:[{type:"goto",destination:"nextWhere",properties:{blockStart:!0}},{type:"endTrial"}]}]};return t.notouch||e.input.push({handle:"space",on:"bottomTouch",touch:!0}),e}function o(){var t=i(),o=[t],u,a,f;for(var l=1;l<=7;l++)f=s[l]||{},u={data:{block:l},layout:r(l),inherit:{set:"instructions",type:"byData",data:{block:"generic"}}},a={inherit:"instructions",media:{template:"inst"+l+".jst"}},f.media&&(a.media=f.media),f.template&&(a.media={inlineTemplate:f.template}),f.css&&(a.css=f.css),f.extend&&e.extend(u,f.extend),u.stimuli=[a],o.push(u);return e.each(n,function(e,n){t.data[n]=e.name,t.data[n+"Color"]=e.titleColor}),o}var s=[];return function(t,n){if(!arguments.length)return o();s[t]=n}}),define("extensions/iat/trial/trials",["../data/categories","./default","./instructions","./IATlayout"],function(e,t,n,r){return function(){var s={},o=e.attribute1.name,u=e.attribute1.name,a=e.concept1.name,f=e.concept2.name;return s.Default=[t()],s.instructions=n(),s.IAT=[{data:{block:1,condition:a+"/"+f},layout:r(1),inherit:"Default",stimuli:[{inherit:{type:"exRandom",set:"concept1_left"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}}]},{data:{block:2,condition:o+"/"+u},layout:r(2),inherit:"Default",stimuli:[{inherit:{type:"exRandom",set:"attribute1_left"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}}]},{data:{block:3,row:1,condition:o+","+a+"/"+u+","+f,parcel:"first"},layout:r(3),inherit:"Default",stimuli:[{inherit:{type:"exRandom",set:"concept1_left"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}}]},{data:{block:3,row:2,condition:o+","+a+"/"+u+","+f,parcel:"first"},layout:r(3),inherit:"Default",stimuli:[{inherit:{type:"exRandom",set:"attribute1_left"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}}]},{data:{block:4,row:1,condition:o+","+a+"/"+u+","+f,parcel:"first"},layout:r(4),inherit:"Default",stimuli:[{inherit:{type:"exRandom",set:"concept1_left"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}}]},{data:{block:4,row:2,condition:o+","+a+"/"+u+","+f,parcel:"first"},layout:r(4),inherit:"Default",stimuli:[{inherit:{type:"exRandom",set:"attribute1_left"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}}]},{data:{block:5,condition:f+"/"+a},layout:r(5),inherit:"Default",stimuli:[{inherit:{type:"exRandom",set:"concept1_right"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}}]},{data:{block:6,row:1,condition:o+","+f+"/"+u+","+a,parcel:"first"},layout:r(6),inherit:"Default",stimuli:[{inherit:{type:"exRandom",set:"concept1_right"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}}]},{data:{block:6,row:2,condition:o+","+f+"/"+u+","+a,parcel:"first"},layout:r(6),inherit:"Default",stimuli:[{inherit:{type:"exRandom",set:"attribute1_left"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}}]},{data:{block:7,row:1,condition:o+","+f+"/"+u+","+a,parcel:"first"},layout:r(7),inherit:"Default",stimuli:[{inherit:{type:"exRandom",set:"concept1_right"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}}]},{data:{block:7,row:2,condition:o+","+f+"/"+u+","+a,parcel:"first"},layout:r(7),inherit:"Default",stimuli:[{inherit:{type:"exRandom",set:"attribute1_left"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}},{inherit:{type:"exRandom",set:"feedback"}}]}],s}}),define("extensions/iat/stimuli/stimuli",["underscore","../data/properties","../data/categories"],function(e,t,n){return function(){var i={},s,o;s=t.defaultStimulus,s.css=e.defaults(s.css||{},{font:t.font,fontSize:t.fontSize,color:t.fontColor}),i.Default=[s],i.instructions=[t.instructionsStimulus],i.attribute1=[e.extend(n.attribute1.stimulus||{},{inherit:"Default",css:n.attribute1.css||s.css})],i.attribute2=[e.extend(n.attribute2.stimulus||{},{inherit:"Default",css:n.attribute2.css||s.css})],i.concept1=[e.extend(n.concept1.stimulus||{},{inherit:"Default",css:n.concept1.css||s.css})],i.concept2=[e.extend(n.concept2.stimulus||{},{inherit:"Default",css:n.concept2.css||s.css})],e.extend(i,{attribute1_left:[],attribute1_right:[],concept1_left:[],concept1_right:[]});for(var u=0;u<5;u++)i.attribute1_left=i.attribute1_left.concat([{data:{side:"left",handle:"target",alias:n.attribute1.name},inherit:"attribute1",media:{inherit:{type:"exRandom",set:"attribute1"}}},{data:{side:"right",handle:"target",alias:n.attribute2.name},inherit:"attribute2",media:{inherit:{type:"exRandom",set:"attribute2"}}}]),i.attribute1_right=i.attribute1_right.concat([{data:{side:"left",handle:"target",alias:n.attribute2.name},inherit:"attribute2",media:{inherit:{type:"exRandom",set:"attribute2"}}},{data:{side:"right",handle:"target",alias:n.attribute1.name},inherit:"attribute1",media:{inherit:{type:"exRandom",set:"attribute1"}}}]),i.concept1_left=i.concept1_left.concat([{data:{side:"left",handle:"target",alias:n.concept1.name},inherit:"concept1",media:{inherit:{type:"exRandom",set:"concept1"}}},{data:{side:"right",handle:"target",alias:n.concept2.name},inherit:"concept2",media:{inherit:{type:"exRandom",set:"concept2"}}}]),i.concept1_right=i.concept1_right.concat([{data:{side:"left",handle:"target",alias:n.concept2.name},inherit:"concept2",media:{inherit:{type:"exRandom",set:"concept2"}}},{data:{side:"right",handle:"target",alias:n.concept1.name},inherit:"concept1",media:{inherit:{type:"exRandom",set:"concept1"}}}]);return o={correct:{handle:"correct_feedback",location:{top:80},css:{color:"green","font-size":"4em"},media:{word:"OK"},nolog:!0},error:{handle:"error_feedback",location:{top:80},css:{color:"red","font-size":"4em"},media:{word:"X"},nolog:!0},timeout:{handle:"timeout_feedback",location:{top:80},css:{color:"red","font-size":"4em"},media:{word:"X"},nolog:!0}},i.feedback=[],e.each(["correct","error","timeout"],function(e){var n=o[e];t[e+"_feedback"].css&&(n.css=t[e+"_feedback"].css),t[e+"_feedback"].media&&(n.media=t[e+"_feedback"].media),i.feedback.push(n)}),i}}),define("extensions/iat/data/sequence",["./properties"],function(e){function n(t,n){return e.trialsPerBlock&&typeof e.trialsPerBlock[t]=="number"?e.trialsPerBlock[t]:n}function r(){var r=[],i=[];return t(r,{block:1,part:1,trials:n(1,20),twoRows:!1}),t(r,{block:2,part:2,trials:n(2,20),twoRows:!1}),t(r,{block:3,part:3,trials:n(3,20),twoRows:!0}),t(r,{block:4,part:4,trials:n(4,40),twoRows:!0}),t(r,{block:5,part:5,trials:n(5,40),twoRows:!1}),t(r,{block:6,part:6,trials:n(6,20),twoRows:!0}),t(r,{block:7,part:7,trials:n(7,40),twoRows:!0}),t(i,{block:5,part:1,trials:n(5,20),twoRows:!1}),t(i,{block:2,part:2,trials:n(2,20),twoRows:!1}),t(i,{block:6,part:3,trials:n(6,20),twoRows:!0}),t(i,{block:7,part:4,trials:n(7,40),twoRows:!0}),t(i,{block:1,part:5,trials:n(1,40),twoRows:!1}),t(i,{block:3,part:6,trials:n(3,20),twoRows:!0}),t(i,{block:4,part:7,trials:n(4,40),twoRows:!0}),e.randomize_order?r:[{mixer:"choose",data:[{mixer:"wrapper",data:r},{mixer:"wrapper",data:i}]}]}function i(){var r=[],i=[];return t(r,{block:1,part:1,trials:n(1,20),twoRows:!1}),t(r,{block:2,part:2,trials:n(2,20),twoRows:!1}),t(r,{block:3,part:3,trials:n(3,50),twoRows:!0}),t(r,{block:5,part:4,trials:n(5,30),twoRows:!1}),t(r,{block:6,part:5,trials:n(6,50),twoRows:!0}),t(i,{block:5,part:1,trials:n(5,20),twoRows:!1}),t(i,{block:2,part:2,trials:n(2,20),twoRows:!1}),t(i,{block:6,part:3,trials:n(6,50),twoRows:!0}),t(i,{block:1,part:4,trials:n(1,30),twoRows:!1}),t(i,{block:3,part:5,trials:n(3,50),twoRows:!0}),e.randomize_order?r:[{mixer:"choose",data:[{mixer:"wrapper",data:r},{mixer:"wrapper",data:i}]}]}var t=function(n,r){n.push({data:{block:r.block,part:r.part,IATversion:e.IATversion,blockStart:!0},inherit:{set:"instructions",type:"byData",data:{block:r.block}}}),n.push({mixer:"repeat",times:r.twoRows?Math.floor(r.trials/2):r.trials,data:r.twoRows?[{inherit:{type:"byData",data:{block:r.block,row:1},set:"IAT"}},{inherit:{type:"byData",data:{block:r.block,row:2},set:"IAT"}}]:[{inherit:{type:"byData",data:{block:r.block},set:"IAT"}}]})};return function(){return e.IATversion=="short"?i():r()}}),define("extensions/iat/component",["require","underscore","app/API","./data/properties","./data/categories","./trial/trials","./trial/instructions","./stimuli/stimuli","./data/sequence"],function(e){var t=e("underscore"),n=e("app/API"),r=e("./data/properties"),i=e("./data/categories"),s=e("./trial/trials"),o=e("./trial/instructions"),u=e("./stimuli/stimuli"),a=e("./data/sequence"),f=n.play;return t.extend(n,{setProperties:function(n){t.extend(r,n)},setCategory:function(r,s){var o=["concept1","concept2","attribute1","attribute2"];if(t.indexOf(o,r)===-1)throw new Error(r+" is not a valid category name, please use one of the folowing: 'concept1','concept2', 'attribute1', 'attribute2'.");s.name||(s.name=r),s.title||(s.title=s.name);if(!s.media||!s.media.length)throw new Error("You must supply a media list for "+r);n.addMediaSets(r,s.media),i[r]=s},setInstructions:function(){o.apply(this,arguments)},play:function(){n.addSettings("canvas",t.defaults(r.canvas,{background:r.background,canvasBackground:r.background})),n.addSettings("base_url",{image:r.images_base_url,template:r.templates_base_url}),n.addSettings("logger",{pulse:r.pulse,url:r.post_url}),n.addSettings("redirect",r.next_url),n.addTrialSets(s()),n.addStimulusSets(u()),n.addSequence(a()),f.apply(this)}}),n}),define("extensions/iat/data/iatScorer",["underscore","extensions/dscore/Scorer","./properties","./categories"],function(e,t,n,r){return function(){var i=r.attribute1.name,s=r.attribute1.name,o=r.concept1.name,u=r.concept2.name,a={ErrorVar:"score",condVar:"condition",cond1VarValues:[i+","+o+"/"+s+","+u],cond2VarValues:[i+","+u+"/"+s+","+o],parcelVar:"parcel",parcelValue:["first"],fastRT:150,maxFastTrialsRate:.1,minRT:400,maxRT:1e4,errorLatency:{use:"latency",penalty:600,useForSTD:!0},postSettings:{score:"score",msg:"feedback",url:"/implicit/scorer"}},f=[{cut:"-0.65",message:"Your data suggest a strong implicit preference for "+u+" compared to "+o},{cut:"-0.35",message:"Your data suggest a moderate implicit preference for "+u+" compared to "+o},{cut:"-0.15",message:"Your data suggest a slight implicit preference for "+u+" compared to "+o},{cut:"0",message:"Your data suggest little to no difference in implicit preference between "+u+" and "+o},{cut:"0.15",message:"Your data suggest a slight implicit preference for "+o+" compared to "+u},{cut:"0.35",message:"Your data suggest a moderate implicit preference for "+o+" compared to "+u},{cut:"0.65",message:"Your data suggest a strong implicit preference for "+o+" compared to "+u}];return t.addSettings("compute",e.defaults(n.scorerObj||{},a)),t.addSettings("message",{messageDef:n.scorerMessage||f}),t}}),define("extensions/iat/PIcomponent",["require","underscore","./component","./data/iatScorer"],function(e){var t=e("underscore"),n=e("./component"),r=e("./data/iatScorer"),i=n.play;return n.setProperties({post_url:"/implicit/PiPlayerApplet"}),t.extend(n,{play:function(){var t=r();n.addSettings("hooks",{endTask:function(){var e=t.computeD();t.postToServer(e.DScore,e.FBMsg,"score","feedback").always(function(){top.location.href="/implicit/Study?tid="+xGetCookie("tid")})}}),i.apply(this)}}),n}),define("text!extensions/iat/jst/layout.jst",[],function(){return"<div>\n	<% if (stimulusData.attribute) { %>\n		<span style=\"color:<%= stimulusData.attributeColor || '#31b404' %>; font-size:<%= stimulusData.attributeSize || '1.3em'%>\"><%= stimulusData.attribute%></span>\n	<%}%>\n	<% if (stimulusData.attribute && stimulusData.concept) { %>\n		</br>\n		<span style=\"color:<%= stimulusData.separatorColor %>\">or</span>\n		</br>\n	<%}%>\n	<% if (stimulusData.concept) { %>\n		<span style=\"color:<%= stimulusData.conceptColor || '#0000FF' %>; font-size:<%= stimulusData.conceptSize || '1.3em'%>\"><%= stimulusData.concept%></span>\n	<%}%>\n</div>"});