var btns=[];
var btnContinuar, btnOpciones, opcion_menu, opcion_personajes, opcion_musica, opcion_creditos, btn_volver, btn_mapa;
//Se ejecuta cuando se carga la pantalla
window.onload = inicio;

function inicio() {
    iniciarvariables();
  //cargarBotones();
  startNewGame();


}

function cargarBotones(){

    btnContinuar = document.getElementById("btnContinuar");
    btnOpciones = document.getElementsByClassName("btnOpciones");
    btnMusica = document.getElementById("btnMusica");
    opcion_menu = document.getElementById("opcion_menu");
    opcion_personajes = document.getElementById("opcion_personajes");
    opcion_musica = document.getElementById("opcion_musica");
    opcion_creditos = document.getElementById("opcion_creditos");
    btn_volver = document.getElementById("boton_volver");
    btn_mapa = document.getElementById("boton_mapa");
    btnRestart = document.getElementById("prueba");
    console.log(btnRestart);
 }

function iniciarvariables() {

  btns.push(document.getElementById("btnContinuar"));
  btns.push(document.getElementsByClassName("btnOpciones"));
  btns.push(document.getElementById("btnMusica"));
  btns.push(document.getElementById("opcion_menu"));
  btns.push(document.getElementById("opcion_personajes"));
  btns.push(document.getElementById("opcion_musica"));
  btns.push(document.getElementById("opcion_creditos"));
  btns.push(document.getElementById("boton_volver"));
  btns.push(document.getElementById("boton_mapa"));
  btns.push(document.getElementById("prueba"));

}

