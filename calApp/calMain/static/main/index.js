$(document).ready(function(){
    $('#find_map_modal').hide()
})
$(document).on('click','#find_map',function(){
    $('#find_map_modal').show()
    // execDaumPostcode()
})

function execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            console.log(data)
        }
    }).open();
}