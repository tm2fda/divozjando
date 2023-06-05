class Caminante{

    constructor(){
        
        this.saltar();
        this.diam = random(15, 40);

        this.vel = 3;
        this.dir = radians(random(360));

        this.elColor = color(random(255), random(255), random(255) );
    }

    //-----------------------------------------------
    actualizar(amplitud, frecuencia, diferencia){
        this.diam = map(amplitud, AMP_MIN, AMP_MAX, 5, 30);
        this.vel = map(amplitud, AMP_MIN, AMP_MAX, 2, 10);

        push();
        colorMode(HSB);
        let tinte = map(frecuencia, FREC_MIN, FREC_MAX, 0, 255, true);
        this.elColor = color(tinte, 255, 255);
        pop();

        this.dir += radians(diferencia);
    }

    //-----------------------------------------------
    saltar(){
        this.x = random(windowWidth);
        this.y = random(windowHeight);
        this.dir = radians(random(360));
        this.elColor = color(random(255), random(255), random(255) );
    }
    
    //-----------------------------------------------
    cambiarTamanio(tam){
        this.diam = tam;
    }

    //-----------------------------------------------
    cambiarColor(nuevoColor){
        this.elColor = nuevoColor;
    }
    //-----------------------------------------------
    mover(){

        this.dir += radians(random(-5, 5));

        this.x = this.x + this.vel * cos(this.dir);
        this.y = this.y + this.vel * sin(this.dir);

        //--------Espacio toroidal---
        this.x = this.x > windowWidth ? this.x - windowWidth :  this.x;
        this.x = this.x < 0 ? this.x + windowWidth : this.x;

        this.y = this.y > windowHeight ? this.y - windowHeight :  this.y;
        this.y = this.y < 0 ? this.y + windowHeight : this.y;
    }
    //-----------------------------------------------
    dibujar(grafico){
  
        grafico.push();
        grafico.fill(this.elColor)
        grafico.noStroke();
        grafico.ellipse(this.x, this.y, this.diam, this.diam);
        grafico.pop();
    }
}