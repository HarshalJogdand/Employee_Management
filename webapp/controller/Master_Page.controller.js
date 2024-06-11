sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,MessageBox,Filter,FilterOperator) {
        "use strict";
        var that;
        var oDataModel,projectName;
        return Controller.extend("com.ibspl.employeetaskmanagement.controller.Master_Page", {
            
            onInit: function () {

                var nav = sap.ui.core.UIComponent.getRouterFor(this);
                nav.getRoute("RouteMaster_Page").attachPatternMatched(this._objectRouteMatched, this);


            //     that=this;
            //    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            //    oRouter.getRoute("RouteMaster_Page").attachPatternMatched(this._objectRouteMatched, this)
            },
            _objectRouteMatched :function(oEvent){
                that = this;
                that.getView().setBusy(true);
                oDataModel = that.getOwnerComponent().getModel();
                that.readData();
                that.projectData();
                // var sFilter = 
                // this.readData([],"/EMP_TIMESHEET_ENTRY","Table_Data");
                // this.readData([],"/EMP_PROJECT_TASK_MASTER","projectMasterModel");
            },
            // readData:function(oFilter,sEntity,sModel){
            //     var oDataModel=this.getOwnerComponent().getModel();
            //     var url = {};
            //     if(sModel === "Table_Data"){
            //         var oFilter = new sap.ui.model.Filter({
            //             path: "EMPLOYEE_ID",
            //             operator: "EQ",
            //             value1: "5029"
            //         });
                    
            //         var oCombinedFilter = new sap.ui.model.Filter([oFilter], true);

            //         url = {"$expand": "PROJECT_TASK_MASTER_REF,STATUS_MASTER_REF"};
            //     }
            //     oDataModel.read(sEntity, {
            //             urlParameters:url,
            //             filters:[oCombinedFilter],
            //          success: function (Data, Response) {
            //               
            //               that.getView().setModel(new JSONModel(Data.results), sModel);
            //          },
            //          error: function (Error) {
            //              Message.error(Error);
            //          }
                     
            //      });              
            // },
            
            onAddMoreEntries: function()
            {
                
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("View2");
            },
           

            

            readData:function(){
                
                var empId = "5029"
                var oFilter = new sap.ui.model.Filter("EMPLOYEE_ID", sap.ui.model.FilterOperator.EQ, empId);
                oDataModel.read("/EMP_TIMESHEET_ENTRY", {
                    urlParameters:{"$expand": "PROJECT_TASK_MASTER_REF,STATUS_MASTER_REF"},
                    filters: [oFilter],
                    success: function (oData, resp) {
                        
                        that.getView().setBusy(false);
                        var ship = new JSONModel(oData.results);
                        that.getView().setModel(ship, "Table_Data");

                    },
                    error: function (error) {
                        
                        // BusyIndicator.hide();
                        sap.m.MessageToast.show("Cannot load ship detail");
                    }

                });
            },

            projectData : function(){
                
                var oFilter = new sap.ui.model.Filter("PROJECT_ID", sap.ui.model.FilterOperator.EQ, projectName);
                oDataModel.read("/EMP_PROJECT_TASK_MASTER", {                                 
                    success: function (oData, resp) {
                        

                        var uniqueProjects = {}; 
                        var projects = []; 

                        for (let i = 0; i < oData.results.length; i++) {

                            if (!uniqueProjects[oData.results[i].PROJECT_ID]) {
                                uniqueProjects[oData.results[i].PROJECT_ID] = true; 
                                
                                
                                projects.push({
                                    PROJECT_ID: oData.results[i].PROJECT_ID,
                                    PROJECT_NAME: oData.results[i].PROJECT_NAME
                                });
                            }
                        }
                        var projectModel = new JSONModel(projects);
                        that.getView().setModel(projectModel, "projetname");
                    },
                    error: function (error) {
                        
                        // BusyIndicator.hide();
                        sap.m.MessageToast.show("Cannot load detail");
                    }

                });
            },
            readProjectName :function(oEvent){
                
                projectName = oEvent.oSource.getSelectedKey();
                this.taskRead();
                // projectName = this.getView().byId("shiftdetail").mAggregations.items[0].mProperties.text

            },
            onClick: function(){
         
                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
                    oCrossAppNavigator.toExternal({
                        target: {
                        shellHash:"#fioriapplication-display?sap-ui-app-id-hint=saas_approuter_fioriapp"
                        }
                        });
        },
            
            taskRead : function(){
                
                var oFilter = new sap.ui.model.Filter("PROJECT_ID", sap.ui.model.FilterOperator.EQ, projectName);
                oDataModel.read("/EMP_PROJECT_TASK_MASTER", {
                
                    filters: [oFilter],
                    success: function (oData, resp) {
                        
                        var ship = new JSONModel(oData.results);
                        that.getView().setModel(ship, "projectMasterModel");

                    },
                    error: function (error) {
                        
                        // BusyIndicator.hide();
                        sap.m.MessageToast.show();
                    }

                });
            },
           
            onCreate: function () {
               
                if (!this.Dialog) {
                    this.Dialog = sap.ui.xmlfragment("com.ibspl.employeetaskmanagement.fragment.create_emp", this);
                    this.getView().addDependent(this.Dialog);    //adding this.Dialog to life cycle method i.e. whenever a page is loaded, fragment will get load
                }
                this.Dialog.open();
            },
            onClose: function () {
               // 
                this.Dialog.close();
                this.Dialog.destroy();
                this.Dialog = null;
                that.getView().getModel("Table_Data").refresh()
                                // that.getView().byId("formLayout").setVisible(false) 
                                that.readData();
            },
            onSave: function() {
               
                var oModel = this.getView().getModel(); // Get the model from your view
                // var employeeId = sap.ui.getCore().byId("idEmployeeId").getValue();
                // var parsedEmployeeId = parseInt(employeeId, 10);

                // var EmployeeName = sap.ui.getCore().byId("idEmployeeName").getValue();
                var   date = sap.ui.getCore().byId("idDateRangeSelection").getValue();
                    // ProjectID: sap.ui.getCore().byId("idProjectId").getSelectedItem().getKey(), 
                    var   ProjectName = sap.ui.getCore().byId("idProjectName").getSelectedKey();
                    // TaskID: sap.ui.getCore().byId("idTaskId").getSelectedItem().getKey(), 
                    var   TaskName = sap.ui.getCore().byId("idTaskName").getSelectedKey();
                    var   StartTime = this.getTime(sap.ui.getCore().byId("idStartTime").getDateValue()); 
                    var   EndTime = this.getTime(sap.ui.getCore().byId("idEndTime").getDateValue());
                    var   BreakTime = this.getTime(sap.ui.getCore().byId("idBreakTime").getDateValue()); 
                    var remark = sap.ui.getCore().byId("idRemark").getValue();

                var oNewEntry = {
                    EMPLOYEE_ID: 5029,
                    EMPLOYEE_NAME: 'Harshal Jogdand',
                    DATE: new Date(), 
                    // ProjectID: sap.ui.getCore().byId("idProjectId").getSelectedItem().getKey(), 
                    PROJECT_ID: ProjectName,
                    // TaskID: sap.ui.getCore().byId("idTaskId").getSelectedItem().getKey(), 
                    TASK_ID: TaskName,
                    START_TIME: StartTime, 
                    END_TIME: EndTime, 
                    BREAK_TIME: BreakTime, 
                    STATUS: 1,
                    EMPLOYEE_REMARK: remark
                   
                };
                oModel.create("/EMP_TIMESHEET_ENTRY", oNewEntry, {
                    success: function(oData) {
                        MessageBox.success("Timesheet created successfully:", oData);
                        that.onClose();
                        // Handle success, e.g., show a success message
                    },
                    error: function(oError) {
                        
                        console.error("Error creating data:", oError);
                        // Handle error, e.g., show an error message
                    }
                });
            },
            getTime : function(oEvent){
                var time= "PT"+oEvent.getHours()+"H"+oEvent.getMinutes()+"M"+oEvent.getSeconds()+"S";
                return time;
            },
            formatEmployeeInfo: function(employeeId, employeeName) {
                return employeeId + ' ' + employeeName;
            },
            onSearch: function(event) {
                // Get the value entered in the search field
                var searchValue = event.getParameter("newValue").toLowerCase();
            
                // Get the reference to the table
                var table = this.getView().byId("ETM");
            
                // Get the binding context of the table
                var binding = table.getBinding("items");
            
                // Define the filters for PROJECT_NAME and TASK_NAME
                var projectNameFilter = new sap.ui.model.Filter("PROJECT_TASK_MASTER_REF/results/0/PROJECT_NAME", sap.ui.model.FilterOperator.Contains, searchValue);
                var taskNameFilter = new sap.ui.model.Filter("PROJECT_TASK_MASTER_REF/results/0/TASK_NAME", sap.ui.model.FilterOperator.Contains, searchValue);
            
                // Combine the filters using OR logic
                var combinedFilter = new sap.ui.model.Filter({
                    filters: [projectNameFilter, taskNameFilter],
                    and: false // Apply OR logic
                });
            
                // Apply the combined filter to the binding
                binding.filter(combinedFilter);
            },
            onReset: function() {
              //  
                // Get the reference to the search field
                var searchField = this.getView().byId("searchField");
            
                // Clear the value of the search field
                searchField.setValue("");
            
                // Reset any filters applied to the table
                var table = this.getView().byId("ETM");
                var binding = table.getBinding("items");
                binding.filter([]);
            },
            onFilter: function (oEvent) {

                

                if (!this.onViewFilter) {
                    this.onViewFilter = sap.ui.xmlfragment("com.ibspl.employeetaskmanagement.fragment.onfilter", this);
                    this.getView().addDependent(this.onViewFilter);
                }
                this.onViewFilter.open();
            },
           
            handleConfirm2: function (oEvent) {

                
                // var oOrder = oEvent.getSource().getSelectedFilterItems()[0].mProperties.text;
                var multifilter=oEvent.mParameters.filterKeys;
                var b=Object.keys(multifilter)
                var aFilters=[]
                var oFilter
                b.forEach(function(value){
                     oFilter = new sap.ui.model.Filter("PROJECT_ID", sap.ui.model.FilterOperator.EQ, value.trim());
                    aFilters.push(oFilter);
                });
                // var oList = this.getOwnerComponent().getModel().bindList("/REGISTRATION_FORM", undefined, [],aFilters,
                //     {});
                var oList =    oDataModel.read("/EMP_TIMESHEET_ENTRY", {
                    urlParameters:{"$expand": "PROJECT_TASK_MASTER_REF,STATUS_MASTER_REF"},
                    filters: [oFilter],
                    success: function (oData, resp) {
                        
                        var ship = new JSONModel(oData.results);
                        that.getView().setModel(ship, "projetname");

                    },
                    error: function (error) {
                        
                        // BusyIndicator.hide();
                        sap.m.MessageToast.show("Cannot load ship detail");
                    }

                });
                
                oList.requestContexts().then((oData) => {
                    
                    var books = [];
                    oData.forEach(element => {
                        
                        books.push(element.getObject());
                    });
                    var oModel = new JSONModel(books);
                    this.getView().setModel(oModel, "projetname");
                });

            },

        });
    });
