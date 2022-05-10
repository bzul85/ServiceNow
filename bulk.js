var encQuery  = "u_remoteidINCHG0068706^stateNOT IN306,307,308";// encoded query should be placed here
var time = new GlideDateTime();
var currentTime = time.getDisplayValue();
gs.print('new date is: ' + currentTime);
var chgReq = new GlideRecord('change_request');
chgReq.addEncodedQuery(encQuery);
chgReq.addEncodedQuery('stateIN301,302,303,303,304,305');// query records only with states 301,302,303,303,304,305
chgReq.orderBy('order');
chgReq.query();
gs.print('Change Request count = '+ chgReq.getRowCount());
    while (chgReq.next()) {
        var chgReqNum = chgReq.getValue('number') ;
       gs.print(chgReqNum + ' Change State before = '+ chgReq.state);
        var chgTask = new GlideRecord('change_task');
                chgTask.addQuery('change_request.number',chgReqNum);
                chgTask.addEncodedQuery('stateIN-5,1,2');// query records only with states -5,1,2
                chgTask.orderBy('order');
                chgTask.query();
                var chgTaskNum = chgTask.getElement('number');
                gs.print('CTasks count = '+ chgTask.getRowCount());
                while (chgTask.next()) {
                     gs.print(chgTaskNum + ' Ctask State before change = ' + chgTask.state);
                     chgTask.state = 4; // closed ,'4' for cancel
                     chgTask.work_end = currentTime;
                     chgTask.setWorkflow(false); 
                   //  chgTask.autoSysFields(false);
                     chgTask.update();
                   gs.print(chgTaskNum + ' Ctask State after change = ' + chgTask.state);
                }
         
         chgReq.comments = 'Change has been cancelled following RITM0090864 requested by Zsuzsanna Dobos-Matyas';
         chgReq.state = 308; // closed, '308' for Cancel
         chgReq.u_qs_closure_code = 3; // closure code set to cancelled
         //chgReq.setWorkflow(false); // it will bypass BRs CS etc.
         //chgReq.autoSysFields(false); // will prevent your name from appearing that you perform this acction
         chgReq.update();

      gs.print(chgReqNum + ' Change State after = '+ chgReq.state + ' New comment = ' + chgReq.comments);
    }