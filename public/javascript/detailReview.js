var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
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
function login_redirect() {
        document.getElementById('myModal2').style.display = "block";
}
$(document).ready(function () {

    //recent post
    if (getCookie('data') == '') {
        $.getJSON('/reviews/recent?limit=4').then(function (recent) {
            $.each(recent.message,function (i) {
                $.getJSON('/reviews/image?review_id=' + recent.message[i].id).then(function (images) {
                    $('#recent-post').append(`
            <li class="recent-post">
                                <div class="post-img">
                                    <img src="/uploads/review/` + images.message[0].name + `"
                                         class="img-responsive">
                                </div>
                                <a class="recentPost" href="" id="v2-` + recent.message[i].id + `"><h5 >`+ recent.message[i].title +`</h5></a>
                                <p>
                                    <small><i class="fa fa-calendar" data-original-title="" title=""></i> `+ recent.message[i].createdAt +`
                                    </small>
                                </p>
                            </li>
                             <hr>
            `)})})
        })
    } else {
        var user_id = (jQuery.parseJSON(getCookie('data'))).message.body.id
        $.getJSON('/reviews/suggest?user_id=' + user_id).then(function (suggest) {
            var cate = suggest.message.category_id
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
    var id = getUrlParameter('id')
    var data = getCookie("data");
    if(data=='') {

    }else {

        var token = jQuery.parseJSON(data)
        //call api search recent
        $.ajax({
            url:'/reviews/record',
            type:'POST',
            beforeSend: function (request) {
                request.setRequestHeader("authorization", token.message.token);
            },
            data:{
                review_id:id
            },
            success:function (e) {

            }



        })
    }

    //fill data review

    $.getJSON('/reviews/get?id=' + id).then(function (results) {
        $.getJSON('/rates/get?review_id=' + id).then(function (rates) {
            $.getJSON('/comments/all?review_id=' + id).then(function (comments) {
                $.getJSON('/users/id?id=' + results.message.user_id).then(function (user) {
                    if (comments.message == 'No record') comments.message = '';
                    $('.title').append(results.message.title);
                    $('.create').append(results.message.createdAt)
                    $('.cmt').append(comments.message.length)
                    $('.rate').append(rates.message.score)
                    $('.user').append(user.message[0].name)
                    $('.rate-user').append(results.message.rate)
                    $('.content').append(results.message.content)
                    console.log(user)
                    $('.avatar-review').attr('src', '/uploads/avatar/' + user.message[0].avatar);
                    $.each(results.message.categories, function (i) {
                        $('.cate').append(`<li class="list-inline-item list-cate"><a class="cate-link " href="#" id="cate-review-` + results.message.categories[i].id + `">` + results.message.categories[i].category + `</a></li>`)
                    })
                    $.each(results.message.images,function (i) {
                        $('.carousel-inner').append(`
                                 <div class="carousel-item ">
                                            <img class="d-block img-fluid" src="/uploads/review/`+ results.message.images[i].name +`" >
                                        </div>
                                `)

                        $('.carousel-indicators').append(`
                                <li data-target="#carouselExampleIndicators" data-slide-to="`+ i+`"></li>
                                                            `)
                    })


                }).then(function () {
                    $('.carousel-inner>.carousel-item:first-child').addClass("active")
                    $('.carousel-indicators>li:first-child').addClass("active")
                    //get all review by category tag
                    $('.cate-link').click(function (e) {
                        e.preventDefault();
                        var id = ($(this).attr('id')).slice(12);
                        location.href = '/views/searchcategory?cate-id=' + id;
                    })
                })
            })
        });


        $.getJSON('/comments/all?review_id=' + id).then(function (comment) {
            if (comment.message == 'No record') {
                $('.comment').append("<div style='background-color: white;padding: 30px; " +
                    "box-shadow: 0 6px 12px 0 rgba(185, 185, 185, 0.25), 0 10px 25px 0 rgba(185, 185, 185, 0.25);'>No comment</div>")
            } else {
                for (let i = 0; i < comment.message.length; i++) {
                    $.getJSON('/users/id?id=' + comment.message[i].user_id).then(function (user) {
                        $('.comment').append(`
                            <div class="media wow fadeInLeft animated comment-block" data-wow-delay=".5s">
                                <div class="media-left">
                                    <a href="#">
                                        <img src="/uploads/avatar/` + user.message[0].avatar + `" alt="" width="80px" height="80px">
                                    </a>
                                </div>
                                <div class="media-left">
                                <div >
                                    <p class="smith"><a href="#">` + user.message[0].name + `</a> <span style="font-size: 13px">` + comment.message[i].createdAt + `</span></p>
                                    <div class="clearfix"></div>
                                </div>
                                <div>
                                    <p class="text-comment">` + comment.message[i].content + `</p>
                                </div>
                                </div>
                            </div>
                          `)
                    })
                }
            }
        })
        //comment
        if (getCookie('data') != '') {
            $('.leave').append(`<h3>Leave a comment</h3>
                            <form method="post" action="/views/comment" style="background-color: rgba(255, 255, 255, 0.8); 
                            box-shadow: 0 6px 12px 0 rgba(185, 185, 185, 0.25), 0 10px 25px 0 rgba(185, 185, 185, 0.25);
                            padding: 30px;">
                                <div class="form-group single-grid wow fadeInLeft animated" data-wow-delay=".5s">
                                <div class="row" style="margin-left: 0">
                                    <div style="color: #757575; display: flex">
                                        <span style="align-self: flex-end; font-size: 20px">Can you rate this post?</span>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="star-rating">
                                            <span class="fa fa-star-o" data-rating="1"></span>
                                            <span class="fa fa-star-o" data-rating="2"></span>
                                            <span class="fa fa-star-o" data-rating="3"></span>
                                            <span class="fa fa-star-o" data-rating="4"></span>
                                            <span class="fa fa-star-o" data-rating="5"></span>
                                            <input type="hidden" name="rate" class="rating-value" value="2" id="rating-comment">
                                        </div> 
                                     </div>
                                </div>
                        <input type="hidden" value="` + id + `" name="review_id">
                                    <textarea name="content" style="color: #757575" placeholder="Comment"></textarea>
                                    <label class="hvr-rectangle-out">
                                        <input id="comment-form" type="submit" value="Send">
                                    </label>
                                </div>
                            </form>`)
        } else {
            $('.leave').html('<div ><a style="color: white;text-decoration: none;cursor: pointer" href="#" onclick="login_redirect()">You have to login to comment</a></div>')
        }


        //Set star for rating
        var $star_rating = $('.star-rating .fa');

        var SetRatingStar = function () {
            return $star_rating.each(function () {
                if (parseInt($star_rating.siblings('input.rating-value').val()) >= parseInt($(this).data('rating'))) {
                    return $(this).removeClass('fa-star-o').addClass('fa-star');
                } else {
                    return $(this).removeClass('fa-star').addClass('fa-star-o');
                }
            });
        };

        $star_rating.on('click', function () {
            $star_rating.siblings('input.rating-value').val($(this).data('rating'));
            return SetRatingStar();
        });

        SetRatingStar();

        //submit form rat + comment
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

        $('#comment-form').click(function (e) {
            e.preventDefault();
            var url_rate = "/rates/ratereview";
            var url = "/comments/post";
            var data = getCookie("data");
            var token = jQuery.parseJSON(data)
            var review_id = id;
            var content = $('textarea').val();
            var rate = $('#rating-comment').val();
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    review_id: review_id,
                    content: content
                },
                beforeSend: function (request) {
                    request.setRequestHeader("authorization", token.message.token);
                },
                success: function (data) {
                    location.href = ""
                }
            })
            $.ajax({
                type: 'POST',
                url: url_rate,
                data: {
                    rate: rate,
                    review_id: review_id
                },
                beforeSend: function (request) {
                    request.setRequestHeader("authorization", token.message.token);
                },
                success: function (data) {
                    location.href = ""
                }

            })
        })


    })


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

$(document).on('click', '.recentPost', function (e) {
    // your function here
    e.preventDefault();
    var review_idv2 = ($(this).attr('id')).slice(3);
    location.href = "/views/detail?id=" + review_idv2;
});
