/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comleaveplanner/leave_planner/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
