'use strict'

// Player Collider Physics------------------------------------------------------------
AFRAME.registerComponent('dumpster-interaction', {

    init: function() {
        //must be const or the event listener later in the code won't be able to reference the variable
        const CONTEXT_AF = this;                                                        //this refers to the component, not the element that the component is attached to
        CONTEXT_AF.intObjsParentElement = document.querySelector('#int_objs_parent');   //queary the parent element that will contain all non-held int_obj elements
        
        //this.el (CONTEXT_AF.el) refers to the element that this component is attached to
        CONTEXT_AF.el.addEventListener('click', function() {
            for (let i = 1; i <= Number(document.querySelector("#int_obj_spawner_button").getAttribute("objNumber")); i++) {
                //check if obj with iterator in ID exists, if it doesn't, skip iteration
                let objCheck = document.querySelector('#int_obj_' + String(i));
                if (objCheck === null) {
                    continue;
                }
                //delete object being held from DOM
                if (document.querySelector('#int_obj_' + String(i)).getAttribute('isHeld') === 'true') {    //go through all int_objs in scene and check if any are already being held
                    document.querySelector('#int_obj_' + String(i)).parentNode.removeChild(document.querySelector('#int_obj_' + String(i)));
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