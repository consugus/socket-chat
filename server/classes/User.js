class Users {
    // La clase se va a encargar de todas las acciones necesarias para manejar a los usuarios conectados

    constructor(){
        this.personas = [];
    };

    agregarPersona(id, nombre, sala){
        let persona = {id, nombre, sala};
        this.personas.push(persona);
        return this.personas;
    };

    getPersonaById(id){
        let persona = this.personas.filter( (persona) => { return persona.id === id; })[0];
        // la función filter retorna un arreglo, por lo que se pide que devuelva el
        //objeto que está en la primera posición

        if ( !persona ) {
            return `No se encuentra una persona con el id: ${id}`;
        }
        return persona;
    };

    getPersonas(){
        return this.personas;
    };

    getPersonasByRoom( sala ){
        let personasEnSala = this.personas.filter( (persona) => { return persona.sala === sala } );
        return personasEnSala;
     };

    deletePersonaById(id){
        let personaBorrada = this.getPersonaById(id);
        // primero almaceno la persona a borrar porque sino después no la voy a tener
        this.personas = this.personas.filter (  (persona) => { return persona.id !== id; }); // array
        // return personaBorrada;
        return personaBorrada;
    };


};


module.exports = { Users };