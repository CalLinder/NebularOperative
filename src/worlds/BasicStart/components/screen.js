'use strict'

// item drop location manager------------------------------------------------------------
AFRAME.registerComponent('screen', {

// schema: {
//         item: {type: "string", default: null},
//     },

    init: function() {
        const CONTEXT_AF = this;                                                    //this refers to the component, not the element that the component is attached to

        let scaleFactorX = 3.02183;
        let scaleFactorY = 1.75294;
        let scaleFactorZ = 0.03;
        

        //set up screen
        CONTEXT_AF.el.setAttribute("material", "color:black");
        CONTEXT_AF.el.setAttribute("scale", scaleFactorX + " " + scaleFactorY + " " + scaleFactorZ);

        //set up screen's audio player
        let audioSFXPlayer = document.createElement('a-entity');        
        audioSFXPlayer.setAttribute("circles-sound", {type: "basic-diegetic", src: "#ID_System_Beep_SFX", volume: "0.4", poolSize: "3"});        
        audioSFXPlayer = CONTEXT_AF.el.appendChild(audioSFXPlayer);


        //DISPLAY TEXT ON SCREEN - ALL OF THIS SHOULD BE TRIGGERED ON GAME START EVENT

        //Default text displayed immidiately
        let textBasic = document.createElement('a-entity');
        textBasic.setAttribute("text", "value:Target item: ; color:white; font:"+ font +"; width:2; anchor:left; baseline:top; wrapCount:18;"); //TO DO: CHANGE TEXT DEPENDING ON ROLES
        textBasic.setAttribute("position", "0.45 0.35 -0.5");
        textBasic.setAttribute("rotation", "0 180 0");
        textBasic.setAttribute("scale", 1/scaleFactorX + " " + 1/scaleFactorY + " " + 1/scaleFactorZ);

        CONTEXT_AF.el.appendChild(textBasic);

        //Create Year
        let textYear = document.createElement('a-entity');
        textYear.setAttribute("text", "value:Year: " + challengeYear + " ; color:white; font:"+ font +"; width:2.8; anchor:left; baseline:top; wrapCount:40;");
        textYear.setAttribute("position", "0.45 0.2 -0.5");
        textYear.setAttribute("rotation", "0 180 0");
        textYear.setAttribute("visible", "false");
        textYear.setAttribute("scale", 1/scaleFactorX + " " + 1/scaleFactorY + " " + 1/scaleFactorZ);

        CONTEXT_AF.el.appendChild(textYear);

        //Create Country
        let textCountry = document.createElement('a-entity');
        textCountry.setAttribute("text", "value:Country: " + challengeCountry + " ; color:white; font:"+ font +"; width:2.8; anchor:left; baseline:top; wrapCount:40;");
        textCountry.setAttribute("position", "0.45 0.1 -0.5");
        textCountry.setAttribute("rotation", "0 180 0");
        textCountry.setAttribute("visible", "false");
        textCountry.setAttribute("scale", 1/scaleFactorX + " " + 1/scaleFactorY + " " + 1/scaleFactorZ);

        CONTEXT_AF.el.appendChild(textCountry);

        //Create Manufactuerer
        let textManufacturer = document.createElement('a-entity');
        textManufacturer.setAttribute("text", "value:Manufacturer: " + challengeManufacturer + " ; color:white; font:"+ font +"; width:2.8; anchor:left; baseline:top; wrapCount:40;");
        textManufacturer.setAttribute("position", "0.45 0.0 -0.5");
        textManufacturer.setAttribute("rotation", "0 180 0");
        textManufacturer.setAttribute("visible", "false");
        textManufacturer.setAttribute("scale", 1/scaleFactorX + " " + 1/scaleFactorY + " " + 1/scaleFactorZ);

        CONTEXT_AF.el.appendChild(textManufacturer);

        //display one at a time
        setTimeout(function() {
            audioSFXPlayer.setAttribute("circles-sound", "state: play");
            textYear.setAttribute("visible", "true");

            setTimeout(function() {
                audioSFXPlayer.setAttribute("circles-sound", "state: stop");
                audioSFXPlayer.setAttribute("circles-sound", "state: play");
                textCountry.setAttribute("visible", "true");

                setTimeout(function() {
                    audioSFXPlayer.setAttribute("circles-sound", "state: stop");
                    audioSFXPlayer.setAttribute("circles-sound", "state: play");
                    textManufacturer.setAttribute("visible", "true");
                }, 1200);

            }, 1200);
                
        }, 1200);
                
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