import React, { useState } from 'react';
import astronomia from '../image/astronomia.png';
import biologia from '../image/biologia.png';
import fisica from '../image/fisica.png';
import informatica from '../image/informatica.png';
import matematica from '../image/matematica.png';
import quimica from '../image/quimica.png';
import robotica from '../image/robotica.png';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const slides = [
  {
    img: astronomia,
    title: "Astronomía y Astrofísica",
    desc: "Estudia los cuerpos celestes, como planetas, estrellas, galaxias y todo lo que existe en el universo, así como los principios físicos que rigen su comportamiento."
  },
  {
    img: biologia,
    title: "Biología",
    desc: "Investiga los seres vivos, su estructura, función, crecimiento, evolución y distribución para comprender mejor cómo funciona la vida en nuestro planeta."
  },
  {
    img: fisica,
    title: "Física",
    desc: "Analiza los componentes fundamentales del universo y las fuerzas que actúan entre ellos, desde las partículas subatómicas hasta las galaxias más distantes."
  },
  {
    img: informatica,
    title: "Informática",
    desc: "Se centra en el procesamiento automático de información mediante computadoras, abarcando áreas como programación, algoritmos, inteligencia artificial y ciencia de datos."
  },
  {
    img: matematica,
    title: "Matemática",
    desc: "Explora el mundo de los números, patrones y relaciones. La matemática es fundamental para entender el universo y resolver problemas complejos en todas las disciplinas científicas."
  },
  {
    img: quimica,
    title: "Química",
    desc: "Estudia la composición, estructura, propiedades y cambios de la materia, explorando cómo los átomos y moléculas interactúan para formar diferentes sustancias."
  },
  {
    img: robotica,
    title: "Robótica",
    desc: "Combina la ingeniería, la programación y la electrónica para diseñar y construir robots que pueden realizar tareas autónomas o asistidas por humanos."
  },
];

function Carrusel() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full px-4 md:px-16">
      <div className="bg-white rounded-xl shadow-lg pb-7 pt-6 overflow-hidden relative group">
        <div className="relative transition-all duration-700 ease-in-out">
          <div className="w-full h-[500px] overflow-hidden">
            <img
              src={slides[current].img}
              alt={slides[current].title}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          </div>

          <div className="absolute inset-0 bg-black/40 flex items-end justify-start p-6 text-white">
            <div className="w-3/5 text-left">
              <h2 className="text-2xl font-semibold mb-2">{slides[current].title}</h2>
              <p className="text-base">{slides[current].desc}</p>
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute top-1/2 -translate-y-1/2 left-2 bg-white text-black rounded-full p-2 shadow hover:scale-110 transition z-10"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 -translate-y-1/2 right-2 bg-white text-black rounded-full p-2 shadow hover:scale-110 transition z-10"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-6 w-6 rounded-full transition-all duration-300 ${
              idx === current ? "bg-blue-500 scale-110" : "bg-gray-300 hover:bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default Carrusel;

