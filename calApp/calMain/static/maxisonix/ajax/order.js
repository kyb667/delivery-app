$(document).ready(function(){
    $('#order_cart_body').empty()
    $('.order_btn_form').empty()
    var order_cart_body = document.querySelector('#order_cart_body')
    if (localStorage.getItem("cart") == null){
        html = "<tr style='background-color: white;'><td colspan='7' style='background-color: white;'>&nbsp</td></tr><tr style='text-align:center background-color: white;'><td colspan='7' style='background-color: white; text-align:center'>카트에 담긴 상품이 없습니다</td></tr><tr style='background-color: white;'><td colspan='7' style='background-color: white;'>&nbsp</td></tr>"
        order_cart_body.innerHTML += html;
    }else if(JSON.parse(localStorage.getItem("cart")).length == 0){
        html = "<tr style='background-color: white; text-align:center'><td colspan='7' style='background-color: white; text-align:center'>&nbsp</td></tr><tr style='text-align:center background-color: white;'><td colspan='7' style='background-color: white; text-align:center'>카트에 담긴 상품이 없습니다</td></tr><tr style='background-color: white;'><td colspan='7' style='background-color: white;'>&nbsp</td></tr>"
        order_cart_body.innerHTML += html;
    } else{
        html = ''
        form_html = "<input type='submit' id='orderbtn' value='주문하기'>"
        var order_cart_body = document.querySelector('#order_cart_body')
        var order_btn_form = document.querySelector('.order_btn_form')
        var cartList = JSON.parse(localStorage.getItem("cart"))
        cntAll = 0
        for (var recipeid in cartList[0]){
            val = cartList[0][recipeid]
            cntAll += val['cnt']
            html += addTable(html, recipeid, val['fooddetail'], val['recipename'], val['price'],val['cnt'])
        }
        order_cart_body.innerHTML += html;
        order_btn_form.innerHTML += form_html;
    }
    
})
$(document).on('click', '#orderbtn', function(){
    show_order_modal()
})
$(document).on('click', '#close_order_modal', function(){
    hide_order_modal()
})
function show_order_modal(){
    $('#order_modal').show()
}
function hide_order_modal(){
    $('#order_modal').hide()
}
function paymentFunc(impCode, cart){
    console.log(impCode, cart)
    var IMP = window.IMP;
    var token = getCookie('csrftoken');
    IMP.init(impCode);
    hide_order_modal()
    IMP.request_pay({
        pg : 'html5_inicis',
        pay_method : 'card',
        merchant_uid : 'merchant_' + new Date().getTime(),
        name : 'testuser1',
        amount : 100,
        buyer_tel : 010-1234-5678,
    }, function(rsp) {
        console.log(rsp)
        if ( rsp.success ) {
            var msg = '결제가 완료되었습니다.';
            msg += '고유ID : ' + rsp.imp_uid;
            msg += '상점 거래ID : ' + rsp.merchant_uid;
            msg += '결제 금액 : ' + rsp.paid_amount;
            msg += '카드 승인번호 : ' + rsp.apply_num;
        } else {
            var msg = '결제에 실패하였습니다.';
            msg += '에러내용 : ' + rsp.error_msg;
            $.ajax({
                headers: { "X-CSRFToken": token },
                type:'POST',
                url : '../order-success',
                credentials: 'include',
                data: {'returnVal' : JSON.stringify(rsp), 'cart':JSON.stringify(cart)},
                dataType : 'json',
                success:function(data){
                    console.log(data)
                    id = data['member_id']
                    location.href = "order_finish.html?id=" + id;
                }
            })
        }    
        alert(msg)
    });
}

$(document).on('click', '#order_product', function(){
    var cart = JSON.parse(localStorage.getItem("cart"))
    console.log(cart)
    $.ajax({
        url:'./requestCode',
        dataType: 'json',
        success:function(data){
            if('code' in data){
                var impCode = data['code']
                if (impCode){
                    paymentFunc(impCode, cart)
                }
            }
        },
        error:function(data){
            alert('order product error')
        }
    })
})

//##################request post set cookie##########################
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