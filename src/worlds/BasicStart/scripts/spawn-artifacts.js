'use strict'

// Global Vars
const numArtifacts = 3; // Ensure there are enough ID_Artifact_Spawner_[insert number]'s in scene to match numArtifacts

// Test Values | Goal is 'OpticalLens' and therefore it MUST spawn in the round
const challengeYear = '1943';
const challengeCountry = 'England';
const challengeManufacturer = 'National Physical Laboratories';
// TO DO: Instead of challenge year, country, manufacturer, etc, it should be a range or clue (i.e., 1940-1950, continent, national manufacturer, etc)

// Artifact Lists/Arrays/Objects
const artifactList = {};    // This object will contain all artifact data (id, year, country, manufacturer, model ID)
let artifactIDList = [];    // This array will contain a list of ID's for all artifacts that will be spawned into the scene

// Add Artifact Data to artifactList Object Index
artifactList['Clock'] = {
    artifact_id: 'Clock',
    year: '1912',
    country: 'Unknown',
    manufacturer: 'Waltham Watch Co.',
    model_id: '#ID_Clock_Model',
    image_id: '#ID_Clock_IMG',
    model_path: '/worlds/BasicStart/assets/models/artifacts/Clock.glb',
    name: 'Automotive Clock',
    description: 'A BRASS OBJECT WITH A GLASS FACE. USED AS A AUTOMOTIVE PART',
    number: '716'


};
artifactList['DiskDrive'] = {
    artifact_id: 'DiskDrive',
    year: '1969',
    country: 'England',
    manufacturer: 'International Computers Ltd',
    model_id: '#ID_DiskDrive_Model',
    image_id: '#ID_DiskDrive_IMG',
    model_path: '/worlds/BasicStart/assets/models/artifacts/DiskDrive.glb',
    name: 'Controller, disk drive',
    description: 'THE CONTROL UNIT FOR THE DISK DRIVES USED AS AUXILIARY STORAGE DEVICES FOR LARGE QUANTITY AND/OR LONG TERM STORAGE',
    number: '734'
};
artifactList['Fridge'] = {
    artifact_id: 'Fridge',
    year: '1953',
    country: 'United States of America',
    manufacturer: 'International Harvester Co.',
    model_id: '#ID_Fridge_Model',
    image_id: '#ID_Fridge_IMG',
    model_path: '/worlds/BasicStart/assets/models/artifacts/Fridge.glb',
    name: 'Electric Refrigerator',
    description: 'THE MANUFACTUER OF THE REFRIGERATORS DESIGNED THE PRODUCT TO MEET TECHNOLOGICAL, BUT ALSO FASHION REQUIREMENTS OF A MODERN HOUSEWIFE.',
    number: '715'
};
artifactList['OpticalLens'] = {
    artifact_id: 'OpticalLens',
    year: '1943',
    country: 'England',
    manufacturer: 'National Physical Laboratories',
    model_id: '#ID_OpticalLens_Model',
    image_id: '#ID_OpticalLens_IMG',
    model_path: '/worlds/BasicStart/assets/models/artifacts/OpticalLens.glb',
    name: 'Flat, optical',
    description: 'USED IN PAIRS IN CONJUNCTION WITH A MONOCHROMATIC LIGHT SOURCE TO TEST THE FLATNESS OF A THIRD SURFACE',
    number: '351'
};
artifactList['Radio'] = {
    artifact_id: 'Radio',
    year: '1948',
    country: 'Canada',
    manufacturer: 'Measurement Engineering Ltd',
    model_id: '#ID_Radio_Model',
    image_id: '#ID_Radio_IMG',
    model_path: '/worlds/BasicStart/assets/models/artifacts/Radio.glb',
    name: 'Receiver, radio',
    description: 'TO RECEIVE, DEMODULATE & AMPLIFY AM AND SHORT WAVE (2 BANDS) STANDARD BROADCAST SIGNALS',
    number: '845'
};
artifactList['Syringe'] = {
    artifact_id: 'Syringe',
    year: 'Unknown',
    country: 'England',
    manufacturer: 'Down',
    model_id: '#ID_Syringe_Model',
    image_id: '#ID_Syringe_IMG',
    model_path: '/worlds/BasicStart/assets/models/artifacts/Syringe.glb',
    name: 'Syringe, irrigation',
    description: 'USED TO FLUSH EAR CANAL WITH WARM OIL & SALINE SOLUTION TO ORDER REMOVE WAX AND OTHER DEBRIS.',
    number: '251'
};

