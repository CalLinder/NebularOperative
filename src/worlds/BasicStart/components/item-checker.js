'use strict'

// item drop location manager------------------------------------------------------------
AFRAME.registerComponent('item-checker', {

schema: {
        item: {type: "string", default: null},
    },

    init: function() {
        //must be const or the event listener later in the code won't be able to reference the variable
        const CONTEXT_AF = this;                                                        //this refers to the component, not the element that the component is attached to

        CONTEXT_AF.el.addEventListener("itemPickupDrop", function(e) {
            //get item world position
            
            //every time an item is locally dropped
            if(!e.detail.pickedUp)
            {

                //If player is close enough to the checker
                if((CONTEXT_AF.el.object3D.position.distanceTo(document.querySelector('#Player1').object3D.position) <= 3)) //CHANGE THIS VALUE TO INCREASE DROP SNAP RADIUS
                {
                    if(CONTEXT_AF.item == null)
                    {
                        //get the vector going from the spawner to the checker
                        let vecSpawnToChecker = new THREE.Vector3().copy(CONTEXT_AF.el.object3D.position).sub(e.detail.item.parentNode.object3D.position);

                        //have the object be placed on the checker instead of its spawn point
                        e.detail.item.setAttribute("position", + vecSpawnToChecker.x + " " + vecSpawnToChecker.y + " " + vecSpawnToChecker.z);

                        //update values
                        CONTEXT_AF.item = e.detail.item;
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

            console.log(CONTEXT_AF.item);
   
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