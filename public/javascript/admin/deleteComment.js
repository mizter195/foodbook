$(function () {
var id_review=(getParameterByName('id_review'));
$.getJSON('/comments/all?review_id='+ id_review).then(function (allcomment) {
$.each(allcomment.message,function (i) {
    $('#allComment').append(`+
    <tr>
               <td>`+ allcomment.message[i].id +`</td> 
               <td>`+ allcomment.message[i].content +`</td> 
               <td>`+ allcomment.message[i].user_id +`</td> 
               <td>`+ allcomment.message[i].review_id +`</td> 
               <td>`+ allcomment.message[i].createdAt +`</td> 
               <td>`+ allcomment.message[i].updatedAt +`</td> 
                <td><a href="#" onclick="detelecomment(`+ allcomment.message[i].id +`)">Delete</a></td>
               </tr>
    +`)
})
})

}
)
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function detelecomment(id_comment) {
    var data= getCookie("data");
    var token = jQuery.parseJSON(data)
    $.ajax({
        type: "post",
        url: '/comments/delete',
        beforeSend: function(request) {
            request.setRequestHeader("authorization", token.message.token);
        },
        data:{
            id:id_comment
        },
        success: function(result)
        {
            location.reload();
        }})
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