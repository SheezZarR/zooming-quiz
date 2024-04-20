import React from "react"
import { createSmartappDebugger, createAssistant } from "@salutejs/client";
import { useSpatnavInitialization, useSection, useDefaultSectionFocus } from '@salutejs/spatial';
import  FuseIndex from "fuse.js"

import questions from "./consts";
import QuestionWindow from "./HomePage/QuestionWindow";
import Result from "./HomePage/Result";


const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI1MGE5NThmZi04ZjdlLTQxNTUtYmEwNy0yMjE0MzEzNGVmMDAiLCJzdWIiOiJjZGE2NDZlMDc5NDA3MjNkMDk1NDQ5ZjRiNjNjNDc1ZGMyNzBlZTExNmEwN2Q0ZWFjNGNlYzY2ZGRiMmZmYzlhNTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTcxMzYyOTQ1MCwiYXVkIjoiVlBTIiwidXNyIjoiOGM3ODAyMDgtYWEzMC00N2EwLWJlZWYtYTAzMzhiMjk3OWVhIiwiaWF0IjoxNzEzNTQzMDQwLCJzaWQiOiI4NmFkZWYzYS05NTEwLTRjYTgtYTc3ZC1iYmU0MTNmZmRjZmMifQ.Wm26q7KThqWQaqng3WYRH1AiJ97B7QliEQnL85dv-3yUyvUaWOtihA9xxjIoYGsBpWi0awm4HAiDK5c5s-KU3HkA1NK8cW9xtewkhujWn_PwMYwiHMWcMnWAId8mVaOletJuXXLAOuJ9qizSAJ2a8MihSB5b45fG6_ufXk8NMm4qI0mxs0NCvN_ejc_s7Sjnq4gSMOnHK3NrIp0WTeaqHY8HN34SMBaQrK5rx_bstruNOZj-4lqUQvARSk89qAJwrwEayUvuWU-EWpPGAhB7e-PeHgMELP5BqlxCopcV6bBMmz4t0uJOt6zqL9iTYrVJfGEV47j1NgwyAgQVsfggKjhu5JO18if3IGysFlBHn8BawZqFWdvECfxNsTIZWaJy2p0VNVEfuAQ9SoEVxOc7fXmmYcKhe1wSXDORuSfo8F-RbfJ1n3e1gsK8eWkGNHGBcjn-qcfD6viC20tdMD3DyYDahzcaLqGHX0RIHDdq-AfXTyCdukhp_It80KrDt4iob7_p_p5eIm0yzJVcg6ycLDheQ_rkmYPVsI7w6wojrdBmmLC-5Q2Ug2SumKcRvBj-vrkJ7qGJfb2vO_o5SX-Z8j9A-PiV5ufbdluRYzAHkEVGqapJelqpTUKXO54dA4L5ENP1BZdPitOxgh-B3J9bqdbPu45Dns0GjLlWZAd7dxo"

function initializeAssistant(getState){
  if (typeof window === 'undefined') {
      return;
  }

  if (process.env.NODE_ENV === "development"){
      return createSmartappDebugger({
          token: token,
          initPhrase: "Включи Квиз о Мире",
          getState,
      })
  }

  return createAssistant({ getState });
}


// https://infinum.com/blog/how-to-use-react-hooks-in-class-components/
export const AppWithNav = () => {
  useSpatnavInitialization();
    
  const [sectionProps] = useSection('Main');
  useDefaultSectionFocus('Main');

  return <App {...sectionProps}/>;
  
};


