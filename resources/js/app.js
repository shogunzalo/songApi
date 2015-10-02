var isEncoded = function(str){
    return decodeURIComponent(str) !== str;
}

Handlebars.registerHelper('autoPlayFalse', function(params) {
    return params.replace("&auto_play=true", "&auto_play=false");;
});

Handlebars.registerHelper('ifCond', function(v1, options) {
    if(v1) {
        return options.fn(this);
    }
    return options.inverse(this);
});

function searchSong(inputText) {

    if(!isEncoded(inputText)){
        inputText = encodeURIComponent(inputText);
    }
    if(inputText.length == 0){
        return;
    }

	$.ajax({
		url : "http://localhost:3000/songName/" + inputText
	}).then(
			function(data) {
				emptyFields();
                fillTemplate(data);
				// TODO: Link to the searched song
				try {
                 //   if(data[0] != undefined){
				//	createSongSearched(data[0]);
				//	if (data[0].songMixs.length > 0) {
				//		createMatchesTextDiv("Next Song: ");
				//		for (i = 0; i < data[0].songMixs.length; i++) {
				//			matchesNum = i;
                 //           //SHOULD SEND ONLY DATA [i]
                 //           //.nextSong.songName,data[0].songMixs[i].nextSong.songArtist[0].artistName
				//			createMatches(data[0].songMixs[i]);
				//		}
				//	}
                    if(data[0] == undefined){
                        $('.songMatchesDiv').append(
                            "<h4>There are no songs that match your search, </h4><a href='/admin'>you can add it :)</a>");

                    }else if (data[0].songMixs == undefined){
                        $("#contenido").append(
                            "<ul><h4>There are no mixes that match your search, </h4><a href='/admin'>you can add one :)</a></ul>");
                    }else if (data[0].songMixs.length > 0){
                        fillMatchesTemplate(data);
                    }
				} catch (err) {
					$('.songMatchesDiv').append(
							"<h4>There are no songs that match your search</h4>");
					console.log(err);
				}
			});
}

function fillTemplate(data) {
    var source   = $("#songsTemplate").html();
    var template = Handlebars.compile(source);
    $("#contenido").append( template({objects:data}) );
}

function fillMatchesTemplate(data) {
    var source   = $("#matchesTemplate").html();
    var template = Handlebars.compile(source);
    $("#contenido").append( template({objects:data}) );
}

function emptyFields() {
    $('#contenido').empty();
	//$('#songSearched').empty();
	//$('.song-searched-text').empty();
	//$('.song-searched').empty();
	//$('.songMatchesDiv').empty();
}

var allSongsNames = new Array();
var allArtistsNames = new Array();
var allTracklistsNames = new Array();
var allButExcluded = new Array();

// Testing purposes... Names need to be retrieved from Song collection AND/OR in
// another way to avoid the for loop
function defineNames() {
	$.ajax({
		url : "http://localhost:3000/song/"
	}).then(function(data) {
		// for(i = 0; i < data.length; i++){
		// allSongNames[i] = data[i].songOne;
		// }
		var seen = {};
		// allSongsNames = []; //TODO:NEED TO SOLVE THIS AS IF WE KEEP THE
		// SOURCE AND THE ALLSONGS VAR WE ARE USING THE DOUBLE OF SPACE
		var len = data.length;
		var j = 0;
		for (var i = 0; i < len; i++) {
			var item = data[i].songName;
			if (seen[item] !== 1) {
				seen[item] = 1;
				allSongsNames[j++] = item;
			}
		}
	});
}

function defineArtists() {
	$.ajax({
		url : "http://localhost:3000/artist/"
	}).then(function(data) {
		// for(i = 0; i < data.length; i++){
		// allSongNames[i] = data[i].songOne;
		// }
		var seen = {};
		// allSongsNames = []; //TODO:NEED TO SOLVE THIS AS IF WE KEEP THE
		// SOURCE AND THE ALLSONGS VAR WE ARE USING THE DOUBLE OF SPACE
		var len = data.length;
		var j = 0;
		for (var i = 0; i < len; i++) {
			var item = data[i].artistName;
			if (seen[item] !== 1) {
				seen[item] = 1;
				allArtistsNames[j++] = item;
			}
		}
	});
}

