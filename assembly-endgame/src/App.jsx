import { languages } from "./languages"
import { useState } from "react"
import { clsx } from "clsx"
import { getFarewellText, getRandomWord } from "./utils"
import Confetti from "react-confetti"

export default function AssemblyEndgame() {
  
  // State values 
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState([])
  
  // Derived values
  const attemptsLeft = languages.length - 1
  const wrongGuessesCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const victory = currentWord.split("").every(letter => guessedLetters.includes(letter))
  const defeat = wrongGuessesCount >= attemptsLeft
  const gameOver = victory || defeat
  const lastGuess = guessedLetters[guessedLetters.length - 1]
  const isLastGuessWrong = lastGuess && !currentWord.includes(lastGuess)

  // Static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  function addGuessedLetters(letter) {
    setGuessedLetters(prevLetters => 
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    )
  }

  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  const languageElements = languages.map((lang, index) => {
    const isLost = index < wrongGuessesCount
    const style = {
      backgroundColor: lang.backgroundColor,
      color: lang.color
    }
    return (
      <span
        className={`chip ${isLost ? "lost" : ""}`}
        style={style}
        key={lang.name}
      >
        {lang.name}
      </span>
    )
  })

  const letterelements = currentWord.split("").map((letter, index) => {
    const revealLetter = defeat || guessedLetters.includes(letter)
    const letterClassName = clsx(
      defeat && !guessedLetters.includes(letter) && "missed-letter"
    )

    return (
      <span key={index} className={letterClassName}>
        {revealLetter ? letter.toLocaleUpperCase() : ""}
      </span>
  )
})

  const keyboardElements = alphabet.split("").map(letter => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })

    return (
      <button
        className={className}
        key={letter}
        onClick={() => addGuessedLetters(letter)}
        disabled={gameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter}`}
      >
        {letter.toLocaleUpperCase()}
      </button>
    )
  })

  const gameStatusClass = clsx("game-status", {
    won: victory,
    lost: defeat,
    farewell: !gameOver && isLastGuessWrong
  })

  function renderGameStatus() {
    if(!gameOver && isLastGuessWrong) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessesCount - 1].name)}
        </p>
      )
    }
    
    if (victory) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      )
    }
    if (defeat) {
      return (
        <>
          <h2>You lose!</h2>
          <p>Better start learning Assembly 😭</p>
        </>
      )
    }
  }

  return (
    <main>
      {victory && <Confetti recycle={false} numberOfPieces={1000}/>}

      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>

      <section aria-live="polite" role="status" className={gameStatusClass}>
        {renderGameStatus()}
      </section>
      
      <section className="language-chips">
        {languageElements}
      </section>
      
      <section className="word">
        {letterelements}
      </section>

      {/* Combined visually-hidden aria-live region for status updates */}
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuess) ? 
              `Correct! The letter ${lastGuess} is in the word.` : 
              `Sorry, the letter ${lastGuess} is not in the word.`
          }
          You have {attemptsLeft} attempts left.
        </p>
        <p>
          Current word: {currentWord.split("").map(letter =>
          guessedLetters.includes(letter) ? letter + "." : "blank.").join(" ")}
        </p>
      </section>
      
      <section className="keyboard">
        {keyboardElements}
      </section>
      
      {gameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
    </main>
  )
}