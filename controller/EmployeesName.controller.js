sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/export/library",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast",
	'sap/m/ColumnListItem',
	'sap/m/Input',
	'sap/m/CheckBox',
	'sap/m/Text',
	'sap/base/util/deepExtend',
	"sap/m/MessageBox"
], function (Controller, History, Filter, FilterOperator, exportLibrary, Spreadsheet, MessageToast, ColumnListItem, Input, CheckBox, Text,
	deepExtend, MessageBox) {
	"use strict";
	var EdmType = exportLibrary.EdmType;
	return Controller.extend("sbin.oi.controller.EmployeesName", {
		onInit: function () {
			// Disable multi-selection mode
			this.getView().byId("Emp_Table").setMode("None");
			var oOwnerComponent = this.getOwnerComponent();

			this.oRouter = oOwnerComponent.getRouter();
			this.oModel = oOwnerComponent.getModel();

			this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("EmployeesName").attachPatternMatched(this._onProductMatched, this);

		},
		onAfterRendering: function () {
			this.oTable = this.getView().byId("Emp_Table");
			//this.oReadOnlyTemplate = this.byId("Emp_Table").getItems[0];
			this.oReadOnlyTemplate = new ColumnListItem({
				cells: [
					new Text({
						text: "{MainModel>ID}"
					}),
					new Text({
						text: "{MainModel>name}"
					}),
					new Text({
						text: "{MainModel>address}"
					}),
					new Text({
						text: "{MainModel>phoneNo}"
					})
				]
			});

			this.rebindTable(this.oReadOnlyTemplate, "Navigation");
			this.oEditableTemplate = new ColumnListItem({
				cells: [
				
					new Input({
						value: "{MainModel>ID}"
					}),
					new Input({
						value: "{MainModel>name}"
					}),
					new Input({
						value: "{MainModel>address}"
					}),
						new Input({
						value: "{MainModel>phoneNo}"
					})
					//for future version
					// new CheckBox({
					// 	text: "",
					// 	valueState: "{= ${MainModel>DELIMITED} ? 'Error' : 'Information' }",
					// 	selected: "{MainModel>DELIMITED}"
					// })
				]
			});
		},
		//for future version
		// onDelimitedChange: function () {
		// 	this.onFilterItems();
		// },
		rebindTable: function (oTemplate, sKeyboardMode) {
			//for future version
			// var oDefaultFilter = [new Filter("DELIMITED", FilterOperator.EQ, this.getOwnerComponent().getModel("MainModel").getProperty(
			// 	"/bShowInventoryDelimited"))];
			this.oTable.bindItems({
				path: "MainModel>/Employees",
				filters: [],
				template: oTemplate,
				templateShareable: true,
				key: "ID"
			});
		},

		createColumnConfig: function () {
			var aCols = [];

			aCols.push({
				label: 'ID',
				property: 'ID',
				type: EdmType.Number,
				template: '{0}, {1}'
			});

			aCols.push({
				label: 'Name',
				type: EdmType.String,
				property: 'name',
				scale: 0
			});

			aCols.push({
				label: 'Address',
				property: 'address',
				type: EdmType.String
			});

			aCols.push({
				label: 'Phone No',
				property: 'phoneNo',
				type: EdmType.Number
			});
			return aCols;
		},

		updateTableData: function (oData) {
			var that = this;
			$.ajax({
				url: "https://demo-rudrani.glitch.me/employee",
				type: "PUT",
				contentType: "application/json",
				data: JSON.stringify(oData),
				success: function () {
					console.log("Update successful");
					sap.m.MessageToast.show("Update Successful!");
					that.getOwnerComponent().getModel("MainModel").setProperty("/bEditMode", false);
					that.rebindTable(that.oReadOnlyTemplate, "Navigation");
				},
				error: function (oError) {
					console.error("Update failed", oError);
				}
			});
		},

		onEdit: function (oEvent) {
			this.aProductCollection = deepExtend([], this.oModel.getProperty("/Employees"));
			this.getView().byId("Emp_Table").setMode("None");
			var that = this;
			this.getOwnerComponent().getModel("MainModel").setProperty("/bEditMode", true);
			that.getView().getModel("newModel").setProperty("/add", true);
			that.getView().getModel("newModel").setProperty("/delete", true);
			that.getView().getModel("newModel").setProperty("/editable", true);
			this.rebindTable(this.oEditableTemplate, "Edit");
			// 	this.rebindTable(this.oEditableTemplate, "Edit");
			// var aData = oModel.getProperty("/employee");
			// var oEntry = {
			// 	"ID": "",
			// 	"Items": "",
			// 	"Price": 0,
			// 	"Qty": 0,
			// 	"Reorder_Qty": 0
			// };
			// aData.push(oEntry);
			// oModel.setProperty("/employee", aData);
			// oModel.refresh(true);
			// oTable.getItems()[oTable.getItems().length - 1].getCells()[0].focus()

			// var oUpdatedData = {
			//     ID: "ID",
			//     Items: "Items",
			//     Price: "Price",
			//     Qty: "Qty",
			//     Reorder_Qty: "Reorder_Qty"
			//   };

			//this.updateTableData(oUpdatedData);

		},

		
		onSave: function (oEvent) {
			var oModel = this.getOwnerComponent().getModel("MainModel");
			var oTable = this.getView().byId("Emp_Table");
			var sBindingPath = oTable.getBinding("items").getPath();
			var aData = oModel.getProperty(sBindingPath);
			this.updateTableData(aData);
			oModel.setProperty("/bEditMode", false);
			//this.getView().getModel("newModel").setProperty("/editable", false);
			this.rebindTable(this.oReadOnlyTemplate, "Navigation");
			// that.getView().getModel("newModel").setProperty("/add", false);
			//         that.getView().getModel("newModel").setProperty("/delete", false);
			//         that.getView().getModel("newModel").setProperty("/editable", false);
			// that.rebindTable(that.oReadOnlyTemplate, true);

			//         that.rebindTable(that.oReadOnlyTemplate, "Navigation");
		},
		// onChange: function(oEvent) {
		// 	var that = this;
		// 	var enteredText = oEvent.getParameters("value").value;
		// 	this.recordexists = undefined;
		// 	// var index=undefined;
		// 	var sData = this.getView().getModel("MainModel").getData().employee;//get the moedl data
		// 	var spath = parseInt(oEvent.getSource().getBindingContext("MainModel").getPath().split("/")[2]);//get the index of enter data row

		// 	var index = sData.findIndex(function(item, sindex) {//findIndex is a method used to validate if same value found it returns index position othervise it returns -1
		// 		return item.Items === enteredText && sindex !== spath;
		// 	});
		// 	if (index > -1) {
		// 		this.recordexists = index;
		// 		that.getView().getModel("newModel").setProperty("/valueState", "Error");//set value state to error
		// 		MessageToast.show("entered sales order is alreay exists");

		// 		return;
		// 	}
		// 	that.getView().getModel("newModel").setProperty("/valueState", "None");

		// },

		// onDelete: function () {
		// 	var that = this;
		// 	var oTable = this.getView().byId("Emp_Table");
		// 	var oModel = this.getView().getModel("MainModel");
		// 	// Enable multi-selection mode
		// 	oTable.setMode("MultiSelect");
		// 	var aSelectedItems = oTable.getSelectedItems();
		// 	if (aSelectedItems.length === 0) {
		// 		MessageToast.show("Please select at least one row to delimit.");
		// 		return;
		// 	}

		// 	MessageBox.confirm("Do you really want to delimit the selected row(s)?", {
		// 		title: "Confirm Delete",
		// 		onClose: function (oAction) {
		// 			if (oAction === MessageBox.Action.OK) {
		// 				var aData = oModel.getProperty("/Employees");

		// 				aSelectedItems.forEach(function (oSelectedItem) {
		// 					var sPath = oSelectedItem.getBindingContext("MainModel").getPath();
		// 					var iIndex = parseInt(sPath.split("/")[2]);
		// 					aData.splice(iIndex, 1);
		// 				});

		// 				// Update the model with the modified data
		// 				oModel.setProperty("/Employees", aData);

		// 				// Update the backend with the deletions (assuming OData service)
		// 				aSelectedItems.forEach(function (oSelectedItem) {
		// 					var sPath = oSelectedItem.getBindingContext("MainModel").getPath();
		// 					var sID = oModel.getProperty(sPath + "/ID");

		// 					// Send a DELETE request to your OData service
		// 					jQuery.ajax({
		// 						url: "https://your-odata-service-url/Employees(" + sID + ")",
		// 						type: "DELETE",
		// 						success: function (data) {
		// 							console.log("Item deleted successfully:", data);
		// 						},
		// 						error: function (error) {
		// 							console.error("Error deleting item:", error);
		// 						}
		// 					});
		// 				});

		// 				// Refresh the table to reflect the updated data
		// 				that.rebindTable(that.oReadOnlyTemplate, "Navigation");
		// 				oTable.setMode(aData.length > 0 ? "MultiSelect" : "None");
		// 				MessageToast.show("Selected item(s) deleted successfully.");
		// 			}
		// 			// No action needed for Cancel
		// 		}
		// 	});

		// },
		// 
		onExcelPress: function () {
			var aCols, oRowBinding, oSettings, oSheet, oTable;

			if (!this._oTable) {
				this._oTable = this.byId('Emp_Table');
			}

			oTable = this._oTable;
			oRowBinding = oTable.getBinding('items');
			aCols = this.createColumnConfig();

			oSettings = {
				workbook: {
					columns: aCols,
					hierarchyLevel: 'Level'
				},
				dataSource: oRowBinding,
				fileName: 'Office inventory(Employees).xlsx',
				worker: false // We need to disable worker because we are using a MockServer as OData Service
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(function () {
				oSheet.destroy();
			});
		},

		onFilterItems: function (oEvent) {
			if (oEvent) {
				var aSelectedItems = oEvent.getSource().getSelectedItems();
			} else {
				aSelectedItems = this.getView().byId("FilterMCB").getSelectedItems();
			}
			var aFilters = [];
			if (aSelectedItems && aSelectedItems.length > 0) {
				for (var i = 0; i < aSelectedItems.length; i++) {
					if (aSelectedItems[i].getBindingContext("MainModel") && aSelectedItems[i].getBindingContext("MainModel").getObject()) {
						aFilters.push(new Filter("ID", FilterOperator.EQ, aSelectedItems[i].getBindingContext("MainModel").getObject().ID));
					}
				}
			}
			//This is for future version
			// aFilters.push(new Filter("DELIMITED", FilterOperator.EQ, this.getOwnerComponent().getModel("MainModel").getProperty(
			// 	"/bShowInventoryDelimited")));
			this.getView().byId("Emp_Table").getBinding("items").filter(aFilters);
		},

		_onProductMatched: function (oEvent) {
				var oModel = this.getOwnerComponent().getModel("MainModel");
			jQuery.ajax({
				url: `https://demo-rudrani.glitch.me/employee`,
				type: "GET",
				dataType: "json",
				success: function (data) {
					if (data.success) {
						var oData = oModel.getData();
						oData.Employees = data.data;
						oModel.setData(oData);
						oModel.refresh(true);
						console.log("Data fetched successfully:", data.data);
						// Process the fetched data as needed
					} else {
						console.error("Error:", data.error);
					}
				},
				error: function (error) {
					console.error("Ajax error:", error);
				}
			});
			
			
		},

		onEditToggleButtonPress: function () {
			var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();

			oObjectPage.setShowFooter(!bCurrentShowFooterState);
		},

		onExit: function () {
			this.oRouter.getRoute("master").detachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onProductMatched, this);
		},
		onAdd: function () {
			var oModel = this.getOwnerComponent().getModel("MainModel");
			var oTable = this.getView().byId("Emp_Table");
			var sBindingPath = oTable.getBinding("items").getPath();
			this.getOwnerComponent().getModel("MainModel").setProperty("/bEditMode", true)
			this.getView().getModel("newModel").setProperty("/add", true);
			this.getView().getModel("newModel").setProperty("/delete", true);
			this.getView().getModel("newModel").setProperty("/editable", true);
			this.rebindTable(this.oEditableTemplate, "Edit");
			var aData = oModel.getProperty("/Employees");
			var oEntry = {
				"ID": "",
				"name":"",
				"address": "",
				"phoneNo": 0
			};
			aData.push(oEntry);
			oModel.setProperty("/Employees", aData);
			oModel.refresh(true);
			oTable.getItems()[oTable.getItems().length - 1].getCells()[0].focus()
		},

		onCancel: function () {
			var that = this;
			var oModel = this.getView().getModel("MainModel");

			MessageBox.confirm("Do you really want to cancel the edits?", {
				title: "Confirm Cancel",
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.OK) {
						// Check if there's a new record being added
						var aData = oModel.getProperty("/Employees");
						if (aData.length > 0) {
							for (var i = aData.length - 1; i >= 0; i--) {
								var oItem = aData[i];
								if (oItem && !oItem.ID) {
									// Remove the new record from the model
									aData.splice(i, 1);
								}
							}
							oModel.setProperty("/Employees", aData);
						}
						that.rebindTable(that.oReadOnlyTemplate, "Navigation");
						oModel.setProperty("/bEditMode", false);
						MessageToast.show("Edit canceled");
					}
					
				}
			});
		},
		
			onNavPress1: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Routemaster", true);
			}
		}

	});
});