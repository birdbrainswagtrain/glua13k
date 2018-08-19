//[
precision mediump float;
//]

uniform vec3 a; // view angle (x=yaw,y=pitch,z=aspect)
uniform vec3 l; // view location

varying vec2 p; // input pos

float sd_sphere(vec3 pos, float r) {
    return length(pos)-r;
}

float sd_box(vec3 pos, vec3 bounds) {
    return length(max(abs(pos)-bounds,0.0));
}

float sd_join(float a, float b) {
    return min(a,b);
}

/*float sd_offset(float a, vec3 offset) {
    return 
}*/

float sdf(vec3 pos) {
    return sd_join(
        sd_sphere(pos,1.0),
        sd_join(
            sd_join( // Walls
                sd_join(
                    sd_box(pos-vec3(0,0,10),vec3(10,2,.1)),
                    sd_box(pos-vec3(0,0,-10),vec3(10,2,.1))
                ),
                sd_join(
                    sd_box(pos-vec3(10,0,0),vec3(.1,2,10)),
                    sd_box(pos-vec3(-10,0,0),vec3(.1,2,10))
                )
            ),
            sd_join( // Floor + Ceiling
                sd_box(pos-vec3(0,2,0),vec3(10,.1,10)),
                sd_box(pos-vec3(0,-2,0),vec3(10,.1,10))
            )
        )
    );
}

const int i_ITERS = 256;
const float i_EPSILON = .01;

vec3 sdf_normal(vec3 pos) {
    return normalize(vec3(
        sdf(pos+vec3(i_EPSILON,0,0)) - sdf(pos+vec3(-i_EPSILON,0,0)),
        sdf(pos+vec3(0,i_EPSILON,0)) - sdf(pos+vec3(0,-i_EPSILON,0)),
        sdf(pos+vec3(0,0,i_EPSILON)) - sdf(pos+vec3(0,0,-i_EPSILON))
    ));
}

void main() {

    // NOTE: my linal skills are absolute trash
    vec3 ray_dir = normalize(vec3(p.x,p.y*a.z,1))*
    mat3(
        1,0,0,
        0,cos(a.y),-sin(a.y),
        0,sin(a.y),cos(a.y)
    )*
    mat3(
        cos(a.x),0,sin(a.x),
        0,1,0,
        -sin(a.x),0,cos(a.x)
    );

    vec3 pos = l; // cam start pos

    for (int i=0;i<i_ITERS;i++) {
        float d = sdf(pos);
        if (d<i_EPSILON) {
            vec3 surface_normal = sdf_normal(pos);
            vec3 surface_color = vec3(0.275, 0.510, 0.706);
            
            vec3 light_normal = normalize(vec3(1,3,2));

            float light = dot(surface_normal,light_normal)*.5+.5;

            gl_FragColor = vec4(light*surface_color,1);
            return;
        }
        pos += ray_dir*d;
    }
    gl_FragColor = vec4(.2,.2,.2,1);
}
