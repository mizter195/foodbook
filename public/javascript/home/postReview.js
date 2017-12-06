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
$(document).ready(function () {
    $('#first-disabled2').selectpicker({
        iconBase: 'fa',
        tickIcon: 'fa-check',
        fontFamily: 'north-land'
    });
    //get data
    $.ajax({
        url:'/reviews/category',
        type:'GET',
        async:false,
        cache:false,
        contentType: false,
        processData: false,
        success:function (data) {
            var option = ``;
            $.each(data.message,function (i,primaryCategory) {
                option += ` <option value="` + primaryCategory.id + `">` + primaryCategory.category + `</option>`;
            })
            $('#first-disabled2').html(option).selectpicker('refresh');
        },
    });

    //update gallery
    $('#form-gallery').submit(function (e) {
        e.preventDefault();
        var data = new FormData($('#form-gallery')[0]);
        var arr = [];
        $.ajax({
            type:'post',
            url:'/files/upload-review',
            cache:false,
            contentType: false,
            processData: false,
            data:data,
            success: function (data) {
                alert('Success Upload')
               $.each(data.message,function (i) {
                    arr.push('"'+data.message[i].filename+'"');
               }
               )
              $('#img-input').val(arr);
            }

        })
    })

    //submit form without gallery
    $("#form-review").submit(function(e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        if($('#img-input').val() != ''){
        $('#cate-tempt').val('['+$('#first-disabled2').val()+']');
        var url = "/reviews/post"; // the script where you handle the form input.
        var data = $("#form-review").serialize();
        var cookie= getCookie("data");
        var token = jQuery.parseJSON(cookie)
        $.ajax({
            type: "POST",
            url: url,
            beforeSend: function(request) {
                request.setRequestHeader("authorization", token.message.token);
            },
            dataType:'json',
            data: data, // serializes the form's elements.
            success: function(data)
            {
                if(data.status != 200){
                    $('.error-re').html(JSON.stringify(data.message));
                }else {
                    $('.error-re').html('');
                    addGallery(data.message.id)
                }

            }
        });}else {
            alert('Not chose gallery image !')
            location.reload();
        }


    });


    //submit form with gallery
    function addGallery(id) {
        var cookie= getCookie("data");
        var token = jQuery.parseJSON(cookie)
        var names ="["+ $('#img-input').val()+"]"
        $.ajax({
            type:'POST',
            url:'/reviews/image',
            beforeSend: function(request) {
                request.setRequestHeader("authorization", token.message.token);
            },
            dataType:'json',
            data:{
                "review_id":id,
                "names":names
            },
            success: function (data) {
                alert('Your post review was successfully post, wait admin approve !')
                location.reload();
            }


        })
    }
//Set star for rating
    var $star_rating = $('.star-rating .fa');

    var SetRatingStar = function () {
        return $star_rating.each(function () {
            if (parseInt($star_rating.siblings('input.rating-value').val()) >= parseInt($(this).data('rating'))) {
                return $(this).removeClass('fa-heart-o').addClass('fa-heart');
            } else {
                return $(this).removeClass('fa-heart').addClass('fa-heart-o');
            }
        });
    };

    $star_rating.on('click', function () {
        $star_rating.siblings('input.rating-value').val($(this).data('rating'));
        return SetRatingStar();
    });

    SetRatingStar();

//up load galery

    $('#add_more').click(function() {
        "use strict";
        $(this).before($("<div/>", {
            id: 'filediv'
        }).fadeIn('slow').append(
            $("<input/>", {
                name: 'file[]',
                type: 'file',
                id: 'file',
                multiple: 'multiple',
                accept: 'image/*'
            })
        ));
    });

    $('#upload').click(function(e) {
        "use strict";
        e.preventDefault();

        if (window.filesToUpload.length === 0 || typeof window.filesToUpload === "undefined") {
            alert("No files are selected.");
            return false;
        }

        // Now, upload the files below...
        // https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications#Handling_the_upload_process_for_a_file.2C_asynchronously
    });

    deletePreview = function (ele, i) {
        "use strict";
        try {
            $(ele).parent().remove();
            window.filesToUpload.splice(i, 1);
        } catch (e) {
            console.log(e.message);
        }
    }

    $("#file").on('change', function() {
        "use strict";

        // create an empty array for the files to reside.
        window.filesToUpload = [];

        if (this.files.length >= 1) {
            $("[id^=previewImg]").remove();
            $.each(this.files, function(i, img) {
                var reader = new FileReader(),
                    newElement = $("<div id='previewImg" + i + "' class='previewBox'><img /></div>"),
                    deleteBtn = $("<span class='delete' onClick='deletePreview(this, " + i + ")'>X</span>").prependTo(newElement),
                    preview = newElement.find("img");

                reader.onloadend = function() {
                    preview.attr("src", reader.result);
                    preview.attr("alt", img.name);
                };

                try {
                    window.filesToUpload.push(document.getElementById("file").files[i]);
                } catch (e) {
                    console.log(e.message);
                }

                if (img) {
                    reader.readAsDataURL(img);
                } else {
                    preview.src = "";
                }

                newElement.appendTo("#filediv");
            });
        }
    });
})