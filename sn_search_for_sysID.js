// Searches for a record using a sys_id
// Replace the "enterYourSys_IdHere" string with the sys_id you are looking for
//
// Optionally add a hyperlink to the record that was found.
// Useful when running the script in the 'Xplore: Developer Toolkit' -   https://share.servicenow.com/app.do#/detailV2/9a1be70e13800b000de935528144b04c/overview
// To add a link, set the "addLink" variable to "true"

(function () {
  try {
    //options
    var searchId = '01f25fc387210110dde2da873cbb35f6'; //the sys_id of the record you are looking for
    //searchId = "4715ab62a9fe1981018c3efb96143495";   //example - an OOB demo Incident
    //searchId = "08fcd0830a0a0b2600079f56b1adb9ae";   //example - an OOB Schedule, '8-5 weekdays'
    //searchId = "62a7bfaf0a0a0a6500c49682bd82376a";   //example - an OOB Business Rule, 'user query'
    var addLink = true; //set to "true" to add a link to the record in the output (Xplore)
    //initialize
    var tableName = '';
    var tableLabel = '';
    var tableWeWantToSearch = true;
    var foundRecord = false;
    var message = '';
    
    //loop through all the valid base-class tables (no need to look at any sub-classes)
    var table = new GlideRecord('sys_db_object');
    table.addEncodedQuery('super_class=NULL');
    table.query();

    while (table.next()) {
      
      //get the table name and label
      
      tableName = (table.getValue('name') + '').toLowerCase();
      tableLabel = (table.getValue('label') + '').toLowerCase();
      tableWeWantToSearch = true; //assume it is a table we want to search in

      //skip views and some other tables that return a lot of probably irrelevant records
      //just comment out the line if you want to include the table in the search

      if (tableName.indexOf('v_') == 0) tableWeWantToSearch = false;
      //views
      else if (tableName == 'ts_c_attachment') tableWeWantToSearch = false;
      //text search indices
      else if (tableName == 'ts_chain') tableWeWantToSearch = false;
      //..
      else if (tableName == 'ts_document') tableWeWantToSearch = false;
      //..
      else if (tableName == 'ts_phrase') tableWeWantToSearch = false;
      //..
      else if (tableName == 'ts_word') tableWeWantToSearch = false;
      //..
      else if (tableName == 'ts_word_roots') tableWeWantToSearch = false;
      //..
      else if (tableLabel.indexOf('text index ') == 0)
        tableWeWantToSearch = false;
      //..
      else if (tableLabel.indexOf('ts index stats') == 0)
        tableWeWantToSearch = false;
      //..
      else if (tableLabel.indexOf('recorded incremental change') == 0)
        tableWeWantToSearch = false;
      else if (tableName.indexOf('sh$') == 0) tableWeWantToSearch = false;
      else if (tableLabel.indexOf('rollback sequence') == 0)
        tableWeWantToSearch = false;
      else if (tableLabel.indexOf('score level') == 0)
        tableWeWantToSearch = false;
      else if (tableLabel.indexOf('pa favorites') == 0)
        tableWeWantToSearch = false;
      else if (tableName.indexOf('syslog') == 0) tableWeWantToSearch = false;
      else if (tableName.indexOf('sys_cache_flush') == 0)
        tableWeWantToSearch = false;
      else if (tableName.indexOf('sys_db_cache') == 0)
        tableWeWantToSearch = false;

      if (tableWeWantToSearch) {
        var searchTable = new GlideRecord(table.getValue('name'));

        //make sure it is a valid table first

        if (searchTable.isValid()) {
          //searchTable.setWorkflow(false);
          searchTable.addQuery('sys_id', searchId);
          searchTable.query();
          while (searchTable.next()) {
            foundRecord = true;

            _showFoundRecord();
          }
        } else {
          message =
            "***** Trying to search an invalid table name called '" +
            table.getValue('name') +
            "' - the sys_id of that sys_db_object record is '" +
            table.getValue('sys_id') +
            "'";

          gs.addInfoMessage(message);
        }
      }
    }

    if (foundRecord == false) {
      gs.addInfoMessage('The record was not found');
    }
  } catch (err) {
    gs.log('ERROR: ' + err);
  }

  function _showFoundRecord() {
    var details = searchTable.getDisplayValue();

    if (addLink == true) {
      details =
        "<a href='" +
        gs.getProperty('glide.servlet.uri') +
        'nav_to.do?uri=' +
        searchTable.getLink() +
        "' target='_blank'>" +
        searchTable.getDisplayValue() +
        '</a>';
    }

    message =
      "Found a record of type '" +
      searchTable.getClassDisplayValue() +
      "' (" +
      searchTable.getRecordClassName() +
      ") called '" +
      details +
      "'";

    gs.addInfoMessage(message);
  }
})();

//source: https://community.servicenow.com/community?id=community_blog&sys_id=8b4da229dbd0dbc01dcaf3231f961913
