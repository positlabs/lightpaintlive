J3D.Intersection = {};

J3D.Intersection.rayTest = function(r, t) {
    if(!t.collider) {
        console.log("Intersection test failed. " + t.name + " has no collider.");
        return false;
    }

    switch(t.collider.type) {
        case J3D.Collider.SPHERE:
            return J3D.Intersection.raySphere(r, t);
        case J3D.Collider.BOX:
            return J3D.Intersection.rayBox(r, t);
        case J3D.Collider.MESH:
            return J3D.Intersection.rayMesh(r, t);
        default:
            throw J3D.Error.UNKNOWN_COLLIDER_TYPE + t.collider.type;
            return false;
    }
}

J3D.Intersection.rayMesh = function(r, t) {
    if (!t.collider.mesh || !t.collider.mesh.vertexPositionBuffer) {
        console.log("Intersection test failed. " + t.name + " has no mesh defined or no vertex data in the mesh.");
        return false;
    }

    if(t.collider.box) {
        if(!J3D.Intersection.rayBox(r, t)) {
            return false;
        }
    } else {
        r.makeLocal(t);
    }

    var v = t.collider.mesh.vertexPositionBuffer.data;
    var d = t.collider.mesh.elements.data;

    var c = false;

    for(var i = 0; i < d.length; i += 3) {
        var i0 = d[i+0] * 3;
        var i1 = d[i+1] * 3;
        var i2 = d[i+2] * 3;

        var p0 = new v3( v[ i0 ], v[ i0+1 ], v[ i0+2 ] );
        var p1 = new v3( v[ i1 ], v[ i1+1 ], v[ i1+2 ] );
        var p2 = new v3( v[ i2 ], v[ i2+1 ], v[ i2+2 ] );

        c = c || J3D.Intersection.rayTriangle(r, p0, p1, p2);
        if(c) break;
    }

    return c;
}

J3D.Intersection.rayTriangle = function(r, p0, p1, p2) {

    var e1 = v3.sub( p0, p1 );
    var e2 = v3.sub( p0, p2 );
    var n = v3.cross( e2, e1 );

    var dot = v3.dot( n, r.localDirection );
    if ( !( dot < 0 ) ) {
        return false;
    }

    var d = v3.dot( n, p0 );
    var t = d - v3.dot( n, r.localOrigin );

    if ( !( t <= 0 ) ) {
        return false;
    }

    t = t / dot;

    var p = r.localDirection.norm().mul(t);
    p = v3.add(p, r.localOrigin);

    var u0, u1, u2, v0, v1, v2;

    if ( Math.abs( n.x ) > Math.abs( n.y ) ) {

        if ( Math.abs( n.x ) > Math.abs( n.z ) ) {

            u0 = p.y  - p0.y;
            u1 = p1.y - p0.y;
            u2 = p2.y - p0.y;

            v0 = p.z  - p0.z;
            v1 = p1.z - p0.z;
            v2 = p2.z - p0.z;

        } else {

            u0 = p.x  - p0.x;
            u1 = p1.x - p0.x;
            u2 = p2.x - p0.x;

            v0 = p.y  - p0.y;
            v1 = p1.y - p0.y;
            v2 = p2.y - p0.y;

        }

    } else {

        if( Math.abs( n.y ) > Math.abs( n.z ) ) {

            u0 = p.x  - p0.x;
            u1 = p1.x - p0.x;
            u2 = p2.x - p0.x;

            v0 = p.z  - p0.z;
            v1 = p1.z - p0.z;
            v2 = p2.z - p0.z;

        } else {

            u0 = p.x  - p0.x;
            u1 = p1.x - p0.x;
            u2 = p2.x - p0.x;

            v0 = p.y  - p0.y;
            v1 = p1.y - p0.y;
            v2 = p2.y - p0.y;

        }

    }

    var temp = u1 * v2 - v1 * u2;
    if( !(temp != 0) ) {
        return false;
    }

    temp = 1 / temp;

    var alpha = ( u0 * v2 - v0 * u2 ) * temp;
    if( !(alpha >= 0) ) {

        return false;
    }

    var beta = ( u1 * v0 - v1 * u0 ) * temp;
    if( !(beta >= 0) ) {
        return false;
    }

    var gamma = 1 - alpha - beta;
    if( !(gamma >= 0) ) {
        return false;
    }

    return t;

}

