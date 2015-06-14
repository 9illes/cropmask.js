var ui = (function (ui, $, editor) {

    var _options,
    _dropzone;

    var init = function(options) {
        _options = options;
        _dropzone = $(options.dropzone_id);
        init_dropzone(_dropzone);

    },

    init_dropzone = function(dropzone) {

        dropzone.on('dragover', function() {
            //add hover class when drag over
            dropzone.addClass('dropzone--hover');
            return false;
        });

        dropzone.on('dragleave', function() {
            //remove hover class when drag out
            dropzone.removeClass('dropzone--hover');
            return false;
        });

        dropzone.on('drop', function(e) {
            //prevent browser from open the file when drop off
            e.stopPropagation();
            e.preventDefault();

            dropzone.removeClass('dropzone--hover');

            //retrieve uploaded files data
            process_drop(e.originalEvent.dataTransfer.files);

            return false;
        });

    },

    process_drop = function(files) {
        //check for browser support
        if(files && typeof FileReader !== "undefined") {
            //extract FileList as File object
            for(var i = 0; i < files.length; i++) {
                load_img(files[i]);
            }
        }
        else {
            console.log("wrong file format");
        }
    },

    load_img = function(file) {

        if( (/image/i).test(file.type) ) {

            //define FileReader object
            var reader = new FileReader();

            //init reader onload event handlers
            reader.onload = function(e) {
                editor.load_img(e.target.result);
            };

            //begin reader read operation
            reader.readAsDataURL(file);

        } else {
            //some message for wrong file format
            console.log("error");
        }
    };

    ui.change_dimension = function(width, height) {
        return editor.set_dimension(width, height);
    };

    ui.preview = function() {
        return editor.snapshot();
    };

    ui.init = init;

    return ui;

}(ui || {}, jQuery, editor));
