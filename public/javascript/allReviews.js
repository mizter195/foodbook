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
$(document).ready(function () {
    //recent post
    if (getCookie('data') == '') {
        $.getJSON('/reviews/recent?limit=4').then(function (recent) {
            $.each(recent.message, function (i) {
                $.getJSON('/reviews/image?review_id=' + recent.message[i].id).then(function (images) {
                    $('#recent-post').append(`
            <li class="recent-post">
                                <div class="post-img">
                                    <img src="/uploads/review/` + images.message[0].name + `"
                                         class="img-responsive">
                                </div>
                                <a class="recentPost" href="" id="v2-` + recent.message[i].id + `"><h5 >` + recent.message[i].title + `</h5></a>
                                <p>
                                    <small><i class="fa fa-calendar" data-original-title="" title=""></i> ` + recent.message[i].createdAt + `
                                    </small>
                                </p>
                            </li>
                             <hr>
            `)
                })
            })
        })
    } else {
        var user_id = (jQuery.parseJSON(getCookie('data'))).message.body.id
        $.getJSON('/reviews/suggest?user_id=' + user_id).then(function (suggest) {
            var cate = suggest.message.category_id;
            if(cate==0){
                $.getJSON('/reviews/recent?limit=4').then(function (recent) {
                    $.each(recent.message, function (i) {
                        $.getJSON('/reviews/image?review_id=' + recent.message[i].id).then(function (images) {
                            $('#recent-post').append(`
            <li class="recent-post">
                                <div class="post-img">
                                    <img src="/uploads/review/` + images.message[0].name + `"
                                         class="img-responsive">
                                </div>
                                <a class="recentPost" href="" id="v2-` + recent.message[i].id + `"><h5 >` + recent.message[i].title + `</h5></a>
                                <p>
                                    <small><i class="fa fa-calendar" data-original-title="" title=""></i> ` + recent.message[i].createdAt + `
                                    </small>
                                </p>
                            </li>
                             <hr>
            `)
                        })
                    })
                })
            }else {
            $.getJSON('/reviews/reviewbycategory?category_id=' + cate).then(function (recent) {
                $.each(recent.message, function (i) {
                    if(i==5) return false;
                    $.getJSON('/reviews/image?review_id=' + recent.message[i].id).then(function (images) {
                        $('#recent-post').append(`
                        <li class="recent-post">
                                <div class="post-img">
                                    <img src="/uploads/review/` + images.message[0].name + `"
                                         class="img-responsive">
                                </div>
                                <a class="recentPost" href="" id="v2-` + recent.message[i].id + `"><h5 >` + recent.message[i].title + `</h5></a>
                                <p>
                                    <small><i class="fa fa-calendar" data-original-title="" title=""></i> ` + recent.message[i].createdAt + `
                                    </small>
                                </p>
                            </li>
                             <hr>
            `)
                    })
                })
            })}
        })
    }
    $.getJSON('/reviews/all').then(function (results) {
        for (let i = 0; i < results.message.length; i++) {
            $.getJSON('/users/id?id=' + results.message[i].user_id).then(function (user) {
                    $.getJSON('/rates/get?review_id=' + results.message[i].id).then(function (rates) {
                        $.getJSON('/comments/all?review_id=' + results.message[i].id).then(function (comments) {
                            $.getJSON('/reviews/image?review_id=' + results.message[i].id).then(function (images) {
                                if (comments.message == 'No record') comments.message = '';
                                $('#allReviews').append(`<div class="col-lg-6 col-md-6">
                        <aside>
                            <img src="/uploads/review/` + images.message[0].name + `" class="img-responsive img-outer">
                            <div class="content-title">
                                <div class="text-center">
                                   <h3> <a href="" id="id-` + results.message[i].id + `" class="title-review">` + results.message[i].title + `</a></h3>
                                </div>
                            </div>
                            <div class="content-footer">
                                <img class="user-small-img"
                                     src="/uploads/avatar/` + user.message[0].avatar + `">
                                <span style="font-size: 16px;color: #fff;">` + user.message[0].name + `</span>
                                <span class="pull-right">
				<a href="#" data-toggle="tooltip" data-placement="left" title="Comments"><i class="fa fa-comments"></i> ` + comments.message.length + `</a>
				<a href="#" data-toggle="tooltip" data-placement="right" title="Star"><i class="fa fa-star" style="margin-right: 5px"></i>` + rates.message.score + `</a>
				</span>
                                <div class="user-ditels">
                                    <div class="user-img"><img
                                                src="/uploads/avatar/` + user.message[0].avatar + `"
                                                class="img-responsive"></div>
                                    <span class="user-full-ditels">
                        <h3>` + user.message[0].name + `</h3>
                        <p>` + user.message[0].email + `</p>
                        </span>
                                    <div class="social-icon">
                                        <a href="#"><i class="fa fa-facebook" data-toggle="tooltip"
                                                       data-placement="bottom" title="Facebook"></i></a>
                                        <a href="#"><i class="fa fa-twitter" data-toggle="tooltip"
                                                       data-placement="bottom" title="Twitter"></i></a>
                                        <a href="#"><i class="fa fa-google-plus" data-toggle="tooltip"
                                                       data-placement="bottom" title="Google Plus"></i></a>
                                        <a href="#"><i class="fa fa-youtube" data-toggle="tooltip"
                                                       data-placement="bottom" title="Youtube"></i></a>
                                        <a href="#"><i class="fa fa-github" data-toggle="tooltip"
                                                       data-placement="bottom" title="Github"></i></a>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>`)
                            })
                        })
                    })
                }
            )
        }
    });

    $.getJSON('/reviews/category').then(function (results) {
        for (let i = 0; i < results.message.length; i++) {
            $('#category').append(`<div class="last-post">
                        <button class="accordion">` + results.message[i].category + `</button>
                        <div class="panel-col">
                            <div class="more">
                                <a class="link link-yaku" href="#" id="cate-` + results.message[i].id + `">
                                    <span>Find Now</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <hr>`)
        }
        $('.link-yaku').click(function (e) {
            e.preventDefault();
            var id = ($(this).attr('id')).slice(5);
            location.href = '/views/searchcategory?cate-id=' + id;
        })

        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
            acc[i].onclick = function () {
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            }
        }
    })

    $('#searchReviewsTitle').click(function (e) {
        e.preventDefault();
        var title = $('#title').val();
        location.href = "/views/searchtitle?title=" + title;
    });


});

$('[data-toggle="tooltip"]').tooltip();


$(document).on('click', '.title-review', function (e) {
    // your function here
    e.preventDefault();
    var review_id = ($(this).attr('id')).slice(3);
    // location.href = "/views/detail?id="+ review_id;
    location.href = "/views/detail?id=" + review_id;
});
$(document).on('click', '.recentPost', function (e) {
    // your function here
    e.preventDefault();
    var review_idv2 = ($(this).attr('id')).slice(3);
    location.href = "/views/detail?id=" + review_idv2;
});
