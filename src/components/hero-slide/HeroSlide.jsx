import React, { useEffect, useRef, useState } from 'react'
import SwiperCore, { Autoplay, EffectFade } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useNavigate } from 'react-router-dom'

import Button, { OutlineButton } from './../button/Button'
import Modal, { ModalContent } from './../modal/Modal'

import tmdbApi, { category, movieType } from './../../api/tmdbApi'
import apiConfig from './../../api/apiConfig'

import './hero-slide.scss'

const HeroSlide = () => {
  SwiperCore.use([Autoplay, EffectFade])

  const [movieItems, setMovieItems] = useState([])

  useEffect(() => {
    const getMovies = async () => {
      const params = { page: 1 }
      try {
        const response = await tmdbApi.getMoviesList(movieType.popular, { params })
        setMovieItems(response.results.slice(0, 5))
      } catch {
        console.log('error fetching movies')
      }
    }
    getMovies()
  }, [])

  return (
    <div className="hero-slide">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect={'fade'}
        grabCursor={true}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
      >
        {movieItems.map((item, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <HeroSlideItem item={item} className={`${isActive ? 'active' : ''}`} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {movieItems.map((item, index) => (
        <TrailerModal key={index} item={item} />
      ))}
    </div>
  )
}

const HeroSlideItem = (props) => {
  const navigate = useNavigate()
  const item = props.item

  const background = apiConfig.originalImage(
    item.backdrop_path ? item.backdrop_path : item.poster_path
  )

  const setModalActive = async () => {
    const modal = document.querySelector(`#modal_${item.id}`)
    const videos = await tmdbApi.getVideos(category.movie, item.id)

    if (videos.results.length > 0) {
      const videoSrc = 'https://www.youtube.com/embed/' + videos.results[0].key
      modal.querySelector('.modal__content > iframe').setAttribute('src', videoSrc)
    } else {
      modal.querySelector('.modal__content').innerHTML = 'No trailer available'
    }
    modal.classList.toggle('active')
  }

  return (
    <div
      className={`hero-slide__item ${props.className}`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="hero-slide__item__content container">
        <div className="hero-slide__item__content__info">
          <h2 className="title">{item.title}</h2>
          <div className="overview">{item.overview}</div>
          <div className="btns">
            <Button className="btn-main" onClick={() => navigate(`/movie/${item.id}`)}>
              Watch now
            </Button>
            <OutlineButton className="btn-outline" onClick={setModalActive}>
              View Trailer
            </OutlineButton>
          </div>
        </div>

        <div className="hero-slide__item__content__poster">
          <div className="poster-wrapper">
            <img src={apiConfig.w500Image(item.poster_path)} alt={item.title} />
          </div>
        </div>
      </div>
    </div>
  )
}

const TrailerModal = (props) => {
  const item = props.item
  const iframeRef = useRef(null)
  const onClose = () => iframeRef.current.setAttribute('src', '')

  return (
    <Modal active={false} id={`modal_${item.id}`}>
      <ModalContent onClose={onClose}>
        <iframe
          ref={iframeRef}
          width="100%"
          height="500px"
          title="trailer"
          style={{ border: 'none', borderRadius: '15px' }}
        ></iframe>
      </ModalContent>
    </Modal>
  )
}

export default HeroSlide
