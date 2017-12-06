$(function () {
    function setCookie(cname, cvalue, exmin) {
        var d = new Date("October 13, 2014 11:13:00");
        d.setTime(d.getTime() + (exmin*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    $('#logoutBtn').click(function (e) {
        var url = "/users/logout";
        var data= getCookie("data");
        var token = jQuery.parseJSON(data)
        console.log(token.message.token);
        $.ajax({
            type: "GET",
            url: url,
            beforeSend: function(request) {
                request.setRequestHeader("authorization", token.message.token);
            },
            processData: false,
            success: function(data)
            {

                if(data.status != 200){
                    console.log(JSON.stringify(data.message)); // show response from the php script.
                }else {
                    console.log(JSON.stringify(data)); // show response from the php script.
                    setCookie('data','a',15)
                    location.href = "/views/home"
                }

            }
        });
        e.preventDefault();
    })
})