function startNewGame(){

    var gameOver = false;
    var checkpoints = [false, false, false];
    var btnContinuar, btnOpciones, opcion_menu, opcion_personajes, opcion_musica, opcion_creditos, btn_volver, btn_mapa ,btnRestart;
    
    var config = {
        type: Phaser.AUTO,
        width: 360,
        height: 640,
        parent:"pantalla_game",
        physics: {
            default: 'arcade',
            arcade: {
                debug: true,
                gravity: { y: 0 }
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };
        
    
    var game = new Phaser.Game(config);
    var sprite;
    var scoreText;
    var checkp1;
    var score = 0;
    var btnOpciones;
    var asteroids;
    var stars;
    var timedEvent;
    var isChoque =  false;
    var counAsteroids = 0;
    var progress = 0;
    var fails=0;
    var collectedStars=0;
    var currentCheckPoint=0;
    var bandera = 0;
    var banderaPausa=0;
   
    
    function preload ()
    {   
        cargarImagenes(this);
        
    }
    
    function cargarImagenes(game){
        //Aca se cargan la imagenes del juego, es decir los sprites
        game.load.image('fondo_juego','../img/fondo_juego.gif');
        game.load.image('dude','../img/personaje.png');
        game.load.image('conteo','../img/simbolo_conteo_estrellas.png')
        game.load.image('asteroide_derecha_grande','../img/asteroide_derecha_grande.png');
        game.load.image('asteroide_izquierda_grande','../img/asteroide_izquierda_grande.png');
        game.load.image('asteroide_derecha_pequeño','../img/asteroide_derecha_pequeño.png');
        game.load.image('asteroide_izquierda_pequeño','../img/asteroide_izquierda_pequeño.png');
        game.load.image('msmCheck','../img/frase_check_point.png');
        game.load.image('opciones_juego','../img/opciones_juego.png');
        game.load.image('estrella','../img/estrellas_recolectar_juego.png');
        game.load.image('check1','../img/check_point.png');
        game.load.image('btnNuevaPartida','../img/boton_nueva_partida.png');
        
    }
    
    function create ()
    {   

        
        //document.getElementById("prueba").addEventListener("mousedown",restartGame(this));
        //btn restart
        prueba.addEventListener("click",restartGame.bind(this));

    //Funcion restart
    function restartGame(){

        this.sys.game.destroy(true);
        console.log('Restart game');
        startNewGame();
     }

     //Funcion pausa
    function pauseGame(thisGame){

        thisGame.scene.pause('default');

     }
        
         
        //Asignar el fondo del juego
        this.add.image(180, 320, 'fondo_juego');
    
        //iconos del juego
        this.add.image(24, 24,'conteo').setOrigin(0);
        scoreText = this.add.text(60, 30, '0',{fontFamily: 'Akrobat', fontStyle: '900', color: '#ecdeb5',fontSize: '15px'});
        btnOpciones = this.add.sprite(308, 24,'opciones_juego').setInteractive();
        btnOpciones.setOrigin(0);
    
        //Botones acciones
        btnOpciones.on('pointerdown',function () {
            asteroids.setVelocity(0,0);
            cambiarPantalla(pantalla_game, pantalla_opciones);
        });
        
        //Grupo de asteroides, es decir los obstaculos
        asteroids = this.physics.add.group();
        //Grupo de estrellas
        stars = this.physics.add.group();
        //Eventos para crear las estrellas y los planetas
        timedEvent = this.time.addEvent({ delay: 5000, callback: createStar, callbackScope: this, loop: true });
        timedEvent = this.time.addEvent({ delay: 4000, callback: createAsteroids, callbackScope: this, loop: true });
        
        //Personaje
        sprite = this.add.image(180, 560, 'dude');
    
        //Fisica del video juego
        this.physics.world.enable(sprite);
        sprite.body.setCollideWorldBounds(true);
        sprite.setInteractive({ draggable: true });
        this.physics.add.collider(sprite, asteroids);
        this.physics.add.collider(asteroids,asteroids);
        
        //Recolector de estrellas
        this.physics.add.overlap(sprite, stars, collectStar, null, this);
        this.physics.add.overlap(sprite, checkp1, check, null, this);
    
        //Detectar la colision entre Baldur y los asteroides
        this.physics.add.overlap(sprite, asteroids, choque, null, this);   


        //Llamar funcion restart
        // bandera=1;
        // if (bandera!=0) {
        //    restartGame(this);
        //}

        function createStar() {

            var rdn = Math.floor(Math.random()*4)+1;
            var otherStar;
        
            if (isChoque==false && bandera==0) {
        
                switch (rdn) {
        
                    case 1:
                        otherStar = stars.create(randomNum(20,300), 0,'estrella');
                        otherStar.setScale(1);
                        otherStar.setVelocity(0,50);
                        break;
                    case 2:
                        otherStar = stars.create(randomNum(20,300), 0,'estrella');
                        otherStar.setScale(1.3);
                        otherStar.setVelocity(0,50);
                        break; 
                    case 3:
                        otherStar = stars.create(randomNum(20,300), 0,'estrella');
                        otherStar.setScale(1.6);
                        otherStar.setVelocity(0,50);
                        break;     
                    case 4:
                        otherStar = stars.create(randomNum(20,300), 0,'estrella');
                        otherStar.setScale(1.9);
                        otherStar.setVelocity(0,50);
                        break;   
                
                    default:
                        break;
                }
               
            }
        
         }

         function createAsteroids() {

            var rdn = Math.floor(Math.random()*4)+1;
            var otherAsteroid;
        
            if (isChoque==false && bandera ==0) {
        
                switch (rdn) {
        
                    case 1:
                        otherAsteroid = asteroids.create(25, -100,"asteroide_izquierda_grande").body.setCircle(100);
                        otherAsteroid.setVelocity(0,80);
                        counAsteroids++;
                        break;
                    case 2:
                        otherAsteroid = asteroids.create(randomNum(100,200), -140,"asteroide_derecha_pequeño").body.setCircle(80);
                        otherAsteroid.setVelocity(0,90);
                        counAsteroids++;
                        break; 
                    case 3:
                        otherAsteroid = asteroids.create(randomNum(160,260), -200,"asteroide_izquierda_pequeño").body.setCircle(80);
                        otherAsteroid.setVelocity(0,100);
                        counAsteroids++;
                        break;     
                    case 4:
                        otherAsteroid = asteroids.create(335, -220,"asteroide_derecha_grande").body.setCircle(100);
                        otherAsteroid.setVelocity(0,110);
                        counAsteroids++;
                        break;   
                
                    default:
                        break;
                }
               
            }
        
         }

         function collectStar (player, star){
            star.disableBody(true, true);
        
            //  Add and update the score
            score += 20;
            scoreText.setText('Score: ' + score);
        
            //llegada al checkpoint
            if (score==40||counAsteroids>10) {
        
                //Checks points
                checkp1 = this.physics.add.group();
                isChoque = true;
                var ch = checkp1.create(160,350,"check1");
                ch.setAlpha(0, 0, 1, 1);
                ch.body.setCollideWorldBounds(true);
                ch.setVelocity(0,120);
        
                //Annadir el mensaje de checkpoint
                this.add.image(180, 180,'msmCheck')
                //Detener las estrellas
                asteroids.setVelocity(0,0);
                stars.setVelocity(0,0);
                
            }
         }

          //Funcion para captuar el choque de los asteroides
 function choque(){

    isChoque = true;
    bntRestart = this.add.sprite(130,300,'btnNuevaPartida').setInteractive();
    //game.state.start(game.state.current);
    bntRestart.setOrigin(0);
    bntRestart.setScale(1.5);
    asteroids.setVelocity(0,0);
    stars.setVelocity(0,0);
 }

 function check(player, checkp1){
    checkp1.disableBody(true, true);
    
    
 }

         function randomNum(max,min){
            return Math.floor(Math.random() * ((max+1) - min) + min);
            }


     
    }
    
    function update ()
    {
        console.log('mover sprite');
        sprite.on('drag', function (pointer, dragX, dragY) {
            this.x = dragX;
        });
    }
    

}