let allFeeds;

//loads the feeds once the documanet is loaded
document.addEventListener('DOMContentLoaded', (event) => {
    $.ajax({ 
        url: "http://138.49.184.115:3000/api/v1/feeds",
        method: 'GET',
        success: function( feeds ) {
            createFeeds(feeds);
            allFeeds = feeds;
        },
        error: function( xhr, status, errorThrown ) {
            alert( `Sorry, there was a problem!, Might need to be connected to UWL servers. Status: ${status}`);
        },
        complete: function( xhr, status ) {
            // alert( `Status: ${status} The request is complete!` );
        }
    });
});

//Adding the feed names to the select
function createFeeds(feeds){
    //CreateArticles on the first feed in the list
    fetchArticles(feeds[0]);

    //Add listener to the select from to change the channel
    select = document.getElementById('form-select');
    select.addEventListener('change', (e) =>{
        currentFeed = e.target.value;
    })

    let loadButton = document.getElementById('news-button');
    loadButton.addEventListener('click', (e) =>{
        //Delete all the articles
        deleteArticles();

        //Re populate the artilces with the new news feed
        fetchArticles(allFeeds[select.value])
    })

    for(i=0; i < feeds.length; i++){
        optionValue = feeds[i].url;
        optionText = feeds[i].name;
        $('#form-select').append(`<option value="${i}">${optionText}</option>`);
    }
}

//Create the articles from the selected feed
function fetchArticles(feedSchema){
    $.ajax({
        url: `http://138.49.184.115:3000/api/v1/feeds/${feedSchema.name}`,
        method: 'GET',
        data: {},
        success: function(feed){
            for(i = 0; i < feed.items.length; i++){
                $(`#newsfeed`).append(`
                    <li>
                        <div class="news-article">
                            <h1>
                                <a href=${feed.items[i][feedSchema.mapping.link]}>${feed.items[i][feedSchema.mapping.title]}</a>
                            </h1>
                            <p>${feed.items[i][feedSchema.mapping.pubDate]}</p>
                            <p>${feed.items[i][feedSchema.mapping.contentSnippet]}</p>
                        </div>
                    </li>`
                );
            }
        },
        error: function( xhr, status, errorThrown ) {
            alert( "Sorry, there was a problem!"  + errorThrown );
        },
        complete: function( xhr, status ) {
            // alert( `Status: ${status} The request is complete!` );
        }
    });
}

function deleteArticles(){
    let ul = document.getElementById('newsfeed');
    while(ul.firstChild){
        ul.firstChild.remove();
    }
}