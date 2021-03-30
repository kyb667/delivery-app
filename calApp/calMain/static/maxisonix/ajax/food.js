// 음식별로 좋아하는 카운트 세기
$('#likeit').on('click',function(){
    var id = $(this).data("id")
    $.ajax({
        url:'../getlovenum/'+ id + '/',
        dataType: 'json',
        success: function(data){
            $('#lovenum').text(data['lovenum'])
        }
    })
});
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
//  댓글 등록하기
$('#comment_submit').click(function(){
    var id = $(this).data("id")
    var contents = $('#contents').val();
    var token = getCookie('csrftoken');
    $.ajax({
        headers: { "X-CSRFToken": token },
        type:'POST',
        url:'../../../comment/'+ id + '/',
        dataType : "json",
        data : {
            'contents':contents,
        },
        success: function(data){
            ul = document.querySelector('#show_comments')
            html = ''
            for( var i = 0; i < data['newCommentInfo'].length; i++ ){
                info = data['newCommentInfo'][i]
                html += '<li> <article> <header> <figure class="avatar"><a class="up_comment_love" id="up_comment_love_' 
                + id + '"data-id="' + id + '">' + info.commentlove + '</a></figure> <figure class="avatar"> <a class="up_comment_hate" id="up_comment_hate_'
                + id + '"data-id="' + id + '">' + info.commenthate + '</a></figure> <address> By <a href="#"> ' + info.writer_id + '</a></address>'
                + '<span><time>' + info.writingtime + '</time></span></header><div class="comcont">'
                + '<p>'+ info.comment + '</p><p>' + info.id + '</p></div></article></li>'
            }
            ul.innerHTML = html;
        }
    })
})
//  댓글 좋아요
$('.up_comment_love').click(function(){
    var commentid = $(this).data("id")
    var token = getCookie('csrftoken');
    $.ajax({
        headers: { "X-CSRFToken": token },
        type:'POST',
        url:'../../../comment/reaction/',
        dataType : "json",
        data : {
            'commentid':commentid,
            'reaction': 'commentlove'
        },
        success: function(data){
            $('#up_comment_love_'+commentid).text(data['data'])
        }
    })
})
//  댓글 싫어요
$('.up_comment_hate').click(function(){
    var commentid = $(this).data("id")
    var token = getCookie('csrftoken');
    $.ajax({
        headers: { "X-CSRFToken": token },
        type:'POST',
        url:'../../../comment/reaction/',
        dataType : "json",
        data : {
            'commentid':commentid,
            'reaction': 'commenthate'
        },
        success: function(data){
            $('#up_comment_hate_'+commentid).text(data['data'])
        }
    })
})