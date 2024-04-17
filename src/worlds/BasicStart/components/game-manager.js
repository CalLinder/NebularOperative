'use strict'

// Global Vars
const CustomEvent_HostCreatedUI = new CustomEvent('host_ui_created_event');
const CustomEvent_NonHostSubmittedArtifact = new CustomEvent('non_host_submitted_artifact_event');
const CustomEvent_CheckingArtifact = new CustomEvent('checking_artifact_event');
const CustomEvent_CorrectArtifact = new CustomEvent('correct_artifact_event');
const CustomEvent_IncorrectArtifact = new CustomEvent('incorrect_artifact_event');

// NOTE: this array of networked artifact clone elements is required because for some unknown fucking reason, there are random periods of time where the element cannot be found in the document. I tried MANY different solutions... This is literally the only one that works without major reworks to how item-checking works.
let networkedArtifactElementList = [];  // this array will contain all the elements for networked artifacts for the non-host players

// Game Manager Component ------------------------------------------------------------
AFRAME.registerComponent('game-manager', {

    init: function() {
        //must be const or the event listener later in the code won't be able to reference the variable
        const CONTEXT_AF = this;    //this refers to the component, not the element that the component is attached to
        
        console.log('Game Manager Initiating'); //debug statement

        // Game Setup Stuff
        console.log('setupGame() running');    //Debug message

        // Delay by 2 seconds, otherwise it will run before server can update number of NAF Avatars in world
        setTimeout(function() {
            // Only update UI if not first person on server
            if (CIRCLES.getNAFAvatarElements().length == 1) {
                console.log('isHost set to true');  //Debug statement
                CONTEXT_AF.el.setAttribute('isHost', 'true');
            } else {
                console.log('isHost set to false');  //Debug statement
                CONTEXT_AF.el.setAttribute('isHost', 'false');
            }
        }, 2000);

        // TO DO: Replace the button with a check for three players. When there are three players, start game.
        // this check should be in the game-manager component's tick() function

        //set button to spawn new artifact on press
        let testButtonEl = document.querySelector('#test_button');     //get button element
        testButtonEl.addEventListener('click', function() {            //add event listener for on click
            setupArtifacts();
        });

        // Network Stuff

        // Initial setup
        CONTEXT_AF.socket = null;
        CONTEXT_AF.connected = false;
        CONTEXT_AF.createUIEventName = "createUI_event";                //must be same name as in artifact-component.js
        CONTEXT_AF.nonHostSubmitEventName = "nonHostSubmit_event";      //must be same name as in item-checker.js
        CONTEXT_AF.checkingEventName = "checking_event";                //must be same name as in item-checker.js
        CONTEXT_AF.correctEventName = "correct_event";                  //must be same name as in item-checker.js
        CONTEXT_AF.incorrectEventName = "incorrect_event";              //must be same name as in item-checker.js

        CONTEXT_AF.createNetworkingSystem = function () {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("Messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room: " + CIRCLES.getCirclesGroupName() + ' in world: ' + CIRCLES.getCirclesWorldName());
            
            // Receive Statements ---------------------------------------
            // Listen for host_ui_created_event from host player
            CONTEXT_AF.socket.on(CONTEXT_AF.createUIEventName, function(data) {
                console.log('Received createUI_event emit');    //debug statement
                createNonHostUI();  //function found in artifact-component.js
            });
            
            // Listen for non_host_submitted_artifact_event from non-host players
            CONTEXT_AF.socket.on(CONTEXT_AF.nonHostSubmitEventName, function(data) {
                console.log('Received nonHostSubmit_event emit');   //debug statement
                console.log('ID of artifact received: ' + data.artifactID);
                submitNonHostArtifact(data.artifactID);    //function found in item-checker.js
            });

            // Listen for checking_artifact_event from non-host players
            CONTEXT_AF.socket.on(CONTEXT_AF.checkingEventName, function(data) {
                console.log('Received checking_event emit');
                checkingArtifact(data.artifactModelPath);    //function found in item-checker.js
            });

            // Listen for correct_artifact_event from non-host players
            CONTEXT_AF.socket.on(CONTEXT_AF.correctEventName, function(data) {
                console.log('Received correct_artifact_event emit');
                correctArtifact(data.artifactModelPath);    //function found in item-checker.js
            });

            // Listen for incorrect_artifact_event from non-host players
            CONTEXT_AF.socket.on(CONTEXT_AF.incorrectEventName, function(data) {
                console.log('Received incorrect_artifact_event emit');
                incorrectArtifact(data.artifactModelPath);    //function found in item-checker.js
            });

            // Emit Statements ------------------------------------------
            CONTEXT_AF.el.addEventListener('host_ui_created_event', (event) => {
                console.log('Sending createUI_event emit'); //debug statement
                //host_ui_created_event is dispatched in artifact-components.js
                CONTEXT_AF.socket.emit(CONTEXT_AF.createUIEventName, {room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName()});
            });

            CONTEXT_AF.el.addEventListener('non_host_submitted_artifact_event', (event) => {
                console.log('Sending nonHostSubmit_event emit'); //debug statement
                //nonHostSubmit_event is dispatched in artifact-checker.js
                CONTEXT_AF.socket.emit(CONTEXT_AF.nonHostSubmitEventName, {room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName(), artifactID: Global_Submitted_Artifact_Id});
            });

            CONTEXT_AF.el.addEventListener('checking_artifact_event', (event) => {
                console.log('Sending checking_event emit'); //debug statement
                //checking_event is dispatched in artifact-checker.js
                CONTEXT_AF.socket.emit(CONTEXT_AF.checkingEventName, {room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName(), artifactModelPath: artifactList[Global_Submitted_Artifact_Id].model_path});
            });

            CONTEXT_AF.el.addEventListener('correct_artifact_event', (event) => {
                console.log('Sending correct_event emit'); //debug statement
                //correct_event is dispatched in artifact-checker.js
                CONTEXT_AF.socket.emit(CONTEXT_AF.correctEventName, {room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName(), artifactModelPath: artifactList[Global_Submitted_Artifact_Id].model_path});
            });

            CONTEXT_AF.el.addEventListener('incorrect_artifact_event', (event) => {
                console.log('Sending incorrect_event emit'); //debug statement
                //incorrect_event is dispatched in artifact-checker.js
                CONTEXT_AF.socket.emit(CONTEXT_AF.incorrectEventName, {room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName(), artifactModelPath: artifactList[Global_Submitted_Artifact_Id].model_path});
            });

        };
  
        if (CIRCLES.isCirclesWebsocketReady()) {
            CONTEXT_AF.createNetworkingSystem();
        } 
        else {
            const wsReadyFunc = function() {
                CONTEXT_AF.createNetworkingSystem();
                CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
            };
            CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
        }
    },

    tick: function(time, timeDelta) {
        const CONTEXT_AF = this;    //this refers to the component, not the element that the component is attached to
        
        
        
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