sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/date/UI5Date",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType"

  ],
  function (Controller, JSONModel, UI5Date, MessageToast, MessageBox, formatter, Filter, FilterOperator, FilterType) {
    "use strict";
    var context, FirstName, LastName, EmailID, sEmail;
    return Controller.extend("com.ibs.leave.leaveteamplanner.controller.MasterPage", {
      formatter: formatter,
      onInit: function () {
        debugger
        context = this;
        var oRouter = sap.ui.core.UIComponent.getRouterFor(context);
        oRouter.getRoute("RouteMasterPage").attachPatternMatched(context.onRouteMatched, context);
        var oToday = new Date();
        oToday.setHours(0, 0, 0, 0);

        var oDateModel = new sap.ui.model.json.JSONModel({
          minDate: oToday,
          maxDate: oToday

        });
        context.getView().setModel(oDateModel, "DateModel");
        // context.getUserData();
        context.ReadLeaveType();
        context.CalendorColour();
        context.OnHoliday();
        context.ReadTeamLeaveInfo();
        context.HolidayCalendar();
        context.LeaveEvent();
      },
      onStartDateChange: function (oEvent) {
        var oSelectedStartDate = oEvent.getSource().getDateValue();
        if (!oSelectedStartDate) return;
        var oDateModel = this.getView().getModel("DateModel");
        oDateModel.setProperty("/maxDate", oSelectedStartDate);
      },
      onEndDateChange: function () {
        var oStartDatePicker = this.byId("leaveStartDatePicker");
        var oEndDatePicker = this.byId("leaveEndDatePicker");
        var oDaysCountText = this.byId("requestingDays");
        var oJoiningDateText = this.byId("joiningDate");

        var sStartDate = oStartDatePicker.getDateValue();
        var sEndDate = oEndDatePicker.getDateValue();

        if (sStartDate && sEndDate) {
          var aHolidays = [
            "2024-12-25",
            "2025-01-01"
          ];
          var aHolidayDates = aHolidays.map(function (sDate) {
            return new Date(sDate).setHours(0, 0, 0, 0);
          });

          var iWorkingDays = 0;
          var oCurrentDate = new Date(sStartDate);

          while (oCurrentDate <= sEndDate) {
            var iDay = oCurrentDate.getDay();
            var iCurrentDateValue = oCurrentDate.setHours(0, 0, 0, 0);

            if (iDay !== 0 && iDay !== 6 && !aHolidayDates.includes(iCurrentDateValue)) {
              iWorkingDays++;
            }
            oCurrentDate.setDate(oCurrentDate.getDate() + 1);
          } oDaysCountText.setValue(iWorkingDays);

          var oJoiningDate = new Date(sEndDate);
          do {
            oJoiningDate.setDate(oJoiningDate.getDate() + 1);
            var iDay = oJoiningDate.getDay();
            var iJoiningDateValue = oJoiningDate.setHours(0, 0, 0, 0);
          }
          while (iDay === 0 || iDay === 6 || aHolidayDates.includes(iJoiningDateValue));

          var sFormattedJoiningDate = oJoiningDate.toLocaleDateString();
          oJoiningDateText.setText("Joining Date: " + sFormattedJoiningDate);
        }
        else {

          oDaysCountText.setValue("0 Days");
          oJoiningDateText.setText("Joining Date: N/A");
        }


      },
      _getRuntimeBaseURL: function () {
        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        var appPath = appId.replaceAll(".", "/");
        var appModulePath = jQuery.sap.getModulePath(appPath);

        return appModulePath;
      },

      getUserData: function () {
        debugger
        var UserEmail = context.getOwnerComponent().getModel("context").getProperty("/LogInUser");
        var oThisController = this;
        var url;
        url = oThisController._getRuntimeBaseURL() + "/user-api/attributes";

        $.ajax({
          url: url,
          type: 'GET',
          contentType: 'application/json',
          success: function (data, response) {
            debugger;
            UserEmail = data.email
            FirstName = data.firstname
            LastName = data.lastname
            EmailID = data.email
            context.getOwnerComponent().getModel("context").setProperty("/EmpName", FirstName);
            context.getOwnerComponent().getModel("context").setProperty("/LastName", LastName);
            context.getOwnerComponent().getModel("context").setProperty("/EmailID", EmailID);
            context.ReadMasterEmployee();

          },
          error: function (oError) {
            debugger
          }
        });

      },

      ReadTeamLeaveInfo: function () {
        debugger
        var oList = this.getOwnerComponent().getModel().bindList("/TEAM_LEAVE_INFO", undefined, [],
          [], { $expand: "TO_STATUS_LEAD,TO_LEAVE_TYPE" }

        );
        oList.requestContexts().then((odata) => {
          var header = [];
          odata.forEach(element => {
            header.push(element.getObject());
          });
          var oModel = new JSONModel(header);
          context.getView().setModel(oModel, "LeaveInfoModel");

        })
      },
      LeaveEvent: function () {
        debugger
        sEmail = context.getOwnerComponent().getModel("context").getProperty("/EmailID");
        var oList = this.getOwnerComponent().getModel().bindList("/LEAVE_EVENT_LOG", undefined, [],
          [new Filter("EMAIL_ID", FilterOperator.EQ, sEmail)],
          { $expand: "TO_EVENT" }
        );
        oList.requestContexts().then((odata) => {
          var header = [];
          odata.forEach(element => {
            header.push(element.getObject());
          });
          var oModel = new JSONModel(header);
          context.getView().setModel(oModel, "LeaveEventModel");

        })
      },
      OnLeaveBalance: function (oEvent) {
        debugger
        var sSelectedKey = oEvent.getSource().getSelectedKey();
        var oTYModel = this.getView().getModel("LeaveTypeModel");
        var oMEModel = this.getView().getModel("MasterEmpModel");
        if (sSelectedKey === "1") {
          oTYModel.setProperty("/CasualLeave", true)
          oTYModel.setProperty("/GeneralLeave", false)

        } else if (sSelectedKey === "4") {
          oTYModel.setProperty("/GeneralLeave", true)
          oTYModel.setProperty("/CasualLeave", false)
        }
        MessageToast.show("Leave type selected: " + sSelectedKey);

      },
      ReadMasterEmployee: function () {
        debugger
        sEmail = context.getOwnerComponent().getModel("context").getProperty("/EmailID");
        var oList = this.getOwnerComponent().getModel().bindList("/MASTER_EMPLOYEE", undefined, [],
          [new Filter("EMAIL_ID", FilterOperator.EQ, sEmail)],
          { $expand: "TO_PROJECT" }
        );
        oList.requestContexts().then((odata) => {
          var masterEmp = [];
          odata.forEach(element => {
            masterEmp.push(element.getObject());
          });
          var oModel = new JSONModel(masterEmp);
          this.getView().setModel(oModel, "MasterEmpModel");

        })
      },
      ReadLeaveType: function () {
        debugger
        var oList = this.getOwnerComponent().getModel().bindList("/MASTER_LEAVE_TYPE", undefined, [],
          []
          // { $expand: "TO_LEAVE_TYPE" }
        );
        oList.requestContexts().then((odata) => {
          var leaveType = [];
          odata.forEach(element => {
            leaveType.push(element.getObject());
          });
          var oModel = new JSONModel(leaveType);
          context.getView().setModel(oModel, "LeaveTypeModel");

          // var LeaveCount = context.getOwnerComponent().getModel("context").setProperty("/LeaveBalance");
        })
      },

      CalendorColour: function () {
        debugger
        var colours = {
          legendItems: [
            { text: "Approved", type: sap.ui.unified.CalendarDayType.Type08 },
            { text: "Pending", type: sap.ui.unified.CalendarDayType.Type02 },
            { text: "Holiday", type: sap.ui.unified.CalendarDayType.Type13 }
          ]
        };
        var myModel = new JSONModel(colours);
        context.getView().setModel(myModel, "CalendorColourModel");
      },
      OnHoliday: function () {
        var oData = {
          specialDates: [
            { startDate: new Date("2024,12,25"), type: "Type13", tooltip: "Christmas Holiday" },
          ]
        };
        var oModel = new JSONModel(oData);
        context.getView().setModel(oModel, "HolidayModel");
      },
      OnSubmit: function () {
        debugger;


        // context = this;
        // var oModel = this.getOwnerComponent().getModel();
        // var LEAVETYPE = this.getView().byId('leaveType').getValue();
        // var NOOFLEAVES = this.getView().byId('requestingDays').getValue();
        // var STARTDATE = this.getView().byId('leaveStartDatePicker').getValue();
        // var ENDDATE = this.getView().byId('leaveEndDatePicker').getValue();
        // var LEAVENOTES = this.getView().byId('remarksTextArea').getValue();

        // var oContext = {
        //   "action": "CREATE",
        //   "teamLeaveInfo": [{
        //     "LEAVE_ID": 1,
        //     "EMPLOYEE_ID": 113,
        //     "LEAVE_TYPE": LEAVETYPE,
        //     "NO_OF_LEAVES": NOOFLEAVES,
        //     "START_DATE": new Date().toISOString().split('.')[0],
        //     "END_DATE": ENDDATE,
        //     "LEAVE_LEAD_STATUS": 1,
        //     "LEAVE_MANAGER_STATUS": 1,
        //     "LEAVE_NOTES": LEAVENOTES
        //   }
        //   ],
        //   "leaveEvents": [{
        //     "LEAVE_ID": 1,
        //     "EVENT_NO": 1,
        //     "EVENT_CODE": "CR",
        //     "USER_ID": EmailID,
        //     "USER_NAME": FirstName,
        //     "REMARK": "",
        //     "COMMENT": LEAVENOTES,
        //     "CREATED_ON": new Date().toISOString(),
        //   }
        //   ]
        // };
        // var ContextBinding = oModel.bindContext("/TeamLeaveAction(...)");
        // ContextBinding.setParameter("action", "CREATE")
        // ContextBinding.setParameter("teamLeaveInfo", oContext.teamLeaveInfo)
        // ContextBinding.setParameter("leaveEvents", oContext.leaveEvents)
        // ContextBinding.execute().then(
        //   function () {
        //     MessageBox.success("Your Request has been Created Successsfully", {
        //       actions: [MessageBox.Action.OK],
        //       emphasizedAction: MessageBox.Action.OK,
        //       onClose: function (sAction) {
        //         if (sAction === "OK") {
        //           context.resetValueHelpFields();
        //         }
        //       }
        //     });

        //   }.bind(this), function (oError) {
        //     MessageBox.error("Error in adding the Information: ", oError);
        //   });
      },


      resetValueHelpFields: function () {
        context.getView().byId("leaveType").setValue("");
        context.getView().byId("requestingDays").setValue("");
        context.getView().byId("leaveStartDatePicker").setValue("");
        context.getView().byId("leaveEndDatePicker").setValue("");
        context.getView().byId("remarksTextArea").setValue("");
      },


      HolidayCalendar: function () {
        debugger
        var oList = this.getOwnerComponent().getModel().bindList("/MASTER_HOLIDAY_CALENDAR", undefined, [],
          []

        );
        oList.requestContexts().then((odata) => {
          var leaveType = [];
          odata.forEach(element => {
            leaveType.push(element.getObject());
          });
          var oModel = new JSONModel(leaveType);
          context.getView().setModel(oModel, "HolidayCalendarModel");

        })
      },
      OnHolidayCalendar: function () {
        debugger
        if (!context.ValueHelpDialogue) {
          context.ValueHelpDialogue = sap.ui.xmlfragment("com.ibs.leave.leaveteamplanner.view.Fragment.HolidayCalendar", context);
          context.getView().addDependent(this.ValueHelpDialogue);
          context.ValueHelpDialogue.open();
        }

        context.ValueHelpDialogue.open()
      },
      onDialogClose: function () {
        this.ValueHelpDialogue.close();
      },
      onLeaveClose: function () {
        this.ValueHelpDialogue1.close();
      },
      onShowLog: function () {
        debugger
        var oDynamicSideContent = this.getView().byId("DynamicSideContent");
        oDynamicSideContent.setSideContentVisibility("ShowAboveS");

        var oShowLogButton = this.getView().byId("showLogButton");
        var oHideLogButton = this.getView().byId("hideLogButton");
        //var oHideLogFooterButton = this.getView().byId("hideLogFooterButton");

        oShowLogButton.setVisible(false);
        oHideLogButton.setVisible(true);
        //oHideLogFooterButton.setVisible(true);
      },
      onHideLog: function () {
        var oDynamicSideContent = this.getView().byId("DynamicSideContent");
        oDynamicSideContent.setSideContentVisibility("NeverShow");

        var oShowLogButton = this.getView().byId("showLogButton");
        var oHideLogButton = this.getView().byId("hideLogButton");
        //var oHideLogFooterButton = this.getView().byId("hideLogFooterButton");

        oShowLogButton.setVisible(true);
        oHideLogButton.setVisible(false);
        //oHideLogFooterButton.setVisible(false);
      },
      OnLeaveHistory: function () {
        debugger
        if (!context.ValueHelpDialogue1) {
          context.ValueHelpDialogue1 = sap.ui.xmlfragment("com.ibs.leave.leaveteamplanner.view.Fragment.Leave", context);
          context.getView().addDependent(this.ValueHelpDialogue1);
          context.ValueHelpDialogue1.open();
        }

        context.ValueHelpDialogue1.open()
      },
    });
  }
);
