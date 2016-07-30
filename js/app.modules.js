(function(){
  'use strict';

  angular.module('common.services', []);
  angular.module('myApp.controllers', ['common.directives']);
  angular.module('common.directives', ['common.services']);
})();
