function onLoad() {

   //Hide variables common to the Order Guide and included Items.

              var item = $("current_item");
              var guide = $("sysparm_guide");

              if (((item != null && guide != null) || (item == null && guide == null)) && item.value == guide.value)

                return;
  
              g_form.setVisible('delivery_location',false);
              g_form.setVisible('office',false);
              g_form.setVisible('home_address',false);
}
