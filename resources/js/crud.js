$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$(function() {
    $('#addSongForm').submit(function() {
        $.ajax({
            url: 'http://localhost:3000/song/',
            type: 'post',
            dataType: 'json',
            data: $('#addSongForm').serializeObject(),
            success: function(data) {
                       alert("Success");
                     }
        });
        return false;
    });
    
    $('#addArtistForm').submit(function() {
        $.ajax({
            url: 'http://localhost:3000/artist/',
            type: 'post',
            dataType: 'json',
            data: $('#addArtistForm').serializeObject(),
            success: function(data) {
                       alert("Success");
                     }
        });
        return false;
    });
    
    $('#addMixForm').submit(function() {
        //$.ajax({
        //    url: 'http://localhost:3000/addMix/'+ $("#songId").val(),
        //    type: 'put',
        //    dataType: 'json',
        //    data: $('#addMixForm').serializeObject(),
        //    success: function(data) {
        //               alert("Success");
        //             }
        //});
        //return false;
        alert("Mix submit");
    });

    $('#addNewSongForm').submit(function() {
        $.ajax({
            url: 'http://localhost:3000/addMix/'+ $("#songId").val(),
            type: 'put',
            dataType: 'json',
            data: $('#addMixForm').serializeObject(),
            success: function(data) {
                alert("Success");
            }
        });
        return false;
    });
});