function defineTracklists() {
    $.ajax({
        url : "http://localhost:3000/tracklists/"
    }).then(function(data) {
        // for(i = 0; i < data.length; i++){
        // allSongNames[i] = data[i].songOne;
        // }
        var seen = {};
        // allSongsNames = []; //TODO:NEED TO SOLVE THIS AS IF WE KEEP THE
        // SOURCE AND THE ALLSONGS VAR WE ARE USING THE DOUBLE OF SPACE
        var len = data.length;
        var j = 0;
        for (var i = 0; i < len; i++) {
            var item = data[i].tracklistName;
            if (seen[item] !== 1) {
                seen[item] = 1;
                allTracklistsNames[j++] = item;
            }
        }
    });
}



//FUNCTION USED TO EXCLUDE THE MATCHES WHEN ADDING A NEW MIX
//TODO: Still need to exclude the match created, otherwise song will still appear once we finish the insert
function excludeMixMatches(songName) {
    var excludeMatches = new Array();
    $.ajax({
        url : "http://localhost:3000/songName/" + songName
    }).then(function(data) {
        // for(i = 0; i < data.length; i++){
        // allSongNames[i] = data[i].songOne;
        // }
        var seen = {};
        // allSongsNames = []; //TODO:NEED TO SOLVE THIS AS IF WE KEEP THE
        // SOURCE AND THE ALLSONGS VAR WE ARE USING THE DOUBLE OF SPACE
        try{
            var len = data[0].songMixs.length;
            excludeMatches[0] = songName;
            var j = 1;
            for (var i = 0; i < len; i++) {
                var item = data[0].songMixs[i].nextSong.songName;
                if (seen[item] !== 1) {
                    seen[item] = 1;
                    excludeMatches[j++] = item;
                }
            }
        }catch(e) {
            excludeMatches[0] = songName;
        }
        console.log("I will exclude: " + excludeMatches);
        definePossibleMatches(excludeMatches);
    });
}

// DEFINE POSSIBLE MATCHES EXCLUDING THE MATCHES THAT A SONG ALREADY HAS
function defineExcludedTypeAhead() {
    $('#allButExcluded .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    }, {
        name: 'states',
        displayKey: 'value',
        source: substringMatcher(allButExcluded)
    });
}
function definePossibleMatches(excludeMatches){
    $.ajax({
        url : "http://localhost:3000/song/"
    }).then(function(data) {
        // for(i = 0; i < data.length; i++){
        // allSongNames[i] = data[i].songOne;
        // }
        var seen = {};
        for (var i = 0; i < excludeMatches.length; i++) {
            seen[excludeMatches[i]] = 1;
        }
        // allSongsNames = []; //TODO:NEED TO SOLVE THIS AS IF WE KEEP THE
        // SOURCE AND THE ALLSONGS VAR WE ARE USING THE DOUBLE OF SPACE
        var len = data.length;
        var j = 0;
        for (var i = 0; i < len; i++) {
            var item = data[i].songName;
            if (seen[item] !== 1) {
                seen[item] = 1;
                allButExcluded[j++] = item;
            }
        }

        defineExcludedTypeAhead();
    });
}

function substringMatcher(strs) {
	return function findMatches(q, cb) {
		var matches, substrRegex;

		// an array that will be populated with substring matches
		matches = [];

		// regex used to determine if a string contains the substring `q`
		substrRegex = new RegExp(q, 'i');

		// iterate through the pool of strings and for any string that
		// contains the substring `q`, add it to the `matches` array
		$.each(strs, function(i, str) {
			if (substrRegex.test(str)) {
				// the typeahead jQuery plugin expects suggestions to a
				// JavaScript object, refer to typeahead docs for more info
				matches.push({
					value : str
				});
			}
		});

		if (matches.length === 0) {
			matches.push({
				value : "No results found :("
			});
		}

		cb(matches);
	};
}

$(document).ready(function() {

	defineNames();
    defineArtists();
    defineTracklists();

	$('#the-basics .typeahead').typeahead({
		hint : true,
		highlight : true,
		minLength : 1
	}, {
		name : 'states',
		displayKey : 'value',
		source : substringMatcher(allSongsNames)
	});

	$('#songArtistDropdown .typeahead').typeahead({
		hint : true,
		highlight : true,
		minLength : 1
	}, {
		name : 'states',
		displayKey : 'value',
		source : substringMatcher(allArtistsNames)
	});

    $('#tracklistDropdown .typeahead').typeahead({
        hint : true,
        highlight : true,
        minLength : 1
    }, {
        name : 'states',
        displayKey : 'value',
        source : substringMatcher(allTracklistsNames)
    });
	
	
	//FOR ENTER KEY
	$('#inputFindSong').keydown(function(event){    
	    if(event.keyCode==13){
	       $('#searchButton').trigger('click');
//	       alert("Enter");
	    }
	});
	
	//FOR CLICK
	$(document).on("click",".tt-suggestion", function (e) {
		if (e.type == "click") {
//		alert($(this).text()+" Click");
//		searchSong($(this).text());
        $('#searchButton').trigger('click');
		}
	});
	
	
});

