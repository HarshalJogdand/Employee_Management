sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

], function (Controller,JSONModel,MessageBox,Filter,FilterOperator) {
    "use strict";
    var that;
    var oDataModel,projectName,projectDis;
    var taskDisc,obj;
    
    return Controller.extend("com.ibspl.employeetaskmanagement.controller.View2", {
        onInit: function() {
            
            that = this;
            oDataModel = that.getOwnerComponent().getModel();
            var nav = sap.ui.core.UIComponent.getRouterFor(this);
            nav.getRoute("View2").attachPatternMatched(this._onRouteMatched, this);
            that.getTaskdetails();
            that.projectData();
            this.getView().byId("idDateRangeSelection").setMaxDate(new Date())
            obj={
                results:[]
            }
            
        },
        _onRouteMatched : function(){
            
            var width;
             this.getView().setModel(new JSONModel([]), "appView");
            //  this.getOwnerComponent().setModel([], "appView");
            var device=sap.ui.Device.system;
            if (device.desktop) {
                layout="ResponsiveGridLayout"
             
            }else{
              width="100%"
              layout="ColumnLayout"
            }
            var modeldata=this.getView().getModel("appView");
            modeldata.setProperty("/device" ,width);
            
        },
        getTaskdetails:function(oEvent){
            // 
                oDataModel.read("/EMP_PROJECT_TASK_MASTER", {
                    // filters: [filter],
                    success: function (Data, oEvent) {
                        var projTaskModel = new JSONModel();
                        projTaskModel.setData(Data.results);
                        that.getView().setModel(projTaskModel, "taskDetails");

                    },
                    error: function (error) {
                        that.getView().setBusy(false);
                        MessageBox.error("Error while reading task data");
                    }
                })
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
                    sap.m.MessageToast.show("Cannot load ship detail");
                }

            });
        },
        readProjectName :function(){
            
            projectName = this.getView().byId("idProjectName").getSelectedKey();
            projectDis = this.getView().byId("idProjectName").mAggregations.items[0].mProperties.text
            this.taskRead();

        },
        readtaskName : function(){
            
            var taskCode=this.getView().byId("idTaskName").getSelectedKey()
            for (let i = 0; i < this.getView().byId("idTaskName").mAggregations.items.length; i++) {
                if (taskCode === this.getView().byId("idTaskName").mAggregations.items[i].mProperties.key) {
                taskDisc=this.getView().byId("idTaskName").mAggregations.items[i].mProperties.text
                }
                
            }    
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
                    sap.m.MessageToast.show("Cannot load ship detail");
                }

            });
        },
            
        onSaveTask: function(oEvent) {
            
            var that = this; 
            var oModel = this.getView().getModel(); 
            // var employeeId = this.getView().byId("idEmployeeId").getValue();
            // var employeeName = this.getView().byId("idEmployeeName").getText();
            var date = this.getView().byId("idDateRangeSelection").getDateValue();
            var projectName = this.getView().byId("idProjectName").getSelectedKey();
            var taskName = this.getView().byId("idTaskName").getSelectedKey();
            var startTime = this.getTime(this.getView().byId("idStartTime").getDateValue()); 
            var endTime = this.getTime(this.getView().byId("idEndTime").getDateValue());
            var breakTime = this.getTime(this.getView().byId("idBreakTime").getDateValue()); 
            var remark = this.getView().byId("idRemark").getValue();
            var projectDis = this.getView().byId("idProjectName").getValue();
            var taskDisc = this.getView().byId("idTaskName").getValue();
        
            var startHours = startTime;
            var endHours = endTime;
            if (startHours <= "7:00:00" && startHours >= "16:00:00") {
                MessageBox.error("Start time must be between 7:00 AM and 4:00 PM.")
            }
            else if(endHours <= "11:00:00" && endHours >= "23:00:00") {
                MessageBox.error("End time must be between 11:55 AM and 11:00 PM.")
            }
            else if (endTime <= startTime) {
                MessageBox.error("End time must be greater than start time.");
            }
            else
            {
            var oNewEntry = {
                EMPLOYEE_ID: "5029", 
                EMPLOYEE_NAME: "Harshal Jogdand",
                DATE: date, 
                PROJECT_ID: parseInt(projectName),
                TASK_ID: parseInt(taskName),
                START_TIME: startTime, 
                END_TIME: endTime, 
                BREAK_TIM: breakTime, 
                STATUS: 1,
                EMPLOYEE_REMARK: remark,

                PROJECT_CODE:projectDis,
                TASK_DISC:taskDisc
                
            };
            if(projectName=="" || taskName==""|| startTime==""|| endTime==null|| breakTime==null|| remark==""){
                MessageBox.error("Please fill Required Fields:");
                }
                else{
            obj.results.push(oNewEntry)
          
            var projectModel = new JSONModel(obj);
            that.getOwnerComponent().setModel(projectModel, "New_data");
            var newtask=that.getView().getModel("New_data").getData();

            this.getView().byId("idDateRangeSelection").setDateValue();
            this.getView().byId("idProjectName").setSelectedKey();
            this.getView().byId("idTaskName").setSelectedKey();
            this.getView().byId("idStartTime").setValue(); 
            this.getView().byId("idEndTime").setValue();
           this.getView().byId("idBreakTime").setValue(); 
           this.getView().byId("idRemark").setValue();
           this.getView().byId("idProjectName").setValue();
           this.getView().byId("idTaskName").setValue();
                }
            }
        },
        getTime : function(oEvent){
            if(oEvent==null){
                return null;
            }
            else{
            var time= oEvent.getHours()+ ":"+oEvent.getMinutes()+":"+oEvent.getSeconds();
            return time;
            }
        },
        formatTime:function(sValue){
            var duration = sValue.split(":");
            var durationString = 'PT' + duration[0] + 'H' + duration[1] + 'M' + duration[2] + 'S';

            return durationString;
        },
    //     SubmitTask:function(){
    //     MessageBox.confirm("Do you want to SUBMIT timesheet",{
    //         actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
    //         emphasizedAction: MessageBox.Action.OK,
    //         onClose: function (sAction) {
    //             if(sAction=="OK"){
    //                 that._PostData();

    //             }
               
    //     }
    // })

    //     },
        SubmitTask: function(){
            debugger
            var newtask=that.getView().getModel("New_data").getData()
            for (let i = 0; i < newtask.results.length; i++) {

                
                var taskStartTime = this.formatTime(newtask.results[i].START_TIME.toString().split(" ")[0]);
                var taskEndTime = this.formatTime(newtask.results[i].END_TIME.toString().split(" ")[0]);
                var taskBreakTime = this.formatTime(newtask.results[i].BREAK_TIM.toString().split(" ")[0]);
          var obj={
            EMPLOYEE_ID: 5029, 
            EMPLOYEE_NAME: "Harshal Jogdand",
            DATE:newtask.results[i].DATE,
            PROJECT_ID:Number(newtask.results[i].PROJECT_ID),
            TASK_ID:Number(newtask.results[i].TASK_ID),
            START_TIME:taskStartTime,
            END_TIME:taskEndTime,
            BREAK_TIME:taskBreakTime,
            // STATUS:newtask.results[i].STATUS,
            STATUS:1,
            EMPLOYEE_REMARK:newtask.results[i].EMPLOYEE_REMARK
          } 

            oDataModel = that.getView().getModel();
            oDataModel.create("/EMP_TIMESHEET_ENTRY", obj, {
                success: function(oData) {
                    sap.m.MessageBox.success("Timesheet created successfully", {
                        actions: ["OK"],
                        onClose: function(sAction) {
                            if(sAction == "OK"){
                                that.getOwnerComponent().setModel(new JSONModel([]), "New_data");
                                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                oRouter.navTo("RouteMaster_Page");
                            // that.getView().getModel("Table_Data").refresh()
                            // that.getView().byId("formLayout").setVisible(false) 
                            //  that.readData();
                           
                            }
                           
                        }

                    });
                    // that.getOwnerComponent().setModel(new JSONModel([]), "New_data");
                  
                    
                   
                },
                error: function(oError) {
                    
                    sap.m.MessageBox.error("Error creating data: " + oError);
                    
                },
           
            });
        }
        // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        // oRouter.navTo("RouteMaster_Page");
        },

    });
    });