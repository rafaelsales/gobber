var sendToAllSelector = '#dashboard #receivers #sendToAll';

$(document).on('change', sendToAllSelector, function() {
	UI.synchonizeAllSelected(true);
});

UI = {
	synchonizeAllSelected: function(forceUncheck) {
		var allChecked = $(sendToAllSelector).is(':checked');
		if (allChecked || forceUncheck) {
		  $('#dashboard #receivers :checkbox[name=target]').attr({ checked: allChecked,
                                                               disabled: allChecked });
	  }
	},
	getReceivers: function() {
		if ($('#dashboard #sendToAll').is(':checked')) {
			return null;
		}
		return $('#dashboard :checkbox[name=target]:checked')
					   .map(function() { return $(this).val(); }).toArray();
	}
};
