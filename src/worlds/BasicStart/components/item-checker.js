'use strict'

// global vars
let Global_Submitted_Artifact_Id = null;

// item drop location manager------------------------------------------------------------
AFRAME.registerComponent('item-checker', {

schema: {
        item: {type: "string", default: null},
    },

    init: function() {
        //must be const or the event listener later in the code won't be able to reference the variable
        const CONTEXT_AF = this;    //this refers to the component, not the element that the component is attached to

        // Network Stuff
        CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();

        let audioSFXPlayer = document.createElement('a-entity');        
        audioSFXPlayer.setAttribute("circles-sound", {type: "basic-diegetic", src: "#ID_Checking_Item_SFX", volume: "0.2"});        
        audioSFXPlayer = CONTEXT_AF.el.appendChild(audioSFXPlayer);

        CONTEXT_AF.el.addEventListener("itemPickupDrop", function(e) {     
            //set up audio players
            
            //every time an item is locally dropped
            if(!e.detail.pickedUp)
            {

                //If player is close enough to the checker
                if((CONTEXT_AF.el.object3D.position.distanceTo(document.querySelector('#Player1').object3D.position) <= 5)) //CHANGE THIS VALUE TO INCREASE DROP SNAP RADIUS
                {
                    //if no item is already placed
                    if(CONTEXT_AF.item == null)
                    {   
                        // ITEM CHECK BEGINS HERE -------------------------------------------------
                        // Determine if the player placing the object is the host
                        CONTEXT_AF.isHost = document.querySelector('#ID_Game_Manager').getAttribute('isHost');

                        //update values
                        CONTEXT_AF.item = e.detail.item;

                        // Get artifactList[] data for relevant artifact
                        for (let j = 0; j < Object.keys(artifactList).length; j++) {
                            if (artifactList[Object.keys(artifactList)[j]].model_path == CONTEXT_AF.item.getAttribute('gltf-model')) {
                                CONTEXT_AF.itemListEntry = artifactList[Object.keys(artifactList)[j]];
                            }
                        }

                        //Get item ID from element ID
                        let itemID = CONTEXT_AF.itemListEntry.artifact_id;

                        //get the vector going from the spawner to the checker
                        let vecSpawnToChecker = new THREE.Vector3().copy(CONTEXT_AF.el.object3D.position).sub(e.detail.item.parentNode.object3D.position);

                        //have the object be placed on the checker instead of its spawn point
                        e.detail.item.setAttribute("position", + vecSpawnToChecker.x + " " + vecSpawnToChecker.y + 1 + " " + vecSpawnToChecker.z);
                        e.detail.item.setAttribute("rotation", "0 90 0");

                        // If HOST player submits artifact
                        if (CONTEXT_AF.isHost == 'true') {
                            console.log('HOST player submitting artifact'); //debug statement

                            // adel original item checker -------------------

                            //initiate checking sequence
                            CONTEXT_AF.item.setAttribute("circles-interactive-object", "enabled: false");

                            // console.log(CONTEXT_AF.item); //debug statement

                            // Pause for a beat
                            setTimeout(function() {

                                let checkerTextEl = CONTEXT_AF.item.querySelector(".check_text");

                                //Start checking
                                audioSFXPlayer.setAttribute("circles-sound", "state: play");

                                //Change UI background's colour for this object
                                checkerTextEl.setAttribute("text","value:CHECKING...; color:yellow");

                                // TO DO: EMIT CHECKING
                                // set variable to equal clone artifact element
                                Global_Submitted_Artifact_Id = itemID;
                                // dispatch custom event: CustomEvent_CheckingArtifact | event listener in game-manager.js
                                document.querySelector('#ID_Game_Manager').dispatchEvent(CustomEvent_CheckingArtifact);

                                //Checked
                                setTimeout(function() {

                                    //check the item placed on the checker's ID against the stored challenge values
                                    //If correct item
                                    if(
                                        artifactList[itemID].year == challengeYear &&
                                        artifactList[itemID].country == challengeCountry &&
                                        artifactList[itemID].manufacturer == challengeManufacturer
                                    )
                                    {
                                        //Play sounds
                                        audioSFXPlayer.setAttribute("circles-sound", {src: "#ID_Correct_Item_SFX", state: "stop"});
                                        audioSFXPlayer.setAttribute("circles-sound", "state: play");

                                        //update colour
                                        checkerTextEl.setAttribute("text","value:CORRECT; color:green");

                                        // TO DO: EMIT WIN
                                        // set variable to equal clone artifact element
                                        Global_Submitted_Artifact_Id = itemID;
                                        // dispatch custom event: CustomEvent_CorrectArtifact | event listener in game-manager.js
                                        document.querySelector('#ID_Game_Manager').dispatchEvent(CustomEvent_CorrectArtifact);
                                        // dispatch custom event: CustomEvent_StartOutro | event listener in game-manager.js
                                        document.querySelector('#ID_Game_Manager').dispatchEvent(CustomEvent_StartOutro);
                                        //play startOutro() from game-manager.js
                                        startOutro();

                                    }
                                    //if incorrect item
                                    else
                                    {  
                                        //Play sounds
                                        audioSFXPlayer.setAttribute("circles-sound", {src: "#ID_Wrong_Item_SFX", state: "stop"});
                                        audioSFXPlayer.setAttribute("circles-sound", "state: play");

                                        //update colour
                                        checkerTextEl.setAttribute("text","value:INCORRECT; color:red");
                                        
                                        // TO DO: EMIT LOSS
                                        // set variable to equal clone artifact element
                                        Global_Submitted_Artifact_Id = itemID;
                                        // dispatch custom event: CustomEvent_IncorrectArtifact | event listener in game-manager.js
                                        document.querySelector('#ID_Game_Manager').dispatchEvent(CustomEvent_IncorrectArtifact);

                                    }

                                    //wait a bit and reset
                                    setTimeout(function() {
                                        audioSFXPlayer.setAttribute("circles-sound", {src: "#ID_Checking_Item_SFX", state: "stop"});
                                        CONTEXT_AF.item.setAttribute("circles-interactive-object", "enabled: true");
                                    }, 1000);

                                }, 3103);

                            
                            }, 1000);
                        }
                        // If NON-HOST player submits artifact
                        else {
                            console.log('NON-HOST player submitting artifact'); //debug statement
                            // set variable to equal clone artifact element
                            Global_Submitted_Artifact_Id = itemID;
                            // dispatch custom event: CustomEvent_NonHostSubmittedArtifact | event listener in game-manager.js
                            document.querySelector('#ID_Game_Manager').dispatchEvent(CustomEvent_NonHostSubmittedArtifact);
                        }

                        
                    }

                }
            }

            else
            {
                if(CONTEXT_AF.item == e.detail.item)
                {
                    CONTEXT_AF.item = null;
                }
            }

   
        });     
                
    },

    tick: function(time, timeDelta) {
        const CONTEXT_AF = this;                                                    //this refers to the component, not the element that the component is attached to
    
    }

    //other possible functions
    //update:function() {oldData},            //IS NOT OF's update ... only called when a property in the schema changes
    //tick:function() {time, timeDelta},      //Is called every update
    //tock:function() {time, timeDelta},      //Is called immediately after tick
    //remove:function() {},                   //Deconstructor
    //pause:function() {},                    //Web pauses, this happens when you go to another tab
    //play:function() {},                     //Web plays, this happens when you return to the tab
    //updateSchema:function() {data},         //

});

