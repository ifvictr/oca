$(function(){
    // Copy the short URL by clicking a button instead :)
    var clipboard = new Clipboard("#copy-url");
    // Store the last submit data for checks to slow down people spam-clicking
    var lastSubmit = {
        longUrl: "",
        aliasUrl: ""
    };
    // Focus on the long URL input, so it's paste and go
    $("#long-url").focus();
    clipboard.on("success", function(event){
        var $copyUrl = $("#copy-url");
        $copyUrl.val("Copied!");
        event.clearSelection();
        setTimeout(function(){
            $copyUrl.val("Copy");
        }, 500);
    });
    $("body").on("click", function(){
        // Remove all success and error indicators when clicking anywhere
        $("#long-url").removeClass();
        $("#short-url").removeClass();
    });
    $("form").on("submit", function(event){
        event.preventDefault();
    });
    $("#shorten-url").on("click", function(event){
        event.stopPropagation();
        var $longUrl = $("#long-url");
        var $aliasUrl = $("#alias-url");
        var $shortUrl = $("#short-url");
        console.log(lastSubmit);
        // If parts are same as last, stop execution
        if(($aliasUrl.val() === lastSubmit.aliasUrl) && ($longUrl.val() === lastSubmit.longUrl)){
            return;
        }
        lastSubmit.longUrl = $longUrl.val();
        lastSubmit.aliasUrl = $aliasUrl.val();
        // If URL input is empty, indicate fail and remove success
        if($.trim($longUrl.val()) === ""){
            $longUrl.addClass("fail");
            $shortUrl.removeClass("success");
            return;
        }
        $.ajax({
            url: "/api/create",
            type: "post",
            dataType: "json",
            data: {
                url: $longUrl.val(),
                alias: $.trim($aliasUrl.val())
            }
        })
            .done(function(data){
                console.log(data);
                // If 'success' is true, remove error indications and indicate success, then display shortened URL
                if(data.success){
                    $longUrl.removeClass("fail");
                    $shortUrl
                        .addClass("success")
                        .val(data.domain + "/" + data.id);
                }
                // If 'success' is false, remove success indicators and add error indicators
                else{
                    $longUrl.addClass("fail");
                    $shortUrl.removeClass("success");
                }
            })
            // What happened? Must be a problem with the back-end
            .fail(function(data){
                console.log(data);
                $longUrl.addClass("fail");
                $shortUrl.removeClass("success");
            });
    });
    $("#short-url").on("click", function(){
        var id = $(this).val().split("/")[1];
        // If 'id' is not undefined, open the link in a new tab
        if(id){
            window.open(id);
        }
    });
});