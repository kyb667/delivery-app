// check order
$(document).on("click", "#check_order_by_id", function(){
    $('#check_order_form').empty()
    var form = document.querySelector('#check_order_form')
    html = '<div class="one_half first"> <label for="id">id (비회원인경우 일회용 아이디) <span>*</span></label><input type="text" name="member_id" id="member_id" value="" size="22" required></div><div class="one_half"><label for="pw">password <span>*</span></label><input type="password" name="pw" id="pw" value="" size="22" required></div><div class="block clear"></div><div><input type="submit" name="submit" value="주문 확인"></div>'
    form.innerHTML += html
});
$(document).on("click", "#check_order_by_num", function(){
    $('#check_order_form').empty()
    var form = document.querySelector('#check_order_form')
    html = '<div class="one_half first"> <label for="num">주문번호 <span>*</span></label><input type="text" name="num" id="num" value="" size="22" required></div><div class="block clear"></div><div><input type="submit" name="submit" value="주문 확인"></div>'
    form.innerHTML += html
})