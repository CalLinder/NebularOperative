'use strict'

// Global Vars
const numArtifacts = 3; // Ensure there are enough ID_Artifact_Entity_[insert number]'s in scene to match numArtifacts
const font = "dejavu";
//ui fade length (ms)
const fade = 200;

// Test Values | Goal is 'OpticalLens' and therefore it MUST spawn in the round
const challengeYear = '1943';
const challengeCountry = 'ENGLAND';
const challengeManufacturer = 'NATIONAL PHYSICAL LABORATORIES';
// TO DO: Instead of challenge year, country, manufacturer, etc, it should be a range or clue (i.e., 1940-1950, continent, national manufacturer, etc)

// Artifact Lists/Arrays/Objects
const artifactList = {};    // This object will contain all artifact data (id, year, country, manufacturer, model ID)
let artifactIDList = [];    // This array will contain a list of ID's for all artifacts that will be spawned into the scene

// Add Artifact Data to artifactList Object Index
artifactList['Clock'] = {
    artifact_id: 'Clock',
    year: '1912',
    country: 'UNKNOWN',
    manufacturer: 'Waltham Watch Co.',
    model_id: '#ID_Clock_Model',
    image_id: '#ID_Clock_IMG',
    model_path: '/worlds/BasicStart/assets/models/artifacts/Clock.glb',
    name: 'AUTOMOTIVE CLOCK',
    description: 'A BRASS OBJECT WITH A GLASS FACE. USED AS A AUTOMOTIVE PART',
    number: '716'


};
artifactList['DiskDrive'] = {
    artifact_id: 'DiskDrive',
    year: '1969',
    country: 'ENGLAND',
    manufacturer: 'International Computers Ltd',
    model_id: '#ID_DiskDrive_Model',
    image_id: '#ID_DiskDrive_IMG',
    model_path: '/worlds/BasicStart/assets/models/artifacts/DiskDrive.glb',
    name: 'CONTROLLER, DISK DRIVE',
    description: 'THE CONTROL UNIT FOR THE DISK DRIVES USED AS AUXILIARY STORAGE DEVICES FOR LARGE QUANTITY AND/OR LONG TERM STORAGE',
    number: '734'
};
artifactList['Fridge'] = {
    artifact_id: 'Fridge',
    year: '1953',
    country: 'UNITED STATES OF AMERICA',
    manufacturer: 'International Harvester Co.',
    model_id: '#ID_Fridge_Model',
    image_id: '#ID_Fridge_IMG',
    model_path: '/worlds/BasicStart/assets/models/artifacts/Fridge.glb',
    name: 'ELECTRIC REFRIGERATOR',
    description: 'THE MANUFACTUER OF THE REFRIGERATORS DESIGNED THE PRODUCT TO MEET TECHNOLOGICAL, BUT ALSO FASHION REQUIREMENTS OF A MODERN HOUSEWIFE.',
    number: '715'
};
artifactList['OpticalLens'] = {
    artifact_id: 'OpticalLens',
    year: '1943',
    country: 'ENGLAND',
    manufacturer: 'NATIONAL PHYSICAL LABORATORIES',
    model_id: '#ID_OpticalLens_Model',
    image_id: '#ID_OpticalLens_IMG',
    model_path: '/worlds/BasicStart/assets/models/artifacts/OpticalLens.glb',
    name: 'FLAT, OPTICAL',
    description: 'USED IN PAIRS IN CONJUNCTION WITH A MONOCHROMATIC LIGHT SOURCE TO TEST THE FLATNESS OF A THIRD SURFACE',
    number: '351'
};
artifactList['Radio'] = {
    artifact_id: 'Radio',
    year: '1948',
    country: 'CANADA',
    manufacturer: 'Measurement Engineering Ltd',
    model_id: '#ID_Radio_Model',
    image_id: '#ID_Radio_IMG',
    model_path: '/worlds/BasicStart/assets/models/artifacts/Radio.glb',
    name: 'RECEIVER, RADIO',
    description: 'TO RECEIVE, DEMODULATE & AMPLIFY AM AND SHORT WAVE (2 BANDS) STANDARD BROADCAST SIGNALS',
    number: '845'
};
artifactList['Syringe'] = {
    artifact_id: 'Syringe',
    year: 'Unknown',
    country: 'ENGLAND',
    manufacturer: 'Down',
    model_id: '#ID_Syringe_Model',
    image_id: '#ID_Syringe_IMG',
    model_path: '/worlds/BasicStart/assets/models/artifacts/Syringe.glb',
    name: 'SYRINGE, IRRIGATION',
    description: 'USED TO FLUSH EAR CANAL WITH WARM OIL & SALINE SOLUTION TO ORDER REMOVE WAX AND OTHER DEBRIS.',
    number: '251'
};

