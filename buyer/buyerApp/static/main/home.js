$(document).ready(function(){
    hide_modal()
    if (localStorage.getItem("cart") == null){
        existingEntries = []
        localStorage.setItem("cart", JSON.stringify(existingEntries))
        $('#cart_all_cnt').text(0)
    }else{
        var cartList = JSON.parse(localStorage.getItem("cart"))
        var cntAll = 0
        for (var recipeid in cartList[0]){
            val = cartList[0][recipeid]
            cntAll += val['cnt']
        }
        if (cartList.length > 0){
            $('#cart_all_cnt').text(cntAll)
        }else{
            $('#cart_all_cnt').text(0)
        }
    }
})


// #####################cart show or hide################################
// cart modal show
$('#show_cart').click(function(){
    show_modal()
})
function show_modal(){
    console.log('show_modal')
    var cart = localStorage.getItem("cart")
    insert_modal_cart_body_obj(cart)
    $('#myModal').show()
}

// cart modal hide
function hide_modal(){
    $('#myModal').hide()
    $('#find_map_modal').hide()
}
$('.pop_bt').click(function(){
    hide_modal()
})


//##################cart cnt update delete##########################
// cart cnt plus
$(document).on("click", ".fa-cart-plus", function(){
    console.log('cart cnt plus')
    var recipeid = $(this).attr('name');
    var cart = JSON.parse(localStorage.getItem("cart"))[0]
    var val = parseInt(cart[recipeid]['cnt']) + 1
    var price = parseInt(cart[recipeid]['price'].split(' ')[0])
    var money = price * val
    cart[recipeid]['cnt'] = val
    cart[recipeid]['money'] = money +' 원'
    localStorage.setItem("cart", JSON.stringify([cart]))
    $('#cart_all_cnt').text(parseInt($('#cart_all_cnt').text()) + 1 )
    setCart()
});

// add column
function addTable(html,recipeid,fooddetail,recipename, price, cnt=1){
    calcprice = price.split(' ')
    var money = calcprice[0] * cnt
    var won = calcprice[1]
    html += "<tr class='cart_body_"+ recipeid +"'><td>" + recipename + '</td>' +
            "<td>" + fooddetail + "</td>" +
            "<td class='price_"+ recipeid +"'>" + price + "</td>" +
            "<td class='cnt_"+ recipeid +"'>" + cnt + "</td>" +
            "<td class='money_"+ recipeid +"'>" + money +' '+ won + "</td>" +
            "<td><span><i class='fa fa-cart-plus' name='"+ recipeid +"' style='font-size: 13pt;'></i>&nbsp;&nbsp;<i style='font-size: 13pt;' class='fa fa-cart-arrow-down' name='"+ recipeid +"'></i></span></td>"+
            "<td><span style='font-size: 13pt; text-align: center;'><i class='fa fa-trash' name='"+ recipeid +"'></i></span></td></tr>"
    return html
}

// cart cnt minus
$(document).on("click", ".fa-cart-arrow-down", function(){
    var cart = JSON.parse(localStorage.getItem("cart"))
    if (cart.length > 0){
        var recipeid = $(this).attr('name');
        var v = parseInt(cart[0][recipeid]['cnt'])
        if (v == 1){
            alert('상품은 1개부터 주문 가능합니다.')
        }else{
            cart = cart[0]
            val = v - 1
            var price = parseInt(cart[recipeid]['price'].split(' ')[0])
            var money = price[0] * val
            var won = price[1]
            cart[recipeid]['cnt'] = val
            cart[recipeid]['money'] = money +' ' + won
            localStorage.setItem("cart", JSON.stringify([cart]))
            $('#cart_all_cnt').text(parseInt($('#cart_all_cnt').text()) - 1 )
            setCart()
        }
    }
});

//cart product delete
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
    setCart()
});

function setCart(){
    var cart = localStorage.getItem("cart")
    console.log(cart)
    insert_modal_cart_body_obj(cart)
    insert_order_cart_body_obj(cart)
    insert_in_cart_body_obj(cart)
}

function insert_modal_cart_body_obj(cart){
    var modal_cart_body_obj = document.querySelector('.modal_cart_body')
    if (modal_cart_body_obj){
        console.log('modal_cart_body_obj')
        $('.modal_cart_body').empty()
        modal_cart_body_html = ''
        var cartList = JSON.parse(cart)
        if (cartList[0]){
            for (var recipeid in cartList[0]){
                val = cartList[0][recipeid]
                modal_cart_body_html += addTable('', recipeid, val['fooddetail'], val['recipename'], val['price'],val['cnt'])
            }
            if (modal_cart_body_html == ''){
                modal_cart_body_obj.innerHTML += "<tr style='background-color: white; text-align:center'><td colspan='7' style='background-color: white; text-align:center'>&nbsp</td></tr><tr style='text-align:center background-color: white;'><td colspan='7' style='background-color: white; text-align:center'>카트에 담긴 상품이 없습니다</td></tr><tr style='background-color: white;'><td colspan='7' style='background-color: white;'>&nbsp</td></tr>";
            }else{
                modal_cart_body_obj.innerHTML += modal_cart_body_html;
            }
        }else{
            modal_cart_body_obj.innerHTML += "<tr style='background-color: white; text-align:center'><td colspan='7' style='background-color: white; text-align:center'>&nbsp</td></tr><tr style='text-align:center background-color: white;'><td colspan='7' style='background-color: white; text-align:center'>카트에 담긴 상품이 없습니다</td></tr><tr style='background-color: white;'><td colspan='7' style='background-color: white;'>&nbsp</td></tr>";
        }
    }
}

