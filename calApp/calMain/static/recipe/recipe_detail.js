$('#likeit').on('click',function(){
    var id = $(this).data("id")
    $.ajax({
        url:'../../getlovenum',
        data:{'id':id},
        dataType: 'json',
        success: function(data){
            $('#lovenum').text(data['lovenum'])
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
    insert_cart(recipeid,fooddetail,recipename, price)
    show_modal()
})
// add cart
function insert_cart(recipeid,fooddetail,recipename, price){
    if ($('#cart_body_'+recipeid).length > 0){
        add_product(recipeid,fooddetail,recipename, price)
    }else{
        html = ''
        var cart_body = document.querySelector('#cart_body')
        html = addTable(html,recipeid,fooddetail,recipename, price)
        cart_body.innerHTML += html;
        var cart = JSON.parse(localStorage.getItem("cart"))
        if (cart.length > 0){
            cart[0][recipeid] = {
                "recipename": recipename,
                'fooddetail' : fooddetail,
                "price" : price,
                "cnt": 1,
                "money": price
            }
            localStorage.setItem("cart", JSON.stringify(cart))
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
