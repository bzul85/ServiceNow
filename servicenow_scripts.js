//  >>>>>>>>>>>>>>>>>>>>>>> Change Closure Code in Change Request <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var gr = new GlideRecord('change_request');
gr.addQuery('number', 'CHG0069215');
gr.query();

while(gr.next()){
gr.u_qs_closure_code = '5';
gr.update();
} 


// >>>>>>>>>>>>>>>>>>>>>>> CHANGE STATE IN CHANGE REQUEST <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var gr = new GlideRecord('change_request');
gr.addQuery('number', 'CHG0042583');
gr.query();
if(gr.next()) {
   gr.state = '308';          //308 CANCELLED
   gr.update();
}


var gr = new GlideRecord('change_request');
gr.addQuery('number', 'CHG0048114');
gr.query();
if(gr.next()) {
   gr.state = '308';  //308 CANCELLED
   gr.u_qs_closure_code =  '3'    //3 cancelled   
   gr.comments = 'cancelled as requested by  XXXXXXXXXX'
   gr.update();
}


// example
var target = new GlideRecord('incident'); 
target.addQuery('priority',1);
target.query(); // Issue the query to the database to get relevant records 
while (target.next()) { 
  // add code here to process the incident record 
}

// >>>>>>>>>>>>>>>>>>>>>>> UPDATE RITM / SRQ <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var gr = new GlideRecord('sc_req_item');
gr.addQuery('number', 'RITM0040224'); // ritm number
gr.query();
if(gr.next()) {
   gr.state = '8';
   gr.update();
}


// >>>>>>>>>>>>>>>>>>>>>>> UPDATE CHANGE TASK <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var gr = new GlideRecord('change_task');
gr.addQuery('number', 'CTASK0111702');
gr.query();
if(gr.next()) {
   gr.state = '4';
   gr.update();
}

// >>>>>>>>>>>>>>>>>>>>>>> UPDATE CHANGE TASK EX2 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
if(current.number == 4){
	var gr = new GlideRecord('change_task');
	gr.addQuery('change_request.number', current.number); // g_form.GetValue only works on client scripts and br's run on the server.. so you can't use g_form, instead use current.number
	gr.query();
	while(gr.next()) {
           gr.state = '4';
           gr.update();
	}
}


// >>>>>>>>>>>>>>>>>>>>>>> CREATE CHANGE TASKS FOR A SINGLE CHANGE REQUEST <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var gr = new GlideRecord('change_task');
// Create first change_task for each of the changes listed in the above array
gr.addQuery('change_request', '1c87925347c12200e0ef563dbb9a7177');
gr.query();
gr.order = 100;
gr.short_description = 'Notify Service Desk';
gr.assignment_group = 'Change Management';
gr.insert();

// >>>>>>>>>>>>>>>>>>>>>>> Create 2nd change_task for each of the changes listed in the above array <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var gr = new GlideRecord('change_task');
gr.addQuery('change_request', '1c87925347c12200e0ef563dbb9a7177');
gr.query();
gr.order = 200;
gr.short_description = 'Implement the change';
gr.assignment_group = 'Change Management';
gr.insert();

// >>>>>>>>>>>>>>>>>>>>>>> Create 3nd change_task for each of the changes listed in the above array <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var gr = new GlideRecord('change_task');
gr.addQuery('change_request', '1c87925347c12200e0ef563dbb9a7177');
gr.query();
gr.order = 300;
gr.short_description = 'Validate the change';
gr.assignment_group = 'Change Management';
gr.insert();


// >>>>>>>>>>>>>>>>>>>>>>> CREATE CHANGE TASKS FOR MULTIPLE CHANGE REQUESTS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var change_arr = ['CHG0040005', 'CHG0040006']; //Iterate through the changes that need these new change tasks

for (var i=0; i < change_arr.length; i++){
	// Create first change_task for each of the changes listed in the above array
	var gr = new GlideRecord('change_task');
	gr.change_request = getSysid(change_arr[i]);
	gr.order = 100;
	gr.short_description = 'Notify Service Desk';
	gr.assignment_group = 'Change Management';
	gr.insert();
	
	// Create 2nd change_task for each of the changes listed in the above array
	var gr = new GlideRecord('change_task');
	gr.change_request = getSysid(change_arr[i]);
	gr.order = 200;
	gr.short_description = 'Implement the change';
	gr.assignment_group = 'Change Management';
	gr.insert();
	
	// Create 3nd change_task for each of the changes listed in the above array
	var gr = new GlideRecord('change_task');
	gr.change_request = getSysid(change_arr[i]);
	gr.order = 300;
	gr.short_description = 'Validate the change';
	gr.assignment_group = 'Change Management';
	gr.insert();
}

