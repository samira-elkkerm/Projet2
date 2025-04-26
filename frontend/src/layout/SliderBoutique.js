import slider from '../Images/slider2.png';

const Slider = () => {
    const slides = [
        {
            titre: "L'harmonie de la vie et des plantes",
            description: "Découvrez notre collection exclusive de plantes pour transformer votre maison en un espace verdoyant et apaisant. Des plantes pour chaque style et chaque besoin.",
            img: slider
        },
    ];

    return (
        <>
        {slides.map((slide, index) => (
            <div key={index} className="container d-flex justify-content-between align-items-center slider" style={{  padding: '40px 20px' }}>
                <div className='w-50 text-center'>
                    <h4 className='mb-3'>{slide.titre}</h4>
                    <p className='mb-4'>{slide.description}</p>
                    <button className='btn-rounded mx-auto'>Achetez maintenant</button>
                </div>
                <div className='w-50 d-flex justify-content-end'>
                    <img src={slide.img} style={{ width: '100%', maxWidth: '300px', height: 'auto' }} alt="slide" />
                </div>
            </div>
        ))}
        </>
    );
}

export default Slider;