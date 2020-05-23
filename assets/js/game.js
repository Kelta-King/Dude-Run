var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
		physics: {
			default: 'arcade',
			arcade: {
				gravity:{y:300},
				debug: false
			}
		},
        scene: {
            preload: preload,
            create: create,
            update: update,
			render: render
        },
		
    };
var game = new Phaser.Game(config);
	var platforms;
	var player;
	var cursors;
	var stars;
	var score=0;
	var scoreText;
	var bombs;
	var music;
	var audiodata;
	var jumpsound;
	var audioConfig = {
		mute: false,
		volume: 1,
		rate: 1,
		detune: 0,
		seek: 0,
		loop: false,
		delay: 0
	}
	var audioConfigbg = {
		mute: false,
		volume: 1,
		rate: 1,
		detune: 0,
		seek: 0,
		loop: true,
		delay: 0
	}
	var gosound;
	var starsound;
	var grav=300;
	
    function preload ()
    {
		this.load.image('sky','assets/sky.png');
		this.load.image('bomb','assets/bomb.png');
		this.load.image('ground','assets/platform.png');
		this.load.image('star','assets/star.png');
		this.load.spritesheet('dude', 'assets/dude.png',{frameWidth: 32, frameHeight: 48});
		this.load.audio('bgaudio', ['assets/audio/518899__szymalix__cm.wav']);
		this.load.audio('jumpaudio', ['assets/audio/386647__jalastram__sfx-jump-15.wav']);
		this.load.audio('goaudio', ['assets/audio/487124__sjleilani__game-over.m4a']);
		this.load.audio('staraudio', ['assets/audio/518733__robinhood76__08935-game-gold-bonus.wav']);
    }

    function create ()
    {
		this.add.image(400, 300, 'sky');
		scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
		bombs = this.physics.add.group();
		
		platforms = this.physics.add.staticGroup();
		
		platforms.create(400,568, 'ground').setScale(2).refreshBody();
		platforms.create(600, 400, 'ground');
		platforms.create(50, 250, 'ground');
		platforms.create(750, 220, 'ground');
		
		player = this.physics.add.sprite(100, 450, 'dude');
		player.body.setGravityY(grav);
		this.physics.add.collider(player, platforms);
		
		player.setBounce(0.2);
		player.setCollideWorldBounds(true);

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [ { key: 'dude', frame: 4 } ],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});
		
		stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 }
		});

		stars.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});
		
		this.physics.add.collider(stars, platforms);
		this.physics.add.overlap(player, stars, collectStar, null, this);
		
		function collectStar (player, star)
		{
			starsound.play();
			star.disableBody(true, true);
			score+=10;
			scoreText.setText("Score: "+score);
			
			if(stars.countActive(true) === 0){
			
				stars.children.iterate(function (child) {
					child.enableBody(true, child.x, 0, true, true);
				});
				
				var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

				var bomb = bombs.create(x, 16, 'bomb');
				bomb.setBounce(1);
				bomb.setCollideWorldBounds(true);
				bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
		
			}
		}
		
		this.physics.add.collider(platforms, bombs);
		this.physics.add.collider(player, bombs, hitBomb, null, this);
		
		function hitBomb (){
		
			this.physics.pause();
			player.setTint(0xff0000);
			player.anims.play('turn');
			gameOver = true;
			gosound.play();
			music.stop();
			jumpsound.stop();
		}
		
		music = this.sound.add('bgaudio', audioConfigbg);
		jumpsound = this.sound.add('jumpaudio', audioConfig);
		gosound = this.sound.add('goaudio', audioConfig);
		starsound = this.sound.add('staraudio', audioConfig);
		music.play();
		
    }

    function update ()
    {
		cursors = this.input.keyboard.createCursorKeys();
		
		if(cursors.left.isDown){
			player.setVelocityX(-160);
			player.anims.play('left', true)
		}
		else if(cursors.right.isDown){
			player.setVelocityX(160);
			player.anims.play('right', true)
		}
		else{
			player.setVelocityX(0);
			player.anims.play('turn');
		}
		
		if (cursors.space.isDown && player.body.touching.down){
			jumpsound.play();
			player.setVelocityY(-500);
		}
    }
	
	function render() {
		
		game.debug.soundInfo(music, 20, 32);
	
	}
