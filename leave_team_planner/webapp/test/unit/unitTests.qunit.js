/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comibsleave/leave_team_planner/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
