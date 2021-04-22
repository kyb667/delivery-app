$('#likeit').on('click',function(){
    var id = $(this).data("id")
    $.ajax({
        url:'../../addlovenum',
        data:{'id':id},
        dataType: 'json',
        success: function(data){
            $('#lovenum').text(data['lovenum'])
        }
    })
});

$('#hateit').on('click',function(){
    var id = $(this).data("id")
    $.ajax({
        url:'../../addhatenum',
        data:{'id':id},
        dataType: 'json',
        success: function(data){
            $('#hatenum').text(data['hatenum'])
        }
    })
});

//##################cart add update delete##########################
// addbtn
$('.addcart').click(function(){
    var recipeid = $(this).attr('name')
    var recipename = $('#recipename').text()
    var fooddetail = $('#fooddetail').text()
    var price = $('#price').text()
    // add modal_cart_body
    insert_cart(recipeid,fooddetail,recipename, price)
    show_modal()
})
function show_modal(){
    console.log('show_modal')
    var cart = localStorage.getItem("cart")
    console.log(cart)
    insert_modal_cart_body_obj(cart)
    $('#myModal').show()
}
// add cart
function insert_cart(recipeid,fooddetail,recipename, price){
    console.log('insert_cart')
    //이미 상품이 담겨있을경우 개수 증가
    if ($('.cart_body_'+recipeid).length > 0){
        add_product(recipeid,fooddetail,recipename, price)
    }else{
        // 새로운 상품을 담을 경우 상품 담기
        var cart = JSON.parse(localStorage.getItem("cart"))
        // 로컬스토리지가 있을 경우
        if (cart.length > 0){
            cart[0][recipeid] = {
                "recipename": recipename,
                'fooddetail' : fooddetail,
                "price" : price,
                "cnt": 1,
                "money": price
            }
            localStorage.setItem("cart", JSON.stringify(cart))
        // 로컬스토리지가 없을 경우
        }else{
            var obj = {}
            obj[recipeid] = {
                "recipename": recipename,
                'fooddetail' : fooddetail,
                "price" : price,
                "cnt": 1,
                "money": price
            }
            cart.push(obj)
            localStorage.setItem("cart", JSON.stringify(cart))
        }
        $('#cart_all_cnt').text(parseInt($('#cart_all_cnt').text()) + 1 )
        alert('장바구니에 상품을 담았습니다')
    }
    
}
// 장바구니에 상품 담기
function add_product(recipeid,fooddetail,recipename, price){
    console.log('add_product')
    var cart = JSON.parse(localStorage.getItem("cart"))
    console.log(cart)
    //로컬스토리지가 있을 경우
    if (cart.length > 0){
        cart = cart[0]
        val = parseInt($('.cnt_'+recipeid).text()) + 1
        var price = $('.price_' + recipeid).text()
        price = price.split(' ')
        var money = price[0] * val
        var won = price[1]
        cart[recipeid]['cnt'] = val
        cart[recipeid]['money'] = money +' ' + won
        localStorage.setItem("cart", JSON.stringify([cart]))
        $('#cart_all_cnt').text(parseInt($('#cart_all_cnt').text()) + 1 )
    }else{
        //로컬스토리지가 없을 경우
        $('#cart_all_cnt').text(1)
    }
    
}
