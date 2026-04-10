import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import tmdbApi from './../../api/tmdbApi'
import apiConfig from '../../api/apiConfig'

import './detail.scss'
import CastList from './CastList'
import VideoList from './VideoList'
import MovieList from './../../components/movie-list/MovieList'

const Detail = () => {
  const { category, id } = useParams()
  const [item, setItem] = useState(null)
  // Inside your Movie Detail / Watch page
  useEffect(() => {
    const checkSub = async () => {
      const { data } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('clerk_id', user.id)
        .single()

      if (data?.status === 'active') {
        setHasAccess(true)
      }
    }
    if (user) checkSub()
  }, [user])

  useEffect(() => {
    const getDetail = async () => {
      const response = await tmdbApi.detail(category, id, { params: {} })
      setItem(response)
      window.scrollTo(0, 0)
    }
    getDetail()
  }, [category, id])

  // vidsrc.cc for the main player
  const vidsrcUrl =
    category === 'movie'
      ? `https://vidsrc.cc/v2/embed/movie/${id}`
      : `https://vidsrc.cc/v2/embed/tv/${id}`

  return (
    <div className="detail-page-wrapper" style={{ backgroundColor: '#141414', color: '#fff' }}>
      {item && (
        <>
          {/* CINEMATIC BACKDROP */}
          <div
            className="banner"
            style={{
              backgroundImage: `url(${apiConfig.originalImage(
                item.backdrop_path || item.poster_path
              )})`,
            }}
          >
            <div className="banner__overlay"></div>
          </div>

          {/* CONTENT & TRAILER ASIDE SECTION */}
          <div className="movie-content container mb-3">
            <div className="movie-content__left">
              <div
                className="movie-content__poster__img"
                style={{
                  backgroundImage: `url(${apiConfig.originalImage(
                    item.poster_path || item.backdrop_path
                  )})`,
                }}
              ></div>
            </div>

            <div className="movie-content__info">
              <h1 className="title">{item.title || item.name}</h1>
              <div className="genres">
                {item.genres &&
                  item.genres.slice(0, 5).map((genre, index) => (
                    <span key={index} className="genres__item">
                      {genre.name}
                    </span>
                  ))}
              </div>
              <p className="overview">{item.overview}</p>

              <div className="cast">
                <div className="section__header">
                  <h2>Casts</h2>
                </div>
                <CastList id={item.id} />
              </div>
            </div>

            <div className="movie-content__trailer-aside">
              <div className="section__header mb-1">
                <h2 className="small-title">Trailer Preview</h2>
              </div>
              <VideoList id={item.id} limit={1} />
            </div>
          </div>

          {/* 3. MAIN CINEMA PLAYER */}
          <div className="container mt-5">
            <div className="section__header mb-3">
              <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Streaming Now</h2>
              <p style={{ color: '#aaa' }}>Experience {item.title || item.name} in Full HD</p>
            </div>
            <div
              className="player-wrapper"
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.9)',
                background: '#000',
                aspectRatio: '16/9',
              }}
            >
              <iframe
                src={vidsrcUrl}
                title="LumiHive Player"
                allowFullScreen
                sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-popups-to-escape-sandbox"
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
          {/* RATING SECTION - NETFLIX STYLE */}
          <div className="container" style={{ padding: '50px' }}>
            <div
              className="section__header mb-3"
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <div style={{ width: '4px', height: '24px', backgroundColor: '#e50914' }}></div>
              <h2
                style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Rating
              </h2>
            </div>

            <div
              className="rating-card"
              style={{
                background: 'linear-gradient(135deg, rgba(45,45,45,1) 0%, rgba(20,20,20,1) 100%)',
                padding: '2.5rem',
                borderRadius: '4px', // Netflix uses sharper corners for a premium feel
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: '1px solid #333',
                borderTop: '1px solid #333',
                boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Aesthetic Background "Glow" */}
              <div
                style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '150px',
                  height: '150px',
                  background: 'rgba(229, 9, 20, 0.15)',
                  filter: 'blur(50px)',
                  borderRadius: '50%',
                }}
              ></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '4rem',
                      fontWeight: '900',
                      color: '#fff',
                      lineHeight: '1',
                      textShadow: '2px 2px 10px rgba(0,0,0,0.5)',
                    }}
                  >
                    {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
                    <span style={{ fontSize: '1.5rem', color: '#e50914', marginLeft: '2px' }}>
                      /10
                    </span>
                  </div>
                  <div
                    style={{
                      color: '#aaa',
                      fontSize: '0.8rem',
                      letterSpacing: '3px',
                      marginTop: '5px',
                      fontWeight: '600',
                    }}
                  >
                    TMDB USER SCORE
                  </div>
                </div>

                <div
                  style={{
                    height: '80px',
                    width: '1px',
                    background: 'linear-gradient(to bottom, transparent, #444, transparent)',
                  }}
                ></div>

                <div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                    {[...Array(5)].map((_, i) => {
                      const rating = item.vote_average / 2
                      return (
                        <span
                          key={i}
                          style={{
                            fontSize: '1.8rem',
                            color: i < Math.floor(rating) ? '#e50914' : '#444',
                            filter:
                              i < Math.floor(rating)
                                ? 'drop-shadow(0 0 5px rgba(229, 9, 20, 0.5))'
                                : 'none',
                          }}
                        >
                          ★
                        </span>
                      )
                    })}
                  </div>
                  <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: '400' }}>
                    Based on{' '}
                    <span style={{ fontWeight: '700', color: '#fff' }}>
                      {item.vote_count ? item.vote_count.toLocaleString() : '0'}
                    </span>{' '}
                    verified reviews
                  </div>
                </div>
              </div>

              {/* Netflix-style "Popularity" Tag */}
              <div
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '2px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  textTransform: 'uppercase',
                }}
              >
                {item.popularity > 500 ? 'Trending Now' : 'Must Watch'}
              </div>
            </div>
          </div>
          {/* 5. RECOMMENDATIONS */}
          <div className="container" style={{ padding: '50px', marginBottom: '50px' }}>
            <div className="section__header mb-3">
              <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>More Like This</h2>
            </div>
            <MovieList category={category} type="similar" id={item.id} />
          </div>
        </>
      )}
    </div>
  )
}

export default Detail
