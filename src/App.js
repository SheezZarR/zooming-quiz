import React from "react"
import { createSmartappDebugger, createAssistant } from "@salutejs/client";
import { useSpatnavInitialization, useSection, useDefaultSectionFocus } from '@salutejs/spatial';
import  FuseIndex from "fuse.js"

import questions from "./consts";
import QuestionWindow from "./HomePage/QuestionWindow";
import Result from "./HomePage/Result";


const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIyMTExMjFlNS1hYjg4LTQ2NjktOTRkMS0zYTI5NzVlZGE4ZjMiLCJzdWIiOiJjZGE2NDZlMDc5NDA3MjNkMDk1NDQ5ZjRiNjNjNDc1ZGMyNzBlZTExNmEwN2Q0ZWFjNGNlYzY2ZGRiMmZmYzlhNTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTcxMzk0NTU5NywiYXVkIjoiVlBTIiwidXNyIjoiOGM3ODAyMDgtYWEzMC00N2EwLWJlZWYtYTAzMzhiMjk3OWVhIiwiaWF0IjoxNzEzODU5MTg3LCJzaWQiOiJjZTRiNjQ0YS1kYTMzLTQ4MDQtYjgyYS1iM2EwODZmOThkZDcifQ.fkz8KcGyu1lKhoxsJE6LW7-2QxfMU2fmj7x2FEgkZ0ICzR2QLA5lk3BfCiaUxH_J667XaGnpVMsxzXSPRDE1N6Whaf0zf5cX0UcHDkj-K8t_PDD6FSvehebgyIWyNyfLKG8pcwcGp_w-Ta78wnH5NR7y93DzEcIpsheRty3C-pnDXJiY4gOCE7LSlsvUOP6-EIAB-D8PMwX-Z1QPPKEU_RvCFmgTwENqEge9upIUxRgHNr4l6dKmfJPoBVHdu4RamfwNROciVetxQ-5D0quHolDg9cypFRISJlXOeulNyr7exlqYRbpXmK7oRq3LMvZkeAKogeRcviJ1sJAJ_d5uXQv2heHpWXr9V63OwZ3Cyvo0BYsU6cH67YboBgfnNitWze0DmIv2wdVb5r0mOFGySpuWaPzCylFgb7n2vN7v3hkwRQj7JnyYyLxweMxhoGhi8fQS9MwKqmKRicAkuZRsA3p-EuU13Ha5dvpGe-_-V3JhUMYkbVMnZdswi4_Pk1RWAG-bwaGTOoPWb2y-rfTShuLz_3Fem9OMl6wAeYJDRicI_o25F-qQ4bIouFtIs_cFp-3D8KXcOTOE6ebEiRm-NbOApxW3MazhJQbgI1Qc8h0idCC9iP8S2HCnWtb4B4fSjW_2BBhndsJRkUfYEPlOjY3-6g3kK9O9iKUMQ2Tta14"

function initializeAssistant(getState){
  if (typeof window === 'undefined') {
      return;
  }

  if (process.env.NODE_ENV === "development"){
      return createSmartappDebugger({
          token: token,
          initPhrase: "Включи Квиз: Бренды и Природа",
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
      this.fuse = new FuseIndex(
        [], 
        {
          isCaseSensitive: false,
          includeScore: true
        }
      )


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

      var output = {
        score: 1,
        ind: null,
      }

      for (let i = 0; i < 4; i += 1){
        let result = this.fuse.search(questions[this.state.step].answers[i])
        
        console.log("Fuse result: ", i, result, output)
        if (
          result.length > 0 &&
          result[0].score < output.score
        ) {
          output.score = result[0].score
          output.ind = i
          console.log("Fuse output update: ", output.ind)
        }
      }

      return output.ind
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
    
    onClickStartGameButton = (_) => { 
      this.assistant.cancelTts()
      this.startGame()
    }

    onClickSkip = (_) => {
      this.assistant.cancelTts()
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
      this.assistant.cancelTts()
      let current_question = "quest" + (this.state.step + 1).toString()

      this.assistant.sendData({action : {action_id : current_question}})
    }

    onClick = (evt) => {
      this.assistant.cancelTts()
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
                tabIndex={-1}
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
