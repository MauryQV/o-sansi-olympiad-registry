import React from 'react'
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Carrusel from './Carrusel';
import StepCard from './StepCard';
import search from '../image/search.svg'
import fileMinus from '../image/fileMinus.svg'
import star from '../image/star.svg'

function Inicio() {
  const navigate = useNavigate();
  return (
    <>
    <main className='font-comfortaa flex-grow' style={{backgroundColor: '#F4F8FA'}}>
      <section className='text-center'>
        <div className='py-20'>
          <h1 className='text-4xl font-extrabold'>Olimpiadas Científicas Estudiantiles</h1>
          <p className='text-md'>Descubre y desarrolla tu talento científico participando en nuestras olimpiadas</p>
        </div>
        <div className='space-x-32'>
          <button onClick={() => navigate('/areas')} className='px-6 py-2 text-white text-sm shadow-sm shadow-black' style={{backgroundColor:'#0284C7'}}>Explorar áreas</button>
          <button onClick={() => navigate('/disciplinas')} className='px-6 py-2 bg-white text-black text-sm shadow-sm shadow-black'>Ver convocatorias</button>
        </div>
      </section>
      <section className='text-center space-y-4 py-24'>
        <h2 className='text-3xl'>Áreas de competencia científica</h2>
        <Carrusel/>
      </section>
      <section className='text-center space-y-10 pb-10'>
        <h2 className='text-3xl'>¡Explora el mundo de la ciencia!</h2>
        <p className='px-96'>Inscríbete de manera rápida y sencilla en distintas competencias académicas. Descubre las categorías disponibles, consulta los requisitos 
          y asegura tu lugar en la competencia. Mantente informado sobre fechas clave, reglamentos y resultados. ¡Demuestra tu talento y lleva tu conocimiento al siguiente nivel!</p>
        <div className='flex flex-row justify-between px-32 py-14'>
          <StepCard
           icon={search}
           title="Explora"
           description="Conoce las diferentes áreas científicas disponibles para competir"
          />
          <StepCard
           icon={fileMinus}
           title="Regístrate"
           description="Crea una cuenta para inscribirte en las competencias"
          />
          <StepCard
           icon={star}
           title="Compite"
           description="Participa y demuestra tus conocimientos científicos"
          />
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}

export default Inicio;