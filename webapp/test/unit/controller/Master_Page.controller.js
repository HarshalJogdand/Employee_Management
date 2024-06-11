/*global QUnit*/

sap.ui.define([
	"comibspl/employee_task_management/controller/Master_Page.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Master_Page Controller");

	QUnit.test("I should test the Master_Page controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