// ID Naming Schemes:
// Arifact Spawners: ID_Artifact_Spawner_[insert number]

// NOTE: Assume setupArtifacts can only be run by the host player
// setupArtifacts Function - Generates numArtifacts artifacts, with one using the challenge values set above and the rest randomly
function setupArtifacts() {
    console.log('setupArtifacts() running');    //Debug message

    //determine challenge process should be here or even better it would be networked
    
    //set artifactIDList[0] to be the target artifact ID
    artifactIDList.push(returnArtifactsByAll(challengeYear, challengeCountry, challengeManufacturer));

    //TO DO: fill remaining number of artifact slots with random, but similar, artifacts (i.e., same year, country, or manufacturer)

    //if there are still empty artifact slots, fill them with truely random artifacts
    if (artifactIDList.length < numArtifacts) { //artifactIDList.length should be min 1
        for (let i = artifactIDList.length; i < numArtifacts; i++) {
            artifactIDList.push(returnRandomArtifactID());
        }
    }

    //spawnArtifacts() updates the ID_Artifact_Entity_[iterator] entities in a-scene to use the gltf-model and attributes of the respective artifactIDList[iterator] artifact
    spawnArtifacts();
    // TO DO: emit an event that tells other players to add UI to their artifacts
    // that emit may not be here, probably better to be in the game manager. Still looking for a way to get attributes and components transfered to the clones for networked objects
}

// Update ID_Artifact_Entity_[insert number] entities in the scene using an array of artifact ID's
function spawnArtifacts() {
    // Example artifact entity in scene:
    // <a-entity
    //   id="ID_Artifact_Entity_1"
    //   position="-9 1 -2"
    //   rotation="0 0 0"
    //   scale="1 1 1"
    //   gltf-model=""
    //   circles-pickup-networked
    //   circles-pickup-object="pickupScale:1 1 1; pickupRotation:0 -190 0; pickupPosition:0 0 0; dropScale: 1 1 1; dropRotation: 0 0 0; dropPosition: -9 1 -2"
    // ></a-entity>

    // Loop through for each artifact that needs to be spawned
    for (let i = 1; i <= numArtifacts; i++) {

        let item = artifactList[artifactIDList[i-1]];

        // Select ID_Artifact_Entity_[i] a-entity element in scene
        let artifactEl = document.querySelector("#ID_Artifact_Entity_" + i)
            
        artifactEl.setAttribute('artifact_id', "ID_" + item.artifact_id);
        artifactEl.setAttribute('artifact_num', i);
        artifactEl.setAttribute("gltf-model", item.model_path);
        
        //TEMP ITEM PICKUP SFX IMPLEMENTATION - WE CAN FALL BACK TO THIS IF NEEDED  
        //artifactEl.setAttribute("circles-interactive-object", "click_sound:#ID_Item_Pickup_SFX");
    }
}

// Update artifact entities in scene to add UI, use artifact_num to select and artifact_id atribute to determine data from artifactList[]
// function spawnArtifactUI() {
//     // Loop through for each artifact that needs to be updated
//     for (let i = 1; i <= numArtifacts; i++) {

//         let item = artifactList[artifactIDList[i-1]];

//         // Select ID_Artifact_Entity_[i] a-entity element in scene
//         let artifactEl = document.querySelectorAll('[artifact_num="' + i + '"]');
//         console.log("DEBUG: " + artifactEl.getAttribute(id));

//         // ADEL UI STUFF -------------------------------------------------------------------------------
//         //create an event listner applied to all models to create their UI elements when the models are loaded
//         artifactEl.addEventListener('model-loaded', function () {
//             // Get the artifact's bounding box
//             let boundingBox = new THREE.Box3().setFromObject(artifactEl.object3D);
                    
//             //===CREATE UI CODE===

//             //Create ui object
//             let objectUI = document.createElement('a-entity');

//             objectUI.setAttribute('id', "ID_" + item.artifact_id + "_UI");
//             objectUI.setAttribute("floating-ui","");
//             objectUI.setAttribute("position", "0 " + (boundingBox.max.y - 1) + " 0"); 
//             objectUI.setAttribute("rotation", "0 90 0"); 

