'use strict'

// Player Collider Physics------------------------------------------------------------
AFRAME.registerComponent('artifact-component', {

    init: function() {
        //must be const or the event listener later in the code won't be able to reference the variable
        const CONTEXT_AF = this;    //this refers to the component, not the element that the component is attached to
        
        CONTEXT_AF.el.addEventListener('model-loaded', function () {
            console.log("Added UI to Artifact");
            // Get artifactList[] data for relevant artifact
            let item = artifactList[artifactIDList[CONTEXT_AF.el.getAttribute('artifact_num') - 1]];
            
            // Get the artifact's bounding box
            let boundingBox = new THREE.Box3().setFromObject(CONTEXT_AF.el.object3D);
                    
            //===CREATE UI CODE===

            //Create ui object
            let objectUI = document.createElement('a-entity');

            objectUI.setAttribute('id', "ID_" + item.artifact_id + "_UI");
            objectUI.setAttribute("floating-ui","");
            objectUI.setAttribute("position", "0 " + (boundingBox.max.y - 1) + " 0"); 
            objectUI.setAttribute("rotation", "0 90 0"); 

            //UI elements
            //Background
            let uiBG = document.createElement('a-entity');
            //uiBG.setAttribute("geometry", "primitive:box"); //TO DO: CHANGE THIS TO CUSTOM GLTF AND ADD IMAGES
            //uiBG.setAttribute("material","color:blue");
            uiBG.setAttribute("scale", "0.8 0.8 0.8");
            uiBG.setAttribute("rotation", "0 90 0");
            uiBG.setAttribute("gltf-model", "#ID_UI_Object_Info_Model");
            // guiBG.setAttribute("obj-model", "obj: #ID_UI_Object_Info_Model; mtl:#ID_UI_Object_Info_Mtl");
            // uiBG.setAttribute("shader", "flat" );


            //IMAGE
            let imgUI = document.createElement('a-entity');
            imgUI.setAttribute("geometry", "primitive:plane");
            imgUI.setAttribute("scale", "0.25 0.25 1");
            imgUI.setAttribute("material", "src:#ID_" + item.artifact_id + "_IMG; shader:flat; transparent:true;" );
            imgUI.setAttribute("position", "-0.225 0.3 0.01" );


            //===text===
            let uiTex_Title = document.createElement('a-entity');
            uiTex_Title.setAttribute("text", "value:" + item.name + 
            "; color:white; font:"+ font +"; width:0.7; anchor:left; baseline:top; wrapCount:22;"); //TO DO: CHANGE TEXT DEPENDING ON ROLES
            uiTex_Title.setAttribute("position", "-0.36 0.53 0.01");

            let uiTex_Desc = document.createElement('a-entity');
            uiTex_Desc.setAttribute("text", "value:" + item.description + 
            "; color:rgb(0, 251, 255); font:"+ font +"; width:0.4; anchor:left; baseline:top; wrapCount:22;"); //TO DO: CHANGE TEXT DEPENDING ON ROLES
            uiTex_Desc.setAttribute("position", "-0.07 0.43 0.01");

            let uiTex_Check = document.createElement('a-entity');
            uiTex_Check.setAttribute("text", "value:; color:white; font:"+ font +"; width:0.4; anchor:left; baseline:top; wrapCount:11;"); //TO DO: CHANGE TEXT DEPENDING ON ROLES
            uiTex_Check.setAttribute("position", "-0.07 0.12 0.01");

            //append all elemetns

            //Append check text first since child index matters
            uiTex_Check = objectUI.appendChild(uiTex_Check);

            //append geometry elements
            uiBG = objectUI.appendChild(uiBG);
            imgUI = objectUI.appendChild(imgUI);
            
            //stop model loading event from bubbling up and causing an infinite loop
            uiBG.addEventListener('model-loaded', function (e) { 
                e.stopPropagation();
            });
            
            //Append remaining text
            uiTex_Title = objectUI.appendChild(uiTex_Title);
            uiTex_Desc = objectUI.appendChild(uiTex_Desc);

            //create game UI

            //Create ui object
            let gameUI = document.createElement('a-entity');

            gameUI.setAttribute('id', "ID_" + item.artifact_id + "_Game_UI");
            gameUI.setAttribute("floating-ui","");
            gameUI.setAttribute("position", "0.5 -0.05 0"); 
            gameUI.setAttribute("rotation", "0 90 0");

            //Game element bg
            let guiBG = document.createElement('a-entity');
            //uiGameBG.setAttribute("geometry", "primitive:box"); //TO DO: CHANGE THIS TO CUSTOM GLTF AND ADD IMAGES
            //uiGameBG.setAttribute("material","color:blue");
            guiBG.setAttribute("scale", "0.7 0.7 0.7");
            guiBG.setAttribute("rotation", "0 90 0");
            guiBG.setAttribute("gltf-model", "#ID_UI_Game_Info_Model");
            // guiBG.setAttribute("obj-model", "obj: #ID_UI_Game_Info_Model; mtl:#ID_UI_Game_Info_Mtl");
            // uiGameBG.setAttribute("shader", "flat" );

            //append game ui sub-objects
            guiBG = gameUI.appendChild(guiBG);

            //stop model loading event from bubbling up and causing an infinite loop
            guiBG.addEventListener('model-loaded', function (e) { 
                e.stopPropagation();
            });
            
            //Append ui to the artifact
            CONTEXT_AF.el.appendChild(objectUI);    
            CONTEXT_AF.el.appendChild(gameUI);    

            //===CREATE UI CODE END===
        });
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