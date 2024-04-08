'use strict'

// item drop location manager------------------------------------------------------------
AFRAME.registerComponent('item-pickup-drop-manager', {

schema: {
        item: {type: "string", default: ""},
    },

    init: function() {
        //must be const or the event listener later in the code won't be able to reference the variable
        const CONTEXT_AF = this;                                                        //this refers to the component, not the element that the component is attached to
                
        
    },

    tick: function(time, timeDelta) {
        const CONTEXT_AF = this;                                                    //this refers to the component, not the element that the component is attached to
        
        //if the value stored for the item is different than the currently held item
        if(CONTEXT_AF.item != CIRCLES.getPickedUpElement())
        {
            //define variable for event
            var itemPickupDropEvent;

            //On pickup
            if(CIRCLES.getPickedUpElement())
            {
                //play sounds
                document.querySelector("#pickupSFXPlayer").setAttribute("circles-sound", {state: "play"});
                document.querySelector("#heldSFXPlayer").setAttribute("circles-sound", {state: "play"});
                document.querySelector("#dropSFXPlayer").setAttribute("circles-sound", {state: "stop"});

                //set up event
                itemPickupDropEvent = new CustomEvent("itemPickupDrop", {detail: {item: CIRCLES.getPickedUpElement(), pickedUp: true}})

            }
            else
            {
                //play sounds
                document.querySelector("#pickupSFXPlayer").setAttribute("circles-sound", {state: "stop"});
                document.querySelector("#heldSFXPlayer").setAttribute("circles-sound", {state: "stop"});
                document.querySelector("#dropSFXPlayer").setAttribute("circles-sound", {state: "play"});

                //set up event
                itemPickupDropEvent = new CustomEvent("itemPickupDrop", {detail: {item: CONTEXT_AF.item, pickedUp: false}})
            }

            //dispatch event to all necessary IDs
            document.querySelector("#ID_Artifact_Checker_1").dispatchEvent(itemPickupDropEvent); //TO DO: (maybe make this networked)
            // document.querySelector("#ID_Artifact_Checker_2").dispatchEvent(itemPickupDropEvent); //TO DO: (maybe make this networked)
            // document.querySelector("#ID_Artifact_Checker_3").dispatchEvent(itemPickupDropEvent); //TO DO: (maybe make this networked)

            //update stored item
            CONTEXT_AF.item = CIRCLES.getPickedUpElement();

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