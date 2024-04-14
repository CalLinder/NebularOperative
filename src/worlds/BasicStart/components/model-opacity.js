// COMPONENET ORIGNALLY SOURCED FROM Piotr Milewski on GitHub: https://github.com/gftruj/webzamples/blob/master/aframe/models/components/model-opacity.js

AFRAME.registerComponent('model-opacity', {
    schema: { opacity: { default: 1.0 } },
    
    update: function () {
        var mesh = this.el.getObject3D('mesh');
        var data = this.data;
        if (!mesh) { return; }

        mesh.traverse(function (node) {
            if (node.isMesh) {
                node.renderOrder = 100;
                node.material.depthTest = false;
                node.material.opacity = data.opacity;
                node.material.transparent = data.opacity < 1.0;
                node.material.needsUpdate = true;
            }
        });
    },
    remove: function () {
        const mesh = this.el.getObject3D('mesh');
        if (!mesh) return;
        mesh.traverse(node => {
            node.material.opacity = 1.0
            node.material.transparent = false;
            node.material.needsUpdate = true;
        })
    }
});