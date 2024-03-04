'use strict'

// Player Collider Physics------------------------------------------------------------
AFRAME.registerComponent('teleport-player', {

    init: function() {
        //must be const or the event listener later in the code won't be able to reference the variable
        const CONTEXT_AF = this;                                            //this refers to the component, not the element that the component is attached to
        CONTEXT_AF.cameraObject = document.querySelector('#camera_id');     //query the camera_id element and use CONTEXT_AF.cameraObject to reference it
        
        CONTEXT_AF.realWorldPosition = new THREE.Vector3();                 //create a new vector in 000 world position that can be used to reference an objects relative position in worldspace

        //this.el (CONTEXT_AF.el) refers to the element that this component is attached to
        //when object is clicked on, teleport player to the objects position in world space
        CONTEXT_AF.el.addEventListener('click', function() {
            CONTEXT_AF.cameraObject.object3D.position.set(CONTEXT_AF.el.object3D.getWorldPosition(CONTEXT_AF.realWorldPosition).x, CONTEXT_AF.cameraObject.object3D.position.y, CONTEXT_AF.el.object3D.getWorldPosition(CONTEXT_AF.realWorldPosition).z);
        });
    },

    //other possible functions
    //update:function() {oldData},            //IS NOT OF's update ... only called when a property in the schema changes
    //tick:function() {time, timeDelta},      //Is called every update
    //tock:function() {time, timeDelta},      //Is called immediately after tick
    //remove:function() {},                   //Deconstructor
    //pause:function() {},                    //Web pauses, this happens when you go to another tab
    //play:function() {},                     //Web plays, this happens when you return to the tab
    //updateSchema:function() {data},         //

});