function getSysid(num){

	// get the sys_id for a change request item
	var chg = new GlideRecord('change_request');
	chg.addQuery('number', num);
	chg.query();

	if(chg.next()){
		return chg.sys_id;
	}
		return '';
}

// >>>>>>>>>>>>>>>>>>>>>>> CANCEL CHANGE TASKS FOR A SINGLE CHANGE REQUEST <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var grt = new GlideRecord('change_task');
grt.addQuery('change_request', 'eaf5d21347c12200e0ef563dbb9a7109');
grt.query();
while(grt.next()) {
	if (grt.state != 4) {
		grt.state = 4;    // 4-canceled, 3-closed
		grt.update();
	}
}

// >>>>>>>>>>>>>>>>>>>>>>> CANCEL CHANGE TASKS FOR A SINGLE CHANGE REQUEST <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var gr = new GlideRecord('change_task');
	gr.addQuery('change_request', '4e2b3e895f7e289864d574a460069cdd');
        gr.addEncodedQuery('stateIN-5,1,2');
        gr.orderBy('order');
	gr.query();
        gs.log('change task count is: ' +  gr.getRowCount());
	while(gr.next()) {
        gs.log(gr.number + '\n');
        gr.state = '4';
        gr.update();
}

// >>>>>>>>>>>>>>>>>>>>>>> CANCEL CHANGE TASKS FOR MULTIPLE CHANGE REQUESTS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var change_arr = ['CHG0040003', 'CHG0040005', 'CHG0040006']; //Iterate through the changes that need their change tasks to be cancelled

for (var i=0; i < change_arr.length; i++){
	
	// UPDATE CHANGE TASK
	var gr = new GlideRecord('change_task');
	gr.change_request = getSysid(change_arr[i]);
	while(grt.next()) {
		if (grt.state != 4) {
			grt.state = 4;
			grt.update();
	}
}

function getSysid(num){

	// get the sys_id for a change request item
	var chg = new GlideRecord('change_request');
	chg.addQuery('number', num);
	chg.query();

	if(chg.next()){
		return chg.sys_id;
	}
		return '';
}

	
	
	
// >>>>>>>>>>>>>>>>>>>>>>> Multiple Deleting Records <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<	
	
var grRu = new GlideRecord('u_integration_subscription'); // table name
grRu.addEncodedQuery("your query"); //query
grRu.query();
grRu.deleteMultiple();
	
	
	
	
// >>>>>>>>>>>>>>>>>>>>>>> UPDATE INCIDENT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	
	// STATE TO CLOSED for specific incident
var grIncident = new GlideRecord('incident');
grIncident.addQuery('number','INC2843073');
grIncident.orderBy('order');
grIncident.query();
while (grIncident.next()) {
   grIncident.state = '7'; // 7 - closed
   grIncident.close_code = 'Not Solved (Not Reproducible)';
   grIncident.close_notes = 'closed as it is duplicate';
   // grIncident.update(); //uncoment after test
gs.log('number: ' + grIncident.number + ' ; close code: ' + grIncident.close_code + ' ; state: ' + grIncident.state.getDisplayValue() + ' ; close note: ' + grIncident.close_notes);
}

	
	// STATE TO CLOSED for inc older than 30 days for specyfic assgnment group
var grIncident = new GlideRecord('incident');
grIncident.addQuery('active','true');
grIncident.addQuery("sys_created_onRELATIVELE@dayofweek@ago@30");              // specifying the date of creation of incidents on which the script is to run
grIncident.addQuery('contact_type','event_management');                        // specyfic contact type
grIncident.addQuery('assignment_group','30d97d97c7de770064d5f293ef227935');    // specyfic assignment group
grIncident.addQuery('stateIN111,110,1');                                       // specyfying states
grIncident.orderBy('order');
grIncident.query();
while (grIncident.next()) {
    grIncident.state = '7'; // 7 - closed
    grIncident.close_code = 'Not Solved (Not Reproducible)';
    grIncident.close_notes = 'State automatically changed to Closed - Incident older than 30 days';
    grIncident.update();
}
	
	
	