//function createSongSearched(data) {
//    // create a link with the thumbnail
//    var linkElement = document.createElement('a');
//    linkElement.style = "cursor: pointer";
//    linkElement.id = "songSearchedDiv";
//    var attLink = document.createAttribute("class");
//    attLink.value = "pull-left";
//    linkElement.setAttributeNode(attLink);
//
//    var songResults = document.getElementById('songSearched');
//    songResults.appendChild(linkElement);
//
//    // Create the Thumbnail/Media
//    var mediaElement = document.createElement('img');
//    mediaElement.src = "/images/discImage.png";
//    mediaElement.width = "64";
//    mediaElement.height = "64";
//    var att = document.createAttribute("class");
//    att.value = "img-thumbnail"; // Set the value of the class attribute
//    mediaElement.setAttributeNode(att);
//
//    var songResults2 = document.getElementById('songSearchedDiv');
//    songResults2.appendChild(mediaElement);
//
//    // Create div 1
//    var songSearchedDiv = document.createElement('div');
//    songSearchedDiv.id = "songMatchSearchedDetails";
//
//    var attSongSearchedDiv = document.createAttribute("class");
//    attSongSearchedDiv.value = "media-body col-sm-8";
//    songSearchedDiv.setAttributeNode(attSongSearchedDiv);
//
//    var songSearched = document.getElementById('songSearched');
//    songSearched.appendChild(songSearchedDiv);
//
//    // Create div 2
//    var songMatchSearchedDetailsDiv = document.createElement('div');
//    songMatchSearchedDetailsDiv.id = "songMatchSearchedDetailsDiv";
//
//    var attsongMatchSearchedDetailsDiv = document.createAttribute("class");
//    attsongMatchSearchedDetailsDiv.value = "well well-lg";
//    songMatchSearchedDetailsDiv
//        .setAttributeNode(attsongMatchSearchedDetailsDiv);
//
//    var songMatchSearchedDetails = document
//        .getElementById('songMatchSearchedDetails');
//    songMatchSearchedDetails.appendChild(songMatchSearchedDetailsDiv);
//
//    // Create content of the div 2
//    var songMatchSearchedDetailsHeader = document.createElement('h4');
//    songMatchSearchedDetailsHeader.id = "songMatchSearchedDetailsHeader";
//    var headerText = document.createTextNode(data.songName);
//    songMatchSearchedDetailsHeader.appendChild(headerText);
//
//    //CREATE ARTIST LINK
//    var songMatchSearchedDetailsHeader2 = document.createElement('a');
//    songMatchSearchedDetailsHeader2.id = "songMatchSearchedDetailsHeader2";
//    var headerText2 = document.createTextNode(data.songArtist[0].artistName);
//    songMatchSearchedDetailsHeader2.appendChild(headerText2);
//    songMatchSearchedDetailsHeader2.title = "my title text";
//    songMatchSearchedDetailsHeader2.href = "/artistInfo?"+data.songArtist[0].artistName;
//
//    var songMatchSearchedDetailsP = document.createElement('p');
//    songMatchSearchedDetailsP.id = "songMatchSearchedDetailsP";
//    var pText = document.createTextNode(" - BPM: "+data.bpm+" - KEY: "+data.key);
//    songMatchSearchedDetailsP.appendChild(pText);
//
//    var songMatchSearchedDetails2 = document
//        .getElementById('songMatchSearchedDetailsDiv');
//    songMatchSearchedDetails2.appendChild(songMatchSearchedDetailsHeader);
//    songMatchSearchedDetails2.appendChild(songMatchSearchedDetailsHeader2);
//    songMatchSearchedDetails2.appendChild(songMatchSearchedDetailsP);
//
//}

//function createMatchesTextDiv(params) {
//
//    var headerElement = document.createElement('h2');
//    var headerText = document.createTextNode(params);
//    headerElement.appendChild(headerText);
//    var headerVar = document.getElementById('songMatchesDiv');
//    headerVar.appendChild(headerElement);
//    createDivision();
//
//}