function submitNonHostArtifact(artifactID) {
    //update values
    let itemListEntry = null;

    // Get artifactList[] data for relevant artifact
    for (let j = 0; j < Object.keys(artifactList).length; j++) {
        if (artifactList[Object.keys(artifactList)[j]].artifact_id == artifactID) {
            itemListEntry = artifactList[Object.keys(artifactList)[j]];
        }
    }

    let artifactElement = document.querySelectorAll('[artifact_id^="ID_' + artifactID + '"]')[0];
    
    //Get item ID from element ID
    let itemID = itemListEntry.artifact_id;

    // ITEM CHECK BEGINS HERE -------------------------------------------------
    
    // TO DO: EMIT CHECKING
    // set variable to equal clone artifact element
    Global_Submitted_Artifact_Id = itemID;

    // dispatch custom event: CustomEvent_CheckingArtifact | event listener in game-manager.js
    document.querySelector('#ID_Game_Manager').dispatchEvent(CustomEvent_CheckingArtifact);

    let audioSFXPlayer = document.createElement('a-entity');        
    audioSFXPlayer.setAttribute("circles-sound", {type: "basic-diegetic", src: "#ID_Checking_Item_SFX", volume: "0.2"});        
    audioSFXPlayer = artifactElement.appendChild(audioSFXPlayer);

    // adel original item checker -------------------
    //get the vector going from the spawner to the checker
    // ID_Artifact_Checker_1
    let artifactCheckerElement = document.querySelector('#ID_Artifact_Checker_1');
    let vecSpawnToChecker = new THREE.Vector3().copy(artifactCheckerElement.object3D.position).sub(artifactElement.parentNode.object3D.position);

    //have the object be placed on the checker instead of its spawn point
    artifactElement.setAttribute("position", + vecSpawnToChecker.x + " " + vecSpawnToChecker.y + 1 + " " + vecSpawnToChecker.z);
    artifactElement.setAttribute("rotation", "0 90 0");

    //initiate checking sequence
    artifactElement.setAttribute("circles-interactive-object", "enabled: false");
    // console.log(artifactElement); //debug statement

    // Pause for a beat
    setTimeout(function() {

        let checkerTextEl = artifactElement.querySelector(".check_text");

        //Start checking
        audioSFXPlayer.setAttribute("circles-sound", "state: play");

        //Change UI background's colour for this object
        checkerTextEl.setAttribute("text","value:CHECKING...; color:yellow");

        //Checked
        setTimeout(function() {

            //check the item placed on the checker's ID against the stored challenge values
            //If correct item
            if(
                artifactList[itemID].year == challengeYear &&
                artifactList[itemID].country == challengeCountry &&
                artifactList[itemID].manufacturer == challengeManufacturer
            )
            {
                //Play sounds
                audioSFXPlayer.setAttribute("circles-sound", {src: "#ID_Correct_Item_SFX", state: "stop"});
                audioSFXPlayer.setAttribute("circles-sound", "state: play");

                //update colour
                checkerTextEl.setAttribute("text","value:CORRECT; color:green");

                // TO DO: EMIT WIN
                // set variable to equal clone artifact element
                Global_Submitted_Artifact_Id = itemID;
                // dispatch custom event: CustomEvent_CorrectArtifact | event listener in game-manager.js
                document.querySelector('#ID_Game_Manager').dispatchEvent(CustomEvent_CorrectArtifact);
                // dispatch custom event: CustomEvent_StartOutro | event listener in game-manager.js
                document.querySelector('#ID_Game_Manager').dispatchEvent(CustomEvent_StartOutro);
                //play startOutro() from game-manager.js
                startOutro();

            }
            //if incorrect item
            else
            {  
                //Play sounds
                audioSFXPlayer.setAttribute("circles-sound", {src: "#ID_Wrong_Item_SFX", state: "stop"});
                audioSFXPlayer.setAttribute("circles-sound", "state: play");

                //update colour
                checkerTextEl.setAttribute("text","value:INCORRECT; color:red");

                // TO DO: EMIT LOSS
                // set variable to equal clone artifact element
                Global_Submitted_Artifact_Id = itemID;
                // dispatch custom event: CustomEvent_IncorrectArtifact | event listener in game-manager.js
                document.querySelector('#ID_Game_Manager').dispatchEvent(CustomEvent_IncorrectArtifact);

            }

                //wait a bit and reset
                setTimeout(function() {
                    audioSFXPlayer.setAttribute("circles-sound", {src: "#ID_Checking_Item_SFX", state: "stop"});
                    artifactElement.setAttribute("circles-interactive-object", "enabled: true");
                }, 1000);

        }, 3103);

    }, 1000);
                        
}

