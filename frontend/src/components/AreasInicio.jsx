import React from 'react'
import astro from '../image/astro.png'
import biology from '../image/biology.png'
import physics from '../image/physics.png'
import computing from '../image/computing.png'
import math from '../image/math.png'
import chemistry from '../image/chemistry.png'
import robotics from '../image/robotics.png'
import AreaCard from './AreaCard';
import Footer from './Footer';

function Areas() {
  return (
    <>
    <main className='font-comfortaa flex-grow' style={{backgroundColor: '#F4F8FA'}}>
        <section>
            <div className='px-96 py-10 text-center space-y-10'>
                <h2 className='text-3xl text-black'>Áreas de Competencia</h2>
                <p>Explora nuestras diferentes áreas de competencia y descubre los requisitos para participar en cada una de ellas</p>
            </div>
        </section>
        <section className='py-20 space-y-8'>
            <AreaCard
                imageArea={astro}
                title="Astronomía y Astrofísica"
                description="Estudia los cuerpos celestes, como planetas, estrellas, galaxias y todo lo que existe en el universo, así como los principios físicos que rigen su comportamiento. Explora los misterios del cosmos y comprende los fenómenos celestes."
                grade="3ro primaria a 6to secundaria"
            />
            <AreaCard
                imageArea={biology}
                title="Biología"
                description="Investiga los seres vivos, su estructura, función, crecimiento, evolución y distribución para comprender mejor cómo funciona la vida en nuestro planeta. Descubre los secretos de la vida y los sistemas biológicos que nos rodean."
                grade="2do a 6to secundaria"
            />
            <AreaCard
                imageArea={physics}
                title="Física"
                description="Analiza los componentes fundamentales del universo y las fuerzas que actúan entre ellos, desde las partículas subatómicas hasta las galaxias más distantes."
                grade="4to a 6to secundaria"
            />
            <AreaCard
                imageArea={computing}
                title="Informática"
                description="Se centra en el procesamiento automático de información mediante computadoras, abarcando áreas como programación, algoritmos, inteligencia artificial y ciencia de datos."
                grade="5to primaria a 6to secundaria"
            />
            <AreaCard
                imageArea={math}
                title="Matemática"
                description="Explora el mundo de los números, patrones y relaciones. La matemática es fundamental para entender el universo y resolver problemas complejos en todas las disciplinas científicas."
                grade="1ro a 6to secundaria"
            />
            <AreaCard
                imageArea={chemistry}
                title="Química"
                description="Estudia la composición, estructura, propiedades y cambios de la materia, explorando cómo los átomos y moléculas interactúan para formar diferentes sustancias."
                grade="2do a 6to secundaria"
            />
            <AreaCard
                imageArea={robotics}
                title="Robótica"
                description="Combina la ingeniería, la programación y la electrónica para diseñar y construir robots que pueden realizar tareas autónomas o asistidas por humanos."
                grade="5to primaria a 6to secundaria"
            />
        </section>
    </main>
    <Footer />
    </>
  );
}

export default Areas