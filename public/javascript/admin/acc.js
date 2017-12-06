$(function () {
 $.getJSON('/users/all').then(function (user) {
     $.each(user.message,function (i) {
         $('#allUser').append(`<tr>
               <td>`+ user.message[i].id +`</td> 
               <td>`+ user.message[i].username +`</td> 
               <td>`+ user.message[i].password +`</td> 
               <td>`+ user.message[i].email +`</td> 
               <td>`+ user.message[i].name +`</td> 
               <td>`+ user.message[i].sex +`</td> 
               <td>`+ user.message[i].age +`</td> 
               <td>`+ user.message[i].avatar +`</td>
                <td><a href="#" onclick="deleteUser(`+ user.message[i].id +`) ">Delete</a></td></tr>
            `)
     })
 })
})
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
function deleteUser(id) {
    var data= getCookie("data");
    var token = jQuery.parseJSON(data)
    $.ajax({
        type: "post",
        url: '/users/delete',
        beforeSend: function(request) {
            request.setRequestHeader("authorization", token.message.token);
        },
        data:{
            id:id
        },
        success: function(result)
        {
            location.reload();
        }})
}
