$(document).ready(function(){
    $('#order_cart_body').empty()
    console.log(JSON.parse(localStorage.getItem("cart")))
    var order_cart_body = document.querySelector('#order_cart_body')
    if (localStorage.getItem("cart") == null){
        html = "<tr style='background-color: white;'><td colspan='7' style='background-color: white;'>&nbsp</td></tr><tr style='text-align:center background-color: white;'><td colspan='7' style='background-color: white; text-align:center'>카트에 담긴 상품이 없습니다</td></tr><tr style='background-color: white;'><td colspan='7' style='background-color: white;'>&nbsp</td></tr>"
        order_cart_body.innerHTML += html;
    }else if(JSON.parse(localStorage.getItem("cart")).length == 0){
        html = "<tr style='background-color: white; text-align:center'><td colspan='7' style='background-color: white; text-align:center'>&nbsp</td></tr><tr style='text-align:center background-color: white;'><td colspan='7' style='background-color: white; text-align:center'>카트에 담긴 상품이 없습니다</td></tr><tr style='background-color: white;'><td colspan='7' style='background-color: white;'>&nbsp</td></tr>"
        order_cart_body.innerHTML += html;
    } else{
        html = ''
        var order_cart_body = document.querySelector('#order_cart_body')
        var cartList = JSON.parse(localStorage.getItem("cart"))
        cntAll = 0
        console.log(cartList)
        for (var recipeid in cartList[0]){
            val = cartList[0][recipeid]
            cntAll += val['cnt']
            html += addTable(html, recipeid, val['fooddetail'], val['recipename'], val['price'],val['cnt'])
        }
        order_cart_body.innerHTML += html;
    }
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