export class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        step: 0,
        clickedIndex: null,
        isCorrect: null,
        brandCorrect: 0,
        natureCorrect: 0,
        isClickable : false,
        showQuestions: false,
      };

      // Fuzzy searcher
      this.fuse = new FuseIndex([], {isCaseSensitive: false})


      this.assistant = initializeAssistant(() => this.getStateForAssistant())
      this.assistant.on("data", (payload) => {
        console.log(`assistant.on(data)`, payload.type, payload)
        
        switch(payload.type) {
          case "smart_app_data":
            this.handleSmartAppData(payload.action)
            break;

          default:
            break;
        }
        
      });
      this.assistant.on("start", (event) => {
          console.log(`assistant.on(start)`, event);
      });
    }
    
    startGame(){
      this.setState({
        showQuestions: true, 
        isClickable: true,
        step: 0,
        brandCorrect: 0,
        natureCorrect: 0,
        answerIdx: null,
        isCorrect: null,
    })
      this.assistant.sendData({action : {action_id : "quest1"}})
    }

    stepUpdate(step, clickedIndex, isCorrect) {
      if (step % 2 === 0) {
        this.setState({
          isCorrect: isCorrect,
          clickedIndex: clickedIndex,
          brandCorrect: this.state.brandCorrect + (isCorrect? 1 : 0),
          isClickable: false
        })
      } else {
        this.setState({
          isCorrect: isCorrect,
          clickedIndex: clickedIndex,
          natureCorrect: this.state.natureCorrect + (isCorrect? 1 : 0),
          isClickable: false
        })
      }
    }

    delayedNextQuestion(step, delay = 4000) {
      setTimeout(() => {
        this.setState({
          isClickable : true,
          answerIdx: null,
          isCorrect: null,
          step: step + 1
        });
        let question_state = "quest" + (step + 2).toString()
      
        this.assistant.sendData({action : {action_id : question_state}})
      }, delay);
    }

    guessAnswerIndex(str) {
      
      console.log("Calling fuse")
      this.fuse.setCollection([str])

      for (let i = 0; i < 4; i += 1){
        let result = this.fuse.search(questions[this.state.step].answers[i])
        
        if (result.length !== 0) {
          console.log("Fuse search result: ", i)
          return i
        }
        
      }

      return null
    }

    handleSmartAppData(action) {
      if (!action) return;

      console.log("handleSmartAppData", action)
      
      switch(action.type) {
        case "init":
          this.startGame()
          break;

        case "answer":
          const guessedIndex = this.guessAnswerIndex(action.text)
          this.stepUpdate(this.state.step, guessedIndex, action.values.isCorrect)
          this.delayedNextQuestion(this.state.step)
        break;

        default:

        break;
      }
    }

    getStateForAssistant() {
        console.log('getStateForAssistant: state:', this.state);
        
        return this.state;
    }

    dispatchAssistantData(data) {
      console.log('dispatchAssistantData', data)
      this.onClick(questions[this.state.step].correct, true)
    }

    sendDataToAssistant(data) {
      console.log("sendDataToAssistant", data);  
      this.assistant.sendData({action: {action_id : "start"}})
    }
    
    processClickAnswer(step, clickedIndex, isCorrect) {
      this.stepUpdate(step, clickedIndex, isCorrect)
     
      this.assistant.sendData(
        {action: {action_id: isCorrect? "correct" : "incorrect"}}
      )

      this.delayedNextQuestion(step)
    }
    
    onClickStartGameButton = (_) => { this.startGame()}
    onClickSkip = (_) => {
      this.setState({
        isClickable : true,
        answerIdx: null,
        isCorrect: null,
        step: this.state.step + 1
      });

      let next_question = "quest" + (this.state.step + 2).toString()
      this.assistant.sendData({action : {action_id : next_question}})
    }

    onClickRepeatQuestion = (_) => {
      let current_question = "quest" + (this.state.step + 1).toString()

      this.assistant.sendData({action : {action_id : current_question}})
    }

    onClick = (evt) => {
      const { step } = this.state;
      const question = questions[step];

      const index = parseInt(evt.target.id)
      const isCorrect = (question.correct === index)
      
      this.processClickAnswer(step, index, isCorrect)
      
    }

    render() {
      const { step, answerIdx, isCorrect, brandCorrect, natureCorrect, isClickable, showQuestions} = this.state;
      const question = questions[step];
      
      
      
      
      if (!showQuestions) {
          return (
          <div id={this.props.id} className={this.props.className}>
            <div className='container'>
              <div className='menu-text'>
                <h1>Викторина из различных вопросов</h1>
                <p>Tемы: 'Бренды' и 'Природа'</p>
              </div>
              
              <button
                className='sn-section-item button'
                onClick={this.onClickStartGameButton}
              >
              Начать!
              </button>
            </div> 
          </div>
      )
      }
  
      else if (step !== questions.length) {
        return (
          <div 
            id={this.props.id}
            className={this.props.className}
          >
            <QuestionWindow
              totalQuestions={questions.length}
              totalCorrect={0 || (this.state.brandCorrect + this.state.natureCorrect)}
              question={question}
              step={step}
              onClick={this.onClick}
              onClickRepeatQuestion={this.onClickRepeatQuestion}
              onClickSkip={this.onClickSkip}
              onClickStartGame={this.onClickStartGameButton}
              clickedIndex={this.state.clickedIndex}
              isCorrect={isCorrect}
              isClickable={isClickable}
            />
          </div>
        );
      } else {
        return (
          <div 
            id={this.props.id} 
            className={this.props.className}
          >
            <Result
              brandCorrect={brandCorrect}
              natureCorrect={natureCorrect}
              onClickStartGame={this.onClickStartGameButton}
            />
          </div>
        );
      }
    }
}

export default AppWithNav;
