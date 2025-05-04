import React from 'react'
import Footer from './Footer'
import eye from '../image/eye.png'
import flag from '../image/flag.png'
import historyAbout from '../image/historyAbout.png'
import calendar from '../image/calendar.png'
import user from '../image/user.png'
import compass from '../image/compass.svg'

function Acercade() {
  return (
    <>
    <main className='font-comfortaa flex-grow px-40' style={{backgroundColor: '#F4F8FA'}}>
      <section className='py-8 space-y-10'>
        <div className='text-center space-y-14'>
          <h2 className='text-3xl text-black'>Acerca de Oh Sansi</h2>
          <p>Las olimpiadas científicas estudiantiles Oh Sansi son un espacio de fomento y desarrollo del talento científico juvenil</p>
        </div>
        <div className='flex flex-row justify-between space-x-16'>
          <div className='flex flex-col rounded-2xl p-10 space-y-5 shadow-xl' style={{backgroundColor: '#0284C70D'}}>
            <div className='flex flex-row space-x-3 w-80 px-10'>
              <img src={flag} alt="Icon Mision" className='h-7'/>
              <h3 className='text-lg text-azulPersonalizado'>Nuestra Misión</h3>
            </div>
            <p>Promover la excelencia científica entre los estudiantes a través de competencias que estimulen su interés por la ciencia, 
              tecnología, ingeniería y matemáticas. Buscamos descubrir y desarrollar el talento científico del país desde temprana edad.</p>
          </div>
          <div className='flex flex-col rounded-2xl p-10 space-y-5 shadow-xl' style={{backgroundColor: '#0284C70D'}}>
            <div className='flex flex-row space-x-3 w-80 px-10'>
              <img src={eye} alt="Icon Vision" className='h-7'/>
              <h3 className='text-lg text-azulPersonalizado'>Nuestra Visión</h3>
            </div>
            <p>Ser el programa de olimpiadas científicas más prestigioso y reconocido del país, creando una red de jóvenes talentos que 
              representen al país en competencias internacionales y contribuyan al desarrollo científico y tecnológico.</p>
          </div>
        </div>
      </section>
      <section className='pt-20 space-y-10 pb-24'>
        <h3 className='text-center text-2xl'>Historia de las Olimpiadas</h3>
        <div className='flex flex-row space-x-20 items-center'>
          <div className='border rounded-2xl p-14' style={{backgroundColor: '#F6F6F6', borderWidth: '6px', borderColor: '#EFEFEF'}}>
            <p>Las Olimpiadas en Ciencia y Tecnología (OH SANSI) son un evento anual organizado por la Facultad de Ciencias y Tecnología (FCyT) 
              de la Universidad Mayor de San Simón (UMSS) en Cochabamba, Bolivia. Estas olimpiadas están dirigidas a estudiantes de educación básica 
              y secundaria de todo el país, con el objetivo de descubrir, estimular y desafiar a jóvenes talentosos en diversas áreas científicas y 
              tecnológicas. Las disciplinas incluidas en las competencias abarcan Matemáticas, Física, Astronomía, Astrofísica, Biología, Informática 
              y Robótica, entre otras. Las sedes de competencia varían según la disciplina, y la FCyT se encarga de coordinar y organizar las diferentes 
              actividades y pruebas. A lo largo de los años, las OH SANSI se han consolidado como un espacio importante para fomentar el interés por la 
              ciencia y la tecnología entre los jóvenes bolivianos, contribuyendo al desarrollo académico y profesional en estas áreas.</p>
          </div>
          <img src={historyAbout} alt="Image About Page" className='h-80' />
        </div>
      </section>
      <section className='pb-20 space-y-14'>
        <h3 className='text-center text-2xl'>¿Por qué participar?</h3>
        <div className='flex flex-row space-x-10 justify-between w-full'>
          <div className='bg-white border rounded-3xl flex flex-col items-center p-8 space-y-5' style={{borderWidth: '5px', borderColor: '#EFEFEF'}}>
            <div className='rounded-full p-8' style={{backgroundColor: '#0284C726'}}>
              <img src={calendar} alt="Icon Desarrollo Academico" className='h-8'/>
            </div>
            <h4 className='text-2xl font-semibold'>Desarrollo académico</h4>
            <p className='text-center'>Potencia tus habilidades y conocimientos en tu área de interés</p>
          </div>
          <div className='bg-white border rounded-3xl flex flex-col items-center p-8 space-y-5' style={{borderWidth: '5px', borderColor: '#EFEFEF'}}>
            <div className='rounded-full p-8' style={{backgroundColor: '#E0888826'}}>
              <img src={user} alt="Icon Reconocimiento" className='h-8'/>
            </div>
            <h4 className='text-2xl font-semibold'>Reconocimiento</h4>
            <p className='text-center'>Obtén certificados y premios que destacarán en tu perfil académico</p>
          </div>
          <div className='bg-white border rounded-3xl flex flex-col items-center p-8 space-y-5' style={{borderWidth: '5px', borderColor: '#EFEFEF'}}>
            <div className='rounded-full p-8' style={{backgroundColor: '#23263D26'}}>
              <img src={compass} alt="Icon Experiencia" className='h-8'/>
            </div>
            <h4 className='text-2xl font-semibold'>Nuevas Experiencias</h4>
            <p className='text-center'>Conoce a otros estudiantes apasionados por la ciencia y forma conexiones</p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  )
}

export default Acercade;