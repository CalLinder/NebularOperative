'use strict'

// Global Vars
const numPlayersToStart  = 2;
let gameStarted = false;
const Role_Year = 'Year Expert';
const Role_Country = 'Country Expert';
const Role_Manufacturer = 'Manufacturer Expert';
let playerRoles = [];

// Custom Events
const CustomEvent_HostCreatedUI = new CustomEvent('host_ui_created_event');
const CustomEvent_NonHostSubmittedArtifact = new CustomEvent('non_host_submitted_artifact_event');
const CustomEvent_CheckingArtifact = new CustomEvent('checking_artifact_event');
const CustomEvent_CorrectArtifact = new CustomEvent('correct_artifact_event');
const CustomEvent_IncorrectArtifact = new CustomEvent('incorrect_artifact_event');
const CustomEvent_AssignRoles = new CustomEvent('assign_roles_event');
const CustomEvent_StartIntro = new CustomEvent('start_intro_event');

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
                CONTEXT_AF.el.setAttribute('playerNumber', '1');
            } else {
                console.log('isHost set to false');  //Debug statement
                CONTEXT_AF.el.setAttribute('isHost', 'false');
                CONTEXT_AF.el.setAttribute('playerNumber', CIRCLES.getNAFAvatarElements().length);
                console.log('Your playerNumber is: ' + CIRCLES.getNAFAvatarElements().length);  //Debug statement
            }
        }, 2000);

        // Network Stuff

        // Initial setup
        CONTEXT_AF.socket = null;
        CONTEXT_AF.connected = false;
        CONTEXT_AF.createUIEventName = "createUI_event";                //must be same name as in artifact-component.js
        CONTEXT_AF.nonHostSubmitEventName = "nonHostSubmit_event";      //must be same name as in item-checker.js
        CONTEXT_AF.checkingEventName = "checking_event";                //must be same name as in item-checker.js
        CONTEXT_AF.correctEventName = "correct_event";                  //must be same name as in item-checker.js
        CONTEXT_AF.incorrectEventName = "incorrect_event";              //must be same name as in item-checker.js
        CONTEXT_AF.assignRolesName = "roles_event";                     //must be same name as in game-manager.js
        CONTEXT_AF.startIntroName = "intro_event";                      //must be same name as in game-manager.js

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

            // Listen for assign_roles_event from non-host players
            CONTEXT_AF.socket.on(CONTEXT_AF.assignRolesName, function(data) {
                console.log('Received assign_roles_event emit');
                assignRole(data.roles);    //function found in game-manager.js
            });

            // Listen for start_intro_event from non-host players
            CONTEXT_AF.socket.on(CONTEXT_AF.startIntroName, function(data) {
                console.log('Received start_intro_event emit');
                startIntro();    //function found in game-manager.js
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

            CONTEXT_AF.el.addEventListener('assign_roles_event', (event) => {
                console.log('Sending assign_roles_event emit'); //debug statement
                //assign_roles_event is dispatched in game-manager.js
                CONTEXT_AF.socket.emit(CONTEXT_AF.assignRolesName, {room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName(), roles: playerRoles});
            });

            CONTEXT_AF.el.addEventListener('start_intro_event', (event) => {
                console.log('Sending start_intro_event emit'); //debug statement
                //start_intro_event is dispatched in game-manager.js
                CONTEXT_AF.socket.emit(CONTEXT_AF.startIntroName, {room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName()});
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
        
        // check if game is ready to start
        if (gameStarted == false && document.querySelector('#ID_Game_Manager').getAttribute('isHost') == 'true') {
            if (CIRCLES.getNAFAvatarElements().length == numPlayersToStart) {
                console.log('Game Starting');   //debug statement
                gameStarted = true;
                setTimeout(function() {
                    // play intro
                    document.querySelector('#ID_Game_Manager').dispatchEvent(CustomEvent_StartIntro);
                    startIntro();
                    //timeout until intro is over
                    setTimeout(function() {
                        // assign roles
                        generateRoles();
                        assignRole(playerRoles);
                        // spawn artifacts
                        setupArtifacts();
                        // start timer
                        console.log('Game Started');   //debug statement
                    }, 42000);
                }, 3000); 
            }
            else {
                console.log('Not Enough Players To Start Game');    //debug statement
            }
        }
        
        
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

function generateRoles() {
    // document.querySelector('#ID_Game_Manager').getAttribute('playerNumber');
    
    let switchIndex = Math.floor((Math.random() * 6) + 1);
    
    switch(switchIndex) {
        case 1:
            playerRoles[0] = Role_Year;
            playerRoles[1] = Role_Country;
            playerRoles[2] = Role_Manufacturer;
            break;
        case 2:
            playerRoles[0] = Role_Year;
            playerRoles[2] = Role_Country;
            playerRoles[1] = Role_Manufacturer;
            break;
        case 3:
            playerRoles[1] = Role_Year;
            playerRoles[0] = Role_Country;
            playerRoles[2] = Role_Manufacturer;
            break;
        case 4:
            playerRoles[1] = Role_Year;
            playerRoles[2] = Role_Country;
            playerRoles[0] = Role_Manufacturer;
            break;
        case 5:
            playerRoles[2] = Role_Year;
            playerRoles[0] = Role_Country;
            playerRoles[1] = Role_Manufacturer;
            break;
        case 6:
            playerRoles[2] = Role_Year;
            playerRoles[1] = Role_Country;
            playerRoles[0] = Role_Manufacturer;
            break;
    }
    
    document.querySelector('#ID_Game_Manager').dispatchEvent(CustomEvent_AssignRoles);
}

function assignRole(roles) {
    //host gets roles[0], playerNumber = 2 gets roles[1], etc

    if (document.querySelector('#ID_Game_Manager').getAttribute('playerNumber') == '1') {
        document.querySelector('#ID_Game_Manager').setAttribute('playerRole', roles[0]);
        console.log('Your Role is: ' + roles[0]);   //debug statement
    }
    if (document.querySelector('#ID_Game_Manager').getAttribute('playerNumber') == '2') {
        document.querySelector('#ID_Game_Manager').setAttribute('playerRole', roles[1]);
        console.log('Your Role is: ' + roles[1]);   //debug statement
    }
    if (document.querySelector('#ID_Game_Manager').getAttribute('playerNumber') == '3') {
        document.querySelector('#ID_Game_Manager').setAttribute('playerRole', roles[2]);
        console.log('Your Role is: ' + roles[2]);   //debug statement
    }
}

function startIntro() {
    // intro stuff here
    console.log('Intro Started');   //debug statement
    let audioSFXPlayer = document.querySelector('#introSFXPlayer');
    audioSFXPlayer.setAttribute("circles-sound", "state: play");
    //timeout until intro is over
    setTimeout(function() {
        // update text on screens to match goals
        document.querySelector('#ID_Screen_1').setAttribute("setupRoundScreen", 'true');
        document.querySelector('#ID_Screen_2').setAttribute("setupRoundScreen", 'true');
    }, 42000);
}