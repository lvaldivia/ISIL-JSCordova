Game= function(){

}

Game.prototype = {
	create:function(){
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.gameData = JSON.parse(this.game.cache.getText('level'));
		this.game.physics.arcade.gravity.y = 1000;
		this.game.world.setBounds(0,0,360,700);
		this.player = this.game.add.sprite(this.gameData.playerStart.x,
			this.gameData.playerStart.y,'player',3);
		this.player.animations.add('walking',[0,1,2,1],6,true);
		this.game.physics.arcade.enable(this.player);
		//this.player.body.allowGravity = false;
		this.player.anchor.setTo(0.5);
		this.keys = this.game.input.keyboard.createCursorKeys();
		this.player.body.collideWorldBounds = true;
		this.platforms = this.game.add.group();
		this.platforms.enableBody = true;
		this.gameData.platformData.forEach(function(plat){
			this.platforms.create(plat.x,plat.y,'platform');
		},this);

		this.platforms.setAll('body.allowGravity',false);
		this.platforms.setAll('body.immovable',true);
		this.ground = this.game.add.sprite(0,638,'ground');
		this.game.physics.arcade.enable(this.ground);
		this.ground.body.immovable = true;
		this.ground.body.allowGravity = false;

		this.gorilla = this.game.add.sprite(this.gameData.goal.x,
				this.gameData.y,'gorilla');
		this.game.physics.arcade.enable(this.gorilla);
		this.barrils = this.game.add.group();
		this.barrilsSpawnTime = this.gameData.barrelFrequency * 1000;
		this.elapsed = 0;

		this.fires = this.game.add.group();
		this.fires.enableBody = true;
		this.gameData.fireData.forEach(function(fire){
			var fire = new Phaser.Sprite(this.game,fire.x,fire.y,'fire');
			fire.animations.add('fire',[0,1],6,true);
			fire.animations.play('fire');
			this.fires.add(fire);
			fire.body.allowGravity = false;
			
		},this);

		this.player.customProps = {left:false,right:false,up:false};
		this.createControls();
	},

	createControls:function(){
		this.leftButton = this.game.add.sprite(0,0,'arrowButton');
		this.leftButton.y = this.game.height - this.leftButton.height;
		this.leftButton.inputEnabled = true;

		this.leftButton.events.onInputDown.add(function(){
		  this.player.customProps.left = true;
		  
		},this);

		this.leftButton.events.onInputUp.add(function(){
		  this.player.customProps.left = false;
		},this);

		this.rightButton = this.game.add.sprite(this.leftButton.width + 10
		                    ,0,'arrowButton');
		                    
		this.rightButton.events.onInputDown.add(function(){
		  this.player.customProps.right = true;
		  
		},this);

		this.rightButton.events.onInputUp.add(function(){
		  this.player.customProps.right = false;
		},this);
		                    
		this.rightButton.y = this.game.height - this.leftButton.height;
		this.rightButton.inputEnabled = true;

		this.actionButton = this.game.add.sprite(0,0,'actionButton');
		this.actionButton.y = this.game.height - this.actionButton.height;
		this.actionButton.x = this.game.width - this.actionButton.width;
		this.actionButton.inputEnabled = true;

		this.actionButton.events.onInputDown.add(function(){
		  this.player.customProps.up = true;
		},this);

		this.actionButton.events.onInputUp.add(function(){
		  this.player.customProps.up = false;
		},this);

	},

	update:function(){
		this.elapsed +=this.game.time.elapsed;
		if(this.elapsed>=this.barrilsSpawnTime){
			this.elapsed = 0;
			this.generateBarryl();
		}
		this.game.physics.arcade.collide(this.barrils,this.platforms);
		this.game.physics.arcade.collide(this.ground,this.barrils);
		this.game.physics.arcade.collide(this.player,this.ground);
		this.game.physics.arcade.collide(this.player,this.platforms);
		this.game.physics.arcade.collide(this.gorilla,this.platforms);
		this.game.physics.arcade.collide(this.fires,this.platforms);
		this.player.body.velocity.x = 0;

		if(this.keys.left.isDown || this.player.customProps.left){
			this.player.scale.setTo(1);
			this.player.body.velocity.x = -100;
			this.player.animations.play('walking');
		}else if(this.keys.right.isDown || this.player.customProps.right){
			this.player.body.velocity.x = 100;
			this.player.scale.setTo(-1,1);
			this.player.animations.play('walking');
		}else {
			this.player.animations.stop();
			this.player.frame = 3;
		}

		this.barrils.forEach(function(element){
            if(element.x< 10 && element.y > 600){
              element.kill();
            }
    	},this);

		if(this.player.body.touching.down && (this.keys.up.isDown || this.player.customProps.up)){
			this.player.body.velocity.y = -550;
		}

	},
	generateBarryl:function(){
		var barryl =this.game.add.sprite(this.gameData.goal.x,
				this.gameData.goal.y,'barrel');
		this.barrils.add(barryl);
		this.game.physics.arcade.enable(barryl);
		barryl.body.bounce.setTo(1,0);
		barryl.body.velocity.x = this.gameData.barrelSpeed;
		barryl.body.collideWorldBounds = true;
	}
}