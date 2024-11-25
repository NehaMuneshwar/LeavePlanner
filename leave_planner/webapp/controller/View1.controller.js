sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";
        var context;
        return Controller.extend("com.leaveplanner.leaveplanner.controller.View1", {
            onInit: function () {
                context = this;
                var oRouter = this.getOwnerComponent().getRouter().getRoute("RouteView1");
                oRouter.attachPatternMatched(context._onObjMatch, context);
            },
            onCreatePress: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("View2", {
                    
                 });
            }
        });
    });
