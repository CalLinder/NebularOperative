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
            //update stored item
            CONTEXT_AF.item = CIRCLES.getPickedUpElement();

            //dispatch event 
            const itemPickupDrop = new CustomEvent("itemPickupDrop", {detail: {item: CIRCLES.getPickedUpElement()}});
            CONTEXT_AF.el.dispatchEvent(itemPickupDrop); //TO DO: (maybe make this networked)

            //Play appropriate sounds

            //If holding an item currently, play pickup sound, loop hold sound, reset drop sound
            //else do the oposite
            if(CONTEXT_AF.item)
            {
                document.querySelector("#pickupSFXPlayer").setAttribute("circles-sound", {state: "play"});
                document.querySelector("#heldSFXPlayer").setAttribute("circles-sound", {state: "play"});
                document.querySelector("#dropSFXPlayer").setAttribute("circles-sound", {state: "stop"});

            }
            else
            {
                document.querySelector("#pickupSFXPlayer").setAttribute("circles-sound", {state: "stop"});
                document.querySelector("#heldSFXPlayer").setAttribute("circles-sound", {state: "stop"});
                document.querySelector("#dropSFXPlayer").setAttribute("circles-sound", {state: "play"});
            }

            //console.log(document.querySelector("#pickupSFXPlayer"));
        }

        //event listener call might look like this
        // CONTEXT_AF.el.addEventListener("itemPickedUp", function(e) {
        //     console.log(e.detail.item);  
        // });        
        
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