sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/unified/CalendarDayType",
    "sap/ui/core/date/UI5Date"
  ],
  function (Controller, JSONModel, CalendarDayType, UI5Date) {
    "use strict";
    var context;
    return Controller.extend("com.leaveplanner.leaveplanner.controller.View2", {
      onInit: function () {
        debugger
        context = this;
        var oRouter = sap.ui.core.UIComponent.getRouterFor(context);
        oRouter.getRoute("View2").attachPatternMatched(context.onRouteMatched, context);
        context.CalendorColour();
        context.OnHoliday();
        context.ReadTeamLeaveInfo();
      },
      ReadTeamLeaveInfo : function(){
        debugger
        var oList = this.getOwnerComponent().getModel().bindList("/TEAM_LEAVE_INFO", undefined, [],
          [],);
      oList.requestContexts().then((odata) => {
          var header = [];
          odata.forEach(element => {
              header.push(element.getObject());
          });
          var oModel = new JSONModel(header);
          this.getView().setModel(oModel,"LeaveInfoModel");

      })
      },
      CalendorColour: function () {
        debugger
        var colours = {
          legendItems: [
            { text: "Approved", type: CalendarDayType.Type08 },
            { text: "Pending", type: CalendarDayType.Type02 },
            { text: "Holiday", type: CalendarDayType.Type13 }
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
      }
    });
  }
);
