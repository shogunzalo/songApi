//Call once should be enough
var baseUrl = 'http://localhost:3000/';
var songLookupUrl = baseUrl + 'songName/';
var artistLookupUrl = baseUrl + 'artistName/';
var genresLookupUrl = baseUrl + 'genreByName/'
var tracklistLookupUrl = baseUrl + 'tracklistByName/'
var lastNumberTrack = 0;


function readTracklist(){
	lastNumberTrack = 0;
    $.getJSON("/js/test.json", function(json) {
        console.log(json);
        saveTracklist(json);
        //saveSongs(json)
    });
}

//---------------------

function saveTracklist(json){

    var artistIds = [];

    json[0].tracklistArtist.forEach(function(element, index, array){
        var artistExists;
        checkIfArtistExists(element, function(result){artistExists = result});
        if(!artistExists){
            var linksId;
            postLinks(element, function(result){linksId = result})
            postArtist(element, linksId, function(result){artistIds.push(result._id);});
        }else{
            artistIds.push(artistExists);
        }

    });

    var tracklistId;
    createTracklist(json, artistIds, function(result){tracklistId = result;});
    //saveTracklistSongs(json, tracklistId);
    //Include tracklist
    //If mix exists check if tracklist is already associated to it
    //postMix();

}

function saveTracklistSongs(tracklist){

    // TODO: Consider same song name for different artist,
    // for example if I have song1 and artist1 and artist2 share this song name

    tracklist.forEach(function(element, index, array){
        checkIfArtistExists(element.songArtist[0]);
        saveSongIfDoesntExists(element);
        saveSongToTracklist(element);
        if(index >= 1){ //Don't mix the first song
            saveMix(array, index, lastNumberTrack);
        }
    });

}

function createTracklist(json, artistIds, cb){

    var linksId;
    var genresIds = [];
    var tracklistExists;
    var tracklistId;

    //Save Genres
    json[0].tracklistGenres.forEach(function(element, index, array){
        //If doesn't exist false, if exist id
        var genreExists;
        checkIfGenreExists(element, function(result){genreExists = result});
        if(!genreExists){
            var genreId;
            postGenre(element, function(result){genreId = result;});
            genresIds.push(genreId);
        }else{
            genresIds.push(genreExists);
        }
    });

    if(json[0].tracklistLinks.length > 0 || json[0].tracklistLinks.length != undefined){
        postLinks(json[0].tracklistLinks, function(result){linksId = result;});
    }

    //Artist needs to be Id(s)
    var tracklist = {tracklistArtist: JSON.stringify(artistIds), tracklistName: json[0].tracklistName[0], date: json[0].tracklistDate[0], tracklistGenres: JSON.stringify(genresIds), tracklistLinks: linksId};

    checkIfTracklistExists(tracklist, function(result){tracklistExists = result});
    if(!tracklistExists){
        postTracklist(tracklist, function(result){tracklistId = result});
    }else{
        tracklistId = tracklistExists;
    }

    return cb(tracklistId);

}

function checkIfTracklistExists(tracklist, cb){
    //Ajax call
    //If null/empty or doesnt exists return false
    return $.ajax({
        url: tracklistLookupUrl + tracklist.tracklistName,
        async: false
    }).then(function(data){
        if(data == undefined || data.length == 0){
            cb(false);
        }else{
            cb(data._id);
        }
    });
}

function postTracklist(tracklist, cb){

    $.ajax({
        url: baseUrl + 'tracklist/',
        type: 'post',
        dataType: 'json',
        data: tracklist,
        async: false,
        success: function(data) {
            cb(data._id);
        }
    });
    return false;
}

function checkIfGenreExists(params, cb){
    //Ajax call
    //If null/empty or doesnt exists return false
    return $.ajax({
        url: genresLookupUrl + params,
        async: false
    }).then(function(data){
        if(data == undefined || data.length == 0){
            cb(false);
        }else{
            cb(data[0]._id);
        }
    });
}

function postGenre(genreName, cb){

    var genre = {genreName: genreName};

    $.ajax({
        url: baseUrl + 'genre/',
        type: 'post',
        dataType: 'json',
        data: genre,
        async: false,
        success: function(data) {
            cb(data._id);
        }
    });
    return false;
}

function saveSongToTracklist(song){

}

//function saveSongs(tracklist){
//    // TODO: Consider same song name for different artist,
//    // for example if I have song1 and artist1 and artist2 share this song name
//
//    tracklist.forEach(function(element, index, array){
//        saveArtistIfDoesntExists(element.songArtist[0]);
//        saveSongIfDoesntExists(element);
//        if(index >= 1){ //Don't mix the first song
//            saveMix(array, index, lastNumberTrack);
//        }
//    });
//}

//------

function checkIfArtistExists(artist, cb){
    //Ajax call
    //If null/empty or doesnt exists return false
    return $.ajax({
        url: artistLookupUrl + artist.artistName,
        async: false
    }).then(function(data){
        if(data == undefined || data.length == 0){
            cb(false);
        }else{
            cb(data[0]._id);
        }
    });
}

