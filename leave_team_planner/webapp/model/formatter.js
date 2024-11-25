sap.ui.define([ "sap/ui/core/format/DateFormat"],
    function (Controller,DateFormat) {
        "use strict";

        return {
            onInit: function () {
            },
            formatEmpFullName: function (sFirstName, sLastName) {
                return sFirstName + " " + sLastName;
            },
            statusColorFormatter: function (status) {
                if (status === "Pending") {
                    return "Request On Pending";
                } else {
                    return "orangeText";
                }
            },
            RequestStatus:function(status){
               
                if(status == "Approved"){
                    return "Success"
                }
                if(status == "Rejected"){
                    return "Error"

                }if(status == "Pending"){
                    return "Success"
                }
             },
            
        };
    });

