function increaseQuantity(button) {
    var input = button.parentNode.querySelector('input[type="number"]');
    input.value = parseInt(input.value) + 1;
}

function decreaseQuantity(button) {
    var input = button.parentNode.querySelector('input[type="number"]');
    var currentValue = parseInt(input.value);
    if (currentValue > 1) {
        input.value = currentValue - 1;
    }
}

function deleteRow(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}