function postLinks(params, cb){

    var links = {};

    if (params.length > 0){
        params.forEach(function (element, index, array){
            if(element.indexOf("soundcloud") > 0){
                links.soundCloudLink = element;
            }else if(element.indexOf("beatport") > 0){
                links.beatPortLink = element;
            }else if(element.indexOf("facebook") > 0){
                links.facebookLink = element;
            }else if(element.indexOf("twitter") > 0){
                links.twitterLink = element;
            }else if(element.indexOf("youtube") > 0){
                links.youtubeLink = element;
            }else if(element.indexOf("mixcloud") > 0){
            links.mixcloudLink = element;
            }else if(element.indexOf("index.html") > 0){
                //nothing
            }else{
                links.websiteLink = element;
            }
        });
    }else{
        return cb("");
    }

    return $.ajax({
        url: 'http://localhost:3000/links/',
        type: 'post',
        dataType: 'json',
        data: links,
        async: false,
        success: function(data) {
            cb(data._id);
        }
    });
}

function postArtist(artist, linksId, cb) {

    var songArtist;

    if(linksId.length > 0){
        songArtist = {artistName: artist.artistName, artistLinks: linksId};
    }else {
        songArtist = {artistName: artist.artistName};
    }


    $.ajax({
        url: 'http://localhost:3000/artist/',
        type: 'post',
        dataType: 'json',
        data: songArtist,
        async: false,
        success: function(data) {
            cb(data);
        }
    });
    return false;
}

//-------------------

function mixExists(tracklist, index, cb){
	//Check for tracklist[index - 1] and next Song as tracklist[index]
	//return true if exist or false if doesn't
    var count = 0;

	return $.when(searchSong(tracklist[index - 1]), searchSong(tracklist[index])).done(function(song1, song2){
    	if(song1.length > 0 && song1[2].responseJSON[0] != undefined && song1[2].responseJSON[0].songMixs != undefined){
            song1[2].responseJSON[0].songMixs.forEach(function(element, index, array){
                if(element.nextSong._id == song2[2].responseJSON[0]._id){
                    count++;
                }
            });
            if(count>0){
                cb(true);
            }else{
                cb(false);
            }
        }

	});
}

function saveSongIfDoesntExists(song){
	//Ajax call
	//If null/empty or doesnt exists return false
	$.ajax({
	  url: songLookupUrl + song.songName,
      async: false
	}).then(function(data){
        if(data == undefined || data.length == 0){
            //console.log("Posting song: " + song.songName);
            postSong(song);
        }else{
            return;
        }
    });
}

function searchSong(song){
    //Ajax call
    //If null/empty or doesnt exists return false
    return $.ajax({
        url: songLookupUrl + song.songName,
        async: false
    });
}

function saveMix(tracklist, index){
    var boolResult;
    mixExists(tracklist, index, function(result){boolResult = result});
	if(tracklist[index].songNumber != 'w/' && !boolResult){
		//If the current track is a number
		//Mix with the previous one
		//Save as the latest track number
		postMix(tracklist, index, lastNumberTrack);
		lastNumberTrack = index;
	}else if(tracklist[index].songNumber == 'w/' && !boolResult){
		//If the current track is a with
		//Mix with the latest number track
		postMix(tracklist, index, lastNumberTrack);
	}else if(boolResult){
        console.log("Mix already exists");
    }
}

//Insert mix

function postMix(tracklist, index, lastNumberTrack) {
    var mixData = {songName: tracklist[lastNumberTrack], nextSong: tracklist[index].songName[0]};

    $.ajax({
        url : "http://localhost:3000/songName/" + mixData.nextSong,
        async: false
    }).then(function(data) {
        mixData.nextSong = data[0]._id;
        insertMix(mixData);
    });
}

function insertMix(mixData){

    var parsedMixData = {nextSong: mixData.nextSong,
        comments: "Test data.",
        rating: 4
    }

    $.ajax({
        url: 'http://localhost:3000/mix/',
        type: 'post',
        dataType: 'json',
        data: parsedMixData,
        async: false,
        success: function(data) {
            searchSongId(mixData.songName, data._id);
        }
    });
    return false;
}

function searchSongId(songName, mixId){
    $.ajax({
        url : "http://localhost:3000/songName/" + songName.songName[0],
        async: false
    }).then(function(data) {
        insertMixIntoSong(data[0]._id, mixId);
    });
}

function insertMixIntoSong(songId, mixId){

    var data = {songMixs: mixId}
    $.ajax({
        url: 'http://localhost:3000/addMix/' + songId,
        type: 'put',
        dataType: 'json',
        data: data,
        async: false,
        success: function(data) {
            //alert("Success");
            console.log("Mix posted.");
        }
    });
    return false;
}

//Submiting new song

function postSong(songData){

    var songJson = {"songName": songData.songName[0],"bpm":"","key":"","recordLabel":"","genre":"","summary":"","songArtist":""};

    $.ajax({
        url : "http://localhost:3000/artistName/" + songData.songArtist[0],
        async: false
    }).then(function(data) {
        songJson.songArtist = data[0]._id;
        insertSong(songJson);
    });
}

function insertSong(songData){
    $.ajax({
        url: 'http://localhost:3000/song/',
        type: 'post',
        dataType: 'json',
        data: songData,
        async: false,
        success: function(data) {
            console.log("Song posted: " + songData.songName);
        }
    });
    return false;
}
