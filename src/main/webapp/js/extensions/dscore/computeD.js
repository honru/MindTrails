define(["jquery","app/API"],function(e,t){var n={dataArray:{},AnalyzedVar:"latency",ErrorVar:"error",condVar:"",cond1VarValues:[],cond2VarValues:[],parcelVar:"",parcelValue:[],fastRT:300,maxFastTrialsRate:.1,minRT:400,maxRT:1e4,maxErrorParcelRate:.4,errorLatency:{use:"latency",penalty:600,useForSTD:!0},postSettings:{}};return e.extend(n,{setComputeObject:function(t){e.extend(this,t)},setDataArray:function(){this.dataArray=t.getLogs()}}),n});