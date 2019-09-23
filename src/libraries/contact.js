function setupContactForm() {
    // init the validator

    $('#contact-form').validator();


    // when the form is submitted
    $('#contact-form').on('submit', function (e) {

        // if the validator does not prevent form submit
        if (!e.isDefaultPrevented()) {
            e.preventDefault();
            var url = getWsUrl("contact");
            var formVal = $(this).serializeArray();
            var formData = {
                "fname": formVal[0].value,
                "lname": formVal[1].value,
                "email": formVal[3].value,
                "subject": formVal[2].value,
                "message": formVal[4].value
            }
            // POST values in the background the the script URL
            $.ajax({
                type: "POST",
                url: url,
                data: "query=" + JSON.stringify(formData),
                timeout: getTimeout("contact"),
                success: function (result) {
                    // data = JSON object that contact.php returns
                    var messageAlert, messageText;
                    if (result.error_code) {
                        messageAlert = 'alert-danger';
                        messageText = result.error_code;
                    } else {
                        // we recieve the type of the message: success x danger 
                        messageAlert = result.type;
                        messageText = result.message;
                    }
                    contactReply(messageAlert, messageText);

                    if (messageAlert == 'alert-danger')
                        activityTracker("error", null, "contact form: " + messageText);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    var messageAlert = 'alert-danger';
                    var messageText = "Oops, something went wrong! We did not receive your message. Please try again later. \nError: " + errorThrown;
                    contactReply(messageAlert, messageText);
                    // getting the appropriate error message from this function in utility.js file
                    var err = decideAjaxError(jqXHR.status, textStatus);
                    activityTracker("error", "", err + ": " + errorThrown);
                }
            });
            return false;
        }
    })

    function contactReply(messageAlert, messageText) {
        // let's compose Bootstrap alert box HTML
        var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';

        // If we have messageAlert and messageText
        if (messageAlert && messageText) {
            // inject the alert to .messages div in our form
            $('#contact-form').find('.messages').html(alertBox);
            // empty the form
            $('#contact-form')[0].reset();
        }
    }
}

function sendFeedbackSuccess() {
    var feedbackForm = $('#feedback');
    feedbackForm.find('.alert-success').show();
    feedbackForm.find('[name="name"]').val('');
    feedbackForm.find('[name="email"]').val('');
    feedbackForm.find('[name="feedback_text"]').val('');
}

function sendFeedbackError(jqXHR, textStatus, errorThrown) {
    var messageAlert = 'alert-danger';
    var messageText = "Oops, something went wrong! We did not receive your message. Please try again later. \nError: " + errorThrown;
    // contactReply(messageAlert, messageText);
    // getting the appropriate error message from this function in utility.js file
    var err = decideAjaxError(jqXHR.status, textStatus);
    activityTracker("error", "", err + ": " + errorThrown);
}

function sendFeedback() {
    var form = $('#feedback');
    var page = window.location.href;
    page = stripQueryString(page);
    var name = form.find('[name="name"]').val().split(' ');

    // get data
    var formData = {
        fname: (name[0] ? name[0] : 'None Given'),
        lname: (name[1] ? name[1] : 'None Given'),
        email: form.find('[name="email"]').val(),
        page: page,
        subject: 'Feedback Form' + $('#feedback .type li.active').text(),
        message: form.find('[name="feedback_text"]').val()
    }
    $.ajax({
        type: "POST",
        url: getWsUrl("contact"),
        data: "query=" + JSON.stringify(formData),
        timeout: getTimeout("contact"),
        success: sendFeedbackSuccess,
        error: sendFeedbackError
    });
}
function setupFeedbackForm() {
    $.get('_feedbackform.html', function (text) {
        $('.container-fluid').first().after(text);
        var feedbackForm = $('#feedback');
        $('.toggle').click(function () {
            $('.sidebar-contact').toggleClass('active')
            $('.toggle').toggleClass('active');
            feedbackForm.find('.alert-success').hide();
        });
        feedbackForm.on('submit', function (event) {
            event.preventDefault();
            sendFeedback();
            return false;
        });
        feedbackForm.find('.type li').on('click', function () {
            $('#feedback .type li').removeClass('active');
            $(this).addClass('active');
        });
        feedbackForm.find('.alert-success').hide();
    });
}

/**
 * Strips query params from a url string
 * @param {String} url Url string
 */
function stripQueryString(url) {
    return url.substring(0, url.indexOf("?"));
}




$(function () {
    var contactForm = $('#contact-form');
    if (contactForm.length) {
        setupContactForm();
    } else {
        setupFeedbackForm();
    }
});