// Allows browser to load HTML content before JS
$(document).ready(function() {
    // Start Program Func //
    function startProgram() {
        // "Name" input // 
        $("#name").focus();
        // "Job Role Selection" //
        $("#other-title").hide();
        // "T-Shirt Shirt Selection" //
        $("#colors-js-puns").hide();
        $("#color").prepend(`<option value='select'>Please select a color...</option>`); 
        // "Payment Info" //
        initialPaymentDisplay();
        // "Error Message" //
        $('body').prepend(`<div id="js-error-div" class="js-error-message"></div>`);
        $('#js-error-div').hide();
        // Submit Button //
        // Disable button by replacing type=submit with "button"
        $('button').prop('type','button');
    }

    // Hides <textarea> until user selects 'other' from "Job Role Selection"
    function hideTextArea(userJobSelection){
        if (userJobSelection.val() == 'other') {
            $("#other-title").show();
        } else {
            $("#other-title").hide();
        }
    }
    // "T-Shirt Info" // 
    // Hide "Color" selection / displays only colors related to "Design" selection
    // Resets entire color options to "Please select a color..." when user choose diff design
    function shirtColorSelection(userDesign) {
        $('#color').val('select').show();
        $("#color > option").hide();
        $("#colors-js-puns").show();

        if (userDesign.val() == 'Select Theme') {
            $("#colors-js-puns").hide();
        }
        else if (userDesign.val() == 'js puns') {
            $("#color > option:contains(Puns)").show();
        } 
        else if (userDesign.val() == 'heart js') {
            $("#color > option:contains(JS shirt)").show();
        }
    }

    // Checkbox Section for "Register for Activites" //
    // Iterates through each input that is checked
    //Regex expression gathers cost from <label> set as total variable to the user in a <div>
    function getTotalValue () {
        let total = 0;
        const dollarsInRegex = /\$(\d{3})/;
        $('#js-total-cost-div').remove();

        $('input[type=checkbox]').each(function() {
            if ($(this)[0].checked) {
                let value = $(this).parent().text().match(dollarsInRegex);
                total += parseInt(value[1]);
            } 
        });
        const $cost = `<div id = "js-total-cost-div"><span>Total: $${total}</span></div>`;
        $('.activities').append($cost);
    }

    // Checkbox Section for "Register for Activites" //
    // Regex expression retrieves schedule time info from event trigger <label>  
    // Regex value is then iterated through each label to find a match
    // Once match is found, either add/remove disable attr, css opacity
    function conflictSchedule (userInputCheckbox) {
        const scheduleTimeRegex = /—(.+),/;
        const userActivity = userInputCheckbox.parent().text();
        const userScheduleActivity = userActivity.match(scheduleTimeRegex);
        
        if (userInputCheckbox[0].name == 'all'){
            return;
        }
        if (userInputCheckbox[0].checked) {
            $('.activities > label').each(function() {
                if ($(this)[0].children[0].checked == false) {
                    if ($(this).text().match(userScheduleActivity[0])) {
                        $(this).children([type='checkbox']).attr('disabled', 'true');
                        $(this).css("opacity", ".50");
                    }
                }
            });
        } else {
            $('.activities > label').each(function() {
                    if ($(this).text().match(userScheduleActivity[0])) {
                        $(this).children([type='checkbox']).removeAttr('disabled');
                        $(this).css("opacity", "1");
                    }
            });
        } 
    }

    // "Payment Info", initial display, hides all payments except credit-card, Stores, select, and add ID attr to paypal & bitcoin <p>
    // Credit-card becomes default payment selection  
    function initialPaymentDisplay(){
        const paypalDiv = $($('div:has(p)')[1]).attr('id','js-paypal');
        const bitcoinDiv = $($('div:has(p)')[2]).attr('id','js-bitcoin');
        paypalDiv.hide();
        bitcoinDiv.hide();
        $('[value="select_method"]').attr('disabled', 'true');
        $('[value="credit card"]').attr('selected', 'selected');
    }

    // "Payment Info", Display payment option based on user selection // credit card is set to default
    function paymentDisplay(paymentMethod) {
        $('#js-bitcoin').hide();
        $('#js-paypal').hide();
        $("#credit-card").show();

        if (paymentMethod.val() == 'paypal') {
            $('#js-paypal').show();
            $("#credit-card").hide();
        }
        else if (paymentMethod.val() == 'bitcoin') {
            $('#js-bitcoin').show();
            $("#credit-card").hide();
        }
    }

    // Displays a error message
    function formErrorMessage(event, message){
        $('#js-error-div').text(`${message}`);
        $('#js-error-div').fadeIn(200).delay(1500).slideUp();
    }

    // Sets placeholder error message
    function inputError(event, message) {  
        event.attr('placeholder', message);
        event.css("border-color","red");
    }

    // Validates inputs for email & payments with Regular Expression
    function regexValidation(event, eventTag) {
         const emailRegex = /^\w+@\w+\..{3}?$/;
         const creditCardRegex = /^\d{13,16}$/;
         const zipRegex = /^\d{5}$/;
         const cvvRegex = /^\d{3}$/;
         const userInput = event.val();

        if (eventTag.name == 'user_email') {
            if (!emailRegex.test(userInput) || userInput == '') {
                formErrorMessage(event, 'Invalid email address');
                event.css("border-color","red");
                return false;
            }
        }
        if (eventTag.name == 'user_cc-num') {
            if (!creditCardRegex.test(userInput)) {
                formErrorMessage(event, 'Card number must be (13-16) numeric digits long');
                event.css("border-color","red");
                return false;
            } 
        }
        if (eventTag.name == 'user_zip') {
            if (!zipRegex.test(userInput)) {
                formErrorMessage(event, 'Zip must be 5 numeric digits');
                event.css("border-color","red");
                return false;
            } 
        }
        if (eventTag.name == 'user_cvv') {
            if (!cvvRegex.test(userInput)) {
                formErrorMessage(event, 'CVV must be 3 numeric digits');
                event.css("border-color","red");
                return false;
            } 
        }
    }
    
    // Validates real time errors, empty inputs and/or failed Regex conditions
    function validateKeyUp(event) {
        const eventTag = $(event)[0];
        event.css("border-color", "#c1deeb");

        if (eventTag.id == 'name' && event.val() == '') {
            inputError(event, 'Name is required');
        } 
        if (eventTag.id == 'mail' && event.val() == '') {
            inputError(event, 'Email is required');
        } 
        else if (eventTag.id == 'mail' && event.val() && event.off( "focusout" )) {
            regexValidation(event, eventTag);
        }
        if (eventTag.id == 'cc-num' && event.val() == '') {
            inputError(event, 'Credit Card Number is required');
        } 
        else if (eventTag.id == 'cc-num' && event.val() && event.off( "focusout" )) {
            regexValidation(event, eventTag);
        }
        if (eventTag.id == 'zip'  && event.val() == '') {
            inputError(event, 'Zip is required');
        } 
        else if (eventTag.id == 'zip' && event.val() && event.off( "focusout" )) {
            regexValidation(event, eventTag);
        }
        if  (eventTag.id == 'cvv'  && event.val() == '') {
            inputError(event, 'CVV is required');           
        } 
        else if (eventTag.id == 'cvv' && event.val() && event.off( "focusout" )) {
            regexValidation(event, eventTag);
        }
    }
    // Validates all necessary form requirements for a POST request, returns a boolean to "submit" button E.Listener
    function formValidation() {
        // Name validation
        if ($('#name').val() == '') {
            $('#js-error-div').text('Please type your name');
            $('#js-error-div').fadeIn(200).delay(1500).slideUp();
            return false;
        }
        // Email Regex validation
        else if (regexValidation($('[name="user_email"]'), $('[name="user_email"]')[0]) == false) {
            return false;
        }
        // If Credit Card Option True, Payment Regex validation
        else if ($('#payment').val() == 'credit card') {
            if (regexValidation($('[name="user_cc-num"]'), $('[name="user_cc-num"]')[0]) == false){
                return false;
            }
            if (regexValidation($('[name="user_zip"]'), $('[name="user_zip"]')[0]) == false) {
                return false;
            }
            if (regexValidation($('[name="user_cvv"]'), $('[name="user_cvv"]')[0]) == false) {
                return false;
            } 
        } 
        // Activity Registration validation
        let numchecked = 0;
        $('input[type=checkbox]').each(function() {
            if ($(this)[0].checked) {
                numchecked += 1;
            }
        });
        if (numchecked === 0) {
            $('#js-error-div').text('Please choose an activity');
            $('#js-error-div').fadeIn(200).delay(1500).slideUp();
            return false;
        }
        // If nothing returns false, return true to Button E.Listener 
        return true;
         
    }
   
    // E Listener "T-Shirt Info"
    $('#design').change( function() {
        shirtColorSelection($(this));
    });

    // E Listener for "Register for Activities"
    $("[type = 'checkbox']").change( function() {
        getTotalValue();
        conflictSchedule($(this));
    });
   // E Listener for "Job Role"
    $('#title').change( function() {
        hideTextArea($(this));       
    });
    // E Listener for "Payment Method"
    $('#payment').change( function() {
        paymentDisplay($(this));       
    });
    // E Listener for all keyup events in form
    $('form').on("keyup, focusout", function() {
        validateKeyUp($(event.target));
    });
    // E Listener for "Submit Button" //
    // Allows button to submit only if formValidation returns True 
    $('button').hover( function() {
        if(formValidation()) {
            $(this).prop('type','submit');
        } 
    }, function(){
        return;
    });

    
    // Initialize Program //
    startProgram();

});