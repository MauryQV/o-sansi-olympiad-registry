import React from 'react'
import '../styles/Footer.css'
import imageFooter from '../image/imageFooter.png'

function Footer() {
  return (
    <footer className='footer'>
        <div className='container-footer'>
            <div className='container-text'>
                <p>Contáctanos:</p>
                <p>olimpiadacientifica@min.edu.bo</p>
                <p>Whatsapp: (+591)71503071 - (+591)78864958</p>
                <p>Teléfonos: 4231765-4215387</p>
                <p>Facultad de Ciencias y Tecnología (UMSS) - Calle Sucre y parque la Torre, Cochabamba</p>
            </div>
            <img src={imageFooter} alt="Image Footer" className='image-footer' />
        </div>
    </footer>
  )
}

export default Footer;
