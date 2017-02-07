

function createPillar()
		{
			var points=[];
			var pos=new THREE.Vector3(0,15,0);
			pos.multiplyScalar(WORLDSCALE);
	
			var ps=12;
			var yf=0.8;
			points[ps-1]=new THREE.Vector2(0,ps*yf*WORLDSCALE);
			points[0]=new THREE.Vector2(0,0);
			for (var i=1;i<ps-1;i++)
				{points[i]=new THREE.Vector2(Math.random()*0.5+1,i*yf);
				 points[i].multiplyScalar(WORLDSCALE);
				}

			createLathePhys(points,12,0.5,pos);
			
		}
	

// Basic Parallel Creators .-............................................................................................................................

    function createBoxPhys(sx, sy, sz, mass, pos,rcvShdw) 
		{
			var box;

		//	var box_geometry=new THREE.BoxGeometry(sx,sy,sz);
			var box_bufGeom=new THREE.BoxBufferGeometry(sx,sy,sz);
			

			box = new Physijs.BoxMesh(
			    	box_bufGeom,
					physiBoxMaterial // defined in createObjects()
				);

			box.collisions = 0;
			box.lastCollision=0;
			box.position.set(pos.x, pos.y, pos.z);
			box.castShadow = true;// ENABLESHADOWS;
			box.receiveShadow = rcvShdw;// ENABLESHADOWS;

			//box.addEventListener( 'collision', handleCollision );
			//box.addEventListener( 'ready', ready );
			
            physiBodies.push(box);
            removeableBodies.push(box);
            scene_physi.add(box);

            /*
            var aura=createAura(sx/WORLDSCALE*2,sy/WORLDSCALE/2);
			box.add(aura);
			*/
			box.geom=box_bufGeom;

            return box;
		}

    function createLathePhys(points, segments, mass, pos) 
		{	var lathe, material;
			var lathe_geometry=new THREE.LatheGeometry(points,segments);

			lathe_geometry.computeBoundingBox();
			lathe_geometry.center();

			material = Physijs.createMaterial(
				//new THREE.MeshLambertMaterial(),
					cubeMaterial, //new THREE.MeshPhongMaterial({color:0xffffff}),
					.6, // medium friction
					.3 // low restitution
			    	);
		
        	material.shading = THREE.FlatShading; 
					lathe = new Physijs.ConvexMesh(
					lathe_geometry,
					material
		    		);
			
            lathe.collisions = 0;
			lathe.lastCollision=0;
			lathe.position.set(pos.x, pos.y, pos.z);
			lathe.castShadow = true;
			//lathe.addEventListener( 'collision', handleCollision );
			//lathe.addEventListener( 'ready', ready );
			
            physiBodies.push(lathe);
            removeableBodies.push(lathe);
            scene_physi.add( lathe );
            return lathe;
		}


   // ---- creating complex structures		
   	function createFetish(gridx,gridy,gridw,level) 
   		{
   			var points=[];
			
			var height=level-layoutHeights[gridx][gridy];
			var ps=12;
			var yf=height/ps;
			points[ps-1]=new THREE.Vector2(0,ps*yf*WORLDSCALE);
			points[0]=new THREE.Vector2(0,0);
			for (var i=1;i<ps-1;i++)
				{points[i]=new THREE.Vector2(Math.random()*(gridw/2-0.5)+0.5,i*yf);
				 points[i].multiplyScalar(WORLDSCALE);
				}

			var pos=new THREE.Vector3(
					gridx+gridw/2, 
					layoutHeights[gridx][gridy]+height/2,
					gridy+gridw/2);
			pos.add(new THREE.Vector3(-5,0,-5));

			pos.multiplyScalar(WORLDSCALE);
			var seg=Math.max(4,Math.round(Math.random()*20));
			var lathe=createLathePhys(points,seg,15,pos);

			//lathe.material.emissive = new THREE.Color( 0.2, 0.2, 0.2);
			//lathe.material.emissiveIntensity=1;
			var aura=createAura(gridw,height);
		//	lathe.add(aura);
			updateLayoutHeights(gridx,gridy, gridw,gridw, level);  //x y  w h  level


   		}

    function createScreen(w,h,totalHeight) 
      { var box, material;
      	var screenThickness=0.1*WORLDSCALE;
      	var screenW=(w*WORLDSCALE-2*screenThickness);
      	var screenH=(h*WORLDSCALE-2*screenThickness);

      	var fullHeight=totalHeight*WORLDSCALE;// height of the screen+feet
      	var plinthHeight= layoutHeights[5][5]*WORLDSCALE;
      	var pos=new THREE.Vector3( 0, fullHeight-screenH/2+plinthHeight-screenThickness, 0 );

      	// create a invisible dummy collider box 
		var geoCollider=new THREE.BoxBufferGeometry(w*WORLDSCALE,fullHeight,screenThickness);
		

		var collider=new Physijs.BoxMesh(geoCollider,physiBoxMaterial,.6,.3);
		collider.position.set(0,plinthHeight+fullHeight/2,0);
		collider.visible=false;
		collider.mass=0;
		physiBodies.push(collider);
      	scene_physi.add(collider);

        //--------------------

      	var col=0xffffff;//ffd0bc
      	//--- screen
		
		var box_geometry=new THREE.BoxBufferGeometry(screenW,screenH,screenThickness);
		mat=new THREE.MeshPhongMaterial( {color:0x333333,shininess:60}  );

		box = new THREE.Mesh(
			    	box_geometry,
					new THREE.MeshBasicMaterial({map:tex_canvas})
				);

		
			box.position.set(pos.x, pos.y, pos.z);
			
			//box.addEventListener( 'collision', handleCollision );
			//box.addEventListener( 'ready', ready );
// screen light ------------------------
		 
		 var intensity=1;
		 var dist=30*WORLDSCALE;
	            var decay=8;
            	
			var sphere = new THREE.SphereGeometry( 0.1*WORLDSCALE, 12, 8 );
		  	screenLight = new THREE.PointLight( col, intensity, dist,decay ); //color, intensity, distance, decay (default is 1, 2 is phyical correct)
			var obj1= new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: col, transparent:true } ) );
				screenLight.add(obj1);
				screenLight.obj=obj1;
				screenLight.castShadow=false;//ENABLESHADOWS;
			//	screenLight.shadow.mapSize.x = mapsize; screenLight.shadow.mapSize.y = mapsize;
            //    screenLight.shadow.camera.left = -d; screenLight.shadow.camera.right = d;	screenLight.shadow.camera.top = d;	screenLight.shadow.camera.bottom = -d;
    		//    screenLight.shadow.camera.near = 2;  screenLight.shadow.camera.far = 200*WORLDSCALE;
    		screenLight.position.z=0.1*WORLDSCALE;
    		box.add(screenLight);
            
            //scene_physi.add( box );

            /*
            var aura=createAura(sx/WORLDSCALE*2,sy/WORLDSCALE/2);
			box.add(aura);
			*/
			box.light=screenLight;
			screenObj=box;






		// feet -------------------------
		var geoFoot=new THREE.BoxBufferGeometry(screenThickness,fullHeight,screenThickness);
		var geoBar=new THREE.BoxBufferGeometry(screenW,screenThickness,screenThickness);
		
		//var geoFoto2=new THREE.BoxBufferGeometry();
		var foot1=new THREE.Mesh(geoFoot,mat);
		var foot2=new THREE.Mesh(geoFoot,mat);
		foot2.castShadow=true;
		foot1.castShadow=true;
		foot1.receiveShadow=false;
		foot2.receiveShadow=false
		var bar1=new THREE.Mesh(geoBar,mat);
		var bar2=new THREE.Mesh(geoBar,mat);
		bar1.castShadow=false;
		bar2.castShadow=false;
		bar2.receiveShadow=false;
		bar1.receiveShadow=false;
		
		foot1.position.set(pos.x-(screenW+screenThickness)/2,fullHeight/2+plinthHeight,0);
		foot2.position.set(pos.x+(screenW+screenThickness)/2,fullHeight/2+plinthHeight,0);
		bar1.position.set(0,fullHeight+plinthHeight-screenThickness/2,0);
		bar2.position.set(0,(fullHeight-screenH-1.5*screenThickness)+plinthHeight,0);
		var screenGroup=new THREE.Group();
		screenGroup.add(foot1);
		screenGroup.add(foot2);
		screenGroup.add(bar1);
		screenGroup.add(bar2);
		screenGroup.add(box);
		//screenGroup.castShadow=true;

		scene_physi.add( screenGroup);
		




		
            //return box_geometry;

        // -----------------------------------------------------

            var material, plane;

			
			
      }

   	function createAura(gridw,height)
   		{	
   			w=gridw*WORLDSCALE;
   			h=height*WORLDSCALE;
   			var curve = new THREE.EllipseCurve(
				0,  0,            // ax, aY
				w/2*1.1,w/2*1.1,           // xRadius, yRadius
				0,  2 * Math.PI,  // aStartAngle, aEndAngle
				false,            // aClockwise
				0                // aRotation
			);

			var path = new THREE.Path( curve.getPoints( 50 ) );
			var geometry = path.createPointsGeometry( 50 );
			geometry.rotateX(Math.PI/2);
			geometry.computeBoundingSphere();

			var bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
			var material = new THREE.LineBasicMaterial( { color : 0xffffff } );
			//var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
			var ellipse = new THREE.Line( geometry, material )
			
			return (ellipse);
   		}


   	function LayoutTable(_leg1,_leg2,_leg3,_leg4,_top)
   	  {
   	  	this.leg1=_leg1;
   	  	this.leg2=_leg2;
   	  	this.leg3=_leg3;
   	  	this.leg4=_leg4;
   	  	this.top=_top;

   	  }

    function createLayoutTable(gridx,gridy,gridw,gridh,level) // createLayoutTable(2,3, 6,4, 10);//(gridx,gridy, gridw,gridh, level); 
        {   
            
			var nGridx=gridx,nGridy=gridy,nGridw=gridw,nGridh=gridh;
            //gridx*=WORLDSCALE; gridy*=WORLDSCALE; gridw*=WORLDSCALE; gridh*=WORLDSCALE;level*=WORLDSCALE;
			
			var maxHeight=checkLayoutMaxHeight(gridx,gridy,gridw,gridh,level);
            
			if (maxHeight<level) // see if the current level is possible at this position
				{


					var brickMass = 5;
					var unit=0.1; // size of legs and thickness of tabletop

				
					var legHeight=0;
					var topHeight=Math.random()* ((level-maxHeight)/1.2-unit)+unit;
		            var p=new THREE.Vector3();
					var center=new THREE.Vector3(-5,0,-5);
		            // LEG1 topleft
					legHeight=(level-layoutHeights[gridx][gridy]-topHeight); 
		            p=new THREE.Vector3(gridx,gridy,0);
					p.x=gridx + unit/2;  //p.x-sx/2+unit/2;
					p.z=gridy + unit/2; //p.z-sz/2+unit/2;  // >> y of 2d grid
		            p.y=legHeight/2 + layoutHeights[gridx][gridy]; // >> height of 2d grid//legy
					
		            //center
		            p.add(center);
		            p.multiplyScalar(WORLDSCALE);
					var leg1=createBoxPhys( unit*WORLDSCALE, legHeight*WORLDSCALE, unit*WORLDSCALE, brickMass*WORLDSCALE, p,   false ); //sx, sy, sz, mass, pos) 
		         			
					// LEG2 topright
		            legHeight=level-layoutHeights[gridx+gridw-1][gridy]-topHeight; 
		            p=new THREE.Vector3(gridx,gridy,0);
					p.x=gridx + gridw - unit/2;  //p.x-sx/2+unit/2;
					p.z=gridy + unit/2; //p.z-sz/2+unit/2;  // >> y of 2d grid
		            p.y=legHeight/2 + layoutHeights[gridx+gridw-1][gridy]; // >> height of 2d grid//legy
		            //center
		            p.add(center);
		          //  console.log("unit="+unit+"  legheight="+legHeight+"  pos="+p+" lay="+layoutHeights[gridx+gridw-1][gridy]);
					p.multiplyScalar(WORLDSCALE);
					var leg2=createBoxPhys( unit*WORLDSCALE, legHeight*WORLDSCALE, unit*WORLDSCALE, brickMass*WORLDSCALE, p,   false ); //sx, sy, sz, mass, pos) 
			
					// LEG3 bottomright
		            legHeight=level-layoutHeights[gridx+gridw-1][gridy+gridh-1]-topHeight; 
		            p=new THREE.Vector3(gridx,gridy,0);
					p.x=gridx + gridw - unit/2;  //p.x-sx/2+unit/2;
					p.z=gridy + gridh - unit/2; //p.z-sz/2+unit/2;  // >> y of 2d grid
		            p.y=legHeight/2 + layoutHeights[gridx+gridw-1][gridy+gridh-1]; // >> height of 2d grid//legy
		            //center
		            p.add(center);
					p.multiplyScalar(WORLDSCALE);
					var leg3=createBoxPhys( unit*WORLDSCALE, legHeight*WORLDSCALE, unit*WORLDSCALE, brickMass*WORLDSCALE, p,   false ); //sx, sy, sz, mass, pos) 
					
					// LEG5 bottomleft
		            legHeight=level-layoutHeights[gridx][gridy+gridh-1]-topHeight; 
		            p=new THREE.Vector3(gridx,gridy,0);
					p.x=gridx + unit/2;  //p.x-sx/2+unit/2;
					p.z=gridy + gridh - unit/2; //p.z-sz/2+unit/2;  // >> y of 2d grid
		            p.y=legHeight/2 + layoutHeights[gridx][gridy+gridh-1]; // >> height of 2d grid//legy
		            //center
		            p.add(center);
					p.multiplyScalar(WORLDSCALE);
					var leg4=createBoxPhys( unit*WORLDSCALE, legHeight*WORLDSCALE, unit*WORLDSCALE, brickMass*WORLDSCALE, p,   false ); //sx, sy, sz, mass, pos) 
					
		            // tabletop
			        p.x=gridx +gridw/2;  //p.x-sx/2+unit/2;
					p.z=gridy+gridh/2 ; //p.z-sz/2+unit/2;  // >> y of 2d grid
		            p.y=level-topHeight/2; // >> height of 2d grid//legy
		            //center
		            p.add(center);
					p.multiplyScalar(WORLDSCALE);
					var top=createBoxPhys( gridw*WORLDSCALE, topHeight*WORLDSCALE, gridh*WORLDSCALE, brickMass*WORLDSCALE, p,   true ); //sx, sy, sz, mass, pos) 
					


		         	 //  createBoxPhys( gridw, unit, gridh, 1000, new THREE.Vector3(0,unit/2,0) ); //sx, sy, sz, mass, pos) 
				  	updateLayoutHeights(gridx,gridy, gridw,gridh, level);  //x y  w h  level
				  	leg1.receiveShadow=false;
				  	leg2.receiveShadow=false;
				  	leg3.receiveShadow=false;
				  	leg4.receiveShadow=false;
				  	var lt=new LayoutTable(leg1,leg2,leg3,leg4,top);
				  	layoutTables.push(lt);
				 }
        }

	function createTable( sx, sy, sz, mass, pos, quat, material)
		{	
			// scale >> trick to simulate in slow motion
			pos.multiplyScalar(WORLDSCALE);
			sx*=WORLDSCALE; sy*=WORLDSCALE;	sz*=WORLDSCALE;

			// Wall
			var sc=WORLDSCALE;
			var brickMass = 0.5*sc;
			var brickLength = 1.2*sc;
			var brickDepth = 0.6*sc;
			var brickHeight = brickLength * 0.5*sc;
			
			var unit=0.5*sc;

			var group=new THREE.Group();
			var legy=sy/2-unit/2+pos.y;
			var p=new THREE.Vector3();
			
			p.copy(pos);
			p.x=p.x-sx/2+unit/2;
			p.y=legy;
			p.z=p.z-sz/2+unit/2;
			createBoxPhys( unit, sy-unit, unit, mass, p );
            // leg1.castShadow = true;
			//	leg1.receiveShadow = true;

			
			p.copy(pos);
			p.x=p.x+sx/2-unit/2;
			p.y=legy;
			p.z=p.z+sz/2-unit/2;
			createBoxPhys( unit, sy-unit, unit, mass, p );
	
			p.copy(pos);
			p.x=p.x+sx/2-unit/2;
			p.y=legy;
			p.z=p.z-sz/2+unit/2;
			createBoxPhys( unit, sy-unit, unit, mass, p );
			
			p.copy(pos);
			p.x=p.x-sx/2+unit/2;
			p.y=legy;
			p.z=p.z+sz/2-unit/2;
			createBoxPhys( unit, sy-unit, unit, mass, p );
			
			p.copy(pos);
			p.y=pos.y+sy-unit/2;
            createBoxPhys(  sx, unit, sz, 0.5, p );
			
			var objHeight=1*WORLDSCALE;
			p.copy(pos);
			p.y=pos.y+sy+objHeight/2.0;
            createBoxPhys(  sx/2, objHeight, sz/2, 1, p );
			
		
		}

	
   function createPlinth()
    {   
        var points=[];
        var aspect=0.6667;//6x4 gridsize
        var unit=0.06;
        var cx=0,cy=0;
    
        points.push(new THREE.Vector2(cx,cy));
        cx=3 *1.6 ; //6x4 gridsize // 
        cy=0;
        points.push(new THREE.Vector2(cx,cy));
        //up 1------------------------------
        cy+=2*unit;
        points.push(new THREE.Vector2(cx,cy));
        //bevel
        cy+=unit;
        cx-=unit;
        points.push(new THREE.Vector2(cx,cy));
        //up 2------------------------------
        cy+=3*unit;
        points.push(new THREE.Vector2(cx,cy));
        //bevel
        cy+=unit;
        cx-=unit;
        points.push(new THREE.Vector2(cx,cy));
        //up ------------------------------
        cy+=2*unit;
        points.push(new THREE.Vector2(cx,cy));
        //bevel big
        cy+=1.5*unit;
        cx-=3*unit;
        points.push(new THREE.Vector2(cx,cy));
        //up big ------------------------------
        cy+=12*unit;
        points.push(new THREE.Vector2(cx,cy));
        //bevel reverse
        cy+=1.5*unit;
        cx+=2*unit;
        points.push(new THREE.Vector2(cx,cy));
        //up 1------------------------------
        cy+=1*unit;
        points.push(new THREE.Vector2(cx,cy));
        //bevel reverse
        cy+=0.5*unit;
        cx+=1.5*unit;
        points.push(new THREE.Vector2(cx,cy));
        //up 1------------------------------
        cy+=1*unit;
        points.push(new THREE.Vector2(cx,cy));

         //bevel
        cy+=1*unit;
        cx-=1*unit;
        points.push(new THREE.Vector2(cx,cy));

        //close
        points.push(new THREE.Vector2(0,cy));
        
        updateLayoutHeights(2,3, 6,4, cy);
		var pos=new THREE.Vector3(0,0,0);
        pos.multiplyScalar(WORLDSCALE);


       
        for (var i=0;i<points.length;i++)
            {//points[i]=new THREE.Vector2(Math.random()*0.5+1,i*yf);
                points[i].multiplyScalar(WORLDSCALE);
            }
        
       // var geo=createLathePhys(points,4,0.5,pos);
       

		var lathe, material;
		var lathe_geometry=new THREE.LatheGeometry(points,4);
		var box_geometry=new THREE.BoxGeometry(6,cy,4);
		
		lathe_geometry.rotateY(Math.PI/4);
        lathe_geometry.scale(1,1,aspect);
		lathe_geometry.computeBoundingBox();
	//	lathe_geometry.translate(0,cy/2,0);
		//lathe_geometry.applyMatrix();
		lathe_geometry.center();
			material = Physijs.createMaterial(
				//new THREE.MeshLambertMaterial(),
					new THREE.MeshPhongMaterial({color:0xffffff}),
					.6, // medium friction
					.3 // low restitution
			    	);
		
        	material.shading = THREE.FlatShading; 
					lathe = new Physijs.BoxMesh(//new Physijs.ConvexMesh(
					lathe_geometry,//lathe_geometry,
					material
		    		);
			
            lathe.collisions = 0;
			lathe.lastCollision=0;
			//lathe.position.set(pos.x, pos.y, pos.z);
			lathe.position.set(0, cy*WORLDSCALE/2, 0);
			lathe.castShadow = true;
			lathe.receiveShadow=false;
			lathe.addEventListener( 'collision', handleCollision );
			lathe.addEventListener( 'ready', ready );
			
            physiBodies.push(lathe);
            scene_physi.add( lathe );

        
        //createBoxPhys(6,cy,4,100,new THREE.Vector3(0,cy/2,0));//(sx, sy, sz, mass, pos) 
    }