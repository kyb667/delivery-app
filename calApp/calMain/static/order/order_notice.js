$(document).on('click', '.show_order_detail', function(){
    var id = $(this).text()
    $.ajax({
        url:'../get-order-detail',
        data:{
            'id' : id
        },
        dataType: 'json',
        success: function(data){
            $('#show_orderList').empty()
            var form = document.querySelector('#show_orderList')
            html = ''
            for (var i = 0; i < data['orderDetailList'].length; i++){
                var info = data['orderDetailList'][i]
                html += '<tr>'
                html += '<td>'+ info['id_uid'] +'</td>'
                html += '<td><a href="../showrecipe/'+info['foodname']+'_'+ info['recipe_id'] +'/">'+ info['recipename'] +'</a></td>'
                html += '<td>'+ info['count'] +'</td>'
                html += '<td>'+ info['price'] +'</td>'
                html += '<td>'+ info['ordertime'] +'</td>'
                html += '</tr>'
            }
            form.innerHTML += html
        },
        error:function(data){
            alert('order_notice.js .show_order_detail click error')
        }
    })
    show_order_modal()
})
$(document).on('click', '#close_order_modal', function(){
    hide_order_modal()
})
function show_order_modal(){
    $('#show_order_detail_modal').show()
}
function hide_order_modal(){
    $('#show_order_detail_modal').hide()
}
