define(["backbone","underscore"],function(e,t){typeof Object.create!="function"&&(Object.create=function(e){function t(){}return t.prototype=e,new t});var n=e.Model.extend({constructor:function(n,r){var i={};t.each(n,function(e,n){if(t.isObject(e)){var r=Object.create(e),s=this.defaults&&this.defaults[n]&&t.isObject(this.defaults[n])?this.defaults[n]:{};i[n]=t.defaults(r,s)}else i[n]=e},this),e.Model.apply(this,[i,r])}});return n});