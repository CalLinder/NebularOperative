'use strict'

// Global Vars

// NOTE: This function will run for all players who join.
//       That said, only the changes made to the entities for the host player will be reflected for all players.
//       This is because the networked entities for other players will have different NAF ID's.

// setupGame Function - runs at onload
function setupGame(){
    console.log('setupGame() running');    //Debug message

    // Delay by 2 seconds, otherwise it will run before server can update number of NAF Avatars in world
    setTimeout(function() {
        // Only update UI if not first person on server
        if (CIRCLES.getNAFAvatarElements() > 1) {
            
        }
    }, 2000);

    // TO DO: Replace the button with a check for three players. When there are three players, start game.
    // this check should be in the game-manager component's tick() function

    //set button to spawn new artifact on press
    let testButtonEl = document.querySelector('#test_button');     //get button element
    testButtonEl.addEventListener('click', function() {            //add event listener for on click
        setupArtifacts();
    });

    // Spawn all artifacts into scene
    // setupArtifacts();
}