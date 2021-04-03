$(document).ready(function(){
    hide_modal()
    if (localStorage.getItem("cart") == null){
        existingEntries = []
        localStorage.setItem("cart", JSON.stringify(existingEntries))
        $('#cart_all_cnt').text(0)
    }else{
        $('#cart_body').empty()
        html = ''
        var cart_body = document.querySelector('#cart_body')
        var cartList = JSON.parse(localStorage.getItem("cart"))
        cntAll = 0
        for (var recipeid in cartList[0]){
            val = cartList[0][recipeid]
            cntAll += val['cnt']
            html = addTable(html, recipeid, val['fooddetail'], val['recipename'], val['price'],val['cnt'])
        }
        cart_body.innerHTML += html;
        if (cartList.length > 0){
            $('#cart_all_cnt').text(cntAll)
        }else{
            $('#cart_all_cnt').text(0)
        }
    }
})


// #####################cart show or hide################################
// show cart
$('#show_cart').click(function(){
    show_modal()
})
function show_modal(){
    $('#cart_body').empty()
    html = ''
    var cart_body = document.querySelector('#cart_body')
    var cartList = JSON.parse(localStorage.getItem("cart"))
    if (cartList){
        for (var recipeid in cartList[0]){
            val = cartList[0][recipeid]
            html = addTable(html, recipeid, val['fooddetail'], val['recipename'], val['price'],val['cnt'])
        }
    }
    cart_body.innerHTML += html;
    $('#myModal').show()
}

// hide cart
function hide_modal(){
    $('#myModal').hide()
}
$('.pop_bt').click(function(){
    hide_modal()
})


//##################cart add update delete##########################
// add
$(document).on("click", ".fa-cart-plus", function(){
    var recipeid = $(this).attr('name');
    add_product(recipeid)
});

// add column
function addTable(html,recipeid,fooddetail,recipename, price, cnt=1){
    calcprice = price.split(' ')
    var money = calcprice[0] * cnt
    var won = calcprice[1]
    html += "<tr id='cart_body_"+ recipeid +"'><td>" + recipename + '</td>' +
            "<td>" + fooddetail + "</td>" +
            "<td class='price_"+ recipeid +"'>" + price + "</td>" +
            "<td class='cnt_"+ recipeid +"'>" + cnt + "</td>" +
            "<td class='money_"+ recipeid +"'>" + money +' '+ won + "</td>" +
            "<td><span><i class='fa fa-cart-plus' name='"+ recipeid +"' style='font-size: 13pt;'></i>&nbsp;&nbsp;<i style='font-size: 13pt;' class='fa fa-cart-arrow-down' name='"+ recipeid +"'></i></span></td>"+
            "<td><span style='font-size: 13pt; text-align: center;'><i class='fa fa-trash' name='"+ recipeid +"'></i></span></td></tr>"
    return html
}

//update
// ctn plus
function add_product(recipeid,fooddetail,recipename, price){
    var cart = JSON.parse(localStorage.getItem("cart"))
    if (cart.length > 0){
        cart = cart[0]
        val = parseInt($('.cnt_'+recipeid).text()) + 1
        $('.money_' + recipeid).empty()
        var price = $('.price_' + recipeid).text()
        price = price.split(' ')
        var money = price[0] * val
        var won = price[1]
        $('.cnt_'+recipeid).text(val)
        $('.money_' + recipeid).text(money +' ' + won)
        cart[recipeid]['cnt'] = val
        cart[recipeid]['money'] = money +' ' + won
        localStorage.setItem("cart", JSON.stringify([cart]))
        $('#cart_all_cnt').text(parseInt($('#cart_all_cnt').text()) + 1 )
    }else{
        var cart_body = document.querySelector('#cart_body')
        html = addTable('',recipeid,fooddetail,recipename, price)
        $('#cart_all_cnt').text(1)
        cart_body.innerHTML += html;
    }
    
}
// ctn minus
$(document).on("click", ".fa-cart-arrow-down", function(){
    var cart = JSON.parse(localStorage.getItem("cart"))
    if (cart.length > 0){
        var recipeid = $(this).attr('name');
        var v = parseInt($('.cnt_'+recipeid).text())
        if (v == 1){
            alert('상품은 1개부터 주문 가능합니다.')
        }else{
            cart = cart[0]
            val = v - 1
            $('.money_' + recipeid).empty()
            var price = $('.price_' + recipeid).text()
            price = price.split(' ')
            var money = price[0] * val
            var won = price[1]
            cart[recipeid]['cnt'] = val
            cart[recipeid]['money'] = money +' ' + won
            $('.cnt_'+recipeid).text(val)
            $('.money_' + recipeid).text(money +' ' + won)
            localStorage.setItem("cart", JSON.stringify([cart]))
            $('#cart_all_cnt').text(parseInt($('#cart_all_cnt').text()) - 1 )
        }
    }
});

//delete
$(document).on("click", ".fa-trash", function(){
    var cart = JSON.parse(localStorage.getItem("cart"))
    var recipeid = $(this).attr('name');
    if (cart.length > 0){
        if (cart[0][recipeid]){
            cart = {}
            var cartList = JSON.parse(localStorage.getItem("cart"))[0]
            for (var id in cartList){
                if (id != recipeid){
                    val = cartList[id]
                    cart[id] = {
                        "recipename": val['recipename'],
                        'fooddetail' : val['fooddetail'],
                        "price" : val['price'],
                        "cnt": val['cnt'],
                        "money": val['price']
                    }
                }else{
                    val = cartList[id]
                    $('#cart_all_cnt').text(parseInt($('#cart_all_cnt').text()) - val['cnt'] )
                }
            }
            localStorage.setItem("cart", JSON.stringify([cart]))
        }
    }
    var $this = $(this)
    $this.parents('tr').remove()
});
