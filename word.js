// npm modules & global variables
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾


const axios = require('axios')
const chalk = require('chalk')
const tries = 10


// export class 'Word'
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
class Word {
    constructor() {
        this.score = 0,
        this.word = '',
        this.display = [],
        this.guessed = [],
        this.history = [],
        this.tries = tries
    }
    getNew(callback){

        //  Internal functions
        //  ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
        const randInt = (min,max)=> {
            return Math.floor(Math.random() * (max - min)) + min
        }
        const buildSearchUrl = (n)=>{
            let url = 'http://api.datamuse.com/words?sp='
            let q = ''
            for (let i = 0; i < n; i++) {
                q += '?'
            }
            url += q + '&max500'
            return url
        }

        //  Variables
        //  ‾‾‾‾‾‾‾‾‾‾
        const min = 4, max = 16
        const wordLength = randInt(min,max)
        const url = buildSearchUrl(wordLength)

        //  Prepare variables
        //  ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
        this.word = ''
        this.display = []
        this.guessed = []
        this.tries = tries

        //  API Call
        //  ‾‾‾‾‾‾‾‾‾
        axios.get(url).then((res)=>{
            // pick a random word from the response list 'res'
            const x = res.data.length - 1
            const word = res.data[randInt(0,x)].word
            this.word = word
            const me = this
            if (callback) callback(me)
        }).catch((err)=>{
            // console.log('Word API Error: ' + err)
        })
    }
    prepDisplay(me,callback){
        me = me || this
        me.display = []
        for (let i = 0; i < me.word.length; i++) {
            if (me.word[i] === ' ' || me.word[i] === '-') {
                me.display.push(me.word[i])
            } else {
                me.display.push('_')
            }
        }
        if (callback) callback()
    }
    draw(me,callback){
        me = me || this
        console.log(chalk.inverse.bold("\r\n\t  L E T ' S   P L A Y   W O R D   G U E S S  "))
        console.log(chalk.inverse.bold('\t  ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾  '))
        console.log(chalk.white('\r\n\t  A word or phrase:    ' + me.display.join(' ') + '  \r\n'))
        if (callback) callback()
    }
    update(l,callback){
        l = l || ''
        l = l[0] || l
        this.prepDisplay()
        if (!this.guessed.includes(l)) {
            this.guessed.push(l)
            if (!this.word.includes(l)) this.tries--
        }
        for (let i in this.guessed) {
            for (let j in this.display) {
                if (this.word[j] === this.guessed[i]) {
                    this.display[j] = this.guessed[i]
                }
            }
        }
        if (callback) {
            const me = this
            callback(me)
        }
    }
    isSolved(){
        let tf = true
        for (let i in this.display) {
            if (this.display[i] === '_') {
                tf = false
                break
            }
        }
        return tf
    }
    isLost(){
        return this.tries <= 0
    }
}


// export call
// ‾‾‾‾‾‾‾‾‾‾‾‾
module.exports = Word