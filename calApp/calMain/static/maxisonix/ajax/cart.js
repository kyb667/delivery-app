function show_modal(){
    $('#myModal').show()
}
function hide_modal(){
    $('#myModal').hide()
}
$(document).ready(function(){
    hide_modal()
})
$('.pop_bt').click(function(){
    hide_modal()
})
$('.addcart').click(function(){
    var recipeid = $(this).attr('name')
    var recipename = $('#recipename').text()
    var fooddetail = $('#fooddetail').text()
    var price = $('#price').text()
    insert_cart(recipeid,fooddetail,recipename, price)
    show_modal()
    
})
function insert_cart(recipeid,fooddetail,recipename, price){
    console.log(recipeid,fooddetail,recipename, price)
    html = ''
    var cart_body = document.querySelector('#cart_body')
    html += "<tr><td>" + recipename + '</td>' +
            "<td>" + fooddetail + "</td>" +
            "<td class='price_"+ recipeid +"'>" + price + "</td>" +
            "<td><input type=number style='width:50%' class='cartrecipecnt' oninput='this.value = Math.round(this.value);' name='"+recipeid+"'/></td>" +
            "<td class='money_"+ recipeid +"'>0 원</td>" +
            "<td><span style='font-size: 15pt; text-align: center;'><i class='fa fa-trash'></i></span></td></tr>"
    cart_body.innerHTML += html;
}
$(document).on("change", ".cartrecipecnt", function(){
    var v = $(this).val();
    var recipeid = $(this).attr('name');
    var vRegExp = /^[0-9]/;
    if (!vRegExp.test(v)){
        $(this).val(0);
        $('.money_' + recipeid).text('0 원')
        $('#cart_all_money').text(sumMoney+' ' + won)
        alert("개수는 정수로 입력해주세요")
    }else{
        $('#cart_all_money').empty()
        $('.money_' + recipeid).empty()
        var price = $('.price_' + recipeid).text()
        var sumMoney = $('#cart_all_money').text()
        price = price.split(' ')
        sumMoney = sumMoney.split(' ')
        var money = price[0] * v
        var won = price[1]
        var sumMoney = sumMoney[0] + money
        $('.money_' + recipeid).text(money +' ' + won)
        $('#cart_all_money').text( sumMoney+' ' + won)
    }
});
