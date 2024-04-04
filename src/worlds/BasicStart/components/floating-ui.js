'use strict'

//this component will control the hovering ui next to each artifact
AFRAME.registerComponent('floating-ui', {

  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    
    //get a local reference to our entities and set some property variables
    const Context_AF = this;

    //fade length (ms)
    const fade = 200;

    Context_AF.el.setAttribute('look-at', '.avatar');
    Context_AF.el.setAttribute('material', 'opacity:"0.0f"');

    //define fade on and off aimations
    Context_AF.el.setAttribute('animation__ON', {property:'material.opacity', to:1.0, dur:fade, easing:'linear', enabled:false});
    Context_AF.el.setAttribute('animation__OFF', {property:'material.opacity', to:0, dur:fade, easing:'linear', enabled:true});

    let children = Context_AF.el.children;

    for(let i = 0; i < children.length; i++)
    {
      if(children[i].getAttribute('text'))
      {
        children[i].setAttribute('text', 'opacity:"0.0f"');
        children[i].setAttribute('animation__ON', {property:'text.opacity', to:1.0, dur:fade, easing:'linear', enabled:false});
        children[i].setAttribute('animation__OFF', {property:'text.opacity', to:0, dur:fade, easing:'linear', enabled:true});
      }

      else
      {        
        children[i].setAttribute('material', 'opacity:"0.0f"');
        children[i].setAttribute('animation__ON', {property:'material.opacity', to:1.0, dur:fade, easing:'linear', enabled:false});
        children[i].setAttribute('animation__OFF', {property:'material.opacity', to:0, dur:fade, easing:'linear', enabled:true});
      }
    }

  },
  
  //component documentation: https://github.com/aframevr/aframe/blob/master/docs/core/component.md
  
  // update: function (oldData) {},
  tick: function(time, timeDelta) {
    //get a local reference to our entities and set some property variables
    const Context_AF = this;

    let children = Context_AF.el.children;

    if (/*item == selected*/Context_AF.el.object3D.position.distanceTo(document.querySelector('#Player1').object3D.position) <= 2)
    {
      if(Context_AF.el.getAttribute('animation__ON').enabled == false)
      {
        //Context_AF.el.setAttribute('visible', 'true');
        Context_AF.el.setAttribute('animation__ON', {enabled:true});
        Context_AF.el.setAttribute('animation__OFF', {enabled:false});

        for(let i = 0; i < children.length; i++)
        {
          children[i].setAttribute('animation__ON', {enabled:true});
          children[i].setAttribute('animation__OFF', {enabled:false});
        }

      }
    }
    else
    {
      if(Context_AF.el.getAttribute('animation__ON').enabled == true)
      {
        //Context_AF.el.setAttribute('visible', 'false');
        Context_AF.el.setAttribute('animation__ON', {enabled:false});
        Context_AF.el.setAttribute('animation__OFF', {enabled:true});

        for(let i = 0; i < children.length; i++)
        {
          children[i].setAttribute('animation__ON', {enabled:false});
          children[i].setAttribute('animation__OFF', {enabled:true});
        }
      }
    }
  },
  // tock: function(time, timeDelta) {},
  // remove: function() {},
  // pause: function() {},
  // play: function() {},
  // updateScheme: function(data) {}
});