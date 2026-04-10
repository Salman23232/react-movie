import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import tmdbApi from '../../api/tmdbApi'

const VideoList = (props) => {
  const { category } = useParams()
  const [video, setVideo] = useState(null)

  useEffect(() => {
    const getVideos = async () => {
      const response = await tmdbApi.getVideos(category, props.id)

      // Filter for the official Trailer
      const trailer = response.results.find((item) => item.type === 'Trailer')

      // Fallback: If no "Trailer" type exists, take the first available video
      setVideo(trailer || response.results[0])
    }
    getVideos()
  }, [category, props.id])

  return <>{video && <Video item={video} />}</>
}

const Video = (props) => {
  const item = props.item
  const iframeRef = useRef(null)

  useEffect(() => {
    const height = (iframeRef.current.offsetWidth * 9) / 16 + 'px'
    iframeRef.current.setAttribute('height', height)
  }, [])

  return (
    <div className="video">
      {/* We keep the title but usually in an aside it's hidden via SCSS */}
      <div className="video__title">
        <h2>{item.name}</h2>
      </div>
      <iframe
        src={`https://www.youtube.com/embed/${item.key}`}
        ref={iframeRef}
        width="100%"
        title="video"
        allowFullScreen
      ></iframe>
    </div>
  )
}

export default VideoList
