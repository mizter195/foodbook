$(function () {
    var data= getCookie("data");
    var token = jQuery.parseJSON(data)
    $.ajax({
        type: "GET",
        url: '/reviews/pending',
        beforeSend: function(request) {
            request.setRequestHeader("authorization", token.message.token);
        },
        success: function(pending)
        {
            $.each(pending.message,function (i) {
                $('#allpending').append(`<tr>
               <td>`+ pending.message[i].id +`</td> 
               <td>`+ pending.message[i].title +`</td> 
               <td>`+ pending.message[i].title +`</td> 
               <td>`+ pending.message[i].content +`</td> 
               <td>`+ pending.message[i].rate +`</td> 
               <td>`+ pending.message[i].user_id +`</td> 
               <td>`+ pending.message[i].createdAt +`</td> 
               <td>`+ pending.message[i].updatedAt +`</td>
                <td><a href="#" onclick="approve(`+ pending.message[i].id +`)">Approve</a></td>
                 <td><a href="#" onclick="decline(`+ pending.message[i].id +`)">Decline</a></td></tr>
            `)
        })
    }})
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
function approve(id) {
    var data= getCookie("data");
    var token = jQuery.parseJSON(data)
    $.ajax({
        type: "post",
        url: '/reviews/approve',
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
function decline(id) {
    var data= getCookie("data");
    var token = jQuery.parseJSON(data)
    $.ajax({
        type: "post",
        url: '/reviews/delete',
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