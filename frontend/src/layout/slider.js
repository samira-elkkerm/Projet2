import slider from '../Images/slider.png';
import slider2 from '../Images/slider2.png';
import { useEffect, useState } from "react";

const Slider = () => {
    const slides = [
        {
            titre: "Bienvenue chez Tudert",
            subtitre: "CRÉEZ VOTRE <span style='color: #46A358; font-weight: bold;'>HAVRE DE PAIX</span>",
            description: "Découvrez notre collection exclusive de plantes pour transformer votre maison en un espace verdoyant et apaisant. Des plantes pour chaque style et chaque besoin.",
            img: slider
        },
        {
            titre: "Bienvenue chez Tudert",
            subtitre: "<span style='color: #46A358; font-weight: bold;'> LES PLANTES</span> POUR TOUS LES ESPACES",
            description: "Que vous cherchiez des plantes d'intérieur ou d'extérieur, nous avons ce qu'il vous faut. Des options adaptées à chaque environnement et à chaque niveau d'entretien.",
            img: slider2
        },
        {
            titre: "Bienvenue chez Tudert",
            subtitre: "INSPIREZ-VOUS AVEC <span style='color: #46A358; font-weight: bold;'>LA NATURE</span>",
            description: "Laissez-vous inspirer par nos plantes soigneusement sélectionnées. Chaque plante est une invitation à créer un espace de vie plus sain et plus harmonieux.",
            img: slider
        }
    ];

    const [slide, setSlide] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSlide((prevSlide) => ((prevSlide + 1) % slides.length));
        }, 5000);
        return () => clearTimeout(timer);
    }, [slide]);

    return (
        <>
            <div className="container d-flex justify-content-between align-items-center slider" style={{  padding: '40px 20px' }}>
                <div className='w-50'>
                    <h4 className='mb-3'>{slides[slide].titre}</h4>
                    <h1 className='mb-4' dangerouslySetInnerHTML={{ __html: slides[slide].subtitre }}></h1>
                    <p className='mb-4'>{slides[slide].description}</p>
                    <button className='btn-rounded '>Shop Now</button>
                </div>
                <div className='w-50 d-flex justify-content-end'>
                    <img src={slides[slide].img} style={{ width: '100%', maxWidth: '300px', height: 'auto' }} alt="slide" />
                </div>
            </div>
            <div className='container d-flex justify-content-center' style={{ backgroundColor: "#dad8d1", padding: '10px 5px' }}>
                {slides.map((element, index) => (
                    <span
                        key={index}
                        onClick={() => setSlide(index)}
                        style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: slide === index ? "#46A358" : "#ccc",
                            margin: "0 5px",
                            cursor: "pointer",
                            display: "inline-block",
                        }}
                    ></span>
                ))}
            </div>
        </>
    );
}

export default Slider;