// Create matches div structure
//var matchesNum;
//
//function createMatches(data) {
//
//    var matchesDiv = document.createElement('div');
//    matchesDiv.id = "songMatch" + matchesNum;
//
//    var attMatchesDiv = document.createAttribute("class");
//    attMatchesDiv.value = "row";
//    matchesDiv.setAttributeNode(attMatchesDiv);
//
//    var songResults = document.getElementById('songMatchesDiv');
//    songResults.appendChild(matchesDiv);
//
//    createMedia();
//    createDivMatches(matchesDiv.id, matchesNum);
//    // createLink(songName);
//    createMediaContent(data, matchesNum);
//    createDivision();
//
//}
//
//function createDivMatches(params, matchesNum) {
//
//    var songSearchedDiv = document.createElement('div');
//    songSearchedDiv.id = "songMatchSearchedDetails" + matchesNum;
//
//    var attSongSearchedDiv = document.createAttribute("class");
//    attSongSearchedDiv.value = "media-body col-md-8";
//    songSearchedDiv.setAttributeNode(attSongSearchedDiv);
//
//    var songSearched = document.getElementById(params, matchesNum);
//    songSearched.appendChild(songSearchedDiv);
//
//    createDivMatchesInformation(songSearchedDiv.id, matchesNum);
//}
//
//function createDivMatchesInformation(params, matchesNum) {
//
//    var songMatchSearchedDetailsDiv = document.createElement('div');
//    songMatchSearchedDetailsDiv.id = "songMatchSearchedDetailsDiv" + matchesNum;
//
//    var attsongMatchSearchedDetailsDiv = document.createAttribute("class");
//    attsongMatchSearchedDetailsDiv.value = "well well-lg";
//    songMatchSearchedDetailsDiv
//        .setAttributeNode(attsongMatchSearchedDetailsDiv);
//
//    var songMatchSearchedDetails = document.getElementById(params);
//    songMatchSearchedDetails.appendChild(songMatchSearchedDetailsDiv);
//
//}
//
//function createMediaContent(data, matchesNum) {
//
//    var songMediaContentHeader = document.createElement('h4');
//    songMediaContentHeader.id = "songMatchSearchedDetailsHeader" + matchesNum;
//    var songMediaContentText = document.createTextNode(data.nextSong.songArtist[0].artistName + " - " + data.nextSong.songName);
//    songMediaContentHeader.appendChild(songMediaContentText);
//
//    var songMediaContentP = document.createElement('p');
//    songMediaContentP.id = "songMatchSearchedDetailsP" + matchesNum;
//
//    //TODO: WE HAVE MORE THAN ONE RECOMMENDATION MAYBE WE SHOULD SHOW THIS ON A MODAL.
//    var songMediaContentParText = document.createTextNode(data.recommendations[0].comments);
//    songMediaContentP.appendChild(songMediaContentParText);
//
//    var songMediaContentDetails = document
//        .getElementById('songMatchSearchedDetailsDiv' + matchesNum);
//    songMediaContentDetails.appendChild(songMediaContentHeader);
//    songMediaContentDetails.appendChild(songMediaContentP);
//
//}
//
//// Create a small division
//function createDivision() {
//
//    var divisionElement = document.createElement('hr');
//
//    var divisionVar = document.getElementById('songMatchesDiv');
//    divisionVar.appendChild(divisionElement);
//
//}

// Creates a media element to be aded
//function createMedia() {
//
//    var mediaElement = document.createElement('img');
//    mediaElement.src = "/images/discImage.png";
//    mediaElement.width = "64";
//    mediaElement.height = "64";
//    var att = document.createAttribute("class");
//    att.value = "img-thumbnail pull-left"; // Set the value of the class
//    // attribute
//    mediaElement.setAttributeNode(att);
//    var songResults = document.getElementById('songMatch' + matchesNum);
//    songResults.appendChild(mediaElement);
//}
//
//// Creates a link element to be added
//function createLink(songName) {
//
//    var linkElement = document.createElement('a');
//    linkElement.text = songName + " ";
//    linkElement.style = "cursor: pointer";
//    linkElement.onclick = function() {
//        searchSong(songName);
//    };
//    var songResults = document.getElementById('songMatch' + matchesNum);
//    songResults.appendChild(linkElement);
//}