J3D.Intersection.raySphere = function(r, t) {
    if (!t.collider.radius) {
        console.log("Intersection test failed. " + t.name + " has no radius defined.");
        return false;
    }

    var radius = t.collider.radius;
    var radiusSq = radius * radius;

    r.makeLocal(t);

    var e = t.collider.center.sub(r.localOrigin);
    if (e.lengthSq < radiusSq) return false;

    var a = v3.dot(e, r.localDirection);
    if (a <= 0) return false;

    var t = radiusSq - ( e.magSq() - a * a );
    if (t >= 0) return Math.abs(a) - Math.sqrt(t);

    return false;

};

J3D.Intersection.rayBox = function(r, t) {
    if (!t.collider.box) {
        console.log("Intersection test failed. " + t.name + " has no box defined.");
        return false;
    }

    var b = t.collider.box;

    r.makeLocal(t);

    var xt = 0, yt = 0, zt = 0;
    var xn = 0, yn = 0, zn = 0;
    var ins = true;

    if (r.localOrigin.x < b.minX) {

        xt = b.minX - r.localOrigin.x;
        //if(xt > r.localDirection.x) return return Number.MAX_VALUE;
        xt /= r.localDirection.x;
        ins = false;
        xn = -1;

    } else if (r.localOrigin.x > b.maxX) {

        xt = b.maxX - r.localOrigin.x;
        //if(xt < r.localDirection.x) return return Number.MAX_VALUE;
        xt /= r.localDirection.x;
        ins = false;
        xn = 1;

    }

    if (r.localOrigin.y < b.minY) {

        yt = b.minY - r.localOrigin.y;
        //if(yt > r.localDirection.y) return return Number.MAX_VALUE;
        yt /= r.localDirection.y;
        ins = false;
        yn = -1;

    } else if (r.localOrigin.y > b.maxY) {

        yt = b.maxY - r.localOrigin.y;
        //if(yt < r.localDirection.y) return return Number.MAX_VALUE;
        yt /= r.localDirection.y;
        ins = false;
        yn = 1;

    }

    if (r.localOrigin.z < b.minZ) {

        zt = b.minZ - r.localOrigin.z;
        //if(zt > r.direction.z) return return Number.MAX_VALUE;
        zt /= r.localDirection.z;
        ins = false;
        zn = -1;

    } else if (r.localOrigin.z > b.maxZ) {

        zt = b.maxZ - r.localOrigin.z;
        //if(zt < r.direction.z) return return Number.MAX_VALUE;
        zt /= r.localDirection.z;
        ins = false;
        zn = 1;

    }

    if (ins) return -1;

    var which = 0;
    var td = xt;

    if (yt > td) {

        which = 1;
        td = yt;

    }

    if (zt > td) {

        which = 2;
        td = zt;

    }

    switch (which) {

        case 0:

            var y = r.localOrigin.y + r.localDirection.y * td;
            if (y < b.minY || y > b.maxY) return false;
            var z = r.localOrigin.z + r.localDirection.z * td;
            if (z < b.minZ || z > b.maxZ) return false;
            //ab.normal = new THREE.Vector3(xn, 0, 0);
            break;

        case 1:

            var x = r.localOrigin.x + r.localDirection.x * td;
            if (x < b.minX || x > b.maxX) return false;
            var z = r.localOrigin.z + r.localDirection.z * td;
            if (z < b.minZ || z > b.maxZ) return false;
            //ab.normal = new THREE.Vector3(0, yn, 0);
            break;

        case 2:

            var x = r.localOrigin.x + r.localDirection.x * td;
            if (x < b.minX || x > b.maxX) return false;
            var y = r.localOrigin.y + r.localDirection.y * td;
            if (y < b.minY || y > b.maxY) return false;
            //ab.normal = new THREE.Vector3(0, 0, zn);
            break;

    }

    return td;
}