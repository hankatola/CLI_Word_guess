

//  npm modules
const inquire = require('inquirer')
const Word = require('./word.js')
const chalk = require('chalk')


/*
    Function Farm
    ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
*/
const input = (word)=>{
    console.log('\033[2J') // clear screen
    word.draw()
    console.log(chalk.white.dim(`\t  Tries remaining: ${word.tries}  Already guessed:${word.guessed.join(' ')}\n`))
    inquire.prompt([
        {
            type: 'input',
            message: "\t  Guess a letter ('quit' to quit): ",
            name: 'str',
        }
    ]).then((res)=>{
        // console.log(res.str)
        if (res.str.toLowerCase() === 'quit') return quit('quit')
        word.update(res.str)
        if (word.isLost()) return quit('lost')
        if (word.isSolved()) return won(word)
        input(word)
    })
}
const quit = (message)=>{
    console.log(`\n\t  Oh no! You ${message}! The word was '${word.word}' and you won ${word.history.length} time(s)\n\n`)

}
const won = ()=>{
    console.log('\033[2J') // clear screen
    word.history.push((word.word))
    word.draw()
    console.log(`\t  You won! You've solved ${word.history.length} word(s)!\n`)
    inquire.prompt([
        {
            type: 'confirm',
            message: '\t  Would you like to play again?: ',
            name: 'again',
            default: true
        }
    ]).then((res)=>{
        if (res.again) {
            word.word = ''
            return main(word)
        } else {
            return console.log('\n\t  Goodbye!\n')
        }
    })
}
const main = (word)=>{
    console.log('\033[2J') // clear screen
    // if word.word is null, get new word.word from API & call main when done
    try {
        if (!word.word) {
            return word.getNew(main)
        }
    } catch (e) {
        console.log()
    }
    word.update()
    input(word)
}


/*
    Program body
    ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
*/

const word = new Word()
main(word)