//             //UI elements
//             //Background
//             let uiBG = document.createElement('a-entity');
//             //uiBG.setAttribute("geometry", "primitive:box"); //TO DO: CHANGE THIS TO CUSTOM GLTF AND ADD IMAGES
//             //uiBG.setAttribute("material","color:blue");
//             uiBG.setAttribute("scale", "0.8 0.8 0.8");
//             uiBG.setAttribute("rotation", "0 90 0");
//             uiBG.setAttribute("gltf-model", "#ID_UI_Object_Info_Model");
//             // guiBG.setAttribute("obj-model", "obj: #ID_UI_Object_Info_Model; mtl:#ID_UI_Object_Info_Mtl");
//             // uiBG.setAttribute("shader", "flat" );


//             //IMAGE
//             let imgUI = document.createElement('a-entity');
//             imgUI.setAttribute("geometry", "primitive:plane");
//             imgUI.setAttribute("scale", "0.25 0.25 1");
//             imgUI.setAttribute("material", "src:#ID_" + item.artifact_id + "_IMG; shader:flat; transparent:true;" );
//             imgUI.setAttribute("position", "-0.225 0.3 0.01" );


//             //===text===
//             let uiTex_Title = document.createElement('a-entity');
//             uiTex_Title.setAttribute("text", "value:" + item.name + 
//             "; color:white; font:"+ font +"; width:0.7; anchor:left; baseline:top; wrapCount:22;"); //TO DO: CHANGE TEXT DEPENDING ON ROLES
//             uiTex_Title.setAttribute("position", "-0.36 0.53 0.01");

//             let uiTex_Desc = document.createElement('a-entity');
//             uiTex_Desc.setAttribute("text", "value:" + item.description + 
//             "; color:rgb(0, 251, 255); font:"+ font +"; width:0.4; anchor:left; baseline:top; wrapCount:22;"); //TO DO: CHANGE TEXT DEPENDING ON ROLES
//             uiTex_Desc.setAttribute("position", "-0.07 0.43 0.01");

//             let uiTex_Check = document.createElement('a-entity');
//             uiTex_Check.setAttribute("text", "value:; color:white; font:"+ font +"; width:0.4; anchor:left; baseline:top; wrapCount:11;"); //TO DO: CHANGE TEXT DEPENDING ON ROLES
//             uiTex_Check.setAttribute("position", "-0.07 0.12 0.01");

//             //append all elemetns

//             //Append check text first since child index matters
//             uiTex_Check = objectUI.appendChild(uiTex_Check);

//             //append geometry elements
//             uiBG = objectUI.appendChild(uiBG);
//             imgUI = objectUI.appendChild(imgUI);
            
//             //stop model loading event from bubbling up and causing an infinite loop
//             uiBG.addEventListener('model-loaded', function (e) { 
//                 e.stopPropagation();
//             });
            
//             //Append remaining text
//             uiTex_Title = objectUI.appendChild(uiTex_Title);
//             uiTex_Desc = objectUI.appendChild(uiTex_Desc);

//             //create game UI

//             //Create ui object
//             let gameUI = document.createElement('a-entity');

//             gameUI.setAttribute('id', "ID_" + item.artifact_id + "_Game_UI");
//             gameUI.setAttribute("floating-ui","");
//             gameUI.setAttribute("position", "0.5 -0.05 0"); 
//             gameUI.setAttribute("rotation", "0 90 0");

//             //Game element bg
//             let guiBG = document.createElement('a-entity');
//             //uiGameBG.setAttribute("geometry", "primitive:box"); //TO DO: CHANGE THIS TO CUSTOM GLTF AND ADD IMAGES
//             //uiGameBG.setAttribute("material","color:blue");
//             guiBG.setAttribute("scale", "0.7 0.7 0.7");
//             guiBG.setAttribute("rotation", "0 90 0");
//             guiBG.setAttribute("gltf-model", "#ID_UI_Game_Info_Model");
//             // guiBG.setAttribute("obj-model", "obj: #ID_UI_Game_Info_Model; mtl:#ID_UI_Game_Info_Mtl");
//             // uiGameBG.setAttribute("shader", "flat" );

//             //append game ui sub-objects
//             guiBG = gameUI.appendChild(guiBG);

//             //stop model loading event from bubbling up and causing an infinite loop
//             guiBG.addEventListener('model-loaded', function (e) { 
//                 e.stopPropagation();
//             });
            
//             //Append ui to the artifact
//             artifactEl.appendChild(objectUI);    
//             artifactEl.appendChild(gameUI);    

//             //===CREATE UI CODE END===
//         });
//     }
// }

