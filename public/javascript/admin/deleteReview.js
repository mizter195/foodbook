$(function () {
        $.getJSON('/reviews/all').then(function (allReview) {

                $.each(allReview.message, function (i) {
                    $.getJSON('/comments/all?review_id=' + allReview.message[i].id).then(function (comments) {
                        if(comments.message=='No record') comments.message='';
                    $('#allReview').append(`<tr>
               <td>` + allReview.message[i].id + `</td> 
               <td>` + allReview.message[i].title + `</td> 
               <td>` + allReview.message[i].address + `</td> 
               <td>` + allReview.message[i].content + `</td> 
               <td>` + allReview.message[i].rate + `</td> 
               <td>` + allReview.message[i].user_id + `</td> 
               <td>` + allReview.message[i].createdAt + `</td> 
               <td>` + allReview.message[i].updatedAt + `</td>
                 <td><a href="#" onclick="deleteReview(` + allReview.message[i].id + `)">Delete</a></td>
                  <td><a href="#" onclick="showComment(` + allReview.message[i].id + `)">Show(`+ comments.message.length +`)</a></td>
                 </tr>
            `)})
                })
        })
    }
)
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
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
function deleteReview(id) {
    var data = getCookie("data");
    var token = jQuery.parseJSON(data)
    $.ajax({
        type: "post",
        url: '/reviews/delete',
        beforeSend: function (request) {
            request.setRequestHeader("authorization", token.message.token);
        },
        data: {
            id: id
        },
        success: function (result) {
            location.reload();
        }
    })
}
function showComment(id_review) {
    location.href = '/views/deleteComment?id_review=' + id_review
}