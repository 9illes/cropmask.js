var editor = (function (editor, $, fabric) {

    var _canvas,
    _img,
    _img_url,
    _dim,
    _area;

    var init = function(options) {
        _canvas = new fabric.Canvas(options.canvas_id);
        _dim = {width: _canvas.width, height: _canvas.height};
        _area = _calc_snapshot_area(_canvas, _dim);
        _oMask = _draw_mask(_canvas, _area);
    },

    _calc_snapshot_area = function(canvas, dim) {
        return {
            left: (canvas.width - dim.width) / 2,
            top: (canvas.height - dim.height) / 2,
            width: dim.width,
            height: dim.height
        };
    },

    _get_img_fit_scale = function(img, target) {

        var targetRatio = target.width / target.height,
        imgRatio = img.width / img.height;

        var scale = 1;

        if (targetRatio < imgRatio) {
            scale = target.height / img.height;
        } else {
            scale = target.width / img.width;
        }

        return scale;
    },

    _draw_img = function(canvas, img, area) {

        img.scale(_get_img_fit_scale(img, {width: area.width, height: area.height}));
        img.left = area.left;
        img.top = area.top;
        img.hasRotatingPoint = false;

        canvas.add(img);
        canvas.moveTo(img, 0);

    },

    _draw_mask = function(canvas, area) {

        console.log('draw_mask');
        console.log(area);

        var points = [
            {x: 0, y: 0},
            {x: canvas.width, y: 0},
            {x: canvas.width, y: canvas.height},
            {x: 0, y: canvas.height},
            {x: 0, y: area.top},
            {x: area.left, y: area.top},
            {x: area.left, y: area.top + area.height + 1}, // G
            {x: area.left + area.width + 1, y: area.top + area.height + 1},
            {x: area.left + area.width + 1, y: area.top},
            {x: 0, y: area.top}
            ];

        var path = 'M 0 0' + points.map(function(p) {
                return ' L ' + p.x + ' ' + p.y;
            }).join('');

        var mask = new fabric.Path(path);

        mask.set({
            opacity: 0.8,

            evented: false,
            selectable: false,
            hasControls: false
        });

        canvas.add(mask);
        canvas.moveTo(mask, 1);

        return mask;
    },

    _draw_border = function(canvas, area) {

        var border = new fabric.Rect({
            left: area.left - 1,
            top: area.top - 1,
            width: area.width + 2,
            height: area.height + 2,
            strokeWidth: 1,
            fill: null,
            stroke: '#FF0000',

            evented: false,
            selectable: false,
            hasControls: false
        });

        canvas.add(border);
        canvas.moveTo(border, 2);
    },

    toggle_controls = function(obj) {

        if (typeof(obj) === 'undefined' ) { return false; }

        obj.set({
            hasControls: !obj.hasControls,
            hasBorders: !obj.hasBorders
        });

    },

    set_dimension = function(width, height) {

        _dim = {width: parseInt(width), height: parseInt(height)};
        _area = _calc_snapshot_area(_canvas, _dim);

        if (_img_url) {
            editor.load_img(_img_url);
        } else {
            _canvas.clear();
            _draw_mask(_canvas, _area);
            _draw_border(_canvas, _area);
        }

    },

    _draw = function(img) {
        _img = img;
        var area = _calc_snapshot_area(_canvas, _area);
        _canvas.clear();
        _draw_img(_canvas, img, area);
        _draw_mask(_canvas, area);
        _draw_border(_canvas, area);
    };


    editor.load_img = function(url) {
        _img_url = url;
        fabric.Image.fromURL(_img_url, _draw);
    };

    editor.snapshot = function() {

        var params = _area;
        params.format = 'jpg';

        // hide controls ui
        toggle_controls(_img);
        data_src = _canvas.toDataURL(params);
        toggle_controls(_img);

        return data_src;
    };

    editor.init = init;
    editor.set_dimension = set_dimension;

    return editor;

}(editor || {}, jQuery, fabric));
