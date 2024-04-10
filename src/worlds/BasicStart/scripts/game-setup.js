'use strict'

// Global Vars

// setupGame Function - runs at onload
function setupGame(){

    // Delay by 2 seconds, otherwise it will run before server can update number of NAF Avatars in world
    // setTimeout(function() {
    //     // Only generate new artifacts if you are the first person in the world
    //     if (CIRCLES.getNAFAvatarElements() == 1) {

    //     }
    // }, 2000);

    //set button to spawn new artifact on press
    let testButtonEl = document.querySelector('#test_button');     //get button element
    testButtonEl.addEventListener('click', function() {            //add event listener for on click
        setupArtifacts();                                           //run setupArtifacts()
    });

    // Spawn all artifacts into scene
    // setupArtifacts();
}