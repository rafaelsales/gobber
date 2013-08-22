var receiversSelector = '#dashboard #receivers :checkbox[name=target]';
var sendToAllSelector = '#dashboard #receivers #sendToAll';

$(document).on('change', sendToAllSelector, function() {
	UI.synchonizeAllSelected(true);
});

UI = {
	synchonizeAllSelected: function(forceUncheck) {
		var allChecked = $(sendToAllSelector).is(':checked');
		if (allChecked || forceUncheck) {
		  $(receiversSelector).attr({ checked: allChecked, disabled: allChecked });
	  }
	}
};