window.onload=function () {
    function setCookie(cname, cvalue, exmin) {
        var d = new Date();
        d.setTime(d.getTime() + (exmin*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
// Get the modal
    var modal = document.getElementById('myModal2');

// Get the button that opens the modal
    var btn = document.getElementById("myBtn2");

// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }

// When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

// When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if ((event.target == modal)||(event.target == modalAdmin)) {
            modal.style.display = "none";
            modalAdmin.style.display="none";
        }
    }
    $('#login-form-link').click(function (e) {
        $("#login-form").delay(100).fadeIn(100);
        $(this).addClass('active');
        e.preventDefault();
    });
    $("#login-form").submit(function(e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        var url = "/users/login"; // the script where you handle the form input.
        var data = $("#login-form").serialize();
        console.log(data);
        $.ajax({
            type: "POST",
            url: url,
            dataType:'json',
            data: $("#login-form").serialize(), // serializes the form's elements.
            success: function(data)
            {

                if(data.status != 200){
                    console.log(JSON.stringify(data.message)); // show response from the php script.
                    $('.error').html(JSON.stringify(data.message));
                }else {
                    // console.log(JSON.stringify(data)); // show response from the php script.
                    $('.error').html('');
                    setCookie("data",JSON.stringify(data),15)
                    location.href = "/views/home"
                }

            }
        });


    });




    //login admin
    // Get the modal
    var modalAdmin = document.getElementById('myModalAdmin');

// Get the button that opens the modal
    var btnAdmin = document.getElementById("Admin");

// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[1];

// When the user clicks the button, open the modal
    btnAdmin.onclick = function() {
        modalAdmin.style.display = "block";
    }

// When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modalAdmin.style.display = "none";
    }
    $('#login-form-link-admin').click(function (e) {
        $("#login-form-admin").delay(100).fadeIn(100);
        $(this).addClass('active');
        e.preventDefault();
    });
    $("#login-form-admin").submit(function(e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        var url = "/users/adminlogin"; // the script where you handle the form input.
        var data = $("#login-form-admin").serialize();
        console.log(data);
        $.ajax({
            type: "POST",
            url: url,
            dataType:'json',
            data:data, // serializes the form's elements.
            success: function(data)
            {

                if(data.status != 200){
                    console.log(JSON.stringify(data.message)); // show response from the php script.
                    $('.error').html(JSON.stringify(data.message));
                }else {
                    // console.log(JSON.stringify(data)); // show response from the php script.
                    $('.error').html('');
                    setCookie("data",JSON.stringify(data),15)
                    location.href = "/views/admin"
                }

            }
        });


    });
};
