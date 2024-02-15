sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, MessageBox, JSONModel) {
	"use strict";

	return Controller.extend("sbin.oi.controller.LoginView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sbin.oi.view.LoginView
		 */
		onInit: function () {
			var oModel = new JSONModel({
				username: "",
				password: ""
			});
			this.getView().setModel(oModel, "loginModel");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		},
		onLoginPress: function () {
				var oModel = this.getView().getModel("loginModel");
				var username = oModel.getProperty("/User");
				var password = oModel.getProperty("/Password");
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				var that = this;
				// Perform backend login request using AJAX
				jQuery.ajax({
					type: "POST",
					url: "https://demo-rudrani.glitch.me/userTable",
					contentType: "application/json",
					data: JSON.stringify({
						"User": username,
						"Password": password
					}),
					success: function (data) {
						// Handle successful login
						// MessageToast.show("Login successful");
						if (data.success) {
							// Handle successful login 
							MessageToast.show("Login successful");
							//TODO
							 // Hide the login page
				                // var oLoginPage = that.getView().byId("Login_Page");
				                // if (oLoginPage) {
				                //     oLoginPage.setVisible(false);
				                // }
				     
							var oLayout = "MidColumnFullScreen"
							oRouter.navTo("master", {layout: oLayout, user: username});
							//var oRouter = this.getRouter();
							// Navigate to the view2 route

						} else {
							MessageBox.error("Login failed: " + data.error);
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						// Handle login error
						MessageBox.error("Login failed: " + errorThrown);
					}
				});
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf sbin.oi.view.LoginView
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf sbin.oi.view.LoginView
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf sbin.oi.view.LoginView
		 */
		//	onExit: function() {
		//
		//	}

	});

});