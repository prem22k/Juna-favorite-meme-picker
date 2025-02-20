import { useState, useMemo } from 'react'
import { X } from 'lucide-react'
import { catsData } from './data'

// Add error boundary component
function ErrorFallback() {
  return (
    <div role="alert" className="text-center p-4">
      <h2>Oops! Something went wrong.</h2>
      <button 
        onClick={() => window.location.reload()}
        className="get-image-btn mt-4"
      >
        Try again
      </button>
    </div>
  )
}

function App() {
  // Add error state
  const [hasError, setHasError] = useState(false)

  // Add error handler
  if (hasError) return <ErrorFallback />

  try {
    const [showModal, setShowModal] = useState(false)
    const [selectedEmotion, setSelectedEmotion] = useState('')
    const [gifsOnly, setGifsOnly] = useState(false)
    const [selectedCat, setSelectedCat] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // Get unique emotions from catsData
    const emotions = useMemo(() => {
      const emotionsArray = []    
      for (let cat of catsData) {
        for (let emotion of cat.emotionTags) {
          if (!emotionsArray.includes(emotion)) {
            emotionsArray.push(emotion)
          }
        }
      }
      return emotionsArray
    }, [])

    // Get matching cats based on selected emotion and GIF preference
    const getMatchingCats = () => {
      if (!selectedEmotion) return []
      
      return catsData.filter(cat => {
        if (gifsOnly) {
          return cat.emotionTags.includes(selectedEmotion) && cat.isGif
        }
        return cat.emotionTags.includes(selectedEmotion)
      })
    }

    // Get a random cat from matching cats
    const getRandomCat = () => {
      const matchingCats = getMatchingCats()
      if (matchingCats.length === 0) return null
      if (matchingCats.length === 1) return matchingCats[0]
      
      const randomIndex = Math.floor(Math.random() * matchingCats.length)
      return matchingCats[randomIndex]
    }

    // Handle get image button click
    const handleGetImage = async () => {
      setIsLoading(true)
      const cat = getRandomCat()
      if (cat) {
        setSelectedCat(cat)
        setShowModal(true)
      }
      setIsLoading(false)
    }

    return (
      <div>
        <header>
          <div className="header-inner">
            <img 
              src="/images/june.png" 
              alt="June" 
              className="june-img"
            />
            <div>
              <h2>Jumpin' June's...</h2>
              <h1>Meme Picker</h1>
            </div>
          </div>
        </header>

        <main>
          <h3>Select Your Current Emotion</h3>
          
          <div className="controls-container">
            <div className="emotion-radios">
              {emotions.map(emotion => (
                <div 
                  key={emotion}
                  className={`radio ${selectedEmotion === emotion ? 'highlight' : ''}`}
                >
                  <label htmlFor={emotion}>
                    <input
                      type="radio"
                      id={emotion}
                      value={emotion}
                      name="emotions"
                      checked={selectedEmotion === emotion}
                      onChange={(e) => setSelectedEmotion(e.target.value)}
                    />
                    {emotion}
                  </label>
                </div>
              ))}
            </div>

            <div className="gifs-check">
              <label 
                htmlFor="gifs-only-option"
                className="gifs-check-label"
              >
                Animated GIFs only
              </label>
              <input
                type="checkbox"
                id="gifs-only-option"
                checked={gifsOnly}
                onChange={(e) => setGifsOnly(e.target.checked)}
              />
            </div>

            <button
              className="get-image-btn"
              onClick={handleGetImage}
              disabled={!selectedEmotion || isLoading}
            >
              {isLoading ? 'Loading...' : 'Get Image'}
            </button>
          </div>
        </main>

        {showModal && selectedCat && (
          <div 
            className="meme-modal"
            style={{ display: 'flex' }}
          >
            <button
              className="meme-modal-close-btn"
              onClick={() => setShowModal(false)}
            >
              X
            </button>
            <img 
              src={`/images/${selectedCat.image}`}
              alt={selectedCat.alt}
              className="cat-img"
            />
          </div>
        )}
      </div>
    )
  } catch (error) {
    setHasError(true)
    return <ErrorFallback />
  }
}

export default App
