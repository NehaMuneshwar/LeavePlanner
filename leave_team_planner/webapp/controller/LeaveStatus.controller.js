sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"
    ],
    function (Controller,JSONModel) {
        "use strict";
        var context;
        return Controller.extend("com.ibs.leave.leaveteamplanner.controller.LeaveStatus", {
            onInit: function () {
                context = this;
                var oRouter = sap.ui.core.UIComponent.getRouterFor(context);
                oRouter.getRoute("LeaveStatus").attachPatternMatched(context.onRouteMatched, context)
                context.HolidayCalendar();
                context.LeaveEvent();
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
              LeaveEvent: function () {
                debugger
                var oList = this.getOwnerComponent().getModel().bindList("/MASTER_EMPLOYEE", undefined, [],
                  [],
                  { $expand: "TO_PROJECT" }
                 );
                oList.requestContexts().then((odata) => {
                  var leaveEvent = [];
                  odata.forEach(element => {
                    leaveEvent.push(element.getObject());
                  });
                  var oModel = new JSONModel(leaveEvent);
                  context.getView().setModel(oModel, "leaveEventModel");
        
                })
              },
        });
    }
);
