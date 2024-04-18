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
        CONTEXT_AF.el.setAttribute("setupRoundScreen", 'false');

        // create intro text here
        let textIntro = document.createElement('a-entity');
        textIntro.setAttribute("text", "value:Welcome to Nebular Operative, where you, a robot from the technologically advanced planet of Ingenium, are on a quest to gain access to Earth. In this cooperative adventure, you'll team up with two fellow robots, each with a unique role: one knows the year of artifact creation, another the place of origin, and the third the manufacturer. Your objective? Pass the Nebular Exam by utilizing your combined knowledge to locate artifacts meeting specific criteria displayed on the screens. Through effective communication and teamwork, scavenge through the troves of historic artifacts and prove yourselves worthy of becoming certified Nebula Operatives. Good luck!; color:white; font:"+ font +"; width:2.8; anchor:left; baseline:top; wrapCount:60;"); 
        textIntro.setAttribute("position", "0.45 0.35 -0.5");
        textIntro.setAttribute("rotation", "0 180 0");
        textIntro.setAttribute("scale", 1/scaleFactorX + " " + 1/scaleFactorY + " " + 1/scaleFactorZ);
        textIntro.setAttribute('class', 'intro_text');
        textIntro.setAttribute("visible", "true");

        CONTEXT_AF.el.appendChild(textIntro);
                
    },

    tick: function(time, timeDelta) {
        const CONTEXT_AF = this;                                                    //this refers to the component, not the element that the component is attached to
        
        if (CONTEXT_AF.el.getAttribute('setupRoundScreen') == 'true') {

            //set up screen's audio player
            let audioSFXPlayer = document.createElement('a-entity');        
            audioSFXPlayer.setAttribute("circles-sound", {type: "basic-diegetic", src: "#ID_System_Beep_SFX", volume: "0.4", poolSize: "3"});        
            audioSFXPlayer = CONTEXT_AF.el.appendChild(audioSFXPlayer);

            let scaleFactorX = 3.02183;
            let scaleFactorY = 1.75294;
            let scaleFactorZ = 0.03;
            
            //Default text 
            let textBasic = document.createElement('a-entity');
            textBasic.setAttribute("text", "value:Target item: ; color:white; font:"+ font +"; width:2; anchor:left; baseline:top; wrapCount:18;"); //TO DO: CHANGE TEXT DEPENDING ON ROLES
            textBasic.setAttribute("position", "0.45 0.35 -0.5");
            textBasic.setAttribute("rotation", "0 180 0");
            textBasic.setAttribute("visible", "false");
            textBasic.setAttribute("scale", 1/scaleFactorX + " " + 1/scaleFactorY + " " + 1/scaleFactorZ);
            textBasic.setAttribute('class', 'round_text');

            CONTEXT_AF.el.appendChild(textBasic);

            //Create Year
            let textYear = document.createElement('a-entity');
            textYear.setAttribute("text", "value:Year: " + challengeYear + " ; color:white; font:"+ font +"; width:2.8; anchor:left; baseline:top; wrapCount:40;");
            textYear.setAttribute("position", "0.45 0.2 -0.5");
            textYear.setAttribute("rotation", "0 180 0");
            textYear.setAttribute("visible", "false");
            textYear.setAttribute("scale", 1/scaleFactorX + " " + 1/scaleFactorY + " " + 1/scaleFactorZ);
            textYear.setAttribute('class', 'round_text');

            CONTEXT_AF.el.appendChild(textYear);

            //Create Country
            let textCountry = document.createElement('a-entity');
            textCountry.setAttribute("text", "value:Country: " + challengeCountry + " ; color:white; font:"+ font +"; width:2.8; anchor:left; baseline:top; wrapCount:40;");
            textCountry.setAttribute("position", "0.45 0.1 -0.5");
            textCountry.setAttribute("rotation", "0 180 0");
            textCountry.setAttribute("visible", "false");
            textCountry.setAttribute("scale", 1/scaleFactorX + " " + 1/scaleFactorY + " " + 1/scaleFactorZ);
            textCountry.setAttribute('class', 'round_text');

            CONTEXT_AF.el.appendChild(textCountry);

            //Create Manufactuerer
            let textManufacturer = document.createElement('a-entity');
            textManufacturer.setAttribute("text", "value:Manufacturer: " + challengeManufacturer + " ; color:white; font:"+ font +"; width:2.8; anchor:left; baseline:top; wrapCount:40;");
            textManufacturer.setAttribute("position", "0.45 0.0 -0.5");
            textManufacturer.setAttribute("rotation", "0 180 0");
            textManufacturer.setAttribute("visible", "false");
            textManufacturer.setAttribute("scale", 1/scaleFactorX + " " + 1/scaleFactorY + " " + 1/scaleFactorZ);
            textManufacturer.setAttribute('class', 'round_text');

            CONTEXT_AF.el.appendChild(textManufacturer);

            //remove intro text
            CONTEXT_AF.el.querySelectorAll('.intro_text')[0].setAttribute('visible', 'false');

            //display one at a time
            setTimeout(function() {
                audioSFXPlayer.setAttribute("circles-sound", "state: play");
                textBasic.setAttribute("visible", "true");

                setTimeout(function() {
                    audioSFXPlayer.setAttribute("circles-sound", "state: stop");
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

            }, 1200);

            CONTEXT_AF.el.setAttribute('setupRoundScreen', 'false');

        }

        if (CONTEXT_AF.el.getAttribute('setupOutroScreen') == 'true') {

            //set up screen's audio player
            let audioSFXPlayer = document.createElement('a-entity');        
            audioSFXPlayer.setAttribute("circles-sound", {type: "basic-diegetic", src: "#ID_System_Beep_SFX", volume: "0.4", poolSize: "3"});        
            audioSFXPlayer = CONTEXT_AF.el.appendChild(audioSFXPlayer);

            let scaleFactorX = 3.02183;
            let scaleFactorY = 1.75294;
            let scaleFactorZ = 0.03;

            //remove round text
            CONTEXT_AF.el.querySelectorAll('.round_text')[0].setAttribute('visible', 'false');
            CONTEXT_AF.el.querySelectorAll('.round_text')[1].setAttribute('visible', 'false');
            CONTEXT_AF.el.querySelectorAll('.round_text')[2].setAttribute('visible', 'false');
            CONTEXT_AF.el.querySelectorAll('.round_text')[3].setAttribute('visible', 'false');

            // create outro text here
            let textOutro = document.createElement('a-entity');
            textOutro.setAttribute("text", "value:Congratulations, you have successfully located the correct artifact! You are now a fully certified Nebular Operative. If you would like to play again, please enter the portal which has now opened. Thank you for playing Nebular Operative!; color:white; font:"+ font +"; width:2.9; anchor:left; baseline:top; wrapCount:35;"); 
            textOutro.setAttribute("position", "0.45 0.35 -0.5");
            textOutro.setAttribute("rotation", "0 180 0");
            textOutro.setAttribute("scale", 1/scaleFactorX + " " + 1/scaleFactorY + " " + 1/scaleFactorZ);
            textOutro.setAttribute('class', 'intro_text');
            textOutro.setAttribute("visible", "true");

            CONTEXT_AF.el.appendChild(textOutro);

            CONTEXT_AF.el.setAttribute('setupOutroScreen', 'false');

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