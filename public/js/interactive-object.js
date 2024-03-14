'use strict'

// Player Collider Physics------------------------------------------------------------
AFRAME.registerComponent('interactive-object', {

    init: function() {
        //must be const or the event listener later in the code won't be able to reference the variable
        const CONTEXT_AF = this;                                                        //this refers to the component, not the element that the component is attached to
        CONTEXT_AF.el.setAttribute('isHeld', 'false');                                  //determines if current element is held or not
        
        //this.el (CONTEXT_AF.el) refers to the element that this component is attached to
        CONTEXT_AF.el.addEventListener('click', function() {
            CONTEXT_AF.intObjsParentElement = document.querySelector('#int_objs_parent');   //queary the parent element that will contain all non-held int_obj elements
            if (CONTEXT_AF.el.getAttribute("isHeld") === 'true') {          //if object is already held, drop
                console.log("This object is being dropped");                //debug message
                CONTEXT_AF.el.setAttribute('isHeld', 'false');              //update isHeld attribute to false
                
                CONTEXT_AF.el.setAttribute('ammo-body', {activationState: 'active'});
                CONTEXT_AF.el.setAttribute('ammo-body', {type: 'dynamic'}); //set physics type to dynamic (allowing gravity to affect it)
            }
            else {
                console.log("This object is not already held");
                //check if an object is already held
                let handEmpty = true;
                for (let i = 1; i <= Number(document.querySelector("#int_obj_spawner_button").getAttribute("objNumber")); i++) {
                    let objCheck = document.querySelector('#int_obj_' + String(i));
                    if (objCheck === null) {
                        continue;
                    }
                    if (document.querySelector('#int_obj_' + String(i)).getAttribute('isHeld') === 'true') {    //go through all int_objs in scene and check if any are already being held
                        console.log("Another object is already being held.")
                        handEmpty = false;                                                                      //if so, set handEmpty to false
                    }
                }
                //if no objects are currently being held, hold this object
                if (handEmpty === true) {                                            //if no obj is already held, set the object clicked on to be held
                    console.log("This object is now held");
                    CONTEXT_AF.el.setAttribute('ammo-body', {type: 'kinematic'});    //set physics type to kinematic, otherwise the object cannot move relative to camera
                    CONTEXT_AF.el.setAttribute('ammo-body', {activationState: 'disableSimulation'});
                    CONTEXT_AF.el.setAttribute('isHeld', 'true');                    //update isHeld attribute to true
                }
            }
        });
    },

    tick: function(time, timeDelta) {
        const CONTEXT_AF = this;                                                    //this refers to the component, not the element that the component is attached to
        CONTEXT_AF.heldObjectRef = document.querySelector('#held_obj_ref');         //query the lement attached to the camera that will be used to represent the carried object
        CONTEXT_AF.realWorldPosition = new THREE.Vector3();                         //create a new vector in 000 world position that can be used to reference an objects relative position in worldspace
        CONTEXT_AF.cameraObject = document.querySelector('#camera_id');             //query the camera_id element and use CONTEXT_AF.cameraObject to reference it

        

        // check if object's isHeld attribute is set to true, if so, remove physics and place near camera relative to world space
        if (CONTEXT_AF.el.getAttribute('isHeld') === 'true') {
            CONTEXT_AF.el.setAttribute("rotation", CONTEXT_AF.cameraObject.getAttribute("rotation"));   //set object to rotate 000 relative to camera rotation
            // CONTEXT_AF.el.setAttribute("rotation", {x: CONTEXT_AF.cameraObject.object3D.rotation.x - 90, y: CONTEXT_AF.cameraObject.object3D.rotation.y, z: CONTEXT_AF.cameraObject.object3D.rotation.z } );   //set object to rotate 000 relative to camera rotation
            //set object position to the position to the #held_object_ref position in worldspace
            CONTEXT_AF.el.object3D.position.set(CONTEXT_AF.heldObjectRef.object3D.getWorldPosition(CONTEXT_AF.realWorldPosition).x, CONTEXT_AF.heldObjectRef.object3D.getWorldPosition(CONTEXT_AF.realWorldPosition).y, CONTEXT_AF.heldObjectRef.object3D.getWorldPosition(CONTEXT_AF.realWorldPosition).z);
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