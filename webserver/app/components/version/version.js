'use strict';

angular.module('tys.version', [
  'tys.version.interpolate-filter',
  'tys.version.version-directive'
])

.value('version', '0.1');
