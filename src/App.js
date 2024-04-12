import React from "react"
import { createSmartappDebugger, createAssistant } from "@salutejs/client";


import questions from "./consts";
import QuestionWindow from "./HomePage/QuestionWindow";
import Result from "./HomePage/Result";


const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI5MmViZDBhNy0xY2JiLTQxMjMtOTM5ZC1kNDUwZTUyZGFhMDYiLCJzdWIiOiJjZGE2NDZlMDc5NDA3MjNkMDk1NDQ5ZjRiNjNjNDc1ZGMyNzBlZTExNmEwN2Q0ZWFjNGNlYzY2ZGRiMmZmYzlhNTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTcxMjk1NzI5OSwiYXVkIjoiVlBTIiwidXNyIjoiOGM3ODAyMDgtYWEzMC00N2EwLWJlZWYtYTAzMzhiMjk3OWVhIiwiaWF0IjoxNzEyODcwODg5LCJzaWQiOiI0OTI5NjljNC1iY2FmLTRhMjAtOTdmYy0wYTJhMzA1NzMyNGYifQ.kCNonkjOxr4dzG7u1ZBvWC6XyCudaJgZMyO8wZspq1QgIXYvi83R5KY_El_CKmmbyODcEAbL91lNZ3drp0yOFjcs7tz72ggBWZU8LJm7z3LavizHciG_mj1IRtFHPcOt9kCgvQj6UGR87VEWc03x5J3nB1lUeorirD7QqBkZ2khpDRGr2ewWIXOb1yE4IUVNTj8SND0CuaD8y6-_jtiOzNGSLwz5BxJAftVozREwK_Bqp_XatRDocJIyXeyYZdrpVHBQsM7su37L8tN2McVGZB_mUGEsF3YdNy5diABXYkhywj6Vla5jz01aUxlNfanyuUEv2h-KNTONJm9Vue62br3rOl0rGSgROR_nzUpnwZrptfljnqwINPgcE-UaIx-Tk2q_2_bm9SUX2BlBMuywpg8GTvMkuutGJcKQbcl248TU-7sqIbemheXBzDq5NNbLy02CzimZHp3OU3kWsT_sPPp5Vn9ElZ5iO2aBO4CPpXdUX4o_WRYATXZkV2PT6DB5A8xJGPcwcnKv59cm8PHNb0Tbv8m6Mm6J3pw_EsPqEdQYW_wyDYjmX0qbqhT78fKt90TCUL-RptzabH6QRBAXcbHX7CRa5XfNdd4df2OpmQNBFclDlvSQIWykquqhHNO5otVs93pa6nrG97A2Shp5fuc97jOJAHCz_PNAz8D-v4I"

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



class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        step: 0,
        answerIdx: null,
        isCorrect: null,
        brandCorrect: 0,
        natureCorrect: 0,
        isClickable : false,
        showQuestions: false,
      };

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

    stepUpdate(step, isCorrect) {
      if (step % 2 === 0) {
        this.setState({
          isCorrect: isCorrect,
          brandCorrect: this.state.brandCorrect + (isCorrect? 1 : 0),
          isClickable: false
        })
      } else {
        this.setState({
          isCorrect: isCorrect,
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

    handleSmartAppData(action) {
      if (!action) return;

      console.log("handleSmartAppData", action)
      
      switch(action.type) {
        case "init":
          this.startGame()
          break;

        case "answer":
          this.stepUpdate(this.state.step, action.values.isCorrect)
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
    
    processClickAnswer(step, isCorrect) {
      this.stepUpdate(step, isCorrect)
     
      this.assistant.sendData(
        {action: {action_id: isCorrect? "correct" : "incorrect"}}
      )

      this.delayedNextQuestion(step)
    }
    
    skipQuestion() {
      this.setState({
          isClickable : true,
          answerIdx: null,
          isCorrect: null,
          step: this.state.step + 1
        });

    //this.assistant.sendData({action : {action_id: "interrupt"}})

        let question_state = "quest" + (this.state.step + 2).toString()
        this.assistant.sendData({action : {action_id : question_state}})
    }

    onClickStartGameButton = (_) => { this.startGame()}
    onClickSkip = (_) => {this.skipQuestion()}

    onClick = (evt) => {
      const { step } = this.state;
      const question = questions[step];

      const index = parseInt(evt.target.id)
      const isCorrect = (question.correct === index)
      
      this.processClickAnswer(step, isCorrect)
      
    }

    render() {
      const { step, answerIdx, isCorrect, brandCorrect, natureCorrect, isClickable, showQuestions} = this.state;
      const question = questions[step];

      if (!showQuestions) {
          return (
        <div className='container'>
          <div className='menu-text'>
            <h1>Викторина из различных вопросов</h1>
            <p>Tемы: 'Бренды' и 'Природа'</p>
          </div>
          
          <button
            className='start-button'
            onClick={this.onClickStartGameButton}
          >
          Начать!
          </button>
        </div> 
      )
      }
  
      else if (step !== questions.length) {
        return (
          <QuestionWindow
            totalQuestions={questions.length}
            totalCorrect={0 || (this.state.brandCorrect + this.state.natureCorrect)}
            question={question}
            step={step}
            onClick={this.onClick}
            onClickSkip={this.onClickSkip}
            answerIdx={answerIdx}
            isCorrect={isCorrect}
            isClickable={isClickable}
          />
        );
      } else {
        return (
          <Result
            brandCorrect={brandCorrect}
            natureCorrect={natureCorrect}
            onClickStartGame={this.onClickStartGameButton}
          />
        );
      }
    }
  }
  
  export default App;
