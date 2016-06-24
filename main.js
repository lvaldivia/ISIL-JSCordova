window.onload = function(){
	var game = new Phaser.Game(360,700,Phaser.AUTO);
	game.state.add('Preload',Preload);
	game.state.add('Game',Game);
	game.state.start('Preload');
}