sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
],
    function (JSONModel, Device) {
        "use strict";

        return {
            /**
             * Provides runtime info for the device the UI5 app is running on as JSONModel
             */
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
            ContextModel: function () {
                var mockdata = {
                    "LogInUser": "",
                    "LeaveBalance" :"",
                    "CasualLeave":"",
                    "GeneralLeave":"",
                    "EmpName" :"",
                    "LastName":"",
                    "EmailID":""
                }
                var myModel = new JSONModel(mockdata);
                myModel.setDefaultBindingMode("TwoWay");
                return myModel;
            }
        };

    });