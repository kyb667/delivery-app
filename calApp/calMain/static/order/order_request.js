$(document).on('click', '#order_by_user', function(){
    $('#order_form').empty()
    $('.order_version_btn').empty()
    var form = document.querySelector('#order_form')
    html = '<br/><h1>주문서 작성</h1>'
    html += '<div class="three_quarter first"><label for="id">주문하는 사람 <span>*</span></label><input type="text" name="order_name" id="order_name" value="" size="22" required></div>'
    html += '<div class="one_half first"><label for="password">주문조회 비밀번호 <span>*</span></label><input type="password" name="order_password" id="order_password" value="" size="22" required></div>'
    html += '<div class="one_half first"><label for="email">email <span>*</span></label><input type="email" name="order_email" id="order_email" value="" size="22" required></div>'
    html += '<div class="one_half first"><label for="password">전화번호 <span>*</span></label><input type="text" name="order_phone" id="order_phone" value="" size="22" required></div>'
    html += '<div class="one_half first"><label>address<span>*</span></label><input type="text" id="order_postcode" name="order_postcode" placeholder="우편번호" required></div>'
    html += '<div class="one_quarter"><label>&nbsp</label><input type="button" style="width: 50%;" onclick="execDaumPostcode()" value="우편번호검색" required></div>'
    html += '<div class="one_half first"><input type="text" id="order_roadAddress" name="order_roadAddress" placeholder="도로명주소" required></div>'
    html += '<div class="one_half"><input type="text" id="order_jibunAddress" name="order_jibunAddress" placeholder="지번주소" required></div>'
    html += '<div class="one_half first"><input type="text" id="order_detailAddress" name="order_detailAddress" placeholder="상세주소" required></div>' 
    html += '<div class="block clear"></div>'
    html += '<div><input type="submit" id="orderbtn" value="주문하기"></div>'
    form.innerHTML += html
})
$(document).on('click', '#order_by_unknown', function(){
    $('#order_form').empty()
    $('.order_version_btn').empty()
    var form = document.querySelector('#order_form')
    html = '<br/><h1>주문서 작성</h1>'
    html += '<div class="three_quarter first"><label for="id">주문하는 사람 <span>*</span></label><input type="text" name="order_name" id="order_name" value="" size="22" required></div>'
    html += '<div class="one_half first"><label for="password">주문조회 비밀번호 <span>*</span></label><input type="password" name="order_password" id="order_password" value="" size="22" required></div>'
    html += '<div class="one_half first"><label for="email">email <span>*</span></label><input type="email" name="order_email" id="order_email" value="" size="22" required></div>'
    html += '<div class="one_half first"><label for="password">전화번호 <span>*</span></label><input type="text" name="order_phone" id="order_phone" value="" size="22" required></div>'
    html += '<div class="one_half first"><label>address<span>*</span></label><input type="text" id="order_postcode" name="order_postcode" placeholder="우편번호" required></div>'
    html += '<div class="one_quarter"><label>&nbsp</label><input type="button" style="width: 50%;" onclick="execDaumPostcode()" value="우편번호검색" required></div>'
    html += '<div class="one_half first"><input type="text" id="order_roadAddress" name="order_roadAddress" placeholder="도로명주소" required></div>'
    html += '<div class="one_half"><input type="text" id="order_jibunAddress" name="order_jibunAddress" placeholder="지번주소" required></div>'
    html += '<div class="one_half first"><input type="text" id="order_detailAddress" name="order_detailAddress" placeholder="상세주소" required></div>' 
    html += '<div class="block clear"></div>'
    html += '<div><input type="submit" id="orderbtn" value="주문하기"></div>'
    form.innerHTML += html
    
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
$(document).on('click', '#order_product', function(){
    var order_dict = {'order_name':$('#order_name').val(),
                      'order_email':$('#order_email').val(),
                      'order_password':$('#order_password').val(),
                      'order_phone':$('#order_phone').val(),
                      'order_postcode':$('#order_postcode').val(),
                      'order_roadAddress':$('#order_roadAddress').val(),
                      'order_detailAddress': $('#order_detailAddress').val()}
    var cart = JSON.parse(localStorage.getItem("cart"))
    $.ajax({
        url:'./requestCode',
        dataType: 'json',
        success:function(data){
            if('code' in data){
                var impCode = data['code']
                if (impCode){
                    $.ajax({
                        url:'../order-login-check',
                        dataType:'json',
                        success:function(data){
                            paymentFunc(impCode, cart, data['name'], order_dict)
                        }
                    })
                    
                }
            }
        },
        error:function(data){
            alert('order product error')
        }
    })
})
function paymentFunc(impCode, cart, member_id, order_dict){
    cart_len =　$('#cart_all_cnt').text()
    recipename = ''
    for (var recipeid in cart[0]){
        if (recipename == ''){
            recipename = cart[0][recipeid]['recipename']
            cart_len = cart_len - cart[0][recipeid]['cnt']
        }
        break;
    }
    recipename = recipename + ' 외 '+ cart_len +' 건'
    var IMP = window.IMP;
    var token = getCookie('csrftoken');
    IMP.init(impCode);
    hide_order_modal()
    IMP.request_pay({
        pg : 'html5_inicis',
        pay_method : 'card',
        merchant_uid : 'merchant_' + new Date().getTime(),
        name : recipename,
        amount : 100,
        buyer_email : order_dict['order_email'],
        buyer_name : order_dict['order_name'],
        buyer_tel :  order_dict['order_phone'],
        buyer_addr :  order_dict['order_roadAddress'] + ' ' + order_dict['order_detailAddress'],
        buyer_postcode :  order_dict['order_postcode']
    }, function(rsp) {
        if ( rsp.success ) {
            var msg = '결제가 완료되었습니다.';
            msg += '고유ID : ' + rsp.imp_uid;
            msg += '상점 거래ID : ' + rsp.merchant_uid;
            msg += '결제 금액 : ' + rsp.paid_amount;
            msg += '카드 승인번호 : ' + rsp.apply_num;
            // $.ajax({
            //     headers: { "X-CSRFToken": token },
            //     type:'POST',
            //     url : '../order-success',
            //     credentials: 'include',
            //     data: {'returnVal' : JSON.stringify(rsp), 'cart':JSON.stringify(cart)},
            //     dataType : 'json',
            //     success:function(data){
            //         console.log(data)
            //         id = data['member_id']
            //         location.href = "order_finish.html?id=" + id;
            //     }
            // })
        } else {
            var msg = '결제에 실패하였습니다.';
            msg += '에러내용 : ' + rsp.error_msg;
            $.ajax({
                headers: { "X-CSRFToken": token },
                type:'POST',
                url : '../order-success',
                credentials: 'include',
                data: {'returnVal' : JSON.stringify(rsp), 'cart':JSON.stringify(cart), 
                       'id':JSON.stringify({'member_id':member_id}), 'order_dict':JSON.stringify(order_dict)},
                dataType : 'json',
                success:function(data){
                    id = data['member_id']
                    location.href = "../order-finish";
                    $('#order_follow').show()
                }
            })
        }    
        alert(msg)
    });
}
