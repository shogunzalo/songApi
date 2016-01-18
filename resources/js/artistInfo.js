/**
 * Created by gonzalo on 08-03-15.
 */

function searchArtist(param) {

    if(!param){
        param = window.location.search.substring(1);
    }
    if(param.length == 0){
        return;
    }

    $.ajax({
        url : "http://localhost:3000/artistName/" + param
    }).then(
        function(data) {
            //emptyFields();
            // TODO: Show the artist information
            try {
                clearAll();
                searchArtistTracklist(data[0]._id);
                fillArtistTemplate(data);
                //createArtistSearched(data[0]);
                createArtistSongs(data[0]._id);
            } catch (err) {
                $('.songMatchesDiv').append(
                    "<h4>There are no artists that match your search</h4>");
                console.log(err);
            }
        });
}

function clearAll(){
    $('#artistInfo').empty();
    $('#songMatchesDiv').empty();
    $('#artistTracklists').empty();
    $('#artistSongs').empty();
}

function searchArtistTracklist(params) {

    $.ajax({
        url : "http://localhost:3000/tracklistByArtist/" + params
    }).then(
        function(data) {
            //emptyFields();
            // TODO: Show the artist information
            try {
                fillArtistTracklistsTemplate(data);
            } catch (err) {
                $('.songMatchesDiv').append(
                    "<h4>There are no tracklists fot this artist</h4>");
                console.log(err);
            }
        });
}

function fillArtistTracklistsTemplate(data) {
    var source   = $("#artistTracklistsTemplate").html();
    var template = Handlebars.compile(source);
    $("#artistTracklists").append( template({objects:data}) );
}

function fillArtistTemplate(data) {
    var source   = $("#artistTemplate").html();
    var template = Handlebars.compile(source);
    $("#artistInfo").append( template({objects:data}) );
}

function fillSongsTemplate(data) {
    var source   = $("#songsTemplate").html();
    var template = Handlebars.compile(source);
    $("#artistSongs").append( template({objects:data}) );
}

function createArtistSongs(params) {

    $.ajax({
        url : "http://localhost:3000/artistSongs/" + params
    }).then(
        function(data) {
            //emptyFields();
            fillSongsTemplate(data);
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

// Create matches div structure
var matchesNum;

//function createMatches(data) {
//
//    createDivision();
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
//    createDivMatches(matchesDiv.id, matchesNum);
//    // createLink(songName);
//    createMediaContent(data, matchesNum);
//
//}

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
//function createMediaContent(params, matchesNum) {
//
//    var songMediaContentHeader = document.createElement('h4');
//    songMediaContentHeader.id = "songMatchSearchedDetailsHeader" + matchesNum;
//    var songMediaContentText = document.createTextNode(params.songName);
//    songMediaContentHeader.appendChild(songMediaContentText);
//
//    var songMediaContentP = document.createElement('p');
//    songMediaContentP.id = "songMatchSearchedDetailsP" + matchesNum;
//
//    //TODO: WE HAVE MORE THAN ONE RECOMMENDATION MAYBE WE SHOULD SHOW THIS ON A MODAL.
//    var songMediaContentParText = document.createTextNode("BPM: "+params.bpm+" -- KEY: "+params.key+
//    " -- recordLabel: "+params.recordLabel+" -- genre: "+params.genre);
//    songMediaContentP.appendChild(songMediaContentParText);
//
//    var songMediaContentDetails = document
//        .getElementById('songMatchSearchedDetailsDiv' + matchesNum);
//    songMediaContentDetails.appendChild(songMediaContentHeader);
//    songMediaContentDetails.appendChild(songMediaContentP);
//
//}
//
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

//function createArtistSearched(params) {
//
//    var artistSearchedImage = document.createElement('img');
//
//    var att1 = document.createAttribute("class");
//    att1.value = "fb-image-profile thumbnail";
//
//    var att2 = document.createAttribute("src");
//    att2.value = "http://dummyimage.com/300x300&text="+params.artistName;
//
//    var att3 = document.createAttribute("align");
//    att3.value = "left";
//
//    artistSearchedImage.setAttributeNode(att3);
//    artistSearchedImage.setAttributeNode(att2);
//    artistSearchedImage.setAttributeNode(att1);
//
//
//    var artistDetailsDiv = document.createElement('div');
//    //artistDetailsDiv.id = "artistInfoText";
//    var divAtt1 = document.createAttribute("class");
//    divAtt1.value = "fb-profile-text";
//    artistDetailsDiv.setAttributeNode(divAtt1);
//
//    //var artistInfo = document
//        .getElementById('artistInfo');
//    artistInfo.appendChild(artistSearchedImage);
//    artistInfo.appendChild(artistDetailsDiv);
//
//
//    var artistSearchedName = document.createElement('h1');
//    var hText = document.createTextNode(params.artistName);
//    artistSearchedName.appendChild(hText);
//
//    var artistSearchedDesc = document.createElement('p');
//    var pText = document.createTextNode(params.artistDesc);
//    artistSearchedDesc.appendChild(pText);
//
//
//    var artistDetails = document
//        .getElementById('artistInfoText');
//    artistDetails.appendChild(artistSearchedName);
//    artistDetails.appendChild(artistSearchedDesc);
//
//}


//<img align="left"alt="Profile image example"/>
//<div class="fb-profile-text">
//<h1>Eli Macy</h1>
//<p>Girls just wanna go fun.</p>
//</div>