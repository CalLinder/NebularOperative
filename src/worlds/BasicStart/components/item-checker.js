'use strict'

// item drop location manager------------------------------------------------------------
AFRAME.registerComponent('item-checker', {

schema: {
        item: {type: "string", default: null},
    },

    init: function() {
        //must be const or the event listener later in the code won't be able to reference the variable
        const CONTEXT_AF = this;    //this refers to the component, not the element that the component is attached to

        let audioSFXPlayer = document.createElement('a-entity');        
        audioSFXPlayer.setAttribute("circles-sound", {type: "basic-diegetic", src: "#ID_Checking_Item_SFX", volume: "0.2"});        
        audioSFXPlayer = CONTEXT_AF.el.appendChild(audioSFXPlayer);

        CONTEXT_AF.el.addEventListener("itemPickupDrop", function(e) {
            //set up audio players
            
            //every time an item is locally dropped
            if(!e.detail.pickedUp)
            {

                //If player is close enough to the checker
                if((CONTEXT_AF.el.object3D.position.distanceTo(document.querySelector('#Player1').object3D.position) <= 3)) //CHANGE THIS VALUE TO INCREASE DROP SNAP RADIUS
                {
                    //if no item is already placed
                    if(CONTEXT_AF.item == null)
                    {
                        //get the vector going from the spawner to the checker
                        let vecSpawnToChecker = new THREE.Vector3().copy(CONTEXT_AF.el.object3D.position).sub(e.detail.item.parentNode.object3D.position);

                        //have the object be placed on the checker instead of its spawn point
                        e.detail.item.setAttribute("position", + vecSpawnToChecker.x + " " + vecSpawnToChecker.y + " " + vecSpawnToChecker.z);

                        //update values
                        CONTEXT_AF.item = e.detail.item;

                        //initiate checking sequence
                        CONTEXT_AF.item.setAttribute("circles-interactive-object", "enabled: false");

                        // Pause for a beat
                        setTimeout(function() {

                            //Start checking
                            audioSFXPlayer.setAttribute("circles-sound", "state: play");

                            //Change UI background's colour for this object
                            CONTEXT_AF.item.childNodes[0].childNodes[0].setAttribute("text","value:CHECKING...; color:yellow");

                            //Checked
                            setTimeout(function() {

                                //Get item ID from element ID
                                let itemID = CONTEXT_AF.item.getAttribute("artifact_id").split("_")[1];

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
                                    CONTEXT_AF.item.childNodes[0].childNodes[0].setAttribute("text","value:CORRECT; color:green");


                                }
                                //if incorrect item
                                else
                                {  
                                    //Play sounds
                                    audioSFXPlayer.setAttribute("circles-sound", {src: "#ID_Wrong_Item_SFX", state: "stop"});
                                    audioSFXPlayer.setAttribute("circles-sound", "state: play");
                                    
                                    //update colour
                                    CONTEXT_AF.item.childNodes[0].childNodes[0].setAttribute("text","value:INCORRECT; color:red");
                                }

                                //wait a bit and reset
                                setTimeout(function() {
                                    audioSFXPlayer.setAttribute("circles-sound", {src: "#ID_Checking_Item_SFX", state: "stop"});
                                    CONTEXT_AF.item.setAttribute("circles-interactive-object", "enabled: true");
                                }, 1000);

                            }, 3103);

                        
                        }, 1000);
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