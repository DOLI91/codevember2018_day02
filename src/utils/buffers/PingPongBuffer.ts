import { Scene, OrthographicCamera, PerspectiveCamera, Renderer, WebGLRenderTarget, ClampToEdgeWrapping, LinearFilter, RGBAFormat, NearestFilter, FloatType, HalfFloatType } from 'three';
import RenderQuad from '../renderQuad/RenderQuad';
const glslify = require('glslify');

/**
 * FBO for pingponging datatextures
 */

//TODO: add a type options which will create an RTT with nearest filtering and set the orthographic camera size to be 1

export default class PingPongBuffer {

    public scene: Scene;
    public camera: OrthographicCamera;
    public renderQuad: RenderQuad;
    public rtt: WebGLRenderTarget;

    constructor(width: number = 1, height: number = 1) {

        this.scene = new Scene();
        this.camera = new OrthographicCamera(-1.0, 1.0, 1.0, -1.0, 0.0000001, 1.0);
        this.renderQuad = new RenderQuad();
        this.scene.add(this.renderQuad);

        this.rtt = new WebGLRenderTarget(
            width,
            height,
            {
                wrapS: ClampToEdgeWrapping,
                wrapT: ClampToEdgeWrapping,
                minFilter: NearestFilter,
                magFilter: NearestFilter,
                format: RGBAFormat,
                type: FloatType,
                generateMipmaps: false,
                depthBuffer: false,
                stencilBuffer: false,
            });

    }

    render(renderer: any, scene: Scene, camera: PerspectiveCamera | OrthographicCamera) {

        renderer.render(scene, camera, this.rtt);
        this.renderQuad.texture = this.rtt;
        renderer.render(this.scene, this.camera, this.rtt);

    }

}