// ID Naming Schemes:
// Arifact Spawners: ID_Artifact_Spawner_[insert number]

// setupArtifacts Function - runs at onload
function setupArtifacts() {
    console.log('setup() running'); 

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

    //spawn artifacts at the position of the ID_Artifact_Spawner_[insert number] positions
    spawnArtifacts();
}

// Spawns artifacts into the scene using an array of artifact ID's
function spawnArtifacts() {
    // Example artifact entity in scene:
    // <a-entity 
    //   id="ID_Clock_Entity"
    //   position="0 1 -1" rotation="0 0 0" scale="1 1 1"
    //   gltf-model="#ID_Clock_Model"
    //   circles-pickup-networked
    //   circles-pickup-object="pickupScale: 1 1 1; dropScale: 1 1 1; dropRotation: 0 0 0; dropPosition: 0 1 -1"
    // ></a-entity>

    // Loop through for each artifact that needs to be spawned
    for (let i = 1; i <= numArtifacts; i++) {

        let item = artifactList[artifactIDList[i-1]];

        // Create new object in document
        let newObject = document.createElement('a-entity');

        let spawnerObject = document.querySelector('#ID_Artifact_Spawner_' + i);
            
        newObject.setAttribute('id', "ID_" + item.artifact_id + "_Entity");
        newObject.setAttribute('artifact_id', "ID_" + item.artifact_id + "_Entity");
        newObject.setAttribute("rotation", "0 0 0");
        newObject.setAttribute("scale", "1 1 1");
        newObject.setAttribute("gltf-model", item.model_id);
        newObject.setAttribute("circles-pickup-networked","");
        newObject.setAttribute("circles-pickup-object", {pickupScale:"1 1 1", pickupRotation:"0 -90 0", pickupPosition:"1.5 -1 0.5 ", dropScale: "1 1 1", dropRotation: "0 0 0", dropPosition: "0 0 0"});
        
        //TEMP ITEM PICKUP SFX IMPLEMENTATION - WE CAN FALL BACK TO THIS IF NEEDED  
        //newObject.setAttribute("circles-interactive-object", "click_sound:#ID_Item_Pickup_SFX");

        // Append new object to appropriate ID_Artifact_Spawner_[insert number]
        //redefine newObject to point at the instatiated object
        newObject = spawnerObject.appendChild(newObject);

        //create an event listner applied to all models to create their UI elements when the models are loaded
        newObject.addEventListener('model-loaded', function () {                            
                // Get the artifact's bounding box
                let boundingBox = new THREE.Box3().setFromObject(newObject.object3D);
                
                //===CREATE UI CODE===
        
                //Create ui object
                let objectUI = document.createElement('a-entity');
        
                objectUI.setAttribute('id', "ID_" + item.artifact_id + "_UI");
                objectUI.setAttribute("floating-ui","");
                objectUI.setAttribute("position", "0 " + (boundingBox.max.y - 1) + " 0"); 
        
                //UI elements
                //Background
                let uiBG = document.createElement('a-entity');
                //uiBG.setAttribute("geometry", "primitive:box"); //TO DO: CHANGE THIS TO CUSTOM GLTF AND ADD IMAGES
                uiBG.setAttribute("scale", "0.8 0.8 0.8");
                uiBG.setAttribute("rotation", "0 90 0");
                //uiBG.setAttribute("material","color:blue");
                uiBG.setAttribute("gltf-model", "#ID_UI_Object_Info_Model");
                        
                //append geometry elements
                uiBG = objectUI.appendChild(uiBG);
                
                //stop model loading event from bubbling up and causing an infinite loop
                uiBG.addEventListener('model-loaded', function (e) { 
                    e.stopPropagation();
                });

                //===text===
                let uiTex = document.createElement('a-entity');
                uiTex.setAttribute("text", "value:" + item.name + 
                "; color:white; font:mozillavr; width:0.6; anchor:left; baseline:top; wrapCount:18;"); //TO DO: CHANGE TEXT DEPENDING ON ROLES
                uiTex.setAttribute("position", "-0.35 0.57 0.01");

                //append text
                uiTex = objectUI.appendChild(uiTex);



                //Append ui to the artifact
                newObject.appendChild(objectUI);    
        
                //===CREATE UI CODE END===
          });


    }
}

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