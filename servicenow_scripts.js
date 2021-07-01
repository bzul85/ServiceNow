//  Change Closure Code in Change Request

var gr = new GlideRecord('change_request');
gr.addQuery('number', 'CHG0069215');
gr.query();

while(gr.next()){
gr.u_qs_closure_code = '5';
gr.update();
} 


// CHANGE STATE IN CHANGE REQUEST 

var gr = new GlideRecord('change_request');
gr.addQuery('number', 'CHG0042583');
gr.query();
if(gr.next()) {
   gr.state = '308';          //308 CANCELLED
   gr.update();
}
