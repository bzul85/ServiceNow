(function () {

    // https://support.servicenow.com/kb?id=kb_article_view&sysparm_article=KB0520375

    // ********** EDIT VARIABLES BELOW **********
    var needle = "Example of comment to remove"; // text that only the specific comment you're trying to delete would contain
    // var recordSid = '4b93e6115f39e41c64d574a460069c6d'; // sys_id of the record where the comment is
    var deleteEmails = false; // If there were any emails sent from this record with the data you're trying to delete has it, delete those email logs as well.
    // ********** EDIT VARIABLES ABOVE **********
    
    /*
        =======================================
        DO NOT EDIT ANYTHING BELOW THIS COMMENT
        =======================================
    */

    gs.getSession().setStrictQuery(true);
    var error = false;

    // Get Change SysID
    var encQuery  = "u_remoteidINCHG0068706^stateNOT IN306,307,308";// encoded query should be placed here
    var chgReq = new GlideRecord('change_request');
    chgReq.addEncodedQuery(encQuery);
    chgReq.query();
        while (chgReq.next()) {
            var recordSid = chgReq.getValue('sys_id'); // sys_id of the record where the comment is 

    // Update the Journal Entry
    var JE = new GlideRecord('sys_journal_field');
    JE.addEncodedQuery("element_id=" + recordSid + "^valueLIKE" + needle + "");
    JE.query();
    if (JE.next()) {
        JE.setWorkflow(false);
        JE.autoSysFields(false);
        JE.deleteRecord();
        gs.print("Deleted Journal Entry");
    }

    // Update the Audit Entry
    var AE = new GlideRecord('sys_audit');
    AE.addEncodedQuery("documentkey=" + recordSid + "^oldvalueLIKE" + needle + "^ORnewvalueLIKE" + needle + "");
    AE.query();
    if (AE.next()) {
        AE.setWorkflow(false);
        AE.autoSysFields(false);
        AE.deleteRecord();
        gs.print("Deleted Audit Entry");
    }

    // Rebuild the History Set
    if (gs.getProperty('glide.sys.activity_using_audit_direct') == false || gs.getProperty('glide.sys.activity_using_audit_direct') == 'false') {
        var HS = new GlideRecord('sys_history_set');
        HS.addEncodedQuery("id=" + recordSid + "");
        HS.query();
        while (HS.next()) {
            var HL = new GlideRecord('sys_history_line');
            HL.addEncodedQuery("set=" + HS.sys_id + "^newLIKE" + needle + "");
            HL.query();
            while (HL.next()) {
                // This will delete the History Set, not the audit data. The History Set will be rebuilt with the corrected audit and journal information as soon as a user views the item.
                HL.setWorkflow(false);
                HL.autoSysFields(false);
                HL.deleteRecord();
                gs.print("Deleted History Line");
            }
        }
    }

    // Update the Email Entry
    if (deleteEmails) {
        var EMAIL = new GlideRecord('sys_email');
        EMAIL.addEncodedQuery("instance=" + recordSid + "^bodyLIKE" + needle + "");
        EMAIL.query();
        if (EMAIL.next()) {
            EMAIL.setWorkflow(false);
            gs.print("Deleting " + EMAIL.getRowCount() + " emails.");
            EMAIL.deleteMuliple();
        }
    }

    gs.print("FINISHED");
}
})();
