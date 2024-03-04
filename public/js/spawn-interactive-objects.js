//spinning-effect.js does not need to be named the same as the new component, but it is good practice, especially in group work environments

//this forces you to write javascript in the modern way or get errors
'use strict'

//always do this first when creating a new component
//json objects represent components, schema
AFRAME.registerComponent('spawn-interactive-objects', {

    init: function() {                      //Constructor
        
        const CONTEXT_AF = this;                                //this refers to the component, not the element that the component is attached to
        CONTEXT_AF.intObjsParentElement = document.querySelector('#int_objs_parent');   //queary the parent element that will contain all non-held int_obj elements
        
        //this.el (CONTEXT_AF.el) refers to the element that this component is attached to
        CONTEXT_AF.el.addEventListener('click', function() {

                // class="int_obj interactive_close"
                // id="int_obj_2"
                // interactive-object
                // position="2 2 -2"
                // gltf-model='#staff_model'
                // scale="1 1 1"
                // shadow="cast:true; receive:true;"
                // ammo-body="type: dynamic" 
                // ammo-shape="type: capsule; fit: manual; halfExtents: 0.25 0.5 0.25; offset: 0 0.35 0" 

            let newObject = document.createElement('a-entity');
            
            newObject.setAttribute("id", "int_obj_" + String(CONTEXT_AF.el.getAttribute("objNumber")));
            CONTEXT_AF.el.setAttribute("objNumber", Number(CONTEXT_AF.el.getAttribute("objNumber")) + 1);
            newObject.setAttribute("class", "int_obj interactive_medium");
            newObject.setAttribute("interactive-object", "");
            newObject.setAttribute("isHeld", "false");
            newObject.setAttribute("position", "0 10 -1");
            newObject.setAttribute("gltf-model", "assets/clockModel.glb");
            newObject.setAttribute("scale", "0.2 0.2 0.2");
            newObject.setAttribute("rotation", "-180 0 0");
            newObject.setAttribute("shadow", {cast:"true", receive:"true"});
            newObject.setAttribute("ammo-body", {type:"dynamic"});
            newObject.setAttribute("ammo-shape", {type: "box", fit: "manual", halfExtents: "0.25 0.25 0.25", offset: "0.2 0 0"})
            newObject.setAttribute("sound", {src: "#object_sound", on: "click", poolSize: 10});
            
            CONTEXT_AF.intObjsParentElement.appendChild(newObject);
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