function insert_in_cart_body_obj(cart){
    var in_cart_body_obj = document.querySelector('.in_cart_body')
    if (in_cart_body_obj){
        console.log('in_cart_body_obj')
        $('.in_cart_body').empty()
        in_cart_body_html = ''
        if (cart == null){
            in_cart_body_obj.innerHTML += "<tr style='background-color: white;'><td colspan='7' style='background-color: white;'>&nbsp</td></tr><tr style='text-align:center background-color: white;'><td colspan='7' style='background-color: white; text-align:center'>카트에 담긴 상품이 없습니다</td></tr><tr style='background-color: white;'><td colspan='7' style='background-color: white;'>&nbsp</td></tr>";
        }else if(JSON.parse(cart).length == 0){
            in_cart_body_obj.innerHTML += "<tr style='background-color: white; text-align:center'><td colspan='7' style='background-color: white; text-align:center'>&nbsp</td></tr><tr style='text-align:center background-color: white;'><td colspan='7' style='background-color: white; text-align:center'>카트에 담긴 상품이 없습니다</td></tr><tr style='background-color: white;'><td colspan='7' style='background-color: white;'>&nbsp</td></tr>";
        } else{
            var cartList = JSON.parse(cart)
            cntAll = 0
            for (var recipeid in cartList[0]){
                val = cartList[0][recipeid]
                cntAll += val['cnt']
                in_cart_body_html += addTable('', recipeid, val['fooddetail'], val['recipename'], val['price'],val['cnt'])
            }
            if (in_cart_body_html == ''){
                in_cart_body_obj.innerHTML += "<tr style='background-color: white; text-align:center'><td colspan='7' style='background-color: white; text-align:center'>&nbsp</td></tr><tr style='text-align:center background-color: white;'><td colspan='7' style='background-color: white; text-align:center'>카트에 담긴 상품이 없습니다</td></tr><tr style='background-color: white;'><td colspan='7' style='background-color: white;'>&nbsp</td></tr>"
            }else{
                in_cart_body_obj.innerHTML += in_cart_body_html;
            }
        }
    }
}

function insert_order_cart_body_obj(cart){
    var order_cart_body_obj = document.querySelector('.order_cart_body')
    if (order_cart_body_obj){
        console.log('order_cart_body_obj')
        $('.order_cart_body').empty()
        order_cart_body_html = ''
        if (cart == null){
            order_cart_body_obj.innerHTML += "<tr style='background-color: white;'><td colspan='7' style='background-color: white;'>&nbsp</td></tr><tr style='text-align:center background-color: white;'><td colspan='7' style='background-color: white; text-align:center'>카트에 담긴 상품이 없습니다</td></tr><tr style='background-color: white;'><td colspan='7' style='background-color: white;'>&nbsp</td></tr>";
        }else if(JSON.parse(cart).length == 0){
            order_cart_body_obj.innerHTML += "<tr style='background-color: white; text-align:center'><td colspan='7' style='background-color: white; text-align:center'>&nbsp</td></tr><tr style='text-align:center background-color: white;'><td colspan='7' style='background-color: white; text-align:center'>카트에 담긴 상품이 없습니다</td></tr><tr style='background-color: white;'><td colspan='7' style='background-color: white;'>&nbsp</td></tr>";
        } else{
            var cartList = JSON.parse(cart)
            cntAll = 0
            for (var recipeid in cartList[0]){
                val = cartList[0][recipeid]
                order_cart_body_html += addTable('', recipeid, val['fooddetail'], val['recipename'], val['price'],val['cnt'])
            }
            if (order_cart_body_html == ''){
                order_cart_body_obj.innerHTML += "<tr style='background-color: white; text-align:center'><td colspan='7' style='background-color: white; text-align:center'>&nbsp</td></tr><tr style='text-align:center background-color: white;'><td colspan='7' style='background-color: white; text-align:center'>카트에 담긴 상품이 없습니다</td></tr><tr style='background-color: white;'><td colspan='7' style='background-color: white;'>&nbsp</td></tr>"
            }else{
                order_cart_body_obj.innerHTML += order_cart_body_html;
            }
        }
    }
}