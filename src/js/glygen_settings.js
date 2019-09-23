// @author: Tatiana Williamson
// @description: UO1 Version-1.1.
// @Date: March 08, 2018.

/**
 * Represents a switch handler in glygen settings.
 * @param {string} el - Managing GlyGen settings. The user can enable or disable cookies. 
 */

function switchHandler(el) {
    $(document).ready(function() {
        var $checkbox = $('[name="manageSettingsEnabled"]');
        if(!$checkbox.is(':checked')) {
            $checkbox.attr('checked', false);
            $('#textManageSettingsDisabled').css('display', 'block');
            $('#textManageSettingsEnabled').css('display', 'none');
            $('#manageSettingsDisabled').css('display', 'block');
            $('#manageSettingsEnabled').css('display', 'none');
            
            clearLocalStore();
            doNotLog();
        } else {
            $checkbox.attr('checked', true);
            $('#textManageSettingsDisabled').css('display', 'none');
            $('#textManageSettingsEnabled').css('display', 'block');
            $('#manageSettingsDisabled').css('display', 'none');
            $('#manageSettingsEnabled').css('display', 'block');
            
            clearLocalStore();
            logID();
        }
    });
}

$(document).ready(function(){
    $("textManageSettingsDisabled").reset(function(event){
        event.preventDefault();
    });
});
// End @author: Tatiana Williamson