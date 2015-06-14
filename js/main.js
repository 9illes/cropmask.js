editor.init({
    canvas_id: 'c'
});

ui.init({
    dropzone_id: '.dropzone'
});

$('.btn-preview').on('click', function() {
  $('.img-preview').attr('src', ui.preview());
});

$('select[name="device"]').on('change', function() {
    resolution = this.value.split('x');
    ui.change_dimension(resolution[0], resolution[1]);
});

$('.add-dimension').on('click', function() {

    var $select = $('select[name="device"]'),
        width = parseInt($('input[name="width"]').val()),
        height = parseInt($('input[name="height"]').val()),
        dim,
        label;

    if (isNaN(width) || isNaN(height)) {
        return false;
    }

    dim = width + "x" + height;
    label = dim;

    if ($('input[name="label"]').val().length) {
        label = $('input[name="label"]').val();
    }

    // check duplicate entries
    if ($select.find('option[value="' + dim + '"]').length) {
        $select.find('option[value="' + dim + '"]').text(label);
        return false;
    }

    $select
        .append($("<option></option>")
        .attr("value",dim)
        .text(label));

    $('select[name="device"]').val(dim).change();

});