// Returns the ID of the artifact with all of the target aspects (there should only be 1)
function returnArtifactsByAll(targetYear, targetCountry, targetManufacturer) {
    let matchingYear = returnArtifactsByYear(targetYear);
    let matchingCountry = returnArtifactsByCountry(targetCountry);
    let matchingManufacturer = returnArtifactsByManufacturer(targetManufacturer);

    // Loop through matchingYear array
    for (let i = 0; i < matchingYear.length; i++) {
        // Loop through matchingCountry array
        for (let j = 0; j < matchingCountry.length; j++) {
            // If there is a matching ID
            if (matchingYear[i] === matchingCountry[j]) {
                // Loop through matchingManufacturer array
                for (let k = 0; k < matchingManufacturer.length; k++) {
                    // If there is a matching ID
                    if (matchingYear[i] === matchingManufacturer[k]) {
                        // Return ID of artifact that matches all target aspects
                        console.log('returnArtifactsByAll() returned ' + matchingYear[i]);  // debug statement
                        return matchingYear[i];
                    }
                }
            }
        }
    }
    // If there is no matching artifect, return null
    console.log('returnArtifactsByAll() returned NULL');    // debug statement
    return null;
}

// Returns the ID of all artifacts with the target year
function returnArtifactsByYear(targetYear) {
    let matchingYear = [];  // array containing the ID's of all artifacts with matching years
    
    // Loop through all indexed objects in artifactList[] checking for matching year, on match add ID to matchingYear[]
    Object.values(artifactList).forEach((item, index, arr) => {
        // console.log(index + ' : ' + arr[index].year);   // debug statement
        // If matching year
        if (arr[index].year === targetYear) {
            // Add ID to matchingYear[]
            matchingYear.push(arr[index].artifact_id);
        }
    });

    // Return matchingYear[] array containing all artifact id's that belong to artifacts with targetYear
    return matchingYear;
}

// Returns the ID of all artifacts with the target country
function returnArtifactsByCountry(targetCountry) {
    let matchingCountry = [];   // array containing the ID's of all artifacts with matching countries
    
    // Loop through all indexed objects in artifactList[] checking for matching country, on match add ID to matchingCountry[]
    Object.values(artifactList).forEach((item, index, arr) => {
        // console.log(index + ' : ' + arr[index].country);   // debug statement
        // If matching country
        if (arr[index].country === targetCountry) {
            // Add ID to matchingCountry[]
            matchingCountry.push(arr[index].artifact_id);
        }
    });

    // Return matchingCountry[] array containing all artifact id's that belong to artifacts with targetCountry
    return matchingCountry;
}

// Returns the ID of all artifacts with the target manufacturer
function returnArtifactsByManufacturer(targetManufacturer) {
    let matchingManufacturer = [];  // array containing the ID's of all artifacts with matching manufacturers
    
    // Loop through all indexed objects in artifactList[] checking for matching manufacturer, on match add ID to matchingManufacturer[]
    Object.values(artifactList).forEach((item, index, arr) => {
        // console.log(index + ' : ' + arr[index].manufacturer);   // debug statement
        // If matching manufacturer
        if (arr[index].manufacturer === targetManufacturer) {
            // Add ID to matchingManufacturer[]
            matchingManufacturer.push(arr[index].artifact_id);
        }
    });

    // Return matchingManufacturer[] array containing all artifact id's that belong to artifacts with targetManufacturer
    return matchingManufacturer;
}

// Returns the ID of a random artifact that hasn't already been added to artifactIDList[]
function returnRandomArtifactID() {
    // Add the ID's of all non-selected artifacts to a new array (ids not already in artifactIDList[])
    let nonSelectedArtifacts = [];  // array containing the ID's of all artifacts that haven't already been added to the artifactIDList[]
    
    // Loop through all artifacts
    Object.values(artifactList).forEach((item, index, arr) => {
        let alreadySelected = false;    // Bool used to check if an ID is already in the artifactIDList[]

        // Loop through all ID's in artifactIDList
        for (let i = 0; i < artifactIDList.length; i++) {
            // If there is a match
            if (artifactIDList[i] === arr[index].artifact_id) {
                // Set alreadySelected to true
                alreadySelected = true;
            } 
        }
        // If the ID is not already in the artifactIDList[]
        if (alreadySelected === false) {
            // Add to nonSelectedArtifacts[]
            nonSelectedArtifacts.push(arr[index].artifact_id);
        }
    });

    // Add a new random ID until the artifactIDList is full (numArtifacts amount of ID's in array)
    for (let i = artifactIDList.length; i < numArtifacts; i++) {
        // Get random number between 0 and number of artifact ID's in nonSelectedArtifacts[]
        let randomIndex = Math.floor(Math.random() * nonSelectedArtifacts.length);
        // Return a random artifact ID from nonSelectedArtifacts[]
        console.log('Returning random artifact ID: ' + nonSelectedArtifacts[randomIndex])    // Debug statement
        return nonSelectedArtifacts[randomIndex];
    }
}