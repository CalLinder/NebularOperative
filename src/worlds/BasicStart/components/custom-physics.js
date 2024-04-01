'use strict'

// Player Collider Physics------------------------------------------------------------
AFRAME.registerComponent('custom-physics', {

    init: function() {
        //must be const or the event listener later in the code won't be able to reference the variable
        const CONTEXT_AF = this;                                                        //this refers to the component, not the element that the component is attached to
                
    },

    tick: function(time, timeDelta) {
        const CONTEXT_AF = this;                                                    //this refers to the component, not the element that the component is attached to
        
        //check if object is held (CIRCLES-OBJECT-WORLD has a property called 'pickedup')
        //only the host (first person to connect to world) will be using the original object
        //other users will have an original element created when picking up the object
        //when the non-host drops the item, 
        //both of their object instances will have pickedup still set to true
        //the host has to drop the item for all users to have pickedup set to false
        if(CONTEXT_AF.el.getAttribute('circles-object-world').pickedup === true) {
            console.log('picked up');
            //TO DO:
            //emit call telling everyone in world that the object has been picked up 
            //and that the physics for the object should be turned off
            //CONTEXT_AF.el.removeAttribute('dynamic-body');
        } else {
            console.log('NOT picked up');
            //TO DO:
            //emit call telling everyone in world that the object has been dropped 
            //and that the physics for the object should be turned back on
            //CONTEXT_AF.el.setAttribute('dynamic-body', {shape: 'box'});
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