'use strict'

// Global Vars
const CustomEvent_HostCreatedUI = new CustomEvent('host_ui_created_event');

// Player Collider Physics------------------------------------------------------------
AFRAME.registerComponent('game-manager', {

    init: function() {
        //must be const or the event listener later in the code won't be able to reference the variable
        const CONTEXT_AF = this;    //this refers to the component, not the element that the component is attached to
        
        console.log('Game Manager Initiating'); //debug statement

        // Network Stuff

        // Initial setup
        CONTEXT_AF.socket = null;
        CONTEXT_AF.connected = false;
        CONTEXT_AF.createUIEventName = "createUI_event";    //must be same name as in artifact-component.js

        CONTEXT_AF.createNetworkingSystem = function () {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("Messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room: " + CIRCLES.getCirclesGroupName() + ' in world: ' + CIRCLES.getCirclesWorldName());
            
            // Receive Statements ---------------------------------------
            // Listen for createUI_event from host player
            CONTEXT_AF.socket.on(CONTEXT_AF.createUIEventName, function(data) {
                console.log('Received createUI_event emit');
                // TO DO: createUI non host function
                createNonHostUI();
            });

            // Emit Statements ------------------------------------------
            CONTEXT_AF.el.addEventListener('host_ui_created_event', (event) => {
                console.log('Sending createUI_event emit'); //debug statement
                //host_ui_created_event is dispatched in artifact-components.js
                CONTEXT_AF.socket.emit(CONTEXT_AF.createUIEventName, {room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName()});
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