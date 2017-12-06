
function setCookie(cname, cvalue, exmin) {
    var d = new Date();
    d.setTime(d.getTime() + (exmin*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
$("#form-register").submit(function(e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.
    var url = "/users/register"; // the script where you handle the form input.
    var data = $("#form-register").serialize();
    console.log(data);
    $.ajax({
        type: "POST",
        url: url,
        dataType:'json',
        data: $("#form-register").serialize(), // serializes the form's elements.
        success: function(data)
        {
            if(data.status != 200){
                console.log(JSON.stringify(data.message)); // show response from the php script.
                $('.error-re').html(JSON.stringify(data.message));
            }else {
                // console.log(JSON.stringify(data)); // show response from the php script.
                $('.error-re').html('');
                // alert( (jQuery.parseJSON( JSON.stringify(data))).message.username);
                // location.href = "http://localhost:3000/views/home"
                calLogin((jQuery.parseJSON( JSON.stringify(data))).message.username,(jQuery.parseJSON( JSON.stringify(data))).message.password);
            }

        }
    });


});
function calLogin(username,password){
    var url = "/users/login"; // the script where you handle the form input.
    $.ajax({
        type: "POST",
        url: url,
        dataType:'json',
        data: {
            username:username,
            password:password
        },
        success: function(data)
        {
            {
                $('.error').html('');
                setCookie("data",JSON.stringify(data),15)
                location.href = "/views/home"
            }

        }
    });
}
//update avatar
$('#submit-upload').submit(function (e) {
    var data = new FormData($('#submit-upload')[0]);
    e.preventDefault();
    $.ajax({
        type:'post',
        url:'/files/upload',
        cache:false,
        contentType: false,
        processData: false,
        data:data,
        success: function (data) {
            alert('Success Upload ')
            $('#ava-input').val(data.message.filename)
        }

    })
})