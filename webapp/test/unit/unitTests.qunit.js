/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comibspl/employee_task_management/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