// The following functions are only seen by non-host users so assume non-host
function checkingArtifact(Artifact_Model_Path){
    
    console.log('Running checkingArtifact()'); //debug statement

    let artifactElement = null;
    
    for (let j = 0; j <= networkedArtifactElementList.length - 1; j++) {
        if (networkedArtifactElementList[j].getAttribute('gltf-model') == Artifact_Model_Path) {
            artifactElement = networkedArtifactElementList[j];
        }
    }

    // Setup Vars
    let checkerTextEl = artifactElement.querySelector(".check_text");
    // Play Audio Cue
    let audioSFXPlayer = document.createElement('a-entity');        
    audioSFXPlayer.setAttribute('class', 'CLASS_Audio_Player');
    audioSFXPlayer.setAttribute("circles-sound", {type: "basic-diegetic", src: "#ID_Checking_Item_SFX", volume: "0.2"});        
    audioSFXPlayer = artifactElement.appendChild(audioSFXPlayer);
    audioSFXPlayer.setAttribute("circles-sound", "state: play");
    // Update Text
    checkerTextEl.setAttribute("text","value:CHECKING...; color:yellow");
}

function correctArtifact(Artifact_Model_Path){

    console.log('Running correctArtifact()'); //debug statement
    
    let artifactElement = null;
    
    for (let j = 0; j <= networkedArtifactElementList.length - 1; j++) {
        if (networkedArtifactElementList[j].getAttribute('gltf-model') == Artifact_Model_Path) {
            artifactElement = networkedArtifactElementList[j];
        }
    }

    // Setup Vars
    let checkerTextEl = artifactElement.querySelector(".check_text");
    // Play Audio Cue
    let audioSFXPlayer = artifactElement.querySelector('.CLASS_Audio_Player')   
    audioSFXPlayer.setAttribute("circles-sound", {src: "#ID_Checking_Item_SFX", state: "stop"});    
    audioSFXPlayer.setAttribute("circles-sound", {type: "basic-diegetic", src: "#ID_Correct_Item_SFX", volume: "0.2"});        
    audioSFXPlayer = artifactElement.appendChild(audioSFXPlayer);
    audioSFXPlayer.setAttribute("circles-sound", "state: play");
    // Update Text
    checkerTextEl.setAttribute("text","value:CORRECT; color:green");
}

function incorrectArtifact(Artifact_Model_Path){

    console.log('Running incorrectArtifact()'); //debug statement
    
    let artifactElement = null;
    
    for (let j = 0; j <= networkedArtifactElementList.length - 1; j++) {
        if (networkedArtifactElementList[j].getAttribute('gltf-model') == Artifact_Model_Path) {
            artifactElement = networkedArtifactElementList[j];
        }
    }

    // Setup Vars
    let checkerTextEl = artifactElement.querySelector(".check_text");
    // Play Audio Cue
    let audioSFXPlayer = artifactElement.querySelector('.CLASS_Audio_Player')   
    audioSFXPlayer.setAttribute("circles-sound", {src: "#ID_Checking_Item_SFX", state: "stop"});         
    audioSFXPlayer.setAttribute("circles-sound", {type: "basic-diegetic", src: "#ID_Wrong_Item_SFX", volume: "0.2"});        
    audioSFXPlayer = artifactElement.appendChild(audioSFXPlayer);
    audioSFXPlayer.setAttribute("circles-sound", "state: play");
    // Update Text
    checkerTextEl.setAttribute("text","value:INCORRECT; color:red");
}